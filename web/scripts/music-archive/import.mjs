import { createHash } from 'node:crypto';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

export const COMPILER_VERSION = '2.0.0-beta.1';
export const SCHEMA_VERSION = 'music-archive-v02.0';
export const EXPECTED_SHA256 = '7F3D648B6EFB0B65E2AD24AB0761DA481A6934D193B1B523344A5429F8633710';
export const EXPECTED_SHEETS = [
  'Overview', 'Releases', 'Recordings', 'Contributors', 'Credits', 'Links', 'Sources',
  'Timeline', 'Unresolved', 'Projects', 'Project Memberships', 'Compositions',
  'Project Repertoire', 'Performance Sources', 'Web Archive Evidence', 'Name Variants',
  'Events', 'Event Participants', 'Search Facets', 'Lineup Eras', 'Biography Timeline',
  'Song Index', 'Website v01 Contract', 'Website v02 Contract', 'Contributor Ranking',
  'Song Contributions', 'Song Links', 'Archive Card Credits',
];

const PUBLIC_KNOWN_SONGS = 215;
const EXPECTED_PROJECTS = [
  ['PRJ-SOLO-001', 'Junkfeathers'],
  ['PRJ-BAND-001', 'Zero'],
  ['PRJ-BAND-002', 'Floob'],
  ['PRJ-BAND-003', 'Leadership Class'],
  ['PRJ-PROJ-001', 'Bitfeathers'],
  ['PRJ-BAND-004', 'Nora and Gnoll'],
  ['PRJ-BAND-005', 'Spoke Pants of the Flowering Skillet'],
];
const MENU_PROJECT_IDS = EXPECTED_PROJECTS.map(([id]) => id).filter((id) => id !== 'PRJ-PROJ-001');
const CONTEXTS = ['Solo', 'Band', 'Collaboration', 'Acoustic', 'Instrumental'];
const MEDIA_ORDER = ['Bandcamp', 'YouTube', 'Spotify', 'Apple Music', 'Amazon Music'];

function fail(message) {
  throw new Error(`ARCHIVE_VALIDATION_FAILED: ${message}`);
}

function text(value) {
  return value === undefined || value === null ? '' : String(value).trim();
}

function nullable(value) {
  const valueText = text(value);
  return valueText ? valueText : null;
}

function strings(value) {
  return text(value).split(';').map((item) => item.trim()).filter(Boolean);
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function normalizeDate(value) {
  const valueText = text(value);
  if (!valueText) return null;
  const isoPrefix = valueText.match(/^(\d{4}-\d{2}-\d{2})(?:[ T]00:00:00)?$/);
  return isoPrefix ? isoPrefix[1] : valueText;
}

function normalizeYear(value, date) {
  const numeric = Number(value);
  if (Number.isFinite(numeric) && numeric >= 1000 && numeric <= 9999) return String(Math.trunc(numeric));
  const valueText = text(value);
  if (/^\d{4}$/.test(valueText)) return valueText;
  return text(date).match(/^\d{4}/)?.[0] ?? null;
}

function parseMetadata(value) {
  const valueText = text(value);
  if (!valueText) return {};
  try {
    const parsed = JSON.parse(valueText);
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
  } catch {
    return {};
  }
}

function contextValues(value) {
  const valueText = text(value);
  if (!valueText) return [];
  const fallback = valueText.startsWith('=') ? valueText.match(/,"([^"]*)"\)$/)?.[1] ?? '' : valueText;
  return strings(fallback);
}

function rowsFrom(source, sheetName) {
  const raw = source.sheets?.[sheetName];
  if (!Array.isArray(raw) || !Array.isArray(raw[0])) fail(`missing or malformed ${sheetName} sheet`);
  const headers = raw[0].map(text);
  if (!headers.length || headers.some((header) => !header)) fail(`${sheetName} has an invalid header row`);
  return raw.slice(1).filter((row) => Array.isArray(row) && row.some((cell) => text(cell))).map((row) => Object.fromEntries(headers.map((header, index) => [header, row[index]])));
}

