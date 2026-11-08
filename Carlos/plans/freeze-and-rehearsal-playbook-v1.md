# Freeze and rehearsal playbook v1: Tuesday 15:00 to the Wednesday stage call

- Date: Fri 6 Nov 2026 (overnight draft, to be used Sat 7 to Wed 11 Nov). Parent: freeze-and-rehearsal-playbook.md (unchanged).
- Purpose: the parent revised against a stage-manager critique (GPT-6 Sol, high, no web): freeze rule, run order, failure ladder, rehearsal schedule, kit list, clip rules, claims not to make.
- Numbering: sections 0 and 1 are new (change log, critique ledger). The parent's sections 1 to 8 are P1 to P8, same order and content areas; P9 to P12 are new.
- Status: overnight draft for the team; verify before the pitch. Numbers in "proposed" cells are team settings to confirm, not facts. Carlos runs git, sends and presents.

## 0. Change log (v1 against the parent)
| # | Change | Why | Source |
|---|---|---|---|
| 1 | Demo phrase is now a placeholder `[PHRASE]` with three named candidates; the parent hard-coded Ode to Joy | The team files disagree and the choice is open (P2.1, open question 11) | demo-phrase-and-rights.md s1; demo-instrument-decision.md s4 |
| 2 | Failure 1 (MIDI): go to on-screen keys at once; one re-plug only by the rig lead, off the live take | The critique says re-plugging eats the 10 s; the page listens for port changes so a late keyboard can still appear | Critique s2; MDN statechange (src 6) |
| 3 | Failure 4 (app or laptop freeze): recording only if the display still works; else narrate | A recording cannot fix a dead display; parent said this once but the table row did not | Critique s2 |
| 4 | Five new failures added: wrong projector input, laptop password, autoplay blocked, keyboard appears late, bright room | Missed by the parent | Critique s2; Chrome autoplay (src 5) |
| 5 | "10 seconds" now means "reach a rehearsed continuation", not "repair" | Honest definition; speaker keeps the clock moving | Critique s2 |
| 6 | Rig list gained: display mode, resolution and scaling, HDMI audio route, house PA, one Chrome profile and one URL, password and lock-screen guard, projected-image latency, clicker decision | Gaps in parent P3 | Critique s1; Dell snippet (src 8) |
| 7 | Wednesday run 7 is a chain check in the crew slot, not a full pitch on stage; the full clean run is at the stand | Stage may not be free at C-30 | Critique s3, s4 |
| 8 | Timing now starts at the official pitch clock; extra log fields (60 s demo, cue to result, switch time, projected readability, audio route) | Measure what the judges see | Critique s3 |
| 9 | Rule for a speaker who freezes: bridge line, next speaker takes the next scripted line | Parent had none | Critique s3 |
| 10 | Phones, including the story device, go to airplane mode at C-20; laptop Do Not Disturb and no password prompt checked at handover | Run sheet gaps | Critique s4 |
| 11 | Saturday to Monday steps added to the schedule (take 1 capture, Monday AV questions, Monday-night drill, 12:30 merge cut-off) | The task asks Saturday to Wednesday | surprise-task-drill.md s1, s4; monday-criteria-drill.md s10 |
| 12 | Recorded-clip rules (P10) and claims not to make (P11) written as their own sections | Brief | demo-instrument-decision.md s6; privacy-design-v1.md s6; cisco-fit-note-v1.md s2 |
| 13 | Parent's Codex-knowledge triggers (3 s, 5 s, one retry) kept but marked proposed; a bright-room "high-contrast view" is NOT a plan item | A new view after 15:00 would break the freeze (ledger row 21) | Parent P5; ledger |
| 14 | Chrome MIDI permission persistence stays `unverified`; rule is a test, not an assumption | No source states it | Chrome blog (src 4) |

## 1. Critique ledger
- Source: freeze-critique-answer.md (src 2). Status words: accepted, corrected, rejected, `unverified`. "Opened" means the page was fetched and read; "snippet" means a search result only. Access date for every web source: 2026-11-06.

### 1.1 Rig checklist (critique s1)
| # | Critique point | Status | Note |
|---|---|---|---|
| 1 | Use duplicate display; test extended only if presenter notes are needed | accepted | Duplicate is already the parent default; extended adds a failure mode |
| 2 | Set and test resolution and scaling; pitch line and proof card readable from the back | accepted | Matches the 10 m readability work in demo-instrument-decision.md s3 |
| 3 | HDMI may take over audio output; route the synth deliberately or run visual-only | accepted | Fact check: Dell says Windows may switch the default playback device to the cable (src 8, snippet); a Microsoft Q&A thread agrees (src 9, snippet). Which OS the stage laptop runs is open |
| 4 | Sound-check at room volume; headphones give the audience nothing | accepted | Parent already had the headphone point; the house-PA route is a sponsor question (P12) |
| 5 | Powered hub with its supply, labelled ports, cables secured | accepted | Parent had a powered hub; added labels and strain relief |
| 6 | Disable alerts, updates, lock and sleep; stay signed in | accepted | Added the lock-screen and password guard (row 15) |
| 7 | One tested Chrome profile, origin and window; no extensions | accepted | Added: same exact URL and port every time. Per-origin storage of permission is general knowledge, `unverified` |
| 8 | Start the server before handover; use the tested `http://localhost` address; localhost is a secure context; Chrome may still ask for MIDI permission | accepted | Both claims verified: MDN lists http://localhost as secure (src 3, opened); Chrome 124 prompts for all Web MIDI use (src 4, opened) |
| 9 | Test the projected image while playing; cue the next line when the screen catches up | accepted | No latency number exists; measure it in run 1 (`unverified`) |
| 10 | Pair a spare clicker with a fresh battery; arrow keys as fallback | corrected | Only if a person advances slides from away from the laptop; a clicker dongle takes a USB port and adds a failure. Decide in run 1; arrow keys stay the fallback |

