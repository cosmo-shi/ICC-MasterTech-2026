# Carmen — project rules for Claude Code

Carmen is the app on `main` (team decision, 9 Nov 2026). The earlier plain-JavaScript rules and milestones no longer apply.
Read `SPEC.md` (build list, decisions, resolved contradictions) before every task.
Product direction: `context-pack/MASTER_CONTEXT.md` (pack v2.0). Read the relevant section, not the whole pack, each time.
UX, navigation, visual components and recovery states: also read `docs/carmen/UX_JOURNEY_AND_VISUAL_DIRECTION.md` (journeys, personas and Sound Workshop identity; personas and journeys are hypotheses, not research findings).
AI work: also read `context-pack/specs/AI_MUSIC_INTERACTION.md` and `docs/MODEL_CARD.md`.
Research and references stay in `context-pack/` and `docs/RESEARCH_REFERENCES.md`; do not paste research into code or this file.

## Git
- Work on your own branch (Person B: `carmen-b`). Never commit straight to `main`; changes reach `main` through a pull request the team agrees on.
- Small commits with plain messages. Never force-push. Do not reformat files you were not asked to touch.

## Stack and commands
React 19 + TypeScript + Vite. Web Audio directly (no Tone.js). IndexedDB for saves. Vitest for tests.
- `npm run dev` · `npm run build` · `npm test` · `npm run lint` · `npm run train` (retrain model, seeded)
Pure logic (music, checker, ai, verifier) lives in plain TS under `src/music`, `src/engine`, `src/ai` and has tests. Node can run these files directly (type stripping), so keep them free of enums/namespaces.

## Product boundaries
- Foundation to Year 6 with an Older extension. Pathway choice is a content choice, never stored as age.
- Keyboard (sampled piano) and drums (sampled percussion) only. No guitar/wind tiles.
- No camera, no microphone, no accounts, no analytics, no cloud calls, no external fonts or CDNs at runtime.
- No streaks, timers, rankings, ads, purchases, generic praise. Badges off by default.
- Teacher Mode is real and local. No mock or "demo data" screens.

## AI honesty
- The on-device model is a small MLP trained on seeded synthetic attempts. It describes timing patterns; it does not diagnose, read emotion or judge creativity.
- The model picks from approved plan IDs only. The verifier checks every reply before it plays.
- Learners see "Carmen listened" (or "heard your timing") only when the model actually ran; otherwise "A tip". No AI badges. Grown-ups shows the full provenance ("AI coach" vs "Coach tips").
- Never claim educational effectiveness, curriculum certification, educator approval or "first/only".
- Report metrics from `docs/MODEL_CARD.md`; regenerate them with `npm run train`, never hand-edit numbers.

## Music correctness
- Canonical events: integer ticks, 480 per crotchet; middle C = C4 = MIDI 60; A4 = 440 Hz.
- One event list drives sound, notation, checking and replay. Rests are silent spans, not inputs.
- Pitch, onset and duration are separate facts. Untimed pitch tasks get no timing penalty.
- Australian terms: crotchet, quaver, minim, practise (verb).

## Design ("Songbook Horizon", chosen by momo 2026-11-09: direction C's warmth + B's playfulness; replaces Colour Bars and Sound Workshop)
- Idea: the stave is the horizon. A sunset landscape whose hill crests are stave lines, with a note-head sun, frames every screen; the work sits on a sheet of paper over it. Dark mode is the same place after sunset (moon, night hills), not neon.
- Colour has roles (tokens in `src/styles/tokens.css`): sky/hills = environment only; paper/ink = reading and playing; sun = "now" (main action, pressed key, current beat); record = recording only; dusk = where you are (selected tab/option, links); good/near/miss = feedback, always with words. No rainbow note colours.
- Type roles: Bagel Fat One for the wordmark, screen titles and big feedback headings only; Figtree for everything else. Self-hosted with OFL notices.
- Shape/space/elevation: 4-pt spacing (`--s1`…`--s7`), radii 10/16/28. Only playable things (keys, pads, Record) have a physical edge. Group by space and hairlines, not boxes, outlines or heavy shadows. The instrument sits in a dark case, centred, and is the biggest thing on Play.
- Brand mark: note-head sun over two curved stave lines (`Logo`, `Wordmark`, `public/favicon.svg`). Icons, the mark, the `Horizon` scene and the `Band` children share one geometry: 24 grid, 2-unit round strokes, the tilted note head as the one filled motif. Keep familiar action icons (play, undo, stop, gear).
- Phone: bottom tabs Play / Learn / My music, settings (incl. Day/Night/Same as device) behind the gear. Desktop ≥900 px: sidebar on the landscape, Grown-ups after a divider.
- Targets ≥48 px (64 px large mode). Visible focus (ink outline + sun halo; sun outline at night). Reduced motion respected. Never colour alone.
- Learner words: short and plain. Curriculum codes, objectives and class-talk notes live in Grown-ups only.
- Older pathway uses the quieter "studio" presentation (`data-presentation`): no characters, titles in Figtree.
- Design recovery and saved-work states as carefully as first screens: sound check, undo a take, honest save location, carry on from last time.

## Content and assets
- Lessons/pathways are drafts pending a primary music educator. Say so in the adult area.
- Every audio/font file in ASSETS.md with source, licence, SHA-256. VCSL samples are CC0. Keep OFL notices for fonts and CC BY-SA attribution for lesson content.

## Checking work
- Run `npm test`, `npm run build`, `npm run lint` before calling a milestone done.
- Use Playwright to screenshot 360 px and 1280 px and check the console. Playwright cannot judge audio latency or real multitouch; say so.
- Update `docs/STATUS.md` honestly: working / draft / blocked / future.
