// L05 "Keyboard notes: C, D and E": the steps and every word the learner sees, grounded in the
// notes involved. Pure logic, so it is tested without a browser (l05.test.ts).
// Middle C = C4 = MIDI 60. Untimed: pitch only, no timing penalty anywhere in this lesson.
import { isBlackKey, midiToLetter } from '../music/theory.ts';

export const C4 = 60;
export const D4 = 62;
export const E4 = 64;

export interface NoteFacts {
  midi: number;
  letter: string;
  /** Where it is on the keyboard, said from the two-black-key group. */
  keys: string;
  /** Where it sits on the treble stave. */
  stave: string;
}

export const NOTES: Record<'C' | 'D' | 'E', NoteFacts> = {
  C: { midi: C4, letter: 'C', keys: 'C is the white key just to the left of a group of two black keys.', stave: 'Middle C sits on its own short line below the stave. That short line is a ledger line.' },
  D: { midi: D4, letter: 'D', keys: 'D is the white key in the middle of the two black keys.', stave: 'D sits just under the bottom line of the stave.' },
  E: { midi: E4, letter: 'E', keys: 'E is the white key just to the right of the two black keys.', stave: 'E sits on the bottom line of the stave.' },
};

/** White-key steps from a to b (positive = higher). Black keys count as half-way. */
function whiteSteps(a: number, b: number): number {
  const pos = (m: number) => {
    const oct = Math.floor(m / 12);
    const pc = ((m % 12) + 12) % 12;
    const idx = [0, 0.5, 1, 1.5, 2, 3, 3.5, 4, 4.5, 5, 5.5, 6][pc];
    return oct * 7 + idx;
  };
  return pos(b) - pos(a);
}

export interface TapResult {
  ok: boolean;
  /** One observation, then one next step. Never "Nearly" or "Something was different". */
  observed: string;
  next: string;
}

/**
 * Judges one key press when the learner was asked to find `target`. Same letter in another
 * octave is said as such (it is a C, just not middle C), black keys are named, and a near miss
 * says which way to move.
 */
export function judgeTap(target: number, got: number): TapResult {
  const want = midiToLetter(target);
  const name = midiToLetter(got);
  if (got === target) return { ok: true, observed: `That’s ${want}${target === C4 ? ', middle C' : ''}.`, next: '' };
  if (name === want) {
    const dir = got > target ? 'higher' : 'lower';
    return {
      ok: false,
      observed: `That’s a ${want} too, a ${dir} one.`,
      next: `Find the ${want} ${got > target ? 'to the left, nearer' : 'to the right, nearer'} the middle of the keyboard. It’s marked Middle C on the strip above the keys.`,
    };
  }
  const steps = whiteSteps(got, target);
  const way = steps > 0 ? 'right' : 'left';
  if (isBlackKey(got)) {
    return {
      ok: false,
      observed: `That’s a black key (${name}).`,
      next: `${want} is a white key. ${NOTES[want as 'C' | 'D' | 'E']?.keys ?? `Move ${way}.`}`,
    };
  }
  const n = Math.abs(steps);
  const howFar = n === 1 ? 'the next white key' : `${n} white keys`;
  return {
    ok: false,
    observed: `That’s ${name}.`,
    next: `${want} is ${howFar} to the ${way}.`,
  };
}

/** Compares a played sequence with the expected one, untimed. The first difference is the one point. */
export function sequenceResult(expected: number[], played: number[]): { ok: boolean; index: number; observed: string; next: string; pair?: { expected: number; played: number } } {
  for (let i = 0; i < expected.length; i++) {
    const got = played[i];
    if (got === undefined) {
      return { ok: false, index: i, observed: `${i === 0 ? 'No notes came in.' : `The notes stopped after note ${i}.`}`, next: `The pattern has ${expected.length} notes. Note ${i + 1} is ${midiToLetter(expected[i])}.` };
    }
    if (got !== expected[i]) {
      const want = midiToLetter(expected[i]);
      const name = midiToLetter(got);
      const sameLetter = want === name;
      return {
        ok: false,
        index: i,
        observed: sameLetter ? `Note ${i + 1} was a ${name} in another octave. The music asked for the ${want} near middle C.` : `Note ${i + 1} was ${name}. The music asked for ${want}.`,
        next: `Hear ${want} and ${name}, then try that note.`,
        pair: { expected: expected[i], played: got },
      };
    }
  }
  if (played.length > expected.length) {
    return { ok: false, index: expected.length, observed: `All ${expected.length} notes matched, then there was an extra ${midiToLetter(played[expected.length])}.`, next: `Stop after note ${expected.length}: the pattern ends there.` };
  }
  return { ok: true, index: -1, observed: `Every note matched: ${expected.map(midiToLetter).join(', ')}.`, next: '' };
}

