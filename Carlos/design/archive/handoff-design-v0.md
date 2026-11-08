# Hand-off design v0: from the coach to a human teacher

- Date: Fri 6 Nov 2026 (AEDT), overnight. Purpose: the end-to-end teacher hand-off (R10), mockable in a day, sayable in 30 seconds.
- Recommendation: offer a teacher at the third miss on one cause; share one clip plus the fix list; one reply, no chat.
  o Pilot supply: supervised pre-service teachers from a sponsor's arts unit, run through the outreach programme.
- Scope: triggers, learner card, teacher brief, supply models, child safety, metrics, mock, stage lines. Privacy rules live in privacy-design-v0.md and are obeyed here, not repeated.
- Status: overnight draft for the team; verify before the pitch. Child-safety law notes are risk triage, not legal advice. Unverified items are marked `unverified`.

## 1. Recommendation (conclusion first)
- Trigger: the miss 1/2/3 rule from tech-feedback-layer.md section 3; miss 3 on one cause = hand-off offer.
  o Plus four more ceilings (tired twice, a `ceiling` rule, learner asks, needs eyes); set-up problems never hand off.
- Card: one 10 to 30 second clip, the goal sentence, the fixes tried with before-and-after; no name, no contact details.
- Teacher: one screen, under five minutes; replies with a voice note, one written cue, or a lesson offer.
  o A written cue becomes the next cue in the app, so the retake proof measures the teacher's fix too.
- Supply for a 12-week pilot: pre-service teachers in UC 9885, Flinders EDUC2338 or La Trobe EDU3009, every reply checked by a qualified supervisor.
  o Gives the future teacher real music practice: 58% of surveyed universities say students never see a music lesson on practicum (state-of-play s5).
- Safety: checked adults only, same state as the learner in the pilot, guardian loop under 15, one reply per case, a share log.
- Pitch fix: the pitch-v0.md card says "Next is hand position"; audio cannot show hands. Use an audio ceiling on stage (section 9).

## 2. Trigger table (ceiling signals)
- Rule source: tech-feedback-layer.md section 3 persistence machine (miss 1 same cue; miss 2 easier step; miss 3 hand-off) and its HAND-OFF prompt clause.
- `cue.ceiling = true` (build-plan data model) is set by any row below; the card opens from that flag.

| # | Ceiling signal | Threshold | What the app says (plain words) |
|---|---|---|---|
| T1 | Same cause, no pass | Miss 3 on one cause: three failed retakes; resets on a pass; carries into the next session | "We've tried this three times. A teacher can hear what's getting in the way." |
| T2 | Tired voice keeps coming back | V1 fires in 2 sessions (tech file) | "Your voice tired early twice this week. A teacher can check how you're using it." |
| T3 | Technique beyond a cue | A rule marked `ceiling` fires; e.g. V2 above range while the learner keeps the original key | "This note needs more than one tip. A teacher can show you how to build up to it." |
| T4 | Learner asks or gives up | Learner taps "Ask a teacher" or says "I can't do this" (R2 words) | "Good call. A person can find you a smaller first step." |
| T5 | Needs eyes, not ears | Learner words mention hands, posture or how the instrument is held (R2) | "I can't see that from a recording. A teacher can look with you in a lesson." |
| T6 | Pain or strain (safety stop, not a hand-off) | Learner words mention pain, hoarseness or hurt | "Stop for today and tell an adult you trust. If it still hurts, see a doctor." |
| - | Never a hand-off | M1 (cannot hear), M2 (device delay); a first or second miss under T1 alone | Set-up fix or the easier step instead |

- Precedence: T6 beats all; T2 to T5 fire on any take, even before miss 3; T1 fires only at miss 3.
- T5 answer is a lesson offer: an audio clip cannot settle a visual question.
- T6 is a stop: no audio rule can detect pain; the app only reacts to what the learner says. Health advice is out of scope.
- Conflict to settle: build-plan-v0.md section 7 says "same cue fired three sessions in a row"; this file follows the tech file (miss 3), as briefed.

## 3. Learner hand-off card
### Fields (top to bottom)
| Field | Content | Source table |
|---|---|---|
| Heading | "A teacher can help with this part" | trigger row |
| Why | The plain-words line from section 2 | cue.cause_text |
| Your goal | The learner's own goal sentence | goal.text |
| What we tried | Up to three cues, each with before and after ("wobbles 24 to 18") | cue, feature_set |
| Your clip | 10 to 30 s, picked on the phone; play button; "trim" handles | take.audio_blob (local) |
| Teacher type | Only types live in this area; pilot shows one: "Student teacher, checked and supervised" | config |
| What happens next | "A checked teacher usually replies here within 2 days. No chat, no phone numbers." | fixed text (2 days = pilot target) |
| Buttons | [Send to a teacher] [Not now, keep practising] | - |

