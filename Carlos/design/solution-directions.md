# Solution directions - MasterTech Challenge 2026

- Three distinct bets for the first-year health student in problem-framing.md. Revised 5 Nov 2026.
- Answer test: the student learns or succeeds differently, visibly, in the demo.
- Team leads by role: research and design (R&D), ML and web (ML), infrastructure and AI (Infra).
- All demos use synthetic student data only; shortcuts are fine, it is a demo.
- Pitch is 3 minutes; each demo below fits in about 60 seconds, three beats.
- Every direction follows the design principles: student hero, OBE, thinking not volume, opt-in, no device access.
- Cisco fit lines name plausible placements only. [to confirm with Cisco rep: product capability and fit]

## Direction 1 - Show the Working (student-owned process, shared by choice)
- Bet: students succeed when their thinking, not only their answer, is seen and credited.
- Pitch: students work in a guardrailed AI space, review their own journey, and choose to share it.
- User moment: before submitting, the student reviews their own journey and decides to share it.
  o Timeline of prompts and follow-ups, a start-to-finish process diagram, rubric feedback on their questioning.
  o Thinking rubric: quality of questioning, follow-ups, revisions, critique of AI output; never tokens.
  o Second screen only: the marker sees the shared journey beside the outcome mark (OBE).
- Demo on 11 Nov (about 60 s):
  o Beat 1: student works the case study; the AI asks back instead of answering.
  o Beat 2: student opens their journey, sees weak follow-ups flagged, and revises one step.
  o Beat 3: student picks what to share; marker screen shows it beside the outcome mark.
- Cisco fit (plausible):
  o Duo for student and marker sign-in to the assignment space.
  o Webex as a channel for marker feedback on a shared journey.
- Biggest risk: privacy and surveillance perception; students may refuse to share.
  o Second risk: students may game the rubric with performative prompting.
  o Third risk: an inaccurate summary could unfairly colour a mark; marker always decides.
- Build by 10 Nov:

| Item | Lead | Demo-critical |
|---|---|---|
| Guardrailed chat with assignment-scoped logging | Infra | Yes |
| Journey summariser: log to steps, flags, diagram and rubric feedback | ML | Yes |
| Student journey view and share screen | R&D | Yes |
| Marker view of a shared journey | R&D | Yes |
| Three to five synthetic journeys, strong and weak | R&D, ML | Yes |
| Second model backend (local) | Infra | No |
| Privacy design one-pager: what is stored, where, for how long | R&D, Infra | No |

## Direction 2 - Campus AI Sandbox (guardrailed tutor infrastructure)
- Bet: universities will buy a controlled AI layer before they buy new teaching tools.
- Pitch: a university-run sandbox where any model, including local ones, obeys per-assignment rules.
- Gate: fails on its own; it is infrastructure, not a change in how students learn.
  o It can only serve as the architecture slide under a leading direction.
- User moment: a student picks any model; it guides rather than writes, under the coordinator's rules.
  o Coordinator ticks rules per assignment, each tied to a learning outcome.
  o All traffic stays inside university-controlled infrastructure; nothing installed on student devices.
- Demo on 11 Nov (about 60 s):
  o Beat 1: coordinator sets a rule profile for one assignment.
  o Beat 2: the same "write my answer" request goes to three models; each redirects to guidance.
  o Beat 3: architecture slide shows data never leaving the university boundary.
- Cisco fit (plausible):
  o Duo for identity in front of the sandbox.
  o Cisco secure access or Umbrella as the policy point for which AI services are reachable.
  o Campus or Cisco-hosted compute enclave for local models; Meraki only if campus network context helps.
- Biggest risk: judged as plumbing ("bordering on infrastructure"); hard to make feel finished.
  o Universities may already hold vendor AI contracts; Cogniti sells via the Microsoft marketplace (research bank). Ask each sponsor what they run.
- Build by 10 Nov:

| Item | Lead | Demo-critical |
|---|---|---|
| Gateway in front of two or three models, one local | Infra | Yes |
| Rule profile editor and policy layer applied to every request | ML | Yes |
| Architecture diagram with Cisco placements marked | R&D, Infra | Yes |
| Red-team prompt set showing how often rules hold per model | ML, R&D | No |

