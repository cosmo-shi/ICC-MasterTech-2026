// Teacher accounts: school email, a one-time code by email, a session that refreshes, sign-out,
// and a teaching space that teachers create or join. Talks to Supabase Auth (GoTrue) and its REST
// API over plain fetch; permissions are enforced on the server by row-level security
// (supabase/migrations). Only the project's public "anon" key is in the app: it can do nothing
// that the server's policies don't allow. No passwords, no service keys, no child data.
//
// Verifying an email proves the address, not the right to see a class: a teacher only sees a
// teaching space they created or joined with its code (enforced by the server).
//
// If the service is not configured, every call fails with AuthBlocked and the app says so. It never
// pretends an account exists.

export class AuthBlocked extends Error {
  constructor() {
    super('School accounts are not set up for this copy of Carmen yet.');
    this.name = 'AuthBlocked';
  }
}
export class AuthError extends Error {
  status: number;
  constructor(message: string, status = 0) {
    super(message);
    this.name = 'AuthError';
    this.status = status;
  }
}

export interface TeacherSession {
  accessToken: string;
  refreshToken: string;
  /** ms since epoch */
  expiresAt: number;
  user: { id: string; email: string };
}
export interface TeacherProfile {
  id: string;
  display_name: string;
  school: string | null;
}
export interface TeachingSpace {
  id: string;
  name: string;
  /** Only owners see the code. */
  join_code: string | null;
  role: 'owner' | 'teacher';
}

interface Deps {
  url?: string;
  anonKey?: string;
  fetch?: typeof fetch;
  storage?: Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;
  now?: () => number;
}

const SESSION_KEY = 'carmen-teacher-session-v1';

/** A light check that this looks like an email address. Which schools are allowed is the server's call. */
export function looksLikeEmail(s: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s.trim());
}

/** Personal webmail is very unlikely to be a school address; the form says so but does not decide. */
export function looksPersonal(email: string): boolean {
  const d = email.trim().toLowerCase().split('@')[1] ?? '';
  return ['gmail.com', 'outlook.com', 'hotmail.com', 'yahoo.com', 'icloud.com', 'live.com', 'bigpond.com', 'proton.me'].includes(d);
}

/** The service address must be https; plain http is allowed only for a service on this computer
 *  (local verification, tools/verify-db), never for a school deployment. */
export function isServiceUrl(url: string): boolean {
  return /^https:\/\//.test(url) || /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?(\/|$)/.test(url);
}

