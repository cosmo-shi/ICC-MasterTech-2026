# Surprise task rehearsal: Tuesday breakfast, Tue 10 Nov 2026

- Date: Fri 6 Nov 2026 (AEDT), overnight draft. Covers the surprise task announced over breakfast on Tue 10 Nov.
- Purpose: turn any surprise task into a response draft within 90 minutes, from material we already have, without breaking the 15:00 freeze.
- Recommendation: treat the task as a chance to show learning; answer from the kit, code last, merged by 12:30.
- Status: overnight draft for the team; verify before the pitch. Likelihoods are planning estimates, not organiser information.

## 1. Recommendation
- The surprise is designed to move ideas forward, not to eliminate teams (ICM case study, opened [1]).
  o So the winning move is a visible, honest improvement, not a rebuild.
- Answer from existing files: each likely task already has material in the folder (table in section 3).
- Code only when the task explicitly demands a working behaviour; merge by 12:30, because freeze prep starts 13:00 (build-plan-v0.md section 8).
- Pre-build five assets on Monday night (section 4); they cover most of the twelve kinds.
- Ask the organiser one precise question within 15 minutes if "show", "use", the deadline or the deliverable is unclear.
- Log the task and our response for the three-minute journey video; the pivot itself is pitch material [1].

## 2. What we know about the surprise task
| Fact | Wording or finding | Source |
|---|---|---|
| It exists, on Tuesday | "A surprise new task is announced over breakfast" (Tue 10 Nov, Day 4) | key-facts-info-pack.md section 1 (info pack p6, p7) |
| Its purpose | "On day 4, collaborators are shocked by a surprising task. Ultimately, this helps them progress their ideas." | ICM case study [1], opened |
| Its effect | "divergent thinking enters each group to shape a positive story and a more detailed outcome" | [1], opened |
| Tuesday focus | "Prototype build, user story, evidence, first serious pitch rehearsals" | key-facts-info-pack.md section 1 |
| Hidden technology | "at least one technology element is not introduced at the start"; lying in the room, needs fixing, or never opened | [1], opened; not stated to arrive on Day 4 |
| Elimination | "Teams are not eliminated, but often the details of their ideas are." | [1], opened; info pack p7 |
| Reviewer tests | "customer value, evidence, technical feasibility and what it would take to proceed" | key-facts-info-pack.md section 3 (info pack p5) |
| Journey video | "a dynamic three-minute video narrative of their journey" | [1], opened |

### Pattern from MasterTech 2024 and 2025
- What the 2024 or 2025 surprise task actually was: none found.
  o past-challenges-research.md has no task example; UC 2024 and 2025 news pages, the 2024 Brisbane kick-off page and the 2024 EcoVoice Q and A do not mention one (opened [2] to [5]).
- What both winners were praised for, which the surprise answer should keep visible:
  o 2024: "solutions that were very feasible" (Coles judge, UC news, opened [2]); ideas "readily implementable" (EcoVoice, opened [5]).
  o 2025: "this blend of creativity, technical strength, and social impact" (UC news, opened [3]).
- Analysis (ours): a response that stays feasible, keeps the social-impact line (access) and shows a measured result fits both years.
- Lead to follow: past-challenges-research.md lists a member named Simone in the 2025 winning ICC team.
  o If that is our teammate, she may know the 2025 Day 4 task directly; ask her on Sunday (Open questions).

## 3. Twelve likely surprise-task kinds
- Ranked by our estimate after a Codex second opinion (Method); none is predicted by the organisers.
- Roles in the plan: R&UX = research and UX; Pipe = model pipeline and web; Rig = infrastructure and demo rig.

