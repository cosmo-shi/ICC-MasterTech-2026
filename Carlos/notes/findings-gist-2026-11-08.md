# Findings gist: what the 7 Nov work found, and why it points to the merged flowchart

Written 2026-11-08 by the session for Carlos, from the folder's own files.

This is the gist of the overnight research run of 6 to 7 Nov and the Saturday morning session, for Carlos, Simone and Justin to read at the hub desk on Sunday night before Monday's 8 am session.

How to read it: the one page gist comes first; sections 1 to 4 give the findings, the Saturday changes, why the merged flowchart follows, and what is still open. Everything is a proposal until the team decides.

## 0. One page gist (conclusion first)

- **No score is the strongest idea.**
  o All 27 compared products show a score (nearest-competitors-v1 s0).
  o Ours shows one fix and the retake change (morning-notes s3 rank 1).
  o Claim the combination plus the outreach route, never features alone (uniqueness-evidence-v1 s0, s3).
- **Fear is real; our cure is untested.**
  o Beginners fear being heard and judged (social-and-fear-evidence-v1 E1, E4).
  o No study shows private app practice lowers that fear (social-and-fear-evidence-v1 s1).
- **The build was already at capacity.**
  o MUST hours equal realistic capacity, and the rig lead is over (feature-feasibility-menu-v1 s1, s4).
  o The spec adds 77 prototype rows (spec-review-v0 s3).
- **The stage loop had two known faults.**
  o Cue K3 holds in 40 percent of noisy trials (prototype-review-v1 D1).
  o One wrong key passes (prototype-review-v1 A2).
- **The pilot ask is weaker than the pitch says.**
  o Adviser interest only, no teacher review, no university agreed (success-conditions-v1 s1 condition 3).
  o No reviewer pool before Term 2 2027 (success-conditions-v1 s1 condition 3).
- **Money and channel point to outreach.**
  o Sponsors hold 2026 Outreach Funding (business-case-v0 s0).
  o The ACT Instrumental Music Program is the proposed pilot channel (morning-notes s2, s10).
- **The age band is still open.**
  o Year 5 to 6 leads Year 7 to 9 by 12 to 9, narrowly (age-band-evidence-v1 s1).
  o The spec says Years 3 to 8 (spec-review-v0 s2).
- **Saturday made design rules; Sunday made one frame.**
  o Rules decide, the model explains; a practice session, not a chat (morning-notes s7, s8).
  o Spec as frame, coach as engine (sunday-notes s0).

## 1. What the 7 Nov work found

### (a) The learner and the fear evidence

- Fear ties to being heard and judged.
  o Calmer learners report teacher feedback and self-efficacy (social-and-fear-evidence-v1 E1).
- Children feel anxiety in lessons.
  o Some do not raise it with their teacher (social-and-fear-evidence-v1 E4).
- Feedback on the task beats praise and rewards.
  o This is the basis for the one-fix card (social-and-fear-evidence-v1 E11).
- Proposed stance: individual practice first.
  o Mentor sharing only with consent (social-and-fear-evidence-v1 s1, SF1).
  o Say "fear reduction untested" (success-conditions-v1 condition 10).

| Figure | Value | Folder source | URL, accessed | Mark |
|---|---|---|---|---|
| Children aged 9 to 12 reporting anxiety | Nearly half, in one study cited by a 9-study review | social-and-fear-evidence-v1 E4, ref 3 | https://pmc.ncbi.nlm.nih.gov/articles/PMC10426800/ , 2026-11-06 | opened |
| Feedback effect size | 0.79 average over 196 studies | social-and-fear-evidence-v1 E11, ref 12 | https://www.uky.edu/~gmswan3/575/Hattie_Timperly_2007.pdf , 2026-11-06 | snippet, unverified |

### (b) Competitors and the empty square

- Every one of the 27 products scores.
  o Ratings, a gradebook goal, an overall score (nearest-competitors-v1 s0, rows 25, 55, 71).
