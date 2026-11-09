import { describe, expect, it } from 'vitest';
import { LESSONS } from '../data/catalog.ts';
import { lessonInfos } from './bkt.ts';
import { runLearnerEval } from './learner.eval.ts';
import committed from '../../docs/learner-model-metrics.json';

const metrics = runLearnerEval(lessonInfos(LESSONS));

describe('learner model on simulated learners', () => {
  it('targets the weakest skill more often than the fixed route', () => {
    expect(metrics.model.targetsWeakest).toBeGreaterThan(metrics.rulesBaseline.targetsWeakest);
  });

  it('estimates skills better than the starting guess alone', () => {
    expect(metrics.model.calibrationMAE).toBeLessThan(metrics.priorOnly.calibrationMAE);
  });

  it('matches the committed metrics file (regenerate with npm run eval:learner)', () => {
    if (import.meta.env.VITE_WRITE_LEARNER_METRICS) {
      // tools/eval-learner.mjs reads this line and rewrites the metrics file.
      console.log(`LEARNER_METRICS_JSON:${JSON.stringify(metrics)}`);
      return;
    }
    expect(committed).toEqual(metrics);
  });
});
