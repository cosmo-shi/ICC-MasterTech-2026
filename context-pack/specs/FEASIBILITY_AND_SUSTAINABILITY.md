# Feasibility and sustainability
Research checked 9 November 2026. Engineering budgets below are proposed, not measured or established standards.

## Fixed constraints
Existing-device access, authentic sampled sound, learner authority, teacher control and local child-data processing remain the defaults.
No required physical instrument, camera, microphone, headset or external AI account.
Core music, reviewed content and saving work offline after preparation.
No cloud AI calls or uploaded child sessions in the default MVP.

## Technical options
| Option | Evidence/benefit | Decision |
|---|---|---|
| Small local learned response planner | A bounded model can select approved musical operations; educational benefit remains unproven. | First feasibility target; compare against rules and record actual inference. |
| Legacy Magenta note models | Browser symbolic inference is documented. [U16-U17] | Candidate spike only; inspect versions, dependencies, checkpoint rights and memory. |
| Magenta RealTime 2 | Live local audio models exist; 230M and 2.4B variants have documented Apple-Silicon routes. [U18-U20] | Research comparator; not the default school-browser engine. |
| Browser gesture model | Recognised hand signals can drive expressive controls; synchronous calls can block the UI. [U21] | Optional worker-based experiment with equivalent touch/keyboard access. |
| ONNX Runtime Web | Different backends support different devices/operators. [U22] | Runtime option only after an actual model/export/operator spike. |
| WebXR/headset instrument | Relevant research exists. [U14-U15; U23] | Future research; no headset dependence or AR uniqueness claim. |
| Large continuous audio generation | Adds exactness, hardware, licensing and operational challenges. | Excluded from the initial local-browser learning path. |

Do not use the 2025 Magenta RT hardware description as a complete account of the 2026 state.
MRT2 is newer and more local-capable, but Apple-Silicon support is not Chromebook or browser support.
A nominal model size or runtime feature list is not a benchmark.

## Gate before model integration
Time-box an initial feasibility investigation; one or two working days is a planning estimate, not a promise.
1. Inspect the real repository, build constraints and intended deployment devices.
2. Identify exact model, runtime, checkpoint, dependencies and rights.
3. Run real cold/warm inference on representative low-cost hardware.
4. Demonstrate an actual phrase-conditioned response and record how often constraints reject it.
5. Compare latency, correctness and choices with a rules baseline.
6. Confirm offline loading and lack of child-data network transfer.
7. Choose, revise or reject the route based on evidence.

Synthetic training can demonstrate engineering behaviour, not a validated model of a child's understanding.
Do not split near-duplicate versions of the same phrase family across training and test sets.
Any educator-labelled response policy needs clear labelling rules and held-out contexts.
Do not train or fine-tune on child sessions in this MVP.

## Initial budgets to test
- Sound: aim for responsive direct playback; an initial p95 end-to-end target of 50 ms is proposed.
  Browser callback duration is not end-to-end acoustic latency.
- Replies: initial warm p95 target of 2 seconds between phrases; provide visible waiting and a 5-second timeout.
- Downloads: aim for a core first-use bundle around 10 MB and optional additional model/sounds within a declared total budget.
  Select actual limits with device/access testing; do not claim a chosen model already fits.
- Memory: record incremental model memory and browser stability, not only parameter count.
- Gesture: start with a modest sampling rate and one expressive mapping; tune from measurements rather than assuming precision.
- Musical verification: zero known broken invariants admitted to the controlled-contrast flow; report rejected/abstained outputs too.

Every number is a proposed acceptance target. The pack supplies no measured app/model result.

## Authentic sound
Keep synthesis/generation separate from the teaching model. Imported acoustic samples need suitable attack/decay,
note release, tuning, articulations and appropriate dynamics on target devices.
VCSL is a CC0 candidate, not a guarantee that every sound has many velocity layers. [U25]
Stage optional richer packs; avoid making a large download the entrance fee to musical participation.
Use intentional dynamic controls rather than pretending ordinary touch force measures piano technique.

## Reliability and maintenance
Keep model, music compiler, verifier, audio engine, content and storage behind distinct interfaces.
Pin exact dependencies and hashes after selection. Maintain model/sample/font notices separately.
Self-host required files, retain a reproducible build and feature-detect optional browser capabilities.
A fallback is reviewed deterministic support and must be labelled that way.
Do not silently exchange models or claim offline capability while fetching an unbundled checkpoint.

Content is a continuing operational responsibility: educator authorship, editorial review, cultural permissions,
curriculum-version mapping, accessible alternatives and teacher training all require resources.

## Financial sustainability
On-device processing avoids a per-turn vendor inference bill in the default architecture, but does not make delivery free.
Count content review, software maintenance, hosting/downloads, privacy/security, accessibility, training and school support.

For a possible future cloud route only:
N = active learners x sessions per period x model turns per session.
Variable model cost = N x measured fully loaded cost per turn, including repairs and retries.
Example assumptions: 200 learners x 20 sessions x 12 turns = 48,000 turns per period.
At assumed A$0.001, A$0.005 or A$0.02 per turn, that is A$48, A$240 or A$960.
These are sensitivity assumptions, not quoted provider prices, a recommended price or a permission to introduce cloud processing.
Include school onboarding/support and content amortisation before estimating margin.

A school/programme licence and budgeted pilots are hypotheses. Confirm budget owner, procurement route,
renewal reason and willingness to pay. Grants and competition prizes are not recurring customer demand.
Do not publish market-size, savings or return-on-investment figures without relevant evidence.

## Environmental and access sustainability
Avoid continuous inference and camera use when a short musical turn suffices.
Measure device load, thermal behaviour, battery and download size on intended devices.
Local execution is not inherently lower carbon; do not claim carbon neutrality or a quantified environmental advantage.
A technology that needs a new device can undermine the access objective even if it is technically impressive.

## Evaluation before scaling
Test usability across all primary bands and an older group, with relevant disabled learners and support people.
Compare the same lesson/time/input adjustments using rules and learned planning.
Measure independent application, delayed retention, meaningful choices, teacher time and operating cost separately.
Adopt the gesture feature only where it improves participation or an educational task over equivalent controls.

## Readiness boundary
A successful pack validator checks data consistency. It does not certify audio, AI, pedagogy, accessibility,
privacy compliance, school approval, commercial viability or global uniqueness.
