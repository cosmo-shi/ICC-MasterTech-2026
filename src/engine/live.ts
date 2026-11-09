// Live marks for the notation while the learner plays: right, wrong, missed, early or late,
// note by note, as it happens. These are a quick guide only; the checker's result at the end
// (src/engine/checker.ts) is the record, and can differ slightly because it looks at the whole attempt.

import { type Phrase, soundingEvents, ticksToMs } from '../music/events.ts';
import type { Assessment } from '../music/lessons.ts';
import { type CapturedInput, candidateWindowMs, sameSound, soundMattersFor } from './checker.ts';

export type LiveMark = 'ok' | 'wrong' | 'missed' | 'early' | 'late' | null;

/**
 * One mark per sounding note of the target (null = not played yet).
 * - Untimed tasks: the n-th note played is compared with the n-th note of the music.
 * - Timed tasks: each tap is matched to the nearest unmarked note within the checker's window;
 *   a note whose window has passed with no tap is marked missed. `nowMs` is time since beat 0.
 */
export function liveMarks(target: Phrase, inputs: readonly CapturedInput[], a: Assessment, tempoBpm: number, nowMs: number | null): LiveMark[] {
  const expected = soundingEvents(target);
  const marks: LiveMark[] = expected.map(() => null);
  const soundMatters = soundMattersFor(expected, a);
  const sorted = [...inputs].sort((x, y) => x.onsetMs - y.onsetMs);

  if (!a.checkTiming) {
    sorted.slice(0, expected.length).forEach((inp, i) => {
      marks[i] = !soundMatters || sameSound(expected[i], inp) ? 'ok' : 'wrong';
    });
    return marks;
  }

  const beatMs = 60000 / tempoBpm;
  const onTimeMs = Math.min(a.onTimeWindow.beats * beatMs, a.onTimeWindow.maxMs);
  const window = candidateWindowMs(expected, tempoBpm, onTimeMs);
  const onsets = expected.map((e) => ticksToMs(e.onset, tempoBpm));

  for (const inp of sorted) {
    let best = -1;
    let bestD = Infinity;
    onsets.forEach((t, i) => {
      const d = Math.abs(inp.onsetMs - t);
      if (marks[i] === null && d <= window && d < bestD) {
        best = i;
        bestD = d;
      }
    });
    if (best < 0) continue; // an extra tap: shown in the summary at the end, not on a note
    const off = inp.onsetMs - onsets[best];
    if (soundMatters && !sameSound(expected[best], inp)) marks[best] = 'wrong';
    else marks[best] = Math.abs(off) <= onTimeMs ? 'ok' : off < 0 ? 'early' : 'late';
  }

  if (nowMs !== null) {
    onsets.forEach((t, i) => {
      if (marks[i] === null && nowMs > t + window) marks[i] = 'missed';
    });
  }
  return marks;
}
