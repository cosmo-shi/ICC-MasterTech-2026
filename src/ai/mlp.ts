// Tiny multilayer perceptron: features -> tanh hidden layer -> softmax over timing patterns.
// Pure TypeScript inference, so it runs offline in any browser without a runtime download.

export interface MlpWeights {
  inputSize: number;
  hiddenSize: number;
  outputSize: number;
  w1: number[]; // hidden x input, row-major
  b1: number[];
  w2: number[]; // output x hidden
  b2: number[];
}

export interface ModelFile {
  modelId: string;
  version: string;
  sha256?: string;
  featureSchemaVersion: string;
  classes: string[];
  abstainBelow: number;
  weights: MlpWeights;
  trainedAt: string;
  seed: number;
}

export function forward(w: MlpWeights, x: number[]): { hidden: number[]; probs: number[] } {
  const hidden = new Array<number>(w.hiddenSize);
  for (let h = 0; h < w.hiddenSize; h++) {
    let s = w.b1[h];
    const row = h * w.inputSize;
    for (let i = 0; i < w.inputSize; i++) s += w.w1[row + i] * x[i];
    hidden[h] = Math.tanh(s);
  }
  const logits = new Array<number>(w.outputSize);
  for (let o = 0; o < w.outputSize; o++) {
    let s = w.b2[o];
    const row = o * w.hiddenSize;
    for (let h = 0; h < w.hiddenSize; h++) s += w.w2[row + h] * hidden[h];
    logits[o] = s;
  }
  const max = Math.max(...logits);
  const exps = logits.map((l) => Math.exp(l - max));
  const total = exps.reduce((a, b) => a + b, 0);
  return { hidden, probs: exps.map((e) => e / total) };
}

export function validateModelFile(m: unknown): m is ModelFile {
  if (!m || typeof m !== 'object') return false;
  const f = m as ModelFile;
  const w = f.weights;
  return (
    typeof f.modelId === 'string' &&
    Array.isArray(f.classes) &&
    !!w &&
    w.w1?.length === w.hiddenSize * w.inputSize &&
    w.b1?.length === w.hiddenSize &&
    w.w2?.length === w.outputSize * w.hiddenSize &&
    w.b2?.length === w.outputSize &&
    f.classes.length === w.outputSize &&
    [...w.w1, ...w.b1, ...w.w2, ...w.b2].every(Number.isFinite)
  );
}
