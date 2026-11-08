# AI visibility note v0: where is the AI, and which parts were live?

- Date: Sat 7 Nov 2026 (AEDT), overnight draft.
- Purpose: give the team an honest, speakable answer to "where is the AI?" and a under-15-second stage moment that shows the technology without faking anything.
- Scope: judge-lens-v1 risk 2 ("AI invisible"); feedback-ledger-v1 s2 item 6 (F72, F120, F149); labelled-honesty rule (conflict C4; pitch-v2 labels; qa-prep-v1 Q21, Q23).
- Status: overnight draft for the team; verify before the pitch. Nothing here was run; the Saturday build decides what is affordable.

## 1. Bottom line

- Honest one-sentence answer: "Code scores each key press and rules pick the one fix, with no learned model in that path; a language model turns the typed goal into steps, and on stage that plan is its saved, labelled answer."
  o Codex critique fix: do not insist the rules are "not AI" (hand-written rules are classic symbolic AI to some judges); say "no learned or generative model chose the cue" and let the judge label it.
  o That is two honest places for "AI": the measuring-and-deciding loop (software, not a model) and the optional model step (a real model, replayed on stage).
- Stage moment I lean to (about 8 seconds, inside the existing one-fix slot, 0:59 to 1:06): a "why this cue" strip under the cue card.
  o Strip shows the measured numbers from the live code, the rule that fired, and the label "Chosen by rules, on this laptop".
  o Spoken: "Measured: you speed up. A rule picked the fix: let the click lead." (12 words; the current line is 15.)
  o Add a saved model "receipt" card as a Q and A backup slide (option C below is dropped).
- Never-say lines (add to pitch-v2 s5):
  o "Our AI hears you" or "it listens to you" while MIDI is live (already in pitch-v2 s5; the MIDI path reads keys, not sound).
  o "The AI chose the cue", "AI-powered feedback" for the rule cue, "personalised by AI" for the rule cue.
  o "Live AI" for the saved model plan; "machine learning" for the pitch tracker (Pitchy is plain signal processing, no model).
  o "Agentic" as the app's label (Cisco's own pages define agentic AI as autonomous: perceive, plan, execute; our loop is bounded, so say "works inside limits, a person at the ceiling").
  o Anything implying the demo model answer was produced on stage.
- Why not run the model live on stage: the routing in tech-feedback-layer s1 sends one clear rule with no learner words to rules only, so a live call would be forced for show, needs wifi (the build plan says no live network dependency), and sends the typed goal overseas (privacy-design-v1 s5).
  o Unforced model calls are exactly what "keep your AI claims in check" warns about: claim only what runs.

## 2. The loop, step by step

- "Plain-words AI claim" is what we may say without overclaiming. Where the transparency guidance applies, the rule is: disclose where AI is in play, and do not say AI where it is not [2][3].
- Stage column assumes the pitch-v2 demo: take 1 a Saturday replay scored now, retake live on the MIDI keyboard.

| # | Step | What does it | Live on stage or replayed | Screen label | May we call it AI in plain words? |
|---|---|---|---|---|---|
| 1 | Listen | Phone: Pitchy, a McLeod pitch method, signal processing, no model (tech-pitch-detection s1). Stage: MIDI key events, no sound analysed | Retake live; take 1 replayed | "Live now"; "TAKE 1 - REPLAY" | No. Say "measures every note" on stage; "listens" only for the phone microphone path |
| 2 | Features | Plain JavaScript builds the features JSON (timing, notes hit, steadiness) | Live, both takes | "scored now by the real code" | No. "Numbers from code" |
| 3 | Match | Alignment code compares played notes to the target phrase | Live | none needed | No. "Compares to the phrase" |
| 4 | Cause | Rules engine: about 20 patterns, tiered, one winner (tech-feedback-layer s3) | Live; the rule that fires depends on the take | Proposed: "Chosen by rules, on this laptop" plus the rule id | No. "Rules we wrote pick the fix" |
| 5 | Cue wording | Stage: fixed text from the rule table. Product, online: optional language-model rephrase into the learner's goal and words | Stage: rules text live; model rewrite not run | none; if a model sample is shown: "Example output, recorded [date]" | Model rewrite only: "a language model rewords it". Never for the rule text |
| 6 | Proof | Code computes before and after; the proxy overwrites any model numbers with measured ones (tech-feedback-layer s8) | Live | "On the beat: x of N, then y of N" | No. "Counted by code" |
| 7 | Plan (goal split) | Language model splits the typed goal into small goals (build-plan-v1 row: goal split built, cached for stage) | Saved answer, replayed | "Example output, recorded [date]" | Yes, truthfully: "a language model made this plan; this is its saved answer" |
| 8 | Hand-off | Human teacher; code assembles the fix list and clip; Webex message is a mock | Scripted mock | "Separate example ... (sample week, scripted)"; "Proposed: Webex hand-off (mock)" | No. A person is the intelligence here: "a human at the ceiling" |
| 9 | "I'm not sure" | Rules return no cue when confidence is low or no rule fits (idea-bank-v1 A17; M1; prototype shows "No rule found one thing to fix") | Live code; only seen if a take triggers it | Plain words on the card | No. It is a design rule; "it says when it is unsure" |

