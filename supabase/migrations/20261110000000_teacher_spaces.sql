-- Carmen teacher accounts: teachers, teaching spaces and memberships.
-- Run in a Supabase project (SQL editor or `supabase db push`). See docs/SERVICES.md.
-- No child data is stored by this file. Class rosters and learning summaries (never audio) are
-- added by 20261110120000_classes_and_evidence.sql, with the rules written there.
--
-- Rules enforced by the server, not the app:
--   * A teacher can read and write only their own profile.
--   * A teacher can see a space only if they are a member of it.
--   * Joining needs the space's code (checked inside join_space, never exposed by a select).
--   * Only owners can see the join code and remove members.
--   * Signing up is limited to school email domains listed in allowed_email_domains.

create extension if not exists pgcrypto;

create table if not exists public.allowed_email_domains (
  domain text primary key check (domain = lower(domain))
);
comment on table public.allowed_email_domains is 'School email domains allowed to create teacher accounts, e.g. education.nsw.gov.au. Managed by the service owner.';
alter table public.allowed_email_domains enable row level security;
-- No policies: not readable or writable from the app.

create table if not exists public.teachers (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null check (char_length(display_name) between 1 and 60),
  school text check (school is null or char_length(school) <= 100),
  created_at timestamptz not null default now()
);
alter table public.teachers enable row level security;
create policy teachers_select_own on public.teachers for select using (id = auth.uid());
create policy teachers_insert_own on public.teachers for insert with check (id = auth.uid());
create policy teachers_update_own on public.teachers for update using (id = auth.uid()) with check (id = auth.uid());

create table if not exists public.teaching_spaces (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 60),
  join_code text not null unique,
  created_by uuid not null references public.teachers (id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.teaching_spaces enable row level security;

create table if not exists public.space_members (
  space_id uuid not null references public.teaching_spaces (id) on delete cascade,
  teacher_id uuid not null references public.teachers (id) on delete cascade,
  role text not null check (role in ('owner', 'teacher')),
  joined_at timestamptz not null default now(),
  primary key (space_id, teacher_id)
);
alter table public.space_members enable row level security;

create or replace function public.is_member(s uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from space_members where space_id = s and teacher_id = auth.uid());
$$;

-- Members see their spaces; nobody can list other spaces or read codes by select.
create policy spaces_select_member on public.teaching_spaces for select using (public.is_member(id));
create policy members_select_same_space on public.space_members for select using (public.is_member(space_id));
create policy members_delete_by_owner on public.space_members for delete using (
  exists (select 1 from space_members m where m.space_id = space_members.space_id and m.teacher_id = auth.uid() and m.role = 'owner')
);
-- No insert/update policies: membership changes only through the functions below.
revoke select (join_code) on public.teaching_spaces from anon, authenticated;

create or replace function public.new_join_code() returns text
language plpgsql volatile as $$
declare
  alphabet constant text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  code text := '';
begin
  for i in 1..8 loop
    code := code || substr(alphabet, 1 + floor(random() * length(alphabet))::int, 1);
  end loop;
  return code;
end $$;

create or replace function public.my_spaces()
returns table (id uuid, name text, join_code text, role text)
language sql stable security definer set search_path = public as $$
  select s.id, s.name, case when m.role = 'owner' then s.join_code else null end, m.role
  from teaching_spaces s join space_members m on m.space_id = s.id
  where m.teacher_id = auth.uid()
  order by s.created_at;
$$;

create or replace function public.create_space(space_name text)
returns table (id uuid, name text, join_code text, role text)
language plpgsql volatile security definer set search_path = public as $$
declare
  me uuid := auth.uid();
  s teaching_spaces;
begin
  if me is null then raise exception 'not signed in' using errcode = '42501'; end if;
  if not exists (select 1 from teachers where teachers.id = me) then raise exception 'finish your profile first' using errcode = '42501'; end if;
  insert into teaching_spaces (name, join_code, created_by) values (space_name, new_join_code(), me) returning * into s;
  insert into space_members (space_id, teacher_id, role) values (s.id, me, 'owner');
  return query select s.id, s.name, s.join_code, 'owner'::text;
end $$;

create or replace function public.join_space(code text)
returns table (id uuid, name text, join_code text, role text)
language plpgsql volatile security definer set search_path = public as $$
declare
  me uuid := auth.uid();
  s teaching_spaces;
begin
  if me is null then raise exception 'not signed in' using errcode = '42501'; end if;
  if not exists (select 1 from teachers where teachers.id = me) then raise exception 'finish your profile first' using errcode = '42501'; end if;
  select * into s from teaching_spaces where teaching_spaces.join_code = upper(code);
  if not found then return; end if;
  insert into space_members (space_id, teacher_id, role) values (s.id, me, 'teacher') on conflict do nothing;
  return query select s.id, s.name, null::text, coalesce((select m.role from space_members m where m.space_id = s.id and m.teacher_id = me), 'teacher');
end $$;

revoke all on function public.my_spaces(), public.create_space(text), public.join_space(text) from public, anon;
grant execute on function public.my_spaces(), public.create_space(text), public.join_space(text) to authenticated;

-- Only school domains may sign up (Supabase "before user created" is also an option; this trigger
-- works on every plan). Verification proves the address; membership grants access.
create or replace function public.check_school_email() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if not exists (select 1 from allowed_email_domains d where lower(split_part(new.email, '@', 2)) = d.domain) then
    raise exception 'email domain not allowed' using errcode = '42501';
  end if;
  return new;
end $$;
drop trigger if exists carmen_school_email on auth.users;
create trigger carmen_school_email before insert on auth.users for each row execute function public.check_school_email();
