// Versions of a learner's own phrase, for listening checks and comparisons.
// The original is never changed: every function returns a new phrase plus the one change it
// declares, and `verifyVersion` checks that only that change happened before anything plays.
// These are musical facts about events, separate from anything inferred about the learner.

import { type MusicEvent, type Phrase, type SoundingEvent, isSounding, soundingEvents } from './events.ts';

export type VersionChange = 'quiet-rests' | 'on-the-beat' | 'written-notes' | 'written-lengths';

export interface PhraseVersion {
  phrase: Phrase;
  change: VersionChange;
  /** Plain words for what changed, shown with the version. */
  says: string;
  /** How many sounds the change touched (0 = nothing to change). */
  touched: number;
}

const copy = (p: Phrase, events: MusicEvent[], id: string): Phrase => ({ ...p, id, events: events.map((e) => ({ ...e })) });

/** Silent spans in the written music: places where no written sound is ringing. */
export function restSpans(target: Phrase): [number, number][] {
  const sounding = soundingEvents(target);
  const spans: [number, number][] = [];
  let t = 0;
  for (const e of sounding) {
    if (e.onset > t) spans.push([t, e.onset]);
    t = Math.max(t, e.onset + e.duration);
  }
  if (t < target.totalTicks) spans.push([t, target.totalTicks]);
  return spans;
}

/** Is this onset inside a written rest (with a small margin so an early next note isn't counted)? */
export function inRest(onset: number, spans: [number, number][], margin = 120): boolean {
  return spans.some(([a, b]) => b - a >= 240 && onset >= a + 15 && onset < b - margin);
}

/** The learner's phrase with any sounds inside written rests taken out. Nothing else changes. */
export function quietRests(take: Phrase, target: Phrase): PhraseVersion {
  const spans = restSpans(target);
  const keep = take.events.filter((e) => !(isSounding(e) && inRest(e.onset, spans)));
  const touched = take.events.length - keep.length;
  return { phrase: copy(take, keep, `${take.id}-quiet-rests`), change: 'quiet-rests', says: touched ? `Took out ${touched === 1 ? 'the sound' : `${touched} sounds`} in the rest` : 'No sounds in the rests', touched };
}

/** The learner's sounds, each moved to the nearest written onset. Sound choice, order and length stay. */
export function onTheBeat(take: Phrase, target: Phrase): PhraseVersion {
  const grid = soundingEvents(target).map((e) => e.onset);
  let touched = 0;
  const events = take.events.map((e) => {
    if (!isSounding(e) || !grid.length) return { ...e };
    const near = grid.reduce((best, g) => (Math.abs(g - e.onset) < Math.abs(best - e.onset) ? g : best), grid[0]);
    if (near !== e.onset) touched += 1;
    return { ...e, onset: near, duration: Math.min(e.duration, target.totalTicks - near) };
  });
  return { phrase: copy(take, events, `${take.id}-on-beat`), change: 'on-the-beat', says: touched ? `Moved ${touched === 1 ? 'one sound' : `${touched} sounds`} onto the beat` : 'Already on the beat', touched };
}

/** The learner's rhythm with the written notes in order. Only pitch changes; needs the same number of notes. */
export function writtenNotes(take: Phrase, target: Phrase): PhraseVersion | null {
  const want = soundingEvents(target).filter((e) => e.kind === 'note');
  const mine = soundingEvents(take).filter((e) => e.kind === 'note');
  if (!want.length || want.length !== mine.length) return null;
  const byId = new Map(mine.map((e, i) => [e.id, want[i]]));
  let touched = 0;
  const events = take.events.map((e) => {
    const w = byId.get(e.id);
    if (!w || e.kind !== 'note' || w.kind !== 'note') return { ...e };
    if (w.midi !== e.midi) touched += 1;
    return { ...e, midi: w.midi };
  });
  return { phrase: copy(take, events, `${take.id}-notes`), change: 'written-notes', says: touched ? `Changed ${touched === 1 ? 'one note' : `${touched} notes`} to the written ones` : 'Same notes as written', touched };
}

/** The learner's sounds held for their written lengths. Only duration changes; needs the same count. */
export function writtenLengths(take: Phrase, target: Phrase): PhraseVersion | null {
  const want = soundingEvents(target);
  const mine = soundingEvents(take);
  if (!want.length || want.length !== mine.length) return null;
  const byId = new Map(mine.map((e, i) => [e.id, want[i]]));
  let touched = 0;
  const events = take.events.map((e) => {
    const w = byId.get(e.id);
    if (!w || !isSounding(e)) return { ...e };
    const d = Math.min(w.duration, take.totalTicks - e.onset);
    if (d !== e.duration) touched += 1;
    return { ...e, duration: d };
  });
  return { phrase: copy(take, events, `${take.id}-lengths`), change: 'written-lengths', says: touched ? `Held ${touched === 1 ? 'one note' : `${touched} notes`} for the written length` : 'Lengths already match', touched };
}

