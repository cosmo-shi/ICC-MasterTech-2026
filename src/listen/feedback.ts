// Plain descriptions of free tapping, without marking anything. Teaching words for checked takes
// live in src/teach/attempt.ts (one coach, grounded in the exercise's expected events).

import type { HeardOnset } from './analyser.ts';

/** Free tapping: describe the shape, without marking anything. */
export function describeTaps(onsets: Pick<HeardOnset, 'time'>[]): string {
  if (onsets.length === 0) return 'Nothing heard yet.';
  if (onsets.length === 1) return 'One tap.';
  const span = onsets[onsets.length - 1].time - onsets[0].time;
  const gaps = onsets.slice(1).map((o, i) => o.time - onsets[i].time);
  const mean = gaps.reduce((a, b) => a + b, 0) / gaps.length;
  const sd = Math.sqrt(gaps.reduce((a, g) => a + (g - mean) ** 2, 0) / gaps.length);
  const cv = mean > 0 ? sd / mean : 0;
  const bpm = Math.round(60 / mean);
  const evenness = cv < 0.1 ? 'The spaces between them were very even' : cv < 0.22 ? 'The spaces between them were fairly even' : 'The spaces between them changed, which can make a rhythm of its own';
  const pace = gaps.length >= 3 && cv < 0.22 ? `, about ${bpm} taps a minute` : '';
  return `${onsets.length} taps in ${Math.max(1, Math.round(span))} seconds. ${evenness}${pace}.`;
}
