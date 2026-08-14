import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const archivePath = fileURLToPath(new URL('../../public/data/music-archive/v03/archive.json', import.meta.url));
const validationPath = fileURLToPath(new URL('../../public/data/music-archive/v03/validation.json', import.meta.url));
const rollbackPath = fileURLToPath(new URL('../../public/data/music-archive/v02/archive.json', import.meta.url));
const musicPagePath = fileURLToPath(new URL('../../src/pages/music.astro', import.meta.url));
const videoTransmissionPath = fileURLToPath(new URL('../../src/components/VideoTransmission.astro', import.meta.url));
const archiveMachinePath = fileURLToPath(new URL('../../src/components/music-archive/ArchiveMachine.astro', import.meta.url));
const importerPath = fileURLToPath(new URL('./import-v03.mjs', import.meta.url));
const archiveBytes = await readFile(archivePath);
const validationBytes = await readFile(validationPath);
const archive = JSON.parse(archiveBytes);
const validation = JSON.parse(validationBytes);
const rollback = JSON.parse(await readFile(rollbackPath));
const musicPage = await readFile(musicPagePath, 'utf8');
const videoTransmission = await readFile(videoTransmissionPath, 'utf8');
const archiveMachine = await readFile(archiveMachinePath, 'utf8');
const importer = await readFile(importerPath, 'utf8');
const expectedHash = 'DD483F7E2B1D289E93A78F23F6918208391288F1D21A5CB29696C06D6EDC231F';
const expectedPlayerIds = Array.from({ length: 168 }, (_, index) => index + 1)
  .filter((number) => ![10, 11, 17].includes(number))
  .map((number) => `PCH-${String(number).padStart(4, '0')}`);
const channelsFor = (songId, projectId, type) => archive.playerChannels
  .filter((channel) => channel.songId === songId && channel.projectId === projectId && channel.type === type)
  .sort((left, right) => left.order - right.order || left.id.localeCompare(right.id));
const recordingById = new Map(archive.recordings.map((recording) => [recording.id, recording]));

test('v03.2 uses the exact immutable source and retains v02 as rollback', () => {
  assert.equal(archive.meta.schemaVersion, 'music-archive-v03.2');
  assert.equal(archive.meta.sourceVersion, 'v03.2-handoff-2026-08-14');
  assert.equal(archive.meta.sourceSheetCount, 34);
  assert.equal(archive.meta.sourceSha256, expectedHash);
  assert.equal(validation.sourceSha256, expectedHash);
  assert.equal(archive.meta.rollbackArtifact, '/data/music-archive/v02/archive.json');
  assert.equal(rollback.meta.schemaVersion, 'music-archive-v02.0');
  assert.deepEqual(archive.meta.counts, { releases: 59, recordings: 320, songs: 220, projects: 7, songLinks: 620, playerChannels: 165, lyrics: 26, bandcampEmbedRegistry: 139 });
  assert.deepEqual(archive.meta.coverage, {
    sourceSheets: 34,
    originalPlayerChannels: 27,
    addedPlayerChannels: 138,
    playerChannels: 165,
    cassetteChannels: 135,
    vhsChannels: 30,
    eligibleBandcampDirectRecordingLinks: 124,
    eligibleBandcampDirectLinksWithoutChannel: 0,
    bandcampRegistryRows: 139,
    bandcampTrackRegistryRows: 124,
    bandcampAlbumRegistryRows: 15,
    noraGnollChannels: 52,
    noraGnollCassetteChannels: 52,
    noraGnollVhsChannels: 0,
    noraGnollLyrics: 13,
  });
  assert.equal(archive.meta.publicKnownSongs, 215);
});

test('the founder-approved v02 index behavior remains intact', () => {
  assert.equal(archive.meta.latestView.projectId, 'PRJ-SOLO-001');
  assert.deepEqual(archive.facets.decades, ['2020s', '2010s', '2000s', '1990s']);
  assert.deepEqual(archive.facets.projects.map((project) => project.name), ['Junkfeathers', 'Zero', 'Floob', 'Leadership Class', 'Nora and Gnoll', 'Spoke Pants of the Flowering Skillet']);
  assert.equal(archive.facets.projects.some((project) => project.name === 'Bitfeathers'), false);
  assert.ok(archive.songs.some((song) => song.projectNames.includes('Bitfeathers')));
  assert.equal(archive.songs.flatMap((song) => song.contexts).includes('Solo'), false);
});

