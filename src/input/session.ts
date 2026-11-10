// How the learner's playing reaches Carmen right now: the screen, a MIDI keyboard or the
// microphone. One place owns the microphone listener, so every screen sees the same state and the
// microphone is stopped in one place (leaving a screen, hiding the page, a phone call).
//
// The timing check result (a delay in seconds) is a property of this device and its speakers, not
// of a child, so it is kept in this browser's local storage. Nothing here leaves the device.

import { audio } from '../audio/engine.ts';
import { StreamAnalyser, type HeardNote, type HeardOnset, type LevelReading } from '../listen/analyser.ts';
import { mic, type MicBlock } from './mic.ts';
import { midiInput } from './midi.ts';

export type InputMode = 'screen' | 'midi' | 'mic';
export type Heard = (HeardOnset | HeardNote) & {
  /** Probably Carmen's own sound coming back through the speaker. */
  own: boolean;
  /** performance.now() time of the sound, corrected for the measured delay when there is one. */
  tPerf: number;
};

const LATENCY_KEY = 'carmen-mic-delay-v1';

function loadLatency(): number | null {
  try {
    const v = JSON.parse(localStorage.getItem(LATENCY_KEY) ?? 'null') as { s: number } | null;
    return v && typeof v.s === 'number' && v.s >= 0 && v.s < 1 ? v.s : null;
  } catch {
    return null;
  }
}

class Listening {
  mode: InputMode = 'screen';
  /** Delay from Carmen's sound to the microphone, seconds. null = timing not checked here. */
  latency: number | null = loadLatency();
  /** Listen for pitch (single notes) as well as taps. */
  pitch = false;
  level: LevelReading = { db: -100, floorDb: -70, clipping: false };
  last: Heard | null = null;
  /** Why listening stopped on its own, in words, or ''. */
  stoppedBecause = '';
  private analyser: StreamAnalyser | null = null;
  private heard: Heard[] = [];
  private listeners = new Set<(h: Heard) => void>();
  private subs = new Set<() => void>();
  private lastEmit = 0;
  private version = 0;

  constructor() {
    if (typeof document !== 'undefined') {
      // A hidden page or a phone call stops the microphone. It never restarts by itself.
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden' && this.mode === 'mic') this.stopMic('Listening stopped when Carmen went into the background.');
      });
      window.addEventListener('pagehide', () => this.stopMic());
    }
    mic.subscribe(() => {
      // The browser ended the track (unplugged, permission revoked).
      if (this.mode === 'mic' && mic.state === 'off' && this.analyser) this.stopMic('The microphone stopped.');
      this.emit();
    });
    midiInput.subscribe(() => this.emit());
  }

  /** A string that changes whenever anything a screen shows here changes. */
  snapshot = () => `${this.version}`;

  subscribe = (f: () => void) => {
    this.subs.add(f);
    return () => {
      this.subs.delete(f);
    };
  };
  private emit() {
    this.version++;
    this.subs.forEach((f) => f());
  }

  /** Every sound heard (including Carmen's own, flagged), as it is heard. */
  onHeard(fn: (h: Heard) => void) {
    this.listeners.add(fn);
    return () => {
      this.listeners.delete(fn);
    };
  }

  /** Sounds heard since a performance.now() time, not counting Carmen's own. */
  heardSince(perfMs: number): Heard[] {
    return this.heard.filter((h) => h.tPerf >= perfMs && !h.own);
  }

  get listening(): boolean {
    return this.mode === 'mic' && mic.state === 'listening';
  }

  /** Start the microphone. Call from a press: the browser may ask for permission. */
  async startMic(opts: { pitch?: boolean } = {}): Promise<boolean> {
    this.pitch = !!opts.pitch;
    this.stoppedBecause = '';
    this.analyser = null;
    this.heard = [];
    this.emit();
    const ok = await mic.listen((b) => this.block(b));
    if (ok) {
      midiInput.disconnect();
      this.mode = 'mic';
    }
    this.emit();
    return ok;
  }

  setPitch(pitch: boolean) {
    if (this.pitch === pitch) return;
    this.pitch = pitch;
    this.analyser = null;
  }

  stopMic(reason = '') {
    const was = this.mode === 'mic' || mic.state !== 'off';
    this.analyser = null;
    mic.stop();
    this.level = { db: -100, floorDb: -70, clipping: false };
    if (this.mode === 'mic') this.mode = 'screen';
    if (was) {
      this.stoppedBecause = reason;
      this.emit();
    }
  }

  async connectMidi(): Promise<boolean> {
    this.stopMic();
    const ok = await midiInput.connect();
    this.mode = ok ? 'midi' : 'screen';
    this.emit();
    return ok;
  }

  chooseScreen() {
    this.stopMic();
    midiInput.disconnect();
    this.mode = 'screen';
    this.emit();
  }

  setLatency(s: number | null) {
    this.latency = s;
    try {
      if (s === null) localStorage.removeItem(LATENCY_KEY);
      else localStorage.setItem(LATENCY_KEY, JSON.stringify({ s, at: Date.now() }));
    } catch {
      /* storage blocked: kept for this visit only */
    }
    this.emit();
  }

  private block(b: MicBlock) {
    if (!this.analyser || this.analyser.opts.sampleRate !== b.sampleRate) {
      this.analyser = new StreamAnalyser({ sampleRate: b.sampleRate, pitch: this.pitch, minHz: 70, maxHz: 1400 });
    } else if (!!this.analyser.opts.pitch !== this.pitch) {
      this.analyser = new StreamAnalyser({ sampleRate: b.sampleRate, pitch: this.pitch, minHz: 70, maxHz: 1400 });
    }
    const events = this.analyser.push(b.samples, b.time);
    this.level = this.analyser.level;
    const delay = this.latency ?? 0;
    for (const e of events) {
      // With no measured delay, anything up to 0.35 s after Carmen's own sound may be its echo.
      const own = this.latency === null ? [0.05, 0.15, 0.25, 0.35].some((d) => audio.ownSoundAt(e.time, d)) : audio.ownSoundAt(e.time, delay);
      const h: Heard = { ...e, own, tPerf: audio.ctx ? audio.ctxToPerfMs(e.time - delay) : performance.now() };
      this.heard.push(h);
      if (this.heard.length > 256) this.heard.splice(0, this.heard.length - 256);
      this.last = h;
      this.listeners.forEach((f) => f(h));
    }
    const now = performance.now();
    if (events.length || now - this.lastEmit > 80) {
      this.lastEmit = now;
      this.emit();
    }
  }
}

export const listening = new Listening();

/** General MIDI drum notes, so an electronic drum kit plays the drums on screen. */
export const GM_DRUMS: Record<number, 'kick' | 'snare' | 'hihat' | 'crash' | 'tomHigh' | 'tomLow' | 'clave'> = {
  35: 'kick',
  36: 'kick',
  37: 'clave',
  38: 'snare',
  40: 'snare',
  42: 'hihat',
  44: 'hihat',
  46: 'hihat',
  41: 'tomLow',
  43: 'tomLow',
  45: 'tomLow',
  47: 'tomHigh',
  48: 'tomHigh',
  50: 'tomHigh',
  49: 'crash',
  57: 'crash',
  75: 'clave',
};
