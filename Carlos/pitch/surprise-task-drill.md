# Surprise task drill: six invented tasks, one 45-minute Monday-night run

- Date: Fri 6 Nov 2026 (AEDT); for use Mon 9 Nov evening, after the venue day, before the Tue 10 Nov breakfast announcement.
- Purpose: practise turning a surprise task into a response from material we already hold, without breaking the 15:00 freeze.
- Scope: six invented tasks, three full responses, three outlines, two worst cases, a timed procedure, say and never-say lists, a number self-check.
- Status: overnight draft for the team; verify before the pitch. **All six tasks below are INVENTED practice, not organiser information.** The real task is unknown; likelihood words are our planning estimates.
- Parent note: surprise-task-rehearsal.md (task kinds in its section 3, assets in section 4, freeze rule in section 5, 30 s and 60 s versions in section 6, run sheet in section 8). This drill must not contradict it.

## 1. Recommendation
- Run the drill as three timed rounds of 11 minutes: one full-response task, one outline task, one worst case (section 5).
- Every response answers with a visible, honest improvement; none rebuilds the product (rehearsal section 1).
- Code only when a task demands a working behaviour; merge by 12:30, because freeze prep starts 13:00 (rehearsal section 5; build-plan-v0.md section 8).
- Every response adds at most one sentence to the Wednesday pitch, and swaps for a line rather than adding time (pitch-v0.md section 1: 20 s buffer under 2:40).
- Keep the old stage fixes: no figure from verification-overdrive.md's fix list in its old form (section 8 below lists the ones that touch this drill).
- Roles in this file: R&UX = Simone; Pipe = Justin; Rig = Carlos (rehearsal section 8).

## 2. The six invented tasks
- Wording is in an organiser's voice, written as practice. Person names do not appear.

| # | Invented task, as read aloud | Kind (rehearsal section 3) | Likelihood | Response form |
|---|---|---|---|---|
| T1 | "Before lunch, put your practice loop in front of people you did not build it for, and show us what they actually did after the fix." | Row 1, user test by lunchtime | High | Full (2.1) |
| T2 | "Your next reviewer is a university outreach coordinator. Show what they would approve, what they would receive and what might stop them." | Row 2, new stakeholder or changed audience | High | Full (2.2) |
| T3 | "Show what happens when your coach cannot hear clearly, and what happens when it hears clearly but gives the wrong fix." | Row 3, "what if the AI is wrong?" | High | Full (2.3) |
| T4 | "Pick an assumption your evidence might overturn. Show us the smallest test that would change your plan." | Row 4, evidence that challenges a core assumption | High | Outline (2.4) |
| T5 | "Give us one slide: who would run a pilot, what it would cost, what evidence would justify proceeding." | Row 5, one-slide business case with a number | High | Outline (2.5) |
| T6 | "Show the learner's path with weak connectivity or no instrument, and label anything you have not tested." | Row 6, accessibility or weak connectivity | Medium | Outline (2.6) |

### 2.1 T1 user test: full response
- Deliverable (one page, 113 words):
  o "What we tested: an adult volunteer played the keyboard phrase, got one plain-words fix, and retook it. We watched whether they acted on the fix. We asked whether it felt like help or like homework, and whether they trusted it."
  o "Observed: [x of n acted on the fix; retake count against take 1 (C1); exact words; filled in after the test. If the test has not happened, say so.]"
  o "What this means: these adults are stand-in testers, not the young learners we serve. Their actions can expose a confusing cue or retake step. They cannot show that young learners keep practising. We change cue wording only if an observation names a specific fault. The next test must include the intended learners, through an outreach partner."
- Draws on:
  o Asset 2, the quick-test kit (rehearsal section 4): consent line, script, tally sheet, reporting line "x of n said ...".
  o success-criteria-draft.md section 1: C1 (retake), C3 (trust), C4 (help or homework); privacy-design-v0.md section 5 (no recordings kept); asset 4 normal-loop clip.
- Code or data: none; observed tallies and quotes go on the test sheet; report only what was observed, and claim an improvement only against the C1 before-and-after count. Change code for a named wording fault, behind a flag.
- Freeze risk: recruiting or fixing late eats rehearsal time; the stage demo stays on the release candidate.
- Pitch sentence (swap into beat 6): "We watched people try the fix and retake; here is what they did, and what stays untested with young learners."

