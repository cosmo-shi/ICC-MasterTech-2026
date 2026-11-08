# Assistant benchmark protocol: can a free general assistant coach a take the way our layer does?

- Date: 2026-11-07 (AEDT), written overnight for the Saturday-evening slot (run it Saturday 7 Nov after the voice-path proof); sources accessed 2026-11-06.
- Purpose: settle the adviser objection "why not just use another AI model" with evidence the team may quote in Q and A.
  o Today the answer rests on an untested claim (objections-and-research-gaps.md section 2: general assistants were never benchmarked).
- Scope: 45 minutes, five recorded takes of Ode bars 1 to 2 with known faults, two free consumer assistants (a third if time), three fixed prompts, one scoring table.
  o Q and A only. Never on stage as a comparison claim, whatever the result.
- Status: overnight draft for the team; verify before the pitch. Nothing in this file has been run; every threshold marked `team choice` is ours.
  o This is a feasibility check (one singer, one phrase, one day), not an accuracy study; a Codex critique (Method) tightened sections 2 to 4.
- Bottom line: run Gemini app (clip upload) and ChatGPT Free (live voice) on the same five takes; the pass bar is 18 of 20 points and no more than 2 points below our own layer's end-to-end score.
  o Official pages opened say nothing about pitch, notes or timing accuracy for any assistant; "nothing stated" is not "cannot do", so the test is needed.
  o Biggest finding while designing: our v1 rules have no cue for ONE sharp note (V5 is flat-only, V7 needs 60% of notes); the test will show it as a miss for us.

## 1. What the protocol decides
- Three outcomes, set by numbers before anyone listens.
  o S = an assistant's score out of 20 on the five sung takes; O = our layer's end-to-end score on the same takes.
  o Both assistants' scores are always reported, never only the better one.

| Outcome | Rule (team choice) | The one sentence the team may say (Q and A only; fill brackets with measured values) |
|---|---|---|
| 1. Assistants fall short | S 9 or less, OR the note or beat named on 2 takes or fewer, OR a false fault claimed on the clean take by every assistant | "We played five takes with known faults to [assistant A] and [assistant B] on their free tiers on [date]. The best named the right fault on [x] of 5 takes and the note or beat on [y] of 5. One phrase, five takes, not a study." |
| 2. Partly | Anything between outcomes 1 and 3 | "Free assistants heard some of five known faults and missed or invented others: [x] of 5 right, [n] false claims. We checked every note against the phrase; we tested five takes, not a classroom." |
| 3. Matches | S 18 or more AND S at least O minus 2 AND O from the end-to-end run AND note or beat named on 4 takes or more AND no false fault on the clean take AND repeat chats agree (section 5) | "On our five takes, [assistant] found the fault about as well as our measurement, [S] against [O] of 20. Our difference is the retake check, offline use and the hand-over to a teacher, not the listening." |

- Fixed rules for every outcome:
  o Never say "better than", "beats" or a vendor ranking; say what was tested, when, the free tier, and the count.
  o Name vendors only if asked, and only with the date and the tier; models and free tiers change without notice [3].
  o If both assistants refuse the clip or only talk about the words, that is outcome 1 with the line "the free tier would not take the clip", plus the refusal text saved.
  o One day, one phrase, one voice, two tiers: no sentence may generalise past that.

## 2. Test set

### The fixed phrase (from tech-voice-path-proof.md and demo-phrase-and-rights.md)
- Ode to Joy bars 1 to 2, `phrase_id` "ode-b1-2", key C, `bpm` 60, `beats_per_bar` 4, `count_in_beats` 4; expected onsets 0, 1000 ... 7000 ms.
  o Notes by `i`: 0 E4 (64), 1 E4 (64), 2 F4 (65), 3 G4 (67), 4 G4 (67), 5 F4 (65), 6 E4 (64), 7 D4 (62).
  o If the singer needs the range shift (tech-voice-path-proof.md: minus 2 semitones), rewrite every name and MIDI number once, in the sheet, before recording; the faults stay on the same `i`.
- Tempo is 60 bpm here (the phrase file says 90) because the fixtures use 60 bpm and a 1000 ms beat keeps the hand-marking easy.

### Five takes and their ground truth
- Ground truth is written in take-data-contract.md field names (`take-features/v1.1`): per note `status`, `cents_off`, `octave_off`, `onset_ms` (negative = early); per take `summary.*`.
- Same fault, two versions: K = keyboard (exact, scripted), V = sung (the learner case, measured). V is the scored set; K is the ceiling check.

