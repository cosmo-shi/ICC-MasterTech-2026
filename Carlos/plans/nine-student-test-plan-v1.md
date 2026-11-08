# Nine-student test plan v1: voice version, two evenings, 20 minutes each

- Date: Fri 6 Nov 2026 (AEDT), revised overnight against a no-web methods critique. Parent: nine-student-test-plan.md (v0, unchanged).
- Purpose: the learner test that produces the numbers for success criteria C1 to C5 (success-criteria-draft.md). Voice-first loop: one phrase, one cue, one retake. Adults only (18+), no names, no audio kept.
- Recommendation (conclusion first): keep the voice design; make the wobble count a frozen script on an equal-length window; report counts only (no p-value); send the ethics summary now and treat the NHMRC triggers as "consider review", not "approval required".
- Status: overnight draft for the team; verify before the pitch. Risk triage, not legal advice. Items marked `unverified` are not checked.

## 0. Change log (v0 to v1)
| # | v0 | v1 | Why | Source |
|---|---|---|---|---|
| 1 | Wobble segment trimmed 250 ms each side of the detected note | Fixed 1.5 s window from 250 ms after the detected held-note onset; never cut by the detected end | The end moves as breath runs out; a short retake must not look like fewer wobbles | Critique M3, M6 (reasoned) |
| 2 | Short octave jumps (under 100 ms) ignored | Any frame 900 cents or more from the reference is dropped as unvoiced; over 10% dropped = unscorable | Octave flips are not always short; "ignore" was a hidden judgement | Critique M5 |
| 3 | Gaps not defined | No interpolation; a breath or unvoiced gap ends an excursion; gap and coverage limits fixed | Gaps fragment or hide excursions | Critique M4 |
| 4 | "Same number for everyone" | Number comes from one frozen script; scorers independently judge flags and match; blind to group, order and cue | Two people agreeing on a vague rule proves nothing | Critique M1, scorer note |
| 5 | Headroom = 3 or more wobbles in take 1 | Headroom measured on the take just before the cue (take 2 for B and C); old (3 or more) and new (1 or more) side by side, choice in Open questions | B and C are cued after take 2; regression to the mean | Critique; source 8 snippet |
| 6 | C1 judged "over scorable pairs with headroom" | C1 headline is x of 9 (all nine as denominator), plus m scorable, median change and range among m | No hiding of the hard cases | Critique, accepted |
| 7 | Ethics: "not QA by NHMRC's test; written determination before recruiting" | NHMRC triggers read as grounds to consider review and follow the National Statement; written reply from the organiser asked for, not asserted as required | The 2014 text (opened) says "consideration" and "should be followed", not "full review" | Source 1 opened |
| 8 | Fallback "drop B and C" | Fallback is a rehearsal, or keep the design and wait; dropping controls never presented as a way past review | Prototype trigger stays; privacy and consent stay | Critique; source 1 |
| 9 | Consent about 100 words | About 145 words: adds allocation, withdrawal limit, retention, use at the pitch, contacts, offline | National Statement list of information (2.2.6) | Source 2 opened |
| 10 | "Do not say AI; say the app suggests one thing" | If asked, answer truthfully: rules on the phone, plus a language model online | Honesty; demand-effect critique | Critique; privacy-design-v1.md 5.1 |
| 11 | Booking by first name | Slot codes only (S1 to S14) | Critique privacy point | Critique |
| 12 | Phrase "10 seconds" | Phrase is a placeholder; test candidate Twinkle bars 3 to 4 at 60 bpm, about 8 s with one 2-beat held note | take-data-contract.md fixtures; arithmetic: 1+1+1+1+1+1+2 = 8 beats at 60 bpm | Team files |
| 13 | B and C kept as two arms | Simplest fix offered: one "no cue yet" arm with the same screen text | "Ready" and "Try again." both prompt a repeat; contrast too weak | Critique |
| 14 | "Harder test" for B and C take 2 to 3 | "After delayed feedback, practice and order stacked" | Not necessarily harder | Critique |
| 15 | Ten pitfalls, 11 rows | Ten ranked risks, each with a mitigation (section 11) | Task and critique | Critique |
| 16 | Honest sentences by threshold | Three stage sentences filled with x, y, z, m, d (section 10) | Critique wording, adapted | Critique |
- Codex re-check folded in (section Method): C1 vs V9 stated; script, filter order and test traces published; secondary accuracy measure made absolute; denominators for all nine and for eligible pairs; chance figures labelled a hypothetical; withdrawal link and deletion date; C5 trials fixed; "rehearsal" limited to teammates.
- Numbering note: the ledger sits at 0.1 (as in privacy-design-v1.md) so sections 1 to 13 and Appendix A keep their v0 numbers.