### 1.2 Failure drill (critique s2)
| # | Critique point | Status | Note |
|---|---|---|---|
| 11 | "Within 10 seconds" means reaching a rehearsed continuation | accepted | Written into P5 |
| 12 | MIDI absent: on-screen keys immediately; re-plug only after the pitch | corrected | Memo says re-plug once, then on-screen keys; v1 compromise: operator switches at once, rig lead may re-plug off the live take. Differs from demo-instrument-decision.md s5, team to confirm |
| 13 | No sound: tap Enable sound once, then "watch the bars" | corrected | Chrome rule verified: an AudioContext created before a gesture needs `resume()` after one (src 5, opened). "Enable sound control" must already exist in the build; adding it after 15:00 is banned, so check it exists in freeze prep |
| 14 | Projector blank: narrate; a recording cannot fix a dead projector | accepted | Parent said so; now also in the table |
| 15 | Freeze: cue the recording only if the display works | accepted | Also covers the laptop-dies case: the backup laptop swap is a guess (about 30 s, `unverified`) |
| 16 | Wrong tap or stuck note: panic or reset only if return point is under 10 s | accepted | Return point must be timed in rehearsal |
| 17 | Dim screen or sleep: wake once; rig lead connects power | accepted | Plus a lock-screen link to row 18 |
| 18 | Wrong projector input: speaker narrates, crew selects the laptop input | accepted | New row, crew-dependent |
| 19 | Password prompt: speaker continues, rig lead unlocks off-mic; prevent at handover | accepted | Prevent by checking lock and sleep settings at C-15 |
| 20 | Autoplay blocked: click the sound-start control once | accepted | Same Chrome source as row 13; Chrome's engagement rule only applies on desktop and is not relied on (src 5) |
| 21 | Bright room: choose a tested high-contrast view | corrected | A new view after the freeze is banned. Test contrast of the existing screens on a bright display; ask the crew about room lights; use a high-contrast view only if the build already has one |
| 22 | Keyboard enumerates after the page loaded: use on-screen keys; reselect MIDI if rehearsed | accepted | MDN: `statechange` fires when a port is added or changes state (src 6, opened); the memo says the page listens (demo-instrument-decision.md s5, team file, check in build) |

### 1.3 Rehearsals (critique s3)
| # | Critique point | Status | Note |
|---|---|---|---|
| 23 | Five Tuesday runs work if each has one purpose and a short log | accepted | P4 table gives each run one purpose |
| 24 | Two Wednesday runs only if arrival leaves time; do not assume the stage at C-30 | accepted | Run 7 becomes a stand run plus a crew-slot chain check |
| 25 | Time from the official pitch clock; log total, each speaker, 60 s demo, cue to result, reset, switch | accepted | Whether a stage clock exists is open (P12) |
| 26 | Over 2:50 cut premarked lines in order, rerun | accepted | Same as parent cut rule |
| 27 | If a speaker stops for two seconds the next speaker bridges | corrected | Two seconds is a proposed setting; a bridge line must be scripted and rehearsed |

### 1.4 Run sheet and delivery (critique s4 and s5)
| # | Critique point | Status | Note |
|---|---|---|---|
| 28 | Gaps: rig handover time, who holds the keyboard, cold start, recording cue, airplane mode for phones | accepted | All five now have a row in P7 |
| 29 | Delivery rules 2, 3, 4, 7 amended (preview then name; cue meaningful actions; pause briefly; speaker continues) | accepted | P8 |
| 30 | Face the audience; stop explaining what the screen cannot show | accepted | P8 |
| 31 | Leave applause and movement out of the clock plan "only if organisers exclude them" | corrected | Garbled; v1 plans the full 3:00 including walk-on and ends by 2:50; whether applause counts is a sponsor question |
| 32 | Stand loop: mains power, tested reset, 45 s loop, noise leads with visible cue, rotate roles, handover check | accepted | Recording stays the last stand fallback |

## P1. Conclusion (what to do, in order)
- Sat 7 to Sun 8: capture take 1 and the new voice clip; first full timed read; kit gathered.
- Mon 9: criteria at 8 am; device test; ask the sponsor AV questions at the venue (P12); Monday-night drill; code merge cut-off Tue 12:30.
- Tue 15:00: freeze the build, the demo take, the slides and the script. After that only fixes, spelling and cuts (P2).
- Tue 15:05 to 18:15: five sessions (runs 1, 2 and 5 are full timed pitches; run 3 adds questions and the stand loop; run 4 is 30-second failure drills), each with one purpose; cut rule at 2:50; one log sheet.
- Wed: cold start, one clean run at the stand, a short chain check in the crew slot, then hand over a connected, unlocked rig showing the start state.
- Stage call time, arrival time and slot are NOT in the pack (key-facts section 1: bus times follow in the Pre-Arrival Pack). P7 uses offsets: A = arrival, C = stage call.
- Stage device: laptop, Chrome on `http://localhost`, USB MIDI keyboard, wired HDMI. The phone or tablet is the story device only; no wireless mirroring.

