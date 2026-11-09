# Model card: carmen-learner-bkt v1.0.0 (live learner model)

Plugged into Carmen's learner plug-in point (`src/ai/learner.ts`) by `src/ai/bktLearner.ts`, registered in `src/App.tsx` while the AI is on. With the AI off, Carmen uses the built-in tracker (`carmen-elo-baseline`). If this model ever throws or returns an invalid estimate, `estimateSkills()` falls back to the built-in tracker automatically, and the teacher dashboard says so.

## Task
For each skill in `SKILLS` (pulse, rests, quavers, direction, note names, reading, duration; explore and create are "taking part"), estimate how likely it is that the child can do it now, from the checker's facts in this device's tries. The existing screens use the estimates unchanged: the pathway's next step ("Carmen picked this for you"), the lesson summary ("Carmen suggests") and the teacher dashboard (skills, groups).

## Method
Bayesian Knowledge Tracing per skill. Each try's checker fact (`observe()` in `learner.ts`) becomes a pass or fail: on time on at least 80% of sounds for beat skills; every note right, no tap in a rest, every length right for the others. The posterior is blended by how much the try counts, then the learning step is applied.

| Try | Counts |
|---|---|
| On their own (independent check) | 1.0 |
| Practice | 0.6 |
| Practice with the answer shown | 0.2 |

Status words use the same rules as the built-in tracker: secure needs an estimate of at least 0.8 **and** a pass on their own; growing from 0.5; otherwise starting. Explore and create are never judged.

## Settings
`src/data/bkt-params.json`. Fitted by maximum likelihood on the `carmen-b` branch (`npm run fit:learner`) to 800 simulated learners × 16 tries and tested on a different simulated group. There, compared with the reviewed starting values, they predicted each next try better (log-likelihood per try −0.374 vs −0.403) and estimated skills more closely (mean error 0.144 vs 0.166). Mapped onto these skills: quavers uses the "two sounds in a beat" fit; direction and note names use the "right notes" fit.

## What it is not
Not a test score, grade, ranking, placement or diagnosis. Not trained or tested on children: the settings encode a simulation's assumptions, and some sit at their limits. Not a composer. It does not know about device sound delay, so a device that sounds late can look like a weak beat.

## Privacy
Reads only the fields in `AttemptEvidence` (activity, time, kind, passed, hint level, checker summary) from this device. Stores nothing. Sends nothing.

## Out of scope
Grading, ranking, reports to parents or schools, and any use with real children before educator review and appropriate consent arrangements. Whether its suggestions help children learn needs a supervised trial with educators.