| Take | Fault planted | Ground truth (contract fields) | Our v1 rule that should fire | K version, made from MIDI | V version, sung on "loo" |
|---|---|---|---|---|---|
| T1 | None: in tune, on the beat | all `cents_off` within 25; all `onset_ms` within 100 (the one clean threshold, used for every non-target note in every take); `notes_in_tune` "8/8"; `missed_count` 0 | none (a pass message) | Quantised clean MIDI: 900 ms notes, velocity 80 | Sung steady; confirmed by tracker and tuner (below) |
| T2 | One sharp note | `i`=3 (G4): `cents_off` +80, `status` "hit"; the other seven within 25; `notes_in_tune` "7/8" | None: V5 is flat-only, V7 needs 60% of notes (tech-feedback-layer.md s3) | Pitch bend on note 3 only: 8192 plus 3277 = 11469 on the default plus-or-minus 2 semitone range (80 / 200 x 8192, our arithmetic) | Sing the fourth note about a fifth of a semitone up; confirm 60 to 100 cents |
| T3 | Rushed (drifts early) | `onset_ms` offsets 0, -50, -100, -150, -200, -250, -300, -350 vs expected; median -175, so `summary.onset_median_ms` -175 | V11 (median -120 or earlier, voice); K3 cannot fire here (open question 3) | Script shifts onsets to 0, 950, 1900 ... 6650 ms | Sing slightly ahead of the count; confirm median -120 or earlier and last note -250 to -400 |
| T4 | Skipped note | `i`=5 (F4): `status` "missed", `played_i` null; `missed_count` 1; `notes_in_tune` "7/8" | X2 (skipped note), proposed in the contract | Delete note 5 from the MIDI | Rest through the sixth note; others on time |
| T5 | Octave slip, one note | `i`=6 (E4): `octave_off` -1, `cents_off` about 0; `octave_off_notes` 1 | X1 (octave), proposed in the contract | Note 6 transposed down 12 (MIDI 52) | Sing the seventh note an octave down |

- Why one fault per take: the objection's question is "what should I fix"; a take with two faults makes "did it name the fault" unscorable.
- Why these five: they are the contract's own failure types (fixtures F03, F04, F16 and F11 to F14 cover the same classes) so our layer has a ground-truth path.

### How the K set is made (before the evening, not inside the 45 minutes)
- Play the phrase once on the MIDI keyboard into a DAW or script, quantise to the table, render with one piano sound and four clicks at 60 bpm; export WAV and keep the .mid.
  o The .mid IS the ground truth for K: onsets and pitches are exact, nothing is measured.
  o Apply each fault by script, never by playing it badly, so the five files differ in one thing only.
  o Verify the exported WAVs, not just the .mid: run the tracker on them and check note 3 of T2 reads about +80 cents and its neighbours within 25 (bend range and reset depend on the instrument).

### How the V set is made and confirmed (inside the 45 minutes)
- One singer, headphones, the same phone mic; the singer speaks "one, two, three, four" on the beat, then sings; the spoken count is the beat reference the assistant also hears.
- Confirm every V take BEFORE any assistant hears it, with the voice-path method (tech-voice-path-proof.md section 4 step 6): tracker plus second method plus a tuner app, onsets hand-marked on the waveform.
  o A take is accepted only if the planted fault meets the table threshold and every other note meets the clean threshold (within 25 cents and 100 ms; T3 timing excepted); anything else rejects it.
  o Up to three recordings per take; keep the first accepted one; log every rejection. Never choose a recording because an assistant liked or disliked it.
- Write the ground truth into a sealed sheet (one row per take, contract names) and do not show it to the scorers until all chats are saved.
- Clip hygiene: files named clip-a to clip-e (random letters, no fault in the name, metadata stripped), same sample rate, 8 to 14 seconds each.

## 3. The assistants and the exact prompts

### What is known about access (opened pages; details in Sources)
| Assistant | Takes an audio clip? | Says it hears music, pitch or notes? | Free tier or price |
|---|---|---|---|
| Gemini app | Upload: "Total audio length can be up to 10 minutes"; Google AI Pro or Ultra raises it to 3 hours [2] | App pages opened say nothing on music or pitch [2][4]; the developer page lists "emotion detection in speech and music" and non-speech sounds, nothing on pitch, notes or tuning [1] | Free signed-in account used; limits are compute-based and unnumbered [3]; AI Pro AU price not found (US$19.99 from a search snippet [12]) |
| ChatGPT Free | Audio upload is paid-plans only (search snippet of the help page; the page itself returned 403) [9]; live voice is available to free users, about 2 hours a day (snippet, conflicting reports) [8] | Not stated on any page opened (the pages blocked) | Free; no paid plan used |
| Claude Free (optional third) | File upload article lists documents and images, no audio [6]; voice mode is live speech and is on the Free plan [5] | Voice article: "you speak to Claude, and Claude speaks back"; nothing on music [5] | Free plan includes voice mode [7]; Pro US$20 a month, not used [7] |
| Copilot (not tested) | Microsoft 365 Copilot does not support audio files (2025 forum snippet [11]); consumer app unverified | Not opened | Not opened |