test('165 concrete channel IDs are retained without fabrication or renumbering', () => {
  assert.deepEqual(archive.playerChannels.map((channel) => channel.id), expectedPlayerIds);
  assert.equal(new Set(archive.playerChannels.map((channel) => channel.id)).size, 165);
  assert.equal(archive.playerChannels.filter((channel) => channel.type === 'cassette').length, 135);
  assert.equal(archive.playerChannels.filter((channel) => channel.type === 'vhs').length, 30);
});

test('Do What You Want uses the released replacement video and corrected public facts', () => {
  const replacement = archive.playerChannels.find((channel) => channel.id === 'PCH-0168');
  assert.equal(replacement.songId, 'SONG-0039');
  assert.equal(replacement.recordingId, 'REC-SOLO-043');
  assert.equal(replacement.songLinkId, 'SLNK-0620');
  assert.equal(replacement.mediaId, 'ApKAcOuOiZ0');
  assert.equal(replacement.externalUrl, 'https://www.youtube.com/watch?v=ApKAcOuOiZ0');
  assert.match(replacement.datePrecision, /^2026-08-14/);
  assert.equal(archive.playerChannels.some((channel) => channel.songLinkId === 'SLNK-0450' || /TLYebbum4BM/.test(channel.externalUrl)), false);
  assert.ok(archive.songLinks.some((link) => link.id === 'SLNK-0450' && /TLYebbum4BM/.test(link.url)), 'historical video evidence must remain');

  const facts = new Map(replacement.facts.map((fact) => [fact.label, fact]));
  assert.equal(facts.get('LEAD GUITAR').value, 'Dewey Hiler');
  assert.equal(facts.get('LEAD GUITAR').url, 'https://www.youtube.com/@deweyhiler555');
  assert.equal(facts.get('LYRICS').value, 'Jonathan Edward Lee; Sanket Sinha');
  assert.equal(facts.get('BANDCAMP RELEASE').value, '2018-08-10');
  assert.equal(facts.get('FLOOB RECORDS STREAMING RELEASE').value, '2019-01-05');
  assert.deepEqual(replacement.lyrics.map((lyric) => lyric.id), ['LYR-0008']);
  assert.equal(replacement.lyrics[0].authors, 'Jonathan Edward Lee; Sanket Sinha');
});

test('every eligible exact Bandcamp recording has a project-matched cassette channel', () => {
  const eligible = archive.songLinks.filter((link) => {
    const recording = recordingById.get(link.sourceEntityId);
    return link.platform === 'Bandcamp'
      && link.status.startsWith('Active')
      && link.linkLevel === 'Direct track / playable purchase page'
      && recording?.projectId;
  });
  assert.equal(eligible.length, 124);
  for (const link of eligible) {
    const recording = recordingById.get(link.sourceEntityId);
    assert.ok(archive.playerChannels.some((channel) => channel.type === 'cassette'
      && channel.songLinkId === link.id
      && channel.recordingId === recording.id
      && channel.projectId === recording.projectId), `${link.id} must not remain gray`);
  }
  const channelLinkIds = new Set(archive.playerChannels.map((channel) => channel.songLinkId));
  assert.equal(archive.songLinks.filter((link) => link.linkLevel === 'Release page fallback' && channelLinkIds.has(link.id)).length, 0);
  const directYoutube = archive.songLinks.filter((link) => link.platform === 'YouTube' && link.linkLevel === 'Direct video / song media');
  const legacyResolvedWithoutRecording = directYoutube
    .filter((link) => !recordingById.has(link.sourceEntityId) && channelLinkIds.has(link.id))
    .map((link) => archive.playerChannels.find((channel) => channel.songLinkId === link.id).id)
    .sort();
  assert.deepEqual(legacyResolvedWithoutRecording, ['PCH-0004', 'PCH-0007', 'PCH-0018', 'PCH-0019']);
  assert.equal(directYoutube.filter((link) => recordingById.has(link.sourceEntityId) && !recordingById.get(link.sourceEntityId).projectId && channelLinkIds.has(link.id)).length, 0);
});