- Nearest product: Mastery: AI Audio Coach.
  o The team has not run it (nearest-competitors-v1 s0, s5).
- On-screen keys and goals are not the claim.
  o Many apps have both (idea-bank-v1 D1, s3).
- Two stage sentences stand; the team picks one.
  o uniqueness-evidence-v1 s5, 19 words, ends "then passes you to a teacher".
  o The recommended 20 words end "then prepares your clip for a teacher" (success-conditions-v1 Bottom line).

| Figure | Value | Folder source | URL, accessed | Mark |
|---|---|---|---|---|
| Products compared | 27, all show a score | nearest-competitors-v1 s0 | per-product URLs in that file | team count, not re-opened |
| Need no instrument | 15 of 27 | idea-bank-v1 D1 | none | team count |
| Take a learner goal | 6 of 27 | idea-bank-v1 s3 | none | team count |

### (c) The build and the stage

- MUST hours fill capacity; the rig lead is over.
  o The plan closes only with the skeleton credit plus cut 2 (build-day-reconciliation-v0).
- The skeleton never ran in real Chrome or with a keyboard.
  o It passed its self-test in Edge only (overnight-digest s2a).
- Cue K3 is fragile.
  o K1 is the robust fallback (prototype-review-v1 D1).
- A wrong key can pass.
  o The fix is a zero-wrong-key pass rule (prototype-review-v1 A2).
- Stage input: laptop plus USB MIDI keyboard.
  o On-screen keys are the fallback (sheet A3).
  o Nobody had secured a keyboard (sheet A3).
- Demo phrase: two files disagree.
  o The digest lists three options open (overnight-digest s1).
  o merged-flowchart-v0 diagram 5 draws Ode to Joy bars 1 and 2.
- Stage build: localhost or file://, still open.
  o One HTML file on localhost; the skeleton README says double-click file:// (RESUME contradictions).
- Saturday build results are not recorded.
  o Whether the build start and 12:00 contract freeze happened is unknown (RESUME midday state).

| Figure | Value | Folder source | URL, accessed | Mark |
|---|---|---|---|---|
| MUST hours, with E2 | 35.5 h (34.5 h without) | feature-feasibility-menu-v1 s1 | none | team estimate |
| Realistic capacity | 34.5 h: rig 12.75, model and web 12.4, research and UX 9.4 | feature-feasibility-menu-v1 capacity table | none | team estimate |
| Spec prototype rows | 77 marked P | spec-review-v0 s3 | none | team count |
| K3 cue holds | 797 of 2,000 noisy trials (40 percent) | prototype-review-v1 D1 | none | team test, placeholder data |
| Wrong-key case | F#4 for G4 at note 4 passes, 7 of 8 | prototype-review-v1 A2 | none | team test |
| USB MIDI keyboard price | About A$90 to A$130 | demo-instrument-decision (from tech-keyboard-input s3) | not carried over | unverified |

### (d) The pilot, the buyer and the money

- Outreach Funding replaced HEPPP.
  o It builds aspiration, never recruitment (business-case-v0 S1, S3).
  o It is allocated by formula (business-case-v0 lines 110, 121).
- Proposed framing: a home-practice companion inside the ACT program.
  o The buyer shift is a team call (morning-notes s2).
- Dan is adviser interest, not a customer.
  o He puts himself "under" the customer (customer-commitment-pack-v0 s1, s6).
- No teacher review and no university agreed.
  o The approving educator is the bottleneck (reviewer-pool-feasibility-v0 s1, s5).
- Twelve weeks is unlikely to fit.
  o Likely 8 to 10 weeks, or spanning a holiday (customer-commitment-pack-v0 s5).
  o 2027 term dates are unverified (customer-commitment-pack-v0 s5).