- Gemini Live page: camera and speech only; "does not say whether it can hear sounds, music or singing" [4].
- No official page opened states note-level or pitch accuracy for any assistant. This is an absence in opened pages, not proof.

### Choice and how audio is given
- Assistant A: Gemini app on a free signed-in account, clip uploaded as a file (clean path, no room in between).
- Assistant B: ChatGPT Free, live voice mode on a phone, clip played from a laptop speaker 30 cm from the phone mic at a fixed volume in the quiet room.
  o The path differs from A on purpose: this is how a free learner reaches it. Log the path; do not compare A and B on acoustics, compare each to ground truth.
  o Decide the path for B at the minute-5 smoke test (upload if the Free tier accepts it, else speaker) and keep it for every take; never switch mid-run.
- Assistant C (only if minutes allow): Claude Free voice mode, same speaker path as B.
- Smoke test (minutes 0 to 5): one throwaway clip, not in the set; log "accepted", "refused" or "talked about words only" with a screenshot.
- No-clip control (same minutes): send P1 to A and to B with NO audio, once each; save the reply.
  o The prompts name the notes and tempo, so a plausible critique can be guessed; a fault class that the no-clip reply also names earns no credit on the take.

### The three prompts (same wording, every assistant, every take, a NEW chat per take)
| Prompt | Exact text for the sung set (the keyboard set swaps "sang" for "played on a keyboard") |
|---|---|
| P1 | "I just sang this phrase. It is the opening of Ode to Joy in C major, eight notes: E E F G G F E D, at 60 beats per minute after a count of four. Was that in tune, and was it on the beat? What should I fix?" |
| P2 | "Which note, if any, was out of tune, and which beat, if any, did I come in early or late? Please name the note number or the beat number." |
| P3 | "Give me one thing to change on my next try and a two-minute way to practise it." |

- P1 is the objection's own question. P2 and P3 follow in the same chat; nothing is added or explained between them.
- The prompts name only pitch and timing. A skipped note or an octave slip counts for credit only if the assistant raises it unprompted.
- Voice mode: read the prompts aloud in the same words; the scorer copies the transcript from the app into the log.
- Free-tier limits can cut a session: record "limit hit" with the time and continue after the other assistant; never switch tier.

## 4. Scoring table

### Per take and assistant: four points, one each (0 or 1)
| Point | Gets 1 when | Gets 0 when |
|---|---|---|
| Named the fault | Any reply names the right class: sharp or off pitch (T2), early or rushing (T3), a missing note (T4), wrong octave (T5), or "no fault, good" (T1) | Wrong class, generic ("keep practising"), refuses, or says it cannot hear |
| Named the note or beat | Names the exact numbered position (1-based: T2 fourth note, T4 sixth, T5 seventh; a bare note name counts only if it identifies one position); T3: names notes 5 to 8, the later notes, or a drift that grows; T1: states no fault location | Names no location, a different position, or a repeated note name that fits two positions |
| Fix is actionable | A concrete step tied to the named fault that a learner can do in two minutes (for example "slow down, match the click"); T1: any concrete next step that fixes nothing that was not broken (a new tempo or phrase) | Generic ("keep practising") or tied to a fault that was not there |
| Said nothing false | No statement the ground truth contradicts: no invented fault, no wrong direction ("flat" on T2, "late" on T3), no invented number, no note that was not sung; on T1 any asserted or located fault claim, hedged or not | One or more false statements; each is listed in the log |

- Pitch in cents or ms cited by an assistant is checked against ground truth; a number outside 25 cents or 100 ms of it counts as false; a range counts if both ends are inside.
- Also report a lenient location score (within one position) beside the strict one; the verdict uses the strict one.
- Credit is per take across P1 to P3, not per prompt; false claims are counted across all three.
- A missing reply (limit hit, refusal) scores 0 on all four points for that take and is counted as "not run"; report the score on answered takes too, so access failure is not read as bad listening.
- Totals: 4 points x 5 takes = 20 per assistant; T1 is the false-alarm check, so a flattering fault on T1 loses the fourth point and usually the first.

