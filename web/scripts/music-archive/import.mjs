import { createHash } from 'node:crypto';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { inflateRawSync } from 'node:zlib';

export const COMPILER_VERSION = '1.0.0-beta.1';
export const SCHEMA_VERSION = 'music-archive-v01.1';
export const EXPECTED_SHA256 = '2BA6806D7D85A47BD8DB0529A0E029D2033999EBBF14D70D24525064AB6AF7FE';
export const EXPECTED_TABS = [
  'Overview', 'Releases', 'Recordings', 'Contributors', 'Credits', 'Links', 'Sources',
  'Timeline', 'Unresolved', 'Projects', 'Project Memberships', 'Compositions',
  'Project Repertoire', 'Performance Sources', 'Web Archive Evidence', 'Name Variants',
  'Events', 'Event Participants', 'Search Facets', 'Lineup Eras', 'Biography Timeline',
  'Song Index', 'Website v01 Contract',
];

const PUBLIC_COUNTS = { releases: 57, recordings: 276, songs: 197, knownSongs: 195, projects: 7, contributors: 39, links: 49 };
const textDecoder = new TextDecoder('utf-8');

function fail(message) {
  throw new Error(`ARCHIVE_VALIDATION_FAILED: ${message}`);
}

function unzip(buffer) {
  const files = new Map();
  let offset = 0;
  while (offset + 30 <= buffer.length && buffer.readUInt32LE(offset) === 0x04034b50) {
    const flags = buffer.readUInt16LE(offset + 6);
    const method = buffer.readUInt16LE(offset + 8);
    const compressedSize = buffer.readUInt32LE(offset + 18);
    const nameLength = buffer.readUInt16LE(offset + 26);
    const extraLength = buffer.readUInt16LE(offset + 28);
    if (flags & 0x08) fail('XLSX uses unsupported ZIP data descriptors');
    const name = buffer.subarray(offset + 30, offset + 30 + nameLength).toString('utf8');
    const dataStart = offset + 30 + nameLength + extraLength;
    const compressed = buffer.subarray(dataStart, dataStart + compressedSize);
    const data = method === 0 ? compressed : method === 8 ? inflateRawSync(compressed) : fail(`unsupported ZIP method ${method}`);
    files.set(name, data);
    offset = dataStart + compressedSize;
  }
  return files;
}

function xmlText(value = '') {
  return value
    .replace(/<[^>]+>/g, '')
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'").replace(/&amp;/g, '&')
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(parseInt(code, 16)));
}

function colName(address) {
  return address.match(/^[A-Z]+/)?.[0] ?? '';
}

function rowNumber(address) {
  return Number(address.match(/\d+$/)?.[0] ?? 0);
}