const soundOf = (e: SoundingEvent) => (e.kind === 'note' ? `n${e.midi}` : `d${e.sound}`);

/**
 * Check a version against the original: the declared change happened, nothing else did.
 * Returns problems (empty = verified). Used before any version plays.
 */
export function verifyVersion(original: Phrase, v: PhraseVersion, target: Phrase): string[] {
  const problems: string[] = [];
  const a = soundingEvents(original);
  const b = soundingEvents(v.phrase);
  if (v.phrase.totalTicks !== original.totalTicks || v.phrase.meter.join() !== original.meter.join()) problems.push('length or metre changed');
  if (b.some((e) => e.onset < 0 || e.onset + e.duration > v.phrase.totalTicks || e.duration <= 0)) problems.push('a sound falls outside the music');
  const byId = new Map(a.map((e) => [e.id, e]));
  if (b.some((e) => !byId.has(e.id))) problems.push('a sound was added');
  const same = (k: 'onset' | 'duration' | 'sound') => b.every((e) => {
    const o = byId.get(e.id)!;
    return !o || (k === 'sound' ? soundOf(o) === soundOf(e) : o[k] === e[k]);
  });
  switch (v.change) {
    case 'quiet-rests':
      if (!same('onset') || !same('duration') || !same('sound')) problems.push('kept sounds were changed');
      if (b.some((e) => inRest(e.onset, restSpans(target)))) problems.push('a sound is still in a rest');
      break;
    case 'on-the-beat': {
      if (b.length !== a.length) problems.push('the number of sounds changed');
      if (!same('sound')) problems.push('a sound changed');
      const grid = new Set(soundingEvents(target).map((e) => e.onset));
      if (b.some((e) => !grid.has(e.onset))) problems.push('a sound is not on a written onset');
      break;
    }
    case 'written-notes':
      if (b.length !== a.length || !same('onset') || !same('duration')) problems.push('rhythm changed');
      if (b.map(soundOf).join() !== soundingEvents(target).map(soundOf).join()) problems.push('notes are not the written ones');
      break;
    case 'written-lengths':
      if (b.length !== a.length || !same('onset') || !same('sound')) problems.push('more than length changed');
      break;
  }
  return problems;
}

/**
 * A fresh related pattern for practice: the same musical idea in a new place.
 * Rhythms are rotated by a whole number of beats (so rests and quaver pairs move);
 * untimed note tasks keep their notes in a new order. The source is never changed.
 */
export function freshRelated(source: Phrase, seed: number): Phrase {
  const s = soundingEvents(source);
  const beat = 480;
  const beats = Math.round(source.totalTicks / beat);
  const allNotes = s.every((e) => e.kind === 'note');
  if (allNotes && new Set(s.map((e) => e.onset)).size === s.length && s.length >= 3 && new Set(s.map(soundOf)).size > 1) {
    // Same rhythm, notes reordered (rotated so it always differs).
    const k = 1 + (seed % (s.length - 1));
    const midis = s.map((e) => (e as { midi: number }).midi);
    const rotated = [...midis.slice(k), ...midis.slice(0, k)];
    if (rotated.join() !== midis.join()) {
      const ids = new Map(s.map((e, i) => [e.id, rotated[i]]));
      return { ...source, id: `${source.id}-fresh${k}`, events: source.events.map((e) => (e.kind === 'note' && ids.has(e.id) ? { ...e, midi: ids.get(e.id)! } : { ...e })) };
    }
  }
  for (let i = 0; i < beats; i++) {
    const shift = (1 + ((seed + i) % Math.max(1, beats - 1))) * beat;
    const events = source.events
      .map((e) => ({ ...e, id: `${e.id}~`, onset: (e.onset + shift) % source.totalTicks }))
      .filter((e) => e.onset + e.duration <= source.totalTicks)
      .sort((a, b) => a.onset - b.onset);
    const before = soundingEvents(source).map((e) => `${e.onset}${soundOf(e)}`).join();
    const after = events.filter(isSounding).map((e) => `${e.onset}${soundOf(e)}`).join();
    if (events.filter(isSounding).length === s.length && after !== before) return { ...source, id: `${source.id}-fresh${shift}`, events };
  }
  return { ...source, events: source.events.map((e) => ({ ...e })) };
}
