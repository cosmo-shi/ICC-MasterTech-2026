import { describe, expect, it } from 'vitest';
import { accidentalColumns, groupChords, headSides, spaceColumns, trailColumns } from './chords.ts';
import { layoutBars } from './layout.ts';
import type { MusicEvent } from './events.ts';

const n = (midi: number, onset: number, duration = 480): MusicEvent => ({ id: `n${midi}-${onset}`, kind: 'note', midi, onset, duration, velocity: 0.7, author: 'learner' });

describe('chords for notation', () => {
  it('C, E and G pressed together become one three-note chord', () => {
    const g = groupChords([n(60, 0), n(64, 12), n(67, 25)]);
    expect(g).toHaveLength(1);
    expect(g[0].chord).toEqual([60, 64, 67]);
  });
  it('C, E and G played one after another stay three notes', () => {
    const g = groupChords([n(60, 0, 240), n(64, 240, 240), n(67, 480, 240)]);
    expect(g.map((e) => e.chord)).toEqual([undefined, undefined, undefined]);
  });
  it('a held bass note and a later melody note are not merged', () => {
    const g = groupChords([n(48, 0, 1920), n(64, 480)]);
    expect(g).toHaveLength(2);
  });
  it('the same key twice in a chord window is written once', () => {
    expect(groupChords([n(60, 0), n(60, 10)])[0].chord).toBeUndefined();
  });
  it('layoutBars keeps all three chord pitches instead of dropping two', () => {
    const bars = layoutBars([n(61, 0), n(63, 15), n(66, 30)], 1920, 1920);
    const sounding = bars[0].filter((e) => e.kind === 'note') as (MusicEvent & { chord?: number[] })[];
    expect(sounding[0].chord).toEqual([61, 63, 66]);
  });
});

describe('note trail layout', () => {
  it('groups notes that start within 70 ms into one column', () => {
    const cols = trailColumns([{ start: 0 }, { start: 30 }, { start: 400 }]);
    expect(cols.map((c) => c.items.length)).toEqual([2, 1]);
  });
  it('spreads quick notes so they never overlap, keeping the newest at its time', () => {
    expect(spaceColumns([100, 104, 108], [20, 20])).toEqual([68, 88, 108]);
    expect(spaceColumns([0, 100], [20])).toEqual([0, 100]);
  });
  it('moves the upper note of a second to the other side of the stem', () => {
    expect(headSides([0, 1])).toEqual([0, 1]); // C and D
    expect(headSides([0, 1, 2])).toEqual([0, 1, 0]); // C, D, E
    expect(headSides([0, 2, 4])).toEqual([0, 0, 0]); // C, E, G
  });
  it('stacks close sharps in separate columns', () => {
    // C♯5, A♯4, F♯4 as positions highest first: 7, 5, 3
    expect(accidentalColumns([7, 5, 3])).toEqual([0, 1, 2]);
    expect(accidentalColumns([10, 2])).toEqual([0, 0]);
  });
});
