import { describe, expect, it } from 'vitest';
import seed from '../data/lessons.seed.json';
import { parseLessons } from './lessons.ts';
import { DRUM_SOUNDS } from './events.ts';
import { DRUM_STAVE, accidentalFor, drumSoundsIn, noteKey } from './notationKeys.ts';

describe('where notes are written', () => {
  it('puts piano notes on the right line or space', () => {
    expect(noteKey(60)).toBe('c/4'); // middle C, ledger line below the treble stave
    expect(noteKey(64)).toBe('e/4'); // bottom line
    expect(noteKey(67)).toBe('g/4');
    expect(noteKey(72)).toBe('c/5');
  });

  it('writes sharps with a ♯ sign on the white-key letter', () => {
    expect(noteKey(61)).toBe('c/4');
    expect(accidentalFor(61)).toBe('#');
    expect(accidentalFor(60)).toBeNull();
  });

  it('gives every drum its own place on the drum stave', () => {
    const keys = DRUM_SOUNDS.map((s) => DRUM_STAVE[s].key);
    expect(new Set(keys).size).toBe(DRUM_SOUNDS.length);
    expect(DRUM_STAVE.kick.key).toBe('f/4');
    expect(DRUM_STAVE.snare.key).toBe('c/5');
  });

  it('every lesson note is drawn at the pitch the lesson stores', () => {
    for (const l of parseLessons(seed)) {
      for (const ph of [l.practice, l.independent]) {
        for (const e of ph?.events ?? []) {
          if (e.kind !== 'note') continue;
          const [letter, octave] = noteKey(e.midi).split('/');
          const back = { c: 0, d: 2, e: 4, f: 5, g: 7, a: 9, b: 11 }[letter]! + (accidentalFor(e.midi) ? 1 : 0) + (Number(octave) + 1) * 12;
          expect(back).toBe(e.midi);
        }
      }
    }
  });

  it('lists the drums a pattern uses', () => {
    const l03 = parseLessons(seed).find((l) => l.id === 'L03')!;
    expect(drumSoundsIn(l03.practice!)).toEqual(['snare', 'kick']);
  });
});
