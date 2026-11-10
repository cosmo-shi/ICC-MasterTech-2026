# Carmen journeys: audit and target (10 Nov 2026)

Audit of the `sc` build at `69ce33f` (same app source as `main` at `338508b`), read from the code and the two bug reports from main (`docs/BUGS-live-test-2026-11-10.md`, `docs/BUGS-iphone-test-2026-11-10.md`). "Now" is what the code does; "Gap" is what is missing; "Target" is what this round builds. Routes are hash routes.

## 1. First-time learner opening an instrument

- **Goal:** make a sound.
- **Now:** opening any route with no player shows the welcome dialog (`EntryScreen`), then name, colour and start level (3 more screens), then "Hi". So six taps and a typed name come before the first sound (bug 2.4). The sound engine starts on the first key press. If loading fails, the only sign is a "Sound didn't start" line.
- **Gap:** you can't play without signing up. Nothing shows that sound is loading, and a press that makes no sound is still captured.
- **Target:** the welcome screen shows **Just play** (one tap to `#/play`, as a guest), **Start learning** and **I'm a teacher**. Sound status is shown in words: loading, ready, failed (with Try again). A press is captured only if it sounded.
- **Next action:** press a key. **Success:** you hear the note and see it. **Recovery:** "Sound didn't start" with Try again; the instrument stays visible.

## 2. Returning learner resuming

- **Goal:** carry on where they left off.
- **Now:** "Who's playing?" opens over every screen. Learn shows the resume card with the model's choice. A lesson restarts at step 1 after a reload (minor bug).
- **Gap:** the global "carry on" and the per-track recommendation look alike. Lesson position is lost after a reload.
- **Target:** one **Carry on** card on Learn that names its instrument, kept apart from "Next on Piano/Drums" inside the chosen instrument. The lesson stage and mode are saved per lesson in session storage and restored after a reload or rotation.

## 3. Learning, feedback, retry and creating

- **Goal:** get better at one idea, then use it.
- **Now:** Hear → Learn → Try (practice) → feedback sheet → On your own → Make your own → Summary. The feedback shows a result word, one observation, per-sound marks, counts, Hear yours / Hear the music, a hint, Slower and Watch it. After two misses on a skill it offers checks.
- **Gap:**
  - Feedback says what happened but not why it matters or what to do next.
  - Counts are shown on every take.
  - The count-in stalls once the audio context is old (blocker).
  - "More about…" leaves the lesson.
  - "With help" is shown when the app, not the child, turned Slower on.
- **Target:**
  - Feedback in three lines: what happened, why it matters musically, one next step. Then **Hear the difference** and **Try slower** where they apply; per-sound marks sit behind "Sound by sound".
  - Fix the count-in clock.
  - Open the word card inside the lesson.
  - Label the badge "Slower was on" when the model chose it.
- **Success:** a try is saved and the next step is obvious. **Recovery:** "This try couldn't be saved" plus Try again; Back keeps the lesson.

## 4. Saving, replaying, renaming and deleting music

- **Goal:** keep music and find it later.
- **Now:** Record on Play, then name and Save; Undo brings back the previous take. My music offers play, rename, and delete with confirm. After a reload, Play in My music can show "Stop" for 10 s with no sound (bug 2.2), and playback can stay on "Stop" for 40 s (bug 2.1, the same clock fault).
- **Gap:**
  - A guest's save doesn't say who it belongs to or where it is kept.
  - Delete has no undo.
  - A saved recording can't be played straight after it is made.
- **Target:**
  - Saving as a guest offers "Add your name" (optional) and says it is kept on this device only.
  - Delete gets an 8-second Undo.
  - Playback starts sound on the tap, or says it is loading.
  - Playback ends on the take's own length.
  - Microphone recordings, kept only when Record is used, are listed with their size and a Delete button.

## 5. Using a physical instrument (microphone or MIDI)

