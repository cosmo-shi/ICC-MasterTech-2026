// Timing reads for takes played on a real instrument or in free play, where there may be no outside
// beat. The on-device timing model (or the rules baseline) reads the pattern in the onsets; the
// teaching words live in src/teach/free.ts. In free play the beat is only a guess from the first
// few sounds, so "early" and "late" are never used there, and nothing is marked.

import coachText from '../data/coach.json';
import { type MusicEvent, type Phrase, TPQ } from '../music/events.ts';
import type { Pattern, TimingEvidence } from './features.ts';
import { type ModelResult, runModel } from './model.ts';
import { type ReplyRender, type Verification, compileReply, verifyReply } from './reply.ts';
import { rulesPattern } from './rules.ts';

export interface PatternRead {
  /** 'local-model' only when the on-device model ran and was confident. */
  source: 'local-model' | 'rules';
  pattern: Pattern;
  model?: ModelResult;
}

export function readPattern(ev: TimingEvidence, aiEnabled: boolean, free: boolean): PatternRead | null {
  let model: ModelResult | undefined;
  if (aiEnabled) {
    model = runModel(ev);
    // With no outside beat, "early" or "late" means nothing, so the model's answer is not used.
    if (model.status === 'ok' && model.pattern && !(free && (model.pattern === 'early' || model.pattern === 'late'))) return { pattern: model.pattern, source: 'local-model', model };
  }
  const p = rulesPattern(ev);
  if (p === 'insufficient') return null;
  return { pattern: p, source: 'rules', model };
}

/**
 * Timing evidence for free play, where there is no outside beat: the learner's own beat is the
 * space they set at the start, and each sound is placed on that grid (whole beats, or half a beat for a clearly short space).
 * The residual is how far each sound sits from its place. Uses up to the first 12 beats.
 */
export function freeEvidence(timesSec: number[]): { ev: TimingEvidence; bpm: number } | null {
  const t = [...timesSec].sort((a, b) => a - b).slice(0, 16);
  if (t.length < 4) return null;
  const gaps = t.slice(1).map((x, i) => x - t[i]).filter((g) => g > 0.12);
  if (gaps.length < 3) return null;
  // The beat the learner set at the start (median of the first three spaces), so a beat that
  // gets faster or slower shows up as drift from it.
  const first = gaps.slice(0, 3).sort((a, b) => a - b);
  const period = first[1];
  if (!(period > 0.15 && period < 2)) return null;
  const positions = [0];
  for (let i = 1; i < t.length; i++) {
    // Half a beat only for a clearly short space; otherwise whole beats, so a gradual change in
    // speed stays visible instead of being rounded away.
    const ratio = (t[i] - t[i - 1]) / period;
    const step = ratio < 0.7 ? 0.5 : Math.max(1, Math.round(ratio));
    positions.push(positions[i - 1] + step);
  }
  // Anchored on the first sound, over at most 12 beats: the same shape of evidence the model was
  // trained on (a phrase of up to 12 beats that starts on the beat).
  let n = positions.findIndex((p) => p > 12);
  if (n === -1) n = positions.length;
  if (n < 4) return null;
  const residuals = t.slice(0, n).map((x, i) => (x - t[0]) / period - positions[i]);
  positions.length = n;
  return { ev: { residuals, positions, expectedCount: t.length }, bpm: Math.round(60 / period) };
}

export interface FreeReply {
  planId: string;
  replyText: string;
  render: ReplyRender;
  verification: Verification;
}

/** A verified example: what you played, placed on the steady beat Carmen guessed, with the metronome under it. */
export function freeReply(fe: { ev: TimingEvidence; bpm: number }, read: PatternRead, instrument: 'keyboard' | 'drums', notes?: number[]): FreeReply | undefined {
  const bpm = Math.min(150, Math.max(45, fe.bpm));
  const events: MusicEvent[] = fe.ev.positions.map((p, i) => {
    const onset = Math.round(p * TPQ);
    const midi = notes?.[i];
    return instrument === 'keyboard' && midi !== undefined
      ? { id: `m${i}`, kind: 'note', onset, duration: TPQ / 2, midi: Math.min(96, Math.max(36, midi)), velocity: 0.7, author: 'learner' }
      : { id: `m${i}`, kind: 'drum', onset, duration: TPQ / 2, sound: 'snare', velocity: 0.7, author: 'learner' };
  });
  const last = fe.ev.positions[fe.ev.positions.length - 1];
  const totalTicks = Math.ceil((last + 1) / 4) * 4 * TPQ;
  const learner: Phrase = { id: 'free-take', instrument, meter: [4, 4], totalTicks, tempoBpm: bpm, events };
  const plan = { planId: 'pulse-with-mine', params: { op: 'add_part' as const, part: 'pulse' as const, tempoScale: 1 }, source: 'learner' as const, provenance: read.source, evidenceFactIds: [], templateId: 'free-steady' };
  const render = compileReply(plan, learner);
  const verification = verifyReply(plan, learner, render);
  return verification.ok ? { planId: plan.planId, replyText: coachText.replies['free-steady'], render, verification } : undefined;
}
