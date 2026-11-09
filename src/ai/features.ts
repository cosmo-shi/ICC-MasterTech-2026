// Feature extraction for the on-device timing-pattern model.
// Input is only musical timing evidence from the checker: no identity, time of day, age or location.

export const PATTERNS = ['steady', 'early', 'late', 'speedingUp', 'slowingDown', 'uneven'] as const;
export type Pattern = (typeof PATTERNS)[number];
export const FEATURE_COUNT = 12;
export const FEATURE_SCHEMA_VERSION = '1.0.0';

export interface TimingEvidence {
  /** Signed onset residual in beats for each matched expected event, in order. */
  residuals: number[];
  /** Expected onset of each matched event, in beats. */
  positions: number[];
  /** Number of expected sounding events in the task. */
  expectedCount: number;
}

function mean(xs: number[]): number {
  return xs.reduce((s, x) => s + x, 0) / xs.length;
}

function median(xs: number[]): number {
  const s = [...xs].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
}

function std(xs: number[]): number {
  const mu = mean(xs);
  return Math.sqrt(mean(xs.map((x) => (x - mu) ** 2)));
}

/** Least-squares slope and intercept of y on x. */
function linfit(x: number[], y: number[]): { slope: number; intercept: number } {
  const mx = mean(x);
  const my = mean(y);
  let num = 0;
  let den = 0;
  for (let i = 0; i < x.length; i++) {
    num += (x[i] - mx) * (y[i] - my);
    den += (x[i] - mx) ** 2;
  }
  const slope = den > 1e-12 ? num / den : 0;
  return { slope, intercept: my - slope * mx };
}

export function hasEnoughEvidence(ev: TimingEvidence): boolean {
  return ev.residuals.length >= 3;
}

/** 12 roughly unit-scaled features. Requires at least 3 matched events. */
export function extractFeatures(ev: TimingEvidence): number[] {
  const r = ev.residuals;
  const p = ev.positions;
  const n = r.length;
  const span = Math.max(1, p[n - 1] - p[0]);
  const { slope, intercept } = linfit(p, r);
  const drift = slope * span; // total change in residual across the phrase, in beats
  const detrended = r.map((v, i) => v - (intercept + slope * p[i]));
  const half = Math.floor(n / 2);
  const firstHalf = mean(r.slice(0, Math.max(1, half)));
  const secondHalf = mean(r.slice(half));
  const ioiRatios: number[] = [];
  for (let i = 1; i < n; i++) {
    const expIoi = p[i] - p[i - 1];
    if (expIoi > 0) ioiRatios.push((expIoi + r[i] - r[i - 1]) / expIoi);
  }
  const ioiCv = ioiRatios.length > 1 ? std(ioiRatios) / Math.max(0.1, Math.abs(mean(ioiRatios))) : 0;
  return [
    mean(r) / 0.3,
    median(r) / 0.3,
    std(r) / 0.2,
    drift / 0.5,
    mean(r.map(Math.abs)) / 0.3,
    r.filter((v) => v < -0.1).length / n,
    r.filter((v) => v > 0.1).length / n,
    (secondHalf - firstHalf) / 0.4,
    Math.min(ioiCv, 2) / 0.5,
    std(detrended) / 0.2,
    n / Math.max(1, ev.expectedCount),
    Math.log(n) / Math.log(16),
  ];
}
