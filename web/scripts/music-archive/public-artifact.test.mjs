import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const archivePath = fileURLToPath(new URL('../../public/data/music-archive/v01/archive.json', import.meta.url));
const validationPath = fileURLToPath(new URL('../../public/data/music-archive/v01/validation.json', import.meta.url));
const archiveBytes = await readFile(archivePath);
const validationBytes = await readFile(validationPath);
const archive = JSON.parse(archiveBytes);
const validation = JSON.parse(validationBytes);
const expectedCounts = { releases: 57, recordings: 276, songs: 197, projects: 7, links: 49, contributors: 39, knownSongs: 195 };
const expectedSourceSha256 = '2BA6806D7D85A47BD8DB0529A0E029D2033999EBBF14D70D24525064AB6AF7FE';
const expectedArchiveSha256 = 'AC47425849FF5F59ADDC160032EA3E3CBA836E0CF77CEE1C7D25D450B99B8830';
const protectedNoSearchAliasSha256 = 'c280288ac0120155d2f2250e3ddbdbec91aa698a4ddb9b7e46c86ad45fd957de';
const idPattern = /^[A-Z][A-Z0-9]*(?:-[A-Z0-9]+)+$/;

const publicFields = {
  songs: ['aliases', 'appearanceCount', 'appearanceIds', 'compositionIds', 'cover', 'evidence', 'id', 'personalCounterEligible', 'projectIds', 'projectNames', 'relationship', 'title'],
  recordings: ['artist', 'compositionId', 'creationPeriod', 'duration', 'durationSeconds', 'evidence', 'featured', 'id', 'instrumental', 'leadVocal', 'projectId', 'recordingPeriod', 'releaseId', 'role', 'status', 'title', 'version'],
  releases: ['artist', 'canonicalIntent', 'date', 'datePrecision', 'distribution', 'evidence', 'format', 'id', 'label', 'projectId', 'status', 'title', 'trackCount', 'type', 'year'],
  projects: ['datePrecision', 'evidence', 'id', 'name', 'period', 'relationship', 'section', 'status', 'type'],
  contributors: ['id', 'name', 'type'],
  credits: ['contributorId', 'evidence', 'id', 'instrument', 'recordingId', 'releaseId', 'role', 'scope'],
  links: ['entityId', 'entityType', 'id', 'platform', 'type', 'url'],
  events: ['city', 'date', 'datePrecision', 'evidence', 'id', 'name', 'performanceSourceIds', 'projectId', 'region', 'releaseIds', 'status', 'type', 'venue'],
  participants: ['entityId', 'entityType', 'eventId', 'evidence', 'id', 'instrument', 'name', 'role', 'setOrder'],
};

const sorted = (values) => [...values].sort((a, b) => a.localeCompare(b));
const ids = (values) => new Set(values.map((value) => value.id));
const normalize = (value) => String(value ?? '').normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
const sha256 = (value) => createHash('sha256').update(value).digest('hex');
const publicStrings = (value, result = []) => {
  if (typeof value === 'string') result.push(value);
  else if (Array.isArray(value)) value.forEach((item) => publicStrings(item, result));
  else if (value && typeof value === 'object') Object.values(value).forEach((item) => publicStrings(item, result));
  return result;
};
const searchIds = (group, query) => archive[group]
  .filter((item) => normalize(Object.values(item).flat(Infinity).join(' ')).includes(normalize(query)))
  .map((item) => item.id);

test('public artifacts have frozen identities and contract counts', () => {
  assert.equal(sha256(archiveBytes).toUpperCase(), expectedArchiveSha256);
  assert.equal(archive.meta.sourceSha256, expectedSourceSha256);
  assert.equal(validation.sourceSha256, expectedSourceSha256);
  assert.deepEqual(archive.meta.counts, expectedCounts);
  assert.deepEqual(validation.counts, expectedCounts);
  assert.equal(archive.meta.publicKnownSongs, 195);
  assert.equal(archive.releases.length, 57);
  assert.equal(archive.recordings.length, 276);
  assert.equal(archive.songs.length, 197);
  assert.equal(archive.projects.length, 7);
  assert.equal(archive.contributors.length, 39);
  assert.equal(archive.links.length, 49);
});

