// Deterministic checker. Aligns expected and played events one-to-one, in order,
// then reports separate facts for sound, onset timing, duration and rests.
// No AI is involved here; the coach and model read these facts but cannot change them.

import { type DrumSound, type Phrase, type SoundingEvent, soundingEvents, ticksToMs, TPQ } from '../music/events.ts';
import type { Assessment } from '../music/lessons.ts';

export interface CapturedInput {
  id: string;
  onsetMs: number; // relative to beat 0 of the phrase (audio-clock mapped)
  releaseMs?: number;
  midi?: number;
  sound?: DrumSound;
  source: 'pointer' | 'key';
}

export type TimingClass = 'early' | 'onTime' | 'late';

export interface EventFact {
  factId: string;
  expectedId: string;
  index: number;
  status: 'match' | 'wrong' | 'missed';
  inputId?: string;
  expectedLabel: string;
  playedLabel?: string;
  offsetBeats?: number;
  timing?: TimingClass;
  heldBeats?: number;
  duration?: 'short' | 'ok' | 'long';
}

export interface ExtraFact {
  factId: string;
  inputId: string;
  onsetBeats: number;
  inRest: boolean;
  restId?: string;
  playedLabel: string;
}

export interface CheckSummary {
  expected: number;
  correctSound: number;
  wrong: number;
  missed: number;
  extra: number;
  restViolations: number;
  early: number;
  onTime: number;
  late: number;
  durationOk: number;
  durationIssues: number;
}

export interface CheckResult {
  checkerVersion: string;
  facts: EventFact[];
  extras: ExtraFact[];
  summary: CheckSummary;
  passed: boolean;
  timed: boolean;
  /** Signed onset residuals in beats for matched events, in expected order (null where missed). */
  residualsBeats: (number | null)[];
  beatMs: number;
}

export const CHECKER_VERSION = '1.1.0';

function label(e: SoundingEvent | { midi?: number; sound?: DrumSound }): string {
  if ('kind' in e) return e.kind === 'note' ? `midi:${e.midi}` : `drum:${e.sound}`;
  return e.midi !== undefined ? `midi:${e.midi}` : `drum:${e.sound}`;
}

function soundMatches(exp: SoundingEvent, inp: CapturedInput): boolean {
  if (exp.kind === 'note') return inp.midi === exp.midi;
  return inp.sound === exp.sound;
}

/** Candidate window (ms) for pairing an input with an expected event; respects the smallest gap. */
export function candidateWindowMs(expected: SoundingEvent[], bpm: number, onTimeMs: number): number {
  const beatMs = 60000 / bpm;
  let minGap = Infinity;
  for (let i = 1; i < expected.length; i++) minGap = Math.min(minGap, ticksToMs(expected[i].onset - expected[i - 1].onset, bpm));
  if (!Number.isFinite(minGap)) minGap = beatMs;
  return Math.min(0.75 * beatMs, 0.5 * minGap + onTimeMs);
}

interface Step {
  op: 'match' | 'skipE' | 'skipI';
}

/**
 * Monotonic global alignment (Needleman–Wunsch style). Stable tie-breaking: match, then missed, then extra.
 */
function align(
  expected: SoundingEvent[],
  inputs: CapturedInput[],
  matchCost: (e: SoundingEvent, i: CapturedInput) => number, // Infinity = not allowed
): Step[] {
  const n = expected.length;
  const m = inputs.length;
  const GAP = 1;
  const cost: number[][] = Array.from({ length: n + 1 }, () => new Array<number>(m + 1).fill(0));
  const back: Step['op'][][] = Array.from({ length: n + 1 }, () => new Array<Step['op']>(m + 1).fill('match'));
  for (let i = 1; i <= n; i++) {
    cost[i][0] = i * GAP;
    back[i][0] = 'skipE';
  }
  for (let j = 1; j <= m; j++) {
    cost[0][j] = j * GAP;
    back[0][j] = 'skipI';
  }
  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      const mc = cost[i - 1][j - 1] + matchCost(expected[i - 1], inputs[j - 1]);
      const se = cost[i - 1][j] + GAP;
      const si = cost[i][j - 1] + GAP;
      let best = mc;
      let op: Step['op'] = 'match';
      if (se < best - 1e-9) {
        best = se;
        op = 'skipE';
      }
      if (si < best - 1e-9) {
        best = si;
        op = 'skipI';
      }
      cost[i][j] = best;
      back[i][j] = op;
    }
  }
  const steps: Step[] = [];
  let i = n;
  let j = m;
  while (i > 0 || j > 0) {
    const op = back[i][j];
    steps.push({ op });
    if (op === 'match') {
      i--;
      j--;
    } else if (op === 'skipE') i--;
    else j--;
  }
  return steps.reverse();
}

