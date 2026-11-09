// On-device self-check for the timing model: runs the shipped model and the fixed
// rules on the same held-out synthetic set used by `npm run train`, in this browser,
// and times each inference. Synthetic data only — never learner data.

import { buildDataset } from './synth.ts';
import { runModel } from './model.ts';
import { rulesPattern } from './rules.ts';

export interface SelfCheck {
  samples: number;
  modelAgree: number; // share of confident answers that match the true pattern
  abstainRate: number;
  rulesAgree: number;
  /** Average time per answer, from timing the whole batch (browser clocks are too coarse for one call). */
  perAnswerMs: number;
  status: 'ok' | 'unavailable';
}

const SEED = 20261109; // same seed and test families as tools/train.ts

export function runSelfCheck(n = 600): SelfCheck {
  const test = buildDataset(SEED, 20_000, 20, Math.ceil(n / 20)).slice(0, n);
  let answered = 0;
  let agree = 0;
  let abstain = 0;
  let rules = 0;
  for (const s of test) {
    const r = runModel(s.evidence);
    if (r.status === 'unavailable') return { samples: 0, modelAgree: 0, abstainRate: 0, rulesAgree: 0, perAnswerMs: 0, status: 'unavailable' };
    if (r.status === 'ok') {
      answered++;
      if (r.pattern === s.label) agree++;
    } else abstain++;
    if (rulesPattern(s.evidence) === s.label) rules++;
  }
  const t0 = performance.now();
  for (let k = 0; k < 5; k++) for (const s of test) runModel(s.evidence);
  const perAnswerMs = (performance.now() - t0) / (5 * test.length);
  return {
    samples: test.length,
    modelAgree: answered ? agree / answered : 0,
    abstainRate: abstain / test.length,
    rulesAgree: rules / test.length,
    perAnswerMs,
    status: 'ok',
  };
}
