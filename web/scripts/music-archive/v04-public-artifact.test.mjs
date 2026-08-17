import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { compileArchive, EXPECTED_SHA256 } from './import-v04.mjs';

const archivePath = fileURLToPath(new URL('../../public/data/music-archive/v04/archive.json', import.meta.url));
const validationPath = fileURLToPath(new URL('../../public/data/music-archive/v04/validation.json', import.meta.url));
const rollbackPath = fileURLToPath(new URL('../../public/data/music-archive/v03/archive.json', import.meta.url));
const sourcePath = fileURLToPath(new URL('../../../.exchange-archive-v04-multimedia-machine/SOURCE/archive_v04_completion_working_master_2026-08-16.json', import.meta.url));
const archiveBytes = await readFile(archivePath);
const validationBytes = await readFile(validationPath);
const archive = JSON.parse(archiveBytes);
const validation = JSON.parse(validationBytes);
const rollback = JSON.parse(await readFile(rollbackPath));
const expectedPlayerIds = Array.from({ length: 412 }, (_, index) => index + 1)
  .filter((number) => ![10, 11, 17].includes(number))
  .map((number) => `PCH-${String(number).padStart(4, '0')}`);

test('v04 uses the exact immutable source and retains v03.2 as rollback', () => {
  assert.equal(archive.meta.schemaVersion, 'music-archive-v04.0');
  assert.equal(archive.meta.sourceVersion, 'v04-handoff-2026-08-16');
  assert.equal(archive.meta.sourceSheetCount, 35);
  assert.equal(archive.meta.sourceSha256, EXPECTED_SHA256);
  assert.equal(validation.sourceSha256, EXPECTED_SHA256);
  assert.equal(archive.meta.rollbackArtifact, '/data/music-archive/v03/archive.json');
  assert.equal(rollback.meta.schemaVersion, 'music-archive-v03.2');
  assert.equal(rollback.meta.counts.playerChannels, 165);
  assert.deepEqual(archive.meta.counts, {
    releases: 59, recordings: 333, songs: 220, projects: 7, songLinks: 640, playerChannels: 409, lyrics: 147, bandcampEmbedRegistry: 139,
  });
  assert.equal(archive.meta.coverage.cassetteChannels, 263);
  assert.equal(archive.meta.coverage.vhsChannels, 146);
  assert.equal(archive.meta.coverage.p0Media, 0);
  assert.equal(archive.meta.coverage.p1Lyrics, 80);
  assert.equal(archive.meta.coverage.p2CreditsMetadata, 140);
  assert.equal(archive.meta.publicKnownSongs, 215);
});

