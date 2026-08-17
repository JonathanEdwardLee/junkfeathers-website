/**
 * PLAY LOVE Phase 1 — editable clock, scene, lyric, and event configuration.
 *
 * Source anchors only:
 * - opening spoken sample ~0.0–9.0
 * - machine-break ~148.0–191.0
 * - BPM 110
 * - song end 244.465918 (WAV) / 244.506122 (browser MP3)
 *
 * Line cues follow the Love-Play caption CRT SRT. One or two lines on screen.
 * Sample cues stay gray and distinct from authored lyrics.
 */

export const LOVE_AUDIO_SRC = '/media/play/love/love-feat-tygertyger-play-v1.mp3';
export const LOVE_AUDIO_SHA256 =
  '4dd8beeeeadab97e445a9ea0c3e1cf6b20e1fcab00afd5d456bbe04e2b80320e';
export const SOURCE_WAV_SHA256 =
  'aaad19f33bd43854b94e8413f9d5bbdbb5a24fc44f824eb288692cdb3f1ff7ae';

export const ARTBOARD = { width: 360, height: 640 } as const;

export type SceneStateId =
  | 'IDLE'
  | 'WAKE'
  | 'TRAVEL'
  | 'TURN'
  | 'HOLD'
  | 'TABLEAU'
  | 'MACHINE_BREAK'
  | 'RETURN'
  | 'END';

export type LyricKind = 'lyric' | 'sample';

export interface SceneBeat {
  id: SceneStateId;
  start: number;
  end: number;
  /** Optional travel heading in radians. Positive yaws right. */
  heading?: number;
  /** +1 forward, -1 reverse, 0 hold. */
  travel?: number;
  /** First-verse house approach vs later travel. */
  place?: 'house' | 'city';
}

export interface LyricBlock {
  id: string;
  kind: LyricKind;
  start: number;
  end: number;
  lines: string[];
}

export interface TimedHeart {
  id: string;
  index: number;
  appear: number;
  peak: number;
  pass: number;
  corner: 0 | 1 | 2 | 3;
  unbreakable: boolean;
}

/** Four resting places inside the 360×640 artboard, clear of the meter and lyrics. */
export const HEART_CORNERS = [
  { x: 64, y: 108 },
  { x: 296, y: 108 },
  { x: 64, y: 498 },
  { x: 296, y: 498 }
] as const;