## Direction 3 - The Student's Compass (direction, not answers)
- Bet: students learn more when AI points the way and shows them where they are stuck.
- Pitch: from any assignment brief, the student gets clear AI rules, a guide that points the way, and a map of where they are stuck.
- User moment: 11 pm, the student is stuck on the case study and the compass points the next step.
  o "How you may use AI here" card, generated from the brief and rubric.
  o Socratic guide: one direction, free path (Elden Ring, not waypoints everywhere); never writes the answer.
  o Short weekly checks, each mapped to a unit learning outcome (OBE).
  o Personal map of stuck outcomes, visible only to the student.
  o Own learning-journey record for self-reflection (absorbs Direction 1's journey view).
- Demo on 11 Nov (about 60 s), student's hands throughout:
  o Beat 1: student opens the brief; the compass shows the "how you may use AI here" card.
  o Beat 2: student asks "write my answer"; the guide asks back, the student reasons to the next step.
  o Beat 3: weekly check lights a stuck outcome on their map; their journey record shows progress since.
- What next (by-products of the same data, not the headline):
  o Anonymous cohort heatmap for the coordinator, with a minimum group size before any cell shows.
  o Marker's opt-in view of a student-shared journey, as in Direction 1.
- Cisco fit (plausible):
  o Webex space or bot to deliver weekly checks to students.
  o Duo for student sign-in.
  o Campus or Cisco-hosted compute enclave so the guide runs on university infrastructure.
- Biggest risk: breadth; five parts in five days could look thin rather than finished.
  o Second risk: generated cards and checks may be wrong; coordinator review needed before a pilot.
  o Third risk: the student-facing version is untested with any judge so far.
- Build by 10 Nov:

| Item | Lead | Demo-critical |
|---|---|---|
| Socratic guide: chat with direction-not-answers guardrail and assignment-scoped log | Infra, ML | Yes |
| Brief and rubric reader that drafts the AI-use card and outcome-mapped checks | ML | Yes |
| Student screens: card, guide, check, stuck map, journey record | R&D | Yes |
| One synthetic student journey across three weeks | R&D, ML | Yes |
| Synthetic 450-student cohort and anonymous heatmap | ML, Infra | No |
| Marker opt-in view of a shared journey | R&D | No |
| Local model backend and architecture slide | Infra | No |

## Answer gate (pass or fail; a fail cannot lead)
| Direction | Answers the question literally: the student learns or succeeds differently? | Justification |
|---|---|---|
| 1 Show the Working | Pass | Student reflects on their own process and earns credit for thinking; change sits mainly at assessment |
| 2 Campus AI Sandbox | Fail | Controls which AI students reach; does not by itself change how they learn |
| 3 The Student's Compass | Pass | Student gets rules, direction and a stuck map while learning, every week |

## Scoring (1 to 5)
| Direction | Customer value | Evidence | Technical feasibility | What it takes to proceed | Total (out of 20) |
|---|---|---|---|---|---|
| 1 Show the Working | 4 | 4 | 4 | 2 | 14 |
| 2 Campus AI Sandbox | 2 | 2 | 3 | 2 | 9 (gate fail) |
| 3 The Student's Compass | 5 | 3 | 3 | 4 | 15 |

## Score reasons
| Direction | Customer value | Evidence | Technical feasibility | What it takes to proceed |
|---|---|---|---|---|
| 1 | Student sees and owns their process; main payoff still lands at grading | Scott: "I would use that for sure", assessor side, 2 Nov | Logging, summary, rubric and two views are buildable in five days | Consent, privacy assessment and assessment policy change; heaviest path |
| 2 | Valuable to IT; students feel it only indirectly | "Good concept, bordering on infrastructure"; no learning moment endorsed | Gateway and rules are buildable; consistent guardrails across models are hard | Procurement, security review and hosting cost before any pilot |
| 3 | Hits offloading, unclear AI rules and stuck students at once; coordinator gains too | Echoes Scott's own gap-finding example and the sponsors' offloading concern; student version not yet tested | Each part is simple, but five parts is the broadest build | Student-owned data and an optional study aid; no assessment policy change to start |

## Recommendation
- Lead with Direction 3, The Student's Compass: passes the gate and scores highest (15).
  o Margin over Direction 1 is one point; Evidence is its weakest cell.
- Pitch: "Student's Compass shows each student how they may use AI on their assignment, points the way without giving answers, and shows where they are stuck."
- Fold in Direction 1's journey record for self-reflection; consented sharing with markers is the next step.
- Use Direction 2 as the architecture slide only; it carries the Cisco fit and the privacy story.
- Protect "feels finished": build only the demo-critical items first; cohort heatmap and marker view stay on the roadmap slide.
- Close the evidence gap on 6 Nov: test assumptions A1, A2 and A6 with peers and experts.

## What would change it
| Signal on 5 or 6 Nov | Switch to |
|---|---|
| Students in the A1 test reject a guide that will not give answers | Direction 1 leads; guide softens to hints plus journey review |
| Experts say outcome-mapped weekly checks add little over existing quizzes | Direction 1 leads; compass keeps card and guide only |
| Scott or experts strongly prefer the student-shared journey and name an approver | Direction 1 leads, with the compass guide as its workspace |
| The team cannot finish the four demo-critical compass items by 9 Nov | Cut to card plus guide plus journey record; keep Direction 3 |
| A sponsor or the Cisco rep wants an infrastructure-first answer | Keep Direction 3 as the student face; expand Direction 2's architecture slide |
| Experts say prompt logs cannot reach markers, even with consent | No change to the lead; drop the marker view from the roadmap |

## Sources

- problem-framing.md, the first-year health student and assumptions A1, A2 and A6, as cited in the body.
- research-bank.md, Cogniti sold via the Microsoft marketplace, cited as "research bank".
- Scott's feedback on 2 Nov 2026, quoted in the score reasons table.
- Otherwise written from the team's own notes; no URLs are cited in this file.
