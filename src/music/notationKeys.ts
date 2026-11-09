// Where each sound is written on the stave. Pure, tested; used by the notation drawing.
// Keyboard: treble stave, VexFlow key "c/4" = middle C, sharps get a ♯ sign.
// Drums: a five-line percussion stave in the usual drum-kit layout, so each drum has its own place.

import type { DrumSound, Phrase } from './events.ts';
import { isBlackKey, midiToLetter } from './theory.ts';

/** VexFlow key for a piano note, without the accidental (the ♯ is drawn as a separate sign). */
export function noteKey(midi: number): string {
  const letter = midiToLetter(midi).replace('♯', '').toLowerCase();
  return `${letter}/${Math.floor(midi / 12) - 1}`;
}

/** The accidental to draw for a piano note, or null for a white key. */
export function accidentalFor(midi: number): '#' | null {
  return isBlackKey(midi) ? '#' : null;
}

export interface DrumPlace {
  /** VexFlow key on a five-line percussion stave ("/x" = cross-shaped head). */
  key: string;
  /** Plain words for the key under the music. */
  where: string;
}

// Common drum-kit notation: bass drum bottom space, snare middle space, cymbals with crosses on top.
export const DRUM_STAVE: Record<DrumSound, DrumPlace> = {
  kick: { key: 'f/4', where: 'bottom note' },
  tomLow: { key: 'a/4', where: 'low note' },
  snare: { key: 'c/5', where: 'middle note' },
  tomHigh: { key: 'e/5', where: 'high note' },
  hihat: { key: 'g/5/x', where: 'cross near the top' },
  crash: { key: 'a/5/x', where: 'cross at the top' },
  clave: { key: 'd/5/x', where: 'cross in the middle' },
};

/** The different drum sounds a phrase uses, in order of first appearance. */
export function drumSoundsIn(phrase: Phrase): DrumSound[] {
  const out: DrumSound[] = [];
  for (const e of phrase.events) if (e.kind === 'drum' && !out.includes(e.sound)) out.push(e.sound);
  return out;
}
