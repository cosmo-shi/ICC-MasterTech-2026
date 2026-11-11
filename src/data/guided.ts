// Guided concept lessons (brief 11 Nov 2026, section 5): hear first, then notice, name, show, try,
// check once, and move on. Each lesson ends with one meaningful mini-check; passing it marks the
// concept as explored (an AttemptRecord of kind 'concept'), never as mastered.
// Original Carmen wording. Teaching design informed by Sarrazin, "Music and the Child" (CC BY-NC-SA 4.0)
// and Open Music Theory 2e (CC BY-SA 4.0); see docs/review/SOURCES_REGISTER.md. Draft pending a
// primary music educator. Pitches use scientific pitch names: middle C = C4 = MIDI 60.

export type Beat = 'sound' | 'rest' | 'pair';

export type GuidedStep =
  /** Hear one or more notes on the piano; the keys light up while they sound. */
  | { kind: 'listen'; title: string; say: string; more?: string; notes: number[]; button: string; keys?: [number, number]; /** This step teaches the idea in words first. */ explain?: boolean }
  /** Hear two notes, then answer which is higher (or lower). The mini-check when `check` is set. */
  | { kind: 'compare'; title: string; say: string; first: number; second: number; ask: 'higher' | 'lower'; check?: boolean; good?: string; miss?: string }
  /** Hold a key for a short and a long time: duration is not pitch or loudness. */
  | { kind: 'hold'; title: string; say: string; more?: string; midi: number }
  /** Show the note names on the keys after hearing them. */
  | { kind: 'names'; title: string; say: string; more?: string; notes: number[]; stave?: string }
  /** Find and play these keys in order, with the target lit. */
  | { kind: 'find'; title: string; say: string; notes: number[]; lit: boolean }
  /** Hear a steady pulse (beats light up), then tap along. No timing marks. */
  | { kind: 'pulse'; title: string; say: string; more?: string; bpm: number; beats: number; taps: number }
  /** Hear a rhythm over the same steady pulse. */
  | { kind: 'rhythm'; title: string; say: string; more?: string; bpm: number; pattern: Beat[]; notation?: boolean }
  /** Make a four-beat rhythm from sounds and silences. */
  | { kind: 'build'; title: string; say: string; bpm: number }
  /** Hear two rhythms, choose which one has a silent beat. The mini-check. */
  | { kind: 'which-rest'; title: string; say: string; bpm: number; withRest: Beat[]; without: Beat[]; restBeat: number }
  /** Finish: what you did, concept completed, what's next. */
  | { kind: 'done'; title: string; say: string; next: string };

export interface GuidedLesson {
  id: string;
  version: string;
  title: string;
  /** Learner-facing objective, one plain sentence. */
  objective: string;
  /** Which instrument sound the lesson uses for taps ('either' = the learner's choice). */
  instrument: 'keyboard' | 'either';
  steps: GuidedStep[];
}

const C4 = 60;
const Cs4 = 61;
const D4 = 62;
const E4 = 64;

