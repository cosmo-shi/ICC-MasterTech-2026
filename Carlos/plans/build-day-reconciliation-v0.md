# Build-day reconciliation v0: Saturday 7 Nov, one plan from six files

- Date: Sat 7 Nov 2026, 03:40 to 05:30 AEDT (overnight run); folder files only, read 2026-11-07; no web research.
- Purpose: join build-plan-v1, the feature menu, both prototype reviews and the stack review into one Saturday plan.
- Scope: Saturday 09:00 to 21:30; the contract freeze at 12:00; what waits for Sunday and Monday.
- Status: overnight draft for the team; verify before the pitch. Proposals only; no other file edited; skeleton untouched.

## 1. One page

- Bottom line:
  o Saturday builds on prototype-skeleton.html as one file on localhost; most build-plan-v1 morning tasks already exist there.
  o The real morning job: capture take 1s, land the v1.2 rules before 12:00, add MIDI guards, finish stage chrome.
  o Sat to Mon closes per role only with the 4 h credit on the rig lead plus cut 2 (G7 to SHOULD).
  o Saturday alone runs over for two roles; the spill lands on Monday (section 3, after the Codex check).
  o Live voice is not started Saturday unless checkpoint C is green early (menu cut 1).

### By the 12:00 contract freeze (take-data-contract s7: change rule after Saturday 12:00)

| Item | Source row | Who (role) | Done-when test |
|---|---|---|---|
| 09:15 skeleton credit check, the day's opening test | menu Open questions (credit); Codex critique s5 | Rig lead | Exact file in stage Chrome: `#selftest`, then count-in, take, cue, proof on the input at hand; working L2, L3, L4, L5, L6 parts written down |
| Three asks sent: Dan's message, teacher email via John and Frank, Frank's outreach introduction | success-conditions s7 #1; sheet A30, A31; success-conditions s6 rows 1, 2 | Rig lead sends; research and UX lead pre-fills | Each sent; send time noted |
| Keyboard state known | build-plan s8 T1; stack-review U1; questions-for-sponsor row 42 | Rig lead | Real note numbers light keys, or "no keyboard yet" logged and on-screen keys declared |
| Self-test in real Chrome on localhost | prototype-review s6 row 1; stack-review U4 | Rig lead | `#selftest` shows 22 pass, 0 fail |
| Five or more real take 1s read; scripted cue chosen | prototype-review D1; sheet A24; stack-review U2 | Model and web lead plays; rig lead reads | One unedited capture fires K3, or the cue switches (K1) with the spoken line |
| Contract v1.2 rules: A1 sequence fallback, A2 zero wrong keys, A3 K7, A4 M2 needs most notes | prototype-review second review; sheet A25 | Rig lead | Tests 7 to 9 in section 4 pass; 22 plus new fixtures green |
| MIDI guards and A14 to A16, A18 coded (browser glue, outside the freeze) | prototype-review second review; sheet A26 | Model and web lead | Code in by 11:45; tests 10 to 15 by checkpoint A |
| Copy for proof card, cue, M1 and M2, and the mock screen | prototype-review s6 rows 10:20 to 11:30 | Research and UX lead | No banned or engineering words (engine spec s10 list) |
| Journey keeper named, not the build operator | sheet A32 | Team | Name agreed at the stand-up |

### By end of day (21:30)

| Item | Source row | Who (role) | Done-when test |
|---|---|---|---|
| Full keyboard arc on the frozen rules | build-plan s8 checkpoint A target; menu M1 | All | Count-in, take, cue, live retake, count pair, by MIDI (if present) and on-screen keys |
| Stage finish: stage mode, proof copy, restart, reset | menu L8 (M3); prototype-review D2 to D10 | Rig lead D2, D3, D5; model and web lead D9, D10 | Tests 20 and 21 pass |
| Real capture shown as labelled replay | menu L7 (M2); stack-review s7 build rules | Rig lead | Banner reads REPLAY; `TAKE1_IS_CAPTURE` true only with a real capture |
| "Why this cue" strip | menu V1 (M7) | Model and web lead | Measured values, rule id and "Chosen by rules, on this laptop" visible |
| Hand-off mock screen, card content, button at miss 3 | menu H1, H3 (M5); prototype-review D6, A9 | Research and UX lead; model and web lead | Test 19 passes |
| HTTPS deploy of the single file | menu O2 (M6), moved per sheet A27 | Model and web lead | Teammates can open the same build Sunday (build-plan s8 Sun) |
| Three timed arcs, then recording v1 | build-plan s8 checkpoint D; menu O3 (M6) | All | Three runs in a row, no restart; clip on two devices (melbourne-kit s8 line 5) |
| Packing check | melbourne-kit s8 (Sat 18:00) | Rig lead; research and UX lead | Ten lines answered yes, or fixed before Sunday |
| Teacher review prepared | menu E2 (MUST since 7 Nov) | Research and UX lead | Review sheet ready; call asked for Mon 9 or Tue 10 |
| One real goal-split answer saved, only if checkpoint D is green | build-plan s8 20:00 and critical path; sheet A8 | Model and web lead | Schema-valid answer saved with its date (stack-review U12) |

