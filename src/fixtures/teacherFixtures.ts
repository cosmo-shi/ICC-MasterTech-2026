// Made-up learners and practice attempts for test data mode (see testMode.ts). Each attempt is
// produced by the real checker from synthetic key presses, so the teacher screens show exactly
// what they would for real practice. Names say "Test learner" so they can't be mistaken for children.
import { lessonById } from '../data/catalog.ts';
import { type CapturedInput, checkAttempt } from '../engine/checker.ts';
import { soundingEvents, TPQ } from '../music/events.ts';
import type { AttemptRecord } from '../store/db.ts';
import type { Player } from '../store/profiles.ts';

const DAY = 864e5;
const NOW = Date.now();

export const FIXTURE_PLAYERS: Player[] = [
  { id: 'test-a', name: 'Test learner A', colour: 'coral', createdAt: NOW - 20 * DAY },
  { id: 'test-b', name: 'Test learner B', colour: 'sky', createdAt: NOW - 20 * DAY },
  { id: 'test-c', name: 'Test learner C', colour: 'lilac', createdAt: NOW - 3 * DAY },
  { id: 'test-d', name: 'Test learner D', colour: 'mint', createdAt: NOW - 9 * DAY },
];

let n = 0;
function attempt(profileId: string, lessonId: string, daysAgo: number, opts: { kind?: 'practice' | 'independent'; lateMs?: number; wrong?: Record<number, number>; slower?: boolean; hint?: number; mic?: 'unclear' }): AttemptRecord {
  const lesson = lessonById(lessonId)!;
  const target = opts.kind === 'independent' ? lesson.independent! : lesson.practice!;
  const beatMs = 60000 / lesson.tempoBpm;
  const inputs: CapturedInput[] = soundingEvents(target).map((e, i) => ({
    id: `fx-${n}-${i}`,
    onsetMs: (e.onset / TPQ) * beatMs + (opts.lateMs ?? 0) * (i + 1) * 0.5,
    releaseMs: ((e.onset + e.duration) / TPQ) * beatMs - 20,
    ...(e.kind === 'note' ? { midi: opts.wrong?.[i] ?? e.midi } : e.kind === 'drum' ? { sound: e.sound } : {}),
    source: 'pointer' as const,
  }));
  const res = checkAttempt(target, inputs, lesson.assessment, lesson.tempoBpm);
  n++;
  return {
    id: `fixture-${n}`,
    createdAt: NOW - daysAgo * DAY - n * 60000,
    activityId: lessonId,
    activityVersion: lesson.version,
    kind: opts.kind ?? 'practice',
    instrument: target.instrument,
    tempoBpm: lesson.tempoBpm,
    support: { hintLevel: opts.hint ?? 0, heardExample: true, largeControls: false, simplified: false, aiEnabled: true, slower: !!opts.slower },
    inputs,
    summary: res.summary,
    passed: opts.mic === 'unclear' ? false : res.passed,
    checkerVersion: res.checkerVersion,
    profileId,
    ...(opts.mic ? { input: { mode: 'mic' as const, unclear: true, reason: 'faint' } } : {}),
  };
}

/** A: beat drifts late on L01, three tries. B: notes secure, on their own. C: nothing yet. D: one unclear microphone try. */
export function fixtureAttempts(): AttemptRecord[] {
  n = 0;
  return [
    attempt('test-a', 'L01', 6, { lateMs: 90 }),
    attempt('test-a', 'L01', 4, { lateMs: 110, slower: true }),
    attempt('test-a', 'L01', 1, { lateMs: 100, hint: 2 }),
    attempt('test-b', 'L04', 8, {}),
    attempt('test-b', 'L05', 5, { wrong: { 2: 67 } }),
    attempt('test-b', 'L05', 5, {}),
    attempt('test-b', 'L05', 2, { kind: 'independent' }),
    attempt('test-b', 'L06', 1, { kind: 'independent' }),
    attempt('test-d', 'L01', 3, { mic: 'unclear' }),
  ];
}
