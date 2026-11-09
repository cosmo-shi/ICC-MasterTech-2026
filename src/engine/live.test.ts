import { describe, expect, it } from 'vitest';
import seed from '../data/lessons.seed.json';
import { parseLessons } from '../music/lessons.ts';
import { type Phrase, soundingEvents, ticksToMs } from '../music/events.ts';
import type { CapturedInput } from './checker.ts';
import { liveMarks } from './live.ts';

const lessons = parseLessons(seed);
const L = (id: string) => lessons.find((l) => l.id === id)!;

function notesInput(p: Phrase, change: (i: number, midi: number) => number | null, shiftMs: (i: number) => number = () => 0): CapturedInput[] {
  return soundingEvents(p).flatMap((e, i) => {
    const midi = change(i, (e as { midi: number }).midi);
    if (midi === null) return [];
    return [{ id: `i${i}`, onsetMs: ticksToMs(e.onset, p.tempoBpm) + shiftMs(i), releaseMs: ticksToMs(e.onset + e.duration, p.tempoBpm) - 20, midi, source: 'pointer' as const }];
  });
}

describe('live notation marks', () => {
  it('untimed: marks each note as it is played, right or wrong', () => {
    const l = L('L05');
    const p = l.practice!;
    const all = notesInput(p, (i, m) => (i === 1 ? m + 2 : m));
    expect(liveMarks(p, all.slice(0, 2), l.assessment, p.tempoBpm, null)).toEqual(['ok', 'wrong', null, null]);
    expect(liveMarks(p, all, l.assessment, p.tempoBpm, null)).toEqual(['ok', 'wrong', 'ok', 'ok']);
  });

  it('timed: right, wrong, early and late as they happen', () => {
    const l = L('L07');
    const p = l.practice!;
    const beat = 60000 / p.tempoBpm;
    const inputs = notesInput(p, (i, m) => (i === 1 ? m + 1 : m), (i) => (i === 2 ? 0.4 * beat : 0));
    const marks = liveMarks(p, inputs, l.assessment, p.tempoBpm, 99999);
    expect(marks[0]).toBe('ok');
    expect(marks[1]).toBe('wrong');
    expect(marks[2]).toBe('late');
  });

  it('timed: a note is marked missed only once its moment has passed', () => {
    const l = L('L01');
    const p = l.practice!;
    const second = ticksToMs(soundingEvents(p)[1].onset, p.tempoBpm);
    const inputs: CapturedInput[] = [{ id: 'a', onsetMs: 0, sound: 'kick', source: 'pointer' }];
    expect(liveMarks(p, inputs, l.assessment, p.tempoBpm, second)[1]).toBeNull();
    expect(liveMarks(p, inputs, l.assessment, p.tempoBpm, second + 1000)[1]).toBe('missed');
  });

  it('drums: the wrong drum is marked wrong when the music uses more than one drum', () => {
    const l = L('L03');
    const p = l.practice!;
    const inputs: CapturedInput[] = soundingEvents(p).map((e, i) => ({
      id: `i${i}`,
      onsetMs: ticksToMs(e.onset, p.tempoBpm),
      sound: i === 0 ? 'crash' : (e as { sound: 'kick' }).sound,
      source: 'pointer' as const,
    }));
    const marks = liveMarks(p, inputs, l.assessment, p.tempoBpm, 99999);
    expect(marks[0]).toBe('wrong');
    expect(marks.slice(1).every((m) => m === 'ok')).toBe(true);
  });
});
