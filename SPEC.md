# SPEC: Mūsica, a music learning web app (hackathon prototype)

Cisco Live 2026 hackathon. Problem (do not reword): "How might we harness AI and emerging technologies to transform the way students learn and succeed"

Working name: Musica (from the Miro board, where the name is still open; Mūsica is the Latin word for music).

Source of truth: the team's Miro requirements spec dated 7 Nov 2026. This file is the build list taken from it. IDs (FR-xxx, NFR-xxx) match the Miro spec, so say "build FR-PLY-03" and everyone knows what that means.

## 1. What we are building

A web app where students play digital versions of real instruments and learn note names, staff notation and rhythm. An AI coach asks the student what went wrong before it explains anything, so it builds their judgement instead of replacing it.

Prototype scope: front end only, no backend. Two playable instruments (keyboard and drums); guitar is a "Coming soon" tile. One note-reading lesson and one rhythm lesson. AI coach with an offline fallback. Gamification toggle (secondary, cut early). Mock-up screens for teacher dashboard, community and wind instruments.

## 2. Decisions settled: the Miro spec wins

The team follows the Miro requirements spec for everything. Any earlier chat note that disagrees with it is dropped.

| Topic                 | What we follow (Miro reference)                                                                                                                                                                                                                                                           |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Instruments           | Keyboard and drum kit are playable. Guitar is a "Coming soon" tile that cannot be opened, listed with the wind instruments (team decision, 9 Nov 2026). This departs from Miro FR-INS-02 and FR-PLY-04 to 06, and the team accepted that.                                                 |
| Drums                 | Drum pads: kick, snare, hi-hat, tom, crash (FR-PLY-03). Pads can be rearranged by drag and drop and keep their positions after reopening (FR-ACC-03). The simplified layout has four pads (FR-ACC-02).                                                                                    |
| Sound                 | Tone.js sounds generated in code, or sample libraries whose licence allows this use (constraint 2).                                                                                                                                                                                       |
| Stack                 | HTML, CSS and JavaScript running in the browser (constraint 1). Plain JavaScript: no React, no TypeScript, no CSS framework. Vite's plain JavaScript template is used only as the dev server and build tool.                                                                              |
| Lessons               | Units in the Miro order (FR-LSN-01). Completing a lesson unlocks the next one in its unit (FR-LSN-08). The first lesson of a unit starts available. Any unlocked lesson can be chosen and completed lessons replayed (FR-LSN-09).                                                         |
| AI coach              | Pre-written responses in the demo, or a call through a server so no key sits in front-end code (constraint 4, NFR-SEC-02). The prototype uses pre-written responses only. No server call is built. Adding one later is a change to this spec first, so the Backend line below stays true. |
| Backend               | None. Classes, teachers, mentors and community content use sample data (constraint 3).                                                                                                                                                                                                    |
| Taps to first sound   | Tap 1: age band (this tap also unlocks audio). Tap 2: goal, or Skip. Tap 3: pick an instrument. A returning student opens on the instrument list. "Tap to start sound" is only a fallback banner when the browser still blocks audio (FR-ONB-01, 03, FR-PLY-12).                          |
| Microphone and camera | Not used. Notes come from taps and keys, never from audio, so no permission prompt appears (FR-PRV-03, 04). The reason screen (FR-PRV-02) is still built and reachable from Settings.                                                                                                     |
| Coach text            | One place: `src/data/coach/fallback.json`, with {note}, {beat} and {count} placeholders (FR-AIC-02, 07). Lesson files hold the goal, concept sentence, pattern and three hint levels, never coach messages.                                                                             |
| Team board extras     | TM-01 to TM-03 are the team's own lines from the Miro board (section 4). They are cut first (section 13).                                                                                                                                                                                 |
| Cut order             | One list only: section 13. Other files point here.                                                                                                                                                                                                                                        |
| Folder owners         | Section 9 is the master copy. CLAUDE.md and TEAM-GUIDE.md repeat it word for word.                                                                                                                                                                                                        |

