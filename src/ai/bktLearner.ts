// Live local learner model for Carmen's learner plug-in point (src/ai/learner.ts).
//
// Bayesian Knowledge Tracing (BKT) per skill: after every try it updates how likely it is that
// the child has each skill, from the checker's facts only. Tries with more help count for less,
// and "secure" still needs a pass on their own (the status rules match the built-in tracker).
// Settings come from src/data/bkt-params.json (fitted to simulated learners only; see
// docs/LEARNER_MODEL_CARD.md). It runs on this device; nothing is sent anywhere.
// If it ever throws or returns nonsense, estimateSkills() falls back to the built-in tracker.

import params from '../data/bkt-params.json';
import {
  type AttemptEvidence,
  type LearnerModel,
  type SkillEstimate,
  type SkillId,
  type SkillStatus,
  SKILLS,
  observe,
  registerLearnerModel,
} from './learner.ts';

export interface BktParams {
  pInit: number;
  pLearn: number;
  pSlip: number;
  pGuess: number;
}

const SKILL_PARAMS = params.skills as Partial<Record<SkillId, BktParams>>;
const PASS_IF = params.passIf as Record<'onset' | 'pitch' | 'rest' | 'duration', number>;

/** One BKT step: posterior from the observation, blended by the evidence weight, then the learning step. */
export function bktUpdate(p: number, pass: boolean, k: BktParams, weight = 1): number {
  const posterior = pass ? (p * (1 - k.pSlip)) / (p * (1 - k.pSlip) + (1 - p) * k.pGuess) : (p * k.pSlip) / (p * k.pSlip + (1 - p) * (1 - k.pGuess));
  const blended = p + weight * (posterior - p);
  const learned = blended + (1 - blended) * k.pLearn * weight;
  return Math.min(0.999, Math.max(0.001, learned));
}

/** How much a try counts: on their own fully, practice less, practice with the answer shown least. */
export function evidenceWeight(a: AttemptEvidence): number {
  if (a.kind === 'independent' || a.kind === 'mission-check') return params.weights.independent;
  if (a.hintLevel >= 3) return params.weights.answerHint;
  return params.weights.practice;
}

function statusOf(level: number, evidence: number, independent: boolean): SkillStatus {
  if (evidence === 0) return 'not-yet';
  if (level >= 0.8 && independent) return 'secure';
  if (level >= 0.5) return 'growing';
  return 'starting';
}

export const bktLearner: LearnerModel = {
  id: 'carmen-learner-bkt',
  version: '1.0.0',
  kind: 'live',
  estimate(attempts: AttemptEvidence[]): SkillEstimate[] {
    const sorted = [...attempts].sort((x, y) => x.createdAt - y.createdAt);
    return SKILLS.map((skill) => {
      const mine = sorted.filter((a) => skill.lessons.includes(a.activityId));
      const independent = mine.some((a) => (a.kind === 'independent' || a.kind === 'mission-check') && a.passed);
      const lastAt = mine.at(-1)?.createdAt;

      // Open tasks (explore, create): taking part is the evidence, never judged — same as the built-in tracker.
      if (skill.evidence === 'any') {
        return mine.length
          ? { skill: skill.id, level: 1, evidence: mine.length, independent: true, status: 'secure' as const, lastAt }
          : { skill: skill.id, level: 0, evidence: 0, independent: false, status: 'not-yet' as const };
      }

      const k = SKILL_PARAMS[skill.id];
      if (!k) throw new Error(`No BKT settings for skill ${skill.id}`);
      let p = k.pInit;
      let evidence = 0;
      for (const a of mine) {
        const o = observe(skill, a);
        if (o === null) continue;
        p = bktUpdate(p, o >= PASS_IF[skill.evidence] - 1e-9, k, evidenceWeight(a));
        evidence++;
      }
      return { skill: skill.id, level: p, evidence, independent, status: statusOf(p, evidence, independent), lastAt };
    });
  },
};

/** Plug the BKT model in when the AI is on; the built-in tracker when it is off. */
export function syncLearnerModel(aiEnabled: boolean): void {
  registerLearnerModel(aiEnabled ? bktLearner : null);
}
