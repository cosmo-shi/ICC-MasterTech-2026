import { describe, expect, it } from 'vitest';
import { medianOffset, pulseWords } from './beat.ts';

describe('tap with the beat (L01 foundations)', () => {
  it('steady taps are described as landing with the click', () => {
    expect(pulseWords([0, 1.02, 1.98, 3.01, 4, 5.03])).toBe('6 of 6 taps landed with the click. That is a steady beat.');
  });
  it('early and late are said as what happened, with one next step', () => {
    expect(pulseWords([-0.2, 0.75, 1.8, 2.75, 3.8])).toMatch(/before the click/);
    expect(pulseWords([0.3, 1.3, 2.25, 3.3])).toMatch(/after the click/);
  });
  it('too few taps is not judged', () => {
    expect(pulseWords([])).toMatch(/No taps came in/);
    expect(pulseWords([0, 1])).toMatch(/keep tapping/);
    expect(medianOffset([])).toBeNull();
  });
});
