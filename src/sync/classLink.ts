// A learner's device in a teacher's class. The teacher gives the learner a short code; this device
// swaps it for a secret token for that learner's seat (kept only on this device). From then on it
// sends a summary of each new attempt (see evidence.ts; never audio) and gets back what the
// teacher set: assignments, the next activity and supports.
//
// Works offline: attempts wait on the device and go when the connection is back. Sending the same
// attempt twice is safe (the server ignores repeats). The server is the one source of truth for
// the teacher's plan; the device keeps the last copy so it still works offline.

import type { AttemptRecord } from '../store/db.ts';
import { isServiceUrl } from '../auth/teacherAuth.ts';
import { isSyncable, toEvidence } from './evidence.ts';

export interface ClassPlan {
  next_activity_id: string | null;
  supports: Record<string, boolean>;
  skill_overrides: Record<string, 'practise' | 'secure'>;
  version: number;
  updated_at: string;
}
export interface ClassAssignment {
  id: string;
  activity_id: string;
  instruments: string[];
  inputs: string[];
  supports: Record<string, boolean>;
  note: string | null;
  created_at: string;
}
export type SyncState = 'synced' | 'pending' | 'syncing' | 'offline' | 'error' | 'revoked';
export interface ClassLinkInfo {
  token: string;
  studentId: string;
  nickname: string;
  className: string;
  joinedAt: number;
  acked: string[];
  plan: ClassPlan | null;
  assignments: ClassAssignment[];
  lastSyncAt: number | null;
  state: SyncState;
  pending: number;
  error?: string;
}

export class JoinError extends Error {}

const KEY = 'carmen-class-links-v1';
const BACKOFF = [5_000, 15_000, 60_000, 300_000];

interface Deps {
  url?: string;
  anonKey?: string;
  fetch?: typeof fetch;
  storage?: Pick<Storage, 'getItem' | 'setItem'>;
  now?: () => number;
  /** Every attempt on this device. */
  attempts: () => Promise<AttemptRecord[]>;
  /** Called when the teacher's plan for this learner changed. */
  onPlan?: (profileKey: string, plan: ClassPlan | null) => void;
  setTimer?: (f: () => void, ms: number) => unknown;
}

/** Which local player a link belongs to: their id, or "guest". */
export const keyOf = (profileId: string | null | undefined): string => profileId || 'guest';

