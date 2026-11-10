import { describe, expect, it } from 'vitest';
import { C4, D4, E4, L05_STEPS, SHARP_EXPLAINER, describeChange, judgeTap, sequenceResult } from './l05.ts';

describe('L05 keyboard notes C, D and E', () => {
  it('middle C is MIDI 60 and the pattern is C D E C', () => {
    expect([C4, D4, E4]).toEqual([60, 62, 64]);
    expect(L05_STEPS.find((s) => s.id === 'own')).toMatchObject({ notes: [60, 62, 64, 60] });
  });
  it('a C in another octave is called a C, not wrong letters', () => {
    const r = judgeTap(60, 72);
    expect(r.ok).toBe(false);
    expect(r.observed).toBe('That’s a C too, a higher one.');
  });
  it('a black key is named with ♯ and points back to the white key', () => {
    const r = judgeTap(62, 61);
    expect(r.observed).toBe('That’s a black key (C♯).');
    expect(r.next).toMatch(/middle of the two black keys/);
    expect(`${r.observed}${r.next}`).not.toMatch(/#/);
  });
  it('a near miss says which way and how far', () => {
    expect(judgeTap(64, 65).next).toBe('E is the next white key to the left.');
    expect(judgeTap(64, 60).next).toBe('E is 2 white keys to the right.');
  });
  it('wrong-note teaching for C D G C against C D E C pairs E with G', () => {
    const r = sequenceResult([60, 62, 64, 60], [60, 62, 67, 60]);
    expect(r.title).toBe('Note 3 should be E');
    expect(r.observed).toBe('Note 3 is written as E. You played G.');
    expect(r.pair).toEqual({ index: 2, expected: 64, played: 67 });
    expect(`${r.observed} ${r.next}`).not.toMatch(/Nearly|Something was different/);
  });
  it('several wrong notes are all named, in order, not just the first', () => {
    const r = sequenceResult([60, 62, 64, 60], [60, 65, 67, 72]);
    expect(r.wrong.map((w) => w.index)).toEqual([1, 2, 3]);
    expect(r.title).toBe('Notes 2, 3 and 4 are different from the written music');
    expect(r.observed).toBe('Note 2 is written as D. You played F. Note 3 is written as E. You played G. Note 4 is written as middle C. You played a higher C.');
  });
  it('a correct sequence passes and an extra note is named', () => {
    expect(sequenceResult([60, 62, 64, 60], [60, 62, 64, 60]).ok).toBe(true);
    expect(sequenceResult([60, 62, 64], [60, 62, 64, 65]).observed).toMatch(/extra F/);
  });
  it('a creative change is described, never marked', () => {
    const d = describeChange([60, 62, 64, 60], [60, 62, 64, 67]);
    expect(d).toBe('You changed note 4 from C to G. The tune now jumps higher at the end. Play both and listen: which ending do you like?');
    expect(d).not.toMatch(/right|wrong|correct/i);
  });
  it('the sharp explainer uses ♯, a semitone, and E♯ on F, with no invented black key', () => {
    const t = SHARP_EXPLAINER.lines.join(' ');
    expect(t).toMatch(/semitone/);
    expect(t).toMatch(/E♯ is played on the white key F/);
    expect(t).not.toMatch(/#/);
  });
});
