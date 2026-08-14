import { createHash } from 'node:crypto';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

export const COMPILER_VERSION = '3.2.0-beta.1';
export const SCHEMA_VERSION = 'music-archive-v03.2';
export const EXPECTED_SHA256 = 'DD483F7E2B1D289E93A78F23F6918208391288F1D21A5CB29696C06D6EDC231F';
export const EXPECTED_SHEETS = [
  'Overview', 'Releases', 'Recordings', 'Contributors', 'Credits', 'Links', 'Sources',
  'Timeline', 'Unresolved', 'Projects', 'Project Memberships', 'Compositions',
  'Project Repertoire', 'Performance Sources', 'Web Archive Evidence', 'Name Variants',
  'Events', 'Event Participants', 'Search Facets', 'Lineup Eras', 'Biography Timeline',
  'Song Index', 'Website v01 Contract', 'Website v02 Contract', 'Contributor Ranking',
  'Song Contributions', 'Song Links', 'Archive Card Credits', 'Website v03 Contract',
  'Player Channels', 'Lyrics', 'v03.1 Audit', 'v03.2 Audit', 'Bandcamp Embed Registry',
];

const PUBLIC_KNOWN_SONGS = 215;
const MENU_PROJECT_IDS = ['PRJ-SOLO-001', 'PRJ-BAND-001', 'PRJ-BAND-002', 'PRJ-BAND-003', 'PRJ-BAND-004', 'PRJ-BAND-005'];
const MEDIA_ORDER = ['Bandcamp', 'YouTube', 'Spotify', 'Apple Music', 'Amazon Music'];
const ORIGINAL_PLAYER_IDS = [
  'PCH-0001', 'PCH-0002', 'PCH-0003', 'PCH-0004', 'PCH-0005', 'PCH-0006', 'PCH-0007', 'PCH-0008', 'PCH-0009',
  'PCH-0012', 'PCH-0013', 'PCH-0014', 'PCH-0015', 'PCH-0016', 'PCH-0018', 'PCH-0019', 'PCH-0020', 'PCH-0021',
  'PCH-0022', 'PCH-0023', 'PCH-0024', 'PCH-0025', 'PCH-0026', 'PCH-0027', 'PCH-0028', 'PCH-0029', 'PCH-0030',
];
const PLAYER_IDS = Array.from({ length: 168 }, (_, index) => index + 1)
  .filter((number) => ![10, 11, 17].includes(number))
  .map((number) => `PCH-${String(number).padStart(4, '0')}`);

function fail(message) { throw new Error(`ARCHIVE_V03_VALIDATION_FAILED: ${message}`); }
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

