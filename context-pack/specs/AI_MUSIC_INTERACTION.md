# AI musical interaction specification
Status: proposed implementation contract; no model, app execution or measured result supplied.
Scope: Foundation-Year 6 suite, variable complexity and an older extension.

## Product behaviour
Learners play or construct their own short phrase on real sampled instruments.
They choose a musical intention and can direct, reject or revise the partner.
A teacher-selected objective constrains the system's musical reply and the evidence it can collect.
The system supports musical conversation, but AI jamming and gestures are established precedents.
The candidate advantage is the reliable teaching/evidence loop, not novelty of a bandmate.

## Modes
- explore: musical play; no accuracy grade or hidden ability score.
- controlled_contrast: a declared symbolic transformation with explicit invariants.
- accompaniment: add a separate response part while preserving student-authored parts; no single-variable perceptual claim.
- guided_practice: a known target with one feedback priority and optional teaching cues.
- independent_check: a fresh related task; no teaching hints or answer-generating partner; retain access adjustments.

Mode must be part of the attempt record. A learner's changed intention does not retroactively make an imitation score a creativity judgement.

## Canonical events
Use integer musical ticks, default 480 per crotchet, plus unmodified input timestamps for live attempts.
A phrase records meter, total ticks, instrument, event kind, onset, duration, optional MIDI pitch,
intentional dynamic value and authorship. Keep the original event snapshot immutable.
Rest events are silent time in the phrase; they are not submitted note-ons.
The retained lesson seeds express time in beats. Import them with a checked, lossless conversion to the internal tick representation (480 ticks per crotchet for the supplied patterns). Preserve the source version and do not silently round timing that the selected resolution cannot represent.

An event stream is not evidence of fingering, posture, physical technique or emotion.

Represent these separately:
- authored musical material;
- raw live input and its clock/calibration conditions;
- quantised/assisted playback;
- model/teacher-added material;
- learner explanation and choice;
- independent evidence.

Derive playback, notation and inspection from canonical events without overwriting raw attempts.

## Interaction pipeline
1. Validate the task and capture the student's phrase.
2. Compute supported musical facts locally.
3. Ask for a learner prediction/intention when appropriate; allow an accessible response or skip.
4. Select an approved goal and response family.
5. Invoke the local learned planner/model outside the audio hot path.
6. Validate the returned plan against the request, task, prerequisites and actual phrase.
7. Compile the plan into a bounded musical response and verify the promised invariants.
8. Play through the sample engine; label the partner's contribution.
9. Let the learner compare, direct, reject or revise.
10. Offer a fresh independent task and update evidence only from what it measures.

Audio must not wait for steps 5-7. Start with replies between phrases; continuous tempo-following is a separate future feature.

## Minimum genuine AI contribution
The claimed AI route requires actual learned-model inference that materially influences the selected
musical response or response plan, conditioned on the phrase and goal.
A rules baseline remains mandatory for comparison.

A trained model selecting an approved operation is learned planning, not unrestricted melody generation.
A model predicting notes is note generation, not proof that its answer teaches the concept.
A synthetic timing classifier is a descriptive baseline, not a validated diagnosis of learning.
Camera landmark inference alone does not demonstrate the claimed pedagogical AI feature.

Do not add an external API to bypass the local-child-data requirement.
If no viable local route passes the feasibility gate, retain the useful guided core and mark the AI path blocked/experimental.
Do not fake inference with prerecorded replies or fixture outputs.

## Candidate model routes
Route A: a compact local learned planner proposes approved operation/parameter IDs, with reviewed examples
and explicit limits. It can adapt a musical response without generating the acoustic audio.
The training/evaluation data must be licensed and documented; synthetic data alone cannot validate
learner needs or causal educational benefits.

Route B: a small local symbolic music model proposes note events, then task checks admit/reject them.
Magenta Music documents browser note models, but exact dependencies, checkpoints and rights require a spike.
A generic continuation model is not inherently conditioned on a teaching objective. [U16-U17]

Route A is the smaller initial engineering target; its usefulness still has to beat an inspectable rules policy.
Do not choose an architecture solely to obtain an AI label.
Large audio models, cloud generations and continuous multi-agent ensembles are outside the default MVP.

## Response contract
content/music_reply.schema.json defines a response plan, not executable code.
A response includes request/phrase hashes, goal ID, provenance kind, model card ID where applicable,
operation/parameters, referenced evidence and an approved feedback-template ID.

Runtime validation must reject:
- unknown/stale request or phrase hashes;
- unknown goals, operations, templates or evidence IDs;
- an output marked model without a loaded approved model/version;
- fixture provenance on a production model path;
- invalid pitch, tick, duration, gain, event count or phrase length;
- incompatible instruments/access settings;
- missing or altered student-authored material where preservation is required;
- changes outside the task's permitted symbolic fields;
- no change when the task claims a contrast;
- an answer/hint on an independent-check path.

Use a maximum of two bounded repair attempts. Then offer a reviewed local fallback with accurate provenance.
Never display an invalid response merely because the AI explanation sounds plausible.

## Initial operations
transpose: change MIDI pitches by a bounded interval; preserve onsets, durations, instrument and authored order.
dynamics: change intentional dynamic values; preserve pitch/time/instrument. Acoustic timbre may also change naturally.
replace_with_rest: silence an identified event while retaining its time slot and all unaffected events.
section_order: reorder unchanged, learner-authored blocks; preserve each block's internal events.
add_part: add a separate, labelled partner track while preserving the student's original tracks.
echo: replay without a change; it cannot be labelled as a contrasting example.

The verifier proves only the declared symbolic relation. It does not certify expressive quality or pedagogical efficacy.

## Feedback and student control
Use one supported observation, a musical demonstration or comparison, and choices over next action.
The learner can turn the partner off, repeat, slow playback, choose other help or retain their own interpretation.
Do not score original composition by agreement with an AI preference.
Intent is selected or reported by the learner; timing alone cannot reveal it.
Do not produce a conversational child-friend persona or open-ended child chat.

## Optional gesture experiment
Default OFF. An adult/learner deliberately enables the camera with an understandable explanation.
Process only the needed hand signal locally; no raw-frame saving/upload and no emotion/identity inference.
Start with one continuous expressive control, such as dynamics, plus an on-screen/keyboard equivalent.
Do not use camera timing as a replacement for accurate percussion note-on assessment.
Use a worker or otherwise measured scheduling strategy so vision does not block audio.
Pause on inactivity; stop tracks on exit/disable. Handle low confidence, occlusion and lost tracking safely.
Record a meaningful control value only if needed; avoid storing raw landmark streams.

Gesture control is an access/interaction experiment, not a uniqueness claim. [U09-U10; U21]

## Teacher view
Show goal, phrase, verified operation, model contribution, support settings, learner decisions,
independent-check evidence and uncertainty. Let teachers change sequence/support and override recommendations.
Local adult navigation is not secure remote class administration. No backend auth is supplied by this pack.

## Acceptance evidence
The coding agent must produce a real model card and measured runtime report, versioned screenshots or logs
of the working flow, invariant-check outcomes, fallback behaviour, offline/network observations and rights records.
The fixtures are examples for verification; they are not successful executions, model outputs or learner results.
