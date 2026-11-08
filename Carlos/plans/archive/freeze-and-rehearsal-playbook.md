# Freeze and rehearsal playbook: Tuesday 15:00 to the Wednesday stage call

- Date: Fri 6 Nov 2026 (overnight draft, written to be used Tue 10 and Wed 11 Nov).
- Purpose: one place for the feature-freeze checklist, the demo rig checklist, the rehearsal schedule, the failure drill, the stand plan and the Wednesday run sheet.
- Scope: the stage default in build-plan-v0.md (laptop Chrome on localhost, USB MIDI keyboard, 3-minute pitch). The phone or tablet is the story device only.
- Status: overnight draft for the team; verify before the pitch. Numbers in "proposed" cells are team settings to confirm, not facts.

## 1. Conclusion (what to do, in order)
- Tue 15:00: freeze the build, the demo take, the slides and the script. After that only fixes, spelling and cuts.
- Tue 15:05 to 18:15: five timed full runs, with the cut rule at 2:50. Log every run on one sheet.
- Tue evening: rig packed, printed one-page runbook, recording v2 on two devices.
- Wed: cold start, airplane-mode test, two more timed runs, then hand over a connected rig showing the start state.
- Stage call time and arrival time are NOT in the pack (key-facts section 1 says bus times follow in the Pre-Arrival Pack). Section 7 uses offsets from the stage call (C).
- The stage device is a laptop. Mirroring is a wired HDMI cable to the venue screen; wireless mirroring is not in the plan.

## 2. Tuesday 15:00 feature freeze

### 2.1 What "frozen" means
| Item | Frozen means | Allowed after 15:00 | Banned after 15:00 |
|---|---|---|---|
| Code | Tagged commit, cache name bumped, redeployed, reloaded on every stage device | A fix to a step that fails in a rehearsal, re-tagged and re-tested offline | New screen, new rule, new library, model or threshold change |
| Assets | Synth, phrase data, icons, fonts, slides images cached locally | Swap a broken file for the previous tested one | New image, sound or font |
| Canned data | Seeded start state, the labelled replay take, the sample week card | None; reload the seed, never edit it | A new take, a new "week" number, new labels |
| Demo phrase | One phrase (default: opening of the Ode to Joy melody), one key, one tempo, two known errors in take 1 | None | Changing phrase, key, tempo or error pattern |
| Slides | One slide per section, sequence fixed, numbers sourced | Typos, a sharper picture on the same slide | New slide, new number, new claim |
| Script | Words, speaking order, cue lines, premarked cut lines | Pace, removing premarked lines | New unrehearsed lines |
| Recording | Recording v2 of the frozen flow on the laptop and a second device | A re-record only if the build itself was fixed | A different flow |
- Source for the 15:00 freeze, the three rehearsals and the "only fixes after" rule: plan-2026-11-02-to-11.md (Gates), build-plan-v0.md section 8.
- Offline copy, service worker and cache bump on freeze day: build-plan-v0.md sections 8 and 10.

### 2.2 Go or no-go questions (all must be "yes" at 15:00)
| # | Question | Pass test | Signs off (by role) |
|---|---|---|---|
| 1 | Does the build do what Monday's success criteria ask, and nothing they do not? | Criteria map ticked; non-goals list unchanged since Monday | Research and UX lead (Simone) |
| 2 | Does the whole loop run on the stage laptop after a cold start? | Take 1 replay, cue, live retake, proof card, hand-off card | Model and web lead (Justin) |
| 3 | Does it work with Wi-Fi off? | Airplane-mode cold reload passes, twice | Model and web lead (Justin) |
| 4 | If the keyboard fails, do the on-screen keys give the same cue path? | Unplug test passes | Model and web lead (Justin) |
| 5 | Does the reset to the demo start state take 10 seconds or less? | Timed twice | Infrastructure and rig lead (Carlos) |
| 6 | Does the recording play with no internet, from a second device? | Played from local storage | Infrastructure and rig lead (Carlos) |
| 7 | Does the rig chain (laptop, HDMI, adapter, keyboard, cable) work on a screen? | Tested on the venue screen or a stand-in | Infrastructure and rig lead (Carlos) |
| 8 | Is every number on a slide sourced and every claim inside what the screen proves? | Check against research-bank.md; Cisco wording from build-plan section 11 | Research and UX lead (Simone) |
| 9 | Does the script run at 2:50 or under? | One timed read-through before the freeze | Whole team |
- Roles come from plan-2026-11-02-to-11.md (Roles table); "adjust on 6 Nov" is still open, so confirm who holds which role.
- All three leads sign the shared printed runbook (section 3). No signature, no freeze.
- If any answer is "no": choose the tested fallback from build-plan-v0.md section 9, write the choice in the log, and do not add a feature to fix it.
- Late, exact changes after 15:00 need two leads to agree, a re-test offline, and a new tag; log them on the run sheet.

