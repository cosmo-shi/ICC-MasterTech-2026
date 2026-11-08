# Voice path proof protocol: is the microphone path real enough to test on nine adults?

- Date: Fri 6 Nov 2026 (AEDT), overnight draft; sources accessed 2026-11-06.
- Purpose: one pass or fail test for the voice path, run Saturday evening, that decides what we may say about it.
- Scope: Pitchy on a cheap Android phone (Chrome) and on the stage laptop; adult voices only; stand and Q and A claims, never the three minutes.
- Decision it feeds: build-plan-v1.md Saturday 19:00 CHECKPOINT D (voice path demo) and its cut rule (D4 option a).
- Status: overnight draft for the team; verify before the pitch. Nothing here has been run on a phone; every starred (*) number is our own setting.

## 0. Recommendation (conclusion first)
- Run the script in section 4 (about 80 minutes) on one named cheap Android phone and the laptop, Saturday 17:30 to 19:00.
- Pass = every row of the section 1 table green on the laptop AND on at least one phone. Anything less = fail.
  o Pass unlocks: a "tested prototype" mention at the stand and in Q and A, with the measured numbers and the sample size.
  o Pass also unlocks the nine-adult test on the passing device.
  o Fail: keyboard-only story for the week; voice appears only as a labelled recorded take run through the real detector.
- Never on stage, pass or fail: "accurately detects pitch", "listens to you sing", "works on any phone".
  o Reason: accessibility-design-v1.md withholds the accuracy claim until a phone test logs error against known notes; this file is that test.

## 1. The pass bar (what "the voice path works" means in numbers)
- Sources for each row are local files unless a star says the number is ours.
- Named phone: not yet chosen (see Open questions). Working definition: Android 10 or later, about 2 GB RAM, about A$135 to A$180 [L2].

| Measure | Definition | Pass on phone | Pass on laptop | Where the number comes from |
|---|---|---|---|---|
| Reference-tone pitch error | Median absolute cents error of the stable middle of each reference tone, `1200 x log2(measured / reference)` | 10 cents or less | 10 cents or less | tech-pitch-detection.md s9 pass mark ("within 10 cents of a reference tuner"), a team choice [L1] |
| Reference-tone spread | 95th percentile of absolute error over accepted frames | 50 cents or less* | 50 cents or less* | Our setting; 50 cents is the contract's in-tune band [L4] |
| Sung held-note pitch error | Median absolute difference between the live tracker and the second method (section 4 step 6) over the held 1.5 s window | 20 cents or less* | 20 cents or less* | Our setting; not a published Pitchy figure (section 2 note on accuracy) |
| Octave errors | Notes reported 12 semitones off the reference | 0 on tones; 1 or fewer in 15 sung notes* | same | Synthetic test had 0 [L1 M1]; real rooms unknown; sung limit is ours |
| Onset timing error, tones | Detected onset minus the known start in the played tone, after loopback correction | median 50 ms or less*, worst 100 ms or less* | same | Our setting; the matcher window is up to 400 ms (375 ms at 80 bpm) [L4], so the tracker must sit well inside it |
| Onset timing error, sung | Detected onset minus onset hand-marked on the waveform of the saved test recording | median 100 ms or less*, 90th percentile 200 ms or less* | same | Our setting; onset rule is the 80 ms pitched run, itself a hypothesis [L1 s3] |
| False-note rate | Note events emitted when nothing was sung or played | 0 in 60 s of quiet room; 1 or fewer in 60 s with TV noise* | same | Quiet row is ours; TV row is ours |
| Whole-loop sung takes | Of five sung takes of the ONE scored phrase (Ode bars 1 to 2, eight notes, fixed before the test), takes matching at least 6 of 8 notes, with the intended cue shown | 3 of 5, and one retake reaches proof | same | build-plan-v1.md checkpoint D bar [L3]; the other two phrases are logged, not scored (Codex 2) |
| Valid-frame rate and misses | Share of frames in each held window that pass the accepted-frame gate; notes with no reading at all | 80% or more*; a note with no reading counts as a miss and a fail of that note | same | Our setting; stops a tracker looking precise by rejecting hard frames (Codex 2) |
| Missed and extra onsets | Expected notes with no onset inside the matcher window; onsets emitted with no note | 1 or fewer missed in 15 sung notes*; 0 extra in the quiet room | same | Our setting; timing rows above cover detected onsets only (Codex 2) |
| Dropped frames, long run | Frames lost over a 10-minute continuous session of repeated takes | 2% or less* | same | Our setting; short runs miss slow failures (Codex 2) |
| Cold start | Tap to the opening valid pitch reading, mic permission already granted, tab freshly opened | 3 of 3 starts at 3 s or less* | 3 of 3 at 2 s or less* | Three cold starts is the floor test in accessibility-design-v1.md [L2]; the seconds are ours |
| Sustained-note level | RMS of a held 5 s steady note, 4 s window against the opening second | drops by less than 6 dB* | same | Our setting; see section 2 gain pitfall [11] |
| Interruption | Lock screen, switch tab, return | Clear Resume shown, mic recovers | same | accessibility-design-v1.md Monday test step 7 [L2] |

