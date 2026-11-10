# Carmen visual direction

**Decision (momo, 10 Nov 2026, 20:52):** direction A, "expressive editorial", with Bricolage Grotesque and Atkinson Hyperlegible Next. It is now the app's design on branch `sc-visual-review`. The `?look` and `?type` switches, directions B and C, and the Cabin and Fraunces fonts have been removed. The sections below are the review record that led to the decision. Their URLs with `?look` no longer change anything.

**Rolled out with the decision:**
- Tokens: `--font-display`, `--font-ui`, `--font-wordmark` and weights in `tokens.css`.
- Type roles, the Learn library, Music theory, lesson stages, the creative entry and the teacher styles in `system.css`.
- Plain wording, following momo's 20:52 and 20:54 notes:
  - feedback says "The note was E. You played G.";
  - lesson titles say what you do, e.g. "Find C, D and E on the keyboard";
  - no explanatory subtitles.
- Landscape and drum fixes, following momo's 21:05 note:
  - the stave is kept on phones in landscape;
  - the kit fits its case in portrait and landscape;
  - pads are square on desktop.
- `tools/e2e-devices.mjs` checks for overlap, edge padding, cut-off text and sideways scrolling. It runs 9 emulated iPhone, Android and iPad profiles over 11 screens.

## How to review

```
git checkout sc-visual-review
npm install
npm run dev            # Vite prints the port, usually 5173
```

Then open (replace 5173 with the printed port):

| What | URL |
|---|---|
| Today's Learn (before) | `http://localhost:5173/#/learn` |
| A Expressive editorial | `http://localhost:5173/?look=a#/learn` |
| B Contemporary studio | `http://localhost:5173/?look=b#/learn` |
| C Playful modular | `http://localhost:5173/?look=c#/learn` |
| Music theory, recommended direction | `http://localhost:5173/?look=a#/theory` and `?look=a#/theory/beat` |
| Beginner lesson (L05), recommended direction | `http://localhost:5173/?look=a#/lesson/L05` |
| Creative project entry | `http://localhost:5173/?look=a#/mission/P34_MELODIC_REPLY` |
| Teacher dashboard with made-up learners | `http://localhost:5173/?look=a&testdata#/teacher` |
| Type specimen (all three systems and Nunito) | `http://localhost:5173/docs/design/type-specimen.html` |

Each look comes with a type system: A and C use type 1, B uses type 2. To try any look with any type, add `&type=1`, `&type=2` or `&type=3`, for example `?look=a&type=3#/learn`. Neither switch is stored, so reloading without it goes back to today's app. Day and Night still follow the gear menu or the device.

Screenshots are in `docs/design/shots/` (`before-*`, `a-*`, `b-*`, `c-*`).

## 1. Audit of the current Learn screen (sc 04e61ee)

- **One surface for everything.** The featured lesson, the units, the lesson rows and the creative projects all use the same pale card on paper, so nothing comes first. The only thing that tells units apart is a thin coloured strip down the left edge (the "tiny vertical markers" in the brief).
- **Same-weight type.** Nunito 900, 800 and 700 sit close together at the sizes used, so the screen title, unit titles and row titles all look alike.
- **Generic actions.** Every row says "Start" or "Continue", and "About" opens a details sheet, not a preview.
- **Creative work reads like more lessons.** "Make your own" projects are styled the same as marked lessons, even though they are described rather than marked.
- **Targets.** The Lessons / Music theory switch and the School / On this device switch are 40 px tall, below Carmen's 48 px rule (WCAG 2.2 AA's 24 px minimum is met).
- **Music theory** is a list of words in pale buttons. Notation and sound only appear after opening a topic.
- **What is good and kept:** the palette roles, the dark instrument case, notation and sound from one event list, the progress words with shapes, and the one-step-per-screen lesson frame.

## 2. Reference analysis

Brief references:
- Tubik, "Music Learning Application Design": https://dribbble.com/shots/17345407-Music-Learning-Application-Design
- Sheikh Raihan, "Music Learning platform": https://dribbble.com/shots/27488265-Music-Learning-platform

**I could not inspect either reference.** Fetching both pages from this environment returned empty bodies (Dribbble serves the shots through scripts and images that did not load), and no screenshots were available. Nothing below claims what those shots look like. The directions come from the brief's own descriptions ("expressive editorial", "contemporary music studio with darker surfaces and instrument previews", "playful modular / bento"), from Carmen's palette and rules, and from the audit above. If momo can attach screenshots of the two shots, I will compare them against the three directions.

## 3. The three directions

All three use the same data, the same actions and the same palette (coral, peach, mist, sky, periwinkle, orchid, the paper and ink neutrals, and the existing tints and deep ink shades). None uses the side strip.

