import { describe, expect, it } from 'vitest';
import { buildLearnerState } from './learner.ts';
import { INFOS, attempt } from './learner.fixtures.ts';
import { coachFocusFor, planNext, reasonText, rulesPlan, startSuggestions, validatePlan, type TailorContext } from './tailor.ts';

const ROUTE = ['L01', 'L02', 'L03', 'L04', 'L05'];
const ctx = (over: Partial<TailorContext> = {}): TailorContext => ({ infos: INFOS, route: ROUTE, aiEnabled: true, ...over });

describe('tailoring planner', () => {
  it('suggests a rest lesson after repeated taps in rests', () => {
    const attempts = [attempt('L01'), ...[1, 2, 3].map(() => attempt('L02', {}, { restViolations: 1 }))];
    const st = buildLearnerState(attempts, INFOS);
    const plan = planNext(st, ctx({ currentLessonId: 'L02' }));
    expect(plan.provenance).toBe('learner-model');
    expect(['L02', 'L03']).toContain(plan.next?.lessonId);
    expect(plan.next?.reasonId).toBe('practise-rests');
    expect(reasonText(plan)).toBe('Your last 3 tries had a tap in a rest.');
  });

  it('moves forward when everything seen is going well', () => {
    const attempts = [...Array.from({ length: 6 }, () => attempt('L01')), attempt('L01', { kind: 'independent' })];
    const st = buildLearnerState(attempts, INFOS);
    const plan = planNext(st, ctx({ currentLessonId: 'L01' }));
    expect(plan.next?.lessonId).toBe('L02');
    expect(plan.next?.reasonId).toBe('move-on');
  });

  it('suggests trying it on their own when nearly there without an independent pass', () => {
    const attempts = Array.from({ length: 8 }, () => attempt('L01'));
    const st = buildLearnerState(attempts, INFOS);
    const plan = planNext(st, ctx({ currentLessonId: 'L01' }));
    expect(plan.next).toMatchObject({ lessonId: 'L01', reasonId: 'try-on-my-own' });
    expect(plan.start).toContain('try-on-my-own');
  });

  it('offers no start suggestions during an independent check', () => {
    const attempts = [1, 2, 3].map(() => attempt('L01', {}, { onTime: 3, early: 5 }));
    const st = buildLearnerState(attempts, INFOS);
    expect(startSuggestions(st, 'L01', ctx())).toContain('slower');
    expect(startSuggestions(st, 'L01', ctx({ independentCheck: true }))).toEqual([]);
    expect(coachFocusFor(st, 'L01', ctx({ independentCheck: true }))).toBeUndefined();
  });

  it('uses the route when the AI is off or there is no evidence yet', () => {
    const st = buildLearnerState([attempt('L02', {}, { restViolations: 1 }), attempt('L02', {}, { restViolations: 1 })], INFOS);
    expect(planNext(st, ctx({ aiEnabled: false, currentLessonId: 'L02' }))).toEqual(rulesPlan(st, ctx({ currentLessonId: 'L02' })));
    const empty = buildLearnerState([], INFOS);
    expect(planNext(empty, ctx()).provenance).toBe('rules');
  });

  it('rejects unknown lessons and fake model provenance', () => {
    const fake = { provenance: 'learner-model' as const, modelId: 'other', modelVersion: '9', next: { lessonId: 'L99', reasonId: 'route' as const, evidenceAttemptIds: [] }, start: [] };
    const problems = validatePlan(fake, ctx());
    expect(problems.some((p) => p.includes('L99'))).toBe(true);
    expect(problems.some((p) => p.includes('provenance'))).toBe(true);
  });

  it('points the coach at the weakest skill in this lesson', () => {
    const st = buildLearnerState([1, 2, 3].map(() => attempt('L02', {}, { restViolations: 1 })), INFOS);
    expect(coachFocusFor(st, 'L02', ctx())).toBe('rest');
  });
});