export function createTeacherAuth(deps: Deps = {}) {
  const url = (deps.url ?? '').replace(/\/+$/, '');
  const anonKey = deps.anonKey ?? '';
  const f = deps.fetch ?? ((...a: Parameters<typeof fetch>) => fetch(...a));
  const storage = deps.storage;
  const now = deps.now ?? (() => Date.now());
  const configured = !!url && !!anonKey && isServiceUrl(url);
  const listeners = new Set<() => void>();
  const emit = () => listeners.forEach((l) => l());

  // Same object while the stored value is unchanged, so screens can subscribe to it.
  let lastRaw: string | null | undefined;
  let lastSession: TeacherSession | null = null;
  function readSession(): TeacherSession | null {
    try {
      const raw = storage?.getItem(SESSION_KEY) ?? null;
      if (raw !== lastRaw) {
        lastRaw = raw;
        lastSession = raw ? (JSON.parse(raw) as TeacherSession) : null;
      }
      return lastSession;
    } catch {
      return null;
    }
  }
  function writeSession(s: TeacherSession | null) {
    try {
      if (s) storage?.setItem(SESSION_KEY, JSON.stringify(s));
      else storage?.removeItem(SESSION_KEY);
    } catch {
      /* storage blocked: the session lasts for this page only */
    }
    emit();
  }

  async function call<T>(path: string, init: { method?: string; body?: unknown; token?: string; headers?: Record<string, string> } = {}): Promise<T> {
    if (!configured) throw new AuthBlocked();
    let res: Response;
    try {
      res = await f(`${url}${path}`, {
        method: init.method ?? 'POST',
        headers: { apikey: anonKey, 'Content-Type': 'application/json', ...(init.token ? { Authorization: `Bearer ${init.token}` } : {}), ...init.headers },
        body: init.body === undefined ? undefined : JSON.stringify(init.body),
      });
    } catch {
      throw new AuthError('Carmen couldn’t reach the sign-in service. Check the internet connection and try again.');
    }
    const text = await res.text();
    const data = text ? (JSON.parse(text) as Record<string, unknown>) : {};
    if (!res.ok) {
      const msg = (data.msg ?? data.error_description ?? data.message ?? data.error ?? 'Something went wrong.') as string;
      throw new AuthError(friendly(msg, res.status), res.status);
    }
    return data as T;
  }

  function friendly(msg: string, status: number): string {
    const m = msg.toLowerCase();
    if (/row-level security|permission denied|not your learner|owners only|not a member of this space/.test(m))
      return 'You don’t have access to that. Ask the class’s teacher, or the owner of your school’s teaching space.';
    if (m.includes('make another owner first')) return 'You’re the only owner. Make someone else an owner before you leave.';
    if (m.includes('expired') || m.includes('invalid') || m.includes('otp')) return 'That code didn’t work. It may have expired. Ask for a new one.';
    if (m.includes('signups not allowed') || m.includes('not allowed')) return 'This email can’t make an account here. Use your school email, or ask your school.';
    if (m.includes('rate') || status === 429) return 'Too many tries. Wait a minute, then try again.';
    if (m.includes('domain') || m.includes('database error saving new user')) return 'This email can’t make an account here. Use your school email, or ask your school.';
    return msg;
  }

  function fromTokenResponse(d: { access_token: string; refresh_token: string; expires_in: number; user: { id: string; email: string } }): TeacherSession {
    return { accessToken: d.access_token, refreshToken: d.refresh_token, expiresAt: now() + d.expires_in * 1000, user: { id: d.user.id, email: d.user.email } };
  }

  /** A valid session, refreshed if it is about to expire; null if signed out or the refresh failed. */
  let refreshing: Promise<TeacherSession | null> | null = null;
  async function session(): Promise<TeacherSession | null> {
    const s = readSession();
    if (!s) return null;
    if (s.expiresAt - now() > 60_000) return s;
    // One refresh at a time: a refresh token works once, so two calls racing would sign the teacher out.
    refreshing ??= renew(s).finally(() => {
      refreshing = null;
    });
    return refreshing;
  }
  async function renew(s: TeacherSession): Promise<TeacherSession | null> {
    try {
      const d = await call<Parameters<typeof fromTokenResponse>[0]>('/auth/v1/token?grant_type=refresh_token', { body: { refresh_token: s.refreshToken } });
      const fresh = fromTokenResponse(d);
      writeSession(fresh);
      return fresh;
    } catch (e) {
      if (e instanceof AuthError && e.status >= 400 && e.status < 500) {
        // Another tab may have renewed it a moment ago: use that session rather than signing out.
        lastRaw = undefined;
        const other = readSession();
        if (other && other.refreshToken !== s.refreshToken && other.expiresAt - now() > 60_000) return other;
        writeSession(null);
        return null;
      }
      if (e instanceof AuthBlocked) return null;
      throw e;
    }
  }

  async function authed<T>(path: string, init: { method?: string; body?: unknown; headers?: Record<string, string> } = {}): Promise<T> {
    const s = await session();
    if (!s) throw new AuthError('Please log in again.', 401);
    return call<T>(path, { ...init, token: s.accessToken });
  }

  return {
    configured,
    subscribe(fn: () => void) {
      listeners.add(fn);
      return () => {
        listeners.delete(fn);
      };
    },
    current: readSession,
    session,
    /** Email a one-time code. `create` false: only existing accounts (Log in). */
    async sendCode(email: string, create: boolean): Promise<void> {
      if (!looksLikeEmail(email)) throw new AuthError('That doesn’t look like an email address.');
      await call('/auth/v1/otp', { body: { email: email.trim().toLowerCase(), create_user: create } });
    },
    async verifyCode(email: string, code: string): Promise<TeacherSession> {
      const d = await call<Parameters<typeof fromTokenResponse>[0]>('/auth/v1/verify', { body: { type: 'email', email: email.trim().toLowerCase(), token: code.trim() } });
      const s = fromTokenResponse(d);
      writeSession(s);
      return s;
    },
    async signOut(): Promise<void> {
      const s = readSession();
      writeSession(null);
      if (s && configured) {
        try {
          await call('/auth/v1/logout', { token: s.accessToken });
        } catch {
          /* already signed out on this device; the server session expires on its own */
        }
      }
    },
    async profile(): Promise<TeacherProfile | null> {
      const s = await session();
      if (!s) return null;
      const rows = await authed<TeacherProfile[]>(`/rest/v1/teachers?id=eq.${encodeURIComponent(s.user.id)}&select=id,display_name,school`, { method: 'GET' });
      return rows[0] ?? null;
    },
    async saveProfile(displayName: string, school: string): Promise<void> {
      const s = await session();
      if (!s) throw new AuthError('Please log in again.', 401);
      await authed('/rest/v1/teachers', { body: { id: s.user.id, display_name: displayName.trim().slice(0, 60), school: school.trim().slice(0, 100) || null }, headers: { Prefer: 'resolution=merge-duplicates' } });
    },
    /** Call a database function as the signed-in teacher (row-level security applies). */
    rpc<T>(name: string, args: Record<string, unknown> = {}): Promise<T> {
      return authed<T>(`/rest/v1/rpc/${name}`, { body: args });
    },
    async spaces(): Promise<TeachingSpace[]> {
      return authed<TeachingSpace[]>('/rest/v1/rpc/my_spaces', { body: {} });
    },
    async createSpace(name: string): Promise<TeachingSpace> {
      const rows = await authed<TeachingSpace[]>('/rest/v1/rpc/create_space', { body: { space_name: name.trim().slice(0, 60) } });
      return Array.isArray(rows) ? rows[0] : (rows as unknown as TeachingSpace);
    },
    async joinSpace(code: string): Promise<TeachingSpace> {
      const rows = await authed<TeachingSpace[]>('/rest/v1/rpc/join_space', { body: { code: code.trim().toUpperCase() } });
      const space = Array.isArray(rows) ? rows[0] : (rows as unknown as TeachingSpace);
      if (!space) throw new AuthError('No teaching space has that code. Check it with the teacher who made it.');
      return space;
    },
  };
}

export type TeacherAuth = ReturnType<typeof createTeacherAuth>;

const env = (import.meta as unknown as { env?: Record<string, string | undefined> }).env ?? {};
export const teacherAuth = createTeacherAuth({
  url: env.VITE_SUPABASE_URL,
  anonKey: env.VITE_SUPABASE_ANON_KEY,
  storage: typeof localStorage !== 'undefined' ? localStorage : undefined,
});
