import { useEffect, useMemo, useState } from 'react';
import { type AttemptEvidence, estimateSkills } from '../ai/learner.ts';
import { type AttemptRecord, type CompositionRecord, store } from '../store/db.ts';
import { players, usePlayers } from '../store/profiles.ts';

/** Only what the learner model needs; inputs and coach details stay out. */
export function toEvidence(a: AttemptRecord): AttemptEvidence {
  return {
    activityId: a.activityId,
    createdAt: a.createdAt,
    kind: a.kind,
    passed: a.passed,
    hintLevel: a.support?.hintLevel ?? 0,
    summary: a.summary,
  };
}

export const isNote = (a: AttemptRecord) => !!a.note;

/** All saved attempts and pieces on this device (every player). For Grown-ups. */
export function useAllRecords() {
  const [attempts, setAttempts] = useState<AttemptRecord[]>([]);
  const [pieces, setPieces] = useState<CompositionRecord[]>([]);
  useEffect(() => {
    const load = () => {
      store.all<AttemptRecord>('attempts').then((r) => setAttempts(r.sort((a, b) => b.createdAt - a.createdAt)), () => setAttempts([]));
      store.all<CompositionRecord>('compositions').then((r) => setPieces(r.sort((a, b) => b.createdAt - a.createdAt)), () => setPieces([]));
    };
    load();
    return store.subscribe(load);
  }, []);
  return { attempts, pieces };
}

/** Attempts by whoever is playing now (a guest sees this visit's unowned attempts). */
export function useMyLearning() {
  const { attempts } = useAllRecords();
  const who = usePlayers();
  const me = who.current && who.current !== 'guest' ? who.current : undefined;
  const mine = useMemo(() => attempts.filter((a) => !isNote(a) && (me ? a.profileId === me : !a.profileId)), [attempts, me]);
  const evidence = useMemo(() => mine.map(toEvidence), [mine]);
  const skills = useMemo(() => estimateSkills(evidence), [evidence]);
  return { attempts: mine, evidence, ...skills, player: players.current() };
}
