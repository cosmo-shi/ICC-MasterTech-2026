# Voice output decision v0: should the coach speak its fix, show it, or both?

- Date: Sat 7 Nov 2026 09:35 (AEDT), written from Carlos's question of 09:31; sources opened 2026-11-07.
- Question: text only, spoken only, or both, given the build capacity and that a prototype may stage things.
- Scope: voice OUTPUT (the coach speaking its line). Voice INPUT (singing, L15 to L18) is a separate SHOULD and is not changed here.
- Status: proposal for the team; nothing built or timed; every hour is a team estimate, unverified.

## 0. Recommendation (conclusion first)

- Both: the fix is always on screen as one sentence; the coach also speaks it.
- On stage, speak with recorded human lines for the fixed cues; browser speech only as the fallback for dynamic text.
- If time runs out, text only; the demo loses little because the presenter can read the line.
- Staging is allowed where it is a real design (recorded lines); never where it claims a detection or a model that did not happen.
- Cost fits the research and UX lead's spare hours; the only coding is about half an hour of embedding.

## 1. The three options

| Option | What the judges see | Build (team estimate, unverified) | Risk on stage | Verdict |
|---|---|---|---|---|
| Text only | The sentence appears; the presenter reads it | 0 h | None | The floor; always present |
| Browser speech (Web Speech API, speechSynthesis) | The laptop speaks the sentence in a system voice | 0.5 h, plus a test on the stage laptop | Voice differs per machine; a remote voice breaks the no-network rule; sounds like a robot | Fallback for dynamic lines only |
| Recorded human lines | A warm voice speaks each fixed cue | 1 to 1.5 h (write, record, trim, embed) | Hall audio route (stack-review U3, U15) | The stage choice |
| Both (text, recorded lines, speech fallback) | Sentence on screen and spoken | 1.5 to 2 h | Same as above | Recommended |

## 2. Why speak at all

- Hands on the keys and eyes on the hands: a Year 5 to 6 learner cannot read a screen mid-phrase (age-band-evidence-v1 s1 lean).
- The fix is one sentence; spoken once it takes about 3 s (unverified), inside the demo's 22 s of silent playing (pitch-v2, demo word count).
- Visible AI is a top judging risk (judge-lens-v1 s6); a human voice reads as a product, a robot voice reads as AI.
- The "what is pulse" exchange needs a spoken answer and a ten-second task, which text alone makes slow.
- It is the natural channel for the shy-learner stance in social-and-fear-evidence-v1: one calm line, never a score.

## 3. Staging that stays honest

| Trick | Honest? | Why |
|---|---|---|
| Recorded cue lines played when the rule fires | Yes | A real product design; many apps ship recorded lines; say "recorded lines" if asked |
| A presenter key that advances the demo if the detector misfires | Yes, if labelled | Same rule as the take: the fallback banner "RECORDED FALLBACK - NOT LIVE" (pitch-v2); say "demo control" in Q and A |
| Playing a cue line the detector did not fire | No | It claims a detection; judges will ask how often the cue fires (qa-stale-answers-v0 s2) |
| Calling the browser voice "our voice model" | No | No model runs on stage; the model slot is one saved, labelled call (model-slot-options-v0) |

- The voice reads the coach's line and nothing else; no music is produced or played by it.

## 4. Build plan by role

| Step | Role | Hours (unverified) | When |
|---|---|---|---|
| Write the cue lines in Year 5 words (K1, K3, X2, the retake line, "what is pulse") | Research and UX lead | 0.5 | Saturday afternoon, after the 12:00 contract freeze |
| Record the lines on a phone or the OBS microphone; trim | Research and UX lead | 0.5 to 1 | Saturday evening or Sunday |
| Embed as data URIs in the single HTML; play between takes; text stays | Model and web lead | 0.25 to 0.5 | Sunday or Monday |
| Browser speech fallback, local voice only (`localService` true) | Model and web lead | 0.25 | Monday |
| Hear it on the stage output | Rig lead | Inside U3 and U15 | Monday in the room |

- Capacity: the research and UX lead has about 3.65 h realistic slack (menu capacity table: 9.4 h against 5.75 h MUST); the recording fits there.
- The model and web lead has no slack after G7, O1 and O2 move (14 h against 12.4 h); the embedding displaces a SHOULD or the UX lead pastes the data URI block.
- Order: cue wording freezes at 12:00 (decision 2); record Saturday; re-record only lines the teacher review changes.

## 5. Stage timing

- The demo is a fixed 60 s block with about 22 s of silent playing (pitch-v2, demo word count).
- Two spoken lines, the fix after take 1 and the retake result, about 6 s together (unverified until timed).
- The presenter stays silent during a spoken line, so no words are added to the 2:45.5 clock.

## 6. Risks and guards

| Risk | Guard |
|---|---|
| Venue sound is not routed from the laptop | questions-for-sponsor row 46 asks; U3 on Monday; the on-screen sentence carries the line if the hall is silent |
| The browser voice is remote and needs the network | Pick a voice with `localService` true; test with the network off |
| A robot voice reads as AI | Recorded human lines on stage; browser speech only for dynamic text |
| The line talks over the learner | Play lines only between takes, never during one |
| The line is too long to follow | One sentence, under 12 words, team rule |

## Method

- Written by the session from the question, the named project files (opened) and one reference page (opened); no Codex call, no names beyond session-rules.md.
- Hours are team estimates and unverified; nothing has been built, recorded or timed.
- Capacity figures come from feature-feasibility-menu-v1 (capacity table) as read on 7 Nov; they move if the team changes scope.

## Open questions

- Is the venue sound routed from the laptop, and through which lead (row 46; U3 Monday)?
- Does the teacher review of the cues land before or after the lines are recorded?
- Does the embedding displace a SHOULD item, or does the UX lead paste the block?
- Do two spoken lines fit inside the 60 s demo once timed on the real rig?

## Sources

- MDN, SpeechSynthesisVoice: localService, https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesisVoice/localService, opened 2026-11-07.
  o Quote: "returns a boolean value indicating whether the voice is supplied by a local speech synthesizer service (true), or a remote speech synthesizer service (false.)"
  o The page lists the feature as widely available across browsers since September 2018.
- feature-feasibility-menu-v1.md (capacity table; L15 to L18 are voice input), opened 2026-11-07.
- stack-review-v1.md (U3, U15, the audio route risk, the venue sound question), opened 2026-11-07.
- questions-for-sponsor.md row 46 (audio path and who supplies each lead), opened 2026-11-07.
- pitch-v2.md (fixed 60 s demo, about 22 s silent playing, 2:45.5 clock), opened 2026-11-07.
- judge-lens-v1.md s6 (visible AI as a top risk), as cited in success-conditions-v1 Panel chair read, 2026-11-07.
- decisions-log.md rows 32 and 37 (recorded clip on the public-domain phrase; voice-path claims gated), opened 2026-11-07.
