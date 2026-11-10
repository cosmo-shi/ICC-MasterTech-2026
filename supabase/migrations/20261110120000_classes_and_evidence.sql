-- Carmen classes across devices: classes, a roster of nicknames, assignments, learning evidence
-- and the teacher's support plan for each learner. Run after 20261110000000_teacher_spaces.sql.
-- See docs/CLASSROOM.md for the rules in words and docs/SERVICES.md for setup.
--
-- What is stored, and why (data minimisation):
--   * Learner: a nickname the teacher types (no surname, birthday, email or account).
--   * Evidence: one row per attempt, with the activity, practice or on-your-own, counts of matched,
--     missed and extra sounds, timing counts, which help was used, whether the input was unclear,
--     and the coach's focus. No audio, no raw timings, no recordings, no free text from the child.
--   * A learner device holds a secret token for its roster seat (only its hash is stored here).
--
-- Who can do what (enforced here, not in the app):
--   * Space owner (school admin): manage the space's members and see every class in the space.
--   * Teacher: create classes in a space they belong to; see and change only classes they teach.
--   * Learner device: through two functions only (redeem a seat code, sync), and only for its seat.
--   * Nobody signed out can read anything; verifying an email gives no access to any class.

-- ---------- Classes ----------
create table if not exists public.classes (
  id uuid primary key default gen_random_uuid(),
  space_id uuid not null references public.teaching_spaces (id) on delete cascade,
  name text not null check (char_length(name) between 1 and 60),
  created_by uuid not null references public.teachers (id),
  created_at timestamptz not null default now(),
  archived_at timestamptz
);
alter table public.classes enable row level security;

create table if not exists public.class_teachers (
  class_id uuid not null references public.classes (id) on delete cascade,
  teacher_id uuid not null references public.teachers (id) on delete cascade,
  primary key (class_id, teacher_id)
);
alter table public.class_teachers enable row level security;

create or replace function public.is_space_owner(s uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from space_members where space_id = s and teacher_id = auth.uid() and role = 'owner');
$$;

-- A teacher can see a class they teach, or any class in a space they own, while still a member.
create or replace function public.can_teach(c uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from classes k
    join space_members m on m.space_id = k.space_id and m.teacher_id = auth.uid()
    where k.id = c and (m.role = 'owner' or exists (select 1 from class_teachers t where t.class_id = k.id and t.teacher_id = auth.uid()))
  );
$$;

create policy classes_select on public.classes for select using (public.can_teach(id));
create policy classes_update on public.classes for update using (public.can_teach(id)) with check (public.can_teach(id) and public.is_member(space_id));
create policy class_teachers_select on public.class_teachers for select using (public.can_teach(class_id));
-- Adding a co-teacher: an existing teacher of the class adds a member of the same space.
create policy class_teachers_insert on public.class_teachers for insert with check (
  public.can_teach(class_id) and exists (select 1 from classes k join space_members m on m.space_id = k.space_id where k.id = class_id and m.teacher_id = class_teachers.teacher_id)
);
create policy class_teachers_delete on public.class_teachers for delete using (public.can_teach(class_id));

create or replace function public.create_class(space uuid, class_name text) returns public.classes
language plpgsql volatile security definer set search_path = public as $$
declare k classes;
begin
  if auth.uid() is null then raise exception 'not signed in' using errcode = '42501'; end if;
  if not public.is_member(space) then raise exception 'not a member of this space' using errcode = '42501'; end if;
  insert into classes (space_id, name, created_by) values (space, class_name, auth.uid()) returning * into k;
  insert into class_teachers (class_id, teacher_id) values (k.id, auth.uid());
  return k;
end $$;

-- ---------- Roster ----------
create table if not exists public.students (
  id uuid primary key default gen_random_uuid(),
  class_id uuid not null references public.classes (id) on delete cascade,
  nickname text not null check (char_length(nickname) between 1 and 30),
  created_at timestamptz not null default now()
);
alter table public.students enable row level security;
create policy students_select on public.students for select using (public.can_teach(class_id));
create policy students_insert on public.students for insert with check (public.can_teach(class_id));
create policy students_update on public.students for update using (public.can_teach(class_id)) with check (public.can_teach(class_id));
-- Removing a learner deletes their seat, evidence, plan and notes (cascade): the retention rule.
create policy students_delete on public.students for delete using (public.can_teach(class_id));

