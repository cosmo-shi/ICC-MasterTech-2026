# SPEC: Music learning web app (hackathon prototype)

Cisco Live 2026 hackathon. Problem (do not reword): "How might we harness AI and emerging technologies to transform the way students learn and succeed"

Source of truth: the team's Miro requirements spec dated 7 Nov 2026. This file is the build list taken from it. IDs (FR-xxx, NFR-xxx) match the Miro spec, so say "build FR-PLY-03" and everyone knows what that means.

## 1. What we are building

A web app where students play digital versions of real instruments and learn note names, staff notation and rhythm. An AI coach asks the student what went wrong before it explains anything, so it builds their judgement instead of replacing it.

Prototype scope: front end only, no backend. Three instruments (keyboard, drums, guitar). One note-reading lesson and one rhythm lesson. AI coach with an offline fallback. Gamification toggle. Mock-up screens for teacher dashboard, community and wind instruments.

## 2. Decisions the team must confirm (defaults below are what Claude Code follows until changed)

| # | Question | Default used in this file | Why it needs a decision |
|---|----------|---------------------------|--------------------------|
| D1 | Instruments: Miro spec says keyboard, drums, guitar. Earlier chat notes said piano and drums only. | Three instruments, build in this order: keyboard, drums, guitar. Guitar is the first thing cut if time runs out. | Guitar needs its own samples and swipe-strum logic. |
| D2 | Drums: Miro spec says pads, earlier decision said a real drum kit picture. | Drum kit image with five touch areas (kick, snare, hi-hat, tom, crash). FR-ACC-03 (drag to rearrange pads) only applies if we use pads, so it is dropped when using the kit image. | The kit image and drag-to-rearrange do not work together. |
| D3 | Sound source: Miro spec allows Tone.js code-generated sounds or sample libraries. Earlier rule said all sounds come from public resources, not made by Claude. | Real sample files (CC0 or clearly licensed) played through Tone.js. Code-generated synth sounds only as a clearly labelled fallback if a sample is missing. | Code-generated sound could break the "not made by Claude" rule. |
| D4 | Stack: Miro constraint 1 says HTML, CSS and JavaScript in the browser. | Vite + React + TypeScript + Tailwind. It builds to plain HTML, CSS and JavaScript that runs in the browser, so constraint 1 holds. | If the team reads constraint 1 strictly, switch to plain JavaScript before Milestone 0. |
| D5 | Lesson unlocking: Miro says finishing a lesson unlocks the next (FR-LSN-08) but students can pick any unlocked lesson (FR-LSN-09). Earlier decision said theory-first but only advisory. | Follow the Miro spec. Theory units come first in the list. The first lesson of every unit is always unlocked. | Strict locking can frustrate students; keep it light. |
| D6 | AI coach: Miro says pre-written responses in the demo, or a server call. | Pre-written, rule-based coach in the demo. A live model call through a server function is an optional stretch only. | Pre-written removes the key-leak risk (NFR-SEC-02) and the demo-day network risk. |

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
12. Claude does not create audio files or artwork. Every asset goes in ASSETS.md with source, licence and attribution.
13. Lesson content and instrument layouts live in data files (JSON) separate from code (NFR-MNT-01, NFR-MNT-02, constraint 5).

## 4. Build list: every requirement marked P in the Miro spec

Priority letters: M must, S should, C could. Build all M first, then S.

### Onboarding (ONB)
- FR-ONB-01 (M) Play with no account; instrument reached in 3 taps or fewer.
- FR-ONB-02 (S) First launch asks for a goal: read notes, learn rhythm, or just play. The first suggested lesson matches.
- FR-ONB-03 (M) The goal question can be skipped; Skip opens instrument selection.
- FR-ONB-04 (M) Ask for an age band only (under 13, 13 to 17, 18 and over). Store nothing else about age.
- FR-ONB-05 (M) Age band changes settings. Community and sharing are hidden for under 13.

### Instrument selection (INS)
- FR-INS-01 (M) Instrument list with name, icon and a tap-to-hear sound preview.
- FR-INS-02 (M) Keyboard, drum kit and guitar all open and make sound.
- FR-INS-03 (M) Switching instruments never loses lesson progress.

### Instrument play (PLY)
- FR-PLY-01 (M) Each keyboard key plays the pitch printed on it.
- FR-PLY-02 (S) At least two octaves, scrollable; 24 or more keys reachable on a 360 px screen.
- FR-PLY-03 (M) Five drum sounds: kick, snare, hi-hat, tom, crash.
- FR-PLY-04 (M) Swiping across guitar strings plays a strummed chord, strings sounding in swipe direction.
- FR-PLY-05 (M) Four chord buttons: C, G, Am, F.
- FR-PLY-06 (S) Tapping a single string plays its pitch; six strings.
- FR-PLY-07 (M) Multitouch: three keys together sound as a chord; same for pads.
- FR-PLY-08 (S) Laptop keyboard letters play notes.
- FR-PLY-09 (M) Metronome from 40 to 160 BPM; click rate matches the tempo shown.
- FR-PLY-10 (S) Optional vibration on each metronome beat where supported. iPhones do not support it, so also build a flashing beat marker.
- FR-PLY-11 (M) Show or hide note names instantly.
- FR-PLY-12 (M) "Tap to start sound" prompt when the browser blocks audio; one tap unlocks all instruments.

