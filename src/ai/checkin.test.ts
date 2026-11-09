import { describe, expect, it } from 'vitest';
import type { MusicEvent, Phrase } from '../music/events.ts';
import type { AttemptRecord } from '../store/db.ts';
import { buildLearnerState } from './bkt.ts';
import { checkInOffer, isRight, listenCheck, readCheck, rulesCheckInOffer, suggestFrom } from './checkin.ts';
import { LESSON_INFOS } from './learner.ts';

const drum = (id: string, onset: number): MusicEvent => ({ id, kind: 'drum', onset, duration: 480, sound: 'kick', velocity: 0.7 });
const phrase = (events: MusicEvent[]): Phrase => ({ id: 'p', instrument: 'drums', meter: [4, 4], totalTicks: 1920, tempoBpm: 80, events });
const target = phrase([drum('t1', 0), { id: 'r', kind: 'rest', onset: 480, duration: 480 }, drum('t2', 960), { id: 'r2', kind: 'rest', onset: 1440, duration: 480 }]);

let n = 0;
const attempt = (activityId: string, rv: number, kind: AttemptRecord['kind'] = 'practice'): AttemptRecord => ({
  id: `a${++n}`,
  createdAt: n * 1000,
  activityId,
  activityVersion: '1',
  kind,
  instrument: 'drums',
  tempoBpm: 80,
  support: { hintLevel: 0, heardExample: false, largeControls: false, simplified: false, aiEnabled: true, slower: false },
  inputs: [],
  summary: { expected: 2, correctSound: 2, wrong: 0, missed: 0, extra: rv, restViolations: rv, early: 0, onTime: 2, late: 0, durationOk: 0, durationIssues: 0 },
  passed: rv === 0,
});
const L02 = LESSON_INFOS.find((l) => l.id === 'L02');

describe('when the learner model offers a check', () => {
  it('does not offer after one miss: too little evidence, just try again', () => {
    expect(checkInOffer(buildLearnerState([attempt('L02', 1)], LESSON_INFOS), L02, true)).toBeNull();
  });
  it('offers after repeated misses on the same skill, naming the skill and the evidence', () => {
    const s = buildLearnerState([attempt('L02', 1), attempt('L02', 2), attempt('L02', 1)], LESSON_INFOS);
    const o = checkInOffer(s, L02, true)!;
    expect(o.skill).toBe('rests');
    expect(o.by).toBe('learner-model');
    expect(o.fails).toBeGreaterThanOrEqual(2);
  });
  it('a check result is not evidence: check records leave the estimate unchanged', () => {
    const base = [attempt('L02', 1), attempt('L02', 1)];
    const a = buildLearnerState(base, LESSON_INFOS).skills.rests.p;
    const b = buildLearnerState([...base, attempt('L02', 0, 'check' as AttemptRecord['kind'])], LESSON_INFOS).skills.rests.p;
    expect(b).toBe(a);
  });
  it('is off when the AI is off; the rules baseline needs three misses in a row this visit', () => {
    const s = buildLearnerState([attempt('L02', 1), attempt('L02', 2), attempt('L02', 1)], LESSON_INFOS);
    expect(checkInOffer(s, L02, false)).toBeNull();
    expect(rulesCheckInOffer(2, L02)).toBeNull();
    expect(rulesCheckInOffer(3, L02)?.by).toBe('rules');
  });
});

describe('the three checks', () => {
  it('listening uses the learner’s own take and a verified version', () => {
    const take = phrase([drum('a', 0), drum('b', 500), drum('c', 960)]);
    const c = listenCheck(take, target, 'rests')!;
    expect(c.ask).toContain('rests quiet');
    expect(c.version.touched).toBe(1);
    expect(listenCheck(phrase([drum('a', 0), drum('c', 960)]), target, 'rests')).toBeNull(); // nothing to compare
  });
  it('reading asks a question with a definite answer from the score', () => {
    const q = readCheck(target, 'rests')!;
    expect(q.answer).toEqual(['2', '4']);
    expect(isRight(q, ['4', '2'])).toBe(true);
    expect(isRight(q, ['2'])).toBe(false);
  });
  it('every result suggests a support and never a label for the child', () => {
    for (const k of ['listen', 'read', 'play'] as const)
      for (const r of [true, false]) {
        const s = suggestFrom(k, r);
        expect(s.says).not.toMatch(/can't|cannot|bad|weak|problem|disorder/i);
        expect(s.support).toBeTruthy();
      }
  });
});
