import { describe, expect, it } from 'vitest';
import { StreamAnalyser, type HeardNote, type HeardOnset } from './analyser.ts';
import { detectPitch, hzToNote } from './pitch.ts';
import { addNoise, harmonicTone, midiToHz, mix, pluck, tap } from './signals.ts';

const SR = 44100;

function run(x: Float32Array, opts: Partial<ConstructorParameters<typeof StreamAnalyser>[0]> = {}) {
  const a = new StreamAnalyser({ sampleRate: SR, ...opts });
  const out: (HeardOnset | HeardNote)[] = [];
  // Feed in browser-sized blocks.
  for (let i = 0; i < x.length; i += 512) out.push(...a.push(x.subarray(i, i + 512)));
  out.push(...a.flush());
  return out;
}

describe('pitch of one frame', () => {
  it('finds piano-range notes from C3 to C6 within 15 cents (piano strings are slightly stretched)', () => {
    for (let m = 48; m <= 84; m += 5) {
      const x = harmonicTone(midiToHz(m), 0.1, SR);
      const p = detectPitch(x.subarray(0, 2048), SR);
      expect(p, `midi ${m}`).not.toBeNull();
      const n = hzToNote(p!.hz);
      expect(n.midi, `midi ${m}`).toBe(m);
      expect(Math.abs(n.cents)).toBeLessThan(15);
    }
  });

  it('gives no pitch for silence or for a tap', () => {
    expect(detectPitch(new Float32Array(2048), SR)).toBeNull();
    const t = detectPitch(tap(SR, 2, 0.6, 50).subarray(0, 2048).slice(), SR);
    expect(t === null || t.clarity < 0.8).toBe(true);
  });
});

describe('streaming listener', () => {
  it('finds four taps at the right times (within 6 ms)', () => {
    const times = [0.5, 1.0, 1.5, 2.0];
    const x = mix(2.6, SR, times.map((at, i) => ({ at, data: tap(SR, i + 1) })), 0.001);
    const on = run(x).filter((e) => e.kind === 'onset');
    expect(on.map((o) => o.time.toFixed(2))).toEqual(times.map((t) => t.toFixed(2)));
    on.forEach((o, i) => expect(Math.abs(o.time - times[i])).toBeLessThan(0.006));
  });

  it('ignores Carmen’s own clicks inside muted windows', () => {
    const x = mix(2, SR, [{ at: 0.4, data: tap(SR, 1) }, { at: 1.2, data: tap(SR, 2) }], 0.001);
    const on = run(x, { mute: [{ from: 0.38, to: 0.48 }] }).filter((e) => e.kind === 'onset');
    expect(on).toHaveLength(1);
    expect(on[0].time).toBeCloseTo(1.2, 2);
  });

  it('names single piano-like notes and gives each a confidence', () => {
    const notes = [60, 62, 64, 67];
    const x = mix(3, SR, notes.map((m, i) => ({ at: 0.3 + i * 0.6, data: harmonicTone(midiToHz(m), 0.55, SR) })), 0.001);
    const heard = run(x, { pitch: true }).filter((e): e is HeardNote => e.kind === 'note');
    expect(heard.map((n) => n.midi)).toEqual(notes);
    heard.forEach((n) => expect(n.confidence).toBeGreaterThan(0.7));
  });

  it('still names notes with background noise at 20 dB SNR', () => {
    const notes = [55, 59, 62];
    const clean = mix(2.4, SR, notes.map((m, i) => ({ at: 0.3 + i * 0.7, data: harmonicTone(midiToHz(m), 0.6, SR) })));
    const heard = run(addNoise(clean, 20), { pitch: true }).filter((e): e is HeardNote => e.kind === 'note');
    expect(heard.map((n) => n.midi)).toEqual(notes);
  });

  it('a plucked string (synthetic, not a guitar recording) is named in guitar range', () => {
    const notes = [40, 45, 50, 55, 59, 64]; // open strings E2 A2 D3 G3 B3 E4
    const x = mix(5, SR, notes.map((m, i) => ({ at: 0.3 + i * 0.75, data: pluck(midiToHz(m), 0.7, SR, i + 2) })), 0.0005);
    const heard = run(x, { pitch: true, minHz: 70 }).filter((e): e is HeardNote => e.kind === 'note');
    expect(heard.map((n) => n.midi)).toEqual(notes);
  });

  it('a tap gives an onset but no note, so it can never be called a wrong note', () => {
    const x = mix(1.2, SR, [{ at: 0.4, data: tap(SR, 5) }], 0.001);
    const out = run(x, { pitch: true });
    expect(out.filter((e) => e.kind === 'onset')).toHaveLength(1);
    expect(out.filter((e) => e.kind === 'note')).toHaveLength(0);
  });

  it('steady noise alone produces no onsets', () => {
    const x = mix(2, SR, [], 0.02, 9);
    expect(run(x).filter((e) => e.kind === 'onset')).toHaveLength(0);
  });
});