### 2.2 T2 new stakeholder: full response
- Deliverable (one slide, 116 words):
  o "University outreach coordinator: decision to run a pilot."
  o "Learner: a young beginner without a music teacher names a goal, plays ten seconds, hears one plain-words fix and checks it on a retake."
  o "Conditions to agree with outreach (none committed yet): a school setting, consent arrangements, a coordinator, a route to a human teacher."
  o "Team provides: the practice loop, an on-screen-key path, a hand-off card, a way to review whether retakes show a measured fix."
  o "Needs approval: recruitment, safeguarding, data handling, teacher capacity, success thresholds."
  o "Open concern: fundamentals may feel like homework; the pilot asks learners and watches for return to practice."
  o "Decision sought: will outreach help design the trial and set the conditions to proceed?"
- Draws on:
  o Asset 3, stakeholder and data card (four boxes: learner, guardian or school, outreach coordinator, hand-off teacher); asset 1, proceed slide (rehearsal section 7); asset 5 beat-5 swap.
  o business-case-v0.md sections 2 and 3; universities-brief.md; qa-prep.md Q2 and Q19; hand-off card clip.
- Code or data: none.
- Freeze risk: a new audience pulls the pitch toward institutional detail; keep the live learner loop central.
- Pitch sentence (swap into beat 5): "An outreach team can bring this to learners and decide, with us, what a pilot must show."

### 2.3 T3 wrong feedback: full response
- Deliverable (one page, 122 words):
  o "When feedback is uncertain or wrong. The coach measures the notes before choosing a cue. A model may reword the cue in plain language; it does not decide what the learner played."
  o "Unclear input: the screen says 'The app could not hear clearly' and offers a retake or dismissal. It makes no improvement claim."
  o "A clear take can still get a wrong cue. The learner can tap 'not right'; we log the cue and the measured note summary for review (no audio unless the learner opts to share) and do not count it as a fix. [Describe only what the working demo does on Monday; the logging line stays out if it is not built.]"
  o "Proposed pilot gate: before learners use it, a qualified teacher scores a sample of cues. If the sample shows unreliable feedback, we narrow the supported exercises before learners use it. The hand-off to a human teacher stays visible throughout."
- Draws on:
  o tech-feedback-layer.md (cause order and cue rules); build-plan-v0.md section 7 (scoring contract) and section 9 (fallback: rules cue text always shown first); qa-prep.md Extra A.
  o Asset 4 clips: normal loop and the "could not hear clearly" case.
- Code or data: none if the unclear-input and "not right" paths already work; what a "not right" tap stores is an open question (privacy-design-v0.md section 5 keeps a take until the user deletes it); check both on Monday. If one is missing, add that response alone behind a flag, merged and tested by 12:30 (rehearsal section 5 rule 3).
- Freeze risk: a late change to cue selection could break the demo; leave that loop intact.
- Pitch sentence (swap into beat 6): "When it cannot hear clearly it asks for a retake; when a learner disputes a fix, we review it instead of claiming success."

### 2.4 T4 challenged assumption: six-line outline
- 1. Name the assumption: small goals with hidden fundamentals may feel like homework (state-of-play-2026-11-06.md section 12).
- 2. Show what we hold: one user, measured (n = 1); say what C3 and C4 will add.
- 3. Trust context: 60% of users trusted AI feedback against 90% for teachers (state-of-play section 5); say "of users", not "of students".
- 4. Smallest test: the quick-test kit's open question leading ("what, if anything, felt like extra work?"), then help, neutral or homework.
- 5. Report actions and exact words, with the stand-in-tester limit; offer the threshold that would change the plan (set with a reviewer).
- 6. Freeze: material only, no code; add the finding to Wednesday's Q and A, not to the 2:40.

### 2.5 T5 business case: six-line outline
- 1. Name the learner and the decision owner: a university outreach programme, coordinator decides (rehearsal section 7).
- 2. Proposal: a 12-week pilot in the 2027 school year, small trial of 50 learners with 1 hand-off hour each.
- 3. Cost: label it a teacher-time estimate, about $4,500 plus model calls, at a placeholder $87 an hour; say aloud it is a placeholder, and list what it leaves out (coordination, consent and safeguarding, evaluation; $87 excludes GST and on-costs) (business-case-v0.md section 3).
- 4. Measure: retakes with a measured fix, practice in weeks 8 to 12, hand-offs taken; thresholds set with the sponsor, none invented.
- 5. Gate: for this task the labelled slide shows the placeholder and we say it is one; on stage Wednesday no price is said (pitch-v0.md section 5); rehearse that exact answer.
- 6. Freeze: slide text only; Rig fills asset 1; no code.