test('Bandcamp registry is complete, whitelisted, and resolved in priority order', () => {
  assert.equal(archive.bandcampEmbedRegistry.length, 139);
  assert.equal(archive.bandcampEmbedRegistry.filter((entry) => entry.embedType === 'track').length, 124);
  assert.equal(archive.bandcampEmbedRegistry.filter((entry) => entry.embedType === 'album').length, 15);
  for (const entry of archive.bandcampEmbedRegistry) {
    const url = new URL(entry.embedUrl);
    assert.equal(url.protocol, 'https:');
    assert.equal(url.hostname, 'bandcamp.com');
    assert.equal(url.pathname.startsWith('/EmbeddedPlayer/'), true);
    assert.equal(/[?&]autoplay=1\b/i.test(url.href), false);
  }

  const registryById = new Map(archive.bandcampEmbedRegistry.map((entry) => [entry.id, entry]));
  const trackChannels = archive.playerChannels.filter((channel) => channel.playback.kind === 'bandcamp-track');
  assert.equal(trackChannels.length, 124);
  for (const channel of trackChannels) {
    const first = channel.playback.candidates[0];
    const registry = registryById.get(first.registryId);
    assert.equal(first.kind, 'bandcamp-track');
    assert.equal(first.releaseFallback, false);
    assert.equal(registry.songLinkId, channel.songLinkId);
    assert.equal(registry.recordingId, channel.recordingId);
  }

  const albumCandidates = archive.playerChannels.flatMap((channel) => channel.playback.candidates
    .filter((candidate) => candidate.kind === 'bandcamp-album-fallback')
    .map((candidate) => ({ channel, candidate })));
  assert.ok(albumCandidates.length > 0);
  for (const { channel, candidate } of albumCandidates) {
    const registry = registryById.get(candidate.registryId);
    assert.equal(registry.releaseId, channel.releaseId);
    assert.equal(registry.projectId, channel.projectId);
    assert.equal(candidate.releaseFallback, true);
    assert.equal(candidate.label, 'BANDCAMP / RELEASE PLAYER FALLBACK');
  }

  const externalOnly = archive.playerChannels.filter((channel) => channel.type === 'cassette' && channel.playback.kind === 'external');
  assert.ok(externalOnly.length > 0);
  assert.ok(externalOnly.every((channel) => channel.playback.embedUrl === null && channel.playback.attributionUrl.startsWith('https://')));
});

test('Nora and Gnoll exact versions, gray WATCH state, and Wamsutter lyrics are complete', () => {
  const nora = archive.playerChannels.filter((channel) => channel.projectId === 'PRJ-BAND-004');
  assert.equal(nora.length, 52);
  assert.equal(nora.filter((channel) => channel.type === 'cassette').length, 52);
  assert.equal(nora.filter((channel) => channel.type === 'vhs').length, 0);
  assert.ok(nora.some((channel) => channel.id === 'PCH-0008' && channel.title === 'Sweet Side'));
  assert.ok(nora.some((channel) => channel.id === 'PCH-0084' && channel.title === 'Snitches Are Bitches'));

  const frogVersions = nora.filter((channel) => channel.title === 'Love Song For A Frog');
  assert.equal(frogVersions.length, 2);
  assert.equal(new Set(frogVersions.map((channel) => channel.recordingId)).size, 2);
  assert.equal(new Set(frogVersions.map((channel) => channel.versionLabel)).size, 2);

  const noraLyrics = new Map(nora.flatMap((channel) => channel.lyrics).map((lyric) => [lyric.id, lyric]));
  assert.equal(noraLyrics.size, 13);
  const wamsutterStudio = nora.find((channel) => channel.id === 'PCH-0098');
  const wamsutterLive = nora.find((channel) => channel.id === 'PCH-0113');
  assert.deepEqual(wamsutterStudio.lyrics.map((lyric) => lyric.id), ['LYR-0014']);
  assert.deepEqual(wamsutterLive.lyrics, []);
});

