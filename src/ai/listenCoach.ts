// Coach for takes played on a real instrument (Use my instrument and recordings).
// The on-device timing model reads the pattern in the taps (steady, early, late, speeding up,
// slowing down, uneven); the coach turns it into one observation, one tip and, when it passes the
// music check, a short verified example to hear. It never marks free play, never judges technique,
// and says "Carmen listened" only when the model actually ran (source 'local-model').

import coachText from '../data/coach.json';
import type { CheckResult } from '../engine/checker.ts';
import { type MusicEvent, type Phrase, TPQ } from '../music/events.ts';
import { timingEvidence } from './coach.ts';
import type { Pattern, TimingEvidence } from './features.ts';
import { type ModelResult, runModel } from './model.ts';
import { type ReplyPlan, type ReplyRender, type Verification, compileReply, verifyReply } from './reply.ts';
import { rulesPattern } from './rules.ts';

export interface ListenCoach {
  /** 'local-model' only when the on-device model ran and was confident. */
  source: 'local-model' | 'rules';
  pattern: Pattern;
  observation: string;
  tip: string;
  model?: ModelResult;
  reply?: { planId: string; replyText: string; render: ReplyRender; verification: Verification };
}

const OBS = coachText.observations as Record<string, string>;

/** One next step for each timing pattern. In a copy task the beat is the music's; in free play it is the learner's own. */
const TIPS: Record<'copy' | 'free', Record<Pattern, string>> = {
  copy: {
    steady: 'Keep that steady beat, and try a new rhythm.',
    early: 'Wait for each click, then tap with it.',
    late: 'Get ready during the count-in, and tap as the click lands.',
    speedingUp: 'Count 1, 2, 3, 4 out loud to hold the speed.',
    slowingDown: 'Keep counting to the end, so the last taps stay with the beat.',
    uneven: 'Try it slower, and make every space the same.',
  },
  free: {
    steady: 'Try keeping that beat while you play some notes longer and some shorter.',
    early: 'Try keeping that beat while you play some notes longer and some shorter.',
    late: 'Try keeping that beat while you play some notes longer and some shorter.',
    speedingUp: 'To keep one speed, count 1, 2, 3, 4 in your head as you play.',
    slowingDown: 'To keep one speed, count all the way to the end as you play.',
    uneven: 'If you wanted a steady beat, try counting as you play. If you wanted it to change, that worked.',
  },
};

const FREE_OBS: Record<Pattern, string> = {
  steady: 'Your beat stayed steady the whole way through.',
  early: 'Your beat stayed steady the whole way through.',
  late: 'Your beat stayed steady the whole way through.',
  speedingUp: 'Your beat got faster as you went.',
  slowingDown: 'Your beat got slower as you went.',
  uneven: 'The spaces between your sounds changed a lot.',
};

function read(ev: TimingEvidence, aiEnabled: boolean, free: boolean): { pattern: Pattern; source: ListenCoach['source']; model?: ModelResult } | null {
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

function withReply(c: ListenCoach, plan: ReplyPlan, source: Phrase): ListenCoach {
  const render = compileReply(plan, source);
  const verification = verifyReply(plan, source, render);
  if (verification.ok) c.reply = { planId: plan.planId, replyText: coachText.replies[plan.templateId as keyof typeof coachText.replies], render, verification };
  return c;
}

/** Coach for a copied rhythm, from the checker's result. Null when too few taps matched. */
export function coachCopy(result: CheckResult, target: Phrase, learner: Phrase, aiEnabled: boolean): ListenCoach | null {
  if (!result.timed) return null;
  const ev = timingEvidence(result, target);
  const r = read(ev, aiEnabled, false);
  if (!r) return null;
  const c: ListenCoach = { ...r, observation: OBS[r.pattern], tip: TIPS.copy[r.pattern] };
  const prov = r.source === 'local-model' ? 'local-model' : 'rules';
  if (r.pattern === 'early' || r.pattern === 'late')
    return withReply(c, { planId: 'pulse-with-mine', params: { op: 'add_part', part: 'pulse', tempoScale: 1 }, source: 'learner', provenance: prov, evidenceFactIds: [], templateId: 'pulse-with-mine' }, learner);
  if (r.pattern === 'speedingUp' || r.pattern === 'slowingDown')
    return withReply(c, { planId: 'pulse-slower', params: { op: 'add_part', part: 'pulse', tempoScale: 0.85 }, source: 'learner', provenance: prov, evidenceFactIds: [], templateId: 'pulse-slower' }, learner);
  if (r.pattern === 'uneven')
    return withReply(c, { planId: 'target-slower', params: { op: 'echo', tempoScale: 0.8 }, source: 'target', provenance: prov, evidenceFactIds: [], templateId: 'target-slower' }, target);
  return c;
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

/** Coach for free play or a recording: describes the learner's own beat, never marks it. */
export function coachFree(timesSec: number[], aiEnabled: boolean, instrument: 'keyboard' | 'drums', notes?: number[]): ListenCoach | null {
  const fe = freeEvidence(timesSec);
  if (!fe) return null;
  const r = read(fe.ev, aiEnabled, true);
  if (!r) return null;
  const c: ListenCoach = { ...r, observation: FREE_OBS[r.pattern], tip: TIPS.free[r.pattern] };
  if (r.pattern === 'uneven') return c;
  // A verified example: what you played, on the steady beat Carmen heard, with the metronome under it.
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
  const prov = r.source === 'local-model' ? 'local-model' : 'rules';
  return withReply(c, { planId: 'pulse-with-mine', params: { op: 'add_part', part: 'pulse', tempoScale: 1 }, source: 'learner', provenance: prov, evidenceFactIds: [], templateId: 'free-steady' }, learner);
}
