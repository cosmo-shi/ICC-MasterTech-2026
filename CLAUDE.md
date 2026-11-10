# Carmen — project rules for Claude Code (branch `sc`)

This CLAUDE.md is for the `sc` branch only. Do not copy it to `main`; the team merges later.
Read `SPEC.md` (build list, decisions, resolved contradictions) before every task.
Product direction: `context-pack/MASTER_CONTEXT.md` (pack v2.0). Read the relevant section, not the whole pack, each time.
UX, navigation, visual components and recovery states: also read `docs/carmen/UX_JOURNEY_AND_VISUAL_DIRECTION.md` (journeys, personas and Sound Workshop identity; personas and journeys are hypotheses, not research findings).
AI work: also read `context-pack/specs/AI_MUSIC_INTERACTION.md` and `docs/MODEL_CARD.md`.
Research and references stay in `context-pack/` and `docs/RESEARCH_REFERENCES.md`; do not paste research into code or this file.

## Git
- Commit only to `sc`. Never push to, merge into or open PRs against `main` unless momo says so.
- Small commits with plain messages. Never force-push. Do not reformat files you were not asked to touch.

## Stack and commands
React 19 + TypeScript + Vite. Web Audio directly (no Tone.js). IndexedDB for saves. Vitest for tests.
- `npm run dev` · `npm run build` · `npm test` · `npm run lint` · `npm run train` (retrain model, seeded)
Pure logic (music, checker, ai, verifier) lives in plain TS under `src/music`, `src/engine`, `src/ai` and has tests. Node can run these files directly (type stripping), so keep them free of enums/namespaces.

## Product boundaries
- Foundation to Year 6 with an Older extension. Pathway choice is a content choice, never stored as age.
- Keyboard (sampled piano) and drums (sampled percussion) only. No guitar/wind tiles. Guitar listening stays hidden until checked with real guitars.
- No camera, ever. Microphone only as optional input ("Use my instrument", momo 10 Nov): asked for after the learner presses it, visible Listening state with Stop, stops on leave/hide, on-device only, no cloud fallback, audio kept only on Record and only on the device, never used for training. See `docs/LISTENING.md`.
- No learner accounts. Teacher accounts only (Supabase Auth + RLS in `supabase/`, env `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`; see `docs/SERVICES.md`); if unconfigured, show it as blocked, never simulate. The PIN is device-only and must be labelled so. No service keys or secrets in the frontend.
- No analytics, no learner data or audio uploaded, no external fonts or CDNs at runtime.
- No streaks, timers, rankings, ads, purchases, generic praise. Badges off by default.
- Teacher Mode is real and local. No mock or "demo data" screens.

## AI honesty
- The on-device model is a small MLP trained on seeded synthetic attempts. It describes timing patterns; it does not diagnose, read emotion or judge creativity.
- The model picks from approved plan IDs only. The verifier checks every reply before it plays.
- Learners see "Carmen listened" (or "heard your timing") only when the model actually ran; otherwise "A tip". No AI badges. Grown-ups shows the full provenance ("AI coach" vs "Coach tips").
- Never claim educational effectiveness, curriculum certification, educator approval or "first/only".
- Report metrics from `docs/MODEL_CARD.md`; regenerate them with `npm run train`, never hand-edit numbers.

## Listening and feedback
- Keep capture, estimate + reliability, comparison, learner-model update and teaching words separate (`src/input`, `src/listen`, `src/ai/bkt.ts`).
- Unclear detection or a wrong device clock: say so, store `input.unclear`, weight 0. Never criticise or lower mastery for it.
- Volume is not striking strength; which drum was hit is not judged; no chord or technique claims. Free creation is described, not marked.
- Feedback: what happened (observed), why it matters musically, one next step. No compressed metadata or repeated AI subtitles for learners.

## Music correctness
- Canonical events: integer ticks, 480 per crotchet; middle C = C4 = MIDI 60; A4 = 440 Hz.
- One event list drives sound, notation, checking and replay. Rests are silent spans, not inputs.
- Pitch, onset and duration are separate facts. Untimed pitch tasks get no timing penalty.
- Australian terms: crotchet, quaver, minim, practise (verb).

## Design ("Soft Light", momo 2026-11-09 evening: cat-swatch palette; replaces Songbook Horizon colours and fonts)
- Palette from the sampled cat swatches (coral, peach, mist, sky, periwinkle, orchid), with tints and deep ink shades; same roles in Night mode. Softness from tinted paper, round shapes and gentle depth, not blurred gradients; no cat mascot. The header keeps the sunset-and-stave scene.
- Colour has roles (tokens in `src/styles/tokens.css`): sky/hills = environment only; paper/ink = reading and playing; sun (coral) = "now" (main action, pressed key, current beat); record = recording only; dusk (periwinkle) = where you are; good/near/miss = feedback, always with words and a shape; track hues: Rhythm basics coral, Piano periwinkle, Drums sky, Create orchid.
- Type: Nunito only (self-hosted, OFL). Roles by weight: 900 wordmark/titles/big feedback, 800 headings, 700 controls, 500 body.
- Shape/space/elevation: 4-pt spacing (`--s1`…`--s7`), radii 10/16/28. Only playable things (keys, pads, Record) have a physical edge. Group by space and hairlines, not boxes, outlines or heavy shadows. The instrument sits in a dark case, centred, and is the biggest thing on Play.
- Brand mark: note-head sun over two curved stave lines (`Logo`, `Wordmark`, `public/favicon.svg`, PNG icons from `tools/make-icons.mjs`). No people or Band characters (removed 10 Nov). Icons, the mark, the `Horizon` scene and `WelcomeArt` share one geometry: 24 grid, 2-unit round strokes, the tilted note head as the one filled motif. Keep familiar action icons (play, undo, stop, gear).
- Phone: bottom tabs Play / Learn / My music, settings (incl. Day/Night/Same as device) behind the gear; short landscape uses a side rail. Landscape is suggested, never forced (exact text in SPEC.md). Desktop ≥900 px: sidebar on the landscape, Teacher after a divider.
- First screen: "Just play", "Start learning", "I'm a teacher". No name needed to play; a name is optional at save.
- Learn: instrument → concept units → steps; "Carry on" apart from "Next on <instrument>".
- Targets ≥48 px (64 px large mode). Visible focus (ink outline + sun halo; sun outline at night). Reduced motion respected. Never colour alone.
- Learner words: short and plain. Curriculum codes, objectives and class-talk notes live in Grown-ups only.
- Older pathway uses the quieter "studio" presentation (`data-presentation`): no characters, quieter titles (Nunito, lighter weights).
- Design recovery and saved-work states as carefully as first screens: sound check, undo a take, honest save location, carry on from last time.

## Content and assets
- Lessons/pathways are drafts pending a primary music educator. Say so in the adult area.
- Every audio/font file in ASSETS.md with source, licence, SHA-256. VCSL samples are CC0. Keep OFL notices for fonts and CC BY-SA attribution for lesson content.

## Checking work
- Run `npm test`, `npm run build`, `npm run lint` before calling a milestone done.
- Use Playwright to screenshot 360 px and 1280 px and check the console. Playwright cannot judge audio latency, real microphones or real multitouch; say so.
- `node tools/e2e-touch.mjs` (touch), `node tools/e2e-listen.mjs <piano.wav> <taps.wav>` (fake microphone), `node tools/e2e-teacher.mjs` (stand-in sign-in service), `node tools/bench-listen/run.mjs` (listening benchmark). iPhone/Android checks are in `docs/UAT.md`.
- Update `docs/STATUS.md` honestly: working / draft / blocked / future.
