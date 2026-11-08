# Demo instrument decision: one instrument on stage (memo for Sunday)

- Date: Fri 6 Nov 2026 (AEDT), overnight draft. Built on the team leans; for the team to confirm or overturn on Sunday.
- Purpose: one decision memo for the single instrument in the Wednesday 60-second demo, with set-up, fallbacks and rehearsal rule.
- Recommendation: USB MIDI keyboard into laptop Chrome, on-screen keys as fallback; voice stays Carlos's story, shown as a still.
- Status: overnight draft for the team; verify before the pitch. Scores are team judgement, not measurements.

## 1. Recommendation
- Live instrument: a 25 to 32 key USB MIDI keyboard into Chrome on the stage laptop (score 96 of 125).
  o Voice scores 86, a real keyboard heard through a microphone 75 (section 2).
  o Same lean as state-of-play s6 and s7, build-plan-v0.md s1 and tech-keyboard-input.md s1.
- Why: exact note events, no microphone in a noisy expo hall, least to build by Tuesday's 15:00 freeze.
- The price: MIDI does not "hear". On stage say "it knows every note you play"; never "it hears you" (pitch-v0.md beat 3 rule).
- Voice carries the "it can hear what videos cannot" proof through Carlos's true story and one still (section 6).
- Overturn rule: voice becomes the live instrument only if Saturday's noisy-room voice test passes AND the loop is ahead of plan.
  o The test must run the whole voice loop (take, cue, retake, proof) with crowd noise playing, not pitch tracking alone.
  o A small score change can tie or flip the totals; that test is the swing (section 2 sensitivity).
- Demo arc follows build-plan-v0.md: take 1 = labelled replay of a captured take; the retake is played live.
- Final call: Simone, who leads the music research, on Sunday (section 9).

### Contradictions in the team files this memo settles (team to confirm)
| File | Says | This memo says | Why |
|---|---|---|---|
| pitch-v0.md s4 | Variant A on-screen keys on a tablet (default); variant B real keyboard through the phone mic; no MIDI | MIDI keyboard on the laptop is the default; on-screen keys are fallback 1 | Build plan and keyboard note both pick MIDI; iPad has no Web MIDI |
| pitch-v0.md s3 slide 4 | Phone or tablet mirrored full screen | Laptop Chrome on HDMI; phone only as a prop if Monday's test passes | build-plan-v0.md s4: fewest links, no wireless mirroring |
| pitch-v0.md s4 | Take 1 played live with a planted rush | Take 1 is a labelled replay; only the retake is live | A clean first take "kills the beat" (pitch-v0.md itself); replay makes the cue repeatable |
| functional-requirements-v0.md header | Scope: one instrument, voice | Voice is the story; keyboard is on stage | Requirements still hold; the loop is the same for both |
| pitch-v0.md variant B | "Real keyboard, phone microphone" | Needs a keyboard that makes its own sound | A MIDI-only controller is silent; the Korg nanoKEY2 has no sound engine or speaker [7] |

## 2. Weighted criteria table
- Scores 1 (weak) to 5 (strong); weights sum to 25; maximum 125. Cell = score / weighted points.

| Criterion | Weight | A: keyboard via MIDI, on-screen fallback | B: voice via phone or headset mic | C: keyboard heard through the mic |
|---|---:|---:|---:|---:|
| Reliability in a noisy expo hall | 5 | 5 / 25 | 2 / 10 | 2 / 10 |
| Visual clarity for a judge 10 m away | 3 | 5 / 15 | 3 / 9 | 4 / 12 |
| Proof value: "it can hear what videos cannot" | 4 | 2 / 8 | 5 / 20 | 4 / 16 |
| Build effort in three days | 4 | 5 / 20 | 2 / 8 | 3 / 12 |
| Match to the presenter's true story | 2 | 2 / 4 | 5 / 10 | 2 / 4 |
| Match to the target learner | 3 | 3 / 9 | 5 / 15 | 4 / 12 |
| Hardware risk on stage | 3 | 4 / 12 | 3 / 9 | 2 / 6 |
| Cost | 1 | 3 / 3 | 5 / 5 | 3 / 3 |
| **Total / 125** | 25 | **96** | **86** | **75** |

