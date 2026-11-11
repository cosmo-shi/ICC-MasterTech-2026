// Grouping notes into chords for drawing (post-main brief, section 6).
// Notes that start together are one musical event (a chord): one column, one stem, stacked heads.
// Notes played one after another stay separate events, spaced so they never sit on top of each other.
// Display only: the recorded events and the sound are never changed.

import type { MusicEvent } from './events.ts';

/** Notes whose onsets are this close (in ticks, a demisemiquaver) are written as one chord.
 *  A person pressing three keys "together" lands them within about 30 ms of each other. */
export const CHORD_TICKS = 60;
/** The same rule in real time, for the live note trail. */
export const CHORD_MS = 70;

export type ChordEvent = MusicEvent & { chord?: number[] };

/** Merge sounding notes that start within CHORD_TICKS of a chord's first note into that chord.
 *  `chord` lists every pitch, lowest first. The chord lasts as long as its longest note. */
export function groupChords(sounding: readonly MusicEvent[]): ChordEvent[] {
  const out: ChordEvent[] = [];
  for (const e of [...sounding].sort((a, b) => a.onset - b.onset)) {
    const last = out[out.length - 1];
    if (last && last.kind === 'note' && e.kind === 'note' && e.onset - last.onset <= CHORD_TICKS) {
      const midis = last.chord ?? [last.midi];
      if (!midis.includes(e.midi)) last.chord = [...midis, e.midi].sort((a, b) => a - b);
      last.duration = Math.max(last.duration, e.onset + e.duration - last.onset);
      continue;
    }
    out.push({ ...e });
  }
  return out;
}

/** Live trail: group notes that start within `windowMs` of a column's first note. */
export function trailColumns<T extends { start: number; end?: number }>(notes: readonly T[], windowMs = CHORD_MS): { start: number; end?: number; items: T[] }[] {
  const cols: { start: number; end?: number; items: T[] }[] = [];
  for (const n of [...notes].sort((a, b) => a.start - b.start)) {
    const c = cols[cols.length - 1];
    if (c && n.start - c.start <= windowMs) {
      c.items.push(n);
      c.end = c.end === undefined || n.end === undefined ? undefined : Math.max(c.end, n.end);
    } else cols.push({ start: n.start, end: n.end, items: [n] });
  }
  return cols;
}

/** Spread columns so neighbours are at least `gap[i]` apart (gap between column i and i+1).
 *  The newest column stays at its true time; older ones move left only when they would collide. */
export function spaceColumns(timeX: readonly number[], gap: readonly number[]): number[] {
  const x = [...timeX];
  for (let i = x.length - 2; i >= 0; i--) x[i] = Math.min(x[i], x[i + 1] - gap[i]);
  return x;
}

/** Note heads a second apart cannot share a place: the upper one of each pair moves to the
 *  other side of the stem (stem up). Input: stave positions, lowest first. Output: 0 = normal, 1 = moved. */
export function headSides(positions: readonly number[]): (0 | 1)[] {
  const out: (0 | 1)[] = [];
  positions.forEach((p, i) => {
    out.push(i > 0 && p - positions[i - 1] === 1 && out[i - 1] === 0 ? 1 : 0);
  });
  return out;
}

/** Sharps in a chord stack in columns to the left so they never touch. Input: stave positions of the
 *  notes that need a sharp, highest first. Output: column for each (0 = nearest the heads).
 *  A sharp is about three stave spaces tall (six positions). */
export function accidentalColumns(positions: readonly number[]): number[] {
  const placed: { pos: number; col: number }[] = [];
  return positions.map((p) => {
    let col = 0;
    while (placed.some((q) => q.col === col && Math.abs(q.pos - p) < 6)) col++;
    placed.push({ pos: p, col });
    return col;
  });
}
