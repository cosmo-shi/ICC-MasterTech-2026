# Carmen phone checks (iPhone and Android)

A short checklist for a real phone. Playwright on a laptop cannot judge touch on glass, audio delay,
real microphones or multitouch, so these are the checks that decide whether a phone build is ready.
Write the result (Pass / Fail / Not tried), the phone model and the OS version for each run.

**Before you start**
- Phone model and OS version: ______  Browser: Safari / Chrome  Opened from: browser / home-screen icon
- Use the preview link for `sc`. Add `?debug=input` before the `#` to see touch events on screen
  (for example `https://…vercel.app/?debug=input#/play`).
- Ringer on, volume up, headphones out unless a step says otherwise.

## 1. Touch on the keyboard (release blocker)

| # | Do this | Expect |
|---|---|---|
| 1.1 | Hold three white keys with three fingers | All three notes sound together and stay lit |
| 1.2 | Lift the middle finger | Only that note stops |
| 1.3 | Slide one finger slowly across eight keys | Each key sounds once as you reach it, one at a time |
| 1.4 | Slide across black and white keys | Black keys sound too |
| 1.5 | Tap one key fast ten times | Ten notes, none missed or doubled |
| 1.6 | Hold a key, swipe up from the bottom edge (or pull down Control Centre) | Note stops; no stuck note when you come back |
| 1.7 | Lock the phone mid-note, unlock, play | Sound comes back on the first tap, or says it is starting |
| 1.8 | Receive a call (or set an alarm) while playing | Sound stops; the app works after the call |

## 2. Drums and layout

| # | Do this | Expect |
|---|---|---|
| 2.1 | Hit two drum pads at the same moment | Both sound and both light up |
| 2.2 | Hold the phone upright on Play | Instrument fills the space; a tip suggests turning sideways; you can still play |
| 2.3 | Turn the phone sideways | Wider keys, side rail, nothing cut off, no letters printed on keys |
| 2.4 | Turn back upright mid-lesson | Same lesson step; no stuck notes |
| 2.5 | Start a lesson try | Count-in clicks are even and the first beat lands on time |
| 2.6 | Settings → Bigger controls | Buttons at least as big as a fingertip; nothing overlaps |

## 3. Use my instrument (microphone)

| # | Do this | Expect |
|---|---|---|
| 3.1 | Play → Use my instrument → Use the microphone | Permission is asked only now |
| 3.2 | Say **Don't Allow** | Plain words on how to allow it in Settings; on-screen playing still works |
| 3.3 | Allow it | "Listening" with a Stop button; the level meter moves when you speak |
| 3.4 | Run Check timing (tap with the four clicks) | Finishes with a delay in ms; repeat once and note both numbers: ___ / ___ |
| 3.5 | Piano: play middle C on a real piano or another phone's piano app | Carmen names C4 (or says unclear, never a wrong note) |
| 3.6 | Rhythm: tap the pattern on a table | Taps counted; feedback says what happened, why, and a next step |
| 3.7 | Tap in a noisy room (talking, music) | Either correct, or "didn't hear clearly, this try doesn't count" |
| 3.8 | While listening, switch to another app and back | Listening has stopped; the iOS orange/green dot is gone |
| 3.9 | While listening, press Back | Listening stops |
| 3.10 | Press Record, play for 10 s, Stop, Save | Recording appears in My music; Listen plays it back |
| 3.11 | Delete that recording, then Undo within 8 s | It comes back; delete again and it stays gone |
| 3.12 | Turn on airplane mode, repeat 3.5 and 3.6 | Works the same (all listening is on the device) |

## 4. MIDI (Android Chrome; iPhone Safari has no Web MIDI)

| # | Do this | Expect |
|---|---|---|
| 4.1 | Plug in a USB MIDI keyboard (adapter as needed), choose MIDI | "MIDI connected" with the keyboard's name |
| 4.2 | Play a lesson on the MIDI keyboard | Notes are checked like on-screen notes |
| 4.3 | Unplug it mid-lesson | Plain message; on-screen keys still work |
| 4.4 | On iPhone, choose MIDI | Says MIDI isn't available in this browser; no crash |

## 5. Saving, teacher and app shell

| # | Do this | Expect |
|---|---|---|
| 5.1 | Just play → record a take → Save | Offers an optional name and says it stays on this device |
| 5.2 | I'm a teacher (service not configured) | Says school accounts aren't switched on; PIN is labelled "Device only. Not a school account." |
| 5.3 | Set a PIN, then Forgot the PIN? → Reset | Warns what is removed; learners' music stays |
| 5.4 | Share → Add to Home Screen, open from the icon | Carmen icon (sun over stave), no address bar, correct colours top and bottom |
| 5.5 | Switch the phone to dark mode with "Same as device" | Carmen goes to Night |

## Known not checked by the team yet
Everything above on a real device. Results from Carlos's iPhone run (10 Nov, before these fixes)
are in `docs/BUGS-iphone-test-2026-11-10.md`.