## P2. Tuesday 15:00 feature freeze

### P2.1 What "frozen" means
| Item | Frozen means | Allowed after 15:00 | Banned after 15:00 |
|---|---|---|---|
| Code | Tagged commit, cache name bumped, redeployed, reloaded on every stage device | A fix to a step that fails in a rehearsal, re-tagged and re-tested offline | New screen, new rule, new library, model or threshold change, a new control (for example a high-contrast view or a sound button) |
| Assets | Synth, phrase data, icons, fonts, slide images cached locally | Swap a broken file for the previous tested one | New image, sound or font |
| Canned data | Seeded start state, labelled replay take, sample card | None; reload the seed, never edit it | A new take, new labels, a new "week" number |
| Demo phrase | `[PHRASE]` one phrase, one key, one tempo, known error in take 1 | None | Changing phrase, key, tempo or error pattern |
| Slides | One slide per section, order fixed, numbers sourced; Webex card is a screenshot | Typos, a sharper picture on the same slide | New slide, number or claim |
| Script | Words, speaking order, cue lines, bridge line, premarked cut lines | Pace, removing premarked lines | New unrehearsed lines |
| Recording | Clip v2 of the frozen flow on the laptop and a second device (P10) | A re-record only if the build itself was fixed | A different flow |
| Kit | Packed list (P3) with cable map | Swap a failed cable for a tested spare | Untested new adapter or clicker |
- `[PHRASE]` is an open team choice. Candidates in the team files: "Twinkle, Twinkle" bars 3-4 (memo recommendation, demo-phrase-and-rights.md s1), Ode to Joy bars 1-2 (build-plan and the demo beat table, demo-instrument-decision.md s4), London Bridge bars 3-4 (backup row in the rights table). Lock it by Mon 17:00 so the take, the clip and the note lists use one phrase.
- Source for the 15:00 freeze and the "only fixes after" rule: plan-2026-11-02-to-11.md (Gates), build-plan-v0.md section 8; freeze prep runs 13:00 to 15:00 (surprise-task-drill.md s7).
- If the criteria or a surprise task need code: merge by Tue 12:30; the task outranks our own freeze plan, never the working loop (surprise-task-drill.md s1).

### P2.2 Go or no-go questions (all must be "yes" at 15:00)
| # | Question | Pass test | Signs off (by role) |
|---|---|---|---|
| 1 | Is every required criterion ticked on the map, and is every extra feature listed? | Criteria map ticked; extras and non-goals listed, unchanged since Monday | Research and UX lead (Simone) |
| 2 | Does the whole loop run on the stage laptop after a cold start? | Take 1 replay, cue, live retake, proof card, hand-off card | Model and web lead (Justin) |
| 3 | Does it work with Wi-Fi off? | Airplane-mode cold reload passes, twice, on both laptops | Model and web lead (Justin) |
| 4 | If the keyboard fails, do on-screen keys give the same cue path? | Unplug test passes | Model and web lead (Justin) |
| 5 | Does a keyboard plugged in after page load show up? | Plug-in-late test passes, or the on-screen path is used | Model and web lead (Justin) |
| 6 | Does the sound-start control exist and resume audio after a cold start? | Tapped once, sound plays | Model and web lead (Justin) |
| 7 | Does the reset to the start state take 10 seconds or less? | Timed twice | Rig lead (Carlos) |
| 8 | Does the clip play with no internet, from a second device? | Played from local storage | Rig lead (Carlos) |
| 9 | Does the chain (laptop, HDMI, adapter, keyboard, cable) work on a screen? | Tested on the venue screen or a stand-in | Rig lead (Carlos) |
| 10 | Does the laptop stay awake and unlocked on power? | No lock, sleep or password prompt in a 20-minute idle test | Rig lead (Carlos) |
| 11 | Is every number on a slide sourced, every claim inside what the screen proves? | Check against research-bank.md; section P11 | Research and UX lead (Simone) |
| 12 | Does the script run at 2:50 or under? | One timed read before the freeze | Whole team |
- Roles come from plan-2026-11-02-to-11.md (Roles table); "adjust on 6 Nov" is still open, so confirm who holds which role.
- All three leads sign the shared printed runbook. No signature, no freeze.
- Any "no": choose the tested fallback from build-plan-v0.md section 9, log it, add no feature.
- Late, exact changes after 15:00 need two leads to agree, an offline re-test and a new tag; log them on the run sheet.

## P3. Kit list (demo rig)
- Pack Tuesday night; check again at A+20 and C-15. Tick each box on the printed runbook.

