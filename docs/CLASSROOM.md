# Classes across devices

How a teacher's class works when the teacher and the learners are on different devices. Schema and
rules: `supabase/migrations/20261110120000_classes_and_evidence.sql`. Client: `src/sync/`.
Screens: `src/screens/TeacherClasses.tsx` (teacher), `src/screens/MyClass.tsx` (learner).

Status: **built and verified locally** (real Postgres, stand-in sign-in and REST). **Not yet run on
a hosted Supabase project**; see "What is verified" below and `docs/SERVICES.md`.

## The workflow

1. **Teacher** logs in with a school email (one-time code), makes or joins a teaching space, makes
   a class and adds learners by first name or nickname.
2. For each learner the teacher presses **Get a code**. The 6-character code works once, for 14 days.
3. **Learner** opens Settings, **My class**, **Join my class**, and types the code. The device swaps
   it for a secret token for that learner's seat. Only work from then on is sent.
4. The teacher **assigns** an activity to the whole class or to chosen learners, with a preview
   link, optional supports that start on, and an optional line for learners.
5. The learner sees it under **From your teacher** in Learn and plays it. A summary of each try
   goes to the class when the device is online.
6. The teacher's **board** shows where each learner is. Pressing a name opens their **review**:
   change the next activity, switch supports on, correct Carmen's view of a skill, add a private note.
7. The learner's device picks the change up the next time it syncs: Learn says "Your teacher picked
   this for you", and the supports start on in that lesson. The learner can still turn help off.

## Roles and permissions (enforced by the database, not the app)

| Who | Can | Cannot |
|---|---|---|
| **Service owner** (whoever runs the Supabase project) | Add school email domains to `allowed_email_domains`; schedule the retention purge; see everything through the dashboard | n/a: this is the operator, bound by the school's agreement |
| **Space owner** (the brief's "school admin": the teacher who created the teaching space) | See every class in the space; see and change the join code; remove members; everything a teacher can | See another school's space |
| **Teacher** (joined the space with its code) | Make classes; see and change only classes they teach; add a co-teacher from the same space; assign; review; add notes; delete their own notes | See classes they don't teach; read the join code; read seat codes or tokens; edit or delete evidence |
| **Learner device** (holds a seat token) | Send its own learner's attempt summaries; read that learner's assignments and plan | Read anything else, including teacher notes, other learners or the roster |
| **Signed out / anyone with the public key** | Redeem a seat code; nothing else | Read any table; call any teacher function |

Verifying an email proves the address only. It gives no access to any class: access comes from
membership of a space and teaching a class.

There is one admin level today (space owner). A separate school-admin console (several spaces, bulk
rosters, audit log) is not built; see "Not built".

## What data each step uses

| Step | Data | Where it lives | Leaves the device? |
|---|---|---|---|
| Just play, lessons, free play (no class) | Attempts, pieces, optional recordings, a local player name | Learner's device only | No |
| Use my instrument | Live microphone or MIDI input; audio kept only on Record | Learner's device only | No, never |
| Teacher account | School email, display name, optional school name | Supabase Auth and `teachers` | Yes (teacher's own data) |
| Roster | Nickname typed by the teacher | `students` | Entered by the teacher on the service |
| Joining | 6-character code, then a random token (only its hash is stored on the service) | `seats`; token in the device's local storage | Code and token only |
| Evidence | Per attempt: activity, practice or on-your-own, counts (matched, missed, extra, in rests, early, on time, late), which help was on, whether input was unclear, input kind, the coach's focus, time | `evidence` | **Yes, once joined** |
| Teacher's plan | Next activity, supports, skill corrections, version | `support_plans` | Sent to the learner's device |
| Teacher notes | Free text by teachers | `teacher_notes` | Never sent to learner devices |

Never sent: audio or recordings, the notes or timings played, pieces the learner made, reflections
or anything typed by the learner, the local player name, device identifiers, location. The mapping
is one function (`src/sync/evidence.ts`, tested).

## Sync behaviour

- **Offline**: attempts stay in the device's store. The device retries after 5 s, 15 s, 60 s, then
  every 5 min, and straight away when the connection returns or Carmen is reopened.
- **Duplicates**: an attempt's id is its primary key on the service; sending it again does nothing.
  A learner cannot overwrite another learner's attempt (reported back as rejected).
- **Malformed attempts** are skipped and reported without losing the rest of the batch.
- **Conflicts**: the teacher's plan carries a version. A save states the version the teacher was
  looking at; if another teacher saved in between, nothing is written and the newer plan is shown
  with a message. The service is the one source of truth; the device keeps the last copy for offline.
- **Status on the learner's device** (Settings, My class): up to date, sending, N tries waiting,
  no connection, or "not linked any more" (the teacher made a new code).
- **Teacher session**: renews itself before it expires; one renewal at a time. If it can't renew,
  the Classes tab says "Log in again" rather than showing stale or empty data.
- The board refreshes every 20 s while open, and on Update.

## Statuses on the board

Worked out in `src/sync/status.ts` (tested) from synced evidence since the activity was assigned:

| Status | Rule | Meaning for the teacher |
|---|---|---|
| Not joined yet | No device linked | Give the learner their code |
| Waiting to sync | Linked, no tries, device not seen since you assigned | Work may be waiting on the device |
| Not started | Linked and seen, no tries | n/a |
| Practising | At least one try | n/a |
| Ready to move on | A pass on their own (hints hidden) | An independent check, not practice |
| May need support | Last three clear tries all without success | A prompt to look, not a judgement |
| Input problem | Two of the last three tries were unclear | Room, microphone or device. Never counted against the learner |

Thresholds are drafts pending educator review.

## Retention and removal

- Evidence older than 400 days is deleted by `purge_old_evidence()`. **It must be scheduled** on the
  hosted project (Supabase: Database, Cron, daily). Until then nothing is purged automatically.
- Removing a learner deletes their seat, evidence, plan and notes (cascade).
- Leaving a class on the device unlinks it; what was already sent stays with the teacher.
- A new code for a learner unlinks their old device.
- Deleting a teaching space deletes its classes and everything under them.

## What is verified, and how to run it

| Check | Command | Covers | Result (10 Nov 2026) |
|---|---|---|---|
| Database rules | `node tools/verify-db/run.mjs` | Migrations on real Postgres 16; 74 rules: signed-out, same space, other school, owner, devices with and without tokens, dedupe, conflicts, retention, removal | 74 pass |
| Two-device scenario | `node tools/e2e-classes.mjs` (see its header) | Teacher assigns on one browser profile, learner completes on another, teacher changes support, learner sees it after refresh; offline then back; session renewal; two teachers at once; leaving | see docs/STATUS.md |
| Unit | `npm test` | Evidence mapping, statuses, outbox, single renewal | pass |

The local run uses real Postgres with the same roles and claims PostgREST sets, behind a **stand-in**
for Supabase's sign-in and REST services (`tools/verify-db/server.mjs`). It is not a hosted project.

**Remaining dependency:** a hosted Supabase project with both migrations applied, email one-time
codes switched on, school domains added, the purge scheduled, and `VITE_SUPABASE_URL` and
`VITE_SUPABASE_ANON_KEY` set for the build. Then rerun `tools/e2e-classes.mjs` against it with real
inboxes, and the device checks in `docs/UAT.md`. Until someone does, treat classes as unproven in
production.

## Not built

- A school-admin console across several spaces, bulk roster import, and an audit log.
- Promoting a second owner from the app (the function refuses to let the only owner leave).
- Live push (the board polls every 20 s; it is not instant).
- Sending pieces or recordings to the teacher. Deliberately not built.
- Parent access.