### Consent wording (51 words with buttons)
- "Send this 20-second clip, your goal and the fixes we tried to one checked teacher? They will not see your name or contact details. The link stops working after 7 days, or sooner if you cancel. You can ask us to delete it any time. [Send to a teacher] [Not now]"
  o 7 days = the privacy-design-v0.md proposed link expiry; change both files together if the team changes it.
  o Under 15: the card says "Ask your parent or carer to say yes" and the share waits for the guardian's tap (privacy-design s3).
- Per-recording opt-in; nothing leaves the phone before the tap (privacy-design s1, R11).
- Card tip: "Don't say your name in the clip." A clip or goal can still identify someone; the supervisor rejects cases that do.

### What is shared, what is not
| Shared (this case only) | Never shared |
|---|---|
| One clip, goal sentence, cues tried with before-and-after, instrument, age band, case ID | Name, email, phone, school, suburb or town, other takes, account ID, progress history (state is shared only for the check rule) |

### After sending
- Status line on the card: Sent, Teacher listening, Reply ready.
- No reply in 48 hours: the case passes to the supervisor's queue; still none at day 7: the link expires and the learner is told.
- "Cancel sharing" button stays on the card: kills the link, deletes the cloud copy, logs it.
  o Honest limit (privacy-design s1): cannot undo a listen that already happened.
- "Not now" keeps the clip on the phone and drops back to an easier small goal (tech file HAND-OFF clause: next_goal_hint).

## 4. Teacher one-screen brief and three replies
### The brief (one screen, no scrolling on a laptop)
| Block | Content |
|---|---|
| Header | Case ID, instrument, age band, state, "expires in N days" |
| Goal | Learner's goal sentence |
| Why the coach stopped | Trigger row in plain words (e.g. "Same cause, third miss: pushing on the high note") |
| Clip | 10 to 30 s player; streamed, no download button |
| Fixes tried | Each cue with its before-and-after numbers |
| Ask | "What is the one next thing?" |
| Reply | Three buttons below |

- No learner name, contact details or other takes; teacher signs in (privacy-design s1: bearer links are weak).
- Target: under 5 minutes per case (assumption; measure it).

### Three replies and the return path
| Reply | Limit | What the learner gets | Return into the app |
|---|---|---|---|
| Voice note | 30 s, one take | Plays on the card under "Teacher tip" | Next small goal opens with the same phrase; retake proof runs as normal |
| One written cue | One sentence, external focus (tech file style) | Shown as the next cue, tagged "from your teacher" | Stored as a cue with source = teacher; the retake shows whether the next take improved (not proof the cue caused it), and the teacher sees "improved / not yet" |
| Lesson offer | Programme booking only | "Your teacher suggests a lesson. Your coordinator will contact your parent or carer." | Case closes in the app; booking goes through the programme, never the teacher's own details |

- One reply per case; no thread. A new case needs a new ceiling and a new consent.
- Pilot: the supervisor approves each reply, voice notes included, before release (adds about a minute; assumption).
  o Reject if a reply: asks for identifying details, suggests contact outside the app, or tells the learner to push through pain.
- Closing the loop for the teacher: one line back ("their retake went from 18 to 9 wobbles") is the reward and the quality check.

## 5. Teacher supply models
### Working-with-children checks (verified 6 Nov 2026; risk triage)
| State | Scheme | Does online or written contact count? | Volunteer fee | Paid fee | Visitor rule | Src |
|---|---|---|---|---|---|---|
| ACT | Working with Vulnerable People (WWVP) | Yes: contact includes "oral communication, whether face-to-face or by telephone" and written "electronic communication" (Act s10); commercial coaching or tuition for children is a regulated activity (sch 1, 1.21) | Free: no fee for unpaid volunteers (Fees Determination 2026, snippet; a proposed $11 volunteer fee was dropped) | $163 for 2026-27 (paid) | Interstate check holders: up to 28 days in 12 months; occasional: 3 days in 4 weeks and 7 in 12 months | [1][2][3][4] |
| Victoria | Working with Children Check | Yes: "Direct contact is face-to-face, physical, written, oral or electronic contact" | Free | Employee $139.20, 1 Jul 2026 to 30 Jun 2027; valid 5 years | Equivalent interstate check: up to 30 days a calendar year | [5][6] |
| South Australia | Working with Children Check | Not stated on the official page (`unverified`) | Free (snippet) | Not checked | Home-state check, organised event up to 10 consecutive days | [7][8] |
| NSW | Working with Children Check | Face-to-face is the main test; OCG role examples include "mentoring or distance education using any form of communication such as online or phone" | Free (snippet) | $107 (Service NSW snippet) | Visitors working with children under 30 days | [9][10] |

