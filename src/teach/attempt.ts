// The words for one finished attempt: one observation, why it matters in this music, one next step.
// Built from three separate things that stay separate:
//   - the comparison (checker facts: which expected event, matched or not, how far off),
//   - the timing pattern (on-device model or rules; an estimate, worded as one),
//   - the expected events of this exercise (so advice fits its rests, quavers and minims).
// The focus (which one thing to talk about) comes from the coach's `decide()`, so there is only
// one coach. Nothing here judges technique, effort or feelings.

import type { CoachDecision } from '../ai/coach.ts';
import type { CheckResult, EventFact } from '../engine/checker.ts';
import { type Phrase, TPQ, soundingEvents } from '../music/events.ts';
import { evenlySpaced, lengthName, pitchRelation, placeName, rhythmMix, soundWord, spans } from './music.ts';

export type FeedbackTone = 'good' | 'near' | 'miss' | 'unclear';
export type NextStep = 'retry' | 'independent' | 'continue';

export interface AttemptFeedback {
  tone: FeedbackTone;
  /** The one point, short enough to read at a glance. */
  title: string;
  /** What was captured, said as observed (or "it sounded like" when it is an estimate). */
  observed: string;
  /** Why it matters in this music. */
  why: string;
  next: NextStep;
  nextLabel: string;
  /** The audible comparison that fits: a verified reply, or yours then the music. */
  compare?: { kind: 'reply' | 'difference'; label: string };
  /** Facts this feedback rests on (for the teacher's view). */
  evidenceFactIds: string[];
  /** A wrong pitch, so the learner can hear and see the two notes side by side (video QA PED-01). */
  pair?: { index: number; expected: number; played: number };
}