-- One seat per learner: a short code the teacher gives out, and the token of the device that used it.
create table if not exists public.seats (
  student_id uuid primary key references public.students (id) on delete cascade,
  code_hash text,
  code_expires_at timestamptz,
  device_token_hash text,
  device_joined_at timestamptz,
  device_seen_at timestamptz
);
alter table public.seats enable row level security;
-- Teachers see whether a device is linked and when it last synced, never the hashes.
create policy seats_select on public.seats for select using (exists (select 1 from students st where st.id = student_id and public.can_teach(st.class_id)));
-- A column revoke does nothing while the table-wide grant stands (Supabase grants every table to
-- anon and authenticated), so the table grant is removed and only safe columns are granted back.
revoke all on public.seats from anon, authenticated;
grant select (student_id, code_expires_at, device_joined_at, device_seen_at) on public.seats to authenticated;

-- Same fix for the first migration: members must not read a space's join code with a select.
revoke select on public.teaching_spaces from anon, authenticated;
grant select (id, name, created_by, created_at) on public.teaching_spaces to authenticated;

create or replace function public.hash_secret(s text) returns text
language sql immutable set search_path = public, extensions as $$ select encode(digest(s, 'sha256'), 'hex') $$;

-- A new code for a learner (valid 14 days). Issuing a code unlinks any device on that seat.
create or replace function public.issue_seat_code(student uuid) returns text
language plpgsql volatile security definer set search_path = public as $$
declare
  alphabet constant text := 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  code text := '';
  k uuid;
begin
  select class_id into k from students where id = student;
  if k is null or not public.can_teach(k) then raise exception 'not your learner' using errcode = '42501'; end if;
  for i in 1..6 loop code := code || substr(alphabet, 1 + floor(random() * length(alphabet))::int, 1); end loop;
  insert into seats (student_id, code_hash, code_expires_at, device_token_hash, device_joined_at)
    values (student, public.hash_secret(code), now() + interval '14 days', null, null)
    on conflict (student_id) do update set code_hash = excluded.code_hash, code_expires_at = excluded.code_expires_at, device_token_hash = null, device_joined_at = null;
  return code;
end $$;

-- ---------- Assignments ----------
create table if not exists public.assignments (
  id uuid primary key default gen_random_uuid(),
  class_id uuid not null references public.classes (id) on delete cascade,
  activity_id text not null check (char_length(activity_id) between 1 and 40),
  -- null: the whole class; otherwise these learners (a group or one learner).
  student_ids uuid[],
  instruments text[] not null default '{keyboard,drums}' check (instruments <@ array['keyboard', 'drums']),
  inputs text[] not null default '{screen,mic,midi}' check (inputs <@ array['screen', 'mic', 'midi']),
  supports jsonb not null default '{}'::jsonb check (jsonb_typeof(supports) = 'object' and pg_column_size(supports) < 2000),
  note text check (note is null or char_length(note) <= 200),
  created_by uuid not null references public.teachers (id),
  created_at timestamptz not null default now(),
  closed_at timestamptz
);
alter table public.assignments enable row level security;
create policy assignments_select on public.assignments for select using (public.can_teach(class_id));
create policy assignments_insert on public.assignments for insert with check (public.can_teach(class_id) and created_by = auth.uid());
create policy assignments_update on public.assignments for update using (public.can_teach(class_id)) with check (public.can_teach(class_id));
create policy assignments_delete on public.assignments for delete using (public.can_teach(class_id));