function validate(source, hash) {
  if (hash !== EXPECTED_SHA256) fail(`source SHA-256 ${hash} does not match the authorized v03.2 handoff`);
  if (!text(source.source_title).includes('MUSIC ARCHIVE V03.2')) fail('source title mismatch');
  if (text(source.handoff_state) !== 'V03.2 WEBSITE COUNCIL HANDOFF READY') fail('handoff state mismatch');
  const sheetNames = Object.keys(source.sheets ?? {});
  if (sheetNames.length !== EXPECTED_SHEETS.length || sheetNames.some((name, index) => name !== EXPECTED_SHEETS[index])) fail('34-sheet v03.2 contract mismatch');
  const wanted = ['Releases', 'Recordings', 'Contributors', 'Projects', 'Links', 'Name Variants', 'Song Index', 'Song Links', 'Archive Card Credits', 'Lyrics', 'Player Channels', 'Song Contributions', 'Project Memberships', 'v03.2 Audit', 'Bandcamp Embed Registry'];
  const rows = Object.fromEntries(wanted.map((name) => [name, rowsFrom(source, name)]));
  if (rows.Releases.length !== 59 || rows.Recordings.length !== 320 || rows.Projects.length !== 7 || rows['Song Index'].length !== 220 || rows['Archive Card Credits'].length !== 220 || rows['Song Links'].length !== 620 || rows.Lyrics.length !== 26 || rows['Player Channels'].length !== 165 || rows['Bandcamp Embed Registry'].length !== 139) fail('v03.2 concrete row count mismatch');
  const songIds = ids(rows['Song Index'], 'Song ID', 'Song Index');
  ids(rows.Releases, 'Release ID', 'Releases');
  ids(rows.Recordings, 'Recording ID', 'Recordings');
  ids(rows.Projects, 'Project ID', 'Projects');
  const linkIds = ids(rows['Song Links'], 'Song Link ID', 'Song Links');
  ids(rows['Archive Card Credits'], 'Song ID', 'Archive Card Credits');
  ids(rows.Lyrics, 'Lyric ID', 'Lyrics');
  const playerIds = ids(rows['Player Channels'], 'Player Channel ID', 'Player Channels');
  const registryIds = ids(rows['Bandcamp Embed Registry'], 'Registry ID', 'Bandcamp Embed Registry');
  const expectedLinks = Array.from({ length: 620 }, (_, index) => `SLNK-${String(index + 1).padStart(4, '0')}`);
  if (linkIds.some((id, index) => id !== expectedLinks[index])) fail('Song Link IDs are not SLNK-0001 through SLNK-0620');
  if (playerIds.some((id, index) => id !== PLAYER_IDS[index])) fail('165 concrete Player Channel IDs/order changed');
  const expectedRegistryIds = Array.from({ length: 139 }, (_, index) => `BCEMB-${String(index + 1).padStart(4, '0')}`);
  if (registryIds.some((id, index) => id !== expectedRegistryIds[index])) fail('Bandcamp registry IDs/order changed');
  if (!songIds.includes('SONG-0001') || !songIds.includes('SONG-0223') || songIds.includes('SONG-0183')) fail('Love canonical identity correction mismatch');
  for (const row of rows['Player Channels']) {
    if (text(row['Public Eligible?']) !== 'Yes') fail(`${row['Player Channel ID']} is not public eligible`);
    if (!['VHS', 'CASSETTE'].includes(text(row['Player Type']))) fail(`${row['Player Channel ID']} player type mismatch`);
    publicUrl(row['External Link'], row['Player Channel ID']);
  }
  const channelTypes = rows['Player Channels'].reduce((counts, row) => {
    const type = text(row['Player Type']);
    counts[type] = (counts[type] ?? 0) + 1;
    return counts;
  }, {});
  if (channelTypes.CASSETTE !== 135 || channelTypes.VHS !== 30) fail('v03.2 cassette/VHS totals mismatch');
  if (rows['Player Channels'].filter((row) => !ORIGINAL_PLAYER_IDS.includes(text(row['Player Channel ID']))).length !== 138) fail('v03.2 added-channel count mismatch');

  const registryTypes = rows['Bandcamp Embed Registry'].reduce((counts, row) => {
    const type = text(row['Embed Type']);
    counts[type] = (counts[type] ?? 0) + 1;
    bandcampEmbedUrl(row['Official Bandcamp iframe src'], text(row['Registry ID']));
    if (!['TRACK', 'ALBUM'].includes(type)) fail(`${row['Registry ID']} embed type mismatch`);
    return counts;
  }, {});
  if (registryTypes.TRACK !== 124 || registryTypes.ALBUM !== 15) fail('Bandcamp registry TRACK/ALBUM totals mismatch');

  const releaseProject = new Map(rows.Releases.map((row) => [text(row['Release ID']), text(row['Project ID'])]));
  const recordingProject = new Map(rows.Recordings.map((row) => [text(row['Recording ID']), text(row['Project ID']) || releaseProject.get(text(row['Release ID'])) || '']));
  const playerByLink = new Map(rows['Player Channels'].map((row) => [text(row['Song Link ID']), row]));
  const eligibleBandcampLinks = rows['Song Links'].filter((row) => {
    const recordingId = text(row['Source Entity ID']);
    return text(row.Platform) === 'Bandcamp'
      && text(row.Status).startsWith('Active')
      && text(row['Link Level']) === 'Direct track / playable purchase page'
      && recordingId.startsWith('REC-')
      && Boolean(recordingProject.get(recordingId));
  });
  const uncoveredBandcampLinks = eligibleBandcampLinks.filter((link) => {
    const channel = playerByLink.get(text(link['Song Link ID']));
    const recordingId = text(link['Source Entity ID']);
    return !channel
      || text(channel['Player Type']) !== 'CASSETTE'
      || text(channel['Recording ID']) !== recordingId
      || text(channel['Project ID']) !== recordingProject.get(recordingId);
  });
  if (eligibleBandcampLinks.length !== 124 || uncoveredBandcampLinks.length) fail('exact active Bandcamp recording coverage mismatch');
  const trackRegistry = rows['Bandcamp Embed Registry'].filter((row) => text(row['Embed Type']) === 'TRACK');
  const albumRegistry = rows['Bandcamp Embed Registry'].filter((row) => text(row['Embed Type']) === 'ALBUM');
  const trackRegistryByVersion = new Map(trackRegistry.map((row) => [`${text(row['Song Link ID'])}|${text(row['Recording ID'])}`, row]));
  if (trackRegistryByVersion.size !== trackRegistry.length) fail('duplicate Bandcamp TRACK registry version key');
  for (const link of eligibleBandcampLinks) {
    const recordingId = text(link['Source Entity ID']);
    const registry = trackRegistryByVersion.get(`${text(link['Song Link ID'])}|${recordingId}`);
    if (!registry
      || text(registry['Song ID']) !== text(link['Song ID'])
      || text(registry['Release ID']) !== text(link['Release ID'])
      || text(registry['Project ID']) !== recordingProject.get(recordingId)) fail(`${link['Song Link ID']} has no exact matching Bandcamp TRACK registry row`);
  }
  const albumRegistryKeys = albumRegistry.map((row) => `${text(row['Release ID'])}|${text(row['Project ID'])}`);
  if (albumRegistryKeys.some((key) => key.startsWith('|') || key.endsWith('|')) || new Set(albumRegistryKeys).size !== albumRegistry.length) fail('Bandcamp ALBUM registry release/project key mismatch');
  const fallbackLinkIds = new Set(rows['Song Links'].filter((row) => text(row['Link Level']) === 'Release page fallback').map((row) => text(row['Song Link ID'])));
  if (rows['Player Channels'].some((row) => fallbackLinkIds.has(text(row['Song Link ID'])))) fail('release fallback was promoted to a player channel');

  const noraChannels = rows['Player Channels'].filter((row) => text(row['Project ID']) === 'PRJ-BAND-004');
  const noraSongIds = new Set(noraChannels.map((row) => text(row['Song ID'])));
  const noraLyrics = rows.Lyrics.filter((row) => noraSongIds.has(text(row['Song ID'])));
  if (noraChannels.length !== 52 || noraChannels.some((row) => text(row['Player Type']) !== 'CASSETTE')) fail('Nora and Gnoll channel coverage mismatch');
  if (noraLyrics.length !== 13) fail('Nora and Gnoll lyric coverage mismatch');
  const love = rows['Player Channels'].find((row) => text(row['Player Channel ID']) === 'PCH-0026');
  if (!love || text(love['Song ID']) !== 'SONG-0223' || text(love['Song Link ID']) !== 'SLNK-0458' || !text(love['External Link']).includes('X4watMNFBfw')) fail('SONG-0223 official VHS channel mismatch');
  const replacement = rows['Player Channels'].find((row) => text(row['Player Channel ID']) === 'PCH-0168');
  if (!replacement || text(replacement['Song ID']) !== 'SONG-0039' || text(replacement['Recording ID']) !== 'REC-SOLO-043' || text(replacement['Song Link ID']) !== 'SLNK-0620' || !text(replacement['External Link']).includes('ApKAcOuOiZ0') || text(replacement['Date / Precision']).split(' ')[0] !== '2026-08-14') fail('Music Channel 3 replacement mismatch');
  if (rows['Player Channels'].some((row) => text(row['Song Link ID']) === 'SLNK-0450' || text(row['External Link']).includes('TLYebbum4BM'))) fail('superseded Do What You Want video remains canonical');
  const dewey = rows.Contributors.find((row) => text(row['Contributor ID']) === 'CON-011');
  const deweyLink = rows.Links.find((row) => text(row['Entity ID']) === 'CON-011' && text(row.URL) === 'https://www.youtube.com/@deweyhiler555');
  const deweyContribution = rows['Song Contributions'].find((row) => text(row['Song ID']) === 'SONG-0039' && text(row['Contributor ID']) === 'CON-011' && text(row.Category) === 'Performance');
  if (text(dewey?.Name) !== 'Dewey Hiler' || !deweyLink || text(deweyContribution?.['Role / Detail']) !== 'Musician — Lead guitar') fail('Dewey Hiler credit/link mismatch');
  const historicalName = rows['Name Variants'].find((row) => text(row['Canonical Entity ID']) === 'CON-011' && text(row['Variant Name']) === 'Winter Walker');
  if (!historicalName) fail('Winter Walker historical name variant missing');
  const doWhatLyric = rows.Lyrics.find((row) => text(row['Lyric ID']) === 'LYR-0008');
  if (!doWhatLyric || text(doWhatLyric['Song ID']) !== 'SONG-0039' || text(doWhatLyric['Version / Recording ID']) !== 'REC-SOLO-043' || text(doWhatLyric['Lyric Author(s)']) !== 'Jonathan Edward Lee; Sanket Sinha') fail('Do What You Want lyric truth mismatch');
  const bandcampDate = rows['Song Links'].find((row) => text(row['Song Link ID']) === 'SLNK-0391');
  const release = rows.Releases.find((row) => text(row['Release ID']) === 'REL-SOLO-004');
  if (normalizeDate(bandcampDate?.['Release Date']) !== '2018-08-10' || normalizeDate(release?.['Release Date']) !== '2018-08-10' || !text(release?.['Distribution / Variation Notes']).includes('2019-01-05')) fail('Do What You Want release-date distinction mismatch');
  const captionAudit = rows['v03.2 Audit'].find((row) => text(row['v03.2 Change ID']) === 'V032-001');
  if (!text(captionAudit?.Notes).includes('69 sequential cues') || !text(captionAudit?.Notes).includes('00:03:44.000')) fail('Do What You Want caption metadata mismatch');
  return {
    rows,
    coverage: {
      sourceSheets: sheetNames.length,
      originalPlayerChannels: ORIGINAL_PLAYER_IDS.length,
      addedPlayerChannels: rows['Player Channels'].length - ORIGINAL_PLAYER_IDS.length,
      playerChannels: rows['Player Channels'].length,
      cassetteChannels: channelTypes.CASSETTE,
      vhsChannels: channelTypes.VHS,
      eligibleBandcampDirectRecordingLinks: eligibleBandcampLinks.length,
      eligibleBandcampDirectLinksWithoutChannel: uncoveredBandcampLinks.length,
      bandcampRegistryRows: rows['Bandcamp Embed Registry'].length,
      bandcampTrackRegistryRows: trackRegistry.length,
      bandcampAlbumRegistryRows: albumRegistry.length,
      noraGnollChannels: noraChannels.length,
      noraGnollCassetteChannels: noraChannels.filter((row) => text(row['Player Type']) === 'CASSETTE').length,
      noraGnollVhsChannels: noraChannels.filter((row) => text(row['Player Type']) === 'VHS').length,
      noraGnollLyrics: noraLyrics.length,
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
    const platform = text(row.Platform) || text(channel?.Platform);
    const url = text(row.URL) || text(channel?.['External Link']);
    publicUrl(url, row['Song Link ID']);
    return {
      id: text(row['Song Link ID']), songId: text(row['Song ID']), platform,
      priority: Number(row['Platform Priority']) || Math.max(1, MEDIA_ORDER.indexOf(platform) + 1), url,
      linkLevel: text(row['Link Level']) || 'Exact recording / version', sourceEntityId: nullable(row['Source Entity ID']) ?? nullable(channel?.['Recording ID']),
      releaseId: nullable(row['Release ID']) ?? nullable(channel?.['Release ID']), releaseTitle: nullable(row['Release Title']) ?? releaseMap.get(text(channel?.['Release ID']))?.title ?? null,
      releaseDate: normalizeDate(row['Release Date']), datePrecision: nullable(row['Date Precision']) ?? nullable(channel?.['Date / Precision']), status: text(row.Status) || 'Active',
      mediaId: nullable(row['Platform Media ID']), embedUrl: nullable(metadata.embed_url), artworkUrl: nullable(row['Artwork URL']), supportContext: nullable(row['Purchase / Support Context']), resolutionConfidence: nullable(row['Resolution Confidence']),
    };
  }).sort((a, b) => a.songId.localeCompare(b.songId) || a.priority - b.priority || a.id.localeCompare(b.id));
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
    return {
      id, title: text(row['Canonical Song Title']), aliases: unique([...strings(row['Search Aliases / Historical Titles']), field('Alternate / Historical Title', previous?.alternateTitle), ...strings(row['Composition IDs']).flatMap((compositionId) => compositionAliases.get(compositionId) ?? [])]).filter((alias) => alias !== text(row['Canonical Song Title'])),
      projectIds, projectNames: projectIds.map((projectId) => projectMap.get(projectId)?.name).filter(Boolean), appearanceIds, recordingIds, releaseIds,
      linkIds: (linksBySong.get(id) ?? []).map((link) => link.id), appearanceCount: Number(row['Known Appearance Count']) || 0, relationship: text(row['Jonathan Relationship']),
      eligibility: text(row['Personal Counter Eligible?']) || previous?.eligibility || '', alternateTitle: field('Alternate / Historical Title', previous?.alternateTitle), writing: id === 'SONG-0223' ? 'Jonathan Edward Lee' : field('Songwriter / Co-writer', previous?.writing), lyrics: field('Lyrics / Lyrical Contribution', previous?.lyrics), vocal: field('Vocal / Instrumental', previous?.vocal), acoustic: text(card['Acoustic?']) ? text(card['Acoustic?']) === 'Yes' : Boolean(previous?.acoustic), creditStatus: text(card['Credit Status']) || previous?.creditStatus || '', linerNotes: field('Founder Liner Notes / Story', previous?.linerNotes), decade: /^\d{4}s$/.test(text(card['Decade / Era'])) ? text(card['Decade / Era']) : previous?.decade ?? null, contexts: contextValues(card['Music Context Tags'] || previous?.contexts?.join(';')),
      credits: (contributionsBySong.get(id) ?? []).filter((item) => text(item.Category) !== 'Participation').map((item) => ({ name: text(item['Canonical Contributor']), category: text(item.Category), role: text(item['Role / Detail']) })),
      date: primary ? { value: primary.date ?? primary.year, precision: primary.datePrecision, releaseId: primary.id } : previous?.date ?? null,
    };
  });
  if (songs.filter((song) => song.eligibility === 'Yes').length !== PUBLIC_KNOWN_SONGS) fail('public song count is not 215 after the documented merged-row eligibility carry-forward');
  if (songs.some((song) => song.decade && !/^\d{4}s$/.test(song.decade))) fail('public decade facet contains a non-decade value');

  const memberships = rows['Project Memberships'].filter((row) => text(row['Project ID']) === 'PRJ-BAND-003');
  const leadershipPerformers = unique(memberships.map((row) => text(row['Credit / Name Used'])));
  if (!leadershipPerformers.includes('Jacob Shively')) fail('Leadership Class membership is missing Jacob Shively');
  const publicLyrics = rows.Lyrics.filter((row) => ['yes', 'true'].includes(text(row['Public Eligible?']).toLowerCase())).map((row) => ({
    id: text(row['Lyric ID']), songId: text(row['Song ID']), title: text(row['Canonical Song Title']), version: text(row['Version / Recording ID']), text: String(row['Lyric Text'] ?? '').trim(), authors: text(row['Lyric Author(s)']), sourceType: text(row['Source Type']), evidence: text(row['Evidence Classification']), rights: text(row['Rights / Publication Basis']), sampleTreatment: text(row['Song ID']) === 'SONG-0223' ? 'The 0:00–0:09 opening narration and approximately 2:28–3:11 break narration are samples, separate from Tygertyger-authored lyrics. Sample wording and source remain partially uncertain.' : null,
  }));
  const lyricsBySong = new Map();
  for (const lyric of publicLyrics) lyricsBySong.set(lyric.songId, [...(lyricsBySong.get(lyric.songId) ?? []), lyric]);
  const releaseLinks = rows.Links.filter((row) => text(row['Entity Type']) === 'Release' && text(row.Status) !== 'Inactive');
  const channels = rows['Player Channels'].map((row) => {
    const id = text(row['Player Channel ID']);
    const songId = text(row['Song ID']);
    const recordingId = text(row['Recording ID']);
    const releaseId = text(row['Release ID']);
    const projectId = text(row['Project ID']);
    const recording = recordingMap.get(recordingId);
    const release = releaseMap.get(releaseId);
    const channelLink = linkMap.get(text(row['Song Link ID']));
    const playerType = text(row['Player Type']).toLowerCase();
    const exactTrackRegistry = playerType === 'cassette' ? trackRegistryByVersion.get(`${text(row['Song Link ID'])}|${recordingId}`) ?? null : null;
    const sameReleaseAlbumRegistry = playerType === 'cassette' ? albumRegistryByRelease.get(`${releaseId}|${projectId}`) ?? null : null;
    const sameVersionSource = playerType === 'cassette' && !exactTrackRegistry && !sameReleaseAlbumRegistry
      ? songLinks.find((link) => link.sourceEntityId === recordingId && supportedSameVersionEmbed(link)) ?? null
      : null;
    const releaseBandcampUrl = songLinks.find((link) => link.releaseId === releaseId && link.platform === 'Bandcamp' && link.linkLevel === 'Release page fallback')?.url
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
      attributionUrl: text(row['External Link']), releaseFallback: false, candidates: [],
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
    const exactLinks = songLinks.filter((link) => link.sourceEntityId === recordingId && link.url).map((link) => ({ label: `${link.platform} / exact recording`, platform: link.platform, url: link.url, level: 'Exact recording / version' }));
    if (channelLink?.url) exactLinks.unshift({ label: `${channelLink.platform} / selected channel`, platform: channelLink.platform, url: channelLink.url, level: 'Exact recording / version' });
    const fallbackLinks = releaseLinks.filter((link) => text(link['Entity ID']) === releaseId && text(link.URL)).map((link) => ({ label: `${text(link.Platform)} / release fallback`, platform: text(link.Platform), url: text(link.URL), level: 'Release fallback' }));
    const streamLinks = unique([...exactLinks, ...fallbackLinks].map((link) => JSON.stringify(link))).map((link) => JSON.parse(link));
    const channelLyrics = (lyricsBySong.get(songId) ?? []).filter((lyric) => (recordingId && lyric.version.includes(recordingId)) || (releaseId && lyric.version.includes(releaseId)));
    const loveFacts = songId === 'SONG-0223' ? [
      ['MUSIC / COMPOSITION', 'Jonathan Edward Lee'], ['LYRICS', 'Tygertyger'], ['FEATURED ARTIST', 'Tygertyger'], ['CHORUS HARMONY VOCALS', 'Jonathan Edward Lee'],
    ] : [];
    const collaborationFacts = songId === 'SONG-0054' ? [
      ['LYRICS', 'Frawstakwa'], ['VOCALS / FEATURED ARTIST', 'Frawstakwa'], ['SAMPLED PERFORMANCE', 'Riverbucket — ukulele'],
    ] : songId === 'SONG-0053' ? [['CO-CREDITED ARTIST', 'Jeff Leinwand']] : [];
    const doWhatLyric = publicLyrics.find((lyric) => lyric.id === 'LYR-0008');
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
    return {
      id, songId, title: text(row['Canonical Song Title']), type: playerType, order: Number(row['Channel Order']), label: text(row['Channel Label']), recordingId, releaseId, versionLabel: text(row['Version / Source Label']), platform: text(row.Platform), songLinkId: text(row['Song Link ID']), playbackMethod: text(row['On-page Playback Method']), externalUrl: text(row['External Link']), datePrecision: text(row['Date / Precision']), projectId, projectName: projectMap.get(projectId)?.name ?? text(row['Project Name']), mediaId: channelLink?.mediaId ?? null, embedUrl: playerType === 'cassette' ? playback.embedUrl : channelLink?.embedUrl ?? null, playback, facts, streamLinks, lyrics: channelLyrics,
    };
  });
  const hereWeGo = channels.filter((channel) => channel.songId === 'SONG-0087');
  if (!hereWeGo.some((channel) => channel.projectId === 'PRJ-BAND-003') || !hereWeGo.every((channel) => channel.projectId !== 'PRJ-BAND-003' || channel.facts.some((fact) => fact.label === 'MUSIC PERFORMED BY' && fact.value.includes('Jacob Shively')))) fail('Leadership Class Here We Go regression');
  const loveChannel = channels.find((channel) => channel.id === 'PCH-0026');
  if (!loveChannel || !loveChannel.facts.some((fact) => fact.label === 'MUSIC PERFORMED BY' && fact.value.includes('Tygertyger') && fact.value.includes('Jonathan Edward Lee'))) fail('SONG-0223 public performance credit regression');

  const latestReleaseId = 'REL-SOLO-018';
  const latestSongIds = songs.filter((song) => song.releaseIds.includes(latestReleaseId)).map((song) => song.id);
  const platforms = unique(songLinks.map((link) => link.platform)).sort((a, b) => (MEDIA_ORDER.indexOf(a) < 0 ? 99 : MEDIA_ORDER.indexOf(a)) - (MEDIA_ORDER.indexOf(b) < 0 ? 99 : MEDIA_ORDER.indexOf(b)) || a.localeCompare(b));
  const data = {
    meta: { schemaVersion: SCHEMA_VERSION, compilerVersion: COMPILER_VERSION, sourceVersion: 'v03.2-handoff-2026-08-14', sourceSha256: hash, sourceSheetCount: coverage.sourceSheets, rollbackArtifact: '/data/music-archive/v02/archive.json', publicKnownSongs: PUBLIC_KNOWN_SONGS,
      counts: { releases: releases.length, recordings: recordings.length, songs: songs.length, projects: projects.length, songLinks: songLinks.length, playerChannels: channels.length, lyrics: publicLyrics.length, bandcampEmbedRegistry: bandcampEmbedRegistry.length },
      coverage,
      latestView: { projectId: 'PRJ-SOLO-001', releaseId: latestReleaseId, releaseTitle: releaseMap.get(latestReleaseId)?.title ?? 'Latest Junkfeathers', songIds: latestSongIds } },
    facets: { decades: unique(songs.map((song) => song.decade)).sort((a, b) => b.localeCompare(a)), projects: MENU_PROJECT_IDS.map((id) => ({ id, name: projectMap.get(id).name })), platforms },
    projects, songs, releases, recordings, songLinks, bandcampEmbedRegistry, playerChannels: channels,
  };
  const serialized = `${JSON.stringify(data, null, 2)}\n`;
  for (const forbidden of ['source_spreadsheet_id', 'Source ID / Provenance', 'DevAI Exchange', 'JUNKFEATHERS_MUSIC_ARCHIVE_V03_CLIO_WORKING.xlsx']) if (serialized.includes(forbidden)) fail(`public artifact exposes private source material: ${forbidden}`);
  return { data, serialized };
}