export const LOVE_PHASE1 = {
  title: 'Love (feat. Tygertyger)',
  publicArtist: 'Junkfeathers feat. Tygertyger',
  songId: 'SONG-0223',
  bpm: 110,
  durationSeconds: 244.506122,
  sourceDurationSeconds: 244.465918,
  /**
   * First sung line in the Love-Play caption CRT SRT.
   * Opening spoken sample occupies approximately 0:00–0:09.
   */
  firstDownbeat: 9.78,
  /** Four complete intro rows (6 cells). Scene cuts before a leftover partial row. */
  wakeEnd: 8.727273,
  wakeCells: 24,
  houseEnter: 16.62,
  houseGone: 20.78,
  houseCat: 24.46,
  /** Sung word “cat” near the end of “She even took the cat.” */
  houseCatWord: 26.2,
  houseVerseEnd: 30.08,
  glitchStart: 192.506122,
  sampleBreak: 152.52,
  lastChorus: 202.41,
  audioSrc: LOVE_AUDIO_SRC,
  audioSha256: LOVE_AUDIO_SHA256,
  scenes: [
    { id: 'WAKE', start: 0, end: 8.727273, travel: 0, heading: 0 },
    /** First verse: house at night, then geometry falls into a cat face. */
    { id: 'TRAVEL', start: 8.727273, end: 30.08, travel: 1, heading: 0, place: 'house' },
    { id: 'TURN', start: 30.08, end: 53.06, travel: 1, heading: 1.15 },
    { id: 'TABLEAU', start: 53.06, end: 87.06, travel: 0, heading: 0 },
    { id: 'TRAVEL', start: 87.06, end: 112.78, travel: 1, heading: 0, place: 'city' },
    { id: 'TABLEAU', start: 112.78, end: 147.2, travel: 0, heading: 0 },
    { id: 'MACHINE_BREAK', start: 147.2, end: 202.41, travel: 0, heading: 0 },
    { id: 'TABLEAU', start: 202.41, end: 235.5, travel: 0, heading: 0 },
    { id: 'END', start: 235.5, end: 244.506122, travel: 0, heading: 0 }
  ] satisfies SceneBeat[],
  /**
   * Line cues from the Love-Play caption CRT SRT.
   * One or two lines on screen at a time. Sample cues stay visually distinct.
   */
  lyrics: [
    { id: 's-open-1', kind: 'sample', start: 1.12, end: 3.16, lines: ['When human beings are very young,'] },
    {
      id: 's-open-2',
      kind: 'sample',
      start: 3.64,
      end: 6.28,
      lines: ['a great many of the differences', 'between the two sexes,']
    },
    { id: 's-open-3', kind: 'sample', start: 6.52, end: 9.1, lines: ['male and female,', 'do not seem very obvious.'] },
    { id: 'l-01', kind: 'lyric', start: 9.78, end: 12.16, lines: ['When he came home that night,'] },
    { id: 'l-02', kind: 'lyric', start: 12.44, end: 14.54, lines: ['the house was empty,'] },
    { id: 'l-03', kind: 'lyric', start: 15.06, end: 16.62, lines: ['there were no lights.'] },
    { id: 'l-04', kind: 'lyric', start: 16.62, end: 20.44, lines: ['He found a letter on the floor.'] },
    { id: 'l-05', kind: 'lyric', start: 20.78, end: 23.5, lines: ['Everything gone.'] },
    { id: 'l-06', kind: 'lyric', start: 24.46, end: 26.64, lines: ['She even took the cat.'] },
    { id: 'l-07', kind: 'lyric', start: 30.08, end: 31.9, lines: ['Charlie, it said,'] },
    { id: 'l-08', kind: 'lyric', start: 32.2, end: 33.48, lines: ['I am perturbed,'] },
    {
      id: 'l-09',
      kind: 'lyric',
      start: 34.56,
      end: 38.22,
      lines: ['and I am aware', 'that you must be very disturbed,']
    },
    { id: 'l-10', kind: 'lyric', start: 38.62, end: 42.64, lines: ['but I was dying of boredom here,'] },
    { id: 'l-11', kind: 'lyric', start: 42.64, end: 44.5, lines: ['and I had to fly'] },
    { id: 'l-12', kind: 'lyric', start: 46.62, end: 49.4, lines: ['to a bluer sky.'] },
    { id: 'l-13', kind: 'lyric', start: 54.06, end: 58.46, lines: ['Oh the things that we do for love,'] },
    { id: 'l-14', kind: 'lyric', start: 62.94, end: 67.66, lines: ['oh the things that we give for love.'] },
    { id: 'l-15', kind: 'lyric', start: 70.4, end: 75.94, lines: ['He had been such a fool for love,'] },
    { id: 'l-16', kind: 'lyric', start: 78.54, end: 82.56, lines: ['and now he watched it disappear.'] },
    { id: 'l-17', kind: 'lyric', start: 88.06, end: 91.56, lines: ['All over the world,'] },
    { id: 'l-18', kind: 'lyric', start: 91.56, end: 95.68, lines: ['he had followed her trail,'] },
    { id: 'l-19', kind: 'lyric', start: 95.68, end: 99.56, lines: ['thirty-seven cities', 'and ninety hotels,'] },
    { id: 'l-20', kind: 'lyric', start: 100.88, end: 105.2, lines: ['but he never got there on time.'] },
    { id: 'l-21', kind: 'lyric', start: 106.3, end: 109.86, lines: ['He was losing his mind.'] },
    { id: 'l-22', kind: 'lyric', start: 113.78, end: 119.68, lines: ['Oh the things that we do for love,'] },
    { id: 'l-23', kind: 'lyric', start: 123.86, end: 128.74, lines: ['oh the sins we commit for love.'] },
    { id: 'l-24', kind: 'lyric', start: 131.04, end: 137.94, lines: ['Oh, you are such a fool for love,'] },
    { id: 'l-25', kind: 'lyric', start: 139.66, end: 145.6, lines: ["and now he's losing his mind."] },
    { id: 'l-26', kind: 'lyric', start: 147.2, end: 151.4, lines: ['Love, love.'] },
    {
      id: 's-break-1',
      kind: 'sample',
      start: 152.52,
      end: 156.38,
      lines: ['Little boys have a penis', 'and testes on the outside of their body.']
    },
    { id: 'l-27', kind: 'lyric', start: 157.1, end: 159.2, lines: ['Love.'] },
    { id: 's-break-2', kind: 'sample', start: 159.38, end: 161.92, lines: ['Little girls have no testes;'] },
    {
      id: 's-break-3',
      kind: 'sample',
      start: 162.44,
      end: 167.48,
      lines: ['they have a little package inside themselves', 'that opens to the outside in much the same way.']
    },
    { id: 'l-28', kind: 'lyric', start: 167.5, end: 168.6, lines: ['Love.'] },
    {
      id: 's-break-4',
      kind: 'sample',
      start: 168.68,
      end: 171.7,
      lines: ['As they grow up,', 'changes occur in their body,']
    },
    { id: 's-break-5', kind: 'sample', start: 172.06, end: 174.66, lines: ['also in the way they speak and behave.'] },
    { id: 'l-29', kind: 'lyric', start: 174.7, end: 175.36, lines: ['Love.'] },
    {
      id: 's-break-6',
      kind: 'sample',
      start: 175.38,
      end: 179.6,
      lines: ['And during this growing-up period,', 'young people change their attitude to each other.']
    },
    {
      id: 's-break-7',
      kind: 'sample',
      start: 180.14,
      end: 184.42,
      lines: ['They usually become more interested in', 'and attracted to members of the opposite sex.']
    },
    {
      id: 's-break-8',
      kind: 'sample',
      start: 185.42,
      end: 191.0,
      lines: ['Little boys have a penis and testes.', 'Little girls have no penis and testes.']
    },
    { id: 'l-30', kind: 'lyric', start: 203.52, end: 209.7, lines: ['Oh the things that we do for love,'] },
    { id: 'l-31', kind: 'lyric', start: 213.26, end: 217.32, lines: ['oh the sins we commit for love.'] },
    { id: 'l-32', kind: 'lyric', start: 221.0, end: 226.4, lines: ["Life isn't lived without some love,"] },
    { id: 'l-33', kind: 'lyric', start: 231.06, end: 235.42, lines: ['so we simply lose our mind.'] }
  ] satisfies LyricBlock[],
  /**
   * Optional breakable hearts. They fade in the four corners on the one.
   * Missing them never fails the play. About one in five is unbreakable.
   */
  heartSpawnBeats: 4,
  heartLifeBeats: 16,
  heartEnd: 235.5
} as const;

