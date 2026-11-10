// How Carmen's activities are organised: four tracks (shared foundations, piano, drums, create),
// each a sequence with musical goals, prerequisites and the instrument and controls it needs.
// Musical demand (level), reading demand and input demand are separate facts, never an age.
// Draft sequence pending review by a primary music educator.

import type { InstrumentId, Phrase } from '../music/events.ts';
import type { Lesson } from '../music/lessons.ts';
import type { PathwayId } from '../state/prefs.tsx';

export type TrackId = 'foundations' | 'piano' | 'drums' | 'create';
export type InstrumentNeed = InstrumentId | 'either';

export interface Track {
  id: TrackId;
  name: string;
  /** One line for children: what this track is for. */
  about: string;
  instrument: InstrumentNeed;
}

export const TRACKS: Track[] = [
  { id: 'foundations', name: 'Rhythm basics', about: 'Beat, rests and rhythm. Play them on drums or piano.', instrument: 'either' },
  { id: 'piano', name: 'Piano', about: 'Find the notes, read the stave, hold and rest.', instrument: 'keyboard' },
  { id: 'drums', name: 'Drums', about: 'Rock beat, hi-hat and fills.', instrument: 'drums' },
  { id: 'create', name: 'Create', about: 'Make up your own music.', instrument: 'either' },
];

export interface Activity {
  id: string;
  kind: 'lesson' | 'project';
  track: TrackId;
  /** What will I learn? (child-facing, one line) */
  learn: string;
  instrument: InstrumentNeed;
  /** Which controls, per instrument. */
  controls: Partial<Record<InstrumentId, string>>;
  /** Musical demand 1–4: how much is going on in the music. */
  level: 1 | 2 | 3 | 4;
  /** Reading demand: none (listen and copy), symbols (rhythm symbols), stave (notes on lines). */
  reading: 'none' | 'symbols' | 'stave';
  /** Input demand: tap, find keys, hold keys, or make your own. */
  input: 'tap' | 'keys' | 'hold' | 'make';
  /** A concept shared by both instruments, practised on whichever one the learner picks. */
  crossInstrument?: boolean;
  prerequisites: string[];
}

const A = (a: Activity) => a;

