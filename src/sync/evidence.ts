// What leaves a learner's device when it is linked to a class: a short summary of each attempt.
// Never audio, never the raw timings or notes played, never reflections or free text, never the
// player's name on this device (the class knows the learner by the nickname the teacher typed).

import type { AttemptRecord } from '../store/db.ts';

export interface EvidencePayload {
  id: string;
  activity_id: string;
  kind: 'practice' | 'independent' | 'check' | 'mission-check' | 'make';
  instrument: 'keyboard' | 'drums';
  input_mode: 'screen' | 'mic' | 'midi';
  unclear: boolean;
  passed: boolean;
  /** Counts only. */
  summary: Record<string, number> | null;
  /** Which help was on. */
  support: Record<string, boolean | number> | null;
  /** What the coach focused on and where that came from. */
  coach: { focus: string; source: string } | null;
  attempted_at: number;
  assignment_id?: string;
}

const KIND: Record<AttemptRecord['kind'], EvidencePayload['kind']> = {
  practice: 'practice',
  independent: 'independent',
  check: 'check',
  mission: 'make',
  'mission-check': 'mission-check',
  concept: 'check', // never sent: see isSyncable
};

/** Teacher notes kept on this device (PIN view) are not learning evidence. */
// Concept mini-checks stay on the device until momo decides whether classes should see them.
export const isSyncable = (a: AttemptRecord): boolean => a.kind !== 'concept' && !a.note && !!a.activityId && a.activityId.length <= 40 && a.id.length >= 4 && a.id.length <= 64;

export function toEvidence(a: AttemptRecord, assignmentId?: string): EvidencePayload {
  const s = a.summary;
  return {
    id: a.id,
    activity_id: a.activityId,
    kind: KIND[a.kind],
    instrument: a.instrument === 'keyboard' ? 'keyboard' : 'drums',
    input_mode: a.input?.mode ?? 'screen',
    unclear: !!a.input?.unclear,
    passed: !!a.passed && !a.input?.unclear,
    summary: s
      ? { expected: s.expected, matched: s.correctSound, wrong: s.wrong, missed: s.missed, extra: s.extra, rests: s.restViolations, early: s.early, onTime: s.onTime, late: s.late, durationIssues: s.durationIssues }
      : null,
    support: {
      hint: a.support.hintLevel,
      heard: a.support.heardExample,
      bigger: a.support.largeControls,
      slower: a.support.slower,
      counting: !!a.support.counting,
      simplified: a.support.simplified,
    },
    coach: a.coach ? { focus: a.coach.focus, source: a.coach.patternSource } : null,
    attempted_at: a.createdAt,
    ...(assignmentId ? { assignment_id: assignmentId } : {}),
  };
}