## 3. Hard rules (apply to every task)

1. No account or sign-up to play. First playable instrument in 3 taps or fewer (FR-ONB-01).
2. The coach asks a question first and gives no answer in that first message (FR-AIC-01).
3. Praise only when the attempt meets the lesson's success criteria, and it names the specific thing done well (FR-AIC-03, NFR-AIS-05). No generic praise.
4. The AI never composes, completes or performs music for the student (FR-AIC-13). Create mode has no AI generation control.
5. Every AI message carries a visible "AI coach" label (FR-AIC-08). A switch turns AI messages off; with it off nothing is sent anywhere (FR-AIC-09).
6. Nothing personal leaves the device. Only de-identified results could ever go to an AI service (FR-AIC-11, FR-ASM-07).
7. No API keys anywhere in front-end code (NFR-SEC-02).
8. No daily streaks, countdown timers, penalties or purchasable rewards. Gamification is off by default (FR-GAM-01, FR-GAM-03).
9. Everything works with microphone and camera refused or missing (FR-PRV-03, NFR-AVL-03).
10. No ranking or comparing students (FR-TCH-05).
11. No advertising or tracking scripts (NFR-PRI-05).
12. Sound comes from Tone.js generated in code, or from sample libraries whose licence allows this use (constraint 2). Record any downloaded sample library or third-party file in ASSETS.md with source, licence and attribution.
13. Lesson content and instrument layouts live in data files (JSON) separate from code (NFR-MNT-01, NFR-MNT-02, constraint 5).
14. The app never requests the microphone or camera in the prototype. No permission prompt appears anywhere (FR-PRV-03, FR-PRV-04).
15. Every colour and size comes from CSS variables in `src/styles/tokens.css`. Nothing is hard-coded, so high-contrast mode changes every screen, instruments included (FR-ACC-04).

## 4. Build list: every requirement marked P in the Miro spec

Priority letters: M must, S should, C could. T marks the team's own board extras. Build in milestone order (section 10). If time runs short, follow the single cut order in section 13.

### Onboarding (ONB)

- FR-ONB-01 (M) Play with no account; instrument reached in 3 taps or fewer.
- FR-ONB-02 (S) First launch asks for a goal: read notes, learn rhythm, or just play. The first suggested lesson matches.
- FR-ONB-03 (M) The goal question can be skipped; Skip opens instrument selection.
- FR-ONB-04 (M) Ask for an age band only (under 13, 13 to 17, 18 and over). Store nothing else about age.
- FR-ONB-05 (M) Age band changes settings. Community and sharing are hidden for under 13.

### Instrument selection (INS)

- FR-INS-01 (M) Instrument list with name, icon and a tap-to-hear sound preview.
- FR-INS-02 (M) Keyboard and drum kit open and make sound. (Miro also lists guitar; the team moved it to Coming soon.)
- FR-INS-03 (M) Switching instruments never loses lesson progress.

### Instrument play (PLY)

- FR-PLY-01 (M) Each keyboard key plays the pitch printed on it.
- FR-PLY-02 (S) At least two octaves, scrollable; 24 or more keys reachable on a 360 px screen.
- FR-PLY-03 (M) Five drum sounds: kick, snare, hi-hat, tom, crash.
- FR-PLY-07 (M) Multitouch: three keys together sound as a chord; same for pads.
- FR-PLY-08 (S) Laptop keyboard letters play notes.
- FR-PLY-09 (M) Metronome from 40 to 160 BPM; click rate matches the tempo shown.
- FR-PLY-10 (S) Optional vibration on each metronome beat where supported. iPhones do not support it, so also build a flashing beat marker.
- FR-PLY-11 (M) Show or hide note names instantly.
- FR-PLY-12 (M) "Tap to start sound" prompt when the browser blocks audio; one tap unlocks all instruments.

### Adaptable controls (ACC)

