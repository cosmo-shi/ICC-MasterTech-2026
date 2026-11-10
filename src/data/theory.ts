// Music words: the learner-facing theory library. Short, plain, Australian terms.
// Every example is a real event list, so the notation, the sound and the words never disagree.
// Draft wording, pending review by a primary music educator (said in Grown-ups).

import { type DrumSound, type MusicEvent, type Phrase, TPQ } from '../music/events.ts';

export interface TheoryExample {
  label: string;
  phrase: Phrase;
}

export interface TheoryTopic {
  id: string;
  group: 'Beat and rhythm' | 'High and low' | 'How it sounds' | 'Building music';
  title: string;
  short: string;
  body: string[];
  /** Small facts, shown as a list (name — what it means). */
  facts?: [string, string][];
  examples: TheoryExample[];
  tryLesson?: string;
  related: string[];
}

let k = 0;
const id = () => `t${k++}`;
const n = (midi: number, beat: number, beats = 1, velocity = 0.7): MusicEvent => ({ id: id(), kind: 'note', midi, onset: beat * TPQ, duration: beats * TPQ, velocity, author: 'lesson' });
const d = (sound: DrumSound, beat: number, beats = 1, velocity = 0.7): MusicEvent => ({ id: id(), kind: 'drum', sound, onset: beat * TPQ, duration: beats * TPQ, velocity, author: 'lesson' });
const r = (beat: number, beats = 1): MusicEvent => ({ id: id(), kind: 'rest', onset: beat * TPQ, duration: beats * TPQ, author: 'lesson' });
const keys = (events: MusicEvent[], bars = 1, tempoBpm = 90): Phrase => ({ id: id(), instrument: 'keyboard', meter: [4, 4], totalTicks: bars * 4 * TPQ, tempoBpm, events });
const drums = (events: MusicEvent[], bars = 1, tempoBpm = 90): Phrase => ({ id: id(), instrument: 'drums', meter: [4, 4], totalTicks: bars * 4 * TPQ, tempoBpm, events });

const C4 = 60, D4 = 62, E4 = 64, F4 = 65, G4 = 67, A4 = 69, B4 = 71, C5 = 72;

