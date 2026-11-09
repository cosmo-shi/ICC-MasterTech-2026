// Reviewed rules baseline for the same task. Used when AI is off, the model fails or abstains,
// and as the comparison the model must beat. Shown to learners as "Coach tips", never as AI.

import { type Pattern, type TimingEvidence, hasEnoughEvidence } from './features.ts';

function mean(xs: number[]): number {
  return xs.reduce((s, x) => s + x, 0) / xs.length;
}

export function rulesPattern(ev: TimingEvidence): Pattern | 'insufficient' {
  if (!hasEnoughEvidence(ev)) return 'insufficient';
  const r = ev.residuals;
  const p = ev.positions;
  const mx = mean(p);
  const my = mean(r);
  let num = 0;
  let den = 0;
  for (let i = 0; i < r.length; i++) {
    num += (p[i] - mx) * (r[i] - my);
    den += (p[i] - mx) ** 2;
  }
  const slope = den > 1e-12 ? num / den : 0;
  const drift = slope * Math.max(1, p[p.length - 1] - p[0]);
  const detrended = r.map((v, i) => v - (my + slope * (p[i] - mx)));
  const sd = Math.sqrt(mean(detrended.map((d) => d * d)));
  if (sd > 0.11) return 'uneven';
  if (drift < -0.18) return 'speedingUp';
  if (drift > 0.18) return 'slowingDown';
  if (my < -0.09) return 'early';
  if (my > 0.09) return 'late';
  return 'steady';
}