- FR-ACC-01 (M) Key and pad size: small, medium, large.
- FR-ACC-02 (M) Simplified layout (one octave, or four drum pads) that can still finish the first lesson of each unit.
- FR-ACC-03 (S) Drag drum pads to rearrange; new positions remain after the app is reopened.
- FR-ACC-04 (M) High-contrast mode meeting NFR-ACC-01.
- FR-ACC-05 (S) Colour-blind-safe note colours, always shown with note names.
- FR-ACC-08 (M) Control preferences saved on the device and applied next launch.

### Lessons (LSN)

- FR-LSN-01 (M) Units: pulse and rhythm, note names, reading the treble stave, reading rhythm notation, simple melodies and chords. The prototype needs at least one note-reading lesson and one rhythm lesson.
- FR-LSN-02 (M) One-sentence lesson goal before every lesson.
- FR-LSN-03 (M) Target notes drawn on a five-line stave with a treble clef.
- FR-LSN-04 (M) Exactly one target note highlighted; highlight advances after each attempt.
- FR-LSN-05 (M) Played note appears on the stave beside the target (within 100 ms, NFR-PER-03).
- FR-LSN-06 (M) The matching key stays hidden by default. It lights only after the student asks for Level 2 or 3 help.
- FR-LSN-07 (M) Rhythm lesson: tap a pattern shown in rhythm notation with the metronome running; pattern, beat marker and metronome stay in time.
- FR-LSN-08 (S) Completing a lesson changes the next lesson in the unit from locked to available.
- FR-LSN-09 (M) Any unlocked lesson can be chosen; completed lessons can be replayed.

### Performance checking (ASM)

- FR-ASM-01 (M) Each note marked correct or incorrect. A test sequence with 2 deliberate wrong notes reports 2 incorrect.
- FR-ASM-02 (M) Each note classed early, on time or late against the target beat.
- FR-ASM-03 (S) Timing tolerance set by difficulty level; beginner wider than intermediate; values stored in one config file.
- FR-ASM-04 (M) Each attempt stored as a list of notes and timings and can be replayed exactly.
- FR-ASM-05 (M) Compare button plays the attempt, then the target.
- FR-ASM-06 (S) Attempt and target shown side by side with mismatches marked.
- FR-ASM-07 (M) Attempt data stays on the device. Nothing leaves it in the prototype.

### AI coach (AIC)

- FR-AIC-01 (M) After an attempt with errors, the first coach message is a question about what was different and contains no answer.
- FR-AIC-02 (M) Every message refers to at least one specific note, beat or count from the attempt.
- FR-AIC-03 (M) Praise only when the success threshold is met, naming the specific thing done well.
- FR-AIC-04 (S) Student answers by multiple choice or typed text.
- FR-AIC-05 (S) Coach says whether the answer matches the recorded result and quotes the evidence, for example "beats 3 and 4 were early".
- FR-AIC-06 (S) Suggests the next activity from the goal and recent results; the student can dismiss it and pick another.
- FR-AIC-07 (M) Pre-written questions and hints, matched to the type of mistake, when offline or the AI does not respond. Answer within 1 second offline (NFR-PER-04).
- FR-AIC-08 (M) "AI coach" label on every AI message.
- FR-AIC-09 (M) Student can switch AI messages off; lessons then show results and pre-written hints only.
- FR-AIC-11 (M) Only de-identified results go to any AI service: no names, audio or images.
- FR-AIC-12 (S) Flag button on every AI message that records the flag.
- FR-AIC-13 (M) No AI composing or performing for the student.

### Hint ladder (HNT)

- FR-HNT-01 (M) Help control in every lesson with three levels: a guiding question, a clue, the answer.
- FR-HNT-02 (M) Level 1 shows first; the student requests each higher level. Level 3 cannot be reached without passing Levels 1 and 2.
- FR-HNT-03 (S) Highest help level per lesson is recorded and shown in the progress view.
- FR-HNT-04 (S) Using help never lowers scores or rewards.

### Results and progress (PRG)