function parseWorkbook(buffer) {
  const zip = unzip(buffer);
  const get = (name) => {
    const file = zip.get(name);
    if (!file) fail(`missing XLSX package entry ${name}`);
    return textDecoder.decode(file);
  };
  const sharedStrings = [...get('xl/sharedStrings.xml').matchAll(/<(?:\w+:)?si\b[^>]*>([\s\S]*?)<\/(?:\w+:)?si>/g)]
    .map((match) => [...match[1].matchAll(/<(?:\w+:)?t\b[^>]*>([\s\S]*?)<\/(?:\w+:)?t>/g)].map((part) => xmlText(part[1])).join(''));
  const rels = new Map([...get('xl/_rels/workbook.xml.rels').matchAll(/<(?:\w+:)?Relationship\b([^>]+)\/?>(?:<\/(?:\w+:)?Relationship>)?/g)].map((match) => {
    const attrs = match[1];
    return [attrs.match(/Id="([^"]+)"/)?.[1], attrs.match(/Target="([^"]+)"/)?.[1]];
  }));
  const sheets = [...get('xl/workbook.xml').matchAll(/<(?:\w+:)?sheet\b([^>]+)\/?>(?:<\/(?:\w+:)?sheet>)?/g)].map((match) => {
    const attrs = match[1];
    const name = xmlText(attrs.match(/name="([^"]+)"/)?.[1] ?? '');
    const relation = attrs.match(/r:id="([^"]+)"/)?.[1];
    let target = rels.get(relation);
    if (!target) fail(`missing worksheet relationship for ${name}`);
    target = target.replace(/^\//, '');
    if (!target.startsWith('xl/')) target = `xl/${target}`;
    return { name, target };
  });

  const workbook = new Map();
  for (const sheet of sheets) {
    const xml = get(sheet.target);
    const cellMap = new Map();
    for (const match of xml.matchAll(/<(?:\w+:)?c\b([^>]*?)(?:\/>|>([\s\S]*?)<\/(?:\w+:)?c>)/g)) {
      const attrs = match[1];
      const body = match[2] ?? '';
      const address = attrs.match(/\br="([A-Z]+\d+)"/)?.[1];
      if (!address) continue;
      const type = attrs.match(/\bt="([^"]+)"/)?.[1] ?? 'n';
      const raw = body.match(/<(?:\w+:)?v>([\s\S]*?)<\/(?:\w+:)?v>/)?.[1];
      let value;
      if (type === 'inlineStr') value = [...body.matchAll(/<(?:\w+:)?t\b[^>]*>([\s\S]*?)<\/(?:\w+:)?t>/g)].map((part) => xmlText(part[1])).join('');
      else if (raw !== undefined && type === 's') value = sharedStrings[Number(raw)];
      else if (raw !== undefined && type === 'b') value = raw === '1';
      else if (raw !== undefined) value = Number.isFinite(Number(raw)) ? Number(raw) : xmlText(raw);
      if (value !== undefined) cellMap.set(address, { value, type });
    }
    const headers = new Map([...cellMap].filter(([address]) => rowNumber(address) === 1).map(([address, cell]) => [colName(address), String(cell.value)]));
    const rowMaps = new Map();
    for (const [address, cell] of cellMap) {
      const row = rowNumber(address);
      if (row <= 1) continue;
      if (!rowMaps.has(row)) rowMaps.set(row, {});
      rowMaps.get(row)[headers.get(colName(address)) ?? colName(address)] = cell.value;
    }
    workbook.set(sheet.name, { cellMap, rows: [...rowMaps].sort(([a], [b]) => a - b).map(([, row]) => row) });
  }
  return workbook;
}

function strings(value) {
  if (value === undefined || value === null || value === '') return [];
  return String(value).split(';').map((item) => item.trim()).filter(Boolean);
}

function excelDate(value) {
  if (typeof value !== 'number' || value < 20000) return value === undefined ? null : String(value);
  const epoch = Date.UTC(1899, 11, 30);
  return new Date(epoch + value * 86400000).toISOString().slice(0, 10);
}

function nullable(value) {
  return value === undefined || value === '' ? null : value;
}

function text(value) {
  return value === undefined || value === null ? '' : String(value);
}

function validateIdList(rows, field, known, context, allowedTokens = new Set()) {
  const tokenPattern = /^[A-Z][A-Z0-9]*(?:-[A-Z0-9]+)+$/;
  for (const row of rows) {
    for (const token of strings(row[field])) {
      const base = token.split(':')[0];
      if (allowedTokens.has(token) || allowedTokens.has(base)) continue;
      if (!tokenPattern.test(base)) fail(`${context} has malformed ${field}: ${token}`);
      if (!known.has(base)) fail(`${context} has broken ${field}: ${token}`);
    }
  }
}

