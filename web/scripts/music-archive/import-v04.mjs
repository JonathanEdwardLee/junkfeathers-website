import { createHash } from 'node:crypto';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

export const COMPILER_VERSION = '4.0.0-beta.1';
export const SCHEMA_VERSION = 'music-archive-v04.0';
export const EXPECTED_SHA256 = '1713BE9ED735A5F6273FAD98FDBC0610364F97EF1976084F6862FD8B7D246447';
export const EXPECTED_SHEETS = [
  'Overview', 'Releases', 'Recordings', 'Contributors', 'Credits', 'Links', 'Sources',
  'Timeline', 'Unresolved', 'Projects', 'Project Memberships', 'Compositions',
  'Project Repertoire', 'Performance Sources', 'Web Archive Evidence', 'Name Variants',
  'Events', 'Event Participants', 'Search Facets', 'Lineup Eras', 'Biography Timeline',
  'Song Index', 'Website v01 Contract', 'Website v02 Contract', 'Contributor Ranking',
  'Song Contributions', 'Song Links', 'Archive Card Credits', 'Website v03 Contract',
  'Player Channels', 'Lyrics', 'v03.1 Audit', 'v03.2 Audit', 'Bandcamp Embed Registry',
  'v04 Coverage Audit',
];

const PUBLIC_KNOWN_SONGS = 215;
const MENU_PROJECT_IDS = ['PRJ-SOLO-001', 'PRJ-BAND-001', 'PRJ-BAND-002', 'PRJ-BAND-003', 'PRJ-BAND-004', 'PRJ-BAND-005'];
const MEDIA_ORDER = ['Bandcamp', 'YouTube', 'Spotify', 'Apple Music', 'Amazon Music', 'Audius', 'DistroKid', 'SoundCloud'];
const PLAYER_IDS = Array.from({ length: 412 }, (_, index) => index + 1)
  .filter((number) => ![10, 11, 17].includes(number))
  .map((number) => `PCH-${String(number).padStart(4, '0')}`);

function fail(message) { throw new Error(`ARCHIVE_V04_VALIDATION_FAILED: ${message}`); }
function text(value) { return value === undefined || value === null ? '' : String(value).trim(); }
function nullable(value) { const result = text(value); return result || null; }
function strings(value) { return text(value).split(';').map((part) => part.trim()).filter(Boolean); }
function unique(values) { return [...new Set(values.filter(Boolean))]; }
function normalizeDate(value) {
  const result = text(value);
  if (!result) return null;
  return result.match(/^(\d{4}-\d{2}-\d{2})(?:[ T]00:00:00)?$/)?.[1] ?? result;
}
function normalizeYear(value, date) {
  const result = text(value);
  if (/^\d{4}$/.test(result)) return result;
  return text(date).match(/^\d{4}/)?.[0] ?? null;
}
function parseMetadata(value) {
  try { const parsed = JSON.parse(text(value)); return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {}; }
  catch { return {}; }
}
function contextValues(value) {
  const result = text(value);
  const fallback = result.startsWith('=') ? result.match(/,"([^"]*)"\)$/)?.[1] ?? '' : result;
  return strings(fallback).filter((context) => context !== 'Solo');
}
function rowsFrom(source, sheetName) {
  const raw = source.sheets?.[sheetName];
  if (!Array.isArray(raw) || !Array.isArray(raw[0])) fail(`missing or malformed ${sheetName} sheet`);
  const headers = raw[0].map(text);
  return raw.slice(1).filter((row) => Array.isArray(row) && row.some((cell) => text(cell))).map((row) =>
    Object.fromEntries(headers.map((header, index) => [header, row[index]])));
}
function ids(rows, field, sheet) {
  const values = rows.map((row) => text(row[field]));
  if (values.some((id) => !id)) fail(`${sheet} has a blank ${field}`);
  if (new Set(values).size !== values.length) fail(`${sheet} has duplicate ${field} values`);
  return values;
}
function publicUrl(value, context) {
  if (!text(value)) return;
  try { const parsed = new URL(text(value)); if (!['http:', 'https:'].includes(parsed.protocol)) fail(`${context} URL protocol`); }
  catch { fail(`${context} has a malformed URL`); }
}

function bandcampEmbedUrl(value, context) {
  let parsed;
  try { parsed = new URL(text(value)); }
  catch { fail(`${context} has a malformed Bandcamp iframe source`); }
  if (parsed.protocol !== 'https:' || parsed.hostname !== 'bandcamp.com' || !parsed.pathname.startsWith('/EmbeddedPlayer/')) {
    fail(`${context} Bandcamp iframe source is outside the authorized origin/path`);
  }
  if (/[?&]autoplay=1\b/i.test(parsed.href)) fail(`${context} Bandcamp iframe source enables autoplay`);
  return parsed.href;
}

function supportedSameVersionEmbed(link) {
  if (!link?.embedUrl || link.platform !== 'Spotify') return null;
  try {
    const parsed = new URL(link.embedUrl);
    return parsed.protocol === 'https:' && parsed.hostname === 'open.spotify.com' && parsed.pathname.startsWith('/embed/') && !/[?&]autoplay=1\b/i.test(parsed.href)
      ? parsed.href
      : null;
  } catch { return null; }
}

