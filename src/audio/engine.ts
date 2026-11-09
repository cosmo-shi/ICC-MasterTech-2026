// Web Audio sample engine. Plays self-hosted VCSL samples. Never waits for AI or network.

import { type DrumSound, type MusicEvent, TPQ, isSounding } from '../music/events.ts';

const PIANO_ROOTS: { name: string; midi: number }[] = [
  { name: 'C3', midi: 48 },
  { name: 'E3', midi: 52 },
  { name: 'G3', midi: 55 },
  { name: 'B3', midi: 59 },
  { name: 'D4', midi: 62 },
  { name: 'F4', midi: 65 },
  { name: 'A4', midi: 69 },
  { name: 'C5', midi: 72 },
  { name: 'G5', midi: 79 },
  { name: 'C6', midi: 84 },
];

const DRUM_GAIN: Record<DrumSound, number> = { kick: 0.75, snare: 1.7, hihat: 0.9, tomHigh: 0.8, tomLow: 0.8, crash: 0.9, clave: 2.2 };
const MAX_VOICES = 24;

type Status = 'idle' | 'loading' | 'ready' | 'error';

interface Voice {
  src: AudioBufferSourceNode;
  gain: GainNode;
  key: string;
  started: number;
}

export interface ScheduledPlayback {
  startCtxTime: number;
  beat0PerfMs: number;
  durationSec: number;
  cancel: () => void;
}

class AudioEngine {
  ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private buffers = new Map<string, AudioBuffer>();
  private voices: Voice[] = [];
  private held = new Map<string, Voice>();
  private scheduled: AudioBufferSourceNode[] = [];
  status: Status = 'idle';
  error: string | null = null;
  private listeners = new Set<() => void>();
  private volume = 0.7;

  subscribe(fn: () => void): () => void {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  private emit() {
    this.listeners.forEach((f) => f());
  }

  /** Must be called from a user gesture. Safe to call repeatedly. */
  async start(): Promise<void> {
    try {
      if (!this.ctx) {
        const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        this.ctx = new Ctor({ latencyHint: 'interactive' });
        this.master = this.ctx.createGain();
        this.master.gain.value = this.volume;
        const comp = this.ctx.createDynamicsCompressor();
        comp.threshold.value = -10;
        comp.ratio.value = 4;
        this.master.connect(comp).connect(this.ctx.destination);
      }
      if (this.ctx.state !== 'running') await this.ctx.resume();
      if (this.status === 'idle' || this.status === 'error') await this.load();
    } catch (e) {
      this.status = 'error';
      this.error = e instanceof Error ? e.message : 'Sound could not start';
      this.emit();
    }
  }

  get running(): boolean {
    return !!this.ctx && this.ctx.state === 'running' && this.status === 'ready';
  }

  private async load() {
    if (!this.ctx) return;
    this.status = 'loading';
    this.emit();
    const base = import.meta.env.BASE_URL;
    const files: [string, string][] = [];
    for (const r of PIANO_ROOTS) {
      files.push([`piano:${r.name}:soft`, `${base}audio/piano/${r.name}-soft.mp3`]);
      files.push([`piano:${r.name}:loud`, `${base}audio/piano/${r.name}-loud.mp3`]);
    }
    for (const d of Object.keys(DRUM_GAIN)) files.push([`drum:${d}`, `${base}audio/drums/${d}.mp3`]);
    const ctx = this.ctx;
    const results = await Promise.allSettled(
      files.map(async ([key, url]) => {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`${url}: ${res.status}`);
        const buf = await ctx.decodeAudioData(await res.arrayBuffer());
        this.buffers.set(key, buf);
      }),
    );
    const failed = results.filter((r) => r.status === 'rejected').length;
    if (failed === files.length) {
      this.status = 'error';
      this.error = 'The instrument sounds could not be loaded.';
    } else {
      this.status = 'ready';
      this.error = failed ? `${failed} sounds are missing.` : null;
    }
    this.emit();
  }

  setVolume(v: number) {
    this.volume = v;
    if (this.master && this.ctx) this.master.gain.setTargetAtTime(v, this.ctx.currentTime, 0.02);
  }

  private trimVoices() {
    while (this.voices.length >= MAX_VOICES) {
      const v = this.voices.shift();
      if (v) this.fadeOut(v, 0.03);
    }
  }

  private fadeOut(v: Voice, sec: number) {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    try {
      v.gain.gain.cancelScheduledValues(t);
      v.gain.gain.setValueAtTime(v.gain.gain.value, t);
      v.gain.gain.linearRampToValueAtTime(0, t + sec);
      v.src.stop(t + sec + 0.02);
    } catch {
      /* already stopped */
    }
  }

  private pianoBuffer(midi: number, velocity: number): { buf: AudioBuffer; rate: number } | null {
    let best = PIANO_ROOTS[0];
    for (const r of PIANO_ROOTS) if (Math.abs(r.midi - midi) < Math.abs(best.midi - midi)) best = r;
    const layer = velocity < 0.55 ? 'soft' : 'loud';
    const buf = this.buffers.get(`piano:${best.name}:${layer}`) ?? this.buffers.get(`piano:${best.name}:${layer === 'soft' ? 'loud' : 'soft'}`);
    if (!buf) return null;
    return { buf, rate: 2 ** ((midi - best.midi) / 12) };
  }

  private voice(buf: AudioBuffer, rate: number, gainValue: number, when: number, dest?: AudioNode): Voice | null {
    if (!this.ctx || !this.master) return null;
    const src = this.ctx.createBufferSource();
    src.buffer = buf;
    src.playbackRate.value = rate;
    const gain = this.ctx.createGain();
    gain.gain.value = gainValue;
    src.connect(gain).connect(dest ?? this.master);
    src.start(when);
    return { src, gain, key: '', started: when };
  }

