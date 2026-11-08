# Consistency audit v1 (cross-file contradictions)

- Date: Fri 6 Nov 2026 night (AEDT), files as they stood about 23:20; for the Sunday team meeting and the Saturday builder.
- Purpose: every cross-file contradiction in one table, which file should win, and the smallest Saturday fix.
- Scope: this folder only; read-only audit, no existing file edited; no web sources needed.
- Status: overnight draft for the team; verify before the pitch.
- Bottom line: 14 live contradictions (4 are Sunday team choices, 10 have a clear winner); 8 candidates turned out consistent.
  o Fix before Saturday 09:00: row 13 (K3 vs X2), row 11 (Take 1 banner), row 12 (model label); none needs a team vote.
  o Needs Sunday: rows 1, 2, 3, 4 (phrase, keyboard fallback, "ceiling", age band); the sheet already lists them as A1, B1, A20, A4.
  o Fix the words, not the design: rows 5 to 10 and 14 are one-line edits in a named file.
- Rule used to pick a winner: binding contract (take-data-contract.md) > decisions-log.md > official source or opened page > latest file > Sunday choice.

## 1. The contradiction table

- Line numbers are in the files as of tonight; quotes are exact or shortened with "...".
- "Sheet" = sunday-decisions-sheet.md (row id and line).

