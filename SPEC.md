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

## 4. Hard rules

1. No account or sign-up. A sound within 3 taps of opening.
2. Nothing the child does leaves the device. No analytics, no cloud AI, no external fonts/CDNs at runtime.
3. No microphone or camera requests.
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
- F Guitar, wind, community, mentors, class sync, camera, cloud model.

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
