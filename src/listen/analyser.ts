// Turns a stream of microphone samples into musical events with a reliability for each.
// Two separate estimates:
//   - onsets: when a sound starts (taps, claps, drums, plucked or struck notes)
//   - notes: an onset plus a steady pitch (piano or guitar single notes)
// Pure TS, sample-accurate, testable without a browser. It reports what it heard and how sure
// it is; it never decides whether the learner was right (see compare.ts).

import { detectPitch, hzToNote } from './pitch.ts';

export interface HeardOnset {
  kind: 'onset';
  /** Seconds on the stream's clock (the audio context clock in the app). */
  time: number;
  /** dB above the running noise floor. */
  strength: number;
  /** 0..1 */
  confidence: number;
}

export interface HeardNote {
  kind: 'note';
  time: number;
  midi: number;
  cents: number;
  /** 0..1: how steady and clear the pitch was after the onset. */
  confidence: number;
  /** Frames that agreed on the pitch, of frames looked at. */
  agreement: number;
}

export interface LevelReading {
  /** dBFS of the last block. */
  db: number;
  /** Running noise floor, dBFS. */
  floorDb: number;
  clipping: boolean;
}

export interface AnalyserOptions {
  sampleRate: number;
  /** Listen for pitch after each onset (single-note tasks). */
  pitch?: boolean;
  minHz?: number;
  maxHz?: number;
  /** Ignore onsets that start inside these windows (e.g. Carmen's own clicks), in stream seconds. */
  mute?: { from: number; to: number }[];
}

const HOP = 256;
const WINDOW = 2048;
const REFRACTORY = 0.07; // s: two onsets closer than this are one sound
const RISE_DB = 8;
const ABOVE_FLOOR_DB = 14;
const PITCH_LOOK = 0.16; // s after the onset used to settle the pitch

const toDb = (x: number) => 20 * Math.log10(Math.max(1e-9, x));

export class StreamAnalyser {
  readonly opts: AnalyserOptions;
  private ring: Float32Array;
  private ringPos = 0;
  private filled = 0;
  private hopBuf = new Float32Array(HOP);
  private hopFill = 0;
  private prevSample = 0;
  private samplesSeen = 0;
  private floorDb = -70;
  private recentDb: number[] = [];
  private recentRaw: number[] = [];
  private floorRawDb = -70;
  private hops = 0;
  private lastOnset = -Infinity;
  private pending: { time: number; strength: number; frames: { midi: number; cents: number; clarity: number }[]; until: number } | null = null;
  level: LevelReading = { db: -100, floorDb: -70, clipping: false };
  private out: (HeardOnset | HeardNote)[] = [];

  constructor(opts: AnalyserOptions) {
    this.opts = opts;
    this.ring = new Float32Array(WINDOW);
  }

  /** Add samples. `startTime` is the stream time of samples[0] (defaults to continuing). */
  push(samples: Float32Array, startTime?: number): (HeardOnset | HeardNote)[] {
    if (startTime !== undefined) this.samplesSeen = Math.round(startTime * this.opts.sampleRate);
    this.out = [];
    for (let i = 0; i < samples.length; i++) {
      const v = samples[i];
      this.ring[this.ringPos] = v;
      this.ringPos = (this.ringPos + 1) % WINDOW;
      if (this.filled < WINDOW) this.filled++;
      this.hopBuf[this.hopFill++] = v;
      if (this.hopFill === HOP) {
        this.hop(this.samplesSeen + i + 1 - HOP);
        this.hopFill = 0;
      }
    }
    this.samplesSeen += samples.length;
    return this.out;
  }

  /** Finish: settle a pending note at the end of the stream. */
  flush(): HeardNote[] {
    const n = this.pending ? this.settle() : null;
    return n ? [n] : [];
  }