## 3. Demo rig checklist
- Pack Tuesday night; check again Wednesday C-55 (section 7). Tick each box on the printed runbook.

### 3.1 Devices and power
- [ ] Stage laptop, charged, charger in the bag; battery saver off; sleep and screen-off set to never while on power.
- [ ] Backup laptop with the same tagged build, seed data and keyboard chain (build-plan section 9: "Backup laptop").
- [ ] Story device: Android tablet or phone, same app with on-screen keys (tech-keyboard section 8). An iPad has on-screen keys only (no Web MIDI in Safari).
- [ ] A spare phone or tablet that can play recording v2 with no internet.
- [ ] Power bank for the phone and tablet; one spare charging cable per device type; a multi-way power strip.
### 3.2 Cables and adapters
- [ ] One 25 to 32 key USB MIDI keyboard, bus-powered, plus a spare USB cable (tech-keyboard section 8).
- [ ] USB-C to USB-A adapter and a powered USB hub (tech-keyboard section 8: "Carry").
- [ ] HDMI cable (at least 3 m), plus the laptop's HDMI or USB-C to HDMI adapter, plus one spare adapter tested on the venue screen.
- [ ] A cable map on the runbook: which port feeds the screen, which feeds the keyboard, which charges the laptop.
### 3.3 Audio
- [ ] Wired headset or wired mic and headphones for the voice and backing (backing in headphones avoids feedback into the mic; build-plan section 10).
- [ ] Confirm the app uses the intended input and output; sound check at venue volume; if the app shows "sound off", the visual line still runs.
### 3.4 Display and mirroring
- [ ] Primary: laptop duplicated or extended to the venue screen by HDMI; resolution tested; the stage screen shows the start state.
- [ ] Fallback if the screen goes blank: the second device plays recording v2, or the laptop recording plays full screen.
- [ ] Do Not Disturb on; notifications, update prompts and other apps closed; browser is one window with the app and the slides only.
### 3.5 Test items
- [ ] Airplane-mode cold start passes on BOTH laptops: restart the machine, enable airplane mode, start the local server, open the tagged build, check the cache version and that audio and data assets all load, run the loop.
- [ ] MIDI permission granted before stage; re-test after a fresh browser launch (persistence is unverified in tech-keyboard section 8).
- [ ] Brightness at maximum on the laptop, volume fixed at a marked level, volume of the backing synth checked.
- [ ] Both recordings (laptop and spare device) start from the first frame in under 10 seconds.
### 3.6 The printed one-page runbook
- [ ] Cable map; speaking order with cue lines; six failure triggers (section 5); recording locations; the reset steps; the freeze sign-off boxes.
- [ ] Two printed copies: one at the demo operator's seat, one with the rig lead.
### 3.7 The 10-second reset to the demo start state
| Step | Action | Seconds |
|---|---|---|
| 1 | Press the visible "Start over" control (or the panic key if a note is stuck) | 2 |
| 2 | Load the seeded demo (take 1 replay ready, tempo at the stored start) | 4 |
| 3 | Check the start state: first screen, keyboard dot green, sound on | 4 |
- Time the reset twice at each rehearsal; it must stay at 10 seconds or under. The "Start over" control and panic key are plan items from build-plan sections 9 and 10; confirm they exist in the build.

## 4. Rehearsal schedule (Tuesday afternoon to Wednesday morning)