### P3.1 Devices and power
- [ ] Stage laptop, charged, charger in the bag; battery saver off; sleep, lock and screen-off set to never on power; auto-update paused.
- [ ] Backup laptop with the same tagged build, seed data, clip and keyboard chain (build-plan section 9).
- [ ] Story device: Android tablet or phone with on-screen keys. An iPad has on-screen keys only (no Web MIDI in Safari; memo claim, team file).
- [ ] A spare phone or tablet that plays the clip with no internet.
- [ ] Power bank, one spare charging cable per device type, a multi-way power strip.
### P3.2 Cables and adapters
- [ ] 25 to 32 key USB MIDI keyboard, bus-powered, plus a spare USB cable of the exact type (tech-keyboard section 8).
- [ ] USB-C to USB-A adapter and a powered USB hub with its own supply; ports labelled; cables taped down.
- [ ] HDMI cable (3 m or more), the laptop's HDMI or USB-C to HDMI adapter, one spare adapter tested on a screen.
- [ ] Cable map on the runbook: screen port, keyboard port, charger port.
### P3.3 Audio
- [ ] Wired headset or wired mic and headphones for the voice story and backing in headphones (feedback guard).
- [ ] Decide the sound route: laptop audio over HDMI to the house PA, or visual only. HDMI may take over the default output (src 8, snippet), so set the output device by hand after the cable is connected and test at room volume.
- [ ] If the app shows "sound off", the visual line still runs and the speaker says "watch the bars".
### P3.4 Display and mirroring
- [ ] Duplicate mode; resolution and scaling tested; the stage screen shows the start state.
- [ ] Projected-image check: play a phrase and watch the delay on the venue screen; the speaker cues the next line when the audience screen catches up.
- [ ] Do Not Disturb on, notifications and update prompts off, one Chrome window, one profile, no extensions, one exact URL and port.
- [ ] Slide advance: decide who clicks. A spare clicker only if it is paired, battery fresh and tested; arrow keys are the fallback.
- [ ] Fallback if the screen goes blank: narrate (P5). A clip does not fix a dead display.
### P3.5 Test items
- [ ] Airplane-mode cold start on BOTH laptops: restart, airplane mode, start the local server, open the tagged build, check the cache version and that audio and data load, run the loop.
- [ ] MIDI permission granted before stage; after a fresh browser launch, test again. Chrome 124 prompts for all Web MIDI use (src 4); whether the grant persists after a relaunch is `unverified` (the blog does not say), so the test decides.
- [ ] Brightness at maximum, volume fixed at a marked level, synth volume checked, text contrast checked on a bright display.
- [ ] Both clips start from the first frame in under 10 seconds.
### P3.6 The printed one-page runbook
- [ ] Cable map; speaking order with cue lines and the bridge line; the failure triggers (P5); clip locations; reset steps; freeze sign-off boxes.
- [ ] Two printed copies: operator's seat and rig lead.
### P3.7 The 10-second reset
| Step | Action | Seconds |
|---|---|---|
| 1 | Press "Start over" (or the panic key if a note is stuck) | 2 |
| 2 | Load the seeded demo (take 1 replay ready, tempo at the stored start) | 4 |
| 3 | Check the start state: first screen, keyboard dot green, sound on | 4 |
- Time it twice every rehearsal. "Start over" and the panic key are plan items (build-plan sections 9 and 10); confirm they exist in the build.

## P4. Rehearsal schedule (Saturday to Wednesday)

### P4.1 Plan
| When | What | Operator | Who | One purpose |
|---|---|---|---|---|
| Sat 7 | Capture take 1 and clip v1 (recorded on the real laptop, new voice clip separately) | Justin | Carlos, Justin | Take 1 exists and replays; the clip is from the build, not a cover |
| Sun 8 | First full timed read, no demo; gather kit | Carlos logs | Simone, Justin, Carlos | Script length; set the speaker split |
| Mon 9, 08:00 | Criteria session (monday-criteria-drill.md s10) | Simone leads | All | Map the criteria; decide what changes |
| Mon afternoon | Device test; ask the sponsor AV questions (P12); keyboard on a venue screen if allowed | Carlos | Justin | Rig facts replace guesses |
| Mon night | 45-minute surprise-task drill (surprise-task-drill.md s4) | Rotates | All | Practise answers without breaking the freeze |
| Tue 12:30 | Code merge cut-off; 13:00 to 15:00 freeze prep (cache bump, redeploy, reload every device, clip v2) | Justin | All | Release candidate |
| Tue 15:05 to 15:25 | Run 1: baseline timed run | Justin | All three | Script, demo and timing; set the split |
| Tue 15:30 to 15:50 | Run 2: operator swap | Carlos at the keyboard | Same | Understudy works; reset timed twice |
| Tue 16:00 to 16:20 | Run 3: hard questions after the pitch | Justin | Same | Each answers one question (privacy, feasibility, cost); time the 45 s stand loop once |
| Tue 16:30 to 16:50 | Run 4: failure drills as 30 s drills, not inside one pitch | Justin | Same | One chosen failure per drill, with its sentence |
| Tue 17:00 to 17:30 | Run 5: cold start (30 min: reboot, server launch, MIDI prompt, then one full pitch) | Justin | Same | Airplane mode, fresh browser launch, no warm-up; if over time, split the cold start from the pitch |
| Tue 17:30 to 18:15 | Fix list, re-tag, pack the rig, print the runbook | All | None | Fixes only; re-record only if code changed |
| Wed, after arrival (A+20) | Run 6: clean timed run at the stand with the real chain | Justin | Same | Real HDMI, real volume, clip switch |
| Crew's tech-check slot (not C-30 by assumption) | Chain check: input, resolution, audio route, one played note on the real screen | Carlos with the crew | Justin | Handover agreed; no full pitch |
| Wed C-30 at the stand | Run 7: final cold start, one run, no stops; optional: drop it if the stand-to-stage walk or the crew's call leaves under 30 minutes, and do a server and MIDI health check instead | Justin | All | Last green run |
- Tuesday's return bus is 19:00 (key-facts section 1); leave the stand by 18:30.
- Timed runs use the real device, keyboard and slides; a run that stops for talk does not count.
- Assumption: a Tuesday venue with a screen is available. The pack does not say; if not, use a stand-in monitor.
### P4.2 What to time and log every run
| Measure | Target (proposed) |
|---|---|
| Clock start | The official pitch clock start (walk-on included if the organisers count it; P12) |
| Total pitch | 2:40 to 2:50 for a 3:00 limit |
| Each speaker | Simone about 0:50, Justin about 1:10, Carlos about 0:40 (proposal; set in run 1) |
| The 60 s demo | 1:00 plus or minus 5 s |
| Cue to first pitch line on screen | Under 3 s |
| Retake result | Visible improvement on the proof card |
| Reset | 10 s or under |
| Clip switch | Under 10 s from the decision |
| Projected readability and audio route | Pass or fail, one line |
- Log per run: number, operator, speaker order, times per section, missed cue, failure and recovery seconds, one change. Kept by a person who is not speaking.
### P4.3 The cut rule and the freeze rule for people
- Over 2:50: remove premarked context lines, last-marked first; rerun before changing anything else.
- Always keep: the problem, the live attempt, one cue, the retake proof, the teacher hand-off card, the ask.
- No new line after run 2. Under 2:30: slow the pace, add no words.
- Bridge rule: if a speaker is silent for 2 s (proposed), the next speaker says the bridge line and takes the next scripted line; no apology, no restart.
### P4.4 Speaker rotation
- Speaking parts stay; the operator rotates. Everyone can run the reset, the clip switch and the panic key by run 4.
- Run 3: answer order rotates.

