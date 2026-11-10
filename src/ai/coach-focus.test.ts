import { describe, expect, it } from 'vitest';
import seed from '../data/lessons.seed.json';
import { parseLessons } from '../music/lessons.ts';
import { soundingEvents, ticksToMs } from '../music/events.ts';
import { checkAttempt, type CapturedInput } from '../engine/checker.ts';
import { decide } from './coach.ts';

const lesson = parseLessons(seed).find((l) => l.id === 'L08')!;
const target = lesson.practice!;
const tempo = target.tempoBpm;

// L08 checks notes and has rests. A wrong first note AND a tap in a rest.
function attemptWithTwoMistakes(): CapturedInput[] {
  const inputs: CapturedInput[] = soundingEvents(target).map((e, i) => ({
    id: `i${i}`,
    onsetMs: ticksToMs(e.onset, tempo),
    releaseMs: ticksToMs(e.onset + e.duration, tempo) - 10,
    midi: e.kind === 'note' ? (i === 0 ? e.midi + 2 : e.midi) : undefined,
    source: 'pointer' as const,
  }));
  const rest = target.events.find((e) => e.kind === 'rest')!;
  inputs.push({ id: 'in-rest', onsetMs: ticksToMs(rest.onset, tempo), releaseMs: ticksToMs(rest.onset, tempo) + 100, midi: 60, source: 'pointer' });
  return inputs;
}

const inputs = attemptWithTwoMistakes();
const result = checkAttempt(target, inputs, lesson.assessment, tempo);
const base = { target, inputs, result, aiEnabled: true, independentCheck: false, tempoBpm: tempo };

describe('coach focus from the learner model', () => {
  it('keeps the usual order without a hint', () => {
    expect(result.summary.wrong).toBeGreaterThan(0);
    expect(result.summary.restViolations).toBeGreaterThan(0);
    const d = decide(base);
    expect(d.focus).toBe('sound');
    expect(d.focusFromLearner).toBe(false);
  });

  it('asks about a recurring skill first when this attempt shows it', () => {
    const d = decide({ ...base, focusHint: 'rest' });
    expect(d.focus).toBe('rest');
    expect(d.focusFromLearner).toBe(true);
    expect(d.label).toBe('AI coach');
  });

  it('ignores a hint this attempt does not show', () => {
    const d = decide({ ...base, focusHint: 'duration' });
    expect(d.focus).toBe('sound');
    expect(d.focusFromLearner).toBe(false);
  });

  it('ignores hints when the AI is off or during an independent check', () => {
    expect(decide({ ...base, aiEnabled: false, focusHint: 'rest' }).focus).toBe('sound');
    expect(decide({ ...base, independentCheck: true, focusHint: 'rest' }).focus).toBe('sound');
  });
});
