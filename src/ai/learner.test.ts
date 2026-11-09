import { describe, expect, it } from 'vitest';
import type { AttemptRecord } from '../store/db.ts';
import { LESSON_INFOS, estimatesFrom, learnerFrom, nextFor, supportFor, withOverrides } from './learner.ts';
import { routeFrom } from '../data/curriculum.ts';

let t = 0;
const att = (activityId: string, kind: 'practice' | 'independent', onTime: number, expected = 4, extra: Partial<AttemptRecord> = {}): AttemptRecord =>
  ({
    id: `a${t}`,
    createdAt: ++t,
    activityId,
    activityVersion: '1',
    kind,
    instrument: 'drums',
    tempoBpm: 80,
    support: { hintLevel: 0, heardExample: false, largeControls: false, simplified: false, aiEnabled: true, slower: false },
    inputs: [],
    summary: { expected, correctSound: expected, wrong: 0, missed: 0, extra: 0, restViolations: 0, early: 0, onTime, late: expected - onTime, durationOk: 0, durationIssues: 0 },
    passed: onTime === expected,
    ...extra,
  }) as AttemptRecord;
const ctx = (over = {}) => ({ infos: LESSON_INFOS, route: routeFrom('1-2'), aiEnabled: true, ...over });

describe('learner decisions from the Bayesian model', () => {
  it('says "not enough tries" instead of guessing with no evidence', () => {
    const e = estimatesFrom(learnerFrom([]).state);
    expect(e.every((x) => x.uncertain && x.band === 'new' && !x.needsPractice)).toBe(true);
  });
  it('sends a learner who keeps missing the beat back to a beat lesson, with the evidence', () => {
    const tries = [att('L01', 'practice', 1), att('L01', 'practice', 2), att('L02', 'practice', 1)];
    const { planning } = learnerFrom(tries);
    const plan = nextFor(planning, { skills: {} }, ctx({ currentLessonId: 'L02' }));
    expect(plan.provenance).toBe('learner-model');
    expect(plan.next?.reasonId).toBe('practise-pulse');
    expect(plan.next?.evidenceAttemptIds.length).toBeGreaterThan(0);
  });
  it('offers more support (slower, a demonstration) when this lesson’s skill keeps failing', () => {
    const tries = [att('L01', 'practice', 1), att('L01', 'practice', 1), att('L01', 'practice', 2)];
    const s = supportFor(learnerFrom(tries).planning, 'L01', ctx());
    expect(s.start).toContain('slower');
    expect(s.demo).toBe(true);
    expect(s.ready).toBe(false);
  });
  it('offers to go straight to "on your own" when the skill is already shown', () => {
    const tries = [att('L01', 'independent', 4), att('L01', 'independent', 4), att('L01', 'independent', 4), att('L01', 'independent', 4)];
    const s = supportFor(learnerFrom(tries).planning, 'L01', ctx());
    expect(s.ready).toBe(true);
    expect(s.demo).toBe(false);
  });
  it('lets a teacher override: their choice wins and the model estimate is kept for review', () => {
    const tries = [att('L01', 'practice', 1), att('L01', 'practice', 1)];
    const m = learnerFrom(tries, { skills: { pulse: 'secure' } });
    const pulse = m.estimates.find((e) => e.skill === 'pulse')!;
    expect(pulse.override).toBe('secure');
    expect(pulse.needsPractice).toBe(false);
    expect(pulse.p).toBe(learnerFrom(tries).state.skills.pulse.p); // model value unchanged
    expect(withOverrides(m.state, { skills: { pulse: 'secure' } }).skills.pulse.p).toBeGreaterThan(0.8);
    const pinned = nextFor(m.planning, { skills: {}, next: 'D01' }, ctx());
    expect(pinned).toMatchObject({ teacher: true, next: { lessonId: 'D01' } });
  });
  it('falls back to the route when the AI is off', () => {
    const plan = nextFor(learnerFrom([att('L01', 'practice', 1), att('L01', 'practice', 1)]).planning, { skills: {} }, ctx({ aiEnabled: false }));
    expect(plan.provenance).toBe('rules');
  });
});
