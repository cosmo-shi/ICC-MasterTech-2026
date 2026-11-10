// The app's one class link, wired to local storage, saved attempts and the learner model.
import { useSyncExternalStore } from 'react';
import { teacherOverrides, type SkillId, type SkillOverride } from '../ai/learner.ts';
import { type AttemptRecord, store } from '../store/db.ts';
import { usePlayers } from '../store/profiles.ts';
import { createClassLink, keyOf, type ClassLinkInfo } from './classLink.ts';

const env = (import.meta as unknown as { env?: Record<string, string | undefined> }).env ?? {};

export const classLink = createClassLink({
  url: env.VITE_SUPABASE_URL,
  anonKey: env.VITE_SUPABASE_ANON_KEY,
  storage: typeof localStorage !== 'undefined' ? localStorage : undefined,
  attempts: () => store.all<AttemptRecord>('attempts'),
  // The teacher's plan becomes this player's teacher choices, so Learn and lessons follow it.
  onPlan(key, plan) {
    if (key === 'guest') return;
    teacherOverrides.set(key, plan ? { skills: plan.skill_overrides as Partial<Record<SkillId, SkillOverride>>, next: plan.next_activity_id ?? undefined } : { skills: {} });
  },
});

let started = false;
/** Sync when work is saved, when the connection comes back, when Carmen is opened again, and every
 *  minute while it is open (to pick up the teacher's changes). Does nothing until a class is joined. */
export function startClassSync() {
  if (started || typeof window === 'undefined') return;
  started = true;
  let t: ReturnType<typeof setTimeout> | undefined;
  const soon = (ms = 1500) => {
    clearTimeout(t);
    t = setTimeout(() => void classLink.syncAll(), ms);
  };
  store.subscribe(() => soon());
  window.addEventListener('online', () => soon(0));
  document.addEventListener('visibilitychange', () => document.visibilityState === 'visible' && soon(0));
  setInterval(() => document.visibilityState === 'visible' && navigator.onLine !== false && void classLink.syncAll(), 60_000);
  soon(0);
}

/** The class link for whoever is playing now. */
export function useMyClass(): { key: string; link: ClassLinkInfo | null } {
  const all = useSyncExternalStore(classLink.subscribe, classLink.snapshot, classLink.snapshot);
  const who = usePlayers();
  const key = keyOf(who.current && who.current !== 'guest' ? who.current : null);
  return { key, link: all[key] ?? null };
}

/** Supports the teacher switched on for this activity (the learner's plan, then the assignment). */
export function classSupports(link: ClassLinkInfo | null, activityId: string): Record<string, boolean> {
  if (!link) return {};
  const a = link.assignments.find((x) => x.activity_id === activityId);
  return { ...(a?.supports ?? {}), ...(link.plan?.supports ?? {}) };
}
