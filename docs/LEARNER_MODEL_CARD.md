# Model card: carmen-learner-bkt v1.0.0

Numbers below come from `docs/learner-model-metrics.json`, written by `npm run eval:learner`. Re-run that command to regenerate; do not hand-edit.

## Task
Keep a running estimate, for each music skill, of how likely it is that the learner has it, using only the checker's facts from attempts on this device. The skills are `pulse` (the beat), `rests`, `subdivision` (two sounds in a beat), `pitch` (the right notes), `reading` (reading notes) and `duration` (holding notes). The lesson-to-skill map lives in `src/data/skills.json`.

The estimate is used to **suggest**, never to decide:
- the next activity (practise the weakest skill, try it on their own, or move on);
- start tips ("Try it slower", "Listen first"), shown as buttons the learner may tap;
- which fact the coach asks about first, only if the current attempt shows that fact.

Every suggestion is a plan of approved IDs (lesson id, reason template id, suggestion ids). `validatePlan` in `src/ai/tailor.ts` rejects unknown IDs, fake model provenance and any suggestion during an independent check. If the AI is off, there is too little evidence, or validation fails, Carmen uses the rules plan: the next lesson on the pathway route.

## What it is not
- Not a test score, grade, ranking, placement or report. Nothing is locked; the learner can always choose.
- Not a diagnosis of a child, their attention, ability, hearing or any condition.
- Not trained or tested on children. Its parameters are reviewed starting values, not fitted to data.
- Not a composer: it never writes notes for the learner.
- It does not know about device audio latency, so a device that sounds late can look like weak `pulse`.

## Method
Bayesian Knowledge Tracing per skill. For each observation (pass or fail, from checker facts), the posterior is computed from the prior and the skill's slip and guess rates, then the learning step is applied. Evidence is weighted (`src/data/skills.json`):

| Attempt | Weight |
|---|---|
| Independent check (new pattern, hints hidden) | 1.0 |
| Practice | 0.6 |
| Practice with the answer hint | 0.2 |
| Slower tempo or heard example | × 0.8 |

A weighted observation moves the estimate only part of the way to the posterior. A skill is called **secure** only after at least one passed independent check, so assisted success is never shown as independent. Untimed pitch tasks give no timing observation. Explore and create activities are never used as evidence.

Pure TypeScript (`src/ai/learner.ts`, `src/ai/tailor.ts`), no runtime library, no network. It rebuilds from stored attempts each time they change, so the same attempts always give the same picture. "Reset learning picture" in Grown-ups only starts the picture again from now; it deletes nothing.

## Evaluation (simulated learners only)
`src/ai/learner.eval.ts`, seed 20261109: 400 simulated learners with hidden skill levels, 16 random practice or independent attempts each. Checker-style summaries are generated from the hidden levels.

| | Learner model | Fixed route (rules) |
|---|---|---|
| Next suggestion trains the truly weakest skill | 57.5% | 35.5% |

| | Learner model | Starting guess only |
|---|---|---|
| Mean error, predicted pass chance vs hidden level | 0.166 | 0.334 |

`src/ai/learner.eval.test.ts` requires the model to beat the route and the starting guess, and checks that the committed metrics match a fresh run.

**Interpretation.** On simulated learners the model sends practice to the weakest skill more often than the fixed route, and its estimates are closer to the hidden levels than the starting guess. This shows the software behaves as designed. It does not show that real children's learning looks like the simulation, or that following the suggestions helps anyone learn. That needs a supervised trial with educators.

## Privacy
Reads only attempt records already kept on this device (in memory when saving is off). Stores nothing new except the optional reset time. No identity, age, location or device identifiers are used. Nothing is sent anywhere. The AI off switch turns it off.

## Intended use
Prototype suggestions in Carmen's practice loop, visible and explained to grown-ups in "Learning picture (on this device)".

## Out of scope
Grading, ranking, placement, reports to parents or schools, any decision about a child outside the practice loop, and any use with real children before educator review and appropriate consent arrangements.
