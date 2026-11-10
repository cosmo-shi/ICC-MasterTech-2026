import { describe, expect, it } from 'vitest';
import seed from '../data/lessons.seed.json';
import { parseLessons } from '../music/lessons.ts';
import { ticksToMs, soundingEvents, type Phrase } from '../music/events.ts';
import { type CapturedInput, checkAttempt } from './checker.ts';

const lessons = parseLessons(seed);
const L = (id: string) => lessons.find((l) => l.id === id)!;

function perfect(p: Phrase, offsetMs = 0, bpm = p.tempoBpm): CapturedInput[] {
  return soundingEvents(p).map((e, i) => ({
    id: `i${i}`,
    onsetMs: ticksToMs(e.onset, bpm) + offsetMs,
    releaseMs: ticksToMs(e.onset + e.duration, bpm) + offsetMs - 20,
    midi: e.kind === 'note' ? e.midi : undefined,
    sound: e.kind === 'drum' ? e.sound : undefined,
    source: 'pointer',
  }));
}

describe('lesson data', () => {
  it('loads ten foundation lessons with lossless tick conversion', () => {
    expect(lessons).toHaveLength(10);
    const l3 = L('L03').practice!;
    expect(l3.events[1].onset).toBe(240); // half a beat
  });
  it('places middle C as MIDI 60', () => {
    const e = L('L05').practice!.events[0];
    expect(e.kind === 'note' && e.midi).toBe(60);
  });
  it('independent patterns differ from practice patterns', () => {
    for (const l of lessons) {
      if (!l.practice || !l.independent) continue;
      expect(JSON.stringify(l.practice.events.map((e) => [e.kind, e.onset, 'midi' in e ? e.midi : 0]))).not.toBe(
        JSON.stringify(l.independent.events.map((e) => [e.kind, e.onset, 'midi' in e ? e.midi : 0])),
      );
    }
  });
});

describe('checker', () => {
  it('exact performance passes', () => {
    const l = L('L01');
    const r = checkAttempt(l.practice!, perfect(l.practice!), l.assessment);
    expect(r.passed).toBe(true);
    expect(r.summary.onTime).toBe(4);
  });

  it('classifies early and late beyond the on-time window', () => {
    const l = L('L01');
    const inputs = perfect(l.practice!);
    inputs[1].onsetMs -= 200; // window at 80 bpm is min(0.2*750, 150) = 150 ms
    inputs[2].onsetMs += 200;
    const r = checkAttempt(l.practice!, inputs, l.assessment);
    expect(r.facts[1].timing).toBe('early');
    expect(r.facts[2].timing).toBe('late');
    expect(r.facts[0].timing).toBe('onTime');
  });

  it('reports a tap in a rest as a rest violation, not a wrong note', () => {
    const l = L('L02');
    const inputs = perfect(l.practice!);
    inputs.push({ id: 'x', onsetMs: 750, sound: 'kick', source: 'pointer' }); // beat 2 is a rest
    const r = checkAttempt(l.practice!, inputs, l.assessment);
    expect(r.summary.restViolations).toBe(1);
    expect(r.summary.wrong).toBe(0);
    expect(r.passed).toBe(false);
  });

  it('reports a missed hit as missed', () => {
    const l = L('L01');
    const inputs = perfect(l.practice!).filter((_, i) => i !== 2);
    const r = checkAttempt(l.practice!, inputs, l.assessment);
    expect(r.summary.missed).toBe(1);
    expect(r.facts[2].status).toBe('missed');
  });

  it('a double hit is one match and one extra, never double credit', () => {
    const l = L('L01');
    const inputs = perfect(l.practice!);
    inputs.push({ id: 'dbl', onsetMs: inputs[1].onsetMs + 40, sound: 'kick', source: 'pointer' });
    const r = checkAttempt(l.practice!, inputs, l.assessment);
    expect(r.summary.correctSound).toBe(4);
    expect(r.summary.extra).toBe(1);
  });

  it('quavers do not match to the neighbouring event', () => {
    const l = L('L03');
    const inputs = perfect(l.practice!);
    const r = checkAttempt(l.practice!, inputs, l.assessment);
    expect(r.passed).toBe(true);
    expect(r.facts.map((f) => f.inputId)).toEqual(inputs.map((i) => i.id));
  });

  it('a tap just before a rest names the rest’s beat, not the beat before it', () => {
    const p = L('L02').practice!;
    const inputs = perfect(p);
    const beatMs = 60000 / p.tempoBpm;
    inputs.push({ id: 'early', onsetMs: beatMs * 0.95, sound: 'kick', source: 'pointer' }); // just before beat 2, a rest
    const r = checkAttempt(p, inputs, L('L02').assessment, p.tempoBpm);
    const x = r.extras.find((e) => e.inputId === 'early')!;
    expect(x.inRest).toBe(true);
    expect(x.restBeat).toBe(2);
  });

  it('an extra note does not shift the rest of the alignment', () => {
    const l = L('L03');
    const inputs = perfect(l.practice!);
    inputs.splice(2, 0, { id: 'extra', onsetMs: 600, sound: 'snare', source: 'pointer' });
    const r = checkAttempt(l.practice!, inputs, l.assessment);
    expect(r.summary.correctSound).toBe(5);
    expect(r.summary.extra).toBe(1);
  });

  it('untimed pitch tasks: wrong note is "wrong", and timing is never penalised', () => {
    const l = L('L05');
    const inputs = perfect(l.practice!).map((x, i) => ({ ...x, onsetMs: i * 2000 })); // very slow
    inputs[1].midi = 64; // played E instead of D
    const r = checkAttempt(l.practice!, inputs, l.assessment);
    expect(r.timed).toBe(false);
    expect(r.facts[1].status).toBe('wrong');
    expect(r.summary.early + r.summary.late).toBe(0);
  });

  it('two deliberate wrong notes report two wrong', () => {
    const l = L('L06');
    const inputs = perfect(l.practice!);
    inputs[0].midi = 65;
    inputs[3].midi = 67;
    const r = checkAttempt(l.practice!, inputs, l.assessment);
    expect(r.summary.wrong).toBe(2);
  });

  it('held duration is checked only where note-off exists (L07 minim)', () => {
    const l = L('L07');
    const inputs = perfect(l.practice!);
    inputs[0].releaseMs = inputs[0].onsetMs + 500; // minim at 80 bpm = 1500 ms
    const r = checkAttempt(l.practice!, inputs, l.assessment);
    expect(r.facts[0].duration).toBe('short');
    expect(r.facts[1].duration).toBe('ok');
  });

  it('changing tempo is respected (slower practice)', () => {
    const l = L('L01');
    const r = checkAttempt(l.practice!, perfect(l.practice!, 0, 60), l.assessment, 60);
    expect(r.passed).toBe(true);
  });
});