- FR-PRG-01 (M) After each attempt show counts: notes correct out of total; beats early, on time, late.
- FR-PRG-02 (M) Unit progress as lessons completed out of total.
- FR-PRG-03 (S) Last 5 attempts per lesson listed with results.
- FR-PRG-04 (M) Progress saved on the device and kept after closing.

### Create mode (CMP)

- FR-CMP-01 (M) Free play on every instrument with no goal or results screen.
- FR-CMP-02 (M) Record up to 60 seconds; recording stops automatically.
- FR-CMP-03 (M) Play back, name and save recordings on the device ("My Music").
- FR-CMP-04 (M) Delete own recordings.

### Gamification, opt-in (GAM) (secondary: built last, cut before create mode)

- FR-GAM-01 (M) Off by default; switch on in Settings.
- FR-GAM-02 (M) Badges for mastering a concept, not time spent. Each tied to a success criterion, for example "Reads every line of the treble stave".
- FR-GAM-03 (M) No streaks, timers, penalties or purchases anywhere.
- FR-GAM-05 (S) Earned badges are kept when gamification is switched off.

### Offline (OFF)

- FR-OFF-01 (M) Instruments, free play, downloaded lessons and pre-written hints all work with no internet after first load.
- FR-OFF-02 (S) Can be saved to the home screen and open without a browser address bar (PWA).
- FR-OFF-03 (S) Lesson units can be downloaded for offline use.
- FR-OFF-04 (S) Online or offline indicator that updates within 5 seconds.

### Privacy (PRV)

- FR-PRV-02 (M) Reason screen before any microphone or camera permission prompt.
- FR-PRV-03 (M) Everything works if permissions are refused.
- FR-PRV-04 (M) No raw camera video or microphone audio is stored.

### Team board extras (TM), from the Miro board

These come from the team's own requirement lines on the board, not from the numbered spec. They sit on top of the P rows and are cut first (section 13).

- TM-01 (T) The student can hear the target note or pattern before an attempt and replay it whenever needed ("hear the target note or pattern before attempting ... and replay the example"). A Listen button on the lesson screen plays the target in the instrument's own sound. This is not Compare (FR-ASM-05), which plays the attempt and then the target.
- TM-02 (T) Each lesson shows one sentence on how the concept relates to the sounds and instruments used ("explain how the musical concept ... relates to the sounds and instruments"). It sits on the lesson goal screen under the goal sentence. It is lesson text, not a coach message, so FR-AIC-01 (question first) is not affected.
- TM-03 (T) The rhythm lesson teaches note durations and a rest: the pattern has at least two different note lengths and at least one rest ("note duration and rests"; "break it down to syllables"). The rhythm grid draws the rest symbol. The Level 2 clue (FR-HNT-01) shows the counting syllables for the pattern, such as "1 and 2 and". A rest expects no tap, and a tap on a rest is marked as extra (FR-ASM-01).

### Build notes

- Audio: call `Tone.start()` inside the age band tap and inside the fallback banner tap. The audio module must not start it a second time if the context is already running.
- Progress is stored by lesson, not by instrument, so switching instruments never loses it (FR-INS-03).
- The Units screen lists units and lessons as locked, available or completed. The first lesson of each unit starts available (FR-LSN-01, 08, 09, FR-PRG-02).
- A rest in a rhythm pattern is a target with no tap. Checking, replay and the stave all treat it that way (TM-03).
- Metronome: also build a flashing beat marker, because iPhones do not vibrate (FR-PLY-10).

## 5. Mock-up only (screens with sample data, nothing real behind them)

- Teacher dashboard (FR-TCH-01 to 05): class list, assign lessons, one-page lesson guide per lesson, hardest concepts first, no student ranking.
- Class join code (FR-ONB-06), class goal shown without leaderboards (FR-GAM-04), teacher switch for AI messages (FR-AIC-10).
- Community and mentor review (FR-COM-01), guitar and wind instruments as tiles labelled "Coming soon" and not openable (FR-INS-04).
- Privacy notice screen (FR-PRV-01). The reason screen (FR-PRV-02) is built for real in Milestone 1 and is never cut.
- Label every mock screen "Demo data".

