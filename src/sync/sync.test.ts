import { describe, expect, it } from 'vitest';
import type { AttemptRecord } from '../store/db.ts';
import { createClassLink } from './classLink.ts';
import { toEvidence } from './evidence.ts';
import { describeEvidence, statusFor, type EvidenceRow } from './status.ts';

const att = (id: string, over: Partial<AttemptRecord> = {}): AttemptRecord => ({
  id,
  createdAt: 2000,
  activityId: 'L01',
  activityVersion: '1',
  kind: 'practice',
  instrument: 'drums',
  tempoBpm: 80,
  support: { hintLevel: 0, heardExample: true, largeControls: false, simplified: false, aiEnabled: true, slower: true },
  inputs: [{ t: 1, midi: 60 } as never],
  summary: { expected: 4, correctSound: 3, wrong: 0, missed: 1, extra: 0, restViolations: 0, early: 1, onTime: 2, late: 0, durationOk: 3, durationIssues: 0 },
  passed: false,
  reflection: 'secret words',
  profileId: 'p-a',
  ...over,
});

describe('evidence', () => {
  it('sends counts and help used, never inputs, reflections or names', () => {
    const e = toEvidence(att('a-0001', { input: { mode: 'mic', unclear: true } }), 'asg');
    const s = JSON.stringify(e);
    expect(s).not.toContain('secret');
    expect(s).not.toContain('midi');
    expect(s).not.toContain('p-a');
    expect(e).toMatchObject({ id: 'a-0001', unclear: true, passed: false, input_mode: 'mic', assignment_id: 'asg', summary: { matched: 3, missed: 1 } });
  });
});

describe('teacher statuses', () => {
  const seat = { joined_at: '2026-11-10T00:00:00Z', seen_at: '2026-11-10T09:00:00Z', code_waiting: false };
  const ev = (over: Partial<EvidenceRow>): EvidenceRow => ({ id: Math.random().toString(36), activity_id: 'L01', kind: 'practice', unclear: false, passed: false, attempted_at: '2026-11-10T08:00:00Z', ...over });
  it('distinguishes not joined, waiting to sync and not started', () => {
    expect(statusFor('L01', [], null)).toBe('not-joined');
    expect(statusFor('L01', [], seat, '2026-11-10T10:00:00Z')).toBe('waiting-to-sync');
    expect(statusFor('L01', [], seat, '2026-11-10T08:00:00Z')).toBe('not-started');
  });
  it('ready only after an independent pass', () => {
    expect(statusFor('L01', [ev({ passed: true })], seat)).toBe('practising');
    expect(statusFor('L01', [ev({ passed: true, kind: 'independent' })], seat)).toBe('ready');
  });
  it('unclear input is an input problem, never "needs support"', () => {
    const e = [ev({ unclear: true }), ev({ unclear: true }), ev({}), ev({})];
    expect(statusFor('L01', e, seat)).toBe('input-problem');
    expect(describeEvidence(e[0])).toMatch(/isn’t counted/);
  });
  it('several clear misses may need support', () => {
    expect(statusFor('L01', [ev({}), ev({}), ev({})], seat)).toBe('may-need-support');
  });
});

describe('class link', () => {
  const server = () => {
    const seen: { name: string; body: Record<string, unknown> }[] = [];
    const received = new Set<string>();
    let online = true;
    let plan: unknown = null;
    const fakeFetch = (async (url: string, init: RequestInit) => {
      if (!online) throw new TypeError('Failed to fetch');
      const name = url.split('/rpc/')[1];
      const body = JSON.parse(String(init.body));
      seen.push({ name, body });
      const json = (status: number, data: unknown) => new Response(JSON.stringify(data), { status });
      if (name === 'redeem_seat') return json(200, body.code === 'ABC234' ? [{ device_token: 'tok', student_id: 's1', nickname: 'Ari', class_name: '3B' }] : []);
      if (name === 'device_sync') {
        if (body.token !== 'tok') return json(403, { code: '28000', message: 'seat not linked' });
        const ids = (body.attempts as { id: string }[]).map((a) => a.id);
        ids.forEach((i) => received.add(i));
        return json(200, { accepted: ids, rejected: [], plan, assignments: [], student: { nickname: 'Ari', class_name: '3B' } });
      }
      return json(200, null);
    }) as unknown as typeof globalThis.fetch;
    return { fetch: fakeFetch, seen, received, setOnline: (v: boolean) => (online = v), setPlan: (p: unknown) => (plan = p) };
  };
  const mem = () => {
    const m = new Map<string, string>();
    return { getItem: (k: string) => m.get(k) ?? null, setItem: (k: string, v: string) => void m.set(k, v) };
  };

  it('joins, sends only new work, keeps work when offline and never sends it twice', async () => {
    const srv = server();
    let t = 1000;
    let attempts = [att('old-1', { createdAt: 500 })];
    const plans: unknown[] = [];
    const timers: (() => void)[] = [];
    const link = createClassLink({ url: 'https://x.supabase.co', anonKey: 'anon', fetch: srv.fetch, storage: mem(), now: () => t, attempts: async () => attempts, onPlan: (_k, p) => plans.push(p), setTimer: (f) => timers.push(f) });
    await expect(link.join('p-a', 'nope')).rejects.toThrow(/6 letters/);
    await expect(link.join('p-a', 'ZZZ999')).rejects.toThrow(/didn’t work/);
    await link.join('p-a', 'abc-234');
    expect(link.get('p-a')?.state).toBe('synced');
    expect(srv.received.has('old-1')).toBe(false);

    t = 3000;
    attempts = [...attempts, att('a-0001'), att('a-note1', { note: 'teacher note' }), att('g-0001', { profileId: undefined })];
    srv.setOnline(false);
    await link.sync('p-a');
    expect(link.get('p-a')?.state).toBe('offline');
    expect(await link.pending('p-a')).toBe(1);
    expect(timers.length).toBe(1);

    srv.setOnline(true);
    srv.setPlan({ next_activity_id: 'L02', supports: { slower: true }, skill_overrides: {}, version: 1, updated_at: '' });
    timers.shift()!();
    await new Promise((r) => setTimeout(r, 0));
    await link.sync('p-a');
    expect([...srv.received]).toEqual(['a-0001']);
    expect(link.get('p-a')?.state).toBe('synced');
    expect(link.get('p-a')?.plan?.next_activity_id).toBe('L02');
    expect(plans.length).toBe(1);
    const before = srv.seen.filter((s) => s.name === 'device_sync').map((s) => (s.body.attempts as unknown[]).length);
    await link.sync('p-a');
    const after = srv.seen.filter((s) => s.name === 'device_sync').map((s) => (s.body.attempts as unknown[]).length);
    expect(after.slice(before.length)).toEqual([0]);
  });

  it('says so when the seat was reset, and is honest when classes are not set up', async () => {
    const srv = server();
    const link = createClassLink({ url: 'https://x.supabase.co', anonKey: 'anon', fetch: srv.fetch, storage: mem(), attempts: async () => [] });
    await link.join('guest', 'ABC234');
    (link.get('guest') as { token: string }).token = 'stale';
    await link.sync('guest');
    expect(link.get('guest')?.state).toBe('revoked');
    const off = createClassLink({ url: '', anonKey: '', attempts: async () => [] });
    expect(off.configured).toBe(false);
    await expect(off.join('guest', 'ABC234')).rejects.toThrow(/aren’t set up/);
  });
});
