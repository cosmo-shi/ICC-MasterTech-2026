// Seeded evaluation of the learner model on SIMULATED learners (no child data).
// Each simulated learner has hidden skill levels; they practise random lessons, the checker-style
// summary is generated from those hidden levels, and we ask:
//   1. does the next suggestion train the learner's truly weakest skill? (model vs the fixed route)
//   2. how close is the model's predicted pass chance to the hidden level? (model vs prior only)
// This shows the software behaves as designed. It says nothing about real children's learning.

import type { CheckSummary } from '../engine/checker.ts';
import type { AttemptRecord } from '../store/db.ts';
import { type LessonInfo, type SkillId, SKILLS, buildLearnerState, paramsFor, passProbability } from './learner.ts';
import { mulberry32 } from './synth.ts';
import { planNext, rulesPlan, type TailorContext } from './tailor.ts';

export interface LearnerEvalMetrics {
  seed: number;
  learners: number;
  attemptsPerLearner: number;
  model: { targetsWeakest: number; calibrationMAE: number };
  rulesBaseline: { targetsWeakest: number };
  priorOnly: { calibrationMAE: number };
  note: string;
}

const ROUTE = ['L01', 'L02', 'L03', 'L04', 'L05', 'L06', 'L07', 'L08'];

export function runLearnerEval(infos: LessonInfo[], seed = 20261109, learners = 400, attemptsPerLearner = 16): LearnerEvalMetrics {
  const rand = mulberry32(seed);
  const scored = infos.filter((l) => ROUTE.includes(l.id));
  let modelHits = 0;
  let rulesHits = 0;
  let cases = 0;
  let modelErr = 0;
  let priorErr = 0;
  let calCount = 0;

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
        id: `sim${n}-${t}`,
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

    const state = buildLearnerState(attempts, infos);
    const observed = SKILLS.filter((k) => state.skills[k].observations >= 2);
    if (!observed.length) continue;

    for (const k of observed) {
      modelErr += Math.abs(passProbability(state.skills[k].p, paramsFor(k)) - hidden[k]);
      priorErr += Math.abs(passProbability(paramsFor(k).pInit, paramsFor(k)) - hidden[k]);
      calCount += 1;
    }

    const weakest = observed.reduce((a, b) => (hidden[a] <= hidden[b] ? a : b));
    const ctx: TailorContext = { infos, route: ROUTE, aiEnabled: true, currentLessonId: attempts.at(-1)!.activityId };
    const trains = (lessonId?: string) => !!lessonId && !!infos.find((l) => l.id === lessonId)?.skills.includes(weakest);
    if (trains(planNext(state, ctx).next?.lessonId)) modelHits += 1;
    if (trains(rulesPlan(state, ctx).next?.lessonId)) rulesHits += 1;
    cases += 1;
  }

  const r3 = (x: number) => Math.round(x * 1000) / 1000;
  return {
    seed,
    learners,
    attemptsPerLearner,
    model: { targetsWeakest: r3(modelHits / cases), calibrationMAE: r3(modelErr / calCount) },
    rulesBaseline: { targetsWeakest: r3(rulesHits / cases) },
    priorOnly: { calibrationMAE: r3(priorErr / calCount) },
    note: 'Simulated learners only. Shows the software works as designed; not evidence about children or learning.',
  };
}