| # | Kind | Likelihood | What it tests | 3-line response for this entry | Material |
|---|---|---|---|---|---|
| 1 | User test by lunchtime | High | Evidence, customer value | 1. Run the quick test (asset 2) on 3 to 5 adult passers-by at the stand, recruited with one line; they are proxies, not young learners, and we say so. 2. Keyboard phrase: take 1, one fix, retake; ask the trust and "help or homework" questions. 3. Watch the observed task (did they act on the fix?), then report "x of n" and verbatim lines; no percentages, no recordings kept | success-criteria-draft.md (C1, C3, C4); friday-selection-pack-2026-11-06.md section 8; privacy-design-v0.md |
| 2 | New stakeholder or changed audience (principal, parent, regional teacher, Cisco leader) | High | Operating context | 1. Swap the stakeholder card (asset 3): what they gain, approve, fear. 2. Rewrite beat 5 of the pitch in one sentence for them. 3. Show the teacher hand-off card as their view | business-case-v0.md section 2; universities-brief.md; qa-prep.md Q2, Q19 |
| 3 | "What if the AI is wrong?" | High | Safe failure, trust | 1. Rules lead, the model only rewords: cues come from measured notes, not a guess. 2. Unclear input gives "the app could not hear clearly" before any cue; the learner can retake or dismiss. 3. A clear take with a wrong cue: the learner taps "not right", no improvement is claimed, the case is logged; a qualified teacher scores a sample before a pilot | tech-feedback-layer.md (cause order, cue rules); build-plan-v0.md section 7; qa-prep.md Extra A |
| 4 | Evidence that challenges a core assumption | High | Evidence handling | 1. Name the assumption: hidden fundamentals may feel like homework; students trust teachers more (60% vs 90%). 2. Show what we have (one user, measured) and what C3 and C4 will measure. 3. Offer the smallest test that would change our mind | state-of-play-2026-11-06.md sections 5, 12; qa-prep.md Q6, Q7, Q18 |
| 5 | One-slide business case, with a price or scale number | High | What it takes to proceed | 1. Use the proceed slide (section 7) prefilled with the 12-week pilot. 2. Small pilot about $4,500 plus model calls for 50 learners (1 hand-off hour each at a placeholder $87); full about $26,200 for 150 at 2 hours each. 3. Say which numbers are assumptions and who sets the thresholds | business-case-v0.md sections 3, 6 |
| 6 | Accessibility or weak connectivity | Medium | Reach for the stated learner | 1. Airplane-mode run, only if Monday's device test passed; else say "built for offline, tested on laptop". 2. On-screen keys = the no-instrument path; plain words only (R6). 3. Name what is untested: a named low-end phone | build-plan-v0.md section 4; success-criteria-draft.md C5; research-bank.md (ADII 2025) |
| 7 | New constraint or budget cut (zero budget, no cloud, half the time) | Medium | Protecting the core | 1. Fall back to the pass line: one phrase, one input, one measured cue, one retake, offline. 2. Cut in the build-plan order: model rewrite, mirroring, live voice, seven-day engine. 3. Show the cost table with cloud at zero | build-plan-v0.md sections 1, 8; business-case-v0.md section 3 |
| 8 | Second user to assess | Medium | Adaptability without losing focus | 1. Make the hand-off teacher the second user: what they receive (recording, fix list). 2. Mention the pre-service-teacher studio (scored 18 of 24) as the pilot option. 3. Keep the learner loop unchanged | functional-requirements-v0.md R10; friday-selection-pack-2026-11-06.md; state-of-play section 3 |
| 9 | Data, consent and privacy for minors | Medium | Care with young people's data | 1. Draw the data path: audio stays on the device; only measured note features go to an optional rewording call; a recording leaves only on an opt-in share to the hand-off teacher, guardian-approved under 15, deletion rule stated. 2. Guardian set-up under 15; Children's Online Privacy Code not yet registered (OAIC deadline 10 Dec 2026). 3. No real student data in the demo | privacy-design-v0.md sections 2, 3; qa-prep.md Q11, Extra C |
| 10 | Hidden technology element (found, broken or unopened) | Medium | Folding in new kit fast | 1. 20-minute triage: does it help listening, feedback or hand-off? 2. If it is an input (mic, MIDI device, tablet, camera), try it in the set-up check behind a flag. 3. If the task requires it to work, rule 3 in section 5 applies (small, flagged, merged by 12:30); if not required, it goes on the future slide | tech-keyboard-input.md; build-plan-v0.md section 9 |
| 11 | Sponsor technology integration (Cisco or a university platform) | Medium | Technical fit, honesty | 1. Webex: hand-off shown as a Webex message; a real post to a team test space only if done by 12:30. 2. Universities: the weekly summary could feed Canvas or Moodle. 3. Never say "integrated" for a mock | build-plan-v0.md section 11; universities-brief.md (LMS); qa-prep.md Q20 |
| 12 | Journey video or story reshaped around a setback | Medium | Visible learning | 1. Storyboard: 2 Nov challenge, five candidates, advisor steers, own evidence, build, Tuesday task. 2. Use the "dropped on the way" list as real pivots. 3. End on what changed because of today's task | state-of-play section 3, 4; decisions-log.md; notes-2026-11-0x files |