## 6. Not building (do not start these)

MIDI input, camera or hand-tracking play, latch mode, switch devices, language switching, layered recordings, account deletion and consent logs, curriculum code tags, export or delete progress file, unit transfer tips, wind instruments, several devices playing together, real accounts or login, guitar play (FR-PLY-04, 05, 06; guitar is a Coming soon tile), real teacher or mentor backend, a live AI call or server function (the coach is pre-written).

## 7. Performance and quality targets

- Sound within 50 ms of a tap; never above 100 ms (NFR-PER-01).
- First playable instrument within 5 s on first visit over 4G, 2 s on later visits (NFR-PER-02).
- Stave updates within 100 ms (NFR-PER-03). Coach reply within 3 s online, pre-written hint within 1 s offline (NFR-PER-04).
- Note timestamps within 10 ms of the metronome clock (NFR-PER-05).
- Offline package at most 50 MB (NFR-AVL-02). Works at 360 px to 1920 px wide, portrait and landscape (NFR-PLT-02).
- Touch targets at least 44 by 44 CSS pixels at default size (NFR-ACC-02). WCAG 2.2 AA (NFR-ACC-01). No information by colour alone (NFR-ACC-04). Lesson text readable by a Year 3 student (NFR-ACC-05).
- Coach messages to under-13s are 40 words or fewer (NFR-AIS-04). Coach stays on music topics and gives a fixed redirect otherwise (NFR-AIS-01).
- Every privacy setting defaults to the most protective option (NFR-PRI-02). Collect only age band; no name, no location (NFR-PRI-03).
- Progress saved after every attempt (NFR-REL-01). If the AI fails, switch to pre-written hints with no error shown (NFR-REL-02).
- Adding a fourth instrument needs only a sound set and a layout file (NFR-MNT-01). A lesson is added by adding one file (NFR-MNT-02).

## 8. Data files (code reads these, nobody hard-codes them)

- `src/data/instruments/<name>.json`: sound settings and layout (keys or pads). Owner A.
- `src/data/lessons/<unit>-<n>.json`: goal sentence (FR-LSN-02), one concept sentence (TM-02), target notes or rhythm pattern with rests allowed (TM-03), success criteria, and the hint ladder with three levels (FR-HNT-01). In the rhythm lesson the Level 2 clue shows counting syllables (TM-03). No coach messages in these files. The number `<n>` sets the order, and the first lesson of a unit starts available. Owner C.
- `src/data/config.json`: timing tolerances per difficulty, help levels, age band settings. Owner B.
- `src/data/coach/fallback.json`: the only home of coach questions, hints after an attempt, praise and the fixed redirect. Keyed by mistake type (wrong note, early, late, missed, extra) and age band. Text may use {note}, {beat} and {count}, which the coach fills in from the attempt (FR-AIC-02). Owner C.
- `src/data/mock/`: sample class, teacher and community data for the mock screens, with one-page lesson guides in `src/data/mock/guides/` (FR-TCH-03). Owner C.

The hint ladder (the student asks for help, from the lesson file) and the coach messages (shown after an attempt, from fallback.json) are different things and live in different files.

## 9. Folder layout and owners

```
src/
  screens/        one file per screen (names below)
  components/     shared pieces (notation/ for stave and rhythm grid, help ladder, coach panel, audio banner)
  instruments/    keyboard, drums, audio module, metronome, recorder
  engine/         attempt logging, checking, metrics, progress, data-file tests (plain JavaScript, tested)
  coach/          question-first loop, fallback picker
  data/           JSON files from section 8
  settings/       accessibility and preference storage
  styles/         tokens.css and the rest of the plain CSS
public/
  audio/          sample files only, if any are used
  images/         third-party images only, if any are used
docs/             wireframes, user flow, design brief, test checklist
ASSETS.md         every sample library or third-party file, with source, licence, attribution
```

