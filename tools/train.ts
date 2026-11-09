// Trains the on-device timing-pattern MLP on seeded synthetic attempts and evaluates it
// against the rules baseline on held-out rhythm families. Run: npm run train
// Writes src/ai/model.weights.json and docs/model-metrics.json. Never hand-edit those numbers.

import { createHash } from 'node:crypto';
import { writeFileSync } from 'node:fs';
import { performance } from 'node:perf_hooks';
import { FEATURE_COUNT, FEATURE_SCHEMA_VERSION, PATTERNS, extractFeatures } from '../src/ai/features.ts';
import { type MlpWeights, type ModelFile, forward } from '../src/ai/mlp.ts';
import { rulesPattern } from '../src/ai/rules.ts';
import { buildDataset, gaussian, mulberry32, type SynthSample } from '../src/ai/synth.ts';

const SEED = 20261109;
const HIDDEN = 16;
const EPOCHS = 40;
const BATCH = 64;
const LR = 0.01;
const ABSTAIN_BELOW = 0.5;

// Disjoint rhythm families per split.
const train = buildDataset(SEED, 0, 400, 30); // 12,000
const val = buildDataset(SEED, 10_000, 100, 30); // 3,000
const test = buildDataset(SEED, 20_000, 100, 30); // 3,000

const toXY = (d: SynthSample[]) => ({ X: d.map((s) => extractFeatures(s.evidence)), Y: d.map((s) => PATTERNS.indexOf(s.label)) });
const tr = toXY(train);
const va = toXY(val);
const te = toXY(test);

const rand = mulberry32(SEED);
const init = (n: number, fanIn: number) => Array.from({ length: n }, () => gaussian(rand) * Math.sqrt(1 / fanIn));
const C = PATTERNS.length;
const w: MlpWeights = {
  inputSize: FEATURE_COUNT,
  hiddenSize: HIDDEN,
  outputSize: C,
  w1: init(HIDDEN * FEATURE_COUNT, FEATURE_COUNT),
  b1: new Array(HIDDEN).fill(0),
  w2: init(C * HIDDEN, HIDDEN),
  b2: new Array(C).fill(0),
};

// Adam state
const params = ['w1', 'b1', 'w2', 'b2'] as const;
const m: Record<string, number[]> = {};
const v: Record<string, number[]> = {};
for (const p of params) {
  m[p] = new Array(w[p].length).fill(0);
  v[p] = new Array(w[p].length).fill(0);
}
let step = 0;

function trainBatch(idx: number[]) {
  const g: Record<string, number[]> = {};
  for (const p of params) g[p] = new Array(w[p].length).fill(0);
  for (const k of idx) {
    const x = tr.X[k];
    const y = tr.Y[k];
    const { hidden, probs } = forward(w, x);
    const dOut = probs.map((p, o) => p - (o === y ? 1 : 0));
    const dHidden = new Array(HIDDEN).fill(0);
    for (let o = 0; o < C; o++) {
      g.b2[o] += dOut[o];
      for (let h = 0; h < HIDDEN; h++) {
        g.w2[o * HIDDEN + h] += dOut[o] * hidden[h];
        dHidden[h] += dOut[o] * w.w2[o * HIDDEN + h];
      }
    }
    for (let h = 0; h < HIDDEN; h++) {
      const dz = dHidden[h] * (1 - hidden[h] ** 2);
      g.b1[h] += dz;
      for (let i = 0; i < FEATURE_COUNT; i++) g.w1[h * FEATURE_COUNT + i] += dz * x[i];
    }
  }
  step++;
  const b1 = 0.9;
  const b2 = 0.999;
  for (const p of params) {
    const arr = w[p];
    for (let i = 0; i < arr.length; i++) {
      const grad = g[p][i] / idx.length + (p.startsWith('w') ? 1e-4 * arr[i] : 0);
      m[p][i] = b1 * m[p][i] + (1 - b1) * grad;
      v[p][i] = b2 * v[p][i] + (1 - b2) * grad * grad;
      const mh = m[p][i] / (1 - b1 ** step);
      const vh = v[p][i] / (1 - b2 ** step);
      arr[i] -= (LR * mh) / (Math.sqrt(vh) + 1e-8);
    }
  }
}

function evaluate(X: number[][], Y: number[]) {
  let correct = 0;
  let loss = 0;
  for (let k = 0; k < X.length; k++) {
    const { probs } = forward(w, X[k]);
    loss -= Math.log(Math.max(probs[Y[k]], 1e-12));
    if (probs.indexOf(Math.max(...probs)) === Y[k]) correct++;
  }
  return { acc: correct / X.length, loss: loss / X.length };
}

const order = tr.X.map((_, i) => i);
const history: { epoch: number; trainLoss: number; valAcc: number }[] = [];
let best = { valAcc: -1, weights: JSON.stringify(w) };
for (let epoch = 1; epoch <= EPOCHS; epoch++) {
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  for (let s = 0; s < order.length; s += BATCH) trainBatch(order.slice(s, s + BATCH));
  const t = evaluate(tr.X, tr.Y);
  const va2 = evaluate(va.X, va.Y);
  history.push({ epoch, trainLoss: +t.loss.toFixed(4), valAcc: +va2.acc.toFixed(4) });
  if (va2.acc > best.valAcc) best = { valAcc: va2.acc, weights: JSON.stringify(w) };
}
Object.assign(w, JSON.parse(best.weights));

