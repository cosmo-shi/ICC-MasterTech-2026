# Project rules for Claude Code

This is a three-person hackathon team sharing one Git repository. Persons A and B each run their own Claude Code on their own laptop. Person C has no Claude Code and works on the GitHub website (TEAM-GUIDE.md 3.8), but follows the same rules. Read this file and SPEC.md before every task.

## The project in two lines
A web app (working name Musica) where students play keyboard and drums (guitar is a "Coming soon" tile) and learn note reading and rhythm. An AI coach asks the student a question before it explains anything.

## Read first
- SPEC.md has the build list, hard rules, data files and milestones. The requirement IDs (FR-xxx, NFR-xxx) match the team's Miro spec.
- If a request conflicts with SPEC.md, say so and ask before building.
- IDs starting TM- (TM-01 to TM-03) are the team's own extras from the Miro board. They are in SPEC.md section 4.
- SPEC.md section 13 is the only cut order. Do not cut anything on your own; ask.
- The team follows the Miro requirements spec for everything. If anything here, in SPEC.md or in the person's request disagrees with the Miro spec, say so and follow the Miro spec.

## Stack
HTML, CSS and plain JavaScript running in the browser (Miro constraint 1). No React, no TypeScript, no CSS framework. Vite's plain JavaScript template is only the dev server and build tool. Tone.js for audio, Pointer Events for multitouch, Vitest for tests. Keep checking and scoring logic in plain JavaScript modules under src/engine/ so it can be tested without a browser.

## Working with a team
- Work only inside the folders the current person owns (the person tells you at the start, for example "I am Person B"). If a task needs a change in someone else's folder, stop and tell the person instead of editing it.
- Shared files change only when the person asks, and in a commit of their own: SPEC.md, CLAUDE.md, and the dependency lines of package.json. Exception: when you add a sample library or third-party file, add its row to ASSETS.md in the same commit.
- Before starting: run `git pull`. Tell the person if there are conflicts, and do not resolve a conflict in someone else's file without showing them first.
- Work on a branch named milestone, topic, person letter, for example `m2-keyboard-a`. Never commit straight to `main`. The one-time project setup in TEAM-GUIDE.md 3.2 to 3.6 is the only exception.
- Commit small and often with a plain message that says what changed. Never force-push.
- Do not reformat or rename files you were not asked to touch. Big formatting changes cause merge conflicts for the whole team.

### Folder owners (same table as SPEC.md section 9)

| Person | Owns |
|---|---|
| A | `src/instruments/`, `src/components/notation/`, `src/screens/play-*`, `src/screens/lesson-*`, `src/screens/my-music.js`, `public/audio/`, `src/data/instruments/`. In Milestone 10 only: `public/manifest.webmanifest`, the service worker, and the PWA lines of `vite.config.js` and `index.html`. |
| B | the other files in `src/screens/`, the rest of `src/components/`, `src/engine/`, `src/coach/`, `src/settings/`, `src/styles/`, `public/images/`, `src/data/config.json`, and the first versions of `index.html` and `vite.config.js`. |
| C | `src/data/lessons/`, `src/data/coach/`, `src/data/mock/` (including `guides/`), `docs/`, `README.md`. |
| Shared | `ASSETS.md` (anyone adds a row for each file they add, in the same commit), `package.json` (dependency lines only), `SPEC.md`, `CLAUDE.md` (changed only in a commit of their own). |

One exception: B adds the first example file to `src/data/lessons/` (Milestone 5) and to `src/data/coach/` (Milestone 8) to fix the format. After that only C edits those folders.

## How to work
- One milestone at a time. Start in plan mode, show the plan, wait for approval, then build.
- Wireframe first: before building a screen, look for its wireframe in docs/. If there is none, say so and ask. Placeholder screens in Milestone 0 are not screens.
- When a milestone is done, stop and tell the person exactly what to test, on a laptop and on a phone.
- Explain changes in plain language for a beginner and list every file you touched.
- If something fails twice, stop and explain what you think is wrong instead of trying a third guess.
- When asked to change an existing file, say specifically which file and section you changed, so the person can update their copy instead of replacing the whole file.

