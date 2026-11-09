# Carmen status (branch `sc`)

Last updated 9 November 2026. Plain facts only: what runs, how it was checked, and what is still missing.

## How it was checked

| Check | Command | Result |
| --- | --- | --- |
| Type check and production build | `npm run build` | Passes. The notation chunk (VexFlow with its music font) is about 720 KB and loads only when a score is shown. |
| Lint | `npm run lint` | 0 errors, 8 warnings (fast-refresh hints about helper exports beside components; dev-only). |
| Unit tests | `npm test` | 39 pass: checker, timing model, reply verification, notation layout, drum capture. |
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
- Songbook on "Make a sound": type a song name (small typos are fine) to see the first two bars as notation, hear it and light its keys. Eight traditional, public-domain tunes in `src/data/songs.json`; unknown songs get an honest "not in the songbook yet" and the list. Nothing is generated. Checked with tests and Playwright at 360 and 1280 px.
- Deterministic checker (v1.1.0) for sound, timing, length and rests, with a clear fact for each note. Drum lessons that use more than one drum check which drum was hit; drums are drawn on a five-line drum stave with a key.
- On-device learner model (`carmen-learner-bkt` v1.0.0, Bayesian Knowledge Tracing per skill): suggests the next activity (after a pass, always a different one from the lesson list), start tips and the coach's first question from this device's attempts. Suggestions only; validated plans with a route fallback; "Learning picture" in Grown-ups. Checked by unit tests and a seeded simulation (`npm run eval:learner`, `docs/LEARNER_MODEL_CARD.md`): settings fitted to simulated learners (`npm run fit:learner`); on a separate simulated group it picks the weakest skill 55.3% of the time vs 35.5% for the fixed route. Checked in the browser with Playwright only, not with learners.
- Five pathways (Foundation, Years 1–2, 3–4, 5–6, older learners) as a content choice, never stored as age, each with a recommended route and its own partner project.
- Five partner projects: record an idea, choose the change (or let the partner suggest one), predict, hear a verified partner version, keep yours or theirs, then a fresh independent task with no hints.
- Coach: asks a question first, then gives one measured observation, and offers a checked musical reply. It never replies during an independent check.
- Grown-ups view: evidence per activity split into independent and assisted, attempt details, teacher notes, privacy controls, delete everything, the model card summary and the self-check.
- Saving is off by default; when on, records stay in this browser (IndexedDB). No accounts, no network calls, no microphone or camera.
- Offline after the first visit (built app only).
- Design direction from `docs/carmen/UX_JOURNEY_AND_VISUAL_DIRECTION.md`: a sound check with tips when nothing is heard, "Sound paused" recovery, an original icon set for navigation and pathways, "Bring back my last take", "Carry on from last time", honest save-location wording, "More detail" notes (open by default for Years 5–6 and older), a quieter studio presentation for older learners, and a "Before a class" check with activity notes and preview links for teachers.
- Identity "Songbook Horizon" (2026-11-09, replaces Colour Bars): sunset landscape whose hills are stave lines, note-head sun, paper sheet for the work, instrument in a dark case; colour by role (sun = now, red = record, dusk = selected); Bagel Fat One for brand and titles, Figtree for the rest; one icon/illustration family; "what you played" note trail above the instrument; sticker tap-timeline feedback in lessons; optional Night mode (Day / Night / Same as device). Learner wording shortened; curriculum and class-talk notes in Grown-ups; learners see "Carmen · listened to your timing" only when the on-device model ran, otherwise "Carmen · tip". Checked with Playwright at 360 px and 1280 px in Day and Night (Play, drums, Learn, a lesson including feedback, a partner project, My music, Settings, Grown-ups): no console errors, no sideways scroll. Colour contrast checked by calculation for every text/background pair, not by an automated audit. Not checked: real devices, screen readers, audio latency, real multitouch.

## Draft

- Skill map, learner model settings and "why" wording (`src/data/skills.json`). Settings fitted to simulated learners only, not to children.

- All lesson and project wording, sequencing and curriculum links. Not reviewed by a primary music teacher.
- Coach questions and observations (`src/data/coach.json`) and the "More detail" notes (`src/data/detail.ts`).
- Personas and journeys in the design brief are hypotheses; none has been tested with learners or teachers.
- Pathway differences beyond the recommended route, tempo, notation default and partner project. Not yet a full Foundation–Year 6 programme.
- The timing model is trained only on synthetic attempts. Agreement on made-up data shows the software works; it says nothing about learning.

## Blocked

- Teacher review of content: needs a primary music teacher.

## Future

- Fit the learner model's settings to real, consented practice data, and check whether its suggestions help, with educators.

- Device latency calibration (so "late" is not the device).
- Real-child timing data, collected with consent, to re-check the model.
- More lessons per band, and keyboard chords and drum fills for older learners.
- Export of teacher evidence (CSV or print).
- Screen reader and switch-access testing on real devices.
