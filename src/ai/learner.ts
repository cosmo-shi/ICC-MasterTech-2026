// What Carmen's learning decisions are built on. The learner model is Bayesian Knowledge
// Tracing (bkt.ts, on-device, per skill). This file turns its posterior estimates into the few
// decisions the app actually makes, and keeps the evidence for each one so a teacher can see
// why. Known musical events (the checker's facts) stay separate from inferred understanding.
//
// Decisions the model influences:
//  1. the next activity (practise a weak skill, move on, or go over a lesson again);
//  2. how much support a lesson starts with (slower tempo, hear it first, a lit-key demonstration);
//  3. which fact the coach talks about first, only if the current try shows it.
// A teacher can review every estimate and override it; overrides are labelled as the teacher's.

import { LESSONS } from '../data/catalog.ts';
import { ACTIVITIES } from '../data/curriculum.ts';
import type { AttemptRecord } from '../store/db.ts';
import { type Band, type LearnerState, type LessonInfo, type SkillId, type SkillState, THRESHOLDS, buildLearnerState, band, lessonInfos, needsPractice, recentFails, skillLabel } from './bkt.ts';
import { type TailorContext, type TailorPlan, coachFocusFor, planNext, reasonText, startSuggestions } from './tailor.ts';

export type { Band, LearnerState, SkillId, TailorPlan };
export { reasonText };

export interface SkillInfo {
  id: SkillId;
  /** Child-facing name. */
  name: string;
  /** Teacher-facing description of the evidence. */
  teacher: string;
  /** Music words topic. */
  theory: string;
}

export const SKILLS: SkillInfo[] = [
  { id: 'pulse', name: 'Pulse', teacher: 'Sounds land within the on-time window of the beat', theory: 'pulse' },
  { id: 'rests', name: 'Rests', teacher: 'No sound during written rests', theory: 'rests' },
  { id: 'subdivision', name: 'Subdivision', teacher: 'Quaver pairs land on time against the beat', theory: 'quavers' },
  { id: 'pitch', name: 'Pitch accuracy', teacher: 'Every expected key was played (untimed tasks have no timing penalty)', theory: 'note-names' },
  { id: 'reading', name: 'Notation reading', teacher: 'Right keys when the task is read from the stave', theory: 'stave' },
  { id: 'duration', name: 'Note duration', teacher: 'Notes held for their written length', theory: 'note-values' },
];
export const skillById = (id: SkillId) => SKILLS.find((s) => s.id === id)!;

/** Lessons in curriculum order, so "the earliest lesson that trains a skill" follows the tracks. */
const ORDER = ACTIVITIES.map((a) => a.id);
export const LESSON_INFOS: LessonInfo[] = lessonInfos([...LESSONS].sort((a, b) => ORDER.indexOf(a.id) - ORDER.indexOf(b.id)));
export const skillsForActivity = (activityId: string): SkillInfo[] => (LESSON_INFOS.find((l) => l.id === activityId)?.skills ?? []).map(skillById);

/* ---------- Teacher overrides (local, per player) ---------- */

export type SkillOverride = 'practise' | 'secure';
export interface TeacherOverrides {
  skills: Partial<Record<SkillId, SkillOverride>>;
  /** A teacher-chosen next activity, shown to the child instead of the model's. */
  next?: string;
}
const OVR_KEY = 'carmen-teacher-overrides-v1';
const ovrListeners = new Set<() => void>();
function readAll(): Record<string, TeacherOverrides> {
  try {
    return JSON.parse(localStorage.getItem(OVR_KEY) ?? '{}');
  } catch {
    return {};
  }
}
let overrides = readAll();
export const teacherOverrides = {
  get: (playerId?: string): TeacherOverrides => (playerId && overrides[playerId]) || { skills: {} },
  set(playerId: string, o: TeacherOverrides) {
    overrides = { ...overrides, [playerId]: o };
    try {
      localStorage.setItem(OVR_KEY, JSON.stringify(overrides));
    } catch {
      /* kept for this visit */
    }
    ovrListeners.forEach((f) => f());
  },
  subscribe(f: () => void) {
    ovrListeners.add(f);
    return () => {
      ovrListeners.delete(f);
    };
  },
  snapshot: () => overrides,
};

/** The state the planner uses: the model's, with teacher overrides applied (and labelled). */
export function withOverrides(state: LearnerState, o: TeacherOverrides): LearnerState {
  const skills = { ...state.skills };
  for (const [k, v] of Object.entries(o.skills) as [SkillId, SkillOverride][]) {
    const s = skills[k];
    if (!s) continue;
    skills[k] =
      v === 'practise'
        ? { ...s, p: Math.min(s.p, THRESHOLDS.nearly - 0.01), observations: Math.max(s.observations, THRESHOLDS.minObservations) }
        : { ...s, p: Math.max(s.p, THRESHOLDS.secure), observations: Math.max(s.observations, THRESHOLDS.minObservations), independentPasses: Math.max(1, s.independentPasses) };
  }
  return { ...state, skills, attemptsUsed: Math.max(state.attemptsUsed, Object.keys(o.skills).length ? 1 : 0) };
}

