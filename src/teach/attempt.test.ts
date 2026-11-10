import { describe, expect, it } from 'vitest';
import { decide } from '../ai/coach.ts';
import { type CapturedInput, checkAttempt } from '../engine/checker.ts';
import type { Assessment } from '../music/lessons.ts';
import { type MusicEvent, type Phrase, TPQ } from '../music/events.ts';
import { attemptFeedback, unclearAttempt } from './attempt.ts';

const timed: Assessment = { mode: 'timed-onsets', score: true, checkPitch: false, checkTiming: true, checkDuration: false, checkRestViolations: true, onTimeWindow: { beats: 0.2, maxMs: 150 }, durationTolerance: { beats: 0.5, maxMs: 400 } };
const drum = (id: string, beat: number, len: number): MusicEvent => ({ id, kind: 'drum', onset: beat * TPQ, duration: len * TPQ, sound: 'snare', velocity: 0.7 });
const rest = (id: string, beat: number, len: number): MusicEvent => ({ id, kind: 'rest', onset: beat * TPQ, duration: len * TPQ });
const phrase = (events: MusicEvent[], instrument: 'drums' | 'keyboard' = 'drums'): Phrase => ({ id: 'p', instrument, meter: [4, 4], totalTicks: 4 * TPQ, tempoBpm: 60, events });
const taps = (ms: number[], source: CapturedInput['source'] = 'pointer'): CapturedInput[] => ms.map((m, i) => ({ id: `t${i}`, onsetMs: m, source, sound: 'snare' }));

function feedback(target: Phrase, inputs: CapturedInput[], a = timed, opts: { independent?: boolean; input?: 'screen' | 'midi' | 'mic'; ai?: boolean } = {}) {
  const result = checkAttempt(target, inputs, a, 60);
  const decision = decide({ target, inputs, result, aiEnabled: opts.ai ?? false, independentCheck: !!opts.independent, tempoBpm: 60 });
  return attemptFeedback({ target, result, decision, independent: !!opts.independent, input: opts.input ?? 'screen' });
}

const pulse = phrase([0, 1, 2, 3].map((b) => drum(`e${b}`, b, 1)));
// Crotchet, two quavers, minim: different lengths, so the spaces are not meant to be equal.
const mixed = phrase([drum('a', 0, 1), drum('b', 1, 0.5), drum('c', 1.5, 0.5), drum('d', 2, 2)]);
const withRest = phrase([drum('a', 0, 1), drum('b', 1, 1), drum('c', 2, 1), rest('r', 3, 1)]);