### 2.6 T6 access and weak connectivity: six-line outline
- 1. Show on-screen keys: the path for a learner without an instrument (build-plan-v0.md section 4).
- 2. Show plain-words cues and the retake from the clip set (asset 4); a clip is not proof of offline running, so record the device, the conditions and the result beside it.
- 3. Run airplane mode live if Monday's device test passed; otherwise say "built for offline, tested on a laptop".
- 4. Label untested: a named low-end phone (success-criteria-draft.md C5); do not claim it works there.
- 5. Keep the 60 s version honest: no word "offline" in it unless the test passed (rehearsal section 6).
- 6. Freeze: any fix scoped to the 12:30 merge; otherwise material only.

### 2.7 Extra shapes the judge named (invented, experience-based, not organiser information)
- T7 "Reframe the product for a different user in 20 minutes": swap the learner in the proceed slide (rehearsal section 7, top row); keep the loop; claim nothing new.
  o 1. Name the user. 2. What stays: ten-second take, one fix, retake. 3. What changes: wording only. 4. Untested for them, said aloud. 5. Freeze: material only. 6. Pitch: none.
- T8 "A 60-second pitch with one slide": use the 60 s version (rehearsal section 6) and the proceed slide; choose what matters, add no claim.
  o 1. Cut to the loop. 2. One number at most (n = 1 or none). 3. Hand-off line. 4. Limit line. 5. Practise aloud once. 6. Pitch: unchanged.

## 3. The two most damaging tasks (honest, non-defensive responses)
- Chosen because each asks for proof we do not hold tonight; the right move is to state the limit, show what exists, name the next test.

| # | Invented task | Why it hurts | Spoken response (under 60 words) | Draws on |
|---|---|---|---|---|
| D1 | "Prove the coach works offline on a learner's own low-end phone." | C5 is a target, not a result; no named phone is chosen; Monday's device test may fail | "We can show the device we tested and its result. We have not tested that phone, so we do not claim it works there. We record the gap, keep the laptop demo honest, and make a phone test a condition of the pilot." | success-criteria-draft.md C5; build-plan-v0.md section 8 (Mon real-device test), section 9 |
| D2 | "Show that young learners trust the fixes and keep practising." | We hold n = 1 and adult stand-in testers; no young learner has used it | "We cannot show that from stand tests or from one measured record. We can show today's observed retakes and exactly where the evidence stops. A pilot with the intended learners must test trust and continued practice before we claim either." | evidence in pitch-v0.md slide 1 (24 to 7, n = 1); success-criteria-draft.md C3, C4 |

- Drill rule for both: no defence, no new number, one next test named, then stop talking.

## 4. Timed drill procedure (45 minutes)
- Prepared before the drill: tasks printed or on one screen; the three assets from rehearsal section 4 open; a visible clock; a blank scoring sheet per round.
- Draw: Carlos picks the three tasks in advance (one from T1 to T3, one from T4 to T6, one from D1 and D2) and keeps them hidden until read; the three not drawn go to a second session if time allows (Open questions).

| Minutes | Step | Who |
|---|---|---|
| 0 to 2 | Explain scoring; confirm the tasks are invented; start the clock | Carlos |
| 2 to 13 | Round 1 (11 min), see round clock below | Rotating |
| 13 to 24 | Round 2 (11 min) | Rotating |
| 24 to 35 | Round 3 (11 min) | Rotating |
| 35 to 39 | Rerun of the lowest-scoring task, roles swapped (4 min) | All |
| 39 to 45 | Debrief: add scores, list every changed line, log gaps to Open questions | All |