export const BEAT_SECONDS = 60 / LOVE_PHASE1.bpm;
export const HEART_SPAWN_SECONDS = LOVE_PHASE1.heartSpawnBeats * BEAT_SECONDS;
export const HEART_LIFE_SECONDS = LOVE_PHASE1.heartLifeBeats * BEAT_SECONDS;

function unit(i: number, salt: number): number {
  const n = Math.sin(i * 127.1 + salt * 311.7) * 43758.5453;
  return n - Math.floor(n);
}

export function heartCount(): number {
  const lastAppear = LOVE_PHASE1.heartEnd - HEART_LIFE_SECONDS;
  if (lastAppear <= LOVE_PHASE1.firstDownbeat) return 0;
  return Math.floor((lastAppear - LOVE_PHASE1.firstDownbeat) / HEART_SPAWN_SECONDS) + 1;
}

export function heartAt(index: number): TimedHeart {
  const appear = LOVE_PHASE1.firstDownbeat + index * HEART_SPAWN_SECONDS;
  return {
    id: `heart-${index}`,
    index,
    appear,
    peak: appear + HEART_LIFE_SECONDS * 0.45,
    pass: appear + HEART_LIFE_SECONDS,
    corner: (index % 4) as 0 | 1 | 2 | 3,
    unbreakable: unit(index, 8) < 0.2
  };
}

export function heartsVisibleAt(time: number): TimedHeart[] {
  const t = clampTime(time);
  const total = heartCount();
  if (total <= 0) return [];
  const first = Math.max(0, Math.ceil((t - HEART_LIFE_SECONDS - LOVE_PHASE1.firstDownbeat) / HEART_SPAWN_SECONDS));
  const last = Math.min(total - 1, Math.floor((t - LOVE_PHASE1.firstDownbeat) / HEART_SPAWN_SECONDS));
  const visible: TimedHeart[] = [];
  for (let i = first; i <= last; i += 1) {
    const heart = heartAt(i);
    if (t >= heart.appear && t < heart.pass) visible.push(heart);
  }
  return visible;
}

export function heartProgress(heart: TimedHeart, time: number): number {
  if (time <= heart.appear) return 0;
  if (time >= heart.pass) return 1;
  return (time - heart.appear) / Math.max(0.001, heart.pass - heart.appear);
}

export function nextHeartAt(time: number): TimedHeart | null {
  const t = clampTime(time);
  const total = heartCount();
  const index = Math.max(0, Math.ceil((t - LOVE_PHASE1.firstDownbeat) / HEART_SPAWN_SECONDS));
  if (index >= total) return null;
  const heart = heartAt(index);
  return heart.pass > t ? heart : null;
}

