import * as Phaser from 'phaser';
import {
  ARTBOARD,
  LOVE_PHASE1,
  HEART_CORNERS,
  type SceneStateId,
  type TimedHeart,
  heartProgress,
  heartsVisibleAt,
  snapshotAt,
  type ClockSnapshot,
  rhythmAt,
  type RhythmState,
  BEAT_SECONDS
} from '../../data/play/love-phase1.timeline';

const WHITE = 0xffffff;
const GRAY = 0x8a8a8a;
const DIM = 0x4d4d4d;
const HEART_PIXELS = [0xff5a7a, 0xffd166, 0x7c5cff, 0x3ee0ff, 0xff8bd5, 0xffffff, 0x9dffb0];
const HEART_FAR = 7;
const HEART_NEAR = 42;
const TABLEAU_CX = 180;
const TABLEAU_CY = 300;
const TABLEAU_DOT_R = 92;
const TABLEAU_SIGHT = 150;
const TABLEAU_HEART = 16;
const DOT_RESPAWN = 8 * BEAT_SECONDS;

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  born: number;
  life: number;
  size: number;
  color: number;
}

interface LoveClock {
  audio: HTMLAudioElement;
  hasStarted: boolean;
  ended: boolean;
  reducedMotion: boolean;
  debug: boolean;
  hits: Set<string>;
  stung: Set<string>;
  heartsBroken: number;
  particles: Particle[];
  playError: string | null;
  chorusPulse: number;
  energy: number;
  readEnergy: () => number;
  resumeEnergy: () => Promise<void>;
}

function fract(n: number): number {
  return n - Math.floor(n);
}

function seed(i: number, salt: number): number {
  return fract(Math.sin(i * 127.1 + salt * 311.7) * 43758.5453);
}

function lerp(a: number, b: number, u: number): number {
  return a + (b - a) * u;
}

function ramp(time: number, start: number, end: number): number {
  return Math.min(1, Math.max(0, (time - start) / Math.max(0.001, end - start)));
}

function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function canWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return Boolean(canvas.getContext('webgl2') || canvas.getContext('webgl'));
  } catch {
    return false;
  }
}

function createEnergyTap(audio: HTMLAudioElement): { read: () => number; resume: () => Promise<void> } {
  // Amplitude follow of the playing element. Beat grid still comes from BPM 110 + currentTime.
  const ctx = new AudioContext();
  const source = ctx.createMediaElementSource(audio);
  const analyser = ctx.createAnalyser();
  analyser.fftSize = 2048;
  analyser.smoothingTimeConstant = 0.62;
  source.connect(analyser);
  analyser.connect(ctx.destination);
  const timeDomain = new Uint8Array(analyser.fftSize);
  const freq = new Uint8Array(analyser.frequencyBinCount);
  return {
    async resume() {
      if (ctx.state === 'suspended') await ctx.resume();
    },
    read() {
      if (ctx.state !== 'running') return 0;
      analyser.getByteTimeDomainData(timeDomain);
      analyser.getByteFrequencyData(freq);
      let sum = 0;
      for (let i = 0; i < timeDomain.length; i += 1) {
        const v = (timeDomain[i] - 128) / 128;
        sum += v * v;
      }
      const rms = Math.sqrt(sum / timeDomain.length);
      let bass = 0;
      const bassBins = 10;
      for (let i = 0; i < bassBins; i += 1) bass += freq[i] ?? 0;
      bass /= bassBins * 255;
      return Math.min(1, rms * 4.2 + bass * 0.85);
    }
  };
}

function formatTime(seconds: number): string {
  const clamped = Math.max(0, seconds);
  const m = Math.floor(clamped / 60);
  const s = clamped - m * 60;
  return `${m}:${s.toFixed(2).padStart(5, '0')}`;
}