## P5. Stage failure ladder (fourteen rows; rows 2 and 9 share one branch)
- "Within 10 seconds" = reach a rehearsed continuation, not repair. The speaker keeps the clock moving; the rig lead acts and signals by one agreed gesture. No troubleshooting and no apology on stage.
- Thresholds (3 s stall, 5 s, one retry) are proposed settings (`unverified`; Codex knowledge); confirm in run 4.
| # | Failure | Trigger | Order of fallbacks | Sentence on stage | Who acts |
|---|---|---|---|---|---|
| 1 | Keyboard missing or unplugs | No note within 2 s of the first retake key, or device absent from the list | 1) on-screen keys now (laptop letters A S D F G H J K play C to C); 2) rig lead may re-plug off the take; the page can pick up the late port (src 6) | None, or "Same phrase, on the screen keys." | Operator; rig lead |
| 2 | No sound | Audio state suspended, or muted | 1) tap the sound-start control once (Chrome needs a gesture to resume audio, src 5); 2) visual only | "Sound is off, watch the bars." | Operator |
| 3 | Projector blank or lag | Black or frozen over 5 s | 1) narrate at once; 2) crew checks the input; 3) re-seat HDMI, then the spare adapter | "The screen is not showing, so I will describe the loop while the crew fixes it." | Rig lead; speaker narrates |
| 4 | App freezes or laptop fails | No response after one retry, or a stall over 3 s | Browser alive and display works: 1) clip tab. Laptop frozen but display path up, or laptop dead: 2) the already-connected clip device, only if its display route was rehearsed; 3) backup laptop only if the crew allows time. Display dead: narrate the proof and the teacher card | "Here is the same practice loop, captured on this laptop on Tuesday." | Carlos (rig); Justin keeps speaking |
| 5 | Wrong tap, stuck note, lost state | Wrong screen or a note sounds on | "Start over" or panic key if the return point is under 10 s; else skip to the next visible proof | "Let me show the next step." | Operator |
| 6 | Dim screen, sleep, battery warning | Display dims or a warning shows | Wake once; connect power | None | Operator; rig lead |
| 7 | Projector on the wrong input | Crew screen shows another source | Speaker narrates; crew selects the labelled laptop input | As failure 3 | Crew; speaker |
| 8 | Laptop asks for a password | Lock screen on the stage screen | Speaker continues; rig lead unlocks off-mic. Prevention: no lock, no sleep (P2.2 q10) | As failure 3 | Rig lead |
| 9 | Autoplay blocks audio (same branch as failure 2) | Silent first note, audio state suspended | One tap on the sound-start control; else visual only | "Watch the bars." | Operator |
| 10 | Keyboard appears after page load | Keyboard plugged late or the list is empty | On-screen keys; reselect only if the control was rehearsed | None | Operator |
| 12 | MIDI permission prompt appears with the keyboard connected | Chrome dialog on the stage screen | Accept it once off the live take, or use on-screen keys at once; the prompt is drilled in run 5 (Chrome 124 gates all Web MIDI, src 4) | None | Operator |
| 13 | Wrong window, notification or private desktop shown | Anything but the app or slides on the stage screen | Speaker narrates; operator switches to the rehearsed window; check the audience screen before handover | As failure 3 | Operator; crew |
| 14 | Local server stopped or failed to start after a restart | Page will not load | Clip device; health check (open the tagged URL, confirm the cache version) at A+20, C-40 and C-30 | As failure 4 | Justin; Carlos |
| 11 | Bright room washes out the pitch line | Line faint on the stage screen | Speaker says the result aloud; rig lead asks the crew to dim the lights; a tested high-contrast view only if one exists in the build | "The line reads: [say the result]." | Speaker; rig lead |
- Switch to the clip after one failed retry, any stall over 3 s, or mirroring lost over 5 s, and only if the display works.
- Say it plainly; never present the clip as live; the screen label says "recording" too (P10). Label it an excerpt and say which steps it shows.
- One primary clip route: the clip tab on the stage laptop (P5 failure 4). The spare-device route needs its own rehearsed display connection; if it is not rehearsed, it is not a fallback.
- Webex: the stage artifact is the labelled screenshot; the pre-sent message is for the stand only (different place, same label rule).
- Drill rule: failures are drilled as 30-second drills in run 4; Wednesday run 6 is clean.
- Webex card: the stage shows a labelled screenshot, so there is no live login (cisco-fit-note-v1.md s2). If the slide fails: "This is the hand-off we designed; here is the captured screen." (mock) or "This is the test message we sent; here is the capture." (a real test). Never mix the two words.

