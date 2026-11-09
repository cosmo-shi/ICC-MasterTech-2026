// Bar layout for drawing notation.

import type { MusicEvent } from './events.ts';

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
