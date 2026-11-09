// The coach: turns checker facts (+ the on-device model's timing pattern) into one question,
// one measured observation, a verified musical reply and learner choices.
// The model never changes the score; it only selects which approved reply to offer.

import coachText from '../data/coach.json';
import type { CapturedInput, CheckResult } from '../engine/checker.ts';
import { type MusicEvent, type Phrase, TPQ, msToTicks } from '../music/events.ts';
import { midiToLetter } from '../music/theory.ts';
import type { Pattern, TimingEvidence } from './features.ts';
import { type ModelResult, runModel } from './model.ts';
import { type ReplyPlan, type ReplyRender, type Verification, compileReply, verifyReply } from './reply.ts';
import { rulesPattern } from './rules.ts';

export type Focus = 'sound' | 'missing' | 'rest' | 'timing' | 'duration' | 'passed' | 'insufficient';

export interface CoachDecision {
  focus: Focus;
  question: string;
  observation: string;
  evidenceFactIds: string[];
  /** Where the timing description came from. */
  patternSource: 'local-model' | 'rules' | 'none';
  pattern?: Pattern | 'insufficient';
  model?: ModelResult;
  /** True when the on-device learner model chose which fact to ask about first. */
  focusFromLearner?: boolean;
  reply?: { plan: ReplyPlan; render: ReplyRender; verification: Verification; replyText: string; sourcePhrase: Phrase };
  replyRejected?: string[];
  label: 'AI coach' | 'Coach tips';
}

function fill(t: string, vars: Record<string, string | number>): string {
  return t.replace(/\{(\w+)\}/g, (_, k) => (vars[k] !== undefined ? String(vars[k]) : ''));
}

function labelToText(l?: string): string {
  if (!l) return '';
  if (l.startsWith('midi:')) return midiToLetter(Number(l.slice(5)));
  return l.slice(5);
}

/** Turn a live attempt into a learner-authored phrase (unquantised, in ticks). */
export function inputsToPhrase(inputs: CapturedInput[], target: Phrase, tempoBpm: number): Phrase {
  const events: MusicEvent[] = [];
  const beatTicks = TPQ;
  for (const inp of [...inputs].sort((a, b) => a.onsetMs - b.onsetMs)) {
    const onset = Math.max(0, Math.round(msToTicks(inp.onsetMs, tempoBpm)));
    if (onset >= target.totalTicks) continue;
    const held = inp.releaseMs !== undefined ? Math.round(msToTicks(inp.releaseMs - inp.onsetMs, tempoBpm)) : beatTicks / 2;
    const duration = Math.max(1, Math.min(held, target.totalTicks - onset));
    if (inp.midi !== undefined) events.push({ id: inp.id, kind: 'note', onset, duration, midi: inp.midi, velocity: 0.7, author: 'learner' });
    else if (inp.sound) events.push({ id: inp.id, kind: 'drum', onset, duration, sound: inp.sound, velocity: 0.7, author: 'learner' });
  }
  return { id: 'learner-attempt', instrument: target.instrument, meter: target.meter, totalTicks: target.totalTicks, tempoBpm, events };
}

export function timingEvidence(result: CheckResult, target: Phrase): TimingEvidence {
  const sounding = target.events.filter((e) => e.kind !== 'rest').sort((a, b) => a.onset - b.onset);
  const residuals: number[] = [];
  const positions: number[] = [];
  result.residualsBeats.forEach((r, i) => {
    if (r !== null && result.facts[i]?.status !== 'missed') {
      residuals.push(r);
      positions.push(sounding[i].onset / TPQ);
    }
  });
  return { residuals, positions, expectedCount: sounding.length };
}

export interface CoachContext {
  target: Phrase;
  inputs: CapturedInput[];
  result: CheckResult;
  aiEnabled: boolean;
  independentCheck: boolean;
  tempoBpm: number;
  /** From the learner model: ask about this first, but only if this attempt shows it. */
  focusHint?: Focus;
}