### Round clock (11 minutes; compresses rehearsal section 8's 90 minutes)
| Minute | Action | Owner |
|---|---|---|
| 0 to 1 | Reader reads the task aloud once; writes the one-line task statement: what must be shown, to whom, by when | Reader |
| 1 to 3 | Match to a kind in rehearsal section 3; name the one precise question to ask the organiser | Drafter |
| 3 to 7 | Draft the response: deliverable text, files and assets by name, pitch sentence | Drafter |
| 3 to 7 | Size any code: files touched, hours, risk to the cue loop | Checker |
| 7 to 9 | Check: freeze decision rule (rehearsal section 5), the pitch (section 6 below), banned words | Checker |
| 9 to 10 | Say the 60-second spoken answer aloud | Drafter |
| 10 to 11 | Score on the sheet, no discussion | All |

### Role rotation
| Round | Reader and clock | Drafter | Checker (freeze rule and pitch) |
|---|---|---|---|
| 1 | Carlos | Simone | Justin |
| 2 | Justin | Carlos | Simone |
| 3 | Simone | Justin | Carlos |

### Judge scores of the three full responses (Codex GPT-6 Sol, medium; scores out of 5)
- A judge-style experience estimate, not organiser information; its task-shape guesses are experience, not fact about this event.
- Evidence scores what the team can show now, not the quality of the proposed test.

| Response | Honesty | Evidence | Clarity | Three-minute fit | One change that lifts it (folded above) |
|---|---|---|---|---|---|
| T1 user test | 5 | 2 | 4 | 4 | Observed actions with a denominator and a before-and-after retake result; say so if the test has not happened |
| T2 stakeholder | 4 | 2 | 4 | 3 | Outreach items become conditions to agree, not things provided |
| T3 wrong feedback | 3 | 2 | 4 | 3 | Check the real "not right" path and retention on Monday; describe only what the demo does; teacher review labelled proposed |

- Judge's closest-task guess: T1 and T4 (small visible test; learning from unwelcome evidence). Label: experience-based, not information.

### Scoring (simplified after the judge review)
- Hard gates, pass or fail, any fail means rerun:
  o G1 Honesty: every limit stated aloud (stand-in testers, n = 1, untested device).
  o G2 Evidence limits: no invented number, quote or result; blanks stay blank.
  o G3 Freeze decision: code is none, or flagged and merged by 12:30.
  o G4 Demo truth: every claimed working path works in the version shown, or is labelled mock or plan; a logging or retained-audio claim needs a verified privacy answer.
- One overall question: did we answer the task aloud within 60 seconds?
- Prompts, not scored: one-line task statement in a minute; kind matched; organiser question; files and assets by name; pitch sentence fits the buffer and breaks no line in section 5.
- One on-time rule: the clock owner ends each phase on the bell; unfinished text is spoken as it stands, so the 4-minute rerun is a speaking rerun, not more drafting.

| Gate | Round 1 | Round 2 | Round 3 |
|---|---|---|---|
| G1 Honesty | | | |
| G2 Evidence limits | | | |
| G3 Freeze decision | | | |
| G4 Demo truth | | | |
| Answered aloud within 60 s | | | |

- The lowest-scoring or any gate-failing task is the one rerun at minute 35.

## 5. Say and never-say, merged
- Merged from pitch-v0.md section 5 (say box) and surprise-task-rehearsal.md; no duplicate lines. Never "first", "nobody", "only"; nothing about generating music.

| Say | Never say |
|---|---|
| "[x of n] acted on the fix" (lead with the action and count once the test is done; a bare "here is what we observed" sounds rehearsed) | "Everyone loved it." |
| "These testers were adult stand-ins." | "This proves it works for young learners." |
| "We measured one person's retake; we cannot infer what other learners would do." (pitch-v0.md keeps the short "One user, measured")| "proven"; "studies show it works" |
| "60% of users trusted it, against 90% for teachers" (the 84% helpful figure with it) | "89% positive"; "60% of students trusted" |
| "This is the working demo; this is a labelled mock." | "It is integrated" when it is a mock |
| "The cost is a placeholder." | "The pilot cost is settled"; any pilot price on stage |
| "This result changed our next test." | "The feedback is always right." |
| "AI coaches exist; our difference is the combination." | "first"; "nobody has done this"; "no one else"; "only" |
| "Our comparison is incomplete. What we can show is our own cause, fix and retake loop." (decisions-log.md; competitor-feedback-mechanics.md: most cells unknown) | "nobody does this" |
| | anything about AI making music, or implying the product makes it |
| "Augment the teacher; hand you to a human." | "replace lessons"; "no teacher needed" |
| "72% of surveyed universities offer no primary music specialisation"; "none of our sponsor universities has a music school" | "no music degree" |
| "About eight hours of music in a primary teaching degree" | "eight hours in a four-year degree" |
| "About 4% of new primary graduates from surveyed universities" | "3% of teachers" |
| "An estimated two-thirds of primary schools lack quality, sequential music" (Q and A only) | "half of schools cut music" |
| "Almost one in three very remote users have connection problems often or always" (Q and A) | "households" |
| "A small school three hours from Canberra" | "three hours from here" |
| "This year I started recording" | "Last year" |
| "UC runs outreach into rural schools; we found no music in it" | "Music: none" |
| "We tested it on a laptop under [actual connection condition]. We have not tested it on a low-end phone." | "works offline on a low-end phone" (untested) |
| "The outreach money is the Outreach Funding Program" | "HEPPP-funded" |
| | "least diverse economy"; "ANU closed its music school" |
| | Carlos's vocal range or equipment |

