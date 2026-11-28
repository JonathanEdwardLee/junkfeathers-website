import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const musicPagePath = fileURLToPath(new URL('../../src/pages/music.astro', import.meta.url));
const videoPath = fileURLToPath(new URL('../../src/components/VideoTransmission.astro', import.meta.url));
const archiveMachinePath = fileURLToPath(new URL('../../src/components/music-archive/ArchiveMachine.astro', import.meta.url));
const v04Path = fileURLToPath(new URL('../../public/data/music-archive/v04/archive.json', import.meta.url));
const musicPage = await readFile(musicPagePath, 'utf8');
const video = await readFile(videoPath, 'utf8');
const archiveMachine = await readFile(archiveMachinePath, 'utf8');
const archive = JSON.parse(await readFile(v04Path, 'utf8'));

const specs = [
  { title: 'The Vibe', songId: 'SONG-0055', songLinkId: 'SLNK-0441', youtubeId: 'nkRq-vjhBUg', playerChannelId: 'PCH-0066' },
  { title: 'Guide Our Words', songId: 'SONG-0052', songLinkId: 'SLNK-0492', youtubeId: 'FxcZc9OSzCU', playerChannelId: 'PCH-0183' },
  { title: 'Do What You Want', songId: 'SONG-0039', songLinkId: 'SLNK-0620', youtubeId: 'ApKAcOuOiZ0', playerChannelId: 'PCH-0168' },
  { title: 'Love (feat. Tygertyger)', songId: 'SONG-0223', songLinkId: 'SLNK-0458', youtubeId: 'X4watMNFBfw', playerChannelId: 'PCH-0026' },
  { title: 'Travelogue (feat. Frawstakwa)', songId: 'SONG-0054', songLinkId: 'SLNK-0471', youtubeId: 'kQIljBxvemI', playerChannelId: 'PCH-0019' },
  { title: 'Trouble Finds the Tired Hearts', songId: 'SONG-0053', songLinkId: 'SLNK-0470', youtubeId: 'Q25_KwBVur0', playerChannelId: 'PCH-0018' },
];

test('exact six Channel Machine identities remain in order with v04 bindings', () => {
  let cursor = 0;
  for (const spec of specs) {
    const song = archive.songs.find((item) => item.id === spec.songId);
    const link = archive.songLinks.find((item) => item.id === spec.songLinkId);
    const channel = archive.playerChannels.find((item) => item.id === spec.playerChannelId);
    assert.equal(song.title, spec.title);
    assert.equal(link.mediaId, spec.youtubeId);
    assert.equal(channel.songId, spec.songId);
    const snippet = musicPage.slice(cursor);
    const songAt = snippet.indexOf(`songId: '${spec.songId}'`);
    const linkAt = snippet.indexOf(`songLinkId: '${spec.songLinkId}'`);
    const youtubeAt = snippet.indexOf(`youtubeId: '${spec.youtubeId}'`);
    const pchAt = snippet.indexOf(`playerChannelId: '${spec.playerChannelId}'`);
    assert.ok(songAt >= 0 && linkAt > songAt && youtubeAt > linkAt && pchAt > youtubeAt);
    cursor += pchAt + spec.playerChannelId.length;
  }
  assert.match(musicPage, /OLAK5uy_lvVgnbLw8qlSq9XelASoBkEBPY5w9s-6o/);
  assert.doesNotMatch(musicPage, /SONG-0179|SONG-0037|wCfsMxPKHjc|TLYebbum4BM/);
});

test('Channel Machine does not keep a second handwritten catalog', () => {
  assert.doesNotMatch(musicPage, /versionLabel:|supportUrl:|BUY \/ SUPPORT/);
  assert.match(musicPage, /public\/data\/music-archive\/v04\/archive\.json/);
  assert.match(musicPage, /version\.destinations/);
  assert.match(musicPage, /item\?\.state === 'public'/);
  const vibe = archive.songs.find((song) => song.id === 'SONG-0055');
  const version = vibe.versions.find((item) => item.recordingId === 'REC-SOLO-059');
  assert.ok(version.destinations.some((item) => item.url.includes('tahrecords.bandcamp.com/album/junkfeathers-double-eagle-split-single')));
});