test('project context wins and never falls across projects', () => {
  assert.deepEqual(channelsFor('SONG-0087', 'PRJ-SOLO-001', 'cassette').map((channel) => channel.id), ['PCH-0001']);
  assert.deepEqual(channelsFor('SONG-0087', 'PRJ-BAND-003', 'cassette').map((channel) => channel.id), ['PCH-0002', 'PCH-0003']);
  assert.deepEqual(channelsFor('SONG-0087', 'PRJ-BAND-003', 'vhs').map((channel) => channel.id), ['PCH-0004', 'PCH-0005']);
  assert.equal(channelsFor('SONG-0049', 'PRJ-SOLO-001', 'vhs').length, 0, 'Junkfeathers WATCH must stay disabled');
  assert.deepEqual(channelsFor('SONG-0049', 'PRJ-BAND-003', 'vhs').map((channel) => channel.id), ['PCH-0030']);
  assert.equal(channelsFor('SONG-0087', 'PRJ-BAND-003', 'cassette')[0].platform, 'Bandcamp');
});

test('Leadership Class public performance facts always include Jacob Shively', () => {
  for (const channel of archive.playerChannels.filter((item) => item.projectId === 'PRJ-BAND-003')) {
    const performers = channel.facts.find((fact) => fact.label === 'MUSIC PERFORMED BY');
    assert.ok(performers?.value.includes('Jacob Shively'), channel.id);
  }
  const soloHereWeGo = archive.playerChannels.find((channel) => channel.id === 'PCH-0001');
  assert.equal(soloHereWeGo.facts.some((fact) => fact.label === 'MUSIC PERFORMED BY' && fact.value.includes('Jacob Shively')), false);
});

test('the two Love compositions and the authorized lyric truth remain separate', () => {
  const love = archive.songs.find((song) => song.id === 'SONG-0001');
  const tygertygerLove = archive.songs.find((song) => song.id === 'SONG-0223');
  assert.equal(love.title, 'Love');
  assert.equal(tygertygerLove.title, 'Love (feat. Tygertyger)');
  assert.equal(tygertygerLove.writing, 'Jonathan Edward Lee');
  assert.equal(tygertygerLove.lyrics, 'Tygertyger');
  const channel = archive.playerChannels.find((item) => item.id === 'PCH-0026');
  assert.equal(channel.songId, 'SONG-0223');
  assert.equal(channel.songLinkId, 'SLNK-0458');
  assert.match(channel.externalUrl, /X4watMNFBfw/);
  assert.match(channel.facts.find((fact) => fact.label === 'MUSIC PERFORMED BY').value, /Tygertyger/);
  assert.match(channel.facts.find((fact) => fact.label === 'MUSIC PERFORMED BY').value, /Jonathan Edward Lee/);
  assert.equal(channel.facts.find((fact) => fact.label === 'MUSIC \/ COMPOSITION').value, 'Jonathan Edward Lee');
  assert.equal(channel.facts.find((fact) => fact.label === 'LYRICS').value, 'Tygertyger');
  assert.equal(channel.facts.find((fact) => fact.label === 'FEATURED ARTIST').value, 'Tygertyger');
  assert.equal(channel.facts.find((fact) => fact.label === 'CHORUS HARMONY VOCALS').value, 'Jonathan Edward Lee');
  assert.equal(channel.lyrics.length, 1);
  assert.equal(channel.lyrics[0].authors.includes('Tygertyger'), true);
  assert.match(channel.lyrics[0].sampleTreatment, /0:00–0:09/);
  assert.match(channel.lyrics[0].sampleTreatment, /2:28–3:11/);
});

test('players contain exact links, no autoplay instruction, and no private source leakage', () => {
  for (const channel of archive.playerChannels) {
    assert.ok(['vhs', 'cassette'].includes(channel.type));
    assert.ok(channel.externalUrl.startsWith('https://'));
    assert.equal(/[?&]autoplay=1\b/.test(channel.embedUrl ?? ''), false);
    for (const link of channel.streamLinks) assert.ok(['http:', 'https:'].includes(new URL(link.url).protocol));
  }
  const serialized = `${archiveBytes}\n${validationBytes}`;
  for (const forbidden of ['source_spreadsheet_id', 'Source ID / Provenance', 'DevAI Exchange', '.xlsx']) assert.equal(serialized.includes(forbidden), false);
  assert.doesNotMatch(serialized, /[A-Z]:[\\/](?:Users|Documents|ProgramData|Windows)[\\/]/i);
});