- Design rule: every reviewer and supervisor holds a check in the learner's state, even where online-only contact may be outside the law. Cheap, and survives the judge's question.
- Pilot rule: keep reviewer and learner in the same state; cross-border cases wait for legal advice.
- SA threshold: a check is required at age 14 or over for child-related work "more than 7 days a year" [7]; a term of reviewing exceeds that.
- Victoria and the ACT both name electronic contact, so a voice note to a child is contact under those laws [2][5].

### Four models compared
| Model | Vetting | Payment | Insurance | Supervision | Rough cost per hand-off (our arithmetic) |
|---|---|---|---|---|---|
| A. Supervised pre-service teachers (sponsor arts unit, via outreach) | Check in the learner's state; university selection; child-safety module | Unpaid as approved WIL or volunteering; or paid at the QMTA student-member $67/h | University cover follows the approved activity: Flinders lists personal accident, public liability and professional indemnity for approved WIL and placements [11] | Qualified music educator approves every reply | About $1.50 (unpaid; 1 min supervisor at $87/h) to about $7 (paid 5 min at $67/h plus review); excludes intake, coordination, insurance and unanswered cases |
| B. Small paid pool of community musicians | Audition, two references, check, child-safety training | Per case at QMTA rates ($77 to $87/h) | Own public liability and professional indemnity, or the programme's policy (`unverified` per programme) | Coordinator spot-checks 1 in 5 | About $6.50 to $7.50 (5 min) plus coordinator time |
| C. Regional school music teachers in a cluster | Already checked and registered via their employer | Release time or paid per case (employer rules `unverified`) | Employer cover only if the employer approves the activity (`unverified`) | Their school leadership; programme coordinator | About $7 at the $87/h proxy; real teacher pay rates not checked |
| D. Existing online tutoring marketplace | Platform vetting; check status per state must be confirmed | Platform sells lessons, not 5-minute reviews | Platform terms (`unverified`) | Platform's own | A lesson, not a case: 30 min at $87/h is about $43.50 plus platform fees (`unverified`) |

- Cost basis: QMTA 2026 recommended minimums, excl. GST and on-costs: $87 professional, $77 associate, $67 student member [12]. Minutes per case are assumptions.
- Fit with business-case-v0.md section 3: it budgets 1 to 2 teacher hours per learner at $87; at about 5 minutes a case that covers many hand-offs or one lesson plus a few cases.
- Supervision is the real cost in model A; the student time is the learning the university already wants.

### Which model a 12-week outreach pilot can run
- Model A. Why:
  o Sponsors already run outreach (UC Aspire programmes, state-of-play s5) and arts units with music inside (universities-brief s1).
  o Caveat: no sponsor has a music school (state-of-play s5); students are generalist pre-service teachers, so the supervisor must be a qualified music educator.
  o Making it approved WIL brings existing insurance and a supervisor [11]; volunteer cover elsewhere may need registration in a volunteer programme (University of Adelaide example, snippet) [13].
  o Recruitment: needs each reviewer's check done before week 1; volunteer checks are free in all four jurisdictions above (snippet-level).
- Shape: one supervisor, 5 to 10 reviewers, a cap of about 10 cases a reviewer a week (assumption), 48-hour reply target.
- Fallback: model B with one paid teacher at the $87/h minimum if a supervisor cannot be found.
- Not pilot-ready until a sponsor names the supervisor, the child-safety officer and the WIL or volunteer approval; say "proposed" on stage.

## 6. Safety minimums for minors (hand-off only; data handling is in privacy-design-v0.md)
| Minimum | Rule |
|---|---|
| Checked adults | Reviewer and supervisor hold a check in the learner's state (section 5) |
| Guardian loop | Under 15: guardian approves each share and sees the reply; 15 to 17: guardian copy offered (privacy-design s3 consent ages) |
| No private contact | One reviewed reply, no chat; no names, emails, phones or socials either way; lesson booking only via the programme |
| Expiring access | Signed-in teacher, streamed clip, 7-day expiry, cancel any time (privacy-design s5) |
| Deletion on request | "Delete my shared clip" removes the clip and the reply; the log keeps metadata only (no audio) for a period the programme sets |
| Share log | Case ID, what was shared, who opened it and when, reply, deletion; visible to learner and guardian |
| Report a concern | Button on both screens; goes to the programme's child-safety officer, not the reviewer; acknowledged within 1 business day (proposed); the reviewer is paused while it is looked at |
| Reply check | Supervisor approves every reply before release in the pilot |