export const THEORY: TheoryTopic[] = [
  {
    id: 'pulse',
    group: 'Beat and rhythm',
    title: 'The beat',
    short: 'The steady pulse under the music, like a heartbeat.',
    body: ['The beat (or pulse) keeps going, even when the music is quiet.', 'You can tap it, clap it, nod to it or walk to it. Most songs you know have a beat you can march to.'],
    examples: [{ label: 'A steady beat', phrase: drums([0, 1, 2, 3, 4, 5, 6, 7].map((b) => d(b % 4 === 0 ? 'kick' : 'snare', b)), 2) }],
    tryLesson: 'L01',
    related: ['tempo', 'metre', 'rhythm'],
  },
  {
    id: 'rhythm',
    group: 'Beat and rhythm',
    title: 'Rhythm',
    short: 'The pattern of long and short sounds on top of the beat.',
    body: ['The beat stays the same. The rhythm changes: some sounds are long, some are short, and some beats are silent.', 'Say “Ap-ple pie” or “Wa-ter-mel-on” and you are saying a rhythm.'],
    examples: [{ label: 'A rhythm over the beat', phrase: drums([d('kick', 0), d('snare', 1, 0.5), d('snare', 1.5, 0.5), d('kick', 2), r(3)], 1) }],
    tryLesson: 'L03',
    related: ['pulse', 'note-values', 'quavers'],
  },
  {
    id: 'tempo',
    group: 'Beat and rhythm',
    title: 'Tempo',
    short: 'How fast or slow the beat goes.',
    body: ['Tempo is the speed of the beat. We count it in beats a minute.', 'Slow music might be 60 beats a minute, like a clock ticking. Fast music might be 140.'],
    facts: [
      ['Slow', 'about 60 beats a minute'],
      ['Walking', 'about 100 beats a minute'],
      ['Fast', 'about 140 beats a minute'],
    ],
    examples: [
      { label: 'Slow: 60', phrase: keys([n(C4, 0), n(E4, 1), n(G4, 2), n(C5, 3)], 1, 60) },
      { label: 'Fast: 140', phrase: keys([n(C4, 0), n(E4, 1), n(G4, 2), n(C5, 3)], 1, 140) },
    ],
    related: ['pulse', 'metronome'],
  },
  {
    id: 'metronome',
    group: 'Beat and rhythm',
    title: 'Metronome',
    short: 'A tool that plays a steady beat for you to play along with.',
    body: ['A metronome ticks on every beat at the tempo you choose. Musicians use it to practise keeping steady.', 'In Carmen, turn on the metronome before you record. You will hear four beats first, then play.'],
    examples: [{ label: 'Four beats, then play', phrase: drums([0, 1, 2, 3].map((b) => d('clave', b, 1, 0.6)), 1, 90) }],
    related: ['tempo', 'pulse'],
  },
  {
    id: 'note-values',
    group: 'Beat and rhythm',
    title: 'Long and short notes',
    short: 'Each note shape tells you how many beats it lasts.',
    body: ['The shape of a note tells you how long to hold it. An open note head lasts longer than a filled one.'],
    facts: [
      ['Semibreve', '4 beats (an open note, no stem)'],
      ['Minim', '2 beats (an open note with a stem)'],
      ['Crotchet', '1 beat (a filled note with a stem)'],
      ['Quaver', 'half a beat (a filled note with a flag, often joined in pairs)'],
    ],
    examples: [
      { label: 'Semibreve', phrase: keys([n(C4, 0, 4)]) },
      { label: 'Minims', phrase: keys([n(C4, 0, 2), n(E4, 2, 2)]) },
      { label: 'Crotchets', phrase: keys([n(C4, 0), n(D4, 1), n(E4, 2), n(C4, 3)]) },
      { label: 'Quavers', phrase: keys([0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5].map((b, i) => n([C4, D4, E4, F4, G4, F4, E4, D4][i], b, 0.5))) },
    ],
    tryLesson: 'L07',
    related: ['rests', 'quavers', 'rhythm'],
  },
  {
    id: 'quavers',
    group: 'Beat and rhythm',
    title: 'Two sounds in a beat',
    short: 'Quavers: two even sounds fit in one beat.',
    body: ['A quaver lasts half a beat, so two quavers fill one beat. They are often joined by a beam.', 'Say “ti-ti” for two quavers and “ta” for a crotchet.'],
    examples: [{ label: 'ta  ta  ti-ti  ta', phrase: drums([d('snare', 0), d('snare', 1), d('snare', 2, 0.5), d('snare', 2.5, 0.5), d('snare', 3)]) }],
    tryLesson: 'L03',
    related: ['note-values', 'rhythm'],
  },
  {
    id: 'rests',
    group: 'Beat and rhythm',
    title: 'Rests',
    short: 'A rest is a silence that still counts beats.',
    body: ['A rest tells you to be silent for a time. The beat keeps going while you wait.', 'Each note length has a matching rest: a crotchet rest is one beat of silence.'],
    facts: [
      ['Crotchet rest', '1 beat of silence (a squiggle)'],
      ['Minim rest', '2 beats (a small block sitting on a line)'],
      ['Semibreve rest', 'a whole bar (a small block hanging from a line)'],
    ],
    examples: [{ label: 'Play, play, rest, play', phrase: keys([n(C4, 0), n(C4, 1), r(2), n(C4, 3)]) }],
    tryLesson: 'L02',
    related: ['note-values', 'pulse'],
  },
  {
    id: 'metre',
    group: 'Beat and rhythm',
    title: 'Bars and time signatures',
    short: 'Beats come in groups called bars.',
    body: ['Music is split into bars by bar lines. The time signature at the start says how many beats are in each bar.', '4/4 means four crotchet beats in a bar. 3/4 means three, like a waltz: STRONG-two-three.'],
    facts: [
      ['4/4', 'four crotchet beats in each bar'],
      ['3/4', 'three crotchet beats in each bar'],
      ['Bar line', 'the line that ends each bar'],
    ],
    examples: [{ label: 'Two bars of 4/4', phrase: drums([0, 1, 2, 3, 4, 5, 6, 7].map((b) => d(b % 4 === 0 ? 'kick' : 'hihat', b, 1, b % 4 === 0 ? 0.9 : 0.5)), 2) }],
    related: ['pulse', 'note-values'],
  },
  {
    id: 'pitch',
    group: 'High and low',
    title: 'High and low',
    short: 'Pitch is how high or low a sound is.',
    body: ['Keys to the right on a keyboard sound higher. Keys to the left sound lower.', 'A tune can step up, step down, leap or stay the same.'],
    examples: [
      { label: 'Going up', phrase: keys([n(C4, 0), n(E4, 1), n(G4, 2), n(C5, 3)]) },
      { label: 'Going down', phrase: keys([n(C5, 0), n(G4, 1), n(E4, 2), n(C4, 3)]) },
    ],
    tryLesson: 'L04',
    related: ['note-names', 'melody'],
  },
  {
    id: 'note-names',
    group: 'High and low',
    title: 'Note names',
    short: 'Notes are named with seven letters: C D E F G A B.',
    body: ['After B the letters start again at C. Every white key has a letter.', 'Find C just to the left of each pair of black keys. Middle C is the C nearest the middle of the keyboard.'],
    facts: [
      ['Middle C', 'C4, the C near the middle of the keyboard'],
      ['Octave', 'from one C to the next C: eight white keys'],
      ['Sharp (♯)', 'the key just above, often a black key'],
    ],
    examples: [{ label: 'C D E F G A B C', phrase: keys([C4, D4, E4, F4, G4, A4, B4, C5].map((m, i) => n(m, i * 0.5, 0.5))) }],
    tryLesson: 'L05',
    related: ['pitch', 'stave'],
  },
  {
    id: 'stave',
    group: 'High and low',
    title: 'The stave and clefs',
    short: 'Five lines that show how high or low to play.',
    body: ['Notes sit on the lines or in the spaces of the stave. Higher on the stave means a higher sound.', 'The treble clef (G clef) is used for higher notes. The bass clef (F clef) is used for lower notes.'],
    facts: [
      ['Treble clef', 'curls around the G line'],
      ['Bass clef', 'its two dots sit around the F line'],
      ['Ledger line', 'a short extra line for notes above or below the stave, like middle C'],
    ],
    examples: [{ label: 'Middle C up to G', phrase: keys([n(C4, 0), n(D4, 1), n(E4, 2), n(G4, 3)]) }],
    tryLesson: 'L06',
    related: ['note-names', 'pitch'],
  },
  {
    id: 'melody',
    group: 'High and low',
    title: 'Melody',
    short: 'A tune: notes one after another that make sense together.',
    body: ['A melody can step to the next note, leap over notes, or repeat a note.', 'Many melodies end on the note they started from, so they feel finished.'],
    examples: [{ label: 'A small melody', phrase: keys([n(E4, 0), n(D4, 1), n(C4, 2), n(D4, 3), n(E4, 4), n(E4, 5), n(E4, 6, 2)], 2) }],
    tryLesson: 'L06',
    related: ['pitch', 'form'],
  },
  {
    id: 'dynamics',
    group: 'How it sounds',
    title: 'Loud and soft',
    short: 'Dynamics: how loud or soft the music is.',
    body: ['Musicians use Italian words for loud and soft. Changing the loudness tells a story.'],
    facts: [
      ['piano (p)', 'soft'],
      ['forte (f)', 'loud'],
      ['crescendo', 'getting louder bit by bit'],
      ['decrescendo', 'getting softer bit by bit'],
    ],
    examples: [
      { label: 'piano: soft', phrase: keys([n(C4, 0, 1, 0.25), n(E4, 1, 1, 0.25), n(G4, 2, 2, 0.25)]) },
      { label: 'forte: loud', phrase: keys([n(C4, 0, 1, 1), n(E4, 1, 1, 1), n(G4, 2, 2, 1)]) },
    ],
    tryLesson: 'L00',
    related: ['timbre'],
  },
  {
    id: 'timbre',
    group: 'How it sounds',
    title: 'Tone colour',
    short: 'Timbre: what makes a piano sound different from a drum.',
    body: ['Two instruments can play the same rhythm and still sound different. That difference is called timbre, or tone colour.', 'Drums are untuned: they don’t play a tune. A piano is tuned: each key is a different note.'],
    examples: [
      { label: 'On the piano', phrase: keys([n(C4, 0), n(C4, 1), n(C4, 2, 0.5), n(C4, 2.5, 0.5), n(C4, 3)]) },
      { label: 'On a drum', phrase: drums([d('snare', 0), d('snare', 1), d('snare', 2, 0.5), d('snare', 2.5, 0.5), d('snare', 3)]) },
    ],
    related: ['dynamics'],
  },
  {
    id: 'form',
    group: 'Building music',
    title: 'Form: A and B',
    short: 'How a piece is built from parts.',
    body: ['Give each idea a letter. Repeat it and it is A A. Follow it with something new and it is A B.', 'A B A comes back home: the first idea returns at the end.'],
    facts: [
      ['Motif', 'a short idea that comes back'],
      ['A B', 'an idea, then a different idea'],
      ['A B A', 'an idea, a different idea, then the first idea again'],
      ['Question and answer', 'one phrase asks, the next one answers'],
    ],
    examples: [
      { label: 'A', phrase: keys([n(C4, 0), n(E4, 1), n(G4, 2), n(E4, 3)]) },
      { label: 'B', phrase: keys([n(A4, 0, 0.5), n(A4, 0.5, 0.5), n(G4, 1), n(F4, 2), n(D4, 3)]) },
      { label: 'A again', phrase: keys([n(C4, 0), n(E4, 1), n(G4, 2), n(C4, 3)]) },
    ],
    tryLesson: 'L09',
    related: ['melody'],
  },
];

export const topicById = (topicId: string) => THEORY.find((t) => t.id === topicId);
export const THEORY_GROUPS = ['Beat and rhythm', 'High and low', 'How it sounds', 'Building music'] as const;
