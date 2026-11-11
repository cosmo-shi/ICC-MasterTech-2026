# Master brief review: audit and evidence

Branch `review/master-brief`, starting from `main` at `a85bbd5`. Not merged. Not deployed. Screenshots are on the review page; filenames are given below.

## 1. Reported defects (brief section 9)

| ID | What momo saw | How to reproduce on `main` | Cause | Fix | Test | Evidence |
|---|---|---|---|---|---|---|
| 9A | A square icon beside Settings that seems to do nothing | Open Play on a phone and tap the square in the header with no sound playing | The "Stop all sound" button was icon-only and had no visible effect when nothing was sounding (`src/App.tsx`) | Button removed. Sound still stops on every screen change, and Record and Play have their own Stop | `e2e-devices` (no unlabelled controls); manual | `A-play-*.png` vs `B-play-*.png` |
| 9B | D♯ cut off in the note trail and on the stave | Play D♯5 or C6 on Play, or open any phrase with a high sharp | Note trail used a fixed pitch range and a short box. The stave SVG was cropped to a fixed height (`NoteTrail.tsx`, `Notation.tsx`) | New `trailGeometry.ts` fits the range to the notes shown and draws ♯ with Bravura. Notation fits the drawing box to VexFlow's own note boxes | `trailGeometry.test.ts` (C4, D♯4, E4, D♯5, C6 at 52–120 px); `e2e-video-qa` stave checks | `cmp-play-844.png` (D♯ visible after) |
| 9C | In phone landscape, stave too small and controls crowd the keys; brand missing | Hold a phone sideways (844 × 390, 740 × 360, 568 × 320) | Landscape stacked everything in one column (`system.css`) | Landscape grid: stave and keys on the left, instrument switch, sound, Record and tools in a right column; Carmen mark at the top of the rail | `e2e-video-qa` (keys and stave fully on screen at 740 × 360 and 844 × 390, and after rotating mid-lesson); `e2e-devices` | `cmp-play-568.png`, `cmp-play-740.png`, `cmp-play-844.png` |
| 9D | Letters on the keys read like note names | Open Play on a laptop | Computer-key letters (A, S, D…) used the same style as note names | Shown as keycaps with the legend "Letters in boxes are computer keys, not note names." Hidden on touch screens (`any-pointer: coarse`) and in simplified mode | manual; `e2e-touch` unchanged | `A-play-desk.png` |
| 9E | Feedback did not say clearly which note was wrong | Play L05 with one wrong note | Wording "Note 3 was E. You played G." put the answer first | "You played G for note 3, but this phrase uses E." Title "Note 3 is E". Same wording in `coach.json` | `attempt.test.ts`, `l05.test.ts` | — |

## 2. Other defects found while working

| What | Cause | Fix | Test |
|---|---|---|---|
| Learn went blank if the saved instrument was not "keyboard" or "drums" | `prefs.tsx` trusted the stored value | Unknown values fall back to keyboard | manual (Playwright with an old prefs value) |
| L00, L09 and projects never showed as completed | `isNote` in `useAttempts.ts` treated every attempt with a note as a teacher's note and hid it | Only teacher observations count as notes | Verified in the browser: N01 shows "Completed" after reload |
| Welcome logo ran off a 320 px phone | The lockup was a fixed 56 px | Lockup sized in em and capped by screen width | `e2e-devices` (iPhone SE, Galaxy S9+) |
| Learn list squeezed to one letter wide on iPad landscape | Two-column unit layout in a narrow column | Units stack below 1200 px; item buttons move under the words in a narrow list | `e2e-devices` (iPad Mini landscape, light and dark) |
| "Metronome" label touched the edge in phone landscape | Icon and label side by side in a 3-column dock | Icon above label | `e2e-devices` (iPhone 14 landscape) |

## 3. Logo

The approved PNG from momo is kept unchanged in `docs/brand/`. The app uses a cropped, scaled copy as a CSS mask, so it takes the ink colour in light, dark and high-contrast themes. The lockup is mark then "Carmen", side by side. On a phone held sideways the mark and name sit at the top of the nav rail. App icons place the white mark on the deep-ink tile. Hashes are in `ASSETS.md`.

## 4. Sound audit

| Sound | Source | Real recording? | Audition status |
|---|---|---|---|
| Piano | VCSL Kawai grand, 10 pitches × 2 loudness layers, other notes pitch-shifted from the nearest sample (up to 3 semitones in the middle range, more above C5) | Yes | **Not auditioned.** The build environment has no audio output. Needs a listen on a real phone and laptop, with headphones |
| Drums | VCSL kit pieces and clave | Yes | **Not auditioned**, same reason |
| Metronome click | VCSL clave | Yes | **Not auditioned** |

The sounds are already sampled acoustic instruments, not synthesised tones. Salamander Grand Piano (CC BY 3.0) is a possible upgrade if the piano sounds thin when someone listens. It is not added.

## 5. Rule conflict to record

`main`'s `CLAUDE.md` is the early "Musica" version: plain JavaScript only, no React or TypeScript, and "never request the microphone". The app on `main` is React and TypeScript, and has had microphone listening since momo's 10 Nov brief. This branch follows the app as it is and momo's later decisions. It does not change `CLAUDE.md`. momo should decide whether `main`'s `CLAUDE.md` is updated.

## 6. Checks run on this branch (11 Nov 2026)

| Check | Result |
|---|---|
| `npx vitest run` | 31 files, 245 tests, all pass |
| `npx tsc --noEmit -p tsconfig.app.json` | no errors |
| `npx eslint src --quiet` | no errors |
| `npm run build` | builds |
| `node tools/e2e-devices.mjs` (iPhone SE, iPhone 14, 14 Pro Max, Galaxy S9+, iPad Mini; portrait, landscape and dark mode; 11 routes) | ALL PASS, after the three fixes in section 2 |
| `node tools/e2e-touch.mjs` | 11 of 11 pass |
| `node tools/e2e-video-qa.mjs` | ALL PASS |
| `CURRICULUM_ALIGNMENT.md` | generated by `alignment.test.ts`; every activity is mapped once; 4 of 19 descriptors have no activity |

## 7. Not verified

- Real iPhone, iPad and Android devices, and Safari. Playwright emulates the screen size and touch, not the real browser. A desktop-emulated touch test is not proof of iPhone compatibility.
- How anything sounds (see section 4), and audio delay.
- S01 was not played through in a browser, step by step. Its steps use the same parts as N01, which was.
- Drums in phone landscape were checked by `e2e-devices` only, not by eye.
- The curriculum map has not been reviewed by a music educator.
