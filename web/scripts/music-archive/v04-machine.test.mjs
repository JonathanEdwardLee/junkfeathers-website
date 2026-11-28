import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const archiveMachinePath = fileURLToPath(new URL('../../src/components/music-archive/ArchiveMachine.astro', import.meta.url));
const archivePagePath = fileURLToPath(new URL('../../src/pages/music/archive/index.astro', import.meta.url));
const musicPagePath = fileURLToPath(new URL('../../src/pages/music.astro', import.meta.url));
const videoTransmissionPath = fileURLToPath(new URL('../../src/components/VideoTransmission.astro', import.meta.url));
const importerPath = fileURLToPath(new URL('./import-v04.mjs', import.meta.url));
const v03ImporterPath = fileURLToPath(new URL('./import-v03.mjs', import.meta.url));
const v04ArchivePath = fileURLToPath(new URL('../../public/data/music-archive/v04/archive.json', import.meta.url));
const archiveMachine = await readFile(archiveMachinePath, 'utf8');
const archivePage = await readFile(archivePagePath, 'utf8');
const musicPage = await readFile(musicPagePath, 'utf8');
const videoTransmission = await readFile(videoTransmissionPath, 'utf8');
const importer = await readFile(importerPath, 'utf8');
const v03Importer = await readFile(v03ImporterPath, 'utf8');
const v04Archive = JSON.parse(await readFile(v04ArchivePath, 'utf8'));

test('cards use one MORE action and the Multimedia Machine defaults to INFO', () => {
  assert.match(archiveMachine, /textContent = 'MORE'/);
  assert.match(archiveMachine, /dataset\.mediaAction = 'more'/);
  assert.doesNotMatch(archiveMachine, /dataset\.mediaAction = mode/);
  assert.match(archiveMachine, /openSurface = 'INFO'/);
  assert.match(archiveMachine, /MULTIMEDIA MACHINE/);
  assert.match(archiveMachine, /'INFO' \| 'LISTEN' \| 'WATCH' \| 'LYRICS' \| 'VERSIONS'/);
  assert.match(archiveMachine, /data-mm-drawer/);
  assert.match(archivePage, /215 known songs/);
});

test('All Decades removes only the decade restriction for every project catalog', () => {
  assert.match(archiveMachine, /const isAll = \(value: string \| undefined\) => !value \|\| value === 'all'/);
  assert.match(archiveMachine, /!decade \|\| item\.decade === decade/);
  assert.match(archiveMachine, /!project \|\| item\.projectIds\.includes\(project\)/);
  assert.match(archiveMachine, /option value="all">ALL DECADES/);
  assert.match(archiveMachine, /decadeFilter\.value = 'all'/);
  assert.match(archiveMachine, /const pageSize = 2/);
  assert.match(archiveMachine, /catalog\.slice\(\(currentPage - 1\) \* pageSize, currentPage \* pageSize\)/);
  assert.match(archiveMachine, /data-archive-pager/);
  assert.match(archiveMachine, />PREV</);
  assert.match(archiveMachine, />NEXT</);
  assert.match(archiveMachine, /pageToSong/);
  assert.doesNotMatch(archiveMachine, /resultLimit/);
  assert.match(archiveMachine, /filters\.forEach\(\(filter\) => \{ filter\.disabled = false; \}\)/);
  assert.match(archiveMachine, /decadeFilter\.value = defaultDecade/);
  for (const project of v04Archive.facets.projects) {
    const count = v04Archive.songs.filter((song) => song.projectIds.includes(project.id)).length;
    assert.ok(count > 0, `${project.name} must have songs when All Decades is selected`);
  }
});

