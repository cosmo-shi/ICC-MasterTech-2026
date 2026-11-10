// Reflection for free play and recordings. Nothing is marked. The beat Carmen finds is a guess
// from the first few sounds (a hypothesis), so a change in speed is described, not called wrong,
// and the learner is asked what they meant only when that changes what is useful to say.

import { type FreeReply, freeEvidence, freeReply, readPattern } from '../ai/listenCoach.ts';
import type { Pattern } from '../ai/features.ts';
import type { ModelResult } from '../ai/model.ts';

export interface IntentOption {
  id: string;
  label: string;
  /** What Carmen says after this answer. */
  reply: string;
  /** Offer the steady-beat example after this answer. */
  offerExample?: boolean;
}

export interface FreeReflection {
  /** What Carmen noticed, worded as a description of a guess. */
  observed: string;
  /** Asked only when the answer changes the advice (speeding up, slowing down, no steady beat). */
  question?: { text: string; options: IntentOption[] };
  /** A next idea when no question is needed. */
  idea?: string;
  pattern?: Pattern;
  /** Where the pattern came from, for the teacher's view. Never shown to the learner as a badge. */
  source?: 'local-model' | 'rules';
  model?: ModelResult;
  bpm?: number;
  reply?: FreeReply;
}

export function freeReflection(timesSec: number[], aiEnabled: boolean, instrument: 'keyboard' | 'drums', notes?: number[]): FreeReflection {
  const count = timesSec.length;
  const unit = instrument === 'keyboard' && notes?.length ? 'notes' : 'sounds';
  if (count === 0) return { observed: 'Carmen didn’t hear any playing. It may have been too quiet, or too far from the microphone.' };
  const fe = freeEvidence(timesSec);
  if (!fe) return { observed: `Carmen heard ${count} ${count === 1 ? unit.slice(0, -1) : unit}. That’s too few to say anything about a beat, and that’s fine.` };
  const read = readPattern(fe.ev, aiEnabled, true);
  if (!read) return { observed: `Carmen heard ${count} ${unit}.` };
  const bpm = Math.min(200, Math.max(30, fe.bpm));
  const common = { pattern: read.pattern, source: read.source, model: read.model, bpm };
  const reply = freeReply(fe, read, instrument, notes);
  switch (read.pattern) {
    case 'speedingUp':
      return {
        ...common,
        reply,
        observed: `It sounded like you started at about ${bpm} beats a minute, then got faster.`,
        question: {
          text: 'Did you mean it to speed up?',
          options: [
            { id: 'meant', label: 'Yes, on purpose', reply: 'Then it worked. Getting gradually faster is called accelerando, and it builds excitement.' },
            { id: 'steady', label: 'No, I wanted one speed', reply: 'To hold one speed, count 1, 2, 3, 4 in your head as you play. Hear yours on a steady beat to compare.', offerExample: true },
          ],
        },
      };
    case 'slowingDown':
      return {
        ...common,
        reply,
        observed: `It sounded like you started at about ${bpm} beats a minute, then got slower.`,
        question: {
          text: 'Did you mean it to slow down?',
          options: [
            { id: 'meant', label: 'Yes, on purpose', reply: 'Then it worked. Getting gradually slower is called ritardando. It often brings music to a close.' },
            { id: 'steady', label: 'No, I wanted one speed', reply: 'To hold one speed, keep counting all the way to the end. Hear yours on a steady beat to compare.', offerExample: true },
          ],
        },
      };
    case 'uneven':
      return {
        ...common,
        observed: 'The spaces between your sounds changed a lot, so Carmen couldn’t find one steady beat.',
        question: {
          text: 'Were you keeping a beat?',
          options: [
            { id: 'exploring', label: 'No, I was exploring', reply: 'Exploring is how pieces start. If you find an idea you like, try playing it twice the same way.' },
            { id: 'steady', label: 'Yes, I was trying to', reply: 'Counting in your head, or turning on the metronome, can help the beat stay steady.' },
          ],
        },
      };
    default:
      return {
        ...common,
        reply,
        observed: `Your ${unit} kept a steady beat, about ${bpm} beats a minute.`,
        idea: 'Next idea: keep that beat while some sounds last longer and some shorter.',
      };
  }
}