| # | Topic | File A (line) says | File B (line) says | Winner and rule | Saturday change |
|---|---|---|---|---|---|
| 1 | Demo phrase (and the phrase the tests use) | demo-phrase-and-rights.md:7 "ONE demo phrase: Twinkle, Twinkle bars 3-4 ... 63 then 90 bpm"; take-data-contract.md s6 phrase block "twinkle-b3-4" (7 notes); nine-student-test-plan-v1.md:122 "Twinkle bars 3 to 4 (F F E E D D C), 60 bpm" | pitch-v2.md:126 row 1 default "Ode to Joy bars 1-2 (E E F G G F E D); N = 8"; build-plan-v1.md:23 D1 "None: team decides"; assistant-benchmark-protocol.md:31 "Ode to Joy bars 1 to 2 ... bpm 60"; tech-voice-path-proof.md:31 "Ode bars 1 to 2, eight notes"; small-goals-engine-spec-v1.md:210 (formula picks bars 5-8) | Sunday choice, Sheet A1 (line 21). If silent, Ode bars 1-2 applies (pitch-v2 row 1; build-plan-v1 freeze default) | Build phrase-agnostic (all three load, build-plan-v1.md:27). Whatever Sunday picks, the nine-person test and the benchmark must use the same phrase as the stage, or log the mismatch; the contract fixtures stay Twinkle (data) |
| 2 | Keyboard missing on stage | build-plan-v1.md:415 "Re-plug once (statechange); then on-screen keys"; pitch-v1.md:136 "re-plug once, then on-screen keys" | freeze-and-rehearsal-playbook-v1.md:12 "go to on-screen keys at once; one re-plug only by the rig lead, off the live take"; pitch-v2.md:141 default "On-screen keys at once" | Sunday choice, Sheet B1 (line 49; names no winner). Latest file (pitch-v2) and the playbook agree: on-screen keys at once, re-plug off the take | Build and rehearse both paths (statechange listener + on-screen keys, build-plan-v1.md:282); rehearse "on-screen keys at once" as the floor (Sheet Saturday default) |
| 3 | "Ceiling" on stage | pitch-v2.md:39 "and a human at the ceiling" (also slides 3 and 5, lines 93 and 95) | objections-and-research-gaps.md:166 "Agreed: drop the word 'ceiling' from learner and pitch wording"; handoff-design-v1 and Sheet B8 (line 56) keep an "audio ceiling line" | Sunday choice, Sheet A20 (line 39). Note: "Agreed" is the note's own word, not a team vote | None for code (`cue.ceiling` is a field name, not learner text). Learner-facing strings must not contain "ceiling" if A20 is adopted; pitch-v2.md row 22 (line 147) has the swap "a teacher when practice stalls" (same 5 words) |
| 4 | Age band | pitch-v2.md:26 "Now picture a Year 5 girl in a small school"; pitch-v2.md:95 slide 5 "free outreach to small rural primary schools"; state-of-play-2026-11-06.md:55 UC Aspire "K to 6 rural primary", UC 4 Yourself "Year 9" | audience-statement-v0.md:7 lean "Year 7 to 9 beginners, about age 12 to 15"; free-programs-partner-map.md:22 first partner page = "Years 5 and 6" | Sunday choice, Sheet A4 (line 24); no file settles it. Three bands point three ways (Year 5, Year 5-6 partner, Year 7-9 lean) | Age-neutral learner UI (Sheet Saturday default); keep `copy.json` swappable; do not hard-code "Year 5" in the app |
| 5 | "phone" vs "device" on stage | privacy-design-v1.md:174 "Audio stays on the phone; the cloud coach sees numbers and your typed goal ..."; qa-prep-v1.md:78 and freeze-and-rehearsal-playbook-v1.md:328 same sentence with "phone" | pitch-v2.md:179 and qa-prep-v1.md:77 "Audio stays on the device ..." (stage rig is a laptop, RESUME.md:15) | Latest file plus lean of Sheet B2 (line 50): "device". qa-prep-v1 holds both words in adjacent lines | Change lines 78 / 328 / 174 to "device" once B2 is confirmed; any on-screen badge ("stays on your phone", privacy-design-v1.md:180) becomes "on this device" |
| 6 | LLM cost currency | business-case-v1.md:18 "A$0.014 to A$0.095 per session (US$ converted at 0.69)" | business-case-v1.md:131 "all Sonnet US$0.095; routed US$0.043; all Haiku US$0.014" and :238 "13 x US$0.014 / 0.69"; tech-feedback-layer.md:335-337 "$0.095 / $0.043 / $0.014" | Source table (tech-feedback-layer s6) and the shown arithmetic: the figures are US$. Converted: A$0.020 to A$0.138 | Fix line 18 label to "US$0.014 to US$0.095 (A$0.02 to A$0.14)". Also tech-feedback-layer.md:18 rounds to "US$0.04 / 0.09 / 0.01"; quote the table values on any slide or answer |
| 7 | Safeguarding fee and the pilot core total | business-case-v1.md:146 "about $157 ... 3 x $157 = $471" and 8 x $157 = $1,256 | business-case-v1.md:147 core "$17,094 / $51,940" only adds up with $163 (3 x 163 = 489); printed lines sum to $17,076 and $51,892; business-case-v1.md:318 S30 "$163 ... secondary"; handoff-design-v1.md:203 "$163 for 2026-27 (v0)"; verification-overdrive-v2.md:39 D1 "core A$17,076; keeping A$17,094 is inside rounding" | Official fee page via search (A$151.60, snippet) beats the secondary $163; arithmetic beats the label. Neither fee page was opened | Say "about A$17,000" everywhere (already true both ways). If a figure must be exact: A$17,076 (small) and A$51,892 (full). The 17,094 also sits in business-case-v1.md:155, :244, :278, qa-prep-v1.md:280 (Q13), overnight-digest-for-team.md:34 and Sheet C1 |
| 8 | Success criteria: "due" or "given" | state-of-play-2026-11-06.md:10 "Mon 9 Nov, 8 am: Success criteria due" | key-facts-info-pack.md:53 "Challenge success criteria introduced to each team"; monday-criteria-drill.md:10 "GIVEN to us on Monday; they are not due from us ... that is the error" | Official info pack (p6, p7 as summarised in key-facts-info-pack.md); drill and RESUME.md:14 already say so | None in code. At the meeting: Monday 8 am the organisers hand them over; the team re-scores then (plan-2026-11-02-to-11.md:18). Do not prepare a criteria submission |
| 9 | "No ACT lender found" | state-of-play-2026-11-06.md:59 "no ACT lender found" | free-programs-partner-map.md:22 ACT Instrumental Music Program "Lent on a parent-signed loan form (see right); wood or brass or percussion"; :138 source opened 2026-11-07 | Opened page, later file. Narrowly still true for keyboards and guitars (not found), false as written | Reword to "ACT's program lends wind, brass and percussion to Year 5 and 6; no keyboard lender found". qa-prep-v1.md:88 already says loans are unverified |
| 10 | Count of judge questions | qa-prep-v1.md:6 "20 revised questions, 16 panel questions added (Q21 to Q36)"; README.md:98 "15 added panel questions (Q22 to Q36)"; qa-prep-v1.md:290 "Q22 to Q36" | qa-prep-v1.md body: Q20b at line 138, Q37 to Q45 at lines 212-244; overnight-digest-for-team.md:41 "46 judge questions (Q1 to Q45 plus Q20b)" | File body: 46 (Q1 to Q45 plus Q20b) | Fix qa-prep-v1.md:6 and README.md:98 to 46; any note or summary that says 36 is stale |
| 11 | Take 1 "recorded Saturday" | prototype-skeleton.html:146 banner "REPLAY: Take 1, recorded Saturday, scored now"; pitch-v2.md:33 "Take one, recorded Saturday"; build-plan-v1.md:144 label rule | prototype-skeleton.html:47 and :618-619 "hand-built PLACEHOLDER ... Never present these as a recorded take"; decisions-log.md:38 "must replace [them] before any rehearsal" | decisions-log.md (binding wording) and the prototype's own comment | Until Saturday's real capture the banner string must read "placeholder"; after capture set `source: replay_capture` (build-plan-v1.md:195). No rehearsal before the swap |
| 12 | Saved model answer on stage | decisions-log.md:34 (stage row) "the model step is shown as a saved answer labelled 'example output'" (unconditional); build-plan-v1.md:14 "on stage the saved answer shows with the tag" | pitch-v2.md:137 row 12 "ONLY if a real saved answer exists by Tuesday's freeze; else the 11-word goal line; never a faked one"; prototype-skeleton.html:140 "EXAMPLE OUTPUT (static text, not a model answer)"; self-assessment-v0.md:184 "Rules only in the 3 minutes" | pitch-v2 row 12 (strictest; Sheet A8 line 28 updated lean). The prototype's label sits on non-model text, which breaks "never a faked one" | Change the prototype block to "Placeholder, no model call" until T26 saves a real answer; "Example output, recorded [date]" only on a real saved answer; remove the unconditional wording at the freeze |
| 13 | Planted error and the rule that fires | build-plan-v1.md:162 Ode bars 1-2 "Rush from note 5, K3 (tier 6)"; pitch-v2.md:35 cue "You speed up as you play" | take-data-contract.md s8.2 (line 714 and table 718): at 80 bpm Ode bars 1-2 "a uniform 10% rush ... ends 477 ms early, outside W = 375, so it scores X2, not K3"; prototype-skeleton.html:44 "K3 fires only if the first notes are a little late" | Binding contract s8.2 (measured arithmetic) | The captured Take 1 must be a rush that starts late in the phrase with first notes slightly late, and the stage selftest must assert K3 fires; else the spoken cue and the rule disagree |
| 14 | "Third miss" off by one in the model prompt | tech-feedback-layer.md:116 "miss 3 = hand-off offer" and :204 "if twice and it fires again, set handoff_flag" | tech-feedback-layer.md:221 "the same cause has not improved after three retakes" (that is take 4); handoff-design-v1.md:89 "We've tried this three times" | Miss 3 (third failed take), per contract invariant 7 and the engine spec | Change :221 to "after the third failed take"; keep the card copy "tried three times" |