| Figure | Value | Folder source | URL, accessed | Mark |
|---|---|---|---|---|
| 2026 Outreach Funding | UC $384,182; Flinders $902,208; La Trobe $1,419,938 | business-case-v0 S7 | https://app.heims.education.gov.au/HeimsOnline/IPInfo/Determination/Download/6602 , 2026-11-06 | opened |
| HEPPP end | 1 Jan 2026 | business-case-v0 S1 | https://www.education.gov.au/heppp , 2026-11-06 | opened |
| Outreach rules | Aspiration, not recruitment | business-case-v0 S3 | https://www.education.gov.au/download/20042/outreach-funding-guidance/44110/document/pdf , 2026-11-06 | opened |
| ACT program schools | 57 primary, 8 secondary (2024) | free-programs-partner-map row 22, ref 9 | https://www.act.gov.au/our-canberra/latest-news/2024/may/instrumental-music-program-welcomes-new-principal , 2026-11-06 | snippet |
| ACT program entry and journal | Years 5 and 6, daily practice journal | free-programs-partner-map ref 21 | https://www.imp.act.edu.au/our_schools/impact_band_year_5_and_6 , 2026-11-07 | opened |
| Directorate approval | About 10 weeks (a second page says four) | customer-commitment-pack-v0 s5, refs 4 and 5 | https://www.act.gov.au/education-and-training/supporting-education-in-the-act/apply-to-do-research-in-act-public-schools , 2026-11-07 | opened; four weeks is snippet |
| Core pilot cost | A$17,076 for 50 learners | business-case-v1 s3c | none | team estimate, never on stage |
| Educator approval load | About 6 h a week | reviewer-pool-feasibility-v0 s5 | none | team estimate |

### (e) Privacy and child safety

- "Only numbers go to the cloud" was false.
  o The typed goal and words reach the model too (privacy-design-v1 s1, s6).
- Under-15 learners need a guardian at every share.
  o The guardian sets up and taps each share (privacy-design-v1 s3.1).
  o The spec bands start at under 13 (spec-review-v0 s5).
- A Child Safe provider and officer must be named.
  o The ACT Child Safe Standards require a provider and responsible officer (reviewer-pool-feasibility-v0 s1, s3).
- The WWVP fee is a decision for Carlos.
  o A$163 opened against A$157 in the cost lines (success-conditions-v1 contradiction 3).

| Figure | Value | Folder source | URL, accessed | Mark |
|---|---|---|---|---|
| Capacity presumption | 15, fallback when case-by-case is impracticable | privacy-design-v1 C18, ref 8 | https://www.oaic.gov.au/privacy/australian-privacy-principles/australian-privacy-principles-guidelines/chapter-b-key-concepts , 2026-11-06 | opened |
| Automated-decision disclosure | From 10 Dec 2026 | privacy-design-v1 C16, ref 18 | https://www.oaic.gov.au/engage-with-us/consultations/consultation-on-guidance-for-transparency-in-automated-decision-making , 2026-11-06 | opened; scope under consultation |
| Child Safe Standards | Since 1 Aug 2024, tutoring included | reviewer-pool-feasibility-v0 ref 17 | https://www.hrc.act.gov.au/childrenyoungpeople/act-child-safe-standards/about-the-standards/who-do-the-standards-apply-to , 2026-11-07 | opened |
| WWVP check time | About 8 weeks on average | reviewer-pool-feasibility-v0 ref 1 | https://www.accesscanberra.act.gov.au/business-and-work/working-with-vulnerable-people/apply-for-or-renew-a-wwvp-registration , 2026-11-06 | opened |
| WWVP paid fee | A$163 (A$157 in business-case-v1 line 8) | success-conditions-v1 contradiction 3 | same, 2026-11-06 | A$163 opened; A$157 has no URL in the table |

### (f) The age band question

- The evidence leans Year 5 to 6, narrowly.
  o 12 to 9 against Year 7 to 9 (age-band-evidence-v1 s1).
  o The margin rests on delivery rather than learning (age-band-evidence-v1 s1).
- Year 7 to 9 buys no lighter consent.
  o Every on-time student starts the year under 15 (age-band-evidence-v1 s1).
