# UAT record (copy this file for each run)

Save as `docs/uat/YYYY-MM-DD-<device>-<initials>.md`. One file per device per run. Steps and
expected results are in `docs/UAT.md` (devices) and `docs/CLASSROOM.md` (classes). Write what
happened, not what should have happened. "Not tried" is a valid result; a blank is not.

## Run

| | |
|---|---|
| Date and time | |
| Tester (name, role) | |
| Commit or preview link | |
| Device model | |
| OS and version | |
| Browser and version | |
| Opened from | browser tab / home-screen icon |
| Network | school Wi-Fi / home Wi-Fi / mobile data / offline |
| Audio out | speaker / wired headphones / Bluetooth |
| Input used | touch / mouse / computer keys / microphone / MIDI (model: ____) |
| Room | quiet / classroom noise / very noisy |
| With learners? | no / yes: how many, year levels (no names) |

## Results

Result is one of: Pass, Fail, Not tried, Not applicable.

| Step (from UAT.md) | Result | What happened (if not Pass) | Evidence (photo, screen recording, bug id) |
|---|---|---|---|
| 1.1 | | | |
| 1.2 | | | |
| … | | | |

## Measurements

| Measure | Value |
|---|---|
| Check timing, first run (ms) | |
| Check timing, second run (ms) | |
| Time from tap to sound, by ear | none noticed / slight / distracting |
| Time from assigning to it appearing on the learner's device (s) | |
| Time from finishing a try to it appearing on the teacher's board (s) | |

## Class scenario (only if classes are on)

| Step | Result | Notes |
|---|---|---|
| Teacher logs in with a school email on device A | | |
| Teacher makes a class, adds a learner, gets a code | | |
| Learner joins on device B with the code | | |
| Teacher assigns an activity; it appears on B | | |
| Learner completes it; A's board shows it | | |
| Teacher changes next activity and a support; B shows it after reopening | | |
| B in airplane mode: a try is kept; it sends when back online | | |
| Close and reopen both browsers: still signed in and joined | | |
| Leave class on B; A shows no device | | |

## Problems found

| # | What you did | What you expected | What happened | How often | Severity (blocks class / annoying / cosmetic) |
|---|---|---|---|---|---|
| | | | | | |

## Not verified in this run

List anything you could not check and why (no MIDI keyboard, no second device, no screen reader).

## Verdict

Ready for this device: yes / no / with these limits: ______

Signed: ____________
