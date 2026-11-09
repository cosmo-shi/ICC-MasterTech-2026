// Making your own phrase from a lesson's idea. The learner makes one decision per beat, and the
// choices on offer are the concept the lesson practised (where the rests go, one or two sounds,
// which drum, which note, short or long). Cells become canonical events, so the same event list
// drives sound, notation and saving.

import { type DrumSound, type InstrumentId, type MusicEvent, type Phrase, soundingEvents } from './events.ts';
import { midiToLetter } from './theory.ts';

export type MakeConcept = 'rests' | 'subdivision' | 'drums' | 'notes' | 'length';

export interface Choice {
  id: string;
  label: string;
}

export interface MakeSpec {
  concept: MakeConcept;
  /** The decision, in a child's words. */
  ask: string;
  choices: Choice[];
  instrument: InstrumentId;
  beats: number;
  /** The sound used for 'rests', 'subdivision' and 'length' cells. */
  drum: DrumSound;
  midi: number;
}

const DRUMS: Choice[] = [
  { id: 'kick', label: 'Bass' },
  { id: 'snare', label: 'Snare' },
  { id: 'hihat', label: 'Hi-hat' },
];

/** What the learner decides, from the lesson's skills and its written music. */
export function makeSpec(skills: string[], source: Phrase): MakeSpec {
  const s = soundingEvents(source);
  const beats = Math.max(4, Math.min(8, Math.round(source.totalTicks / 480)));
  const firstDrum = s.find((e) => e.kind === 'drum');
  const drum: DrumSound = firstDrum && firstDrum.kind === 'drum' ? firstDrum.sound : 'kick';
  const firstNote = s.find((e) => e.kind === 'note');
  const midi = firstNote && firstNote.kind === 'note' ? firstNote.midi : 60;
  const base = { instrument: source.instrument, beats, drum, midi };
  if (skills.includes('pitch') || skills.includes('reading')) {
    const midis = [...new Set(s.filter((e) => e.kind === 'note').map((e) => (e as { midi: number }).midi))].sort((a, b) => a - b);
    const notes = (midis.length >= 2 ? midis : [60, 62, 64]).slice(0, 5);
    return { ...base, instrument: 'keyboard', concept: 'notes', ask: 'Choose a note for each beat.', choices: [...notes.map((m) => ({ id: `n${m}`, label: midiToLetter(m) })), { id: 'rest', label: 'Rest' }] };
  }
  if (skills.includes('duration')) return { ...base, concept: 'length', ask: 'Short or long? A long note lasts two beats.', choices: [{ id: 'short', label: 'Short' }, { id: 'long', label: 'Long' }, { id: 'rest', label: 'Rest' }] };
  if (skills.includes('subdivision')) return { ...base, concept: 'subdivision', ask: 'One sound, two quick sounds, or a rest on each beat?', choices: [{ id: 'one', label: 'One' }, { id: 'two', label: 'Two' }, { id: 'rest', label: 'Rest' }] };
  if (skills.includes('rests')) return { ...base, concept: 'rests', ask: 'Choose where the rests go.', choices: [{ id: 'one', label: 'Sound' }, { id: 'rest', label: 'Rest' }] };
  if (source.instrument === 'drums') return { ...base, concept: 'drums', ask: 'Choose a drum for each beat.', choices: [...DRUMS, { id: 'rest', label: 'Rest' }] };
  return { ...base, concept: 'rests', ask: 'Choose where the rests go.', choices: [{ id: 'one', label: 'Sound' }, { id: 'rest', label: 'Rest' }] };
}

/** Read a phrase into one cell per beat (to start from the lesson's music or the learner's own). */
export function cellsFrom(p: Phrase, spec: MakeSpec): string[] {
  const s = soundingEvents(p);
  const cells: string[] = [];
  for (let b = 0; b < spec.beats; b++) {
    const lo = b * 480;
    const here = s.filter((e) => e.onset >= lo - 60 && e.onset < lo + 420);
    const held = s.some((e) => e.onset < lo - 60 && e.onset + e.duration > lo + 120);
    if (spec.concept === 'length' && held && cells[b - 1] === 'long') {
      cells.push('held');
      continue;
    }
    if (!here.length) {
      cells.push(held && spec.concept === 'length' ? 'held' : 'rest');
      continue;
    }
    const e = here[0];
    switch (spec.concept) {
      case 'subdivision':
        cells.push(here.length >= 2 ? 'two' : 'one');
        break;
      case 'drums':
        cells.push(e.kind === 'drum' && DRUMS.some((d) => d.id === e.sound) ? e.sound : 'kick');
        break;
      case 'notes': {
        const want = e.kind === 'note' ? `n${e.midi}` : '';
        cells.push(spec.choices.some((c) => c.id === want) ? want : spec.choices[0].id);
        break;
      }
      case 'length':
        cells.push(e.duration >= 900 && b < spec.beats - 1 ? 'long' : 'short');
        break;
      default:
        cells.push('one');
    }
  }
  // A 'long' that ends up on the last beat cannot last two beats.
  return cells.map((c, i) => (c === 'long' && i === spec.beats - 1 ? 'short' : c));
}

/** Set one beat. A long note takes the next beat too; changing a held beat shortens the long one. */
export function setCell(cells: string[], i: number, id: string): string[] {
  const next = [...cells];
  if (next[i] === 'held' && i > 0) next[i - 1] = 'short';
  if (next[i] === 'long' && next[i + 1] === 'held') next[i + 1] = 'rest';
  if (id === 'long') {
    if (i >= next.length - 1) return next;
    if (next[i + 1] === 'long' && next[i + 2] === 'held') next[i + 2] = 'rest';
    next[i] = 'long';
    next[i + 1] = 'held';
    return next;
  }
  next[i] = id;
  return next;
}

/** Cells to canonical events. */
export function cellsToPhrase(cells: string[], spec: MakeSpec, tempoBpm: number, id = 'made'): Phrase {
  const events: MusicEvent[] = [];
  let n = 0;
  const snd = (onset: number, duration: number, choice?: string): MusicEvent =>
    spec.instrument === 'drums'
      ? { id: `${id}-${n++}`, kind: 'drum', onset, duration, sound: (choice && DRUMS.some((d) => d.id === choice) ? choice : spec.drum) as DrumSound, velocity: 0.75, author: 'learner' }
      : { id: `${id}-${n++}`, kind: 'note', onset, duration, midi: choice?.startsWith('n') ? Number(choice.slice(1)) : spec.midi, velocity: 0.75, author: 'learner' };
  cells.forEach((c, b) => {
    const t = b * 480;
    if (c === 'held') return;
    if (c === 'rest') events.push({ id: `${id}-${n++}`, kind: 'rest', onset: t, duration: 480, author: 'learner' });
    else if (c === 'two') events.push(snd(t, 240), snd(t + 240, 240));
    else if (c === 'long') events.push(snd(t, 960));
    else if (spec.concept === 'drums' || spec.concept === 'notes') events.push(snd(t, 480, c));
    else events.push(snd(t, 480));
  });
  return { id, instrument: spec.instrument, meter: [4, 4], totalTicks: spec.beats * 480, tempoBpm, events };
}

/** What changed between two versions, in words (for comparing versions). */
export function describeChanges(a: string[], b: string[], spec: MakeSpec): string[] {
  const label = (id: string) => (id === 'held' ? 'held on' : (spec.choices.find((c) => c.id === id)?.label ?? id).toLowerCase());
  const out: string[] = [];
  b.forEach((c, i) => {
    if (a[i] !== c) out.push(`Beat ${i + 1}: ${label(a[i])} → ${label(c)}`);
  });
  return out;
}
