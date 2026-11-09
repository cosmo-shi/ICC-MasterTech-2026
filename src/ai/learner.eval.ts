// Seeded evaluation of the learner model on SIMULATED learners (no child data).
// Each simulated learner has hidden skill levels; they practise random lessons, the checker-style
// summary is generated from those hidden levels, and we ask:
//   1. does the next suggestion train the learner's truly weakest skill? (model vs the fixed route)
//   2. how close is the model's predicted pass chance to the hidden level? (model vs prior only)
//   3. how well does it predict each next pass/fail? (log-likelihood per observation)
// The settings are compared two ways: the reviewed starting values and the values fitted by
// `npm run fit:learner` on a DIFFERENT group of simulated learners (seed 1 vs the test seed).
// This shows the software behaves as designed. It says nothing about real children's learning.

import type { CheckSummary } from '../engine/checker.ts';
import type { AttemptRecord } from '../store/db.ts';
import {
  type LessonInfo,
  type ParamSet,
  PARAMS,
  STARTING_PARAMS,
  type SkillId,
  SKILLS,
  buildLearnerState,
  passProbability,
} from './learner.ts';
import { logLikelihood, observationSequences } from './learner.fit.ts';
import { mulberry32 } from './synth.ts';
import { planNext, rulesPlan, type TailorContext } from './tailor.ts';

export const SIM_ROUTE = ['L01', 'L02', 'L03', 'L04', 'L05', 'L06', 'L07', 'L08'];
export const TEST_SEED = 20261109;
export const TRAIN_SEED = 1;

export interface SimLearner {
  attempts: AttemptRecord[];
  /** Hidden skill levels at the end of practice (chance of passing that skill's check). */
  hidden: Record<SkillId, number>;
}

/** Simulated learners: hidden skills, random lessons, checker-style summaries. */
export function simulateLearners(infos: LessonInfo[], seed: number, learners: number, attemptsPerLearner: number): SimLearner[] {
  const rand = mulberry32(seed);
  const scored = infos.filter((l) => SIM_ROUTE.includes(l.id));
  const out: SimLearner[] = [];
  for (let n = 0; n < learners; n++) {
    const hidden = Object.fromEntries(SKILLS.map((k) => [k, 0.2 + 0.75 * rand()])) as Record<SkillId, number>;
    const attempts: AttemptRecord[] = [];
    for (let t = 0; t < attemptsPerLearner; t++) {
      const lesson = scored[Math.floor(rand() * scored.length)];
      const has = (k: SkillId) => lesson.skills.includes(k);
      const p = (ks: SkillId[]) => ks.filter(has).reduce((acc, k) => acc * hidden[k], 1);
      const timingOk = rand() < p(['pulse', 'subdivision']);
      const pitchOk = rand() < p(['pitch', 'reading']);
      const restsOk = rand() < (has('rests') ? hidden.rests : 1);
      const durationOk = rand() < (has('duration') ? hidden.duration : 1);
      const summary: CheckSummary = {
        expected: 8,
        correctSound: pitchOk ? 8 : 6,
        wrong: pitchOk ? 0 : 2,
        missed: 0,
        extra: restsOk ? 0 : 1,
        restViolations: restsOk ? 0 : 1,
        early: 0,
        onTime: timingOk ? 8 : 4,
        late: timingOk ? 0 : 4,
        durationOk: durationOk ? 8 : 6,
        durationIssues: durationOk ? 0 : 2,
      };
      const independent = rand() < 0.2;
      attempts.push({
        id: `sim${seed}-${n}-${t}`,
        createdAt: t + 1,
        activityId: lesson.id,
        activityVersion: 'sim',
        kind: independent ? 'independent' : 'practice',
        instrument: 'keyboard',
        tempoBpm: 80,
        support: { hintLevel: independent ? 0 : Math.floor(rand() * 4), heardExample: rand() < 0.3, largeControls: false, simplified: false, aiEnabled: true, slower: rand() < 0.2 },
        inputs: [],
        summary,
        passed: timingOk && pitchOk && restsOk && durationOk,
      });
      // Practice helps a little.
      for (const k of lesson.skills) hidden[k] = Math.min(0.98, hidden[k] + 0.02 * (1 - hidden[k]));
    }
    out.push({ attempts, hidden });
  }
  return out;
}

export interface ParamResult {
  targetsWeakest: number;
  calibrationMAE: number;
  logLikelihoodPerObservation: number;
}

export interface LearnerEvalMetrics {
  testSeed: number;
  trainSeed: number;
  learners: number;
  attemptsPerLearner: number;
  model: ParamResult; // settings in use (fitted)
  startingSettings: ParamResult; // reviewed hand values, for comparison
  rulesBaseline: { targetsWeakest: number };
  priorOnly: { calibrationMAE: number };
  note: string;
}

const r3 = (x: number) => Math.round(x * 1000) / 1000;

function evaluate(sim: SimLearner[], infos: LessonInfo[], params: ParamSet) {
  let hits = 0;
  let rulesHits = 0;
  let cases = 0;
  let err = 0;
  let priorErr = 0;
  let cal = 0;
  for (const { attempts, hidden } of sim) {
    const state = buildLearnerState(attempts, infos, params);
    const observed = SKILLS.filter((k) => state.skills[k].observations >= 2);
    if (!observed.length) continue;
    for (const k of observed) {
      err += Math.abs(passProbability(state.skills[k].p, params[k]) - hidden[k]);
      priorErr += Math.abs(passProbability(params[k].pInit, params[k]) - hidden[k]);
      cal += 1;
    }
    const weakest = observed.reduce((a, b) => (hidden[a] <= hidden[b] ? a : b));
    const ctx: TailorContext = { infos, route: SIM_ROUTE, aiEnabled: true, currentLessonId: attempts.at(-1)!.activityId };
    const trains = (id?: string) => !!id && !!infos.find((l) => l.id === id)?.skills.includes(weakest);
    if (trains(planNext(state, ctx).next?.lessonId)) hits += 1;
    if (trains(rulesPlan(state, ctx).next?.lessonId)) rulesHits += 1;
    cases += 1;
  }
  const seqs = observationSequences(sim.map((s) => s.attempts), infos);
  let ll = 0;
  let obs = 0;
  for (const k of SKILLS) {
    ll += logLikelihood(seqs[k], params[k]);
    obs += seqs[k].reduce((a, seq) => a + seq.length, 0);
  }
  return {
    result: { targetsWeakest: r3(hits / cases), calibrationMAE: r3(err / cal), logLikelihoodPerObservation: r3(ll / obs) },
    rulesTargets: r3(rulesHits / cases),
    priorMAE: r3(priorErr / cal),
  };
}

export function runLearnerEval(infos: LessonInfo[], learners = 400, attemptsPerLearner = 16): LearnerEvalMetrics {
  const sim = simulateLearners(infos, TEST_SEED, learners, attemptsPerLearner);
  const fitted = evaluate(sim, infos, PARAMS);
  const starting = evaluate(sim, infos, STARTING_PARAMS);
  return {
    testSeed: TEST_SEED,
    trainSeed: TRAIN_SEED,
    learners,
    attemptsPerLearner,
    model: fitted.result,
    startingSettings: starting.result,
    rulesBaseline: { targetsWeakest: fitted.rulesTargets },
    priorOnly: { calibrationMAE: starting.priorMAE },
    note: 'Simulated learners only. Settings fitted to simulated learners (train seed), tested on a different group (test seed). Shows the software works as designed; not evidence about children or learning.',
  };
}
