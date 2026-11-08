# Sunday notes, 8 Nov 2026: direction, the screen instrument, the no-score rule and the practice record

- Date: Sun 8 Nov 2026 13:05 (AEDT), written from Carlos's chat over Remote Control between 12:35 and 13:05, while travelling to Melbourne.
- Scope: four questions after the teammate spec landed (spec-review-v0.md): which direction, is the on-screen instrument a good idea, what the no-score rule means in full, and what the "strengths and weaknesses" memory is for.
- Status: proposals until the team decides; nothing built. Names only as allowed by session-rules.md.
- Companion files: spec-review-v0.md (the collisions and the scope cut), morning-notes-2026-11-07.md (s3, s5, s7 to s9), privacy-design-v1.md.

## 0. What was proposed (conclusion first)

- Direction: the teammate spec is the frame; the overnight coach mechanics are the engine inside it. Not a compromise; each is strong where the other is weak.
- On-screen instrument: keep it as the zero-cost input and the on-ramp; drop "try before you commit" as the reason; drop the guitar; point learners to real loan schemes.
- No-score rule: the learner never sees a number, grade, percentage, star or pass/fail for a take; evidence, one fix, and the retake change instead. Numbers live in the teacher view and the stored attempt.
- Practice record: the coach's invisible memory is a record of practice events, openable by the child or guardian, used to personalise the next task and to brief a mentor on request; never a label about the child.
- Carlos agreed with all four in chat (13:05); the team call is still open.

## 1. Direction: spec as frame, overnight work as engine (asked 12:46)

- Why the spec wins the frame: the whole team wrote it, with two build days left.
  o It answers access head on: no instrument, no account, free, offline, any device.
  o It is a vision with mock screens, which this format rewards.
- Why the overnight plan must not die: the spec is weakest where the overnight files are strongest.
  o Differentiation: on-screen instruments and theory lessons are table stakes; free tools exist.
  o The stage: rhythm judged on glass with phone audio delay looks unfair; the MIDI demo does not.
- Almost all overnight evidence transfers untouched: privacy design, age band, the 27 competitors, the business case, the Cisco notes. Only the headline changes.

| From the spec | From the overnight files |
|---|---|
| Product frame, offline, no account, age band screen | Coach rules: one fix, evidence not totals, stop rule, plain words |
| Years 3 to 8 and the generalist teacher as the buyer | MIDI keyboard as the stage input and the "real instrument" moment |
| Ask-before-tell loop and the hint ladder | Human hand-off with the Webex mock; the Cisco line |
| Structure, IDs, acceptance tests | Scope cut to one instrument and one loop; the evidence files |

- The merged story in one breath: a free music coach on any device, no instrument needed.
  o It asks before it tells, gives one fix and never a score, and follows you onto the real instrument when the loan arrives.
  o Pilot channel: the ACT Instrumental Music Program. Money: the sponsors' Outreach Funding.
- The one rule to fight for if the team pushes back: no score. Without it the product is a prettier free instrument toy.

## 2. The on-screen instrument (asked 12:41)

- As the reason for the product ("try an instrument before you commit"): weak.
  o A screen keyboard says nothing about liking a trumpet or a cello: no weight, breath, feel or room sound (spec assumption 4 admits it).
  o Free trial already exists in GarageBand and browser toys; idea-bank-v1 F6 parked the taster idea at about 12 to 15 percent adviser weight for that reason.
  o Real trial paths exist and beat a screen: the ACT program lends the instrument in Years 5 and 6; NSW hires; Just Brass and the Australian Children's Music Foundation supply instruments (free-programs-partner-map rows 18, 22, 26, 30).
- As the input layer: right.
  o Zero-cost input that runs the coach loop on any school tablet; idea-bank-v1 D1 rates it "core, never the claim", 15 of 27 competitors have it.
  o It fills the gap between wanting to play and holding an instrument: waiting lists, Year 5 selection, a loan next term. Pulse, note names and reading start on the screen today.
  o Keyboard and drum pads transfer to the real thing; guitar on glass does not. Drop the guitar.
- Framing to pitch: "Start on the screen today. When the real instrument arrives, the coach comes with you."
  o Feature: a "find a real instrument near you" card pointing to the local loan or hire scheme; loan programs become partners, and sponsor outreach teams know them.
- Never say the screen replaces the instrument.

## 3. The no-score rule in full (asked 12:58)

- The rule: no number, grade, percentage, star or pass/fail for a take, ever, on the learner's screen.
  o Shown instead: what happened ("beats 3 and 4 came early"), one fix doable in ten seconds ("count out loud, play it again"), and after the retake, what changed ("beat 3 landed, beat 4 still early").
  o Goals are small and stated in actions and days, never in points.

| Reason | Evidence in the folder | Line for the desk |
|---|---|---|
| Task feedback beats judgment | 196-study review: feedback effect 0.79, praise and rewards lower than task feedback (social-and-fear-evidence-v1 E11, Hattie and Timperley 2007) | "A score is judgment with no task in it" |
| Fear is the quitting mechanism | Beginners fear being heard and judged; nearly half of 9 to 12 year olds in one study reported anxiety; shy learners hide it from the teacher (E1, E4) | "A score every twenty seconds is a judgment every twenty seconds" |
| The only empty square | Every competitor scores: five-dimension ratings, a gradebook with a default 80 percent goal, an overall score (nearest-competitors-v1 rows 25, 55, 71) | "Nobody shows one fix and a retake check" |