- Frame: National Principles for Child Safe Organisations, Principle 8: risks in online and physical environments are identified and reduced (snippet) [14].
- Sport precedent (snippet): officials must not request, accept or follow children on social media [15].

### The 40-word answer: "How do you keep a child safe in a hand-off?"
- "Every teacher is checked and supervised. The child never sees an email or phone number, and there is no chat. Under 15, a guardian approves each share and sees the reply. Links expire; every share is logged and deletable." (39 words)

## 7. Metrics and the stage slide
### Pilot metrics (proposed targets, to agree with the sponsor; no results yet)
| Metric | Target | Why |
|---|---|---|
| Hand-offs offered, and share taken | Count; taken share reported, no target | Business case already lists "hand-offs offered and taken" |
| Median time to reply | 48 hours or less | Learner still remembers the take |
| Cases answered within 48 hours; cases expired unanswered | 70% or more; count | Matches the card's "usually 2 days" |
| Cases answered within 72 hours | 80% or more | Supply works |
| Retake within 7 days of a reply | 50% or more | The reply re-entered practice |
| Retake after a teacher cue improves on the cue's own proof metric | Report the share, worsened included | Signal only, not causal proof |
| Teacher minutes per case | Median 5 or less | Cost model in section 5 |
| Safety | Zero contact-detail exchanges; replies rejected by the supervisor (count); concerns acknowledged within 1 business day; every cancel and deletion logged | Child safety |

### Stage slide (one line, three panels)
- Panels: learner card, teacher brief, reply in the app with the retake proof.
- Headline: "The app listens every day. A teacher spends five minutes where a human matters."
- Footer: the three time targets, labelled "pilot targets".

## 8. The mock (one card, one message, one reply)
| Piece | Real on Wednesday | Canned |
|---|---|---|
| Trigger | Miss counter from the real rules; third miss opens the card | Thresholds tuned for the demo phrase |
| Card | Fields filled from the real take, cues and proofs; trim the clip; consent tap | Teacher type list (one type) |
| Message | A mock Webex screen showing the teacher brief (build-plan s11) | No real post, no real teacher; say "mock pilot" |
| Reply | Written cue appears as the next cue; the retake runs and proves it | The cue text and the voice note are pre-written by the team |
| Revoke | Button flips state and writes a local log line | No cloud copy exists to delete |

- Fits build-plan s8 Saturday 14:30 to 16:30 hand-off block if the reply is text; the voice note is a stretch.
- Optional: a live Webex post to a team test space via the messages API (build-plan s11); still say "mock pilot".
- Never say "integrated with Webex" for the mock (build-plan s11).

## 9. Thirty seconds and the honest limit
### Spoken (about 75 words)
- "When the coach hears the same problem three times, it stops guessing. It offers a teacher. One tap, and a guardian's yes for younger learners, sends a 20-second clip, the goal and the fixes tried to a checked, supervised teacher. No names, no chat. The teacher sends back one cue or a lesson offer, and the app makes that cue the next retake. The app listens every day; the teacher spends five minutes where a human matters."
### On-stage card wording (replaces "hand position")
- "Third try, still pushing on the high note. A teacher can help with this part. Share this clip and your fix list with a pilot teacher?"
### The one honest limitation
- "A recording can't show hands or posture, and our teachers are a proposed pilot: until a university runs it, the reply time is a target, not a result."

## Method
- Input: overnight GPT-6 design draft (no web) used as the outline; every real-world claim re-checked or dropped.
  o Changed from the draft: K = 3 across 2 sessions replaced by the tech file's miss 3; 48-hour links replaced by privacy-design's 7 days; cost ranges replaced by QMTA arithmetic; pain row turned into a stop.
  o Dropped from the draft: two federal pages and an OAIC link not opened tonight.
- Web pages opened: ACT WWVP Act republication 28 (s10, sch 1 1.21, exemptions), Access Canberra before-applying, ABLIS ACT listing, vic.gov.au do-i-need-check, sa.gov.au who-needs-a-check, OCG NSW who-needs-a-check, Flinders student insurance, QMTA tuition 2026.
- Opened later: vic.gov.au check-explained (fees 2026-27, 5-year validity).
- Snippet only: ACT, SA and NSW volunteer fees, ACT fees determination 2026, NSW paid fee, SA validity, National Principle 8, sport communication rules, University of Adelaide volunteer cover.
- Codex critique: gpt-6-sol high, file body (no people names), exit 0.
  o Kept: trigger precedence and counter reset; "three times" not "three ways"; "usually 2 days" plus a 48-hour metric; state vs location wording; identifying clips; reply-rejection rules; concern response time; deletion scope; cost exclusions; "not causal proof".
  o Not kept: doubt over the 58% practicum figure (verified in state-of-play s5, Fading Notes 2023); sponsor readiness was already an open question, now stated in section 5.