Screen files: `onboarding.js`, `instrument-list.js`, `play-instrument.js`, `units.js`, `lesson-goal.js`, `lesson-play.js`, `results.js`, `my-music.js`, `settings.js`, `teacher.js`, `community.js`, `privacy.js`, `credits.js`.

**Folder owners (master copy)**

| Person | Owns                                                                                                                                                                                                                                                                                                                    |
| ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| A      | `src/instruments/`, `src/components/notation/`, `src/screens/play-*`, `src/screens/lesson-*`, `src/screens/my-music.js`, `public/audio/`, `src/data/instruments/`. In Milestone 10 only: `public/manifest.webmanifest`, the service worker, and the PWA lines of `vite.config.js` and `index.html`. |
| B      | the other files in `src/screens/`, the rest of `src/components/`, `src/engine/`, `src/coach/`, `src/settings/`, `src/styles/`, `public/images/`, `src/data/config.json`, and the first versions of `index.html` and `vite.config.js`.                                                               |
| C      | `src/data/lessons/`, `src/data/coach/`, `src/data/mock/` (including `guides/`), `docs/`, `README.md`.                                                                                                                                                                                                       |
| Shared | `ASSETS.md` (anyone adds a row for each file they add, in the same commit), `package.json` (dependency lines only), `SPEC.md`, `CLAUDE.md` (changed only in a commit of their own).                                                                                                                             |

One exception: B adds the first example file to `src/data/lessons/` in Milestone 5 and to `src/data/coach/` in Milestone 8, to fix the format. After that only C edits those folders.

## 10. Milestones (one at a time; details and prompts in TEAM-GUIDE.md)

Miro section 6.5 gives the order of work: strike every requirement not marked P, finish personas and user stories, sketch the flow and one wireframe per screen, build one screen per prompt using the user story and acceptance test as the prompt, test each P requirement against its acceptance criterion, then script the pitch from the traceability matrix. A screen is built only after its wireframe is in `docs/`.

Twelve milestones to build: 0 to 12, with 4 not used (guitar became a Coming soon tile). Owner in brackets. Every P row appears at least once.

0. (B) App shell, hash routing with one placeholder per screen, tokens.css, settings storage, audio fallback banner. FR-ACC-08, FR-PLY-12, FR-PRV-03, FR-PRV-04 (no audio or video is ever stored).
1. (B) Onboarding in three taps, instrument list with "Coming soon" tiles for guitar and the wind instruments, privacy reason screen. FR-ONB-01 to 05, FR-INS-01, FR-PRV-02.
2. (A) Audio module and keyboard, multitouch, metronome with flashing marker. FR-PLY-01, 02, 07, 08, 09, 10, 11, FR-INS-02.
3. (A) Drum pads, five sounds, multitouch. FR-PLY-03, 07, FR-INS-02.
4. Not used. Guitar is a "Coming soon" tile, built in Milestone 1. The number is kept so the other milestone numbers stay the same everywhere.
5. (B) Engine: attempt log, correct or incorrect, early, on time or late, rests, replay, Vitest tests, lesson file format. FR-ASM-01 to 04, 07, TM-03 (engine side).
6. (A; lesson text by C) Stave, rhythm grid with rests, lesson goal and lesson screens, Listen and replay, concept sentence. FR-LSN-02 to 07, TM-01, TM-02, TM-03 (display side).
7. (B) Hint ladder, results screen, Units screen with locking, progress. FR-HNT-01 to 04, FR-PRG-01 to 04, FR-ASM-05, 06, FR-LSN-01, 08, 09, FR-INS-03.
8. (B; text by C) Coach: question-first loop, pre-written fallback with placeholders, AI label, off switch, flag. FR-AIC-01 to 09, 11, 12, 13.
9. (A and B) Accessibility. A: sizes, simplified layout, drag-to-rearrange pads, colour-blind-safe notes (FR-ACC-01, 02, 03, 05). B: high contrast, saved preferences, Lighthouse (FR-ACC-04, 08).
10. (A) Offline and PWA, offline indicator. FR-OFF-01 to 04.
11. (A and B, if time allows) A: create mode, record 60 s, save, play, delete (FR-CMP-01 to 04). B: opt-in gamification (FR-GAM-01, 02, 03, 05), secondary, built last and cut before create mode.
12. (B; content by C, if time allows) Mock screens (teacher, community, class code, privacy notice, credits) and the polish pass. FR-TCH-01 to 05, FR-ONB-06, FR-GAM-04, FR-AIC-10, FR-COM-01, FR-PRV-01, FR-INS-04.