- Also covered, ranked Low or folded in:
  o 30-second elevator pitch: ready in section 6.
  o Risk register: build-plan-v0.md section 10 and business-case-v0.md section 7.
  o Sustainability twist: own devices, no new hardware; no environmental figures exist, so claim none.
  o A teammate removed for an hour: each role in section 8 has a backup; rehearse the demo with two speakers.

## 4. Five assets to pre-build on Monday night
| # | Asset | Owner (role) | Content outline | Covers kinds |
|---|---|---|---|---|
| 1 | Proceed slide, editable | Rig, with R&UX | Section 7 template filled with the current pilot; a "constraint" cell left blank for Tuesday | 2, 5, 7, 11 |
| 2 | Quick-test kit | R&UX | Consent line for adults; script (goal, take 1, fix, retake); C3 and C4 questions read aloud; tally sheet with blank cells; reporting line "x of n said ..." | 1, 4, 6 |
| 3 | Stakeholder and data card | R&UX | Four boxes (learner, guardian or school, outreach coordinator, hand-off teacher): gains, approvals, fears; data path diagram underneath | 2, 8, 9 |
| 4 | Clip set | Pipe | 10 to 20 second screen clips: normal loop; "could not hear clearly" case; on-screen keys; airplane mode (if passed); hand-off card; all from recording v1 | 3, 6, 7, 10 |
| 5 | Pitch modules | Rig or R&UX | 30 s and 60 s scripts; one-sentence beat-5 swaps per stakeholder; journey-video beat list with dates; a blank "what changed today" slide | 2, 4, 12 |

- Rule for all five: blank cells stay blank until a real result fills them; no invented numbers or quotes.
- Store them in the repo folder agreed on Monday; print asset 2 if a printer is available (unverified).

## 5. Decision rule: a task that conflicts with the 15:00 freeze
1. Read the task aloud; write one line: what must be shown, to whom, by when; ask the organiser if any of that is unclear.
2. Spend at most 20 minutes matching it to section 3; the task outranks our own freeze plan, never the working loop.
3. Code only if the task requires a working behaviour, it sits behind a flag, leaves the cue loop alone, and is merged and tested by 12:30.
4. Answer everything else as material: slide, storyboard, labelled mock, bounded trial plan, or a stated limit.
5. Freeze at 15:00; after that only pitch, slides, video and answers change; if the build breaks, revert to the last release candidate.

- Why 12:30: freeze prep (cache bump, redeploy, reload every stage device, recording v2) runs 13:00 to 15:00 (build-plan-v0.md section 8).
- A storyboard cannot answer a task that explicitly demands a working behaviour; then rule 3 applies, scoped small (Codex point, kept).

## 6. Spoken versions: 30 seconds and 60 seconds
- Plain words, no superlatives, no claim to be the only or earliest; ends on the meaning of the close line (state-of-play section 9).

### 30 seconds (68 words, about 27 s at 150 a minute)
- "Videos cannot hear you play. Our practice coach can."
- "A young person with no teacher nearby names a song they want to play."
- "They play ten seconds. It gives one fix in plain words, and the retake shows whether it worked."
- "No instrument? On-screen keys."
- "When they need real technique, it hands them to a human teacher, with their recording."
- "Learning music should not depend on your postcode."

### 60 seconds (137 words, about 55 s at 150 a minute)
- "Picture a Year 5 student in a small school three hours from Canberra. She wants to play one song for her mum." (composite, Picture A)
- "There is no music teacher nearby."
- "Videos can show her the song. They cannot hear her play. Our practice coach can."
- "She names her goal, and it breaks it into small steps."
- "She plays ten seconds, gets one fix in plain words, and the retake shows whether it worked."
- "When she needs real technique, it hands her to a human teacher, with her recording and fix list."
- "It never makes music. It listens."
- "Universities already run outreach into rural schools; we found no music in it."
- "Next: one outreach partner, one term, one measure."
- "Music should not depend on your postcode. We make the start free, and hand you to a human for the rest."
- Optional statistic if the run is short (adds about 6 s): "A primary teacher trains with about eight hours of music in a whole degree."
  o Source: Fading Notes 2023 average across surveyed universities (7.98 hours), state-of-play section 5; say "about".
