# Project rules for Claude Code

This is a three-person hackathon team sharing one Git repository. Each person runs their own Claude Code on their own laptop. Read this file and SPEC.md before every task.

## The project in two lines
A web app where students play keyboard, drums and guitar and learn note reading and rhythm. An AI coach asks the student a question before it explains anything.

## Read first
- SPEC.md has the build list, hard rules, data files and milestones. The requirement IDs (FR-xxx, NFR-xxx) match the team's Miro spec.
- If a request conflicts with SPEC.md, say so and ask before building.
- Section 2 of SPEC.md lists open team decisions (D1 to D6). Follow the defaults unless the person tells you a decision changed.

## Stack
Vite + React + TypeScript, Tailwind CSS, Tone.js for audio, Pointer Events for multitouch, Vitest for tests. Keep checking and scoring logic in plain TypeScript under src/engine/ so it can be tested without a browser.

## Working with a team
- Work only inside the folders the current person owns (the person tells you at the start). If a task needs a change in someone else's folder, stop and tell the person instead of editing it.
- Shared files (SPEC.md, CLAUDE.md, ASSETS.md, package.json, src/data/config.json) change only when the person asks, and in a commit of their own.
- Before starting: run `git pull`. Tell the person if there are conflicts, and do not resolve a conflict in someone else's file without showing them first.
- Work on a branch named after the milestone and person, for example `m2-keyboard-justin`. Never commit straight to `main`.
- Commit small and often with a plain message that says what changed. Never force-push.
- Do not reformat or rename files you were not asked to touch. Big formatting changes cause merge conflicts for the whole team.

## How to work
- One milestone at a time. Start in plan mode, show the plan, wait for approval, then build.
- When a milestone is done, stop and tell the person exactly what to test, on a laptop and on a phone.
- Explain changes in plain language for a beginner and list every file you touched.
- If something fails twice, stop and explain what you think is wrong instead of trying a third guess.
- When asked to change an existing file, say specifically which file and section you changed, so the person can update their copy instead of replacing the whole file.

## Hard rules (summary; full list in SPEC.md section 3)
- Never create audio files, drum or kit images, instrument artwork or song data. If an asset is missing, add a clearly named placeholder and tell the person exactly what to download and where to put it. Record every asset in ASSETS.md (source, licence, attribution).
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

## Commands
- `npm run dev` start the app (`npm run dev -- --host` to open it on a phone on the same Wi-Fi)
- `npm run build` production build
- `npm test` run the Vitest tests
- `git pull` before starting, `git push` after each working commit

## Skills (use only when asked, or at the milestone shown)
- impeccable and design-taste-frontend: screen design, from Milestone 0 and again in polish.
- hallmark: design review of a finished screen, final day only.
- design-extract: only if the team picks a reference site for colours and fonts.
- unslop: writing only. Run on coach text, onboarding text, README and pitch script, never on code. Keep the reading level at Year 3 and keep specific praise.
- When two skills disagree, accessibility wins, then SPEC.md, then style.

## Checking your own work
- Run `npm test` and `npm run build` before saying a milestone is done.
- If the Playwright tool is connected, open the app at phone width (360 px) and at 1920 px, take a screenshot and check the console for errors. Playwright cannot judge audio delay or real multitouch, so say so and ask the person to test on a real device.
- Search the built code for key strings before the demo (NFR-SEC-02).

## Names and words
- Say "student", "teacher", "coach", "lesson", "unit", "attempt". Do not invent new terms.
- The "AI coach" in the demo is rule-based with pre-written text. Do not describe it to the person as a live model unless a live call has been built and tested.
