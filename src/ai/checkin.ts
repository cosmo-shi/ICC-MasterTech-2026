// "What's getting in the way?" — short musical checks for a difficulty that keeps coming back.
// Three reviewed check types look at different possibilities:
//   listen: can the learner hear the difference? (their own phrase vs a verified version of it)
//   read:   can they read this part of the score? (a question about the written music)
//   play:   is it the controls? (the same music with one big pad or named keys, slower)
// A check result is one response: it suggests a support the learner may take or turn down.
// It is never used as evidence of the skill (the learner model ignores kind 'check'), and it is
// never shown as a diagnosis. Check wording is draft pending review by a primary music educator.

import type { Phrase, SoundingEvent } from '../music/events.ts';
import { soundingEvents } from '../music/events.ts';
import { midiToLetter } from '../music/theory.ts';
import { type PhraseVersion, onTheBeat, quietRests, restSpans, verifyVersion, writtenLengths, writtenNotes } from '../music/versions.ts';
import { type LearnerState, type LessonInfo, type SkillId, THRESHOLDS, needsPractice, recentFails } from './bkt.ts';

export type CheckKind = 'listen' | 'read' | 'play';
export type SupportId = 'hear-first' | 'count-aloud' | 'bigger-controls' | 'slower';

export interface CheckOffer {
  skill: SkillId;
  /** Who decided to offer it: the learner model (from evidence) or the rules baseline (from this visit). */
  by: 'learner-model' | 'rules';
  fails: number;
  observations: number;
}

/** Learner model: offer when a skill in this lesson still needs practice after 2+ recent misses,
 *  the latest try on it was a miss, and there is enough evidence to say so. Too little evidence
 *  means just try again. */
export function checkInOffer(state: LearnerState, lesson: LessonInfo | undefined, aiEnabled: boolean): CheckOffer | null {
  if (!aiEnabled || !lesson) return null;
  const weak = lesson.skills
    .map((k) => ({ k, s: state.skills[k] }))
    .filter(({ s }) => s.observations >= THRESHOLDS.minObservations && needsPractice(s) && recentFails(s) >= 2 && s.recent[s.recent.length - 1] === false)
    .sort((a, b) => a.s.p - b.s.p)[0];
  return weak ? { skill: weak.k, by: 'learner-model', fails: recentFails(weak.s), observations: weak.s.observations } : null;
}

/** Rules baseline (used when the model is off, and for comparison): three missed tries in a row
 *  on this lesson in this visit, on the lesson's first skill. */
export function rulesCheckInOffer(sessionMissesInARow: number, lesson: LessonInfo | undefined): CheckOffer | null {
  if (!lesson?.skills.length || sessionMissesInARow < 3) return null;
  return { skill: lesson.skills[0], by: 'rules', fails: sessionMissesInARow, observations: sessionMissesInARow };
}

/* ---------- The three checks ---------- */

const LISTEN_GOAL: Record<SkillId, string> = {
  rests: 'keeps the rests quiet',
  pulse: 'stays with the beat',
  subdivision: 'stays with the beat',
  pitch: 'plays the written notes',
  reading: 'plays the written notes',
  duration: 'holds each note for its full length',
};

/** How a recurring difficulty is named to the learner (plain, about the music, not the child). */
export const TRICKY: Record<SkillId, string> = {
  rests: 'Keeping the rests quiet',
  pulse: 'Staying with the beat',
  subdivision: 'Fitting two sounds in a beat',
  pitch: 'Finding the right notes',
  reading: 'Reading the notes',
  duration: 'Holding notes for their length',
};

export const CHECK_CARDS: Record<CheckKind, { title: string; about: string }> = {
  listen: { title: 'Listen', about: 'Hear two versions of your music and pick one.' },
  read: { title: 'Read', about: 'One question about the written music.' },
  play: { title: 'Play', about: 'The same music with easier controls.' },
};

/** Listening check: the learner's own take beside a verified version with one declared change. */
export function listenCheck(take: Phrase, target: Phrase, skill: SkillId): { ask: string; version: PhraseVersion } | null {
  const v =
    skill === 'rests'
      ? quietRests(take, target)
      : skill === 'pulse' || skill === 'subdivision'
        ? onTheBeat(take, target)
        : skill === 'duration'
          ? writtenLengths(take, target)
          : writtenNotes(take, target);
  if (!v || v.touched === 0 || verifyVersion(take, v, target).length) return null;
  return { ask: `Which one ${LISTEN_GOAL[skill]}?`, version: v };
}

export interface ReadQuestion {
  ask: string;
  options: { id: string; label: string }[];
  answer: string[];
  multi: boolean;
}

