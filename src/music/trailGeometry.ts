// Geometry for the "what you played" stave (NoteTrail). Pure, so it can be tested without a canvas.
// Positions count stave steps from the bottom line (0) up: 8 is the top line, -2 is middle C's ledger line
// in treble clef. The stave grows or shrinks so every visible note, its ledger lines and its sharp fit
// inside the canvas instead of being cut off at the top or bottom (brief 11 Nov, 9B: D♯ cut off).

export interface TrailGeometry {
  /** Distance between two stave lines, in CSS px. */
  gap: number;
  /** y (CSS px) of a stave position. */
  yOf: (pos: number) => number;
}

export const TRAIL_MIN_GAP = 2.5;
export const TRAIL_MAX_GAP = 14;

export function trailGeometry(height: number, positions: readonly number[], letters: boolean): TrailGeometry {
  const labelH = letters ? 18 : 0;
  // Always leave room for middle C's ledger line below and one step above the top line,
  // plus half a step for the note head itself.
  const hi = Math.max(9, ...positions) + 1;
  const lo = Math.min(-3, ...positions) - 1;
  const usable = Math.max(1, height - labelH - 4);
  const steps = (hi - lo) / 2;
  const gap = Math.max(TRAIL_MIN_GAP, Math.min(TRAIL_MAX_GAP, usable / steps));
  const contentH = steps * gap;
  const top = 2 + Math.max(0, (usable - contentH) / 2);
  const zero = top + (hi / 2) * gap;
  return { gap, yOf: (pos: number) => zero - (pos * gap) / 2 };
}