- "Strengths and weaknesses" per take is a verdict again if it is a list; per take it is one thing that held and one thing to fix.
  o The review belongs at the end of a unit as can-do statements ("reads every line of the treble stave"); the spec's badge wording (FR-GAM-02) already does this.
- Numbers still exist: the attempt record keeps every note and timing (FR-ASM-04); the teacher view aggregates counts and hard concepts (FR-TCH-04); research gets the data.
  o This resolves spec FR-PRG-01: keep the counts, move them from the child's results screen to the teacher's.
- Ownership: the learner says what changed before the coach does (ledger step C7); the retake becomes a success they own, which the fear evidence says protects a beginner.
- Desk answers to the three objections:
  o "Kids like scores": they like winning; the retake change is a win they own every two minutes.
  o "How do they know they improved": the retake card and the unit's can-do list.
  o "Is 'beats 3 and 4 early' a score": an observation about the take, not a rating of the child; no totals, ratings or comparisons.
- The 60 s demo is the rule made visible: take, one line, retake, one line, no numbers on screen.

## 4. The practice record: the coach's invisible memory (asked 13:01)

- Carlos's intent: strengths and weaknesses are a memory for the coach, used to personalise teaching and to brief a mentor if the learner wants one. This is the learner state of morning-notes s9, given its job.
- Name it a practice record and keep it to practice events.

| Goes in | Never goes in |
|---|---|
| Each cause and how often (early beats, wrong note, hesitation, left hand) | Audio or video |
| Fixes marked "got it" | Names, school, location |
| Words tapped for a meaning | Labels about the child ("weak learner", "low confidence") |
| The goal in the learner's own words | Inferred emotion or ability |
| How they like to be told; when they get stuck | Anything a mentor could use to rank children |

- Invisible means not shown as a verdict, not secret.
  o A child or guardian can open it any time, in plain words: "Working on: steady beat. Got better: wrong notes in bar 2."
  o Access to held information is a privacy right; the record drives automated choices of the next task, which privacy-design-v1 C16 says must be disclosed from 10 Dec 2026.
- How it personalises.
  o Rules read the record to pick the next task; a third miss on one cause triggers the plan change (morning-notes s8, s9).
  o The packet to the model carries the top two or three patterns, so the one sentence is worded for this learner and pre-explains a word they tapped before.
  o The cue book favours lines this learner responded to.
- The mentor brief is the record's best moment.
  o On "ask a person" (the learner, or the guardian under 15), the hand-off card carries: goal, the last five takes' causes, what was tried, what worked, their own words, the clip only if added.
  o Strengths first, then the one open problem: the mentor first-reply rule "one kind thing, then one fix" (social-and-fear-evidence-v1 SF5).
  o Nothing leaves the device until they tap send (spec FR-ASM-07; privacy-design-v1 share log).
- Three guardrails: it ages (only the last few weeks shape the packet); it never ranks (teacher sees class aggregates, not records side by side, FR-TCH-05); it is deletable and exportable in one tap (FR-PRG-05).

## 5. Rows to add to the spec

| Proposed ID | Requirement | Priority | Demo |
|---|---|---|---|
| FR-AIC-14 | After three attempts with the same cause, the coach stops coaching and suggests a person | M | P |
| FR-AIC-15 | The system shall keep a practice record on the device: causes, fixes that worked, words tapped, goal, preferences; no audio, no names, no labels | M | P |
| FR-AIC-16 | The system shall generate a mentor summary from the record on request, sent only when the learner or guardian taps send | S | M |
| FR-PRG-06 | The learner or guardian can open the practice record in plain words at any time | M | M |
| FR-PRG-01 (change) | Counts move from the learner's results screen to the teacher view; the learner sees evidence, one fix and the retake change | M | P |
| Constraint 6 | Lesson melodies and class-goal songs are public domain or written by the team | n/a | n/a |
| Data flow | One box: the record stays on the device; the summary leaves only on send | n/a | n/a |

## Method

- Written by the session from the chat (12:35 to 13:05) and the named project files, opened 2026-11-08; no Codex, no local model, no web search for this file.
- Evidence lines are quoted from the folder's own files; nothing new was looked up. Hours and effects are as those files state them.

## Open questions

- Does the team adopt the merged story, and who writes it into spec section 1?
- Which spec rows does the team accept from section 5, and does FR-PRG-01 change?
- What does the practice record show on a child's first open, before any take exists?
- Who writes the mentor summary template, and does a teacher review its wording?

## Sources

- spec-review-v0.md and Music-App-Requirements-Specification/index.md (FR-ASM-04, FR-ASM-07, FR-PRG-01, FR-PRG-05, FR-TCH-04, FR-TCH-05, FR-GAM-02, assumption 4), opened 2026-11-08.
- social-and-fear-evidence-v1.md E1, E4, E11, SF5 and the ledger step C7, opened 2026-11-08.
- nearest-competitors-v1.md rows 10, 25, 55, 71 (scores in every product), opened 2026-11-08.
- idea-bank-v1.md D1 and F6; free-programs-partner-map.md rows 18, 22, 26, 30; privacy-design-v1.md C16 and the share log, opened 2026-11-08.
- morning-notes-2026-11-07.md s3, s5, s7, s8, s9, opened 2026-11-08.