test('repeat v04 generation is byte-identical', async () => {
  const root = await mkdtemp(join(tmpdir(), 'jf-archive-v04-'));
  try {
    const first = join(root, 'first', 'archive.json');
    const second = join(root, 'second', 'archive.json');
    await compileArchive(sourcePath, first, rollbackPath);
    await compileArchive(sourcePath, second, rollbackPath);
    const [a, b] = await Promise.all([readFile(first), readFile(second)]);
    assert.deepEqual(a, b);
    assert.equal(JSON.parse(a).meta.sourceSha256, EXPECTED_SHA256);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('409 concrete channel IDs are retained without fabrication or renumbering', () => {
  assert.deepEqual(archive.playerChannels.map((channel) => channel.id), expectedPlayerIds);
  assert.equal(archive.playerChannels.filter((channel) => channel.type === 'cassette').length, 263);
  assert.equal(archive.playerChannels.filter((channel) => channel.type === 'vhs').length, 146);
});

test('All Decades + every project has a complete untruncated catalog in generated data', () => {
  const counts = Object.fromEntries(archive.facets.projects.map((project) => [
    project.id,
    archive.songs.filter((song) => song.projectIds.includes(project.id)).length,
  ]));
  assert.equal(counts['PRJ-SOLO-001'], 88);
  assert.ok(Object.values(counts).every((count) => count > 0));
  assert.equal(archive.songs.find((song) => song.id === 'SONG-0223').decade, '2010s');
});

test('SONG-0223 Love (feat. Tygertyger) binds exact media without a Recording ID', () => {
  const song = archive.songs.find((item) => item.id === 'SONG-0223');
  const other = archive.songs.find((item) => item.id === 'SONG-0001');
  assert.equal(song.title, 'Love (feat. Tygertyger)');
  assert.equal(other.title, 'Love');
  assert.equal(song.writing, 'Jonathan Edward Lee');
  assert.equal(song.lyrics, 'Tygertyger');
  assert.equal(song.versions.length, 1);
  assert.equal(song.versions[0].recordingId, null);
  assert.equal(song.versions[0].releaseId, 'REL-SOLO-022');
  assert.deepEqual(song.versions[0].watchChannelIds, ['PCH-0026']);
  assert.deepEqual(song.versions[0].listenChannelIds, ['PCH-0181']);
  assert.deepEqual(song.versions[0].lyricIds, ['LYR-0001']);
  assert.equal(song.versions[0].lyricState, 'public');
  const watch = archive.playerChannels.find((channel) => channel.id === 'PCH-0026');
  const listen = archive.playerChannels.find((channel) => channel.id === 'PCH-0181');
  assert.equal(watch.recordingId, null);
  assert.equal(listen.recordingId, null);
  assert.equal(watch.songLinkId, 'SLNK-0458');
  assert.equal(listen.songLinkId, 'SLNK-0621');
  assert.match(watch.externalUrl, /X4watMNFBfw/);
  assert.match(listen.externalUrl, /audius\.co\/tygertyger\/love-by-tygerfeathers/);
  const destinations = song.versions[0].destinations;
  assert.ok(destinations.some((item) => item.id === 'SLNK-0621' && item.kind === 'exact' && item.label === 'AUDIUS / EXACT TRACK'));
  assert.ok(destinations.some((item) => item.kind === 'release-page' && item.label === 'RELEASE PAGE'));
  assert.ok(destinations.some((item) => item.kind === 'smart-link' && item.label === 'SMART LINK'));
  const lyric = archive.lyrics.find((item) => item.id === 'LYR-0001');
  assert.match(lyric.text, /Oh the things/);
  assert.match(lyric.text, /now he's losing his mind/);
  assert.match(lyric.text, /Life isn't lived without some love, so we simply lose our mind\./);
  assert.doesNotMatch(lyric.text, /Little boys have a penis|When human beings are very young/);
  assert.match(lyric.sampleTreatment, /sampled speech/);
});

test('pending and conflicted lyrics never ship complete public text', () => {
  const blocked = archive.lyrics.filter((lyric) => ['pending', 'conflicted'].includes(lyric.state));
  assert.ok(blocked.length >= 12);
  assert.ok(blocked.every((lyric) => lyric.text === ''));
  assert.equal(archive.lyrics.filter((lyric) => lyric.state === 'public').every((lyric) => lyric.text.length > 0), true);
});

test('Leadership Class versions never collapse into Junkfeathers media', () => {
  const song = archive.songs.find((item) => item.id === 'SONG-0087');
  const leadership = song.versions.filter((version) => version.projectId === 'PRJ-BAND-003');
  const junkfeathers = song.versions.filter((version) => version.projectId === 'PRJ-SOLO-001');
  assert.ok(leadership.length >= 1);
  assert.ok(junkfeathers.length >= 1);
  assert.equal(junkfeathers.some((version) => version.listenChannelIds.includes('PCH-0001')), true);
  assert.equal(leadership.some((version) => version.listenChannelIds.includes('PCH-0001')), false);
  for (const channel of archive.playerChannels.filter((item) => item.projectId === 'PRJ-BAND-003')) {
    const performers = channel.facts.find((fact) => fact.label === 'MUSIC PERFORMED BY');
    assert.ok(performers?.value.includes('Jacob Shively'), channel.id);
  }
});

test('public artifact excludes private source material and autoplay', () => {
  const serialized = `${archiveBytes}\n${validationBytes}`;
  for (const forbidden of ['source_spreadsheet_id', 'Source ID / Provenance', 'DevAI Exchange', '.xlsx']) {
    assert.equal(serialized.includes(forbidden), false, forbidden);
  }
  for (const channel of archive.playerChannels) {
    assert.equal(/[?&]autoplay=1\b/.test(channel.embedUrl ?? ''), false);
  }
});