- Files disagree on the band.
  o Sheet A4 says Year 7 to 9; the spec Years 3 to 8; the ACT program Years 5 and 6.
- Panel chair read: Year 5 to 6, Simone confirms.
  o Draft Year 5 to 6 copy and 8 keys (success-conditions-v1 Panel chair read).

| Figure | Value | Folder source | URL, accessed | Mark |
|---|---|---|---|---|
| Band score | Year 5 to 6: 12; Year 7 to 9: 9 | age-band-evidence-v1 s1 | none | team scoring; RESUME words it "12 of 18 criteria" |
| Canberra remoteness class | Probably "Major Cities" | age-band-evidence-v1 ref 14 | https://www.abs.gov.au/AUSSTATS/abs@.nsf/Latestproducts/1270.0.55.005Main%20Features15July%202016 , 2026-11-06 | snippet; class not stated in it |

## 2. What changed on Saturday morning

- **Judging format (team report, to confirm):** depth at the desk.
  o Desk conversations Mon 9 to Wed 11 carry the depth (morning-notes s0, s1).
  o The pitch is a general vision show (morning-notes s0).
- **Idea verdict:** sharpen, do not pivot.
  o Good as a challenge entry, weak as a standalone app (morning-notes s2).
- **Stand-out ideas, ranked:** six, led by no score.
  o One fix and no score; the retake card; knowing when to stop (morning-notes s3).
  o Nothing leaves unless sent; teacher cue book; goal in own words (morning-notes s3).
- **No-score rule:** no number, grade, star or pass.
  o Applies to every take on the learner screen (morning-notes s3; sunday-notes s3).
  o Counts move to the teacher view and the stored attempt (sunday-notes s3).
- **Copyright line:** like a tuner, reproduce nothing.
  o The coach analyses playing and reproduces nothing (morning-notes s4; legal lines unverified).
  o Stage phrases are public domain or team-written (morning-notes s4).
- **Plain words and voice:** glossary answers, recorded lines.
  o Glossary answers plus a ten-second task (morning-notes s5).
  o Recorded human lines on stage (morning-notes s6).
- **Practice-session UI:** a practice session, not a chat.
  o Phone-first concept, responsive web prototype (morning-notes s7).
  o No bubbles, text box or persona (morning-notes s7).
- **Rules decide, the model explains.**
  o Rules choose the fix; a router sends pain to a person (morning-notes s8).
  o A validator checks wording (morning-notes s8).
  o Rules fixed between releases, learner state changes per take, model stateless (morning-notes s9).
- **Sponsor fit:** Outreach Funding and pre-service teacher mentors.
  o Outreach Funding pays; pre-service teachers act as mentors (morning-notes s10).
  o Whether music counts as aspiration-building is open (morning-notes s10).
- **Cisco:** no music technology.
  o Webex Music mode fits the mentor call (morning-notes s11).

## 3. Why the merged flowchart follows from this

| Diagram (merged-flowchart-v0) | What it draws | Findings that justify it |
|---|---|---|
| 1 Product map | Spec modules as the frame; coach inside ASM, AIC, HNT, PRG; three inputs, one checker; guitar dropped | Spec is the master (spec-review-v0 s0); on-screen keys no differentiator (1b); guitar on glass does not transfer (sunday-notes s2) |
| 2 Session loop | Goal, one take, one fix, retake, stop rule, hand-off on send | Fear and task feedback (1a); no-score rule and stand-outs 1 to 3 (2); practice UI (morning-notes s7) |
| 3 Engine | Rules decide, model explains, validator, offline fallback, cue book | K3 and wrong-key faults need fixed rules (1c); under-15 cloud off (1e); morning-notes s8, s9 |
| 4 Data flow | Practice record stays; summary leaves on send; packet de-identified | "Only numbers" was false (1e); practice record (sunday-notes s4, s5) |
| 5 Stage versus desk | Laptop and MIDI keyboard on stage with a saved labelled call; phone at the desk | Judging at the desk (2); capacity and stage faults (1c); keyboard unsecured (1c) |

