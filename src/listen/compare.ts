// Comparing what was heard with what the activity asked for. Detection (analyser.ts) says what
// happened and how sure it is; this decides what can fairly be said about it. Unclear input is
// reported as unclear: it never becomes a wrong note, a timing fault or evidence against a learner.

import type { CapturedInput } from '../engine/checker.ts';
import { midiToLetter } from '../music/theory.ts';
import type { HeardNote, HeardOnset } from './analyser.ts';

export const MIN_NOTE_CONFIDENCE = 0.6;

export type NoteVerdict =
  | { kind: 'match'; target: number; heard: number; confidence: number }
  | { kind: 'octave'; target: number; heard: number; confidence: number }
  | { kind: 'different'; target: number; heard: number; semitones: number; confidence: number }
  | { kind: 'unclear'; target: number; reason: 'nothing' | 'unsteady' };

/** One note against one target. The octave is not judged unless asked: "play a C" means any C. */
export function compareNote(target: number, heard: HeardNote | undefined, opts: { exactOctave?: boolean } = {}): NoteVerdict {
  if (!heard) return { kind: 'unclear', target, reason: 'nothing' };
  if (heard.confidence < MIN_NOTE_CONFIDENCE) return { kind: 'unclear', target, reason: 'unsteady' };
  if (heard.midi === target) return { kind: 'match', target, heard: heard.midi, confidence: heard.confidence };
  if ((heard.midi - target) % 12 === 0) return opts.exactOctave ? { kind: 'octave', target, heard: heard.midi, confidence: heard.confidence } : { kind: 'match', target, heard: heard.midi, confidence: heard.confidence };
  return { kind: 'different', target, heard: heard.midi, semitones: heard.midi - target, confidence: heard.confidence };
}

/** Feedback for one note: what happened, why it matters, one next step. */
export function noteFeedback(v: NoteVerdict): { what: string; why: string; next: string; counts: boolean } {
  const name = (m: number) => midiToLetter(m);
  switch (v.kind) {
    case 'match':
      return { what: `That was ${name(v.heard)}.`, why: 'It matches the note on the stave.', next: 'Try the next note.', counts: true };
    case 'octave':
      return { what: `That was ${name(v.heard)}, ${v.heard > v.target ? 'higher' : 'lower'} than the one shown.`, why: 'Same letter, different place on the keyboard: an octave apart.', next: `Find the ${name(v.target)} ${v.heard > v.target ? 'lower down' : 'higher up'}.`, counts: true };
    case 'different': {
      const up = v.semitones > 0;
      const near = Math.abs(v.semitones) <= 2;
      return {
        what: `That sounded like ${name(v.heard)}. The note to play is ${name(v.target)}.`,
        why: near ? `${name(v.heard)} is right next to ${name(v.target)}, a little ${up ? 'higher' : 'lower'}.` : `${name(v.heard)} is ${up ? 'higher' : 'lower'} than ${name(v.target)}.`,
        next: `Hear ${name(v.target)}, then move ${up ? 'down' : 'up'} to find it.`,
        counts: true,
      };
    }
    case 'unclear':
      return v.reason === 'nothing'
        ? { what: 'Carmen didn’t hear a note.', why: 'It may have been too quiet, or too far from the microphone.', next: 'Play it again, a little closer.', counts: false }
        : { what: 'Carmen couldn’t tell which note that was.', why: 'The sound wasn’t steady enough to name. That isn’t a mistake.', next: 'Play one note and let it ring.', counts: false };
  }
}

/**
 * Taps heard by the microphone, as captured inputs for the checker. `beat0` is the audio-clock
 * time of beat 1; `latency` is the measured delay from sound to the microphone (seconds).
 * Which drum was hit cannot be heard reliably, so it is never judged (soundUnknown).
 */
export function onsetsToInputs(onsets: HeardOnset[], beat0: number, latency: number, sound?: CapturedInput['sound']): CapturedInput[] {
  return onsets.map((o, i) => ({ id: `mic${i}`, onsetMs: (o.time - latency - beat0) * 1000, source: 'mic' as const, sound, soundUnknown: true }));
}

/** Whether a tapped take is clear enough to give timing feedback and count as evidence. */
export function rhythmClarity(onsets: HeardOnset[], expected: number, calibrated: boolean): { clear: boolean; reason?: 'not-calibrated' | 'too-few' | 'too-many' | 'faint' } {
  if (!calibrated) return { clear: false, reason: 'not-calibrated' };
  if (onsets.length < Math.ceil(expected / 2)) return { clear: false, reason: onsets.length ? 'faint' : 'too-few' };
  if (onsets.length > expected * 2 + 2) return { clear: false, reason: 'too-many' };
  if (onsets.filter((o) => o.confidence < 0.4).length > onsets.length / 2) return { clear: false, reason: 'faint' };
  return { clear: true };
}

/** Free play: describe the shape of what was played, without calling anything wrong. */
export function describeFreePlay(notes: { midi: number }[]): string {
  if (notes.length === 0) return 'Nothing heard yet.';
  if (notes.length === 1) return `One note: ${midiToLetter(notes[0].midi)}.`;
  let steps = 0;
  let leaps = 0;
  let up = 0;
  let down = 0;
  for (let i = 1; i < notes.length; i++) {
    const d = notes[i].midi - notes[i - 1].midi;
    if (d > 0) up++;
    if (d < 0) down++;
    if (Math.abs(d) >= 1 && Math.abs(d) <= 2) steps++;
    else if (Math.abs(d) > 2) leaps++;
  }
  const lo = Math.min(...notes.map((n) => n.midi));
  const hi = Math.max(...notes.map((n) => n.midi));
  const shape = up > down * 2 ? 'mostly going up' : down > up * 2 ? 'mostly going down' : up && down ? 'going up and down' : 'staying on one note';
  const move = steps > leaps ? 'moving by steps' : leaps > steps ? 'with some jumps' : '';
  return `${notes.length} notes from ${midiToLetter(lo)} to ${midiToLetter(hi)}, ${shape}${move ? `, ${move}` : ''}.`;
}

/** Tap-along calibration: median delay between Carmen's clicks and the taps heard (seconds). */
export function calibrate(clickTimes: number[], onsets: HeardOnset[]): { latency: number; spread: number; ok: boolean } | null {
  const deltas: number[] = [];
  for (const c of clickTimes) {
    const near = onsets.filter((o) => o.time > c - 0.15 && o.time < c + 0.45).sort((a, b) => Math.abs(a.time - c - 0.1) - Math.abs(b.time - c - 0.1))[0];
    if (near) deltas.push(near.time - c);
  }
  if (deltas.length < Math.max(3, Math.ceil(clickTimes.length * 0.6))) return null;
  const sorted = [...deltas].sort((a, b) => a - b);
  const median = sorted[Math.floor(sorted.length / 2)];
  const spread = sorted[sorted.length - 1] - sorted[0];
  return { latency: Math.max(0, median), spread, ok: spread < 0.12 };
}