### Why each score (evidence, short)
| Criterion | A: MIDI | B: voice | C: keys by mic |
|---|---|---|---|
| Noisy hall | Discrete note events, no mic guessing (tech-keyboard-input.md s1) | Expo halls measured about 62 to 79 dB(A) in one student study [1]; tracker tested on synthetic tones only (tech-pitch-detection.md M1) | Same mic risk; piano-like synthetic notes all right in M1, real room untested |
| 10 m clarity | Lit keys plus ghost and played bars on one grid; hands visible on a real keyboard | A pitch line works; singing has no visible "action" | Same screens as A; line may stutter on misreads |
| Proof value | Reads keys, does not listen; still "knows what you did", which a video cannot | Listens to the learner's own sound | Listens to an acoustic instrument |
| Build effort | Note numbers exact; about 45-line Web MIDI snippet (tech-keyboard-input.md s10) | Tracker plus V1 to V12 thresholds to tune on real takes (tech-feedback-layer.md s3) | Tracker plus onset detection, single notes only |
| True story | Not Carlos's instrument; Stanley's steer | Carlos's measured record (evidence file, n = 1) | Not his story |
| Target learner | Kids start on keyboard (Stanley); a learner without access has no MIDI keyboard, so on-screen keys carry the access story | Needs nothing but a phone: the strongest access fit | Uses a home or school piano, no cable |
| Hardware risk | One USB cable; Chrome permission prompt since Chrome 124 (tech-keyboard-input.md s3) | Phone mirroring or a USB headset; stage PA bleed | Needs a sounding keyboard plus mic placement plus PA bleed |
| Cost | About A$90 to A$130 (tech-keyboard-input.md s3) | Phone free; headset price `unverified` | Borrow or buy a sounding keyboard; price `unverified` |

### Sensitivity (does the answer survive a different weighting?)
| Change | A | B | C | Winner |
|---|---:|---:|---:|---|
| As scored | 96 | 86 | 75 | A |
| Proof weight 5 and story weight 4 (the "pitch is the story" view) | 102 | 101 | 83 | A, by 1 |
| Voice reliability 4 (a headset mic passes the noisy-room test) | 96 | 96 | 75 | Tie: build effort decides, so A unless the loop is ahead |
| Reliability weight 3 (a quiet stage, not the expo floor) | 86 | 82 | 71 | A |
| Codex re-score: MIDI reliability 4 and clarity 4 until the stage kit is tested | 88 | 86 | 75 | A, by 2 |
| Codex re-score plus voice reliability 3 (headset passes a full-loop noise test) | 88 | 91 | 75 | B |
- Codex draft (no web, input to this memo) scored the same order on 155 points: 112, 108, 91.
- Reading: A wins on risk, not on story. If the team weights the story above everything, voice is a fair choice, with more build risk.
- The margin is thin: until Monday's stage test, A's 5s are provisional; a voice test that runs the whole loop (cue and retake, not just pitch) in crowd noise can flip it.

## 3. Stage set-up for the recommended option
- Venue fact: the pitch is a live stage presentation in the Cisco Live World of Solutions at MCEC, then an expo showcase (key-facts-info-pack.md).
- Stage AV (screen, PA, mics, table) is not in the team files: ask on Monday afternoon at the venue.