## P6. Showcase stand plan

### P6.1 Set-up and loop
- After the pitch an expo-style showcase at the NIIN stand (key-facts section 1); stand hours are not in the pack.
- One device at the start state; loop: attempt, one cue, retake, hand-off card, reset, next visitor. Proposed 45 s; time it in run 3.
- Noise: lead with the visible cue and on-screen keys; the clip is the last fallback.
- Stand rig: secured mains power; check cables at each role rotation; the stand uses the second laptop and the pre-sent Webex message on a second screen (cisco-fit-note-v1.md s2).
- Reset after every visitor: "Start over", seeded demo, no leftover take, start screen verified.
### P6.2 The 20-second table pitch (about 50 words)
- "Beginners often know a note sounded wrong but not what to do next. Our practice coach shows the pitch, gives one plain-language fix and checks the retake. Then a teacher gets a short hand-off card. Want to try one phrase?" (Same wording as the stage pitch; no superlative or novelty claim. "Listens" is dropped for the keyboard path: MIDI sends exact notes and does not hear; demo-instrument-decision.md s1.)
### P6.3 Three roles at the stand
| Role | Does |
|---|---|
| Host (Simone) | Greets, runs the 20-second pitch, asks one feedback question |
| Operator (Justin) | Runs the app, watches for issues, notes any failure |
| Rig and queue (Carlos) | Power, screen, cables, queue, resets |
- Rotate every 30 to 45 minutes; assign breaks and a handover check; the host drinks water and eats. Never leave the stand unattended.
### P6.4 Feedback capture, minors and privacy
- Paper tally and a small card (one rating, one optional comment) is the default; a QR form only if the team hosts one.
- Collect no names, contact details, ages, photos, voice recordings or other personal data. Treat any visitor as possibly under 18 (designed to the draft Children's Online Privacy Code, privacy-design-v1.md).
- Do NOT tell visitors "nothing is stored" until the build is checked: reset does not prove deletion. Clear the local store at the end of each visitor block and at the end of the day.
- Claim only what the loop shows: one attempt and one retake on one phrase; not a learning gain. Say "compares this retake", not "checks the retake" as a general claim.
- Note-taker leaves out any identifying detail a visitor volunteers (names, school, age) and shreds paper notes after the follow-up list is typed.
- Do not photograph or record visitors; ask the venue about filming rules (P12).
### P6.5 Reviewer-feedback note
- One shared note, one line per entry: time, reviewer role if volunteered, exact words, issue seen, follow-up owner. No names; keep exact wording; write it within 10 minutes.

## P7. Wednesday run sheet (7 am bus to the stage call)
- Fixed points: 7 am bus, breakfast at WoS, final build, rehearsal, stage pitch then showcase, awards at close, return 6:30 pm (key-facts section 1). A = arrival; C = stage call; shift offsets when C is confirmed.
- Rule: no feature work; only fixes to a failing step.
| Time | Action | Lead |
|---|---|---|
| 06:30 | Rig bag packed, devices charged, printed runbook in hand | Carlos |
| 07:00 | Bus to WoS; keyboard, laptop and cables as hand luggage, never the hold | All |
| On the bus | Review the script once silently; no laptop work | All |
| A | Arrive; find stand, stage, stage manager, breakfast | All |
| A+20 | Rig set-up at the stand: power, HDMI, keyboard; one cold start in airplane mode; server started; audio and projected readability checked | Carlos, Justin |
| After breakfast, before C-60 | Run 6: full timed run, official clock; logger records cuts and recovery | All |
| C-60 | Clip played from the spare device, paused at frame one; switch tested; backup copy ready | Carlos |
| Crew's tech-check slot (else C-50) | Agree input, resolution, audio route, cable position, handover point; one note played on the real screen; tell the crew the failure signal | Carlos with crew |
| C-40 | Reset in 10 s; MIDI permission check after a fresh browser launch | Justin |
| C-30 | Run 7 at the stand: restart the browser in airplane mode, one run, no stops | All |
| C-20 | Phones, including the story device, to airplane mode; app and clip reset; first slide, start state and clip first frame checked; laptop on power with Do Not Disturb, no lock | Simone, Carlos |
| C-15 | Brightness max, volume at the mark; decide who carries each item | Carlos |
| C-10, or the crew's call | Rig lead hands the connected, unlocked rig to the operator position; the designated player holds the keyboard; crew confirms the audience screen shows the start state | Carlos |
| C-5 | Speakers in place; operator keeps the screen awake; water; breathe | All |
| C | Stage call | Simone opens |
- Stage input not HDMI: use the USB-C adapter tested on this day.
- After the pitch: reset at the stand and begin the showcase roles (P6).

## P8. Delivery rules for a 3-minute timed pitch with a live demo
1. Open with the learner's problem in one sentence; no preamble.
2. Preview the action, then name the result once it appears.
3. Cue meaningful actions; do not narrate every click.
4. Pause briefly for the proof; never wait indefinitely for an animation.
5. Say the single fix aloud, then play the retake live.
6. Claim only what the screen shows; label replay, mock and clip as such.
7. The speaker keeps talking; the operator signals whether the display recovered; never wait on a cable.
8. Show the teacher card briefly and name its purpose.
9. Hand-offs use a fixed bridge line, no thanks or filler.
10. Finish by 2:50 on the ask, leaving ten seconds.
11. Face the audience, not the laptop.
12. Stop explaining features the screen cannot show.

## P9. The three-minute run order with timings (proposed)
- Beats follow pitch-v0.md and the 60-second demo table in demo-instrument-decision.md s4. All times are proposals to set in run 1; speaker lines marked "confirm" because the memo's demo table and its who-stands-where table were only partly read for this note.
| Clock | Beat | Screen | Speaker or operator |
|---|---|---|---|
| 0:00 to 0:10 | Problem in one sentence | Slide 1 | Opening speaker |
| 0:10 to 1:00 | Learner story (voice is a still, not a clip); 50 s is long, cut to the essential line in run 1 | Slide 1, still | Carlos's story beat (confirm) |
| 1:00 to 1:08 | Goal card: "play this song for Mum"; small goal | App, start state `[PHRASE]` | Words: "My goal is the song. Today's small goal: the first phrase, steady." |
| 1:08 to 1:20 | Take 1 replay, labelled "take 1, recorded Saturday" | App | "My first try." |
| 1:20 to 1:30 | One-fix card | App | "One thing, in plain words, and it shows me what it wanted." |
| 1:30 to 1:42 | Count-in, live retake on the MIDI keyboard | App | Justin plays; no words |
| 1:42 to 1:50 | Proof card: "On the beat: 4 of 8 to 8 of 8" (illustrative; the real number comes from the take and the live retake; never edited by hand) | App | "The retake shows it worked." |
| 1:50 to 2:00 | Ceiling card: hand-off to a teacher (Webex mock as a labelled screenshot) | Slide with screenshot | "And when the next step needs a real teacher, it offers me one." |
| 2:00 to 2:40 | Next steps, buyer and the ask | Slides | Third speaker |
| 2:40 to 2:50 | Stage variation buffer | Last slide | Ends on the ask |
- Fallback cut points: if the retake has not started by 1:35, go to failure 1 or 4 (P5). Take-1 fix sentence if the retake does not improve: "Not yet. Same one fix, slower click. One thing until it works."
- "It knows every note you play", never "it hears you" (MIDI path).

## P10. Recorded-clip rules
- Two clips, never mixed up:
  o Clip A (fallback): the same run as the live demo, recorded on the stage laptop at the frozen build, including the proof card and the teacher card, about 20 s (tech-keyboard section 8).
  o Clip B (voice story): about 10 s of Carlos singing the same `[PHRASE]` into the app's voice screen, recorded new; for the stand and Q and A only, not in the three-minute pitch.
- Never use a cover take or any karaoke recording (YouTube karaoke, state-of-play s5; rights R13). Only the public-domain phrase, our synth and our note list.
- No visitor, student or crowd voice in any clip; Carlos's own voice is his privacy call.
- Label it "recording" on the screen and aloud; never present it as live.
- Store: local file on the laptop and on the spare device; plays from the first frame in under 10 s; named file, named player, display route and cue point on the runbook.
- Re-record only if the build changed after 15:00. Clip v2 is made in freeze prep; v1 on Saturday is a rehearsal copy.
- Screen-recording tool and frame-rate settings: not researched tonight (`unverified`); the team tests that the clip plays with sound on the second device.

## P11. Claims not to make on stage
- Banned by house rules: "first", "nobody has done this", "no one else"; anything about AI generating music; the do-not-say lines in state-of-play s5.
- Privacy: say only the one sentence from privacy-design-v1.md s6 (23 words): "Audio stays on the device; the cloud coach sees numbers and your typed goal; a teacher hears a clip only if you share." True of the design; true of the demo only if the build matches. The sentence says "device" and the stage rig is a laptop: say it only for a verified phone flow, otherwise say "device" after the team checks the build (open question 13). Never say "numbers only", "only anonymous numbers leave the phone", "we are privacy compliant", "your data stays in Australia". Say "designed to", not "compliant".
- Do not say "it hears you" on the keyboard path; do not say "nothing is stored".
- Webex: never say the hand-off was live unless it was; do not claim erasure (the message stays under the Webex organisation's retention, unverified).
- Evidence: n = 1 and one retake on one phrase prove the loop, not a learning gain, reliability, offline use on a learner's phone or trust among young learners (surprise-task-drill.md s3).
- Price: no pilot price on stage; the cost is a placeholder.
- Clip: never call it live; never claim a real-time result from it.
- Offline: "built for offline, tested on a laptop" unless a phone test passed.

## P12. Stage AV questions for the sponsor
- Already an open row: questions-for-sponsor.md row 34 (HDMI input, mirroring, house audio, stage call time, slot length, USB MIDI keyboard on the stage table). Do not add a duplicate row.
- Additions to say at the same ask, from this critique: is there a tech-check slot; does a stage clock exist and does the clock include walk-on; does the crew set the display input; is the room lighting adjustable; does the crew mind a laptop in airplane mode; are filming rules in force at the stand; are applause and Q and A inside the 3:00.

## Method
- Read the parent, the critique answer, the team files named in the brief (sections), and COMMON-RULES. The critique is a model's claims with no web: each was treated as a lead.
- Web sources opened (fetched and read): src 3 MDN secure contexts, src 4 Chrome Web MIDI prompt, src 5 Chrome autoplay, src 6 MDN `statechange`. Snippet only: src 7 to 9.
- Corrected or rejected: ledger rows 10, 12, 13, 21, 27, 31 (corrected); none rejected outright.
- Not verified: MIDI grant persistence after a relaunch; projected latency; Windows audio switch for the stage laptop OS; screen-recording tool settings; Web MIDI per-origin storage.
- Codex call 1 (gpt-6-sol, medium, names replaced by Lead A/B/C, whole v1 pasted), exit 0. Kept: only five sessions are not all full runs (relabelled); run 5 given 30 min; run 7 optional; narrate first on a blank projector; clip route made single and rehearsed; three failure rows added (MIDI prompt, wrong window, server down); excerpt label; criteria check reworded; note-taker identity rule; privacy-sentence phone versus laptop flagged. Rejected: the proof-card contradiction (P9 already carries the not-yet line); Webex inconsistency (stage and stand are different, now stated). Merged: no sound and autoplay.
- 6 to 7 Nov overnight: corrected from consistency-audit-v1.md row 5
  o line 328 follow-on wording changed from says phone to says device, to match the corrected sentence

## Open questions
1. Stage call time, slot, bus ride length (Pre-Arrival Pack).
2. Who holds which role (research and UX, model and web, rig)?
3. Does the stage take HDMI or USB-C; is there a tech-check slot; is the stage free at C-30?
4. Does the build have "Start over", a panic key, a sound-start control, a late-keyboard path and a demo mode that keeps no visitor take?
5. Is there a stage clock and does it include walk-on and applause?
6. Does MIDI permission persist after a fresh Chrome launch on the stage laptop? Test; no source says.
7. Which OS and audio route does the stage laptop use; does the crew take laptop audio into the house PA?
8. Is a clicker needed, or does the operator advance the slides?
9. `[PHRASE]`: Twinkle bars 3-4, Ode to Joy bars 1-2, or London Bridge bars 3-4? Lock by Mon 17:00.
10. Failure 1: replay-then-on-screen (memo) or on-screen at once (this v1)? Team to confirm.
11. Who speaks which demo lines: the memo's beat table words and the who-stands-where table need one reading.
12. Stand hours, filming rules, QR form or paper only.
13. Privacy sentence: does the stage flow keep audio on the device it runs on, so "device" can replace "phone"?

## Sources
1. freeze-and-rehearsal-playbook.md (parent), opened 2026-11-06.
2. freeze-critique-answer.md (GPT-6 Sol, high, no web), 2026-11-06: leads only.
3. https://developer.mozilla.org/en-US/docs/Web/Security/Defenses/Secure_Contexts, accessed 2026-11-06, opened.
4. https://developer.chrome.com/blog/web-midi-permission-prompt, accessed 2026-11-06, opened.
5. https://developer.chrome.com/blog/autoplay, accessed 2026-11-06, opened.
6. https://developer.mozilla.org/en-US/docs/Web/API/MIDIAccess/statechange_event, accessed 2026-11-06, opened.
7. https://support.google.com/chrome/answer/114662 (Chrome site permissions help), accessed 2026-11-06, snippet.
8. https://www.dell.com/Support/article/pa/en/padhs1/SLN286116 (no sound over HDMI or DisplayPort; Windows may change the default device), accessed 2026-11-06, snippet.
9. https://learn.microsoft.com/en-us/answers/questions/5742277/windows-outputs (Q&A thread on output device switching), accessed 2026-11-06, snippet.
10. Team files (sections only), opened 2026-11-06: demo-instrument-decision.md, surprise-task-drill.md, monday-criteria-drill.md, demo-phrase-and-rights.md, cisco-fit-note-v1.md s2, privacy-design-v1.md s6, questions-for-sponsor.md row 34, state-of-play-2026-11-06.md, key-facts-info-pack.md, plan-2026-11-02-to-11.md, build-plan-v0.md, tech-keyboard-input.md (via the parent's quotes).
