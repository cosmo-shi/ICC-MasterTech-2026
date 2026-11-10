// On-device learner model: Bayesian Knowledge Tracing (BKT) per music skill.
// It reads only the checker's stored facts from this device's attempts and estimates,
// for each skill, how likely it is that the learner has it. Nothing leaves the device.
// It is a guess from practice evidence, not a test score, diagnosis, ranking or placement.
// Assisted attempts count for less, and a skill is only "secure" after an independent pass.

import skillsData from '../data/skills.json';
import type { Lesson } from '../music/lessons.ts';
import type { AttemptRecord } from '../store/db.ts';

export const LEARNER_MODEL_ID = 'carmen-learner-bkt';
export const LEARNER_MODEL_VERSION = '1.0.0';

export type SkillId = 'pulse' | 'rests' | 'subdivision' | 'pitch' | 'reading' | 'duration';
export type Band = 'new' | 'growing' | 'nearly' | 'secure';

export interface BktParams {
  pInit: number;
  pLearn: number;
  pSlip: number;
  pGuess: number;
}

export interface SkillState {
  p: number;
  observations: number;
  independent: number; // observations from independent checks
  assisted: number; // observations from practice
  independentPasses: number;
  recent: boolean[]; // last few pass/fail results, newest last
  evidenceAttemptIds: string[]; // newest last, capped
  lastSeen: number;
}

export interface LessonProgress {
  attempts: number;
  passed: boolean;
  independentPassed: boolean;
}

export interface LearnerState {
  modelId: string;
  modelVersion: string;
  skills: Record<SkillId, SkillState>;
  lessons: Record<string, LessonProgress>;
  attemptsUsed: number;
}

/** What the model needs to know about a lesson. Built from the lesson data, not hard-coded. */
export interface LessonInfo {
  id: string;
  order: number;
  skills: SkillId[];
  timed: boolean;
  pitch: boolean;
  duration: boolean;
  rests: boolean;
  prerequisites: string[];
}

export interface Observation {
  skill: SkillId;
  pass: boolean;
}

export const SKILLS = skillsData.skills.map((s) => s.id as SkillId);
export const THRESHOLDS = skillsData.thresholds;
export const WEIGHTS = skillsData.weights;
export type ParamSet = Record<SkillId, BktParams>;
/** The settings in use (fitted by `npm run fit:learner`, see skills.json "paramsSource"). */
export const PARAMS = Object.fromEntries(skillsData.skills.map((s) => [s.id, s.params])) as ParamSet;
/** The reviewed hand-picked starting values, kept for comparison. */
export const STARTING_PARAMS = Object.fromEntries(
  skillsData.skills.map((s) => [s.id, (s as { startingParams?: BktParams }).startingParams ?? s.params]),
) as ParamSet;
const LESSON_SKILLS = skillsData.lessons as Record<string, SkillId[]>;
const RECENT = 5;
const EVIDENCE_CAP = 8;

export function skillLabel(id: SkillId): string {
  return skillsData.skills.find((s) => s.id === id)?.label ?? id;
}

export function paramsFor(skill: SkillId): BktParams {
  return PARAMS[skill];
}

/** Lesson facts the model uses. Lessons with no skills (explore, create) give no evidence. */
export function lessonInfos(lessons: Lesson[]): LessonInfo[] {
  return lessons.map((l, order) => ({
    id: l.id,
    order,
    skills: LESSON_SKILLS[l.id] ?? [],
    timed: l.assessment.checkTiming,
    pitch: l.assessment.checkPitch,
    duration: l.assessment.checkDuration,
    rests: [l.practice, l.independent].some((ph) => ph?.events.some((e) => e.kind === 'rest')),
    prerequisites: l.prerequisites,
  }));
}

/**
 * Turn one stored attempt into per-skill pass/fail observations, from checker facts only.
 * Untimed pitch tasks give no timing observation (no timing penalty).
 */
export function observationsFrom(attempt: Pick<AttemptRecord, 'summary'>, lesson: LessonInfo): Observation[] {
  const s = attempt.summary;
  if (!s || s.expected === 0 || lesson.skills.length === 0) return [];
  const has = (k: SkillId) => lesson.skills.includes(k);
  const out: Observation[] = [];
  if (lesson.timed && has('pulse')) {
    const ok = s.onTime / s.expected >= THRESHOLDS.pulseOnTimeShare;
    out.push({ skill: 'pulse', pass: ok });
    if (has('subdivision')) out.push({ skill: 'subdivision', pass: ok });
  }
  if (lesson.pitch && has('pitch')) {
    const ok = s.wrong === 0;
    out.push({ skill: 'pitch', pass: ok });
    if (has('reading')) out.push({ skill: 'reading', pass: ok });
  }
  if (lesson.rests && has('rests')) out.push({ skill: 'rests', pass: s.restViolations === 0 });
  if (lesson.duration && has('duration')) out.push({ skill: 'duration', pass: s.durationIssues === 0 });
  return out;
}