## 2. Settled tonight

| Candidate | Why it holds | Quote that settles it |
|---|---|---|
| Tempo 60 / 80 / 90 bpm | Different fields, not one claim; the stage rows all say 80. Only to-do: add an 80 bpm fixture | take-data-contract.md:432 "`phrase.bpm` is the target; `take.bpm` the played tempo"; build-plan-v1.md:170 "the demo retake runs at 80 bpm from `stage.json`"; take-data-contract.md:804 "add one 80 bpm fixture". Open as Sheet A22 (line 41), which does not block code |
| "6 of 8" against a 7-note Twinkle phrase | The voice proof scores Ode bars 1-2 whatever the demo phrase is; the 7-note bar is already written down | tech-voice-path-proof.md:44 "the Twinkle phrase has 7 notes, so its whole-loop bar is 5 of 7; only the Ode phrase carries the 6 of 8 bar" (build-plan-v1.md:308 gives "6 of 8" without naming the phrase) |
| Hand-off trigger (third miss vs three sessions in a row) | Every v1 file uses miss 3; only build-plan-v0 differs and is superseded | handoff-design-v1.md:86 "this file follows the tech file (miss 3), as briefed"; small-goals-engine-spec-v1.md:319 same; build-plan-v0.md:187 is the stale "three sessions in a row". Sheet A6 (line 26) can close |
| Self-assessment 31 vs 35 | 31 = v0 total, 31 to 35 = pitch-v1 re-score, v2 unscored | self-assessment-v0.md:31 "Total today: 31 of 60"; :171 "31 to 35 of 60 (ours); Codex 34"; pitch-v2.md:69 "no v2 score is claimed". README.md:91 "about 31 of 60 today" is a stale pointer |
| Hand-off wording "Proposed" vs "Today, a mock" | Spoken line says mock, the screen says Proposed ... (mock); both say mock | pitch-v2.md:37 "Today, a mock." with corner label "Proposed: Webex hand-off (mock)"; prototype-skeleton.html:183 same string. handoff-design-v1.md:197 "mock pilot" is a third label: pick one caption (optional) |
| Pass bars for the nine-person test | Plan and materials carry the same five bars | nine-student-test-materials.md:166-172 "C1 5 of 9; C2 8 of 9; C3 6 of 9; C4 6 of 9; C5 3 of 3" = nine-student-test-plan-v1.md:191 |
| Contract rule 7 "nothing names Twinkle or Ode" | The fixtures name a phrase as data, not as a rule | take-data-contract.md:15 "the demo phrase is data"; s6 phrase block is the data |
| Pilot price on stage | None anywhere in the script | pitch-v2.md:132 row 7 "None on stage, spoken or on a slide"; decisions-log.md price row |

