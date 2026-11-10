import { afterEach, describe, expect, it } from 'vitest';
import { audio, mapCtxToPerf } from './engine.ts';

describe('audio clock to screen clock', () => {
  it('uses the output timestamp when it agrees with the plain estimate', () => {
    const t = mapCtxToPerf(10.5, { now: 5000, currentTime: 10, latencySec: 0.02, stamp: { contextTime: 9.99, performanceTime: 5010 } });
    expect(t).toBeCloseTo(5520, 0);
  });

  it('ignores a stale timestamp, so an old context does not delay the first beat', () => {
    // Safari-like: the context has run for 10 minutes but the stamp still says contextTime 0.
    const now = 700_000;
    const beat0 = 600 + 0.12 + 4 * 0.75; // lead + four count-in beats at 80 bpm
    const t = mapCtxToPerf(beat0, { now, currentTime: 600, latencySec: 0.01, stamp: { contextTime: 0, performanceTime: now - 1 } });
    expect(t - now).toBeGreaterThan(3000);
    expect(t - now).toBeLessThan(3500);
  });
});

/** A minimal AudioContext stand-in whose clock can be moved forward. */
function fakeContext(currentTime: number) {
  const node = () => ({ connect: (n: unknown) => n, gain: { value: 1, setValueAtTime() {}, linearRampToValueAtTime() {}, cancelScheduledValues() {}, setTargetAtTime() {} } });
  return {
    state: 'running',
    currentTime,
    outputLatency: 0.01,
    baseLatency: 0.005,
    destination: {},
    getOutputTimestamp: () => ({ contextTime: 0, performanceTime: performance.now() }),
    createGain: node,
    createBufferSource: () => ({ ...node(), buffer: null, playbackRate: { value: 1 }, start() {}, stop() {}, onended: null }),
  };
}

describe('lesson count-in after the sound has been on for 10 minutes', () => {
  const engine = audio as unknown as { ctx: unknown; master: unknown; status: string };
  afterEach(() => {
    engine.ctx = null;
    engine.master = null;
    engine.status = 'idle';
  });

  it('puts the first beat within one count-in of now', () => {
    const ctx = fakeContext(600);
    engine.ctx = ctx;
    engine.master = ctx.createGain();
    engine.status = 'ready';
    const tempo = 80;
    const pb = audio.schedule([], tempo, { countInBeats: 4, totalTicks: 1920, click: true });
    expect(pb).not.toBeNull();
    const wait = pb!.beat0PerfMs - performance.now();
    const countInMs = 4 * (60000 / tempo);
    expect(wait).toBeGreaterThan(countInMs - 50);
    expect(wait).toBeLessThan(countInMs + 400);
    // And the take's length is the music's own length, not the context's age.
    expect(pb!.durationSec).toBeCloseTo(4 * 0.75 + 4 * 0.75, 5);
  });
});