- Each row also logs: Chrome version, sample rate, applied mic settings, dropped frames, room noise level.
- "Accepted frame" = clarity at least 0.9 (team choice, same gate as the wobble rule) [L1][L5].
- No row passes on a "minimum pass"; one red row on a device = that device fails.
- One verdict per complete combination: device, Chrome version and path (worklet, analyser or fallback). A pass cannot be assembled from different paths (Codex 2).
- The claim is limited to the tested model, Chrome version and voices; a better phone than the target class gives no pass for the target (Codex 2).
- Sung notes: the Twinkle phrase has 7 notes, so its whole-loop bar is 5 of 7*; only the Ode phrase carries the 6 of 8 bar.

## 2. Pitchy integration steps for a single-file prototype
- Library facts checked on the repository, its source and its demo page tonight.
  o Pitchy is an ES module only (README: "as of v4, Pitchy is distributed as a pure ES module") [1].
  o So the script tag must be `<script type="module">`; a classic script tag will not load it.
  o README's CDN line is `import { PitchDetector } from "https://esm.sh/pitchy@4"`; pin the exact version instead, `pitchy@4.1.0` (our pin from tech-pitch-detection.md [L1]).
  o Licence: the README says 0BSD (and has a stray "zig-xml" line, a copy-paste slip) [1]; npm says MIT per [L1].
- Online prototype (Saturday proof build only):
  o `import { PitchDetector } from "https://esm.sh/pitchy@4.1.0";` or the jsDelivr `/+esm` form already in tech-pitch-detection.md s8.
  o Offline build: no CDN at runtime; save the bundled module into the app and precache it (accessibility-design-v1.md rule). The bundled-file path is `unverified` until run once in airplane mode.
- Detector setup, read from the 4.1.0 source (`index.js`, 18,393 bytes) [2]:
  o `PitchDetector.forFloat32Array(n)`; `findPitch(input, sampleRate)` returns `[hz, clarity]`; input length must equal n [1][2].
  o Below the volume gate it returns `[0, 0]` [2].
  o `clarityThreshold` (default 0.9) is the MPM peak-picking constant `k`, NOT an accept or reject gate [2]. Our gate is separate: accept a frame only if the returned clarity is 0.9 or more (team choice) [L1].
  o `minVolumeAbsolute` is an RMS floor, default 0.0 [2]. Set it from the room-noise check (snippet used 0.005, a team choice) [L1].
  o `minVolumeDecibels` converts with `10 ** (dB / 10)` on an amplitude [2]; that is a power formula, so -40 dB gives 0.0001. Use `minVolumeAbsolute` and skip decibels.
  o Pass `ctx.sampleRate`, never an assumed 44,100 or 48,000 [L1].
