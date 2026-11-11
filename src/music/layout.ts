// Bar layout for drawing notation.

import type { MusicEvent } from './events.ts';
import { groupChords } from './chords.ts';

const SIZES = [1920, 1440, 960, 720, 480, 240];

/**
 * Events of one bar laid out for drawing: notes shortened to a writable length that
 * stays inside the bar, and silent gaps filled with rests so every note sits at its
 * real beat. Display only; the stored phrase is unchanged.
 */
export function layoutBar(events: readonly MusicEvent[], barStart: number, barLen: number): MusicEvent[] {
  const inBar = events.filter((e) => e.onset >= barStart && e.onset < barStart + barLen).sort((a, b) => a.onset - b.onset);
  const out: MusicEvent[] = [];
  let cursor = barStart;
  const fill = (until: number) => {
    while (until - cursor >= 240) {
      const size = SIZES.find((z) => z <= until - cursor && (cursor - barStart) % Math.min(z, 960) === 0) ?? 240;
      out.push({ id: `gap-${cursor}`, kind: 'rest', onset: cursor, duration: size });
      cursor += size;
    }
    cursor = until;
  };
  inBar.forEach((e, i) => {
    if (e.onset < cursor) return; // chord or overlap: draw the first sound only
    fill(e.onset);
    const next = inBar.slice(i + 1).find((x) => x.onset > e.onset)?.onset ?? barStart + barLen;
    const room = Math.min(e.duration, next - e.onset, barStart + barLen - e.onset);
    const size = SIZES.find((z) => z <= room) ?? 240;
    out.push({ ...e, duration: size });
    cursor = e.onset + size;
  });
  fill(barStart + barLen);
  return out;
}

/** One drawable item in a bar. `tie` = this sound carries on into the next item (draw a tie). */
export type DrawnEvent = MusicEvent & { tie?: boolean; continued?: boolean; chord?: number[] };

const WRITABLE = [1920, 1440, 960, 720, 480, 360, 240, 120];

/** Split a length into writable note values, largest first (e.g. 1200 = 960 + 240). */
export function splitLength(len: number): number[] {
  const out: number[] = [];
  let left = len;
  while (left >= 120) {
    const z = WRITABLE.find((w) => w <= left)!;
    out.push(z);
    left -= z;
  }
  return out;
}

/**
 * Every bar of a phrase laid out for drawing, keeping the true length of each sound:
 * a sound longer than one note value, or one that crosses a barline, is drawn as tied notes.
 * Gaps become rests. Overlapping sounds (chords) draw the first sound only.
 */
export function layoutBars(events: readonly MusicEvent[], totalTicks: number, barLen: number): DrawnEvent[][] {
  const bars: DrawnEvent[][] = [];
  // Notes that start together are one chord (one event with several pitches), not separate notes.
  const sounding = groupChords(events.filter((e) => e.kind !== 'rest'));
  // Clip each sound so it ends by the next onset (one line of music).
  const clipped = sounding
    .filter((e, i) => i === 0 || e.onset >= sounding[i - 1].onset + 1)
    .map((e, i, arr) => ({ e, end: Math.min(e.onset + e.duration, arr[i + 1]?.onset ?? Infinity, totalTicks) }));
  const nBars = Math.max(1, Math.ceil(totalTicks / barLen));
  for (let b = 0; b < nBars; b++) {
    const start = b * barLen;
    const stop = start + barLen;
    const out: DrawnEvent[] = [];
    let cursor = start;
    const rest = (until: number) => {
      for (const z of splitLength(until - cursor)) {
        out.push({ id: `gap-${cursor}`, kind: 'rest', onset: cursor, duration: z });
        cursor += z;
      }
      cursor = until;
    };
    for (const { e, end } of clipped) {
      if (end <= start || e.onset >= stop) continue;
      const from = Math.max(e.onset, start);
      const to = Math.min(end, stop);
      if (from > cursor) rest(from);
      const pieces = splitLength(to - from);
      pieces.forEach((z, i) => {
        const last = i === pieces.length - 1;
        out.push({ ...e, id: `${e.id}@${cursor}`, onset: cursor, duration: z, continued: cursor > e.onset || undefined, tie: !last || (last && to < end) || undefined } as DrawnEvent);
        cursor += z;
      });
      cursor = to;
    }
    if (cursor < stop) rest(stop);
    bars.push(out);
  }
  return bars;
}