### Three decisions at 09:00, before any code

| # | Decision | Lean the files carry | Source |
|---|---|---|---|
| 1 | Send the asks with lead time (Dan, teacher via John and Frank, outreach introduction) | Yes, Saturday morning; never "first customer" | success-conditions s7 #1; sheet A30, A31, B6 |
| 2 | K3 capture rule and the pass rule before the 12:00 freeze | Keep an honest K3 capture, else K1; zero wrong keys | success-conditions s7 #2; sheet A24, A25 |
| 3 | Re-split MUST hours off the rig lead | Move G7, O1, O2 to the model and web lead; panel chair: cut scope first | success-conditions s7 #3 and panel chair "Decide before Saturday 09:00"; sheet A27 |

- Ride-along leans, no debate needed (file defaults apply if nobody objects):
  o Build on the skeleton (sheet A29: decisions-log starting point); single file on stage (sheet A28).
  o Add the five MIDI guards; cut A5 and A6 if short (sheet A26).
  o Extra-note rule (prototype-review A5) is a team call; default here: leave as is, decide Sunday.

## 2. Task reconciliation

- Key: BP = build-plan-v1 s8 and s14; Menu = feature-feasibility-menu-v1 s3, s4; PR = prototype-review-v1; SR = stack-review-v1.
  o Roles: IR rig lead, MW model and web lead, RU research and UX lead. Hours as each file states them.
  o "Predates skeleton" = BP was written for a fresh `app/` folder; the menu credits about 4 h (L2 1, L5 2, L6 1).
  o "est." = this note's estimate, `unverified`.