## 3. The ten lines a judge or the builder would hit first

- 1. pitch-v2.md:126 default phrase Ode bars 1-2 vs demo-phrase-and-rights.md:7 Twinkle bars 3-4: the builder opens the wrong note file (row 1).
- 2. prototype-skeleton.html:146 banner "recorded Saturday" over a placeholder take: a judge told "recorded" would be misled (row 11).
- 3. prototype-skeleton.html:140 "EXAMPLE OUTPUT" on static text: "where is the AI?" gets a faked answer (row 12).
- 4. pitch-v2.md:35 "You speed up as you play" vs take-data-contract.md s8.2: the rule that fires may be X2, not K3 (row 13).
- 5. pitch-v2.md:39 "a human at the ceiling": reads as a gate on help (objections-and-research-gaps.md:129, 153) (row 3).
- 6. pitch-v2.md:26 "a Year 5 girl" beside the cloud coach: under-15 default is off (Sheet A4, A10) (row 4).
- 7. privacy-design-v1.md:174 "Audio stays on the phone" read on a laptop stage (row 5).
- 8. business-case-v1.md:147 A$17,094 core that does not add up from its own lines (row 7); qa-prep-v1.md:280 repeats it for Q13.
- 9. state-of-play-2026-11-06.md:59 "no ACT lender found" against a program that lends instruments (row 9).
- 10. tech-feedback-layer.md:221 "three retakes" in the prompt the model reads (row 14).

## 4. What the night summary should say

- 14 cross-file contradictions found in the folder tonight; 3 need a fix before the Saturday build (rows 11, 12, 13), 4 need a Sunday choice (rows 1 to 4).
- state-of-play-2026-11-06.md is wrong on two lines: line 10 "criteria due" (they are handed out Monday 8 am) and line 59 "no ACT lender found".
- The prototype shows "recorded Saturday" and "EXAMPLE OUTPUT" over placeholder content; both labels must change until the real capture and a real saved model answer exist.
- The pilot core total (A$17,094) does not add up from its own lines (A$17,076); the LLM cost label says A$ where the numbers are US$; say "about A$17,000" until fixed.
- The hand-off trigger, tempo, "6 of 8" bar, pass bars and self-assessment score were checked and are consistent.

## Method

