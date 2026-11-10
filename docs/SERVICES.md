# Carmen services

Carmen runs entirely in the browser. The only outside service is **teacher sign-in**, and it is
optional. Learners never sign in, and no learner data or audio leaves the device.

## Status

| Service | Needed for | Status |
|---|---|---|
| Supabase (Auth + Postgres with row-level security) | Teacher accounts and teaching spaces | **Blocked: not configured.** Code, SQL and tests are done; it needs a project and two env vars |
| Vercel | Hosting the preview and the live app | Working (team master-tech-2026) |
| Anything else (analytics, fonts, CDNs, cloud audio) | Nothing | Not used, on purpose |

Until Supabase is configured, "I'm a teacher" says school accounts aren't switched on and offers only
the device PIN, labelled "Device only. Not a school account." It never pretends an account exists.

## Setting up teacher accounts

1. **Create a Supabase project** (Sydney region, `ap-southeast-2`, keeps data in Australia).
2. **Run the SQL.** In the SQL editor, run `supabase/migrations/20261110000000_teacher_spaces.sql`
   (or `supabase db push` with the CLI). It creates `teachers`, `teaching_spaces`, `space_members`
   and `allowed_email_domains`, turns on row-level security, and adds the functions `my_spaces`,
   `create_space` and `join_space`.
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

Verifying an email proves the person controls that address. It does not prove they teach a class;
that is what the join code is for.

## How it was checked

- Unit tests: `src/auth/teacherAuth.test.ts` (blocked when unconfigured, code request, verify,
  refresh, refresh failure, sign-out, friendly errors).
- `node tools/e2e-teacher.mjs` runs the whole page against a stand-in service on `localhost`.
- **Not checked:** a real Supabase project, real emails, and the row-level security policies on a
  live database. Do this before any school uses it: make two teacher accounts and confirm neither
  can see the other's space without the code.