export const GUIDED: GuidedLesson[] = [
  {
    id: 'N01',
    version: '1.0.0-draft',
    title: 'What is a musical note?',
    objective: 'Hear a note, tell which of two notes is higher, and meet the note names C, D and E.',
    instrument: 'keyboard',
    steps: [
      {
        kind: 'listen',
        explain: true,
        title: 'What is a musical note?',
        say: 'A musical note can mean a sound with a particular pitch, or the written symbol used to represent it. Pitch is how high or low a sound seems. When you play a piano key, you hear a note with its own pitch. You can play a note briefly or hold it longer.',
        more: 'Many musical sounds, like most drums, have no single clear pitch. They are still music. We just don’t give them note names.',
        notes: [C4],
        button: 'Hear a note',
      },
      {
        kind: 'listen',
        explain: true,
        title: 'Notes make melodies.',
        say: 'Notes are some of the building blocks of melodies. Play a few different notes in a row, and you can begin to make a tune.',
        notes: [C4, D4, E4, D4, C4],
        button: 'Hear notes in a row',
      },
      {
        kind: 'listen',
        title: 'Hear it.',
        say: 'Listen to two piano notes. They have different pitches. Hear them again, then choose one and play it yourself on the keys.',
        notes: [C4, E4],
        button: 'Hear two notes',
        keys: [C4, E4],
      },
      {
        kind: 'compare',
        title: 'Which note sounds higher?',
        say: 'Listen to the first note, then the second note. You can play each one as many times as you like.',
        first: C4,
        second: E4,
        ask: 'higher',
        check: true,
        good: 'The second note sounds higher. Its pitch is higher, even if both notes are played at the same volume.',
        miss: 'Listen again to the two notes. The second is higher in pitch. Higher doesn’t mean louder: try playing both at the same volume.',
      },
      {
        kind: 'hold',
        title: 'A note can be short or long.',
        say: 'Tap the key quickly for a short note. Then hold it down for a long note.',
        more: 'How long a note lasts is called its duration. It is not the same as how high it is, or how loud it is.',
        midi: C4,
      },
      {
        kind: 'names',
        title: 'Notes have names.',
        say: 'In this keyboard example, the lower note is C and the higher is E. Note names help players refer to particular pitches.',
        more: 'The letters A B C D E F G repeat higher and lower across the keyboard. This C, near the middle of the piano, is called middle C.',
        notes: [C4, E4],
        stave: 'Written music can show the same two notes on a stave. The higher note sits higher on the stave. You will learn to read the stave later.',
      },
      { kind: 'find', title: 'Play C, then E.', say: 'Listen to how the pitch changes as you move from C up to E.', notes: [C4, E4], lit: true },
      { kind: 'done', title: 'You’ve learned what a note is.', say: 'You’ve learned what a note is and compared two pitches. Concept completed.', next: 'L04' },
    ],
  },
  {
    id: 'B00',
    version: '1.0.0-draft',
    title: 'Feeling the beat and making rhythm',
    objective: 'Feel a steady beat, hear a rhythm over it, and make a rhythm with sounds and silences.',
    instrument: 'either',
    steps: [
      { kind: 'pulse', title: 'Hear a steady beat.', say: 'Listen to four beats. Then tap along. There’s no score for this one.', bpm: 84, beats: 4, taps: 4 },
      {
        kind: 'pulse',
        title: 'The beat is the regular pulse you can follow in music.',
        say: 'Each beat lights up as it sounds. Tap with it.',
        more: 'You can make the beat slower or faster. That speed is called the tempo. A metronome is a tool that plays the beat for you; the beat itself is in the music.',
        bpm: 84,
        beats: 8,
        taps: 4,
      },
      {
        kind: 'rhythm',
        title: 'Hear a rhythm over the beat.',
        say: 'Rhythm is the pattern of sounds and silences organised in time. In this example, the beat stays steady while the rhythm changes. Listen for the longer sounds, the quicker sounds and the silent beat.',
        more: 'Rhythm is the pattern of sounds and silences in time. Try saying “ap-ple” evenly, then “wa-ter-mel-on”. The syllables make different patterns over the same beat.',
        bpm: 84,
        pattern: ['sound', 'pair', 'rest', 'sound'],
      },
      { kind: 'build', title: 'Make a rhythm.', say: 'Tap each beat to choose a sound or a silence. Use at least one of each, then play it.', bpm: 84 },
      {
        kind: 'rhythm',
        title: 'Now see it written.',
        say: 'In this 4/4 exercise, a crotchet lasts one beat. Two even quavers share one beat. A crotchet rest means count a beat without playing.',
        more: 'Count “1, 2 and, 3, 4”. Keep counting on beat 3, but leave it silent.',
        bpm: 84,
        pattern: ['sound', 'pair', 'rest', 'sound'],
        notation: true,
      },
      { kind: 'which-rest', title: 'Which one has a silent beat?', say: 'Listen to both rhythms. Choose the one with a rest.', bpm: 84, withRest: ['sound', 'rest', 'sound', 'sound'], without: ['sound', 'sound', 'pair', 'sound'], restBeat: 2 },
      { kind: 'done', title: 'You felt the beat and made a rhythm.', say: 'You tapped a steady beat, made a rhythm with a silence and found the rest by listening. Concept completed.', next: 'L01' },
    ],
  },
  {
    id: 'S01',
    version: '1.0.0-draft',
    title: 'Semitones: C and C♯',
    objective: 'Hear and play C and C♯, the next note up, a semitone higher.',
    instrument: 'keyboard',
    steps: [
      {
        kind: 'listen',
        title: 'C and C♯',
        say: 'A sharp (♯) raises a note by one semitone. On this keyboard, C♯ is the black key just to the right of C, between C and D. Listen to C and C♯.',
        more: 'A semitone is the smallest step on the piano: from one key to the very next key, black or white. A sharp doesn’t always mean a black key: E♯ is played on the white key F.',
        notes: [C4, Cs4],
        button: 'Hear C, then C♯',
        keys: [C4, Cs4],
      },
      { kind: 'find', title: 'Play C, then C♯.', say: 'The two keys are lit.', notes: [C4, Cs4], lit: true },
      {
        kind: 'names',
        title: 'C♯ has another name.',
        say: 'The same key can also be called D♭ (D flat), because a flat lowers D by one semitone. Musicians choose the name that fits the music.',
        notes: [C4, Cs4, D4],
      },
      { kind: 'compare', title: 'Which one is higher?', say: 'Listen to C and C♯. Which one sounds higher?', first: Cs4, second: C4, ask: 'higher', check: true },
      { kind: 'done', title: 'You heard a semitone.', say: 'You played C and C♯ and heard that C♯ is one semitone higher. Concept completed.', next: 'L07' },
    ],
  },
];

export const guidedById = (id: string) => GUIDED.find((g) => g.id === id);