### Our layer on the same five takes (the baseline, so the test cannot flatter us)
- Score our layer with the same table from its real end-to-end output on the V clips (the tracker from the voice-path test feeding the rules table).
  o If the engine is not wired, apply the rules table by hand to the measured features and label it "rules applied by hand"; that tests rule choice, not the tracker, so outcome 3 cannot be declared on it.
- Expect T2 to score low for us (no single-sharp rule); report it, and name it as a rule to add rather than hiding it.

### Pass bar for "an assistant does what we do"
- All must hold on the V set:
  o S 18 or more of 20, S at least O minus 2,
  o 4 or more takes with a named note or beat (T1 counts only if no location was claimed), and T1 free of false faults.
  o 18 of 20 is a team choice; it allows any two lost points, but the other conditions rule out two missed fault classes (that would break the note-or-beat count or the O gap).
- Honesty rules that stop the test leaning either way:
  o Two scorers fill the table apart, replies labelled X, Y (and Z), not by vendor; they settle each disagreement against the sealed sheet in one minute, else that point scores 0 for every system (our layer included).
  o The scorers read the sealed sheet only after all chats are saved; replies are pasted verbatim.
  o Order differs per assistant: A runs T3, T1, T5, T2, T4; B runs T4, T2, T5, T1, T3; C (if run) T2, T4, T1, T3, T5.
  o Repeat check: re-run T4 (then T2 if time) in a fresh chat for BOTH assistants; outcome 3 needs the same fault class both times.
  o Primary assistants are A and B, fixed now; C is reported separately and never replaces a weaker A or B.
  o A "model thinks" or "reasoning" mode is off or default; the exact model name on screen is logged.

## 5. Time plan
| Minutes | Who | Action |
|---|---|---|
| Before (outside the 45) | Tech lead | K clips scripted from the MIDI, named clip-a to clip-e (a second set of letters); accounts signed in on two phones; sealed sheet template printed |
| 0 to 5 | All | Roles; smoke test on a throwaway clip for A, B (and C); no-clip control for A and B; log accept or refuse; fix B's path |
| 5 to 15 | Singer, tech lead | Record and confirm five V takes (three tries max each); write ground truth into the sealed sheet |
| 15 to 33 | Two operators, one phone each | A runs five takes x P1 to P3 (about 3 minutes a take, 15 total); B the same in its own order; the third teammate pastes replies into the log, silent |
| 33 to 38 | Tech lead | Repeat check on T4 for both assistants (T2 if time); optional K ceiling on T2 and T5 only if A or B scored 9 or less |
| 38 to 45 | Two scorers | Fill the table apart; open the sealed sheet; tally S, O, false claims; apply section 1; write the one sentence with real numbers |

- Stop rule: at minute 45 stop. Unrun cells score 0 and are marked "not run"; an assistant with fewer than 3 takes run gets no verdict.
- Stop early if both assistants refuse audio at minute 5: record the refusals, declare outcome 1 for the free tiers tested, use the time for the voice-path rows.
- Never stop to retry a take because the answer was unflattering; never re-ask a prompt.
- Save: the 5 clips (not shared outside the team), the replies verbatim, the model names, the sealed sheet, the filled table, with the date and time.

## 6. What a result changes
| Outcome | pitch-v2 line | qa-prep-v1 answer (Q4 and the "Where is the AI?" family, Q23) | sunday-decisions-sheet row A21 |
|---|---|---|---|
| 1. Falls short | No change to the stage script; no comparison line is ever added on stage | Replace "we have not proved learners prefer the loop" companion with the outcome 1 sentence and the counts; keep "assistants can listen and chat" | A21 can stay a proposal; bounded phrase goals are still wise for the privacy gain, but the case rests on goal clarity, not on assistant weakness |
| 2. Partly | No change | Use the outcome 2 sentence; add the specific faults it missed, for example "it missed the skipped note" if measured | Keep A21 as proposed: a bounded set of supported phrase goals lets measurement carry the cue |
| 3. Matches | Drop any hint that listening is our edge; the stage line leans only on the retake check, the offline path and the teacher hand-over | Use the outcome 3 sentence; move the answer to "retake proof, offline, hand-over, and a pilot with teachers"; say we do not claim better listening | Strengthen A21: if assistants can split a free-typed goal and hear a take, the product must rest on bounded phrase goals and the retake loop |
- Whichever outcome: update the pitch-v2.md model line (section 4 row 12) only if it implies the model listens; the stage rule stays "rules on the device, model cached".
- A result is one hour on one voice and one phrase; qa-prep-v1 Q5 and Q6 wording still applies (we have not proved this works for learners).

