# Carmen operations: who owns what

Carmen runs entirely on the learner's device unless a school switches on teacher accounts and
classes. This page names the jobs that need an owner once it does. **Every owner below is
unassigned today**: the team needs to name a person for each before a school pilot. An unassigned
job is a release blocker in `docs/RELEASE_CHECKLIST.md`.

## Owners

| Job | What they do | How often | Owner | Backup |
|---|---|---|---|---|
| Release owner | Runs the release checklist; decides go or no-go; merges `sc` to `main` when the team agrees | Each release | unassigned | unassigned |
| Operations owner | Owns the Supabase project: migrations, backups, sign-in settings, rate limits, the retention schedule, uptime | Weekly look; each release | unassigned | unassigned |
| Privacy owner | Owns what data is kept and why; answers access and deletion requests; checks consent and the school's privacy notice; reviews any change to `src/sync/evidence.ts` | Each release; on request | unassigned | unassigned |
| Education owner | Owns lesson content, feedback wording and the curriculum matrix; finds and works with the reviewing primary music educator | Each content change | unassigned | unassigned |
| School contact | The school's named person: adds teachers, holds the space's join code, removes staff who leave | Each term | named by the school | named by the school |
| Support contact | Where teachers send problems; triages to the owners above | During a pilot: daily | unassigned | unassigned |

## Routine jobs

| Job | Steps | Owner |
|---|---|---|
| Add a school | Add its email domain to `allowed_email_domains` (SQL editor). The first teacher creates the teaching space and becomes its owner | Operations |
| Staff member leaves | Space owner removes them (they lose every class in the space at once). If the owner leaves, make a new owner first | School contact |
| Join code leaked | Space owner: change the join code (`rotate_join_code`). Existing members are unaffected | School contact |
| Learner's device lost or shared | Teacher presses New code for that learner: the old device stops syncing | Teacher |
| Learner leaves the class | Teacher removes them: evidence, plan and notes are deleted | Teacher |
| Deletion request for a learner | Remove the learner from the class (deletes server data). On the device: Settings, Remove player | Privacy, with the teacher |
| Retention | `select public.purge_old_evidence();` daily (Supabase Cron). Check monthly that it ran | Operations |
| Backup and restore | Supabase daily backups on; restore one to a scratch project once a term | Operations |
| New migration | Add a file in `supabase/migrations`; run `node tools/verify-db/run.mjs`; apply to a staging project; then production | Operations |
| Retrain the timing model | `npm run train`; commit the regenerated metrics; never from children's recordings | Education with a developer |

## Incidents

| Kind | First hour | Then |
|---|---|---|
| Data seen by the wrong person | Operations: pause the project's API (Supabase settings). Privacy: write down what, who, when | Tell the school contact the same day. Follow the school's and the regulator's notification rules. Fix, add a test to `tools/verify-db/run.mjs`, then unpause |
| Service down | Tell teachers: Carmen still works on each device; class sync waits and catches up | Operations restores; no learner work is lost (it is on the devices) |
| Wrong or harmful feedback wording | Education: record the sentence and lesson. Developer: fix or switch the lesson off | Add a test in `src/teach` |
| Sign-in emails not arriving | Operations checks Supabase Auth logs and the email provider | Teachers can keep using the device-only PIN view meanwhile; it shows that device's work only |

## What needs no operations

Play, lessons, free play, Use my instrument, recordings and the device-only teacher view use no
service. They keep working with the service off, and nothing from them leaves the device.