describe('feedback for one attempt: one observation, why, one next step', () => {
  it('a tap in a rest names the beat to leave quiet and why the gap matters', () => {
    const f = feedback(withRest, taps([0, 1000, 2000, 3000]));
    expect(f.title).toBe('Beat 4 is a rest');
    expect(f.observed).toMatch(/beat 4, which is a crotchet rest/);
    expect(f.why).toMatch(/Keep counting, but leave that beat silent/);
    expect(f.compare?.kind).toBe('reply');
  });

  it('never tells a learner to make every space the same in a rhythm of different lengths', () => {
    // Quavers rushed and the minim late: uneven against the beat.
    const f = feedback(mixed, taps([0, 820, 1380, 2300]));
    const words = `${f.title} ${f.observed} ${f.why}`;
    expect(words).not.toMatch(/same distance|every space|spaces the same|even spaces/i);
    expect(words).toMatch(/crotchets|quavers|minims/);
  });

  it('an evenly spaced pattern can be about equal spaces', () => {
    const f = feedback(pulse, taps([0, 760, 2240, 2850]));
    expect(`${f.title} ${f.why}`).toMatch(/same/);
  });

  it('getting faster is about holding the speed, and names the rhythm’s lengths', () => {
    const fast = phrase([0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5].map((b, i) => drum(`q${i}`, b, 0.5)));
    const t = [0, 480, 940, 1390, 1830, 2270, 2710, 3150];
    const f = feedback(fast, taps(t));
    expect(f.title).toBe('Hold the speed to the end');
  });

  it('a wrong note names both notes and how they relate', () => {
    const tune = phrase([60, 62, 64].map((m, i) => ({ id: `n${i}`, kind: 'note' as const, onset: i * TPQ, duration: TPQ, midi: m, velocity: 0.7 })), 'keyboard');
    const untimed: Assessment = { ...timed, mode: 'pitch-sequence', checkPitch: true, checkTiming: false };
    const f = feedback(tune, [60, 62, 65].map((m, i) => ({ id: `i${i}`, onsetMs: i * 1000, midi: m, source: 'pointer' as const })), untimed);
    expect(f.title).toBe('Note 3 should be E');
    expect(f.observed).toBe('Note 3 is written as E. You played F.');
    expect(f.why).toMatch(/E is the next note lower than F/);
    // Paired comparison: the two notes can be heard and seen side by side.
    expect(f.pairs).toEqual([{ index: 2, expected: 64, played: 65 }]);
    expect(f.nextLabel).toBe('Try that note');
  });

  it('an attempt that stopped early is asked to carry on, not marked as missing notes', () => {
    const f = feedback(pulse, taps([0, 1000]));
    expect(f.title).toBe('Keep going to the end');
    expect(f.why).not.toMatch(/wrong|mistake/i);
  });

  it('a skipped quaver is named with its place and length', () => {
    const f = feedback(mixed, taps([0, 1000, 2000]));
    expect(f.title).toBe('Play sound 3 too');
    expect(f.why).toMatch(/quaver on the “and” after beat 2/);
  });

  it('microphone takes are worded as what Carmen heard', () => {
    const f = feedback(withRest, taps([0, 1000, 2000, 3000], 'mic'), timed, { input: 'mic' });
    expect(f.observed).toMatch(/^Carmen heard a sound/);
  });

  it('a match in practice leads to trying it on your own; on your own, no comparison is offered', () => {
    const p = feedback(pulse, taps([0, 1000, 2000, 3000]));
    expect(p.next).toBe('independent');
    const ind = feedback(pulse, taps([0, 1000, 2000, 3000]), timed, { independent: true });
    expect(ind.next).toBe('continue');
    expect(ind.compare).toBeUndefined();
    const miss = feedback(withRest, taps([0, 1000, 2000, 3000]), timed, { independent: true });
    expect(miss.compare).toBeUndefined();
  });

  it('no sounds at all is not marked', () => {
    const f = feedback(pulse, []);
    expect(f.tone).toBe('unclear');
    expect(f.why).toMatch(/doesn’t count/);
  });

  it('unclear input and device faults are never the learner’s fault', () => {
    for (const r of ['not-calibrated', 'too-few', 'too-many', 'faint', 'device'] as const) {
      const f = unclearAttempt(r);
      expect(`${f.title} ${f.observed} ${f.why} ${f.advice}`).not.toMatch(/\b(wrong|mistake|your fault|early|late)\b/i);
      expect(f.tone).toBe('unclear');
    }
    expect(unclearAttempt('device').why).toMatch(/not you/);
    expect(unclearAttempt('too-few').advice).toMatch(/screen/);
  });
});

describe('several wrong notes in one attempt', () => {
  it('names every wrong note, not only the first', () => {
    const tune = phrase([60, 62, 64, 60].map((m, i) => ({ id: `n${i}`, kind: 'note' as const, onset: i * TPQ, duration: TPQ, midi: m, velocity: 0.7 })), 'keyboard');
    const untimed: Assessment = { ...timed, mode: 'pitch-sequence', checkPitch: true, checkTiming: false };
    const f = feedback(tune, [60, 65, 67, 60].map((m, i) => ({ id: `i${i}`, onsetMs: i * 1000, midi: m, source: 'pointer' as const })), untimed);
    expect(f.title).toBe('Notes 2 and 3 are different from the written music');
    expect(f.observed).toBe('Note 2 is written as D. You played F. Note 3 is written as E. You played G.');
    expect(f.pairs?.map((p) => p.index)).toEqual([1, 2]);
    expect(f.nextLabel).toBe('Start from note 2');
  });
});