export function checkAttempt(target: Phrase, inputs: CapturedInput[], a: Assessment, tempoBpm = target.tempoBpm): CheckResult {
  const expected = soundingEvents(target);
  const sorted = [...inputs].sort((x, y) => x.onsetMs - y.onsetMs);
  const beatMs = 60000 / tempoBpm;
  const timed = a.checkTiming;
  const onTimeMs = Math.min(a.onTimeWindow.beats * beatMs, a.onTimeWindow.maxMs);
  const durTolMs = Math.min(a.durationTolerance.beats * beatMs, a.durationTolerance.maxMs);
  // Which drum counts when a pattern uses more than one kind of drum (for example snare and bass drum),
  // because the music then asks for a particular drum. A one-drum pulse lesson accepts any drum.
  const drumKinds = new Set(expected.filter((e) => e.kind === 'drum').map((e) => (e as { sound: DrumSound }).sound));
  const soundMatters = a.checkPitch || drumKinds.size > 1;
  const candidate = candidateWindowMs(expected, tempoBpm, onTimeMs);

  const matchCost = (e: SoundingEvent, inp: CapturedInput): number => {
    const soundPenalty = soundMatters && !soundMatches(e, inp) ? (timed ? 0.6 : 0.9) : 0;
    if (!timed) return soundPenalty;
    const d = Math.abs(inp.onsetMs - ticksToMs(e.onset, tempoBpm));
    if (d > candidate) return Infinity;
    return d / candidate + soundPenalty;
  };

  const steps = align(expected, sorted, matchCost);
  const facts: EventFact[] = [];
  const extras: ExtraFact[] = [];
  const residuals: (number | null)[] = [];
  let ei = 0;
  let ii = 0;
  const rests = target.events.filter((e) => e.kind === 'rest');

  for (const s of steps) {
    if (s.op === 'match') {
      const e = expected[ei];
      const inp = sorted[ii];
      const ok = !soundMatters || soundMatches(e, inp);
      const fact: EventFact = {
        factId: `f-${e.id}`,
        expectedId: e.id,
        index: ei,
        status: ok ? 'match' : 'wrong',
        inputId: inp.id,
        expectedLabel: label(e),
        playedLabel: label(inp),
      };
      if (timed) {
        const off = inp.onsetMs - ticksToMs(e.onset, tempoBpm);
        fact.offsetBeats = off / beatMs;
        fact.timing = Math.abs(off) <= onTimeMs ? 'onTime' : off < 0 ? 'early' : 'late';
        residuals.push(off / beatMs);
      } else residuals.push(null);
      if (a.checkDuration && e.kind === 'note') {
        if (inp.releaseMs !== undefined) {
          const held = inp.releaseMs - inp.onsetMs;
          const want = ticksToMs(e.duration, tempoBpm);
          fact.heldBeats = held / beatMs;
          fact.duration = held < want - durTolMs ? 'short' : held > want + durTolMs ? 'long' : 'ok';
        } else fact.duration = 'short';
      }
      facts.push(fact);
      ei++;
      ii++;
    } else if (s.op === 'skipE') {
      const e = expected[ei];
      facts.push({ factId: `f-${e.id}`, expectedId: e.id, index: ei, status: 'missed', expectedLabel: label(e) });
      residuals.push(null);
      ei++;
    } else {
      const inp = sorted[ii];
      const onsetTicks = (inp.onsetMs / beatMs) * TPQ;
      const slack = (onTimeMs / beatMs) * TPQ;
      const rest = rests.find((r) => onsetTicks >= r.onset - slack && onsetTicks < r.onset + r.duration - slack);
      extras.push({
        factId: `x-${inp.id}`,
        inputId: inp.id,
        onsetBeats: inp.onsetMs / beatMs,
        inRest: a.checkRestViolations && !!rest,
        restId: rest?.id,
        playedLabel: label(inp),
      });
      ii++;
    }
  }

  const summary: CheckSummary = {
    expected: expected.length,
    correctSound: facts.filter((f) => f.status === 'match').length,
    wrong: facts.filter((f) => f.status === 'wrong').length,
    missed: facts.filter((f) => f.status === 'missed').length,
    extra: extras.length,
    restViolations: extras.filter((x) => x.inRest).length,
    early: facts.filter((f) => f.timing === 'early').length,
    onTime: facts.filter((f) => f.timing === 'onTime').length,
    late: facts.filter((f) => f.timing === 'late').length,
    durationOk: facts.filter((f) => f.duration === 'ok').length,
    durationIssues: facts.filter((f) => f.duration === 'short' || f.duration === 'long').length,
  };
  const allowance = Math.floor(expected.length / 4);
  const passed =
    expected.length > 0 &&
    summary.wrong === 0 &&
    summary.missed === 0 &&
    summary.extra === 0 &&
    (!timed || summary.early + summary.late <= allowance) &&
    (!a.checkDuration || summary.durationIssues <= allowance);

  return { checkerVersion: CHECKER_VERSION, facts, extras, summary, passed, timed, residualsBeats: residuals, beatMs };
}
