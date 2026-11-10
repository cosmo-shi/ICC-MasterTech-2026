# Carmen status (branch `sc`)

Last updated 10 November 2026. Plain facts only: what runs, how it was checked, and what is still missing.

## How it was checked

| Check | Command | Result |
| --- | --- | --- |
| Type check and production build | `npm run build` | Passes. The notation chunk (VexFlow with its music font) is about 720 KB and loads only when a score is shown. |
| Lint | `npm run lint` | 0 errors, 10 warnings (fast-refresh hints about helper exports beside components; dev-only). |
| Unit tests | `npm test` | 52 pass: checker, timing model, reply verification, notation layout, drum capture, learner model (estimates, next step, groups, plug-in fallback), Music words examples and links, route coverage. |
| Model training and held-out test | `npm run train` | Held-out synthetic set: model 95.3% vs fixed rules 89.9%, abstains on 1.2%. Written to `docs/model-metrics.json`. |
| Model in a real browser | Grown-ups → "Run the check" (Chromium, headless) | Same 95% / 90% on 600 held-out synthetic attempts; under 0.01 ms per answer. |
| Screens at 360 px and 1280 px | Playwright screenshots of Play, Learn, two lessons, a partner project, My music, Grown-ups | No console errors, no sideways scrolling after fixes. |
| Musical interaction | Playwright plays drum taps into "Find the pulse" and the Years 1–2 partner project | Taps are captured, checked note by note, the coach replies, the partner version is verified before it plays, the fresh independent task is recorded, and Grown-ups shows it as "independent" separately from "assisted". |
| Offline | Load once, switch the browser offline, reload | App, sounds and notation all work from the device cache. |
| Accessibility | axe-core 4.10 (WCAG 2.2 AA and best practice) on seven screens, normal and strong-contrast | One flag: the narrow tops of white piano keys between black keys. The lower part of each white key is about 49 × 100 px, and "Bigger keys" removes the flag. |
| Error states | Storage blocked; unknown activity or project link | Clear message and the app keeps working; a link back to Learn. |

Not checked yet: a real screen reader (NVDA, VoiceOver), real tablets and Chromebooks, audio latency on real devices, and any session with children or teachers.

## Working

- Sampled piano (VCSL, 10 pitches × 2 layers) and seven sampled drums, with Web Audio, damper release, a voice limit and a Stop button.
- Keyboard and drum pads by touch, mouse or computer keys; octave shift; simpler layout; bigger controls; note names; calm motion; strong contrast; volume.
- Ten lessons (L00 to L09) in practice and "on my own" modes, with count-in, notation, listen first, slower tempo, a three-step hint ladder and learner-chosen next steps.
- Deterministic checker for sound, timing, length and rests, with a clear fact for each note.
- Five pathways (Foundation, Years 1–2, 3–4, 5–6, older learners) as a content choice, never stored as age, each with a recommended route and its own partner project.
- Five partner projects: record an idea, choose the change (or let the partner suggest one), predict, hear a verified partner version, keep yours or theirs, then a fresh independent task with no hints.
- Coach: asks a question first, then gives one measured observation, and offers a checked musical reply. It never replies during an independent check.
- Grown-ups view: evidence per activity split into independent and assisted, attempt details, teacher notes, privacy controls, delete everything, the model card summary and the self-check.
- Saving is off by default; when on, records stay in this browser (IndexedDB). No accounts, no network calls (teacher sign-in is the only exception, when configured), no camera; the microphone only on request (10 November).
- Offline after the first visit (built app only).
- Design direction from `docs/carmen/UX_JOURNEY_AND_VISUAL_DIRECTION.md`: a sound check with tips when nothing is heard, "Sound paused" recovery, an original icon set for navigation and pathways, "Bring back my last take", "Carry on from last time", honest save-location wording, "More detail" notes (open by default for Years 5–6 and older), a quieter studio presentation for older learners, and a "Before a class" check with activity notes and preview links for teachers.
- Identity "Songbook Horizon" (2026-11-09, replaces Colour Bars): sunset landscape whose hills are stave lines, note-head sun, paper sheet for the work, instrument in a dark case; colour by role (sun = now, red = record, dusk = selected); Bagel Fat One for brand and titles, Figtree for the rest; one icon/illustration family; "what you played" note trail above the instrument; sticker tap-timeline feedback in lessons; optional Night mode (Day / Night / Same as device). Learner wording shortened; curriculum and class-talk notes in Grown-ups; learners see "Carmen · listened to your timing" only when the on-device model ran, otherwise "Carmen · tip". Checked with Playwright at 360 px and 1280 px in Day and Night (Play, drums, Learn, a lesson including feedback, a partner project, My music, Settings, Grown-ups): no console errors, no sideways scroll. Colour contrast checked by calculation for every text/background pair, not by an automated audit. Not checked: real devices, screen readers, audio latency, real multitouch.


