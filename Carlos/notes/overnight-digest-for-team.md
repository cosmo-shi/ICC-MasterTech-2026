# Overnight digest for the team (read before Saturday 09:00; updated 7 Nov, late night)

- Date: Sat 7 Nov 2026 (AEDT), collated from the overnight files; updated with the late files (section 2a); ten-minute read.
- Purpose: what the stage looks like now, what changed since Friday, what to decide on Sunday.
- Scope: a collation only; no new research. Every claim points to its team file.
- Status: overnight draft for the team; verify before the pitch.

## 1. The product and stage picture now
- Stage: laptop in Chrome on HDMI, USB MIDI keyboard, on-screen keys the only fallback (build-plan-v1.md s0).
  o No microphone and no network on stage; cues come from on-device rules (build-plan-v1.md s0).
- Take 1 is a labelled replay; the retake is live (pitch-v1.md s4, s5).
- The model step is a labelled saved answer, "example output, recorded <date>" (build-plan-v1.md s0).
  o Never fake one; if no real saved answer exists by Tuesday's freeze, use the fallback goal line (pitch-v1.md s0 row 11).
- The hand-off is a screenshot in the deck; a live Webex post is rehearsal only (decisions-log.md, overnight row on stage).
- The demo phrase is still open: Twinkle bars 3-4, Ode bars 1-2, or Ode bars 5-8 (pitch-v1.md s0 row 1).
- Say "it knows every note you play", never "it hears you", while MIDI is live (pitch-v1.md s5).

## 2. What changed against Friday
- Criteria are handed to teams on Monday 8 am, not due from us (monday-criteria-drill.md header; RESUME.md night summary).
- HEPPP ended 1 Jan 2026; the Outreach Funding Program replaced it (business-case-v1.md; decisions-log.md).
  o Never say "HEPPP-funded" (pitch-v1.md s5).
- "Only numbers go to the cloud" was false (privacy-design-v1.md s1, s6).
  o The typed goal and words also reach the model; that is an overseas disclosure; no first names in the app, demo or Webex mock.
- The $628,416 grant was a QUT project; Aspire UC got $250,000 in 2014 (qa-prep-v1.md s Q and A grant line).
- The stage device is a laptop, not a phone; the privacy stage sentence still says "phone" (RESUME.md night summary).
- The close line "first step" is out; pitch-v1 uses the surprise-task 60-second close (pitch-v1.md s0 row 3).
- Pilot cost is about A$17k core, never "under $5,000", and never said on stage (pitch-v1.md s5; qa-prep-v1.md Q13).

## 2a. Since 22:30
- pitch-v2.md: stage-ready script, 2:24 spoken, two judge passes folded; rehearse from this one, not v1.
- verification-overdrive-v2.md: 80 claims, 51 confirmed, 5 differ; corrections applied across nine files, including pilot totals, 46 judge questions, "device" not "phone".
- prototype-skeleton.html: one-file keyboard path; Node 61 of 61, Edge self-test 22 of 22; never run in real Chrome or with a MIDI keyboard.
- prototype-review-v1.md: scoring core sound; K3 ("you speed up") cue is fragile; stage-screen fixes applied.
- take-data-contract.md s8: proposals K7 and a drift-aware matcher, fixtures F17 and F18; not binding until accepted.
- objections-and-research-gaps.md: four adviser objections; objection 4, no named budget holder, is the one most likely to sink the pitch.
- free-programs-partner-map.md: approach the ACT Instrumental Music Program first, Music in Me second; exploratory ask only.
- audience-statement-v0.md: lean Year 7 to 9 as one pilot band, fallback Year 5 to 6; a proposal, not agreed.
- tech-voice-path-proof.md: Saturday 17:30 pass or fail bar for the voice path; decides what we may say about it.
- assistant-benchmark-protocol.md: Saturday-evening test of free assistants on five takes; Q and A only, never on stage.
- nine-student-test-materials.md: print-ready run sheet and consent script; do not recruit outsiders until the ethics row (A5) is answered.
- consistency-audit-v1.md: 14 live contradictions; 3 prototype fixes done; 4 are Sunday team choices, 10 have a clear winner.
- sunday-decisions-sheet.md rows A18 to A24: partner phrase set, named cohort, drop "ceiling", bounded goals, tempo, one sharp note, scripted cue.