import { calibrate, compareNote, describeFreePlay, noteFeedback, onsetsToInputs, rhythmClarity } from './compare.ts';
import { parseMidi } from '../input/midi.ts';
import { checkAttempt } from '../engine/checker.ts';
import { LESSONS } from '../data/catalog.ts';

describe('comparing what was heard with the activity', () => {
  const note = (midi: number, confidence = 0.9): HeardNote => ({ kind: 'note', time: 0, midi, cents: 0, confidence, agreement: 1 });

  it('an unclear sound is never a wrong note and never counts', () => {
    const v = compareNote(60, note(62, 0.3));
    expect(v.kind).toBe('unclear');
    expect(noteFeedback(v).counts).toBe(false);
    expect(compareNote(60, undefined).kind).toBe('unclear');
  });

  it('any C counts for "play C" unless the octave is asked for', () => {
    expect(compareNote(60, note(72)).kind).toBe('match');
    expect(compareNote(60, note(72), { exactOctave: true }).kind).toBe('octave');
  });

  it('a different note says which way to move', () => {
    const f = noteFeedback(compareNote(64, note(62)));
    expect(f.what).toContain('D');
    expect(f.next).toContain('up');
  });

  it('taps from the microphone go through the same checker, with the drum not judged', () => {
    const l = LESSONS.find((x) => x.id === 'L01')!;
    const beatSec = 60 / l.tempoBpm;
    const latency = 0.08;
    const onsets: HeardOnset[] = [0, 1, 2, 3].map((b) => ({ kind: 'onset', time: 10 + b * beatSec + latency + 0.01, strength: 30, confidence: 0.9 }));
    const inputs = onsetsToInputs(onsets, 10, latency, 'kick');
    const res = checkAttempt(l.practice!, inputs, l.assessment, l.tempoBpm);
    expect(res.summary.onTime).toBe(4);
    expect(res.passed).toBe(true);
  });

  it('an uncalibrated or messy take is unclear, so it gives no timing feedback or evidence', () => {
    const on = (n: number): HeardOnset[] => Array.from({ length: n }, (_, i) => ({ kind: 'onset', time: i, strength: 30, confidence: 0.9 }));
    expect(rhythmClarity(on(4), 4, false)).toEqual({ clear: false, reason: 'not-calibrated' });
    expect(rhythmClarity(on(1), 4, true).clear).toBe(false);
    expect(rhythmClarity(on(12), 4, true)).toEqual({ clear: false, reason: 'too-many' });
    expect(rhythmClarity(on(4), 4, true)).toEqual({ clear: true });
  });

  it('calibration finds the delay between Carmen’s clicks and the taps', () => {
    const clicks = [1, 1.6, 2.2, 2.8, 3.4, 4.0];
    const onsets: HeardOnset[] = clicks.map((c, i) => ({ kind: 'onset', time: c + 0.11 + (i % 2 ? 0.01 : -0.01), strength: 30, confidence: 0.9 }));
    const c = calibrate(clicks, onsets)!;
    expect(c.latency).toBeGreaterThan(0.09);
    expect(c.latency).toBeLessThan(0.13);
    expect(c.ok).toBe(true);
    expect(calibrate(clicks, onsets.slice(0, 2))).toBeNull();
  });

  it('free play is described, not marked', () => {
    const d = describeFreePlay([60, 62, 64, 65, 67].map((midi) => ({ midi })));
    expect(d).toContain('going up');
    expect(d).not.toMatch(/wrong|mistake/i);
  });

  it('reads MIDI note on and off, including note-on with velocity 0', () => {
    expect(parseMidi([0x90, 60, 100])).toEqual({ type: 'down', midi: 60, velocity: 100 / 127 });
    expect(parseMidi([0x90, 60, 0])).toEqual({ type: 'up', midi: 60, velocity: 0 });
    expect(parseMidi([0x80, 61, 40])).toEqual({ type: 'up', midi: 61, velocity: 0 });
    expect(parseMidi([0xb0, 64, 127])).toBeNull(); // pedal: ignored
  });
});
