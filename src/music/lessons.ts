// Loads and validates the ten foundation lesson drafts (context pack, CC BY-SA 4.0).
// Converts beat-based seed data to canonical ticks without rounding.

import { beatsToTicks, type DrumSound, type InstrumentId, type MusicEvent, type Phrase } from './events.ts';

export type AssessmentMode = 'free-exploration' | 'timed-onsets' | 'pitch-sequence' | 'timed-pitch-duration' | 'creative-completion';

export interface Assessment {
  mode: AssessmentMode;
  score: boolean;
  checkPitch: boolean;
  checkTiming: boolean;
  checkDuration: boolean;
  checkRestViolations: boolean;
  onTimeWindow: { beats: number; maxMs: number };
  durationTolerance: { beats: number; maxMs: number };
}

export interface Hint {
  level: 'question' | 'clue' | 'answer';
  text: string;
  action?: string;
}

export interface Lesson {
  id: string;
  version: string;
  title: string;
  goal: string;
  objective: string;
  instruction: string;
  explanation: string;
  prerequisites: string[];
  instruments: InstrumentId[];
  tempoBpm: number;
  assessment: Assessment;
  practice: Phrase | null;
  independent: Phrase | null;
  hints: Hint[];
  strategyIds: string[];
  creationPrompt: string;
  sourceIds: string[];
  reviewStatus: string;
  licence: string;
  needsHold: boolean;
  showStave: boolean;
}

interface SeedEvent {
  id: string;
  kind: string;
  onsetBeats: number;
  durationBeats: number;
  soundId?: string;
  pitch?: { midi: number; name: string };
  velocity?: number;
}

interface SeedPattern {
  id: string;
  instrument: InstrumentId;
  totalBeats: number;
  timeSignature: [number, number];
  events: SeedEvent[];
}

const DRUM_MAP: Record<string, DrumSound> = { kick: 'kick', snare: 'snare', hihat: 'hihat', 'hi-hat': 'hihat', tom: 'tomHigh', tomHigh: 'tomHigh', tomLow: 'tomLow', crash: 'crash' };

export function patternToPhrase(p: SeedPattern, tempoBpm: number): Phrase {
  const events: MusicEvent[] = p.events.map((e) => {
    const onset = beatsToTicks(e.onsetBeats);
    const duration = beatsToTicks(e.durationBeats);
    if (e.kind === 'rest') return { id: e.id, kind: 'rest', onset, duration, author: 'lesson' };
    if (e.kind === 'drum') {
      const sound = DRUM_MAP[e.soundId ?? ''];
      if (!sound) throw new Error(`Unknown drum sound ${e.soundId} in ${e.id}`);
      return { id: e.id, kind: 'drum', onset, duration, sound, velocity: e.velocity ?? 0.7, author: 'lesson' };
    }
    if (e.kind === 'note') {
      if (!e.pitch || !Number.isInteger(e.pitch.midi)) throw new Error(`Note without MIDI pitch in ${e.id}`);
      return { id: e.id, kind: 'note', onset, duration, midi: e.pitch.midi, velocity: e.velocity ?? 0.7, author: 'lesson' };
    }
    throw new Error(`Unknown event kind ${e.kind}`);
  });
  const totalTicks = beatsToTicks(p.totalBeats);
  return { id: p.id, instrument: p.instrument, meter: p.timeSignature, totalTicks, tempoBpm, events };
}

/** Structural checks: events inside the phrase, no overlaps in a single line, bar totals add up. */
export function validatePhrase(p: Phrase): string[] {
  const errors: string[] = [];
  const sorted = [...p.events].sort((a, b) => a.onset - b.onset);
  let cursor = 0;
  for (const e of sorted) {
    if (e.onset < 0 || e.duration <= 0) errors.push(`${e.id}: bad timing`);
    if (e.onset + e.duration > p.totalTicks) errors.push(`${e.id}: extends past phrase end`);
    if (e.onset < cursor) errors.push(`${e.id}: overlaps previous event`);
    cursor = Math.max(cursor, e.onset + e.duration);
    if (e.kind === 'note' && (e.midi < 21 || e.midi > 108)) errors.push(`${e.id}: pitch out of piano range`);
  }
  const barTicks = (p.meter[0] * 4 * 480) / p.meter[1];
  if (p.totalTicks % barTicks !== 0) errors.push(`${p.id}: total is not whole bars`);
  return errors;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function parseLessons(seed: any): Lesson[] {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return seed.lessons.map((l: any): Lesson => {
    const a = l.assessment ?? {};
    const tempo = l.tempoBpm ?? 80;
    const assessment: Assessment = {
      mode: a.mode,
      score: !!a.score,
      checkPitch: !!a.checkPitch,
      checkTiming: a.checkTiming ?? (a.mode === 'timed-onsets' || a.mode === 'timed-pitch-duration'),
      checkDuration: !!a.checkDuration,
      checkRestViolations: !!a.checkRestViolations,
      onTimeWindow: a.onTimeWindow ?? { beats: 0.2, maxMs: 150 },
      durationTolerance: a.durationTolerance ?? { beats: 0.25, maxMs: 200 },
    };
    const practice = l.practice ? patternToPhrase(l.practice, tempo) : null;
    const independent = l.independent ? patternToPhrase(l.independent, tempo) : null;
    for (const ph of [practice, independent]) {
      if (!ph) continue;
      const errs = validatePhrase(ph);
      if (errs.length) throw new Error(`Lesson ${l.id} invalid: ${errs.join('; ')}`);
    }
    return {
      id: l.id,
      version: l.version,
      title: l.title,
      goal: l.goal,
      objective: l.objective,
      instruction: l.instruction,
      explanation: l.explanation,
      prerequisites: l.prerequisites ?? [],
      instruments: l.supportedInstruments,
      tempoBpm: tempo,
      assessment,
      practice,
      independent,
      hints: l.hints,
      strategyIds: l.strategyIds ?? [],
      creationPrompt: l.creationPrompt,
      sourceIds: l.sourceIds ?? [],
      reviewStatus: l.reviewStatus,
      licence: l.licence,
      needsHold: (l.requiredInputCapabilities ?? []).includes('note-off'),
      showStave: practice?.instrument === 'keyboard',
    };
  });
}