| Team call (spec-review-v0 s2) | Spec says | Overnight files say | Proposed call |
|---|---|---|---|
| 1 Input | Touch on a phone; MIDI out of scope | Laptop plus USB MIDI keyboard on stage | Touch for phones; MIDI stays the stage input as a bonus row |
| 2 Counts | Counts out of total on results | One fix, never a score | Evidence and one fix for the learner; counts kept for the teacher view |
| 3 Buyer | Generalist classroom teacher, Years 3 to 8 | Sponsor outreach team, ACT program home practice | Spec framing as the vision; ACT program as pilot channel; Outreach Funding as money |
| 4 Coach look (smaller) | Message thread with typed answers | Practice session, not a chat | Tap answers on the fix card; typed text as fallback |

## 4. What is still open for the team tonight

| Item | State in the folder | Who decides |
|---|---|---|
| Team calls 1 to 4 | Proposed; Carlos agreed in chat 13:05, team not yet (sunday-notes s0) | All three |
| Age band | Year 5 to 6 lean; Year 7 to 9 on sheet A4; Years 3 to 8 in the spec | Simone confirms, team agrees |
| MIDI keyboard owner | Nobody secured one (questions-for-sponsor row 42; sheet A3) | Team |
| Saturday asks | Dan message, teacher email via John and Frank, outreach introduction via Frank; sending not recorded | Carlos |
| GitHub invites | Simone invited 8 Nov 19:58, pending; Justin not invited, username unknown | Carlos (team-github-setup) |
| Saturday build results | Start and contract freeze not recorded | Ask Carlos |
| WWVP fee and stage sentence | A$163 or A$157; 19 or 20 words | Carlos; team |

Suggested order tonight (spec-review-v0 s6, plus the open rows above):

1. Make the three team calls, then the smaller coach-look call.
2. Settle the age band, so copy and key count follow.
3. Strike every spec row not in the proposed stage set of about 18.
4. Name the stage laptop and one phone as reference devices, and the keyboard owner.
5. Send Justin's GitHub username to Carlos; Simone accepts her invite.

## Method

- Collated by the session on 2026-11-08 from the files listed below; no web search, Codex, local model or bus.
- Large overnight files were searched for single figures, URLs and access dates only, not reread.
- Team counts, estimates and tests carry no URL by nature; they are labelled as such.
- Where files disagree, both sides are named and left for the team (success-conditions-v1 Contradictions for the morning).

## Open questions

- Did the Saturday build run, and did the K3 capture and zero-wrong-key rule land before the freeze?
- Were the Saturday asks sent, and has anyone replied?
- Which demo phrase is final: the digest's three options or merged-flowchart-v0's Ode to Joy bars 1 and 2?
- Does the organiser confirm desk judging and no Q and A after the pitch (questions-for-sponsor row 46)?
- Who owns the spec, and who redraws its data-flow page from diagram 4?

## Sources

- session-rules.md, RESUME.md lines 1 to 44, opened 2026-11-08.
- success-conditions-v1.md (Bottom line, ONE PAGE, Contradictions for the morning, s7, Panel chair read), opened 2026-11-08.
- overnight-digest-for-team.md, morning-notes-2026-11-07.md, sunday-notes-2026-11-08.md, opened 2026-11-08.
- spec-review-v0.md s0 to s6, merged-flowchart-v0.md, team-github-setup.md, opened 2026-11-08.
- Figure lookups only, opened 2026-11-08: social-and-fear-evidence-v1, business-case-v0, free-programs-partner-map, reviewer-pool-feasibility-v0.
  o Also customer-commitment-pack-v0, privacy-design-v1, age-band-evidence-v1, prototype-review-v1, feature-feasibility-menu-v1, demo-instrument-decision, sunday-decisions-sheet row A3.