- Read in the order given: state-of-play, demo-phrase-and-rights, build-plan-v1 (decisions block, D1 table, checkpoints), pitch-v2 (script, Sunday table), take-data-contract (sections 0, 5, 6 head, 8 by grep; not read in full), prototype-skeleton.html (first 80 lines), engine spec, handoff design, tech-feedback-layer, privacy-design, voice-path proof (s1), benchmark protocol (s2), nine-person plan and materials, objections s1, audience statement, partner map, business-case (s1, cost lines), then sunday-decisions-sheet.md (read mid-run, 37,871 B; re-read at the end).
- Method per candidate: grep every file for the term, read the lines either side, quote exactly; a row needs two different files (or two places in one file) that cannot both hold.
- Codex call 1: gpt-6-sol, medium, names absent from the prompt (file ids F1 to F16), table of 16 candidates pasted.
  o Kept: rows 1, 3 to 8 (6 and 7 as stated), 10 to 12, 14 to 16 as real; winners and fixes matched my own reading.
  o Rejected (verified myself): "criteria can be introduced before due" (row 8 stays: sources say teams submit nothing); "tempo not real" kept as settled but with the 80 bpm fixture to-do; hand-off label moved to Settled.
  o Narrowed: ACT lender (row 9) is true only for keyboards, as Codex said.
  o Not folded: its five extra categories (consent and retention, rights, accessibility claims, offline requirements, decision ownership), not checked tonight; see Open questions.
- Web: none used. Numbers and quotes come from the files only; no figure here is new.

## Open questions

- Which of rows 1 to 4 does the team settle on Sunday, and in what order (the sheet's first-ten-minutes order puts A1 after A2, A3, A7, A10, A6)?
- Row 7: open the Access Canberra fee page; which total does the team quote (A$17,076 or "about A$17,000")?
- Row 9: does a keyboard or ukulele lender exist in the ACT (verify by phone Monday, per free-programs-partner-map.md:144)?
- Not audited tonight (Codex categories, unchecked): consent and data retention wording across files, music and recording rights wording, accessibility claims vs tested controls, offline requirements, who owns each freeze or approval decision.
- Sheet re-read at the end (23:25): still 37,940 B, rows A1 to A23, B1 to B12, C1 to C12; no row added or changed since the mid-run read.

## Sources

1. state-of-play-2026-11-06.md: lines 10, 15, 55, 59.
2. demo-phrase-and-rights.md: lines 7, 41, 77.
3. build-plan-v1.md: lines 12, 14, 23, 27, 144, 162, 170, 195, 282, 308, 415, 681.
4. pitch-v2.md: lines 26, 33, 35, 37, 39, 69, 93, 95, 126, 132, 133, 137, 141, 147, 179.
5. take-data-contract.md: lines 15, 432, 443, 714, 718, 804; s6 phrase block.
6. prototype-skeleton.html: lines 14, 22, 26, 44, 47, 140, 146, 183, 617-619.
7. small-goals-engine-spec-v1.md: lines 210, 306, 319. handoff-design-v1.md: lines 86, 89, 197, 203.
8. tech-feedback-layer.md: lines 18, 116, 204, 221, 335-337. privacy-design-v1.md: lines 174, 180.
9. accessibility-design-v1.md: lines 20, 187 (phone wording). freeze-and-rehearsal-playbook-v1.md: lines 12, 213, 328.
10. tech-voice-path-proof.md: lines 31, 44. assistant-benchmark-protocol.md: lines 31, 37.
11. nine-student-test-plan-v1.md: lines 22, 122, 191; nine-student-test-materials.md: lines 124, 166-172.
12. objections-and-research-gaps.md: lines 129, 153, 166. audience-statement-v0.md: line 7. free-programs-partner-map.md: lines 22, 138.
13. business-case-v1.md: lines 18, 131, 146, 147, 155, 238, 244, 278, 318. verification-overdrive-v2.md: lines 39, 43.
14. qa-prep-v1.md: lines 6, 77, 78, 88, 280, 290. README.md: lines 91, 98. overnight-digest-for-team.md: lines 34, 41.
15. key-facts-info-pack.md: line 53. monday-criteria-drill.md: line 10. decisions-log.md: lines 34 to 38. RESUME.md: lines 14, 15.
16. sunday-decisions-sheet.md: lines 21, 24, 26, 28, 39, 41, 49, 50, 56 (A1, A4, A6, A8, A20, A22, B1, B2, B8).