test('compiler public-field allowlist is exact', () => {
  assert.deepEqual(Object.keys(archive), ['meta', 'songs', 'recordings', 'releases', 'projects', 'contributors', 'credits', 'links', 'events', 'participants', 'facets']);
  assert.deepEqual(sorted(Object.keys(archive.meta)), sorted(['schemaVersion', 'compilerVersion', 'sourceSha256', 'publicKnownSongs', 'counts']));
  assert.deepEqual(sorted(Object.keys(archive.facets)), sorted(['entityTypes', 'projects', 'contributors', 'platforms', 'evidence']));
  assert.deepEqual(archive.facets.entityTypes, ['song', 'release', 'project', 'event']);
  for (const [group, fields] of Object.entries(publicFields)) {
    for (const item of archive[group]) assert.deepEqual(sorted(Object.keys(item)), fields, `${group} ${item.id} public fields`);
  }
  for (const item of archive.facets.projects) assert.deepEqual(sorted(Object.keys(item)), ['id', 'name']);
  for (const item of archive.facets.contributors) assert.deepEqual(sorted(Object.keys(item)), ['id', 'name']);
});

test('all public IDs are stable, well formed, and unique', () => {
  const allIds = [];
  for (const group of Object.keys(publicFields)) {
    const groupIds = archive[group].map((item) => item.id);
    assert.equal(new Set(groupIds).size, groupIds.length, `${group} IDs are unique`);
    for (const id of groupIds) assert.match(id, idPattern, `${group} ID ${id}`);
    allIds.push(...groupIds);
  }
  assert.equal(new Set(allIds).size, allIds.length, 'IDs are globally unique');
});

test('all public relationships resolve or use an explicit public token', () => {
  const releases = ids(archive.releases);
  const recordings = ids(archive.recordings);
  const projects = ids(archive.projects);
  const contributors = ids(archive.contributors);
  const events = ids(archive.events);

  for (const release of archive.releases) assert.ok(release.projectId === null || release.projectId === 'COLLAB' || projects.has(release.projectId), `${release.id} projectId`);
  for (const recording of archive.recordings) {
    assert.ok(releases.has(recording.releaseId), `${recording.id} releaseId`);
    assert.ok(recording.projectId === null || recording.projectId === 'COLLAB' || projects.has(recording.projectId), `${recording.id} projectId`);
    if (recording.compositionId !== null) assert.match(recording.compositionId, idPattern, `${recording.id} compositionId`);
  }
  for (const song of archive.songs) {
    for (const projectId of song.projectIds) assert.ok(projectId === 'COLLAB' || projects.has(projectId), `${song.id} projectId ${projectId}`);
    for (const appearanceId of song.appearanceIds) {
      const base = appearanceId.split(':')[0];
      assert.ok(recordings.has(base) || releases.has(base), `${song.id} appearanceId ${appearanceId}`);
    }
    for (const compositionId of song.compositionIds) assert.match(compositionId, idPattern, `${song.id} compositionId ${compositionId}`);
  }
  for (const credit of archive.credits) {
    assert.ok(contributors.has(credit.contributorId), `${credit.id} contributorId`);
    assert.ok(credit.recordingId === null || recordings.has(credit.recordingId), `${credit.id} recordingId`);
    assert.ok(credit.releaseId === null || releases.has(credit.releaseId), `${credit.id} releaseId`);
  }
  for (const link of archive.links) {
    if (link.entityType === 'Release') assert.ok(releases.has(link.entityId), `${link.id} release`);
    else if (link.entityType === 'Recording') assert.ok(recordings.has(link.entityId), `${link.id} recording`);
    else if (link.entityType === 'Project') assert.ok(projects.has(link.entityId), `${link.id} project`);
    else if (link.entityType === 'Artist') assert.equal(link.entityId, 'Junkfeathers', `${link.id} public artist token`);
    else assert.fail(`${link.id} has unsupported entity type ${link.entityType}`);
  }
  for (const event of archive.events) {
    assert.ok(projects.has(event.projectId), `${event.id} projectId`);
    for (const releaseId of event.releaseIds) assert.ok(releases.has(releaseId), `${event.id} releaseId ${releaseId}`);
    for (const sourceId of event.performanceSourceIds) assert.match(sourceId, idPattern, `${event.id} performance source ${sourceId}`);
  }
  for (const participant of archive.participants) {
    assert.ok(events.has(participant.eventId), `${participant.id} eventId`);
    if (participant.entityId !== null) {
      if (participant.entityType === 'Project') assert.ok(projects.has(participant.entityId), `${participant.id} project entity`);
      else if (participant.entityType === 'Person') assert.ok(contributors.has(participant.entityId), `${participant.id} contributor entity`);
      else assert.fail(`${participant.id} has an unexpected nonblank entityId`);
    }
  }
  assert.deepEqual(archive.facets.projects.map((item) => item.id), archive.projects.map((item) => item.id));
  assert.deepEqual(archive.facets.contributors.map((item) => item.id), archive.contributors.map((item) => item.id));
});

