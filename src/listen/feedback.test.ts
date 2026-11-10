import { describe, expect, it } from 'vitest';
import { checkAttempt, type CapturedInput } from '../engine/checker.ts';
import type { Assessment } from '../music/lessons.ts';
import { type Phrase, TPQ } from '../music/events.ts';
import { describeTaps, rhythmFeedback, unclearFeedback } from './feedback.ts';

const A: Assessment = { mode: 'timed-onsets', score: true, checkPitch: false, checkTiming: true, checkDuration: false, checkRestViolations: true, onTimeWindow: { beats: 0.2, maxMs: 150 }, durationTolerance: { beats: 0.5, maxMs: 400 } };
const four: Phrase = { id: 'p', instrument: 'drums', meter: [4, 4], totalTicks: 4 * TPQ, tempoBpm: 60, events: [0, 1, 2, 3].map((b) => ({ id: `e${b}`, kind: 'drum' as const, onset: b * TPQ, duration: TPQ, sound: 'snare' as const, velocity: 0.7 })) };
const taps = (ms: number[]): CapturedInput[] => ms.map((m, i) => ({ id: `t${i}`, onsetMs: m, source: 'mic', sound: 'snare', soundUnknown: true }));

describe('rhythm feedback: what happened, why it matters, one next step', () => {
  it('names early taps by number and suggests counting', () => {
    const f = rhythmFeedback(checkAttempt(four, taps([0, 1000, 1700, 2700]), A, 60));
    expect(f.what).toBe('Your taps 3 and 4 came before the beat.');
    expect(f.why).toMatch(/spaces between taps even/);
    expect(f.next).toMatch(/counting/);
    expect(f.slower).toBe(true);
  });
  it('says when every tap was with the beat', () => {
    expect(rhythmFeedback(checkAttempt(four, taps([0, 1000, 2000, 3000]), A, 60)).what).toBe('Every tap landed with the beat.');
  });
  it('counts what was heard against the rhythm when taps are missing', () => {
    expect(rhythmFeedback(checkAttempt(four, taps([0]), A, 60)).what).toBe('Carmen heard 1 tap; the rhythm has 4.');
  });
  it('never blames the learner for an unclear take', () => {
    for (const r of ['not-calibrated', 'too-few', 'too-many', 'faint', 'device'] as const) {
      const f = unclearFeedback(r);
      expect(f.what).not.toMatch(/\b(wrong|mistake|early|late)\b/i);
      expect(`${f.why} ${f.next}`).not.toMatch(/wrong|mistake|your fault/i);
    }
    expect(unclearFeedback('device').why).toMatch(/not you/);
  });
});

describe('free tapping is described, not marked', () => {
  it('describes even spacing and pace', () => {
    expect(describeTaps([0, 0.5, 1, 1.5, 2].map((time) => ({ time })))).toBe('5 taps in 2 seconds. The spaces between them were very even, about 120 taps a minute.');
  });
  it('describes uneven spacing as a choice, not an error', () => {
    const d = describeTaps([0, 0.2, 1, 1.1, 2.4].map((time) => ({ time })));
    expect(d).toMatch(/changed, which can make a rhythm of its own/);
    expect(d).not.toMatch(/wrong|uneven/);
  });
});
