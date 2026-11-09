import { describe, expect, it } from 'vitest';
import { TPQ, type MusicEvent } from './events.ts';
import { layoutBar } from './layout.ts';
import { quantise } from './capture.ts';

const drum = (id: string, onset: number, duration = TPQ): MusicEvent => ({ id, kind: 'drum', onset, duration, sound: 'kick', velocity: 0.7 });

describe('layoutBar', () => {
  it('fills silent gaps with rests so each sound sits on its beat', () => {
    const out = layoutBar([drum('a', 0), drum('b', 2 * TPQ)], 0, 4 * TPQ);
    expect(out.map((e) => [e.kind, e.onset, e.duration])).toEqual([
      ['drum', 0, TPQ],
      ['rest', TPQ, TPQ],
      ['drum', 2 * TPQ, TPQ],
      ['rest', 3 * TPQ, TPQ],
    ]);
  });
  it('fills a whole empty bar with one rest and keeps every bar full', () => {
    expect(layoutBar([], 0, 4 * TPQ)).toEqual([{ id: 'gap-0', kind: 'rest', onset: 0, duration: 4 * TPQ }]);
    const out = layoutBar([drum('a', TPQ / 2, 5 * TPQ)], 0, 4 * TPQ);
    expect(out.reduce((n, e) => n + e.duration, 0)).toBe(4 * TPQ);
  });
});

describe('quantise drums', () => {
  it('writes a drum hit as lasting until the next hit, at most a beat', () => {
    // 120 bpm: one beat is 500 ms.
    const inputs = [0, 500, 750, 1500].map((t, i) => ({ id: `i${i}`, onsetMs: t, releaseMs: t + 60, sound: 'kick' as const, source: 'key' as const }));
    const p = quantise(inputs, 120, 4 * TPQ, TPQ / 2, 'drums');
    expect(p.events.map((e) => [e.onset, e.duration])).toEqual([
      [0, TPQ],
      [TPQ, TPQ / 2],
      [1.5 * TPQ, TPQ],
      [3 * TPQ, TPQ],
    ]);
  });
});