test('stable song and channel deep links use IDs and preserve history', () => {
  assert.match(archiveMachine, /searchParams\.get\('song'\)/);
  assert.match(archiveMachine, /searchParams\.get\('channel'\)/);
  assert.match(archiveMachine, /history\[replace \? 'replaceState' : 'pushState'\]/);
  assert.match(archiveMachine, /window\.addEventListener\('popstate'/);
  assert.match(archiveMachine, /channel\.songId !== item\.id/);
  assert.match(archiveMachine, /Escape/);
});

test('playback stays one iframe, no autoplay, and Bandcamp stays origin-locked', () => {
  assert.match(archiveMachine, /parsed\.protocol === 'https:'/);
  assert.match(archiveMachine, /parsed\.hostname === 'bandcamp\.com'/);
  assert.match(archiveMachine, /parsed\.pathname\.startsWith\('\/EmbeddedPlayer\/'\)/);
  assert.match(archiveMachine, /clearPlayback\(\)/);
  assert.match(archiveMachine, /PLAY ON BANDCAMP/);
  assert.match(archiveMachine, /BANDCAMP RELEASE PLAYER FALLBACK \/ OPEN RELEASE/);
  assert.match(archiveMachine, /NO VERIFIED WATCH SOURCE/);
  assert.match(archiveMachine, /LYRICS NOT AVAILABLE/);
  assert.match(archiveMachine, /RELEASE PAGE/);
  assert.match(archiveMachine, /SMART LINK/);
  assert.doesNotMatch(archiveMachine, /This source does not include supported on-page embed metadata/);
  assert.doesNotMatch(archiveMachine, /[?&]autoplay=1/);
  assert.equal((archiveMachine.match(/document\.createElement\('iframe'\)/g) ?? []).length, 1);
  assert.doesNotMatch(importer, /fetch\s*\(|\.mp3\b|audio[_-]?url/i);
});

test('Multimedia Machine is a fixed sibling CRT with cassette watch art and no white card buttons', () => {
  assert.match(archiveMachine, /class="multimedia-machine"/);
  assert.match(archiveMachine, /AWAITING INPUT/);
  assert.match(archiveMachine, /mm-cassette-shell/);
  assert.match(archiveMachine, /mm-cassette-deck/);
  assert.match(archiveMachine, /\.mm-stage \{[\s\S]*aspect-ratio: 1 \/ 1/);
  assert.match(archiveMachine, /className = 'mm-version-link'/);
  assert.match(archiveMachine, /openMachine\(openSong, channelId, 'INFO', true\)/);
  assert.doesNotMatch(archiveMachine, /aspect-ratio: 16 \/ 9/);
  assert.match(archiveMachine, /width: min\(100% - 1rem, 780px\)/);
  assert.match(archiveMachine, /\.archive-stack :global\(button:not\(\.mm-version-link\):not\(\.machine-tab\)\)/);
  assert.match(archiveMachine, /className = 'archive-btn'/);
  assert.match(archiveMachine, /background: #000 !important;\s*\n\s*background-color: #000 !important;\s*\n\s*color: #fff !important;/);
  assert.match(archiveMachine, /\.mm-tabs \.machine-tab\[aria-selected='true'\]:not\(:disabled\) \{[\s\S]*background: #fff;[\s\S]*color: #000;/);
  assert.doesNotMatch(archiveMachine, /data-mm-close|mmClose|>CLOSE</);
  assert.doesNotMatch(archiveMachine, /#7cff7c|#aaffaa/i);
  assert.match(archiveMachine, /\.archive-machine::before,\s*\n\s*\.archive-machine::after,\s*\n\s*\.multimedia-machine::before,\s*\n\s*\.multimedia-machine::after \{[\s\S]*background: var\(--archive-white\)/);
});

test('Multimedia Machine keeps a fixed five-slot bar and disables unavailable surfaces', () => {
  assert.match(archiveMachine, /SURFACE_ORDER: Surface\[\] = \['INFO', 'LISTEN', 'WATCH', 'LYRICS', 'VERSIONS'\]/);
  assert.match(archiveMachine, /\(\['INFO', 'LISTEN', 'WATCH', 'LYRICS', 'VERSIONS'\] as const\)/);
  assert.match(archiveMachine, /data-surface=\{surface\}/);
  assert.match(archiveMachine, /grid-template-columns: repeat\(5, minmax\(0, 1fr\)\)/);
  assert.match(archiveMachine, /white-space: nowrap/);
  assert.match(archiveMachine, /tab\.disabled = !enabled/);
  assert.match(archiveMachine, /if \(version && !surfaceEnabled\(openSurface, version\)\) openSurface = 'INFO'/);
  assert.match(archiveMachine, /filter\(\(tab\) => !tab\.disabled\)/);
  assert.doesNotMatch(archiveMachine, /mmTabs\.replaceChildren\(\)/);
});

test('new Archive copy avoids the restricted word and invented machine instructions', () => {
  assert.doesNotMatch(archiveMachine, /signal/i);
  assert.doesNotMatch(archiveMachine, /Choose WATCH|Choose LISTEN|Choose MORE/i);
  assert.doesNotMatch(archiveMachine, /how to use|click a tab to/i);
  assert.match(archiveMachine, /min-height: 44px/);
  assert.match(archiveMachine, /prefers-reduced-motion: reduce/);
  assert.match(archiveMachine, /overflow-x: hidden/);
});

test('Music-page Channel Machine preserves youtube playback and is not rewritten by the v04 importer', () => {
  assert.match(musicPage, /music-archive-v04\.0/);
  assert.match(musicPage, /public\/data\/music-archive\/v04\/archive\.json/);
  assert.match(videoTransmission, /youtube-nocookie\.com/);
  assert.doesNotMatch(videoTransmission, /autoplay=1/);
  assert.equal(v03Importer.includes('music-archive-v03.2'), true);
  assert.doesNotMatch(importer, /src\/pages\/music\.astro|VideoTransmission/);
});
