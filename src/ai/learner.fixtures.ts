// Test helpers for the learner model and planner (not shipped in the app bundle).
import { LESSONS } from '../data/catalog.ts';
import type { AttemptRecord } from '../store/db.ts';
import type { CheckSummary } from '../engine/checker.ts';
import { lessonInfos } from './learner.ts';

export const INFOS = lessonInfos(LESSONS);
export const info = (id: string) => INFOS.find((l) => l.id === id)!;

export function summary(over: Partial<CheckSummary> = {}): CheckSummary {
  return { expected: 8, correctSound: 8, wrong: 0, missed: 0, extra: 0, restViolations: 0, early: 0, onTime: 8, late: 0, durationOk: 8, durationIssues: 0, ...over };
}

let n = 0;
export function attempt(activityId: string, over: Partial<AttemptRecord> = {}, s: Partial<CheckSummary> = {}): AttemptRecord {
  n += 1;
  return {
    id: `a${n}`,
    createdAt: n,
    activityId,
    activityVersion: '1',
    kind: 'practice',
    instrument: 'drums',
    tempoBpm: 80,
    support: { hintLevel: 0, heardExample: false, largeControls: false, simplified: false, aiEnabled: true, slower: false },
    inputs: [],
    summary: summary(s),
    passed: true,
    ...over,
  };
}
