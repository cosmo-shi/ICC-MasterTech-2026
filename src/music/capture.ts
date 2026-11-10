// Live capture: turns instrument events into captured inputs measured against beat 0.

import type { CapturedInput } from '../engine/checker.ts';
import type { TimingEvidence } from '../ai/features.ts';
import { type MusicEvent, type Phrase, TPQ, msToTicks } from './events.ts';

export interface RawEvent {
  type: 'down' | 'up';
  midi?: number;
  sound?: CapturedInput['sound'];
  t: number;
  source: 'pointer' | 'key' | 'midi' | 'mic';
  soundUnknown?: boolean;
}

export class Recorder {
  readonly inputs: CapturedInput[] = [];
  private open = new Map<number, CapturedInput>();
  private n = 0;
  private beat0PerfMs: number;
  constructor(beat0PerfMs: number) {
    this.beat0PerfMs = beat0PerfMs;
  }

  handle(e: RawEvent): CapturedInput | null {
    const ms = e.t - this.beat0PerfMs;
    if (e.type === 'down') {
      const inp: CapturedInput = { id: `in${this.n++}`, onsetMs: ms, midi: e.midi, sound: e.sound, source: e.source, ...(e.soundUnknown ? { soundUnknown: true } : {}) };
      this.inputs.push(inp);
      if (e.midi !== undefined) this.open.set(e.midi, inp);
      return inp;
    }
    if (e.midi !== undefined) {
      const inp = this.open.get(e.midi);
      if (inp) {
        inp.releaseMs = ms;
        this.open.delete(e.midi);
      }
    }
    return null;
  }

  /** Close any held notes (e.g. at the end of the capture window). */
  closeAll(atMs: number) {
    for (const inp of this.open.values()) inp.releaseMs = atMs;
    this.open.clear();
  }
}

/** Learner phrase snapped to a grid (default half beat). A labelled copy; raw inputs are kept separately. */
export function quantise(inputs: CapturedInput[], tempoBpm: number, totalTicks: number, gridTicks = TPQ / 2, instrument: Phrase['instrument']): Phrase {
  const events: MusicEvent[] = [];
  const used = new Set<string>();
  const sorted = [...inputs].sort((a, b) => a.onsetMs - b.onsetMs);
  const snap = (ms: number) => Math.round(msToTicks(ms, tempoBpm) / gridTicks) * gridTicks;
  for (const [k, inp] of sorted.entries()) {
    const onset = snap(inp.onsetMs);
    if (onset < 0 || onset >= totalTicks) continue;
    const key = `${onset}:${inp.midi ?? inp.sound}`;
    if (used.has(key)) continue;
    used.add(key);
    const heldTicks = inp.releaseMs !== undefined ? Math.round(msToTicks(inp.releaseMs - inp.onsetMs, tempoBpm) / gridTicks) * gridTicks : gridTicks;
    const duration = Math.max(gridTicks, Math.min(heldTicks || gridTicks, totalTicks - onset));
    if (inp.midi !== undefined) events.push({ id: `q-${inp.id}`, kind: 'note', onset, duration, midi: inp.midi, velocity: 0.7, author: 'learner' });
    else if (inp.sound) {
      // A drum hit has no held length: write it as lasting until the next hit, at most one beat.
      const nextOnset = sorted.slice(k + 1).map((x) => snap(x.onsetMs)).find((t) => t > onset) ?? totalTicks;
      const drumDur = Math.max(gridTicks, Math.min(nextOnset - onset, TPQ, totalTicks - onset));
      events.push({ id: `q-${inp.id}`, kind: 'drum', onset, duration: drumDur, sound: inp.sound, velocity: 0.7, author: 'learner' });
    }
  }
  return { id: 'learner-phrase', instrument, meter: [4, 4], totalTicks, tempoBpm, events };
}

/** Make notes not overlap a section boundary (clip at the boundary). */
export function clipAt(p: Phrase, boundary: number): Phrase {
  return {
    ...p,
    events: p.events.map((e) => (e.onset < boundary && e.onset + e.duration > boundary ? { ...e, duration: boundary - e.onset } : e)),
  };
}

/**
 * Timing evidence for free playing against a click: residual to the nearest grid point.
 * Used in creative missions where there is no fixed target.
 */
export function gridEvidence(inputs: CapturedInput[], tempoBpm: number, gridBeats = 0.5): TimingEvidence {
  const beatMs = 60000 / tempoBpm;
  const residuals: number[] = [];
  const positions: number[] = [];
  for (const inp of [...inputs].sort((a, b) => a.onsetMs - b.onsetMs)) {
    const beats = inp.onsetMs / beatMs;
    if (beats < -0.5) continue;
    const pos = Math.round(beats / gridBeats) * gridBeats;
    residuals.push(beats - pos);
    positions.push(pos);
  }
  return { residuals, positions, expectedCount: residuals.length };
}
