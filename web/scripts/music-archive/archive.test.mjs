import assert from 'node:assert/strict';
import { readFile, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import test from 'node:test';
import { compileArchive, EXPECTED_SHA256 } from './import.mjs';

const sourcePath = process.env.ARCHIVE_SOURCE;
if (!sourcePath) throw new Error('ARCHIVE_SOURCE must point to corrected archive_v02_frozen_r1.json');

let data;
let serialized;
let tempRoot;

test.before(async () => {
  tempRoot = await mkdtemp(join(tmpdir(), 'jf-archive-v02-test-'));
  const first = join(tempRoot, 'first', 'archive.json');
  const second = join(tempRoot, 'second', 'archive.json');
  ({ data } = await compileArchive(resolve(sourcePath), first));
  await compileArchive(resolve(sourcePath), second);
  const [a, b] = await Promise.all([readFile(first), readFile(second)]);
  serialized = a.toString('utf8');
  assert.deepEqual(a, b, 'repeat generation must be byte-identical');
});

test.after(async () => {
  if (tempRoot) await rm(tempRoot, { recursive: true, force: true });
});

test('corrected R1 identity, continuity, and v02 counts are frozen', () => {
  assert.equal(data.meta.sourceSha256, EXPECTED_SHA256);
  assert.equal(data.meta.integrityRevision, 'R1-2026-08-12');
  assert.equal(data.meta.publicKnownSongs, 215);
  assert.deepEqual(data.meta.counts, { releases: 59, recordings: 320, songs: 220, projects: 7, songLinks: 619 });
  const linkIds = data.songLinks.map((link) => link.id).sort((left, right) => Number(left.slice(5)) - Number(right.slice(5)));
  assert.equal(linkIds[0], 'SLNK-0001');
  assert.equal(linkIds.at(-1), 'SLNK-0619');
  assert.equal(new Set(linkIds).size, 619);
  for (let index = 0; index < 619; index += 1) assert.equal(linkIds[index], `SLNK-${String(index + 1).padStart(4, '0')}`);
});

test('compiler fails closed when source identity changes', async () => {
  const changed = Buffer.from(await readFile(resolve(sourcePath)));
  changed[changed.length - 2] ^= 1;
  const changedPath = join(tempRoot, 'changed.json');
  await writeFile(changedPath, changed);
  await assert.rejects(() => compileArchive(changedPath, join(tempRoot, 'changed', 'archive.json')), /source SHA-256/);
});

test('founder-reviewed public filters use streaming platforms and keep Bitfeathers menu-hidden but searchable', () => {
  assert.deepEqual(data.facets.platforms, ['Bandcamp', 'YouTube', 'Spotify', 'Apple Music', 'Amazon Music', 'DistroKid', 'SoundCloud']);
  assert.deepEqual(data.facets.projects.map((project) => project.name), ['Junkfeathers', 'Zero', 'Floob', 'Leadership Class', 'Nora and Gnoll', 'Spoke Pants of the Flowering Skillet']);
  assert.equal(data.facets.projects.some((project) => project.name === 'Bitfeathers'), false);
  assert.equal(data.projects.some((project) => project.name === 'Bitfeathers'), true);
  assert.ok(data.songs.some((song) => song.projectNames.includes('Bitfeathers')));
});

test('Archive Card Credits remain explicit and unknown credits remain blank', () => {
  const alien = data.songs.find((song) => song.title === 'Am I an Alien');
  assert.equal(alien.writing, null);
  assert.equal(alien.lyrics, null);
  const knownCredit = data.songs.find((song) => song.title === '396hz Root Awakening');
  assert.equal(knownCredit.writing, 'Jonathan Edward Lee');
  assert.equal(knownCredit.lyrics, null);
  assert.equal(knownCredit.creditStatus, 'Composition/performance confirmed; lyric/vocal status pending');
});

test('Ode to Shawn remains pending and excluded from the 215 statistic', () => {
  const ode = data.songs.find((song) => song.title === 'Ode to Shawn');
  assert.equal(ode.eligibility, 'Pending — historical track identity unresolved');
  assert.equal(ode.writing, null);
  assert.equal(ode.lyrics, null);
  assert.equal(data.songs.filter((song) => song.eligibility === 'Yes').length, 215);
});

const normalize = (value) => String(value ?? '').normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
const songCorpus = (song) => normalize([
  song.title, ...song.aliases, ...song.projectNames,
  ...song.releaseIds.map((id) => data.releases.find((release) => release.id === id)?.title),
].join(' '));

test('music-first canonical, alternate, project, and release searches resolve', () => {
  const search = (query) => data.songs.filter((song) => songCorpus(song).includes(normalize(query))).map((song) => song.id);
  assert.deepEqual(search('Witches and Goblins').includes('SONG-0179'), true);
  assert.deepEqual(search('You Did Roll Your Eyes'), ['SONG-0169']);
  assert.deepEqual(search('Shawn Works Hard'), ['SONG-0100']);
  assert.ok(search('Bitfeathers').length > 0);
  assert.ok(search('Captain Tulip').length > 0);
});

test('dates retain their precision instead of becoming inferred historical dates', () => {
  const release = data.releases.find((item) => item.id === 'REL-BAND-020');
  assert.match(release.datePrecision, /historical date disputed|historical.*unresolved/i);
  assert.equal(release.date, null);
  assert.equal(release.year, null);
  assert.equal(data.songLinks.some((link) => link.datePrecision === 'Exact video publish date'), true);
});

test('media links preserve exact priority and lazy-load metadata', () => {
  const order = ['Bandcamp', 'YouTube', 'Spotify', 'Apple Music', 'Amazon Music'];
  for (const song of data.songs) {
    const links = song.linkIds.map((id) => data.songLinks.find((link) => link.id === id));
    const preferred = links.filter((link) => order.includes(link.platform));
    for (let index = 1; index < preferred.length; index += 1) assert.ok(preferred[index - 1].priority <= preferred[index].priority, `${song.id} priority order`);
  }
  assert.ok(data.songLinks.some((link) => link.platform === 'Bandcamp' && link.embedUrl));
  assert.ok(data.songLinks.some((link) => link.platform === 'YouTube' && link.mediaId));
  assert.ok(data.songLinks.some((link) => link.platform === 'Spotify' && link.embedUrl));
});

test('generated output excludes exchange paths and private source sheets', () => {
  for (const forbidden of ['DevAI Exchange', 'JUNKFEATHERS_MUSIC_ARCHIVE', 'SOURCE/archive_v02', '"Sources"', '"Unresolved"', 'Later/current personal name — internal provenance only']) {
    assert.equal(serialized.includes(forbidden), false, `must exclude ${forbidden}`);
  }
});
