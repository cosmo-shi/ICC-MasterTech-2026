import { describe, expect, it } from 'vitest';
import { LESSONS, MISSIONS, lessonById } from './catalog.ts';
import { ACTIVITIES, TRACKS, activityById, lessonFor, positionInTrack, routeFrom, trackActivities } from './curriculum.ts';
import { validatePhrase } from '../music/lessons.ts';
import { clefForPhrase } from '../music/notationKeys.ts';
import skills from './skills.json';

describe('curriculum', () => {
  it('places every lesson and project in exactly one track', () => {
    for (const l of LESSONS) expect(activityById(l.id), l.id).toBeDefined();
    for (const m of MISSIONS) expect(activityById(m.id), m.id).toBeDefined();
    expect(new Set(ACTIVITIES.map((a) => a.id)).size).toBe(ACTIVITIES.length);
    for (const t of TRACKS) expect(trackActivities(t.id).length).toBeGreaterThan(2);
  });
  it('only lists prerequisites that exist and come earlier, with no loops', () => {
    for (const a of ACTIVITIES) for (const p of a.prerequisites) expect(activityById(p), `${a.id} needs ${p}`).toBeDefined();
    const seen = new Set<string>();
    const visit = (id: string, path: string[]): void => {
      expect(path.includes(id), `loop ${path.join('>')}>${id}`).toBe(false);
      if (seen.has(id)) return;
      for (const p of activityById(id)!.prerequisites) visit(p, [...path, id]);
      seen.add(id);
    };
    ACTIVITIES.forEach((a) => visit(a.id, []));
  });
  it('matches the instrument a lesson really uses', () => {
    for (const l of LESSONS) {
      const a = activityById(l.id)!;
      if (a.instrument !== 'either' && l.practice) expect(l.practice.instrument).toBe(a.instrument);
    }
  });
  it('gives shared rhythm lessons a real piano version: notes on a treble stave, not drums', () => {
    for (const id of ['L01', 'L02', 'L03']) {
      const keys = lessonFor(lessonById(id)!, 'keyboard');
      for (const p of [keys.practice!, keys.independent!]) {
        expect(p.instrument).toBe('keyboard');
        expect(p.events.every((e) => e.kind !== 'drum')).toBe(true);
        expect(validatePhrase(p)).toEqual([]);
        expect(clefForPhrase(p)).toBe('treble');
      }
      // Same rhythm as the drum version.
      const drums = lessonById(id)!;
      expect(keys.practice!.events.map((e) => [e.onset, e.duration, e.kind === 'rest'])).toEqual(drums.practice!.events.map((e) => [e.onset, e.duration, e.kind === 'rest']));
      expect(keys.instruction).not.toMatch(/drum/i);
      expect(lessonFor(drums, 'drums')).toBe(drums);
    }
  });
  it('uses the bass clef for the bass clef lesson', () => {
    expect(clefForPhrase(lessonById('P03')!.practice!)).toBe('bass');
  });
  it('says where each activity sits in its track', () => {
    expect(positionInTrack('L05')).toMatchObject({ index: 2, track: { id: 'piano' } });
  });
  it('maps every scored lesson to skills the learner model knows', () => {
    const known = skills.skills.map((s) => s.id);
    for (const l of LESSONS.filter((x) => x.assessment.score)) {
      const ks = (skills.lessons as Record<string, string[]>)[l.id];
      expect(ks, l.id).toBeDefined();
      for (const k of ks) expect(known).toContain(k);
    }
  });
  it('builds a route from the chosen starting point', () => {
    expect(routeFrom('3-4')[0]).toBe('L04');
    expect(routeFrom(null)[0]).toBe('L00');
  });
});
