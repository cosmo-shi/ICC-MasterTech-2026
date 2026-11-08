# Feature feasibility menu v1: every candidate feature, the feedback it answers, its hours, its tier

- Date: Sat 7 Nov 2026, 00:00 to 03:00 AEDT (overnight run); folder files only, read 2026-11-06/07; no web research.
- Purpose: one menu of every candidate feature, so Monday's lock-in (08:30 to 09:30, after the 8 am criteria) takes one hour.
- Scope: feedback-ledger-v1, idea-bank-v1, success-conditions-v1, functional-requirements-v0, build-plan-v1, the engine, hand-off, AI-visibility, social-fear, competitor, criteria, pitch, prototype-review, freeze, accessibility and tech files.
- Status: overnight draft for the team; verify before the pitch. Complete; Codex critique folded. Proposals only; no existing file edited. Hours marked `est.` are this file's estimates, `unverified`.

## 1. Bottom line

- The MUST list for the stage (eight build items plus E2; 35.5 developer hours at build-plan-v1 rates):
  o M1. Live keyboard loop: phrase, MIDI and on-screen keys, matcher, one measured cue, live retake, count pair (L1 to L6).
  o M2. Labelled replay of take 1 whose planted error fires the scripted cue (L7).
  o M3. Stage finish: stage mode, clean proof copy, one-key restart, 10-second reset (L8).
  o M4. The learner's goal on a card, split into small goals, two progress lines (G1 to G3).
  o M5. Hand-off card with "Ask a teacher" and the labelled Webex-style mock (H1 to H3).
  o M6. Cold offline run, HTTPS deploy and the recording fallback (O1 to O3).
  o M7. "Why this cue" strip: measured values and "chosen by rules, on this laptop" (V1).
  o M8. The goal split by a model, run once for real, saved, labelled "example output" (G7).
  o Plus three near-zero MUSTs (1 h in all, counted above): one learner age everywhere (P1, 0.5 h), the MIDI-true hook (P2, 0 h), the pilot-ask slide with "proposed" labels (P3, 0.5 h).
  o Plus E2, the teacher review (1 h prep plus 10 minutes of a teacher), promoted to MUST on 7 Nov (Astra audit, accepted; section 4).
- Hours against capacity (section 2):

| Measure | Hours |
|---|---:|
| MUST, build-plan-v1 rates (incl. E2 since 7 Nov) | 35.5 |
| MUST, if the team builds on prototype-skeleton.html (scoring core exists; credit `est.`) | about 31.5 |
| SHOULD, all rows | 24 |
| Feature capacity Sat 09:00 to Mon night, gross | 46 |
| Feature capacity, realistic (x 0.75, delivery-lead review ratio) | 34.5 |
| Tuesday fix reserve to the 12:00 release tag (no new features) | 8 |

  o So MUST is 1 h over the realistic capacity; SHOULD gets 0 to 3 h at realistic rates (with the skeleton credit), 10.5 to 14.5 h at gross rates; live voice (9.5 h) is the swing item.
  o The rig lead is over: MUST 21.25 h against 17 gross. Move T26 (G7) and offline/deploy (O1, O2) to the model and web lead.
  o Weakest MUSTs (a judge barely sees them): G7 (a labelled saved screen, 2.5 h) and G3 (two lines no adviser asked for; go static at 0.5 h). Both sit early in the cut order.
  o M6 is invisible on stage but stays MUST: it protects the live demo and backs the offline claim.
- The three features the feedback wants most that the build plan lacks:

| # | Feature | Feedback (advisers) | Build cost | Row |
|---|---|---|---|---|
| 1 | The no-instrument loop shown whole (on-screen keys, goal to retake) at the stand | F99, F101, F122, F123; ledger s5 access proof (4) | 0.5 h rehearsal | O4 |
| 2 | The AI made visible honestly: the "why this cue" strip | F72, F120, F149 (3); ledger s2 rank 6 | 1 h | V1 |
| 3 | A social answer: group sessions in outreach, partners at your level later | F26, F41, F48, F76, F102, F145, F147 (4); ledger s2 rank 4 | 0 h build; copy and slide | P5, F2 (H1 is a mentor hand-off, not peer or group learning) |