**A: Expressive editorial** (`?look=a`, type 1)
- Very large "Learn" title, with Piano and Drums as big words. The chosen instrument is underlined and has a "Chosen" tick.
- The next lesson is a full-width block in its track colour, with its stave or track picture beside it.
- Units are numbered chapters (01, 02) with a big numeral and a rule. Lessons are rows on hairlines, not boxes. Only the next lesson has a filled button; the others are outlined.
- "Compose and create" is its own orchid band with an oversized title and a sentence saying the work is not marked.

**B: Contemporary music studio** (`?look=b`, type 2)
- Piano and Drums are dark instrument panels with a small keyboard or pad drawing, so the choice is visual as well as written.
- The next lesson is a dark "case" panel with the stave on paper inside.
- Each unit is a two-column module: a block in the track colour with the unit name and "0 of 4 completed", and the lesson list beside it.
- The creative section is a dark orchid studio panel.

**C: Playful modular** (`?look=c`, type 1)
- A bento layout: a large "Up next" tile beside tall Piano and Drums tiles in periwinkle and sky.
- Units are tinted modules side by side, and each lesson has a round status badge.
- Creative projects are tiles of different widths and corner shapes (orchid, peach, orchid tint).

## 4. Typography

| System | Display | Body and controls | Load (woff2, latin) | Notes |
|---|---|---|---|---|
| 1 | Bricolage Grotesque | Atkinson Hyperlegible Next | 41 + 34 KB | Characterful at large sizes, quiet at row size. Atkinson separates I/l/1 and 0/O best. |
| 2 | Cabin | Atkinson Hyperlegible Next | 28 + 34 KB | Calmest. Cabin's latin subset has no Vietnamese, so names like "Nguyễn" fall back to the next font in display text. |
| 3 | Fraunces | Atkinson Hyperlegible Next | 37 + 34 KB | Warm serif titles. Reads as more "bookish"; long titles wrap sooner. |
| Today | Nunito | Nunito | 39 KB | For comparison. |

- **Symbols.** None of these fonts, Nunito included, has ♯ ♭ ♮. A 3 KB subset of Noto Music provides only U+266D to U+266F in every system, so C♯, D♭ and E♮ always match. 4/4 is plain text and works in all of them.
- **Tested** in `docs/design/type-specimen.html` (screenshot `docs/design/type-specimen.png`): titles, headings, a long two-line title, body, metadata, teacher labels, buttons, ♯ ♭ ♮, 4/4, and a long hyphenated name with diacritics.
- **Licences.** All are SIL OFL 1.1 and self-hosted under `public/fonts`, with the OFL notices beside them. They are listed in ASSETS.md with SHA-256 hashes. There are no CDNs or runtime requests elsewhere.
- **Performance and fallbacks.** `font-display: swap`. A face downloads only when a page uses it. The fallbacks are `system-ui` for sans faces and Georgia for Fraunces.

## 5. Recommendation

**Direction A (Expressive editorial) with type system 1 (Bricolage Grotesque + Atkinson Hyperlegible Next).**

- It gives the clearest order on a phone: title, instrument, next lesson, then chapters.
- It follows Carmen's own layout rule (group by space and hairlines, not boxes) more closely than B or C.
- It leaves the one dark surface for the instrument case, so the instrument stays the strongest object on Play.
- It stays readable at 320 px and at 200% text.

Worth keeping from the others: B's small keyboard and pad drawings in the instrument choice, and C's varied tile shapes for the creative section only.

The proof screens (Music theory, the L05 lesson, the creative entry and the teacher dashboard) are built in A so they can be judged together.

## 6. Proof screens (recommended direction)

- **Music theory.** Each category has a coloured header with a one-line description: Beat and rhythm in coral, High and low in periwinkle, How it sounds in sky, Building music in orchid. A jump bar at the top goes to each category. Every topic card shows its first example as real notation with a "Hear it" button that plays the same event list, plus "Read about it". Topic pages take the category's tint.
- **Beginner lesson (L05).** A stage strip under the progress bar shows Explain → Demonstrate → Explore → Practise → Feedback → Continue, with the current stage named in words. On phones, only the current stage's name shows, and the other stages stay as segments and screen-reader text. The step mapping:

  | Stage | Steps |
  |---|---|
  | Explain | Hear C, D and E |
  | Demonstrate | Find C, D and E |
  | Explore | Up, down, keys and stave |
  | Practise | Guided, then on your own |
  | Feedback | The feedback sheet |
  | Continue | Change one note, think back |

  The main button now says where it goes, for example "Next: Find middle C" instead of "Continue".
- **Creative project entry.** An orchid "Compose and create · partner project" header says that nothing is marked. It also fixes a repeated line under the title (see the copy audit).
- **Teacher dashboard.** It keeps the same typefaces and hues. Summary numbers sit on hairlines instead of tiles, rows are denser, and the switches are 48 px.

Not redesigned in this pass: Play, My music and the rest of the lesson types. They wait for a chosen direction.

## 7. Copy audit

