# Post-main review: baseline audit and changes

Baseline: `main` at `87f1500`. Branch: `review/pedagogy-notation`. Not merged, not deployed.

The owner's screenshots were not attached to this session; each "observed" point below comes from the written brief, then reproduced on `main` where possible.

## Findings and fixes

| Brief item | Reproduced on main? | Code cause | Fix | Test / evidence |
|---|---|---|---|---|
| 6: notes played together collide on the stave | Yes: C+E+G, C+D and C♯+D♯+F♯ pressed together draw heads, stems and letters on top of each other (`trail-cmp.jpg`, top) | `NoteTrail.tsx` drew one head, stem and letter per key press at its own time, with no grouping. `layout.ts` kept only one note per onset and silently dropped near-simultaneous notes, so a recorded chord was written as one note | New `src/music/chords.ts`: notes starting within 70 ms (60 ticks) are one chord. The trail draws one stem per chord. In a second, the upper head moves to the other side of the stem. Sharps stack in columns. Sequential notes keep a minimum spacing, newest at its true time. `layoutBars` groups chords, and `Notation.tsx` gives VexFlow one `StaveNote` with several keys and one accidental per key | `chords.test.ts` (9 tests: chord, arpeggio, held bass plus later melody, repeated key, sharps, spacing); `trail-cmp.jpg` (bottom). Recorded notes and sound are unchanged |
| 2.2: "What is a musical note?" subtitle lists untaught tasks | Yes | `curriculum.ts` `learn` strings | All six piano rows use the brief's titles, purposes and actions | `COPY_CHANGES.md` |
| 2.1, 2.3: lessons and projects are rows and strips, not cards | Yes | `system.css` list styles; `Library.tsx` | Each lesson and composition is its own card: white surface, 2 px edge mixed from the ink token, state in words and an icon, one specific action. "What you'll learn" is kept only on the featured card. Compositions use 1, 2 or 3 columns, with the first card wider so five never leave one alone | `after-learn-*.jpg`; `e2e-devices` ALL PASS |
| 3: first lesson asks before it teaches | Yes: step 1 was "Let's listen" with no definition | `guided.ts` N01 | N01 now: definition (note, pitch, length), notes make melodies, hear two notes, "Which note sounds higher?" with the brief's feedback, short and long, names C and E on keys and stave, play C then E, "Next: Understanding pitch" | Playwright run on iPhone 14: all 8 steps, wrong then right answer, completion shows "Completed · Review lesson" after reload |
| 3: rhythm introduction | Partly | `guided.ts` B00 | B00 uses the brief's beat and rhythm definitions; the metronome is called a tool | — |
| 8: older defects | 9A to 9E were fixed in `87f1500` and pass `e2e-devices` and `e2e-video-qa`. Not redone | — | — | — |

## Not done in this pass (named, not hidden)

- "Understanding pitch" (L04) is still the existing lesson with a new title. The brief's pitch-versus-volume lesson is not built yet.
- Other lesson rows not in the brief's table (rhythm, reading, drums) keep their current wording.
- The new progress states `practice_completed` and `revisit_recommended` are not added. Cards show Not started, In progress or Completed.
- The VexFlow stave for saved pieces groups chords (unit tested), but no screenshot of a saved chord was taken.
- 200% zoom, real devices, Safari and audio were not checked.
- `CURRICULUM_ALIGNMENT_V9` and the sources register from the previous pass still apply. The brief's six example codes are already in `src/data/curriculumAlignment.json`.

## Checks

254 unit tests pass; tsc, lint and build are clean; `e2e-devices` ALL PASS (Chromium emulation of 5 devices, light and dark).