/** Says what a one-note change does to the tune. Free creation is described, never marked. */
export function describeChange(original: number[], changed: number[]): string {
  const i = changed.findIndex((m, k) => m !== original[k]);
  if (i < 0) return 'Your tune is the same as the first one. Choose a note on the stave, then press a key to change it.';
  const a = original[i];
  const b = changed[i];
  const dir = b > a ? 'higher' : 'lower';
  const big = Math.abs(whiteSteps(a, b)) >= 2 ? 'jumps' : 'steps';
  const where = i === original.length - 1 ? 'at the end' : i === 0 ? 'at the start' : `on note ${i + 1}`;
  return `You changed note ${i + 1} from ${midiToLetter(a)} to ${midiToLetter(b)}. The tune now ${big} ${dir} ${where}. Play both and listen: which ending do you like?`;
}

/** The C sharp mini explainer. Only real keys; the sharp sign is ♯, never #. */
export const SHARP_EXPLAINER = {
  title: 'The black key after C',
  lines: [
    'The black key just to the right of middle C is C♯, said “C sharp”.',
    'It is one semitone higher than C. A semitone is the very next key, black or white.',
    'The sign ♯ means “one semitone higher”.',
    'The same key can also be called D♭ (D flat), one semitone lower than D. Which name you see depends on the music.',
    'E and F have no black key between them, so E♯ is played on the white key F.',
  ],
};

export type L05Step =
  | { id: 'intro'; kind: 'listen'; title: string; text: string; notes: number[] }
  | { id: 'find-c' | 'find-d' | 'find-e'; kind: 'find'; title: string; target: number; guided: boolean }
  | { id: 'up' | 'down'; kind: 'copy'; title: string; notes: number[] }
  | { id: 'link'; kind: 'link'; title: string; notes: number[] }
  | { id: 'guided'; kind: 'find'; title: string; target: number; guided: boolean }
  | { id: 'own'; kind: 'independent'; title: string; notes: number[] }
  | { id: 'create'; kind: 'create'; title: string; notes: number[] }
  | { id: 'reflect'; kind: 'reflect'; title: string };

/** Hear → notice → name → show and connect → guided → independent → reflect and create. */
export const L05_STEPS: L05Step[] = [
  { id: 'intro', kind: 'listen', title: 'Three notes next to each other', text: 'Listen to C, D and E. Each one is a little higher than the one before.', notes: [C4, D4, E4] },
  { id: 'find-c', kind: 'find', title: 'Find middle C', target: C4, guided: true },
  { id: 'find-d', kind: 'find', title: 'Find D', target: D4, guided: true },
  { id: 'find-e', kind: 'find', title: 'Find E', target: E4, guided: true },
  { id: 'up', kind: 'copy', title: 'Go up: C, D, E', notes: [C4, D4, E4] },
  { id: 'down', kind: 'copy', title: 'Come down: E, D, C', notes: [E4, D4, C4] },
  { id: 'link', kind: 'link', title: 'Keys and stave together', notes: [C4, D4, E4] },
  { id: 'guided', kind: 'find', title: 'Can you find D?', target: D4, guided: false },
  { id: 'own', kind: 'independent', title: 'On your own', notes: [C4, D4, E4, C4] },
  { id: 'create', kind: 'create', title: 'Change one note', notes: [C4, D4, E4, C4] },
  { id: 'reflect', kind: 'reflect', title: 'Think back' },
];

/** Which of the seven teaching moves each step does (for the adult area and the flow map). */
export const L05_CYCLE: Record<L05Step['id'], string> = {
  intro: 'Hear',
  'find-c': 'Notice and name',
  'find-d': 'Notice and name',
  'find-e': 'Notice and name',
  up: 'Show and connect',
  down: 'Show and connect',
  link: 'Show and connect',
  guided: 'Guided practice',
  own: 'Independent practice',
  create: 'Reflect and create',
  reflect: 'Reflect and create',
};
