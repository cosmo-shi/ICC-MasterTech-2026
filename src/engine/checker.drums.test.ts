import { describe, expect, it } from 'vitest';
import seed from '../data/lessons.seed.json';
import { parseLessons } from '../music/lessons.ts';
import { type DrumSound, type Phrase, soundingEvents, ticksToMs } from '../music/events.ts';
import { checkAttempt, type CapturedInput } from './checker.ts';

const lessons = parseLessons(seed);
const L = (id: string) => lessons.find((l) => l.id === id)!;

function playWithWrongDrum(p: Phrase, at: number): CapturedInput[] {
  return soundingEvents(p).map((e, i) => {
    const sound = (e as { sound: DrumSound }).sound;
    return {
      id: `i${i}`,
      onsetMs: ticksToMs(e.onset, p.tempoBpm),
      sound: i === at ? (sound === 'snare' ? 'kick' : 'snare') : sound,
      source: 'pointer' as const,
    };
  });
}

describe('which drum counts', () => {
  it('marks the wrong drum when the music uses more than one drum (L03)', () => {
    for (const mode of ['practice', 'independent'] as const) {
      const l = L('L03');
      const p = l[mode]!;
      for (let at = 0; at < soundingEvents(p).length; at++) {
        const r = checkAttempt(p, playWithWrongDrum(p, at), l.assessment);
        expect(r.summary.wrong).toBe(1);
        expect(r.passed).toBe(false);
        expect(r.facts[at].status).toBe('wrong');
      }
    }
  });

  it('accepts any drum in a one-drum pulse lesson (L01, L02)', () => {
    for (const id of ['L01', 'L02']) {
      const l = L(id);
      const r = checkAttempt(l.practice!, playWithWrongDrum(l.practice!, 0), l.assessment);
      expect(r.summary.wrong).toBe(0);
      expect(r.passed).toBe(true);
    }
  });

  it('still catches every wrong note in the keyboard lessons', () => {
    for (const l of lessons.filter((x) => x.assessment.checkPitch)) {
      for (const p of [l.practice!, l.independent!]) {
        const exp = soundingEvents(p);
        for (let at = 0; at < exp.length; at++) {
          const inputs: CapturedInput[] = exp.map((e, i) => ({
            id: `i${i}`,
            onsetMs: ticksToMs(e.onset, p.tempoBpm),
            releaseMs: ticksToMs(e.onset + e.duration, p.tempoBpm) - 20,
            midi: (e as { midi: number }).midi + (i === at ? 2 : 0),
            source: 'pointer' as const,
          }));
          const r = checkAttempt(p, inputs, l.assessment);
          expect(r.summary.wrong, `${l.id} note ${at + 1}`).toBe(1);
          expect(r.passed).toBe(false);
        }
      }
    }
  });
});
