import { describe, expect, it } from 'vitest';
import { freeEvidence, readPattern } from './listenCoach.ts';

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

describe('free-play timing read', () => {
  it('finds the learner’s own beat and places each sound on it', () => {
    const fe = freeEvidence(steady)!;
    expect(fe.bpm).toBe(100);
    expect(fe.ev.positions).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    expect(Math.max(...fe.ev.residuals.map(Math.abs))).toBeLessThan(1e-9);
  });

  it('needs at least four sounds', () => {
    expect(freeEvidence([0, 0.5, 1])).toBeNull();
  });

  it('reads steady and speeding up, with the model or the rules', () => {
    for (const ai of [true, false]) expect(readPattern(freeEvidence(steady)!.ev, ai, true)?.pattern).toBe('steady');
    expect(readPattern(freeEvidence(faster)!.ev, true, true)?.pattern).toBe('speedingUp');
  });

  it('never says early or late in free play, where there is no outside beat', () => {
    for (const t of [steady, faster]) expect(['early', 'late']).not.toContain(readPattern(freeEvidence(t)!.ev, true, true)?.pattern);
  });

  it('marks the source: the model only when it ran', () => {
    expect(readPattern(freeEvidence(steady)!.ev, false, true)!.source).toBe('rules');
    const r = readPattern(freeEvidence(steady)!.ev, true, true)!;
    expect(r.source === 'local-model' ? r.model?.status : 'ok').toBe('ok');
  });
});