export interface AttemptContext {
  target: Phrase;
  result: CheckResult;
  decision: CoachDecision;
  /** Independent check: no comparison and no help offered. */
  independent: boolean;
  /** How the sounds came in: on screen and MIDI are measured; the microphone is an estimate. */
  input: 'screen' | 'midi' | 'mic';
}

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export function attemptFeedback(ctx: AttemptContext): AttemptFeedback {
  const { target, result, decision, independent, input } = ctx;
  const piano = target.instrument === 'keyboard';
  const noun = piano ? 'note' : 'sound';
  const heard = input === 'mic' ? 'Carmen heard' : 'You played';
  const s = result.summary;
  const tone: FeedbackTone = result.passed ? 'good' : s.correctSound * 2 >= s.expected ? 'near' : 'miss';
  const sounding = soundingEvents(target);
  const evOf = (f: EventFact) => sounding.find((e) => e.id === f.expectedId);
  const reply = decision.reply && !independent ? { kind: 'reply' as const, label: decision.reply.replyText } : undefined;
  const difference = independent ? undefined : { kind: 'difference' as const, label: 'Hear the difference' };
  const base = { tone, evidenceFactIds: decision.evidenceFactIds, next: 'retry' as NextStep, nextLabel: 'Try again' };

  if (decision.focus === 'insufficient') {
    return {
      ...base,
      tone: 'unclear',
      title: input === 'mic' ? 'Carmen didn’t hear any playing' : 'No sounds came in',
      observed: input === 'mic' ? 'Nothing was heard during this try.' : 'This try had no sounds in it.',
      why: 'Nothing is marked, so this try doesn’t count either way.',
    };
  }

  if (result.passed) {
    const observed = result.timed ? `Every ${noun} matched, and ${s.onTime} of ${s.expected} landed with the beat.` : `Every note matched, in order.`;
    if (independent) return { ...base, title: 'You did it on your own', observed, why: 'You played it with no hints and no help, so you can use this in your own music.', next: 'continue', nextLabel: 'Continue' };
    return {
      ...base,
      title: 'That matched',
      observed,
      why: 'Next, a new one with the same idea, on your own. That shows you can do it without help.',
      next: 'independent',
      nextLabel: 'Now on your own',
      compare: difference && { kind: 'difference', label: 'Hear yours and the music' },
    };
  }

  switch (decision.focus) {
    case 'sound': {
      const f = result.facts.find((x) => x.status === 'wrong')!;
      const n = f.index + 1;
      if (f.expectedLabel.startsWith('midi:')) {
        const exp = Number(f.expectedLabel.slice(5));
        const got = Number(f.playedLabel?.slice(5));
        return {
          ...base,
          title: `Note ${n} is ${soundWord(f.expectedLabel)}`,
          observed: `${heard} ${soundWord(f.playedLabel)} for note ${n}. The music asked for ${soundWord(f.expectedLabel)}.`,
          why: `${Number.isFinite(got) ? pitchRelation(exp, got) + ' ' : ''}Each note has its own place on the stave, so the tune changes shape when one moves.`,
          nextLabel: 'Try that note',
          compare: difference,
          ...(Number.isFinite(got) && input !== 'mic' ? { pair: { index: f.index, expected: exp, played: got } } : {}),
        };
      }
      return {
        ...base,
        title: `Sound ${n} is ${soundWord(f.expectedLabel)}`,
        observed: `You played ${soundWord(f.playedLabel)} for sound ${n}. The pattern has ${soundWord(f.expectedLabel)} there.`,
        why: 'Each drum has its own sound, high or low. This pattern is made of those sounds in order.',
        compare: difference,
      };
    }
    case 'rest': {
      const x = result.extras.find((e) => e.inRest)!;
      const rest = target.events.find((e) => e.id === x.restId);
      const where = rest ? placeName(rest.onset, target) : `beat ${x.restBeat}`;
      const restLen = rest ? lengthName(rest.duration) : null;
      return {
        ...base,
        title: `${cap(where)} is a rest`,
        observed: `${input === 'mic' ? 'Carmen heard a sound' : `You played`} on ${where}, which is a${restLen ? ` ${restLen.name}` : ''} rest.`,
        why: `Keep counting, but leave that ${restLen && restLen.name !== 'crotchet' ? 'space' : 'beat'} silent${restLen ? ` (it lasts ${restLen.beats})` : ''}. Listen to the example, then try again.`,
        compare: reply ?? difference,
      };
    }
    case 'missing': {
      const missed = result.facts.filter((f) => f.status === 'missed');
      if (missed.length) {
        const lastHeard = Math.max(-1, ...result.facts.filter((f) => f.status !== 'missed').map((f) => f.index));
        const trailing = missed.every((f) => f.index > lastHeard);
        if (trailing && lastHeard >= 0 && result.extras.length === 0) {
          return {
            ...base,
            title: 'Keep going to the end',
            observed: `The ${noun}s stopped after ${noun} ${lastHeard + 1}. The ${piano ? 'music' : 'rhythm'} has ${s.expected}.`,
            why: `It isn’t finished until its last ${noun}. Keep counting through, even after a slip.`,
            compare: difference,
          };
        }
        const f = missed[0];
        const ev = evOf(f);
        const sp = ev ? spans(target).find((x) => x.e.id === ev.id) : undefined;
        const len = sp ? lengthName(ev!.duration) : null;
        const short = !!sp && sp.span < TPQ;
        return {
          ...base,
          title: `Play ${noun} ${f.index + 1} too`,
          observed: input === 'mic' ? `Carmen didn’t hear ${noun} ${f.index + 1}.` : `${cap(noun)} ${f.index + 1} didn’t play.`,
          why: short && ev ? `It’s a ${len?.name ?? 'short sound'} on ${placeName(ev.onset, target)}: it comes quickly after the one before, so it’s easy to skip.` : `Every ${noun} is part of the ${piano ? 'tune' : 'pattern'}, even the short ones.`,
          compare: difference,
        };
      }
      const x = result.extras[0];
      return {
        ...base,
        title: `One ${noun} for each note`,
        observed: `There was an extra ${noun} near ${placeName(Math.round(x.onsetBeats * TPQ), target)}.`,
        why: 'Each note in the music gets one sound. An extra one adds a note that isn’t there.',
        compare: difference,
      };
    }
    case 'duration': {
      const f = result.facts.find((x) => x.duration === 'short' || x.duration === 'long')!;
      const ev = evOf(f);
      const len = ev ? lengthName(ev.duration) : null;
      const n = f.index + 1;
      return {
        ...base,
        title: len ? `Hold note ${n} for ${len.beats}` : `Hold note ${n} for its full length`,
        observed: `Note ${n} was ${f.duration === 'short' ? 'let go' : 'still held'} after ${(f.heldBeats ?? 0).toFixed(1)} beats.`,
        why: len ? `It’s a ${len.name}: it lasts ${len.beats}. How long a note sounds is part of the rhythm.` : 'How long a note sounds is part of the rhythm.',
        compare: difference,
      };
    }
    case 'timing':
      return { ...base, ...timingWords(ctx, noun, reply ?? difference) };
    default:
      return { ...base, title: `${s.correctSound} of ${s.expected} ${noun}s matched`, observed: `${s.correctSound} of ${s.expected} ${noun}s matched the music.`, why: 'Hear the music once more and follow the stave as it plays, then try again.', compare: difference };
  }
}