## 3. Five numbers to remember
| Number | What it is | Source file and section | Status |
|---|---|---|---|
| 2:24 spoken (ends 2:33) | Pitch length: 83.6 s script plus 60 s demo, with hand-overs | pitch-v2.md header | Computed from word counts; not rehearsed |
| $384,182 | UC 2026 Outreach Funding grant | business-case-v1.md, source S7 | Verified (official determination, team extract) |
| A$17,076 | Core pilot cost, 50 learners (A$51,892 for 150) | business-case-v1.md s3c; consistency-audit-v1.md row 7 | Estimate, mostly staff time; quote "about A$17,000" unless row 7 settles |
| 7.98 hours | Average music hours in surveyed primary degrees | research-bank.md, Fading Notes row | Verified 6 Nov from the opened report; respondent estimates |
| About 45 hours | Build effort, against 16 in v0 (review ceiling 68) | build-plan-v1.md s8, s15 row 25 | Estimate |

## 4. What exists now
| Group | Files | What they are for |
|---|---|---|
| Stage and pitch | pitch-v2.md, pitch-v1.md, qa-prep-v1.md, demo-instrument-decision.md, demo-phrase-and-rights.md | Stage-ready script (pitch-v2), 46 judge questions (Q1 to Q45 plus Q20b), why keys, the phrase options |
| Build and tech | build-plan-v1.md, take-data-contract.md, small-goals-engine-spec-v1.md, tech-feedback-layer.md, tech-pitch-detection.md, tech-keyboard-input.md, accessibility-design-v1.md | Hour blocks, data format, goal engine, cue rules, input libraries, low-end phones |
| Privacy, safeguarding, ethics | privacy-design-v1.md, handoff-design-v1.md, nine-student-test-plan-v1.md | Data flows and stage line, teacher hand-off, the adult test and ethics route |
| Business and Cisco | business-case-v1.md, cisco-fit-note-v1.md, competitor-feedback-mechanics-v1.md | Buyer and pilot cost, honest Webex fit, 27 products compared |
| Build and tech (new) | prototype-skeleton.html, prototype-review-v1.md, tech-voice-path-proof.md | One-file keyboard path, its review, the Saturday voice pass bar |
| Rehearsal and drills | freeze-and-rehearsal-playbook-v1.md, monday-criteria-drill.md, surprise-task-drill.md, self-assessment-v0.md | Tuesday freeze, Monday 8 am mapping, Tuesday surprise task, rubric score |
| Checks | verification-overdrive-v2.md, consistency-audit-v1.md, success-criteria-draft.md | 80 claims checked, 14 contradictions listed, five proposed criteria |

## 5. Decide on Sunday
- Full list, 24 team rows: sunday-decisions-sheet.md. First ten minutes, in its order (section 1 of the sheet):
  o A2: instrument on stage (keyboard live, voice as story) and the C1 wording.
  o A3: who brings the USB MIDI keyboard (about A$90 to A$130 to buy); question 42 says nobody yet.
  o A7: field names and timing clock (the data contract wins by default).
  o A10: privacy defaults and the proxy: strip names, under-15 handling, logs.
  o A6: hand-off trigger, third miss on one cause (three files and the contract) or three sessions in a row.