test('power, youtube-nocookie, no autoplay, and one iframe remain', () => {
  assert.match(video, /data-power-button/);
  assert.match(video, /POWER OFF/);
  assert.match(video, /NO SIGNAL \/ CH/);
  assert.match(video, /youtube-nocookie\.com\/embed\/\$\{channel\.youtubeId\}\?playsinline=1&rel=0/);
  assert.doesNotMatch(video, /[?&]autoplay=1/);
  assert.equal((video.match(/document\.createElement\('iframe'\)/g) ?? []).length, 1);
  assert.match(video, /channels\.length !== 6/);
});

test('INFO is the default and resets on every channel change', () => {
  assert.match(video, /let currentSurface: ChannelSurface = 'INFO'/);
  assert.match(video, /currentSurface = 'INFO'/);
  assert.match(video, /if \(!surfaceAvailable\(channel, currentSurface\)\) currentSurface = 'INFO'/);
  assert.match(video, /selectChannel = \(index: number\) => \{[\s\S]*currentSurface = 'INFO'/);
});

test('three Channel tabs stay installed with equal geometry and disabled states', () => {
  assert.match(video, /data-channel-tab=\{surface\}/);
  assert.match(video, /INFO', 'LYRICS', 'STREAMING'/);
  assert.match(video, /grid-template-columns: repeat\(3, minmax\(0, 1fr\)\)/);
  assert.match(video, /white-space: nowrap/);
  assert.match(video, /button\.disabled = !enabled/);
  assert.match(video, /border-style: dashed/);
  assert.match(video, /min-height: 44px/);
  assert.match(video, /data-channel-more/);
  assert.match(musicPage, /moreHref: `\/music\/archive\/\?song=\$\{song\.id\}&channel=\$\{playerChannel\.id\}`/);
  assert.match(video, /\.channel-tabs \{[\s\S]{0,180}?grid-template-columns: repeat\(3, minmax\(0, 1fr\)\)/);
  assert.doesNotMatch(video, /\.channel-tabs \{[\s\S]{0,220}?flex-wrap: wrap/);
});

test('unavailable lyrics and streaming stay present, disabled, and never stale', () => {
  assert.match(video, /surface === 'LYRICS'\s*\?\s*!initialChannel\.lyrics/);
  assert.match(video, /channel\.destinations\.length > 0/);
  assert.match(video, /LYRICS NOT AVAILABLE/);
  assert.match(video, /NO VERIFIED STREAMING DESTINATION/);
  assert.match(video, /renderSurface\(channel\)/);
  assert.match(video, /moreLink\.href = channel\.moreHref/);
  const travelogue = archive.songs.find((song) => song.id === 'SONG-0054');
  const travelogueVersion = travelogue.versions.find((item) => item.watchChannelIds.includes('PCH-0019'));
  assert.equal(travelogueVersion.lyricState, 'missing');
  const love = archive.songs.find((song) => song.id === 'SONG-0223');
  assert.equal(love.versions[0].lyricState, 'public');
});

test('machine art and reduced motion are present', () => {
  assert.match(video, /data-info-art/);
  assert.match(video, /tuner-drum/);
  assert.match(video, /gear-train/);
  assert.match(video, /prefers-reduced-motion: reduce/);
  assert.match(video, /\.gear-train i,[\s\S]*animation: none/);
});

test('Multimedia five-slot bar, disabled LISTEN\/WATCH\/LYRICS\/VERSIONS, and streaming drawer remain', () => {
  assert.match(archiveMachine, /repeat\(5, minmax\(0, 1fr\)\)/);
  assert.match(archiveMachine, /surface === 'LISTEN'\) return version\.listenChannelIds\.length > 0/);
  assert.match(archiveMachine, /surface === 'WATCH'\) return version\.watchChannelIds\.length > 0/);
  assert.match(archiveMachine, /surface === 'LYRICS'\) return version\.lyricState === 'public'/);
  assert.match(archiveMachine, /openSong\.versions\.length > 1/);
  assert.match(archiveMachine, /data-mm-drawer/);
  assert.match(archiveMachine, /if \(version && !surfaceEnabled\(openSurface, version\)\) openSurface = 'INFO'/);
});

test('new Channel Machine copy avoids restricted words and invented instructions', () => {
  const added = video.slice(video.indexOf('info-machine'));
  assert.doesNotMatch(added, /how to use|click a tab to|Choose INFO/i);
  assert.doesNotMatch(musicPage, /Choose WATCH|click MORE/i);
  assert.match(video, /overflow: hidden/);
});