/** Eighth-note slots in a 4/4 bar: 1, &, 2, 3, &, 4 */
const PATTERN_EIGHTHS = [true, true, true, false, true, true, true, false] as const;
const PATTERN_LABELS = ['1', '&', '2', '-', '3', '&', '4', '-'] as const;

export interface RhythmState {
  beatFloat: number;
  beatInBar: number;
  eighthInBar: number;
  patternLabel: string;
  onPattern: boolean;
  beatPulse: number;
  eighthPulse: number;
  patternPulse: number;
  onePulse: number;
  energy: number;
  drive: number;
  patternHits: number;
}

function pulseFromPhase(phase: number): number {
  const wrapped = phase - Math.floor(phase);
  return (1 - wrapped) * (1 - wrapped);
}

export function patternHitCount(time: number): number {
  const eighthDuration = BEAT_SECONDS / 2;
  const total = Math.floor(clampTime(time) / eighthDuration + 1e-9);
  if (total < 0) return 0;
  const bars = Math.floor(total / 8);
  const remainder = total % 8;
  let extra = 0;
  for (let i = 0; i <= remainder; i += 1) {
    if (PATTERN_EIGHTHS[i]) extra += 1;
  }
  return bars * 6 + extra;
}

export function rhythmAt(time: number, energy = 0): RhythmState {
  const t = clampTime(time);
  const beatFloat = t / BEAT_SECONDS;
  const eighthFloat = beatFloat * 2;
  const eighthIndex = Math.max(0, Math.floor(eighthFloat + 1e-9));
  const eighthInBar = eighthIndex % 8;
  const beatInBar = (Math.floor(beatFloat) % 4) + 1;
  const onPattern = PATTERN_EIGHTHS[eighthInBar] ?? false;
  const beatPulse = pulseFromPhase(beatFloat);
  const eighthPulse = pulseFromPhase(eighthFloat);
  const patternPulse = onPattern ? eighthPulse * 0.45 : 0;
  const onePulse = beatInBar === 1 ? beatPulse : 0;
  const boundedEnergy = Math.min(1, Math.max(0, energy));
  return {
    beatFloat,
    beatInBar,
    eighthInBar,
    patternLabel: PATTERN_LABELS[eighthInBar] ?? '-',
    onPattern,
    beatPulse,
    eighthPulse,
    patternPulse,
    onePulse,
    energy: boundedEnergy,
    drive: Math.min(0.7, onePulse * 0.45 + beatPulse * 0.08 + boundedEnergy * 0.18),
    patternHits: patternHitCount(t)
  };
}

export interface ClockSnapshot {
  time: number;
  duration: number;
  bpm: number;
  firstDownbeat: number;
  beat: number;
  beatInBar: number;
  bar: number;
  scene: SceneStateId;
  sceneStart: number;
  sceneEnd: number;
  sceneProgress: number;
  heading: number;
  travel: number;
  place: 'house' | 'city' | null;
  lyric: LyricBlock | null;
  sample: LyricBlock | null;
  lyricLines: string[];
  sampleLines: string[];
  remaining: number;
  meter: number;
  nextHeart: TimedHeart | null;
}

export function clampTime(time: number): number {
  if (!Number.isFinite(time) || time < 0) return 0;
  return Math.min(time, LOVE_PHASE1.durationSeconds);
}

export function sceneAt(time: number, hasStarted: boolean, ended: boolean): SceneBeat | null {
  if (!hasStarted) return null;
  if (ended) {
    return LOVE_PHASE1.scenes[LOVE_PHASE1.scenes.length - 1] ?? null;
  }
  const t = clampTime(time);
  for (const scene of LOVE_PHASE1.scenes) {
    if (t >= scene.start && t < scene.end) return scene;
  }
  return LOVE_PHASE1.scenes[LOVE_PHASE1.scenes.length - 1] ?? null;
}

export function lyricAt(time: number, kind: LyricKind): LyricBlock | null {
  const t = clampTime(time);
  let found: LyricBlock | null = null;
  for (const block of LOVE_PHASE1.lyrics) {
    if (block.kind !== kind) continue;
    if (t >= block.start && t < block.end) found = block;
  }
  return found;
}

export function visibleLines(block: LyricBlock | null, max = 2): string[] {
  if (!block) return [];
  return block.lines.slice(0, max);
}

export function overlayLines(lyric: LyricBlock | null, sample: LyricBlock | null): {
  lyricLines: string[];
  sampleLines: string[];
} {
  const lyricLines = visibleLines(lyric);
  const sampleLines = visibleLines(sample);
  if (lyricLines.length > 0 && sampleLines.length > 0) {
    return { lyricLines: lyricLines.slice(0, 1), sampleLines: sampleLines.slice(0, 1) };
  }
  return { lyricLines, sampleLines };
}

