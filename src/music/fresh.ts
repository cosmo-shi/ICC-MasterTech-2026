// Fresh material for independent checks: new patterns each time, so a learner
// cannot pass by remembering the practice answer.

import type { ReplyParams } from '../ai/reply.ts';
import { type MusicEvent, type Phrase, TPQ } from './events.ts';

export interface IndependentTask {
  id: string;
  question: string;
  options: { id: string; label: string }[];
  answer: string;
  /** What to play, in order, with captions. */
  clips: { caption: string; phrase: Phrase }[];
}

const pick = <T,>(r: () => number, xs: T[]): T => xs[Math.floor(r() * xs.length)];

function melody(r: () => number, n = 4, pool = [60, 62, 64, 65, 67]): Phrase {
  const events: MusicEvent[] = Array.from({ length: n }, (_, i) => ({ id: `m${i}`, kind: 'note', onset: i * TPQ, duration: TPQ, midi: pick(r, pool), velocity: 0.6 }));
  return { id: 'fresh', instrument: 'keyboard', meter: [4, 4], totalTicks: n * TPQ, tempoBpm: 90, events };
}

function drumBeat(r: () => number): Phrase {
  const sounds = ['kick', 'snare', 'kick', 'snare'] as const;
  const events: MusicEvent[] = sounds.map((s, i) => ({ id: `d${i}`, kind: 'drum', onset: i * TPQ, duration: TPQ, sound: r() < 0.3 ? 'tomLow' : s, velocity: 0.7 }));
  return { id: 'fresh', instrument: 'drums', meter: [4, 4], totalTicks: 4 * TPQ, tempoBpm: 84, events };
}

export function freshTask(op: ReplyParams['op'], r: () => number = Math.random): { task: IndependentTask; params: ReplyParams; source: Phrase } {
  switch (op) {
    case 'dynamics': {
      const src = melody(r, 4);
      const softerFirst = r() < 0.5;
      const params: ReplyParams = { op: 'dynamics', direction: 'softer' };
      return {
        params,
        source: src,
        task: {
          id: 'which-quieter',
          question: 'Which one was quieter?',
          options: [
            { id: 'first', label: 'The first one' },
            { id: 'second', label: 'The second one' },
          ],
          answer: softerFirst ? 'first' : 'second',
          clips: [], // filled by caller after compiling (needs verified reply)
        },
      };
    }
    case 'replace_with_rest': {
      const src = drumBeat(r);
      const k = Math.floor(r() * 4);
      return {
        params: { op: 'replace_with_rest', eventId: `d${k}` },
        source: src,
        task: {
          id: 'which-beat-quiet',
          question: 'In the second version, which beat went quiet?',
          options: [1, 2, 3, 4].map((b) => ({ id: String(b), label: `Beat ${b}` })),
          answer: String(k + 1),
          clips: [],
        },
      };
    }
    case 'transpose': {
      const src = melody(r, 4, [60, 62, 64, 65, 67]);
      const up = r() < 0.5;
      const amount = pick(r, [2, 4, 5]);
      return {
        params: { op: 'transpose', semitones: up ? amount : -amount },
        source: src,
        task: {
          id: 'higher-or-lower',
          question: 'Did the reply go higher or lower?',
          options: [
            { id: 'higher', label: 'Higher' },
            { id: 'lower', label: 'Lower' },
          ],
          answer: up ? 'higher' : 'lower',
          clips: [],
        },
      };
    }
    case 'section_order': {
      const a = [72, 72, 74, 76].map((m, i) => ({ id: `a${i}`, kind: 'note' as const, onset: i * TPQ, duration: TPQ, midi: m, velocity: 0.6 }));
      const bNotes = pick(r, [[48, 52, 55, 48], [50, 53, 57, 50], [48, 55, 52, 48]]);
      const b = bNotes.map((m, i) => ({ id: `b${i}`, kind: 'note' as const, onset: (4 + i) * TPQ, duration: TPQ, midi: m, velocity: 0.6 }));
      const src: Phrase = { id: 'fresh', instrument: 'keyboard', meter: [4, 4], totalTicks: 8 * TPQ, tempoBpm: 100, events: [...a, ...b] };
      const swapped = r() < 0.5;
      return {
        params: { op: 'section_order', splitTick: 4 * TPQ },
        source: src,
        task: {
          id: 'which-order',
          question: 'Did you hear A then B, or B then A?',
          options: [
            { id: 'AB', label: 'A then B' },
            { id: 'BA', label: 'B then A' },
          ],
          answer: swapped ? 'BA' : 'AB',
          clips: [],
        },
      };
    }
    case 'add_part':
    case 'echo':
    default: {
      const src = melody(r, 8, [60, 62, 64, 67, 69, 72]);
      const part = pick(r, ['pulse', 'backbeat', 'drone'] as const);
      return {
        params: { op: 'add_part', part, tempoScale: 1 },
        source: src,
        task: {
          id: 'which-part',
          question: 'Which part did the partner add?',
          options: [
            { id: 'pulse', label: 'A steady metronome beat' },
            { id: 'backbeat', label: 'A snare on beats 2 and 4' },
            { id: 'drone', label: 'A long low note' },
          ],
          answer: part,
          clips: [],
        },
      };
    }
  }
}