function validate(workbook, hash) {
  const tabs = [...workbook.keys()];
  if (tabs.length !== EXPECTED_TABS.length || tabs.some((tab, index) => tab !== EXPECTED_TABS[index])) fail(`23-tab workbook contract mismatch: ${JSON.stringify(tabs)}`);
  const rows = Object.fromEntries([...workbook].map(([name, sheet]) => [name, sheet.rows]));
  const counts = {
    releases: rows.Releases.length,
    recordings: rows.Recordings.length,
    songs: rows['Song Index'].length,
    projects: rows.Projects.length,
    links: rows.Links.length,
  };
  const contributorIds = rows.Contributors.map((row) => text(row['Contributor ID']));
  counts.contributors = contributorIds.filter((id) => !['ART-001', 'CON-024'].includes(id)).length;
  const contractCells = workbook.get('Website v01 Contract').cellMap;
  counts.knownSongs = Number(contractCells.get('B8')?.value);
  for (const [key, expected] of Object.entries(PUBLIC_COUNTS)) if (counts[key] !== expected) fail(`${key} count ${counts[key]} does not match ${expected}`);
  if (Number(contractCells.get('B5')?.value) !== PUBLIC_COUNTS.releases || Number(contractCells.get('B6')?.value) !== PUBLIC_COUNTS.recordings || Number(contractCells.get('B7')?.value) !== PUBLIC_COUNTS.songs || Number(contractCells.get('B24')?.value) !== PUBLIC_COUNTS.projects || Number(contractCells.get('B25')?.value) !== PUBLIC_COUNTS.contributors || Number(contractCells.get('B26')?.value) !== PUBLIC_COUNTS.links) fail('Website v01.1 Contract count rows do not reconcile');

  const exact162 = [];
  for (const [sheetName, sheet] of workbook) for (const [address, cell] of sheet.cellMap) if (cell.value === 162 || cell.value === '162') exact162.push({ sheetName, address, ...cell });
  if (exact162.length !== 1 || exact162[0].sheetName !== 'Recordings' || exact162[0].address !== 'G205' || exact162[0].value !== 162 || exact162[0].type !== 'n') fail('exact-value 162 audit failed');
  if (workbook.get('Recordings').cellMap.get('F205')?.value !== '2:42') fail(`Recordings!G205 neighboring duration is not 2:42: ${JSON.stringify(workbook.get('Recordings').cellMap.get('F205'))}`);

  const primaryFields = {
    Releases: 'Release ID', Recordings: 'Recording ID', Contributors: 'Contributor ID', Credits: 'Credit ID', Links: 'Link ID', Sources: 'Source ID',
    Projects: 'Project ID', 'Project Memberships': 'Membership ID', Compositions: 'Composition ID', 'Project Repertoire': 'Repertoire ID',
    'Performance Sources': 'Performance Source ID', 'Web Archive Evidence': 'Archive Evidence ID', 'Name Variants': 'Variant ID', Events: 'Event ID',
    'Event Participants': 'Participation ID', 'Lineup Eras': 'Lineup Era ID', 'Biography Timeline': 'Bio Event ID', 'Song Index': 'Song ID',
  };
  const known = new Set();
  for (const [sheet, field] of Object.entries(primaryFields)) {
    const seen = new Set();
    for (const row of rows[sheet]) {
      const id = text(row[field]);
      if (!/^[A-Z][A-Z0-9]*(?:-[A-Z0-9]+)+$/.test(id)) fail(`${sheet} has malformed ${field}: ${id}`);
      if (seen.has(id)) fail(`${sheet} has duplicate ${field}: ${id}`);
      seen.add(id); known.add(id);
    }
  }
  validateIdList(rows.Releases, 'Project ID', known, 'Releases');
  validateIdList(rows.Recordings, 'Release ID', known, 'Recordings');
  validateIdList(rows.Recordings, 'Composition ID', known, 'Recordings');
  validateIdList(rows.Recordings, 'Project ID', known, 'Recordings');
  validateIdList(rows.Credits, 'Recording ID', known, 'Credits');
  validateIdList(rows.Credits, 'Release ID', known, 'Credits');
  validateIdList(rows.Credits, 'Contributor ID', known, 'Credits');
  validateIdList(rows['Project Memberships'], 'Project ID', known, 'Project Memberships');
  validateIdList(rows['Project Memberships'], 'Contributor ID', known, 'Project Memberships');
  validateIdList(rows['Project Repertoire'], 'Project ID', known, 'Project Repertoire');
  validateIdList(rows['Project Repertoire'], 'Composition ID', known, 'Project Repertoire');
  validateIdList(rows['Performance Sources'], 'Project ID', known, 'Performance Sources');
  validateIdList(rows['Performance Sources'], 'Release ID', known, 'Performance Sources');
  validateIdList(rows['Web Archive Evidence'], 'Project ID', known, 'Web Archive Evidence');
  validateIdList(rows['Name Variants'], 'Canonical Entity ID', known, 'Name Variants');
  validateIdList(rows.Events, 'Anchor Project ID', known, 'Events');
  validateIdList(rows.Events, 'Linked Release IDs', known, 'Events');
  validateIdList(rows.Events, 'Linked Performance Source IDs', known, 'Events');
  validateIdList(rows['Event Participants'], 'Event ID', known, 'Event Participants');
  validateIdList(rows['Event Participants'], 'Entity ID', known, 'Event Participants');
  validateIdList(rows['Lineup Eras'], 'Project ID', known, 'Lineup Eras');
  validateIdList(rows['Song Index'], 'Project IDs / Context', known, 'Song Index', new Set(['COLLAB']));
  validateIdList(rows['Song Index'], 'Known Appearance / Recording IDs', known, 'Song Index');
  validateIdList(rows['Song Index'], 'Composition IDs', known, 'Song Index');
  for (const [sheetName, sheetRows] of Object.entries(rows)) {
    const sourceFields = new Set(sheetRows.flatMap((row) => Object.keys(row)).filter((field) => /(?:^|Related )Source IDs$/.test(field)));
    for (const field of sourceFields) validateIdList(sheetRows, field, known, sheetName);
  }
  for (const row of rows.Links) {
    if (row['Entity Type'] !== 'Artist') validateIdList([row], 'Entity ID', known, `Links ${row['Link ID']}`);
    try {
      const url = new URL(text(row.URL));
      if (!['http:', 'https:'].includes(url.protocol)) fail(`Links ${row['Link ID']} uses a non-public URL protocol`);
    } catch { fail(`Links ${row['Link ID']} has malformed URL`); }
  }
  if (hash !== EXPECTED_SHA256) fail(`source SHA-256 ${hash} does not match frozen input`);
  return { rows, counts };
}

