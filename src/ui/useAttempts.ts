import { useEffect, useMemo, useState, useSyncExternalStore } from 'react';
import { learnerFrom, teacherOverrides, LESSON_INFOS } from '../ai/learner.ts';
import type { TailorContext } from '../ai/tailor.ts';
import { routeFrom } from '../data/curriculum.ts';
import { usePrefs } from '../state/prefs.tsx';
import { type AttemptRecord, type CompositionRecord, store } from '../store/db.ts';
import { players, usePlayers } from '../store/profiles.ts';

export const isNote = (a: AttemptRecord) => !!a.note;

/** All saved attempts and pieces on this device (every player). For the teacher space. */
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

export function useOverrides() {
  return useSyncExternalStore(teacherOverrides.subscribe, teacherOverrides.snapshot, teacherOverrides.snapshot);
}

/** The learner model for whoever is playing now (a guest uses this visit's unowned attempts). */
export function useMyLearning() {
  const { prefs } = usePrefs();
  const { attempts } = useAllRecords();
  const who = usePlayers();
  const all = useOverrides();
  const me = who.current && who.current !== 'guest' ? who.current : undefined;
  const mine = useMemo(() => attempts.filter((a) => !isNote(a) && (me ? a.profileId === me : !a.profileId)), [attempts, me]);
  const ovr = useMemo(() => (me && all[me]) || { skills: {} }, [all, me]);
  const model = useMemo(() => learnerFrom(mine, ovr), [mine, ovr]);
  const context = (over: Partial<TailorContext> = {}): TailorContext => ({ infos: LESSON_INFOS, route: routeFrom(prefs.pathway), aiEnabled: prefs.aiEnabled, ...over });
  return { attempts: mine, ...model, overrides: ovr, context, player: players.current(), loaded: true };
}
