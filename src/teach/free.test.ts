import { describe, expect, it } from 'vitest';
import { freeReflection } from './free.ts';

const steady = Array.from({ length: 10 }, (_, i) => 0.5 + i * 0.6);
const faster = (() => {
  const t = [0];
  let g = 0.7;
  for (let i = 0; i < 11; i++) {
    t.push(t[t.length - 1] + g);
    g *= 0.96;
  }
  return t;
})();
const jumpy = [0, 0.4, 1.3, 1.6, 2.8, 3.1, 3.5, 4.9, 5.2, 6.4];
const judging = /\b(wrong|mistake|incorrect|bad|should have|early|late)\b/i;

describe('free play reflection: described, never marked', () => {
  it('a steady beat is described with its speed and a next idea, no question', () => {
    const r = freeReflection(steady, true, 'drums');
    expect(r.observed).toMatch(/steady beat, about 100 beats a minute/);
    expect(r.question).toBeUndefined();
    expect(r.reply?.verification.ok).toBe(true);
  });

  it('getting faster is a guess, and Carmen asks whether it was meant', () => {
    const r = freeReflection(faster, true, 'drums');
    expect(r.observed).toMatch(/^It sounded like/);
    expect(r.question?.text).toBe('Did you mean it to speed up?');
    const meant = r.question!.options.find((o) => o.id === 'meant')!;
    expect(meant.reply).toMatch(/accelerando/);
    for (const o of r.question!.options) expect(o.reply).not.toMatch(judging);
  });

  it('no steady beat may be exploring: asked, not corrected', () => {
    const r = freeReflection(jumpy, true, 'drums');
    expect(r.pattern).toBe('uneven');
    expect(r.question?.options.map((o) => o.id)).toContain('exploring');
    expect(`${r.observed} ${r.question?.options.map((o) => o.reply).join(' ')}`).not.toMatch(judging);
  });

  it('too few sounds, or none, says so without a beat or a score', () => {
    expect(freeReflection([0, 0.5, 1], true, 'drums').question).toBeUndefined();
    expect(freeReflection([0, 0.5, 1], true, 'drums').observed).toMatch(/too few/);
    expect(freeReflection([], true, 'drums').observed).toMatch(/didn’t hear/);
  });

  it('piano notes are called notes', () => {
    expect(freeReflection(steady, false, 'keyboard', steady.map(() => 60)).observed).toMatch(/Your notes kept/);
  });
});