- Buffer size: 2048 samples = 42.7 ms at 48 kHz (46.4 ms at 44.1 kHz) is enough for sung notes down to about 80 Hz (3.5 periods at 48 kHz, our arithmetic).
  o Use 4096 (85 ms) only if the low male range fails the test; it delays every reading.
  o Hop: read a fresh window every 512 samples (10.7 ms at 48 kHz, our arithmetic). Fast enough; compute cost on phones is unmeasured (0.06 ms per frame was a desktop figure) [L1].
- Clock: AudioWorklet is the timing path, not the animation loop.
  o MDN: `currentFrame` is the "ever-increasing current sample-frame of the audio block being processed", up 128 after each block [7].
  o MDN: a block holds 128 frames now, "may in fact vary", so read each array's `length` [8].
  o ms = frame / sampleRate x 1000. Sample i of a block has frame index `currentFrame + i`. Post the frame index with each result to the main thread.
  o Return `true` from `process()` "at least on Chrome" (MDN note) [8].
  o A single file can load worklet code from a Blob module URL: Codex lead, not tested here (`unverified (Codex knowledge)`).
- ScriptProcessorNode is the last resort only: MDN marks it deprecated, sizes 256 to 16384 as powers of two [9].
  o Do not use it on stage; only if AudioWorklet will not start on the test phone, and log that it did.
- AnalyserNode loop (the snippet in tech-pitch-detection.md s8) is fine for the live pitch line, rough for onsets (screen-rate jitter) [L1].
- Microphone constraints:
  o Ask `{ echoCancellation: false, noiseSuppression: false, autoGainControl: false }`.
  o MDN on echoCancellation: a plain value is a request; the browser "will not fail if this can't be done" [4].
  o Only `{ exact: ... }` is required and then fails with an error [4].
  o MDN's page says nothing on noiseSuppression or autoGainControl [4]; these two are `unverified` on MDN, the settings read-back below covers them.
  o `getSettings()` "identifies the current values of every constrainable property", including platform defaults [6]. Log it; if any still reads true, the setting did not take.
  o Browsers "ignore any constraints they're unfamiliar with" [4], so a typo fails silently; log `getSupportedConstraints()` too.
- Real gain pitfall for held notes, one reported case: a discuss-webrtc thread reports a held vowel fading to inaudible after about 3 seconds on Chrome 119, worst on a Samsung A7 tablet and milder on a Pixel 7 [11].
  o Setting noiseSuppression and autoGainControl false changed nothing for that poster; `echoCancellation: {exact: false}` fixed it for them on several Chrome devices [11].
  o The same poster says Chrome 126 later threw OverconstrainedError on that Pixel; one person's report, not verified [11].
  o Our test: hold a steady note 5 s and log RMS (section 1). Wire it as `exact: false` inside try/catch with the plain request as fallback.
  o Chrome's hardware noise-suppression change was described for macOS only, not Android [12]; so there is no Chrome page here that explains phone-side processing. Treat per-phone processing as `unverified` until the sustained-note row is measured.