| Item | BP (h, owner, slot) | Menu (row, h, role, tier) | PR / SR | Conflict | Proposed resolution, one reason |
|---|---|---|---|---|---|
| T1 rig check | 1 h (budget); IR; 09:00-09:30 slot | L1, 1, IR, MUST M1 | PR s6 09:00-09:30 IR; SR U1, U4, U5, U7 by 09:20 | Hours: 0.5 h slot vs 1 h budget; dependency: no keyboard secured (row 42) | IR 09:00-09:30 inside the stand-up; U5, U7 to 09:30. SR timings fit 30 minutes |
| T2 phrase files, stage.json | 2 (with T3); IR; 09:30-11:00 | L2, 2, IR, MUST; credit about 1 | Skeleton self-test already holds 3 phrases (PR A11) | Predates skeleton; three phrases cost about 1 h more (BP s8 side by side) | No phrase work Saturday; Ode bars 1-2 default (sheet A1). Skeleton already loads them |
| T3 contract, thresholds, fixtures | 2 (with T2); IR; by 12:00 proxy schema | L2 (as above) | PR: v1.2 rules must land before 12:00 | Order: BP never lists v1.2; proxy schema at 12:00 vs G7 moved to MW | L2's 1 h residual = v1.2 note and A1 to A4 fixtures, by 11:45. Proxy copies frozen fields later |
| T4 matcher test-first | 3.5 (with T8); IR; 09:30-11:00 | L5, 3.5, IR, MUST; credit about 2 | PR A1 sequence fallback; drift-aware matcher 90-120 min (D1, unverified) | Predates skeleton (matcher passes F11, F13: SR s2) | A1 inside the 10:15 block; drift-aware matcher not Saturday (PR s6). Capture route is cheaper |
| T5 clock, count-in, M2 | 2 (with T29); MW; 09:30-11:00 | L3, 3.5 (T20, T5, T29), MW, MUST | Skeleton has count-in at 80 bpm and own synth; PR A17, A18; SR U3 is IR | Predates skeleton; owner split: code MW, U3 test IR | MW 1 h est.: A17, A18, beat-zero check beside U3. Code exists; hardware is the risk |
| T6 on-screen keys | 3 (with T7); MW; 09:30-11:00 | L4, 3, MW, MUST | Skeleton has on-screen and letter keys; touch untested (SR s2) | Predates skeleton | No build; it is Saturday's input if no keyboard. Exists and passes in headless Edge |
| T7 Web MIDI, statechange, panic | 3 (with T6); MW; 11:00-12:30 | L4 (as above) | PR: A14 to A16, guards 2, 3 about 45 min (unverified); guards 1, 4, 5 unplaced; sheet A26 | Hours: guards not in BP; placement of guards 1, 4, 5 | MW 10:15-11:45, 1.5 h est. incl. PR's 45 min. Outside the freeze; needed before rehearsal |
| T8 K-rules, features, persistence | 3.5 (with T4); IR; 11:00-12:30 | L5 (as above) | PR: A1 to A5, K7 about 90 min, before 12:00; T8 overruns its 1.5 h block | Order: BP block ends 12:30, after the 12:00 freeze; hours over the block | IR 10:15-12:00; A5, A6 cut first (PR). Persistence dropped: no storage on stage (SR s7) |
| T9 fix card, proof pair | 2; IR; 11:00-12:30 | L6, 2, IR, MUST; credit about 1 | PR A8, A10; D3 pass copy already fixed; D5 open | Predates skeleton (both cards exist) | IR 13:00-14:00: A8, A10, D5, stage copy. Remaining work is guards and copy |
| T10 replay captures | 1; IR; 13:00-14:30; one per phrase | L7, 1.5 (IR 1, MW 0.5), MUST M2 | PR D1 capture 09:30-10:00; SR U2 09:30-10:00; sheet A24 | Order: 13:00 vs 09:30; scope: three phrases vs one | Capture 09:30, one phrase; store it 13:00. Cue choice must precede the freeze |
| T11 mic path | 2.5; MW; 13:00-14:30 | L15, 2.5, MW, SHOULD cut 1 | SR U13 voice proof Sat 17:30 | Tier: BP main line vs menu cut 1 | Not started unless checkpoint C is green and MW is 2.5 h ahead. MUST fills capacity |
| T12 range check | 1.5; MW; 16:30-17:30 | L17, 1.5, MW, SHOULD cut 1 | none | Tier | Goes with voice. Same reason as T11 |
| T13 voice adapter, V-rules | 3.5; MW; 14:30-16:30 | L16, 4.5 MW (T13 3.5, T14 1) plus 1 RU, SHOULD cut 1 | SR U13 | Hours 3.5 vs 4.5; tier | Cut Saturday; voice stays the story. Menu cut order 1 |
| T14 phone and noisy-room test | 1.5; IR phone, MW and RU noisy room; 17:30-19:00 | L16 part; O5, 1.5, MW, SHOULD | SR U14 rig lead, Monday | Owner: IR (BP, SR) vs MW (menu O5) | Monday, MW, if hours (O5). Noisy room only with voice. Rig lead has no spare hours |
| T15 engine split, templates | 2; IR; 13:00-14:30 | G2, 3 (IR 2, RU 1), MUST M4 | SR: engine not in skeleton (status O) | Hours: +1 RU; IR overload | RU writes templates and names Saturday; IR codes Monday. IR Saturday already at 7.6 h of 7.5 |
| T16 progress lines, controller | 2; IR; 14:30-16:30 and Mon | G3, 1 (0.5 static), MUST; G5 controller, SHOULD cut 2b | PR D7: two static lines | Tier: controller is SHOULD | G3 static (0.5) Monday; controller cut. Menu calls G3 a weakest MUST |
| T17 screens 0 to 8 | 3 (with T18); IR; 14:30-16:30 | no row (inside M1, M3, M4) | Skeleton has goal, take, cue, proof, hand-off screens | Predates skeleton | No new screens Saturday. Sheet A29 lean: build on the skeleton |
| T18 sample week | 3 (with T17); RU content 13:00 | G4, 1, SHOULD cut 6 | none | Tier | Not Saturday. Cut 6 |
| T19 hand-off card, Webex-style mock | 1.5; RU; 13:00-14:30 | H1 1.5 RU, H3 0.5 RU, H2 0.25 IR, MUST M5 | PR D6 30 min RU 11:00-11:30; A9 button after checkpoint B; CSP allows `img-src data:` | Hours 1.5 vs 2.25; order 11:00 vs 13:00 | RU D6 11:00-11:30, H1 13:00-14:30; MW A9 14:30; IR H2 Monday. D6 is cheap stage chrome |
| T20 shell, IndexedDB | 1.5; MW; 09:30-11:00 | L3 part | SR s1, s7: no storage on stage; sheet A28 | Predates skeleton and the single-file lean | Not built for stage; Python localhost serves the file. Decisions-log row wins (success-conditions #8) |
| T21 telemetry (with T28, T31) | 1.5; Mon | E4, 1.5, IR, SHOULD cut 3 | none | none | Monday, only if sheet A5 allows |
| T22 service worker | 1.5; IR; 16:30-17:30 | O1, 1.5, IR or MW, MUST M6 | SR U9: CSP must widen; sheet A28: phone proof only | Tier, order and owner | Off the stage MUST; MW builds for the phone proof Monday if hours. Fewer stage failure modes |
| T23 HTTPS deploy | 1.5; IR; 17:30-19:00 | O2, 1.5, IR or MW, MUST M6 | SR U14 rig lead, Monday | Owner | MW Saturday 15:00-16:30, single static file. Sheet A27 re-split |
| T24 learner-word chips | 1; RU copy Sat 14:30, build Mon | L12, 1, SHOULD cut 6 | none | none | Not Saturday. Cut 6 |
| T25 runs, recordings | 3 (Sat and Tue); all; 19:00-20:00 | O3, 1.5 (IR 1, MW 0.5), MUST M6 | PR test 13 timed arc | Hours 3 vs 1.5 (BP adds runs and fixes) | Keep BP's 19:00 slot. On the never-cut list |
| T26 goal split via proxy | 2.5 (1.5 Sat 20:00 if D green); IR; rest Mon by 14:00 | G7, 2.5, MUST M8, cut 2; owner IR (BP) vs MW (sheet A8) | SR U12 MW, Mon 14:00 | Owner: BP s8 gives it to the rig lead; A8 and success-conditions row 4 give MW | MW owns; 45-minute real request Saturday only if D is green. Sheet A8, A27 |
| M3 stage finish (L8) | none (predates skeleton) | L8, 1.5 IR plus 0.25 RU, MUST | PR s6 09:00-12:00, review minutes sum to 95 | Order: chrome fixes compete with freeze-bound rules for IR's morning | D2 IR 12:00; D9, D10 to MW; copy RU. Freeze-bound work goes ahead |
| M7 "why this cue" strip (V1) | none | V1, 1, MW, MUST | success-conditions s4: about 8 s vs 5.6 s demo margin | Missing from BP; stage clock | MW 13:00-14:00; trim the one-fix line by 1 s (success-conditions s4). Answers "where is the AI?" |
| E2 teacher review | none | E2, 1 RU prep, MUST since 7 Nov | success-conditions s6 row 2: IR sends, RU runs the call | Owner split | RU drafts, rig lead sends at the stand-up. Lead time needs a Saturday send |
| P1 one learner age | none | P1, 0.5, RU, MUST | sheet A4 Saturday default: age-neutral UI; panel chair: draft Year 5 to 6 copy | Lean: age-neutral vs Year 5 to 6 draft | Age-neutral app copy; Year 5 to 6 only in draft slides. No code rework either way |
| P2 MIDI-true hook | none | P2, 0, MUST (line) | none | none | No build; pitch line only |
| P3 pilot-ask slide | none | P3, 0.5, RU, MUST | success-conditions s1 row 3: drafted Sunday | none | Sunday. Not build work |
| U1 to U17 untested list | T1 only | L1 only | SR s4: 17 tests; PR: 14 checks | U3, U6, U8, U16 have no hours in BP or the menu | 0.5 h est. for IR on Saturday; merged list in section 4 |

- Count: 33 rows; 29 with a conflict; 7 BP tasks predate the skeleton (T2, T4, T5, T6, T9, T17, T20); M3 has no BP task at all.
- Owner conflict flagged: BP s8 line 300 gives T26 to the rig lead; sheet A8 and success-conditions s1 row 4 give it to the model and web lead.

## 3. Saturday timeline by role

- Proposal: replaces overnight-digest-for-team s7 only if the team adopts it at 09:00.
- Capacity (menu s2): Saturday gross IR 10, MW 10, RU 8 h; realistic x 0.75 = 7.5, 7.5, 6 (this note's arithmetic).
- Keyboard may be missing (questions-for-sponsor row 42): see the branch below the table.

| Time | Rig lead (IR) | Model and web lead (MW) | Research and UX lead (RU) | Gate |
|---|---|---|---|---|
| 09:00-09:30 | Stand-up: three decisions; send the three asks at once; U1 (note numbers), U4; 09:15 credit check | Serve on localhost; Node self-test | Name journey keeper; pre-fill asks | Keyboard live, or on-screen keys declared |
| 09:30-10:00 | Read cues of five or more take 1s (U2, D1) | Play the take 1s | D3, D4, D5 wording; age-neutral copy | Cue chosen: K3 honest, else K1 |
| 10:00-10:15 | U3 sound and timing, laptop speakers | Steady takes for U3; beat-zero check | D7, D8 copy | U3 pass bar |
| 10:15-12:00 | A1 to A4 rules, K7, fixtures test-first (L2, L5 residual) | 10:15-11:45 T7 guards 1 to 5, A14 to A16, A18; 11:45 run new fixtures | 11:00-11:30 D6 mock screen; 11:30-12:00 E2 prep | Tests 7 to 9 green by 11:55 |
| 12:00 | CONTRACT FREEZE: no rule, threshold or field change after this | | | take-data-contract s7 |
| 12:00-12:30 | One clean arc, then D2 stage mode; U5, U7; U6 cold start | D9, D10 restart and reset; tests 10 to 15 | Copy into the page with MW | Checkpoint A at 12:30 |
| 12:30-13:00 | Lunch; U16 idle run on the stage laptop | Lunch | Lunch | |
| 13:00-14:00 | T9: A8, A10, D5, stage copy; store capture, set `TAKE1_IS_CAPTURE` | V1 strip | 13:00-14:30 H1 card content | |
| 14:00-14:30 | U8; test 9c after the capture is stored | A17, A18 check; beat-zero log | (H1 continues) | Checkpoint B at 14:30 |
| 14:30-16:30 | Fix list; buffer (D11, D14, D15 move to Monday) | 14:30 A9 button; 15:00-16:30 O2 deploy, U9 CSP check | G2 templates and names; G1 goal copy; Mastery checks (A34) | Checkpoint C at 16:30 |
| 16:30-17:30 | Fix list from C | Voice call (D4, sheet A9): default cut; else O4 on-screen loop (U11) | Journey capture; packing items 7, 10 | Voice only if C fully green |
| 17:30-19:00 | Backup laptop same build; 18:00 packing check | E1 benchmark if ahead (add 3), else fix list | E2 sheet final; packing check | Packing check yes |
| 19:00-20:00 | Three timed arcs; recording v1 (O3) | Recording v1 on a second device | Times the arcs | Checkpoint D at 20:00, after the arcs |
| 20:00-21:30 | Fix list only; build tag | 20:15 T26 real request (45 min), only if D green | Nothing new | Day ends |

- Checkpoint passes (this note, built from BP s8 cut rules):

| Checkpoint | Minimum pass | If red |
|---|---|---|
| A 12:30 | Skeleton minimum already exists (PR s5); arc runs on the frozen rules | Two builders fix the arc until 14:00 (BP s8) |
| B 14:30 | Self-test plus A1 to A4 fixtures green; capture fires its rule unedited | Only that rule and phrase (BP s8) |
| C 16:30 | Replay, cue with strip, live retake, count pair, mock at miss 3, no debug text | All fix it; no voice; prepare the labelled recording by 18:00 (BP s8) |
| D 20:00 (moved from 19:00: the arcs run 19:00-20:00) | Three keyboard arcs in a row, then recording v1 | Fix list only; T26 waits for Monday |

- Hours this timeline books, revised after the Codex check (task hours, not slot length):
  o The skeleton credit counts for one role only: the menu's 4 h on rig-lead rows L2, L5, L6.
  o This note's own MW estimate (L3 3.5 to 1, L4 3 to 1.9: 4.0 h) is withdrawn from closure; upside only.

| Role | Saturday booked | Saturday realistic | Sat to Mon booked | Sat to Mon realistic (menu s2) |
|---|---:|---:|---:|---:|
| IR (with the 4 h credit) | 7.6 | 7.5 | 12.35 | 12.75 |
| MW (menu rates, no credit) | 10.65 (11.4 with the 45-minute T26 request) | 7.5 | 13.65; 11.15 after cut 2 | 12.4 |
| RU | 6.0 | 6.0 | 7.0 | 9.4 |
| Total | 24.25 | 21 | 33.0; 30.5 after cut 2 | 34.55 (menu rounds to 34.5) |

- How the IR figure is built (menu rows, after the A27 move and the 4 h credit):
  o Saturday: L1 1, L2 residual 1, U-tests 0.5 est., L5 residual 1.5, L6 residual 1, L7 1, L8 0.6, O3 1 = 7.6.
  o L8 is 0.6, not 1.5: D9, D10 (25 min) go to MW; D11, D14, D15 (30 min, PR s5) to Monday.
  o Monday: G1 0.5, G2 2, G3 static 0.5, H2 0.25, D11, D14, D15 0.5 = 3.75; Sunday up to 1.
- How the MW figure is built (menu rates):
  o Saturday: L3 3.5, L4 3, L7 0.5, V1 1, O2 1.5, O3 0.5, A9 0.25 est., D9 and D10 0.4 = 10.65.
  o Sat to Mon: plus G7 2.5 and Sunday 0.5 = 13.65; O1 leaves the stage MUST (sheet A28).
  o If 09:15 shows L3 and L4 working, MW Saturday is 6.65 (7.40 with T26): estimate, not counted.
- Does it close?
  o Sat to Mon, with the 4 h credit and cut 2: yes per role (IR 0.4 h, MW 1.25 h, RU 2.4 h spare).
  o Saturday alone, with the credit: no. IR 0.1 h over, MW 3.15 h over; Monday absorbs (BP s8 spill).
  o Without any credit: no. IR 16.35 vs 12.75, MW 11.15 even after cut 2; IR fits only 17 h gross.
  o Moving G2 to MW does not rescue it: IR 14.35, still 1.6 h over (Codex, checked).
  o The 09:15 check decides which branch the day runs (section 1, opening test).
- Five likely slips and guards (Codex critique s2, each checked against this timeline):

| Slot | Why it slips | Cheapest guard | Drop if it slips |
|---|---|---|---|
| 09:00-09:30 T1 | Stand-up, sends and four U-tests in 30 minutes; L1 budgets 1 h | Send asks at once; U5, U7 after the freeze | U5, U7 to 12:00 |
| 09:30-10:00 U2 | Keyboard unsecured (row 42); five takes need a rig | Declare the on-screen branch at 09:00; flag stays false | K3 capture claim; script K1 |
| 10:15-12:00 rules | A1 to A4, K7, fixtures and an M2 share all on IR | Set the M2 share at the stand-up; one fixture per changed rule | A5, A6, then K7 if not green |
| 12:00-12:30 checkpoint A | MW finishing guards, D9, D10 and six test groups | One clean arc before anything else | Stage chrome to 13:00 |
| 19:00 checkpoint D | D was due before the arcs that define it | D moved to 20:00 | T26 Saturday request |
- Branch if no keyboard at 09:00 (row 42):
  o On-screen and letter keys are Saturday's input (BP s8 T1); log "no keyboard yet".
  o U1, U5, U7 and the real capture (U2) wait; `TAKE1_IS_CAPTURE` stays false.
  o IR starts the A1 to A4 block at 09:30, which eases the 12:00 freeze.
  o Cue choice K3 or K1 is script and data, not a rule change, so it may follow the freeze.
  o Deadlines: keyboard in the bag at the 18:00 check (kit s8 line 3); tested by Mon 14:00 (BP s8).
  o Buy option about A$90 to A$130 (sheet A3; `unverified`, no URL in that row).

## 4. Saturday test list in run order

- Merged from PR second review (14 checks) and SR s4 (U1 to U17); Monday-only U-tests listed last.

| # | What to run | Expected result | Gates | When |
|---|---|---|---|---|
| 0 | 09:15 credit check: `#selftest`, then count-in, take, cue, proof on the input at hand | Working parts written down; decides the closure branch | Section 3 closure | 09:15 |
| 1 | U1: keyboard into Chrome on localhost; note numbers only; replug re-run after T7 | Right note numbers; replug recovers after T7; no surprise prompt | T1, T7 | 09:00-09:20; replug 12:00 |
| 2 | U4 and PR 1: `#selftest` in Chrome; Node one-liner | 22 pass, 0 fail (Node re-run by this note: 22 pass, 0 fail) | Everything | 09:00-09:20 |
| 3 | U5: file:// versus localhost, once | Behaviour noted; stage uses localhost | Serving rule | 09:20 |
| 4 | U7: vendor app or DAW holding the keyboard | Chrome sees it once the app closes | Stage checklist | 09:20 |
| 5 | U2 and PR 10: five or more real take 1s, cue read unedited | One capture fires the scripted cue, or cue and line switch | T10, decision 2 | 09:30-10:00 |
| 6 | U3: count-in and steady takes on laptop speakers | Click audible; at least 6 of 8 on two of three takes (team setting); no M2 | T5 | 10:00-10:15 |
| 7 | PR 8: correct Ode at 80, then a wrong middle key | 8 of 8 and a pass; then 7 of 8 and no pass | T8 (A2), freeze | 11:45-11:55 |
| 8 | PR 9: correct sequence at 90 against 80 | K3, no false "skipped note" | T8 (A1), freeze | 11:45-11:55 |
| 9 | PR 1 part 2: added A1 to A4 fixtures | All pass beside the 22 | Freeze | 11:55 |
| 9b | K7 precedence and the agreed M2 "most notes" boundary as fixtures (Codex addition) | Each fires at, and not below, its boundary | Freeze | 11:55 |
| 9c | Reload the stored capture (Codex addition) | REPLAY label; `TAKE1_IS_CAPTURE` true only for that capture | T10, M2 | 14:00 |
| 10 | PR 2: Wi-Fi off; allow, then deny MIDI | No external request; both leave a playable take | T7 | 12:00-12:30 |
| 11 | PR 3: zero, one, two MIDI inputs | Fallback with none; only the selected input records | T7 (A14) | 12:00-12:30 |
| 12 | PR 4: note-off, velocity 0, pedal, unplug mid-take | No stuck sound; interrupted take not scored | T7 (A15, guard 5) | 12:00-12:30 |
| 13 | PR 5: tap during audio start; hold a letter key | No ghost notes, no repeats | T7 (guard 3, A18) | 12:00-12:30 |
| 14 | PR 6: double-click Start; Hear, then Start | One timeline, one take | T7 (guard 4) | 12:00-12:30 |
| 15 | PR 7: tab change, blur, sleep, Reset in count-in | Abort and a clean restart | T7 (guard 2) | 12:00-12:30 |
| 16 | U6: cold start, Wi-Fi off, timed arc | Replay-ready under 2 minutes | M6 | 12:00-12:30 |
| 17 | PR 12: reset to replay-ready, twice | 10 s or less; goal and 80 bpm restored | D10, M3 | 12:30 (checkpoint A) |
| 18 | U8 and PR 14: stage Chrome profile | Spell check, translate, sync, notifications off; goal box spellcheck off | Stage | 14:00 |
| 19 | PR 11: improving retake, then the third-miss path | Measured pair; REPLAY label; hand-off at miss 3 | T9, A9 | 14:30-16:30 |
| 20 | U16: idle 15 minutes on battery and mains | Keyboard seen, audio runs, no toast | Stage | 12:30-13:00 (lunch, rig idle) |
| 21 | PR 13: timed 60 s arc on the stage screen | Inside 60 s; no banned words, "ms" or debug text | Checkpoint C | 16:30; again 19:00 |
| 22 | U9: CSP console check on the deployed file | Zero CSP errors | O2 | 15:00-16:30 |
| 23 | U11: whole loop on on-screen keys (O4) | Same cue and proof as the keyboard | Add 1 | 16:30-17:30, only if C green |
| 24 | U13: voice proof protocol | tech-voice-path-proof s0 bars | Voice claim | 17:30, only if voice not cut |
| 25 | U12: one real goal-split call, saved | Schema passes; supplied phrase ids only | T26 | 20:00, only if D green; else Mon 14:00 |

- Monday in the room (SR s4): U3 on HDMI, U10 readability at 10 m, U14 phone PWA, U15 output switch, U17 scaling.

## 5. Leave for Sunday and Monday

| Item | When | File that says so |
|---|---|---|
| Demo phrase (A1); does not block Saturday | Sunday | build-plan s0 D1; sheet A1 |
| Age band (A4) and the per-band edits | Sunday | sheet A4; success-conditions contradiction 1 |
| Live voice, range check, noisy room (T11 to T14) | Only if C green; else after Wednesday | menu s4 cut 1; build-plan s8 cut rule C |
| Drift-aware matcher | After checkpoint B at the soonest | prototype-review s6; stack-review U2 |
| IndexedDB, service worker, PWA (T20, T22) | Monday, phone proof only | stack-review s1, s5; sheet A28 |
| Goal split integration (T26) | Mon by 14:00 | build-plan s8 Mon; menu s4 Monday rule |
| Engine code G1, G2, G3 static, H2 | Monday (this note, from IR capacity) | menu s2, s4 |
| Telemetry, test mode, question screen (T21, T28, T31) | Monday, if ethics allows | build-plan s8 Mon; menu cut 3; sheet A5 |
| Chips (T24), sample week (T18) | Monday or cut | build-plan s8 Mon; menu cut 6 |
| HDMI, readability, output switch, scaling tests | Monday in the room | stack-review s4 U3, U10, U15, U17 |
| Low-end phone, three cold sessions (O5) | Monday | build-plan s8 Mon C5a; menu s3d |
| Pilot-ask slide, strap, Mastery answer choice | Sunday; Mastery answer after the checks | success-conditions s1 row 3, panel chair list |
| G7 tier | Monday lock-in | menu s4 rule |
| A6 phrase validator, D13 K4 reading | After Saturday; low risk | prototype-review second review, s5 |
| Real Webex post (H4) | Never on the stage path | menu s3c; build-plan s0 D3 |

## 6. What this note does not settle

| Contradiction | Where it sits | Why it stays open |
|---|---|---|
| Age band: Year 5 to 6 (12 to 9) vs Year 7 to 9 | success-conditions contradiction 1; sheet A4; age-band-evidence s1 | Sunday choice; Saturday copy stays age-neutral |
| WWVP fee A$163 (opened page) vs A$157 used in cost lines | success-conditions contradiction 3 and panel chair | Morning decision for the team; never flip it here |
| G7 MUST or SHOULD | menu s4 Astra proposal | Monday lock-in rule decides |
| 0.75 productivity; 9.5 not 10 h a developer; Tuesday 2.5 not 3 | menu s2 assumptions, Open questions | Only logged checkpoint hours settle it |
| The 4 h skeleton credit and this note's MW credit | menu Open questions; this note s3 | Never run in real Chrome; the 10:00 run decides |
| Tuesday "fixes only" vs hours spilling into Tuesday | menu Open questions; build-plan s8 | Team rule needed by Monday |
| Merge rule: Tue 12:30 vs the 12:00 release tag | menu Open questions | Pick one at Monday lock-in |
| Cue wording (B9) | success-conditions contradiction 14 | Sunday choice; one wording on card and in speech |
| Replay 10.5 s in a 10 s slot | success-conditions contradiction 15; PR D15 | Trim line or replay; team picks |
| One stray extra note may pass (A5) | PR second review A5 | Team call; default leaves it |
| M2 "most notes matched" share | PR second review A4 | A team number, `unverified` |
| Typed goal vs bounded goal set (A21) | sheet A21 | Not decided; T26 kept until Sunday |
| Capture tempo: skeleton 80 bpm, fixtures 60 bpm | sheet A22 | This note assumes 80 bpm, the skeleton and contract s8.2 default |
| Id clash: menu cites success-conditions "A25 to A30" for P2, O4, P5, P3 | menu s3d, s3g vs sheet A25 to A35 | The sheet's own A26 is MIDI guards; read the sheet ids |
| Voice gate at 17:30 may never run | decisions-log voice row via success-conditions s6 row 5 | Then the claim is "keyboard only; voice as story" |

## Method

- Read in order: session-rules, COMMON-RULES, README, then the nine inputs by section with offset reads and grep.
  o build-plan-v1 s0, s8, s14; menu s1 to s4 and Open questions; prototype-review s5, s6, second review.
  o stack-review s1 to s8; success-conditions s1, proposed rows, contradictions, s6, s7, panel chair.
  o sheet A-rows and Saturday defaults; melbourne-kit Saturday rows and s8; digest s7.
- Skeleton read-only: Node self-test re-run, 22 pass, 0 fail; 84,682 B; CSP allows `img-src data:`.
  o PRECEDENCE has no K7; `TAKE1_IS_CAPTURE = false`; no `#stage` hash yet, only `#selftest`.
- Arithmetic: menu hours by role re-summed by hand; IR MUST 21.25 and the 15.75 and 11.75 figures reproduce.
- Codex: not called by this worker; the EA ran it afterwards (note below).

### Codex critique, 7 Nov (sol high, run by the EA)
- Kept: IR Saturday over realistic; T26 at 45 minutes; double credit; slips; two tests; 09:15 check.
- Kept: no-credit remedy fails (IR 14.35); 34.55 not 34.5; M3 is not a BP task.
- Rejected: "MW sum omits D9, D10": my L4 residual 1.9 already held their 0.4 h.
- Rejected: calendar error. The heading says Sat 7 Nov, matching the sheet header; the brief's "8 November" was the slip.
- Rejected: U11 has no build. On-screen keys exist in the skeleton; O4 is rehearsal only (menu add 1).
- Its ten-line no-credit plan does not close (see Open questions).

| Row | Critic's figure | Mine (revised) | Verdict |
|---|---|---|---|
| IR Saturday vs realistic | 8.1 vs 7.5, 0.6 over | Was 8.1; now 7.6 after moving 0.5 h to Monday | Critic right; corrected |
| Team Saturday margin | 0.25 h cannot cover IR | Capacity is per role | Critic right; closure now per role |
| MW with T26 | 7.40, not 7.65 | 7.40 on my estimate; 11.4 at menu rates | Critic right; corrected |
| D9, D10 moved to MW | Not added to MW | Inside MW L4 residual 1.9 | Critic wrong; kept |
| Skeleton credit, two roles | MW extra 3.6 h | 4.0 h (L3 2.5 plus L4 1.5) | Critic right in kind, 0.4 low; MW credit withdrawn |
| Team, no credit | 36.6 | 37.0 (IR 16.35, MW 13.65, RU 7.0) | Corrected to mine |
| Realistic capacity | 34.55 | 34.55 | Critic right; menu rounds |
| No-credit remedy | IR 14.35 | 14.35 | Critic right; stated |
| Predates count | 7 BP tasks, M3 none | 7 plus M3 | Critic right; corrected |
- No web research; no local models; no bus; no other file touched.

## Open questions

- Does the team adopt section 3 at 09:00, replacing the digest's s7 plan?
- Which keyboard, and who carries it (sheet A3, row 42)?
- Does the skeleton credit hold on the real rig by 10:00? If not, which IR task moves?
- A5: may one stray extra note pass?
- Who runs the voice call at 16:30 (sheet A9 names the model and web lead)?
- Does T26 need A10's under-15 and name-stripping defaults before a Saturday request?
- Codex's ten-line no-credit plan (IR 7.5, MW 7, RU 3.5) does not close by this note's arithmetic.
  o L5 ends 15:30, after the freeze; it drops L6, L8, O2, V1 and Saturday O3.
  o Without a verified credit, either the v1.2 rules leave Saturday or the freeze moves: a team call.

## Sources

| # | Source | Sections used | Access |
|---|---|---|---|
| 1 | build-plan-v1.md (this folder) | s0, s1, s8, s14 | opened, 2026-11-07 |
| 2 | feature-feasibility-menu-v1.md | s1 to s4, Open questions | opened, 2026-11-07 |
| 3 | prototype-review-v1.md | header, s5, s6, second review | opened, 2026-11-07 |
| 4 | stack-review-v1.md | s1 to s8 | opened, 2026-11-07 |
| 5 | success-conditions-v1.md | s1, proposed rows, contradictions, s4, s6, s7, panel chair | opened, 2026-11-07 |
| 6 | sunday-decisions-sheet.md | header, A1 to A35, Saturday defaults | opened, 2026-11-07 |
| 7 | melbourne-kit-v1.md | S3, S8, S15, s8 | opened, 2026-11-07 |
| 8 | overnight-digest-for-team.md | s7, Open questions | opened, 2026-11-07 |
| 9 | prototype-skeleton.html | CSP line, switches, PRECEDENCE, self-test | opened read-only, 2026-11-07 |
| 10 | questions-for-sponsor.md | rows 26, 34, 42 | opened, 2026-11-07 |
| 11 | take-data-contract.md, journey-record-plan-v0.md | s7 heading; title line | opened (heading only), 2026-11-07 |
| 12 | WWVP fee page cited by success-conditions contradiction 3: https://www.accesscanberra.act.gov.au/business-and-work/working-with-vulnerable-people/apply-for-or-renew-a-wwvp-registration | A$163 | opened by that file 2026-11-06; not re-opened here |
