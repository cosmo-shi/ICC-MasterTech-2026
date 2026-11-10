import { describe, expect, it } from 'vitest';
import { LESSONS } from '../data/catalog.ts';
import type { MusicEvent, Phrase } from './events.ts';
import { soundingEvents } from './events.ts';
import { validatePhrase } from './lessons.ts';
import { freshRelated, onTheBeat, quietRests, restSpans, verifyVersion, writtenLengths, writtenNotes } from './versions.ts';

const drum = (id: string, onset: number, duration = 480): MusicEvent => ({ id, kind: 'drum', onset, duration, sound: 'kick', velocity: 0.7 });
const note = (id: string, onset: number, midi: number, duration = 480): MusicEvent => ({ id, kind: 'note', onset, duration, midi, velocity: 0.7 });
const phrase = (events: MusicEvent[], instrument: Phrase['instrument'] = 'drums'): Phrase => ({ id: 'p', instrument, meter: [4, 4], totalTicks: 1920, tempoBpm: 80, events });

// Written: sound, rest, sound, rest.
const target = phrase([drum('t1', 0), { id: 'r1', kind: 'rest', onset: 480, duration: 480 }, drum('t2', 960), { id: 'r2', kind: 'rest', onset: 1440, duration: 480 }]);

describe('versions of the learner’s own phrase', () => {
  it('finds the written rests', () => {
    expect(restSpans(target)).toEqual([
      [480, 960],
      [1440, 1920],
    ]);
  });

  it('quiet-rests removes only the sounds in rests and verifies', () => {
    const take = phrase([drum('a', 10), drum('b', 500), drum('c', 950), drum('d', 1500)]);
    const v = quietRests(take, target);
    expect(soundingEvents(v.phrase).map((e) => e.id)).toEqual(['a', 'c']);
    expect(v.touched).toBe(2);
    expect(verifyVersion(take, v, target)).toEqual([]);
    // The original is untouched.
    expect(take.events).toHaveLength(4);
  });

  it('on-the-beat moves onsets only, to written onsets', () => {
    const take = phrase([drum('a', 60), drum('b', 900)]);
    const v = onTheBeat(take, target);
    expect(soundingEvents(v.phrase).map((e) => e.onset)).toEqual([0, 960]);
    expect(verifyVersion(take, v, target)).toEqual([]);
  });

  it('written-notes changes pitch only and needs the same count', () => {
    const t = phrase([note('x', 0, 60), note('y', 480, 62), note('z', 960, 64)], 'keyboard');
    const take = phrase([note('a', 20, 60), note('b', 470, 64), note('c', 990, 64)], 'keyboard');
    const v = writtenNotes(take, t)!;
    expect(soundingEvents(v.phrase).map((e) => (e as { midi: number }).midi)).toEqual([60, 62, 64]);
    expect(soundingEvents(v.phrase).map((e) => e.onset)).toEqual([20, 470, 990]);
    expect(verifyVersion(take, v, t)).toEqual([]);
    expect(writtenNotes(phrase([note('a', 0, 60)], 'keyboard'), t)).toBeNull();
  });

  it('written-lengths changes durations only', () => {
    const t = phrase([note('x', 0, 60, 960), note('y', 960, 62, 960)], 'keyboard');
    const take = phrase([note('a', 0, 60, 300), note('b', 960, 62, 960)], 'keyboard');
    const v = writtenLengths(take, t)!;
    expect(v.touched).toBe(1);
    expect(verifyVersion(take, v, t)).toEqual([]);
  });

  it('the verifier catches an undeclared change', () => {
    const take = phrase([drum('a', 10), drum('b', 500)]);
    const v = quietRests(take, target);
    const tampered = { ...v, phrase: { ...v.phrase, events: v.phrase.events.map((e) => ({ ...e, onset: e.onset + 5 })) } };
    expect(verifyVersion(take, tampered, target)).toContain('kept sounds were changed');
    const added = { ...v, phrase: { ...v.phrase, events: [...v.phrase.events, drum('new', 0)] } };
    expect(verifyVersion(take, added, target)).toContain('a sound was added');
  });
});

describe('fresh related patterns', () => {
  it('every scored lesson gets a valid, different pattern with the same number of sounds', () => {
    for (const l of LESSONS) {
      const src = l.practice ?? l.independent;
      if (!src || !soundingEvents(src).length) continue;
      const f = freshRelated(src, 1);
      expect(validatePhrase(f), l.id).toEqual([]);
      expect(soundingEvents(f).length, l.id).toBe(soundingEvents(src).length);
      expect(f.totalTicks).toBe(src.totalTicks);
      const sig = (p: Phrase) => soundingEvents(p).map((e) => `${e.onset}:${e.kind === 'note' ? e.midi : e.sound}`).join();
      const rot = { ...src, events: src.events.map((e) => ({ ...e, onset: (e.onset + 480) % src.totalTicks })) };
      const invariant = sig(rot).split(',').sort().join() === sig(src).split(',').sort().join();
      if (!invariant) expect(sig(f), l.id).not.toBe(sig(src));
    }
  });
});