-- ---------- Evidence ----------
create table if not exists public.evidence (
  -- The attempt's id from the device: sending the same attempt twice is a no-op (no duplicates).
  id text primary key check (char_length(id) between 4 and 64),
  student_id uuid not null references public.students (id) on delete cascade,
  class_id uuid not null references public.classes (id) on delete cascade,
  assignment_id uuid references public.assignments (id) on delete set null,
  activity_id text not null check (char_length(activity_id) <= 40),
  kind text not null check (kind in ('practice', 'independent', 'check', 'mission-check', 'make')),
  instrument text check (instrument in ('keyboard', 'drums')),
  input_mode text check (input_mode in ('screen', 'mic', 'midi')),
  unclear boolean not null default false,
  passed boolean not null default false,
  summary jsonb check (summary is null or (jsonb_typeof(summary) = 'object' and pg_column_size(summary) < 2000)),
  support jsonb check (support is null or (jsonb_typeof(support) = 'object' and pg_column_size(support) < 2000)),
  coach jsonb check (coach is null or (jsonb_typeof(coach) = 'object' and pg_column_size(coach) < 2000)),
  attempted_at timestamptz not null,
  received_at timestamptz not null default now()
);
create index if not exists evidence_by_student on public.evidence (student_id, attempted_at desc);
alter table public.evidence enable row level security;
create policy evidence_select on public.evidence for select using (public.can_teach(class_id));
-- No insert/update/delete policies: evidence comes only from the learner's device through sync,
-- and teachers correct the inference in the plan below, never by editing what was observed.

-- ---------- Support plan (teacher overrides) ----------
create table if not exists public.support_plans (
  student_id uuid primary key references public.students (id) on delete cascade,
  class_id uuid not null references public.classes (id) on delete cascade,
  next_activity_id text check (next_activity_id is null or char_length(next_activity_id) <= 40),
  supports jsonb not null default '{}'::jsonb check (jsonb_typeof(supports) = 'object' and pg_column_size(supports) < 2000),
  skill_overrides jsonb not null default '{}'::jsonb check (jsonb_typeof(skill_overrides) = 'object' and pg_column_size(skill_overrides) < 2000),
  version int not null default 0,
  updated_by uuid references public.teachers (id),
  updated_at timestamptz not null default now()
);
alter table public.support_plans enable row level security;
create policy plans_select on public.support_plans for select using (public.can_teach(class_id));

-- Change a learner's plan. `expected` is the version the teacher saw: if another teacher changed
-- it since, nothing is written and the latest plan comes back with conflict = true.
create or replace function public.set_support_plan(student uuid, next_activity text, supports jsonb, skill_overrides jsonb, expected int)
returns table (version int, conflict boolean, plan jsonb)
language plpgsql volatile security definer set search_path = public as $$
declare k uuid; cur support_plans;
begin
  select class_id into k from students where id = student;
  if k is null or not public.can_teach(k) then raise exception 'not your learner' using errcode = '42501'; end if;
  select * into cur from support_plans p where p.student_id = student for update;
  if found and cur.version <> expected then
    return query select cur.version, true, to_jsonb(cur);
    return;
  end if;
  insert into support_plans (student_id, class_id, next_activity_id, supports, skill_overrides, version, updated_by, updated_at)
    values (student, k, next_activity, coalesce(supports, '{}'::jsonb), coalesce(skill_overrides, '{}'::jsonb), 1, auth.uid(), now())
    on conflict (student_id) do update set next_activity_id = excluded.next_activity_id, supports = excluded.supports, skill_overrides = excluded.skill_overrides,
      version = support_plans.version + 1, updated_by = auth.uid(), updated_at = now();
  select * into cur from support_plans p where p.student_id = student;
  return query select cur.version, false, to_jsonb(cur);
end $$;

