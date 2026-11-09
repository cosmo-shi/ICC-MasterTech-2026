import { describe, expect, it } from 'vitest';
import { band, bktUpdate, buildLearnerState, evidenceWeight, observationsFrom, paramsFor } from './bkt.ts';
import { INFOS, attempt, info } from './learner.fixtures.ts';

describe('BKT update', () => {
  const pr = { pInit: 0.2, pLearn: 0.1, pSlip: 0.1, pGuess: 0.2 };

  it('matches the worked example', () => {
    // pass: posterior = 0.2*0.9 / (0.2*0.9 + 0.8*0.2) = 0.18/0.34 = 0.52941; learn: + (1-0.52941)*0.1 = 0.57647
    expect(bktUpdate(0.2, true, pr)).toBeCloseTo(0.57647, 4);
    // fail: posterior = 0.2*0.1 / (0.2*0.1 + 0.8*0.8) = 0.02/0.66 = 0.030303; learn: + 0.969697*0.1 = 0.127273
    expect(bktUpdate(0.2, false, pr)).toBeCloseTo(0.127273, 4);
  });

  it('moves less for weighted (assisted) evidence', () => {
    const full = bktUpdate(0.2, true, pr, 1);
    const part = bktUpdate(0.2, true, pr, 0.48);
    expect(part).toBeGreaterThan(0.2);
    expect(part).toBeLessThan(full);
  });
});

describe('observations from checker facts', () => {
  it('gives no timing observation for untimed pitch lessons', () => {
    const obs = observationsFrom(attempt('L05', {}, { onTime: 0, early: 8 }), info('L05'));
    expect(obs.map((o) => o.skill)).toEqual(['pitch']);
  });

  it('reads a tap in a rest as a failed rests observation only', () => {
    const obs = observationsFrom(attempt('L02', {}, { restViolations: 1 }), info('L02'));
    expect(obs).toContainEqual({ skill: 'rests', pass: false });
    expect(obs).toContainEqual({ skill: 'pulse', pass: true });
  });

  it('ignores explore and create activities', () => {
    expect(observationsFrom(attempt('L00'), info('L00'))).toEqual([]);
    expect(observationsFrom(attempt('L09'), info('L09'))).toEqual([]);
  });

  it('weights help: answer hint < practice < independent', () => {
    const indep = evidenceWeight(attempt('L01', { kind: 'independent' }));
    const prac = evidenceWeight(attempt('L01'));
    const answer = evidenceWeight(attempt('L01', { support: { hintLevel: 3, heardExample: false, largeControls: false, simplified: false, aiEnabled: true, slower: false } }));
    expect(indep).toBeGreaterThan(prac);
    expect(prac).toBeGreaterThan(answer);
  });
});

describe('learner state', () => {
  it('lowers rests only after repeated rest mistakes', () => {
    const attempts = [1, 2, 3].map(() => attempt('L02', {}, { restViolations: 1 }));
    const st = buildLearnerState(attempts, INFOS);
    expect(st.skills.rests.p).toBeLessThan(paramsFor('rests').pInit);
    expect(st.skills.pulse.p).toBeGreaterThan(paramsFor('pulse').pInit);
    expect(st.skills.pitch.observations).toBe(0);
  });

  it('never calls a skill secure without an independent pass', () => {
    const practice = Array.from({ length: 12 }, () => attempt('L01'));
    const st = buildLearnerState(practice, INFOS);
    expect(st.skills.pulse.p).toBeGreaterThan(0.85);
    expect(band(st.skills.pulse)).toBe('nearly');
    const withCheck = buildLearnerState([...practice, attempt('L01', { kind: 'independent' })], INFOS);
    expect(band(withCheck.skills.pulse)).toBe('secure');
  });

  it('is the same however the attempts arrive', () => {
    const a = [attempt('L01'), attempt('L02', {}, { restViolations: 1 }), attempt('L05', {}, { wrong: 2 })];
    expect(buildLearnerState([...a].reverse(), INFOS)).toEqual(buildLearnerState(a, INFOS));
  });

  it('skips teacher notes and records without checker facts', () => {
    const note = attempt('L03', { note: 'Teacher observation: x', summary: undefined });
    const st = buildLearnerState([note], INFOS);
    expect(st.lessons.L03).toBeUndefined();
    expect(st.attemptsUsed).toBe(0);
  });

  it('skips tries where nothing was played', () => {
    const empty = attempt('L01', { coach: { focus: 'insufficient', label: 'Coach tips', patternSource: 'none' } }, { onTime: 0, missed: 8 });
    expect(buildLearnerState([empty], INFOS).attemptsUsed).toBe(0);
  });
});
