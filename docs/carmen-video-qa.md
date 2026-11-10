# Carmen video QA: defect ledger (10 Nov 2026)

Source: momo's 45 s screen recording `carmen-45s-16x9.mp4` (phone, portrait and landscape), reviewed frame by frame at 1 fps.
The recording shows an **older build** (Band characters, name-first onboarding, PIN pad). Each item was therefore re-checked on the current `sc` build in Chromium with Playwright at phone sizes (emulated, not a real phone).

Status: **Fixed** (changed and re-checked), **Already fixed** (in the video, not in the current build), **Open**, **Unconfirmed** (needs a real device).

| ID | Video time | Screen | Symptom | Repro (current sc) | Root cause | Repair | Regression test | Proof | Residual |
|---|---|---|---|---|---|---|---|---|---|
| MOB-01 | 0:04, 0:09 | Play, lesson | Stave empty or cropped on phones | Rotate or resize after the stave is drawn | `src/ui/Notation.tsx` drew once at the mount width and never redrew | Redraw on `ResizeObserver` and `visualViewport` resize; SVG gets a `viewBox` so it scales instead of cropping | `tools/e2e-video-qa.mjs` (stave present at 10 sizes) | screenshots in `docs/video-qa/` | Real Safari address-bar resize not checked |
| MOB-02 | 0:06–0:08 | Play, landscape | Keyboard fills the screen; no stave; QWERTY letters on keys | 844×390 Play | `index.css` short-landscape block hid `.play .trail` | Short landscape puts the stave beside Record (`system.css`); letters were already hidden on touch screens | e2e-video-qa (stave and keys both visible at 568×320, 740×360, 844×390) | `docs/video-qa/` | — |
| MOB-03 | 0:15–0:17 | Lesson try, landscape | Stave and keys on separate screens | 844×390, L05 | Task column put the stave below the text, off screen | In short landscape the stave leads the task column, beside the keys | e2e-video-qa | `docs/video-qa/` | Long feedback text in the narrow column scrolls |
| PED-01 | 0:18–0:19 | Lesson feedback | "Note 3 was G. The music asked for E." with no way to hear E and G | Play C D G C in L05 | Feedback had one "hear the music" comparison only | `attemptFeedback` returns a `pair`; `NotePair` gives Hear E / Hear G, both keys marked "Music" / "You" on a small real keyboard, and the two notes on a stave. Primary button "Try that note", secondary "Show me how" | `src/teach/attempt.test.ts`, `src/teach/l05.test.ts` | `docs/video-qa/` | Key highlight on the main keyboard behind the sheet is not added |
| PED-02 | 0:28–0:32 | Drum lesson L01 | Straight into a timed, marked performance | Open L01 | Shared lesson flow starts with the timed try | New L01 foundations (`BeatLesson.tsx`): feel the beat, tap one big drum, meet bass drum, snare and hi-hat, listen, a rest that keeps the beat, then the checked copy starts **slower** | `src/teach/beat.test.ts` | `docs/video-qa/` | D01 still uses the shared flow |
| CNT-01 (new) | 0:29–0:30 | Count-in | Count-in shown as 4 3 2 1 | Any timed lesson | `BeatDots` counted down during count-in | Counts 1 2 3 4, as musicians count in | — | — | — |
| UX-01 | 0:01–0:02 | First run | Asks for a name and a starting level before any sound | — | Older onboarding | **Already fixed**: first screen is Just play / Start learning / I'm a teacher; no name needed to play | — | — | — |
| UX-02 | 0:04, 0:28 | Play, lesson | Small labels and targets; drum kit tiny in a lesson | 320×568 Play; L01 try in portrait | Fixed chrome heights pushed the keys under the tab bar; help chips squeezed the kit | Small phones: shorter stave, one-row sound button, compact Record; lesson kit keeps 260 px | e2e-video-qa (keys above the tab bar at 320×568) | `docs/video-qa/` | Text-size pass not done for every screen |
| UX-03 | 0:38–0:44 | Teacher | Narrow, dense columns; "players", "tries", "Who might like a hand"; "Still learning" from 3 tries | Teacher area | Older wording and layout | Proposal on the review branch only (see `docs/REDESIGN_REVIEW.md`) | — | — | Not merged until momo approves |
| AUD-01 | — | Keys and pads | Sample mapping and multitouch | — | — | Not changed. Chromium touch check passes (`tools/e2e-touch.mjs`, 11/11) | e2e-touch | — | **Unconfirmed** on a real iPhone or Android |
| DATA-01 | 0:25–0:27 | Feedback during rotation | Rotate, back or retry must not save twice or mislabel help | Rotation in Chromium does not remount the lesson | — | L05 saves at most one record per try (guard on the try id); "With help" is set from hints, slower and the example | — | — | **Unconfirmed** on a real device |
| NEW-01 | — | Entry, landscape | Bird drawings overlap the tagline at 844×390 | Entry screen landscape | Brand art position | Open | — | — | Cosmetic |

## Not from the video, found while checking

- Single notes were drawn as a crotchet followed by a dotted minim rest; L05 now shows one semibreve so there is no rest to explain.
- Lesson L05 (C, D and E) and the C♯ explainer are new; see `src/teach/l05.ts` for every word the learner sees.

## What Playwright cannot show

Audio latency, real touch on iPhone Safari, real microphones, screen readers and how a child reads the words. See `docs/UAT.md`.
