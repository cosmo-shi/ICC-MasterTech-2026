# Carmen research and Claude Code pack
Version 2.0 | 9 November 2026 | Context and draft data, not a runnable app

## Start here
Read CLAUDE.md, then research/INNOVATION_AUDIT.md and specs/AI_MUSIC_INTERACTION.md.
Use MASTER_CONTEXT.md for the complete product brief and the retained design/audio requirements.
Read specs/FEASIBILITY_AND_SUSTAINABILITY.md before selecting a model or promising device support.

The scope is Foundation-Year 6 from the outset, with variable musical complexity and suitable secondary/adult pathways.
The four primary bands are all represented in content/primary_suite.plan.json.
The ten existing lessons are retained as draft foundations; they do not constitute a complete F-6 catalogue.

## The audit changes the pitch
A responsive AI band, gesture instruments, adaptive exercises, AI teaching examples and virtual instruments each have established precedents.
The review does not establish a globally exclusive USP. Missing public documentation is not evidence of absence.
The proposed advantage to test is an inspectable learning loop around the learner's own music:
capture intent and phrase; propose a goal-related musical reply; verify the permitted change;
let the learner predict, direct, reject and revise; check independent application; show the teacher the evidence.
This is a candidate product advantage, not a validated breakthrough.

## Feed this to Claude Code
Extract into the project while preserving its existing files. Merge CLAUDE.md with existing project instructions.
Do not overwrite an existing app merely because this archive contains proposed defaults.
The archive contains no AGENTS.md and no instruction to spawn parallel agents.

Suggested starting prompt:

> Read CLAUDE.md, research/INNOVATION_AUDIT.md, specs/AI_MUSIC_INTERACTION.md,
> specs/FEASIBILITY_AND_SUSTAINABILITY.md and the relevant MASTER_CONTEXT.md sections.
> Inspect the actual repository. Build Carmen's full-primary architecture and a working
> sampled-piano/percussion experience, preserving accessibility, original student work,
> teacher authority and local child-data processing. Start with the model/runtime feasibility
> gate and a complete musical interaction; represent all four primary bands and an older extension.
> Use a real local model only for claims it actually supports. Verify musical reply constraints
> before playback, and separate AI contribution, support and independent evidence.
> Camera gestures are an optional local experiment, disabled by default. Do not add a cloud API.
> Implement the retained ten draft foundations and the new band pathways incrementally;
> do not present draft plans, fixtures or empty screens as completed content.
> Report actual checks, measurements, rights evidence and remaining gaps.
> Do not claim that the AI ensemble, gesture control or curriculum labels are unique.

## Included
- MASTER_CONTEXT.md: complete updated product context, with the full technical update embedded.
- CLAUDE.md: concise implementation instructions.
- research/INNOVATION_AUDIT.md: novelty verdict, closest overlaps and tests of the candidate USP.
- research/competitor_matrix.csv: 29 product, research and tooling comparisons, with availability limits.
- research/search_log.csv: 31 search queries used for the update, plus a note on direct retrieval.
- specs/AI_MUSIC_INTERACTION.md: modes, model boundary, musical validation and acceptance checks.
- specs/FEASIBILITY_AND_SUSTAINABILITY.md: model choices, budgets, deployment and commercial gates.
- content/primary_suite.plan.json: F-6 progression, four starter missions and an older extension; all drafts.
- content/music_reply.schema.json and music_reply.examples.json: response-plan contract and illustrative fixtures.
- content/model_manifest.template.json: deliberately unapproved model intake record.
- content/release_claims.json: allowed, rejected and conditional claims.
- content/lessons.seed.json: ten retained draft activities; source/rights records remain alongside them.
- references/sources.csv: merged source catalogue with aliases identified.
- references/innovation_sources.csv: the 41 targeted update-source records and review-depth limits.
- references/Carmen_Research_and_Product_Strategy.md and .pdf: updated human-readable research report.
- references/prior_* and user_research_bank.md: retained background, not overriding instructions.
- tools/validate_context.py and tools/validate_update.py: pack consistency checks, not app/model tests.

Run:
    python3 tools/validate_context.py
    python3 tools/validate_update.py

No model weights, sample audio, fonts, executed app, child-pilot results or educator approvals are supplied.
Source access is research permission, not asset reuse permission.
The model path, audio quality, accessibility, device budgets and comparative learning advantage require implementation and evaluation.