export function decide(ctx: CoachContext): CoachDecision {
  const { result, target } = ctx;
  const s = result.summary;
  const q = coachText.questions;
  const o = coachText.observations;

  // Timing pattern: on-device model when enabled and confident; otherwise rules.
  let pattern: Pattern | 'insufficient' | undefined;
  let patternSource: CoachDecision['patternSource'] = 'none';
  let model: ModelResult | undefined;
  if (result.timed) {
    const ev = timingEvidence(result, target);
    if (ctx.aiEnabled) {
      model = runModel(ev);
      if (model.status === 'ok') {
        pattern = model.pattern;
        patternSource = 'local-model';
      }
    }
    if (!pattern) {
      pattern = rulesPattern(ev);
      patternSource = 'rules';
    }
  }

  // One feedback priority, in a fixed order.
  const wrong = result.facts.find((f) => f.status === 'wrong');
  const missed = result.facts.find((f) => f.status === 'missed');
  const restHit = result.extras.find((x) => x.inRest);
  const extra = result.extras[0];
  const timingOff = result.timed && s.early + s.late > Math.floor(s.expected / 4);
  const durationOff = result.facts.find((f) => f.duration === 'short' || f.duration === 'long');

  let focus: Focus;
  let observation: string;
  let evidence: string[] = [];

  // The learner model may move one recurring skill to the front, only if this attempt shows it.
  const hint = ctx.aiEnabled && !ctx.independentCheck ? ctx.focusHint : undefined;
  const hinted =
    (hint === 'sound' && !!wrong) ||
    (hint === 'rest' && !!restHit) ||
    (hint === 'timing' && !!(timingOff && pattern)) ||
    (hint === 'duration' && !!durationOff)
      ? hint
      : undefined;

  if (s.expected === 0 || ctx.inputs.length === 0) {
    focus = 'insufficient';
    observation = o.insufficient;
  } else if (wrong && (!hinted || hinted === 'sound')) {
    focus = 'sound';
    observation = wrong.expectedLabel.startsWith('midi:')
      ? fill(o.wrongNote, { count: wrong.index + 1, played: labelToText(wrong.playedLabel), expected: labelToText(wrong.expectedLabel) })
      : fill(o.wrongDrum, { count: wrong.index + 1 });
    evidence = [wrong.factId];
  } else if (restHit && (!hinted || hinted === 'rest')) {
    focus = 'rest';
    observation = fill(o.rest, { beat: Math.floor(restHit.onsetBeats) + 1 });
    evidence = [restHit.factId];
  } else if (missed && !hinted) {
    focus = 'missing';
    observation = fill(o.missed, { count: missed.index + 1 });
    evidence = [missed.factId];
  } else if (extra && !hinted) {
    focus = 'missing';
    observation = fill(o.extra, { beat: Math.floor(extra.onsetBeats) + 1 });
    evidence = [extra.factId];
  } else if (timingOff && pattern && (!hinted || hinted === 'timing')) {
    focus = 'timing';
    observation = o[pattern];
    evidence = result.facts.filter((f) => f.timing && f.timing !== 'onTime').map((f) => f.factId);
  } else if (durationOff) {
    focus = 'duration';
    observation = fill(o.duration, { count: durationOff.index + 1, held: (durationOff.heldBeats ?? 0).toFixed(1), want: '' });
    const exp = target.events.find((e) => e.id === durationOff.expectedId);
    if (exp) observation = fill(o.duration, { count: durationOff.index + 1, held: (durationOff.heldBeats ?? 0).toFixed(1), want: exp.duration / TPQ });
    evidence = [durationOff.factId];
  } else {
    focus = 'passed';
    observation = result.timed ? fill(o.passed, { onTime: s.onTime, total: s.expected }) : 'Every note matched, in the right order.';
  }

  const question = q[focus];
  const decision: CoachDecision = {
    focus,
    question,
    observation,
    evidenceFactIds: evidence,
    patternSource,
    pattern,
    model,
    focusFromLearner: !!hinted && focus === hinted,
    label: (patternSource === 'local-model' && focus === 'timing') || (!!hinted && focus === hinted) ? 'AI coach' : 'Coach tips',
  };

  // Musical reply — never during an independent check.
  if (ctx.independentCheck || focus === 'passed' || focus === 'insufficient') return decision;
  const learner = inputsToPhrase(ctx.inputs, target, ctx.tempoBpm);
  let plan: ReplyPlan | undefined;
  let source: Phrase = target;
  const prov = patternSource === 'local-model' ? 'local-model' : 'rules';
  if (focus === 'timing' && pattern) {
    if (pattern === 'early' || pattern === 'late') {
      plan = { planId: 'pulse-with-mine', params: { op: 'add_part', part: 'pulse', tempoScale: 1 }, source: 'learner', provenance: prov, evidenceFactIds: evidence, templateId: 'pulse-with-mine' };
      source = learner;
    } else if (pattern === 'speedingUp' || pattern === 'slowingDown') {
      plan = { planId: 'pulse-slower', params: { op: 'add_part', part: 'pulse', tempoScale: 0.85 }, source: 'learner', provenance: prov, evidenceFactIds: evidence, templateId: 'pulse-slower' };
      source = learner;
    } else {
      plan = { planId: 'target-slower', params: { op: 'echo', tempoScale: 0.8 }, source: 'target', provenance: prov, evidenceFactIds: evidence, templateId: 'target-slower' };
    }
  } else if (focus === 'rest' && restHit) {
    plan = { planId: 'mine-with-rest', params: { op: 'replace_with_rest', eventId: restHit.inputId }, source: 'learner', provenance: 'rules', evidenceFactIds: evidence, templateId: 'mine-with-rest' };
    source = learner;
  } else {
    plan = { planId: 'target-echo', params: { op: 'echo', tempoScale: 1 }, source: 'target', provenance: 'rules', evidenceFactIds: evidence, templateId: 'target-echo' };
  }
  const replyText = coachText.replies[plan.templateId as keyof typeof coachText.replies];
  const render = compileReply(plan, source);
  const verification = verifyReply(plan, source, render);
  if (verification.ok) decision.reply = { plan, render, verification, replyText, sourcePhrase: source };
  else decision.replyRejected = verification.violations;
  return decision;
}
