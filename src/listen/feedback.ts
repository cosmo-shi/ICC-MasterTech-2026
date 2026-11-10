// Teaching words for a take played on a real instrument (or on screen). Three parts: what happened
// (observed), why it matters musically, and one next step. It describes timing; it never guesses
// at technique, effort or feelings, and it never criticises a take Carmen couldn't hear clearly.

import type { CheckResult } from '../engine/checker.ts';
import { midiToLetter } from '../music/theory.ts';
import type { HeardOnset } from './analyser.ts';

export interface Feedback {
  what: string;
  why: string;
  next: string;
  /** Offer "Try slower" as the next step's button. */
  slower?: boolean;
  /** Offer "Hear the difference" (yours, then the rhythm). */
  compare?: boolean;
}

const nth = (n: number) => `${n}`;
function list(nums: number[]): string {
  const s = nums.map(nth);
  if (s.length <= 1) return s.join('');
  return `${s.slice(0, -1).join(', ')} and ${s[s.length - 1]}`;
}

function soundWord(label?: string): string {
  if (!label) return 'a different sound';
  if (label.startsWith('midi:')) return midiToLetter(Number(label.slice(5)));
  const s = label.slice(5);
  return s === 'kick' ? 'the bass drum' : s === 'hihat' ? 'the hi-hat' : s === 'tomHigh' ? 'the high tom' : s === 'tomLow' ? 'the low tom' : `the ${s}`;
}

/**
 * Feedback for any checked take in a lesson. Wrong sounds first (they change the music most), then
 * missing ones, rests, then timing, then held notes. Taps and notes are named by number.
 */
export function takeFeedback(r: CheckResult, opts: { instrument: 'keyboard' | 'drums' }): Feedback {
  const wrong = r.facts.filter((f) => f.status === 'wrong');
  const noun = opts.instrument === 'drums' ? 'sound' : 'note';
  if (wrong.length) {
    const f = wrong[0];
    const isNote = f.expectedLabel.startsWith('midi:');
    return {
      what: wrong.length === 1 ? `${noun === 'note' ? 'Note' : 'Sound'} ${f.index + 1} was ${soundWord(f.playedLabel)}; the music has ${soundWord(f.expectedLabel)}.` : `${wrong.length} ${noun}s were different from the music, starting with ${noun} ${f.index + 1}.`,
      why: isNote ? 'Each note has its own place on the stave, and the tune changes if one moves.' : 'Each drum has its own sound, and the pattern is made of those sounds in order.',
      next: isNote ? `Hear the music, then find ${soundWord(f.expectedLabel)}.` : `Hear the music, then find ${soundWord(f.expectedLabel)}.`,
      compare: true,
    };
  }
  if (!r.timed) {
    const missed = r.facts.filter((f) => f.status === 'missed').map((f) => f.index + 1);
    if (missed.length) return { what: `${missed.length === 1 ? `Note ${missed[0]} wasn’t` : `Notes ${list(missed)} weren’t`} played.`, why: 'The tune needs every note, in order.', next: 'Hear the music, then play it again.', compare: true };
    return { what: `All ${r.facts.length} ${noun}s matched.`, why: 'The notes are the ones on the stave, in the same order.', next: 'Try it on your own.' };
  }
  const f = rhythmFeedback(r);
  if (opts.instrument === 'keyboard') {
    f.what = f.what.replace(/\btaps\b/g, 'notes').replace(/\btap\b/g, 'note').replace(/^Your notes/, 'Notes').replace(/^Tap /, 'Note ');
    f.why = f.why.replace(/\btaps\b/g, 'notes').replace(/\btap\b/g, 'note');
    f.next = f.next.replace(/\btaps\b/g, 'notes').replace(/\btap\b/g, 'play');
  }
  const held = r.facts.filter((x) => x.duration === 'short' || x.duration === 'long');
  if (r.passed && held.length)
    return { what: `Note ${held[0].index + 1} was ${held[0].duration === 'short' ? 'let go early' : 'held on too long'}.`, why: 'How long a note lasts is part of the rhythm too.', next: held[0].duration === 'short' ? 'Keep the key down until the next beat.' : 'Let go as the next note starts.', compare: true };
  return f;
}

