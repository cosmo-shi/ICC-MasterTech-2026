// Listening benchmark: Carmen's YIN listener vs Pitchy vs Basic Pitch, on real VCSL piano and
// drum samples (CC0) with added noise. Runs in a real browser (Chromium via Playwright).
// See README.md in this folder. Results are synthetic-benchmark numbers, not learner evidence.
import { StreamAnalyser, type HeardNote, type HeardOnset } from '../../src/listen/analyser.ts';
import { addNoise, midiToHz, rng } from '../../src/listen/signals.ts';

type Row = Record<string, number | string>;
const out = document.getElementById('out')!;
const log = (s: string) => (out.textContent += `\n${s}`);

const ROOTS = [
  ['C3', 48], ['E3', 52], ['G3', 55], ['B3', 59], ['D4', 62], ['F4', 65], ['A4', 69], ['C5', 72], ['G5', 79], ['C6', 84],
] as const;

async function decode(url: string, sr: number): Promise<Float32Array> {
  const buf = await (await fetch(url)).arrayBuffer();
  const ctx = new OfflineAudioContext(1, sr, sr);
  const ab = await ctx.decodeAudioData(buf);
  // Mix down and resample by rendering.
  const off = new OfflineAudioContext(1, Math.ceil(ab.duration * sr), sr);
  const src = off.createBufferSource();
  src.buffer = ab;
  src.connect(off.destination);
  src.start();
  return (await off.startRendering()).getChannelData(0).slice();
}

/** A piano note at any pitch: the nearest VCSL sample, resampled (as Carmen's own engine plays it). */
function pianoNote(samples: Map<string, Float32Array>, midi: number, layer: 'soft' | 'loud', sr: number, seconds: number): Float32Array {
  let best = ROOTS[0];
  for (const r of ROOTS) if (Math.abs(r[1] - midi) < Math.abs(best[1] - midi)) best = r;
  const src = samples.get(`${best[0]}-${layer}`)!;
  const rate = 2 ** ((midi - best[1]) / 12);
  const n = Math.round(seconds * sr);
  const out = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const p = i * rate;
    const k = Math.floor(p);
    if (k + 1 >= src.length) break;
    out[i] = src[k] + (src[k + 1] - src[k]) * (p - k);
  }
  return out;
}

function place(total: number, sr: number, at: number, x: Float32Array, floor = 0.0005, seed = 1): Float32Array {
  const o = new Float32Array(Math.round(total * sr));
  const r = rng(seed);
  for (let i = 0; i < o.length; i++) o[i] = r() * floor;
  const s = Math.round(at * sr);
  for (let i = 0; i < x.length && s + i < o.length; i++) o[s + i] += x[i];
  return o;
}

function ours(x: Float32Array, sr: number) {
  const a = new StreamAnalyser({ sampleRate: sr, pitch: true });
  const t0 = performance.now();
  const ev: (HeardNote | HeardOnset)[] = [];
  for (let i = 0; i < x.length; i += 1024) ev.push(...a.push(x.subarray(i, i + 1024)));
  ev.push(...a.flush());
  const ms = performance.now() - t0;
  return { notes: ev.filter((e): e is HeardNote => e.kind === 'note'), onsets: ev.filter((e): e is HeardOnset => e.kind === 'onset'), ms };
}

