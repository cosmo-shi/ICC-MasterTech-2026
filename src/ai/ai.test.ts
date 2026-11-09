import { afterEach, describe, expect, it } from 'vitest';
import seed from '../data/lessons.seed.json';
import { parseLessons } from '../music/lessons.ts';
import { type Phrase, soundingEvents, ticksToMs } from '../music/events.ts';
import { checkAttempt, type CapturedInput } from '../engine/checker.ts';
import { decide } from './coach.ts';
import { loadModel, runModel, setModelForTesting } from './model.ts';
import { compileReply, verifyReply, type ReplyPlan } from './reply.ts';
import { rulesPattern } from './rules.ts';
import { buildDataset } from './synth.ts';
import modelFile from './model.weights.json';
import type { ModelFile } from './mlp.ts';

const lessons = parseLessons(seed);
const L = (id: string) => lessons.find((l) => l.id === id)!;

function play(p: Phrase, residualBeats: (i: number) => number): CapturedInput[] {
  const beat = 60000 / p.tempoBpm;
  return soundingEvents(p).map((e, i) => ({
    id: `i${i}`,
    onsetMs: ticksToMs(e.onset, p.tempoBpm) + residualBeats(i) * beat,
    sound: e.kind === 'drum' ? e.sound : undefined,
    midi: e.kind === 'note' ? e.midi : undefined,
    source: 'pointer' as const,
  }));
}

afterEach(() => setModelForTesting(undefined));

describe('on-device model', () => {
  it('loads a valid model file', () => {
    expect(loadModel()).not.toBeNull();
  });

  it('beats the rules baseline on a fresh held-out family set (seed differs from training)', () => {
    const data = buildDataset(777, 50_000, 60, 30);
    let m = 0;
    let r = 0;
    for (const s of data) {
      const res = runModel(s.evidence);
      if (res.pattern === s.label) m++;
      if (rulesPattern(s.evidence) === s.label) r++;
    }
    expect(m / data.length).toBeGreaterThan(0.85);
    expect(m).toBeGreaterThanOrEqual(r);
  });

  it('abstains with fewer than three matched events', () => {
    expect(runModel({ residuals: [0.1, 0.2], positions: [0, 1], expectedCount: 4 }).status).toBe('insufficient');
  });

  it('reports unavailable for a corrupted model', () => {
    setModelForTesting(null);
    expect(runModel({ residuals: [0, 0, 0, 0], positions: [0, 1, 2, 3], expectedCount: 4 }).status).toBe('unavailable');
  });

  it('rejects a model file with the wrong weight shapes', async () => {
    const { validateModelFile } = await import('./mlp.ts');
    const bad = JSON.parse(JSON.stringify(modelFile)) as ModelFile;
    bad.weights.w1.pop();
    expect(validateModelFile(bad)).toBe(false);
  });
});

describe('coach decisions', () => {
  const l = L('L01');
  const base = { aiEnabled: true, independentCheck: false, tempoBpm: l.tempoBpm, target: l.independent! };

  it('a consistently late attempt gets a model-selected pulse reply, verified, labelled AI coach', () => {
    const inputs = play(l.independent!, () => 0.28);
    const result = checkAttempt(l.independent!, inputs, l.assessment);
    const d = decide({ ...base, inputs, result });
    expect(d.focus).toBe('timing');
    expect(d.patternSource).toBe('local-model');
    expect(d.pattern).toBe('late');
    expect(d.label).toBe('AI coach');
    expect(d.reply?.plan.params.op).toBe('add_part');
    expect(d.reply?.verification.ok).toBe(true);
  });

  it('a speeding-up attempt gets a different reply than a late one', () => {
    const inputs = play(l.independent!, (i) => -0.06 * i);
    const result = checkAttempt(l.independent!, inputs, l.assessment);
    const d = decide({ ...base, inputs, result });
    expect(d.pattern).toBe('speedingUp');
    expect(d.reply?.plan.planId).toBe('pulse-slower');
  });

  it('with AI off, the same attempt uses rules and is labelled Coach tips', () => {
    const inputs = play(l.independent!, () => 0.28);
    const result = checkAttempt(l.independent!, inputs, l.assessment);
    const d = decide({ ...base, aiEnabled: false, inputs, result });
    expect(d.patternSource).toBe('rules');
    expect(d.label).toBe('Coach tips');
    expect(d.model).toBeUndefined();
  });

  it('falls back to rules when the model fails to load', () => {
    setModelForTesting(null);
    const inputs = play(l.independent!, () => 0.28);
    const result = checkAttempt(l.independent!, inputs, l.assessment);
    const d = decide({ ...base, inputs, result });
    expect(d.patternSource).toBe('rules');
    expect(d.label).toBe('Coach tips');
  });

  it('never offers a reply during an independent check', () => {
    const inputs = play(l.independent!, () => 0.28);
    const result = checkAttempt(l.independent!, inputs, l.assessment);
    expect(decide({ ...base, independentCheck: true, inputs, result }).reply).toBeUndefined();
  });

  it('wrong note focuses on sound before timing, and names the notes', () => {
    const k = L('L05');
    const inputs = play(k.practice!, () => 0);
    inputs[1].midi = 64;
    const result = checkAttempt(k.practice!, inputs, k.assessment);
    const d = decide({ ...base, target: k.practice!, tempoBpm: k.tempoBpm, inputs, result });
    expect(d.focus).toBe('sound');
    expect(d.observation).toContain('E');
    expect(d.observation).toContain('D');
    expect(d.question.toLowerCase()).not.toContain('d.'); // question does not give the answer
  });

  it('a tap in a rest gets a reply that silences exactly that tap', () => {
    const k = L('L02');
    const inputs = play(k.practice!, () => 0);
    inputs.push({ id: 'oops', onsetMs: 750, sound: 'kick', source: 'pointer' });
    const result = checkAttempt(k.practice!, inputs, k.assessment);
    const d = decide({ ...base, target: k.practice!, tempoBpm: k.tempoBpm, inputs, result });
    expect(d.focus).toBe('rest');
    expect(d.reply?.plan.params).toEqual({ op: 'replace_with_rest', eventId: 'oops' });
    expect(d.reply?.verification.ok).toBe(true);
  });
});

