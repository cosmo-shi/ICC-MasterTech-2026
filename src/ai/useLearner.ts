// React hook: the learner model built from this device's attempts, rebuilt when attempts change.
// Works with saving off too (it then uses this session's attempts only).

import { useEffect, useMemo, useState } from 'react';
import { LESSONS, pathwayById } from '../data/catalog.ts';
import { usePrefs } from '../state/prefs.tsx';
import { type AttemptRecord, store } from '../store/db.ts';
import { buildLearnerState, lessonInfos } from './learner.ts';
import type { TailorContext } from './tailor.ts';

export const LESSON_INFOS = lessonInfos(LESSONS);

// "Reset learning picture" hides older attempts from the model. It never deletes attempts.
const RESET_KEY = 'carmen-learner-reset-v1';

function readReset(): number {
  try {
    return Number(localStorage.getItem(RESET_KEY) ?? 0) || 0;
  } catch {
    return 0;
  }
}

let resetAt = readReset();
const resetListeners = new Set<() => void>();

export function resetLearningPicture(now: number): void {
  resetAt = now;
  try {
    localStorage.setItem(RESET_KEY, String(now));
  } catch {
    /* storage blocked: the reset still holds for this session */
  }
  resetListeners.forEach((f) => f());
}

export function useLearner() {
  const { prefs } = usePrefs();
  const [attempts, setAttempts] = useState<AttemptRecord[]>([]);
  const [since, setSince] = useState(resetAt);

  useEffect(() => {
    const load = () => store.all<AttemptRecord>('attempts').then(setAttempts, () => setAttempts([]));
    load();
    const onReset = () => setSince(resetAt);
    resetListeners.add(onReset);
    const unsub = store.subscribe(load);
    return () => {
      unsub();
      resetListeners.delete(onReset);
    };
  }, []);

  const state = useMemo(() => buildLearnerState(attempts.filter((a) => a.createdAt > since), LESSON_INFOS), [attempts, since]);
  const pathway = pathwayById(prefs.pathway);

  const context = (over: Partial<TailorContext> = {}): TailorContext => ({
    infos: LESSON_INFOS,
    route: pathway?.recommended ?? [],
    aiEnabled: prefs.aiEnabled,
    ...over,
  });

  return { state, context, aiEnabled: prefs.aiEnabled, since };
}