/** How much one attempt counts. Independent checks count fully; help makes it count for less;
 *  an unclear listening take counts not at all. */
export function evidenceWeight(attempt: Pick<AttemptRecord, 'kind' | 'support' | 'input'>): number {
  // A try Carmen could not hear clearly says nothing about the learner: it never counts.
  if (attempt.input?.unclear) return 0;
  if (attempt.kind === 'independent') return WEIGHTS.independent;
  if (attempt.kind !== 'practice') return 0;
  let w = attempt.support.hintLevel >= 3 ? WEIGHTS.answerHint : WEIGHTS.practice;
  // Slower, heard or watched first, or counting shown: help, so the try counts for less.
  if (attempt.support.slower || attempt.support.heardExample || attempt.support.counting) w *= WEIGHTS.slowerOrHeard;
  return w;
}

/**
 * One BKT step. The posterior given the observation is blended with the prior by the
 * evidence weight, then the learning transition is applied (also scaled by the weight).
 */
export function bktUpdate(p: number, pass: boolean, params: BktParams, weight = 1): number {
  const { pSlip, pGuess, pLearn } = params;
  const posterior = pass
    ? (p * (1 - pSlip)) / (p * (1 - pSlip) + (1 - p) * pGuess)
    : (p * pSlip) / (p * pSlip + (1 - p) * (1 - pGuess));
  const blended = p + weight * (posterior - p);
  const learned = blended + (1 - blended) * pLearn * weight;
  return Math.min(0.999, Math.max(0.001, learned));
}

/** Probability the learner passes the next observation of this skill. */
export function passProbability(p: number, params: BktParams): number {
  return p * (1 - params.pSlip) + (1 - p) * params.pGuess;
}

function emptySkill(skill: SkillId, params: ParamSet): SkillState {
  return { p: params[skill].pInit, observations: 0, independent: 0, assisted: 0, independentPasses: 0, recent: [], evidenceAttemptIds: [], lastSeen: 0 };
}

export function emptyState(params: ParamSet = PARAMS): LearnerState {
  return {
    modelId: LEARNER_MODEL_ID,
    modelVersion: LEARNER_MODEL_VERSION,
    skills: Object.fromEntries(SKILLS.map((k) => [k, emptySkill(k, params)])) as Record<SkillId, SkillState>,
    lessons: {},
    attemptsUsed: 0,
  };
}

/** Replay every attempt in time order. Pure: same attempts give the same state. */
export function buildLearnerState(attempts: AttemptRecord[], lessons: LessonInfo[], params: ParamSet = PARAMS): LearnerState {
  const state = emptyState(params);
  const byId = new Map(lessons.map((l) => [l.id, l]));
  const sorted = [...attempts].sort((a, b) => a.createdAt - b.createdAt);
  for (const a of sorted) {
    const lesson = byId.get(a.activityId);
    // Only real tries count: teacher notes, records without checker facts and tries where
    // nothing was played (the coach marks those "insufficient") are skipped.
    if (!lesson || !a.summary || a.coach?.focus === 'insufficient') continue;
    const prog = (state.lessons[a.activityId] ??= { attempts: 0, passed: false, independentPassed: false });
    prog.attempts += 1;
    if (a.passed) prog.passed = true;
    if (a.passed && a.kind === 'independent') prog.independentPassed = true;

    const weight = evidenceWeight(a);
    if (weight <= 0) continue;
    const obs = observationsFrom(a, lesson);
    if (obs.length) state.attemptsUsed += 1;
    for (const o of obs) {
      const sk = state.skills[o.skill];
      sk.p = bktUpdate(sk.p, o.pass, params[o.skill], weight);
      sk.observations += 1;
      if (a.kind === 'independent') {
        sk.independent += 1;
        if (o.pass) sk.independentPasses += 1;
      } else sk.assisted += 1;
      sk.recent = [...sk.recent, o.pass].slice(-RECENT);
      sk.evidenceAttemptIds = [...sk.evidenceAttemptIds, a.id].slice(-EVIDENCE_CAP);
      sk.lastSeen = a.createdAt;
    }
  }
  return state;
}

/** A word for the estimate. "secure" needs at least one independent pass (assisted ≠ independent). */
export function band(sk: SkillState): Band {
  if (sk.observations < THRESHOLDS.minObservations) return 'new';
  if (sk.p >= THRESHOLDS.secure && sk.independentPasses > 0) return 'secure';
  if (sk.p >= THRESHOLDS.nearly) return 'nearly';
  return 'growing';
}

/** True when the estimate is low enough that practising this skill is the better next step. */
export function needsPractice(sk: SkillState): boolean {
  return sk.observations >= THRESHOLDS.minObservations && sk.p < THRESHOLDS.nearly;
}

export function recentFails(sk: SkillState): number {
  return sk.recent.filter((r) => !r).length;
}

export function recentPasses(sk: SkillState): number {
  return sk.recent.filter((r) => r).length;
}
