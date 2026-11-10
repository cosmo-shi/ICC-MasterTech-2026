# SPEC: Carmen — music learning web app (branch `sc`)

Cisco Live 2026 hackathon. Problem (do not reword): "How might we harness AI and emerging technologies to transform the way students learn and succeed"

This is the `sc` branch spec. It replaces the Miro-derived SPEC on `main` for this branch only; the team merges later.
Product direction comes from `context-pack/MASTER_CONTEXT.md` (pack v2.0, 9 Nov 2026) plus momo's decisions below.
Detailed research stays in `context-pack/` (research, specs, references). This file is the build list.

## 1. What we are building

Carmen is a local-first, offline-capable music-learning web app for Australian children from Foundation to Year 6, especially those without instruments or specialist teaching, with suitable extensions for older learners. Children play sampled piano and percussion, learn pulse, rhythm, rests, pitch, note values and treble-stave reading, and make music they keep.

The AI loop: the learner plays a phrase; deterministic code measures it; a small on-device trained model describes the attempt pattern; that result selects a musical reply plan (for example a slower echo, a steady pulse part, a version with a rest); a verifier checks the reply makes only its declared change before it plays; the learner directs, rejects or revises, then tries a fresh independent check with hints hidden. Teacher Mode shows what was assisted and what was independent.

## 2. Decisions (momo, 9 Nov 2026) — these win over older notes

| Topic | Decision |
|---|---|
| Instruments | Keyboard (sampled grand piano) and drums (sampled percussion). Guitar and wind are not shown. |
| Coach | Live coach that also works offline. In real deployment it runs on the device for privacy. The prototype keeps a working on-device path; any optional online model would get only synthetic/de-identified data and no key in front-end code. None is built now. |
| Camera / microphone | Never requested. No gesture experiment (child safety). Notes come from taps and keys. |
| Teacher Mode | Real, local, on-device. Not a mock screen. |
| Pitch wording | "Built for Australian primary students without instruments or teachers". Do not say "first" or "only". |
| Branch | Work and commit on `sc` only. Never push to `main`. |

### Decisions (momo, 10 Nov 2026) — these win over the 9 Nov table where they differ

| Topic | Decision |
|---|---|
| Microphone | **Optional input** ("Use my instrument"): single notes on piano or keyboard, and tapped rhythms. Asked for only after the learner presses "Microphone", with the reason shown first. A visible Listening state with Stop; stops on leaving the screen, hiding the page or a phone call. Processed on the device; no cloud fallback; audio kept only when Record is pressed, saved only on the device, deletable, never used for training. Denied permission leaves the on-screen instrument and MIDI working. |
| Camera | Still never requested. |
| MIDI | Optional input for keyboards and electronic kits (Web MIDI, no system-exclusive access). Not available in Safari; the app says so. |
| Uncertain listening | Detection, comparison and teaching are separate. A take Carmen couldn't hear clearly, or one where the device clock was wrong, is said plainly and never counts as evidence (weight 0). Volume is not striking strength; which drum was hit is not judged; no chord or technique claims; guitar hidden until checked on real guitars. |
| Feedback | Three parts: what happened (observed), why it matters musically, one next step. "Hear the difference" and "Try slower" where they apply. Per-sound marks behind "Sound by sound". Provenance and uncertainty live in the Teacher area. |
| First screen | "Just play" first. No name, colour or level needed to make music. A name is optional when saving, with what is stored and where. |
| Learn | Instrument (Piano/Drums) → concept units → steps. "Carry on" (global) is kept apart from "Next on <instrument>". |
| Teacher accounts | "I'm a teacher" opens a welcome with Log in and Create account: school email, a one-time code, session refresh, sign-out, first-use name, create or join a teaching space. Server-enforced permissions (Supabase Auth + row-level security, `supabase/`). Only the public anon key is in the app. Verification is not authorisation: access needs space membership. If not configured, the app says it is blocked and offers only the device PIN, labelled device-only, with a reset. Learner play stays registration-free. No learner data or audio is uploaded. |
| Landscape | Supported, never forced. A dismissible portrait suggestion with the exact words "More room to play. Turn your phone sideways to make the keys wider and easier to reach. You can keep playing upright." |
| Illustrations | No people or Band characters. A restrained musical composition and one icon set; decorative icons aria-hidden; no emoji as assets. |

### Decisions from the improvement brief (momo, 10 Nov 2026, 08:14) — these win where they differ

| Topic | Decision |
|---|---|
| Icons | One licensed family (Lucide, ISC) through one `Icon` component with fixed sizes. This replaces the hand-drawn "one geometry" icon set. Brand art, notation and instruments are separate. |
| Feedback | One modal after each try: one observation, why it matters, one next step, one comparison, More help. Bottom sheet on phones, full screen in short landscape, centred dialog on desktop. This replaces the three-part card plus coach card, and the side panel. No "Carmen listened" or model badges for learners. |
| Advice | Built from the expected events. "Keep the spaces the same" only for evenly spaced phrases. In free play Carmen asks about intention. |
| Classes | A teacher's class can span devices: nickname roster, single-use learner codes, assignments, evidence summaries, a status board and a per-learner plan. Permissions are enforced in the database. **Pending momo:** whether learner evidence should sync at all (decision card, recommended yes with summaries only). Off wherever the service is not configured. |
| What leaves a device | Nothing, unless the learner joins a class with a code: then attempt summaries only (docs/CLASSROOM.md). Audio never. |
| Layout | `src/styles/system.css` owns hierarchy, spacing and dialogs; checked at 200% text and WCAG text spacing. |
| Release | docs/RELEASE_CHECKLIST.md, docs/UAT_RECORD_TEMPLATE.md, docs/OPERATIONS.md (owners unassigned), docs/PILOT.md, docs/CURRICULUM_MATRIX.md (generated). |