function formatClock(seconds: number): string {
  const whole = Math.max(0, Math.floor(seconds));
  const m = Math.floor(whole / 60);
  const s = whole % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function setLines(target: HTMLElement, lines: string[]): void {
  target.replaceChildren();
  for (const line of lines) {
    const p = document.createElement('p');
    p.textContent = line;
    target.append(p);
  }
}

function syncLoveOverlay(overlay: OverlayRefs, snapshot: ClockSnapshot, clock: LoveClock): void {
  const idle = snapshot.scene === 'IDLE';
  const ended = snapshot.scene === 'END';
  overlay.playButton.hidden = !idle;
  overlay.endCard.hidden = !ended;
  overlay.status.textContent = idle
    ? 'WAKE TO PLAY'
    : ended
      ? 'END'
      : snapshot.scene.replaceAll('_', ' ');

  overlay.meter.hidden = idle || ended;
  if (!idle && !ended) {
    overlay.meterFill.style.width = `${Math.max(0, Math.min(1, snapshot.meter)) * 100}%`;
    overlay.meterTime.textContent = formatClock(snapshot.remaining);
    overlay.hearts.textContent = `HEARTS ${clock.heartsBroken}`;
  }

  overlay.pauseButton.disabled = idle || ended;
  overlay.restartButton.disabled = idle && !ended;
  overlay.pauseButton.textContent = !idle && !ended && clock.audio.paused ? 'RESUME' : 'PAUSE';

  if (ended) {
    overlay.heartsEnd.textContent = `HEARTS BROKEN ${clock.heartsBroken}`;
  }

  setLines(overlay.lyric, ended ? [] : snapshot.lyricLines);
  overlay.lyric.hidden = ended || snapshot.lyricLines.length === 0;
  overlay.lyric.dataset.kind = 'lyric';

  setLines(overlay.sample, ended ? [] : snapshot.sampleLines);
  overlay.sample.hidden = ended || snapshot.sampleLines.length === 0;

  overlay.stage.dataset.scene = snapshot.scene;

  if (clock.debug) {
    overlay.debug.hidden = false;
    const next = snapshot.nextHeart;
    const rhythm = rhythmAt(snapshot.time, clock.energy);
    overlay.debug.textContent = [
      `TIME ${formatTime(snapshot.time)} / ${formatTime(snapshot.duration)}`,
      `LEFT ${formatClock(snapshot.remaining)}`,
      `BPM ${snapshot.bpm}`,
      `DOWNBEAT ${snapshot.firstDownbeat.toFixed(3)}`,
      `BEAT ${snapshot.beat}  BAR ${snapshot.bar}  BEAT-IN-BAR ${snapshot.beatInBar}`,
      `GRID ${rhythm.patternLabel}  ENERGY ${rhythm.energy.toFixed(2)}  DRIVE ${rhythm.drive.toFixed(2)}`,
      `SCENE ${snapshot.scene}${snapshot.place ? ` ${snapshot.place.toUpperCase()}` : ''}`,
      `LYRIC ${snapshot.lyric?.id ?? '—'}`,
      `SAMPLE ${snapshot.sample?.id ?? '—'}`,
      `HEARTS ${clock.heartsBroken}`,
      `NEXT ${next ? `${next.id} @ ${next.appear.toFixed(1)}` : '—'}`
    ].join('\n');
  } else {
    overlay.debug.hidden = true;
  }

  if (clock.playError) {
    overlay.error.hidden = false;
    overlay.error.textContent = clock.playError;
  } else {
    overlay.error.hidden = true;
  }
}

class LovePhase1Scene extends Phaser.Scene {
  static clock: LoveClock | null = null;
  static overlay: OverlayRefs | null = null;

  private graphics!: Phaser.GameObjects.Graphics;
  private fx!: Phaser.GameObjects.Graphics;
  private clock!: LoveClock;
  private overlay!: OverlayRefs;
  private targetX = TABLEAU_CX;
  private targetY = TABLEAU_CY;
  private grabbing = false;
  private grabDX = 0;
  private grabDY = 0;
  private releaseAt = -1;
  private releaseX = TABLEAU_CX;
  private releaseY = TABLEAU_CY;
  private shotDots = new Map<number, number>();
  private tableauKey = -1;
  private pointerX = TABLEAU_CX;
  private pointerY = TABLEAU_CY;

  constructor() {
    super({ key: 'LovePhase1Scene' });
  }

  init(): void {
    if (!LovePhase1Scene.clock || !LovePhase1Scene.overlay) {
      throw new Error('PLAY LOVE clock was not bound');
    }
    this.clock = LovePhase1Scene.clock;
    this.overlay = LovePhase1Scene.overlay;
  }

  create(): void {
    this.cameras.main.setBackgroundColor('#000000');
    this.graphics = this.add.graphics();
    this.fx = this.add.graphics();
    this.fx.setDepth(3);
    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      this.onPointerDown(pointer.worldX, pointer.worldY);
    });
    this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      this.pointerX = pointer.worldX;
      this.pointerY = pointer.worldY;
      if (!this.grabbing || !pointer.isDown) return;
      this.targetX = pointer.worldX + this.grabDX;
      this.targetY = pointer.worldY + this.grabDY;
    });
    this.input.on('pointerup', () => this.releaseTarget());
    this.input.on('pointerupoutside', () => this.releaseTarget());
  }

  update(): void {
    const audio = this.clock.audio;
    const time = audio.currentTime;
    this.clock.energy = this.clock.readEnergy();
    const snapshot = snapshotAt(time, this.clock.hasStarted, this.clock.ended || audio.ended);
    this.expireHits(snapshot.time);
    this.drawWorld(snapshot);
    syncLoveOverlay(this.overlay, snapshot, this.clock);
  }

  private expireHits(time: number): void {
    this.clock.particles = this.clock.particles.filter((particle) => time - particle.born < particle.life);
  }

  private onPointerDown(x: number, y: number): void {
    if (!this.clock.hasStarted || this.clock.ended) return;
    const time = this.clock.audio.currentTime;
    const snapshot = snapshotAt(time, this.clock.hasStarted, this.clock.ended);
    if (snapshot.scene === 'TABLEAU') {
      const dx = x - this.targetX;
      const dy = y - this.targetY;
      if (dx * dx + dy * dy <= 58 * 58) {
        this.grabbing = true;
        this.grabDX = this.targetX - x;
        this.grabDY = this.targetY - y;
        this.releaseAt = -1;
        return;
      }
      if (snapshot.sceneStart >= LOVE_PHASE1.lastChorus) this.tryHit(x, y);
      return;
    }
    this.tryHit(x, y);
  }

  private releaseTarget(): void {
    if (!this.grabbing) return;
    this.grabbing = false;
    this.releaseAt = this.clock.audio.currentTime;
    this.releaseX = this.targetX;
    this.releaseY = this.targetY;
  }

  private syncTableauAim(time: number, reduced: boolean, rhythm: RhythmState): void {
    if (this.grabbing) {
      this.tryShootDots(time, reduced, rhythm);
      return;
    }
    if (this.releaseAt < 0) {
      this.targetX = TABLEAU_CX;
      this.targetY = TABLEAU_CY;
      return;
    }
    const u = Math.min(1, (time - this.releaseAt) / 0.32);
    const ease = 1 - (1 - u) * (1 - u) * (1 - u);
    this.targetX = lerp(this.releaseX, TABLEAU_CX, ease);
    this.targetY = lerp(this.releaseY, TABLEAU_CY, ease);
    if (u >= 1) this.releaseAt = -1;
  }

  private tableauDot(index: number, reduced: boolean, rhythm: RhythmState): { x: number; y: number } {
    const a = (index / 8) * Math.PI * 2 + (reduced ? 0 : Math.floor(rhythm.beatFloat / 4) * 0.08);
    return {
      x: TABLEAU_CX + Math.cos(a) * TABLEAU_DOT_R,
      y: TABLEAU_CY + Math.sin(a) * TABLEAU_DOT_R
    };
  }

  private tryShootDots(time: number, reduced: boolean, rhythm: RhythmState): void {
    for (let i = 0; i < 8; i += 1) {
      if (!this.dotIsLive(i, time)) continue;
      const dot = this.tableauDot(i, reduced, rhythm);
      const dx = this.targetX - dot.x;
      const dy = this.targetY - dot.y;
      if (dx * dx + dy * dy <= 24 * 24) {
        this.shotDots.set(i, time);
        this.clock.chorusPulse = time;
        this.clock.heartsBroken += 1;
        this.spawnBreakup(dot.x, dot.y, time);
      }
    }
  }

  private dotIsLive(index: number, time: number): boolean {
    const shot = this.shotDots.get(index);
    if (shot === undefined) return true;
    if (time - shot >= DOT_RESPAWN) {
      this.shotDots.delete(index);
      return true;
    }
    return false;
  }

  private tryHit(x: number, y: number): void {
    if (!this.clock.hasStarted || this.clock.ended) return;
    const time = this.clock.audio.currentTime;
    const rhythm = rhythmAt(time, this.clock.energy);
    const snapshot = snapshotAt(time, this.clock.hasStarted, this.clock.ended);
    if (snapshot.scene === 'TABLEAU' && snapshot.sceneStart < LOVE_PHASE1.lastChorus) return;
    let best: { heart: TimedHeart; x: number; y: number; dist: number } | null = null;
    for (const heart of heartsVisibleAt(time)) {
      if (this.clock.hits.has(heart.id)) continue;
      const pose = this.heartPose(heart, time, this.clock.reducedMotion, rhythm);
      const dx = x - pose.x;
      const dy = y - pose.y;
      const dist = dx * dx + dy * dy;
      const reach = pose.radius * pose.radius;
      if (dist <= reach && (!best || dist < best.dist)) {
        best = { heart, x: pose.x, y: pose.y, dist };
      }
    }
    if (best) {
      if (best.heart.unbreakable) {
        if (!this.clock.stung.has(best.heart.id)) {
          this.clock.stung.add(best.heart.id);
          this.clock.heartsBroken -= 1;
        }
        return;
      }
      this.clock.hits.add(best.heart.id);
      this.clock.heartsBroken += 1;
      this.spawnBreakup(best.x, best.y, time);
    }
  }

  private spawnBreakup(x: number, y: number, time: number): void {
    this.spawnBurst(x, y, time, 28, 12, 56, 0.7, 4, HEART_PIXELS);
  }

  private spawnBurst(
    x: number,
    y: number,
    time: number,
    count: number,
    minSpeed: number,
    extraSpeed: number,
    life: number,
    size: number,
    colors: number[]
  ): void {
    for (let i = 0; i < count; i += 1) {
      const angle = seed(i, time) * Math.PI * 2;
      const speed = minSpeed + seed(i + 9, time + 1) * extraSpeed;
      this.clock.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        born: time,
        life: life + seed(i, 2) * 0.35,
        size: 2 + Math.floor(seed(i, 3) * size),
        color: colors[Math.floor(seed(i, 11) * colors.length)] ?? WHITE
      });
    }
  }

  private heartPose(
    heart: TimedHeart,
    time: number,
    reduced: boolean,
    rhythm: RhythmState
  ): { x: number; y: number; size: number; fade: number; radius: number } {
    const progress = heartProgress(heart, time);
    const ease = progress * progress;
    const corner = HEART_CORNERS[heart.corner];
    const size = lerp(HEART_FAR, HEART_NEAR, ease) * (reduced ? 1 : 1 + rhythm.onePulse * 0.18);
    const fade = progress < 0.08
      ? progress / 0.08
      : progress > 0.84
        ? Math.max(0, (1 - progress) / 0.16)
        : 1;
    return {
      x: corner.x,
      y: corner.y + (reduced ? 0 : rhythm.onePulse * -2),
      size,
      fade,
      radius: Math.max(22, size * 1.05)
    };
  }

  private drawWorld(snapshot: ClockSnapshot): void {
    const g = this.graphics;
    g.clear();
    this.fx.clear();
    const { time, scene, sceneProgress, heading, travel } = snapshot;
    const reduced = this.clock.reducedMotion;
    const rhythm = rhythmAt(time, this.clock.energy);

    this.drawFrame(g);

    if (scene !== 'TABLEAU') {
      this.grabbing = false;
      this.releaseAt = -1;
      this.targetX = TABLEAU_CX;
      this.targetY = TABLEAU_CY;
      this.tableauKey = -1;
    }

    switch (scene) {
      case 'IDLE':
        this.drawIdle(g, rhythm);
        break;
      case 'WAKE':
        this.drawWake(g, rhythm, reduced);
        break;
      case 'TRAVEL':
        if (snapshot.place === 'house') {
          this.drawHouseNight(g, time, sceneProgress, reduced, rhythm);
          break;
        }
        this.drawWorldVerse(g, time, reduced, rhythm);
        break;
      case 'TURN':
        this.drawCharlieVerse(g, time, reduced, rhythm);
        break;
      case 'RETURN':
        this.drawCorridor(g, time, heading, travel, scene, reduced, rhythm);
        break;
      case 'HOLD':
        this.drawHold(g, heading, reduced, rhythm);
        break;
      case 'TABLEAU':
        if (this.tableauKey !== snapshot.sceneStart) {
          this.tableauKey = snapshot.sceneStart;
          this.shotDots.clear();
          this.targetX = TABLEAU_CX;
          this.targetY = TABLEAU_CY;
          this.grabbing = false;
          this.releaseAt = -1;
        }
        this.syncTableauAim(time, reduced, rhythm);
        this.drawTableau(g, snapshot, reduced, rhythm);
        break;
      case 'MACHINE_BREAK':
        this.drawBreak(g, snapshot, reduced);
        break;
      case 'END':
        this.drawEnd(g, sceneProgress, reduced, rhythm);
        break;
      default:
        this.drawIdle(g, rhythm);
    }

    this.drawHearts(g, snapshot, rhythm);
    this.drawParticles(this.fx, snapshot.time);
  }

  private drawFrame(g: Phaser.GameObjects.Graphics): void {
    g.lineStyle(2, WHITE, 0.9);
    g.strokeRect(8, 8, ARTBOARD.width - 16, ARTBOARD.height - 16);
    g.lineStyle(1, DIM, 1);
    g.strokeRect(14, 14, ARTBOARD.width - 28, ARTBOARD.height - 28);
  }

  private drawIdle(g: Phaser.GameObjects.Graphics, rhythm: RhythmState): void {
    const pulse = 0.2 + rhythm.onePulse * 0.12;
    g.lineStyle(1, GRAY, pulse);
    g.strokeRect(110, 210, 140, 140);
    g.lineStyle(1, DIM, 1);
    for (let i = 0; i < 5; i += 1) {
      g.strokeRect(124 + i * 4, 224 + i * 4, 112 - i * 8, 112 - i * 8);
    }
  }

  private drawWake(g: Phaser.GameObjects.Graphics, rhythm: RhythmState, reduced: boolean): void {
    const scan = reduced ? 0.35 : fract(rhythm.beatFloat / 4);
    g.fillStyle(WHITE, 0.04 + rhythm.onePulse * 0.05);
    g.fillRect(20, 20 + scan * 520, 320, 4);
    const cells = Math.min(LOVE_PHASE1.wakeCells, rhythm.patternHits);
    for (let i = 0; i < cells; i += 1) {
      const col = i % 6;
      const row = Math.floor(i / 6);
      const newest = i === cells - 1;
      const bob = reduced ? 0 : rhythm.onePulse * Math.sin(i * 1.7) * 1.6;
      const size = 16 + (newest ? rhythm.patternPulse * 2 : 0) + rhythm.onePulse * 1.5;
      const x = 48 + col * 44;
      const y = 150 + row * 44 + bob;
      g.fillStyle(GRAY, 0.38 + seed(i, 1) * 0.2 + rhythm.onePulse * 0.12);
      g.fillRect(x, y, size, size);
    }
  }

  private drawHouseNight(
    g: Phaser.GameObjects.Graphics,
    time: number,
    _progress: number,
    reduced: boolean,
    rhythm: RhythmState
  ): void {
    const one = reduced ? 0 : rhythm.onePulse;
    const approach = ramp(time, LOVE_PHASE1.wakeEnd, 15.06);
    const threshold = ramp(time, 12.44, LOVE_PHASE1.houseEnter);
    const inside = ramp(time, 15.06, LOVE_PHASE1.houseEnter);
    const shatter = ramp(time, LOVE_PHASE1.houseEnter, LOVE_PHASE1.houseGone);
    const catForm = ramp(time, LOVE_PHASE1.houseGone, LOVE_PHASE1.houseCat);
    const houseHold = 1 - catForm;
    const exterior = (1 - threshold) * houseHold;
    const beatKey = Math.floor(rhythm.beatFloat);
    const gx = one * (seed(beatKey, 3) - 0.5) * 8 + shatter * (1 - catForm) * (seed(beatKey, 17) - 0.5) * 28;
    const gy = one * (seed(beatKey, 9) - 0.5) * 3;
    const vpX = 180;
    const houseW = lerp(64, 248, approach);
    const houseH = lerp(48, 176, approach);
    const houseX = vpX - houseW / 2 + shatter * (seed(4, 18) - 0.5) * 40 * (1 - catForm);
    const houseY = lerp(268, 248, approach) + shatter * 18 * (1 - catForm);
    const roofPeak = houseY - houseH * 0.46 + shatter * (seed(5, 19) - 0.5) * 36 * (1 - catForm);
    const doorW = lerp(12, lerp(36, 220, threshold), approach);
    const doorH = lerp(20, lerp(52, 310, threshold), approach);
    const doorX = vpX - doorW / 2;
    const doorY = houseY + houseH - doorH * (1 - threshold * 0.35);

    const strokeHouse = (ox: number, oy: number, alpha: number): void => {
      if (alpha < 0.04) return;
      g.lineStyle(1, WHITE, alpha);
      g.beginPath();
      g.moveTo(houseX + ox, houseY + oy);
      g.lineTo(vpX + ox, roofPeak + oy);
      g.lineTo(houseX + houseW + ox, houseY + oy);
      g.closePath();
      g.strokePath();
      g.strokeRect(houseX + ox, houseY + oy, houseW, houseH);
      g.lineStyle(1, DIM, alpha * 0.9);
      const winW = houseW * 0.15;
      const winH = houseH * 0.18;
      const winY = houseY + houseH * 0.22 + oy;
      const scatterL = shatter * (1 - catForm) * 22;
      const scatterR = shatter * (1 - catForm) * -18;
      g.strokeRect(houseX + houseW * 0.16 + ox - scatterL, winY, winW, winH);
      g.strokeRect(houseX + houseW * 0.69 + ox - scatterR, winY + shatter * 10 * (1 - catForm), winW, winH);
      g.fillStyle(0x000000, Math.min(0.95, alpha + 0.35));
      g.fillRect(houseX + houseW * 0.16 + ox - scatterL + 1, winY + 1, winW - 2, winH - 2);
      g.fillRect(houseX + houseW * 0.69 + ox - scatterR + 1, winY + shatter * 10 * (1 - catForm) + 1, winW - 2, winH - 2);
    };

    if (exterior > 0.08) {
      g.fillStyle(WHITE, (0.05 + one * 0.03) * exterior);
      for (let i = 0; i < 11; i += 1) {
        g.fillRect(24 + seed(i, 14) * 312, 28 + seed(i, 15) * 170, 1, 1);
      }
      g.lineStyle(1, DIM, 0.7 * exterior);
      g.lineBetween(16, 438, 344, 438);
    }

    if (houseHold > 0.05) {
      g.lineStyle(1, GRAY, (0.4 + one * 0.12) * houseHold);
      g.beginPath();
      g.moveTo(36 + gx * 0.3, 600);
      g.lineTo(doorX, Math.min(600, doorY + doorH));
      g.moveTo(324 - gx * 0.3, 600);
      g.lineTo(doorX + doorW, Math.min(600, doorY + doorH));
      g.strokePath();

      g.lineStyle(1, DIM, (0.28 + one * 0.08) * houseHold);
      for (let i = 0; i < 7; i += 1) {
        const slot = fract(i / 7 + time * 0.008);
        const y = lerp(Math.min(600, doorY + doorH), 600, slot * slot) + shatter * (seed(i, 20) - 0.5) * 24 * (1 - catForm);
        const width = lerp(doorW, 268, slot * slot);
        g.lineBetween(vpX - width / 2 + gx * 0.2, y, vpX + width / 2, y);
      }

      strokeHouse(0, 0, 0.52 * Math.max(exterior, inside * 0.35) * houseHold);
      if (one > 0.25 && exterior > 0.12) {
        strokeHouse(gx, gy, 0.22 * exterior);
        strokeHouse(-gx * 0.7, 1, 0.14 * exterior);
      }

      if (inside < 0.6 && houseHold > 0.2) {
        g.fillStyle(0x000000, 0.94 * (1 - inside) * houseHold);
        g.fillRect(doorX, doorY, doorW, Math.max(8, doorH));
        g.lineStyle(1, WHITE, (0.32 + one * 0.18) * (1 - inside * 0.7) * houseHold);
        g.strokeRect(doorX, doorY, doorW, Math.max(8, doorH));
        if (one > 0.4) {
          g.lineStyle(1, GRAY, 0.28 * (1 - inside) * houseHold);
          g.strokeRect(doorX + gx, doorY + gy, doorW, Math.max(8, doorH));
        }
      }

      if (threshold > 0.12) {
        const hall = Math.max(inside, (threshold - 0.12) / 0.88);
        g.lineStyle(1, DIM, (0.28 + hall * 0.28) * houseHold);
        g.beginPath();
        g.moveTo(22, 72);
        g.lineTo(doorX, doorY);
        g.moveTo(338, 72);
        g.lineTo(doorX + doorW, doorY);
        g.strokePath();
        for (let i = 0; i < 4; i += 1) {
          const fly = shatter * (1 - catForm);
          const y = 88 + i * 72 + one * 1.5 + fly * (seed(i, 24) - 0.5) * 70;
          const inset = 32 + i * 20 + fly * (seed(i, 25) - 0.5) * 48;
          const dark = (0.18 + hall * 0.28) * houseHold;
          g.lineStyle(1, GRAY, dark);
          g.strokeRect(inset, y, 38, 54);
          g.strokeRect(322 - inset - 38, y, 38, 54);
          g.fillStyle(0x000000, 0.88 * houseHold);
          g.fillRect(inset + 1, y + 1, 36, 52);
          g.fillRect(323 - inset - 38, y + 1, 36, 52);
        }
        if (time > LOVE_PHASE1.houseEnter - 0.4 && catForm < 0.7) {
          const letterY = lerp(470, 390, inside);
          g.lineStyle(1, WHITE, (0.35 + one * 0.12) * houseHold);
          g.strokeRect(vpX - 10 + shatter * 16, letterY, 18, 12);
        }
      }
    }

    if (catForm > 0.03) {
      const winkAt = LOVE_PHASE1.houseCatWord;
      const breakup = ramp(time, winkAt, LOVE_PHASE1.houseVerseEnd);
      const fade = 1 - breakup * 0.35;
      if (fade > 0.04) {
        this.drawCatFace(g, catForm, one, reduced, {
          wink: time >= winkAt && breakup < 0.28,
          punch: time >= winkAt && breakup < 0.22 ? one : 0,
          fade,
          breakup
        });
      }
    }
  }

  private drawCatFace(
    g: Phaser.GameObjects.Graphics,
    assemble: number,
    one: number,
    reduced: boolean,
    gesture?: { wink?: boolean; punch?: number; fade?: number; breakup?: number }
  ): void {
    const wink = gesture?.wink ?? false;
    const punch = gesture?.punch ?? 0;
    const fade = gesture?.fade ?? 1;
    const breakup = gesture?.breakup ?? 0;
    const cx = 180;
    const cy = 292 + punch * 16;
    const s = lerp(0.62, 1, assemble) * (1 + punch * 0.32);
    const scatter = reduced ? 8 + breakup * 28 : (1 - assemble) * 54 + breakup * 132;
    const alpha = Math.min(1, 0.25 + assemble * 0.75) * fade;
    const p = (x: number, y: number, i: number): { x: number; y: number } => ({
      x: cx + x * s + (seed(i, 31) - 0.5) * scatter + one * (seed(i, 32) - 0.5) * 2 + (seed(i, 41) - 0.5) * breakup * 90,
      y: cy + y * s + (seed(i, 33) - 0.5) * scatter + one * (seed(i, 34) - 0.5) * 2 + (seed(i, 42) - 0.5) * breakup * 110
    });
    const strokePoly = (pts: { x: number; y: number }[], color: number, a: number): void => {
      if (pts.length < 2) return;
      g.lineStyle(1, color, a);
      g.beginPath();
      g.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length; i += 1) g.lineTo(pts[i].x, pts[i].y);
      g.closePath();
      g.strokePath();
    };

    strokePoly([p(-98, -34, 1), p(-126, -176, 2), p(-20, -80, 3)], WHITE, alpha);
    strokePoly([p(98, -34, 4), p(126, -176, 5), p(20, -80, 6)], WHITE, alpha);
    strokePoly([
      p(-112, -16, 7),
      p(-132, 66, 8),
      p(-74, 164, 9),
      p(74, 164, 10),
      p(132, 66, 11),
      p(112, -16, 12)
    ], WHITE, alpha);

    const eyeL = [p(-78, -6, 13), p(-48, -28, 14), p(-18, -6, 15), p(-48, 18, 16)];
    const eyeR = [p(18, -6, 17), p(48, -28, 18), p(78, -6, 19), p(48, 18, 20)];
    if (wink) {
      g.lineStyle(2, WHITE, alpha);
      g.lineBetween(p(-78, -2, 13).x, p(-78, -2, 13).y, p(-18, -2, 15).x, p(-18, -2, 15).y);
    } else {
      strokePoly(eyeL, GRAY, alpha);
      g.fillStyle(0x000000, 0.9 * assemble * fade);
      const leftEye = p(-48, -6, 14);
      g.fillRect(leftEye.x - 10, leftEye.y - 8, 20, 18);
    }
    strokePoly(eyeR, GRAY, alpha);
    g.fillStyle(0x000000, 0.9 * assemble * fade);
    const rightEye = p(48, -6, 18);
    g.fillRect(rightEye.x - 10, rightEye.y - 8, 20, 18);

    strokePoly([p(-16, 46, 21), p(16, 46, 22), p(0, 78 + punch * 18, 23)], WHITE, alpha);
    g.lineStyle(1, GRAY, alpha * 0.9);
    const mouthL = p(-18, 88 + punch * 14, 24);
    const mouthR = p(18, 88 + punch * 14, 25);
    const nose = p(0, 78 + punch * 10, 23);
    g.lineBetween(mouthL.x, mouthL.y, nose.x, nose.y);
    g.lineBetween(mouthR.x, mouthR.y, nose.x, nose.y);

    g.lineStyle(1, DIM, alpha * 0.85);
    const whiskers: Array<[number, number, number, number, number, number]> = [
      [-86, 52, -168, 28, 26, 27],
      [-88, 70, -172, 70, 28, 29],
      [-84, 88, -160, 118, 30, 31],
      [86, 52, 168, 28, 32, 33],
      [88, 70, 172, 70, 34, 35],
      [84, 88, 160, 118, 36, 37]
    ];
    for (const [x1, y1, x2, y2, ia, ib] of whiskers) {
      const a = p(x1, y1, ia);
      const b = p(x2, y2, ib);
      g.lineBetween(a.x, a.y, b.x, b.y);
    }

    if (breakup > 0.06) {
      const shards = reduced ? 8 : 16;
      for (let i = 0; i < shards; i += 1) {
        const bit = p((seed(i, 60) - 0.5) * 180, (seed(i, 61) - 0.5) * 200, 70 + i);
        const w = 6 + seed(i, 62) * 26;
        const h = 5 + seed(i, 63) * 20;
        g.lineStyle(1, seed(i, 64) > 0.5 ? WHITE : GRAY, alpha * Math.min(1, breakup * 1.6));
        g.strokeRect(bit.x - w / 2, bit.y - h / 2, w, h);
      }
    }
  }

  private drawCharlieVerse(
    g: Phaser.GameObjects.Graphics,
    time: number,
    reduced: boolean,
    rhythm: RhythmState
  ): void {
    const one = reduced ? 0 : rhythm.onePulse;
    const letter = ramp(time, 30.08, 32.2);
    const perturb = ramp(time, 32.2, 38.22);
    const bored = ramp(time, 38.62, 42.64);
    const fly = ramp(time, 42.64, 49.4);
    const sky = ramp(time, 46.62, 53.06);
    const shake = perturb * (reduced ? 1 : one * 5 + Math.sin(time * 6.2) * 2.4);
    const paperW = lerp(36, 168, letter);
    const paperH = lerp(24, 216, letter);
    const px = 180 - paperW / 2 + shake;
    const py = lerp(250, 188, letter) + bored * 36 - fly * 80;
    if (letter > 0.04 && fly < 0.92) {
      g.lineStyle(1, WHITE, (0.35 + letter * 0.5) * (1 - fly * 0.85));
      g.strokeRect(px, py, paperW, paperH);
      g.lineStyle(1, GRAY, (0.28 + perturb * 0.25) * (1 - fly));
      const lines = 6;
      for (let i = 0; i < lines; i += 1) {
        const y = py + 22 + i * (paperH - 36) / Math.max(1, lines - 1) + shake * (i % 2 === 0 ? 1 : -1) * 0.4;
        const jag = perturb * (seed(i, 21) - 0.5) * 18;
        g.lineBetween(px + 16, y, px + paperW - 16 + jag, y + jag * 0.25);
      }
    }
    if (bored > 0.08 && sky < 0.7) {
      const still = (1 - fly) * bored;
      g.lineStyle(1, DIM, 0.35 * still);
      g.strokeRect(48, 96, 72, 88);
      g.lineBetween(48, 140, 120, 140);
      g.lineStyle(1, GRAY, 0.28 * still);
      g.strokeRect(70, 430, 28, 36);
      g.lineBetween(70, 430, 84, 408);
      g.lineBetween(98, 430, 84, 408);
    }
    if (fly > 0.04) {
      const birdY = lerp(420, 150, fly);
      const birdX = lerp(180, 250, fly) + Math.sin(time * 2.1) * 10 * fly;
      const wing = 16 + fly * 18 + one * 4;
      g.lineStyle(1, WHITE, 0.45 + fly * 0.4);
      g.beginPath();
      g.moveTo(birdX - wing, birdY + 6);
      g.lineTo(birdX, birdY);
      g.lineTo(birdX + wing, birdY + 6);
      g.strokePath();
      if (fly > 0.45) {
        g.lineStyle(1, GRAY, 0.35 * fly);
        g.beginPath();
        g.moveTo(birdX - 70, birdY + 36);
        g.lineTo(birdX - 48, birdY + 28);
        g.lineTo(birdX - 26, birdY + 36);
        g.strokePath();
      }
    }
    if (sky > 0.05) {
      g.lineStyle(1, DIM, 0.25 + sky * 0.35);
      g.lineBetween(20, lerp(420, 260, sky), 340, lerp(400, 248, sky));
      for (let i = 0; i < 6; i += 1) {
        const y = lerp(250, 90, sky) + i * 18 + one * 1.5;
        g.lineStyle(1, i % 2 === 0 ? GRAY : DIM, (0.12 + sky * 0.28) * (1 - i * 0.08));
        g.lineBetween(28 + i * 8, y, 332 - i * 8, y - 6);
      }
    }
  }

  private drawWorldVerse(
    g: Phaser.GameObjects.Graphics,
    time: number,
    reduced: boolean,
    rhythm: RhythmState
  ): void {
    const one = reduced ? 0 : rhythm.onePulse;
    const world = ramp(time, 87.06, 91.56);
    const trail = ramp(time, 91.56, 95.68);
    const cities = ramp(time, 95.68, 100.88);
    const late = ramp(time, 100.88, 106.3);
    const mind = ramp(time, 106.3, 112.78);
    const fray = mind * (reduced ? 8 : 22);
    const cx = 180;
    const cy = 268;
    if (world > 0.04) {
      const rx = lerp(20, 78, world);
      const ry = lerp(12, 52, world);
      g.lineStyle(1, WHITE, 0.25 + world * 0.45);
      g.strokeEllipse(cx, cy, rx * 2, ry * 2);
      g.lineStyle(1, GRAY, 0.22 + world * 0.3);
      g.strokeEllipse(cx, cy, rx * 2, ry * 0.72);
      g.strokeEllipse(cx, cy, rx * 0.9, ry * 2);
      g.strokeEllipse(cx, cy, rx * 1.55, ry * 2);
    }
    const waypoints = [
      [64, 420],
      [110, 360],
      [168, 318],
      [214, 280],
      [258, 240],
      [292, 188],
      [318, 140]
    ];
    const shown = Math.floor(waypoints.length * Math.min(1, trail + cities * 0.4));
    if (shown > 0) {
      g.lineStyle(1, GRAY, 0.35 + trail * 0.3);
      g.beginPath();
      for (let i = 0; i < shown; i += 1) {
        const jx = (seed(i, 30) - 0.5) * fray;
        const jy = (seed(i, 31) - 0.5) * fray;
        const x = waypoints[i][0] + jx;
        const y = waypoints[i][1] + jy;
        if (i === 0) g.moveTo(x, y);
        else g.lineTo(x, y);
      }
      g.strokePath();
      for (let i = 0; i < shown; i += 1) {
        g.fillStyle(WHITE, 0.45);
        g.fillRect(waypoints[i][0] - 1 + (seed(i, 30) - 0.5) * fray, waypoints[i][1] - 1, 3, 3);
      }
    }
    const cityCount = Math.floor(lerp(0, 16, cities));
    for (let i = 0; i < cityCount; i += 1) {
      const col = i % 8;
      const row = Math.floor(i / 8);
      const x = 28 + col * 40 + (seed(i, 32) - 0.5) * fray;
      const y = 470 - row * 70 + (seed(i, 33) - 0.5) * fray;
      const h = 28 + seed(i, 34) * 36 + one * 2;
      g.lineStyle(1, i % 2 === 0 ? WHITE : GRAY, 0.28 + cities * 0.35);
      g.strokeRect(x, y - h, 22, h);
      if (cities > 0.45) {
        g.lineStyle(1, DIM, 0.4);
        g.strokeRect(x + 6, y - h + 8, 10, 8);
        g.strokeRect(x + 6, y - h + 18, 10, 8);
      }
    }
    if (late > 0.08) {
      for (let i = 0; i < 3; i += 1) {
        const x = 70 + i * 110;
        const y = 120;
        const r = 22 + late * 6;
        g.lineStyle(1, WHITE, 0.35 + late * 0.4);
        g.strokeCircle(x, y, r);
        const wrong = time * (1.4 + i * 0.5) + i * 1.7;
        g.lineBetween(x, y, x + Math.cos(wrong) * r * 0.7, y + Math.sin(wrong) * r * 0.7);
        g.lineStyle(1, GRAY, 0.5);
        g.lineBetween(x, y, x + Math.cos(wrong * 0.12 + 2) * r * 0.45, y + Math.sin(wrong * 0.12 + 2) * r * 0.45);
      }
    }
    if (mind > 0.1) {
      g.lineStyle(1, WHITE, 0.2 + mind * 0.35);
      for (let i = 0; i < 8; i += 1) {
        const x = 180 + (seed(i, 40) - 0.5) * 220 * mind;
        const y = 300 + (seed(i, 41) - 0.5) * 260 * mind;
        g.lineBetween(180, 268, x, y);
      }
    }
  }

  private drawCorridor(
    g: Phaser.GameObjects.Graphics,
    time: number,
    heading: number,
    travel: number,
    scene: SceneStateId,
    reduced: boolean,
    rhythm: RhythmState
  ): void {
    const vpX = ARTBOARD.width / 2 + Math.sin(heading) * 92;
    const vpY = reduced ? 250 : 208 - rhythm.onePulse * 3;
    const depth = reduced ? 0 : time * (travel === -1 ? -22 : 28) + rhythm.onePulse * 4;
    const turn = scene === 'TURN';

    g.lineStyle(1, DIM, 1);
    g.beginPath();
    g.moveTo(20, 560);
    g.lineTo(vpX, vpY);
    g.lineTo(340, 560);
    g.strokePath();

    g.lineStyle(1, GRAY, 0.5 + rhythm.onePulse * 0.12);
    for (let i = 0; i < 12; i += 1) {
      const slot = fract((i / 12) + depth * 0.004);
      const y = lerp(vpY, 580, slot * slot);
      const width = lerp(16, 300, slot * slot);
      g.lineBetween(vpX - width / 2, y, vpX + width / 2, y);
    }

    g.lineStyle(1, WHITE, turn ? 0.85 : 0.32 + rhythm.onePulse * 0.12);
    g.beginPath();
    g.moveTo(28, 120);
    g.lineTo(vpX - 10, vpY);
    g.moveTo(332, 120);
    g.lineTo(vpX + 10, vpY);
    g.strokePath();

    const panelCount = 5;
    for (let i = 0; i < panelCount; i += 1) {
      const slot = fract(i / panelCount + Math.abs(depth) * 0.003);
      const y = lerp(vpY, 500, slot);
      const scale = lerp(0.12, 1, slot) * (1 + rhythm.onePulse * 0.03);
      const x = vpX + (i % 2 === 0 ? -1 : 1) * (40 + 90 * scale);
      g.lineStyle(1, i % 2 === 0 ? WHITE : GRAY, 0.4 + rhythm.onePulse * 0.12);
      g.strokeRect(x - 16 * scale, y - 22 * scale, 32 * scale, 44 * scale);
    }

    if (travel === -1) {
      g.lineStyle(1, WHITE, 0.22 + rhythm.onePulse * 0.12);
      g.strokeCircle(vpX, vpY, 16 + rhythm.onePulse * 3);
    }
  }

  private drawHold(g: Phaser.GameObjects.Graphics, heading: number, reduced: boolean, rhythm: RhythmState): void {
    this.drawCorridor(g, 70.4, heading, 0, 'HOLD', reduced, rhythm);
    const punch = rhythm.onePulse * 4;
    g.lineStyle(2, WHITE, 0.65 + rhythm.onePulse * 0.15);
    g.strokeRect(70 - punch / 2, 180 - punch / 2, 220 + punch, 220 + punch);
    g.lineStyle(1, GRAY, 1);
    g.strokeRect(96, 206, 168, 168);
    g.fillStyle(WHITE, 0.8 + rhythm.onePulse * 0.12);
    g.fillRect(172, 282, 16, 16);
  }

  private drawTableau(
    g: Phaser.GameObjects.Graphics,
    snapshot: ClockSnapshot,
    reduced: boolean,
    rhythm: RhythmState
  ): void {
    const time = snapshot.time;
    const touch = Math.max(0, 1 - (time - this.clock.chorusPulse) / 0.8);
    const pulse = reduced ? 0.5 : 0.42 + rhythm.onePulse * 0.12 + touch * 0.22;
    const tx = this.targetX;
    const ty = this.targetY;
    if (snapshot.sceneStart >= 112) {
      this.drawChorusWaves(g, time, snapshot.sceneStart, snapshot.sceneProgress, reduced);
    }
    for (let i = 0; i < 7; i += 1) {
      const size = 36 + i * 28 + touch * 6 + rhythm.onePulse * 3;
      g.lineStyle(1, i % 2 === 0 ? WHITE : GRAY, pulse);
      g.strokeRect(TABLEAU_CX - size / 2, TABLEAU_CY - size / 2, size, size);
    }
    for (let i = 0; i < 8; i += 1) {
      const dot = this.tableauDot(i, reduced, rhythm);
      if (!this.dotIsLive(i, time)) continue;
      this.drawCrystalHeart(
        g,
        dot.x,
        dot.y,
        TABLEAU_HEART * (1 + rhythm.onePulse * 0.12),
        0.9,
        false
      );
    }
    g.lineStyle(2, WHITE, 0.9);
    g.lineBetween(tx, ty - TABLEAU_SIGHT, tx, ty + TABLEAU_SIGHT);
    g.lineBetween(tx - TABLEAU_SIGHT, ty, tx + TABLEAU_SIGHT, ty);
    g.lineStyle(1, WHITE, 0.9);
    g.strokeRect(tx - 14, ty - 14, 28, 28);
    g.fillStyle(WHITE, 1);
    g.fillRect(tx - 6 - touch * 2, ty - 6 - touch * 2, 12 + touch * 4, 12 + touch * 4);
    if (this.grabbing) {
      g.lineStyle(1, GRAY, 0.45);
      g.lineBetween(TABLEAU_CX, TABLEAU_CY, tx, ty);
    }
  }

  private drawChorusWaves(
    g: Phaser.GameObjects.Graphics,
    time: number,
    sceneStart: number,
    sceneProgress: number,
    reduced: boolean
  ): void {
    const downbeat = sceneStart >= LOVE_PHASE1.lastChorus ? 203.52 : 113.78;
    const beats = (time - downbeat) / BEAT_SECONDS;
    const barPhase = ((beats % 4) + 4) % 4;
    const three = barPhase >= 2 && barPhase < 3 ? Math.sin((barPhase - 2) * Math.PI) : 0;
    const intensity = 0.25 + sceneProgress * 0.75;
    const amp = reduced ? three * 3 : three * (7 + intensity * 12);
    const width = TABLEAU_SIGHT * 2;
    const left = TABLEAU_CX - TABLEAU_SIGHT;
    const gap = 22;
    const n = reduced ? 10 : 24;
    const drawBand = (baseY: number): void => {
      g.lineStyle(1, WHITE, 0.18 + three * (0.35 + intensity * 0.35));
      g.beginPath();
      for (let i = 0; i < n; i += 1) {
        const u = i / (n - 1);
        const x = left + u * width;
        const y = baseY + Math.sin(u * Math.PI * 3 + time * 1.2) * amp;
        if (i === 0) g.moveTo(x, y);
        else g.lineTo(x, y);
      }
      g.strokePath();
    };
    drawBand(TABLEAU_CY - TABLEAU_SIGHT - gap);
    drawBand(TABLEAU_CY + TABLEAU_SIGHT + gap);
  }

  private drawBreak(g: Phaser.GameObjects.Graphics, snapshot: ClockSnapshot, reduced: boolean): void {
    const time = snapshot.time;
    const vocalLove = snapshot.lyricLines.some((line) => /\blove\b/i.test(line));
    const inSample = time >= LOVE_PHASE1.sampleBreak && time < LOVE_PHASE1.glitchStart;
    const beats = (time - LOVE_PHASE1.firstDownbeat) / BEAT_SECONDS;
    const beatInBar = ((Math.floor(beats) % 4) + 4) % 4;
    const everyFour = inSample && beatInBar === 0;
    const loveNow = vocalLove || everyFour;
    if (time < LOVE_PHASE1.glitchStart) {
      this.drawScribble(g, time, reduced, loveNow);
      return;
    }
    this.drawGlitchBlocks(g, time, reduced);
  }

  private drawScribble(
    g: Phaser.GameObjects.Graphics,
    time: number,
    reduced: boolean,
    loveNow: boolean
  ): void {
    const progress = ramp(time, 147.2, LOVE_PHASE1.glitchStart);
    const amp = reduced ? 16 : 22 + progress * 36;
    const px = this.pointerX;
    const py = this.pointerY;
    const strands = reduced ? 3 : 6;
    for (let s = 0; s < strands; s += 1) {
      const n = reduced ? 18 : 42;
      g.lineStyle(1, s % 2 === 0 ? WHITE : GRAY, 0.32 + progress * 0.28);
      g.beginPath();
      for (let i = 0; i < n; i += 1) {
        const u = i / (n - 1);
        const drift = time * (0.35 + seed(s, 1) * 0.9);
        let x = 28 + u * 304
          + Math.sin(u * (7 + s * 0.6) + drift) * amp
          + Math.sin(u * 13 + time * 1.1 + s) * amp * 0.22;
        let y = 64 + fract(u * 1.05 + seed(s, 2) * 0.35) * 500
          + Math.cos(u * (5 + s * 0.5) + drift * 0.7) * amp * 0.55;
        const dx = x - px;
        const dy = y - py;
        const fall = Math.exp(-(dx * dx + dy * dy) / (150 * 150));
        x += (px - TABLEAU_CX) * 0.07 + dx * -0.16 * fall;
        y += (py - TABLEAU_CY) * 0.06 + dy * -0.16 * fall;
        if (i === 0) g.moveTo(x, y);
        else g.lineTo(x, y);
      }
      g.strokePath();
    }
    const rx = 118 + Math.sin(time * 0.9) * 6 * progress;
    const ry = 248;
    g.lineStyle(1, WHITE, 0.55 + progress * 0.25);
    g.strokeRect(rx, ry, 124, 36);
    if (loveNow) this.drawLoveWord(g, rx, ry, 124, 36, 0.9);
  }

  private drawLoveWord(
    g: Phaser.GameObjects.Graphics,
    x: number,
    y: number,
    w: number,
    h: number,
    alpha: number
  ): void {
    const cy = y + h / 2;
    const s = h * 0.28;
    const gap = w / 4.5;
    const start = x + 16;
    g.lineStyle(1, WHITE, alpha);
    const lx = start;
    g.lineBetween(lx, cy - s, lx, cy + s);
    g.lineBetween(lx, cy + s, lx + s * 0.75, cy + s);
    const ox = start + gap;
    g.strokeRect(ox, cy - s, s * 0.85, s * 2);
    const vx = start + gap * 2;
    g.lineBetween(vx, cy - s, vx + s * 0.42, cy + s);
    g.lineBetween(vx + s * 0.84, cy - s, vx + s * 0.42, cy + s);
    const ex = start + gap * 3;
    g.lineBetween(ex, cy - s, ex, cy + s);
    g.lineBetween(ex, cy - s, ex + s * 0.75, cy - s);
    g.lineBetween(ex, cy, ex + s * 0.58, cy);
    g.lineBetween(ex, cy + s, ex + s * 0.75, cy + s);
  }

  private drawGlitchBlocks(
    g: Phaser.GameObjects.Graphics,
    time: number,
    reduced: boolean
  ): void {
    const approach = ramp(time, LOVE_PHASE1.glitchStart, LOVE_PHASE1.glitchStart + 3);
    const glitch = ramp(time, LOVE_PHASE1.glitchStart, LOVE_PHASE1.lastChorus);
    const vpX = 180;
    const vpY = 236;
    const shards = reduced ? 10 : 10 + Math.floor(glitch * 18);
    const tick = Math.floor(time * 11);
    for (let i = 0; i < shards; i += 1) {
      const destX = 180 + (seed(i, 4) - 0.5) * 2 * (18 + approach * 78);
      const destY = 300 + (seed(i, 6) - 0.5) * 2 * (16 + approach * 90);
      const x = lerp(vpX, destX, approach) + (seed(i, tick) - 0.5) * glitch * 48;
      const y = lerp(vpY, destY, approach) + (seed(i + 3, tick + 1) - 0.5) * glitch * 36;
      const scale = lerp(0.08, 1, approach * approach);
      const w = (10 + seed(i, 7) * 36) * scale;
      const h = (8 + seed(i, 8) * 28) * scale;
      if (w < 1.5 || h < 1.5) continue;
      g.lineStyle(1, seed(i, 9) > 0.5 ? WHITE : GRAY, 0.35 + approach * 0.4);
      g.strokeRect(x - w / 2, y - h / 2, w, h);
    }
  }

  private drawEnd(g: Phaser.GameObjects.Graphics, progress: number, reduced: boolean, rhythm: RhythmState): void {
    g.lineStyle(1, GRAY, Math.max(0.12, 0.45 - progress + rhythm.onePulse * 0.08));
    g.strokeRect(90, 220, 180, 180);
    if (!reduced) {
      g.fillStyle(WHITE, 0.05 * (1 - progress) * (0.45 + rhythm.onePulse * 0.2));
      g.fillRect(90, 220, 180, 180);
    }
  }

  private drawHearts(g: Phaser.GameObjects.Graphics, snapshot: ClockSnapshot, rhythm: RhythmState): void {
    const lastChorus = snapshot.scene === 'TABLEAU' && snapshot.sceneStart >= LOVE_PHASE1.lastChorus;
    if (!this.clock.hasStarted || this.clock.ended || snapshot.scene === 'MACHINE_BREAK') return;
    if (snapshot.scene === 'TABLEAU' && !lastChorus) return;
    const reduced = this.clock.reducedMotion;
    for (const heart of heartsVisibleAt(snapshot.time)) {
      if (this.clock.hits.has(heart.id)) continue;
      const pose = this.heartPose(heart, snapshot.time, reduced, rhythm);
      if (pose.fade <= 0.02) continue;
      this.drawCrystalHeart(
        g,
        pose.x,
        pose.y,
        pose.size,
        Math.max(0.2, pose.fade),
        heart.unbreakable
      );
    }
  }

  private drawCrystalHeart(
    g: Phaser.GameObjects.Graphics,
    cx: number,
    cy: number,
    size: number,
    alpha: number,
    unbreakable: boolean
  ): void {
    if (unbreakable) {
      this.drawBlockHeart(g, cx, cy, size, alpha);
      return;
    }
    this.drawFacetHeart(g, cx, cy, size, alpha);
  }

  private drawFacetHeart(
    g: Phaser.GameObjects.Graphics,
    cx: number,
    cy: number,
    size: number,
    alpha: number
  ): void {
    const s = size * 0.52;
    const p = (x: number, y: number): { x: number; y: number } => ({ x: cx + x * s, y: cy + y * s });
    const cleft = p(0, -0.52);
    const rPeak = p(0.36, -1);
    const rOuter = p(0.84, -0.72);
    const rWide = p(1, -0.18);
    const rLow = p(0.7, 0.28);
    const tip = p(0, 1);
    const lPeak = p(-0.36, -1);
    const lOuter = p(-0.84, -0.72);
    const lWide = p(-1, -0.18);
    const lLow = p(-0.7, 0.28);
    g.lineStyle(1, WHITE, alpha);
    const loop = (pts: Array<{ x: number; y: number }>): void => {
      g.beginPath();
      g.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length; i += 1) g.lineTo(pts[i].x, pts[i].y);
      g.closePath();
      g.strokePath();
    };
    loop([cleft, rPeak, rOuter, rWide, rLow, tip, lLow, lWide, lOuter, lPeak]);
  }

  private drawBlockHeart(
    g: Phaser.GameObjects.Graphics,
    cx: number,
    cy: number,
    size: number,
    alpha: number
  ): void {
    const box = size * 0.92;
    g.lineStyle(1, WHITE, alpha);
    g.strokeRect(cx - box / 2, cy - box / 2, box, box);
    this.drawFacetHeart(g, cx, cy, size * 0.62, alpha);
  }

  private drawParticles(g: Phaser.GameObjects.Graphics, time: number): void {
    for (const particle of this.clock.particles) {
      const age = time - particle.born;
      if (age < 0 || age > particle.life) continue;
      const u = age / particle.life;
      const x = Math.round(particle.x + particle.vx * age);
      const y = Math.round(particle.y + particle.vy * age);
      g.fillStyle(particle.color, 1 - u);
      g.fillRect(x, y, particle.size, particle.size);
    }
  }
}

