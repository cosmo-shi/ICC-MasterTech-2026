# Carmen services

Carmen runs entirely in the browser unless a school switches on **teacher accounts and classes**.
Learners never sign in. Audio never leaves the device. If a learner joins a teacher's class with a
code, a short summary of each try is sent to that class (docs/CLASSROOM.md says exactly what).

## Status

| Service | Needed for | Status |
|---|---|---|
| Supabase (Auth + Postgres with row-level security) | Teacher accounts, teaching spaces, classes and evidence sync | **Blocked: not configured.** Code, SQL and tests are done; database rules verified on a local Postgres. It needs a hosted project and two env vars |
| Vercel | Hosting the preview and the live app | Working (team master-tech-2026) |
| Anything else (analytics, fonts, CDNs, cloud audio) | Nothing | Not used, on purpose |

Until Supabase is configured, "I'm a teacher" says school accounts aren't switched on and offers only
the device PIN, labelled "Device only. Not a school account." It never pretends an account exists.

## Setting up teacher accounts

1. **Create a Supabase project** (Sydney region, `ap-southeast-2`, keeps data in Australia).
2. **Run the SQL, in order.** In the SQL editor (or `supabase db push`):
   `supabase/migrations/20261110000000_teacher_spaces.sql` (teachers, spaces, members, allowed
   domains), then `supabase/migrations/20261110120000_classes_and_evidence.sql` (classes, roster,
   seats, assignments, evidence, support plans, notes, retention). Both turn on row-level security.
   Check first with `node tools/verify-db/run.mjs`.
2a. **Schedule retention.** Database → Cron: daily `select public.purge_old_evidence();` (deletes
   evidence older than 400 days). Nothing is purged until this is scheduled.
3. **Allow school email domains.** Only listed domains can create an account. The match is exact,
   so list each domain the school uses:
   ```sql
   insert into public.allowed_email_domains (domain) values ('det.nsw.edu.au'), ('education.vic.gov.au');
   ```
   The app cannot read or change this table; only the project owner can.
4. **Email codes, not links.** Authentication → Providers → Email: on; "Confirm email": on.
   Authentication → Email Templates → "Magic Link" and "Confirm signup": put the code in the body,
   for example `Your Carmen code is {{ .Token }}. It expires in 1 hour.` Carmen asks for the 6-digit
   code and has no password.
5. **Email sending.** Supabase's built-in sender is rate-limited and for testing only. For a school
   pilot set up custom SMTP (Authentication → SMTP Settings).
6. **URLs.** Authentication → URL Configuration: Site URL = the Vercel address.
7. **Env vars in Vercel** (Project → Settings → Environment Variables, Preview and Production):
   - `VITE_SUPABASE_URL` = `https://<project-ref>.supabase.co`
   - `VITE_SUPABASE_ANON_KEY` = the project's **anon / publishable** key
   Redeploy. The build adds the Supabase address to the page's Content Security Policy by itself.
   Locally, put the same two lines in `.env.local` (git-ignored).

**Never** put the `service_role` key, a database password or SMTP credentials in the app or in a
`VITE_` variable: anything starting `VITE_` is shipped to every browser. The anon key is public by
design; what it can do is limited by the row-level security in the SQL.

## What the server enforces

- A teacher reads and edits only their own `teachers` row.
- A teacher sees a teaching space only if they created it or joined it with its code.
- Only the owner sees the join code.
- Signing up from a domain not in `allowed_email_domains` is refused by a database trigger.

- Classes, learners, evidence, plans and notes are visible only to teachers of that class and the
  space owner. Learner devices reach only their own seat, through three functions. Full table in
  docs/CLASSROOM.md.

Verifying an email proves the person controls that address. It does not prove they teach a class;
that is what the join code is for.

## How it was checked

| Check | Command | What it proves | What it does not |
|---|---|---|---|
| Unit tests | `npm test` (`src/auth`, `src/sync`) | Blocked when unconfigured, code request, verify, single renewal, sign-out, plain errors, outbox and statuses | Any server |
| Sign-in page flow | `node tools/e2e-teacher.mjs` | The app's requests and steps, against intercepted calls | Any server |
| Database rules | `node tools/verify-db/run.mjs` | Both migrations on real Postgres 16, run as PostgREST runs requests (role and JWT claims per transaction): 74 rules across signed-out, same-space, other-school, owner and learner-device callers | Supabase's own Auth, gateway, email, rate limits |
| Two devices | `node tools/verify-db/server.mjs` + `node tools/e2e-classes.mjs` | The whole class workflow through the real app on two browser profiles, on real Postgres | A hosted project; real phones; real email |

`tools/verify-db/server.mjs` is a **stand-in** for Supabase's sign-in and REST services in front of a
real local Postgres. It prints sign-in codes instead of emailing them. It is for verification on
one computer and must never be deployed.

**Still to do on a hosted project before any school uses it:** apply both migrations; add the
school's domains; switch on email codes; schedule the purge; set the two env vars; then run
`BASE=<preview url> SVC=<project url> node tools/e2e-classes.mjs` adapted to real inboxes, and the
two-device rows in `docs/UAT_RECORD_TEMPLATE.md` on real devices. Record the results in
`docs/uat/`. Until then classes are unproven in production.
