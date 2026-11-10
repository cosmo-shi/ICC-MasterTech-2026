// Where each sound is written on the stave. One module for the lesson score (VexFlow) and the
// "what you played" trail, so both always agree. Pure and tested (notationKeys.test.ts).
// Keyboard: VexFlow key "c/4" = middle C (MIDI 60); a black key is written as the white key
// below plus a sharp sign. Drums: a five-line percussion stave in the usual drum-kit layout.

import { TPQ, type DrumSound, type Phrase } from './events.ts';
import { isBlackKey, midiToLetter } from './theory.ts';

export type Clef = 'treble' | 'bass';

/** VexFlow key for a piano note, without the accidental (the ♯ is drawn as a separate sign). */
export function noteKey(midi: number): string {
  const letter = midiToLetter(midi).replace('♯', '').toLowerCase();
  return `${letter}/${Math.floor(midi / 12) - 1}`;
}

/** The accidental to draw for a piano note, or null for a white key. */
export function accidentalFor(midi: number): '#' | null {
  return isBlackKey(midi) ? '#' : null;
}

const NATURAL_STEP: Record<number, number> = { 0: 0, 2: 1, 4: 2, 5: 3, 7: 4, 9: 5, 11: 6 };

/** Diatonic step (C4 = 28) and whether the note needs a sharp. */
export function diatonic(midi: number): { step: number; sharp: boolean } {
  const pc = ((midi % 12) + 12) % 12;
  const oct = Math.floor(midi / 12) - 1;
  const sharp = !(pc in NATURAL_STEP);
  return { step: oct * 7 + NATURAL_STEP[sharp ? pc - 1 : pc], sharp };
}

/** Half-space position on a five-line stave: 0 = bottom line, 8 = top line. */
export function stavePosition(midi: number, clef: Clef): number {
  const bottom = clef === 'treble' ? diatonic(64).step : diatonic(43).step; // E4 or G2
  return diatonic(midi).step - bottom;
}

/** Treble for middle and high music, bass when the notes sit mostly below middle C. */
export function clefFor(midis: readonly number[]): Clef {
  if (!midis.length) return 'treble';
  const avg = midis.reduce((a, b) => a + b, 0) / midis.length;
  return avg < 60 ? 'bass' : 'treble';
}

export function clefForPhrase(p: Phrase): Clef {
  return clefFor(p.events.flatMap((e) => (e.kind === 'note' ? [e.midi] : [])));
}

export interface DrumPlace {
  /** VexFlow key on a five-line percussion stave ("/x" = cross-shaped head). */
  key: string;
  /** Half-space position from the bottom line (same scale as stavePosition). */
  pos: number;
  cross: boolean;
  /** Plain words for the key under the music. */
  where: string;
}

// Common drum-kit notation: bass drum in the bottom space, snare in the third space,
// toms around it, cymbals as crosses at the top.
export const DRUM_STAVE: Record<DrumSound, DrumPlace> = {
  kick: { key: 'f/4', pos: 1, cross: false, where: 'bottom space' },
  tomLow: { key: 'a/4', pos: 3, cross: false, where: 'second space' },
  snare: { key: 'c/5', pos: 5, cross: false, where: 'third space' },
  tomHigh: { key: 'e/5', pos: 7, cross: false, where: 'top space' },
  clave: { key: 'd/5/x', pos: 6, cross: true, where: 'cross on the fourth line' },
  hihat: { key: 'g/5/x', pos: 9, cross: true, where: 'cross above the stave' },
  crash: { key: 'a/5/x', pos: 10, cross: true, where: 'cross on the ledger line' },
};

/** The different drum sounds a phrase uses, in order of first appearance. */
export function drumSoundsIn(phrase: Phrase): DrumSound[] {
  const out: DrumSound[] = [];
  for (const e of phrase.events) if (e.kind === 'drum' && !out.includes(e.sound)) out.push(e.sound);
  return out;
}

/** Ticks in one bar of this metre (4/4 = 1920). */
export function barTicks(meter: readonly [number, number]): number {
  return (meter[0] * 4 * TPQ) / meter[1];
}

/** VexFlow duration code for a writable length, or null if it can't be written as one note. */
export const VEX_DURATION: Record<number, string> = { 240: '8', 360: '8d', 480: 'q', 720: 'qd', 960: 'h', 1440: 'hd', 1920: 'w' };
