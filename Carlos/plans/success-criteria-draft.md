# Success criteria draft: five measures the team proposes for itself

- Date: Fri 6 Nov 2026 (AEDT), overnight draft for the team; verify before the pitch.
- Purpose: have our own five measurable criteria ready before the programme hands out its criteria on Mon 9 Nov, 8 am.
- Scope: the voice-first listening practice coach (functional-requirements-v0.md); measured on the nine-student test (friday-selection-pack-2026-11-06.md section 8).
- Recommendation: propose these five, then map them onto the official wording (table 3); targets are proposals, the team can move them.

## 1. The five criteria
| # | Req | Metric | Target | How measured on the nine-student test | Reviewer test |
|---|---|---|---|---|---|
| C1 | R3 | Wobble (pitch-flip) count on the same 10 s phrase, take 1 vs retake after one fix | 5 of 9 improve; stretch: median fall of 30% | One fixed tracker and a wobble definition written before the test; app logs the count; show the audio next to the number; groups B and C retake with no cue | Evidence |
| C2 | R1, R2 | Seconds from end of first take to the first plain-words cue on screen | 8 of 9 within 20 s; median 10 s or less; failures and timeouts counted | App log timestamps (take end, cue shown), stopwatch backup; includes load and processing | Feasibility |
| C3 | R2, R6 | Trust and usefulness of the cue, 1 to 5 (Henderson 2025 wording) | 6 of 9 rate trust 4 or 5 and "understandable, worth trying" 4 or 5 | Two questions after the retake, read aloud, no names; a teaching-experienced checker reviews the nine named causes afterwards, reported separately | Customer value |
| C4 | R14 | Did the hidden fundamentals feel like help, or like extra work? | 6 of 9 would do another phrase; at most 1 names homework | Open question first ("what, if anything, felt like extra work?"), then help / neutral / homework; verbatim reasons kept; also "I know what to do next" 1 to 5 | Customer value |
| C5 | R12, R10 | Proceed check: (a) fresh sessions offline on one named low-end phone; (b) hand-off card shown at the ceiling | (a) 3 of 3 fresh sessions, with load, cue and retake times reported; (b) card for every failed-cue case seen in the nine, plus 3 scripted cases | Airplane mode from a cold start; card shows recording plus fix list; reviewer can see what the teacher receives | Feasibility, proceed |

### Notes per criterion
- C1: Carlos's own evidence is one user, wobbles 24 to 7 and 33 to 13 (evidence-carlos-singing-practice.md); the bar is low on purpose, one attempt each.
  o Retake gain can be practice, not the cue: compare groups B and C on the same phrase.
  o Report count and a plain-words line; a second number, mean cents off the target note, is optional.
- C2: web-app-architecture.md already flags a four-second guard plus reply budget; 10 s end to end leaves room on a laptop.
- C3: benchmark from Henderson et al. 2025, via research-bank.md: 83.9% found GenAI feedback helpful (82.2% teachers); 60.1% trusted it (90.5% teachers).
  o Our bar of 6 of 9 (67%) sits just above the 60% benchmark; the survey is university students and written feedback, so it is context, not a justification for the bar.
  o A confident wrong diagnosis can score well; the separate expert check of the nine causes guards that. Do not claim parity with teachers.
  o Nine students is indicative only; say "7 of 9", never a percentage.
- C4: the open question in functional-requirements-v0.md and the "trick doubt" risk (state-of-play section 12); only a learner test answers it.
- C5: low-end phone is a team choice (see Open questions); hand-off at the technique ceiling is R10, Must.
- Honesty line for all five: one hour measures novelty, not learning; point to the 12-week pilot.

## 2. How the five cover the reviewer tests
| Reviewer test (info pack section 3) | Criteria |
|---|---|
| Customer value | C3, C4 |
| Evidence | C1 (and the nine-student result as a whole) |
| Technical feasibility | C2, C5 |
| What it would take to proceed | C5 (offline and hand-off readiness); the pilot ask in the pitch |

## 3. What we will say on Monday if the official criteria differ
| If the official criteria say | We map ours as | Say |
|---|---|---|
| User or customer value, desirability | C3 and C4 | "Six of nine trusted the cue; here is the question we asked." |
| Evidence, validation | C1 plus the nine-student protocol | "Measured before and after on the same phrase." |
| Technical feasibility, working prototype | C2 and C5 | "Cue in about ten seconds, offline on a low-end phone." |
| Impact, outcome | C1 and C4 | "Fewer wobbles after one fix, and learners kept it as help." |
| Scalability, reach, regional access | C5(a) | "Runs offline; audio stays on the device." |
| Business case, cost, adoption, next steps | C5 and the pilot ask | "Hand-off to a teacher is built; next is a 12-week pilot." |
| A criterion we do not cover (for example cost per learner, safety) | Add as C6 on Monday; do not stretch C1 to C5 | Name the gap; commit a number by Wednesday. |

## Method
- Read the team files listed in Sources; no web research (Henderson 2025 checked against research-bank.md lines 13 and 58: same DOI, same four figures 83.9, 82.2, 60.1, 90.5).
- Codex call 1: gpt-6-sol, medium, critique of the five criteria (names stripped, no repo). Exit 0.
  o Kept: gaming and definition risks on C1; count failures in C2; trust bar lowered and expert check added in C3; open question first in C4; cold-start and observed-failure cases in C5; lower targets (5 of 9, 8 of 9, 6 of 9).
  o Rejected: dropping the Henderson benchmark (kept as context only).

## Open questions
- Which phone counts as "low-end" for C5? Team picks a named device; no spec is verified here (`unverified`).
- The Friday plan's nine-student task is the chord version; C1 to C4 need the voice version (one phrase, one cue). Decide before Sat 7 Nov.
- Who checks the nine named causes in C3 (a teaching-qualified validator, question 20)?
- Can groups B and C run on voice, or does C1 stay a before-and-after only?
- Do the official criteria on Mon 9 Nov ask for a business or cost number? If so add C6.

## Sources
1. functional-requirements-v0.md, friday-selection-pack-2026-11-06.md section 8, key-facts-info-pack.md section 3, state-of-play-2026-11-06.md section 12, web-app-architecture.md, evidence-carlos-singing-practice.md: team files, read 2026-11-06 (opened).
2. Henderson et al. 2025, Assessment & Evaluation in Higher Education, https://doi.org/10.1080/02602938.2025.2502582; figures as cited in research-bank.md (full text via https://opus.lib.uts.edu.au/handle/10453/196513); accessed 2026-11-06 (opened by the research-bank author; not re-fetched here).