export const ACTIVITIES: Activity[] = [
  // Rhythm basics: the same musical idea, with an exercise, controls and score for each instrument.
  A({ id: 'L00', kind: 'lesson', track: 'foundations', learn: 'Make a sound, stop it, then change it.', instrument: 'either', controls: { drums: 'Any drum', keyboard: 'Any key' }, level: 1, reading: 'none', input: 'tap', crossInstrument: true, prerequisites: [] }),
  A({ id: 'L01', kind: 'lesson', track: 'foundations', learn: 'Tap along with a steady beat.', instrument: 'either', controls: { drums: 'Bass drum', keyboard: 'Middle C' }, level: 1, reading: 'symbols', input: 'tap', crossInstrument: true, prerequisites: ['L00'] }),
  A({ id: 'L02', kind: 'lesson', track: 'foundations', learn: 'Leave one beat silent and keep counting.', instrument: 'either', controls: { drums: 'Bass drum', keyboard: 'Middle C' }, level: 1, reading: 'symbols', input: 'tap', crossInstrument: true, prerequisites: ['L01'] }),
  A({ id: 'L03', kind: 'lesson', track: 'foundations', learn: 'Play one crotchet or two quavers on each beat.', instrument: 'either', controls: { drums: 'Snare and bass drum', keyboard: 'Middle C' }, level: 2, reading: 'symbols', input: 'tap', crossInstrument: true, prerequisites: ['L02'] }),
  A({ id: 'F_SOUND_STORY', kind: 'project', track: 'foundations', learn: 'Use loud and soft sounds to tell a story.', instrument: 'either', controls: { drums: 'Any drums', keyboard: 'Any keys' }, level: 1, reading: 'none', input: 'make', crossInstrument: true, prerequisites: ['L00'] }),

  // Piano.
  A({ id: 'L04', kind: 'lesson', track: 'piano', learn: 'Hear which note is higher, then play them in order.', instrument: 'keyboard', controls: { keyboard: 'Keys C, E, G' }, level: 1, reading: 'none', input: 'keys', prerequisites: ['L00'] }),
  A({ id: 'L05', kind: 'lesson', track: 'piano', learn: 'Find the three keys and play them in order.', instrument: 'keyboard', controls: { keyboard: 'Keys C, D, E' }, level: 1, reading: 'none', input: 'keys', prerequisites: ['L04'] }),
  A({ id: 'L06', kind: 'lesson', track: 'piano', learn: 'Read each note on the stave and play its key.', instrument: 'keyboard', controls: { keyboard: 'Keys C, D, E' }, level: 2, reading: 'stave', input: 'keys', prerequisites: ['L05'] }),
  A({ id: 'P01', kind: 'lesson', track: 'piano', learn: 'Play the five notes from C to G, up and down.', instrument: 'keyboard', controls: { keyboard: 'Keys C to G' }, level: 2, reading: 'stave', input: 'keys', prerequisites: ['L05'] }),
  A({ id: 'L07', kind: 'lesson', track: 'piano', learn: 'Hold notes for one beat or two beats.', instrument: 'keyboard', controls: { keyboard: 'Keys C, D, E, held down' }, level: 2, reading: 'stave', input: 'hold', prerequisites: ['L01', 'L05'] }),
  A({ id: 'P34_MELODIC_REPLY', kind: 'project', track: 'piano', learn: 'Play a short tune, then answer it higher or lower.', instrument: 'keyboard', controls: { keyboard: 'Keys' }, level: 2, reading: 'stave', input: 'make', prerequisites: ['L05'] }),
  A({ id: 'L08', kind: 'lesson', track: 'piano', learn: 'Read and play a two-bar melody with rests.', instrument: 'keyboard', controls: { keyboard: 'Keys C, D, E' }, level: 3, reading: 'stave', input: 'hold', prerequisites: ['L02', 'L06', 'L07'] }),
  A({ id: 'P02', kind: 'lesson', track: 'piano', learn: 'Play notes that move to the next key, and notes that skip one.', instrument: 'keyboard', controls: { keyboard: 'Keys C to G' }, level: 3, reading: 'stave', input: 'keys', prerequisites: ['P01', 'L06'] }),
  A({ id: 'P03', kind: 'lesson', track: 'piano', learn: 'Read and play a short tune on the lower notes.', instrument: 'keyboard', controls: { keyboard: 'Low keys, C3 to G3' }, level: 4, reading: 'stave', input: 'keys', prerequisites: ['P02'] }),

  // Drums.
  A({ id: 'D01', kind: 'lesson', track: 'drums', learn: 'Play bass drum on beats 1 and 3, and snare on 2 and 4.', instrument: 'drums', controls: { drums: 'Bass drum and snare' }, level: 2, reading: 'symbols', input: 'tap', prerequisites: ['L01'] }),
  A({ id: 'P12_RHYTHMIC_CONVERSATION', kind: 'project', track: 'drums', learn: 'Hear a rhythm, then play your answer.', instrument: 'drums', controls: { drums: 'Drums' }, level: 2, reading: 'symbols', input: 'make', prerequisites: ['L02'] }),
  A({ id: 'D02', kind: 'lesson', track: 'drums', learn: 'Play steady quavers on the hi-hat with snare on beats 2 and 4.', instrument: 'drums', controls: { drums: 'Hi-hat, snare, bass drum' }, level: 3, reading: 'symbols', input: 'tap', prerequisites: ['D01', 'L03'] }),
  A({ id: 'D03', kind: 'lesson', track: 'drums', learn: 'Play a short tom pattern that ends on the crash cymbal.', instrument: 'drums', controls: { drums: 'Toms, snare, cymbal' }, level: 4, reading: 'symbols', input: 'tap', prerequisites: ['D02'] }),

  // Create.
  A({ id: 'L09', kind: 'lesson', track: 'create', learn: 'Hear a short idea, then make up your own answer.', instrument: 'either', controls: { drums: 'Drums and Record', keyboard: 'Keys and Record' }, level: 2, reading: 'none', input: 'make', crossInstrument: true, prerequisites: [] }),
  A({ id: 'P56_FORM_AND_TEXTURE', kind: 'project', track: 'create', learn: 'Make two different sections and put them in order.', instrument: 'either', controls: { drums: 'Drums and Record', keyboard: 'Keys and Record' }, level: 3, reading: 'symbols', input: 'make', crossInstrument: true, prerequisites: ['L03'] }),
  A({ id: 'OLDER_EXTENSION', kind: 'project', track: 'create', learn: 'Add another part and hear how it changes your piece.', instrument: 'either', controls: { drums: 'Drums and Record', keyboard: 'Keys and Record' }, level: 4, reading: 'stave', input: 'make', crossInstrument: true, prerequisites: ['L08'] }),
];