interface OverlayRefs {
  stage: HTMLElement;
  playButton: HTMLButtonElement;
  againButton: HTMLButtonElement;
  muteButton: HTMLButtonElement;
  pauseButton: HTMLButtonElement;
  restartButton: HTMLButtonElement;
  lyric: HTMLElement;
  sample: HTMLElement;
  endCard: HTMLElement;
  debug: HTMLElement;
  status: HTMLElement;
  error: HTMLElement;
  fallback: HTMLElement;
  meter: HTMLElement;
  meterFill: HTMLElement;
  meterTime: HTMLElement;
  hearts: HTMLElement;
  heartsEnd: HTMLElement;
}

function required<T extends Element>(root: HTMLElement, selector: string): T {
  const node = root.querySelector(selector);
  if (!node) throw new Error(`PLAY LOVE missing ${selector}`);
  return node as T;
}

export function bootLovePlay(root: HTMLElement): () => void {
  const audio = required<HTMLAudioElement>(root, '[data-love-audio]');
  const overlay: OverlayRefs = {
    stage: required(root, '[data-love-stage]'),
    playButton: required(root, '[data-love-play-button]'),
    againButton: required(root, '[data-love-again-button]'),
    muteButton: required(root, '[data-love-mute]'),
    pauseButton: required(root, '[data-love-pause]'),
    restartButton: required(root, '[data-love-restart]'),
    lyric: required(root, '[data-love-lyric]'),
    sample: required(root, '[data-love-sample]'),
    endCard: required(root, '[data-love-end]'),
    debug: required(root, '[data-love-debug]'),
    status: required(root, '[data-love-status]'),
    error: required(root, '[data-love-error]'),
    fallback: required(root, '[data-love-fallback]'),
    meter: required(root, '[data-love-meter]'),
    meterFill: required(root, '[data-love-meter-fill]'),
    meterTime: required(root, '[data-love-meter-time]'),
    hearts: required(root, '[data-love-hearts]'),
    heartsEnd: required(root, '[data-love-hearts-end]')
  };
  const phaserHost = required<HTMLElement>(root, '[data-love-phaser]');

  const clock: LoveClock = {
    audio,
    hasStarted: false,
    ended: false,
    reducedMotion: prefersReducedMotion(),
    debug: new URLSearchParams(window.location.search).get('debug') === '1',
    hits: new Set(),
    stung: new Set(),
    heartsBroken: 0,
    particles: [],
    playError: null,
    chorusPulse: -10,
    energy: 0,
    readEnergy: () => 0,
    resumeEnergy: async () => undefined
  };

  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const onMotion = () => {
    clock.reducedMotion = motionQuery.matches;
    root.dataset.reducedMotion = clock.reducedMotion ? 'true' : 'false';
  };
  onMotion();
  motionQuery.addEventListener('change', onMotion);

  let game: Phaser.Game | null = null;

  const resetWorld = (): void => {
    clock.ended = false;
    clock.hasStarted = false;
    clock.hits.clear();
    clock.stung.clear();
    clock.heartsBroken = 0;
    clock.particles = [];
    clock.playError = null;
    clock.chorusPulse = -10;
    overlay.lyric.replaceChildren();
    overlay.sample.textContent = '';
  };

  let energyReady = false;

  const playFromUser = async (): Promise<void> => {
    clock.playError = null;
    clock.ended = false;
    clock.hasStarted = true;
    if (!energyReady) {
      try {
        const tap = createEnergyTap(audio);
        clock.readEnergy = tap.read;
        clock.resumeEnergy = tap.resume;
        energyReady = true;
      } catch {
        energyReady = true;
      }
    }
    try {
      await clock.resumeEnergy();
      await audio.play();
    } catch {
      clock.hasStarted = audio.currentTime > 0 && !audio.paused;
      clock.playError = 'Playback was blocked. Press PLAY LOVE again.';
    }
  };

  const seekBy = (delta: number): void => {
    if (!clock.hasStarted && !clock.ended) return;
    audio.currentTime = Math.min(Math.max(0, audio.currentTime + delta), LOVE_PHASE1.durationSeconds);
    clock.ended = false;
  };

  overlay.playButton.addEventListener('click', () => {
    void playFromUser();
  });
  overlay.againButton.addEventListener('click', () => {
    audio.pause();
    audio.currentTime = 0;
    resetWorld();
    void playFromUser();
  });
  overlay.muteButton.addEventListener('click', () => {
    audio.muted = !audio.muted;
    overlay.muteButton.setAttribute('aria-pressed', audio.muted ? 'true' : 'false');
    overlay.muteButton.textContent = audio.muted ? 'UNMUTE' : 'MUTE';
  });
  overlay.pauseButton.addEventListener('click', () => {
    if (!clock.hasStarted || clock.ended) return;
    if (audio.paused) {
      void clock.resumeEnergy().then(() => audio.play()).catch(() => {
        clock.playError = 'Playback was blocked. Press PLAY LOVE again.';
      });
      return;
    }
    audio.pause();
  });
  overlay.restartButton.addEventListener('click', () => {
    audio.pause();
    audio.currentTime = 0;
    const shouldPlay = clock.hasStarted || clock.ended;
    resetWorld();
    if (shouldPlay) void playFromUser();
  });

  const onEnded = (): void => {
    clock.ended = true;
    clock.hasStarted = true;
  };
  audio.addEventListener('ended', onEnded);
  audio.addEventListener('play', () => {
    clock.playError = null;
    clock.hasStarted = true;
    clock.ended = false;
  });
  audio.addEventListener('seeked', () => {
    if (audio.currentTime < LOVE_PHASE1.durationSeconds - 0.05) clock.ended = false;
  });

  let wasPlaying = false;
  const onVisibility = (): void => {
    if (document.hidden) {
      wasPlaying = !audio.paused;
      if (wasPlaying) audio.pause();
      return;
    }
    if (wasPlaying && clock.hasStarted && !clock.ended) {
      void audio.play().catch(() => {
        clock.playError = 'Playback paused. Press PLAY LOVE to resume.';
      });
    }
  };
  document.addEventListener('visibilitychange', onVisibility);

  const onKey = (event: KeyboardEvent): void => {
    const target = event.target;
    if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) return;
    if (event.code === 'Space') {
      event.preventDefault();
      if (!clock.hasStarted) {
        void playFromUser();
        return;
      }
      if (clock.ended) return;
      if (audio.paused) void audio.play().catch(() => {
        clock.playError = 'Playback was blocked. Press PLAY LOVE again.';
      });
      else audio.pause();
      return;
    }
    if (event.code === 'ArrowLeft') {
      event.preventDefault();
      seekBy(event.shiftKey ? -15 : -5);
    }
    if (event.code === 'ArrowRight') {
      event.preventDefault();
      seekBy(event.shiftKey ? 15 : 5);
    }
    if (event.code === 'KeyR') {
      event.preventDefault();
      overlay.restartButton.click();
    }
    if (event.code === 'KeyD') {
      event.preventDefault();
      clock.debug = !clock.debug;
    }
    if (event.code === 'KeyM') {
      event.preventDefault();
      overlay.muteButton.click();
    }
  };
  window.addEventListener('keydown', onKey);

  const fallback = (): void => {
    overlay.fallback.hidden = false;
    phaserHost.hidden = true;
    root.dataset.fallback = 'true';
    audio.controls = true;
    const syncFallback = (): void => {
      const snapshot = snapshotAt(audio.currentTime, clock.hasStarted, clock.ended || audio.ended);
      syncLoveOverlay(overlay, snapshot, clock);
    };
    audio.addEventListener('timeupdate', syncFallback);
    audio.addEventListener('seeked', syncFallback);
    audio.addEventListener('play', syncFallback);
    audio.addEventListener('pause', syncFallback);
    audio.addEventListener('ended', syncFallback);
    syncFallback();
  };

  if (!canWebGL()) {
    fallback();
  } else {
    try {
      LovePhase1Scene.clock = clock;
      LovePhase1Scene.overlay = overlay;
      game = new Phaser.Game({
        type: Phaser.WEBGL,
        parent: phaserHost,
        width: ARTBOARD.width,
        height: ARTBOARD.height,
        backgroundColor: '#000000',
        audio: { noAudio: true },
        banner: false,
        scale: {
          mode: Phaser.Scale.FIT,
          autoCenter: Phaser.Scale.CENTER_BOTH
        },
        scene: LovePhase1Scene
      });
      game.events.once(Phaser.Core.Events.READY, () => {
        if (!game || game.renderer.type !== Phaser.WEBGL) {
          game?.destroy(true);
          game = null;
          LovePhase1Scene.clock = null;
          LovePhase1Scene.overlay = null;
          fallback();
          return;
        }
      });
    } catch {
      LovePhase1Scene.clock = null;
      LovePhase1Scene.overlay = null;
      fallback();
    }
  }

  const destroy = (): void => {
    window.removeEventListener('keydown', onKey);
    document.removeEventListener('visibilitychange', onVisibility);
    motionQuery.removeEventListener('change', onMotion);
    audio.removeEventListener('ended', onEnded);
    audio.pause();
    if (game) {
      game.destroy(true);
      game = null;
    }
  };

  window.addEventListener('pagehide', destroy, { once: true });
  return destroy;
}