function lyricStateOf(row) {
  const eligibleRaw = text(row['Public Eligible?']);
  const evidence = text(row['Evidence Classification']);
  const sourceType = text(row['Source Type']);
  const body = text(row['Lyric Text']);
  const pending = /pending/i.test(eligibleRaw);
  const conflict = /conflict/i.test(evidence) || /conflict/i.test(sourceType) || /LYRIC STATUS CONFLICT/i.test(body);
  const instrumental = /NO LYRICS|INSTRUMENTAL|NOT APPLICABLE/i.test(evidence) || /^\[NO LYRICS/i.test(body);
  const cover = /NOT REPRODUCED|TEXT NOT TRANSCRIBED|EXTERNAL LYRICS/i.test(evidence) || /COVER/i.test(sourceType) && /NOT REPRODUCED|TEXT NOT TRANSCRIBED/i.test(evidence);
  const publicEligible = ['yes', 'true'].includes(eligibleRaw.toLowerCase());
  if (pending && conflict) return 'conflicted';
  if (pending) return 'pending';
  if (conflict) return 'conflicted';
  if (instrumental) return 'instrumental';
  if (cover) return 'cover';
  if (publicEligible && body && !/^\[(?:NO LYRICS|LYRIC STATUS|EXTERNAL)/i.test(body)) return 'public';
  if (publicEligible) return 'unavailable';
  return 'unavailable';
}

function destinationKind(linkLevel) {
  const level = text(linkLevel).toLowerCase();
  if (level.includes('smart-link') || level.includes('smart link') || level.includes('hyperfollow')) return 'smart-link';
  if (level.includes('release page') || level.includes('release fallback') || level.includes('catalog fallback')) return 'release-page';
  if (level.includes('direct') || level.includes('exact') || level.includes('playable')) return 'exact';
  return 'release-page';
}

function destinationLabel(platform, kind) {
  if (kind === 'smart-link') return 'SMART LINK';
  if (kind === 'release-page') return 'RELEASE PAGE';
  return `${text(platform).toUpperCase() || 'SOURCE'} / EXACT TRACK`;
}

function validate(source, hash) {
  if (hash !== EXPECTED_SHA256) fail(`source SHA-256 ${hash} does not match the authorized v04 handoff`);
  if (!text(source.source_title).includes('MUSIC ARCHIVE V04')) fail('source title mismatch');
  if (text(source.handoff_state) !== 'V04 WEBSITE COUNCIL HANDOFF READY') fail('handoff state mismatch');
  const sheetNames = Object.keys(source.sheets ?? {});
  if (sheetNames.length !== EXPECTED_SHEETS.length || sheetNames.some((name, index) => name !== EXPECTED_SHEETS[index])) fail('35-sheet v04 contract mismatch');
  const wanted = ['Releases', 'Recordings', 'Contributors', 'Projects', 'Links', 'Name Variants', 'Song Index', 'Song Links', 'Archive Card Credits', 'Lyrics', 'Player Channels', 'Song Contributions', 'Project Memberships', 'Bandcamp Embed Registry', 'v04 Coverage Audit'];
  const rows = Object.fromEntries(wanted.map((name) => [name, rowsFrom(source, name)]));
  if (rows.Releases.length !== 59 || rows.Recordings.length !== 333 || rows.Projects.length !== 7 || rows['Song Index'].length !== 220 || rows['Archive Card Credits'].length !== 220 || rows['Song Links'].length !== 641 || rows.Lyrics.length !== 147 || rows['Player Channels'].length !== 409 || rows['Bandcamp Embed Registry'].length !== 139 || rows['v04 Coverage Audit'].length !== 220) fail('v04 concrete row count mismatch');
  const songIds = ids(rows['Song Index'], 'Song ID', 'Song Index');
  ids(rows.Releases, 'Release ID', 'Releases');
  ids(rows.Recordings, 'Recording ID', 'Recordings');
  ids(rows.Projects, 'Project ID', 'Projects');
  const linkIds = ids(rows['Song Links'], 'Song Link ID', 'Song Links');
  ids(rows['Archive Card Credits'], 'Song ID', 'Archive Card Credits');
  ids(rows.Lyrics, 'Lyric ID', 'Lyrics');
  const playerIds = ids(rows['Player Channels'], 'Player Channel ID', 'Player Channels');
  const registryIds = ids(rows['Bandcamp Embed Registry'], 'Registry ID', 'Bandcamp Embed Registry');
  const expectedLinks = Array.from({ length: 641 }, (_, index) => `SLNK-${String(index + 1).padStart(4, '0')}`);
  if (linkIds.some((id, index) => id !== expectedLinks[index])) fail('Song Link IDs are not SLNK-0001 through SLNK-0641');
  if (playerIds.some((id, index) => id !== PLAYER_IDS[index])) fail('409 concrete Player Channel IDs/order changed');
  const expectedRegistryIds = Array.from({ length: 139 }, (_, index) => `BCEMB-${String(index + 1).padStart(4, '0')}`);
  if (registryIds.some((id, index) => id !== expectedRegistryIds[index])) fail('Bandcamp registry IDs/order changed');
  if (!songIds.includes('SONG-0001') || !songIds.includes('SONG-0223') || songIds.includes('SONG-0183')) fail('Love canonical identity correction mismatch');
  const channelTypes = rows['Player Channels'].reduce((counts, row) => {
    const type = text(row['Player Type']);
    if (!['VHS', 'CASSETTE'].includes(type)) fail(`${row['Player Channel ID']} player type mismatch`);
    counts[type] = (counts[type] ?? 0) + 1;
    const external = text(row['External Link']);
    if (external) publicUrl(external, row['Player Channel ID']);
    return counts;
  }, {});
  if (channelTypes.CASSETTE !== 263 || channelTypes.VHS !== 146) fail('v04 cassette/VHS totals mismatch');

  const registryTypes = rows['Bandcamp Embed Registry'].reduce((counts, row) => {
    const type = text(row['Embed Type']);
    counts[type] = (counts[type] ?? 0) + 1;
    bandcampEmbedUrl(row['Official Bandcamp iframe src'], text(row['Registry ID']));
    if (!['TRACK', 'ALBUM'].includes(type)) fail(`${row['Registry ID']} embed type mismatch`);
    return counts;
  }, {});
  if (registryTypes.TRACK !== 124 || registryTypes.ALBUM !== 15) fail('Bandcamp registry TRACK/ALBUM totals mismatch');

  const priority = rows['v04 Coverage Audit'].reduce((counts, row) => {
    const value = text(row['Research Priority']);
    counts[value] = (counts[value] ?? 0) + 1;
    return counts;
  }, {});
  if ((priority['P0 MEDIA'] ?? 0) !== 0 || priority['P1 LYRICS'] !== 80 || priority['P2 CREDITS + METADATA'] !== 140) fail('v04 priority totals mismatch');

  const love = rows['Player Channels'].find((row) => text(row['Player Channel ID']) === 'PCH-0026');
  const loveListen = rows['Player Channels'].find((row) => text(row['Player Channel ID']) === 'PCH-0181');
  const loveLyric = rows.Lyrics.find((row) => text(row['Lyric ID']) === 'LYR-0001');
  const loveSong = rows['Song Index'].find((row) => text(row['Song ID']) === 'SONG-0223');
  if (!love || text(love['Song ID']) !== 'SONG-0223' || text(love['Song Link ID']) !== 'SLNK-0458' || text(love['Release ID']) !== 'REL-SOLO-022' || text(love['Recording ID']) || !text(love['External Link']).includes('X4watMNFBfw')) fail('SONG-0223 official VHS channel mismatch');
  if (!loveListen || text(loveListen['Song ID']) !== 'SONG-0223' || text(loveListen['Song Link ID']) !== 'SLNK-0621' || text(loveListen['Release ID']) !== 'REL-SOLO-022' || text(loveListen['Recording ID']) || !text(loveListen['External Link']).includes('audius.co/tygertyger/love-by-tygerfeathers')) fail('SONG-0223 official Audius channel mismatch');
  if (!loveLyric || text(loveLyric['Song ID']) !== 'SONG-0223' || !String(loveLyric['Lyric Text']).includes('Oh the things') || !String(loveLyric['Lyric Text']).includes("now he's losing his mind") || !String(loveLyric['Lyric Text']).includes("Life isn't lived without some love, so we simply lose our mind.")) fail('LYR-0001 corrected payload mismatch');
  if (/Little boys have a penis|testes on the outside/i.test(String(loveLyric['Lyric Text']))) fail('LYR-0001 still contains sampled narration as authored lyrics');
  if (text(loveSong['Canonical Song Title']) !== 'Love (feat. Tygertyger)') fail('SONG-0223 canonical title mismatch');
  const replacement = rows['Player Channels'].find((row) => text(row['Player Channel ID']) === 'PCH-0168');
  if (!replacement || text(replacement['Song ID']) !== 'SONG-0039' || text(replacement['Recording ID']) !== 'REC-SOLO-043' || text(replacement['Song Link ID']) !== 'SLNK-0620') fail('Music Channel 3 replacement mismatch');
  return {
    rows,
    coverage: {
      sourceSheets: sheetNames.length,
      playerChannels: rows['Player Channels'].length,
      cassetteChannels: channelTypes.CASSETTE,
      vhsChannels: channelTypes.VHS,
      lyrics: rows.Lyrics.length,
      songLinks: rows['Song Links'].length,
      bandcampRegistryRows: rows['Bandcamp Embed Registry'].length,
      bandcampTrackRegistryRows: registryTypes.TRACK,
      bandcampAlbumRegistryRows: registryTypes.ALBUM,
      p0Media: priority['P0 MEDIA'] ?? 0,
      p1Lyrics: priority['P1 LYRICS'],
      p2CreditsMetadata: priority['P2 CREDITS + METADATA'],
    },
  };
}

function buildPublicData(base, rows, hash, coverage) {
  const projects = rows.Projects.map((row) => ({
    id: text(row['Project ID']), name: text(row['Project Name']), type: text(row['Project Type']), section: text(row['Archive Section']),
    period: nullable(row['Known Active Period']), datePrecision: nullable(row['Date Precision']), relationship: nullable(row['Jonathan Relationship / Role']), status: text(row.Status),
  }));
  const projectMap = new Map(projects.map((project) => [project.id, project]));
  const releases = rows.Releases.map((row) => {
    const date = normalizeDate(row['Release Date']);
    return { id: text(row['Release ID']), projectId: nullable(row['Project ID']), artist: text(row['Primary Artist']), title: text(row['Release Title']), type: text(row['Release Type']), date, year: normalizeYear(row.Year, date), datePrecision: nullable(row['Date Precision']), status: text(row['Archive Status']) };
  });
  const releaseMap = new Map(releases.map((release) => [release.id, release]));
  const recordings = rows.Recordings.map((row) => ({
    id: text(row['Recording ID']), releaseId: nullable(row['Release ID']), projectId: nullable(row['Project ID']) ?? releaseMap.get(text(row['Release ID']))?.projectId ?? null,
    title: text(row['Track Title']), version: nullable(row['Version Label']), duration: nullable(row.Duration), artist: text(row['Artist Credit']), featured: nullable(row['Featured / Co-credited Artist']), instrumental: nullable(row['Instrumental?']), leadVocal: nullable(row['Lead Vocal']), recordingPeriod: nullable(row['Recording Period']), creationPeriod: nullable(row['Creation Period']), status: text(row['Archive Status']),
  }));
  const recordingMap = new Map(recordings.map((recording) => [recording.id, recording]));
  const channelByLink = new Map(rows['Player Channels'].map((row) => [text(row['Song Link ID']), row]));
  const songLinks = rows['Song Links'].map((row) => {
    const channel = channelByLink.get(text(row['Song Link ID']));
    const metadata = parseMetadata(row['Embed / Player Metadata']);
    const mediaId = nullable(row['Platform Media ID']);
    let platform = text(row.Platform) || text(channel?.Platform);
    let url = text(row.URL) || text(channel?.['External Link']);
    if (!url && mediaId && (!platform || platform === 'YouTube')) {
      url = `https://www.youtube.com/watch?v=${mediaId}`;
      platform = platform || 'YouTube';
    }
    if (!url || !platform) return null;
    publicUrl(url, row['Song Link ID']);
    return {
      id: text(row['Song Link ID']), songId: text(row['Song ID']), platform,
      priority: Number(row['Platform Priority']) || Math.max(1, MEDIA_ORDER.indexOf(platform) + 1), url,
      linkLevel: text(row['Link Level']) || (channel ? 'Exact recording / version' : 'Release page fallback'), sourceEntityId: nullable(row['Source Entity ID']) ?? nullable(channel?.['Recording ID']) ?? nullable(channel?.['Release ID']) ?? nullable(row['Release ID']),
      releaseId: nullable(row['Release ID']) ?? nullable(channel?.['Release ID']), releaseTitle: nullable(row['Release Title']) ?? releaseMap.get(text(channel?.['Release ID']))?.title ?? null,
      releaseDate: normalizeDate(row['Release Date']), datePrecision: nullable(row['Date Precision']) ?? nullable(channel?.['Date / Precision']), status: text(row.Status) || 'Active',
      mediaId, embedUrl: nullable(metadata.embed_url), artworkUrl: nullable(row['Artwork URL']), supportContext: nullable(row['Purchase / Support Context']), resolutionConfidence: nullable(row['Resolution Confidence']),
    };
  }).filter(Boolean).sort((a, b) => a.songId.localeCompare(b.songId) || a.priority - b.priority || a.id.localeCompare(b.id));
  const linkMap = new Map(songLinks.map((link) => [link.id, link]));
  const bandcampEmbedRegistry = rows['Bandcamp Embed Registry'].map((row) => ({
    id: text(row['Registry ID']), songLinkId: nullable(row['Song Link ID']), songId: nullable(row['Song ID']),
    recordingId: nullable(row['Recording ID']), releaseId: nullable(row['Release ID']), projectId: nullable(row['Project ID']),
    embedType: text(row['Embed Type']).toLowerCase(), embedUrl: bandcampEmbedUrl(row['Official Bandcamp iframe src'], text(row['Registry ID'])),
    itemId: text(row['Bandcamp Item ID']), trackNumber: nullable(row['Track Number']), verifiedDate: normalizeDate(row['Embed Verified Date']),
  }));
  const trackRegistryByVersion = new Map(bandcampEmbedRegistry
    .filter((entry) => entry.embedType === 'track')
    .map((entry) => [`${entry.songLinkId}|${entry.recordingId}`, entry]));
  const albumRegistryByRelease = new Map(bandcampEmbedRegistry
    .filter((entry) => entry.embedType === 'album')
    .map((entry) => [`${entry.releaseId}|${entry.projectId}`, entry]));
  const linksBySong = new Map();
  for (const link of songLinks) linksBySong.set(link.songId, [...(linksBySong.get(link.songId) ?? []), link]);
  const compositionAliases = new Map();
  for (const row of rows['Name Variants']) {
    const id = text(row['Canonical Entity ID']);
    if (id.startsWith('CMP-') && text(row['Search Alias?']) === 'Yes') compositionAliases.set(id, [...(compositionAliases.get(id) ?? []), text(row['Variant Name'])]);
  }
  const cards = new Map(rows['Archive Card Credits'].map((row) => [text(row['Song ID']), row]));
  const baseSongs = new Map(base.songs.map((song) => [song.id, song]));
  const contributionsBySong = new Map();
  for (const row of rows['Song Contributions']) contributionsBySong.set(text(row['Song ID']), [...(contributionsBySong.get(text(row['Song ID'])) ?? []), row]);
  const songs = rows['Song Index'].map((row) => {
    const id = text(row['Song ID']);
    const card = cards.get(id) ?? {};
    const previous = baseSongs.get(id);
    const appearanceIds = strings(row['Known Appearance / Recording IDs']);
    const bases = appearanceIds.map((value) => value.split(':')[0]);
    const recordingIds = unique([...bases.filter((value) => recordingMap.has(value)), ...(linksBySong.get(id) ?? []).map((link) => link.sourceEntityId).filter((value) => recordingMap.has(value))]);
    const releaseIds = unique([...bases.filter((value) => releaseMap.has(value)), ...recordingIds.map((value) => recordingMap.get(value)?.releaseId), ...(linksBySong.get(id) ?? []).flatMap((link) => [link.releaseId, releaseMap.has(link.sourceEntityId) ? link.sourceEntityId : null])]).filter((value) => releaseMap.has(value));
    const projectIds = strings(row['Project IDs / Context']).filter((value) => value !== 'COLLAB');
    const summaries = releaseIds.map((releaseId) => releaseMap.get(releaseId)).filter(Boolean).sort((a, b) => Number(a.year ?? 9999) - Number(b.year ?? 9999) || text(a.date).localeCompare(text(b.date)) || a.id.localeCompare(b.id));
    const primary = summaries.find((release) => release.date || release.year) ?? null;
    const field = (name, fallback) => nullable(card[name]) ?? fallback ?? null;
    const decadeRaw = text(card['Decade / Era']);
    return {
      id, title: text(row['Canonical Song Title']), aliases: unique([...strings(row['Search Aliases / Historical Titles']), field('Alternate / Historical Title', previous?.alternateTitle), ...strings(row['Composition IDs']).flatMap((compositionId) => compositionAliases.get(compositionId) ?? [])]).filter((alias) => alias !== text(row['Canonical Song Title'])),
      projectIds, projectNames: projectIds.map((projectId) => projectMap.get(projectId)?.name).filter(Boolean), appearanceIds, recordingIds, releaseIds,
      linkIds: (linksBySong.get(id) ?? []).map((link) => link.id), appearanceCount: Number(row['Known Appearance Count']) || 0, relationship: text(row['Jonathan Relationship']),
      eligibility: text(row['Personal Counter Eligible?']) || previous?.eligibility || '', alternateTitle: field('Alternate / Historical Title', previous?.alternateTitle), writing: id === 'SONG-0223' ? 'Jonathan Edward Lee' : field('Songwriter / Co-writer', previous?.writing), lyrics: field('Lyrics / Lyrical Contribution', previous?.lyrics), vocal: field('Vocal / Instrumental', previous?.vocal), acoustic: text(card['Acoustic?']) ? text(card['Acoustic?']) === 'Yes' : Boolean(previous?.acoustic), creditStatus: text(card['Credit Status']) || previous?.creditStatus || '', linerNotes: field('Founder Liner Notes / Story', previous?.linerNotes), decade: /^\d{4}s$/.test(decadeRaw) ? decadeRaw : previous?.decade ?? null, contexts: contextValues(card['Music Context Tags'] || previous?.contexts?.join(';')),
      credits: (contributionsBySong.get(id) ?? []).filter((item) => text(item.Category) !== 'Participation').map((item) => ({ name: text(item['Canonical Contributor']), category: text(item.Category), role: text(item['Role / Detail']) })),
      date: primary ? { value: primary.date ?? primary.year, precision: primary.datePrecision, releaseId: primary.id } : previous?.date ?? null,
    };
  });
  if (songs.filter((song) => song.eligibility === 'Yes').length !== PUBLIC_KNOWN_SONGS) fail('public song count is not 215 after the documented merged-row eligibility carry-forward');
  if (songs.some((song) => song.decade && !/^\d{4}s$/.test(song.decade))) fail('public decade facet contains a non-decade value');

  const memberships = rows['Project Memberships'].filter((row) => text(row['Project ID']) === 'PRJ-BAND-003');
  const leadershipPerformers = unique(memberships.map((row) => text(row['Credit / Name Used'])));
  if (!leadershipPerformers.includes('Jacob Shively')) fail('Leadership Class membership is missing Jacob Shively');
  const lyrics = rows.Lyrics.map((row) => {
    const state = lyricStateOf(row);
    const songId = text(row['Song ID']);
    return {
      id: text(row['Lyric ID']), songId, title: text(row['Canonical Song Title']), version: text(row['Version / Recording ID']),
      text: state === 'public' ? String(row['Lyric Text'] ?? '').trim() : '',
      authors: text(row['Lyric Author(s)']), sourceType: text(row['Source Type']), evidence: text(row['Evidence Classification']),
      rights: text(row['Rights / Publication Basis']), publicEligible: ['yes', 'true'].includes(text(row['Public Eligible?']).toLowerCase()),
      state,
      sampleTreatment: songId === 'SONG-0223' ? 'The 0:00–0:09 opening narration and the break narration are sampled speech, separate from Tygertyger-authored lyrics.' : null,
    };
  });
  const lyricsBySong = new Map();
  for (const lyric of lyrics) lyricsBySong.set(lyric.songId, [...(lyricsBySong.get(lyric.songId) ?? []), lyric]);
  if (lyrics.some((lyric) => ['pending', 'conflicted'].includes(lyric.state) && lyric.text)) fail('pending or conflicted lyrics leaked complete text');
  const loveLyric = lyrics.find((lyric) => lyric.id === 'LYR-0001');
  if (!loveLyric || loveLyric.state !== 'public' || loveLyric.songId !== 'SONG-0223') fail('LYR-0001 public lyric state mismatch');
  if (/Little boys have a penis|When human beings are very young/i.test(loveLyric.text)) fail('LYR-0001 public text still contains sampled narration');
  const releaseLinks = rows.Links.filter((row) => text(row['Entity Type']) === 'Release' && text(row.Status) !== 'Inactive');
  const channels = rows['Player Channels'].map((row) => {
    const id = text(row['Player Channel ID']);
    const songId = text(row['Song ID']);
    const recordingId = nullable(row['Recording ID']);
    const releaseId = nullable(row['Release ID']);
    const projectId = text(row['Project ID']);
    const recording = recordingId ? recordingMap.get(recordingId) : null;
    const release = releaseId ? releaseMap.get(releaseId) : null;
    const channelLink = linkMap.get(text(row['Song Link ID']));
    const playerType = text(row['Player Type']).toLowerCase();
    const exactTrackRegistry = playerType === 'cassette' && recordingId ? trackRegistryByVersion.get(`${text(row['Song Link ID'])}|${recordingId}`) ?? null : null;
    const sameReleaseAlbumRegistry = playerType === 'cassette' && releaseId ? albumRegistryByRelease.get(`${releaseId}|${projectId}`) ?? null : null;
    const sameVersionSource = playerType === 'cassette' && recordingId && !exactTrackRegistry && !sameReleaseAlbumRegistry
      ? songLinks.find((link) => link.sourceEntityId === recordingId && supportedSameVersionEmbed(link)) ?? null
      : null;
    const releaseBandcampUrl = songLinks.find((link) => link.releaseId === releaseId && link.platform === 'Bandcamp' && destinationKind(link.linkLevel) === 'release-page')?.url
      ?? rows.Links.find((link) => text(link['Entity Type']) === 'Release' && text(link['Entity ID']) === releaseId && text(link.Platform) === 'Bandcamp' && text(link.Status) !== 'Inactive')?.URL
      ?? null;
    const playbackCandidates = [
      exactTrackRegistry ? {
        kind: 'bandcamp-track', label: 'BANDCAMP / EXACT TRACK', embedUrl: exactTrackRegistry.embedUrl,
        registryId: exactTrackRegistry.id, attributionUrl: channelLink?.url ?? text(row['External Link']), releaseFallback: false,
      } : null,
      sameReleaseAlbumRegistry ? {
        kind: 'bandcamp-album-fallback', label: 'BANDCAMP / RELEASE PLAYER FALLBACK', embedUrl: sameReleaseAlbumRegistry.embedUrl,
        registryId: sameReleaseAlbumRegistry.id, attributionUrl: releaseBandcampUrl ?? text(row['External Link']), releaseFallback: true,
      } : null,
      sameVersionSource ? {
        kind: 'same-version', label: `${sameVersionSource.platform.toUpperCase()} / EXACT SAME VERSION`, embedUrl: supportedSameVersionEmbed(sameVersionSource),
        registryId: null, attributionUrl: sameVersionSource.url, releaseFallback: false,
      } : null,
    ].filter(Boolean);
    const primaryPlayback = playbackCandidates[0] ?? null;
    const playback = primaryPlayback ? {
      ...primaryPlayback, candidates: playbackCandidates,
    } : {
      kind: 'external', label: 'EXTERNAL STREAM / LINKS', embedUrl: null, registryId: null,
      attributionUrl: text(row['External Link']) || channelLink?.url || '', releaseFallback: false, candidates: [],
    };
    const contributions = contributionsBySong.get(songId) ?? [];
    const performerOverride = songId === 'SONG-0053'
      ? ['Jonathan Edward Lee', 'Jeff Leinwand']
      : songId === 'SONG-0054'
        ? ['Jonathan Edward Lee', 'Riverbucket']
        : null;
    const performers = projectId === 'PRJ-BAND-003' ? leadershipPerformers : performerOverride ?? unique(contributions
      .filter((item) => text(item.Category) === 'Performance' && !text(item['Role / Detail']).includes('Leadership Class'))
      .map((item) => text(item['Canonical Contributor'])));
    const producers = unique(contributions.filter((item) => text(item.Category) === 'Production').map((item) => text(item['Canonical Contributor'])));
    const versionKey = recordingId || `${songId}|${releaseId || ''}|${projectId}`;
    const loveFacts = songId === 'SONG-0223' ? [
      ['MUSIC / COMPOSITION', 'Jonathan Edward Lee'], ['LYRICS', 'Tygertyger'], ['FEATURED ARTIST', 'Tygertyger'], ['CHORUS HARMONY VOCALS', 'Jonathan Edward Lee'],
    ] : [];
    const collaborationFacts = songId === 'SONG-0054' ? [
      ['LYRICS', 'Frawstakwa'], ['VOCALS / FEATURED ARTIST', 'Frawstakwa'], ['SAMPLED PERFORMANCE', 'Riverbucket — ukulele'],
    ] : songId === 'SONG-0053' ? [['CO-CREDITED ARTIST', 'Jeff Leinwand']] : [];
    const doWhatLyric = lyrics.find((lyric) => lyric.id === 'LYR-0008');
    const doWhatFacts = songId === 'SONG-0039' ? [
      { label: 'LYRICS', value: doWhatLyric?.authors ?? 'Jonathan Edward Lee; Sanket Sinha' },
      { label: 'LEAD GUITAR', value: 'Dewey Hiler', url: 'https://www.youtube.com/@deweyhiler555' },
      { label: 'BANDCAMP RELEASE', value: '2018-08-10' },
      { label: 'FLOOB RECORDS STREAMING RELEASE', value: '2019-01-05' },
    ] : [];
    const facts = [
      ['PROJECT', projectMap.get(projectId)?.name ?? text(row['Project Name'])], ['RELEASE', release?.title], ['VERSION / SOURCE', text(row['Version / Source Label']) || recording?.version],
      ['DATE / PRECISION', text(row['Date / Precision']) || [release?.date ?? release?.year, release?.datePrecision].filter(Boolean).join(' · ')], ['DURATION', recording?.duration], ['ARTIST CREDIT', recording?.artist],
      ...loveFacts, ...collaborationFacts, ['MUSIC PERFORMED BY', performers.join('; ')], ['LEAD VOCAL', recording?.leadVocal], ['PRODUCED BY', producers.join('; ')], ['PLATFORM', text(row.Platform)],
    ].filter(([, value]) => text(value)).map(([label, value]) => ({ label, value }));
    facts.splice(Math.min(6, facts.length), 0, ...doWhatFacts);
    if (playerType === 'cassette') facts.push({ label: 'PLAYBACK SOURCE', value: playback.label });
    const channelLyrics = (lyricsBySong.get(songId) ?? []).filter((lyric) => lyric.state === 'public' && ((recordingId && lyric.version.includes(recordingId)) || (releaseId && lyric.version.includes(releaseId)) || (!recordingId && releaseId && lyric.songId === songId)));
    return {
      id, songId, title: text(row['Canonical Song Title']), type: playerType, order: Number(row['Channel Order']) || 0, label: text(row['Channel Label']), recordingId, releaseId, versionKey, versionLabel: text(row['Version / Source Label']), platform: text(row.Platform), songLinkId: text(row['Song Link ID']), playbackMethod: text(row['On-page Playback Method']), externalUrl: text(row['External Link']) || channelLink?.url || '', datePrecision: text(row['Date / Precision']), projectId, projectName: projectMap.get(projectId)?.name ?? text(row['Project Name']), mediaId: channelLink?.mediaId ?? null, embedUrl: playerType === 'cassette' ? playback.embedUrl : channelLink?.embedUrl ?? null, playback, facts, lyrics: channelLyrics,
    };
  });
  const hereWeGo = channels.filter((channel) => channel.songId === 'SONG-0087');
  if (!hereWeGo.some((channel) => channel.projectId === 'PRJ-BAND-003') || !hereWeGo.every((channel) => channel.projectId !== 'PRJ-BAND-003' || channel.facts.some((fact) => fact.label === 'MUSIC PERFORMED BY' && fact.value.includes('Jacob Shively')))) fail('Leadership Class Here We Go regression');
  const loveChannel = channels.find((channel) => channel.id === 'PCH-0026');
  if (!loveChannel || loveChannel.recordingId || !loveChannel.facts.some((fact) => fact.label === 'MUSIC PERFORMED BY' && fact.value.includes('Tygertyger') && fact.value.includes('Jonathan Edward Lee'))) fail('SONG-0223 public performance credit regression');
  if (channels.some((channel) => channel.songId === 'SONG-0223' && channel.recordingId)) fail('SONG-0223 invented a Recording ID');

  const channelsBySong = new Map();
  for (const channel of channels) channelsBySong.set(channel.songId, [...(channelsBySong.get(channel.songId) ?? []), channel]);

  function lyricMatchesVersion(lyric, version) {
    if (lyric.songId !== version.songId) return false;
    if (version.recordingId && lyric.version.includes(version.recordingId)) return true;
    if (version.releaseId && lyric.version.includes(version.releaseId)) return true;
    return false;
  }

  function destinationsForVersion(version, songLinksForSong, versionChannels) {
    const exact = [];
    const fallbacks = [];
    const seen = new Set();
    const push = (item, list) => {
      if (!item?.url || seen.has(item.url)) return;
      seen.add(item.url);
      publicUrl(item.url, item.id || item.url);
      list.push(item);
    };
    for (const channel of versionChannels) {
      const url = channel.externalUrl || linkMap.get(channel.songLinkId)?.url;
      if (!url) continue;
      push({
        id: channel.songLinkId || channel.id, platform: channel.platform, url,
        kind: 'exact', label: `${channel.platform.toUpperCase() || 'SOURCE'} / EXACT TRACK`, level: 'Exact recording / version',
      }, exact);
    }
    for (const link of songLinksForSong) {
      const recordingMatch = version.recordingId && (link.sourceEntityId === version.recordingId);
      const releaseMatch = !version.recordingId && version.releaseId && (link.releaseId === version.releaseId || link.sourceEntityId === version.releaseId);
      if (!recordingMatch && !releaseMatch) continue;
      const kind = destinationKind(link.linkLevel);
      push({
        id: link.id, platform: link.platform, url: link.url, kind,
        label: kind === 'exact' ? `${link.platform.toUpperCase()} / EXACT TRACK` : destinationLabel(link.platform, kind),
        level: link.linkLevel,
      }, kind === 'exact' ? exact : fallbacks);
    }
    for (const link of releaseLinks) {
      if (text(link['Entity ID']) !== version.releaseId || !text(link.URL)) continue;
      const kind = destinationKind(text(link['Link Level']) || 'Release page fallback');
      push({
        id: `${text(link.Platform)}-${version.releaseId}`, platform: text(link.Platform), url: text(link.URL), kind,
        label: destinationLabel(link.Platform, kind === 'exact' ? 'release-page' : kind), level: 'Release fallback',
      }, fallbacks);
    }
    return [...exact, ...fallbacks];
  }

  for (const song of songs) {
    const songChannels = channelsBySong.get(song.id) ?? [];
    const versionMap = new Map();
    const ensure = (key, seed) => {
      if (!versionMap.has(key)) versionMap.set(key, { ...seed, key, songId: song.id, listenChannelIds: [], watchChannelIds: [] });
      return versionMap.get(key);
    };
    for (const channel of songChannels) {
      const version = ensure(channel.versionKey, {
        recordingId: channel.recordingId, releaseId: channel.releaseId, projectId: channel.projectId,
        projectName: channel.projectName, label: channel.versionLabel || channel.label, datePrecision: channel.datePrecision || null,
      });
      if (channel.type === 'cassette' && channel.externalUrl) version.listenChannelIds.push(channel.id);
      if (channel.type === 'vhs' && channel.externalUrl) version.watchChannelIds.push(channel.id);
    }
    for (const recordingId of song.recordingIds) {
      const recording = recordingMap.get(recordingId);
      if (!recording) continue;
      const key = recordingId;
      ensure(key, {
        recordingId, releaseId: recording.releaseId, projectId: recording.projectId || song.projectIds[0] || '',
        projectName: projectMap.get(recording.projectId)?.name || '', label: recording.version || recording.title, datePrecision: null,
      });
    }
    song.versions = [...versionMap.values()].map((version) => {
      const versionChannels = songChannels.filter((channel) => channel.versionKey === version.key);
      const matchedLyrics = (lyricsBySong.get(song.id) ?? []).filter((lyric) => lyricMatchesVersion(lyric, version));
      const state = matchedLyrics.find((lyric) => lyric.state === 'conflicted')?.state
        ?? matchedLyrics.find((lyric) => lyric.state === 'pending')?.state
        ?? matchedLyrics.find((lyric) => lyric.state === 'public')?.state
        ?? matchedLyrics.find((lyric) => lyric.state === 'instrumental')?.state
        ?? matchedLyrics.find((lyric) => lyric.state === 'cover')?.state
        ?? (matchedLyrics.length ? matchedLyrics[0].state : 'missing');
      return {
        key: version.key, recordingId: version.recordingId, releaseId: version.releaseId, projectId: version.projectId,
        projectName: version.projectName, label: version.label, datePrecision: version.datePrecision,
        listenChannelIds: unique(version.listenChannelIds), watchChannelIds: unique(version.watchChannelIds),
        lyricIds: matchedLyrics.map((lyric) => lyric.id), lyricState: state,
        destinations: destinationsForVersion(version, linksBySong.get(song.id) ?? [], versionChannels),
      };
    }).sort((left, right) => (left.projectId || '').localeCompare(right.projectId || '') || (left.releaseId || '').localeCompare(right.releaseId || '') || (left.recordingId || '').localeCompare(right.recordingId || '') || left.key.localeCompare(right.key));
  }

  const loveSong = songs.find((song) => song.id === 'SONG-0223');
  if (!loveSong || loveSong.versions.some((version) => version.recordingId) || loveSong.versions.length !== 1) fail('SONG-0223 version model invented a recording or merged another Love');
  if (loveSong.versions[0].watchChannelIds.join() !== 'PCH-0026' || loveSong.versions[0].listenChannelIds.join() !== 'PCH-0181') fail('SONG-0223 listen/watch channel binding mismatch');
  if (loveSong.versions[0].lyricIds.join() !== 'LYR-0001' || loveSong.versions[0].lyricState !== 'public') fail('SONG-0223 lyric binding mismatch');
  const loveDest = loveSong.versions[0].destinations;
  if (!loveDest.some((item) => item.id === 'SLNK-0621' && item.kind === 'exact' && /audius\.co\/tygertyger\/love-by-tygerfeathers/.test(item.url))) fail('SONG-0223 missing exact Audius destination');
  if (!loveDest.some((item) => item.kind === 'release-page')) fail('SONG-0223 missing labeled release-page fallback');
  if (!loveDest.some((item) => item.kind === 'smart-link' && item.label === 'SMART LINK')) fail('SONG-0223 missing labeled smart-link fallback');
  const otherLove = songs.find((song) => song.id === 'SONG-0001');
  if (!otherLove || otherLove.versions.some((version) => version.key === loveSong.versions[0].key) || otherLove.title !== 'Love') fail('SONG-0001 / SONG-0223 identity split mismatch');

  const latestReleaseId = 'REL-SOLO-018';
  const latestSongIds = songs.filter((song) => song.releaseIds.includes(latestReleaseId)).map((song) => song.id);
  const platforms = unique(songLinks.map((link) => link.platform)).sort((a, b) => (MEDIA_ORDER.indexOf(a) < 0 ? 99 : MEDIA_ORDER.indexOf(a)) - (MEDIA_ORDER.indexOf(b) < 0 ? 99 : MEDIA_ORDER.indexOf(b)) || a.localeCompare(b));
  const data = {
    meta: {
      schemaVersion: SCHEMA_VERSION, compilerVersion: COMPILER_VERSION, sourceVersion: 'v04-handoff-2026-08-16', sourceSha256: hash, sourceSheetCount: coverage.sourceSheets,
      rollbackArtifact: '/data/music-archive/v03/archive.json', publicKnownSongs: PUBLIC_KNOWN_SONGS,
      counts: { releases: releases.length, recordings: recordings.length, songs: songs.length, projects: projects.length, songLinks: songLinks.length, playerChannels: channels.length, lyrics: lyrics.length, bandcampEmbedRegistry: bandcampEmbedRegistry.length },
      coverage,
      latestView: { projectId: 'PRJ-SOLO-001', releaseId: latestReleaseId, releaseTitle: releaseMap.get(latestReleaseId)?.title ?? 'Latest Junkfeathers', songIds: latestSongIds },
    },
    facets: { decades: unique(songs.map((song) => song.decade)).sort((a, b) => b.localeCompare(a)), projects: MENU_PROJECT_IDS.map((id) => ({ id, name: projectMap.get(id).name })), platforms },
    projects, songs, releases, recordings, songLinks, lyrics, bandcampEmbedRegistry, playerChannels: channels,
  };
  const serialized = `${JSON.stringify(data, null, 2)}\n`;
  for (const forbidden of ['source_spreadsheet_id', 'Source ID / Provenance', 'DevAI Exchange', 'JUNKFEATHERS_MUSIC_ARCHIVE_V04_COMPLETION_WORKING_MASTER_2026-08-16.xlsx']) if (serialized.includes(forbidden)) fail(`public artifact exposes private source material: ${forbidden}`);
  return { data, serialized };
}

export async function compileArchive(sourcePath, outputPath, basePath) {
  if (!sourcePath) fail('an explicit authorized v04 JSON path is required');
  const sourceBytes = await readFile(resolve(sourcePath));
  const hash = createHash('sha256').update(sourceBytes).digest('hex').toUpperCase();
  let source;
  try { source = JSON.parse(sourceBytes); } catch { fail('source is not valid JSON'); }
  const { rows, coverage } = validate(source, hash);
  const base = JSON.parse(await readFile(resolve(basePath ?? 'public/data/music-archive/v03/archive.json'), 'utf8'));
  if (base.meta?.schemaVersion !== 'music-archive-v03.2' || base.meta?.publicKnownSongs !== 215) fail('v03.2 rollback baseline mismatch');
  const { data, serialized } = buildPublicData(base, rows, hash, coverage);
  const summary = { schemaVersion: SCHEMA_VERSION, compilerVersion: COMPILER_VERSION, sourceVersion: data.meta.sourceVersion, sourceSha256: hash, sourceSheetCount: coverage.sourceSheets, status: 'valid', counts: data.meta.counts, coverage, publicKnownSongs: PUBLIC_KNOWN_SONGS, rollbackArtifact: data.meta.rollbackArtifact, warnings: [], errors: [] };
  await mkdir(dirname(resolve(outputPath)), { recursive: true });
  await writeFile(resolve(outputPath), serialized, 'utf8');
  await writeFile(resolve(dirname(resolve(outputPath)), 'validation.json'), `${JSON.stringify(summary, null, 2)}\n`, 'utf8');
  return { data, summary, bytes: Buffer.byteLength(serialized) };
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  compileArchive(process.argv[2], resolve(process.argv[3] ?? 'public/data/music-archive/v04/archive.json'), process.argv[4]).then(({ summary, bytes }) => console.log(JSON.stringify({ ...summary, outputBytes: bytes }))).catch((error) => { console.error(error.message); process.exitCode = 1; });
}