function timingWords(ctx: AttemptContext, noun: string, compare: AttemptFeedback['compare']): Pick<AttemptFeedback, 'title' | 'observed' | 'why' | 'compare'> {
  const { target, result, decision, input } = ctx;
  // The pattern is an estimate from the timings (model or rules), and the microphone's times are
  // estimates too, so it is said as "it sounded like".
  const est = decision.patternSource === 'local-model' || input === 'mic';
  const lead = est ? 'It sounded like ' : '';
  const even = evenlySpaced(target);
  const mix = rhythmMix(target);
  const off = [...result.facts].filter((f) => f.offsetBeats !== undefined && f.timing !== 'onTime').sort((a, b) => Math.abs(b.offsetBeats!) - Math.abs(a.offsetBeats!))[0];
  const offEv = off && soundingEvents(target).find((e) => e.id === off.expectedId);
  const plural = `${noun}s`;
  switch (decision.pattern) {
    case 'early':
      return {
        title: 'Wait for the beat',
        observed: `${lead}most of your ${plural} came a little before the beat.`.replace(/^./, (c) => c.toUpperCase()),
        why: 'Each sound has its own place on the beat. Landing with the click keeps you together with the music.',
        compare,
      };
    case 'late':
      return {
        title: 'Play as the click lands',
        observed: `${lead}most of your ${plural} came a little after the beat.`.replace(/^./, (c) => c.toUpperCase()),
        why: 'Each sound has its own place on the beat. Getting ready during the count-in helps you land with it.',
        compare,
      };
    case 'speedingUp':
      return {
        title: 'Hold the speed to the end',
        observed: `${lead}you started with the beat, then got faster.`.replace(/^./, (c) => c.toUpperCase()),
        why: even ? 'The beat stays the same speed all the way through.' : `The beat stays the same speed all the way through, even when the ${mix} change length on top of it.`,
        compare,
      };
    case 'slowingDown':
      return {
        title: 'Hold the speed to the end',
        observed: `${lead}you started with the beat, then got slower.`.replace(/^./, (c) => c.toUpperCase()),
        why: even ? 'The beat stays the same speed all the way to the last sound.' : `The beat stays the same speed all the way through, even when the ${mix} change length on top of it.`,
        compare,
      };
    default: {
      // Uneven: only an evenly spaced pattern should have equal spaces. Otherwise name the sound
      // that was furthest from its place, and the place it belongs.
      if (even && decision.pattern === 'uneven')
        return {
          title: 'Keep the spaces the same',
          observed: `${lead}some ${plural} came early and some late.`.replace(/^./, (c) => c.toUpperCase()),
          why: 'In this pattern every sound is the same distance from the next, so every space matches.',
          compare,
        };
      const where = offEv ? placeName(offEv.onset, target) : null;
      const len = offEv ? lengthName(offEv.duration) : null;
      return {
        title: even ? 'Count the beat as you play' : 'Count the beat under the rhythm',
        observed: off && where
          ? `${lead}${noun} ${off.index + 1} came ${off.timing}. It belongs on ${where}.`.replace(/^./, (c) => c.toUpperCase())
          : `${lead}some ${plural} came early and some late.`.replace(/^./, (c) => c.toUpperCase()),
        why: even
          ? 'Each sound has its own place on the beat. Counting the beat keeps it there.'
          : `This rhythm mixes ${mix}${len ? `; that one is a ${len.name}, ${len.beats}` : ''}. The sounds change length, but the beat underneath stays steady, so counting it keeps each sound in its place.`,
        compare,
      };
    }
  }
}

/** Words for a take that couldn't be judged fairly. Never a mistake, never counted. */
export function unclearAttempt(reason: 'not-calibrated' | 'too-few' | 'too-many' | 'faint' | 'device'): Pick<AttemptFeedback, 'tone' | 'title' | 'observed' | 'why'> & { advice: string } {
  switch (reason) {
    case 'not-calibrated':
      return { tone: 'unclear', title: 'Check the timing first', observed: 'Carmen hasn’t checked the timing on this device yet.', why: 'Without it, sounds could look out of time when they weren’t. This try doesn’t count.', advice: 'Press Check timing, then try again.' };
    case 'too-few':
      return { tone: 'unclear', title: 'Carmen didn’t hear it clearly', observed: 'Fewer sounds came through the microphone than the rhythm has.', why: 'It may have been too quiet or too far away. This try doesn’t count either way.', advice: 'Play a little louder or closer, or use the screen instead.' };
    case 'faint':
      return { tone: 'unclear', title: 'Some sounds were too quiet', observed: 'Some sounds were too quiet for Carmen to be sure about.', why: 'This try doesn’t count either way.', advice: 'Play a little louder or closer, then try again.' };
    case 'too-many':
      return { tone: 'unclear', title: 'Other sounds joined in', observed: 'Carmen heard more sounds than the rhythm has.', why: 'Other sounds in the room may have been picked up. This try doesn’t count.', advice: 'Try again when it’s quieter, or use the screen instead.' };
    case 'device':
      return { tone: 'unclear', title: 'The device lost time', observed: 'The sound on this device didn’t keep time during this try.', why: 'That was the device, not you. This try doesn’t count.', advice: 'Try again. If it keeps happening, close other apps or reload Carmen.' };
  }
}
