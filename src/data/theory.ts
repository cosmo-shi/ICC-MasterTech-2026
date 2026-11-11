// Music theory: the learner-facing reference library, in teaching order (sound and notes, then pitch,
// then time, then expression and form). Short, plain, Australian terms. Wording per the 11 Nov brief.
// Every example is a real event list, so the notation, the sound and the words never disagree.
// Draft wording, pending review by a primary music educator (said in Grown-ups).

import { type DrumSound, type MusicEvent, type Phrase, TPQ } from '../music/events.ts';

export interface TheoryExample {
  label: string;
  phrase: Phrase;
}

export interface TheoryTopic {
  id: string;
  group: (typeof THEORY_GROUPS)[number];
  /** Topics that help to read first (course order, brief 11 Nov section 4). */
  before?: string[];
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
    id: 'sound-silence',
    group: 'Sound and notes',
    title: 'Sound and silence',
    short: 'Music is made of sounds and the silences between them.',
    body: ['A sound starts, lasts for a while and stops. The silence after it is part of the music too.', 'You can make sounds with your voice, your body, objects around you or instruments. Each one sounds different.'],
    examples: [{ label: 'Sound, sound, silence, sound', phrase: keys([n(C4, 0), n(C4, 1), r(2), n(C4, 3)]) }],
    tryLesson: 'L00',
    related: ['what-is-a-note', 'rests'],
  },
  {
    id: 'what-is-a-note',
    group: 'Sound and notes',
    title: 'What is a musical note?',
    short: 'A note is one of the sounds we use to make music. Hear one.',
    body: ['A piano key makes a pitched sound: a note. Each key plays a different note, some higher and some lower.', 'In written music, “note” also means the sign that tells musicians which pitch to play and how long to hold it. Some sounds, like most drums, don’t have a fixed pitch.'],
    before: ['sound-silence'],
    examples: [
      { label: 'One note: C', phrase: keys([n(C4, 0, 2)]) },
      { label: 'Two notes: C, then E', phrase: keys([n(C4, 0, 2), n(E4, 2, 2)]) },
    ],
    tryLesson: 'N01',
    related: ['pitch', 'note-names'],
  },
  {
    id: 'pulse',
    group: 'Keeping time',
    title: 'Steady beat',
    short: 'Hear a regular musical pulse. Can you tap along?',
    body: ['The beat (or pulse) keeps going, even when the music is quiet.', 'You can tap it, clap it, nod to it or walk to it. Most songs you know have a beat you can march to.'],
    examples: [{ label: 'A steady beat', phrase: drums([0, 1, 2, 3, 4, 5, 6, 7].map((b) => d(b % 4 === 0 ? 'kick' : 'snare', b)), 2) }],
    tryLesson: 'B00',
    related: ['tempo', 'metre', 'rhythm'],
  },
  {
    id: 'rhythm',
    group: 'Keeping time',
    title: 'How rhythm works',
    short: 'Make patterns with sounds and silences of different lengths.',
    body: ['Rhythm is the pattern of sounds and silences in time. Notes can last for different lengths, and rests make space in the pattern.', 'In this example, the beat stays steady while the rhythm changes. Listen for the longer sounds, quicker sounds and silent beat.', 'Try saying “ap-ple” evenly, then “wa-ter-mel-on”. Can you hear how the syllables make different patterns? Now clap along with a steady beat. (These are playful speech patterns, not exact note values.)'],
    before: ['pulse'],
    examples: [{ label: 'Hear the rhythm while the beat continues', phrase: drums([d('kick', 0), d('snare', 1, 0.5), d('snare', 1.5, 0.5), d('kick', 2), r(3)], 1) }],
    tryLesson: 'L03',
    related: ['pulse', 'note-values', 'quavers'],
  },
  {
    id: 'tempo',
    group: 'Keeping time',
    title: 'Tempo: fast and slow',
    short: 'Hear how changing the speed changes the music.',
    before: ['pulse'],
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
    group: 'Keeping time',
    title: 'Metronome',
    short: 'Choose a speed and practise following a steady click.',
    body: ['A metronome ticks on every beat at the tempo you choose. Musicians use it to practise keeping steady.', 'In Carmen, turn on the metronome before you record. You will hear four beats first, then play.'],
    examples: [{ label: 'Four beats, then play', phrase: drums([0, 1, 2, 3].map((b) => d('clave', b, 1, 0.6)), 1, 90) }],
    related: ['tempo', 'pulse'],
  },
  {
    id: 'note-values',
    group: 'Keeping time',
    title: 'How long notes last',
    short: 'Some notes last longer than others. Hear a crotchet and a minim in 4/4 time.',
    body: ['The shape of a note tells you how long to hold it. An open note head lasts longer than a filled one.', 'In 4/4 time, where the beat is a crotchet, the note lengths below are counted in beats. In other time signatures the beat can be a different note, so the counts change.'],
    before: ['pulse', 'rhythm'],
    facts: [
      ['Semibreve', '4 beats in 4/4 (an open note, no stem)'],
      ['Minim', '2 beats in 4/4 (an open note with a stem)'],
      ['Crotchet', '1 beat in 4/4 (a filled note with a stem)'],
      ['Quaver', 'half a beat in 4/4 (a filled note with a flag, often joined in pairs)'],
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
    group: 'Keeping time',
    title: 'Crotchets and quavers',
    short: 'Hear one crotchet and two even quavers sharing a beat in this exercise.',
    body: ['In this 4/4 exercise the beat is a crotchet. A quaver lasts half a beat, so two even quavers share one beat. They are often joined by a beam.', 'Count “1, 2, 3 and, 4”: the “and” is the second quaver. Some classes say “ta” for a crotchet and “ti-ti” for two quavers.'],
    before: ['note-values'],
    examples: [{ label: 'ta  ta  ti-ti  ta', phrase: drums([d('snare', 0), d('snare', 1), d('snare', 2, 0.5), d('snare', 2.5, 0.5), d('snare', 3)]) }],
    tryLesson: 'L03',
    related: ['note-values', 'rhythm'],
  },
  {
    id: 'rests',
    group: 'Keeping time',
    title: 'Rests: counting the silence',
    short: 'When you see a rest, keep counting without playing.',
    before: ['rhythm'],
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
    group: 'Keeping time',
    title: 'Bars and 4/4 time',
    short: 'Bar lines divide written music. In 4/4, each bar contains four crotchet beats.',
    body: ['Bar lines divide written music into bars. The time signature at the start says how many beats are in each bar, and which note gets one beat.', 'In 4/4, the top 4 means four beats in a bar and the bottom 4 means each beat is a crotchet. In 3/4 there are three crotchet beats, like a waltz: STRONG-two-three.'],
    before: ['note-values'],
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
    group: 'Discovering notes and pitch',
    title: 'Pitch: hear high and low',
    short: 'Listen to two notes and notice which sounds higher.',
    body: ['Pitch is how high or low a note sounds. It is not the same as loud or soft: a high note can be quiet and a low note can be loud.', 'On a keyboard, keys to the right sound higher and keys to the left sound lower. A tune can step up, step down, leap or stay the same.'],
    before: ['what-is-a-note'],
    examples: [
      { label: 'Going up', phrase: keys([n(C4, 0), n(E4, 1), n(G4, 2), n(C5, 3)]) },
      { label: 'Going down', phrase: keys([n(C5, 0), n(G4, 1), n(E4, 2), n(C4, 3)]) },
    ],
    tryLesson: 'L04',
    related: ['note-names', 'melody'],
  },
  {
    id: 'note-names',
    group: 'Discovering notes and pitch',
    title: 'Meet the note names',
    short: 'In Western note naming, the letters A to G repeat. Hear C, D and E.',
    body: ['Names let musicians talk about pitches: “play E” is quicker than “play the third white key”. In Western music the seven letters A B C D E F G name the white keys, then repeat higher and lower.', 'Find C just to the left of each pair of black keys. Middle C is the C nearest the middle of the keyboard. Other music traditions name and write pitches in other ways.'],
    before: ['pitch'],
    facts: [
      ['Middle C', 'C4, the C near the middle of the keyboard'],
      ['Octave', 'from one C to the next C: eight white keys'],
    ],
    examples: [{ label: 'C D E F G A B C', phrase: keys([C4, D4, E4, F4, G4, A4, B4, C5].map((m, i) => n(m, i * 0.5, 0.5))) }],
    tryLesson: 'L05',
    related: ['pitch', 'stave'],
  },
  {
    id: 'stave',
    group: 'Discovering notes and pitch',
    title: 'Reading the stave',
    short: 'A stave has five lines. A clef helps us identify the written pitches.',
    body: ['Notes sit on the lines or in the spaces of the stave. Under the same clef, higher on the stave means a higher sound.', 'The clef tells you which line is which note. The treble clef (G clef) curls around the G line and is used for higher notes. The bass clef (F clef) puts its two dots around the F line and is used for lower notes, so the same line means a different note in each clef.'],
    before: ['note-names'],
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
    id: 'sharps-flats',
    group: 'Discovering notes and pitch',
    title: 'Sharps, flats and naturals',
    short: 'A sharp raises a note by one semitone. A flat lowers it by one.',
    body: ['A semitone is the smallest step on the keyboard: from one key to the very next key, black or white.', 'C♯ (C sharp) is the black key just to the right of C. The same key can be called D♭ (D flat). A natural (♮) cancels a sharp or flat.', 'A sharp doesn’t always mean a black key: E♯ is played on the white key F, because there is no black key between E and F.'],
    before: ['note-names'],
    facts: [
      ['Sharp (♯)', 'one semitone higher'],
      ['Flat (♭)', 'one semitone lower'],
      ['Natural (♮)', 'back to the plain note'],
    ],
    examples: [{ label: 'C, then C♯', phrase: keys([n(C4, 0, 2), n(61, 2, 2)]) }],
    tryLesson: 'S01',
    related: ['note-names', 'stave'],
  },
  {
    id: 'melody',
    group: 'Discovering notes and pitch',
    title: 'Make a melody',
    short: 'Listen to notes form a musical idea. Then make a short melody of your own.',
    before: ['pitch'],
    body: ['A melody can step to the next note, leap over notes, or repeat a note.', 'Many melodies end on the note they started from, so they feel finished.'],
    examples: [{ label: 'A small melody', phrase: keys([n(E4, 0), n(D4, 1), n(C4, 2), n(D4, 3), n(E4, 4), n(E4, 5), n(E4, 6, 2)], 2) }],
    tryLesson: 'L06',
    related: ['pitch', 'form'],
  },
  {
    id: 'dynamics',
    group: 'Expression and sound',
    title: 'Dynamics: loud and soft',
    short: 'Change how loudly or softly a phrase is played. Hear the difference.',
    body: ['Dynamics are how loudly or softly music is played. The two examples below are the same notes: only the loudness changes, not the pitch.', 'Musicians use Italian words for loud and soft. Changing the loudness can tell a story.'],
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
    group: 'Expression and sound',
    title: 'Timbre: the character of a sound',
    short: 'Hear how two instruments sound different, even when playing at similar loudness.',
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
    title: 'Musical form: A and B',
    short: 'Hear two contrasting musical ideas, then arrange them into a piece.',
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
export const THEORY_GROUPS = ['Sound and notes', 'Discovering notes and pitch', 'Keeping time', 'Expression and sound', 'Building music'] as const;