-- ---------- Teacher notes (teachers only; never sent to the learner's device) ----------
create table if not exists public.teacher_notes (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students (id) on delete cascade,
  class_id uuid not null references public.classes (id) on delete cascade,
  author uuid not null references public.teachers (id) default auth.uid(),
  body text not null check (char_length(body) between 1 and 1000),
  created_at timestamptz not null default now()
);
alter table public.teacher_notes enable row level security;
create policy notes_select on public.teacher_notes for select using (public.can_teach(class_id));
create policy notes_insert on public.teacher_notes for insert with check (public.can_teach(class_id) and author = auth.uid() and exists (select 1 from students s where s.id = student_id and s.class_id = teacher_notes.class_id));
create policy notes_delete on public.teacher_notes for delete using (author = auth.uid());

-- ---------- Learner device functions (the only way in for a device) ----------
-- Redeem a seat code: the device gets a secret token for that seat. The code stops working.
create or replace function public.redeem_seat(code text)
returns table (device_token text, student_id uuid, nickname text, class_name text)
language plpgsql volatile security definer set search_path = public, extensions as $$
declare s seats; tok text;
begin
  select * into s from seats where seats.code_hash = public.hash_secret(upper(trim(code))) and seats.code_expires_at > now();
  if not found then return; end if;
  tok := encode(gen_random_bytes(24), 'hex');
  update seats set device_token_hash = public.hash_secret(tok), device_joined_at = now(), device_seen_at = now(), code_hash = null, code_expires_at = null where seats.student_id = s.student_id;
  return query select tok, st.id, st.nickname, k.name from students st join classes k on k.id = st.class_id where st.id = s.student_id;
end $$;

-- Send attempts and get back what the teacher set: active assignments and the support plan.
-- Attempts already received are ignored (idempotent), so retrying after a lost reply is safe.
create or replace function public.device_sync(token text, attempts jsonb)
returns jsonb
language plpgsql volatile security definer set search_path = public as $$
declare st students; a jsonb; accepted text[] := '{}'; rejected text[] := '{}';
begin
  select s2.* into st from seats se join students s2 on s2.id = se.student_id where se.device_token_hash = public.hash_secret(token);
  if not found then raise exception 'seat not linked' using errcode = '28000'; end if;
  if jsonb_typeof(coalesce(attempts, '[]'::jsonb)) <> 'array' or jsonb_array_length(coalesce(attempts, '[]'::jsonb)) > 200 then raise exception 'bad batch' using errcode = '22023'; end if;
  for a in select * from jsonb_array_elements(coalesce(attempts, '[]'::jsonb)) loop
    begin
    insert into evidence (id, student_id, class_id, assignment_id, activity_id, kind, instrument, input_mode, unclear, passed, summary, support, coach, attempted_at)
    values (
      a->>'id', st.id, st.class_id,
      (select x.id from assignments x where x.id::text = a->>'assignment_id' and x.class_id = st.class_id),
      a->>'activity_id', a->>'kind', a->>'instrument', coalesce(a->>'input_mode', 'screen'),
      coalesce((a->>'unclear')::boolean, false), coalesce((a->>'passed')::boolean, false),
      a->'summary', a->'support', a->'coach', to_timestamp((a->>'attempted_at')::double precision / 1000)
    ) on conflict (id) do nothing;
    -- An id another learner already used is not this learner's attempt: report it, don't accept it.
    if exists (select 1 from evidence e where e.id = a->>'id' and e.student_id = st.id) then accepted := accepted || (a->>'id');
    else rejected := rejected || coalesce(a->>'id', '?'); end if;
    exception when others then
      -- A malformed attempt is skipped (and reported) without losing the rest of the batch.
      rejected := rejected || coalesce(a->>'id', '?');
    end;
  end loop;
  update seats set device_seen_at = now() where seats.student_id = st.id;
  return jsonb_build_object(
    'accepted', to_jsonb(accepted),
    'rejected', to_jsonb(rejected),
    'student', jsonb_build_object('id', st.id, 'nickname', st.nickname, 'class_name', (select name from classes where id = st.class_id)),
    'assignments', coalesce((select jsonb_agg(jsonb_build_object('id', x.id, 'activity_id', x.activity_id, 'instruments', x.instruments, 'inputs', x.inputs, 'supports', x.supports, 'note', x.note, 'created_at', x.created_at) order by x.created_at desc)
      from assignments x where x.class_id = st.class_id and x.closed_at is null and (x.student_ids is null or st.id = any (x.student_ids))), '[]'::jsonb),
    'plan', (select jsonb_build_object('next_activity_id', p.next_activity_id, 'supports', p.supports, 'skill_overrides', p.skill_overrides, 'version', p.version, 'updated_at', p.updated_at) from support_plans p where p.student_id = st.id),
    'server_time', now()
  );
end $$;

-- The learner (or a grown-up) unlinks this device. Evidence already sent stays with the teacher.
create or replace function public.device_leave(token text) returns void
language sql volatile security definer set search_path = public as $$
  update seats set device_token_hash = null, device_joined_at = null where device_token_hash = public.hash_secret(token);
$$;

-- ---------- Membership: leaving a space, owners removing members, rotating the join code ----------
create or replace function public.leave_space(space uuid) returns void
language plpgsql volatile security definer set search_path = public as $$
begin
  if exists (select 1 from space_members where space_id = space and teacher_id = auth.uid() and role = 'owner')
     and (select count(*) from space_members where space_id = space and role = 'owner') = 1
     and (select count(*) from space_members where space_id = space) > 1 then
    raise exception 'make another owner first' using errcode = '42501';
  end if;
  delete from class_teachers where teacher_id = auth.uid() and class_id in (select id from classes where space_id = space);
  delete from space_members where space_id = space and teacher_id = auth.uid();
end $$;

create or replace function public.rotate_join_code(space uuid) returns text
language plpgsql volatile security definer set search_path = public as $$
declare c text := public.new_join_code();
begin
  if not public.is_space_owner(space) then raise exception 'owners only' using errcode = '42501'; end if;
  update teaching_spaces set join_code = c where id = space;
  return c;
end $$;

-- Removing a member also removes them from the classes they taught in that space.
create or replace function public.on_member_removed() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  delete from class_teachers where teacher_id = old.teacher_id and class_id in (select id from classes where space_id = old.space_id);
  return old;
end $$;
drop trigger if exists carmen_member_removed on public.space_members;
create trigger carmen_member_removed after delete on public.space_members for each row execute function public.on_member_removed();

-- ---------- Teacher reads and writes (security invoker: the policies above decide) ----------
create or replace function public.my_classes()
returns jsonb language sql stable security invoker set search_path = public as $$
  select coalesce(jsonb_agg(jsonb_build_object(
    'id', k.id, 'name', k.name, 'space_id', k.space_id, 'space_name', s.name, 'created_at', k.created_at,
    'teaches', exists (select 1 from class_teachers t where t.class_id = k.id and t.teacher_id = auth.uid()),
    'students', (select count(*) from students st where st.class_id = k.id)
  ) order by k.created_at), '[]'::jsonb)
  from classes k join teaching_spaces s on s.id = k.space_id
  where k.archived_at is null;
$$;

-- Everything the class board needs in one call: roster, device links, plans, open assignments and
-- each learner's recent evidence (summaries only).
create or replace function public.class_board(class uuid)
returns jsonb language sql stable security invoker set search_path = public as $$
  select case when not exists (select 1 from classes where id = class) then null else jsonb_build_object(
    'class', (select jsonb_build_object('id', k.id, 'name', k.name, 'space_id', k.space_id) from classes k where k.id = class),
    'students', coalesce((select jsonb_agg(jsonb_build_object(
        'id', st.id, 'nickname', st.nickname,
        'seat', (select jsonb_build_object('joined_at', se.device_joined_at, 'seen_at', se.device_seen_at, 'code_waiting', coalesce(se.code_expires_at > now(), false)) from seats se where se.student_id = st.id),
        'plan', (select jsonb_build_object('next_activity_id', p.next_activity_id, 'supports', p.supports, 'skill_overrides', p.skill_overrides, 'version', p.version, 'updated_at', p.updated_at) from support_plans p where p.student_id = st.id),
        'evidence', coalesce((select jsonb_agg(to_jsonb(e) - 'student_id' - 'class_id' order by e.attempted_at desc) from (select * from evidence e where e.student_id = st.id order by e.attempted_at desc limit 60) e), '[]'::jsonb)
      ) order by st.nickname) from students st where st.class_id = class), '[]'::jsonb),
    'assignments', coalesce((select jsonb_agg(to_jsonb(x) order by x.created_at desc) from assignments x where x.class_id = class and x.closed_at is null), '[]'::jsonb)
  ) end;
$$;

create or replace function public.student_detail(student uuid)
returns jsonb language sql stable security invoker set search_path = public as $$
  select jsonb_build_object(
    'student', to_jsonb(st),
    'plan', (select to_jsonb(p) from support_plans p where p.student_id = st.id),
    'evidence', coalesce((select jsonb_agg(to_jsonb(e) order by e.attempted_at desc) from (select * from evidence e where e.student_id = st.id order by e.attempted_at desc limit 300) e), '[]'::jsonb),
    'notes', coalesce((select jsonb_agg(jsonb_build_object('id', n.id, 'body', n.body, 'created_at', n.created_at, 'mine', n.author = auth.uid(), 'author', (select display_name from teachers where id = n.author)) order by n.created_at desc) from teacher_notes n where n.student_id = st.id), '[]'::jsonb)
  ) from students st where st.id = student;
$$;

create or replace function public.add_student(class uuid, nickname text)
returns jsonb language sql volatile security invoker set search_path = public as $$
  insert into students (class_id, nickname) values (class, trim(nickname)) returning to_jsonb(students.*);
$$;

create or replace function public.remove_student(student uuid)
returns boolean language sql volatile security invoker set search_path = public as $$
  with d as (delete from students where id = student returning 1) select exists (select 1 from d);
$$;

create or replace function public.assign(class uuid, activity text, learners uuid[], supports jsonb, note text)
returns jsonb language sql volatile security invoker set search_path = public as $$
  insert into assignments (class_id, activity_id, student_ids, supports, note, created_by)
  values (class, activity, case when learners is null or cardinality(learners) = 0 then null else learners end, coalesce(supports, '{}'::jsonb), nullif(trim(note), ''), auth.uid())
  returning to_jsonb(assignments.*);
$$;

create or replace function public.close_assignment(assignment uuid)
returns boolean language sql volatile security invoker set search_path = public as $$
  with u as (update assignments set closed_at = now() where id = assignment and closed_at is null returning 1) select exists (select 1 from u);
$$;

create or replace function public.add_note(student uuid, body text)
returns jsonb language sql volatile security invoker set search_path = public as $$
  insert into teacher_notes (student_id, class_id, body)
  select st.id, st.class_id, trim(body) from students st where st.id = student
  returning jsonb_build_object('id', id, 'body', body, 'created_at', created_at, 'mine', true);
$$;

-- ---------- Retention ----------
-- Evidence older than 400 days (about a school year and a term) is deleted. Schedule it daily
-- (Supabase: Database, Cron: `select public.purge_old_evidence();`).
create or replace function public.purge_old_evidence() returns int
language sql volatile security definer set search_path = public as $$
  with d as (delete from evidence where attempted_at < now() - interval '400 days' returning 1) select count(*)::int from d;
$$;

-- ---------- Grants ----------
revoke all on function public.create_class(uuid, text), public.issue_seat_code(uuid), public.set_support_plan(uuid, text, jsonb, jsonb, int),
  public.leave_space(uuid), public.rotate_join_code(uuid), public.purge_old_evidence() from public, anon;
grant execute on function public.create_class(uuid, text), public.issue_seat_code(uuid), public.set_support_plan(uuid, text, jsonb, jsonb, int),
  public.leave_space(uuid), public.rotate_join_code(uuid) to authenticated;
revoke all on function public.my_classes(), public.class_board(uuid), public.student_detail(uuid), public.add_student(uuid, text), public.remove_student(uuid),
  public.assign(uuid, text, uuid[], jsonb, text), public.close_assignment(uuid), public.add_note(uuid, text) from public, anon;
grant execute on function public.my_classes(), public.class_board(uuid), public.student_detail(uuid), public.add_student(uuid, text), public.remove_student(uuid),
  public.assign(uuid, text, uuid[], jsonb, text), public.close_assignment(uuid), public.add_note(uuid, text) to authenticated;
revoke all on function public.redeem_seat(text), public.device_sync(text, jsonb), public.device_leave(text) from public;
grant execute on function public.redeem_seat(text), public.device_sync(text, jsonb), public.device_leave(text) to anon, authenticated;
revoke all on function public.hash_secret(text), public.on_member_removed(), public.purge_old_evidence() from public, anon, authenticated;
grant select, insert, update, delete on public.classes, public.class_teachers, public.students, public.assignments, public.teacher_notes to authenticated;
grant select on public.evidence, public.support_plans to authenticated;