/* ---------- What the app reads ---------- */

export interface SkillEstimate {
  skill: SkillId;
  /** Posterior probability the skill is known (model only, before any override). */
  p: number;
  band: Band;
  observations: number;
  independent: number;
  assisted: number;
  independentPasses: number;
  recentFails: number;
  evidenceAttemptIds: string[];
  /** True when there is too little evidence to say much. */
  uncertain: boolean;
  override?: SkillOverride;
  needsPractice: boolean;
}

export function estimatesFrom(state: LearnerState, o: TeacherOverrides = { skills: {} }): SkillEstimate[] {
  return SKILLS.map(({ id }) => {
    const s: SkillState = state.skills[id];
    const ov = o.skills[id];
    return {
      skill: id,
      p: s.p,
      band: band(s),
      observations: s.observations,
      independent: s.independent,
      assisted: s.assisted,
      independentPasses: s.independentPasses,
      recentFails: recentFails(s),
      evidenceAttemptIds: s.evidenceAttemptIds,
      uncertain: s.observations < THRESHOLDS.minObservations,
      override: ov,
      needsPractice: ov ? ov === 'practise' : needsPractice(s),
    };
  });
}

export function learnerFrom(attempts: AttemptRecord[], o: TeacherOverrides = { skills: {} }) {
  const state = buildLearnerState(attempts, LESSON_INFOS);
  const planning = withOverrides(state, o);
  return { state, planning, estimates: estimatesFrom(state, o) };
}

export interface Support {
  /** Suggested before starting: slower tempo, hear it first. */
  start: ReturnType<typeof startSuggestions>;
  /** Show a lit-key / lit-drum demonstration up front (recent tries on this lesson's skill keep failing). */
  demo: boolean;
  /** The skill this lesson's support is about, and the evidence for it. */
  skill?: SkillId;
  reason?: string;
  /** The learner already shows the skills here: offer to go straight to "on your own". */
  ready: boolean;
}

/** How much support to offer at the start of a lesson, from the model's evidence. */
export function supportFor(planning: LearnerState, lessonId: string, ctx: TailorContext): Support {
  const info = LESSON_INFOS.find((l) => l.id === lessonId);
  if (!info || !ctx.aiEnabled || !info.skills.length) return { start: [], demo: false, ready: false };
  const start = startSuggestions(planning, lessonId, ctx);
  const weak = info.skills.filter((k) => needsPractice(planning.skills[k])).sort((a, b) => planning.skills[a].p - planning.skills[b].p)[0];
  const demo = !!weak && recentFails(planning.skills[weak]) >= 2;
  const ready = info.skills.every((k) => planning.skills[k].observations >= THRESHOLDS.minObservations && planning.skills[k].p >= THRESHOLDS.nearly);
  const reason = weak ? `Your last ${Math.max(1, recentFails(planning.skills[weak]))} tries at ${skillLabel(weak)} were tricky.` : undefined;
  return { start, demo, skill: weak, reason, ready };
}

export function coachFocus(planning: LearnerState, lessonId: string, ctx: TailorContext) {
  return coachFocusFor(planning, lessonId, ctx);
}

/** The next activity: a teacher's choice if set, else the model's plan (validated), else the route. */
export function nextFor(planning: LearnerState, o: TeacherOverrides, ctx: TailorContext): TailorPlan & { teacher?: boolean; rejected?: string[] } {
  if (o.next && ACTIVITIES.some((a) => a.id === o.next) && o.next !== ctx.currentLessonId) {
    return { provenance: 'rules', next: { lessonId: o.next, reasonId: 'route', evidenceAttemptIds: [] }, start: [], teacher: true };
  }
  return planNext(planning, ctx);
}

/** Lesson score, out of 3: 1 = had a go, 2 = matched with practice, 3 = matched on your own. */
export function lessonStars(attempts: Pick<AttemptRecord, 'activityId' | 'kind' | 'passed'>[], activityId: string): 0 | 1 | 2 | 3 {
  const mine = attempts.filter((a) => a.activityId === activityId && a.kind !== 'check');
  if (mine.some((a) => (a.kind === 'independent' || a.kind === 'mission-check') && a.passed)) return 3;
  if (mine.some((a) => a.passed)) return 2;
  return mine.length ? 1 : 0;
}

/** Children working on the same skill (the model says they need practice), for the teacher to group. */
export function suggestGroups(byChild: { id: string; estimates: SkillEstimate[] }[]): { skill: SkillId; children: string[] }[] {
  const groups: { skill: SkillId; children: string[] }[] = [];
  for (const s of SKILLS) {
    const kids = byChild.filter((c) => c.estimates.find((x) => x.skill === s.id)?.needsPractice);
    if (kids.length >= 2) groups.push({ skill: s.id, children: kids.map((k) => k.id) });
  }
  return groups.sort((a, b) => b.children.length - a.children.length);
}

/** Teacher words for a band. Never a percentage or a diagnosis. */
export const BAND_WORDS: Record<Band, string> = {
  new: 'Limited evidence',
  growing: 'Still learning',
  nearly: 'Almost secure',
  secure: 'Secure on their own',
};