## 11. Done checklist (yes or no)

- [ ] Fresh install: no sign-up, instrument playable in 3 taps, counted by hand after clearing site data (ONB-01).
- [ ] The app never asks for the microphone or camera (PRV-03, PRV-04).
- [ ] Keyboard and drums make sound; multitouch plays 3 notes at once; guitar shows as Coming soon and cannot be opened.
- [ ] Note-reading lesson: matching key stays dark until Level 2 help (LSN-06).
- [ ] Listen plays the target before an attempt and can be replayed (TM-01).
- [ ] Each lesson shows its concept sentence (TM-02).
- [ ] The rhythm lesson has at least two note lengths and a rest; the Level 2 clue shows counting syllables; a tap on a rest is marked extra (TM-03).
- [ ] 2 deliberate wrong notes are reported as 2 incorrect (ASM-01).
- [ ] First coach message after an error is a question with no answer (AIC-01).
- [ ] No coach message shows a raw {note}, {beat} or {count} (AIC-02).
- [ ] Completing a lesson unlocks the next one in its unit; progress survives switching instruments and closing the app (LSN-08, INS-03, PRG-04).
- [ ] Airplane mode on mid-lesson: lesson and hint still work, hint within 1 s (OFF-01, AIC-07).
- [ ] AI off: nothing sent anywhere (AIC-09).
- [ ] Large key size and simplified layout survive closing and reopening (ACC-01, ACC-02, ACC-08).
- [ ] Rearranged drum pads stay where the student put them after reopening (ACC-03).
- [ ] High-contrast mode on every screen; no information by colour alone.
- [ ] If gamification was built: off on a new install; no streaks or timers anywhere (GAM-01, GAM-03).
- [ ] Searching the built code finds no key strings (SEC-02).
- [ ] ASSETS.md lists every sample library or third-party file used, with its licence (constraint 2).
- [ ] Every mock screen is labelled "Demo data".
- [ ] Tested on the real demo phone or tablet.

Strike any line whose feature was cut under section 13, and say so in the pitch.

## 12. Demo moments to protect

1. A judge misses a beat; the coach asks what was different before giving any answer.
2. Two instruments (keyboard and drums) open from a web link with no sign-up and no cost; guitar shows as Coming soon.
3. Airplane mode goes on mid-lesson; the lesson and hints keep working.

## 13. Cut order (the only one; other files point here)

If time runs short, cut in this order, top first:

1. TM-01, TM-02, TM-03.
2. Should rows that are not in the traceability matrix: FR-PLY-08, FR-PLY-10, FR-ASM-06, FR-AIC-04, FR-AIC-05, FR-AIC-06, FR-PRG-03, FR-GAM-05, FR-LSN-08, FR-OFF-02, FR-OFF-03, FR-OFF-04.
3. Gamification (Milestone 11, Person B's part). It is secondary. These are Miro "must" rows, so say openly in the pitch that they were cut.
4. Create mode (Milestone 11, Person A's part). Also Miro "must" rows; say so openly.
5. Mock screens (Milestone 12), except the teacher lesson guides (FR-TCH-03).

Never cut: the question-first coach, the hint ladder, the offline fallback, adaptable control sizes, the checking engine, and the privacy reason screen (FR-PRV-02).
