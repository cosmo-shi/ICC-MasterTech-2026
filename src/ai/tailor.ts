// Lesson tailoring planner. Reads the on-device learner model and proposes a plan made of
// approved IDs only: a next lesson, a reason template, optional start suggestions and a coach
// focus. A validator checks every plan; anything invalid, or too little evidence, falls back to
// the rules plan (the pathway route), which is also the baseline the model must beat.
// Suggestions only: nothing is locked, ranked or applied without the learner choosing it.

import skillsData from '../data/skills.json';
import type { Focus } from './coach.ts';
import {
  LEARNER_MODEL_ID,
  LEARNER_MODEL_VERSION,
  type LearnerState,
  type LessonInfo,
  type SkillId,
  THRESHOLDS,
  needsPractice,
  recentFails,
  recentPasses,
  skillLabel,
} from './learner.ts';

export type SuggestionId = 'slower' | 'listen-first';
export type ReasonId = keyof typeof skillsData.reasons;

export interface TailorPlan {
  provenance: 'learner-model' | 'rules';
  modelId?: string;
  modelVersion?: string;
  next?: { lessonId: string; reasonId: ReasonId; skill?: SkillId; count?: number; evidenceAttemptIds: string[] };
  start: SuggestionId[];
  coachFocus?: Focus;
}

export interface TailorContext {
  infos: LessonInfo[];
  /** The pathway's recommended lesson ids, in order (empty if no pathway chosen). */
  route: string[];
  currentLessonId?: string;
  aiEnabled: boolean;
  independentCheck?: boolean;
  /** The try just finished passed: suggest a different activity, never this one again. */
  justPassed?: boolean;
  heardExample?: boolean;
  slower?: boolean;
}

const SUGGESTIONS = Object.keys(skillsData.suggestions) as SuggestionId[];
const REASONS = Object.keys(skillsData.reasons) as ReasonId[];

const FOCUS_FOR: Record<SkillId, Focus> = {
  pulse: 'timing',
  subdivision: 'timing',
  rests: 'rest',
  pitch: 'sound',
  reading: 'sound',
  duration: 'duration',
};

function started(state: LearnerState, id: string): boolean {
  return (state.lessons[id]?.attempts ?? 0) > 0;
}

function prerequisitesStarted(state: LearnerState, l: LessonInfo): boolean {
  return l.prerequisites.every((p) => started(state, p));
}

/** Today's behaviour: the next lesson on the pathway route (or the next lesson in order). */
export function rulesPlan(state: LearnerState, ctx: TailorContext): TailorPlan {
  const order = (id: string) => ctx.infos.findIndex((l) => l.id === id);
  let nextId: string | undefined;
  if (ctx.currentLessonId) {
    const ix = order(ctx.currentLessonId);
    nextId = ctx.route.find((id) => id !== ctx.currentLessonId && order(id) > ix) ?? ctx.infos[ix + 1]?.id;
  } else {
    nextId = ctx.route.find((id) => !started(state, id)) ?? ctx.route[0] ?? ctx.infos[0]?.id;
  }
  return { provenance: 'rules', next: nextId ? { lessonId: nextId, reasonId: 'route', evidenceAttemptIds: [] } : undefined, start: [] };
}

/** Start suggestions for one lesson: buttons the learner may tap. Never on an independent check. */
export function startSuggestions(state: LearnerState, lessonId: string, ctx: TailorContext): SuggestionId[] {
  if (!ctx.aiEnabled || ctx.independentCheck) return [];
  const l = ctx.infos.find((x) => x.id === lessonId);
  if (!l) return [];
  const out: SuggestionId[] = [];
  const weak = (k: SkillId) => l.skills.includes(k) && needsPractice(state.skills[k]) && state.skills[k].p < THRESHOLDS.growing + 0.1;
  if (l.timed && !ctx.slower && (weak('pulse') || weak('subdivision'))) out.push('slower');
  if (!ctx.heardExample && (weak('pitch') || weak('reading') || weak('rests'))) out.push('listen-first');
  return out;
}

/** The coach may ask first about the learner's weakest skill in this lesson (only if this attempt shows it). */
export function coachFocusFor(state: LearnerState, lessonId: string, ctx: TailorContext): Focus | undefined {
  if (!ctx.aiEnabled || ctx.independentCheck) return undefined;
  const l = ctx.infos.find((x) => x.id === lessonId);
  if (!l) return undefined;
  const weak = l.skills.filter((k) => needsPractice(state.skills[k])).sort((a, b) => state.skills[a].p - state.skills[b].p);
  return weak[0] ? FOCUS_FOR[weak[0]] : undefined;
}

