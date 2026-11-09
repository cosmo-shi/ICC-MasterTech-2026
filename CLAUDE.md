# Carmen — project rules for Claude Code (branch `sc`)

This CLAUDE.md is for the `sc` branch only. Do not copy it to `main`; the team merges later.
Read `SPEC.md` (build list, decisions, resolved contradictions) before every task.
Product direction: `context-pack/MASTER_CONTEXT.md` (pack v2.0). Read the relevant section, not the whole pack, each time.
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
- Keyboard (sampled piano) and drums (sampled percussion) only. No guitar/wind tiles.
- No camera, no microphone, no accounts, no analytics, no cloud calls, no external fonts or CDNs at runtime.
- No streaks, timers, rankings, ads, purchases, generic praise. Badges off by default.
- Teacher Mode is real and local. No mock or "demo data" screens.

## AI honesty
- The on-device model is a small MLP trained on seeded synthetic attempts. It describes timing patterns; it does not diagnose, read emotion or judge creativity.
- The model picks from approved plan IDs only. The verifier checks every reply before it plays.
- Show "AI coach" only when the model actually ran. Otherwise show "Coach tips" (reviewed rules).
- Never claim educational effectiveness, curriculum certification, educator approval or "first/only".
- Report metrics from `docs/MODEL_CARD.md`; regenerate them with `npm run train`, never hand-edit numbers.

## Music correctness
- Canonical events: integer ticks, 480 per crotchet; middle C = C4 = MIDI 60; A4 = 440 Hz.
- One event list drives sound, notation, checking and replay. Rests are silent spans, not inputs.
- Pitch, onset and duration are separate facts. Untimed pitch tasks get no timing penalty.
- Australian terms: crotchet, quaver, minim, practise (verb).

## Design (Sound Workshop)
- Playful but calm. Instrument is the centre of every screen. No purple gradients, sparkles, glass, mascots, lesson-path maps or "AI" fonts.
- Fonts: Grandstander (short headings only) and Atkinson Hyperlegible Next (everything else), self-hosted with OFL notices.
- Tokens in `src/styles/tokens.css`: canvas #FFF8E8, ink #2B2341, cobalt #3658D4 (white text), coral #FF7954, sunflower #FFD65C, mint #A7DFC3, lilac #C4B4E8 (all with dark ink).
- Targets ≥48 px (64 px large mode). Visible focus. Reduced motion respected. Never colour alone.

## Content and assets
- Lessons/pathways are drafts pending a primary music educator. Say so in the adult area.
- Every audio/font file in ASSETS.md with source, licence, SHA-256. VCSL samples are CC0. Keep OFL notices for fonts and CC BY-SA attribution for lesson content.

## Checking work
- Run `npm test`, `npm run build`, `npm run lint` before calling a milestone done.
- Use Playwright to screenshot 360 px and 1280 px and check the console. Playwright cannot judge audio latency or real multitouch; say so.
- Update `docs/STATUS.md` honestly: working / draft / blocked / future.
