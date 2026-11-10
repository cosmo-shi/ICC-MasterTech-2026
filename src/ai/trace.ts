// A readable trace of what the learner model did with each try, for the Teacher space and the
// generated decision record (docs/MODEL_DECISIONS.md). For every try it keeps four layers apart:
//   1. the try:        what was played, with what help (a stored record)
//   2. evidence:       checker facts turned into pass/miss per skill, and how much the try counts
//   3. inference:      the Bayesian estimate before and after, its band, and whether it is uncertain
//   4. teaching action: what the model chose next, next to what the rules baseline would choose
// Notation, sound mapping and playback checks are not part of this: they are facts about the
// music, checked elsewhere, and never inferred.

import type { AttemptRecord } from '../store/db.ts';
import { type Band, type LessonInfo, type SkillId, THRESHOLDS, band, buildLearnerState, evidenceWeight, observationsFrom } from './bkt.ts';
import { type CheckOffer, checkInOffer, rulesCheckInOffer } from './checkin.ts';
import { type TailorContext, rulesPlan, planNext, reasonText, startSuggestions } from './tailor.ts';

export interface SkillChange {
  skill: SkillId;
  pass: boolean;
  before: number;
  after: number;
  bandBefore: Band;
  bandAfter: Band;
  uncertain: boolean;
}

export interface TeachingAction {
  next?: string;
  why: string;
  start: string[];
  checkIn: CheckOffer | null;
}

export interface TraceStep {
  attempt: AttemptRecord;
  weight: number;
  why: string;
  changes: SkillChange[];
  model: TeachingAction;
  rules: TeachingAction;
  /** True when the model and the rules would do something different here. */
  differs: boolean;
}

function weightWords(a: AttemptRecord, w: number): string {
  if (a.kind === 'check') return 'A check: not used as evidence';
  if (w === 0) return 'Not used as evidence';
  if (a.kind === 'independent') return 'On their own: counts fully';
  const help = [a.support.hintLevel >= 3 ? 'answer shown' : a.support.hintLevel ? 'hint' : '', a.support.slower ? 'slower' : '', a.support.heardExample ? 'heard or watched it first' : ''].filter(Boolean);
  return `Practice${help.length ? ` with ${help.join(', ')}` : ''}: counts ${Math.round(w * 100)}%`;
}

/** Replays the tries in order and records what each one changed and what each planner would do. */
export function traceLearner(attempts: AttemptRecord[], infos: LessonInfo[], ctx: Omit<TailorContext, 'infos' | 'currentLessonId'>): TraceStep[] {
  const sorted = [...attempts].filter((a) => !a.note).sort((a, b) => a.createdAt - b.createdAt);
  const steps: TraceStep[] = [];
  let missesInARow = 0;
  let lastLesson = '';
  for (let i = 0; i < sorted.length; i++) {
    const a = sorted[i];
    const before = buildLearnerState(sorted.slice(0, i), infos);
    const after = buildLearnerState(sorted.slice(0, i + 1), infos);
    const info = infos.find((l) => l.id === a.activityId);
    const w = a.summary && info ? evidenceWeight(a) : 0;
    const obs = info && w > 0 ? observationsFrom(a, info) : [];
    if (a.kind !== 'check') {
      missesInARow = a.activityId === lastLesson && !a.passed ? missesInARow + 1 : a.passed ? 0 : 1;
      lastLesson = a.activityId;
    }
    const changes = obs.map((o) => {
      const sb = before.skills[o.skill];
      const sa = after.skills[o.skill];
      return { skill: o.skill, pass: o.pass, before: sb.p, after: sa.p, bandBefore: band(sb), bandAfter: band(sa), uncertain: sa.observations < THRESHOLDS.minObservations };
    });
    const c: TailorContext = { ...ctx, infos, currentLessonId: a.activityId, justPassed: a.passed };
    const plan = planNext(after, c);
    const rules = rulesPlan(after, c);
    const model: TeachingAction = ctx.aiEnabled
      ? { next: plan.next?.lessonId, why: plan.provenance === 'learner-model' ? reasonText(plan) : 'Too little evidence: follows the route', start: startSuggestions(after, a.activityId, { ...c, justPassed: false }), checkIn: checkInOffer(after, info, true) }
      : { next: rules.next?.lessonId, why: 'Model off: rules', start: [], checkIn: rulesCheckInOffer(missesInARow, info) };
    const rulesAction: TeachingAction = { next: rules.next?.lessonId, why: 'Next on the route', start: [], checkIn: rulesCheckInOffer(missesInARow, info) };
    const differs = model.next !== rulesAction.next || model.start.length > 0 || !!model.checkIn !== !!rulesAction.checkIn;
    steps.push({ attempt: a, weight: w, why: weightWords(a, w), changes, model, rules: rulesAction, differs });
  }
  return steps;
}