// ---- Held-out evaluation: model vs rules ----
function confusion() {
  return PATTERNS.map(() => new Array(C + 1).fill(0)); // last column = abstain
}
function macroF1(cm: number[][]) {
  const f1s = PATTERNS.map((_, c) => {
    const tp = cm[c][c];
    const fp = cm.reduce((s, row, r) => s + (r !== c ? row[c] : 0), 0);
    const fn = cm[c].reduce((s, x, k) => s + (k !== c ? x : 0), 0);
    const prec = tp + fp ? tp / (tp + fp) : 0;
    const rec = tp + fn ? tp / (tp + fn) : 0;
    return prec + rec ? (2 * prec * rec) / (prec + rec) : 0;
  });
  return f1s.reduce((a, b) => a + b, 0) / f1s.length;
}

const cmModel = confusion();
const cmRules = confusion();
let modelCorrect = 0;
let modelAbstain = 0;
let modelCorrectAnswered = 0;
let rulesCorrect = 0;
for (let k = 0; k < te.X.length; k++) {
  const y = te.Y[k];
  const { probs } = forward(w, te.X[k]);
  const top = probs.indexOf(Math.max(...probs));
  if (top === y) modelCorrect++;
  if (probs[top] < ABSTAIN_BELOW) {
    modelAbstain++;
    cmModel[y][C]++;
  } else {
    cmModel[y][top]++;
    if (top === y) modelCorrectAnswered++;
  }
  const rp = rulesPattern(test[k].evidence);
  const ri = rp === 'insufficient' ? C : PATTERNS.indexOf(rp);
  cmRules[y][ri]++;
  if (ri === y) rulesCorrect++;
}

// ---- Latency (Node, this machine) ----
const N_LAT = 20000;
const t0 = performance.now();
for (let k = 0; k < N_LAT; k++) forward(w, te.X[k % te.X.length]);
const perInferenceUs = ((performance.now() - t0) / N_LAT) * 1000;
const t1 = performance.now();
for (let k = 0; k < 2000; k++) extractFeatures(test[k % test.length].evidence);
const perFeatureUs = ((performance.now() - t1) / 2000) * 1000;

const weightsJson = JSON.stringify(w);
const sha256 = createHash('sha256').update(weightsJson).digest('hex');
const model: ModelFile = {
  modelId: 'carmen-timing-pattern-mlp',
  version: '1.0.0',
  sha256,
  featureSchemaVersion: FEATURE_SCHEMA_VERSION,
  classes: [...PATTERNS],
  abstainBelow: ABSTAIN_BELOW,
  weights: w,
  trainedAt: new Date().toISOString().slice(0, 10),
  seed: SEED,
};
writeFileSync(new URL('../src/ai/model.weights.json', import.meta.url), JSON.stringify(model));

const metrics = {
  modelId: model.modelId,
  version: model.version,
  sha256,
  seed: SEED,
  architecture: `MLP ${FEATURE_COUNT}-${HIDDEN}(tanh)-${C}(softmax)`,
  parameters: w.w1.length + w.b1.length + w.w2.length + w.b2.length,
  weightsBytes: Buffer.byteLength(JSON.stringify(model)),
  data: {
    generator: 'src/ai/synth.ts (seeded, synthetic)',
    split: 'disjoint rhythm families: train 0-399, validation 10000-10099, test 20000-20099',
    trainSamples: train.length,
    valSamples: val.length,
    testSamples: test.length,
  },
  training: { epochs: EPOCHS, batch: BATCH, learningRate: LR, optimiser: 'Adam', bestValAcc: +best.valAcc.toFixed(4), history },
  heldOut: {
    model: {
      top1Accuracy: +(modelCorrect / te.X.length).toFixed(4),
      abstainRate: +(modelAbstain / te.X.length).toFixed(4),
      accuracyWhenAnswering: +(modelCorrectAnswered / Math.max(1, te.X.length - modelAbstain)).toFixed(4),
      macroF1WithAbstainAsWrong: +macroF1(cmModel).toFixed(4),
      confusion: cmModel,
    },
    rulesBaseline: {
      accuracy: +(rulesCorrect / te.X.length).toFixed(4),
      macroF1: +macroF1(cmRules).toFixed(4),
      confusion: cmRules,
    },
    classes: [...PATTERNS, 'abstain/insufficient'],
  },
  latencyNode: { perInferenceMicroseconds: +perInferenceUs.toFixed(2), perFeatureExtractionMicroseconds: +perFeatureUs.toFixed(2), runs: N_LAT, node: process.version },
};
writeFileSync(new URL('../docs/model-metrics.json', import.meta.url), JSON.stringify(metrics, null, 2) + '\n');
console.log(JSON.stringify({ ...metrics, training: { ...metrics.training, history: `${history.length} epochs` }, heldOut: { model: { ...metrics.heldOut.model, confusion: undefined }, rulesBaseline: { ...metrics.heldOut.rulesBaseline, confusion: undefined } } }, null, 2));