- Reading the table: of nine steps, one uses a language model on the product path (step 7, plus optional step 5), and none of the stage cue path does.
  o The only fair AI headline is "rules measure and choose; a model plans and words; a human takes over at the ceiling".
- Transparency: label model output as model output wherever it is shown, and let people tell when an AI system is engaging with them [3].
- Competitor wording for contrast (from nearest-competitors-v1): Mastery states its AI analysis "occurs on Google's servers" and meters "AI analyses"; Maestro calls itself "a real-time AI music tutor". Both name the AI by label; we name it by what it does.

## 3. Three ways to show the technology in under 15 seconds

| Option | What the audience sees | Honesty risk | Build cost | Lean |
|---|---|---|---|---|
| A. "Why this cue" strip: measured numbers, rule id, label "Chosen by rules, on this laptop", beside the cue (features JSON visible in a small corner) | The decision chain behind the cue, on the live retake data | Low. Risk: a judge says "that is just rules"; answer is the honest two-place line | Small UI panel on the one-fix card, reading values the skeleton already computes (about 1 h; the Saturday build can afford it). Fallback: a slide image from a real take | Yes, the stage moment |
| B. Model rewrites the cue in plain words with a "Model" label | Rule text, then the model's wording of it | Medium. A saved answer looks live unless labelled; a fresh live call breaks the routing rule and the offline rule | Per-take rewrite is not built before Wednesday (build-plan-v1); would be a replay of one saved answer, about 1 to 2 h plus a real saved call | Only as a saved receipt in Q and A, not on stage |
| C. Hand-off packet being built | Fix list, clip, learner id assembled into a message | High that it reads as AI when it is code plus a human; also already a labelled mock | Slide only | No |

- Option A fits the existing slot: the cue is read aloud for about 7 seconds; the strip is on screen while it is read; no extra seconds if the line is the 12-word version.
- A model "receipt" for Q and A (proposed, not on stage): one backup slide with the real Saturday call, date, model name, the features JSON sent, the JSON returned, and the label "saved example".
  o It turns "we have a model" from a claim into an artefact the judge can read.

## 4. Spoken answers

| Question | Answer (words) |
|---|---|
| Where is the AI? | "Two places. Code scores each key press and rules pick the one fix; no learned model chose today's cue. A language model turns the typed goal into small steps; the plan you saw is its saved, labelled answer." (39) |
| Which parts were live? | "Live: the retake, the scoring, the rule that chose the fix. Replayed: take one, recorded Saturday, scored now. Saved: the model's plan, labelled. Mock: the teacher hand-off, labelled proposed." (30) |
| Why not just send the recording to ChatGPT? | "A general assistant may coach well; we have not benchmarked it yet. Ours measures each note in code, checks the same phrase on a retake, is designed to work offline, and proposes a human hand-off with the fix list. We will test it against them." (43) |
| Is agentic the right word? | "Not as a label. It works inside limits: scores a take, picks one fix, checks the retake, proposes a person at the ceiling. Rules, not a model, chose today's cue." (31) |

- Consistency: the ChatGPT answer matches objections-and-research-gaps s1 row 1 (assistants can listen and talk; our difference is per-note measurement, a structured retake and offline use, still to be tested) and keeps the benchmark Q and A only, never a stage comparison.
  o If the Saturday benchmark runs and our layer wins or loses, change the second clause to the measured result; do not keep the claim unchanged.
- The "live" answer matches qa-prep-v1 Q21 and adds the model plan, which Q21 omits.

## 5. What this changes (proposals only; no existing file edited)

### pitch-v2

| Row | Current | Proposed | Seconds |
|---|---|---|---|
| s1 0:59-1:06 (one-fix card) | "One fix, in plain words: you speed up as you play; let the click lead." (15) | "Measured: you speed up. A rule picked the fix: let the click lead." (12); strip on screen with label "Chosen by rules, on this laptop" | about -1 s |
| s4 row 12 and 0:39-0:49 | 25-word line, or the 11-word goal line | If a real saved plan exists: the 17-word judge-pass-2 line "This labelled plan is a saved model example. Today's timing cue comes from the keyboard and rules." Else the 11-word line | about -3 s vs the 25-word line; protects the 5.6 s action margin |
| s2 slide 6 (Built / Mock / Future) | Built: loop on keys, cue by rules; Mock: Webex card | Built adds "measured by code"; Mock adds "model plan: saved example"; Future keeps "model wording per take" | 0 |
| s5 never-say | MIDI "hears" line, "implying a live model" line | Add: "AI-powered" for the rule cue; "agentic" as a label; "machine learning" for the pitch tracker | 0 |

