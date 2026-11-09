import { describe, expect, it } from 'vitest';
import { SKILLS } from '../ai/learner.ts';
import { THEORY, topicById } from './theory.ts';
import { LESSONS } from './catalog.ts';
import { UNITS } from './route.ts';

describe('music words library', () => {
  it('every example fits its bars and uses whole ticks', () => {
    for (const t of THEORY)
      for (const ex of t.examples)
        for (const e of ex.phrase.events) {
          expect(Number.isInteger(e.onset) && Number.isInteger(e.duration)).toBe(true);
          expect(e.onset + e.duration).toBeLessThanOrEqual(ex.phrase.totalTicks);
        }
  });
  it('links resolve', () => {
    for (const t of THEORY) {
      for (const r of t.related) expect(topicById(r), `${t.id} → ${r}`).toBeDefined();
      if (t.tryLesson) expect(LESSONS.some((l) => l.id === t.tryLesson)).toBe(true);
    }
    for (const s of SKILLS) expect(topicById(s.theory), s.id).toBeDefined();
  });
  it('the route covers every lesson once', () => {
    const ids = UNITS.flatMap((u) => u.stops.filter((s) => s.kind === 'lesson').map((s) => s.id));
    expect(new Set(ids).size).toBe(ids.length);
    expect([...ids].sort()).toEqual(LESSONS.map((l) => l.id).sort());
  });
});