## Added 9 November 2026 (connected app, tablet first)

Checked with Playwright on phone (390 px), tablet (820 px) and desktop (1280 px) in Day and Night, and axe-core on Play, Learn, Music words, a lesson, a lesson summary, Make it yours, My music and Grown-ups: no violations and no console errors after fixes. A glide test drags across the keys (C, D, E, F, G sound in turn and only one note is held at a time), and the key map test drags the keyboard from C4 to C5. Not checked: real touch screens, real multitouch, audio latency, screen readers.

- **Working: keyboard you can glide along.** The keyboard covers C2 to C7. A map above it shows where you are; drag or tap it to move smoothly, or use the octave buttons (kept). Sliding a finger across keys plays each one in turn. Computer-key letters start on the first C on screen.
- **Working: real drum kit.** A kit laid out as seen from the stool (cymbal, hi-hat, toms, snare, bass drum), with a taller arrangement on phones. The pads are still one tap away (and in Settings).
- **Working: Who's playing?** Local players (first name or nickname and a colour), no accounts or passwords. New work is tagged with the player; My music and "Last time" show only that player's work. "Just play" keeps nothing.
- **Working: learner model** (`src/ai/learner.ts`): per-skill Elo-style estimates from attempts, with hinted tries counting for less; "secure" needs an independent success; open tasks are never judged. `registerLearnerModel()` is the plug-in point for the live local model, with automatic fallback to the baseline.
- **Working: Learn as a pathway.** Five units with "you are here", note-head scores and "Up next" chosen by the learner model (practise again when a skill is stuck, otherwise the next skill not yet secure). "Start from" sets where you begin; every lesson stays open.
- **Working: lesson cycle and summary.** Hear it, Learn, Try, Listen back (plays your own take), Make it yours (opens Play with the lesson idea and saves to My music), then a summary: 0–3 note heads (had a go, matched with practice, matched a new one on your own), best try per fact, what went well, one thing to practise, next step.
- **Working: Music words.** 15 topics (beat, rhythm, tempo, metronome, note values, quavers, rests, bars, pitch, note names, stave, melody, dynamics, tone colour, form), each with notation and sound from the same event list. Draft wording.
- **Working: Grown-ups dashboard.** Grown-up check (a multiplication; not security). Class tab: who might like a hand (skill still starting after two tries) with a teacher move, children who could practise together, a skills grid with shape + word (never colour alone). Each child: skills, their music with playback, recent tries with help used, notes, rename/remove. Lessons, How the AI works, Device and privacy tabs keep the earlier content.
- **Working: Settings.** Who's playing, sound, metronome (on by default in Play, speed, 2 or 4 beats first), look, playing (incl. drum layout), saving.
- **Draft:** teacher moves per skill, unit order and Music words wording. **Future:** encrypted class export file; Web MIDI keyboards; the live learner model.
- **Known gaps:** on a portrait tablet the lesson task card pushes the instrument below the fold; the first key press before "Turn sound on" shifts the layout slightly.

## Changed 9 November 2026, later (feels like an app, not a website)

momo asked for a real sign-up, a teacher area that a child can't get into, no disclaimer lines, and lessons that work like a learning app rather than a long page.