## 3. Contradictions resolved on this branch

| Topic | `main` SPEC (Miro) | Pack v2 | Used on `sc` | Why |
|---|---|---|---|---|
| Stack | Plain JS, no React/TS | Small TS web app | React + TypeScript + Vite (the existing scaffold) | The repo code is already React+TS; it builds to plain HTML/CSS/JS in the browser. |
| Age | Ask an age band | Collect no age | The learner picks a **music pathway** (F, 1–2, 3–4, 5–6, Older), changeable any time; it is a content choice, not age data | Privacy and "complexity is not an age gate". |
| Coach first message | Question first, no answer | One factual observation + strategy | A question first ("What did you notice about beat 3?"), then one measured fact and choices | Both rules satisfied. |
| Locking | Next lesson unlocks | No coercive locking | Recommended route; everything open | Pack and learner agency. |
| Mock screens | Teacher, community with "Demo data" | No fake screens | Real local Teacher Mode; no community screen | No fake functionality. |
| Targets | 44 px | 48 px (64 px large) | 48 px default, 64 px large | Stricter wins. |
| Sound | Tone.js or licensed samples | Authentic sampled | VCSL CC0 samples through Web Audio | Real instruments, no extra library. |
| Gesture | Not built | Optional experiment | Not built | momo: no camera. |
| Microphone | Not in the Miro SPEC | Optional | Optional input from 10 Nov (above) | momo's 10 Nov brief; camera rule unchanged. |
| Accounts | Not in the Miro SPEC | No accounts | Teacher accounts only, server-enforced; learners never sign up | momo's 10 Nov brief: a device PIN is not school authentication. |

## 4. Hard rules

1. No learner account or sign-up. A sound within 3 taps of opening ("Just play"). Teacher accounts are the only accounts.
2. Nothing the child does leaves the device. No analytics, no cloud AI, no external fonts/CDNs at runtime. The only network calls are a teacher's own sign-in and space calls, when configured.
3. No camera, ever. The microphone only on the learner's press, with a visible state and Stop; no recording without Record.
4. No streaks, timers, rankings, purchases, ads or generic praise. Badges are off by default.
5. AI output is a plan of approved IDs, never text from a model, never HTML, never a grade.
6. Every reply is verified before playback. Invalid replies fall back to reviewed rules, labelled as such.
7. Label honestly: "AI coach" only when the on-device model actually ran; "Coach tips" for rule fallback.
8. Creations are never scored. Assisted success is not shown as independent.
9. Lesson content is data (`src/data/`), not hard-coded in components.
10. Every asset is in ASSETS.md with source, licence, SHA-256.
11. All colours and sizes come from CSS custom properties in `src/styles/tokens.css`.
12. WCAG 2.2 AA target: keyboard access, visible focus, labels, reduced motion, text enlargement, no colour-only cues.

## 5. Build list (M = must, S = should, F = future)

- FR01 M Choose keyboard or drums. FR02 M Tap/key plays mapped sampled sound. FR03 M At least 4 simultaneous sounds. FR34 M Master stop and volume.
- FR04 M Control size (normal/large) and simplified layout. FR05 M Touch and computer-keyboard input.
- FR06 M Choose a goal; FR07 M free play with no score.
- FR08–FR11 M Lessons: concept, listen to example, notation, play. FR12 M Metronome 40–160 bpm.
- FR13–FR14 M Checker: match, wrong, missed, extra, early, late, rest violations; untimed pitch tasks have no timing penalty.
- FR15 M Replay/retry/compare. FR16 M Optional reflection with skip. FR21 M Hint ladder (question, clue, answer) — answer available on request.
- FR17 M On-device model inference drives the reply plan. FR38 M Verify replies; keep original work. FR27/28 M AI off switch; accurate labels.
- FR18–20 M Suggestion with evidence; learner can reject.
- FR22 M Independent check: new pattern, hints hidden.
- FR23–24 M Record as note events; name, save, replay, delete.
- FR25 M Local progress. FR30–31 S Opt-in badges (two independent successes).
- FR26 M Offline after first load (service worker). FR33 M Clear local data.
- FR35 M Teacher Mode: goal, attempts, AI contribution, support, independent evidence; local only.
- FR37 M Four primary pathways + Older extension, each meaningfully different.
- FR36 M Truthful recovery: audio blocked, storage unavailable, model failed.
- FR40 M Use my instrument: microphone (single notes, taps) and MIDI, in Play and lessons; timing check; separate Record; recordings listed with size and delete. FR41 M Unclear or device-fault takes never graded. FR42 M Teacher accounts with server permissions, or a plain blocked state.
- F Guitar (until checked on real guitars), wind, community, mentors, class sync of learner data, camera, cloud model, polyphonic transcription (Basic Pitch) for after-phrase review.

## 6. Data files

- `src/data/lessons.seed.json` — the ten foundation drafts (copied from the pack, CC BY-SA 4.0).
- `src/data/pathways.json` — the four band missions + Older extension (from `primary_suite.plan.json`, drafts).
- `src/data/coach.json` — reviewed coach templates keyed by fact type and model class.
- `src/ai/model.weights.json` — trained weights with model card `docs/MODEL_CARD.md`.
- `public/audio/` — VCSL samples listed in ASSETS.md.

## 7. Milestones

M0 model/runtime feasibility → M1 instrument–lesson–feedback–save → M2 AI reply + verifier + learner control → M3 all pathways and ten lessons → M4 Teacher Mode, offline, accessibility pass. Status lives in `docs/STATUS.md` (working / draft / blocked / future).

## 8. Commands

- `npm run dev` · `npm run build` · `npm test` · `npm run lint`
- `npm run train` retrains the model (seeded, reproducible) and rewrites weights + metrics.