| Original | Replacement | Reason | Interaction | Status |
|---|---|---|---|---|
| Make your own (unit title) | Compose and create | Names the musical activity, not just "make" | Unit heading | Applied on `sc-visual-review` (shared data, all views) |
| Make your own (projects section) | Compose and create, plus "Nothing here is marked…" | Says that creative work is described, not marked | Section heading | Review looks |
| Make your own (MakeStep kicker) | Compose | Shorter, and a musical word | Step label | Review looks |
| Start | Try the rhythm / Find the notes / Start playing / Start composing | Says what the learner will do first, from the lesson's input type | Lesson button | Review looks |
| Continue (lesson row) | Continue (started) / Practise again (completed) | "Practise again" says it repeats something already done | Lesson button | Review looks |
| About | Lesson details | It opens a details sheet, not a preview, so "Preview" would be wrong | Opens the details dialog | Review looks |
| Continue (L05 steps) | Next: (next step's title) | Says where the button goes | Footer button | Review looks |
| Partner project | Compose and create · partner project | Ties it to the creative section | Eyebrow | Review looks |
| (repeated title under the title) | Removed when identical | It repeated the heading word for word | Lede | Review looks |
| Creative projects (Learn) | Compose and create | One name for one section | Section heading | Review looks |

## 8. Accessibility results (WCAG 2.2 AA, automated)

**Method.** `node tools/a11y-review.mjs "?look=a#/learn" …` (Playwright; dev server on port 5179). For each page it checks:
- horizontal overflow;
- the text contrast of every visible text node against its real composited background (4.5:1, or 3:1 for large text);
- buttons and links under 44 px.

**Sizes.** 320×640, 390×844, 820×1180 (tablet), 1280×800 and 740×360 (short landscape), each in light and dark, plus 390×844 at 200% root text size.

**Pages.** Learn in A, B and C; Theory index and topic; L05; the creative entry; Teacher with test data.

| Result | Detail |
|---|---|
| Overflow | None on any page, size, theme or text size. |
| Contrast | All pass. B's studio descriptions were 4.24:1 and were fixed (now light text on the dark panel). The only flag left is Notation's screen-reader-only caption, which is clipped and invisible, so it is not a real failure. |
| Targets | All review controls are 48 px or more. The two segmented switches were 40 px and are now 48 px in the review looks. Two existing items stay as they are on `sc`: the octave arrows (48×40) and the piano keys at 320 px (31 px wide). Both meet AA's 24 px minimum; the keys are the instrument itself. |
| Console | No page errors. |

**Status and colour.** "Not started", "In progress" and "Completed" each have a word and a shape, not colour alone. The chosen instrument has a "Chosen" tick and an outline or underline. Focus uses the existing outline and halo, and reduced motion is unchanged (no new motion).

**Not verified.** Screen readers (VoiceOver, TalkBack), real phones, audio latency and Windows high contrast. Automated contrast checks cannot judge text on images or gradients, and none of the new surfaces uses them.

**Regression.** `npm test` (238 passing), `npm run lint`, `npm run build` and `node tools/e2e-video-qa.mjs` (10 sizes plus rotation) all pass with no `?look`.

## 9. Tokens and engineering summary

**Palette.** No new colours. Every surface uses the existing `--sw-*`, `--tr-*` (with `-ink` and `-tint`), `--sun`, `--dusk`, `--case`, `--paper*` and `--ink*` tokens. The studio panels in B mix `--case` with orchid using `color-mix`.

**New tokens** (in `src/styles/look.css` while under review):
- `--font-display` and `--font-body`;
- `--display-tracking`;
- type-system values of the existing `--w-*` weights.

**Files.**
- `src/state/look.ts`: reads `?look` and `?type` once and sets `data-look` and `data-type` on `<html>`. Nothing is stored.
- `src/styles/look.css`: font faces, the type systems, and one block per direction. Every rule is scoped to `[data-look]`, `[data-type]` or `.lx*` classes, so nothing changes without the switch.
- `src/screens/learn/LearnLooks.tsx`: the three compositions plus shared parts (`Status`, `Action`, `Details`, `Preview`, `InstrumentChoice`, `actionLabel`).
- `LearnScreen.tsx` builds one `Library` object from the same data the current screen uses.
- `TheoryScreen.tsx` gains a category-coloured index.
- `LessonShell.tsx` gains an optional `stage` prop.
- `NotesLesson.tsx` uses stage mapping and contextual labels.
- `MissionScreen.tsx` gets the Compose header.
- `MakeStep.tsx` gets the Compose kicker.

**Dependencies.** None added.

**Not changed.** Lesson IDs, progress, stored data, audio, notation, checking, feedback words, classroom permissions and pedagogy.

**After approval** (not done):
- move the chosen type system and tokens into `tokens.css` and `system.css`;
- make the chosen composition the only Learn screen;
- delete the other two directions, `look.ts` and the review switch;
- then extend the direction to Play, My music and the other lesson types.