### Adaptable controls (ACC)
- FR-ACC-01 (M) Key, pad and string size: small, medium, large.
- FR-ACC-02 (M) Simplified layout (one octave, or four drum pads) that can still finish the first lesson of each unit.
- FR-ACC-03 (S) Drag drum pads to rearrange, saved after reopening. See D2.
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
- FR-LSN-08 (S) Completing a lesson unlocks the next one. See D5.
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

### Gamification, opt-in (GAM)
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

## 5. Mock-up only (screens with sample data, nothing real behind them)

- Teacher dashboard (FR-TCH-01 to 05): class list, assign lessons, one-page lesson guide per lesson, hardest concepts first, no student ranking.
- Class join code (FR-ONB-06), class goal shown without leaderboards (FR-GAM-04), teacher switch for AI messages (FR-AIC-10).
- Community and mentor review (FR-COM-01), wind instruments tile labelled "Coming soon" and not openable (FR-INS-04).
- Privacy notice screen (FR-PRV-01).
- Label every mock screen "Demo data".

## 6. Not building (do not start these)

MIDI input, camera or hand-tracking play, latch mode, switch devices, language switching, layered recordings, account deletion and consent logs, curriculum code tags, export or delete progress file, unit transfer tips, wind instruments, several devices playing together, real accounts or login, real teacher or mentor backend.

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

- `src/data/instruments/<name>.json`: sound set paths and layout (keys, pads or strings).
- `src/data/lessons/<unit>-<n>.json`: goal sentence, target notes or rhythm pattern, success criteria, hint ladder text, pre-written coach questions by mistake type.
- `src/data/config.json`: timing tolerances per difficulty, help levels, age band settings.
- `src/data/coach/fallback.json`: pre-written questions and hints, keyed by mistake type (wrong note, early, late, missed, extra) and age band.
- Sample class, teacher and community data for the mock screens: `src/data/mock/`.

## 9. Folder layout

```
src/
  screens/      one file per screen
  components/   shared pieces (stave, rhythm grid, help ladder, coach panel)
  instruments/  keyboard, drums, guitar components (owner: instruments person)
  engine/       attempt logging, note and timing checking, metrics (plain TypeScript, tested)
  coach/        question-first loop, fallback picker
  data/         JSON files above
  settings/     accessibility and preference storage
public/
  audio/        downloaded sample files only
  images/       downloaded images only
ASSETS.md       every asset, source, licence, attribution
```

## 10. Milestones (one at a time; details in TEAM-GUIDE.md)

0. App shell, routing, "Tap to start sound", settings storage.
1. Onboarding (age band, goal, skip) and instrument list.
2. Audio engine and keyboard, with multitouch and metronome.
3. Drum kit.
4. Guitar (cut first if late).
5. Engine: attempt log, correct/incorrect, early/on time/late, tests.
6. Stave and rhythm grid, note-reading lesson, rhythm lesson, goal screens.
7. Hint ladder and results screen.
8. Coach: question-first loop with pre-written fallback, AI label, off switch, flag.
9. Accessibility: size, simplified layout, high contrast, colour-blind-safe notes.
10. Offline and PWA, offline indicator.
11. Create mode (record 60 s, save, play, delete) and opt-in gamification.
12. Mock screens (teacher, community, coming soon, privacy notice) and polish.

## 11. Done checklist (yes or no)

- [ ] Fresh install: no sign-up, instrument playable in 3 taps (ONB-01).
- [ ] All three instruments make sound; multitouch plays 3 notes at once.
- [ ] Note-reading lesson: matching key stays dark until Level 2 help (LSN-06).
- [ ] 2 deliberate wrong notes are reported as 2 incorrect (ASM-01).
- [ ] First coach message after an error is a question with no answer (AIC-01).
- [ ] Airplane mode on mid-lesson: lesson and hint still work, hint within 1 s (OFF-01, AIC-07).
- [ ] AI off: nothing sent anywhere (AIC-09).
- [ ] Large key size and simplified layout survive closing and reopening (ACC-01, ACC-02, ACC-08).
- [ ] High-contrast mode on every screen; no information by colour alone.
- [ ] Gamification off on a new install; no streaks or timers anywhere (GAM-01, GAM-03).
- [ ] Searching the built code finds no key strings (SEC-02).
- [ ] ASSETS.md lists every file in public/audio and public/images.
- [ ] Tested on the real demo phone or tablet.

## 12. Demo moments to protect

1. A judge misses a beat; the coach asks what was different before giving any answer.
2. Three instruments open from a web link with no sign-up and no cost.
3. Airplane mode goes on mid-lesson; the lesson and hints keep working.
