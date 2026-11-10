import { describe, expect, it } from 'vitest';
import { coachFree, freeEvidence } from './listenCoach.ts';

const steady = Array.from({ length: 10 }, (_, i) => 0.5 + i * 0.6);
// Each space 4% shorter than the last.
const faster = (() => {
  const t = [0];
  let g = 0.7;
  for (let i = 0; i < 11; i++) {
    t.push(t[t.length - 1] + g);
    g *= 0.96;
  }
  return t;
})();

describe('free-play coach', () => {
  it('finds the learner’s own beat and places each sound on it', () => {
    const fe = freeEvidence(steady)!;
    expect(fe.bpm).toBe(100);
    expect(fe.ev.positions).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    expect(Math.max(...fe.ev.residuals.map(Math.abs))).toBeLessThan(1e-9);
  });

  it('needs at least four sounds', () => {
    expect(freeEvidence([0, 0.5, 1])).toBeNull();
    expect(coachFree([0, 0.5, 1], true, 'drums')).toBeNull();
  });

  it('says a steady beat is steady, with a verified example', () => {
    for (const ai of [true, false]) {
      const c = coachFree(steady, ai, 'drums')!;
      expect(c.pattern).toBe('steady');
      expect(c.reply?.verification.ok).toBe(true);
    }
  });

  it('hears a beat that gets faster', () => {
    const c = coachFree(faster, true, 'drums')!;
    expect(c.pattern).toBe('speedingUp');
    expect(c.observation).toMatch(/faster/);
  });

  it('never says early or late in free play, where there is no outside beat', () => {
    for (const t of [steady, faster]) expect(['early', 'late']).not.toContain(coachFree(t, true, 'keyboard', t.map(() => 60))?.pattern);
  });

  it('hears spaces that change at random as uneven', () => {
    const jumpy = [0, 0.4, 1.3, 1.6, 2.8, 3.1, 3.5, 4.9, 5.2, 6.4];
    expect(coachFree(jumpy, true, 'drums')!.pattern).toBe('uneven');
  });

  it('says "listened" only when the model ran', () => {
    expect(coachFree(steady, false, 'drums')!.source).toBe('rules');
    const c = coachFree(steady, true, 'drums')!;
    expect(c.source === 'local-model' ? c.model?.status : 'ok').toBe('ok');
  });
});