## Open questions
- Team: miss 3 (tech file) or "three sessions in a row" (build plan)? This file assumes miss 3.
- Team: change the pitch-v0.md ceiling card from "hand position" to an audio ceiling (section 9)?
- Team: age band (state-of-play s7) sets the guardian loop; this file designs for under 15 and 15 to 17.
- Sponsor: can reviewing be approved WIL inside the arts unit, and who is the qualified music supervisor?
- Sponsor: which state's check applies when the university, reviewer and learner sit in different states?
- Verify: SA treatment of online-only contact; SA and NSW fees for 2026-27; ACT fees determination text (snippet only).
- Verify: minutes per case (assumed 5) and supervisor minutes (assumed 1) in the first pilot week.
- Sponsor: who owns the child-safety escalation protocol (who acts on a reported clip or reply, how fast) and the log retention period?

## Sources
1. ABLIS, Working with Vulnerable People Registration (ACT), https://ablis.business.gov.au/service/act/working-with-vulnerable-people-registration/35087, 2026-11-06, opened
2. ACT Legislation Register, Working with Vulnerable People (Background Checking) Act 2011, republication 28, effective 23 Feb 2026, s10 and sch 1 part 1.21, https://www.legislation.act.gov.au/DownloadFile/a/2011-44/current/PDF/2011-44.PDF, 2026-11-06, opened
3. Access Canberra, Check if you need WWVP registration, https://www.accesscanberra.act.gov.au/business-and-work/working-with-vulnerable-people/before-applying, 2026-11-06, opened
4. ACT Working with Vulnerable People Background Checking (Fees) Determination 2026, https://www.legislation.act.gov.au/DownloadFile/es/db_74564/current/PDF/db_74564.PDF, and Access Canberra apply page https://www.accesscanberra.act.gov.au/business-and-work/working-with-vulnerable-people/apply-for-or-renew-a-wwvp-registration, 2026-11-06, snippet
5. Victorian Government, Do I need a Working with Children Check, https://www.vic.gov.au/do-i-need-check, 2026-11-06, opened
6. Victorian Government, The Working with Children Check explained (fees 2026-27, validity), https://www.vic.gov.au/check-explained, 2026-11-06, opened
7. SA Government, Who needs a Working with Children Check, https://www.sa.gov.au/topics/rights-and-law/rights-and-responsibilities/screening-checks/screening-wwcc/who-needs-a-working-with-children-check, 2026-11-06, opened
8. SA volunteer checks free and 5-year validity (search results incl. DHS news), https://dhs.sa.gov.au/latest-news/item?a=80409, 2026-11-06, snippet
9. NSW Office of the Children's Guardian, Who needs a Check, https://ocg.nsw.gov.au/working-children-check/who-needs-check, 2026-11-06, opened
10. Service NSW, Upgrade your WWCC from volunteer to paid ($107), https://www.service.nsw.gov.au/transaction/upgrade-your-wwcc-clearance-from-volunteer-to-paid, 2026-11-06, snippet
11. Flinders University, Student insurance, https://students.flinders.edu.au/finances-and-admin/insurance, 2026-11-06, opened
12. Queensland Music Teachers Association, Tuition Rates 2026, https://www.qmta.org.au/tuition, 2026-11-06, opened
13. University of Adelaide, Volunteer insurance guide, https://www.adelaide.edu.au/volunteer/ua/media/411/19_volunteer_insurance_guide.pdf, 2026-11-06, snippet
14. National Principles for Child Safe Organisations, Principle 8 (via WA CCYP), https://ccyp.wa.gov.au/our-work/child-safe-organisations-wa/safe-environments-physical-and-online, 2026-11-06, snippet
15. Sport Integrity Australia, Electronic and online communication with children, https://www.sportintegrity.gov.au/sites/default/files/SIA184-0523-SG%20Electronic%20and%20Online%20communication-B-4%20%5BDIGITAL%5D%20-%20u.pdf, 2026-11-06, snippet
- Internal: tech-feedback-layer.md s3; build-plan-v0.md s7, s8, s11; privacy-design-v0.md s1, s3, s5; business-case-v0.md s3, s6; universities-brief.md s1, s4; state-of-play s5; pitch-v0.md.