export const activityById = (id: string) => ACTIVITIES.find((a) => a.id === id);
export const trackById = (id: TrackId) => TRACKS.find((t) => t.id === id)!;
export const trackActivities = (t: TrackId) => ACTIVITIES.filter((a) => a.track === t);

/** Where am I? Position of an activity in its track (1-based) and the track length. */
export function positionInTrack(id: string): { track: Track; index: number; total: number } | null {
  const a = activityById(id);
  if (!a) return null;
  const list = trackActivities(a.track);
  return { track: trackById(a.track), index: list.findIndex((x) => x.id === id) + 1, total: list.length };
}

/** Where a learner starts. A content choice, not an age. */
export const START_AT: Record<PathwayId, { track: TrackId; activity: string }> = {
  F: { track: 'foundations', activity: 'L00' },
  '1-2': { track: 'foundations', activity: 'L01' },
  '3-4': { track: 'piano', activity: 'L04' },
  '5-6': { track: 'piano', activity: 'L07' },
  older: { track: 'drums', activity: 'D01' },
};

/** The lesson route used by the rules fallback: tracks in order, starting from the chosen point. */
export function routeFrom(start: PathwayId | null): string[] {
  const lessons = ACTIVITIES.filter((a) => a.kind === 'lesson').map((a) => a.id);
  if (!start) return lessons;
  const i = lessons.indexOf(START_AT[start].activity);
  return i < 0 ? lessons : [...lessons.slice(i), ...lessons.slice(0, i)];
}

/* ---------- One idea, two instruments ---------- */

const KEY_TEXT: Record<string, { instruction: string; explanation?: string; hints?: string[] }> = {
  L01: { instruction: 'Play middle C on every beat.', hints: ['Did your notes stay with the beat?', 'Tap your foot, then play C with each tap.', 'C on every beat. The key is lit.'] },
  L02: { instruction: 'Play C on the beats with a note. Stay silent on the rests.', hints: ['Which beats were silent?', 'Count the rest in your head, but keep your finger still.', 'C, rest, C, rest. The key is lit.'] },
  L03: { instruction: 'Play C. Fit two quick notes into one beat.', hints: ['Which beat had two notes?', 'Keep the main beat steady while you split it.', 'Listen to the pairs, then copy their spacing. The key is lit.'] },
};

/** The version of a lesson for this instrument. Shared rhythm lessons become a middle-C exercise
 *  on piano, with a treble-clef score, so the music on screen matches the controls. */
export function lessonFor(lesson: Lesson, instrument: InstrumentId): Lesson {
  const a = activityById(lesson.id);
  if (!a || a.instrument !== 'either' || instrument !== 'keyboard' || !KEY_TEXT[lesson.id] || !lesson.practice) return lesson;
  const toKeys = (p: Phrase | null): Phrase | null =>
    p && {
      ...p,
      id: `${p.id}-keys`,
      instrument: 'keyboard',
      events: p.events.map((e) => (e.kind === 'drum' ? { id: e.id, kind: 'note' as const, onset: e.onset, duration: e.duration, midi: 60, velocity: e.velocity, author: e.author } : e)),
    };
  const t = KEY_TEXT[lesson.id];
  return {
    ...lesson,
    instruction: t.instruction,
    explanation: t.explanation ?? lesson.explanation,
    hints: lesson.hints.map((h, i) => ({ ...h, text: t.hints?.[i] ?? h.text })),
    practice: toKeys(lesson.practice),
    independent: toKeys(lesson.independent),
    instruments: ['keyboard'],
    assessment: { ...lesson.assessment, checkPitch: true },
    showStave: true,
  };
}

export function instrumentFor(id: string, preferred: InstrumentId): InstrumentId {
  const a = activityById(id);
  if (!a || a.instrument === 'either') return preferred;
  return a.instrument;
}