function buildPublicData(rows, counts, hash) {
  const excludedContributors = new Set(['ART-001', 'CON-024']);
  const contributors = rows.Contributors.filter((row) => !excludedContributors.has(row['Contributor ID'])).map((row) => ({
    id: row['Contributor ID'], name: row.Name, type: row.Type,
  }));
  const publicContributorIds = new Set(contributors.map((item) => item.id));
  const releases = rows.Releases.map((row) => ({
    id: row['Release ID'], projectId: nullable(row['Project ID']), artist: row['Primary Artist'], title: row['Release Title'], type: row['Release Type'],
    date: excelDate(row['Release Date']), datePrecision: nullable(row['Date Precision']), year: nullable(row.Year), trackCount: nullable(row['Track Count']),
    label: nullable(row['Label / Distributor']), evidence: row['Evidence Classification'], status: row['Archive Status'],
    canonicalIntent: nullable(row['Canonical Intent / Website Treatment']), distribution: nullable(row['Distribution / Variation Notes']), format: nullable(row['Format / Medium']),
  }));
  const releaseProjects = new Map(releases.map((release) => [release.id, release.projectId]));
  const recordings = rows.Recordings.map((row) => ({
    id: row['Recording ID'], releaseId: row['Release ID'], projectId: row['Project ID'] ?? releaseProjects.get(row['Release ID']) ?? null, compositionId: nullable(row['Composition ID']), title: row['Track Title'],
    version: nullable(row['Version Label']), duration: nullable(row.Duration), durationSeconds: nullable(row['Duration Seconds']), artist: row['Artist Credit'],
    featured: nullable(row['Featured / Co-credited Artist']), instrumental: nullable(row['Instrumental?']), leadVocal: nullable(row['Lead Vocal']), role: nullable(row['Jonathan Role']),
    recordingPeriod: nullable(row['Recording Period']), creationPeriod: nullable(row['Creation Period']), evidence: row['Evidence Classification'], status: row['Archive Status'],
  }));
  const projects = rows.Projects.map((row) => ({
    id: row['Project ID'], name: row['Project Name'], type: row['Project Type'], section: row['Archive Section'], period: nullable(row['Known Active Period']),
    datePrecision: nullable(row['Date Precision']), relationship: nullable(row['Jonathan Relationship / Role']), evidence: row['Evidence Classification'], status: row.Status,
  }));
  const credits = rows.Credits.filter((row) => publicContributorIds.has(row['Contributor ID'])).map((row) => ({
    id: row['Credit ID'], recordingId: nullable(row['Recording ID']), releaseId: nullable(row['Release ID']), contributorId: row['Contributor ID'],
    role: row['Credit Role'], instrument: nullable(row['Instrument / Function']), scope: row.Scope, evidence: row['Evidence Classification'],
  }));
  const links = rows.Links.map((row) => ({
    id: row['Link ID'], entityType: row['Entity Type'], entityId: row['Entity ID'], platform: row.Platform, type: row['Link Type'], url: row.URL,
  }));
  const events = rows.Events.map((row) => ({
    id: row['Event ID'], projectId: row['Anchor Project ID'], date: excelDate(row['Event Date']), datePrecision: nullable(row['Date Precision']), name: row['Event Name'],
    type: row['Event Type'], venue: nullable(row.Venue), city: nullable(row.City), region: nullable(row['Region / State']),
    releaseIds: strings(row['Linked Release IDs']), performanceSourceIds: strings(row['Linked Performance Source IDs']), evidence: row['Evidence Classification'], status: row.Status,
  }));
  const participants = rows['Event Participants'].map((row) => ({
    id: row['Participation ID'], eventId: row['Event ID'], entityType: row['Entity Type'], entityId: nullable(row['Entity ID']), name: row['Display Name / Act'],
    role: row['Participation Role'], instrument: nullable(row['Instrument / Stage Role']), setOrder: nullable(row['Set Order']), evidence: row['Evidence Classification'],
  }));
  const songs = rows['Song Index'].map((row) => ({
    id: row['Song ID'], title: row['Canonical Song Title'], aliases: strings(row['Search Aliases / Historical Titles']), projectIds: strings(row['Project IDs / Context']),
    projectNames: strings(row['Project Names / Context']), appearanceIds: strings(row['Known Appearance / Recording IDs']), appearanceCount: Number(row['Known Appearance Count'] ?? 0),
    relationship: row['Jonathan Relationship'], cover: row['Cover / External Composition?'] === 'Yes', personalCounterEligible: row['Personal Counter Eligible?'] === 'Yes',
    evidence: row['Evidence / Confidence'], compositionIds: strings(row['Composition IDs']),
  }));
  const data = {
    meta: { schemaVersion: SCHEMA_VERSION, compilerVersion: COMPILER_VERSION, sourceSha256: hash, publicKnownSongs: counts.knownSongs, counts },
    songs, recordings, releases, projects, contributors, credits, links, events, participants,
    facets: {
      entityTypes: ['song', 'release', 'project', 'event'],
      projects: projects.map(({ id, name }) => ({ id, name })),
      contributors: contributors.map(({ id, name }) => ({ id, name })),
      platforms: [...new Set(links.map((link) => link.platform))].sort((a, b) => a.localeCompare(b)),
      evidence: [...new Set([...songs.map((song) => song.evidence), ...releases.map((release) => release.evidence), ...events.map((event) => event.evidence)])].sort((a, b) => a.localeCompare(b)),
    },
  };
  const serialized = JSON.stringify(data, null, 2) + '\n';
  if (serialized.includes('"162"')) fail('generated archive contains forbidden exact text "162"');
  for (const forbidden of ['Sources', 'Unresolved', 'Correction Basis', 'Current Personal']) if (serialized.includes(`"${forbidden}"`)) fail(`generated archive exposes forbidden field ${forbidden}`);
  return { data, serialized };
}

