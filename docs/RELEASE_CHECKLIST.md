# Carmen release checklist

Use this before a class, a pilot or a public link. A release is a commit on `main` that the team
agreed to merge; `sc` previews are not releases. Tick each line with initials and date, or write
why it does not apply. A line marked **blocker** stops the release if it fails.

Release: ____________  Commit: ____________  Date: ____________  Release owner: ____________

## 1. Automated checks (anyone, 10 minutes)

| # | Check | Command | Blocker |
|---|---|---|---|
| 1.1 | Unit tests pass | `npm test` | yes |
| 1.2 | Type check and build pass | `npm run build` | yes |
| 1.3 | Lint has no errors | `npm run lint` | yes |
| 1.4 | Touch flow | `node tools/e2e-touch.mjs` | yes |
| 1.5 | Listening flow with a fake microphone | `node tools/e2e-listen.mjs <piano.wav> <taps.wav>` | yes |
| 1.6 | Teacher sign-in flow (stand-in service) | `node tools/e2e-teacher.mjs` | yes |
| 1.7 | Database rules on real Postgres | `node tools/verify-db/run.mjs` | yes, if classes are on |
| 1.8 | Two-device class scenario | `node tools/e2e-classes.mjs` | yes, if classes are on |
| 1.9 | Model numbers regenerated, not hand-edited | `npm run train`, then `git diff docs/model-metrics.json` | yes |
| 1.10 | Curriculum matrix matches the content | part of `npm test` | yes |
| 1.11 | Listening benchmark has not regressed | `node tools/bench-listen/run.mjs` | no; record the numbers |

## 2. Screens (designer or developer, 20 minutes)

| # | Check | Blocker |
|---|---|---|
| 2.1 | Screenshots at 360 px and 1280 px, Day and Night: Play, Learn, a lesson with feedback open, Use my instrument, My music, Teacher | yes |
| 2.2 | Short landscape (844 × 390): feedback is full screen, nothing covered | yes |
| 2.3 | Browser text at 200% and WCAG text spacing: no clipped or hidden words, no sideways scroll | yes |
| 2.4 | No console errors on any of the above | yes |
| 2.5 | Every icon comes from `src/ui/icons.tsx`; no emoji or text symbols as icons | no |
| 2.6 | Keyboard only: reach and operate every control; focus is always visible; feedback dialog traps and returns focus | yes |

## 3. Real devices (see docs/UAT.md and the record template)

| # | Check | Blocker |
|---|---|---|
| 3.1 | iPhone Safari: UAT sections 1, 2, 3, 5 | yes |
| 3.2 | Android Chrome: UAT sections 1, 2, 3, 4, 5 | yes |
| 3.3 | An iPad or Chromebook as used in the school | yes for a school pilot |
| 3.4 | Screen reader pass (VoiceOver or TalkBack) on Play, one lesson, feedback | yes for a school pilot |
| 3.5 | Two real devices on school Wi-Fi: class scenario from docs/CLASSROOM.md | yes, if classes are on |

A desktop browser emulating a phone does not count for section 3.

## 4. Privacy and safety (privacy owner)

| # | Check | Blocker |
|---|---|---|
| 4.1 | No camera use anywhere; microphone only after the learner presses it; Listening state shows Stop | yes |
| 4.2 | Network panel during a lesson with no class joined: no requests leave the device | yes |
| 4.3 | Network panel with a class joined: only `device_sync` calls; payload matches docs/CLASSROOM.md; no audio | yes |
| 4.4 | No service keys or secrets in the built files (`grep -r service_role dist/` is empty) | yes |
| 4.5 | Allowed school email domains are correct on the hosted project | yes, if accounts are on |
| 4.6 | Retention purge is scheduled on the hosted project and ran in the last 48 h | yes, if classes are on |
| 4.7 | The school's privacy notice and consent process cover what docs/CLASSROOM.md says is stored | yes for a school pilot |

## 5. Content and claims (education owner)

| # | Check | Blocker |
|---|---|---|
| 5.1 | docs/CURRICULUM_MATRIX.md statuses are true; nothing says reviewed without a named reviewer | yes |
| 5.2 | No claim of effectiveness, certification, educator approval or "first/only" in the app, README or pitch | yes |
| 5.3 | Teacher area says lessons are drafts | yes |
| 5.4 | ASSETS.md lists every audio, font and icon file with source, licence and SHA-256 | yes |

## 6. Service (operations owner; only if accounts or classes are on)

| # | Check | Blocker |
|---|---|---|
| 6.1 | Both migrations applied to the hosted project, in order | yes |
| 6.2 | `node tools/verify-db/run.mjs` passed on the same migration files | yes |
| 6.3 | Email one-time codes arrive within a minute at a real school inbox | yes |
| 6.4 | A non-school email is refused | yes |
| 6.5 | Backups are on; someone has restored one once | yes for a school pilot |
| 6.6 | Rate limits on sign-in are on (Supabase Auth settings) | yes |

## 7. Sign-off

| Role | Name | Date | Go / No-go |
|---|---|---|---|
| Release owner | | | |
| Privacy owner | | | |
| Education owner | | | |
| Operations owner | | | |

Known limits to state with every release: see "Blocked" and "Not checked" in docs/STATUS.md.
