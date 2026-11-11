// Musical words built from the expected events, so advice names the real place and length of a
// sound ("the 'and' after beat 2", "a minim: two beats") instead of a general rule.

import { type Phrase, type SoundingEvent, TPQ, soundingEvents } from '../music/events.ts';
import { midiToLetter } from '../music/theory.ts';

const NUM = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight'];
export const say = (n: number) => NUM[n] ?? String(n);

/** Where a tick falls, in counting words: "beat 3", "the 'and' after beat 2", "beat 1 of bar 2". */
export function placeName(onset: number, phrase: Pick<Phrase, 'meter' | 'totalTicks'>): string {
  const beatsPerBar = phrase.meter[0];
  const beat = onset / TPQ;
  const bar = Math.floor(beat / beatsPerBar);
  const inBar = beat - bar * beatsPerBar;
  const whole = Math.floor(inBar + 1e-9);
  const frac = inBar - whole;
  const bars = Math.ceil(phrase.totalTicks / (TPQ * beatsPerBar));
  const barText = bars > 1 ? ` of bar ${bar + 1}` : '';
  if (Math.abs(frac) < 1e-6) return `beat ${whole + 1}${barText}`;
  if (Math.abs(frac - 0.5) < 1e-6) return `the “and” after beat ${whole + 1}${barText}`;
  return `between beats ${whole + 1} and ${whole + 2}${barText}`;
}

/** Australian names for common lengths, with the beats in words. */
export function lengthName(ticks: number): { name: string; beats: string } | null {
  const table: [number, string, string][] = [
    [TPQ / 2, 'quaver', 'half a beat'],
    [TPQ, 'crotchet', 'one beat'],
    [(TPQ * 3) / 2, 'dotted crotchet', 'one and a half beats'],
    [TPQ * 2, 'minim', 'two beats'],
    [TPQ * 3, 'dotted minim', 'three beats'],
    [TPQ * 4, 'semibreve', 'four beats'],
  ];
  const hit = table.find(([t]) => t === ticks);
  return hit ? { name: hit[1], beats: hit[2] } : null;
}

/** The space from one sound to the next (or to the end), which is what a learner hears as its length. */
export function spans(phrase: Phrase): { e: SoundingEvent; span: number }[] {
  const s = soundingEvents(phrase);
  return s.map((e, i) => ({ e, span: (s[i + 1]?.onset ?? phrase.totalTicks) - e.onset }));
}

/** True when every sound is the same distance from the next: only then is "make every space the same" right. */
export function evenlySpaced(phrase: Phrase): boolean {
  const s = soundingEvents(phrase);
  if (s.length < 2) return true;
  const gaps = s.slice(1).map((e, i) => e.onset - s[i].onset);
  return gaps.every((g) => g === gaps[0]) && !phrase.events.some((e) => e.kind === 'rest');
}

/** "crotchets and quavers", "crotchets, minims and a rest": what this rhythm is made of. */
export function rhythmMix(phrase: Phrase): string {
  const kinds: string[] = [];
  for (const e of [...phrase.events].sort((a, b) => a.onset - b.onset)) {
    const l = lengthName(e.duration);
    const word = e.kind === 'rest' ? 'rests' : l ? `${l.name}s` : null;
    if (word && !kinds.includes(word)) kinds.push(word);
  }
  if (kinds.length <= 1) return kinds[0] ?? 'sounds';
  return `${kinds.slice(0, -1).join(', ')} and ${kinds[kinds.length - 1]}`;
}

export function soundWord(label?: string): string {
  if (!label) return 'a different sound';
  if (label.startsWith('midi:')) return midiToLetter(Number(label.slice(5)));
  const s = label.slice(5);
  return s === 'kick' ? 'the bass drum' : s === 'hihat' ? 'the hi-hat' : s === 'tomHigh' ? 'the high tom' : s === 'tomLow' ? 'the low tom' : s === 'crash' ? 'the cymbal' : `the ${s}`;
}

/** How far apart two notes are, in words a child can check on the keys. */
export function pitchRelation(expected: number, played: number): string {
  const d = expected - played;
  if (d === 0) return '';
  const dir = d > 0 ? 'higher' : 'lower';
  const n = Math.abs(d);
  const how = n <= 2 ? 'the next' : n <= 4 ? 'a skip' : 'further';
  const letter = midiToLetter(expected);
  return how === 'the next' ? `${letter} is the next note ${dir} than ${midiToLetter(played)}.` : `${letter} is ${how} ${dir} than ${midiToLetter(played)}.`;
}

export interface WrongNote {
  index: number;
  expected: number;
  played: number;
}

const listWords = (xs: string[]) => (xs.length <= 1 ? xs.join('') : `${xs.slice(0, -1).join(', ')} and ${xs[xs.length - 1]}`);

/**
 * Every wrong pitch in one attempt, in plain words ("You played G for note 3, but this phrase uses E."),
 * not just the first one. `heard` is "You played", or "Carmen heard" for an estimate.
 */
export function wrongNotesWords(wrong: WrongNote[], heard = 'You played'): { title: string; observed: string } {
  const name = (m: number, other: number) => {
    const l = midiToLetter(m);
    if (l !== midiToLetter(other)) return l;
    return m === 60 ? 'middle C' : `${m > other ? 'a higher' : 'a lower'} ${l}`;
  };
  const right = (w: WrongNote) => (midiToLetter(w.expected) === midiToLetter(w.played) && w.expected === 60 ? 'middle C' : midiToLetter(w.expected));
  // Brief 11 Nov, section 6: "You played G for note 3, but this phrase uses E."
  const one = (w: WrongNote) => `${heard} ${name(w.played, w.expected)} for note ${w.index + 1}, but this phrase uses ${right(w)}.`;
  if (wrong.length === 1) return { title: `Note ${wrong[0].index + 1} is ${right(wrong[0])}`, observed: one(wrong[0]) };
  return {
    title: `Notes ${listWords(wrong.map((w) => String(w.index + 1)))} were wrong`,
    observed: wrong.map(one).join(' '),
  };
}