function validateUniqueIds(rows, field, sheetName) {
  const ids = rows.map((row) => text(row[field]));
  if (ids.some((id) => !/^[A-Z][A-Z0-9]*(?:-[A-Z0-9]+)+$/.test(id))) fail(`${sheetName} has a malformed ${field}`);
  if (new Set(ids).size !== ids.length) fail(`${sheetName} has duplicate ${field} values`);
  return ids;
}

function validateUrl(value, context) {
  try {
    const url = new URL(text(value));
    if (!['http:', 'https:'].includes(url.protocol) || !url.hostname) fail(`${context} has a non-public URL`);
  } catch {
    fail(`${context} has a malformed URL`);
  }
}

function sourceRows(source) {
  return Object.fromEntries([
    'Releases', 'Recordings', 'Projects', 'Links', 'Name Variants', 'Song Index',
    'Song Links', 'Archive Card Credits',
  ].map((name) => [name, rowsFrom(source, name)]));
}

function validate(source, hash) {
  if (hash !== EXPECTED_SHA256) fail(`source SHA-256 ${hash} does not match corrected frozen R1 input`);
  if (source.source_title !== 'JUNKFEATHERS MUSIC ARCHIVE V02 — FROZEN') fail('source title mismatch');
  if (source.source_version !== 'v02-frozen-2026-08-11') fail('source version mismatch');
  const sheets = Object.keys(source.sheets ?? {});
  if (sheets.length !== EXPECTED_SHEETS.length || sheets.some((name, index) => name !== EXPECTED_SHEETS[index])) fail(`28-sheet contract mismatch: ${JSON.stringify(sheets)}`);

  const rows = sourceRows(source);
  const releaseIds = new Set(validateUniqueIds(rows.Releases, 'Release ID', 'Releases'));
  const recordingIds = new Set(validateUniqueIds(rows.Recordings, 'Recording ID', 'Recordings'));
  const projectIds = validateUniqueIds(rows.Projects, 'Project ID', 'Projects');
  const songIds = validateUniqueIds(rows['Song Index'], 'Song ID', 'Song Index');
  const cardIds = validateUniqueIds(rows['Archive Card Credits'], 'Song ID', 'Archive Card Credits');
  validateUniqueIds(rows.Links, 'Link ID', 'Links');
  const songLinkIds = validateUniqueIds(rows['Song Links'], 'Song Link ID', 'Song Links');

  if (rows.Releases.length !== 59 || rows.Recordings.length !== 320 || rows.Projects.length !== 7 || rows['Song Index'].length !== 220 || rows['Archive Card Credits'].length !== 220) fail('frozen v02 core row count mismatch');
  if (songIds.some((id, index) => id !== cardIds[index])) fail('Archive Card Credits does not align with Song Index IDs');
  if (EXPECTED_PROJECTS.some(([id, name], index) => projectIds[index] !== id || text(rows.Projects[index]['Project Name']) !== name)) fail('project identity/order mismatch');

  const expectedSongLinkIds = Array.from({ length: 619 }, (_, index) => `SLNK-${String(index + 1).padStart(4, '0')}`);
  if (songLinkIds.length !== 619 || songLinkIds.some((id, index) => id !== expectedSongLinkIds[index])) fail('Song Link IDs are not continuous SLNK-0001 through SLNK-0619');

  const songIdSet = new Set(songIds);
  const projectIdSet = new Set(projectIds);
  for (const row of rows.Recordings) {
    const releaseId = text(row['Release ID']);
    if (releaseId && !releaseIds.has(releaseId)) fail(`recording ${row['Recording ID']} has an unknown release`);
    const projectId = text(row['Project ID']);
    if (projectId && projectId !== 'COLLAB' && !projectIdSet.has(projectId)) fail(`recording ${row['Recording ID']} has an unknown project`);
  }
  for (const row of rows['Song Index']) {
    for (const projectId of strings(row['Project IDs / Context'])) if (projectId !== 'COLLAB' && !projectIdSet.has(projectId)) fail(`${row['Song ID']} has an unknown project`);
    for (const appearance of strings(row['Known Appearance / Recording IDs'])) {
      const id = appearance.split(':')[0];
      if (!recordingIds.has(id) && !releaseIds.has(id)) fail(`${row['Song ID']} has an unknown appearance ${appearance}`);
    }
  }
  for (const row of rows['Song Links']) {
    if (!songIdSet.has(text(row['Song ID']))) fail(`${row['Song Link ID']} has an unknown Song ID`);
    validateUrl(row.URL, row['Song Link ID']);
  }
  for (const row of rows.Links) validateUrl(row.URL, row['Link ID']);

  const contexts = rows['Archive Card Credits'].flatMap((row) => contextValues(row['Music Context Tags']));
  if (contexts.some((context) => !CONTEXTS.includes(context))) fail(`Archive Card Credits contains an unsupported Music Context value`);
  const missingContext = CONTEXTS.find((context) => !contexts.includes(context));
  if (missingContext) fail(`Archive Card Credits is missing Music Context ${missingContext}`);

  const eligibility = rows['Song Index'].map((row) => text(row['Personal Counter Eligible?']));
  if (eligibility.filter((value) => value === 'Yes').length !== PUBLIC_KNOWN_SONGS || eligibility.filter((value) => value === 'No').length !== 4 || eligibility.filter((value) => value.startsWith('Pending')).length !== 1) fail('215 Yes + 4 No + 1 pending Song Index contract mismatch');
  const ode = rows['Song Index'].find((row) => row['Canonical Song Title'] === 'Ode to Shawn');
  if (!ode || text(ode['Personal Counter Eligible?']) !== 'Pending — historical track identity unresolved') fail('Ode to Shawn pending/exclusion rule mismatch');

  return rows;
}

