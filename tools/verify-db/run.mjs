// Verifies Carmen's database rules on a real Postgres: the migrations in supabase/migrations are
// applied to a throwaway local database shaped like Supabase (tools/verify-db/stub-supabase.sql),
// then every step runs as PostgREST would run it for a request (role + JWT claims, one
// transaction). It checks who can see and change what: signed-out visitors, teachers in the same
// space, teachers in another space, owners, and learner devices with and without a valid token.
//
// What this does NOT prove: Supabase's own services (email delivery, GoTrue sign-in, the API
// gateway, rate limits). Those need a hosted project; see docs/SERVICES.md.
//
//   node tools/verify-db/run.mjs        (needs Postgres 14+ server binaries; PG_BIN=/path/to/bin)
import { startDatabase } from './pg.mjs';

let fails = 0;
let passes = 0;
const ok = (c, m, extra) => {
  if (c) passes++;
  else fails++;
  console.log(`${c ? 'PASS' : 'FAIL'} ${m}${!c && extra !== undefined ? `\n     got: ${JSON.stringify(extra).slice(0, 400)}` : ''}`);
};
const db = startDatabase({ port: Number(process.env.PG_PORT ?? 54329) });
const json = (r) => (r.ok && r.out ? JSON.parse(r.out) : null);
const one = (user, sql, vars) => db.as(user, sql, vars);
const denied = (r) => !r.ok && ['42501', '28000'].includes(r.code);
const rlsBlocked = (r) => !r.ok && (r.code === '42501' || /row-level security/.test(r.message));

