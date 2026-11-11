import { describe, expect, it } from 'vitest';
import { trailGeometry } from './trailGeometry.ts';
import { stavePosition } from './notationKeys.ts';

describe('trailGeometry', () => {
  const fits = (h: number, midis: number[], letters: boolean) => {
    const pos = midis.map((m) => stavePosition(m, 'treble'));
    const g = trailGeometry(h, pos, letters);
    const bottomLimit = h - (letters ? 18 : 0);
    for (const p of pos) {
      const y = g.yOf(p);
      expect(y - g.gap / 2).toBeGreaterThanOrEqual(0); // head top inside
      expect(y + g.gap / 2).toBeLessThanOrEqual(bottomLimit); // head bottom above the letters
    }
    // The five lines are inside too.
    expect(g.yOf(8)).toBeGreaterThanOrEqual(0);
    expect(g.yOf(0)).toBeLessThanOrEqual(bottomLimit);
  };
  it('keeps C4, D♯4, E4, D♯5 and high notes inside a short landscape stave', () => {
    for (const h of [52, 72, 96, 120]) {
      fits(h, [60, 63, 64, 75], true);
      fits(h, [60, 63, 64, 75], false);
      fits(h, [84, 87, 88], true); // C6, D♯6, E6 with ledger lines above
    }
  });
  it('uses a bigger stave when there is more room', () => {
    expect(trailGeometry(110, [63], true).gap).toBeGreaterThan(trailGeometry(56, [63], true).gap);
  });
});
