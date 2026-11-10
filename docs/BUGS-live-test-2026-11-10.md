# Bugs from the live test, 10 Nov 2026

For the team and for each person's Claude Code. Read this before working on lessons, audio timing, playback or the phone layout.

- Tested: https://music-app-sooty-five.vercel.app on 10 Nov 2026 (main as merged that day at 13:36 AEDT).
- How: Safari on a Mac, driven by script (taps and key presses sent as events), about 25 screens, one test player. No real touch. Nobody listened to the sound.
- Reported by: Carlos. Fix order is at the bottom.

## 1. Blocker: the lesson count-in stalls after sound has been on for a while

- Where: any lesson, "Your turn", after tapping Start. The screen stays on "Get ready… 4 beats".
- The wait grows with how long the sound engine has been running:

| Sound on for | Wait before the take starts |
|---|---|
| fresh page | 3.3 s (correct) |
| about 26 s | 29 s |
| about 45 s | 46 s |
| about 10 min | 559 s |

- Steps: open the app, turn sound on, play the piano for a minute, open a lesson, tap Start, time the wait.
- Likely cause (inferred from the built code, not confirmed in source): the first beat is scheduled from the audio clock's absolute time (`AudioContext.currentTime`, seconds since the context started) where a delay was meant, so the delay equals the context's age.
- Where to look: search `src/` for the count-in text "Get ready", the lesson take start, and every place that adds a tempo or beat length to `currentTime` and then passes it to a timer (`setTimeout`) or compares it with a wall-clock time.
- Fix shape: beat 0 = now + time until the first beat, with "now" and the deadline on the same clock.
- Done when: a test creates the audio context, advances its clock by 10 minutes, starts a lesson take, and the first beat is due within one count-in (about 3 s at the lesson tempo). Then check by hand: leave sound on for 10 minutes, start a lesson.
- Stopgap for any demo before the fix: reload the page just before opening a lesson.

## 2. Major

| # | Where | What happens | Steps | Suggested fix |
|---|---|---|---|---|
| 2.1 | Play, Play back | "Stop" stayed up 40 s on a 3 s take; no keys lit; the stave cleared. Probably the same clock fault as section 1 (inferred) | Record 4 notes, tap Play | End playback on the take's own length; light the keys as it plays |
| 2.2 | My music, Play | After a reload, Play shows "Stop" for 10 s or more and no sound engine starts (inferred); nothing asks for sound | Reload, My music, Play | Start audio on that tap, or show "Turn sound on" |
| 2.3 | Phone width (420 px) | About 100 px of the piano keys sit under the bottom navigation until the page is scrolled | Narrow window, Play, Piano | Keep the keys above the nav; shrink the stave first |
| 2.4 | First run | Six taps and a required name before any sound; no skip. SPEC asks for no sign-up and a sound within 3 taps | Fresh browser, open the app | Add "Just play" on the welcome screen, or make the name optional |

## 3. Minor

| Where | What happens | Suggested fix |
|---|---|---|
| Lesson, "More about the beat" | Leaves the lesson; Back restarts it at Listen | Open the word card as a sheet inside the lesson |
| Reload mid-lesson | Lesson restarts at step 1 (attempts are kept for the teacher) | Save the step position per lesson |
| Find the pulse | Snare taps accepted as "bass drum, on the beat" | Say any drum counts, or check the drum |
| Hint | Only the Think level appeared after three or more taps | Show the Clue and Answer levels on later taps |
| Feedback badge | "With help" shown when the app, not the child, switched Slower on | Say "Slower was on" |
| Learn map | Three star dots on a passed lesson while "Skill badges" is off | Tie the stars to the switch, or explain them |
| Device tab | Says "No account, name…" but first run asks for a name | "Only a first name or nickname, kept on this device" |
| Save on device | Onboarding turns saving on; the text calls Off best for shared devices | Ask at setup, or default Off |
| Direct URLs | /play without the # gives a Vercel 404 page | Add a rewrite to index.html in vercel.json |
| Play | "Middle C" label overlapped; drum-kit letter hints dark on dark | Move the label, raise contrast |
| Teacher PIN | No "forgot PIN" path except clearing the browser | Add a reset that wipes local data, with a warning |
| Live stave | Canvas with no text alternative | Add a live text line of the notes |
| Head tags | No apple-touch-icon or home-screen meta tags | Add them so the iPhone home-screen icon and full-screen mode work |

- Words a Year 3 to 6 child may not know: "crotchet", "pulse", "Practise next", "Project".

## 4. For the team to decide (not bugs)

What the learner sees after a take, as observed:

- A result heading first ("Not yet", "Nearly!", "That matched!", "You did it on your own!"), then a statement such as "Most of your taps came a little after the beat." No question is shown first; a question exists in the code ("What did you notice…?") but never appeared.
- Counts on every take: "3 of 4 sounds matched", a mark per beat or note, "Extra sounds: 1.", "8/8 On the beat" on the lesson summary.
- No "AI coach" label was seen on the feedback panel.
- Decision needed: keep the counts on the learner's screen, or show one fix and a retake and keep the counts for the teacher view; and whether the first message should be a question.

## 5. What worked

- Play (piano and drums), Learn (tracks, lessons, hints), My music (save, replay, delete), teacher sign-in and dashboard. The teacher view shows tries and skill bands per child and does not rank children.
- No key strings, tracking scripts or outside hosts in the built code. Manifest and service worker are served.

## 6. Not tested

- Real touch and multitouch, how it sounds, audio delay on a real phone, offline with the network cut, 16 of the 21 lessons, more than one player, other browsers, a screen reader.

## 7. Suggested fix order before the pitch on Wednesday 11 Nov

1. The count-in clock (section 1), then retest after 10 minutes of sound.
2. Play back ends on the take length (2.1).
3. Sound starts or is asked for on Play in My music (2.2).
4. Piano above the bottom nav at phone width (2.3).
5. Wording: Device tab, "With help", "crotchet".
6. The rest after the pitch.