export function createClassLink(deps: Deps) {
  const url = (deps.url ?? '').replace(/\/+$/, '');
  const anonKey = deps.anonKey ?? '';
  const configured = !!url && !!anonKey && isServiceUrl(url);
  const f = deps.fetch ?? ((...a: Parameters<typeof fetch>) => fetch(...a));
  const now = deps.now ?? (() => Date.now());
  const setTimer = deps.setTimer ?? ((fn: () => void, ms: number) => setTimeout(fn, ms));
  const listeners = new Set<() => void>();
  let links: Record<string, ClassLinkInfo> = read();
  const inFlight = new Set<string>();
  const failures: Record<string, number> = {};

  function read(): Record<string, ClassLinkInfo> {
    try {
      return JSON.parse(deps.storage?.getItem(KEY) ?? '{}') as Record<string, ClassLinkInfo>;
    } catch {
      return {};
    }
  }
  function write(next: Record<string, ClassLinkInfo>) {
    links = next;
    try {
      deps.storage?.setItem(KEY, JSON.stringify(next));
    } catch {
      /* storage blocked: the link lasts for this visit */
    }
    listeners.forEach((l) => l());
  }
  const update = (key: string, patch: Partial<ClassLinkInfo>) => {
    const cur = links[key];
    if (cur) write({ ...links, [key]: { ...cur, ...patch } });
  };

  async function rpc<T>(name: string, body: unknown): Promise<T> {
    const res = await f(`${url}/rest/v1/rpc/${name}`, {
      method: 'POST',
      headers: { apikey: anonKey, Authorization: `Bearer ${anonKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const text = await res.text();
    const data = text ? JSON.parse(text) : null;
    if (!res.ok) {
      const e = new Error((data && (data.message || data.msg)) || `HTTP ${res.status}`) as Error & { status: number; code?: string };
      e.status = res.status;
      e.code = data?.code;
      throw e;
    }
    return data as T;
  }

  function pendingFor(key: string, all: AttemptRecord[]): AttemptRecord[] {
    const l = links[key];
    if (!l) return [];
    const acked = new Set(l.acked);
    return all
      .filter((a) => keyOf(a.profileId) === key && a.createdAt >= l.joinedAt && isSyncable(a) && !acked.has(a.id))
      .sort((a, b) => a.createdAt - b.createdAt);
  }

  async function sync(key: string): Promise<void> {
    const l = links[key];
    if (!configured || !l || l.state === 'revoked' || inFlight.has(key)) return;
    inFlight.add(key);
    try {
      const todo = pendingFor(key, await deps.attempts()).slice(0, 100);
      update(key, { state: 'syncing', pending: todo.length });
      const assignmentFor = (activity: string) => links[key]?.assignments.find((x) => x.activity_id === activity)?.id;
      const res = await rpc<{ accepted: string[]; rejected: string[]; plan: ClassPlan | null; assignments: ClassAssignment[]; student: { nickname: string; class_name: string } }>('device_sync', {
        token: l.token,
        attempts: todo.map((a) => toEvidence(a, assignmentFor(a.activityId))),
      });
      const cur = links[key];
      if (!cur) return;
      const acked = [...cur.acked, ...res.accepted, ...res.rejected].slice(-1000);
      const changed = (res.plan?.version ?? 0) !== (cur.plan?.version ?? 0);
      const left = pendingFor(key, await deps.attempts()).filter((a) => !res.accepted.includes(a.id) && !res.rejected.includes(a.id)).length;
      failures[key] = 0;
      update(key, {
        acked,
        plan: res.plan,
        assignments: res.assignments,
        nickname: res.student.nickname,
        className: res.student.class_name,
        lastSyncAt: now(),
        state: left ? 'pending' : 'synced',
        pending: left,
        error: undefined,
      });
      if (changed) deps.onPlan?.(key, res.plan);
      if (left) setTimer(() => void sync(key), 0);
    } catch (e) {
      const err = e as Error & { status?: number; code?: string };
      if (err.code === '28000' || (err.status && err.status >= 400 && err.status < 500 && /seat not linked/i.test(err.message))) {
        update(key, { state: 'revoked', error: 'This device isn’t linked any more. Your teacher may have given you a new code.' });
      } else {
        const n = (failures[key] = (failures[key] ?? 0) + 1);
        const offline = !err.status;
        update(key, { state: offline ? 'offline' : 'error', error: offline ? 'No connection. Your work is safe here and will go to your teacher later.' : 'Carmen couldn’t reach your class. It will try again.' });
        setTimer(() => void sync(key), BACKOFF[Math.min(n - 1, BACKOFF.length - 1)]);
      }
    } finally {
      inFlight.delete(key);
    }
  }

  return {
    configured,
    subscribe(fn: () => void) {
      listeners.add(fn);
      return () => {
        listeners.delete(fn);
      };
    },
    snapshot: () => links,
    get: (key: string): ClassLinkInfo | null => links[key] ?? null,
    /** Swap a teacher's code for this learner's seat. Only attempts from now on are sent. */
    async join(key: string, code: string): Promise<ClassLinkInfo> {
      if (!configured) throw new JoinError('Classes aren’t set up for this copy of Carmen yet.');
      const clean = code.replace(/[\s-]/g, '').toUpperCase();
      if (!/^[A-Z0-9]{6}$/.test(clean)) throw new JoinError('A class code has 6 letters and numbers.');
      let rows: { device_token: string; student_id: string; nickname: string; class_name: string }[];
      try {
        rows = await rpc('redeem_seat', { code: clean });
      } catch (e) {
        throw new JoinError((e as { status?: number }).status ? 'Carmen couldn’t join the class. Try again in a moment.' : 'No connection. Join when you’re online.');
      }
      const r = Array.isArray(rows) ? rows[0] : null;
      if (!r) throw new JoinError('That code didn’t work. Check it with your teacher; each code works once.');
      const info: ClassLinkInfo = { token: r.device_token, studentId: r.student_id, nickname: r.nickname, className: r.class_name, joinedAt: now(), acked: [], plan: null, assignments: [], lastSyncAt: null, state: 'pending', pending: 0 };
      write({ ...links, [key]: info });
      await sync(key);
      return links[key];
    },
    /** Unlink this device. Work already sent stays with the teacher. */
    async leave(key: string): Promise<void> {
      const l = links[key];
      if (!l) return;
      const next = { ...links };
      delete next[key];
      write(next);
      deps.onPlan?.(key, null);
      if (configured && l.state !== 'revoked') {
        try {
          await rpc('device_leave', { token: l.token });
        } catch {
          /* the teacher can also reset the code */
        }
      }
    },
    sync,
    syncAll: () => Promise.all(Object.keys(links).map((k) => sync(k))).then(() => undefined),
    /** How many attempts are waiting to go. */
    async pending(key: string): Promise<number> {
      return pendingFor(key, await deps.attempts()).length;
    },
  };
}

export type ClassLink = ReturnType<typeof createClassLink>;