### Devices and cables
| Item | Choice | Note |
|---|---|---|
| Stage laptop | Chrome, app on localhost, full screen, phone-width layout scaled up | Web MIDI needs a secure context and localhost is one (build-plan-v0.md s4); offline also needs the cached build, so run the cold-reload test |
| Keyboard | Korg nanoKEY2 (25 keys) or M-Audio Keystation Mini 32 MK3, class compliant | nanoKEY2 has a mini-USB port, bus powered, no own sound [7] (snippet) |
| Keyboard cable | Mini-USB (or the model's own) to the laptop's port, plus adapter if USB-C only | Carry a spare of the exact cable and the adapter (tech-keyboard-input.md s8) |
| Display | HDMI from laptop to venue screen, Duplicate (mirror) mode | No wireless casting on venue Wi-Fi (build-plan-v0.md s4) |
| App sound | Laptop audio over HDMI to the venue PA if routed; else visual only | The keyboard is silent; the app's synth is the only sound. Test Monday |
| App microphone | None in option A | Laptop mic stays the voice fallback path only (build-plan-v0.md s4) |
| Presenter mic | Hands-free (lapel or headset) for the player, who talks and plays | Ask AV; a handheld mic leaves one hand for the keys |
| Backup | Second laptop with the same build, seed data and recording; recording also on a phone | build-plan-v0.md s9 "stage laptop dies" |

### Screen readability from 10 m
- Rule of thumb: smallest element height about 1/200 of the farthest viewing distance (DISCAS basic decision making) [2] (opened; third-party calculator).
  o Our arithmetic: 10 m / 200 = 50 mm tall on the screen for the cue text and the number.
  o A planning floor, not proof: the 10 m check in the room decides.
- Stage layout: one cue sentence, one number, lit keys; nothing smaller than the cue type; check from 10 m in rehearsal.

### Who stands where (judges' view)
| Person | Place | Job |
|---|---|---|
| Justin (demo, per pitch-v0.md) | Beside the screen, at the keyboard on a table at standing height, angled 45 degrees to the judges | Plays the live retake, narrates |
| Carlos | Same table, behind the laptop, eyes on the screen | Starts the replay, owns both fallbacks, says nothing during the demo |
| Simone | Front of the screen for her beat, then one step back | Problem beat; out of the sight line during the demo |
- Roles are pitch-v0.md's; if Simone plays keyboard better, she takes the keys (section 9).

## 4. The 60-second demo, beat by beat
- Clock matches pitch-v0.md beat 4 (1:00 to 2:00); the arc follows build-plan-v0.md s6.
- Phrase: Ode to Joy melody, bars 1 and 2 only (8 quarter notes, E E F G G F E D), own synth, public domain (build-plan-v0.md s6).
  o Fit check, our arithmetic: 8 beats plus a 4-beat count-in at 80 bpm = 9 s; a four-bar phrase at 63 bpm needs about 19 s and breaks the slot.
- Take 1 (captured Saturday): rushes from note 5 on, plus one wrong key not on note 1.
  o Then only rule K3 "you speed up" fires (tier 6); a wrong first note would fire K1 (tier 3) instead (tech-feedback-layer.md s3).
  o One wrong key in 8 is below K2's 30% line, so it shows red but gets no cue: the app picks one fix (R5).

| Clock | Seconds | Screen | Justin | Words |
|---|---:|---|---|---|
| 1:00-1:08 | 8 | Goal card "play this song for Mum"; small goal "first phrase, steady"; two progress lines | Points at the card | "My goal is the song. Today's small goal: the first phrase, steady." |
| 1:08-1:20 | 12 | Take 1 replay, labelled "take 1, recorded Saturday"; played bars drift ahead of ghost bars; one red key | Watches the screen | "My first try." |
| 1:20-1:30 | 10 | One-fix card: "You speed up as you play. Let the click lead." Ghost bars show the beat. Number: "On the beat: 4 of 8" | Reads it | "One thing, in plain words, and it shows me what it wanted." |
| 1:30-1:42 | 12 | Count-in, then the live retake; lit keys; played bars on the ghost bars | Plays live on the MIDI keyboard | (none) |
| 1:42-1:50 | 8 | Proof card: "On the beat: 4 of 8 to 8 of 8"; skill line ticks up; goal line moves | Points at both lines | "The retake shows it worked. My goal moved, and my skill moved." |
| 1:50-2:00 | 10 | Ceiling card: next step needs a teacher; share recording and fix list (mock) | Taps share | "And when the next step needs a real teacher, it offers me one." |
- The single before-and-after number: "On the beat: 4 of 8 to 8 of 8".
  o Illustrative: the real "before" comes from the captured take; the "after" is whatever the live retake scores.
  o A live 7 of 8 still shows the change; never edit the number by hand.
- The retake has 3 s of slack (9 s of a 12 s slot): one key press starts the count-in; the proof card appears by itself after note 8.
- If the retake does not improve, the app keeps the same cue and slows the click (persistence rule, tech-feedback-layer.md s3).
  o Line: "Not yet. Same one fix, slower click. One thing until it works." Truthful, and it still shows the loop.
- Label the replay on screen and in words; the live part is the retake, said plainly.

## 5. Two failure fallbacks
| # | Trigger | Fallback | Who | Stage cost |
|---|---|---|---|---|
| 1 | No note on screen within 2 s of the first retake key, or the keyboard missing from the input list | Re-plug once (the page listens for state changes); then on-screen keys: laptop letters A S D F G H J K play C to C | Carlos switches; Justin plays on the laptop keys | 5 to 10 s |
| 2 | Fallback 1 not working within 5 s, any error dialog, a frozen screen, or the retake not started by 1:35 | Second tab: screen recording of the same run, same timings, saved locally | Carlos switches; Justin keeps narrating: "Here is the same run, recorded yesterday." | 10 s |
- Sources: tech-keyboard-input.md s8 ladder; build-plan-v0.md s9; pitch-v0.md s4 switch line.
- No sound is not a fallback trigger: say "sound off, watch the bars" and carry on.
- Both fallbacks share the stage laptop and display; if the laptop dies, the backup laptop needs the HDMI swap (about 30 s, `unverified` guess), so open with it ready.
- No troubleshooting and no apology on stage.

## 6. How voice appears without a live demo
- In the pitch: beat 1 is Carlos's first-hand story (pitch-v0.md beat 1), with slide 1 as a still.
  o Still: the cue in large type ("don't get louder, narrow the vowel") and the line "pitch wobbles 24 to 7 in one retake (n = 1)".
  o The number is Carlos's privacy call (evidence file s10); the cue alone is the fallback slide (pitch-v0.md s3).
- A 10-second voice clip: NOT in the 3-minute pitch (the 20 s buffer is for hand-overs); keep it for the expo stand and Q and A.
  o Record it new: Carlos sings the same public-domain phrase into the app's voice screen, showing the live line and one cue.
  o Never use his cover recordings: they were sung over YouTube karaoke videos (evidence file, context), and no karaoke goes on stage (state-of-play s5; R13).
- Connecting line (end of the demo, Carlos): "The keys show the loop: one fix, then proof on the retake. My voice is why it has to listen too."
  o Claims only what was shown live; the voice listening stays a stated aim unless the voice path works by Wednesday.

## 7. Rehearsal plan and the Wednesday go or no-go rule
### Dry runs
| When | Runs | Where and what |
|---|---|---|
| Sat 7 Nov | 3 demo-only | Home laptop and keyboard; capture take 1; also run the voice test with crowd noise playing (the overturn test, tech-pitch-detection.md s9) |
| Mon 9 Nov afternoon | 2 demo-only | At the venue workspace: HDMI, PA sound route, permission prompt after a fresh Chrome launch, readability from 10 m |
| Tue 10 Nov 15:00-18:00 | 3 full pitch, timed | After the freeze, on the frozen build (build-plan-v0.md s8); record the fallback video from a good run |
| Wed 11 Nov morning | 2 full pitch | Stage kit as it will be used: battery, sleep off, airplane mode, notifications off |
- Ten runs in all; each one rehearses fallback 1 or 2 at least once on Tuesday.

### Log per run (one line in a shared sheet)
| Field | Example |
|---|---|
| Run, time, place, build version | Tue run 2, 16:10, workspace, cache v7 |
| Demo seconds (stopwatch, 1:00 to 2:00) | 58 |
| Keyboard seen on first try (yes or no) | yes |
| Permission prompt appeared (yes or no) | no |
| Cue fired and rule ID (K3 expected) | K3 |
| Retake number shown | 8 of 8 |
| Readable from 10 m; sound heard at 10 m | yes; no |
| Fallback used (none, 1, 2) and the cause | none |

### Wednesday-morning go or no-go (Carlos calls it at the end of the second morning run)
- Live if all hold: the last three runs (Tue run 3, Wed runs 1 and 2) used no fallback, fired K3, and finished inside 60 s.
  o And in each, the live retake beat take 1's number, and the cue and number were readable from 10 m.
  o And the venue check passed: the screen shows Chrome full screen from the stage laptop.
- Otherwise screen recording, narrated live; no reopening the call after it is made.
- In live mode the recording is still cued in tab 2 (fallback 2).

## 8. Three classic live music-tech demo failures
| Failure | What it looks like | Prevention in this plan |
|---|---|---|
| The room beats the microphone | Crowd noise, PA bleed or feedback makes the tracker misread; the line jumps | No app microphone in option A; voice only as a recorded clip; speech mic hands-free and away from the laptop |
| The planted mistake does not happen (or a second one does) | Nerves make take 1 clean or the retake worse; the story breaks | Take 1 is a captured, labelled replay; only the retake is live; rehearse the retake ten times |
| The machine surprises you | Permission prompt, sleep, update pop-up, Wi-Fi needed, audio suspended until a tap, display not detected | Localhost and offline cache; grant MIDI permission and rehearse after a fresh launch; sleep and notifications off; a start button resumes audio (build-plan-v0.md s9); Monday AV check |

## 9. What Simone must confirm on Sunday
| # | Confirm | Lean in this memo |
|---|---|---|
| 1 | The live instrument: keyboard via MIDI, or overturn to voice | Keyboard; voice only if the Saturday noisy-room test passes and the loop is ahead |
| 2 | The phrase is a sensible first goal for the target learner | Ode to Joy bars 1 and 2, C position, 80 bpm |
| 3 | The cue and the number in music words she is happy to say | "You speed up as you play. Let the click lead."; "On the beat: 4 of 8 to 8 of 8" |
| 4 | The hook wording that matches MIDI | "It knows every note you play", not "it hears you" |
| 5 | Who plays the keys on stage | Justin per pitch-v0.md; whoever plays most steadily |
| 6 | Which keyboard, who buys or brings it, by Saturday | 25 to 32 key class-compliant USB, about A$90 to A$130 |
| 7 | Voice appears as a still in the pitch and a new public-domain clip at the stand | Yes; Carlos decides the number on slide 1 |

## Method
- Read: COMMON-RULES, session-rules.md, state-of-play-2026-11-06.md, RESUME.md, functional-requirements-v0.md.
- Read sections: notes-2026-11-06-hub-day-3.md (meeting 3 and decisions), tech-keyboard-input.md s1 to s8, build-plan-v0.md s1, s4, s6, s8, s9, tech-feedback-layer.md s3, evidence file header and s1, tech-pitch-detection.md s1, s2, s7, s9, pitch-v0.md s1 to s4, key-facts-info-pack.md, decisions-log.md.
- Input draft: the Codex knowledge draft (keyboard-vs-voice-answer.md, no web): used as an outline; its table re-scored; its 12-run plan cut to 10 to fit the build plan; its fallbacks aligned to the team files.
- Web: three searches, two pages opened (sources 1, 2); one snippet (source 7).
- Codex second opinion (gpt-6-sol, high, names and product models stripped): "agree with conditions".
  o Kept: provisional MIDI scores (sensitivity rows 5 and 6), full-loop voice test, retake slack and truthful "not yet" line, earlier fallback 2 trigger, improvement plus readability in the go rule, softer claims on localhost and silent controllers, its connecting line (reworded).
  o Checked and kept: the table arithmetic (it confirmed); the 1/200 rule, now marked a planning floor.
- Scores are judgement calls with the evidence row beside each; the sensitivity table shows where they could flip.

## Open questions
- Stage AV: screen size, HDMI at the lectern or the table, PA route for laptop sound, hands-free mic, a table on stage. Ask Monday.
- Pitch time on Wednesday afternoon: sets the deadline for the go or no-go call.
- Does Simone or Justin play keyboard well enough for a steady live retake?
- Does Saturday's noisy-room voice test pass with a headset mic? If yes, the team may overturn to voice.
- Should the "on a phone" line in the pitch change to "in any browser", given the laptop on stage (RESUME.md tension)?
- Is the Ode to Joy phrase fine for the chosen age group, or does Twinkle suit a child better (build-plan-v0.md s6)?

## Sources
1. Pengukuran Taraf Intensitas Kebisingan Pameran di Jogja Expo Center (undergraduate thesis, Universitas Gadjah Mada, 2015): inside-hall LAeq 62 to 78.5 dB(A). https://etd.repository.ugm.ac.id/penelitian/detail/78326 (accessed 2026-11-06, opened; abstract page only, one venue, weak source)
2. DISCAS calculator notes (third-party page on ANSI/INFOCOMM V202.01:2016): BDM acuity factor 200. https://thewestwas.one/discas (accessed 2026-11-06, opened); official standard page https://www.avixa.org/resources/standards/display-image-size-for-2d-content (snippet)
3. tech-keyboard-input.md (team file, 6 Nov): MIDI recommendation, prices, Web MIDI support, fallback ladder, rule sources 1, 3, 8 to 14, 50.
4. build-plan-v0.md (team file, 6 Nov): stage set-up, demo arc, phrase, fallbacks, Tuesday and Wednesday blocks.
5. tech-feedback-layer.md (team file, 6 Nov): rules K1 to K6 and V1 to V12, tiers.
6. tech-pitch-detection.md (team file, 6 Nov): Pitchy synthetic test M1, Saturday test plan.
7. Korg nanoKEY2 product and retailer listings: mini-USB, bus powered, no own sound. https://www.korg.com/au/products/computergear/nanokey2/page_1.php (accessed 2026-11-06, snippet)
8. pitch-v0.md, state-of-play-2026-11-06.md, notes-2026-11-06-hub-day-3.md, evidence-carlos-singing-practice.md, key-facts-info-pack.md (team files).
