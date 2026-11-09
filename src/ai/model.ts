// Loads and runs the on-device timing-pattern model. Fails closed: any problem means
// the coach falls back to reviewed rules and says so.

import modelFile from './model.weights.json';
import { type Pattern, PATTERNS, type TimingEvidence, extractFeatures, hasEnoughEvidence } from './features.ts';
import { type ModelFile, forward, validateModelFile } from './mlp.ts';

export interface ModelResult {
  status: 'ok' | 'abstain' | 'insufficient' | 'unavailable';
  pattern?: Pattern;
  confidence?: number;
  probs?: Record<Pattern, number>;
  modelId?: string;
  modelVersion?: string;
  latencyMs?: number;
}

let cached: ModelFile | null | undefined;

export function loadModel(): ModelFile | null {
  if (cached !== undefined) return cached;
  cached = validateModelFile(modelFile) && modelFile.classes.join() === PATTERNS.join() ? (modelFile as ModelFile) : null;
  return cached;
}

/** For tests: inject a model (or null to simulate a failed load). */
export function setModelForTesting(m: ModelFile | null | undefined): void {
  cached = m;
}

export function runModel(ev: TimingEvidence): ModelResult {
  const m = loadModel();
  if (!m) return { status: 'unavailable' };
  if (!hasEnoughEvidence(ev)) return { status: 'insufficient', modelId: m.modelId, modelVersion: m.version };
  const t0 = performance.now();
  const { probs } = forward(m.weights, extractFeatures(ev));
  const latencyMs = performance.now() - t0;
  if (!probs.every(Number.isFinite)) return { status: 'unavailable' };
  const top = probs.indexOf(Math.max(...probs));
  const record = Object.fromEntries(PATTERNS.map((p, i) => [p, probs[i]])) as Record<Pattern, number>;
  const base = { modelId: m.modelId, modelVersion: m.version, latencyMs, probs: record, confidence: probs[top] };
  if (probs[top] < m.abstainBelow) return { status: 'abstain', ...base };
  return { status: 'ok', pattern: PATTERNS[top], ...base };
}