- **Goal:** practise on a real piano, guitar or drum, or by tapping a table.
- **Now:** not built. The app had a no-microphone rule.
- **Target:** Play → **Use my instrument**: choose instrument → choose input (on screen, MIDI, microphone) → check the input (level meter, or a detected note or tap) → choose an activity → **Start listening** → feedback → retry or save.
  - Permission is asked only after "Use the microphone" is pressed.
  - A denied permission leaves the on-screen instrument and MIDI working.
  - Leaving the screen, hiding the tab or a phone call stops the microphone.
  - **Record** (keeping audio) is a separate, explicit control.
  - Lessons get a "Play on" switch where the activity is supported: every keyboard lesson by MIDI, drum and rhythm lessons by microphone taps after the timing check. Single-note pitch by microphone is in Use my instrument only, until it is checked in real rooms.

## 6. Teacher registration, login, setup and daily use

- **Goal:** see how the class is going, adjust what children are offered, and use the same space on another device.
- **Now:** "I'm a teacher" opens a 4-digit PIN that is stored as a salted hash in this browser. There is no account, no recovery and no other device.
- **Gap:** not school authentication, and no "forgot PIN".
- **Target:**
  - A teacher welcome page with Log in and Create account.
  - School email, a one-time code by email, then a session that refreshes and can be signed out.
  - First-use setup: your name, then create or join a teaching space with a join code.
  - Permissions are enforced by the server (Supabase Auth plus row-level security, SQL in `supabase/`).
  - Without a configured service, the page says so and offers only the device-only PIN view, labelled as such. The PIN gets a reset that wipes local teacher data after a warning.

## 7. Failure and interruption

| Situation | Now | Target |
|---|---|---|
| Microphone permission denied | n/a | Say what happened, how to allow it in Settings, and keep playing on screen |
| Sound fails to load | One line, Try again | Named state, Try again, captured presses not counted |
| Save fails | "Couldn't be saved" | Same, and the take stays on screen with Try again |
| Tab hidden or phone call | Notes released | Notes released, microphone stopped, take discarded without evidence |
| Count-in or playback clock wrong | Long stall | Clock checked; a take with a broken clock is not graded |
| Rotation mid-lesson | Layout breaks in landscape | Landscape layout; stage, mode and notes kept, held notes released |
| Reload mid-lesson | Back to step 1 | Stage restored |

## Built on 10 November

Journeys 1 to 6 are built as targeted above, with the changes noted (8-second Undo; microphone in
lessons is taps only). Screens for each journey at phone, tablet, desktop, short landscape and larger
text, in Day and Night, are in the delivery flow map. Phone checks still to run are in `docs/UAT.md`.

## 8. A class across devices (10 Nov brief)

Needs the school service (docs/SERVICES.md); otherwise each side says plainly that it isn't set up.

| Step | Teacher's device | Learner's device |
|---|---|---|
| 1 | Teacher → Classes → New class → add learners by nickname | |
| 2 | Get a code for each learner (6 characters, works once) | |
| 3 | | Settings → My class → Join my class → type the code → "3B Music, as Ari · Up to date with your teacher" |
| 4 | Assign an activity (preview, who, help that starts on, a line for learners) | Learn → From your teacher → the activity |
| 5 | Board: Not started, then Practising | Plays it; one feedback dialog; the try waits on the device if offline |
| 6 | Press the learner's name → what Carmen saw → change next activity, help, a skill judgement; add a private note → Save | |
| 7 | | Next time online: Learn says "Your teacher picked this for you"; the lesson says "Your teacher set up some help", and it starts on |
| 8 | If another teacher saved first: "Another teacher changed this plan"; their version is shown; save again | |

Recovery: wrong or used code ("That code didn't work… each code works once"); offline ("Your work is
safe here and will go to your teacher later"); teacher made a new code ("This device isn't linked
any more" → Enter a new code); teacher's login ended ("Log in again", classes are safe); class
removed or teacher left ("This class isn't available to you any more").