- Then A24 (the scripted "you speed up" cue rests on fragile rule K3), A1 phrase, A5 ethics route (the sheet's notes on A24, A1, A5).

## 6. Never say on stage
- From pitch-v1.md s5:
  o "It hears you", "it listens to you" (while MIDI is live)
  o "Proves learning", "proven", "studies show it works"
  o "HEPPP-funded"
  o "First", "nobody", "no one else", "only app"
  o "Our AI hears you"
  o "Built on Cisco", "integrated with Webex", "Cisco-backed", "Cisco AI listens"
  o "Zero music programmes", "Music: none", "they have no music"
  o "Only numbers go to the cloud", "only anonymous numbers leave the phone", "your data stays in Australia", "we are privacy compliant", "cloud only for the hand-off and sync"
  o "60% of students trusted AI"
  o "Under $5,000", "fully costed"; any pilot price on stage
  o "Compliant", "legal", "fully private"
  o "Works on any phone", "accessible", "meets WCAG", "works offline everywhere"
  o "Three hours from here"; "Every teacher gets eight hours"; "households" for the connectivity figure
  o The banned topics in session-rules.md, in either direction
  o "Replace lessons", "no teacher needed"
  o "Half of schools cut music", "3% of teachers", "89% positive", "least diverse economy", "ANU closed its music school"
  o Carlos's vocal range or equipment; any cover take; YouTube karaoke
- privacy-design-v1.md s6 adds nothing new: its three never-say lines are all listed above.

## 7. Saturday 09:00, the first hour (build-plan-v1.md s8; laid out to 12:30)
- 09:00-09:30 stand-up and T1 rig check, all of us, Carlos leading.
  o Plug the keyboard, allow Chrome MIDI permission, see note numbers on a test page, HDMI to a TV.
  o Pass: real note numbers appear; else log "no keyboard yet" and use on-screen keys for Saturday.
- On the table at 09:00: keyboard, cable, adapter, stage laptop, a TV or screen.
  o Carlos secures them; question 42 says nobody has yet.
- 09:30-11:00, three lanes at once:
  o Carlos: three phrase files, `stage.json`, the data contract, the matcher test-first.
  o Justin: app shell, localhost, IndexedDB, the audio clock and count-in, on-screen keys.
  o Simone: `templates.json`, `fundamentals.json`, `copy.json`, wording read-through.
- First checkpoint is A at 12:30: count-in, take, one cue, live retake, count pair ("on the beat: x of N", before and after), by MIDI or on-screen keys.
  o By 12:00 the six Features v1.1 fields must be in the data format the model call checks.
- Pass line if late: one phrase, one cue, live retake, count pair, reopen offline with Wi-Fi off.

## Since 23:30 (7 Nov overnight)
- Collation of README rows 118 to 134 plus the files updated since 23:30; no new research.
  o Sheet ids A25 to A35, B13 to B21 and C13 to C18 are proposals (sunday-decisions-sheet.md, proposed overnight).

| File | What it settles | Sunday row it feeds |
|---|---|---|
| judge-lens-v1.md | What the panel rewards; the biggest score risks ranked; the seven-item pitch recipe | none |
| uniqueness-evidence-v1.md | Evidence for each part of the combination; one 19-word stage sentence | C13 |
| feedback-ledger-v1.md | Every piece of feedback received (152 rows); the top ten items that change what we build or say | none |
| idea-bank-v1.md | Every team idea in one table (81 rows) with verdicts; the distinctive combination in one sentence | none |
| journey-record-plan-v0.md | An owner and a 15-minute-a-day plan for the journey record requirement | A32 |
| teacher-validation-brief-v0.md | What a qualified beginner teacher would check in the cue list; routes to a teacher by Wednesday | B6, B19, B20 |
| nearest-competitors-v1.md | The eleven products a judge will name; overlap against our seven claims | C7, C14, A34 |
| customer-commitment-pack-v0.md | Turns Dan's Friday offer into evidence a judge accepts; a letter-of-interest template | A19, A30, A31, B15 |
| social-and-fear-evidence-v1.md | Evidence on fear and group learning; six social options ranked; spoken answers | A16, A35, C16, C17, C18 |
| success-conditions-v1.md | Ranked conditions for success, the uniqueness sentence, contradictions and proposed sheet rows | all proposed rows |
| ai-visibility-note-v0.md | The honest answer to "where is the AI?"; the nine-step loop table; three stage moments | A8, B14 |
| reviewer-pool-feasibility-v0.md | Whether the hand-off reviewer pool can exist in 2027; supply options, check lead time, cost | B16, B17, B18 |
| melbourne-kit-v1.md | What to carry, prepare and run from Sun 8 to Wed 11 Nov | none |
| stack-review-v1.md | What the coach runs on; the 16-layer stack table; untested list U1 to U17 | A28 |
| model-slot-options-v0.md | Which model runs the typed-goal and cue steps, and what each costs | A8, B13 |
| age-band-evidence-v1.md | The evidence to settle row A4; five bands scored on nine criteria | A4 |
| feature-feasibility-menu-v1.md | Every candidate feature (64 rows) with hours by role and tier; capacity budget | A27, A29 |
| pitch-v2.md (updated) | The stage-ready three-minute script; slide spec; three cue cards; Sunday lock table | A13, A20, B9 |
| prototype-review-v1.md (updated) | A fresh read of prototype-skeleton.html; defects D1 to D15; Saturday 09:00 to 12:00 fix order | A24, A25, A26 |
| questions-for-sponsor.md rows 44 to 47 | Journey record, ACT research approval, stage logistics, Child Safe provider | B17, A32 |
| build-day-reconciliation-v0.md | Saturday tasks reconciled across four files; timeline and test list; closes only with the skeleton credit plus cut 2 | A25, A8 |
| qa-stale-answers-v0.md | Prepared answers the overnight makes stale, with replacements; five new questions; rehearse Q16 first | none |

- Three most useful findings (success-conditions-v1.md, Bottom line):
  o Year 5 to 6 now leads Year 7 to 9, 12 to 9, narrowly (age-band-evidence-v1 s1).
  o The hard-to-copy part is delivery and channel, not features; say "the combination" (uniqueness-evidence-v1 s0, s3).
  o The K3 cue fails often, and MUST build hours equal realistic capacity (prototype-review-v1 D1; feature-feasibility-menu-v1 s1, s4).
- Three contradictions for the team to decide at the start (success-conditions-v1.md, Contradictions for the morning):
  o 1. Age band: Year 5 to 6 on the newest evidence against Year 7 to 9 on the sheet; settle A4 before the others.
  o 6. Build capacity: MUST hours fill capacity and the rig lead is over; re-split G7, O1, O2.
  o 3. WWVP fee: A$163 on the opened page against A$157 in the cost lines; a morning decision.
- The prototype skeleton stays frozen; build day starts Saturday 09:00.

## Method
- Update (7 Nov): read headers and bottom lines of the late files; no new facts beyond them.
- Read README, RESUME night summary, state-of-play, decisions-log, questions rows 32-42; grep for the rest; headers only for the overnight files.
- Codex: one gpt-6-sol medium call, names stripped, plain-language edit; kept: shorter sentences, plain terms, softer source labels; rejected: none.
- Web research: none. No existing file was edited.
- 6 to 7 Nov overnight: corrected from verification-overdrive-v2.md section 2 (D5, judge-question count and 7.98 h note)
- 6 to 7 Nov overnight: corrected from consistency-audit-v1.md row 7

## Open questions
- Sheet rows A18 to A24 are proposals; A4 (age band) is outside the first five.
- Pilot cost, build hours and the 2:24 length are estimates until rehearsed; the prototype has not run in real Chrome.
- Row 42 (keyboard) remains unsecured; ask on Saturday morning.

## Sources
- Team files named in the text, all in this folder (plus those in section 2a): build-plan-v1, pitch-v1, privacy-design-v1, business-case-v1, qa-prep-v1, monday-criteria-drill, questions-for-sponsor, decisions-log, RESUME, state-of-play-2026-11-06, research-bank, README, session-rules.
