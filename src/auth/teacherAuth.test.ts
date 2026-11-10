import { describe, expect, it } from 'vitest';
import { AuthBlocked, createTeacherAuth, looksLikeEmail, looksPersonal } from './teacherAuth.ts';

function memStorage() {
  const m = new Map<string, string>();
  return { getItem: (k: string) => m.get(k) ?? null, setItem: (k: string, v: string) => void m.set(k, v), removeItem: (k: string) => void m.delete(k), m };
}
type Call = { url: string; init: RequestInit };
function fakeFetch(responses: Record<string, { status?: number; body: unknown }>) {
  const calls: Call[] = [];
  const f = (async (url: string, init: RequestInit) => {
    calls.push({ url, init });
    const key = Object.keys(responses).find((k) => url.includes(k));
    const r = key ? responses[key] : { status: 404, body: { msg: 'not found' } };
    return new Response(JSON.stringify(r.body), { status: r.status ?? 200 });
  }) as unknown as typeof fetch;
  return { f, calls };
}
const token = (expires_in = 3600) => ({ access_token: 'AT', refresh_token: 'RT', expires_in, user: { id: 'u1', email: 'ms.lee@school.edu.au' } });

describe('teacher accounts', () => {
  it('is blocked, not simulated, when the service is not configured', async () => {
    const a = createTeacherAuth({ storage: memStorage() });
    expect(a.configured).toBe(false);
    await expect(a.sendCode('ms.lee@school.edu.au', true)).rejects.toBeInstanceOf(AuthBlocked);
    await expect(a.verifyCode('ms.lee@school.edu.au', '123456')).rejects.toBeInstanceOf(AuthBlocked);
    expect(a.current()).toBeNull();
  });

  it('refuses a non-https service address', () => {
    expect(createTeacherAuth({ url: 'http://example.test', anonKey: 'k' }).configured).toBe(false);
  });

  it('sends a one-time code with only the public key, and only creates accounts on Create account', async () => {
    const { f, calls } = fakeFetch({ '/auth/v1/otp': { body: {} } });
    const a = createTeacherAuth({ url: 'https://x.supabase.co', anonKey: 'public-anon', fetch: f, storage: memStorage() });
    await a.sendCode(' Ms.Lee@School.edu.au ', false);
    const body = JSON.parse(String(calls[0].init.body));
    expect(calls[0].url).toBe('https://x.supabase.co/auth/v1/otp');
    expect(body).toEqual({ email: 'ms.lee@school.edu.au', create_user: false });
    expect((calls[0].init.headers as Record<string, string>).apikey).toBe('public-anon');
    expect((calls[0].init.headers as Record<string, string>).Authorization).toBeUndefined();
  });

  it('keeps a session after the code is verified, refreshes it, and forgets it on sign-out', async () => {
    let t = 1_000_000;
    const st = memStorage();
    const { f, calls } = fakeFetch({ '/auth/v1/verify': { body: token(120) }, 'grant_type=refresh_token': { body: { ...token(3600), access_token: 'AT2' } }, '/auth/v1/logout': { body: {} } });
    const a = createTeacherAuth({ url: 'https://x.supabase.co', anonKey: 'k', fetch: f, storage: st, now: () => t });
    const s = await a.verifyCode('ms.lee@school.edu.au', '123456');
    expect(s.user.email).toBe('ms.lee@school.edu.au');
    expect((await a.session())?.accessToken).toBe('AT');
    t += 100_000; // within a minute of expiry
    expect((await a.session())?.accessToken).toBe('AT2');
    await a.signOut();
    expect(a.current()).toBeNull();
    expect(calls.some((c) => c.url.endsWith('/auth/v1/logout'))).toBe(true);
  });

  it('renews once when several calls need a fresh session at the same moment', async () => {
    let t = 1_000_000;
    const { f, calls } = fakeFetch({ '/auth/v1/verify': { body: token(120) }, 'grant_type=refresh_token': { body: { ...token(3600), access_token: 'AT2', refresh_token: 'RT2' } }, '/rpc/my_classes': { body: [] } });
    const a = createTeacherAuth({ url: 'https://x.supabase.co', anonKey: 'k', fetch: f, storage: memStorage(), now: () => t });
    await a.verifyCode('ms.lee@school.edu.au', '123456');
    t += 100_000;
    await Promise.all([a.rpc('my_classes'), a.rpc('my_classes'), a.rpc('my_classes')]);
    expect(calls.filter((c) => c.url.includes('grant_type=refresh_token')).length).toBe(1);
    expect(calls.filter((c) => c.url.includes('/rpc/my_classes')).every((c) => (c.init.headers as Record<string, string>).Authorization === 'Bearer AT2')).toBe(true);
  });

  it('allows plain http only for a service on this computer', () => {
    expect(createTeacherAuth({ url: 'http://localhost:54321', anonKey: 'k' }).configured).toBe(true);
    expect(createTeacherAuth({ url: 'http://localhost.evil.test', anonKey: 'k' }).configured).toBe(false);
  });

  it('drops a session the server no longer accepts', async () => {
    let t = 0;
    const { f } = fakeFetch({ '/auth/v1/verify': { body: token(10) }, 'grant_type=refresh_token': { status: 400, body: { error_description: 'Invalid Refresh Token' } } });
    const a = createTeacherAuth({ url: 'https://x.supabase.co', anonKey: 'k', fetch: f, storage: memStorage(), now: () => t });
    await a.verifyCode('a@school.edu.au', '1');
    t += 20_000;
    expect(await a.session()).toBeNull();
    expect(a.current()).toBeNull();
  });

  it('sends the teacher token for space calls, and says plainly when a code is wrong', async () => {
    const { f, calls } = fakeFetch({ '/auth/v1/verify': { body: token() }, '/rest/v1/rpc/join_space': { body: [] } });
    const a = createTeacherAuth({ url: 'https://x.supabase.co', anonKey: 'k', fetch: f, storage: memStorage() });
    await a.verifyCode('a@school.edu.au', '1');
    await expect(a.joinSpace('abcd2345')).rejects.toThrow(/No teaching space has that code/);
    const join = calls.find((c) => c.url.includes('join_space'))!;
    expect((join.init.headers as Record<string, string>).Authorization).toBe('Bearer AT');
    expect(JSON.parse(String(join.init.body))).toEqual({ code: 'ABCD2345' });
  });

  it('turns server errors into plain words', async () => {
    const { f } = fakeFetch({ '/auth/v1/otp': { status: 500, body: { msg: 'Database error saving new user' } } });
    const a = createTeacherAuth({ url: 'https://x.supabase.co', anonKey: 'k', fetch: f, storage: memStorage() });
    await expect(a.sendCode('kid@gmail.com', true)).rejects.toThrow(/Use your school email/);
  });

  it('checks email shape and flags personal addresses', () => {
    expect(looksLikeEmail('ms.lee@school.edu.au')).toBe(true);
    expect(looksLikeEmail('ms.lee@')).toBe(false);
    expect(looksPersonal('someone@gmail.com')).toBe(true);
    expect(looksPersonal('ms.lee@education.nsw.gov.au')).toBe(false);
  });
});
