// Fits the learner model's four settings per skill (start, learn, slip, guess) by maximum
// likelihood: the settings that best predict each next pass or fail in a set of attempt logs.
// Today it is run on SIMULATED learners (`npm run fit:learner`), so it can only learn the
// simulation's assumptions. The same code can be re-run on real, consented practice data later.

import type { AttemptRecord } from '../store/db.ts';
import {
  type BktParams,
  type LessonInfo,
  type ParamSet,
  type SkillId,
  SKILLS,
  bktUpdate,
  evidenceWeight,
  observationsFrom,
  passProbability,
} from './learner.ts';

export interface Obs {
  pass: boolean;
  weight: number;
}

/** Per skill, one observation sequence per learner, in time order, using the model's own rules. */
export function observationSequences(learners: AttemptRecord[][], infos: LessonInfo[]): Record<SkillId, Obs[][]> {
  const byId = new Map(infos.map((l) => [l.id, l]));
  const out = Object.fromEntries(SKILLS.map((k) => [k, [] as Obs[][]])) as Record<SkillId, Obs[][]>;
  for (const attempts of learners) {
    const seq = Object.fromEntries(SKILLS.map((k) => [k, [] as Obs[]])) as Record<SkillId, Obs[]>;
    for (const a of [...attempts].sort((x, y) => x.createdAt - y.createdAt)) {
      const lesson = byId.get(a.activityId);
      if (!lesson || !a.summary || a.coach?.focus === 'insufficient') continue;
      const weight = evidenceWeight(a);
      if (weight <= 0) continue;
      for (const o of observationsFrom(a, lesson)) seq[o.skill].push({ pass: o.pass, weight });
    }
    for (const k of SKILLS) if (seq[k].length) out[k].push(seq[k]);
  }
  return out;
}

/** Weighted log-likelihood of the sequences: each observation predicted before it is seen. */
export function logLikelihood(seqs: Obs[][], params: BktParams): number {
  let ll = 0;
  for (const seq of seqs) {
    let p = params.pInit;
    for (const o of seq) {
      const pp = Math.min(0.999, Math.max(0.001, passProbability(p, params)));
      ll += o.weight * Math.log(o.pass ? pp : 1 - pp);
      p = bktUpdate(p, o.pass, params, o.weight);
    }
  }
  return ll;
}

// Usual BKT limits so "knowing it" can never mean "more likely to fail" (slip and guess below 0.5).
const LIMITS: Record<keyof BktParams, [number, number]> = {
  pInit: [0.01, 0.95],
  pLearn: [0.01, 0.5],
  pSlip: [0.01, 0.3],
  pGuess: [0.01, 0.4],
};
const KEYS = Object.keys(LIMITS) as (keyof BktParams)[];

/** Coordinate search on a 0.01 grid, a few sweeps. Deterministic. */
export function fitSkill(seqs: Obs[][], start: BktParams, sweeps = 6): BktParams {
  let best = { ...start };
  let bestLL = logLikelihood(seqs, best);
  for (let s = 0; s < sweeps; s++) {
    let improved = false;
    for (const key of KEYS) {
      const [lo, hi] = LIMITS[key];
      for (let v = lo; v <= hi + 1e-9; v += 0.01) {
        const cand = { ...best, [key]: Math.round(v * 100) / 100 };
        const ll = logLikelihood(seqs, cand);
        if (ll > bestLL + 1e-9) {
          best = cand;
          bestLL = ll;
          improved = true;
        }
      }
    }
    if (!improved) break;
  }
  return best;
}

export function fitAll(learners: AttemptRecord[][], infos: LessonInfo[], start: ParamSet): { params: ParamSet; observations: Record<SkillId, number> } {
  const seqs = observationSequences(learners, infos);
  const params = {} as ParamSet;
  const observations = {} as Record<SkillId, number>;
  for (const k of SKILLS) {
    observations[k] = seqs[k].reduce((a, s) => a + s.length, 0);
    params[k] = observations[k] > 0 ? fitSkill(seqs[k], start[k]) : start[k];
  }
  return { params, observations };
}
