import { describe, expect, it } from 'vitest';
import { describeTaps } from './feedback.ts';

describe('free tapping is described, not marked', () => {
  it('describes even spacing and pace', () => {
    expect(describeTaps([0, 0.5, 1, 1.5, 2].map((time) => ({ time })))).toBe('5 taps in 2 seconds. The spaces between them were very even, about 120 taps a minute.');
  });
  it('describes uneven spacing as a choice, not an error', () => {
    const d = describeTaps([0, 0.2, 1, 1.1, 2.4].map((time) => ({ time })));
    expect(d).toMatch(/changed, which can make a rhythm of its own/);
    expect(d).not.toMatch(/wrong|uneven/);
  });
});
