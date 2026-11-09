// Pitch facts. Middle C = C4 = MIDI 60. A4 = 440 Hz equal temperament.

const SHARP_NAMES = ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B'];

export function midiToFrequency(midi: number): number {
  return 440 * 2 ** ((midi - 69) / 12);
}

export function midiToName(midi: number): string {
  const octave = Math.floor(midi / 12) - 1;
  return `${SHARP_NAMES[((midi % 12) + 12) % 12]}${octave}`;
}

/** Letter name only (C, D, E…) for child-facing labels. */
export function midiToLetter(midi: number): string {
  return SHARP_NAMES[((midi % 12) + 12) % 12];
}

export function isBlackKey(midi: number): boolean {
  return [1, 3, 6, 8, 10].includes(((midi % 12) + 12) % 12);
}

const LETTER_STEP: Record<string, number> = { C: 0, D: 1, E: 2, F: 3, G: 4, A: 5, B: 6 };

/**
 * Diatonic staff position for natural notes on a treble stave.
 * 0 = bottom line (E4). Each step is a line or space. C4 = -2 (ledger line below), D4 = -1.
 * Returns null for black keys (not used in the foundation lessons).
 */
export function trebleStaffStep(midi: number): number | null {
  if (isBlackKey(midi)) return null;
  const letter = midiToLetter(midi);
  const octave = Math.floor(midi / 12) - 1;
  const diatonic = octave * 7 + LETTER_STEP[letter];
  const e4 = 4 * 7 + LETTER_STEP.E;
  return diatonic - e4;
}

export function describeStaffPosition(midi: number): string {
  const step = trebleStaffStep(midi);
  if (step === null) return 'not shown on this stave';
  if (step < 0) {
    return step % 2 === 0 ? `ledger line ${-step / 2} below the stave` : step === -1 ? 'space below the bottom line' : 'space below the stave';
  }
  if (step > 8) return step % 2 === 0 ? 'ledger line above the stave' : 'space above the stave';
  return step % 2 === 0 ? `line ${step / 2 + 1}` : `space ${(step + 1) / 2}`;
}
