# Q and A stale answers v0: which prepared answers the overnight files make out of date

- Date: Sat 7 Nov 2026 (AEDT), overnight; compares qa-prep-v1.md (file A) with success-conditions-v1.md (file B) and the overnight files B folds in.
- Purpose: tell the team which Wednesday answers to change, which new questions are likely, and which answer to rehearse on Sunday.
- Scope: a GPT-6 Sol comparison (Codex, unverified) was treated as claims; every row below was re-checked against the local files named.
- Status: overnight draft for the team; verify before the pitch. This note proposes only; it does not edit qa-prep-v1.md or any other file.
- Bottom line:
  o 19 Codex rows checked: 10 confirmed, 9 partly (a detail differs), 0 rejected.
  o The three heaviest changes: the Mastery comparison (Q4, Q16), the learner age (Q1, Q45) and the cue and pass rule (Q21, Q26).
  o The pilot-length, safeguarding and educator rows (Q13, Q15, Q17, Q28, Q29, Q38, Q40) all point to unnamed host duties, not new numbers.
- Owners are roles, as in B: Research and UX lead (Simone), Infrastructure and rig lead (Carlos), Model and web lead (Justin).

## 1. Answers to update before Wednesday

- Ordered as the panel is likely to ask: learner, comparison, demo, feasibility, proceed, safeguarding.
- Replacement answers carry no figure unless a file carries it with its source; figures stay in A where A has them.

