import { describe, expect, it } from 'vitest';
import { LESSONS } from '../data/catalog.ts';
import { PARAMS, STARTING_PARAMS, SKILLS, lessonInfos } from './bkt.ts';
import { fitAll, logLikelihood, observationSequences } from './learner.fit.ts';
import { TEST_SEED, TRAIN_SEED, simulateLearners } from './learner.eval.ts';

const infos = lessonInfos(LESSONS);
const TRAIN = { learners: 800, attempts: 16 };

describe('fitting the learner model', () => {
  const train = simulateLearners(infos, TRAIN_SEED, TRAIN.learners, TRAIN.attempts).map((s) => s.attempts);
  const fit = fitAll(train, infos, STARTING_PARAMS);

  it('the settings in skills.json are exactly what a fresh fit gives (regenerate with npm run fit:learner)', () => {
    if (import.meta.env.VITE_FIT_LEARNER) {
      // tools/fit-learner.mjs reads this line and writes the settings into skills.json.
      console.log(`LEARNER_FIT_JSON:${JSON.stringify({ trainSeed: TRAIN_SEED, ...TRAIN, ...fit })}`);
      return;
    }
    expect(PARAMS).toEqual(fit.params);
  });

  it('fitted settings predict a different group of learners better than the starting values', () => {
    const test = observationSequences(simulateLearners(infos, TEST_SEED, 400, 16).map((s) => s.attempts), infos);
    for (const k of SKILLS) {
      expect(logLikelihood(test[k], fit.params[k])).toBeGreaterThanOrEqual(logLikelihood(test[k], STARTING_PARAMS[k]));
    }
  });

  it('keeps every setting inside the usual limits', () => {
    for (const k of SKILLS) {
      const p = fit.params[k];
      expect(p.pSlip).toBeLessThanOrEqual(0.3);
      expect(p.pGuess).toBeLessThanOrEqual(0.4);
      expect(p.pLearn).toBeGreaterThan(0);
    }
  });
});