### qa-prep-v1 (proposed new entry, Q46)

- Q46. "Show me the model call, or is it all rules?"
  o Answer: "Rules chose today's cue. The model made the plan you saw; here is its saved request and answer, dated Saturday."
  o Back it with the receipt slide. Also add to Q23: the spoken answer in section 4 (41 words, over the 35-word cap of the judge pass; trim "that part is live today" if needed).

### sunday-decisions-sheet (proposed row, next free A number)

| Decision | Default | Fallback |
|---|---|---|
| AI visibility on stage | Strip on the one-fix card (A), saved model receipt in Q and A, "agentic" banned as a label | Slide image of the strip from a real take; no receipt if no real saved call exists |

## Method

- Codex calls: 1 (gpt-6-sol, high; critique of sections 2 to 4, no names; exit 0, no quota error).
  o Kept: (1) "where is the AI" answer must say stage cue used fixed rule text and only the saved plan used a model; (2) say "no learned or generative model", not "not AI"; (3) label each take source ("recorded MIDI events scored now" vs "keyboard retake"); (4) "scores each key press", not "measures every note", on the MIDI path; (8) hand-off is proposed, say so.
  o Kept as notes for the team, not yet edited into tables: (5) call step 4 a "matched practice pattern" and separate "no rule matched" from a confidence score (the "I'm not sure" row is rule-abstention, not calibrated confidence); (6) the proof is two scores on one phrase, no causal claim; (7) offline means local scoring and rule cues only, the model plan and hand-off need a connection.
  o Rejected: none outright; (2) softened rather than reversed, because table column 6 still says "No" to the word AI for rules, which the team should read as "do not volunteer it" not "assert it is not AI".
- Files read: feedback-ledger-v1 (F72, F120, F149, C4, s2), judge-lens-v1 (s1, s4 to s6), tech-feedback-layer (s1, s3, s4, s6 mock mode, s7, s8), take-data-contract (grep), web-app-architecture (slots), idea-bank-v1 (A16, A17), cisco-fit-note-v1 (s3), privacy-design-v1 (LLM line), pitch-v2 (rows, s5), qa-prep-v1 (Q21, Q23), prototype-review-v1 (grep), tech-pitch-detection (s1), build-plan-v1 (grep), nearest-competitors-v1 (grep), objections s1, assistant-benchmark-protocol (header).
- Pages: opened [1]; fetch failed or timed out for [2] (404) and [3] (timeout, twice), so those two are snippet only; [4], [5] snippet. Fewer than 10 fetches were made.

## Open questions

- Does the Saturday build have an hour for the strip (option A)? If not, use a slide image from a real take.
- Will a real saved model call exist by Tuesday's freeze? Without it, the receipt and the 17-word line both fall away.
- Which rule actually fires on the captured take 1 (prototype-review-v1 D1: K3 is fragile)? The strip must show the rule that really fired.
- How do public student-challenge programmes define "AI use"? Not researched this pass: no public rubric found in the pages read; treat judge expectations as unknown.
- Does the team accept "rules, not AI" being said aloud? It is the honest line; it costs some score if judges read rules as non-AI.

## Sources

1. Cisco, "What Is Agentic AI?", https://www.cisco.com/site/us/en/learn/topics/artificial-intelligence/what-is-agentic-ai.html, 2026-11-07, opened. Agentic AI = "autonomous systems that can perceive information, plan complex tasks, and execute decisions independently"; standard automation "follows predefined, rigid scripts".
2. FTC, "Keep your AI claims in check" (Feb 2023), https://www.ftc.gov/business-guidance/blog/2023/02/keep-your-ai-claims-check, 2026-11-07, snippet (page fetch returned 404; wording from secondary summaries: do not exaggerate what the AI does; does the product actually use AI). unverified direct quote.
3. Australian Government, Australia's AI Ethics Principles (Transparency and explainability), https://www.industry.gov.au/publications/australias-artificial-intelligence-ethics-principles/australias-ai-ethics-principles, 2026-11-07, snippet (fetch timed out twice). unverified direct quote; the principle is voluntary.
4. Cisco, "What Is an AI Agent?", https://www.cisco.com/site/us/en/learn/topics/artificial-intelligence/what-is-an-ai-agent.html, 2026-11-07, snippet.
5. Cisco Blogs, agentic-era posts (for example https://blogs.cisco.com/news/one-platform-for-the-agentic-ai-era), 2026-11-07, snippet; the "Autonomous Agentic Loop" wording is from a search summary. unverified.
6. nearest-competitors-v1.md (team file) for Mastery and Maestro wording; its own source tags say opened.
7. tech-feedback-layer.md, tech-pitch-detection.md, build-plan-v1.md, pitch-v2.md (team files).
