// Where each learner is with an assignment, worked out from synced evidence. These are prompts for
// the teacher to look, not judgements: "may need support" means several tries without success,
// and an input problem is the device or room, never the learner.

export type LearnerStatus = 'not-joined' | 'waiting-to-sync' | 'not-started' | 'practising' | 'ready' | 'may-need-support' | 'input-problem';

export interface EvidenceRow {
  id: string;
  activity_id: string;
  assignment_id?: string | null;
  kind: string;
  unclear: boolean;
  passed: boolean;
  input_mode?: string | null;
  attempted_at: string;
  summary?: Record<string, number> | null;
  support?: Record<string, boolean | number> | null;
  coach?: { focus?: string; source?: string } | null;
}

export interface SeatInfo {
  joined_at: string | null;
  seen_at: string | null;
  code_waiting: boolean;
}

export const STATUS_WORDS: Record<LearnerStatus, { label: string; about: string }> = {
  'not-joined': { label: 'Not joined yet', about: 'No device is linked to this learner. Give them their code.' },
  'waiting-to-sync': { label: 'Waiting to sync', about: 'Their device hasn’t connected since you set this. Work done offline arrives when it does.' },
  'not-started': { label: 'Not started', about: 'No tries on this activity yet.' },
  practising: { label: 'Practising', about: 'Has tried it; still working on it.' },
  ready: { label: 'Ready to move on', about: 'Played it on their own, without hints.' },
  'may-need-support': { label: 'May need support', about: 'Several tries without success. Worth a look or a word.' },
  'input-problem': { label: 'Input problem', about: 'Carmen couldn’t hear clearly (room, microphone or device). Not counted against them.' },
};

/** Where one learner is with one activity. `since`: when it was assigned (ISO). */
export function statusFor(activityId: string, evidence: EvidenceRow[], seat: SeatInfo | null, since?: string): LearnerStatus {
  if (!seat?.joined_at) return 'not-joined';
  const t0 = since ? Date.parse(since) : 0;
  const mine = evidence
    .filter((e) => e.activity_id === activityId && Date.parse(e.attempted_at) >= t0 && e.kind !== 'check')
    .sort((a, b) => Date.parse(b.attempted_at) - Date.parse(a.attempted_at));
  if (mine.length === 0) {
    const seen = seat.seen_at ? Date.parse(seat.seen_at) : 0;
    return seen < t0 ? 'waiting-to-sync' : 'not-started';
  }
  if (mine.some((e) => e.passed && !e.unclear && (e.kind === 'independent' || e.kind === 'mission-check'))) return 'ready';
  const recent = mine.slice(0, 3);
  if (recent.filter((e) => e.unclear).length >= 2) return 'input-problem';
  const clear = mine.filter((e) => !e.unclear);
  const recentClear = clear.slice(0, 3);
  if (recentClear.length >= 3 && recentClear.every((e) => !e.passed)) return 'may-need-support';
  return 'practising';
}

/** Counts per status, for the top of the board. */
export function tally(statuses: LearnerStatus[]): Record<LearnerStatus, number> {
  const out = Object.fromEntries(Object.keys(STATUS_WORDS).map((k) => [k, 0])) as Record<LearnerStatus, number>;
  for (const s of statuses) out[s]++;
  return out;
}

/** One plain line about an attempt, for the teacher's review. Words before numbers. */
export function describeEvidence(e: EvidenceRow): string {
  const kind = e.kind === 'independent' ? 'On their own' : e.kind === 'mission-check' ? 'Project check' : e.kind === 'make' ? 'Made music' : e.kind === 'check' ? 'Quick check' : 'Practice';
  if (e.unclear) return `${kind}: Carmen couldn’t hear clearly${e.input_mode === 'mic' ? ' through the microphone' : ''}, so it isn’t counted.`;
  const s = e.summary;
  if (!s || !s.expected) return `${kind}${e.passed ? ': done' : ''}.`;
  const parts = [`${s.matched ?? 0} of ${s.expected} sounds right`];
  if (s.missed) parts.push(`${s.missed} missed`);
  if (s.extra) parts.push(`${s.extra} extra`);
  if (s.rests) parts.push(`${s.rests} in a rest`);
  if (s.early || s.late) parts.push(`${s.early ?? 0} early, ${s.late ?? 0} late`);
  const help = Object.entries(e.support ?? {})
    .filter(([k, v]) => v && v !== 0 && k !== 'simplified')
    .map(([k]) => ({ hint: 'hints', heard: 'heard it first', bigger: 'bigger controls', slower: 'slower', counting: 'counting shown' })[k] ?? k);
  return `${kind}: ${e.passed ? 'passed' : 'not yet'}. ${parts.join(', ')}.${help.length ? ` Help on: ${help.join(', ')}.` : ''}`;
}