| A section and question | Current claim (A) | What B or the overnight file says | Honest replacement (under 40 words) | Verdict | Owner |
|---|---|---|---|---|---|
| 1. Customer value, Q1 Who is the learner | Age is a Sunday decision; demo uses young-adult language | B condition 1 and sheet A4: Year 5 to 6 leads 12 to 9, narrowly (10 to 9 without the picture row); demo copy still young-adult (age-band-evidence-v1 s1) | "Our provisional learner is a Year 5 or 6 beginner, about ten to twelve. The team confirms that on Sunday; no learner or outreach team has validated it." | Confirmed | Research and UX lead (see section 7) |
| 6. Panel questions, Q45 Which learners first | "The age group is a team decision this week" | Same B row; Year 7 to 9 is the fallback (sheet A4); funding guidance names no school year (age-band-evidence-v1 s4, p4) | "We are working to Year 5 to 6, provisionally. Neither learners nor an outreach buyer has validated that choice; both are the next step." | Confirmed | Research and UX lead (see section 7) |
| 1. Customer value, Q4 Why not YouTube or Yousician | Yousician is the objection; Singing Carrots the closest singing rival | B "What changed" and condition 7; nearest-competitors-v1 s0: Mastery is nearest (re-analysis, review by link); SmartMusic hears by microphone and MIDI (s1.2); Mastery not yet run | "Mastery is our nearest known product: it offers re-analysis and review by link. Our claimed difference is one explained fix, a same-phrase retake check and a teacher hand-off. We have not run Mastery." | Confirmed (A names Singing Carrots as closest singing rival, so the gap is overall nearest, not singing); A never names Mastery | Research and UX lead (see section 7) |
| 5. The hard ones, Q16 Another tutor app, prior art | Page review of 27 products found no complete loop documented | B condition 7; nearest-competitors-v1 s0: three parts overlap, "not shown is not not built"; B sheet leaves the 40-word or 39-word Mastery answer to Sunday | "Several products overlap: Mastery re-analyses and shares by link, SmartMusic scores by microphone or MIDI. Our claimed difference is the combination. Page reviews cannot show what happens behind a page." | Confirmed (A's spoken line already carries the page-scan limit; the stale part is the unnamed overlap) | Research and UX lead (see section 7) |
| 6. Panel questions, Q21 Which parts were live | Take 1 replayed from a Saturday capture; retake live | B condition 2; prototype-review-v1 D1: planned cue K3 fires in 797 of 2000 noisy placeholder trials (team test, 40%; D1 table says 44%); rig capture is Saturday 09:30; else switch to K1 | "Take 1 is a recording, replayed through the real scoring code; the retake is live on the keyboard. The hand-off card is a mock. Which cue we show depends on Saturday's capture on the rig." | Partly: A is conditional ("captured Saturday"), not "settled"; the cue risk is the new fact | Model and web lead (see section 7) |
| 6. Panel questions, Q23 Where is the AI | Model layer off or shows cached answers, labelled "example output" | model-slot-options-v0 s1: one real hosted call, saved, with a dated long label, not yet made (sheet A8, by Mon 14:00); no live model call on stage | "Rules on this laptop chose the cue you saw. A saved, dated hosted-model call shows the proposed plan step, if we complete it; no model runs live on stage." | Partly: A's direction holds; the new detail is the dated label and that the call is still owed | Model and web lead (see section 7) |
| 6. Panel questions, Q26 Score measures improvement | Timing number comes from exact MIDI note times | prototype-review-v1 A2: one wrong middle key passes (F#4 for G4 gives 7 of 8 and "none"); D11: wrong keys count as on the beat; fix is zero wrong keys (contract v1.2) | "MIDI gives exact note times, but our pass rule could accept a wrong key. The fix is planned before Saturday's freeze; if it is not confirmed, we say so." | Partly: A claims timing only; the stale part is the pass rule | Model and web lead (see section 7) |
| 6. Panel questions, Q41 Equipped to deliver | "A working MIDI scoring demo" plus record, test plan, cost model | B "State of play on waking": cue and pass rule unproven on the real rig; no teacher review, no buyer, no staffed reviewers | "We have a prototype and a test plan. We still owe a reliable demonstration on the real rig, a teacher review, a buyer commitment and a staffed hand-off." | Confirmed | Rig lead |
| 3. Feasibility, Q10 AI cost per learner | Routed estimate about US$0.04 a session; A$112 model calls for 50 learners | model-slot-options-v0 s1, s3: hybrid with rules fallback; cloud coach off by default and off under 15; its usage assumption differs from business-case-v1 and is "not reconciled" | "These are estimates, and two cost models assume different usage, so we must reconcile them. In a pilot the cloud coach is off by default, so cost depends on consent; the stage makes no live call." | Partly: B adds the under-15 default, which may remove most calls for Year 5 to 6; cost figures are not updated | Model and web lead (see section 7) |
| 3. Feasibility, Q11 Privacy of minors | Stage sentence: cloud coach sees numbers and typed goal | stack-review-v1 s1 (via B): stage is one HTML file, no network, no storage; model-slot-options-v0 s1: typed goal and instrument go overseas, never audio; coach off under 15 | "On stage, nothing leaves this laptop. In a proposed pilot the cloud coach is off by default and for under-15s; any model input needs consent, and audio never goes to it." | Partly: A's Q11 already says stage data stays; the stage sentence implies a live cloud coach | Research and UX lead (see section 7) |
| 3. Feasibility, Q12 No internet or instrument | On-screen keys are the same fallback the stage uses | B condition 9 and menu O4: full on-screen loop is a SHOULD at the stand; headless Edge only, touch untested (stack-review-v1 s2, U11) | "Without a keyboard, on-screen keys run the loop; they have passed a headless-browser check only. We rehearse the full loop at the stand; touch use is untested." | Partly: the stage fallback holds (sheet B1); the untested loop is the new fact | Model and web lead (see section 7) |
| 4. What it takes to proceed, Q13 Pilot cost and funder | 12-week pilot, A$17,076 core, A$25,000 to A$49,500 all-in | B contradictions 3 and 4: 12 weeks fits no single 2027 term (customer-commitment-pack-v0 s5; term dates unverified); WWVP fee A$157 versus A$163 (reviewer-pool-feasibility-v0 s5); educator hours not in the totals | "Those are draft estimates and no funding is committed. Twelve weeks does not fit one 2027 school term, so the length may change; staffing, educator approval and safeguarding fees must be re-costed." | Confirmed | Research and UX lead (see section 7) |
| 6. Panel questions, Q33 Cost per active learner | A$342 per enrolled learner, 50 learners | Same B rows; reviewer-pool-feasibility-v0 s5 warns line 1 and supervisor rows may count the same hours twice | "A$342 is an earlier draft per enrolled learner. We will update it once pilot length, educator workload and safeguarding costs are settled." | Confirmed (A$342 is 17,076 divided by 50, rounded) | Research and UX lead |
| 4. What it takes to proceed, Q15 Teachers at the hand-off | Options: students, community musicians, university staff | B condition 8; reviewer-pool-feasibility-v0 s1: supervised university students, a music educator approves every reply; no university has agreed; Term 2 2027 at the earliest (dates unverified) | "We propose supervised university students, with a music educator approving every reply. No university has agreed; the earliest realistic start is Term 2 2027, after child-safety checks." | Confirmed | Research and UX lead (see section 7) |
| 5. The hard ones, Q17 Will AI replace teachers | Spoken: not shown to save teacher time; bullet: each hour goes further | reviewer-pool-feasibility-v0 s5: the approving educator is the bottleneck, about 6 h a week in the 150-learner stress case (Codex planning assumption, estimate); about 4 h at core (47.3 h over 12, my arithmetic) | "The pilot budgets paid human review. We have not shown it saves teacher time, and the approving educator's hours may limit how many hand-offs we can handle." | Partly: A's spoken line is already honest; only the "goes further" bullet is stale; hours are estimates | Research and UX lead |
| 6. Panel questions, Q28 Quality owner and referrals | To confirm with the sponsor; teacher check plus university mentors | B condition 8 and sheet row: educator approves each reply; provider and responsible officer must be named (reviewer-pool-feasibility-v0 s1, s3) | "We propose a music educator approves every reply. Before recruiting, the host university must name the Child Safe Standards provider, a responsible officer and who runs the reviewer service." | Confirmed | Research and UX lead (see section 7) |
| 6. Panel questions, Q29 Recruit next month | None confirmed; university supplies contacts | Sheet row: name the provider and officer "before any recruiting"; customer-commitment-pack-v0 s5: approvals take weeks, delivery realistically Term 2 | "No learners are confirmed, and none can join next month: approvals and child-safety checks take weeks. A named child-safety provider and responsible officer come before any recruiting." | Partly: Term 2 2027 is the reviewer-pool start, not a learner-recruitment date; the precondition holds | Research and UX lead (see section 7) |
| 6. Panel questions, Q38 Who decides a clip is safe | Guardian approval and logged links; reviewer still to be named | reviewer-pool-feasibility-v0 s1: Child Safe Standards cover music lessons and tutoring, so someone must be the provider | "Guardian approval governs sharing, but safeguarding also needs a named provider, a responsible officer and a process for harmful clips before a pilot." | Partly: A's spoken line already says the reviewer is unnamed; the bullet is the stale part | Research and UX lead (see section 7) |
| 6. Panel questions, Q40 Model accuracy and child safety | Final child-safety authority sits with the partner; not agreed | Same reviewer-pool rows: the host names provider and responsible officer before children take part | "The host must name the Child Safe Standards provider and responsible officer before children take part. We cannot assign authority to a partner who has not agreed." | Confirmed | Research and UX lead (see section 7) |

## 2. Questions the overnight makes likely that A does not prepare

| Question | Why (file and section) | Draft answer (under 40 words) | Owner |
|---|---|---|---|
| "Have you actually tried Mastery's retake loop?" | nearest-competitors-v1 s5 (three 10-minute checks not run); B section 6 experiment 4 | "Not yet. Its listing makes it our nearest comparison; we will run its retake flow before claiming a difference." | Research and UX lead |
| "How often does your chosen cue fail?" | prototype-review-v1 D1 (K3 fires in 797 of 2000 noisy placeholder trials, a team test); B condition 2. Likely only if the demo misfires | "A team test found the planned cue unreliable in noise, so we are re-testing it on the real rig and will change the demonstrated cue if it fails." | Model and web lead (see section 7) |
| "Who is legally responsible when students review children's clips?" | reviewer-pool-feasibility-v0 s1 (Child Safe Standards cover music lessons; provider unnamed); A Q38 covers only part | "No reviewer service is running. The host must name its child-safety provider and responsible officer; a music educator would approve each proposed student reply." | Research and UX lead (see section 7) |
| "How can twelve weeks fit a 2027 term?" | customer-commitment-pack-v0 s5 (each term is about ten school weeks); B contradiction 4 (no lean in the files) | "It does not fit one term as described. We would shorten it to about eight to ten weeks or span a holiday with the school's agreement, then re-cost." | Research and UX lead (see section 7) |
| "Does private practice isolate children from music with others?" | social-and-fear-evidence-v1 s5b (proposed Q46); B sheet rows SF1 and SF3; A has no entry | "Only if private practice were the whole programme. Practice starts alone; a learner can share with a supervised mentor, and outreach sessions add an opt-out group activity. We have not shown this raises confidence." | Research and UX lead (see section 7) |

## 3. Answers now stronger

| A question | Evidence to add (one line, file and section) |
|---|---|
| 6. Panel questions, Q25 Learn or just perform better | A next-day attempt before feedback, reported as a retention check, not causation; retake line "shows an immediate change" (uniqueness-evidence-v1 s5, "What the retake shows"; B condition 5) |
| 1. Customer value, Q2 Why would a university pay | Dan's offer is adviser interest, not buying authority; say it only with a letter, else the 25-word no-letter line (customer-commitment-pack-v0 s1, s6; B section 6 experiment 1) |
| 5. The hard ones, Q39 Outreach funding excludes music | The guidance names no school year and never mentions software or music, so eligibility needs written owner confirmation (age-band-evidence-v1 s4, pp2 to 4; B "What changed since 23:48") |

## 4. Bridge lines

| Line (A section 8) | Verdict | Fix (under 20 words) | Reason (file and section) |
|---|---|---|---|
| "Simone checked those numbers; Simone?" | Holds | Name the figure and its verification status before handing over. | Several figures stay unverified: B Sources 3 to 4; term dates and fee in B contradictions 3 and 4 |
| "Privacy was Simone's design brief; she can take that." | Misleads (wording) | "Simone owns the proposed consent route; the host must name the safeguarding officer." | B condition 3 and 8 give Simone the route; reviewer-pool-feasibility-v0 s1 leaves duties with the host |
| "Justin built that loop; Justin, what does the keyboard send?" | Misleads (wording) | "Justin, what does the keyboard send, and which rig checks remain?" | "Built" overstates: K3 and wrong-key defects are open (prototype-review-v1 D1, A2) |
| "That is the what-next question; Carlos?" | Holds | Name buyer, staffing and approval gaps directly; reviewer and safeguarding go to Simone. | B conditions 3, 8: Carlos sends asks; Simone owns the pool and slide 7 |
| "It is my record, so I will answer that one." | Holds | Keep the n = 1 limit and the failed-retake path in the answer. | B condition 5; A Q5 and Q6 |

## 5. Rehearse first on Sunday

- Rehearse Q16 with the Mastery follow-up: all three speakers name the nearest product, state the claimed difference, admit it is unrun.
- Why it is the biggest risk: B condition 7 fails if judges hear a better scorer, the checks are not run, and the sheet has not picked the 40-word or 39-word answer.
- File: nearest-competitors-v1 s0, s4 and success-conditions-v1 contradiction 11. (see section 7e)

## 6. Never say in Q and A

- Keep every never-say line already in A: Q11, Q13, Q16 and Q20 (do not restate them here).
- Keep the banned topics and the do-not-say lines in session-rules.md and COMMON-RULES.md, and the novelty-word rule.
- Overnight adds, all pointers:
  o reviewer-pool-feasibility-v0 s6 table: reviewer, placement, reply-time, "already checked" and moat wording.
  o nearest-competitors-v1 s4 rules: no claim that Mastery lacks human review; never imply that hearing the notes is the difference.
  o customer-commitment-pack-v0 s6: no customer wording for an adviser's interest.
  o ai-visibility-note-v0 s5: no "agentic" or "AI-powered" wording for the rule cue.
  o social-and-fear-evidence-v1 s5d: the never-say list on fear and private practice.

## 7. Panel member read, 7 Nov (Astra, verified)

- Source: GPT-6 Astra, high, read of sections 1 to 6 as file A and success-conditions-v1.md as file B (Codex, unverified).
- Verified here against B's real headings: "Ten weakest rows" and "State of play on waking" sit under "Panel chair read, 7 Nov".
- "Answerable" means B states the answer, even when the answer is "no" or "not run"; rewrites are proposals.

### 7a. Follow-up a hostile panel member asks next

| A row | Follow-up | Answerable from B (real heading) | Fallback if not | Verdict |
|---|---|---|---|---|
| Q1 learner | "Does the age ranking show learner need?" | By concession: "Ten weakest rows", Condition 1 | none needed | Confirmed |
| Q45 learners | "Is this a validated market?" | "State of play on waking": working audience, not validated | none needed | Confirmed |
| Q4 YouTube or Yousician | "Which difference survived testing against Mastery?" | No test run: "Ten weakest rows", Condition 7 | "We have not run Mastery." | Confirmed |
| Q16 prior art | "Have you tested the nearest competitor?" | Answer is no: "Ten weakest rows", Condition 7 | "Not yet; checks are planned." | Partly: Codex marked yes; B says not run |
| Q21 live parts | "What passed on the real rig after Saturday?" | No: "State of play on waking" | Report only checks confirmed by Wednesday | Confirmed |
| Q23 AI | "Was the saved call completed?" | No: "Proposed sheet rows" (A8, due Mon 14:00) | "Planned; completion unconfirmed." | Confirmed |
| Q26 improvement | "Did the wrong-key fix pass retesting?" | No: "Proposed sheet rows" (pass rule) and "State of play on waking" | "The fix is unconfirmed." | Confirmed |
| Q41 equipped | "Where is the contingency for fixes and rehearsal?" | Answer is none: "Ten weakest rows", Contradiction 6 | none needed | Partly: B concedes there is none |
| Q10 AI cost | "Is the cloud coach on for your target age?" | Yes, off: "Proposed sheet rows" (pilot model slot); age fact in age-band-evidence-v1 s1 | none needed | Confirmed |
| Q11 privacy | "Exactly what pilot data leaves the laptop?" | Not in B; model-slot-options-v0 s1, s6 (typed goal and instrument, not audio) | "The payload is not yet specified." | Partly: B silent |
| Q12 no instrument | "Is the full loop shown on the actual laptop?" | Answer is no: "Ten weakest rows", Condition 9 | "Untested." | Partly: Codex marked yes |
| Q13 pilot cost | "Are those term dates verified?" | No: "Contradictions for the morning", row 4 (unverified) | none needed | Confirmed |
| Q33 per active learner | "Where is the calculation for A$342?" | Not in B; business-case-v1 s3c via A; reviewer-pool-feasibility-v0 s5 quotes core A$17,076 | "From the 50-learner core estimate." | Partly: B silent, source exists |
| Q15 teachers | "Which university has agreed?" | None: "State of play on waking" | none needed | Confirmed |
| Q17 teachers | "What limits reviewer capacity?" | "Contradictions for the morning", row 7 (educator) | none needed | Confirmed |
| Q28 quality owner | "Who is the responsible officer?" | Unnamed: "Open questions" | "Not yet named." | Confirmed |
| Q29 recruit | "Does Term 2 limit recruiting or reviewer delivery?" | "What changed since 23:48" (reviewer-pool row): reviewer delivery | none needed | Confirmed |
| Q38 safe clip | "Who decides whether a harmful clip escalates?" | B silent; reviewer-pool-feasibility-v0 s4 not opened here | "Unsettled." | Partly: B silent |
| Q40 accuracy | "Has a teacher reviewed the cues?" | No, as of 7 Nov: "State of play on waking" | update after the Tuesday call | Confirmed |
| New: Mastery tried | "What would the checks establish?" | "6. Experiments before Wednesday, merged and ordered", row 4 | none needed | Confirmed |
| New: cue failure | "How often did it fire in the team test?" | "1. ONE PAGE", Condition 2; "Sources" item 4 (team test) | none needed | Confirmed |
| New: legal | "Who has accepted that responsibility?" | None: "Open questions" | "No provider is named." | Confirmed |
| New: twelve weeks | "Are the term dates verified?" | No: "Contradictions for the morning", row 4 | none needed | Confirmed |
| New: isolation | "What evidence rules out isolation?" | None: "1. ONE PAGE", Condition 10; "Proposed sheet rows" SF1 | "Not established." | Confirmed |

- Tally: 18 confirmed, 6 partly, 0 rejected.

### 7b. Overclaims and tone rewrites (proposals, each under 40 words)

| A rows | Problem | Verdict | Proposed rewrite |
|---|---|---|---|
| Q1, Q21, Q26 | "Sunday" and "Saturday" promises are past by Wednesday | Confirmed | "Our learner choice is provisional. For the rig checks and the pass-rule fix, we report only results confirmed by Wednesday and say plainly what is still untested." |
| Q4, Q16 | Hand-off sounded operational; B adds "unrun" | Partly: overnight file nearest-competitors-v1 s1.1 does carry Mastery's features | "Mastery is our nearest known product; it offers re-analysis and review by link, and we have not run it. The combination is our claimed difference, still to be checked; our teacher hand-off is proposed." |
| Q10 | "Cost depends on consent" sounds decisive | Partly: the usage mismatch is in model-slot-options-v0 s3, not B | "These remain estimates. For our proposed learner age, the cloud coach is off by default; pilot costs are mostly staffing and educator approval." |
| Q11 | "Audio never goes to it" needs scope | Partly: supported by model-slot-options-v0 s1, s6, not B | "On stage, nothing leaves this laptop. In the proposed pilot the cloud coach is off for under-15s; a typed goal and instrument would go overseas only with consent, and audio is not sent to the model." |
| Q12 | "On-screen keys run the loop" outruns a headless check | Confirmed | "On-screen keys have passed a headless-browser check. We still need to show the full loop on the actual laptop; touch use is untested." |
| Q13, Q15, new twelve weeks | "2027 school term" stated as fact; dates unverified | Confirmed | "The term dates remain unverified. Pilot length is undecided; the reviewer pool is proposed for Term 2 2027 at the earliest, with no university agreement." |
| Q33 | Codex: drop the A$342 answer | Rejected: over-concession; A$342 is the 50-learner core estimate and A already refuses a per-active figure | keep section 1 wording |
| Q29 | "None can join next month" is an absolute | Confirmed | "We cannot promise recruitment next month. The host must first name the child-safety provider and responsible officer; approvals remain necessary." |
| New: isolation | "Only if" dismisses a parent's concern | Partly: Codex wrote "optional"; B sheet SF1 says opt-out ensemble | "That concern is fair and still open. We propose individual practice, a consented mentor share and an opt-out group activity. We have not shown this reduces fear or prevents isolation." |
| Q28, Q38, new legal | Indirect and institutional for a parent | Partly: "guardian approval" comes from A, not B, and stays | "We cannot yet name who would take responsibility for children's safety. Before recruiting, the host must name the provider and responsible officer. We propose educator approval of every student reply." |
| Q40 | Cold, avoids accuracy | Confirmed; update after the Tuesday teacher call | "No teacher has yet reviewed our cues. Before children take part, the host must name who is responsible for child safety; we propose that an educator approves every student reply." |
| New: cue failure | Section 2 draft evades the frequency | Confirmed | "In a team test on placeholder takes the planned cue fired in about 40% of noisy trials, so it is unreliable. We are re-testing on the real rig and will change the cue if it fails." |

- The 40% figure is prototype-review-v1 D1 (797 of 2000 trials, team test, unverified on the rig).
- Rewrites 5 confirmed, 5 partly, 1 rejected, plus the cue-failure rewrite folded.

### 7c. Five answers most likely to lose a point

| Rank | A answer | Verdict | Reason |
|---|---|---|---|
| 1 | Q26 improvement | Confirmed | Admits false passes but leans on a Saturday deadline that is past by Wednesday |
| 2 | Cue failure (new) | Confirmed | Draft evaded the frequency B gives as a team test; rig reliability unknown |
| 3 | Q4 YouTube or Yousician | Partly | My replacement already says "not run"; the hand-off needs "proposed" |
| 4 | Isolation (new) | Confirmed | Dismissive tone and proposals read as delivery |
| 5 | Q10 AI cost | Partly | Consent wording blurred that the cloud coach is off for the proposed age |

### 7d. Never-say changes

| Item | Verdict | Reason |
|---|---|---|
| "The retake proves learning or causation" | Add | B supports an immediate change and a proposed next-day check only |
| "Term dates verified"; "funding eligibility confirmed" | Add | Dates unverified (B contradiction 4); eligibility needs written confirmation |
| "Touch works"; "the full loop is proven" | Add | Headless check only (stack-review-v1 via B condition 9) |
| "The build plan has spare capacity" | Add | MUST hours equal capacity; the rig lead is over (B contradiction 6) |
| Reviewer and three-working-day wording | Keep, with "proposed" and "not guaranteed" | reviewer-pool-feasibility-v0 s6 |
| "Already checked" | Keep as never-say | Codex misread it as prototype checks; it concerns reviewers' child-safety checks (reviewer-pool-feasibility-v0 s6 table) |
| Unquoted bans in referenced files | No change | Pointers by design; Codex could not see them |

### 7e. Readiness verdict

- Not ready unchanged: replace elapsed deadlines with confirmed results or plain unknowns, keep term dates marked unverified, separate proposals from delivery.
- "Rehearse first on Sunday" stays the Mastery answer (Q16); add a second drill, cue frequency and the wrong-key answer, once Saturday's rig results exist.

## Method

- Change note, Sat 7 Nov: folded the Astra panel read (qa-panel-answer.md, Codex, unverified).
  o Folded: 24 follow-ups (18 confirmed, 6 partly), 7b rewrites, five-answer ranking, five never-say adds.
  o Rejected: the A$342 rewrite (over-concession) and the "already checked" verdict (misread of reviewer checks).
  o Corrected: two yes answers that B states as no (Q16, Q12); "optional" group activity changed to opt-out.
  o Sections 1 to 6 unchanged except "(see section 7)" markers.
- Rows confirmed (10): Q1, Q45, Q4, Q16, Q41, Q13, Q33, Q15, Q28, Q40.
- Rows partly (9), with the detail that differs:
  o Q21 (A is conditional, not settled), Q23 (direction holds, the call is still owed), Q26 (A claims timing only).
  o Q10 (cost models not reconciled), Q11 (stage sentence only), Q12 (the stage fallback holds).
  o Q17 (spoken line already honest; hours are estimates), Q29 (Term 2 is the reviewer start), Q38 (spoken line already says unnamed).
- Rows rejected (0): none misread A or B outright. Corrections made without rejecting:
  o Codex cited the wrong B sections for Q39, Q15 and Q29 evidence ("Contradictions" or "ONE PAGE"); the facts sit in "What changed since 23:48" and the cited overnight files.
  o Codex's "Year 7 to 9 as fallback" and "K3 40%" were confirmed; the D1 table gives 44% against 797 of 2000 on the new file.
  o Bridge verdicts: Codex's "misleads" for the Simone and Justin lines softened to wording problems, since B gives both those roles.
- Figures stripped from Codex replacements: none were added; model-slot US$48.30 and the A$18 and A$48 fee differences stay in the files, not in answers.
- Files opened 2026-11-07, all local, status "opened":
  o qa-prep-v1.md (whole file); success-conditions-v1.md (whole file); session-rules.md; COMMON-RULES.md (scratchpad copy); README.md (rows 118 to 135).
  o The Codex comparison (scratchpad mt/ea/qa-stale-answer.md): whole file, treated as claims.
  o nearest-competitors-v1.md s0, s1.1, s4, s5; uniqueness-evidence-v1.md s5 and "What the retake shows"; age-band-evidence-v1.md s1, s4.
  o reviewer-pool-feasibility-v0.md s1, s5, s6; customer-commitment-pack-v0.md s5; model-slot-options-v0.md s1, s3, s6, s7.
  o prototype-review-v1.md D1, D11, A2, the retest note; social-and-fear-evidence-v1.md s1, s5a to s5c; feature-feasibility-menu-v1.md O4 rows.
- Not opened: stack-review-v1.md (quoted through B), business-case files (quoted through A), and every web page (no browsing).

## Open questions

- Which Mastery answer does the team rehearse, the 40-word or the 39-word one (B sheet row, no rung decides)?
- Does the team accept Year 5 to 6 on Sunday, so Q1 and Q45 can change?
- Who is the host's Child Safe Standards provider and responsible officer?
- Add a free-assistant answer: B condition 4 names the question, and A has no entry (assistant benchmark is a SHOULD).
- Codex's other gaps in B's open list: which outreach outcome justifies buying; which browser and device pairs are proven.
- Is the cue-failure question worth rehearsing, or only if Saturday's capture goes badly?

## Sources

1. qa-prep-v1.md (file A): sections 1 to 8. Local, opened 2026-11-07.
2. success-conditions-v1.md (file B): sections 1, 2, "What changed since 23:48", "Proposed sheet rows", "Contradictions for the morning", section 6, "State of play on waking", Sources. Local, opened 2026-11-07.
3. Overnight files by section as listed in Method. Local, opened 2026-11-07.
4. Codex comparison, GPT-6 Sol, medium (scratchpad mt/ea/qa-stale-answer.md). Unverified; person names removed in its text.
5. URLs copied from the files, with those files' marks (not re-opened here):
  o Outreach Funding Guidance: https://www.education.gov.au/download/20042/outreach-funding-guidance/44110/document/pdf , accessed 2026-11-06, opened (age-band-evidence-v1 [1]).
  o ACT Child Safe Standards: https://www.hrc.act.gov.au/childrenyoungpeople/act-child-safe-standards/about-the-standards/who-do-the-standards-apply-to , accessed 2026-11-07, opened (reviewer-pool-feasibility-v0 [17]).
  o WWVP fee A$163: https://www.accesscanberra.act.gov.au/business-and-work/working-with-vulnerable-people/apply-for-or-renew-a-wwvp-registration , accessed 2026-11-06, opened (reviewer-pool-feasibility-v0 [1]).
  o Mastery listing: https://apps.apple.com/us/app/mastery-ai-audio-coach/id6759849550 , accessed 2026-11-07, opened (nearest-competitors-v1 s1).
