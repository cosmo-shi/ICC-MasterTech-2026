# Model card: carmen-learner-bkt v1.0.0

Numbers below come from `docs/learner-model-metrics.json`, written by `npm run eval:learner`. Re-run that command to regenerate; do not hand-edit.

## Task
Keep a running estimate, for each music skill, of how likely it is that the learner has it, using only the checker's facts from attempts on this device. The skills are `pulse` (the beat), `rests`, `subdivision` (two sounds in a beat), `pitch` (the right notes), `reading` (reading notes) and `duration` (holding notes). The lesson-to-skill map lives in `src/data/skills.json`.

The estimate is used to **suggest**, never to decide:
- the next activity from the lesson list (practise the weakest skill, move on, or go over a lesson again). After a passed try it is always a different activity, never the same lesson again and never "try it on your own";
- start tips ("Try it slower", "Listen first"), shown as buttons the learner may tap;
- which fact the coach asks about first, only if the current attempt shows that fact.

Every suggestion is a plan of approved IDs (lesson id, reason template id, suggestion ids). `validatePlan` in `src/ai/tailor.ts` rejects unknown IDs, fake model provenance and any suggestion during an independent check. If the AI is off, there is too little evidence, or validation fails, Carmen uses the rules plan: the next lesson on the pathway route.

## What it is not
- Not a test score, grade, ranking, placement or report. Nothing is locked; the learner can always choose.
- Not a diagnosis of a child, their attention, ability, hearing or any condition.
- Not trained or tested on children. Its settings are fitted to simulated learners only, so they encode the simulation's assumptions.
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

## Settings and how they were fitted
Each skill has four settings: the chance it is already known (start), the chance of learning it on a try (learn), the chance of a mistake when it is known (slip) and the chance of a pass when it is not (guess).

`npm run fit:learner` (`src/ai/learner.fit.ts`, `tools/fit-learner.mjs`) chooses the settings that best predict each next pass or fail (maximum likelihood, weighted like the model's own evidence), by a deterministic search on a 0.01 grid within the usual limits (slip at most 0.3, guess at most 0.4, so knowing a skill never makes failing more likely). It is fitted to **800 simulated learners × 16 tries (seed 1)** and tested on a **different** group of 400 (seed 20261109). The reviewed hand values are kept in `skills.json` as `startingParams` for comparison. The same tool can be re-run on real, consented practice data later; until then the settings say nothing about children.

Several fitted settings sit at their limits (slip 0.3 for two sounds in a beat and reading). That is a sign the simulation does not behave like textbook BKT: simulated skills are partial chances, not known/not known. Treat the fitted values as a better fit to the simulation, not as truth.

## Evaluation (simulated learners only, different group from the fit)
| | Fitted settings (in use) | Starting values | Fixed route (rules) |
|---|---|---|---|
| Next suggestion trains the truly weakest skill | 55.3% | 58.8% | 35.5% |
| Mean error, predicted pass chance vs hidden level | 0.144 | 0.166 | — |
| Log-likelihood per observation (higher is better) | -0.374 | -0.403 | — |

Starting guess alone (no updates): mean error 0.334.

Tests (`src/ai/learner.fit.test.ts`, `src/ai/learner.eval.test.ts`) require the fitted settings to predict the test group at least as well as the starting values for every skill, the model to beat the fixed route and the starting guess, and the committed settings and metrics to match a fresh run exactly.

**Interpretation.** Fitting made the estimates closer to the hidden levels and the predictions of each next try better. It made the choice of weakest skill slightly worse (55.3% vs 58.8%), because the fitted settings change the estimate more slowly. Both still beat the fixed route. None of this shows that real children's learning looks like the simulation, or that following the suggestions helps anyone learn. That needs a supervised trial with educators.

## Privacy
Reads only attempt records already kept on this device (in memory when saving is off). Stores nothing new except the optional reset time. No identity, age, location or device identifiers are used. Nothing is sent anywhere. The AI off switch turns it off.

## Intended use
Prototype suggestions in Carmen's practice loop, visible and explained to grown-ups in "Learning picture (on this device)".

## Out of scope
Grading, ranking, placement, reports to parents or schools, any decision about a child outside the practice loop, and any use with real children before educator review and appropriate consent arrangements.