### 4.1 Plan
| When | Run | Operator | Speakers | What to test |
|---|---|---|---|---|
| Tue 15:05-15:25 | 1 | Justin | Simone, Justin, Carlos | Baseline: script, demo and timing |
| Tue 15:30-15:50 | 2 | Carlos (understudy at the keyboard) | Same | Operator swap; reset timed twice |
| Tue 16:00-16:20 | 3 | Justin | Same | Each person answers one hard question after the pitch (privacy, feasibility, cost) |
| Tue 16:30-16:50 | 4 | Justin | Same | Failure drill: the trigger fires once in the run (section 5) |
| Tue 17:00-17:20 | 5 | Cold start | Same | Airplane mode, fresh browser launch, no warm-up |
| Tue 17:30-18:15 | Fix list | All | None | Fixes only; re-tag; re-record only if code changed |
| Wed, after arrival | 6 | Cold start on the venue screen | Same | Real HDMI chain, real volume, recording switch rehearsed |
| Wed C-30 | 7 | Final cold-start test | Same | One full run, no stops; section 7 |
- Tuesday's return bus is at 19:00 per key-facts section 1; leave the stand by 18:30 so packing and the runbook are done.
- Timed runs use the real device, real keyboard, real slides; a run that stops for talk does not count.
### 4.2 What to time and log every run
| Measure | Target (proposed) |
|---|---|
| Total pitch | 2:40 to 2:50 (plan: 2:40 for a 3:00 limit) |
| Each speaker section | Simone about 0:50, Justin about 1:10, Carlos about 0:40 (split is a proposal; set it in run 1) |
| Cue to first pitch line on the screen | Under 3 seconds |
| Retake result | Visible improvement on the proof card |
| Reset time | 10 seconds or under |
- Log per run: run number, operator, speaker order, actual times per section, missed cue, failure and recovery, one action to improve.
- One sheet, one line per run, kept by a person who is not speaking.
### 4.3 The cut rule
- Over 2:50: remove premarked context lines in order, last-marked first; rerun before changing anything else.
- Keep these always: the problem, the live attempt, one cue, the retake proof, the teacher hand-off card, the ask.
- No new line is added after run 2. Under 2:30: do not fill with new words; slow the pace.
### 4.4 Speaker rotation
- Speaking parts stay (problem, demo, next) because the roles are rehearsed; the demo operator rotates.
- Everyone can operate the reset, the recording switch and the panic key by run 4.
- Run 3: answer order rotates so each of the three takes a different hard question.

## 5. Stage failure drill (six failures)
| # | Failure | Trigger | One-line response | Who acts |
|---|---|---|---|---|
| 1 | Keyboard not detected or unplugs | No device in the list | Re-plug; if no keyboard in 5 s, switch to on-screen keys, same phrase and cue | Demo operator |
| 2 | No sound | AudioContext suspended or volume muted | Tap start (resume audio); if still silent say "sound off, watch the bars" | Demo operator |
| 3 | Projector blank or lag | Screen black or frozen for more than 5 s | Re-seat HDMI, then swap to the spare adapter | Rig lead (Carlos) |
| 4 | App freezes or the laptop fails | No response to a tap after one retry | Switch to the recording sentence below | Model and web lead (Justin) |
| 5 | Wrong tap, stuck note or lost state | Wrong screen or a note sounds forever | Press "Start over" or the panic key and resume at the live-take cue | Demo operator |
| 6 | Dim screen, sleep or battery warning | Display dims or a warning shows | Plug in power; wake the screen; speaker keeps talking | Rig lead (Carlos) |
- The ladder of 5-second steps and the 20-second recording come from tech-keyboard-input.md section 8; the exact thresholds in the table are proposed settings.
- Switch to the recording after one failed retry, any stall over 3 seconds, or mirroring lost over 5 seconds. These three triggers are proposed (unverified (Codex knowledge) for the numbers).
- The sentence for the speaker: "Here is the same practice loop captured on this laptop on Tuesday, so you can see the feedback and the retake."
- Say it plainly; never present the recording as live. Judges test feasibility; an honest label protects trust.
- The speaker never waits for cables; the rig lead acts and signals by one agreed gesture.
- Drill rule (after the Codex critique): drill failures separately as 30-second drills in run 4, not all inside one pitch; run 4 injects one chosen failure; Wednesday run 6 is a clean timed run.
- Blank projector with no display path: speakers say "The screen is not showing, so I will describe the loop while the crew fixes it"; agree this line and the crew signal with the stage manager. A recording on a second device does not fix a dead display.
- Audio: headphones keep the backing out of the mic but the audience cannot hear them. Decide with the crew whether the synth goes to the room; if not, the pitch says "watch the bars" (open question 9).
- Recording switch: name the file, the player, the display route and the cue point; the clip must include the proof card and the teacher card; label it "recording" on screen as well as aloud; time the switch inside a full pitch.

