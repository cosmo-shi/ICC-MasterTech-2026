# Review branch `sc-redesign-review` (10 Nov 2026)

momo chose "Library and teacher only" (current Nunito font and Lucide icons kept). Not merged into `sc` until momo approves.

## What changed
- **Library** (`src/screens/LearnScreen.tsx`): instrument choice first, the next lesson, teacher-assigned work, then units as rows (title, description, progress in words and a shape, a stave preview drawn from the lesson's own music, Start / Continue / Practise again). Creative projects are a separate section. The winding path, floating Start bubble and ring indicators are gone. "Pathway" tab is now "Lessons".
- **Teacher** (`src/screens/Grownups.tsx`, `TeacherDashboard.tsx`): School / On this device modes. On this device: Overview, Assignments, Students, Progress (plus Lessons, How progress works, Device). School without a service says "School accounts are not available in this version."
- **Empty state:** "No practice recorded yet." with "Choose a lesson".
- **Progress:** table with a sticky learner column and wrapping headers; a list on phones.
- **Student review:** current next lesson and who chose it, a **support plan** (recommended support with its reason, switches that start in the learner's next lesson on this device), practice attempts with date, how they were played (on screen, MIDI, microphone, input unclear), help used and results.
- **Test data:** open the app with `?testdata` (e.g. `/?testdata#/teacher`). Four made-up learners ("Test learner A–D") whose attempts come from the real checker. Memory only: nothing is read from or written to the device, nothing syncs, and a banner on every screen says "Test data". This is the brief's "isolated, clearly labelled fixture"; it conflicts with the CLAUDE.md line "No mock or demo data screens", so momo should confirm it.

## Screens
`docs/review/*.png`: library (phone light, desktop dark), teacher overview, progress, student review, student with no practice, school mode, empty device.

## Not done
Fonts (Cabin vs Atkinson Hyperlegible Next) and Phosphor icons, by momo's choice. No real-device check.