- **Working: sign-up.** Full-screen steps with a progress bar and one button at the bottom: Welcome, name, colour, where to start (a content choice, not an age), then "Hi Mia!" and straight into the first lesson. Returning players see "Who's playing?". The player is created on the last tap.
- **Working: teacher sign-in.** "Grown-ups" is now "Teacher" at `#/teacher` (old `#/grownups` links redirect). No tab in the child's app; reached from "Teacher" on Who's playing or in Settings. A 4-digit PIN is set the first time (typed twice) and stored only as a salted SHA-256 hash in this browser; the space unlocks for the browser session and "Exit" locks it. This keeps children out on a shared tablet. It is not an online account and not strong security: anyone who can clear site data can reset it.
- **Working: lesson player.** Lessons take the whole screen: close (X), progress bar, one step per screen (Hear, Learn, Try, On your own), hint light at the top right, and a check sheet that slides up after each try (each sound, listen back, Carmen's tip, Try again or Continue). The score screen shows note-head stars, what went well, one thing to practise and the next lesson. Explore and "make a musical answer" lessons use the same frame.
- **Working: Learn path.** A winding path of big lesson circles with unit banners and a "Start" bubble on the next step; tapping a circle opens a small start sheet. Music words stays as the second tab.
- **Changed:** disclaimer lines removed from learner screens (sign-up, score, Music words, save drawer, My music). The honest note about saving stays only when saving is off. Privacy and data facts remain in the Teacher space.
- **Fixed:** the offline service worker served an old cached page, which is likely why the sign-up page didn't show on the preview. Pages now load network-first and the app reloads once when a new version takes over. Browsers that still hold the old worker may need one or two reloads.
- **Checked:** `npm test` (52 pass), `npm run build`, `npm run lint` (0 errors), axe-core on 11 routes plus welcome, picker, name, start, PIN, start sheet and check sheet in Day and Night at 390 px and 1280 px: no violations, no console errors. Playwright walked the whole flow at 390, 820 and 1280 px. Screen-by-screen flow map: https://claude.ai/artifact/SRswsA35znSGQ4TDmfonLe. Not checked: real devices, real touch, audio latency, screen readers.

## Changed 9 November 2026, evening ("Soft Light", tracks, Bayesian decisions)

- **Working: identity "Soft Light".** Palette sampled from momo's cat reference (coral #F89777, peach #F7C797, mist #D6D7C7, sky #67B8D6, periwinkle #7897D7, orchid #D798C7; the hex labels printed on the image do not match its colours). Tints and deep ink shades per role in `src/styles/tokens.css`, matching Night mode. One font, Nunito (OFL), with weight for roles (900 titles, 800 headings, 700 controls, 500 body); Bagel Fat One and Figtree removed. Each track has a hue, an icon and words; results use a shape (tick, half circle, open circle) and a word, never colour alone.
- **Working: four tracks.** Rhythm basics (shared: drums or piano), Piano, Drums, Create, in `src/data/curriculum.ts` with goals, prerequisites, instrument and controls, and separate musical level, reading demand and input demand (no ages). Starting points map to a track and step. Six new **draft** lessons: D01 bass drum and snare, D02 hi-hat time, D03 a fill, P01 C to G, P02 steps and skips, P03 bass clef.
- **Working: one idea, two instruments.** Rhythm basics lessons switch between drums and piano; on piano the exercise, instructions, hints, controls and score (treble clef, middle C) change with it.
- **Working: Learn.** A resume card (track, step x of n, what you'll learn, instrument, and the reason when it comes from evidence), track tabs, a node path per track with labels, and a start sheet with what you'll learn, which instrument and controls, music level, reading, prerequisites and what comes after.
- **Working: Bayesian Knowledge Tracing in the app** (ported from `carmen-b`: `src/ai/bkt.ts`, `tailor.ts`; decision layer `src/ai/learner.ts`). It chooses Up next and its reason, starts a lesson slower and/or with a lit "watch it" demonstration when recent tries on that lesson's skill failed, offers "go straight to on your own" when the skills look secure, and picks which fact the feedback names first. AI off, too little evidence or an invalid plan falls back to the route. A teammate's adapter for the old plug-in API (2425700) was merged and superseded by this direct port.
- **Working: feedback inside the activity.** After a try: a result shape and word, "With help / Practice / On your own", one observation from the checker facts, a short verified example to hear, each sound's fact, Hear yours vs Hear the music, and Slower / Hint / Watch it / Try again. Every try is saved separately, so the original is kept. AI subtitles and labels removed from learner screens.
- **Working: teacher review.** Per child: what they will see next and why (model, your choice, or route), a picker to choose it yourself, and per skill the band in words with a shape, number of tries split on their own vs practice/help, recent tries behind it, "too few tries to be sure", a teacher move, and an override (Use the model / Needs practice / Secure) that changes what the child is offered. No percentages.
- **Fixed: notation.** Sharps drawn; drums on their own percussion-stave lines with a key; bass clef for low phrases; held notes and notes across barlines tied; bars filled with rests; clef glyphs in the note trail. Tests in `src/music/notationKeys.test.ts`.
- **Checked:** `npm test` (127 pass), `npm run build`, `npm run lint` (0 errors). Playwright at 390 px and 1280 px in light and dark: welcome, who's playing, Learn, track tab, start sheet, lesson hear (with model suggestion), try with demo, feedback sheet, summary, Play, My music, teacher class and child. Not checked: real devices, real touch, audio latency, screen readers; axe not re-run on the new screens.
- **Known gaps:** on a phone the full drum kit pushes the bass drum below the fold during a lesson; the model's settings are fitted to simulated learners only; new lessons and teacher moves are drafts.

## Changed 9 November 2026, night (checks, making, and the model's decisions)

- **Working: checks for a recurring difficulty.** After two misses on the same skill (enough tries, latest one a miss), the feedback offers three checks, each looking at a different possibility: **Listen** (the learner's own take beside a verified version of it with one declared change, e.g. the rest taps taken out), **Read** (one question about the written music), **Play** (the same music slower with bigger controls). The learner picks one, another, or none. Each result suggests one support (hear it first, counting under the music, bigger controls, slower) that the learner can use or turn down. Then a fresh related pattern (rests moved, notes reordered). Checks are stored as `kind: 'check'` and never counted as evidence (`src/ai/checkin.ts`, `src/ui/CheckPanel.tsx`).
- **Working: verified versions of the learner's own music** (`src/music/versions.ts`): quiet rests, on the beat, written notes, written lengths. Each declares what it changed; `verifyVersion` checks that only declared things changed and the original is kept, before it plays.
- **Working: access during "on your own".** Bigger controls stay available in independent checks; slower, heard and counting supports reduce how much a try counts.
- **Working: Make your own** (`#/lesson/:id/make`, `src/music/maker.ts`). After an independent pass: one decision per beat using the lesson's idea (where the rests go, one or two sounds, which drum, which note, short or long), start from the lesson or from the learner's own last try, hear mine vs the lesson's, keep each version separately in My music, compare two versions with the changes in words.
- **Working: model decisions shown.** `npm run decisions` writes `docs/MODEL_DECISIONS.md` from a seeded test profile: try → evidence → inference → action, beside the rules baseline, and with the model off. Teacher → child shows the same trace for that child's real tries, plus the checks they chose.
- **Working: Learn.** Track tag, lesson title and step dots are separate (no "Drums · 1–5"). Switching tracks shows where to start there and why (or what to try first). Reasons say small counts in plain words.
- **Working: desktop.** Feedback opens as a side panel beside the score and instrument from 1100 px.
- **Fixed:** a tap just before a rest was named as the previous beat; notation captions unreadable at night.
- **Checked:** `npm test` (153 pass), build, lint (0 errors). Playwright at 390 and 1280 px, light and dark: Learn, track switch, feedback with checks, listen check and result, read check, play check, Make with two versions, summary, Play, My music, teacher class and child.
- **Not verified:** whether checks or supports help children; whether the model beats the rules for real learners (the seeded profile only illustrates states); check questions and supports are drafts pending a music educator; audio latency, real touch, screen readers.

## Changed 10 November 2026 (Use my instrument, iPhone touch, teacher accounts, Just play)

### Checks run on 10 November

| Check | Command | Result |
| --- | --- | --- |
| Type check, build | `npx tsc -b`, `npm run build` | Pass |
| Lint | `npm run lint` | 0 errors, 14 warnings (fast-refresh hints) |
| Unit tests | `npm test` | 200 pass. Two failed in one commit (efe85a5) and were fixed in the next (6984371) |
| Touch (emulated) | `node tools/e2e-touch.mjs` | 11/11 pass in Chromium with touch emulation: three-finger chord, lifting one finger, glide over white and black keys while holding, touchcancel, leaving the screen, mouse glide, two drums at once |
| Fake microphone | `node tools/e2e-listen.mjs` | 12/12 pass in dev and in the production build with its CSP; no network request leaves the device while listening |
| Teacher sign-in | `node tools/e2e-teacher.mjs` | Pass against a stand-in service: code requested with the public key only, wrong code explained, first-use name, space with join code, data calls carry the session, sign-out. Session refresh and its failure are unit-tested |
| Listening benchmark | `node tools/bench-listen/run.mjs` | See `docs/LISTENING.md`: 35/37 notes right and 2 unclear, 0 wrong, clean and with noise; taps 80/80 clean, 66/80 at 10 dB, 0 extra |
| Screens | Playwright, 12 screens each at phone 390 px (Day, Night), tablet, desktop 1280 px (Day, Night), short landscape, larger text | No console errors; landscape welcome fixed after the first run hid Just play |

**Not verified:** real iPhone and Android (touch, glide, latency, microphone, whether Safari honours echo cancellation being off, AudioWorklet timing on iOS); real rooms and acoustic pianos; real guitars (guitar listening stays hidden); a real Supabase project and its row-level security; screen readers; battery and CPU cost of listening. The phone checklist is `docs/UAT.md`.

### Working
- iPhone touch fix (1c5c0b0): each finger is tracked on its own, glide across keys, the audio clock no longer stalls after the page sleeps. Checked by emulation only.
- Just play first: welcome shows Just play, Start learning, I'm a teacher. No name needed; a name is optional when saving, with what is stored and where. A player can be removed from this device with all their music.
- Use my instrument (Play): on screen, MIDI or microphone; level meter; timing check (measures this device's delay); single-note pitch for piano, rhythm copy and free tapping; feedback; a separate Record that keeps audio only on this device; recordings in My music with Listen, Rename and Delete.
- Microphone rules: asked only after the button is pressed, visible Listening with Stop, stops when leaving, hiding the tab or rotating away; no cloud fallback; never used for training.
- Lessons: Play on my instrument (MIDI in every keyboard lesson, microphone taps in drum lessons after the timing check). Unclear takes and device-clock faults are said plainly, stored as unclear and carry no weight in the learner model.
- Feedback in three parts (what happened, why it matters, next step) with Hear the difference and Try slower; per-sound marks behind "Sound by sound"; "Slower was on" when the model chose it.
- Learn by instrument (Piano, Drums), then units, then steps; Carry on kept apart from Next on this instrument.
- Delete in My music has an 8-second Undo.
- Teacher accounts: Log in or Create account with a school email and a 6-digit code; refreshing session and sign-out; first-use name and teaching space (create, or join with a code). Permissions are enforced by row-level security in `supabase/migrations/`.
- App icons: favicon, Apple touch icon, PWA icons including maskable, manifest colours. The Band characters are gone.

### Blocked
- Teacher accounts need a Supabase project: see `docs/SERVICES.md`. Until then the teacher page says so and offers only the device PIN, labelled "Device only. Not a school account."

## Draft

- All lesson and project wording, sequencing and curriculum links. Not reviewed by a primary music teacher.
- Coach questions and observations (`src/data/coach.json`) and the "More detail" notes (`src/data/detail.ts`).
- Personas and journeys in the design brief are hypotheses; none has been tested with learners or teachers.
- Pathway differences beyond the recommended route, tempo, notation default and partner project. Not yet a full Foundation–Year 6 programme.
- The timing model is trained only on synthetic attempts. Agreement on made-up data shows the software works; it says nothing about learning.

## Blocked

- Teacher review of content: needs a primary music teacher.
- School teacher accounts: need the Supabase project, the migration and the allowed school email domains (`docs/SERVICES.md`).
- Physical phone sign-off: needs the `docs/UAT.md` run on a real iPhone and Android phone.

## Future

- Guitar listening, after checks with real guitars.
- Pitch listening in lessons (now only in Use my instrument), after real-room checks.
- Teacher evidence shared through the teaching space (today evidence stays on each device).
- Real-child timing data, collected with consent, to re-check the model.
- More lessons per band, and keyboard chords and drum fills for older learners.
- Export of teacher evidence (CSV or print).
- Screen reader and switch-access testing on real devices.