describe('reply verifier', () => {
  const melody: Phrase = {
    id: 'm',
    instrument: 'keyboard',
    meter: [4, 4],
    totalTicks: 1920,
    tempoBpm: 90,
    events: [
      { id: 'a', kind: 'note', onset: 0, duration: 480, midi: 60, velocity: 0.6 },
      { id: 'b', kind: 'note', onset: 480, duration: 480, midi: 62, velocity: 0.6 },
      { id: 'c', kind: 'note', onset: 960, duration: 480, midi: 64, velocity: 0.6 },
      { id: 'd', kind: 'note', onset: 1440, duration: 480, midi: 67, velocity: 0.6 },
    ],
  };
  const plan = (params: ReplyPlan['params']): ReplyPlan => ({ planId: 't', params, source: 'learner', provenance: 'learner-directed', evidenceFactIds: [], templateId: 'x' });

  it('accepts a correct transpose and proves rhythm is kept', () => {
    const p = plan({ op: 'transpose', semitones: 5 });
    const v = verifyReply(p, melody, compileReply(p, melody));
    expect(v.ok).toBe(true);
    expect(v.verified.join(' ')).toMatch(/rhythm kept/);
  });

  it('rejects a tampered transpose that changes rhythm', () => {
    const p = plan({ op: 'transpose', semitones: 5 });
    const r = compileReply(p, melody);
    r.tracks[0].events[1].onset += 120;
    expect(verifyReply(p, melody, r).ok).toBe(false);
  });

  it('rejects a transpose where one note moved differently', () => {
    const p = plan({ op: 'transpose', semitones: 2 });
    const r = compileReply(p, melody);
    const e = r.tracks[0].events[2];
    if (e.kind === 'note') e.midi += 1;
    expect(verifyReply(p, melody, r).violations).toContain('not every note moved by the same amount');
  });

  it('dynamics softer keeps pitch and time and lowers every volume', () => {
    const p = plan({ op: 'dynamics', direction: 'softer' });
    expect(verifyReply(p, melody, compileReply(p, melody)).ok).toBe(true);
  });

  it('section order keeps both sections intact', () => {
    const p = plan({ op: 'section_order', splitTick: 960 });
    const r = compileReply(p, melody);
    expect(verifyReply(p, melody, r).ok).toBe(true);
    const first = r.tracks[0].events[0];
    expect(first.kind === 'note' && first.midi).toBe(64);
  });

  it('section order rejects a split that is not on a beat', () => {
    const p = plan({ op: 'section_order', splitTick: 700 });
    expect(verifyReply(p, melody, compileReply(p, melody)).ok).toBe(false);
  });

  it('add_part keeps the learner part and labels the partner', () => {
    const p = plan({ op: 'add_part', part: 'pulse', tempoScale: 1 });
    const v = verifyReply(p, melody, compileReply(p, melody));
    expect(v.ok).toBe(true);
  });

  it('add_part rejects a render that altered the learner part', () => {
    const p = plan({ op: 'add_part', part: 'pulse', tempoScale: 1 });
    const r = compileReply(p, melody);
    r.tracks[0].events.pop();
    expect(verifyReply(p, melody, r).violations).toContain('original part was changed');
  });

  it('rejects out-of-range pitch and volume', () => {
    const p = plan({ op: 'transpose', semitones: 12 });
    const high = { ...melody, events: melody.events.map((e) => (e.kind === 'note' ? { ...e, midi: e.midi + 30 } : e)) };
    expect(verifyReply(p, high, compileReply(p, high)).ok).toBe(false);
  });

  it('refuses any reply on an independent check', () => {
    const p = plan({ op: 'echo', tempoScale: 1 });
    expect(verifyReply(p, melody, compileReply(p, melody), { independentCheck: true }).ok).toBe(false);
  });
});