/** The learner model's plan, before validation. */
function modelPlan(state: LearnerState, ctx: TailorContext): TailorPlan | null {
  if (state.attemptsUsed === 0) return null;
  const base = { provenance: 'learner-model' as const, modelId: LEARNER_MODEL_ID, modelVersion: LEARNER_MODEL_VERSION };
  const start = ctx.currentLessonId ? startSuggestions(state, ctx.currentLessonId, ctx) : [];
  const coachFocus = ctx.currentLessonId ? coachFocusFor(state, ctx.currentLessonId, ctx) : undefined;
  // After a pass, the suggestion is always a different activity from the lesson list.
  const avoid = ctx.justPassed ? ctx.currentLessonId : undefined;
  const skillsByWeakness = (Object.keys(state.skills) as SkillId[]).sort((a, b) => state.skills[a].p - state.skills[b].p);

  // 1. Practise the weakest skill that has enough evidence, in the earliest lesson that trains it.
  for (const k of skillsByWeakness.filter((x) => needsPractice(state.skills[x]))) {
    const lesson = ctx.infos
      .filter((l) => l.id !== avoid && l.skills.includes(k) && prerequisitesStarted(state, l))
      .sort((a, b) => a.order - b.order)[0];
    if (!lesson) continue;
    const sk = state.skills[k];
    return {
      ...base,
      next: { lessonId: lesson.id, reasonId: `practise-${k}` as ReasonId, skill: k, count: Math.max(1, recentFails(sk)), evidenceAttemptIds: sk.evidenceAttemptIds },
      start,
      coachFocus,
    };
  }

  // 2. Move on: the next unstarted lesson whose prerequisites are started. Prefer, in order: the pathway
  //    route, lessons that build on this one, other scored lessons, then explore and create activities.
  const byOrder = [...ctx.infos].sort((a, b) => a.order - b.order);
  const buildsOnThis = byOrder.filter((l) => !!ctx.currentLessonId && l.prerequisites.includes(ctx.currentLessonId));
  const candidates = [
    ...ctx.route.map((id) => ctx.infos.find((l) => l.id === id)).filter((l): l is LessonInfo => !!l),
    ...buildsOnThis,
    ...byOrder.filter((l) => l.skills.length > 0),
    ...byOrder,
  ];
  const next = candidates.find((l) => l.id !== ctx.currentLessonId && !started(state, l.id) && prerequisitesStarted(state, l));
  if (next) {
    const strongest = (Object.keys(state.skills) as SkillId[])
      .filter((k) => recentPasses(state.skills[k]) > 0)
      .sort((a, b) => state.skills[b].p - state.skills[a].p)[0];
    return {
      ...base,
      next: strongest
        ? { lessonId: next.id, reasonId: 'move-on', skill: strongest, count: recentPasses(state.skills[strongest]), evidenceAttemptIds: state.skills[strongest].evidenceAttemptIds }
        : { lessonId: next.id, reasonId: 'route', evidenceAttemptIds: [] },
      start,
      coachFocus,
    };
  }

  // 3. Everything is started: go back to the other lesson whose skills the model is least sure about.
  const review = ctx.infos
    .filter((l) => l.id !== ctx.currentLessonId && l.skills.length > 0)
    .map((l) => ({ l, p: Math.min(...l.skills.map((k) => state.skills[k].p)) }))
    .sort((a, b) => a.p - b.p || a.l.order - b.l.order)[0];
  if (!review) return null;
  const skill = [...review.l.skills].sort((a, b) => state.skills[a].p - state.skills[b].p)[0];
  return {
    ...base,
    next: { lessonId: review.l.id, reasonId: 'review', skill, evidenceAttemptIds: state.skills[skill].evidenceAttemptIds },
    start,
    coachFocus,
  };
}

/** Reject anything outside the approved set. Returns a list of problems (empty = valid). */
export function validatePlan(plan: TailorPlan, ctx: TailorContext): string[] {
  const problems: string[] = [];
  if (plan.next) {
    if (!ctx.infos.some((l) => l.id === plan.next!.lessonId)) problems.push(`unknown lesson ${plan.next.lessonId}`);
    if (!REASONS.includes(plan.next.reasonId)) problems.push(`unknown reason ${plan.next.reasonId}`);
  }
  for (const s of plan.start) if (!SUGGESTIONS.includes(s)) problems.push(`unknown suggestion ${s}`);
  if (ctx.independentCheck && plan.start.length) problems.push('no suggestions during an independent check');
  if (ctx.justPassed && plan.provenance === 'learner-model' && plan.next?.lessonId === ctx.currentLessonId) problems.push('after a pass, suggest a different activity');
  if (plan.provenance === 'learner-model' && (plan.modelId !== LEARNER_MODEL_ID || plan.modelVersion !== LEARNER_MODEL_VERSION)) {
    problems.push('model provenance without the loaded learner model');
  }
  return problems;
}

/** The plan the app uses: the learner model's when it is on, has evidence and passes validation. */
export function planNext(state: LearnerState, ctx: TailorContext): TailorPlan & { rejected?: string[] } {
  const rules = rulesPlan(state, ctx);
  if (!ctx.aiEnabled) return rules;
  const plan = modelPlan(state, ctx);
  if (!plan) return rules;
  const problems = validatePlan(plan, ctx);
  return problems.length ? { ...rules, rejected: problems } : plan;
}

/** Plain-words reason for a plan, from the approved templates. */
export function reasonText(plan: TailorPlan): string {
  if (!plan.next) return '';
  const t = skillsData.reasons[plan.next.reasonId] ?? '';
  return t.replace('{count}', String(plan.next.count ?? '')).replace('{skill}', plan.next.skill ? skillLabel(plan.next.skill) : '');
}

export function suggestionLabel(id: SuggestionId): string {
  return skillsData.suggestions[id];
}

/** Short words for grown-ups: why a lesson was suggested. */
export function reasonLabel(reasonId: string): string {
  if (reasonId.startsWith('practise-')) return `to practise ${skillLabel(reasonId.slice('practise-'.length) as SkillId)}`;
  if (reasonId === 'review') return 'to go over it again';
  if (reasonId === 'move-on') return 'to move on';
  return 'next on the route';
}