export function beatMetrics(time: number): { beat: number; beatInBar: number; bar: number } {
  const t = clampTime(time);
  if (t < LOVE_PHASE1.firstDownbeat) {
    return { beat: 0, beatInBar: 0, bar: 0 };
  }
  const beatsFromDownbeat = (t - LOVE_PHASE1.firstDownbeat) / BEAT_SECONDS;
  const beat = Math.floor(beatsFromDownbeat) + 1;
  const beatInBar = (Math.floor(beatsFromDownbeat) % 4) + 1;
  const bar = Math.floor(beatsFromDownbeat / 4) + 1;
  return { beat, beatInBar, bar };
}

export function lastDownbeatBefore(time: number): number {
  const t = Math.max(time, LOVE_PHASE1.firstDownbeat);
  const beats = (t - LOVE_PHASE1.firstDownbeat) / BEAT_SECONDS;
  const bar = Math.floor((beats - 1e-6) / 4) * 4;
  return LOVE_PHASE1.firstDownbeat + Math.max(0, bar) * BEAT_SECONDS;
}

export function snapshotAt(time: number, hasStarted: boolean, ended: boolean): ClockSnapshot {
  const t = clampTime(time);
  const scene = sceneAt(t, hasStarted, ended);
  const metrics = beatMetrics(t);
  const lyric = hasStarted && !ended ? lyricAt(t, 'lyric') : null;
  const sample = hasStarted && !ended ? lyricAt(t, 'sample') : null;
  const lines = overlayLines(lyric, sample);
  const remaining = Math.max(0, LOVE_PHASE1.durationSeconds - t);
  const sceneStart = scene?.start ?? 0;
  const sceneEnd = scene?.end ?? LOVE_PHASE1.durationSeconds;
  const span = Math.max(0.001, sceneEnd - sceneStart);
  return {
    time: t,
    duration: LOVE_PHASE1.durationSeconds,
    bpm: LOVE_PHASE1.bpm,
    firstDownbeat: LOVE_PHASE1.firstDownbeat,
    beat: metrics.beat,
    beatInBar: metrics.beatInBar,
    bar: metrics.bar,
    scene: !hasStarted ? 'IDLE' : ended || !scene ? 'END' : scene.id,
    sceneStart,
    sceneEnd,
    sceneProgress: scene ? Math.min(1, Math.max(0, (t - sceneStart) / span)) : 0,
    heading: scene?.heading ?? 0,
    travel: scene?.travel ?? 0,
    place: scene?.place ?? null,
    lyric,
    sample,
    lyricLines: lines.lyricLines,
    sampleLines: lines.sampleLines,
    remaining,
    meter: remaining / LOVE_PHASE1.durationSeconds,
    nextHeart: hasStarted && !ended ? nextHeartAt(t) : null
  };
}

export function assertTimelineInvariants(): string[] {
  const errors: string[] = [];
  const duration = LOVE_PHASE1.durationSeconds;
  let previousEnd = 0;
  for (const scene of LOVE_PHASE1.scenes) {
    if (scene.start < 0 || scene.end > duration + 0.0001) {
      errors.push(`scene ${scene.id} outside duration`);
    }
    if (scene.end <= scene.start) errors.push(`scene ${scene.id} end <= start`);
    if (scene.start < previousEnd - 0.0001) errors.push(`scene ${scene.id} overlaps previous`);
    previousEnd = scene.end;
  }
  for (const block of LOVE_PHASE1.lyrics) {
    if (block.start < 0 || block.end > duration + 0.0001) {
      errors.push(`lyric ${block.id} outside duration`);
    }
    if (block.end <= block.start) errors.push(`lyric ${block.id} end <= start`);
    if (block.lines.length < 1 || block.lines.length > 2) {
      errors.push(`lyric ${block.id} must show 1 or 2 lines`);
    }
  }
  const totalHearts = heartCount();
  if (totalHearts < 8) errors.push('heart field is too sparse');
  let previousAppear = -1;
  for (let i = 0; i < totalHearts; i += 1) {
    const heart = heartAt(i);
    if (heart.appear < 0 || heart.pass > duration + 0.0001) {
      errors.push(`heart ${heart.id} outside duration`);
    }
    if (!(heart.appear < heart.peak && heart.peak < heart.pass)) {
      errors.push(`heart ${heart.id} times not appear < peak < pass`);
    }
    if (heart.appear < previousAppear) errors.push(`heart ${heart.id} unsorted`);
    previousAppear = heart.appear;
  }
  return errors;
}