## 6. Showcase stand plan

### 6.1 Set-up and loop
- After the stage pitch comes an expo-style showcase at the NIIN stand (key-facts section 1); stand hours are not in the pack.
- Keep one device at the demo start state; run the short loop: attempt, one cue, retake, hand-off card, reset, next visitor.
- Loop length proposed at about 45 seconds; time it in rehearsal run 3 and cut to fit.
- If the stand is too loud for the voice story, run the keyboard path or play the recording.
- Reset after every visitor: "Start over", seeded demo, no leftover take on the screen.
### 6.2 The 20-second table pitch (about 50 words)
- "Beginners often know a note sounded wrong but not what to do next. Our practice coach listens, shows the pitch, gives one plain-language fix and checks the retake. Then a teacher gets a short hand-off card. Want to try one phrase?"
- Use the same wording as the stage pitch; no superlative or novelty claims (house rules).
### 6.3 Three roles at the stand
| Role | Does |
|---|---|
| Host (Simone) | Greets, runs the 20-second pitch, asks one feedback question |
| Operator (Justin) | Runs the app, watches for issues, notes any failure |
| Rig and queue (Carlos) | Power, screen, cables, keeps the queue moving, resets |
- Rotate roles every 30 to 45 minutes; the host drinks water and eats.
### 6.4 Feedback capture, minors and privacy
- Use a paper tally and a small card with one rating and one optional comment, or a QR form if the team hosts one; paper is the safe default.
- Collect no names, contact details, ages, photos, voice recordings or other personal data. Treat any visitor as possibly under 18 (privacy-design-v0.md section 6: designed to the draft Children's Online Privacy Code).
- Visitors play on the keyboard or the on-screen keys; reset after each one. Do NOT tell visitors "nothing is stored" until the build is checked: reset alone does not prove deletion (open question 4). Until then, clear the local store at the end of each visitor block and at the end of the day.
- Claim only what the loop shows: one attempt and one retake on one phrase; not a learning gain or general reliability (a seeded replay plus a live retake does not prove either).
- Do not photograph or record visitors; ask the venue about any filming rules.
### 6.5 Reviewer-feedback note
- One shared note, one line per entry: time, reviewer role if they volunteer it (for example "Cisco reviewer" or "university reviewer"), exact words, issue seen, follow-up owner.
- No names in the note. Keep the exact wording; do not paraphrase a criticism into praise.
- Write the note within 10 minutes of the conversation; fold the "what next" items into the follow-up list the plan promises (plan day table: "Feedback notes, what-next list").

## 7. Wednesday run sheet (7 am bus to the stage call)
- Fixed points: 7 am bus, breakfast at WoS, final build, rehearsal, stage pitch then showcase, awards at close, return 6:30 pm (key-facts section 1).
- Not in the pack: bus ride length, stage call time, stage slot. Use A for arrival at WoS and C for the stage call. Shift the offsets when the organisers confirm C.
- Rule: no feature work; only fixes to a failing step.

| Time | Action | Lead |
|---|---|---|
| 06:30 | Rig bag packed, devices charged, printed runbook in hand; laptop on charge until leaving | Carlos |
| 07:00 | Bus to WoS; carry the keyboard, laptop and cables as hand luggage, not in the hold | All |
| On the bus | Review the script once silently; no laptop work | All |
| A | Arrive; find the stand and the stage; breakfast | All |
| A+0:20 | Rig set-up at the stand: power, HDMI, keyboard; one full cold start in airplane mode | Carlos, Justin |
| C-90 | Run 6: full timed run on the stand screen with the real chain | All |
| C-70 | Log times; cut only premarked lines if over 2:50 | Logger |
| C-60 | Recording v2 played from the spare device; test the switch sentence | Carlos |
| C-50 | Walk to the stage; check where the display input and the lectern are; ask the crew which cable and adapter | Carlos |
| C-40 | Reset in 10 seconds; check MIDI permission after a fresh browser launch | Justin |
| C-30 | Final cold-start test: restart the browser in airplane mode, one run, no stops (run 7) | All |
| C-20 | Check first slide, the app start state, the first frame of the recording | Simone, Carlos |
| C-15 | Notifications off, brightness max, volume marked, power connected; assign who carries each item | Carlos |
| C-10 | Hand the connected rig to the crew; confirm the start state is on the stage screen | Carlos |
| C-5 | Speakers in place; operator keeps the device awake; water; breathe | All |
| C | Stage call | Simone opens |
- If the venue gives a tech check slot, use it in place of C-50 and C-10 and tell the crew the failure drill.
- If the stage input is not HDMI: use the USB-C adapter; the spare is tested on this day.
- After the pitch: reset the rig at the stand and begin the showcase roles (section 6).

## 8. Ten delivery rules for a 3-minute timed pitch with a live demo
1. Start with the learner's problem in one sentence; no preamble.
2. Say what the audience will see before showing it; say what they saw after.
3. One cue before each tap or played note; no silent clicking.
4. Pause until the pitch line is on the screen; do not talk over the proof.
5. Speak the single fix aloud, then play the retake live.
6. Claim only what the screen shows; label replay and mock as replay and mock.
7. Never wait on a cable; the rig lead acts while the speaker keeps talking.
8. Show the teacher card briefly and name its purpose.
9. Handoffs between speakers use a fixed bridge line and no thanks or filler.
10. Finish by 2:50, leaving ten seconds for stage variation; end on the ask.

## Method
- Outline from a Codex (GPT-6 Sol, medium) knowledge draft written with no repo access (freeze, rig, rehearsal, drill, stand, run sheet, delivery rules).
- Rebuilt against the team files: times from key-facts-info-pack.md; stage device and fallbacks from build-plan-v0.md and tech-keyboard-input.md; roles and gates from plan-2026-11-02-to-11.md.
- Changed from the Codex draft: stage device is a laptop with a USB MIDI keyboard, not a phone; mirroring is wired HDMI; the keyboard and on-screen-key ladder replaces "mic permission" as failure 1.
- No web sources opened; every fact is from the team files. The Wednesday offsets are placeholders until the stage call time is known.
- Contradiction found: state-of-play-2026-11-06.md says the success criteria are "due" Mon 9 Nov 8 am; the info pack says they are introduced to teams (build-plan-v0 flags this).
- Codex call 2 (gpt-6-sol, medium, names replaced by Lead A/B/C): critique of the finished file, exit 0. Kept: separate failure drills, blank-display and audio-path lines, recording-switch detail, two-laptop cold-start test, storage claim softened, proof wording limited. Rejected: nothing; its point that the stage slot and tech-check time are unknown is already open question 1.
- Not done: per-action timestamps for the 3-minute script (the script file and demo flow are not final); the speaker split is a proposal to set in run 1.

## Open questions
1. What is the stage call time, the slot order and the bus ride length? (Pre-Arrival Pack.)
2. Which person holds which role (research and UX, model and web, rig)? The plan says "adjust on 6 Nov".
3. Does the venue stage take HDMI or USB-C, and is there a tech check slot?
4. Does the app have a visible "Start over" control, a panic key and a demo mode that keeps no visitor take?
5. Is the stand open all day, and are there venue filming or recording rules?
6. Is the feedback QR form wanted, or paper only? Who hosts a form and where does the data live?
7. Does MIDI permission persist after a fresh browser launch on the stage laptop?
8. Is the pitch speaker order fixed as problem, demo, next, with the demo operator being Justin?
9. Does the venue route laptop audio to the room, or is the demo silent for the audience?
10. May the team use the stage for a tech check before the previous team clears it (C-30 and C-10 assume yes)?

## Sources
1. key-facts-info-pack.md, section 1 (schedule), opened 2026-11-06.
2. plan-2026-11-02-to-11.md (gates, roles, rehearsal checklist), opened 2026-11-06.
3. build-plan-v0.md sections 4, 6, 8, 9, 10, 12, opened 2026-11-06.
4. tech-keyboard-input.md section 8 (stage set-up and fallback), opened 2026-11-06.
5. state-of-play-2026-11-06.md sections 1 and 12, opened 2026-11-06.
6. privacy-design-v0.md section 6 (on stage), opened 2026-11-06.
7. Codex (GPT-6 Sol) knowledge draft, 2026-11-06: unverified (Codex knowledge) where it is a factual claim (the 3 s, 5 s and one-retry triggers; the run split).