- Build-plan items no adviser asked for (keep only if cheap or a criterion needs them):
  o Three phrase files until Sunday (L2 part; cut 5), sample week (G4), two progress lines (G3; Carlos's own record).
  o Range check (L19; Carlos's record, R4), notices screen (O7), telemetry and test mode (E4), learner-word chips (L14; R2 from Carlos's record).
  o The model goal split itself (G7): advisers asked to see the AI (F120), not for this step; it stays MUST as the one honest model step.

## 2. Capacity budget

- Window: Sat 7 Nov 09:00 to Tue 10 Nov 15:00 freeze. Roles as in build-plan-v1 s8: Research and UX lead (Simone), Infrastructure and rig lead (Carlos), Model and web lead (Justin).
- Feature hours only: rehearsal, meetings, travel, meals, sleep and the Monday session are taken out before counting.

| Day and window | What is taken out | Infrastructure and rig lead | Model and web lead | Research and UX lead |
|---|---|---:|---:|---:|
| Sat 09:00 to 21:30 (12.5 h) | Stand-up 0.5, lunch 0.5, checkpoints A to D about 1, three timed arcs 1 (build-plan s8) | 10 | 10 | 8 |
| Sun 8 Nov (travel, Bundoora check-in, 18:00 dinner) | Flight; 30 to 60 min decisions meeting (build-plan s8 Sun) | 1 (re-run `--suite stage`, re-record) | 0.5 (deployed-build checklist) | 0.5 (checklist) |
| Mon 9 Nov | 08:00 criteria, 08:30 to 09:30 lock-in, criteria map to 12:00, 12:15 bus, set-up, run-through | 6 | 6 | 4 |
| Feature capacity, gross | | 17 | 16.5 | 12.5 |
| Feature capacity, realistic (x 0.75) | | 12.75 | 12.4 | 9.4 |
| Tue 08:30 to 12:00 | Breakfast surprise task about 1 h at the start; then "fixes from Monday only" (build-plan s8 Tue) | 3 | 3 | 2 |
| Tue 12:00 to 15:00 | Release tag, redeploy, cold offline runs, go or no-go (fixed overhead, no feature hours) | 0 | 0 | 0 |

- Assumptions (each `unverified` unless a file is named):
  o Saturday figures follow build-plan-v1 s8: "two developers x 10 h = 20 h with Claude Code, plus Simone about 8 h".
  o The deductions listed above leave 9.5 h a developer, not 10; Tuesday 3.5 h minus the 1 h surprise task leaves 2.5, not 3 (Astra audit; see Open questions).
  o 0.75 = the delivery-lead review's productive share (24 to 27 of 36 h, build-plan s8); Claude Code speeds typing, not integration.
  o Monday: devs get about 1.5 h before the bus, 3.5 h in the afternoon, 1 h in the evening; bus and arrival times come in the Pre-Arrival Pack (plan-2026-11-02-to-11).
  o The research lead's Monday 4 h excludes the criteria map and pitch edits she leads; her Saturday 8 h is copy, cards and testing.
  o Sunday holds no new feature work: Carlos flies in; teammates confirm the build runs on two laptops (plan-2026-11-02-to-11).
  o Tuesday hours are fix capacity; the build plan's hour budget still spills about 16 h into Monday afternoon and Tuesday morning (see Open questions).
  o Sleep: about 8 h a night from 22:00; no all-nighters planned.

## 3. The full menu

- Key. Judge tests (judge-lens-v1 s1 row 1): CV customer value, EV evidence, TF technical feasibility, PR what it takes to proceed.
  o Roles: IR infrastructure and rig lead, MW model and web lead, RU research and UX lead. Hours are build-plan-v1 s8 unless marked `est.`.
  o Seen: 3 min (in the pitch), Q and A only, stand, not shown. Honesty: live, replayed, saved and labelled, proposed, mock.
  o Adviser count = distinct advisers behind the F-ids (ledger s5 counting rule); "own" = Carlos's practice record, not an adviser.

### 3a. The loop (L)
| ID | Feature | Feedback (F-ids; advisers) | Test | Hours (role) | Depends on | Seen | Honesty | Stage risk | Spec | Tier |
|---|---|---|---|---|---|---|---|---|---|---|
| L1 | Rig check: MIDI keyboard, Chrome permission, note numbers, HDMI | F07, F92 (2) | TF | 1 (IR) | A keyboard and its owner (human, sheet A3) | 3 min (enabler) | live | No keyboard Saturday: on-screen keys become the input | build-plan s8 T1 | MUST (M1) |
| L2 | Phrase files, stage.json, take contract, fixtures | enabler (0) | TF | 2 (IR); skeleton credit about 1 `est.` | take-data-contract fields; phrase choice D1 | not shown | live | Phrase changed after Sunday = re-record | build-plan T2, T3; cut 5 = one phrase only | MUST (M1) |
| L3 | App shell, localhost, IndexedDB, count-in on the audio clock | F07 (1) | TF | 3.5 (MW) | none | 3 min (count-in) | live | Beat-zero offset on the real laptop | build-plan T20, T5, T29 | MUST (M1) |
| L4 | On-screen keys and Web MIDI, unplug-safe; ghost and played bars | F99, F101, F122, F123, F138 (3) | TF, CV | 3 (MW) | Keyboard; secure context | 3 min | live | MIDI permission prompt; octave bars off canvas (D11) | build-plan T6, T7; s3 feedback display | MUST (M1) |
| L5 | Matcher, keyboard features, K-rules from rules.json | F73, F137 (2) | TF, EV | 3.5 (IR); skeleton credit about 2 `est.` | rules.json, thresholds.json | 3 min (via the cue) | live | Rounded thresholds misfire (D12) | build-plan T4, T8; tech-feedback-layer s3 (20 rules) | MUST (M1) |
| L6 | One-fix card and proof card: "On the beat: x of N, then y of N" | F30, F72, F73 (2) | EV, CV | 2 (IR); skeleton credit about 1 `est.` | L5 | 3 min | live | Critical path: a cue not wired to the scored take = no demo | build-plan T9, critical path | MUST (M1) |
| L7 | Labelled replay of take 1; planted error fires the scripted cue | F38 vs ledger C4 labelled honesty (1) | EV | 1.5 (IR 1, MW 0.5) | Five or more real take 1s on the keyboard | 3 min | replayed, labelled | K3 fragile: 44% of noisy variants (D1); drift-aware matcher 90 to 120 min only as fallback | prototype-review D1; build-plan T10; sheet A24 | MUST (M2) |
| L8 | Stage mode, big count line, clean proof copy, restart, 10 s reset | F07, F45 (1) | CV, TF | 1.5 (IR; review minutes sum to 95); 0.25 (RU wording) | copy.json | 3 min | live | Judges see "Placeholder", "No rule found", "ms" (review bottom line) | prototype-review D2 to D5, D8 to D10; playbook P3.7 | MUST (M3) |
| L9 | Matcher fixes: wrong keys as hits, rounding, K6 gate, slot | none (0) | TF | 0.8 (IR) | none | not shown | live | Wrong cue on edge values | prototype-review D11 to D15 | SHOULD; fix D11 (wrong keys counted as hits, 15 min) before the count pair is quoted anywhere |
| L10 | Learner says what changed before the proof card | F01, F05 (2) | CV, EV | 0.5 (IR 0.25, RU 0.25) | 5.6 s demo margin | 3 min (2 s tap) if margin holds; else stand | live | Eats the demo margin | success-conditions B13; ledger C7 | SHOULD |
| L11 | "Not sure" state: no cue when rules are unsure | F35, F89 (2) | CV | 0.5 (IR) | rules.json | Q and A | live | none on the scripted path | success-conditions B14; idea-bank A17 | SHOULD |
| L12 | Learner-word chips beside the measured cause | F137 (1); R2 own | CV | 1 (IR 0.5, RU 0.5) | copy.json | stand | live | Chips imply language understanding | build-plan T24; functional-requirements R2 | SHOULD |
| L13 | Repeated cause named as a habit across takes | F72, F74 (1) | CV | 0.5 (RU copy) `est.` | Persistence ladder in rules | sample week, Q and A | live rule, seeded week | "agentic" overclaim (banned label) | idea-bank A16; ai-visibility s5 | SHOULD |
| L14 | Easiest phrase leads, shown live (R17) | F142 (1) | CV | 1 (IR, re-key fixtures) | D1 = Twinkle bars 3-4 | 3 min only with Twinkle | live (engine score) | Claim only if the ease score shows it | build-plan s0 D1; engine spec s5 | SHOULD (needs D1 a) |
| L15 | Mic path: Pitchy, AudioWorklet, set-up check with getSettings log | F35, F54 (2) | TF | 2.5 (MW) | Laptop mic | stand | live | No mic on stage (sheet S7) | build-plan T11; tech-pitch-detection s9 | SHOULD (cut 1st) |
| L16 | Voice adapter and V-rules; recorded take through the real detector; pain and tired copy | F54, F72 (2) | TF, EV | 4.5 (MW: T13 3.5, T14 1); 1 (RU sings, copy) | L15; noisy-room test | Q and A, stand ("tested prototype") | replayed (real detector) | "hears you" claim on the MIDI stage | build-plan T13, T14, D4 (a); handoff-design-v1 s2 T2, T6 | SHOULD (cut 1st) |
| L17 | Range check and key suggestion (voice) | none (0); R4 own | CV | 1.5 (MW) | L15 | stand | live | none | build-plan T12 | SHOULD (cut 1st) |
| L18 | Live voice on stage (D2 option b) | F54 (1) | TF | 0 extra; stage mic | Checkpoint D green and noisy-room pass | 3 min | live | Hall noise | build-plan s0 D2 | NO: only if the overturn test passes and the loop is ahead |

### 3b. The goal engine (G)
| ID | Feature | Feedback (F-ids; advisers) | Test | Hours (role) | Depends on | Seen | Honesty | Stage risk | Spec | Tier |
|---|---|---|---|---|---|---|---|---|---|---|
| G1 | Goal card from chips: "Play this song for mum" | F60, F148 (2) | CV | 1 (IR 0.5, RU 0.5) | Age band (sheet A4); copy.json | 3 min | live (chips) | placeholder phrase copy (D7) | build-plan s2; prototype-review D7 | MUST (M4) |
| G2 | Rules template splits the goal; one fundamental per step; miss re-spreads; rest cue | F148 (1); state-of-play s4 "not addictive" (John, Chris, the mentor: 3) | CV, TF | 3 (IR 2, RU 1 templates and names) | fundamentals.json (nine) | 3 min (one step), stand | live (template) | Classifier stops on odd goals | engine spec s1, s2, s4, s6; build-plan T15 | MUST (M4) |
| G3 | Two progress lines: "your goal", "your skill" | none (0); R15 own | CV | 1 (IR); 0.5 if static | G2 | 3 min (slide 3, screen) | live; both move on one retake | Two lines from one retake read as two results (sheet C5) | engine spec s7; build-plan T16; prototype-review D7 | MUST (M4) |
| G4 | Sample week (days 2 to 7), seeded, labelled | none (0) | CV | 1 (IR 0.5, RU 0.5) | Seed data | stand, Q and A | saved and labelled | Read as real use | build-plan T18; s2 time span | SHOULD |
| G5 | Adaptive controller: one knob per change, code decides | F140 (1) | CV | 1 (IR) | G2 | Q and A | live | Week-long adaptation claims | engine spec s8; build-plan cut 2 | SHOULD (cut 2nd) |
| G6 | Off-day check: warm-up comparison offers an easy day | F141 (1) | CV | 1 (IR) `est.` | G5 | not shown | proposed | none | engine spec s8; idea-bank B7 | COULD (Q and A line) |
| G7 | Goal split by a model once: saved, schema-checked, labelled "example output" | F120, F148 (2) | TF | 2.5 (owner: IR in build-plan s8, MW in sheet A8); review 5 | Model slot, proxy, consent, online once | 3 min (labelled screen) or Q and A | saved and labelled | Looks live unless labelled; no real run by Mon 14:00 = remove every model claim | build-plan s0, T26; sheet A8 | MUST (M8) |
| G8 | Implementation-intention prompt: when and where you will practise | none (0) | EV | 0.5 (IR 0.25, RU 0.25) `est.` | none | not shown | live | An extra screen in the demo | idea-bank B10 | COULD (app only) |
| G9 | Class task bar | none from advisers (Carlos's steer) | CV | 1 to 2 `est.` | A cohort | none | mock | Reads as points (sheet C12 reason) | idea-bank E4; sheet C12 | NO: reads as points; park for a cohort pilot |

### 3c. The human hand-off (H)
| ID | Feature | Feedback (F-ids; advisers) | Test | Hours (role) | Depends on | Seen | Honesty | Stage risk | Spec | Tier |
|---|---|---|---|---|---|---|---|---|---|---|
| H1 | Hand-off card: chosen clip, goal, fixes tried, "Preview what is sent" | F25, F84, F151 (3) | PR, CV | 1.5 (RU) | cue.handoff_flag; miss-3 trigger (sheet A6) | 3 min | mock, labelled | Heard as a staffed service | handoff-design-v1 s3; build-plan T19 | MUST (M5) |
| H2 | "Ask a teacher" button, any time | F146, F151 (2) | CV | 0.25 (IR) `est.` | H1 | card, stand | live | none | handoff-design-v1 s2 T4; sheet A20 | MUST (M5) |
| H3 | Webex-style reviewer screen, corner label "Proposed: Webex hand-off (mock)" | F92 (1) | PR, TF | 0.5 (RU; D6) | Inlined image, no network | 3 min (screenshot) | mock | Cisco overclaim | prototype-review D6; build-plan D3 (1); sheet C3 | MUST (M5) |
| H4 | Real Webex post to a team test space | F92 (1) | TF | 2 to 3 (IR) plus a bot token | Network; a token to guard | never on stage | live | Webex Guest Issuer apps disabled 21 Jan 2026 (idea-bank s3) | build-plan D3 (2) | NO: never on the stage path |
| H5 | Reviewer one screen, three replies, guardian loop | F15, F24, F25, F85 (3) | PR | 0.5 (RU slide) `est.` | privacy-design-v1 s3 | slide 7 line, Q and A | proposed | Heard as a legal claim | handoff-design-v1 s3, s4 | COULD (slide only) |

### 3d. Offline, access, device (O)
| ID | Feature | Feedback (F-ids; advisers) | Test | Hours (role) | Depends on | Seen | Honesty | Stage risk | Spec | Tier |
|---|---|---|---|---|---|---|---|---|---|---|
| O1 | Service worker, manifest, cold offline reload on the stage laptop | F99, F100 (1) | TF | 1.5 (IR, or MW if moved) | none | stated, or shown (sheet B12) | live | Stale cache, version mismatch | build-plan T22; accessibility s5 | MUST (M6) |
| O2 | HTTPS deploy; teammates open the same build | F107 (1) | TF | 1.5 (IR, or MW if moved) | A host | not shown | live | none | build-plan T23 | MUST (M6) |
| O3 | Recording fallback v1 and v2 of the frozen flow | F38 (1) | TF | 1.5 (IR 1, MW 0.5) | none | only on failure | replayed, labelled as a recording | A clip is not proof of offline (sheet B12) | build-plan T25; playbook P10 | MUST (M6) |
| O4 | Whole loop on on-screen keys, rehearsed, shown at the stand | F99, F101, F122, F123; ledger s5 (4) | CV | 0.5 (IR) | L4 | stand, Q and A; stage only if Tuesday's run is clean | live | A second stage path adds risk | success-conditions A26; ledger C1 | SHOULD (add 1) |
| O5 | Low-end Android: three cold offline sessions, times logged | F99, F100, F122 (2) | TF, EV | 1.5 (MW) | Named phone and holder (sheet B5) | stand | live | Android 10+ only | build-plan Mon C5a; accessibility s2, s5 | SHOULD |
| O6 | Accessibility five: status region, named buttons, learner-paced, non-colour cues, targets | F99 (1) | CV | 2 (MW 1, IR 1) `est.` | none | stand, Q and A | live | A new control after the freeze is banned | accessibility-design-v1 s7 | SHOULD |
| O7 | Notices and about screen (Pitchy, fft.js, Tone.js) | none (0) | TF | 0.5 (IR) | none | Q and A | live | none | build-plan T27 | SHOULD |

### 3e. AI visibility (V)
| ID | Feature | Feedback (F-ids; advisers) | Test | Hours (role) | Depends on | Seen | Honesty | Stage risk | Spec | Tier |
|---|---|---|---|---|---|---|---|---|---|---|
| V1 | "Why this cue" strip: measured values, rule id, "Chosen by rules, on this laptop"; spoken rules-vs-model line | F72, F120, F149 (3) | TF | 1 (MW) | Values the skeleton already computes | 3 min (while the cue is read) | live | "That is just rules": answer with the two-place line | ai-visibility s3 option A, s5; build-plan s0 stage line | MUST (M7) |
| V2 | Model receipt slide: request, answer, date, model, "saved example" | F120, F149 (2) | TF, EV | 0.5 (MW) | G7 real call | Q and A | saved and labelled | none if labelled | ai-visibility s3, s5 (Q46) | SHOULD |
| V3 | Model rewrites the cue per take, or the packet shown as the AI moment | F72 (1) | TF | 1 to 3 (MW) | Network or a saved call | none | saved or live | Looks live; breaks the offline rule; packet reads as AI when it is code plus a human | ai-visibility s3 options B, C; build-plan s1, s3 | NO: Q and A receipt only |

### 3f. Evidence (E)
| ID | Feature | Feedback (F-ids; advisers) | Test | Hours (role) | Depends on | Seen | Honesty | Stage risk | Spec | Tier |
|---|---|---|---|---|---|---|---|---|---|---|
| E1 | Assistant benchmark, five takes, run once, misses quoted | F28, F149 (2) | EV | 0.75 (MW) | A general assistant | Q and A | live result | A hidden miss | success-conditions s6 row 4 (protocol header) | SHOULD |
| E2 | Teacher review: cue, score, three cards | F19, F32, F84, F85 (3) | EV, CV | 1 (RU prep) plus 10 min of a teacher | A human: the UC music contact (question 26) | Q and A | live result | Not run = say so | success-conditions s6 row 2; sheet B6 | MUST since 7 Nov (Astra audit): the ask and prep are ours; the result needs a teacher, else say "review pending" |
| E3 | Dan's interest in writing, quoted only with permission | F66, F70 (1) | PR | 0.2 (IR) | A human | Q and A; slide 7 only if yes | live | Never "first customer" | success-conditions B17 | SHOULD (human) |
| E4 | Test mode, telemetry export, two-question screen | F47, F51 (1) | EV | 1.5 (IR) | Ethics answer (sheet A5) | not shown | live | none | build-plan T21, T28, T31; cut 3 | SHOULD (cut 3rd) |
| E5 | Score versus fix check with 6 to 9 adults | F51 (1) | EV | 2 (RU) `est.` | Ethics route (sheet A5) | Q and A | live counts | Small n | idea-bank s5 exp 1; success-conditions s6 row 7 | COULD (only if A5 allows) |
| E6 | Delayed unaided retake by teammates, next day | none (0) | EV | 0.25 (RU) | Teammates | Q and A | labelled teammates | none | success-conditions B15, s6 row 6 | SHOULD |
| E7 | One outreach conversation | F79, F82, F131, F132 (2) | PR | 0.5 (IR) | A human | slide 7 only if true | live | none | success-conditions s6 row 8; sheet A19 | SHOULD (human) |

### 3g. Stage lines and slides, zero or near-zero build hours (P)
| ID | Feature | Feedback (F-ids; advisers) | Test | Hours (role) | Depends on | Seen | Honesty | Stage risk | Spec | Tier |
|---|---|---|---|---|---|---|---|---|---|---|
| P1 | One learner age in picture, goal card, copy, slides; reading level per age | F55, F118, F124, F152 (3) | CV | 0.5 (RU copy.json) | Decision A4 | 3 min | none | Judges hear several learners | sheet A4; success-conditions rank 1; accessibility s8 | MUST (line and copy) |
| P2 | MIDI-true hook at 0:27: "A video cannot tell which notes you played..." | F73, F127, F130 (3) | CV | 0 | none | 3 min | none | "hears" overclaim avoided | success-conditions A25 | MUST (line) |
| P3 | Pilot-ask slide: owner, consent route, go or stop, reviewers and reply target "proposed" | F25, F66, F79, F82, F131, F152 (5) | PR | 0.5 (RU slide) | none | 3 min (slide 7) | proposed | Heard as agreed | success-conditions A29, A30, s4 slide 7 | MUST (slide) |
| P4 | Fear and private-practice line (13 or 23 words) | F53, F94, F143, F146 (3) | CV | 0 | Clock margin | 3 min | none | Clock | social-fear s6a SF2, s6b | SHOULD (line) |
| P5 | Social answer for Jeff; beat 7 "group sessions in outreach" | F26, F41, F48, F76, F102, F145, F147 (4) | CV, PR | 0 | none | Q and A; beat 7 | proposed | Child-safety overreach | social-fear s4 lean, SF1, SF3, SF4; success-conditions A27 | SHOULD (line) |
| P6 | Mastery answer ready | F30, F127 (2) | CV | 0 | none | Q and A | none | Naming rivals invites challenge | success-conditions B16; nearest-competitors s2, s4 | SHOULD (line) |
| P7 | "Different way of thinking" framing on slide 5 | F42, F43, F137 (2) | CV | 0 | none | 3 min | none | Reads as "apps plus" | ledger s2 rank 10; success-conditions s4 slide 5 | SHOULD (line) |

### 3h. Future, slide or Q and A only (F)
| ID | Feature | Feedback (F-ids; advisers) | Test | Hours (role) | Depends on | Seen | Honesty | Stage risk | Spec | Tier |
|---|---|---|---|---|---|---|---|---|---|---|
| F1 | Guitar camera coaching | Chris "bring a guitar" (state-of-play s4; 1) | CV | 0.25 (RU slide) | IP check on a prior device (state-of-play s10) | slide 8 | proposed | Overclaim | idea-bank F1; build-plan non-goals | COULD (slide, labelled future) |
| F2 | Partners at your level in a supervised cohort; group cause patterns for the partner teacher; buddy | F76, F87, F145 (3) | CV, PR | 0.25 (RU slide) | Consent switch not yet designed | slide 8, Q and A | proposed | Child safety; re-identification | social-fear s4 ranks 2 to 4; idea-bank E1, E2, G3 | COULD (slide) |
| F3 | Shared and lent instruments, recorder, more instruments, learning styles | F102, F103, F117, F139; Chris (state-of-play s4) (4) | CV | 0.25 (RU slide) | none | slide 8 | proposed | Stuffing too much (F90) | idea-bank D5, D8, E5; ledger s3 smaller items | COULD (slide) |
| F4 | Tutor channel, teacher-side value, instrument tasters, practice record | F58, F67, F87 (3) | PR | 0 | none | Q and A | proposed | Second buyer dilutes (ledger C8, C13) | idea-bank C8, C11, D6, F4 | COULD (Q and A) |

### 3i. Ruled out for Wednesday (X)
| ID | Feature | Feedback (F-ids; advisers) | Test | Hours | Depends on | Seen | Honesty | Stage risk | Spec | Tier |
|---|---|---|---|---|---|---|---|---|---|---|
| X1 | Streaks, badges, leaderboards | state-of-play s4 "not addictive" (3) against | none | 0 | none | never | none | Feeds the fear we claim to remove | social-fear s4 ranks 5, 6 | NO: harms beginners and minors |
| X2 | Game layer, classroom ranking dashboard, AR instrument, digitised cultural instruments | none for Wednesday | none | L | Partners | never | none | Scope creep (F90) | idea-bank B13, C7, F2, D7 | NO: dropped by the team and the advisers' simplicity pattern |
| X3 | Accounts, cloud sync, sampled pianos, staff notation, offline SwiftF0, CDN at runtime | none | TF | M | Network | never | none | Breaks the 5 MB and no-network rules | build-plan s2 non-goals, s3 | NO: non-goals |
| X4 | Any live model call on venue wi-fi during the pitch | F120 (1) | TF | 0 | Network | never on stage | live | Venue network | build-plan s0; sheet S7 | NO: stand only, online and consented |

- Row count: 18 L, 9 G, 5 H, 7 O, 3 V, 7 E, 7 P, 4 F, 4 X = 64 rows.

## 4. Tiers summed, cut order, add order

| Tier | IR (h) | MW (h) | RU (h) | Total (h) |
|---|---:|---:|---:|---:|
| MUST (build-plan rates, incl. E2) | 21.25 | 8.5 | 5.75 | 35.5 |
| MUST, skeleton credit `est.` | 17.25 | 8.5 | 5.75 | 31.5 |
| MUST, after moving G7, O1, O2 to MW | 15.75 | 14 | 5.75 | 35.5 |
| SHOULD (all) | 8.75 | 12.25 | 3 | 24 |
| of which live voice (L15 to L17) | 0 | 8.5 | 1 | 9.5 |
| COULD (slides, Q and A, E5, G6, G8) | 1.25 | 0 | 3.5 | 4.75 |
| Capacity, gross Sat to Mon | 17 | 16.5 | 12.5 | 46 |
| Capacity, realistic (x 0.75) | 12.75 | 12.4 | 9.4 | 34.5 |
| Tuesday fix reserve (no features) | 3 | 3 | 2 | 8 |

- Read: MUST alone is 1 h over the realistic capacity; at gross rates MUST plus about 10.5 h of SHOULD fits.
  o Per role on the realistic basis (12.75 IR, 12.4 MW) even the rebalanced MUST is over (15.75 IR, 14 MW); it fits only at gross rates or with the skeleton credit (Codex, kept).
  o At the delivery-lead review's rates (about 1.5 x, 68 vs 45 h, build-plan s8), MUST is about 52 h: only the cut rules make it fit.
  o The research lead has spare build hours; her real load is the pitch, the criteria map and the human asks (E2, P-lines).
- Cut order if Saturday runs late (build-plan s8 outright cuts, then this menu):

| Order | Cut | Hours saved | What the pitch loses |
|---|---|---:|---|
| 1 | Live voice and range check (L15 to L17) | 9.5 | "Sing into your phone" as a shown feature; voice stays the story |
| 2 | G7 to SHOULD (Astra proposal; Monday rule above) | 2.5 | The one model step; V2 goes too |
| 2b | Adaptive controller (G5); keep one rules-based next step | 1 | Week-long adaptation claims |
| 3 | Test mode, telemetry, question screen (E4) | 1.5 | Learner evidence; report the test as not run |
| 4 | Interactive Webex-style screen; keep the labelled card and a screenshot (H3 to slide) | 0.5 | Interactive Cisco mock |
| 5 | Three phrases; build only Sunday's phrase (L2 part) | 1 | Easiest-phrase comparison (R17) |
| 6 | Sample week (G4), chips (L12), habit wording (L13) | 2 | Week view; learner words |
| 7 | Two progress lines go static (G3) | 0.5 | Live movement of the lines |
| 8 | (G7 moved to cut 2 on 7 Nov) | 0 | none |
| 9 | V1 strip becomes a slide image from a real take (ai-visibility s5 fallback) | 0.5 | The live decision chain |
- Astra audit proposal (7 Nov): promote E2 to MUST, demote G7 to SHOULD. Verdict and arithmetic (this file's figures):

| Change | Hours | Verdict | Why |
|---|---:|---|---|
| E2 to MUST | +1 RU | Accepted, applied above | Ledger s2 rank 7, joint 3 (F19, F32, F84, F85); RU load 5.75 against 9.4 realistic |
| G7 to SHOULD | -2.5 MW (after the move) | Not applied now; decided at Monday lock-in | build-plan s0 makes it the Must by Mon 14:00; success-conditions rank 4; V1 alone answers F120 on stage |
| Both together | MUST 33: IR 15.75, MW 11.5, RU 5.75 | Closure test | Realistic: IR 3 h over (12.75), MW and RU fit; with the 4 h skeleton credit IR 11.75 fits; gross fits |

  o Rule for Monday: demote G7 if no valid saved answer exists by Mon 14:00, or no criterion names model use.
  o So G7 moves up the cut order: it becomes cut 2, after live voice.
- Never cut (build-plan s8): fixed phrase, real input through the scoring path, labelled replay, one measured cue, live retake, visible count pair, cold offline run, recording fallback.
- Add order if Saturday runs early (most feedback per hour at the top):

| Order | Add | Hours | Why this order |
|---|---|---:|---|
| 1 | O4 whole loop on screen keys, rehearsed | 0.5 | Top-ten item 5; four advisers; no new code |
| 2 | L10 "what changed" tap | 0.5 | Answers the offloading worry (F01, F05) |
| 3 | E1 benchmark and E6 delayed retake (E2 is now MUST) | 1 | Turns two claims into results |
| 4 | V2 model receipt slide | 0.5 | Makes G7 checkable in Q and A |
| 5 | O5 low-end phone, three cold sessions | 1.5 | The access claim, measured |
| 6 | L11 "not sure" state | 0.5 | Trust (60% vs 90%, state-of-play s5) |
| 7 | L14 easiest phrase leads, only if D1 picks Twinkle | 1 | A judge-visible R17 moment |
| 8 | O6 accessibility five | 2 | Inclusion answer for Q and A |
| 9 | Live voice (L15 to L17), only if checkpoint D is green | 9.5 | The voice story becomes a tested prototype |

## 5. Monday lock-in procedure (08:30 to 09:30, after the criteria)

- Input: the criteria read at 08:00; this menu; monday-criteria-drill.md s11 template. Output by 09:30: three artefacts.

| Step | Minutes | Who | What happens | Artefact |
|---|---:|---|---|---|
| 1 | 08:30-08:40 (10) | RU reads; IR scribes | Each criterion verbatim, with its verb, deadline, any weight or "mandatory" word | Criteria list, verbatim (drill s11 template) |
| 2 | 08:40-08:50 (10) | All three | Hand-over questions (drill s12): weights, sponsor technology, demo format, cue-time or offline thresholds | Answers, word for word |
| 3 | 08:50-09:10 (20) | RU maps; MW marks what is showable; IR marks device and network needs | Each criterion against menu rows by the "Test" and "Seen" columns; mark MUST, SHOULD, COULD or "none" | Criteria-to-row map, with a proof check per criterion: the exact stage action or Q and A artefact, its owner, pass or fail on the judging device |
| 4 | 09:10-09:20 (10) | All three | Promote rows a mandatory criterion needs; each promotion names the committed work it removes from the same role, fits that role's remaining hours, and passes its device proof; apply the rule below for "none" | Working scope list: rows by tier; the decisions lock is Mon 17:00 (sheet header), the code freeze Tue 15:00 |
| 5 | 09:20-09:25 (5) | IR | Owner and finish time per promoted row; check each role against section 2 capacity | Owners table |
| 6 | 09:25-09:30 (5) | RU | pitch-v2 rows and slides each change touches; slide 6 Built, Mock, Future columns | Pitch lines affected list |
- Rule for a criterion no row serves:
  o A row can be promoted: name the committed work removed from the same role (not a SHOULD nobody planned), then promote (Astra audit, accepted: capacity is per role).
  o Only a COULD row exists: a slide or Q and A line labelled "proposed", and the criterion recorded as unmet on the map, not covered (Codex, kept).
  o No row at all: say "not built" with the honest sentence from monday-criteria-drill s9; add C6 (success-criteria-draft s3); never stretch C1 to C5.
  o A mandatory criterion needing code: merge by Tue 12:30; the task outranks our plan, never the working loop (playbook P2.1).
- Timebox: about 2 minutes a criterion in step 3; with more than ten criteria, map the mandatory ones before the rest and finish the rest by 12:00.
- Clock check in step 6: every added stage word costs about 0.46 s at 130 words a minute (success-conditions s4); the script already runs 2:46 to 2:58.
- Ask in step 2 about the stage AV (screen, sound, internet, own laptop allowed): it changes L1, O1 and O3 (playbook P12).
- Fits the day plan: build-plan s8 Mon has 08:00-12:00 for the criteria map (RU leads); the decisions lock stays Mon 17:00 (sheet header).

### One candidate stage order, seven beats (Astra audit, F-rows checked against the ledger)
| Beat | What the panel sees | Menu rows | F-rows |
|---|---|---|---|
| 1 | One named-age beginner and the goal they chose | P1, G1 | F55, F60, F118, F124, F148, F152 |
| 2 | A video versus one personal, rules-planned practice step | P2, G2 | F73, F127, F130, F148 |
| 3 | Target bars and the labelled take-1 replay (offline only if B12 says show) | L4, L7, O1 | F38, F99, F100, F138 |
| 4 | Measured cause, one fix, the rule behind it | L5, L6, V1 | F72, F73, F120, F137, F149 |
| 5 | Live retake; before and after on-beat counts | L6 | F30, F72, F73 |
| 6 | Teacher-review result, then the labelled hand-off preview | E2, H1, H3 | F19, F25, F32, F84, F85, F92, F151 |
| 7 | Proposed buyer, review owner, reply target, go or stop | P3 | F25, F66, F79, F82, F131, F152 |
- A coverage check, not a script: pitch-v2 s1 order and clock govern; it has no problem-picture beat.
  o Beat 6 needs a real review, else say "review pending". Beat 3 offline is shown only if sheet B12 says show.
  o It still does not show the no-instrument loop (O4) or a social answer (P5).

### Worked example: one invented criterion from each drill set
| Invented criterion (drill set) | Menu rows that serve it | Tier today | Lock-in action | Pitch lines affected |
|---|---|---|---|---|
| "Demonstrate a feasible prototype" (set 1) | L1 to L8, O1 to O3, O5 | MUST, O5 SHOULD | Promote O5 (1.5 h MW); remove committed Saturday voice work L17 (1.5 h MW, build-plan s8 16:30); name the phone (sheet B5) | Slide 6 "Built" |
| "Demonstrate sponsor technology in the core experience" (set 2) | H3 mock; H4 is NO | MUST (mock) | Ask which component and how usage counts (drill s4); live Webex = H4 (2 to 3 h plus a token), merge by Tue 12:30 or say "mock, not integrated" | Slide 6 "Mock"; Cisco line |
| "Show improvement attributable to feedback" (set 3) | L6 count pair, L10, E5, E6 | MUST, SHOULD, COULD | E5 only if the ethics answer allows (A5); else E6 plus n = 1 labelled; a retake alone does not show the cue caused it (drill s3) | 1:20 proof line; slide 1 number |
| "Estimate cost per learner" (set 4) | none | none | Rule "no row": add C6 (sheet B7); one labelled estimate from business-case-v1; no feature | Slide 7; spoken "indicatively costed" |
| "Work without network access" (set 5) | O1, O2, O5 | MUST, SHOULD | Promote O5; decide sheet B12 (show or state offline on stage) | Slide 6; stand script |
| "Reach young people without a teacher" (set 6) | P1, O4, H1, P3 | MUST, SHOULD | Promote O4 (0.5 h IR; G3 goes static, -0.5 h IR); say "adults tested; young learners need consent and ethics before testing" (after drill s8) | Beat 2 picture; slide 5 |
- Net change in the example: MUST rises by 1.5 h to 37 h (O5 +1.5, O4 +0.5, G3 static -0.5); MW drops planned voice by 1.5 h.
  o 37 h fits only at gross rates or with the skeleton credit; else apply the G7 rule (cut 2).

## 6. Feedback coverage check

### Top ten ledger items (ledger s2) against MUST and SHOULD
| Rank | Item | Coverage | Rows |
|---|---|---|---|
| 1 | One learner age everywhere | Covered once A4 is decided Sunday | P1 (MUST), G1 copy |
| 2 | A buyer with a human yes, or "proposed" | Partly: the slide is covered; the yes needs a person | P3 (MUST), E3, E7 (SHOULD, human) |
| 3 | Restore the agreed hook | Covered | P2 (MUST) |
| 4 | The social layer, a real answer | Partly, as lines only: no guaranteed stage answer (corrected 7 Nov) | P5 (SHOULD), F2 (COULD); H1 is a mentor hand-off, not peer or group |
| 5 | The no-instrument path on stage | Partly: the stage stays MIDI; the stand shows the loop | L4 (MUST), O4 (SHOULD) |
| 6 | The AI visible, honestly | Covered | V1, G7 (MUST), V2 (SHOULD) |
| 7 | One music teacher reviews cue and score | Not covered until a teacher agrees | E2 (MUST since 7 Nov; result needs a teacher) |
| 8 | Run the assistant benchmark once | Covered if run | E1 (SHOULD) |
| 9 | Confidence and private practice said aloud | Covered as a line | P4 (SHOULD) |
| 10 | A different way of thinking, not "apps plus" | Partly: a line, no feature | P7 (SHOULD) |
- Ledger judge-pass gap (hand-off has no named owner or route): covered by P3 "proposed reviewers, reply target".
- Not answered on the baseline stage (Astra audit, checked): F19, F32, F85 (until E2 runs), F70 (until E3 says yes), and the social rows F26, F41, F48, F76.

### Advisers' patterns (ledger s5) mapped
| Theme (advisers) | Row, or "no feature, a line in the pitch" |
|---|---|
| Narrow: one learner, one instrument, one scope (8) | P1, L2 (one phrase), X2 |
| Human in the loop (7) | H1 to H3, P3 |
| Who pays; stakeholders (6) | P3, E3, E7; no feature: a human yes |
| Social and individual learning (4) | P5, F2 |
| Differentiate; the hook; prior art (6) | P2, P6, P7, V1 |
| Feedback is where AI earns its place (5) | L5, L6, V1 |
| Simplicity and feasibility (5) | L8, the X rows |
| Trust, stigma, AI limits (4) | L11, V1, V2, E2 |
| Emotion; human-centred picture (3) | No feature, a line in the pitch (slide 1 origin, P4) |
| Access proof: offline, no instrument (4) | O1, O4, O5 |
| Confidence and fear (3) | P4; H2 and audio on the device by default support it |
| Aim at the judges and sponsors (3) | No feature, a line in the pitch |
| Positive verdicts (7) | No feature (morale) |

## Method
- Read in full or by section: COMMON-RULES, session-rules, state-of-play s1 to s10, functional-requirements-v0, plan-2026-11-02-to-11, feedback-ledger-v1 s2 to s6 (s1 rows by grep), build-plan-v1 s0 to s3, s8.
  o Also: idea-bank-v1 s1 by rows, s2 to s5; success-conditions-v1 s1 to s7; monday-criteria-drill s1 to s10; success-criteria-draft s3; pitch-v2 header, s1 clock, s2 slides.
  o Also: sunday-decisions-sheet row ids; prototype-review-v1 s1, s5, s6; playbook-v1 P2; handoff-design-v1 s1 to s3; engine spec s1, s2; ai-visibility s3, s5; social-fear s4, s6; nearest-competitors s2; accessibility s2, s7; judge-lens s1.
- Hours: build-plan-v1 s8 hour budget per task id; prototype-review minutes for defects; `est.` where no file gives a figure.
- Codex call 1 (gpt-6-sol, high, 00:08): critique of sections 1, 3 (tier column) and 5, names replaced by roles. Rejected by a usage limit ("try again at 12:40 AM"); no answer.
  o In its place, Claude ran the same four questions; kept: G7 and G3 named the weakest MUSTs, M6 kept as invisible but protective, a 2-minute timebox per criterion, a clock check, the stage AV question.
  o Codex call 2 (gpt-6-sol, high, 00:46, the one allowed retry): ran. Kept after checking against the files:
    - P1 and P3 cost 0.5 h each, so "zero-hour" was wrong; the worked example raised MUST to 36.5 h; per-role realistic capacity is exceeded; COULD-only criteria count as unmet; add a proof check per criterion; fix D11 before quoting the count.
    - Noted, not changed: the Tue 12:30 merge (playbook P2.1) falls after the 12:00 release tag (build-plan s8); added to Open questions.
    - Rejected: demote G7 to SHOULD (build-plan s0 makes it the Must by Mon 14:00; left MUST, weakest, cut 8); demote O2 (deploy is how teammates and the phone get the build, build-plan s8 Sun).

- Astra coverage audit, 7 Nov (GPT-6 Astra, high, run by the orchestrator; folded here):
  o Ids verified: all 34 F-rows exist in ledger s1 and are cited on the rows named; all 20 menu rows exist. None invented, none dropped.
  o Rows corrected in this file: section 6 rank 4 and the bottom-line social row (H1 does not answer the social ask); rank 7 tier.
  o The audit cited "section 9"; the coverage check is section 6. Its "Saturday 8 November" note concerns the prompt, not this file.
  o Accepted: E2 to MUST (+1 h RU); per-role promotion rule in lock-in step 4; seven-beat order as a candidate; three capacity challenges.
  o Not applied now: G7 to SHOULD; kept MUST under build-plan s0, moved to cut 2 with a Monday rule.

## Open questions
- Who owns G7 (T26): build-plan s8 says the infrastructure and rig lead; sheet A8 and success-conditions row 4 say the model and web lead.
- Build on prototype-skeleton.html (self-test 22 of 22, never run in real Chrome) or the build plan's fresh `app/` layout? The 4 h credit depends on it.
- Is 0.75 the right productivity share for a three-person team with Claude Code? The whole SHOULD tier turns on it.
- Monday hours: are 09:30 to 12:00 free for building, and when does the bus arrive at MCEC? (Pre-Arrival Pack)
- Tuesday: the build plan says "fixes from Monday only" yet its hour budget spills work into Tuesday morning; which wins?
- A code change a criterion forces: merge by Tue 12:30 (playbook P2.1) or before the 12:00 release tag (build-plan s8)? Pick one rule on Monday.
- O4 on stage or only at the stand (sheet A26)? D1 phrase (L14 depends on Twinkle)?
- Three challenged capacity figures (Astra audit) and what settles each on Saturday:

| Figure | Challenge | Settled on Saturday by |
|---|---|---|
| MUST fits the 34.5 h realistic capacity | Per role it does not: IR 15.75 vs 12.75, MW 14 vs 12.4; RU hours cannot absorb coding | Owners per task at 09:00; time one integrated loop by checkpoint C; recompute remaining hours per role |
| 4 h skeleton credit | Never run in real Chrome; wrong keys counted as hits (D11) | Run the skeleton on the real rig through replay, cue, retake by 10:00; credit only work proven unneeded |
| 10 h a developer Saturday, 3 h Tuesday | Listed deductions leave 9.5 and 2.5 | Log actual build hours at each checkpoint; rebuild Monday and Tuesday from real intervals |

- Human dependencies: keyboard owner (A3), named phone (B5), teacher review contact (B6), Dan (B17), outreach contact (A19).

## Sources
1. feedback-ledger-v1.md: s1 rows F01 to F152 (by grep), s2 top ten and judge pass, s3, s4 conflicts C1 to C13, s5 patterns, s6.
2. idea-bank-v1.md: s1 rows A1 to G13, s2 combination, s3, s4, s5 experiments.
3. success-conditions-v1.md: s1 ten conditions, s2, s3 rows A25 to A31 and B13 to B17, s4, s5, s6 experiments, s7.
4. functional-requirements-v0.md: R1 to R17, non-goals.
5. build-plan-v1.md: s0 decisions D1 to D4, s1, s2 scope and non-goals, s3, s8 hour blocks, cut rules, hour budget, critical path, outright cuts.
6. plan-2026-11-02-to-11.md: day by day, roles, gates.
7. state-of-play-2026-11-06.md: s1, s2, s4 advisers, s5 safe lines, s6 to s10.
8. small-goals-engine-spec-v1.md: s1, s2 nine fundamentals; headings s4 to s12.
9. handoff-design-v1.md: s1, s2 trigger table T1 to T6, s3 card fields.
10. ai-visibility-note-v0.md: s3 options A to C, s5.
11. social-and-fear-evidence-v1.md: s4 ranked options, s6 rows SF1 to SF5 and pitch lines.
12. nearest-competitors-v1.md: s2 overlap table.
13. monday-criteria-drill.md: s1, drill sets 1 to 6, s9, s10.
14. success-criteria-draft.md: s3.
15. sunday-decisions-sheet.md: rows A1 to A24, B1 to B12, C1 to C12, S1 to S9.
16. pitch-v2.md: header timing, s1 clock table, s2 slides 1 to 8.
17. prototype-review-v1.md: s1, s5 defects D1 to D15 with minutes, s6.
18. freeze-and-rehearsal-playbook-v1.md: P2.1 what frozen means, P2.2.
19. accessibility-design-v1.md: s2 device floors, s7 five fixes, s8.
20. tech-feedback-layer.md: headings; s3 rules table (20 rules per build-plan s3).
21. judge-lens-v1.md: s1 rows 1 to 12.
22. session-rules.md.