- Notes:
  o The outreach line is the safe wording from pitch-v0.md beat 5 ("no music we could find").
  o Word counts measured on the quoted lines; "shows whether it worked" keeps the claim conditional.
  o The last line paraphrases the stage close line without the word "first"; on stage use whichever the team picks (Open questions).
  o Do not say "offline" unless Monday's airplane-mode test passed.

## 7. One-slide template: what it would take to proceed
- Fixed rows; any constraint changes one cell, never the shape. Current fill from business-case-v0.md section 3.

| Row | Current fill | If the constraint is ... rewrite as |
|---|---|---|
| Learner and setting | Young beginner without access; regional school via outreach | New user: name them here, keep the loop |
| Partner and decision owner | One university outreach programme; coordinator decides | New stakeholder: their approval goes here |
| What we ask | 12-week pilot, 2027 school year | Half the time: 6-week check, measured late |
| What exists today | Working loop on keyboard; one measured voice record (n = 1) | Say exactly what is live and what is a mock |
| Smallest trial | Small: 50 learners, 1 hand-off hour each | Zero budget: in-kind coordinator, student mentors |
| Cost | About $4,500 plus model calls (placeholders) | No cloud: model calls removed, rules cues only |
| Measure | Retakes with a measured fix; week 8 to 12 practice; hand-offs taken | Evidence task: add today's "x of n" |
| Go or no-go | Thresholds set with the sponsor; none invented here | Ask the reviewer what threshold they would accept |
| Safety, access, hand-off | Audio on device; guardian consent; teacher-scored sample of fixes | Ethics task: point to the data card |
| Open risk | Hidden fundamentals may feel like homework | Name the test that would change our mind |
| Next decision and date | Partner yes or no; ethics if data count as research (about 2 weeks at UC, low risk) | Keep a date on the slide |

## 8. Tuesday 90-minute run sheet
- The clock starts when the task is announced. Breakfast is 7 to 9 am at Bundoora; the bus leaves at 9 am (info pack p6).
  o Work before the bus happens on laptops; the rest on the bus or at arrival. The stage rig waits at the stand.
  o If the task lands late in breakfast, keep minutes 0 to 25 at the table and do the rest on the bus.
- Lean role mapping (plan-2026-11-02-to-11.md, adjustable): R&UX = Simone; Pipe = Justin; Rig = Carlos.

| Minutes | R&UX (research and UX) | Pipe (model pipeline and web) | Rig (infrastructure and demo rig) |
|---|---|---|---|
| 0 to 5 | Photograph or copy the task wording | Listen; note any technical demand | Start the clock; write the one-line task statement |
| 5 to 15 | Match to section 3 row; ask the organiser the one precise question, if needed | Size any code: hours, files touched, risk to the cue loop | Check rig impact: devices, hidden kit, network, freeze timetable |
| 15 to 25 | Finish the section 3 match with the organiser answer | Report: code needed yes or no | Run the decision rule (section 5); team agrees |
| 25 to 60 | Build the response material: test kit, stakeholder card, slide text | If code: branch and flag, plan the 12:30 merge; if not: cut clips, mock screens | Fill the proceed slide; update the freeze-prep plan; log for the journey video |
| 60 to 75 | Rehearse the 60-second answer aloud | Dry-run the demo change on a laptop, if any | Decide who presents the response and where it sits in the pitch |
| 75 to 90 | Update slides and Q and A lines | Change list ready for the commit owner; selftest plan | Confirm the day: fixes until 12:30, freeze prep 13:00, freeze 15:00 |

- Backups if one person is away: R&UX tasks to Rig; Pipe tasks to Rig; Rig tasks to R&UX.
- Output at minute 90: one-line task statement; decision (code or material); response draft (not the finished answer); owner per item; updated day plan.