- Permission flow (Chrome on Android):
  o `getUserMedia` needs HTTPS or localhost; elsewhere `navigator.mediaDevices` is undefined and use throws a TypeError [5]. localhost reaches only the machine it runs on, so the phone needs the HTTPS deploy [L1 s9].
  o Call it only after a tap, then the prompt appears; the user "may ignore the request", so the promise can neither resolve nor reject [5]. Show a "waiting for the microphone" state, and a timeout hint at 10 s*.
  o Denial gives `NotAllowedError` [5]. Chrome Help recovery: Settings, Site settings, Microphone, tap the site under Blocked, Allow [10]. If the Chrome app itself is off in Android settings, fix it there [10].
  o Chrome says an allowed site can record only while you are on it and cannot start recording after you switch tab or app [10]. Treat background as mic lost; resume needs a tap.
  o AudioContext starts inside the same tap (Pitchy's own demo page offers a resume button because Chrome blocks audio before a click) [3].
- Accuracy expectation, honestly: no published cents error for Pitchy on cheap phones was found.
  o The only sung-voice figure found: YIN's gross pitch error (frames more than 20% from truth) was 9.02% for baritones and 3.51% for countertenors on one database [14].
  o A different tracker and dataset; it shows low male voices are the hard case. Soprano figure unverified.
  o So the low-voice reference tones (Bb2, C3) are in the script on purpose.

## 3. The offline fallback: plain autocorrelation
- Offline fallback is the roughly 50-line autocorrelation; SwiftF0 is online-only (5.9 MB precached, over the 5 MB cap) [L2][L1].
- In plain words:
  o Take the last 2048 samples. Compare the sound with a copy of itself slid sideways, one sample at a time.
  o When the slide equals one period of the note, the copy lines up and the match score peaks. Pitch = sample rate / slide length.
  o The cwilso demo (MIT) does this: an RMS gate at 0.01, a trim at 0.2, a plain nested-loop sum, a parabola fit around the peak [13].
  o Its code returns -1 for "too quiet", and has no confidence number ("TODO: paint confidence meter") [13]. The fallback must add its own.
  o It can return NaN if no peak is found (observation from the code, no guard) [13]; add the guard.
  o Cost grows with the square of the window; that is the slowest path on a cheap phone [13]. Cap the hop at 20 ms* on the fallback.
- Known failure modes (the method's usual faults; the cwilso fixed thresholds are not level-adaptive [13]):
  o Octave errors: the second, third period also match, so a low or weak fundamental can read an octave off.
  o Breathy or consonant onsets: no clear period for the opening frames; energy fires before pitch exists.
  o Quiet singers and noise: the 0.01 gate is fixed, so a soft voice reads as silence and TV noise can read as a note.
  o Vibrato and glides smear the peak [L1 M1].
- When the app must say "could not hear that" and not guess (all starred, our setting, except the top two which reuse the wobble rule [L5]):
  o Level under the room-noise gate, or clarity (correlation peak height, normalised) under 0.9 on the fallback too*.
  o Fewer than 70% of frames voiced in the scored window, or any unvoiced gap over 200 ms [L5].
  o A frame 900 cents or more from the window median is dropped; over 10% dropped = unscorable [L5].
  o Note 12 semitones off the range check's expected octave: flag "octave", never silently fix it (demo-phrase-and-rights.md risk table) [L6].
  o Target above the learner's high full note: say "above your range for now", not a pitch verdict [L1 s6].
  o If both trackers run in the test and disagree by more than 50 cents*: report neither.
- Test the fallback with the same section 4 script on the phone, airplane mode on; its pass bar is the section 1 table minus the 3 s cold-start line (it may take 5 s*).

## 4. Saturday evening test script (about 80 minutes; steps 1 to 7 in the 17:30 to 19:00 slot, step 8 may run after 19:00)
- Run by Justin (voice code) and Simone (scorer and table); Carlos deploys the HTTPS build and tags the commit [L3].

### Devices and set-up
| Item | Need | Log |
|---|---|---|
| Cheap Android phone | One, borrowed, Android 10 or later, about 2 GB RAM; second one if available | Make, model, Android version, Chrome version (Chrome menu, Settings, About Chrome) |
| Stage laptop | The one that will be on the stage | Chrome version, headset or built-in mic |
| Second device | A phone or laptop running a tuner app, as the independent check | App name, version |
| Reference speaker | Any small speaker separate from the test phone (a phone speaker may not reproduce 117 Hz) | Placed 30 cm from the microphone |
| iPhone | Optional, out of this file's bar | Result noted only |
- Chrome version rule: log it; run the sustained-note and constraint rows again if the borrowed phone's Chrome is older than the other test device's.
- HTTPS build with the voice debug line: sample rate, applied settings, worklet or fallback path, clarity, RMS, frame index.
- Test recordings: adults on the team only; stay on the test device; delete the files Sunday; the take record never holds audio [L4].

### Rooms
- Room A: quiet. Before anything else, log 10 s of room RMS; set `minVolumeAbsolute` from it (team choice).
- Room B: TV on at conversational volume, 2 m from the microphone. Log RMS again.
  o Freeze every threshold, the volume gate included, before Room B; Room A's setting is the test setting.
  o In Room B run a quiet-singing take as well as the false-note minute, so a raised gate cannot hide missed soft notes (Codex 2).

### Phrases and tones
- Three candidates sung on "loo" (consonants break the line) [L3][L6]: Twinkle bars 3 to 4; Ode bars 1 to 2; Ode bars 5 to 8.
- Key: the adult fallback range Bb3 to G4 gives a shift of -2 semitones (demo-phrase-and-rights.md s5) [L6].
  o Twinkle bars 3 to 4 then sits Eb4 Eb4 D4 D4 C4 C4 Bb3 (C major shape moved down two).
  o Ode phrases shift by the range check, same rule.
  o Men often sing it an octave lower [L6]; if the singer does, re-run with the low reference tones.
- Reference tones from the synth (equal temperament, `440 x 2^((m - 69)/12)`, our arithmetic): Bb2 116.54 Hz, C3 130.81, Bb3 233.08, C4 261.63, D4 293.66, Eb4 311.13, G4 392.00.
  o Two paths each: direct (oscillator into the detector, no air; isolates the software) and acoustic (reference speaker into the microphone).
  o Each tone 3 s, then 1 s silence; three repeats. A silent 60 s and a 60 s of speech with no singing (false-note row).

### Run order
| Step | Minutes | Action |
|---|---|---|
| 1 | 5 | Open the HTTPS page on the phone; tap; read the permission flow; log settings and sample rate; deny once, recover through Chrome Help steps, allow |
| 2 | 5 | Direct tones into the detector; compare with the table; cold start x3 (close the tab, reopen, time tap to the opening reading) |
| 3 | 10 | Acoustic tones, Room A, then Room B; plus 60 s silence and 60 s speech; count false notes |
| 4 | 5 | Sustained note: sing or play one steady note 5 s; log RMS at 1 s and 4 s; repeat on the laptop |
| 5 | 20 | Sung takes: 5 takes per candidate phrase, count-in, headphones or guide muted after the count (a speaker guide gets tracked) [L4]; a retake after the cue |
| 6 | 5 | Cross-check: run the saved take through the second method (Node on the laptop: Pitchy at 4096, and the autocorrelation) and read the tuner app on three held notes; mark onsets by hand on the waveform. Weakness: both software methods can share an octave error, and the tuner covers only three notes, so a scorer listens to every flagged note and the claim says "against our reference", not "accurate" (Codex 2) |
| 7 | 5 | Interruptions: lock the screen, switch tab, revoke the mic in Site settings, return; then airplane mode, reopen |
| 8 | 10 | Fallback offline: airplane mode, autocorrelation path, every applicable section 1 row (tones, false notes, five takes); then a 10-minute continuous session on the main path for the dropped-frame row. Run after 19:00 if the slot is full; the offline claim waits for it |

- If time is short, drop the second and third phrases before anything else; never drop steps 1, 3, 4.

### Results table (one row per measurement, copy into a sheet)
| Device | Chrome | Room | Path (worklet / analyser / fallback) | Item | Reference | Measured | Error | Accepted? | Notes (octave, dropout, gain fade) |
|---|---|---|---|---|---|---|---|---|---|
| | | | | | | | | | |
- Totals per device: the section 1 row values, one pass or fail word per row, signed by the scorer (Simone) and the voice lead (Justin).

### The call (19:00)
- Pass: every row green on the laptop and on at least one phone. Write "PASS, device, Chrome version, date" in decisions-log.md terms and tell Carlos.
- Fail on the phone only: laptop-only pass. Voice stays a laptop claim; the "in your pocket" line is dropped.
- Fail on the laptop: fail. One red row on the laptop is a fail for the stage.
- Fail by accuracy only, with the path otherwise working: one trial of SwiftF0 online on the same tones (tech-pitch-detection.md says an accuracy fail triggers it) [L1].
  o Not before 20:00, never at the cost of the 19:00 to 20:00 keyboard runs [L3].
- Cut rule, from the build plan [L3]: voice fails the checkpoint bar = no live voice (D4 option a).
  o T11 to T14 (voice and phone) is the earliest outright cut.
  o The fallback is a recorded take run through the real detector, labelled, or canned feature JSON.
  o A recorded voice claim needs its own passing detector replay [L3].

## 5. What a pass unlocks, what a fail changes
### After a pass: lines allowed at the stand and in Q and A (fill the brackets only with measured values)
- Allowed:
  o "We built a prototype that listens through the phone microphone. We tested it on [n] phone and a laptop, with [n] adult voices."
  o "In our test the median difference from our reference was [x] cents on [n] notes. Children and other phones are untested."
  o "The stage demo uses the keyboard; the voice path is a tested prototype beside it."
  o "Nothing is recorded to a server; the test recordings stayed on the device and were deleted." Only if the privacy note still holds.
- Not allowed, pass or fail:
  o "Accurately detects pitch", "listens to you sing", "works on any phone", "works for children", "no mobile data".
  o Any figure without the sample size and the device beside it.
  o Any mention in the three-minute pitch; the voice path is stand and Q and A only.
- Nine-adult test: GO on the passing device, same device for all nine. Count the device in the sheet.
  o If only the laptop passed, the nine sit at the laptop; the phone-based success criterion C5 (offline cold start on one named phone, 3 of 3) is then unmet and the team must say so [L5].
### After a fail
- Stage and Q and A line: "Voice is designed and not yet proven; today's demo is the keyboard." Never "coming soon with accuracy of".
- Nine-adult test: NO-GO for the voice measures. The wobble count (C1) needs the voice tracker; the team must decide what the nine test measures without it (Open questions).
- Fallback for the week: keyboard-only story; voice appears only as a labelled recorded take through the real detector, or canned feature JSON [L3]; no live-voice claim anywhere.
- Re-test only if a fix is built and the whole table is rerun on the same phone; no partial rerun counts.

## Method
- Codex 1: gpt-6-sol, medium, knowledge draft of pitfalls and Pitchy wiring.
  o Kept after checking: acoustic low-tone test, onset via short-window RMS rather than first pitch.
  o Kept after checking: `clarityThreshold` is the MPM constant (confirmed in source), `minVolumeDecibels` maths (confirmed in source).
  o Kept after checking: AudioWorklet frame clock (confirmed on MDN).
  o Kept after checking: the YIN baritone figure (baritone 9.02 and countertenor 3.51 confirmed in the paper PDF; the soprano figure not confirmed).
  o Not kept as fact: Blob worklet URL, the Android pre-processing page (not opened), the 80/120/200/400 Hz tone set (replaced with phrase notes) .
- Codex 2: gpt-6-sol, medium, critique of sections 1 to 4 with names stripped ("what makes a false pass").
  o Kept: valid-frame rate and misses row, missed and extra onsets row, one scored phrase (Twinkle has 7 notes against the "6 of 8" bar).
  o Kept: one verdict per device and path, full fallback rows offline, frozen gate in Room B, tested-model-only claim.
  o Kept: dropped-frame limit with a 10-minute run, shared-error caveat on the cross-check.
  o Not kept: nothing rejected; the cross-check weakness is stated, not solved.
- Pages opened: Pitchy README and 4.1.0 source (jsDelivr file read by script), Pitchy demo page.
  o MDN (getUserMedia, echoCancellation, getSettings, AudioWorkletGlobalScope.currentFrame, Using AudioWorklet, ScriptProcessorNode).
  o Chrome Help (Android site permissions), discuss-webrtc thread, Chrome blog (hardware noise suppression).
  o cwilso PitchDetect source, Interspeech 2018 paper PDF (text extracted).
- One web search (generic: Chrome Android audio constraints).
- Not done: nothing run on a phone or in a browser; the Pitchy docs site listed in the README has only a demo page, no API reference; MDN's noiseSuppression and autoGainControl pages not opened.
- Local files read (sections only): tech-pitch-detection.md, accessibility-design-v1.md, build-plan-v1.md, take-data-contract.md, nine-student-test-plan-v1.md, demo-phrase-and-rights.md.

## Open questions
- Which cheap Android phone is borrowed, and its Chrome version? The named phone is a blank until Saturday.
- Are the starred numbers acceptable to the voice lead and the scorer, or should a tighter or looser bar be fixed before 17:30?
- What does the nine-adult test measure if the voice path fails (the wobble count needs the tracker)?
- Is a Blob-URL AudioWorklet allowed under the deployed host's content security policy? Untested.
- Is an independent tuner app (a second method) accepted as the reference for sung notes, given its own error is unmeasured?
- Does the noise-suppression and gain behaviour on the borrowed phone fade held notes? Only the sustained-note row answers it.
- Is the esm.sh bundled Pitchy file safe to precache for the offline build? Not tested in airplane mode.

## Sources
- Local files [L1] to [L6] (this folder, read 2026-11-06): [L1] tech-pitch-detection.md; [L2] accessibility-design-v1.md; [L3] build-plan-v1.md; [L4] take-data-contract.md; [L5] nine-student-test-plan-v1.md (s7 wobble rule); [L6] demo-phrase-and-rights.md.
1. Pitchy README, https://github.com/ianprime0509/pitchy, 2026-11-06, opened
2. Pitchy 4.1.0 source, https://cdn.jsdelivr.net/npm/pitchy@4.1.0/index.js, 2026-11-06, opened (downloaded and read)
3. Pitchy demo page, https://ianjohnson.dev/pitchy/, 2026-11-06, opened (redirect from ianprime0509.github.io/pitchy)
4. MDN, MediaTrackConstraints.echoCancellation, https://developer.mozilla.org/en-US/docs/Web/API/MediaTrackConstraints/echoCancellation, 2026-11-06, opened
5. MDN, MediaDevices.getUserMedia, https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia, 2026-11-06, opened
6. MDN, MediaStreamTrack.getSettings, https://developer.mozilla.org/en-US/docs/Web/API/MediaStreamTrack/getSettings, 2026-11-06, opened
7. MDN, AudioWorkletGlobalScope.currentFrame, https://developer.mozilla.org/en-US/docs/Web/API/AudioWorkletGlobalScope/currentFrame, 2026-11-06, opened
8. MDN, Using AudioWorklet, https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Using_AudioWorklet, 2026-11-06, opened
9. MDN, ScriptProcessorNode, https://developer.mozilla.org/en-US/docs/Web/API/ScriptProcessorNode, 2026-11-06, opened
10. Google Chrome Help, site permissions on Android, https://support.google.com/chrome/answer/2693767?hl=en&co=GENIE.Platform%3DAndroid, 2026-11-06, opened
11. discuss-webrtc, "How to avoid loudness reduction for sustained tones?", https://groups.google.com/g/discuss-webrtc/c/PDZYMzAI-_Y, 2026-11-06, opened (user reports, not verified)
12. Chrome for Developers, disabling hardware noise suppression, https://developer.chrome.com/blog/disabling-hardware-noise-suppression, 2026-11-06, opened (macOS only)
13. cwilso PitchDetect, pitchdetect.js, https://github.com/cwilso/PitchDetect, 2026-11-06, opened (raw js/pitchdetect.js)
14. Kadiri and Yegnanarayana, Interspeech 2018, https://www.isca-archive.org/interspeech_2018/kadiri18_interspeech.pdf, 2026-11-06, opened (text extracted; baritone and countertenor YIN GPE read; soprano unverified)