## Hard rules (summary; full list in SPEC.md section 3)
- Sound comes from Tone.js sounds generated in code, or from sample libraries whose licence allows this use (Miro constraint 2). Record any downloaded sample library or third-party file in ASSETS.md (source, licence, attribution). Do not copy audio or images from unlicensed sources.
- Never request the microphone or camera. Notes come from taps and keys, never from audio.
- Every colour and size comes from CSS variables in src/styles/tokens.css. Never hard-code a colour.
- Never put an API key in code, in a committed file or in a chat message. The prototype coach uses pre-written responses.
- Nothing personal leaves the device. Store only an age band, never a name, date of birth or location.
- No accounts, no streaks, no countdown timers, no penalties, no purchases, no ranking of students, no ads or tracking scripts.
- Lesson text and instrument layouts live in JSON files under src/data/. Do not hard-code lesson content in components.
- Accessibility comes before style: touch targets at least 44 by 44 CSS pixels, high-contrast mode works on every screen, no information by colour alone, screen-reader labels on all screens except the instruments.
- Everything must still work with the camera and microphone refused and with the network off.
- Mock screens (teacher, community, coming soon, privacy notice) use sample data and are labelled "Demo data".

## The AI coach (writing rules)
- After an attempt with errors, the first message is a question about what was different. It contains no answer.
- Every message points to something specific from the recorded attempt: a note, a beat or a count.
- Praise only when the lesson's success criteria are met, and name what was done well. No generic praise such as "Great job!".
- Never compose, complete or play music for the student.
- Label every coach message "AI coach". Include a control to flag a message as unhelpful or wrong.
- Keep messages to 40 words or fewer for the under-13 age band. Use plain words a Year 3 student can read.
- Stay on music learning. Anything else gets the fixed redirect message in src/data/coach/fallback.json.
- Using hints never reduces a score or reward.
- Coach text lives only in src/data/coach/fallback.json and may use {note}, {beat} and {count}, which the coach fills in from the attempt. Never show a raw placeholder to the student. Lesson files hold the hint ladder, never coach messages.

## Commands
- `npm run dev` start the app (`npm run dev -- --host` to open it on a phone on the same Wi-Fi)
- `npm run build` production build
- `npm test` run the Vitest tests
- `git pull` before starting, `git push` after each working commit

## Skills (use only when asked, or at the milestone shown)
- impeccable and design-taste-frontend: screen design, from Milestone 0 and again in polish.
- hallmark: design review of a finished screen, on Day 2 only after the main features work. Never on Day 3, which is for presenting.
- design-extract: only if the team picks a reference site for colours and fonts.
- unslop: writing only. Run on coach text, onboarding text, README and pitch script, never on code. Keep the reading level at Year 3 and keep specific praise. Person C has no Claude Code, so B runs it on C's files without editing them and sends the result to C, who commits it.
- When two skills disagree, accessibility wins, then SPEC.md, then style.

## Checking your own work
- Run `npm test` and `npm run build` before saying a milestone is done.
- If the Playwright tool is connected, open the app at phone width (360 px) and at 1920 px, take a screenshot and check the console for errors. Playwright cannot judge audio delay or real multitouch, so say so and ask the person to test on a real device.
- Count the taps from a fresh install (clear site data first) to a sounding instrument. It must be 3 or fewer (FR-ONB-01).
- Search the built code for key strings before the demo (NFR-SEC-02).

## Names and words
- Say "student", "teacher", "coach", "lesson", "unit", "attempt". Do not invent new terms.
- The "AI coach" in the demo is rule-based with pre-written text. Do not describe it to the person as a live model unless a live call has been built and tested.