/** Feedback for a copied rhythm. */
export function rhythmFeedback(r: CheckResult): Feedback {
  const facts = r.facts;
  const expected = facts.length;
  const heard = facts.filter((f) => f.status !== 'missed').length + r.extras.length;
  const early = facts.filter((f) => f.timing === 'early').map((f) => f.index + 1);
  const late = facts.filter((f) => f.timing === 'late').map((f) => f.index + 1);
  const missed = facts.filter((f) => f.status === 'missed').map((f) => f.index + 1);
  const inRest = r.extras.filter((x) => x.inRest);
  if (missed.length > expected / 2)
    return { what: `Carmen heard ${heard} ${heard === 1 ? 'tap' : 'taps'}; the rhythm has ${expected}.`, why: 'Each note in the rhythm needs its own tap.', next: 'Hear it again, then copy it.', compare: true };
  if (inRest.length)
    return { what: `There was a tap in the rest${inRest.length > 1 ? 's' : ''}.`, why: 'A rest is a silent beat. It still counts, but you don’t play.', next: 'Try saying “rest” in your head on that beat.', compare: true };
  if (r.extras.length)
    return { what: `Carmen heard ${heard} taps; the rhythm has ${expected}.`, why: 'Each note gets one tap, so the extra ones change the rhythm.', next: 'Try it slower, one tap for each note.', slower: true, compare: true };
  if (missed.length)
    return { what: `Note ${list(missed)} wasn’t played.`, why: 'Every note is part of the pattern, even the short ones.', next: 'Hear it again, then copy it.', compare: true };
  if (early.length >= 2 && early.length >= late.length)
    return { what: `Your taps ${list(early)} came before the beat.`, why: 'Keeping the spaces between taps even helps the rhythm stay steady.', next: 'Try counting out loud as you tap.', slower: true, compare: true };
  if (late.length >= 2)
    return { what: `Your taps ${list(late)} came after the beat.`, why: 'When every tap lands with the beat, the rhythm sounds like the music.', next: 'Listen to the count-in clicks, then tap with the first beat.', slower: true, compare: true };
  if (early.length === 1 || late.length === 1)
    return { what: `Tap ${early[0] ?? late[0]} was a little ${early.length ? 'early' : 'late'}; the others were with the beat.`, why: 'One uneven space is easy to fix once you can hear it.', next: 'Hear the difference, then try again.', compare: true };
  return { what: 'Every tap landed with the beat.', why: 'Even spaces between the taps keep the rhythm steady.', next: 'Try a new rhythm.' };
}

/** Feedback when the listener could not tell what happened. Never a mistake, never counted. */
export function unclearFeedback(reason: 'not-calibrated' | 'too-few' | 'too-many' | 'faint' | 'device'): Feedback {
  switch (reason) {
    case 'not-calibrated':
      return { what: 'Carmen hasn’t checked the timing on this device yet.', why: 'Without it, taps could look early or late when they weren’t.', next: 'Press Check timing, then try again.' };
    case 'too-few':
      return { what: 'Carmen didn’t hear the taps clearly.', why: 'It may have been too quiet, or too far from the microphone. This try doesn’t count.', next: 'Tap a little louder or closer, then try again.' };
    case 'faint':
      return { what: 'Some taps were too quiet to be sure about.', why: 'This try doesn’t count either way.', next: 'Tap a little louder or closer, then try again.' };
    case 'too-many':
      return { what: 'Carmen heard more sounds than taps.', why: 'Other sounds in the room may have joined in. This try doesn’t count.', next: 'Try again when it’s quieter.' };
    case 'device':
      return { what: 'The sound on this device didn’t keep time.', why: 'That was the device, not you. This try doesn’t count.', next: 'Try again. If it keeps happening, close other apps.' };
  }
}

/** Free tapping: describe the shape, without marking anything. */
export function describeTaps(onsets: Pick<HeardOnset, 'time'>[]): string {
  if (onsets.length === 0) return 'Nothing heard yet.';
  if (onsets.length === 1) return 'One tap.';
  const span = onsets[onsets.length - 1].time - onsets[0].time;
  const gaps = onsets.slice(1).map((o, i) => o.time - onsets[i].time);
  const mean = gaps.reduce((a, b) => a + b, 0) / gaps.length;
  const sd = Math.sqrt(gaps.reduce((a, g) => a + (g - mean) ** 2, 0) / gaps.length);
  const cv = mean > 0 ? sd / mean : 0;
  const bpm = Math.round(60 / mean);
  const evenness = cv < 0.1 ? 'The spaces between them were very even' : cv < 0.22 ? 'The spaces between them were fairly even' : 'The spaces between them changed, which can make a rhythm of its own';
  const pace = gaps.length >= 3 && cv < 0.22 ? `, about ${bpm} taps a minute` : '';
  return `${onsets.length} taps in ${Math.max(1, Math.round(span))} seconds. ${evenness}${pace}.`;
}
