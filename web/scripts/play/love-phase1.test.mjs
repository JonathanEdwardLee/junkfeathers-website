import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
const expectedAudioSha256 = '4dd8beeeeadab97e445a9ea0c3e1cf6b20e1fcab00afd5d456bbe04e2b80320e';
const duration = 244.506122;

const read = (relativePath) => readFile(new URL(`../../${relativePath}`, import.meta.url), 'utf8');

test('browser MP3 hash matches the authorized derivative', async () => {
  const bytes = await readFile(new URL('../../public/media/play/love/love-feat-tygertyger-play-v1.mp3', import.meta.url));
  const actual = createHash('sha256').update(bytes).digest('hex');
  assert.equal(actual, expectedAudioSha256);
});

test('only phaser 4.2.1 was added to website dependencies', async () => {
  const pkg = JSON.parse(await read('package.json'));
  assert.deepEqual(Object.keys(pkg.dependencies).sort(), ['@astrojs/sitemap', 'astro', 'phaser']);
  assert.equal(pkg.dependencies.phaser, '4.2.1');
});

test('timeline scenes stay inside the audio duration', async () => {
  const source = await read('src/data/play/love-phase1.timeline.ts');
  const scenes = [...source.matchAll(/\{ id: '([A-Z_]+)', start: ([\d.]+), end: ([\d.]+)/g)];
  assert.ok(scenes.length >= 8);
  let previousEnd = 0;
  for (const match of scenes) {
    const start = Number(match[2]);
    const end = Number(match[3]);
    assert.ok(start >= 0);
    assert.ok(end <= duration + 0.0001);
    assert.ok(end > start);
    assert.ok(start >= previousEnd - 0.0001);
    previousEnd = end;
  }
  assert.match(source, /heartSpawnBeats: 4/);
  assert.match(source, /heartLifeBeats: 16/);
  assert.match(source, /wakeCells: 24/);
  assert.match(source, /end: 8\.727273/);
  assert.match(source, /end: 87\.06/);
});

test('lyric and sample cues are capped at two lines in config', async () => {
  const source = await read('src/data/play/love-phase1.timeline.ts');
  assert.match(source, /block\.lines\.length > 2/);
});

test('one Phaser scene, no physics, optional hearts, no fail state', async () => {
  const script = await read('src/scripts/play/love-phase1.ts');
  const page = await read('src/pages/play/love.astro');
  const machine = await read('src/components/play/LovePlayMachine.astro');
  assert.equal([...script.matchAll(/extends Phaser\.Scene/g)].length, 1);
  assert.equal([...script.matchAll(/class LovePhase1Scene/g)].length, 1);
  assert.doesNotMatch(script, /physics\s*:/);
  assert.doesNotMatch(script, /arcade/i);
  assert.doesNotMatch(script, /autoplay/i);
  assert.doesNotMatch(script, /combo|lives|leaderboard|failure/i);
  assert.match(script, /heartsBroken/);
  assert.match(script, /unbreakable/);
  assert.match(script, /drawCrystalHeart/);
  assert.match(script, /DOT_RESPAWN/);
  assert.match(script, /TABLEAU_SIGHT/);
  assert.match(script, /audio\.currentTime/);
  assert.match(script, /Phaser\.WEBGL/);
  assert.match(page, /noindex, nofollow/);
  assert.equal([...machine.matchAll(/<audio/g)].length, 1);
  assert.doesNotMatch(machine, /autoplay/);
  assert.match(machine, /data-love-hearts/);
});

test('public navigation, music, archive, and global CSS were not modified', async () => {
  const index = await read('src/pages/index.astro');
  const music = await read('src/pages/music.astro');
  const layout = await read('src/layouts/Layout.astro');
  const astroConfig = await read('astro.config.mjs');
  assert.doesNotMatch(index, /\/play\/love/);
  assert.doesNotMatch(music, /\/play\/love/);
  assert.doesNotMatch(layout, /\/play\/love/);
  assert.match(astroConfig, /!page\.includes\('\/play\/'\)/);
});

test('secret beta label and Tygertyger Audius credit stay unlisted', async () => {
  const machine = await read('src/components/play/LovePlayMachine.astro');
  const page = await read('src/pages/play/love.astro');
  const script = await read('src/scripts/play/love-phase1.ts');
  assert.match(machine, /SECRET BETA/);
  assert.match(machine, /href="https:\/\/audius\.co\/tygertyger"/);
  assert.match(machine, /target="_blank"/);
  assert.match(machine, /rel="noopener noreferrer"/);
  assert.match(machine, />Tygertyger</);
  assert.match(machine, /aria-label="Opens Tygertyger/);
  assert.match(machine, /love-play__credit-link:focus-visible/);
  assert.match(page, /noindex, nofollow/);
  assert.match(script, /p\.textContent = line/);
  const lyricMarkup = machine.slice(
    machine.indexOf('data-love-lyric'),
    machine.indexOf('data-love-sample')
  );
  assert.doesNotMatch(lyricMarkup, /<a[\s>]/);
  assert.doesNotMatch(machine, /gtag|analytics|password|login|cookie/i);
  assert.doesNotMatch(page, /gtag|analytics|password|login/i);
});