## 6. How each response is checked against the pitch
- The pitch each response must not break is pitch-v0.md (2:40 target, 3:00 limit, 20 s buffer).
- Checker's three questions per round:
  o Does the added sentence replace a line, or fit in the 20 s buffer?
  o Does it keep the picture, the one key thing, the live demo and the close line untouched?
  o Does it contradict the say box, the decision rule or the n = 1 evidence?
- Close line stays whichever the team picks (rehearsal Open questions); this drill never edits it.

## 7. Self-check: every number in this file, with its team file
- Numbers with a team source:

| Number | File | Section |
|---|---|---|
| 12:30 merge cut-off | surprise-task-rehearsal.md | 5 (decision rule) |
| 13:00 freeze prep start; 13:00 to 15:00 | build-plan-v0.md | 8 (Tue 10 Nov) |
| 15:00 freeze | build-plan-v0.md; surprise-task-rehearsal.md | 8; 5 |
| 90 minutes (run sheet) | surprise-task-rehearsal.md | 8 |
| 60 seconds (spoken version) | surprise-task-rehearsal.md | 6 |
| Six task kinds, rows 1 to 6 | surprise-task-rehearsal.md | 3 |
| 2:40 target, 3:00 limit, 20 s buffer | pitch-v0.md | 1 (timing table) |
| 10 seconds (phrase length) | success-criteria-draft.md | 1 (C1 metric) |
| 3 to 5 adults at the stand (not stated in this file; the test kit is) | surprise-task-rehearsal.md | 3 row 1 |
| n = 1 | pitch-v0.md; research-bank.md | 3 slide 1; first-hand evidence table |
| 24 to 7 (wobbles) | pitch-v0.md | 3 slide 1 |
| 60% of users trusted, 90% for teachers; 84% helpful | state-of-play-2026-11-06.md | 5 |
| 72% of surveyed universities; about 4%; two-thirds | pitch-v0.md | 5 (say box) |
| About eight hours (7.98 average) | pitch-v0.md; research-bank.md | 5; music-education table |
| Almost one in three very remote users | pitch-v0.md | 5 (say box) |
| Three hours from Canberra | pitch-v0.md | 5 (say box) |
| 12-week pilot | business-case-v0.md | 3 |
| 50 learners, 1 hand-off hour each | business-case-v0.md | 3 |
| About $4,500 plus model calls | business-case-v0.md | 3 |
| $87 an hour (placeholder) | business-case-v0.md | 3 |
| Weeks 8 to 12 (practice measure) | surprise-task-rehearsal.md | 7 (Measure row) |
| 2027 school year | surprise-task-rehearsal.md | 7 (What we ask row) |
| C1, C3, C4, C5 | success-criteria-draft.md | 1 |
| Four boxes (stakeholder card) | surprise-task-rehearsal.md | 4 asset 3 |
| Rows of the proceed slide; assets 1 to 5 | surprise-task-rehearsal.md | 7; 4 |
| Beat 5, beat 6 | pitch-v0.md | 1 |
| Q2, Q19 | qa-prep.md | headings (rehearsal Source 16) |

- Numbers owned by this drill (design choices, not team figures; not claims):
  o 45-minute drill; three rounds of 11 minutes; one 4-minute rerun; round marks at 1, 3, 7, 9, 10 and 11 minutes; four gates, no point total; 180-word and 60-word limits; 113, 116 and 122 word counts (measured on the quoted text).