export async function compileArchive(sourcePath, outputPath) {
  if (!sourcePath) fail('an explicit workbook path is required');
  const source = await readFile(resolve(sourcePath));
  const hash = createHash('sha256').update(source).digest('hex').toUpperCase();
  if (hash !== EXPECTED_SHA256) fail(`source SHA-256 ${hash} does not match frozen input`);
  const workbook = parseWorkbook(source);
  const { rows, counts } = validate(workbook, hash);
  const { data, serialized } = buildPublicData(rows, counts, hash);
  const summary = {
    schemaVersion: SCHEMA_VERSION, compilerVersion: COMPILER_VERSION, sourceSha256: hash, status: 'valid', counts,
    warnings: ['Name Variants excluded from v01.1 public output because publication status is intentionally conservative.', 'Internal notes and provenance sheets excluded by allowlist.'], errors: [],
  };
  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, serialized, 'utf8');
  await writeFile(resolve(dirname(outputPath), 'validation.json'), JSON.stringify(summary, null, 2) + '\n', 'utf8');
  return { data, summary, bytes: Buffer.byteLength(serialized) };
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const sourcePath = process.argv[2];
  const outputPath = resolve(process.argv[3] ?? 'public/data/music-archive/v01/archive.json');
  compileArchive(sourcePath, outputPath).then(({ summary, bytes }) => {
    console.log(JSON.stringify({ ...summary, outputBytes: bytes }));
  }).catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