  /** Live note-on. Returns false if sound is not ready. */
  noteOn(midi: number, velocity = 0.7): boolean {
    if (!this.running || !this.ctx) return false;
    const pb = this.pianoBuffer(midi, velocity);
    if (!pb) return false;
    const key = `n${midi}`;
    const existing = this.held.get(key);
    if (existing) this.fadeOut(existing, 0.05);
    this.trimVoices();
    const v = this.voice(pb.buf, pb.rate, 0.25 + 0.75 * velocity, this.ctx.currentTime);
    if (!v) return false;
    v.key = key;
    this.voices.push(v);
    this.held.set(key, v);
    v.src.onended = () => {
      this.voices = this.voices.filter((x) => x !== v);
    };
    return true;
  }

  /** Damper: a released key fades quickly, like a piano. */
  noteOff(midi: number) {
    const key = `n${midi}`;
    const v = this.held.get(key);
    if (v) {
      this.fadeOut(v, 0.28);
      this.held.delete(key);
    }
  }

  drum(sound: DrumSound, velocity = 0.7): boolean {
    if (!this.running || !this.ctx) return false;
    const buf = this.buffers.get(`drum:${sound}`);
    if (!buf) return false;
    this.trimVoices();
    const v = this.voice(buf, 1, DRUM_GAIN[sound] * (0.3 + 0.7 * velocity), this.ctx.currentTime);
    if (!v) return false;
    this.voices.push(v);
    v.src.onended = () => {
      this.voices = this.voices.filter((x) => x !== v);
    };
    return true;
  }

  /** Stop every sound immediately, including anything scheduled. */
  stopAll() {
    for (const v of this.voices) this.fadeOut(v, 0.04);
    this.voices = [];
    this.held.clear();
    for (const s of this.scheduled) {
      try {
        s.stop();
      } catch {
        /* not started */
      }
    }
    this.scheduled = [];
  }

  releaseAllHeld() {
    for (const [, v] of this.held) this.fadeOut(v, 0.2);
    this.held.clear();
  }

  /** performance.now() time at which a given AudioContext time is heard. */
  ctxToPerfMs(ctxTime: number): number {
    if (!this.ctx) return performance.now();
    const ts = this.ctx.getOutputTimestamp?.();
    if (ts && ts.contextTime !== undefined && ts.performanceTime !== undefined && ts.performanceTime > 0) {
      return ts.performanceTime + (ctxTime - ts.contextTime) * 1000;
    }
    const lat = (this.ctx.outputLatency || this.ctx.baseLatency || 0) * 1000;
    return performance.now() + (ctxTime - this.ctx.currentTime) * 1000 + lat;
  }

  /**
   * Schedule tracks of events. `countInBeats` clave clicks come first; beat 0 of the music follows.
   * Returns beat0 in performance.now() time so live inputs can be measured against it.
   */
  schedule(tracks: { events: MusicEvent[] }[], tempoBpm: number, opts: { countInBeats?: number; totalTicks: number; click?: boolean }): ScheduledPlayback | null {
    if (!this.running || !this.ctx) return null;
    const secPerTick = 60 / tempoBpm / TPQ;
    const beatSec = 60 / tempoBpm;
    const lead = 0.12;
    const t0 = this.ctx.currentTime + lead;
    const countIn = opts.countInBeats ?? 0;
    const beat0 = t0 + countIn * beatSec;
    const add = (buf: AudioBuffer | undefined, rate: number, gain: number, when: number, dur?: number) => {
      if (!buf || !this.ctx || !this.master) return;
      const v = this.voice(buf, rate, gain, when);
      if (!v) return;
      if (dur !== undefined) {
        v.gain.gain.setValueAtTime(gain, when + dur);
        v.gain.gain.linearRampToValueAtTime(0, when + dur + 0.25);
        v.src.stop(when + dur + 0.3);
      }
      this.scheduled.push(v.src);
    };
    const clave = this.buffers.get('drum:clave');
    for (let b = 0; b < countIn; b++) add(clave, 1, DRUM_GAIN.clave * (b === 0 ? 0.75 : 0.55), t0 + b * beatSec);
    if (opts.click) {
      const beats = Math.round(opts.totalTicks / TPQ);
      for (let b = 0; b < beats; b++) add(clave, 1, DRUM_GAIN.clave * 0.35, beat0 + b * beatSec);
    }
    for (const t of tracks) {
      for (const e of t.events) {
        if (!isSounding(e)) continue;
        const when = beat0 + e.onset * secPerTick;
        if (e.kind === 'note') {
          const pb = this.pianoBuffer(e.midi, e.velocity);
          if (pb) add(pb.buf, pb.rate, 0.25 + 0.75 * e.velocity, when, e.duration * secPerTick);
        } else {
          add(this.buffers.get(`drum:${e.sound}`), 1, DRUM_GAIN[e.sound] * (0.3 + 0.7 * e.velocity), when);
        }
      }
    }
    const durationSec = countIn * beatSec + opts.totalTicks * secPerTick;
    const mine = [...this.scheduled];
    return {
      startCtxTime: t0,
      beat0PerfMs: this.ctxToPerfMs(beat0),
      durationSec,
      cancel: () => {
        for (const s of mine) {
          try {
            s.stop();
          } catch {
            /* ignore */
          }
        }
      },
    };
  }
}

export const audio = new AudioEngine();