const beatOf = (t: number) => Math.floor(t / 480) + 1;

/** Reading check: one question with a definite answer from the score. */
export function readCheck(target: Phrase, skill: SkillId): ReadQuestion | null {
  const s = soundingEvents(target);
  const beats = Math.round(target.totalTicks / 480);
  const beatOpts = Array.from({ length: Math.min(beats, 8) }, (_, i) => ({ id: String(i + 1), label: `Beat ${i + 1}` }));
  if (skill === 'rests' || ((skill === 'pulse' || skill === 'subdivision') && restSpans(target).some(([a, b]) => b - a >= 480))) {
    const silent = beatOpts.filter((o) => !s.some((e) => beatOf(e.onset) === Number(o.id) || (e.onset < (Number(o.id) - 1) * 480 && e.onset + e.duration > (Number(o.id) - 1) * 480)));
    if (silent.length && silent.length < beatOpts.length) return { ask: 'Which beats are silent? Pick all of them.', options: beatOpts, answer: silent.map((o) => o.id), multi: true };
  }
  if (skill === 'subdivision' || skill === 'pulse') {
    const two = beatOpts.filter((o) => s.filter((e) => beatOf(e.onset) === Number(o.id)).length >= 2);
    if (two.length && two.length < beatOpts.length) return { ask: 'Which beats have two sounds? Pick all of them.', options: beatOpts, answer: two.map((o) => o.id), multi: true };
    const n = s.length;
    const opts = [...new Set([n - 1, n, n + 1].filter((x) => x > 0))].map((x) => ({ id: String(x), label: String(x) }));
    return { ask: 'How many sounds are written?', options: opts, answer: [String(n)], multi: false };
  }
  if (skill === 'pitch' || skill === 'reading') {
    const notes = s.filter((e): e is Extract<SoundingEvent, { kind: 'note' }> => e.kind === 'note');
    if (!notes.length) return null;
    const first = notes[0];
    const name = midiToLetter(first.midi);
    const others = ['C', 'D', 'E', 'F', 'G', 'A', 'B'].filter((l) => l !== name).slice(0, 2);
    const opts = [name, ...others].sort().map((l) => ({ id: l, label: l }));
    return { ask: 'What is the first written note?', options: opts, answer: [name], multi: false };
  }
  if (skill === 'duration') {
    const longest = [...s].sort((a, b) => b.duration - a.duration)[0];
    if (!longest || s.every((e) => e.duration === longest.duration)) return null;
    const opts = s.slice(0, 6).map((_e, i) => ({ id: String(i + 1), label: `Sound ${i + 1}` }));
    const ans = s.slice(0, 6).map((e, i) => (e.duration === longest.duration ? String(i + 1) : '')).filter(Boolean);
    return { ask: 'Which sound lasts longest?', options: opts, answer: ans, multi: ans.length > 1 };
  }
  return null;
}

export const isRight = (q: ReadQuestion, picked: string[]) => q.answer.length === picked.length && q.answer.every((a) => picked.includes(a));

/** Playing check: what changes (access only; the music stays the same). */
export function playCheckSetup(target: Phrase): { tempoScale: number; bigControls: boolean; labels: boolean; says: string } {
  return target.instrument === 'drums'
    ? { tempoScale: 0.75, bigControls: true, labels: true, says: 'Same music, a slower beat and big pads.' }
    : { tempoScale: 0.75, bigControls: true, labels: true, says: 'Same music, a slower beat and key names showing.' };
}

/* ---------- What a result suggests ---------- */

export const SUPPORTS: Record<SupportId, { label: string; does: string }> = {
  'hear-first': { label: 'Hear it before each try', does: 'The music plays once before you start.' },
  'count-aloud': { label: 'Counting under the music', does: 'Beat numbers and “rest” show under the score.' },
  'bigger-controls': { label: 'Bigger, simpler controls', does: 'Bigger pads or keys, with names. Stays on when you play on your own.' },
  slower: { label: 'Slower', does: 'The beat is slower while you practise.' },
};

/** One check, one response: a suggestion the learner can take or turn down. Never a diagnosis. */
export function suggestFrom(kind: CheckKind, right: boolean): { says: string; support: SupportId } {
  if (kind === 'listen') return right ? { says: 'You heard the difference.', support: 'count-aloud' } : { says: 'Those two can sound close.', support: 'hear-first' };
  if (kind === 'read') return right ? { says: 'You read that right.', support: 'hear-first' } : { says: 'That part of the music is still new.', support: 'count-aloud' };
  return right ? { says: 'That went better with easier controls.', support: 'bigger-controls' } : { says: 'Still tricky with easier controls.', support: 'slower' };
}
