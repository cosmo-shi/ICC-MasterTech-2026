// Seeded synthetic attempt generator for training and evaluating the timing-pattern model.
// Labels are the generating process, not a rule. No child data is used.
// Rhythm templates are split into disjoint families for train / validation / test so the
// test set uses rhythms and tempo ranges the model has not seen.

import { PATTERNS, type Pattern, type TimingEvidence } from './features.ts';

export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function gaussian(rand: () => number): number {
  const u = Math.max(rand(), 1e-12);
  const v = rand();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

function uniform(rand: () => number, lo: number, hi: number): number {
  return lo + (hi - lo) * rand();
}

/** A rhythm template: expected onsets in beats. */
export function makeTemplate(rand: () => number): number[] {
  const iois = [0.5, 1, 1, 1, 2, 1.5];
  const totalBeats = [4, 8, 8, 12][Math.floor(rand() * 4)];
  const onsets: number[] = [];
  let t = 0;
  while (t < totalBeats) {
    onsets.push(t);
    t += iois[Math.floor(rand() * iois.length)];
  }
  return onsets;
}

export interface SynthSample {
  evidence: TimingEvidence;
  label: Pattern;
  family: number;
}

export function synthAttempt(rand: () => number, onsets: number[], label: Pattern): TimingEvidence {
  const L = Math.max(1, onsets[onsets.length - 1] - onsets[0]);
  const jitter = uniform(rand, 0.015, 0.075);
  let residuals = onsets.map(() => gaussian(rand) * jitter);
  switch (label) {
    case 'steady':
      break;
    case 'early': {
      const o = uniform(rand, 0.08, 0.32);
      residuals = residuals.map((r) => r - o);
      break;
    }
    case 'late': {
      const o = uniform(rand, 0.08, 0.32);
      residuals = residuals.map((r) => r + o);
      break;
    }
    case 'speedingUp':
    case 'slowingDown': {
      const d = uniform(rand, 0.18, 0.65) * (label === 'speedingUp' ? -1 : 1);
      const curve = uniform(rand, 1, 2); // linear to accelerating drift
      const start = uniform(rand, -0.06, 0.06);
      residuals = residuals.map((r, i) => r + start + d * ((onsets[i] - onsets[0]) / L) ** curve);
      break;
    }
    case 'uneven': {
      const sd = uniform(rand, 0.11, 0.26);
      residuals = residuals.map(() => gaussian(rand) * sd);
      break;
    }
  }
  // Missed notes remove evidence (0-25%), keeping at least 3.
  const dropRate = uniform(rand, 0, 0.25);
  const keep = onsets.map(() => rand() >= dropRate);
  const idx = onsets.map((_, i) => i).filter((i) => keep[i]);
  const use = idx.length >= 3 ? idx : onsets.map((_, i) => i);
  return { residuals: use.map((i) => residuals[i]), positions: use.map((i) => onsets[i]), expectedCount: onsets.length };
}

/**
 * Build a dataset from `families` disjoint rhythm templates. `familyOffset` keeps splits disjoint:
 * each family seed is derived from (baseSeed, familyOffset + k).
 */
export function buildDataset(baseSeed: number, familyOffset: number, families: number, perFamily: number): SynthSample[] {
  const out: SynthSample[] = [];
  for (let k = 0; k < families; k++) {
    const fam = familyOffset + k;
    const fr = mulberry32(baseSeed * 100003 + fam * 7919);
    let onsets = makeTemplate(fr);
    while (onsets.length < 4) onsets = makeTemplate(fr);
    for (let s = 0; s < perFamily; s++) {
      const label = PATTERNS[(s + k) % PATTERNS.length];
      out.push({ evidence: synthAttempt(fr, onsets, label), label, family: fam });
    }
  }
  return out;
}
