// Test signals for the listening code (tests and benchmarks only). Deterministic: seeded noise.

export function rng(seed: number) {
  let s = seed >>> 0 || 1;
  return () => {
    s ^= s << 13;
    s ^= s >>> 17;
    s ^= s << 5;
    return ((s >>> 0) / 4294967296) * 2 - 1;
  };
}

export const midiToHz = (m: number) => 440 * 2 ** ((m - 69) / 12);

/** A plucked or struck string: harmonics that fade, like piano or guitar (not a real recording). */
export function harmonicTone(hz: number, seconds: number, sampleRate: number, opts: { amp?: number; harmonics?: number; decay?: number; inharmonicity?: number } = {}): Float32Array {
  const n = Math.round(seconds * sampleRate);
  const out = new Float32Array(n);
  const H = opts.harmonics ?? 8;
  const amp = opts.amp ?? 0.3;
  const B = opts.inharmonicity ?? 0.0004;
  for (let h = 1; h <= H; h++) {
    const f = hz * h * Math.sqrt(1 + B * h * h);
    if (f > sampleRate / 2) break;
    const a = amp / h ** 1.1;
    const decay = (opts.decay ?? 2.5) * (1 + h * 0.3);
    for (let i = 0; i < n; i++) {
      const t = i / sampleRate;
      out[i] += a * Math.exp(-decay * t) * Math.sin(2 * Math.PI * f * t);
    }
  }
  // 3 ms attack so the start is not a click.
  const att = Math.round(0.003 * sampleRate);
  for (let i = 0; i < att && i < n; i++) out[i] *= i / att;
  return out;
}

/** Karplus-Strong plucked string (a rough stand-in for a guitar; not a recording). */
export function pluck(hz: number, seconds: number, sampleRate: number, seed = 1, amp = 0.4): Float32Array {
  const n = Math.round(seconds * sampleRate);
  const period = Math.max(2, Math.round(sampleRate / hz));
  const buf = new Float32Array(period);
  const r = rng(seed);
  for (let i = 0; i < period; i++) buf[i] = r() * amp;
  const out = new Float32Array(n);
  let idx = 0;
  for (let i = 0; i < n; i++) {
    const next = (idx + 1) % period;
    const v = 0.5 * (buf[idx] + buf[next]) * 0.996;
    out[i] = buf[idx];
    buf[idx] = v;
    idx = next;
  }
  return out;
}

/** A short broadband tap (hand on a table, a clap, a drum stick). */
export function tap(sampleRate: number, seed = 1, amp = 0.6, ms = 60): Float32Array {
  const n = Math.round((ms / 1000) * sampleRate);
  const out = new Float32Array(n);
  const r = rng(seed);
  for (let i = 0; i < n; i++) out[i] = r() * amp * Math.exp(-i / (sampleRate * 0.012));
  return out;
}

export function addNoise(x: Float32Array, snrDb: number, seed = 7): Float32Array {
  let p = 0;
  for (const v of x) p += v * v;
  p /= x.length || 1;
  const noiseP = p / 10 ** (snrDb / 10);
  const k = Math.sqrt(noiseP * 3); // uniform noise variance = a^2/3
  const r = rng(seed);
  return x.map((v) => v + r() * k);
}

/** Place clips into silence at given times (seconds). */
export function mix(totalSec: number, sampleRate: number, clips: { at: number; data: Float32Array }[], floor = 0, seed = 3): Float32Array {
  const out = new Float32Array(Math.round(totalSec * sampleRate));
  if (floor) {
    const r = rng(seed);
    for (let i = 0; i < out.length; i++) out[i] = r() * floor;
  }
  for (const c of clips) {
    const s = Math.round(c.at * sampleRate);
    for (let i = 0; i < c.data.length && s + i < out.length; i++) out[s + i] += c.data[i];
  }
  return out;
}
