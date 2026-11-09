import { afterEach, describe, expect, it } from 'vitest';
import { type AttemptEvidence, baselineLearner, estimateSkills, lessonStars, nextStep, registerLearnerModel, suggestGroups } from './learner.ts';

const att = (activityId: string, onTime: number, kind: AttemptEvidence['kind'] = 'practice', t = 0, extra: Partial<AttemptEvidence> = {}): AttemptEvidence => ({
  activityId,
  createdAt: t,
  kind,
  passed: onTime >= 4,
  hintLevel: 0,
  summary: { expected: 4, correctSound: 4, restViolations: 0, onTime, durationOk: 0, durationIssues: 0 },
  ...extra,
});

const pulse = (atts: AttemptEvidence[]) => baselineLearner.estimate(atts).find((e) => e.skill === 'pulse')!;

afterEach(() => registerLearnerModel(null));

describe('learner model (baseline)', () => {
  it('starts with no evidence', () => {
    const e = pulse([]);
    expect(e.status).toBe('not-yet');
    expect(e.evidence).toBe(0);
  });

  it('rises with good attempts and is only secure after an independent success', () => {
    const practice = [1, 2, 3, 4, 5].map((t) => att('L01', 4, 'practice', t));
    expect(pulse(practice).status).toBe('growing');
    expect(pulse([...practice, att('L01', 4, 'independent', 9)]).status).toBe('secure');
  });

  it('counts hinted attempts for less', () => {
    const plain = pulse([att('L01', 4, 'practice', 1)]).level;
    const hinted = pulse([att('L01', 4, 'practice', 1, { hintLevel: 3 })]).level;
    expect(hinted).toBeLessThan(plain);
  });

  it('suggests practising again when a started skill stays weak', () => {
    const atts = [att('L01', 1, 'practice', 1), att('L01', 0, 'practice', 2)];
    const step = nextStep(['L01', 'L02', 'L03'], baselineLearner.estimate(atts));
    expect(step).toEqual({ activityId: 'L01', why: 'practise', skill: 'pulse' });
  });

  it('moves on once the route skill is secure', () => {
    const atts = [att('L01', 4, 'independent', 1), att('L01', 4, 'independent', 2), att('L01', 4, 'independent', 3), att('L01', 4, 'independent', 4)];
    expect(nextStep(['L01', 'L02'], baselineLearner.estimate(atts)).activityId).toBe('L02');
  });

  it('never judges open tasks', () => {
    const e = baselineLearner.estimate([{ activityId: 'L09', createdAt: 1, kind: 'practice', passed: false, hintLevel: 0 }]).find((x) => x.skill === 'create')!;
    expect(e.status).toBe('secure');
  });

  it('scores lessons out of 3', () => {
    expect(lessonStars([], 'L01')).toBe(0);
    expect(lessonStars([att('L01', 1)], 'L01')).toBe(1);
    expect(lessonStars([att('L01', 4)], 'L01')).toBe(2);
    expect(lessonStars([att('L01', 4, 'independent')], 'L01')).toBe(3);
  });

  it('groups children working on the same skill', () => {
    const weak = baselineLearner.estimate([att('L01', 2, 'practice', 1)]);
    const strong = baselineLearner.estimate([4, 5, 6, 7].map((t) => att('L01', 4, 'independent', t)));
    const g = suggestGroups([
      { id: 'a', estimates: weak },
      { id: 'b', estimates: weak },
      { id: 'c', estimates: strong },
    ]);
    expect(g.find((x) => x.skill === 'pulse')?.children).toEqual(['a', 'b']);
  });
});

describe('plug-in point', () => {
  it('uses a registered model', () => {
    registerLearnerModel({ id: 'live', version: '0.1', kind: 'live', estimate: (a) => baselineLearner.estimate(a).map((e) => ({ ...e, level: 0.5 })) });
    const r = estimateSkills([]);
    expect(r.model.id).toBe('live');
    expect(r.fellBack).toBe(false);
  });

  it('falls back to the baseline when a plugged-in model fails', () => {
    registerLearnerModel({ id: 'broken', version: '0', kind: 'live', estimate: () => { throw new Error('x'); } });
    const r = estimateSkills([]);
    expect(r.model.id).toBe('carmen-elo-baseline');
    expect(r.fellBack).toBe(true);
  });
});