## 0.1 Critique ledger (every point from the methods review, with a verdict)
- Statuses: accepted (with evidence), corrected, rejected (reason), `unverified`. The critique had no web access: each claim was treated as a lead.
- "Reasoned" means no outside source was needed or found; I counted those as `unverified` in the final tally because nothing external confirmed them.
| ID | Critique point | Verdict | Evidence |
|---|---|---|---|
| M1 | Rule not reproducible; freeze tracker, frame interval, boundaries, window maths, missing frames, merging; one deterministic script | Accepted | Reasoned, `unverified`. Section 7 |
| M2 | Vibrato can cross 50 cents; call it "counted pitch excursions"; flag periodic modulation | Accepted | Vibrato page: typical peak-to-peak 50 to 150 cents, 5 to 7 Hz, slower than about 4 Hz heard as wobble [9] opened. Prame's plus or minus 34 to 123 cents came in a search summary with no clear URL: `unverified` |
| M3 | Scoops may extend past the 250 ms trim; fixed interior window anchored to onset | Corrected | Anchor is the detected held-note onset (singers enter late); window length fixed by the score. Reasoned, `unverified` |
| M4 | Breaths fragment or hide excursions; never interpolate; report interruptions | Accepted | Reasoned, `unverified` |
| M5 | Short octave jumps are not necessarily artefacts; flag by fixed rule; unresolved = unscorable | Accepted | Fixed rule in section 7. Reasoned, `unverified` |
| M6 | Shorter retake means fewer chances; equal-duration window; too short = unscorable | Accepted | Reasoned, `unverified` |
| M7 | One sustained deviation counts once; median hides mistuning; add time outside band and target-note error | Accepted | Secondary measures, section 7 |
| M8 | Blind scorers to group, order and cue; keep independent counts; report agreement; rehearse on hard traces | Accepted | With a deterministic script the "count" cannot disagree; scorers disagree on flags and cue match. Reasoned |
| M9 | Retake improvement is descriptive only; report all pairs, x of 9, m scorable, median and range, exclusions | Accepted | Sign test needs paired, independent differences and drops ties [7] opened |
| M10 | One or two excursions still give headroom; only zero gives none; wobbly baselines invite regression to the mean; eligibility on the actual pre-cue take | Accepted for pre-cue take and regression; headroom threshold left as a choice | Regression to the mean without a control: snippet [8]. Side by side in section 4 |
| M11 | Pooled nine has no concurrent control; the 3-3-3 start does | Accepted | Already in v0; kept. Section 9 |
| M12 | Comparison table (A vs B, A vs C, B vs C, B/C 2 to 3, ratings) | Accepted, partly | B vs C added as "weak"; "harder test" dropped |
| M13 | Balance assignment within each evening, equal waiting time and instructions, same facilitator, initial contrasts first | Accepted | Section 9 |
| M14 | Reduce demand effects: private ratings, neutral wording, scripted, log deviations; answer AI questions truthfully | Accepted | Cards already in v0; AI line changed (section 5) |
| M15a | Correct mapping: C3 is usefulness only; C4 is "I know what to do next"; trust, homework and another phrase secondary | Rejected as stated | success-criteria-draft.md (the team's text) puts trust and usefulness in C3 and another phrase and homework in C4, with know-next as an extra. Side by side in section 6; choice in Open questions |
| M15b | C2 needs all-nine latency plus explicit failures | Accepted | Already in v0 and the draft criterion |
| M15c | C5 is one named phone and browser, not low-end phones in general | Accepted | The criterion says "one named low-end phone"; claims will say "on one named phone" |
| M16 | Ethics reading "partly right but over-cautious": the NHMRC items are triggers for considering review and following the National Statement, not automatic full HREC review or written clearance | Accepted | NHMRC 2014 text opened [1]: "triggers for consideration of ethical review"; "the guidance provided in the National Statement ... should be followed". Review level "if required" is for the organisation |
| M17 | Adults-only, unpublished, outside university auspices are circumstances, not exemptions; 2025 Statement current from 23 June 2026 | Accepted | Curtin page opened: "took effect from 23 June 2026" [4]; NHMRC page itself: search snippet only (fetch timed out) [3] |
| M18 | Minimal path: one-page summary, establish governance, document the reply; never drop controls to evade review | Accepted | Section 3. UQ procedure (opened) says its ethics office can be contacted to decide the pathway [5] |
| M19 | Consent needs pitch use, retention and access, withdrawal limits, contacts, differing timing; verbal consent can be fine; log it | Accepted | National Statement 2.2.5 (verbal consent) and 2.2.6 (list incl. complaint contact, privacy, withdrawal, dissemination) [2] opened |
| M19b | Critique's link ends "-25.pdf" | Corrected | Link answers HTTP 200 as a PDF (headers only checked); I cite the "-2025.pdf" file I opened [2] |
| M20 | Code the bookings; strip identifying comments; verify deletion from caches before promising it | Accepted | Section 2 and rehearsal in section 13 |
| M21 | Suggested 150-word script | Adapted | Section 3 script; its "random allocation" wording replaced by "slightly different screens" |
| M22 | Ten likely problems with mitigations | Accepted, rewritten | Section 11 |
| M23 | Stage sentences for improved, mixed, no change | Accepted, adapted | Section 10 |
| M24 | B vs C weak because "Ready" already prompts a repeat | Accepted | Section 9 fix |
- Not in the critique but found while verifying: with nine pairs, "5 of 9 improved" is what chance gives half the time (section 10).

## 1. What changed from the Friday pack (conclusion first)
- The Friday pack (section 8) tests chord playing, groups A/B/C = app / YouTube / chart. It cannot produce C1 to C4. This plan swaps the task for one sung phrase with one held note, and one plain-words cue.
- Every participant sings take 1 with no help, then sees the real cue at a different moment by group.
  o A: cue straight after take 1, then take 2.
  o B: no cue after take 1, take 2 is a plain repeat, cue after take 2, then take 3.
  o C: "Try again." after take 1, take 2, cue after take 2, then take 3.
- Result: nine cue exposures (a take just before the cue, a take just after), nine cue ratings for C3 and C4, a small practice-only baseline from B and C.
  o Pitch order: take 1 to take 2 for all three groups side by side first; B and C cue results separately, labelled "after delayed feedback".
  o Report all nine outcomes, never only the scorable ones: fewer, same, more, no headroom, unscorable, wrong cue.
- Ethics (revised, section 3): three NHMRC triggers apply (control groups, cohort comparison, innovative prototype). Read as "consider ethical review and follow the National Statement", ask the organiser for a written reply, do not assume full review.
- Rejected from the original Codex draft: 5 A / 2 B / 2 C. Equal 3-3-3 kept, with one simpler two-arm option (section 9).

## 2. Recruitment
| Item | Plan |
|---|---|
| Who qualifies | Age 18 or over (asked aloud, no ID); says they are a beginner at singing; willing to sing one short phrase |
| Beginner test (asked aloud) | No singing lessons in the last 2 years and not in a choir or band as a singer |
| Exclude | Under 18; anyone who has seen the app or helped build it; anyone who cannot give informed consent; voice or music students in our own courses graded on this; anyone with a sore throat today |
| Not a teammate | Teammates only run a rehearsal, reported as a rehearsal, never as a result |
| How many to invite | 14 invitations for 9 completions (about 65% turn up, `unverified` planning guess); standby list of 3 |
| Payment | None. No course credit. Offer: "try the prototype first and tell us what you think" |
| Recording of who came | Slot codes only (S1 to S14) on a paper list kept apart from the data sheet; the code-to-person list is the only link, destroyed after evening two. Never a name or an identifying comment on the sheet |
| Where | A quiet room, the same room both evenings if possible |

### Two-line invitation
> We are testing an unfinished music-practice app in a 20-minute session: you sing one short phrase a couple of times and tell us what you think. No singing skill needed. You must be 18 or over; there is no payment, and you can stop at any time. Reply to book an evening slot.

## 3. Consent and ethics
### 3.1 Consent script (read aloud, verbal yes, no signature; 145 words)
> "We are students testing an unfinished music app for the MasterTech Challenge. It takes 20 minutes: you sing one short phrase a few times and answer questions. You may see slightly different screens from other people. Singing can feel awkward; skip anything or stop any time, with no reason needed. The phone stays offline and your voice is processed on this phone only. I delete the audio in front of you. We record no names, only coded pitch counts, ratings and short comments, kept by our team until after Wednesday's pitch, then deleted; we show only combined results. Until you leave you can ask us to drop your data; afterwards we cannot find yours. This card has our contact and the organiser's, for questions or concerns. Any questions? Are you 18 or over, and happy to go ahead?"

- Word count is checked by script (see Method). Log "yes" on the sheet; if no or not sure, stop and thank them.
  o Contents follow National Statement 2.2.5 and 2.2.6 (opened): verbal consent allowed; privacy, withdrawal, dissemination, complaint contact [2].
  o Offline claim holds only if every session runs in airplane mode. If any session goes online, add: "pitch numbers and typed words go to a language-model service" (privacy-design-v1.md 5.1; the audio never leaves).
  o Debrief after the last question (National Statement 2.3.1(e), opened, asks for an explanation and a chance to withdraw data after limited disclosure) [2]: "Some people saw the suggestion later than others, to check whether a plain repeat helps. You can still ask us to drop your data."
  o The card carries two contacts: [team contact] and [organiser contact]; the team fills both before evening one.
- Do not photograph the screen with a face in it; no video.
- Withdrawal and deletion: S-codes are never written next to P-IDs, so after a participant leaves their data cannot be found; the code list is destroyed after evening two; a calendar deletion date for the sheet goes on the card: [date, team fills].
- Privacy: audio on device, features not audio, no account, no IP-linked logs (privacy-design-v1.md 5.1 nine-adult row). Pitch traces are pseudonymous and a contour can single someone out in a cohort of nine; the sheet stays off shared drives and is deleted after the pitch.
- Before promising deletion, test it in rehearsal: delete a take in the app, then check the app store, browser cache, OS "recent" lists and any backup path. If a copy survives, change the script's wording first.

### 3.2 Ethics reading (what is verified, what is not)
- Verified by opening the NHMRC text [1][2]:
  o The 2014 NHMRC guidance lists "triggers for consideration of ethical review": privacy or reputation infringement, secondary use of data, more information than routine, testing non-standard (innovative) protocols or equipment, comparison of cohorts, randomisation or control groups, targeted analysis of minority or vulnerable groups.
  o "Where one or more of the triggers above apply, the guidance provided in the National Statement ... should be followed." It does not say full committee review or written clearance is required; the level of review "if required" is for the organisation.
  o The guidance's oversight-without-review cases need none of the triggers; our design has three (control groups, cohort comparison, innovative prototype), so it does not fit that carve-out. v0 said "not QA by NHMRC's test": the correct reading is "outside the no-review carve-out; review level undecided".
  o 2025 National Statement: verbal consent allowed (2.2.5); QA and evaluation sent to the NHMRC guidance (2.3.8); limited disclosure may proceed for no more than low risk if its extent is defined and participants are told afterwards (2.3.1); lower risk = low risk (no more than discomfort) or minimal risk (glossary, exemption criteria cross-referenced at 5.1.12 to 5.1.18, which I did not read) [2].
  o Effective from 23 June 2026: Curtin page opened [4]; NHMRC page not opened (fetch timed out), snippet only [3].
- `unverified`: whether this student test counts as "research" at all (the Statement defines research as creating new knowledge; a product decision may not be) and whether the competition organiser or any university requires clearance. Not found: the organiser's rules; UC's own QA pathway (search snippet only [6]); UQ's procedure (opened) says its ethics office can be contacted to decide the pathway and a QA exemption notice may be required, which is UQ policy and not ours [5].
- Minimal sensible path (our reading, not advice):
  o 1. Send the organiser one page: purpose, procedure, the consent script, data held and deleted, risks (singing discomfort), the three design features. Ask: "Is any review or notice required, and by whom?" Email reply is the record.
  o 2. If the reply names a pathway, follow it. If no reply by Sun 8 Nov, run teammates only (rehearsal, "not a result") and keep waiting; do not recruit outsiders on silence.
  o 3. Dropping B and C removes two triggers, not the prototype one, and changes nothing about privacy or consent. A simpler design is allowed; it is never a route round review.
- Adults only, unpublished, and outside a university course are relevant circumstances that a reviewer weighs, not exemptions (critique, accepted; no source says otherwise).

## 4. The voice task (design)
| Item | Fixed value |
|---|---|
| Phrase | Placeholder `[TEST_PHRASE]`: one built-in rights-cleared phrase with a 2-beat held note at the end. Candidate for the test: Twinkle bars 3 to 4 (F F E E D D C), 60 bpm, about 8 s, held note = the final C (take-data-contract.md fixtures). The demo phrase is a separate team choice (demo-phrase-and-rights.md: Twinkle bars 3 to 4 recommended, Ode to Joy backup); the test phrase may differ. Same for all nine |
| Reference | A piano tone for the held note in the participant's comfortable key; one range adjustment allowed, logged |
| Phone | One named phone, one position (a hand-span from the mouth, propped), airplane mode from a cold start each session (feeds C5a: one named phone, not phones in general) |
| Cue | One plain-words cue of fewer than 20 words (tech-feedback-layer.md: "under 20 words"), chosen by the app's rules from the take before the cue, never by the facilitator |
| Eligible cue for C1 | cause_class V9 only (wobbly long note): the V9 rule fires on 12 or more frame-to-frame pitch flips on notes held over 1 beat, so the cue targets that count. Other classes are logged and reported separately with their own pre-agreed measure |
| Which take makes the cue | A: take 1. B and C: take 2. Log processing time from the end of that take. C2 uses all nine |
| Headroom | See below: the take just before the cue, not always take 1 |

- Headroom, old and new side by side (choice in Open questions):
| | v0 | Critique |
|---|---|---|
| Rule | At least 3 counted excursions in the pre-cue take | At least 1 counted excursion; only 0 is "no headroom" |
| For | Matches the V9 trigger's spirit (clearly wobbly) | Fewer people dropped; picks fewer extreme baselines |
| Against | Selecting wobbly takes invites regression to the mean [8] | Weak wobblers have little to improve; 1 to 0 counts as a win |
- Two definitions meet here: V9 fires on frame flips (tech note), headroom is on excursions (this plan). They can disagree. Log both per person; if V9 fires but the excursion count is 0, the person is "no headroom", not a failure. Check agreement on the teammate rehearsal before the rule freezes. C1 tests the excursion count; V9 only decides who gets a targeted cue. A lower count is not proof that the cue fixed V9.
- Alignment with the canned test set (tech-feedback-layer.md section 9): human case 1 maps to case 10 (V9 wobbly long) for the main path.
  o Cases 8 (injection) and 15 (out of scope) stay on the canned test; the goal sentence is a log note only unless the team decides otherwise (Open questions).
  o Yield risk: if fewer than about five of nine get a V9 cue, C1 has a small denominator; report "only k of 9 got the cue C1 targets" and do not stretch the measure.

## 5. The 20-minute script
- A slot is 20 minutes. Script runs 16 minutes (A) or 18 minutes (B, C); the rest is reset and handover. Both people read and log the same script; one reads, one times.
- The facilitator reads only the quoted lines. Group comes from a pre-shuffled list (section 9). Same facilitator all nine sessions where possible.

| Min | All groups: action and verbatim line |
|---|---|
| 0-1 | Welcome: "Thanks for coming. I will read a short note." Read consent. If no, stop |
| 1-3 | Cold start in airplane mode; check mic and room. "We are checking the phone can hear you." Play the reference tone: "Can you sing this note comfortably?" One adjustment only; log it |
| 3-4 | "In your own words, what would you like this phrase to sound like?" Log the sentence. Then: "This tests the app, not your singing." |
| 4-5 | "You will see a line on screen and a guide note. Please try the phrase once to get used to it. This one does not count." (unrecorded warm-up) |
| 5-6 | "When the screen says go, sing the phrase." Take 1 recorded. Log take-end time |

| Min (A) | Min (B and C) | Action and verbatim line |
|---|---|---|
| 6-7 | 6-7 | A: cue appears; log seconds from take end to cue. "Take your time with the screen." B: screen says "Ready for take 2"; nothing else. C: screen says "Try again." Facilitator says nothing |
| 7-8 | 7-8 | "Please sing the phrase again when you are ready." Take 2 recorded |
| - | 8-9 | B and C: cue appears; log seconds. "Take your time with the screen." |
| - | 9-10 | B and C: "Please sing the phrase again when you are ready." Take 3 recorded |
| 8-9 | 10-11 | "What, if anything, stood out to you?" Log words, no prompting |
| 9-10 | 11-12 | "How much do you agree: after that screen, I know what to do next? One is not at all, five is completely." |
| 10-11 | 12-13 | "How much do you trust that suggestion for your next try? One is not at all, five is completely." |
| 11-12 | 13-14 | "How much do you agree: the suggestion was understandable and worth trying? One is not at all, five is completely." |
| 12-13 | 14-15 | "What, if anything, felt like extra work?" Log verbatim. Then: "Overall, did it feel like help, neither, or homework?" |
| 13-14 | 15-16 | "Would you like to do another phrase now? Yes, no, or not sure?" Then: "Why?" (If yes, run one unscored phrase.) |
| 14-15 | 16-17 | "Was anything confusing or uncomfortable?" Log briefly |
| 15-16 | 17-18 | Check sheet for blanks, do not change answers. Debrief line from 3.1. Delete all audio in front of them, say "Deleted", reset the app |

### Must-not-say list
- No praise or blame: not "good", "nice", "better", "that was off", "you improved".
- No technique words: not "breath", "support", "pitch", "flat", "sharp", "wobble", "steady", "vowel" unless the screen shows them.
- No explaining or demonstrating the cue; no repeating it aloud; no humming the note again.
- No hint of what the groups are or that the app is expected to help.
- If asked "is it AI?": answer truthfully and briefly: "The suggestion comes from rules on the phone, and from a language model when it is online; today it is offline." (Changed from v0, which dodged the question.)
- No rating-pushing; never fill silences with reassurance. If asked for help: "I can't help during the test; do whatever feels right."
- Only the built-in phrase; no songs the participant might know.
- Waiting time: A sees its cue about when B and C see their "Ready" or "Try again." screen (same on-screen pause); the logger notes any slip.

## 6. Measures, exact wording, and how they map to the criteria
| Criterion | Question or log | Scale | Number reported |
|---|---|---|---|
| C1 | Counted pitch excursions per take (section 7) | Count | x of 9 with fewer, m scorable, median change and range among m, every pair shown, exclusions listed |
| C2 | App log: take end to cue shown; stopwatch backup | Seconds | Within 20 s out of 9; median; failures and timeouts counted as misses |
| C3 trust | "How much do you trust that suggestion for your next try?" | 1 to 5 | Number of 9 answering 4 or 5 |
| C3 useful | "How much do you agree: the suggestion was understandable and worth trying?" | 1 to 5 | Number of 9 answering 4 or 5; and 4 or 5 on both |
| C4 open | "What, if anything, felt like extra work?" (first) | Free text | Verbatim quotes |
| C4 closed | "Overall, did it feel like help, neither, or homework?" | 3 options | Number naming homework (bar: at most 1) |
| C4 next | "Would you like to do another phrase now?" | yes / no / not sure | Number yes (bar: 6 of 9) |
| Extra | "After that screen, I know what to do next." | 1 to 5 | Number of 9 answering 4 or 5 |
| Extra | "What, if anything, stood out to you?" | Free text | Verbatim, before any rating |

- C1 to C5 wording: unchanged from success-criteria-draft.md (C1 wobble count, 5 of 9; C2 within 20 s, 8 of 9; C3 trust and usefulness 4 or 5, 6 of 9; C4 another phrase 6 of 9 and at most 1 homework; C5 offline cold start on one named phone, 3 of 3).
- Mapping, old and new side by side (choice in Open questions):
| | success-criteria-draft.md (kept here) | Critique's proposal |
|---|---|---|
| C3 | Trust and usefulness, each 4 or 5, 6 of 9 | Usefulness only ("How useful was the suggestion?") |
| C4 | Another phrase (6 of 9) and at most 1 homework; know-next is an extra | "I know what to do next"; trust, homework and another phrase secondary |
- Courtesy bias: ratings go on a printed card the participant circles and hands back face down; the facilitator reads only the question wording. "Another phrase" is offered and, if yes, taken; log "offered" and "took it".
- Wording basis: Henderson et al. 2025 surveyed helpfulness and trustworthiness of GenAI feedback among about 7,000 students (83.9% helpful, 60.1% trusted, via research-bank.md) [10]. Our items are an adaptation: "Henderson-style", never "the Henderson scale"; exact item text `unverified`.
- Report counts of 9, never a percentage. B and C rate the cue after take 3 (more attempts than A): note it.

## 7. Wobble count: one definition, frozen script, same number every time
- Name: "counted pitch excursions". It is a count of slow pitch swings on a held note, not singing quality; fewer excursions need not mean better singing.
- What breaks the count, and the fix:
| What breaks it | Fix (frozen before evening one) |
|---|---|
| Tracker version, frame hop, smoothing edge handling differ between runs | Freeze tracker and version, frame hop and window size in frames (100 ms at the hop, odd number of frames); one script, run on exported traces; both scorers run the same file, nobody counts by hand |
| Segment end shifts as breath runs out; scoops start before the trim | Window = from 250 ms after the detected held-note onset, fixed 1.5 s long (2-beat note at 60 bpm = 2.0 s, less 250 ms each side). Take ends before the window closes = unscorable, never "fewer" |
| Unvoiced frames, breaths | No interpolation. Frames with clarity below 0.9 are unvoiced. Unvoiced frames never count toward the 100 ms runs; a gap ends any excursion. Unscorable if fewer than 70% of window frames are voiced or any unvoiced gap exceeds 200 ms |
| Octave flips, long or short | Any frame 900 cents or more from the reference is dropped as unvoiced. Over 10% of window frames dropped = unscorable. Numbers cannot show what was sung, so none are "fixed" by hand |
| Reference line moves when the note drifts | Reference = median of the voiced window frames of that take (not the target), so a steady flat or sharp note is not a wobble |
| Two swings merged or one long swing counted twice | Excursion = unbroken run of same-sign frames more than 50 cents from the reference, lasting 100 ms or more; ends on 100 ms back in band, or a sign flip. One long excursion counts once. Fragments under 100 ms count zero (conservative, stated) |
| Vibrato | Vibrato at 5 to 7 Hz has half-cycles of about 70 to 100 ms (our arithmetic), so it mostly fails the 100 ms rule; slower swings (about 4 Hz and below, heard as wobble [9]) pass. Wide vibrato (typical 50 to 150 cents peak to peak [9]) can still cross the band. Flag periodic modulation in the sheet; never remove a result afterwards because it looked like vibrato |
- Median smoothing: centred median over the window in frames, window truncated at the segment edges; the first and last 50 ms use a shorter window (written into the script).
- Secondary numbers, labelled differently: time outside the 50-cent band (ms; against the take's own median, so a steadily wrong note scores well and it is not an accuracy measure), and mean absolute cents off the target note (absolute, so sharp and flat errors cannot cancel). Do not mix them with the headline in one sentence.
- Worked example: reference line 0; track within 50 cents until 1.0 s, 70 cents high for 0.3 s, back in band for 0.2 s, then 60 cents low for 0.15 s, then in band = 2 excursions (the second is 150 ms, so it counts). A 90 ms excursion counts zero.
- Frame flips: the app's own "pitch flips over 50 cents frame to frame" count (tech-feedback-layer.md section 2) is what fires V9 and what stage lines such as "24 to 7" use. The headline for people is the excursion count; label the flip count "app flips".
- Scoring procedure:
  o Traces exported by a script into one folder under random codes; group, take order and cue text hidden; the whole set scored in one pass.
  o Publish the script, its fixed settings (filter order: drop unvoiced frames, drop octave frames, median, then excursions) and 5 test traces with expected outputs before recruiting. Look at each pair's trace and voiced coverage: a moved median can change a count without any change in singing.
  o Scorer 1 and Scorer 2 run the script and independently record flags (periodic modulation, octave trouble, cue_matches_trace). Keep both flag sets, report exact agreement on flags before reconciling.
  o Rehearse on at least 5 teammate traces including bad ones (breath gap, octave flip, early stop); freeze the script after. A change after evening one is reported as a change.
- Limits: tracker may fail on a beginner's voice (a product finding, not missing data); audio is deleted, so no participant audio next to the number (success-criteria-draft.md C1 asks for that); for the demo use a teammate's recording with consent. Show one trace with the excursions marked.

## 8. Data sheet (one row per participant; no names)
| Column | Notes |
|---|---|
| id, evening, group | P01 to P09; A, B or C |
| age18_yes, beginner_yes, consent_yes | Verbal answers, yes/no |
| goal_sentence | Verbatim; strip anything identifying |
| range_change | none / one change |
| offline_cold_start_ok, load_seconds | Airplane mode from a cold start |
| t1_exc, t2_exc, t3_exc | Excursion counts per take; "unscorable" allowed, with reason code |
| pre_cue_take, pre_cue_exc, headroom | Take that made the cue; its count; headroom per the rule chosen |
| app_flips_t1, app_flips_t2, app_flips_t3 | The app's own flip count (secondary) |
| window_voiced_pct, gap_max_ms, octave_dropped_pct | Per take, from the script |
| cause_class_returned, cue_text, cue_word_count | From the app log |
| cue_matches_trace | yes/no, judged by the scorers blind |
| cue_seconds | Take end to cue shown |
| stood_out, trust, useful, know_next | Free text then 1-5 |
| extra_work_text, help_neutral_homework | Free text then 3 options |
| another_phrase, another_why | yes/no/not sure and verbatim |
| confusing, mic_noise_issue, facilitator_slips | Short notes |
| audio_deleted_yes, data_withdrawn | Confirmed in front of the participant |

## 9. Group assignment and what each comparison can show
| Group | Sequence | n | Role |
|---|---|---|---|
| A | take 1, cue, take 2 | 3 | Cue straight after take 1 |
| B | take 1, nothing, take 2, cue, take 3 | 3 | Practice-only baseline, then cue |
| C | take 1, "Try again.", take 2, cue, take 3 | 3 | Generic prompt baseline, then cue |

- Assignment: pre-shuffled list (dice or generator) made before evening one; facilitator never picks. Balanced within each evening (for example 2 A, 1 B, 1 C on the first; the rest on the second; a no-show is replaced from standby for the missing group). Same facilitator, scripted lines, equal on-screen waiting time.
- Design limits of 3-3-3 and the simplest fixes:
| Limit | Simplest fix |
|---|---|
| Three per arm: any pairwise difference is noise | Say so; show every pair; never rank the arms |
| "Ready for take 2" (B) and "Try again." (C) both prompt a repeat; B vs C says almost nothing | Use one screen text for both ("Try again."): one "delayed cue" arm. Then A 4 versus delayed 5 (or 3 versus 6); the cue-exposure count stays 9 |
| A vs C compares a cue package with a generic prompt (different attention, screen time, expectations), not wording alone | Label it "cue package vs generic prompt" |
| Take 2 to 3 stacks practice, fatigue and order | Report as "after delayed feedback"; only a larger counterbalanced study removes this |
| Imbalance if an evening collapses | Permuted blocks per evening; standbys by group |
| Pooled nine has no concurrent control | Say "no concurrent control" beside the pooled number |
- Comparisons:
| Comparison | Can show | Cannot show |
|---|---|---|
| All 9: pre-cue take vs after-cue take | How many had fewer counted excursions after the cue | That the cue caused it (practice, warm-up, fatigue, regression to the mean); an effect in a population |
| A take 1 to 2 vs B (or delayed arm) take 1 to 2 | An exploratory look at cue vs plain repeat (randomised, n tiny) | Any reliable difference |
| A take 1 to 2 vs C take 1 to 2 | Cue package vs generic prompt | Whether the wording matters |
| B vs C take 1 to 2 | Almost nothing (both prompt a repeat) | Anything |
| B and C take 2 to 3 | Change after delayed feedback | A clean comparison with A |
| Trust, usefulness, help or homework | What novices say in the first hour | Retention; learning; teacher-grade correctness |
- Honesty line: one hour measures novelty, not learning; point to the 12-week pilot. Report "x of y" with the denominator and missing data; no percentages and no p-values.

## 10. The honest pitch sentence for each outcome
- Counting rule: x = pairs with fewer excursions, among all nine; no-headroom, unscorable and wrong-cue cases are shown, not dropped. m = scorable pairs; d = median change among the m. Also give the count among eligible (V9) scorable pairs, with the reason for every other case.
- What chance gives with nine pairs (calibration only; not a test to report on stage): if each pair were a coin flip, 5 or more of 9 "improved" happens half the time (256 of 512); 6 or more about 1 in 4 (130 of 512); 7 or more about 1 in 11 (46 of 512); 8 or more about 1 in 51 (10 of 512). So the C1 bar "5 of 9" is not evidence of an effect by itself, and retake practice should push the real rate above a coin flip even with no cue. The sign test behind these numbers needs paired, independent differences and drops ties [7]. These figures assume nine independent, untied, scorable pairs and a 50% chance each; selecting wobbly takes and ordinary retake effects break that, so treat them as a narrow hypothetical, not a test.
  o No p-value is reported anywhere in the pitch or the one-pager: nine people, no control, a stacked retake: the design and the question rule it out, not only the small n.
- Rules and sentences (thresholds are the team's to move before evening one; never after results):
| Outcome | Rule | Stage sentence (three sentences, every placeholder filled) |
|---|---|---|
| Improved | x of 9 is 5 or more, and the three or six no-cue pairs improved less often | "Of nine beginners, x had fewer counted pitch excursions after the cue, with m pairs scorable. Median change among those pairs was d excursions. This is an immediate change we can see, but practice and measurement variation may explain it; we have not established a cue effect or learning." |
| Improved, controls improved too | x is 5 or more but B or C moved as often | "Of nine beginners, x improved, but people who got no cue yet improved too, so a retake alone may explain much of it. Median change was d among m scorable pairs. The 12-week pilot is the real test." |
| Mixed | x is 3 or 4, or the cue did not match the trace for several | "Of nine beginners, x improved, y were unchanged and z worsened, with u pairs unscorable. Ratings and cue mismatches showed a mixed experience. We will fix the problems we saw and test again before claiming effectiveness." |
| No change | x is fewer than 3 | "Across nine beginners, we found no clear reduction in counted pitch excursions. That does not show the cue has no effect. We will revise the cue and the measurement before making an effectiveness claim." |
- Trust, usefulness and homework are reported alongside, one sentence each, even if C1 is no change. Never claim learning, teacher-level quality, or a percentage.

## 11. Ten things most likely to go wrong, ranked
| # | Risk | Mitigation |
|---|---|---|
| 1 | Ethics reply not in by Sun 8 Nov | Send the one-page summary Sat; rehearsal with teammates as fallback; no outside recruiting on silence |
| 2 | Few V9 cues, so the C1 denominator is small | Report "k of 9 got the targeted cue"; other classes reported separately; do not stretch the measure |
| 3 | No-shows | 14 invitations, 3 standbys by group; report actual completions as a smaller test with the real denominator |
| 4 | Tracker or phone failure (noise, offline cold start, latency) | Fixed phone position, quiet room, rehearsed cold starts; count failures as misses, never delete them |
| 5 | Short or early-stopped retakes read as improvement | Fixed 1.5 s window; too short = unscorable |
| 6 | Little headroom (clean takes) | Report zero-baseline cases separately; no coaching, no extra takes |
| 7 | Wrong cue for the trace | Log cause_class; blind match check; report mismatches; no live repair |
| 8 | Facilitator drift and demand effects | Verbatim script, private rating cards, logger records slips; same facilitator; truthful AI answer |
| 9 | Scoring script bug or rule edited late | Rehearse on 5 hard traces; freeze before evening one; a change is reported as a change |
| 10 | Privacy or deletion failure | Slot codes, offline airplane mode, test deletion from caches in rehearsal, delete in front of the participant |
- Also kept from v0: vocal discomfort (comfortable key, stop any time), one participant hates it (keep their words, count their ratings), Hawthorne effect (same facilitator behaviour in all groups).

## 12. One-page results template
| Group | n done | Scorable with headroom | Excursions before to after, by ID | Fewer | Cue under 20 s | Trust 4-5 | Useful 4-5 | Know next 4-5 | Help / neither / homework | Another phrase yes |
|---|---|---|---|---|---|---|---|---|---|---|
| A | /3 | | | | /3 | /3 | /3 | /3 | | /3 |
| B (take 2 to 3) | /3 | | | | /3 | /3 | /3 | /3 | | /3 |
| C (take 2 to 3) | /3 | | | | /3 | /3 | /3 | /3 | | /3 |
| All nine | /9 | m = | median d, range | x /9 | /9 | /9 | /9 | /9 | | /9 |
- Add: practice-only drift (B and C, take 1 to 2) beside A's take 1 to 2; the matching stage sentence; three quotes (one help, one homework or confusion, one surprise); flag agreement; secondary numbers (time outside band, app flips).
- Check against C1 to C4: C1 5 of 9 improve; C2 8 of 9 within 20 s, median 10 s or less; C3 6 of 9 at 4 or 5; C4 6 of 9 yes and at most 1 homework.
- Also logged for C5: cold-start offline passes (target 9 of 9, bar is 3 of 3; the first three cold starts of evening one are the C5 trials, all nine reported), every cue failure seen, the named phone.

## 13. Timeline, roles, equipment
| When | Role | Needed |
|---|---|---|
| Sat 7 Nov | Builder + one other | Send the ethics summary; freeze phrase, scoring script, assignment list, blank sheet; run the deletion test and the 5-trace scoring rehearsal; invite only once the reply is in |
| Evening 1: Mon 9 Nov (suggested, after the criteria are known) | Facilitator reads; logger times and fills the sheet; builder on call | Quiet room, the named phone, a second phone as stopwatch, laptop for the anonymous sheet, the contact card |
| Evening 2: Tue 10 Nov (suggested) | Roles swap only if scripts are held equal | Same kit; run the remaining sessions; check the sheet after each person |
| Tue 10 Nov late | Two scorers | Blind scoring in one pass, reconcile flags, fill section 12, pick the sentence |
| Wed 11 Nov | Presenter | Uses the number and the honest sentence; the pitch is Wed |
- Dates are suggestions. If fewer than nine outsiders finish, report a smaller test with its actual denominator; only teammate sessions are "rehearsal, not a result".

## Appendix A: chord version (Friday pack, kept as an option)
- Task: learn G and D, play a two-chord song for 30 seconds in 20 minutes. Groups: A prototype, B a YouTube lesson, C a chord chart only.
- Measures: could they do it; confidence before and after 1 to 5; "I would use this" 1 to 5. Cannot produce C1 to C4; same consent, sheet pitfalls and honesty line apply.

## Method
- Parent: nine-student-test-plan.md read whole. Critique: test-methods-answer.md (GPT-6 Astra, high, no web) treated as leads; each is a row in 0.1.
- Web opened: NHMRC QA guidance PDF and 2025 National Statement PDF (downloaded, read as text: triggers, 2.2.5, 2.2.6, 2.2.19, 2.2.20, 2.3.1, 2.3.8, research and low-risk definitions); Curtin 2025 Statement page; UQ QA procedure; sign test page; vibrato page. WebFetch of the NHMRC page timed out; UWA exemption page unreachable (DNS). Searches (snippet): effective date, UC ethics, regression to the mean, vibrato.
- Arithmetic checked by hand: 5 or more of 9 = (126+84+36+9+1)/512 = 0.5; 6 or more = 130/512; 7 or more = 46/512; 8 or more = 10/512; Twinkle bars 3 to 4 = 8 beats = 8 s at 60 bpm; 6 Hz half-cycle about 83 ms.
- Team files: success-criteria-draft.md, privacy-design-v1.md (3, 5.1), questions-for-sponsor.md (row 33 asks the ethics question), take-data-contract.md, tech-feedback-layer.md, demo-phrase-and-rights.md.
- Codex call 1 (re-check of v1, gpt-6-sol, medium, no web, names stripped; exit 0): 12 findings. Kept: C1 vs V9 mismatch; reproducibility needs a published script and test traces; absolute error for accuracy; nine-pair and eligible-pair denominators; chance figures only as a hypothetical (also, no p-value is because of the design); consent vs slot-code link and deletion date; offline set-up locked first; fixed C5 trials; no discarding real participants as "rehearsal"; softening "encouraging". Not kept: its doubt about the ethics reading (the NHMRC text was opened here; the organiser question stays open); the median-reference worry is handled by pair inspection, not changed.

## Open questions
- Ethics (blocking for outsiders): will the organiser say a review or notice is needed? Does a pitch-day result count as publication? Ask in writing Sat 7 Nov; decide the fallback by Sun 8 Nov. `unverified`: whether this counts as "research".
- Team: headroom rule, 3 or more (v0) or 1 or more (critique); and the C3 and C4 mapping (draft wording kept vs critique's proposal), both side by side above.
- Team: is the C1 bar still 5 of 9, given chance gives it half the time? (Wording must stay aligned with success-criteria-draft.md unless the team changes both.)
- Team: three arms (3-3-3) or two (one delayed arm; 4 and 5); which named phone; evenings; test phrase (placeholder, candidates Twinkle bars 3 to 4 or Ode to Joy opening) separate from the demo phrase.
- Team: is the goal sentence passed as `learner_words` or only logged; will any session run online (changes the consent script). Lock the offline set-up first: a participant cannot consent to an undecided data flow.
- Verify: Henderson item wording; the 65% show-up guess; the organiser's rules; who may score and whether two scorers are available Tue.

## Sources
1. https://www.nhmrc.gov.au/sites/default/files/documents/attachments/ethical-considerations-in-quality-assurance-and-evaluation-activites.pdf (NHMRC, March 2014), 2026-11-06, opened (PDF)
2. https://www.nhmrc.gov.au/sites/default/files/documents/attachments/publications/National-Statement-on-Ethical-Conduct-Human-Research-2025.pdf, 2026-11-06, opened (PDF)
3. https://www.nhmrc.gov.au/research-policy/ethics/national-statement-ethical-conduct-human-research (effective 23 June 2026), 2026-11-06, snippet (fetch timed out)
4. https://www.curtin.edu.au/research/research-integrity-and-ethics/human-ethics/2025-national-statement/ , 2026-11-06, opened
5. https://policies.uq.edu.au/document/view-current.php?id=346 (UQ, QA and evaluation clauses 25 to 27), 2026-11-06, opened
6. https://canberra.edu.au/research/graduate-research/current-research-students/study/research-project-management/integrity-and-ethics/ethics/accordion/human-ethics , 2026-11-06, snippet
7. https://en.wikipedia.org/wiki/Sign_test , 2026-11-06, opened
8. https://www.casrai.org/dictionary/term/regression-to-the-mean and https://www.theanalysisfactor.com/what-is-regression-to-the-mean/ , 2026-11-06, snippet
9. https://www.vocevista.com/en/doc/theory-vibrato/ , 2026-11-06, opened
10. Henderson et al. 2025, https://doi.org/10.1080/02602938.2025.2502582, via research-bank.md, 2026-11-06, not re-fetched here
11. Team files in this folder, 2026-11-06, opened