function buildPublicData(source, rows, hash) {
  const projects = rows.Projects.map((row) => ({
    id: text(row['Project ID']),
    name: text(row['Project Name']),
    type: text(row['Project Type']),
    section: text(row['Archive Section']),
    period: nullable(row['Known Active Period']),
    datePrecision: nullable(row['Date Precision']),
    relationship: nullable(row['Jonathan Relationship / Role']),
    status: text(row.Status),
  }));

  const releases = rows.Releases.map((row) => {
    const date = normalizeDate(row['Release Date']);
    return {
      id: text(row['Release ID']),
      projectId: nullable(row['Project ID']),
      artist: text(row['Primary Artist']),
      title: text(row['Release Title']),
      type: text(row['Release Type']),
      date,
      year: normalizeYear(row.Year, date),
      datePrecision: nullable(row['Date Precision']),
      status: text(row['Archive Status']),
    };
  });
  const releaseMap = new Map(releases.map((release) => [release.id, release]));

  const recordings = rows.Recordings.map((row) => ({
    id: text(row['Recording ID']),
    releaseId: nullable(row['Release ID']),
    projectId: nullable(row['Project ID']) ?? releaseMap.get(text(row['Release ID']))?.projectId ?? null,
    title: text(row['Track Title']),
    version: nullable(row['Version Label']),
    duration: nullable(row.Duration),
    artist: text(row['Artist Credit']),
    featured: nullable(row['Featured / Co-credited Artist']),
    instrumental: nullable(row['Instrumental?']),
    leadVocal: nullable(row['Lead Vocal']),
    recordingPeriod: nullable(row['Recording Period']),
    creationPeriod: nullable(row['Creation Period']),
    status: text(row['Archive Status']),
  }));
  const recordingMap = new Map(recordings.map((recording) => [recording.id, recording]));

  const songLinks = rows['Song Links'].map((row) => {
    const metadata = parseMetadata(row['Embed / Player Metadata']);
    return {
      id: text(row['Song Link ID']),
      songId: text(row['Song ID']),
      platform: text(row.Platform),
      priority: Number(row['Platform Priority']) || MEDIA_ORDER.indexOf(text(row.Platform)) + 1 || 99,
      url: text(row.URL),
      linkLevel: text(row['Link Level']),
      sourceEntityId: nullable(row['Source Entity ID']),
      releaseId: nullable(row['Release ID']),
      releaseTitle: nullable(row['Release Title']),
      releaseDate: normalizeDate(row['Release Date']),
      datePrecision: nullable(row['Date Precision']),
      status: text(row.Status),
      mediaId: nullable(row['Platform Media ID']),
      embedUrl: nullable(metadata.embed_url),
      artworkUrl: nullable(row['Artwork URL']),
      supportContext: nullable(row['Purchase / Support Context']),
      resolutionConfidence: nullable(row['Resolution Confidence']),
    };
  }).sort((left, right) => left.songId.localeCompare(right.songId) || left.priority - right.priority || left.id.localeCompare(right.id));
  const linksBySong = new Map();
  for (const link of songLinks) linksBySong.set(link.songId, [...(linksBySong.get(link.songId) ?? []), link]);

  const compositionAliases = new Map();
  for (const row of rows['Name Variants']) {
    const canonicalId = text(row['Canonical Entity ID']);
    if (!canonicalId.startsWith('CMP-') || text(row['Search Alias?']) !== 'Yes') continue;
    compositionAliases.set(canonicalId, [...(compositionAliases.get(canonicalId) ?? []), text(row['Variant Name'])]);
  }
  const cards = new Map(rows['Archive Card Credits'].map((row) => [text(row['Song ID']), row]));

  const songs = rows['Song Index'].map((row) => {
    const id = text(row['Song ID']);
    const card = cards.get(id);
    if (!card) fail(`missing Archive Card Credits for ${id}`);
    const appearanceIds = strings(row['Known Appearance / Recording IDs']);
    const appearanceBases = appearanceIds.map((value) => value.split(':')[0]);
    const recordingIds = unique([
      ...appearanceBases.filter((value) => recordingMap.has(value)),
      ...(linksBySong.get(id) ?? []).map((link) => link.sourceEntityId).filter((value) => recordingMap.has(value)),
    ]);
    const releaseIds = unique([
      ...appearanceBases.filter((value) => releaseMap.has(value)),
      ...recordingIds.map((value) => recordingMap.get(value)?.releaseId),
      ...(linksBySong.get(id) ?? []).flatMap((link) => [link.releaseId, releaseMap.has(link.sourceEntityId) ? link.sourceEntityId : null]),
    ]).filter((value) => releaseMap.has(value));
    const aliases = unique([
      ...strings(row['Search Aliases / Historical Titles']),
      nullable(card['Alternate / Historical Title']),
      ...strings(row['Composition IDs']).flatMap((compositionId) => compositionAliases.get(compositionId) ?? []),
    ]).filter((alias) => alias !== text(row['Canonical Song Title']));
    const projectIds = strings(row['Project IDs / Context']).filter((value) => value !== 'COLLAB');
    const releaseSummaries = releaseIds.map((releaseId) => releaseMap.get(releaseId)).filter(Boolean).sort((left, right) => {
      const leftYear = Number(left.year ?? '9999');
      const rightYear = Number(right.year ?? '9999');
      return leftYear - rightYear || text(left.date).localeCompare(text(right.date)) || left.id.localeCompare(right.id);
    });
    const primaryRelease = releaseSummaries.find((release) => release.date || release.year) ?? null;
    return {
      id,
      title: text(row['Canonical Song Title']),
      aliases,
      projectIds,
      projectNames: projectIds.map((projectId) => projects.find((project) => project.id === projectId)?.name).filter(Boolean),
      appearanceIds,
      recordingIds,
      releaseIds,
      linkIds: (linksBySong.get(id) ?? []).map((link) => link.id),
      appearanceCount: Number(row['Known Appearance Count']) || 0,
      relationship: text(row['Jonathan Relationship']),
      eligibility: text(row['Personal Counter Eligible?']),
      alternateTitle: nullable(card['Alternate / Historical Title']),
      writing: nullable(card['Songwriter / Co-writer']),
      lyrics: nullable(card['Lyrics / Lyrical Contribution']),
      vocal: nullable(card['Vocal / Instrumental']),
      acoustic: text(card['Acoustic?']) === 'Yes',
      creditStatus: text(card['Credit Status']),
      linerNotes: nullable(card['Founder Liner Notes / Story']),
      decade: nullable(card['Decade / Era']),
      contexts: contextValues(card['Music Context Tags']),
      date: primaryRelease ? {
        value: primaryRelease.date ?? primaryRelease.year,
        precision: primaryRelease.datePrecision,
        releaseId: primaryRelease.id,
      } : null,
    };
  });

  const latestReleaseId = 'REL-SOLO-018';
  const latestSongIds = songs.filter((song) => song.releaseIds.includes(latestReleaseId)).map((song) => song.id);
  const decades = unique(songs.map((song) => song.decade)).sort((left, right) => right.localeCompare(left));
  const platforms = unique(songLinks.map((link) => link.platform)).sort((left, right) => {
    const leftPriority = MEDIA_ORDER.indexOf(left);
    const rightPriority = MEDIA_ORDER.indexOf(right);
    if (leftPriority >= 0 || rightPriority >= 0) return (leftPriority < 0 ? MEDIA_ORDER.length : leftPriority) - (rightPriority < 0 ? MEDIA_ORDER.length : rightPriority);
    return left.localeCompare(right);
  });
  const data = {
    meta: {
      schemaVersion: SCHEMA_VERSION,
      compilerVersion: COMPILER_VERSION,
      sourceVersion: source.source_version,
      integrityRevision: 'R1-2026-08-12',
      sourceSha256: hash,
      publicKnownSongs: PUBLIC_KNOWN_SONGS,
      counts: {
        releases: releases.length,
        recordings: recordings.length,
        songs: songs.length,
        projects: projects.length,
        songLinks: songLinks.length,
      },
      latestView: { projectId: 'PRJ-SOLO-001', releaseId: latestReleaseId, releaseTitle: releaseMap.get(latestReleaseId)?.title ?? 'Latest Junkfeathers', songIds: latestSongIds },
    },
    facets: {
      decades,
      projects: MENU_PROJECT_IDS.map((id) => {
        const project = projects.find((item) => item.id === id);
        return { id: project.id, name: project.name };
      }),
      platforms,
    },
    projects,
    songs,
    releases,
    recordings,
    songLinks,
  };

  const serialized = `${JSON.stringify(data, null, 2)}\n`;
  for (const forbidden of ['SOURCE/archive_v02_frozen_r1.json', 'JUNKFEATHERS_MUSIC_ARCHIVE_V02_FROZEN_R1.xlsx', 'DevAI Exchange', 'Later/current personal name — internal provenance only']) {
    if (serialized.includes(forbidden)) fail(`generated archive exposes forbidden source material: ${forbidden}`);
  }
  return { data, serialized };
}