  private hop(firstSample: number) {
    const sr = this.opts.sampleRate;
    // Energy of the first difference: emphasises the attack of a sound over its hum.
    let e = 0;
    let peak = 0;
    let raw = 0;
    let prev = this.prevSample;
    for (let i = 0; i < HOP; i++) {
      const x = this.hopBuf[i];
      const dx = x - prev;
      prev = x;
      e += dx * dx;
      raw += x * x;
      if (Math.abs(x) > peak) peak = Math.abs(x);
    }
    this.prevSample = prev;
    const db = toDb(Math.sqrt(e / HOP));
    const rawDb = toDb(Math.sqrt(raw / HOP));
    // Two views of "something started": the attack (difference energy, good for taps and clicks)
    // and the plain level (good for notes when background noise is hissy). Each has its own floor.
    const riseDiff = db - (this.recentDb.length ? Math.max(...this.recentDb.slice(-3)) : db);
    const riseRaw = rawDb - (this.recentRaw.length ? Math.max(...this.recentRaw.slice(-3)) : rawDb);
    this.recentDb.push(db);
    this.recentRaw.push(rawDb);
    if (this.recentDb.length > 8) this.recentDb.shift();
    if (this.recentRaw.length > 8) this.recentRaw.shift();
    this.hops++;
    if (this.hops <= 6) {
      // Warm-up: learn the background before listening for onsets.
      this.floorDb = this.hops === 1 ? db : Math.max(this.floorDb, db);
      this.floorRawDb = this.hops === 1 ? rawDb : Math.max(this.floorRawDb, rawDb);
    } else {
      // Floors fall quickly and rise slowly, so steady background sets them, not the music.
      this.floorDb = db < this.floorDb ? this.floorDb * 0.7 + db * 0.3 : this.floorDb * 0.995 + db * 0.005;
      this.floorRawDb = rawDb < this.floorRawDb ? this.floorRawDb * 0.7 + rawDb * 0.3 : this.floorRawDb * 0.995 + rawDb * 0.005;
    }
    this.level = { db: rawDb, floorDb: this.floorRawDb, clipping: peak > 0.98 };
    const aboveDiff = db - this.floorDb;
    const aboveRaw = rawDb - this.floorRawDb;
    const started = this.hops > 6 && ((riseDiff > RISE_DB && aboveDiff > ABOVE_FLOOR_DB) || (riseRaw > RISE_DB && aboveRaw > ABOVE_FLOOR_DB));

    const time = firstSample / sr;
    const isOnset = started && time - this.lastOnset > REFRACTORY;
    if (isOnset) {
      // Sample-accurate start: the first sample in this hop above a third of its peak.
      let k = 0;
      while (k < HOP && Math.abs(this.hopBuf[k]) < peak / 3) k++;
      const t = (firstSample + k) / sr;
      const muted = this.opts.mute?.some((m) => t >= m.from && t <= m.to);
      if (!muted) {
        if (this.pending) {
          const n = this.settle();
          if (n) this.out.push(n);
        }
        const strength = Math.max(aboveDiff, aboveRaw);
        this.lastOnset = t;
        this.out.push({ kind: 'onset', time: t, strength, confidence: Math.max(0, Math.min(1, (strength - ABOVE_FLOOR_DB) / 18 + 0.5)) });
        if (this.opts.pitch) this.pending = { time: t, strength, frames: [], until: t + PITCH_LOOK };
      }
    }
    // Pitch frames for a pending note.
    if (this.pending && this.filled === WINDOW && time > this.pending.time + 0.02) {
      const frame = new Float32Array(WINDOW);
      for (let i = 0; i < WINDOW; i++) frame[i] = this.ring[(this.ringPos + i) % WINDOW];
      const p = detectPitch(frame, sr, { minHz: this.opts.minHz ?? 60, maxHz: this.opts.maxHz ?? 1400 });
      if (p && p.clarity > 0.8) {
        const nn = hzToNote(p.hz);
        this.pending.frames.push({ ...nn, clarity: p.clarity });
      }
      if (time >= this.pending.until) {
        const n = this.settle();
        if (n) this.out.push(n);
      }
    }
  }

  private settle(): HeardNote | null {
    const p = this.pending;
    this.pending = null;
    if (!p || p.frames.length < 2) return null;
    const counts = new Map<number, number>();
    for (const f of p.frames) counts.set(f.midi, (counts.get(f.midi) ?? 0) + 1);
    let midi = p.frames[0].midi;
    let best = 0;
    for (const [m, c] of counts)
      if (c > best) {
        best = c;
        midi = m;
      }
    const agree = p.frames.filter((f) => f.midi === midi);
    const agreement = agree.length / p.frames.length;
    const clarity = agree.reduce((s, f) => s + f.clarity, 0) / agree.length;
    const cents = Math.round(agree.reduce((s, f) => s + f.cents, 0) / agree.length);
    return { kind: 'note', time: p.time, midi, cents, agreement, confidence: Math.max(0, Math.min(1, agreement * clarity)) };
  }
}

/** How usable the microphone input is right now, from a few seconds of level readings. */
export function inputQuality(floorDb: number, peakDb: number, clipping: boolean): { ok: boolean; reason: 'ok' | 'quiet' | 'noisy' | 'loud' } {
  if (clipping) return { ok: false, reason: 'loud' };
  if (floorDb > -35) return { ok: false, reason: 'noisy' };
  if (peakDb - floorDb < 18) return { ok: false, reason: 'quiet' };
  return { ok: true, reason: 'ok' };
}