export async function compileArchive(sourcePath, outputPath, basePath) {
  if (!sourcePath) fail('an explicit authorized v03.2 JSON path is required');
  const sourceBytes = await readFile(resolve(sourcePath));
  const hash = createHash('sha256').update(sourceBytes).digest('hex').toUpperCase();
  let source;
  try { source = JSON.parse(sourceBytes); } catch { fail('source is not valid JSON'); }
  const { rows, coverage } = validate(source, hash);
  const base = JSON.parse(await readFile(resolve(basePath ?? 'public/data/music-archive/v02/archive.json'), 'utf8'));
  if (base.meta?.schemaVersion !== 'music-archive-v02.0' || base.meta?.publicKnownSongs !== 215) fail('v02 rollback baseline mismatch');
  const { data, serialized } = buildPublicData(base, rows, hash, coverage);
  const summary = { schemaVersion: SCHEMA_VERSION, compilerVersion: COMPILER_VERSION, sourceVersion: data.meta.sourceVersion, sourceSha256: hash, sourceSheetCount: coverage.sourceSheets, status: 'valid', counts: data.meta.counts, coverage, publicKnownSongs: PUBLIC_KNOWN_SONGS, playerChannelContract: '165 concrete rows; 135 cassette + 30 VHS; stable IDs retained', bandcampPlaybackContract: '124 exact TRACK registry rows + 15 same-release ALBUM fallbacks; strict https://bandcamp.com/EmbeddedPlayer/ whitelist; no autoplay', rollbackArtifact: data.meta.rollbackArtifact, warnings: [], errors: [] };
  await mkdir(dirname(resolve(outputPath)), { recursive: true });
  await writeFile(resolve(outputPath), serialized, 'utf8');
  await writeFile(resolve(dirname(resolve(outputPath)), 'validation.json'), `${JSON.stringify(summary, null, 2)}\n`, 'utf8');
  return { data, summary, bytes: Buffer.byteLength(serialized) };
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  compileArchive(process.argv[2], resolve(process.argv[3] ?? 'public/data/music-archive/v03/archive.json'), process.argv[4]).then(({ summary, bytes }) => console.log(JSON.stringify({ ...summary, outputBytes: bytes }))).catch((error) => { console.error(error.message); process.exitCode = 1; });
}
