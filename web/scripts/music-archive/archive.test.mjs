import assert from 'node:assert/strict';
import { readFile, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import test from 'node:test';
import { compileArchive, EXPECTED_SHA256 } from './import.mjs';

const workbook = process.env.ARCHIVE_WORKBOOK;
if (!workbook) throw new Error('ARCHIVE_WORKBOOK must point to the frozen v01.1 workbook');

let data;
let serialized;
let tempRoot;

test.before(async () => {
  tempRoot = await mkdtemp(join(tmpdir(), 'jf-archive-test-'));
  const first = join(tempRoot, 'first', 'archive.json');
  const second = join(tempRoot, 'second', 'archive.json');
  ({ data } = await compileArchive(resolve(workbook), first));
  await compileArchive(resolve(workbook), second);
  const [a, b] = await Promise.all([readFile(first), readFile(second)]);
  serialized = a.toString('utf8');
  assert.deepEqual(a, b, 'repeat generation must be byte-identical');
});

test.after(async () => {
  if (tempRoot) await rm(tempRoot, { recursive: true, force: true });
});

test('source identity and contract counts are frozen', () => {
  assert.equal(data.meta.sourceSha256, EXPECTED_SHA256);
  assert.deepEqual(data.meta.counts, { releases: 57, recordings: 276, songs: 197, projects: 7, links: 49, contributors: 39, knownSongs: 195 });
});

test('compiler fails closed when source identity changes', async () => {
  const changed = Buffer.from(await readFile(resolve(workbook)));
  changed[changed.length - 1] ^= 1;
  const changedPath = join(tempRoot, 'changed.xlsx');
  await writeFile(changedPath, changed);
  await assert.rejects(() => compileArchive(changedPath, join(tempRoot, 'changed', 'archive.json')), /source SHA-256/);
});

test('sole legitimate duration 162 is preserved without text 162', () => {
  const recording = data.recordings.find((item) => item.id === 'REC-BAND-120');
  assert.equal(recording.duration, '2:42');
  assert.equal(recording.durationSeconds, 162);
  assert.equal(serialized.includes('"162"'), false);
});

test('public output excludes internal sheets, notes, variants, and deprecated identities', () => {
  for (const forbidden of ['Sources', 'Unresolved', 'Correction Basis', 'Source IDs', 'CON-024', 'ART-001', 'Later/current personal name']) {
    assert.equal(serialized.includes(forbidden), false, `must exclude ${forbidden}`);
  }
  assert.equal(data.contributors.some((item) => item.name === 'Starla, Duchess of Darkness'), true);
  assert.equal(Object.hasOwn(data, 'nameVariants'), false);
});

test('public IDs and relationships are unique and connected', () => {
  const groups = ['songs', 'recordings', 'releases', 'projects', 'contributors', 'credits', 'links', 'events', 'participants'];
  for (const group of groups) assert.equal(new Set(data[group].map((item) => item.id)).size, data[group].length, `${group} IDs unique`);
  const releases = new Set(data.releases.map((item) => item.id));
  const projects = new Set(data.projects.map((item) => item.id));
  const contributors = new Set(data.contributors.map((item) => item.id));
  const events = new Set(data.events.map((item) => item.id));
  for (const recording of data.recordings) { assert.ok(releases.has(recording.releaseId)); assert.ok(recording.projectId === null || projects.has(recording.projectId) || recording.projectId === 'COLLAB'); }
  for (const credit of data.credits) assert.ok(contributors.has(credit.contributorId));
  for (const participant of data.participants) assert.ok(events.has(participant.eventId));
});

test('all public URLs are valid HTTP(S)', () => {
  for (const link of data.links) {
    const url = new URL(link.url);
    assert.ok(['http:', 'https:'].includes(url.protocol));
    assert.ok(url.hostname);
  }
});

const normalize = (value) => String(value ?? '').normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
const corpus = (item) => normalize(Object.values(item).flat(Infinity).join(' '));

test('representative native searches find every acceptance category', () => {
  const search = (group, query) => data[group].filter((item) => corpus(item).includes(normalize(query)));
  assert.ok(search('songs', 'Witches and Goblins').length, 'song title');
  assert.ok(search('songs', 'You Did Roll Your Eyes').length, 'approved alternate title');
  assert.ok(search('projects', 'Floob').length, 'project');
  assert.ok(search('releases', 'Captain Tulip').length, 'release');
  assert.ok(search('contributors', 'Michal Towber').length, 'contributor');
  assert.ok(search('events', 'Magic Bean').length, 'venue/location');
  assert.ok(search('links', 'Spotify').length, 'platform');
});

test('combined query/filter and zero-result reset semantics are stable', () => {
  const query = normalize('Witches');
  const combined = data.songs.filter((song) => corpus(song).includes(query) && song.projectIds.includes('PRJ-SOLO-001'));
  assert.ok(combined.length > 0);
  assert.equal(data.songs.filter((song) => corpus(song).includes('signal that does not exist')).length, 0);
  assert.equal(data.songs.length, 197, 'reset returns the full song index');
});