try {
  db.applyMigrations();
  ok(true, 'migrations apply in order on Postgres');

  // ---- Accounts ----
  db.admin(`insert into public.allowed_email_domains values ('school.edu.au'), ('other.edu.au');`);
  const user = (email) => db.admin(`insert into auth.users (email) values ('${email}') returning id;`).trim();
  const A = user('owner@school.edu.au');
  const B = user('teacher@school.edu.au');
  const C = user('stranger@other.edu.au');
  let blocked = false;
  try {
    user('someone@gmail.com');
  } catch {
    blocked = true;
  }
  ok(blocked, 'an email outside the allowed school domains cannot get an account');

  for (const [u, n] of [[A, 'Ms Owner'], [B, 'Mr Teacher'], [C, 'Dr Stranger']]) ok(one(u, `insert into public.teachers (id, display_name) values ('${u}', '${n}');`).ok, `${n} saves their own profile`);
  ok(rlsBlocked(one(B, `insert into public.teachers (id, display_name) values ('${A}', 'Impostor');`)), 'a teacher cannot write someone else’s profile');

  const spaceA = json(one(A, `select to_jsonb(s) from public.create_space('Riverside Primary') s;`));
  ok(spaceA?.role === 'owner' && /^[A-Z2-9]{8}$/.test(spaceA.join_code), 'creating a space makes you its owner and shows the join code', spaceA);
  const joined = json(one(B, `select to_jsonb(s) from public.join_space(:'code') s;`, { code: spaceA.join_code.toLowerCase() }));
  ok(joined?.role === 'teacher' && joined.join_code === null, 'joining with the code makes you a teacher, without seeing the code', joined);
  const spaceC = json(one(C, `select to_jsonb(s) from public.create_space('Hilltop') s;`));
  ok(!!spaceC, 'a teacher at another school has their own space');
  ok(one(C, `select count(*) from public.join_space('WRONGCODE');`).out === '0', 'a wrong join code joins nothing');

  // ---- Signed-out visitors ----
  for (const t of ['teachers', 'teaching_spaces', 'space_members', 'classes', 'students', 'evidence', 'support_plans', 'assignments', 'teacher_notes']) {
    const r = one(null, `select count(*) from public.${t};`);
    ok(denied(r) || r.out === '0', `signed out: nothing readable in ${t}`, r);
  }
  ok(denied(one(null, `select public.my_classes();`)), 'signed out: cannot call teacher functions');
  ok(denied(one(B, `select join_code from public.teaching_spaces;`)), 'a member cannot read the join code with a select');
  ok(denied(one(null, `select code_hash from public.seats;`)), 'signed out: cannot read seat codes');

  // ---- Classes ----
  const k3B = json(one(A, `select to_jsonb(k) from public.create_class(:'s', '3B') k;`, { s: spaceA.id }));
  const k3C = json(one(B, `select to_jsonb(k) from public.create_class(:'s', '3C') k;`, { s: spaceA.id }));
  ok(!!k3B && !!k3C, 'teachers create classes in their space');
  ok(denied(one(C, `select public.create_class(:'s', 'Sneaky');`, { s: spaceA.id })), 'a teacher outside the space cannot add a class to it');
  ok(rlsBlocked(one(A, `insert into public.classes (space_id, name, created_by) values ('${spaceC.id}', 'x', '${A}');`)), 'classes cannot be inserted directly into another space');
  const listA = json(one(A, `select public.my_classes();`));
  const listB = json(one(B, `select public.my_classes();`));
  const listC = json(one(C, `select public.my_classes();`));
  ok(listA.length === 2, 'the owner sees every class in the space', listA);
  ok(listB.length === 1 && listB[0].name === '3C', 'a teacher sees only the classes they teach', listB);
  ok(listC.length === 0, 'a teacher at another school sees none of them', listC);

  // ---- Roster and seats ----
  const ari = json(one(A, `select public.add_student(:'k', '  Ari ');`, { k: k3B.id }));
  const bo = json(one(A, `select public.add_student(:'k', 'Bo');`, { k: k3B.id }));
  ok(ari?.nickname === 'Ari' && !!bo, 'a teacher adds learners by nickname');
  ok(rlsBlocked(one(B, `select public.add_student(:'k', 'Intruder');`, { k: k3B.id })), 'a teacher cannot add learners to a class they don’t teach');
  ok(!one(A, `select public.add_student(:'k', '');`, { k: k3B.id }).ok, 'an empty nickname is refused');
  ok(denied(one(C, `select public.issue_seat_code(:'s');`, { s: ari.id })), 'another school’s teacher cannot issue a code for this learner');
  const code = json(one(A, `select to_jsonb(public.issue_seat_code(:'s'));`, { s: ari.id }));
  ok(/^[A-Z2-9]{6}$/.test(code), 'the teacher gets a 6-character code for the learner', code);
  ok(denied(one(A, `select code_hash from public.seats;`)), 'even the teacher cannot read the stored code hash');
  ok(one(A, `select count(*) from public.seats where code_expires_at > now();`).out === '1', 'the teacher can see a code is waiting');

  ok(one(null, `select count(*) from public.redeem_seat('ZZZZZZ');`).out === '0', 'a wrong learner code links nothing');
  const link = json(one(null, `select to_jsonb(r) from public.redeem_seat(:'c') r;`, { c: ` ${code.toLowerCase()} ` }));
  ok(link?.nickname === 'Ari' && link.class_name === '3B' && link.device_token?.length === 48, 'the learner’s device redeems the code and gets a secret token', link);
  ok(one(null, `select count(*) from public.redeem_seat(:'c');`, { c: code }).out === '0', 'a code works once');
  const tok = link.device_token;

  // ---- Assignments ----
  const asg = json(one(A, `select public.assign(:'k', 'L01', null, '{"slower": true}', 'Steady beat this week');`, { k: k3B.id }));
  ok(asg?.activity_id === 'L01' && asg.student_ids === null, 'the teacher assigns an activity to the whole class');
  const boOnly = json(one(A, `select public.assign(:'k', 'L02', array[:'b']::uuid[], null, null);`, { k: k3B.id, b: bo.id }));
  ok(!!boOnly, 'the teacher assigns an activity to one learner');
  ok(rlsBlocked(one(B, `select public.assign(:'k', 'L03', null, null, null);`, { k: k3B.id })), 'a teacher cannot assign to a class they don’t teach');
  ok(!one(A, `select public.assign(:'k', 'L03', null, '{"x": "${'y'.repeat(3000)}"}', null);`, { k: k3B.id }).ok, 'oversized assignment settings are refused');

  // ---- Learner device sync ----
  const attempt = (id, extra = {}) => ({ id, activity_id: 'L01', kind: 'practice', instrument: 'drums', input_mode: 'screen', unclear: false, passed: false, summary: { matched: 3, missed: 1, extra: 0 }, support: { slower: true }, coach: { focus: 'timing' }, attempted_at: Date.now(), assignment_id: asg.id, ...extra });
  const batch = [attempt('a-0001'), attempt('a-0001'), attempt('a-0002', { kind: 'nonsense' }), attempt('a-0003', { input_mode: 'mic', unclear: true })];
  const s1 = json(one(null, `select public.device_sync(:'t', :'b'::jsonb);`, { t: tok, b: JSON.stringify(batch) }));
  ok(s1 && s1.accepted.includes('a-0001') && s1.accepted.includes('a-0003') && s1.rejected.includes('a-0002'), 'sync accepts good attempts and reports a malformed one without losing the batch', s1);
  ok(s1.assignments.length === 1 && s1.assignments[0].activity_id === 'L01' && s1.assignments[0].supports.slower === true, 'the device gets the class assignment, not another learner’s', s1.assignments);
  ok(s1.plan === null && s1.student.nickname === 'Ari', 'no plan yet; the device knows whose seat it is');
  const s2 = json(one(null, `select public.device_sync(:'t', :'b'::jsonb);`, { t: tok, b: JSON.stringify([attempt('a-0001')]) }));
  ok(s2.accepted.includes('a-0001') && db.admin(`select count(*) from public.evidence where id = 'a-0001';`).trim() === '1', 'sending the same attempt again is safe: no duplicate');
  ok(denied(one(null, `select public.device_sync('not-a-token', '[]');`)), 'a device without a valid token gets nothing');
  ok(denied(one(null, `insert into public.evidence (id, student_id, class_id, activity_id, kind, attempted_at) values ('x-1', '${ari.id}', '${k3B.id}', 'L01', 'practice', now());`)), 'evidence cannot be written except through sync');
  ok(rlsBlocked(one(A, `insert into public.evidence (id, student_id, class_id, activity_id, kind, attempted_at) values ('x-2', '${ari.id}', '${k3B.id}', 'L01', 'independent', now());`)) || denied(one(A, `insert into public.evidence (id, student_id, class_id, activity_id, kind, attempted_at) values ('x-2', '${ari.id}', '${k3B.id}', 'L01', 'independent', now());`)), 'a teacher cannot write evidence for a learner');
  ok(!one(A, `update public.evidence set passed = true;`).ok || one(A, `select count(*) from public.evidence where passed;`).out === '0', 'a teacher cannot change what was observed');
  const big = JSON.stringify([attempt('a-0009', { summary: { x: 'y'.repeat(4000) } })]);
  ok(json(one(null, `select public.device_sync(:'t', :'b'::jsonb);`, { t: tok, b: big })).rejected.includes('a-0009'), 'oversized evidence is refused');
  const other = 'a-0001';
  const boCode = json(one(A, `select to_jsonb(public.issue_seat_code(:'s'));`, { s: bo.id }));
  const boTok = json(one(null, `select to_jsonb(r) from public.redeem_seat(:'c') r;`, { c: boCode })).device_token;
  const s3 = json(one(null, `select public.device_sync(:'t', :'b'::jsonb);`, { t: boTok, b: JSON.stringify([attempt(other)]) }));
  ok(s3.rejected.includes(other) && s3.assignments.length === 2, 'one learner cannot overwrite another’s attempt; a one-learner assignment reaches only them', s3);

  // ---- Teacher review ----
  const boardA = json(one(A, `select public.class_board(:'k');`, { k: k3B.id }));
  const ariRow = boardA?.students.find((s) => s.nickname === 'Ari');
  ok(ariRow?.evidence.length === 2 && ariRow.seat.joined_at && !('device_token_hash' in ariRow.seat), 'the teacher sees the learner’s evidence and that a device is linked, never the token', ariRow);
  ok(one(B, `select public.class_board(:'k') is null;`, { k: k3B.id }).out === 't', 'a teacher who doesn’t teach the class cannot see its board');
  ok(one(C, `select public.class_board(:'k') is null;`, { k: k3B.id }).out === 't', 'a teacher at another school cannot see its board');

  const p1 = json(one(A, `select to_jsonb(r) from public.set_support_plan(:'s', 'L02', '{"slower": true}', '{"pulse": "practise"}', 0) r;`, { s: ari.id }));
  ok(p1?.version === 1 && p1.conflict === false, 'the teacher changes the next activity, support and a skill judgement', p1);
  const stale = json(one(A, `select to_jsonb(r) from public.set_support_plan(:'s', 'L05', '{}', '{}', 0) r;`, { s: ari.id }));
  ok(stale?.conflict === true && stale.plan.next_activity_id === 'L02', 'saving over a newer change is refused and the newer plan comes back', stale);
  ok(denied(one(B, `select * from public.set_support_plan(:'s', 'L05', '{}', '{}', 1);`, { s: ari.id })), 'a teacher who doesn’t teach the class cannot change the plan');

  ok(one(A, `insert into public.class_teachers (class_id, teacher_id) values ('${k3B.id}', '${B}');`).ok, 'a teacher of the class adds a co-teacher from the same space');
  ok(rlsBlocked(one(A, `insert into public.class_teachers (class_id, teacher_id) values ('${k3B.id}', '${C}');`)), 'a teacher from another space cannot be added to a class');
  const p2 = json(one(B, `select to_jsonb(r) from public.set_support_plan(:'s', 'L03', '{"hear-first": true}', '{"pulse": "secure"}', 1) r;`, { s: ari.id }));
  ok(p2?.version === 2 && !p2.conflict, 'the co-teacher can now change the plan');
  const note = json(one(B, `select public.add_note(:'s', 'Loves the snare. Try pairing with Bo.');`, { s: ari.id }));
  ok(!!note?.id, 'a teacher adds a private note');
  ok(one(A, `delete from public.teacher_notes where id = :'n'; select count(*) from public.teacher_notes;`, { n: note.id }).out.endsWith('1'), 'a teacher cannot delete another teacher’s note');
  const s4 = json(one(null, `select public.device_sync(:'t', '[]');`, { t: tok }));
  ok(s4.plan?.version === 2 && s4.plan.next_activity_id === 'L03' && s4.plan.supports['hear-first'] === true, 'the learner’s device receives the teacher’s change', s4.plan);
  ok(!JSON.stringify(s4).includes('snare'), 'teacher notes never reach the learner’s device');

  // ---- Leaving, rotating, unlinking ----
  ok(denied(one(B, `select public.rotate_join_code(:'s');`, { s: spaceA.id })), 'only an owner can change the join code');
  const newCode = json(one(A, `select to_jsonb(public.rotate_join_code(:'s'));`, { s: spaceA.id }));
  ok(newCode && newCode !== spaceA.join_code && one(C, `select count(*) from public.join_space(:'c');`, { c: spaceA.join_code }).out === '0', 'after a new join code, the old one stops working');
  ok(one(B, `select public.leave_space(:'s');`, { s: spaceA.id }).ok, 'a teacher can leave the space');
  ok(one(B, `select public.class_board(:'k') is null;`, { k: k3B.id }).out === 't' && json(one(B, `select public.my_classes();`)).length === 0, 'after leaving, they see none of its classes');

  ok(one(null, `select public.device_leave(:'t');`, { t: tok }).ok && denied(one(null, `select public.device_sync(:'t', '[]');`, { t: tok })), 'a device that leaves the class can no longer sync');
  const reCode = json(one(A, `select to_jsonb(public.issue_seat_code(:'s'));`, { s: bo.id }));
  ok(reCode && denied(one(null, `select public.device_sync(:'t', '[]');`, { t: boTok })), 'a new code for a learner unlinks the old device');

  // ---- Retention and removal ----
  db.admin(`insert into public.evidence (id, student_id, class_id, activity_id, kind, attempted_at) values ('old-1', '${ari.id}', '${k3B.id}', 'L01', 'practice', now() - interval '500 days');`);
  ok(denied(one(A, `select public.purge_old_evidence();`)), 'teachers cannot run the retention purge');
  ok(db.admin(`select public.purge_old_evidence();`).trim() === '1', 'the scheduled purge deletes evidence older than 400 days');
  ok(json(one(A, `select to_jsonb(public.remove_student(:'s'));`, { s: ari.id })) === true && db.admin(`select count(*) from public.evidence where student_id = '${ari.id}';`).trim() === '0' && db.admin(`select count(*) from public.teacher_notes;`).trim() === '0', 'removing a learner deletes their evidence, plan and notes');
} catch (e) {
  fails++;
  console.log('FAIL (crashed)', e.stack ?? e);
} finally {
  db.stop();
}
console.log(`\n${passes} passed, ${fails} failed`);
process.exit(fails ? 1 : 0);
