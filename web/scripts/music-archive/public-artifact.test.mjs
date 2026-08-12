import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const archivePath = fileURLToPath(new URL('../../public/data/music-archive/v02/archive.json', import.meta.url));
const validationPath = fileURLToPath(new URL('../../public/data/music-archive/v02/validation.json', import.meta.url));
const archiveBytes = await readFile(archivePath);
const validationBytes = await readFile(validationPath);
const archive = JSON.parse(archiveBytes);
const validation = JSON.parse(validationBytes);
const expectedSourceSha256 = '7F3D648B6EFB0B65E2AD24AB0761DA481A6934D193B1B523344A5429F8633710';
const idPattern = /^[A-Z][A-Z0-9]*(?:-[A-Z0-9]+)+$/;

const normalize = (value) => String(value ?? '').normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
const songCorpus = (song) => normalize([
  song.title, ...song.aliases, ...song.projectNames,
  ...song.releaseIds.map((id) => archive.releases.find((release) => release.id === id)?.title),
].join(' '));

test('public artifacts identify corrected frozen R1 and its exact counts', () => {
  assert.equal(archive.meta.schemaVersion, 'music-archive-v02.0');
  assert.equal(archive.meta.sourceSha256, expectedSourceSha256);
  assert.equal(validation.sourceSha256, expectedSourceSha256);
  assert.equal(archive.meta.publicKnownSongs, 215);
  assert.deepEqual(archive.meta.counts, { releases: 59, recordings: 320, songs: 220, projects: 7, songLinks: 619 });
  assert.equal(validation.songLinkContinuity, 'SLNK-0001..SLNK-0619');
});

test('stable public IDs are unique and relationships resolve', () => {
  for (const group of ['projects', 'songs', 'releases', 'recordings', 'songLinks']) {
    const ids = archive[group].map((item) => item.id);
    assert.equal(new Set(ids).size, ids.length, `${group} unique IDs`);
    for (const id of ids) assert.match(id, idPattern, `${group} ${id}`);
  }
  const projectIds = new Set(archive.projects.map((item) => item.id));
  const releaseIds = new Set(archive.releases.map((item) => item.id));
  const recordingIds = new Set(archive.recordings.map((item) => item.id));
  const linkIds = new Set(archive.songLinks.map((item) => item.id));
  for (const song of archive.songs) {
    for (const id of song.projectIds) assert.ok(projectIds.has(id), `${song.id} project ${id}`);
    for (const id of song.releaseIds) assert.ok(releaseIds.has(id), `${song.id} release ${id}`);
    for (const id of song.recordingIds) assert.ok(recordingIds.has(id), `${song.id} recording ${id}`);
    for (const id of song.linkIds) assert.ok(linkIds.has(id), `${song.id} media ${id}`);
  }
});

test('the founder-reviewed platform filter and Bitfeathers exception are exact', () => {
  assert.deepEqual(Object.keys(archive.facets), ['decades', 'projects', 'platforms']);
  assert.deepEqual(archive.facets.platforms, ['Bandcamp', 'YouTube', 'Spotify', 'Apple Music', 'Amazon Music', 'DistroKid', 'SoundCloud']);
  assert.deepEqual(archive.facets.projects.map((project) => project.name), ['Junkfeathers', 'Zero', 'Floob', 'Leadership Class', 'Nora and Gnoll', 'Spoke Pants of the Flowering Skillet']);
  assert.equal(archive.facets.projects.some((project) => project.name === 'Bitfeathers'), false);
  assert.ok(archive.songs.filter((song) => songCorpus(song).includes('bitfeathers')).length > 0);
});

test('alias search, unknown credit, and Ode rules survive generation', () => {
  const search = (query) => archive.songs.filter((song) => songCorpus(song).includes(normalize(query))).map((song) => song.id);
  assert.deepEqual(search('You Did Roll Your Eyes'), ['SONG-0169']);
  assert.deepEqual(search('Shawn Works Hard'), ['SONG-0100']);
  const unknown = archive.songs.find((song) => song.id === 'SONG-0202');
  assert.equal(unknown.writing, null);
  assert.equal(unknown.lyrics, null);
  const ode = archive.songs.find((song) => song.title === 'Ode to Shawn');
  assert.match(ode.eligibility, /^Pending/);
  assert.equal(archive.songs.filter((song) => song.eligibility === 'Yes').length, 215);
});

test('all media URLs are public HTTP(S) and ordered within each song', () => {
  const links = new Map(archive.songLinks.map((link) => [link.id, link]));
  for (const link of archive.songLinks) {
    const url = new URL(link.url);
    assert.ok(['http:', 'https:'].includes(url.protocol));
    if (link.embedUrl) assert.ok(['http:', 'https:'].includes(new URL(link.embedUrl).protocol));
  }
  for (const song of archive.songs) {
    const priorities = song.linkIds.map((id) => links.get(id).priority);
    assert.deepEqual(priorities, [...priorities].sort((a, b) => a - b), `${song.id} media priority`);
  }
});

test('public files contain no exchange source, dependency, path, or secret leakage', () => {
  const serialized = `${archiveBytes.toString('utf8')}\n${validationBytes.toString('utf8')}`;
  for (const term of ['DevAI Exchange', 'JUNKFEATHERS_MUSIC_ARCHIVE', 'archive_v02_frozen_r1.json', '.xlsx', '"Sources"', '"Unresolved"']) assert.equal(serialized.includes(term), false, `must exclude ${term}`);
  assert.doesNotMatch(serialized, /[A-Z]:[\\/](?:Users|Documents|ProgramData|Windows)[\\/]/i);
  assert.doesNotMatch(serialized, /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/);
});
