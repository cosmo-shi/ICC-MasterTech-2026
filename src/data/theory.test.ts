import { GUIDED } from './guided.ts';
import { describe, expect, it } from 'vitest';
import { SKILLS } from '../ai/learner.ts';
import { ACTIVITIES } from './curriculum.ts';
import { THEORY, topicById } from './theory.ts';
import { LESSONS } from './catalog.ts';

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
      if (t.tryLesson) expect(LESSONS.some((l) => l.id === t.tryLesson) || GUIDED.some((g) => g.id === t.tryLesson), `${t.id} → ${t.tryLesson}`).toBe(true);
      for (const b of t.before ?? []) expect(topicById(b), `${t.id} before ${b}`).toBeTruthy();
    }
    for (const s of SKILLS) expect(topicById(s.theory), s.id).toBeDefined();
  });
  it('teaches what a note is before notation and accidentals', () => {
    const at = (id: string) => THEORY.findIndex((t) => t.id === id);
    expect(at('what-is-a-note')).toBeLessThan(at('stave'));
    expect(topicById('stave')!.before).toContain('note-names');
    expect(topicById('sharps-flats')!.before).toContain('note-names');
  });
  it('the curriculum covers every lesson once', () => {
    const ids = ACTIVITIES.filter((a) => a.kind === 'lesson').map((a) => a.id);
    expect(new Set(ids).size).toBe(ids.length);
    // Every lesson is either a scored lesson (lessons JSON) or a guided concept lesson (guided.ts).
    expect([...ids].sort()).toEqual([...LESSONS.map((l) => l.id), ...GUIDED.map((g) => g.id)].sort());
  });
});
