import { describe, expect, it } from 'vitest';
import { LESSONS, MISSIONS } from '../data/catalog.ts';
import { TPQ, type MusicEvent, type Phrase } from './events.ts';
import { layoutBars, splitLength } from './layout.ts';
import { validatePhrase } from './lessons.ts';
import { DRUM_STAVE, VEX_DURATION, accidentalFor, barTicks, clefFor, noteKey, stavePosition } from './notationKeys.ts';

const n = (id: string, midi: number, onset: number, duration = TPQ): MusicEvent => ({ id, kind: 'note', midi, onset, duration, velocity: 0.7 });
const phrase = (events: MusicEvent[], bars = 1): Phrase => ({ id: 'p', instrument: 'keyboard', meter: [4, 4], totalTicks: bars * 4 * TPQ, tempoBpm: 90, events });

describe('piano notes on the stave', () => {
  it('writes middle C as c/4 and keeps octaves right at the B–C boundary', () => {
    expect(noteKey(60)).toBe('c/4');
    expect(noteKey(59)).toBe('b/3');
    expect(noteKey(72)).toBe('c/5');
    expect(noteKey(36)).toBe('c/2');
  });
  it('draws a black key as the white key below plus a sharp (regression: sharps were never drawn)', () => {
    expect(noteKey(61)).toBe('c/4');
    expect(accidentalFor(61)).toBe('#');
    expect(noteKey(70)).toBe('a/4');
    expect(accidentalFor(70)).toBe('#');
    expect(accidentalFor(60)).toBeNull();
  });
  it('places notes on the right line or space', () => {
    expect(stavePosition(64, 'treble')).toBe(0); // E4 bottom line
    expect(stavePosition(77, 'treble')).toBe(8); // F5 top line
    expect(stavePosition(60, 'treble')).toBe(-2); // middle C, first ledger line below
    expect(stavePosition(43, 'bass')).toBe(0); // G2 bottom line of bass stave
    expect(stavePosition(57, 'bass')).toBe(8); // A3 top line of bass stave
    expect(stavePosition(60, 'bass')).toBe(10); // middle C, first ledger line above
  });
  it('chooses the bass clef only when the music sits below middle C', () => {
    expect(clefFor([60, 62, 64])).toBe('treble');
    expect(clefFor([48, 50, 52])).toBe('bass');
    expect(clefFor([])).toBe('treble');
  });
});

describe('drums on a five-line percussion stave', () => {
  it('gives every drum its own place (regression: all drums were drawn on one line)', () => {
    const places = Object.values(DRUM_STAVE).map((p) => p.pos);
    expect(new Set(places).size).toBe(places.length);
    expect(DRUM_STAVE.kick.pos).toBeLessThan(DRUM_STAVE.snare.pos);
    expect(DRUM_STAVE.hihat.cross && DRUM_STAVE.crash.cross).toBe(true);
    expect(DRUM_STAVE.snare.cross || DRUM_STAVE.kick.cross).toBe(false);
  });
});

describe('bar layout keeps true lengths', () => {
  it('splits a held note into tied writable values', () => {
    expect(splitLength(1200)).toEqual([960, 240]);
    const bars = layoutBars([n('a', 60, 0, 1200)], 4 * TPQ, 4 * TPQ);
    const drawn = bars[0].filter((e) => e.kind !== 'rest');
    expect(drawn.map((e) => e.duration)).toEqual([960, 240]);
    expect(drawn[0].tie).toBe(true);
  });
  it('ties a note across the barline instead of cutting it short', () => {
    const bars = layoutBars([n('a', 60, 3 * TPQ, 2 * TPQ)], 8 * TPQ, 4 * TPQ);
    expect(bars[0].at(-1)).toMatchObject({ kind: 'note', duration: TPQ, tie: true });
    expect(bars[1][0]).toMatchObject({ kind: 'note', duration: TPQ, continued: true });
  });
  it('fills every bar exactly, with rests where nothing sounds', () => {
    const bars = layoutBars([n('a', 60, TPQ), n('b', 62, 2.5 * TPQ, TPQ / 2)], 8 * TPQ, 4 * TPQ);
    for (const bar of bars) expect(bar.reduce((s, e) => s + e.duration, 0)).toBe(4 * TPQ);
  });
});

describe('every lesson and project score is musically valid', () => {
  const phrases: [string, Phrase][] = [];
  for (const l of LESSONS) for (const p of [l.practice, l.independent]) if (p) phrases.push([`${l.id}/${p.id}`, p]);
  for (const m of MISSIONS) {
    const mm = m as unknown as Record<string, unknown>;
    for (const v of Object.values(mm)) if (v && typeof v === 'object' && 'events' in (v as object) && 'meter' in (v as object)) phrases.push([`${m.id}`, v as Phrase]);
  }
  it.each(phrases)('%s: structure, bar totals and writable lengths', (_, p) => {
    expect(validatePhrase(p)).toEqual([]);
    for (const bar of layoutBars(p.events, p.totalTicks, barTicks(p.meter))) {
      expect(bar.reduce((s, e) => s + e.duration, 0)).toBe(barTicks(p.meter));
      for (const e of bar) expect(VEX_DURATION[e.duration], `${e.id} length ${e.duration}`).toBeDefined();
    }
    // Instrument-specific events: drum scores contain drums, keyboard scores contain notes.
    for (const e of p.events) if (e.kind !== 'rest') expect(e.kind).toBe(p.instrument === 'drums' ? 'drum' : 'note');
    // Keyboard notes are inside the playable range (C2–C7).
    for (const e of p.events) if (e.kind === 'note') expect(e.midi >= 36 && e.midi <= 96).toBe(true);
  });
});