export async function compileArchive(sourcePath, outputPath) {
  if (!sourcePath) fail('an explicit corrected frozen R1 JSON path is required');
  const sourceBytes = await readFile(resolve(sourcePath));
  const hash = createHash('sha256').update(sourceBytes).digest('hex').toUpperCase();
  if (hash !== EXPECTED_SHA256) fail(`source SHA-256 ${hash} does not match corrected frozen R1 input`);
  let source;
  try { source = JSON.parse(sourceBytes); } catch { fail('source is not valid JSON'); }
  const rows = validate(source, hash);
  const { data, serialized } = buildPublicData(source, rows, hash);
  const summary = {
    schemaVersion: SCHEMA_VERSION,
    compilerVersion: COMPILER_VERSION,
    sourceVersion: source.source_version,
    integrityRevision: 'R1-2026-08-12',
    sourceSha256: hash,
    status: 'valid',
    counts: data.meta.counts,
    publicKnownSongs: PUBLIC_KNOWN_SONGS,
    songLinkContinuity: 'SLNK-0001..SLNK-0619',
    warnings: [],
    errors: [],
  };
  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, serialized, 'utf8');
  await writeFile(resolve(dirname(outputPath), 'validation.json'), `${JSON.stringify(summary, null, 2)}\n`, 'utf8');
  return { data, summary, bytes: Buffer.byteLength(serialized) };
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const sourcePath = process.argv[2];
  const outputPath = resolve(process.argv[3] ?? 'public/data/music-archive/v02/archive.json');
  compileArchive(sourcePath, outputPath).then(({ summary, bytes }) => {
    console.log(JSON.stringify({ ...summary, outputBytes: bytes }));
  }).catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