async function main() {
  const SR = 44100;
  const samples = new Map<string, Float32Array>();
  for (const [name] of ROOTS) for (const layer of ['soft', 'loud'] as const) samples.set(`${name}-${layer}`, await decode(`/audio/piano/${name}-${layer}.mp3`, SR));
  log('decoded piano samples');

  // Pitchy (MIT) and Basic Pitch (Apache-2.0) are loaded only for this benchmark.
  const { PitchDetector } = await import('pitchy');
  const bpStart = performance.now();
  const tf = await import('@tensorflow/tfjs');
  await tf.ready();
  const { BasicPitch, outputToNotesPoly, noteFramesToTime } = await import('@spotify/basic-pitch');
  const bp = new BasicPitch(tf.loadGraphModel('/model/model.json'));
  await (bp as unknown as { model: Promise<unknown> }).model;
  const bpLoadMs = performance.now() - bpStart;
  log(`basic pitch loaded in ${bpLoadMs.toFixed(0)} ms, backend ${tf.getBackend()}`);

  const rows: Row[] = [];
  const conditions = [
    { name: 'clean', snr: null },
    { name: 'noise 20 dB', snr: 20 },
    { name: 'noise 10 dB', snr: 10 },
  ];
  const notes: number[] = [];
  for (let m = 48; m <= 84; m += 1) notes.push(m);
  for (const cond of conditions) {
    const tally = { oursWrong: 0, pitchyWrong: 0, bpWrong: 0, bpMissing: 0, ours: 0, oursUnclear: 0, oursMs: 0, pitchy: 0, pitchyUnclear: 0, pitchyMs: 0, bp: 0, bpMs: 0, n: 0 };
    for (const [i, m] of notes.entries()) {
      const layer = i % 2 ? 'soft' : 'loud';
      let x = place(1.2, SR, 0.3, pianoNote(samples, m, layer, SR, 0.8), 0.0005, i + 1);
      if (cond.snr !== null) x = addNoise(x, cond.snr, i + 11);
      tally.n++;
      // Carmen (YIN + onsets): first note after the onset.
      const o = ours(x, SR);
      tally.oursMs += o.ms;
      const first = o.notes[0];
      if (!first || first.confidence < 0.6) tally.oursUnclear++;
      else if ((first.midi - m) % 12 === 0) tally.ours++;
      else tally.oursWrong++;
      // Pitchy: same window and look-ahead (frames 20–160 ms after the onset), majority vote.
      const det = PitchDetector.forFloat32Array(2048);
      const t1 = performance.now();
      const votes = new Map<number, number>();
      for (let t = 0.32; t < 0.46; t += 256 / SR) {
        const s = Math.round(t * SR);
        const [hz, clarity] = det.findPitch(x.subarray(s, s + 2048), SR);
        if (clarity > 0.9 && hz > 50) {
          const mm = Math.round(69 + 12 * Math.log2(hz / 440));
          votes.set(mm, (votes.get(mm) ?? 0) + 1);
        }
      }
      tally.pitchyMs += performance.now() - t1;
      const pv = [...votes.entries()].sort((a, b) => b[1] - a[1])[0];
      if (!pv) tally.pitchyUnclear++;
      else if ((pv[0] - m) % 12 === 0) tally.pitchy++;
      else tally.pitchyWrong++;
      // Basic Pitch: transcribe the clip (22.05 kHz), take the note that starts nearest 0.3 s.
      const x22 = new Float32Array(Math.floor(x.length / 2));
      for (let k = 0; k < x22.length; k++) x22[k] = (x[2 * k] + x[2 * k + 1]) / 2;
      const frames: number[][] = [];
      const onsetsF: number[][] = [];
      const contours: number[][] = [];
      const t2 = performance.now();
      await bp.evaluateModel(x22, (f: number[][], o2: number[][], c: number[][]) => {
        frames.push(...f);
        onsetsF.push(...o2);
        contours.push(...c);
      }, () => undefined);
      tally.bpMs += performance.now() - t2;
      const evs = noteFramesToTime(outputToNotesPoly(frames, onsetsF, 0.5, 0.3, 5));
      const near = evs.sort((a, b) => Math.abs(a.startTimeSeconds - 0.3) - Math.abs(b.startTimeSeconds - 0.3))[0];
      if (!near) tally.bpMissing++;
      else if ((near.pitchMidi - m) % 12 === 0) tally.bp++;
      else tally.bpWrong++;
    }
    rows.push({
      condition: cond.name,
      notes: tally.n,
      carmen_correct: tally.ours,
      carmen_unclear: tally.oursUnclear,
      carmen_wrong: tally.oursWrong,
      carmen_ms_per_clip: +(tally.oursMs / tally.n).toFixed(2),
      pitchy_correct: tally.pitchy,
      pitchy_unclear: tally.pitchyUnclear,
      pitchy_wrong: tally.pitchyWrong,
      pitchy_ms_per_clip: +(tally.pitchyMs / tally.n).toFixed(2),
      basicpitch_correct: tally.bp,
      basicpitch_wrong: tally.bpWrong,
      basicpitch_missing: tally.bpMissing,
      basicpitch_ms_per_clip: +(tally.bpMs / tally.n).toFixed(1),
    });
    log(JSON.stringify(rows[rows.length - 1]));
  }

  // Taps: VCSL drum samples at seeded times; how many are found and how close in time.
  const drums: Float32Array[] = [];
  for (const d of ['kick', 'snare', 'hihat', 'clave', 'tomLow']) {
    // Same peak for every drum, then a random strength per tap (0.4–1.0), so 'SNR' means the room, not the sample.
    const x = await decode(`/audio/drums/${d}.mp3`, SR);
    let pk = 0;
    for (const v of x) pk = Math.max(pk, Math.abs(v));
    drums.push(x.map((v) => (v / pk) * 0.5));
  }
  const tapRows: Row[] = [];
  for (const snr of [null, 20, 10] as const) {
    const r = rng(42);
    let found = 0;
    let extra = 0;
    let total = 0;
    const errs: number[] = [];
    for (let trial = 0; trial < 10; trial++) {
      const times: number[] = [];
      let t = 0.4;
      for (let k = 0; k < 8; k++) {
        times.push(t);
        t += 0.22 + Math.abs(r()) * 0.5;
      }
      let x = new Float32Array(Math.round((t + 0.6) * SR));
      times.forEach((at, k) => {
        const d = drums[(k + trial) % drums.length];
        const s = Math.round(at * SR);
        const g = 0.4 + 0.6 * Math.abs(r());
        for (let i = 0; i < d.length && s + i < x.length; i++) x[s + i] += d[i] * g;
      });
      if (snr !== null) x = addNoise(x, snr, trial + 5);
      const o = ours(x, SR).onsets;
      total += times.length;
      for (const tt of times) {
        const hit = o.find((e) => Math.abs(e.time - tt) < 0.05);
        if (hit) {
          found++;
          errs.push(Math.abs(hit.time - tt) * 1000);
        }
      }
      extra += o.filter((e) => !times.some((tt) => Math.abs(e.time - tt) < 0.05)).length;
    }
    errs.sort((a, b) => a - b);
    tapRows.push({ condition: snr === null ? 'clean' : `noise ${snr} dB`, taps: total, found, extra, median_error_ms: +errs[Math.floor(errs.length / 2)].toFixed(1), p95_error_ms: +errs[Math.floor(errs.length * 0.95)].toFixed(1) });
    log(JSON.stringify(tapRows[tapRows.length - 1]));
  }
  (window as unknown as { RESULT: unknown }).RESULT = { pitch: rows, taps: tapRows, basicPitchLoadMs: Math.round(bpLoadMs), backend: tf.getBackend(), ua: navigator.userAgent, note: midiToHz(69) };
  log('DONE');
}
main().catch((e) => {
  log(`ERROR ${e}`);
  (window as unknown as { RESULT: unknown }).RESULT = { error: String(e) };
});
