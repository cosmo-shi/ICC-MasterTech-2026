import { afterEach, describe, expect, it } from 'vitest';
import { type AttemptEvidence, SKILLS, estimateSkills, learnerModel, nextStep, registerLearnerModel } from './learner.ts';
import { bktLearner, bktUpdate, syncLearnerModel } from './bktLearner.ts';

let t = 0;
function attempt(activityId: string, over: Partial<AttemptEvidence> = {}, s: Partial<NonNullable<AttemptEvidence['summary']>> = {}): AttemptEvidence {
  t += 1;
  return {
    activityId,
    createdAt: t,
    kind: 'practice',
    passed: true,
    hintLevel: 0,
    summary: { expected: 4, correctSound: 4, restViolations: 0, onTime: 4, durationOk: 4, durationIssues: 0, ...s },
    ...over,
  };
}
const est = (attempts: AttemptEvidence[], id: string) => bktLearner.estimate(attempts).find((e) => e.skill === id)!;

afterEach(() => registerLearnerModel(null));

describe('BKT learner model (plugged into sc)', () => {
  it('matches the worked BKT example', () => {
    const k = { pInit: 0.2, pLearn: 0.1, pSlip: 0.1, pGuess: 0.2 };
    expect(bktUpdate(0.2, true, k)).toBeCloseTo(0.57647, 4);
    expect(bktUpdate(0.2, false, k)).toBeCloseTo(0.127273, 4);
  });

  it('gives a valid estimate for every skill, so Carmen never falls back', () => {
    registerLearnerModel(bktLearner);
    const r = estimateSkills([attempt('L01'), attempt('L02', {}, { restViolations: 1 }), attempt('L05'), attempt('L00'), attempt('L09')]);
    expect(r.fellBack).toBe(false);
    expect(r.model.id).toBe('carmen-learner-bkt');
    expect(r.estimates).toHaveLength(SKILLS.length);
  });

  it('lowers rests after repeated taps in rests, and leaves other skills alone', () => {
    const tries = [1, 2, 3].map(() => attempt('L02', {}, { restViolations: 1 }));
    expect(est(tries, 'rests').level).toBeLessThan(0.49);
    expect(est(tries, 'rests').status).toBe('starting');
    expect(est(tries, 'pulse').evidence).toBe(0);
  });

  it('counts help for less', () => {
    const plain = est([attempt('L01')], 'pulse').level;
    const answer = est([attempt('L01', { hintLevel: 3 })], 'pulse').level;
    expect(answer).toBeLessThan(plain);
  });

  it('only calls a skill secure after a pass on their own', () => {
    const practice = Array.from({ length: 15 }, () => attempt('L05'));
    expect(est(practice, 'note-names').status).not.toBe('secure');
    expect(est([...practice, attempt('L05', { kind: 'independent' })], 'note-names').status).toBe('secure');
  });

  it('treats explore and create as taking part, never judged', () => {
    expect(est([attempt('L00', { passed: false })], 'explore').status).toBe('secure');
    expect(est([], 'create').status).toBe('not-yet');
  });

  it('drives the existing next-step suggestion', () => {
    registerLearnerModel(bktLearner);
    const tries = [attempt('L01'), ...[1, 2, 3].map(() => attempt('L02', {}, { restViolations: 1 }))];
    const step = nextStep(['L01', 'L02', 'L03'], estimateSkills(tries).estimates);
    expect(step).toMatchObject({ activityId: 'L02', why: 'practise', skill: 'rests' });
  });

  it('the AI off switch goes back to the built-in tracker', () => {
    syncLearnerModel(true);
    expect(learnerModel().id).toBe('carmen-learner-bkt');
    syncLearnerModel(false);
    expect(learnerModel().kind).toBe('baseline');
  });
});