test('Cassette Machine enforces safe one-iframe playback and nontechnical external fallback', () => {
  assert.match(archiveMachine, /parsed\.protocol === 'https:'/);
  assert.match(archiveMachine, /parsed\.hostname === 'bandcamp\.com'/);
  assert.match(archiveMachine, /parsed\.pathname\.startsWith\('\/EmbeddedPlayer\/'\)/);
  assert.match(archiveMachine, /screen\.replaceChildren|clearPlayback\(\)/);
  assert.match(archiveMachine, /PLAY ON BANDCAMP/);
  assert.match(archiveMachine, /BANDCAMP RELEASE PLAYER FALLBACK \/ OPEN RELEASE/);
  assert.doesNotMatch(archiveMachine, /This source does not include supported on-page embed metadata/);
  assert.doesNotMatch(archiveMachine, /[?&]autoplay=1/);
  assert.equal((archiveMachine.match(/document\.createElement\('iframe'\)/g) ?? []).length, 1);
  assert.doesNotMatch(importer, /fetch\s*\(|\.mp3\b|audio[_-]?url/i);
});

test('Music-page founder amendments and v03.2 facts remain source-derived and version-correct', () => {
  const guideOurWords = archive.songs.find((song) => song.id === 'SONG-0052');
  assert.equal(guideOurWords.writing, 'Jonathan Edward Lee');
  assert.equal(guideOurWords.lyrics, 'Jonathan Edward Lee; Tygertyger');
  assert.ok(guideOurWords.credits.some((credit) => credit.name === 'Tygertyger' && /Featured vocalist/.test(credit.role)));
  assert.ok(archive.recordings.some((recording) => recording.id === 'REC-SOLO-056' && recording.releaseId === 'REL-SOLO-011'));
  assert.ok(archive.songLinks.some((link) => link.id === 'SLNK-0492' && link.songId === 'SONG-0052' && link.mediaId === 'FxcZc9OSzCU'));

  const doWhatYouWant = archive.songs.find((song) => song.id === 'SONG-0039');
  assert.ok(doWhatYouWant.credits.some((credit) => credit.name === 'Sanket Sinha' && credit.category === 'Lyrics'));
  assert.ok(doWhatYouWant.credits.some((credit) => credit.name === 'Dewey Hiler' && /Lead guitar/.test(credit.role)));

  const trouble = archive.playerChannels.find((channel) => channel.id === 'PCH-0018');
  assert.equal(trouble.facts.find((fact) => fact.label === 'MUSIC PERFORMED BY').value, 'Jonathan Edward Lee; Jeff Leinwand');
  const travelogue = archive.playerChannels.find((channel) => channel.id === 'PCH-0019');
  assert.equal(travelogue.facts.find((fact) => fact.label === 'MUSIC PERFORMED BY').value, 'Jonathan Edward Lee; Riverbucket');
  assert.equal(travelogue.facts.find((fact) => fact.label === 'LYRICS').value, 'Frawstakwa');
  assert.equal(travelogue.facts.find((fact) => fact.label === 'VOCALS / FEATURED ARTIST').value, 'Frawstakwa');

  assert.match(musicPage, /SONG-0055[^\n]+SLNK-0441[^\n]+nkRq-vjhBUg/);
  assert.match(musicPage, /tahrecords\.bandcamp\.com\/album\/junkfeathers-double-eagle-split-single/);
  assert.match(musicPage, /SONG-0052[^\n]+SLNK-0492[^\n]+FxcZc9OSzCU/);
  assert.match(musicPage, /OLAK5uy_lvVgnbLw8qlSq9XelASoBkEBPY5w9s-6o/);
  assert.match(musicPage, /SONG-0039[^\n]+SLNK-0620[^\n]+ApKAcOuOiZ0[^\n]+PCH-0168/);
  assert.doesNotMatch(musicPage, /SLNK-0450|TLYebbum4BM/);
  assert.match(musicPage, /music-archive-v03\.2/);
  assert.match(videoTransmission, /youtube-nocookie\.com/);
  assert.doesNotMatch(videoTransmission, /autoplay=1/);
});
