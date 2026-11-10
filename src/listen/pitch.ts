// Pitch estimate for one frame of microphone audio (YIN, de Cheveigné & Kawahara 2002).
// Pure signal processing: no learning, no network. Returns null when there is no clear pitch,
// so silence, noise and taps never become a "wrong note".

export interface PitchEstimate {
  hz: number;
  /** 0..1: how periodic the frame is (1 - the YIN dip). Below ~0.85 is not trusted. */
  clarity: number;
  /** RMS level of the frame, linear. */
  rms: number;
}

export interface PitchOptions {
  minHz?: number;
  maxHz?: number;
  /** YIN threshold on the normalised difference; lower = stricter. */
  threshold?: number;
  /** Frames quieter than this (linear RMS) are skipped. */
  minRms?: number;
}

export function rmsOf(frame: Float32Array): number {
  let s = 0;
  for (let i = 0; i < frame.length; i++) s += frame[i] * frame[i];
  return Math.sqrt(s / frame.length);
}

export function detectPitch(frame: Float32Array, sampleRate: number, opts: PitchOptions = {}): PitchEstimate | null {
  const minHz = opts.minHz ?? 60;
  const maxHz = opts.maxHz ?? 1400;
  const threshold = opts.threshold ?? 0.12;
  const rms = rmsOf(frame);
  if (rms < (opts.minRms ?? 0.004)) return null;
  const maxLag = Math.min(Math.floor(sampleRate / minHz), Math.floor(frame.length / 2));
  const minLag = Math.max(2, Math.floor(sampleRate / maxHz));
  const n = frame.length - maxLag;
  if (n < 32) return null;
  // Difference function and its cumulative-mean normalisation.
  const d = new Float32Array(maxLag + 1);
  for (let lag = 1; lag <= maxLag; lag++) {
    let s = 0;
    for (let i = 0; i < n; i++) {
      const x = frame[i] - frame[i + lag];
      s += x * x;
    }
    d[lag] = s;
  }
  const cmnd = new Float32Array(maxLag + 1);
  cmnd[0] = 1;
  let running = 0;
  for (let lag = 1; lag <= maxLag; lag++) {
    running += d[lag];
    cmnd[lag] = running > 0 ? (d[lag] * lag) / running : 1;
  }
  // First dip under the threshold, then walk to its bottom.
  let best = -1;
  for (let lag = minLag; lag <= maxLag; lag++) {
    if (cmnd[lag] < threshold) {
      while (lag + 1 <= maxLag && cmnd[lag + 1] < cmnd[lag]) lag++;
      best = lag;
      break;
    }
  }
  if (best < 0) {
    // No dip under the threshold: take the global minimum, but report its (low) clarity.
    let min = Infinity;
    for (let lag = minLag; lag <= maxLag; lag++)
      if (cmnd[lag] < min) {
        min = cmnd[lag];
        best = lag;
      }
    if (best < 0 || min > 0.45) return null;
  }
  // Parabolic interpolation around the dip for sub-sample precision.
  let lag = best;
  if (best > minLag && best < maxLag) {
    const a = cmnd[best - 1];
    const b = cmnd[best];
    const c = cmnd[best + 1];
    const denom = a - 2 * b + c;
    if (denom !== 0) lag = best + (0.5 * (a - c)) / denom;
  }
  return { hz: sampleRate / lag, clarity: Math.max(0, Math.min(1, 1 - cmnd[best])), rms };
}

export const hzToMidiFloat = (hz: number) => 69 + 12 * Math.log2(hz / 440);

/** Nearest MIDI note and how far off it is, in cents. */
export function hzToNote(hz: number): { midi: number; cents: number } {
  const f = hzToMidiFloat(hz);
  const midi = Math.round(f);
  return { midi, cents: Math.round((f - midi) * 100) };
}