test('every nonblank public URL is valid HTTP(S)', () => {
  for (const link of archive.links) {
    assert.equal(typeof link.url, 'string', `${link.id} URL type`);
    assert.ok(link.url.trim(), `${link.id} URL is nonblank`);
    const url = new URL(link.url);
    assert.ok(['http:', 'https:'].includes(url.protocol), `${link.id} URL protocol`);
    assert.ok(url.hostname, `${link.id} URL hostname`);
  }
});

test('representative public searches resolve to frozen IDs', () => {
  assert.deepEqual(searchIds('songs', 'Witches and Goblins'), ['SONG-0179']);
  assert.deepEqual(searchIds('songs', 'You Did Roll Your Eyes'), ['SONG-0169']);
  assert.deepEqual(searchIds('projects', 'Floob'), ['PRJ-BAND-002']);
  assert.deepEqual(searchIds('releases', 'Captain Tulip'), ['REL-SOLO-001', 'REL-SOLO-020']);
  assert.deepEqual(searchIds('contributors', 'Michal Towber'), ['CON-003']);
  assert.deepEqual(searchIds('events', 'Magic Bean'), ['EV-FLOOB-005', 'EV-FLOOB-006', 'EV-FLOOB-015']);
  assert.deepEqual(searchIds('links', 'Spotify'), ['LNK-036']);
});

test('private workbook material and protected identities are absent', () => {
  const serializedArchive = archiveBytes.toString('utf8');
  const serializedArtifacts = `${serializedArchive}\n${validationBytes.toString('utf8')}`;
  const forbiddenArchiveTerms = [
    '"Sources"', '"Unresolved"', '"Name Variants"', '"Source IDs"', '"Notes"',
    'Correction Basis', 'Search Alias?', 'Public Display?', 'ARCHIVE_WORKBOOK',
  ];
  for (const term of forbiddenArchiveTerms) assert.equal(serializedArchive.includes(term), false, `must exclude ${term}`);
  for (const contributorId of ['ART-001', 'CON-024']) assert.equal(serializedArchive.includes(contributorId), false, `must exclude ${contributorId}`);

  const protectedHashes = new Set(publicStrings(archive).map((value) => sha256(value.normalize('NFKC').trim())));
  assert.equal(protectedHashes.has(protectedNoSearchAliasSha256), false, 'Search Alias? = No and protected later/current identity must be excluded');

  const forbiddenFileOrPathPatterns = [
    /JUNKFEATHERS_MUSIC_ARCHIVE/i, /CORRECTION_LEDGER/i, /\.xlsx\b/i, /\.xls\b/i,
    /[A-Z]:[\\/](?:Users|Documents|ProgramData|Windows)[\\/]/i, /(?:^|["'\s])\/(?:Users|home|var|tmp)\//i,
    /DevAI Exchange/i,
  ];
  for (const pattern of forbiddenFileOrPathPatterns) assert.doesNotMatch(serializedArtifacts, pattern);

  const forbiddenSecretPatterns = [
    /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,
    /\b(?:password|passwd|secret|private[_ -]?key|api[_ -]?key|access[_ -]?token)\b\s*[:=]\s*["']?[^\s"']+/i,
    /\bsk-[A-Za-z0-9_-]{20,}\b/,
  ];
  for (const pattern of forbiddenSecretPatterns) assert.doesNotMatch(serializedArtifacts, pattern);
});