- Out-of-date forms avoided (verification-overdrive.md fix list): "$628,416", "current HEPPP funding", "Music: none", "60% of students trusted".
- Not repeated here although in the parent note: the 10 Dec 2026 privacy-code date and the 18-of-24 studio score; check them before saying aloud.

## Method
- Read team files only: surprise-task-rehearsal.md (whole), key-facts-info-pack.md sections 1 to 3, pitch-v0.md sections 1 to 5, success-criteria-draft.md, build-plan-v0.md section 8 and 9, monday-criteria-drill.md (status wording), verification-overdrive.md fix list, decisions-log.md last rows, business-case-v0.md section 3, privacy-design-v0.md headings.
- Input draft: a Codex GPT-6 drill written tonight (invented practice, names replaced by [person]).
  o Kept: the six tasks, full responses for T1 to T3, outlines for T4 to T6, the two damaging tasks, the say and never-say shape.
  o Changed: tasks mapped to rehearsal section 3 rows; deliverables tightened with word counts; pitch sentences made swaps inside the 20 s buffer; "pilot cost" row reconciled with pitch-v0.md's never-say-a-price line (a price lives on the labelled proceed slide, not on stage); "of users" denominator added; "adult proxies" kept as "stand-in testers".
- Web: none used. Codex critique of the finished file: see below.
- Codex call 2: gpt-6-sol, medium, critique of the finished file, names replaced by roles. Exit 0.
  o Kept: T5 cost reconciled and labelled a teacher-time estimate with exclusions; clip is not proof of offline; review-record question on "not right"; 4-minute rerun slot; honesty checks mandatory; clean conflict on the music-generation line.
  o Partly kept: only observed actions are reported in T1 (no new measure invented); the undrawn three tasks go to a second session.
  o Rejected: removing the competitor line (it is a logged team decision with its source).
- Codex call 3: gpt-6-sol, medium, judge scoring of this file (no web; run by the coordinator). Scores and task-shape guesses are experience, not organiser information.
  o Kept: per-response scores and the one change each; conditions-to-agree wording; demo-truth gate G4; one on-time rule; one overall 60 s question; three say rewrites; two extra shapes (T7, T8, marked invented).
  o Changed: eight scored checks and the 12-point pass replaced by four gates plus one question; the rewritten competitor line keeps no comparison claim.
  o Rejected: nothing material; the short pitch-v0.md line stays on stage.

## Open questions
- Does the business-case task ever allow a price on stage? Pitch-v0.md says no pilot price; rehearsal section 3 row 5 lets a placeholder on the slide. Team call before Tuesday.
- Does Monday's device test pass? T6, D1 and the "offline" line depend on it.
- pitch-v0.md section 5 lists "It never generates music" as a say line; this file drops it per the no-music-generation rule. Team call.
- What does a learner's "not right" tap store, for how long, and with whose consent (privacy-design-v0.md section 5)?
- Run a second session for the three undrawn tasks (T-others), or fold them into Sunday travel time?
- Which of the three response assets (test kit, stakeholder card, clip set) are ready by Monday night?
- Who presents a surprise response, and does it get its own beat inside the 2:40? (rehearsal Open questions)
- Are adults at the stand acceptable stand-in testers to the organisers? Ask on Monday.

## Sources
1. surprise-task-rehearsal.md (all sections), team file, read 2026-11-06, opened.
2. key-facts-info-pack.md sections 1 to 3, team file, opened.
3. pitch-v0.md sections 1 to 5, team file, opened.
4. success-criteria-draft.md, team file, opened.
5. build-plan-v0.md sections 8 and 9, team file, opened.
6. business-case-v0.md section 3 (rows via grep), team file, opened.
7. state-of-play-2026-11-06.md section 5 (row via grep), team file, opened.
8. verification-overdrive.md section 1 (fix list), decisions-log.md last rows, monday-criteria-drill.md (status line), team files, opened.
9. privacy-design-v0.md sections 2, 3, 5 (rows via grep), research-bank.md first-hand evidence table (grep), team files, opened.
10. Codex GPT-6 drill draft, scratchpad mt/ea/surprise-drill-answer.md, invented practice material, not organiser information.