## Method
- Read team files only (Sources 6 to 16); the input outline was a Codex knowledge draft with no web access.
  o Kept from it: the twelve-kind frame, the five-asset idea, the five-line rule shape, the proceed fields; rewritten with this entry's files.
  o Rejected from it: "Australian Government AI framework" and design-sprint citations (not needed; not re-verified); "first" in spoken text; "on a phone" (stage device is a laptop).
- Web, opened: ICM case study [1]; UC 2024 and 2025 news [2] [3]; ICB 2024 kick-off [4]; EcoVoice Q and A [5]. One generic search found no past-task example.
- Codex call 1: gpt-6-sol, medium, second opinion on the twelve kinds and the freeze rule (generic context, no names). Exit 0.
  o Kept: hidden-tech and journey-video kinds added; price or scale number in the business case; ask the organiser early; a code cut-off before 15:00; "storyboard cannot satisfy a required behaviour".
  o Changed: Codex suggested a cut-off at 13:30 to 14:00; we use 12:30 because freeze prep starts 13:00 in the build plan.
- Codex call 2: gpt-6-sol, medium, critique of this file with names replaced by roles. Exit 0.
  o Kept: clock starts at announcement; organiser question inside 15 minutes; script word counts (were 83 and 168, now 68 and 137); conditional "shows whether it worked"; proxy limits; wrong-cue-on-clear-take handling; recording leaves only on opt-in share; hidden tech that must work goes to rule 3; cost basis shown.
  o Partly kept: the eight-hours figure moved to an optional line with its population and source, not removed.

## Open questions
- Is the Simone in the 2025 winning ICC team our teammate? If so, what was the 2025 Day 4 task?
- Close line: keep "The first step into music..." on stage, or the paraphrase without "first"? Team call.
- Does Monday's airplane-mode test pass? Rows 6 and 7 and the 60 s script depend on it.
- Who presents the surprise response, and does it get its own beat inside the 2:40?
- Is a real Webex post wanted on Tuesday, given the 12:30 cut-off (build-plan section 11)?
- Adults at the stand as test proxies: acceptable to the organisers? Ask on Monday.
- Pilot cost cells are placeholders (business-case-v0.md); confirm before any number is said aloud.

## Sources
1. Innovation Central Melbourne, MasterTech program case study, https://icentralau.com.au/melbourne/case-studies/master-tech-program/, accessed 2026-11-06, opened.
2. University of Canberra news, 2024 MasterTech win, https://www.canberra.edu.au/about-uc/media/newsroom/2024/december/ucs-icc-team-takes-top-spot-at-first-mastertech-hackathon, accessed 2026-11-06, opened.
3. University of Canberra news, 2025 MasterTech win, https://www.canberra.edu.au/about-uc/media/newsroom/2025/november/bringing-home-the-bacon-uc-students-win-big-with-a-bold-plan-to-transform-coles-reward-program, accessed 2026-11-06, opened.
4. Innovation Central Brisbane, 2024 kick-off, https://www.icentralau.com.au/brisbane/mastertech-hackathon-kicks-off/, accessed 2026-11-06, opened.
5. EcoVoice, Q and A with Cisco's education director, https://www.ecovoice.com.au/eco-voice-q-a-with-reg-johnson-director-of-education-and-strategic-industries-at-cisco/, accessed 2026-11-06, opened.
6. key-facts-info-pack.md sections 1 to 3 (info pack pp. 5 to 7), team file, opened.
7. past-challenges-research.md sections 2 to 5, team file, opened.
8. state-of-play-2026-11-06.md sections 2 to 12, team file, opened.
9. build-plan-v0.md sections 1, 2, 4, 7 to 12, team file, opened.
10. success-criteria-draft.md, team file, opened.
11. business-case-v0.md section 3, team file, opened.
12. pitch-v0.md sections 1 to 5; talking-script-2026-11-06-6pm.md sections 6 and spoken versions, team files, opened.
13. functional-requirements-v0.md; plan-2026-11-02-to-11.md (roles), team files, opened.
14. privacy-design-v0.md (grep of sections 2, 3), team file, opened.
15. tech-feedback-layer.md (grep of cause order and cue rules), team file, opened.
16. qa-prep.md (headings), team file, opened.
