// Words for "tap one big drum with the beat" (L01 foundations). Describes what happened; never a
// score. Taps are given in beats from beat 1 of the click (0 = exactly on beat 1).

/** Median offset from the nearest beat, in beats (negative = before the click). */
export function medianOffset(tapBeats: number[]): number | null {
  if (!tapBeats.length) return null;
  const offs = tapBeats.map((b) => b - Math.round(b)).sort((a, b) => a - b);
  const mid = Math.floor(offs.length / 2);
  return offs.length % 2 ? offs[mid] : (offs[mid - 1] + offs[mid]) / 2;
}

export function pulseWords(tapBeats: number[]): string {
  const taps = tapBeats.filter((b) => b > -0.5);
  if (taps.length === 0) return 'No taps came in. Press Start, listen for two clicks, then tap the drum on each click.';
  if (taps.length < 4) return `${taps.length} tap${taps.length === 1 ? '' : 's'} came in. Try to keep tapping until the clicks stop.`;
  const off = medianOffset(taps)!;
  const near = taps.filter((b) => Math.abs(b - Math.round(b)) <= 0.15).length;
  if (Math.abs(off) <= 0.12) return `${near} of ${taps.length} taps landed with the click. That is a steady beat.`;
  if (off < 0) return `Most taps came a little before the click. Wait for each click, then tap with it.`;
  return `Most taps came a little after the click. Count “1, 2, 3, 4” with the clicks to get ready for the next one.`;
}