## Method
- Read in order:
  o session-rules.md, state-of-play-2026-11-06.md, RESUME.md (head), functional-requirements-v0.md (skimmed), then objections-and-research-gaps.md section 2, tech-voice-path-proof.md (pass bar, test script),
  o take-data-contract.md (fields, fixtures, rules X1, X2), tech-feedback-layer.md section 3 rules table, qa-prep-v1.md Q4 and Q23, competitor-feedback-mechanics-v1.md section 5, demo-phrase-and-rights.md (Ode notes), sunday-decisions-sheet.md (A21 row).
- Web: opened Gemini app file-upload page, usage limits page, Gemini Live page, Gemini developer audio page, Claude voice and file-upload articles, Claude pricing;
  o OpenAI help pages and pricing returned 403, so ChatGPT claims are search snippets only; Copilot and AU prices are snippets or not found.
- Arithmetic is ours: 80 / 200 x 8192 = 3277 bend steps; onset median of the rushed take; 7000 / 1.1 = 6364 ms for a 10 percent rush.
- Codex call 1: gpt-6-sol, medium, critique of sections 2 to 4 (names stripped, no team ideas; described as a generic melody-fault test); exit 0; 15 points returned.
  o Folded after checking each against the draft:
    o pass bar wording (S at least O minus 2); end-to-end baseline; single clean threshold; fixed path for B; no-clip control;
    o exact numbered positions plus lenient score; T1 and T3 scoring defined; direction-wrong counts false; hedged T1 claims; symmetric adjudication and blinded labels; both assistants repeated; K WAV verification; not-run reporting.
  o Kept as stated limits, not fixed: one singer and one take per fault (feasibility check only); prompts name the phrase (mirrors what the app knows; the no-clip control measures the guess rate).
  o Not folded: a separate blinded-reference condition (no time in 45 minutes).

## Open questions
1. Which two assistants does the team really have signed in on Saturday, and does ChatGPT Free accept an audio upload today (the snippet says no)?
2. Does the voice-path test finish before 19:15 so the same singer, phone and room can be reused here?
3. Can K3 (keys speeding up) ever fire at 60 bpm inside the matcher window? A 10 percent rush needs the last note about 636 ms early, past the 400 ms window (our arithmetic); decide before Saturday.
4. Add a rule for ONE sharp top note (mirror of V5) before the test, or accept the miss and report it? A miss is the honest default.
5. Is 18 of 20 the right bar, and who are the two scorers (a teacher or the mentor would be a stronger second scorer)?
6. Does a speaker path for ChatGPT voice mode disadvantage it unfairly; run the Gemini clip by speaker as well for one take?
7. Who owns the sealed sheet and the pasted replies, and where do the clips live (team-only, never shared)?

## Sources
1. https://aistudio.google.com/docs/audio (redirect from ai.google.dev/gemini-api/docs/audio); accessed 2026-11-06; opened.
2. https://support.google.com/gemini/answer/14903178 (upload files to Gemini Apps); 2026-11-06; opened.
3. https://support.google.com/gemini/answer/16275805 (Gemini Apps limits); 2026-11-06; opened.
4. https://support.google.com/gemini/answer/15274899 (Gemini Live); 2026-11-06; opened.
5. https://support.claude.com/en/articles/11101966-using-voice-mode; 2026-11-06; opened.
6. https://support.claude.com/en/articles/8241126-uploading-files-to-claude; 2026-11-06; opened.
7. https://claude.com/pricing; 2026-11-06; opened (USD only).
8. https://help.openai.com/en/articles/8400625-voice-mode-faq; 2026-11-06; snippet (page returned 403; free-tier 2 hours a day came from a search summary and reports conflict).
9. https://help.openai.com/en/articles/8555545-file-uploads-faq (also 8983675); 2026-11-06; snippet (403; "audio supported on paid plans, not Free" from a search summary).
10. https://openai.com/chatgpt/pricing/; 2026-11-06; not opened (403); ChatGPT paid prices `unverified`.
11. https://techcommunity.microsoft.com/discussions/microsoft365copilot/working-with-audio-files-in-copilot/4435850; 2026-11-06; snippet (Microsoft 365 Copilot, not the consumer app).
12. https://www.techradar.com/computing/artificial-intelligence/google-ai-pros-new-annual-subscription-brings-you-big-savings-heres-how-it-compares-to-chatgpt; 2026-11-06; snippet (US$19.99 AI Pro; no AU price found).
13. Team files in this folder, 2026-11-06: tech-voice-path-proof.md, take-data-contract.md, tech-feedback-layer.md, demo-phrase-and-rights.md, qa-prep-v1.md, objections-and-research-gaps.md, sunday-decisions-sheet.md.
