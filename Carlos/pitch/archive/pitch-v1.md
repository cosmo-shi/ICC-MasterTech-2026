# Pitch v1 - three-minute stage pitch (at or under 2:40 spoken)

- Date: Fri 6 Nov 2026 (AEDT), overnight draft v1; revises pitch-v0.md (left unchanged) to match what will actually be on stage.
- Stage as planned: laptop Chrome on HDMI, USB MIDI keyboard (on-screen keys as fallback); take 1 replayed through the real scoring code, retake live.
- Length: 243 spoken words outside the demo (about 97 s at 150 words a minute) plus the 60 s demo = about 2:37; 23 s buffer for four hand-overs (judge pass, 6 Nov night).
- Status: overnight draft for the team; verify before the pitch. Phrase, instrument, roles and close line wait on Sunday (section 0).

## 0. Open choices the team must make on Sunday
| # | Choice | Options (source file) | v1 default |
|---|---|---|---|
| 1 | Demo phrase (NOT decided; script uses a placeholder) | A: Twinkle melody, bars 3-4 (F F E E D D C), app skips bars 1-2 so "easiest phrase, not the first" (R17) shows on stage (demo-phrase-and-rights.md s1) | Placeholder: "one phrase of a tune everyone knows"; notes live in the app's `data/phrases.json` (small-goals-engine-spec.md s3) |
| | | B: Ode to Joy, bars 1-2 (E E F G G F E D), fits the 12 s retake slot at 80 bpm (demo-instrument-decision.md s4) | |
| | | C: Ode to Joy, bars 5-8, picked by the engine's own ease formula (small-goals-engine-spec.md header) | Note: four bars took about 19 s in demo-instrument-decision.md s4 arithmetic and miss the 12 s slot; check tempo |
| 2 | Live instrument | MIDI keyboard (demo-instrument-decision.md s1) or overturn to voice if Saturday's noisy-room full-loop test passes | MIDI keyboard; if voice wins, beats 3 to 5 switch back to "hears" and the number becomes a wobble count |
| 3 | Close line | (a) v1 line = surprise-task-rehearsal.md s6 60 s version, no "first"; (b) state-of-play s9 stage line with "first step" (team call, RESUME 7 Nov) | (a), so the pitch and the surprise-task versions match |
| 4 | Who opens and who closes | Simone owes the first and last lines (state-of-play s10); beat 1 is Carlos's own story | Carlos tells beat 1; Simone delivers the close (her line) |
| 5 | Slide 1 number | Cue alone, or cue plus "pitch wobbles 24 to 7 (n = 1)" (Carlos's privacy call, evidence file s10) | Cue alone: keeps the demo number the only before-and-after on screen |
| 6 | Pilot price | Settled by the coordinator (20:19): no pilot price on stage, spoken or on a slide; figures live in Q and A (qa-prep-v1.md Q13) | Slide 7 says "indicatively costed" with no figure |
| 7 | Picture age vs demo language | Picture A is a Year 5 composite; accessibility-design-v0.md s1 and s8 recommend young adult beginner demo language | Keep the Year 5 picture (ties to the teacher-training number); demo copy in young adult words |
| 8 | "Three of us, one gap" | Needs Simone and Justin to confirm their own stories (state-of-play s10) | Kept, pending confirmation; else "This gap is why we built it." |
| 9 | Cue and number wording | "You speed up as you play. Let the click lead." / "On the beat: x of N" (demo-instrument-decision.md s9 rows 3) | As listed; N = notes in the chosen phrase (8 for option B, 7 for option A) |
| 10 | Who plays the keys | Justin, or whoever plays most steadily (demo-instrument-decision.md s9 row 5) | Justin |
| 11 | Show one model step | Score-lift coach pass: show a real saved model plan beside the typed goal at the goal card, with the 25-word line (section 2 beat 4); tech-feedback-layer.md s1 mock mode | Show it only if a real saved answer exists by Tuesday's freeze, labelled; else the fallback goal line. Never fake one |
| 12 | Take 1 errors | Two real errors (build-plan-v0.md s6) or timing error only; the judges said the red wrong key distracts from the timing fix | Keep the build plan's two errors but dim the wrong key; team call |

## 1. Timing table
| # | Beat | Clock | Seconds | Speaker (role) | Words |
|---|---|---|---|---|---|
| 1 | Picture 0: Carlos's own story (shortened) | 0:00-0:21 | 21 | Carlos (first person) | 53 |
| 2 | Three of us, one gap; picture; one statistic | 0:21-0:36 | 15 | Simone (the problem) | 38 |
| 3 | The one key thing | 0:36-0:49 | 13 | Justin (the demo) | 31 |
| 4 | Demo: model example at the goal card, replayed take 1, cue read aloud, live retake, proof, separate hand-off example | 0:49-1:49 | 60 | Justin (keys and voice); Carlos runs the laptop | 95 (81 with the fallback goal line) |
| 5 | Why better, one proposed buyer, mentor bridge | 1:49-2:10 | 21 | Carlos (what next) | 52 |
| 6 | What it takes to proceed, aspiration measure | 2:10-2:26 | 16 | Carlos | 40 |
| 7 | Future glimpse | 2:26-2:29 | 3 | Carlos | 8 |
| 8 | Close line, slow | 2:29-2:37 | 8 | Simone (default; section 0 row 4) | 21 |
| | Buffer for hand-overs | 2:37-3:00 | 23 | | |

- Word counts measured by script on the lines in section 2 (hyphenated words count as one); seconds = words / 2.5.
  o Outside the demo: 243 words, 97.2 s. Demo narration: 95 words inside a fixed 60 s, about 22 s of it silent playing.
  o The Codex re-check warned 2:40 was before hand-overs; the judge-pass cuts buy 3 s more buffer (23 s, about 5 s per hand-over).
- Split: about 49 s problem and key thing, 60 s demo, 48 s what next.
- Jeff's three answers: solves a problem = beats 1 and 2; beats what exists = beat 5 line 1 plus the demo; why this team = beat 2 "three of us" plus beat 1.
- If a run goes over 2:45, cut in this order: beat 7 (3 s); beat 5 mentor line (5 s); the demo model line falls back to the 11-word goal line (6 s).
- If a run is short, add before beat 5: "Keys today; my voice is why it must listen too." (10 words, 4 s; demo-instrument-decision.md s6).

## 2. Spoken script with word counts
### Beat 1 - Carlos (0:00-0:21, 53 words, 21 s)
- "This year I recorded vocal covers alone and asked an AI chat for help. It could not hear me."
- "Then one cue, don't get louder, narrow the vowel, and my next take measured better: one learner, one take."
- "The note I still could not reach needed a teacher. Nothing pointed me to one."
  o Source: research-bank.md first-hand evidence table row 2 (n = 1, reconstructed from logs); "needed a teacher" is his own judgement.
  o Judge pass: all three judges wanted the 26 s opening cut; shortened by 12 words (the anxiety clause goes), the story and the hand-off gap stay.

### Beat 2 - Simone (0:21-0:36, 38 words, 15 s)
- "Three of us, one gap: nothing told us the one thing to fix."
- "Now picture a Year 5 girl in a small school, three hours from Canberra."
- "Surveyed primary teaching degrees average about eight hours of compulsory music."
  o Statistic: Fading Notes 2023, 7.98 h average across surveyed degrees (research-bank.md "Pre-service hours"); Picture A is a composite: "picture", never "meet".

### Beat 3 - Justin (0:36-0:49, 31 words, 13 s)
- "So we built a practice coach that knows every note you play."
- "Choose a song. Practise one phrase, get one clear fix, then check the same measure on your retake."
- "Watch."
  o Hook wording for MIDI: "knows every note you play", never "hears you" (demo-instrument-decision.md s1).
  o Judge pass: line 2 is the judges' plainer rewrite; "Two lines: your goal, your skill" dropped from speech (the two lines stay on screen).

### Beat 4 - Justin, demo (0:49-1:49, 95 words; full run in section 4)
- +0:00 "Rules choose today's cue from the notes I play. Our cloud model turned my typed goal into these steps; this is its saved answer, labelled." (25)
  o Only if a real saved model answer exists by Tuesday's freeze (section 0 row 11); else "My goal is the song. Today's small goal: one phrase, steady." (11)
- +0:10 "Take one, recorded Saturday, scored now by the real code." (10)
- +0:20 "One fix, in plain words: you speed up as you play; let the click lead." (15)
- +0:27 "Live now. Watch the on-beat count." (6), then count-in and plays.
- +0:41 "Before, x of N notes on time; now, y of N. That measures timing on this same phrase, today." (19)
- +0:49 "Separate example, a learner still stuck: I tap share; a teacher gets my fix list in Webex. Today, a mock." (20)

### Beat 5 - Carlos (1:49-2:10, 52 words, 21 s)
- "Apps that mark notes exist; we add one explained fix, a retake showing it, and a human at the ceiling."
- "Our proposed buyer: a university outreach team. UC runs free outreach into small rural schools; we found no music in it."
- "Proposed: university student mentors take the hand-off and introduce study pathways."
  o App line = the surviving combination in competitor-feedback-mechanics-v1.md s1; "your own goal" is not claimed as a difference.
  o Buyer from business-case-v0.md s1 and business-case-v1.md s9 (no buyer has agreed); UC outreach and "none confirmed" from verification-2026-11-06-afternoon.md s3.
  o Mentor line = the buyer-outcome bridge (score-lift coach pass), from business-case-v0.md s1: the app rides inside an outreach activity with university students as hand-off mentors and a pathway conversation; a pilot hypothesis, mentor supply unconfirmed.

### Beat 6 - Carlos (2:10-2:26, 40 words, 16 s)
- "To proceed: an indicatively costed twelve-week pilot for fifty learners, mostly the outreach team's staff time."
- "At week twelve: still practising, fixes holding, hand-offs happening, and interest in university study against week one; the partner sets the bar to continue."
  o Money: no price on stage (coordinator rule). Q and A only: business-case-v1.md s3c and s9 (core A$17,076 for 50 learners, about 99% staff time; A$25,000 to A$49,500 all-in with placeholders; "under $5,000" holds only for the A$4,549 of purchased items).
  o Aspiration: Outreach Funding must build interest in higher education, measured apart from enjoying music (business-case-v0.md s1; self-assessment-v0.md s5 row 2); the continue threshold is the partner's to set, never invented on stage (score-lift coach pass).
  o Never "HEPPP-funded": HEPPP ended 1 Jan 2026 (business-case-v0.md s1).

### Beat 7 - Carlos (2:26-2:29, 8 words, 3 s)
- "Next: a practice buddy, shared instruments, more instruments."

### Beat 8 - Simone (2:29-2:37, 21 words, 8 s)
- "Music should not depend on your postcode. We make the start free, and hand you to a human for the rest."
  o Same words as surprise-task-rehearsal.md s6 (60 s version); "free" = free to the learner, the outreach team pays (business-case-v0.md s1).
  o Slow down; pause after "postcode"; no slide change during the line.

## 3. Slide list (one number at most per slide)
| # | Beat | On the slide | The single number | Source |
|---|---|---|---|---|
| 1 | Picture 0 | The cue in large type: "don't get louder, narrow the vowel"; label "one learner's record, n = 1" | None by default; option "pitch wobbles 24 to 7 in one retake (n = 1, reconstructed from logs, definition unchecked)"; never the "5 dB" figure (self-assessment-v0.md) | research-bank.md first-hand row 2; evidence file s10 |
| 2 | Problem | A small school, one teacher; the number large | About 8 hours of compulsory music in surveyed primary teaching degrees (2023 average) | research-bank.md "Pre-service hours" |
| 3 | Key thing | Loop: your goal, one small goal, one fix, retake, human at the ceiling; two lines "your goal" and "your skill"; strap "knows every note you play" | None | state-of-play s2; demo-instrument-decision.md s1 |
| 4 | Demo | Stage laptop Chrome full screen over HDMI; corner label on take 1 "take 1, recorded Saturday (replay)" | "On the beat: x of N", then the live retake score (illustrative until Saturday's capture) | demo-instrument-decision.md s4 |
| 5 | Why better, buyer | Top: "Apps mark notes. We add: one explained fix, a retake that shows it, a human at the ceiling." Bottom: "Proposed buyer: a university outreach team. UC Aspire: free outreach to small rural primary schools. Music: none we could find." | None | competitor-feedback-mechanics.md s4; verification s3; verification-overdrive.md s1 fix 3 |
| 6 | What works today | Three columns: Built (the loop on keys; cue chosen by rules on the laptop; nothing leaves the laptop on stage); Mock (Webex hand-off card, labelled proposed); Future (live lesson, voice coaching, optional cloud wording of the cue). Footer: who builds what | None | cisco-fit-note.md s6 slide A legend; build-plan-v0.md s4 (LLM rewrite "off on stage"); verification-overdrive.md s1 fix 5 |
| 7 | To proceed | "Proposed: one outreach team, 12 weeks, Outreach Funding. Go or stop at week 12: practice, retake fixes, hand-offs, interest in further study (week 1 vs 12)." Label: "Indicatively costed; mostly staff time; figures on request" | None (no pilot price on stage) | business-case-v1.md s3a, s9; coordinator rule 20:19 |
| 8 | Future and close | Buddy, shared instruments, more instruments (small); the close line (large) | None | state-of-play s2 |

- Slide 6 is shown during beat 5 (it answers the networking judge's "what actually works today", judge-angles review); slide 5 can merge into it if the team wants seven slides.
- The 24-to-7 voice number and the demo number are different things; never show both as "results" (consistency review, kept).

## 4. The demo, beat by beat (60 seconds), and fallbacks
- Kit: USB MIDI keyboard into stage-laptop Chrome on localhost, HDMI mirror, the app's own synth as the only sound (demo-instrument-decision.md s3).
- Phrase: placeholder, "one phrase of a tune everyone knows"; the note list sits in `data/phrases.json`, so the Sunday choice (section 0 row 1) changes data, not script.
- Take 1: captured Saturday with two real errors, replayed through the real scoring code and labelled "replay" (build-plan-v0.md s1 and s6).
  o With option B (Ode bars 1-2) the captured take rushes from note 5 and has one wrong key not on note 1, so only the "you speed up" rule fires (demo-instrument-decision.md s4). Re-check the rule order for options A and C.

| Clock (relative) | Sec | Screen (build-plan-v0.md s5 names) | Justin | Words |
|---|---:|---|---|---|
| +0:00-0:10 | 10 | Goal entry and next small goal: the typed goal ("play this song for Mum") beside the saved model plan, labelled "Model example (saved answer)"; small goal "one phrase, steady"; two progress lines | Points at the typed goal, then the plan | "Rules choose today's cue from the notes I play. Our cloud model turned my typed goal into these steps; this is its saved answer, labelled." (fallback line in section 2) |
| +0:10-0:20 | 10 | Live line, take 1 with a large banner "Take 1: recorded Saturday, scored now"; played bars drift ahead of ghost bars | Watches; Carlos starts the replay | "Take one, recorded Saturday, scored now by the real code." |
| +0:20-0:27 | 7 | One fix card: "You speed up as you play. Let the click lead." Ghost bars show the beat. "On time: x of N" stays visible | Reads the cue aloud | "One fix, in plain words: you speed up as you play; let the click lead." |
| +0:27-0:41 | 14 | Count-in, live retake; lit keys; played bars on the ghost bars | Plays live on the MIDI keyboard | "Live now. Watch the on-beat count." |
| +0:41-0:49 | 8 | Retake proof, held still: "On time: x of N, then y of N" | Points at the two numbers | "Before, x of N notes on time; now, y of N. That measures timing on this same phrase, today." |
| +0:49-1:00 | 11 | Hand-off card, banner "Separate example: a learner still stuck (sample week, scripted)"; Learner 12; tap share; mock Webex message, corner label "Proposed: Webex hand-off (mock)" | Taps share | "Separate example, a learner still stuck: I tap share; a teacher gets my fix list in Webex. Today, a mock." |

- Judge pass: the cue is read aloud; the proof gets 8 s held still; the hand-off is introduced as a separate example; the replay banner is large (vendor and mentor judges).
- The retake slot (14 s) fits a phrase of about 9 s plus a 3 s count-in; a four-bar phrase at 63 bpm (about 19 s) does not fit (demo-instrument-decision.md s4), which bears on phrase option C.
- The number: "On the beat: 4 of 8 to 8 of 8" in demo-instrument-decision.md is illustrative; the real before comes from Saturday's take, the after is whatever the live retake scores. Never edit it by hand; a live 7 of 8 still shows the change.
- If the retake does not improve: "Not yet. Same one fix, slower click. One thing until it works." (demo-instrument-decision.md s4). The goal and skill line words then drop.
- The hand-off card is a separate scripted case, not triggered by the successful retake (consistency review, kept).
- No first names anywhere in the demo or the Webex mock: "Learner 12" style ids and an age band only (privacy-design-v1.md; cisco-fit-note.md s4 card fields).
- Fallback 1: no note on screen within 2 s of the first retake key, or the keyboard missing: re-plug once, then on-screen keys (laptop letters). Carlos switches; Justin plays (demo-instrument-decision.md s5).
- Fallback 2: fallback 1 not working within 5 s, an error dialog, a frozen screen, or the retake not started by +0:33: second tab, screen recording of the same run.
  o Line: "Here is the same run, recorded yesterday." No apology, no troubleshooting. No sound is not a trigger: "sound off, watch the bars".
- Wednesday morning go or no-go (Carlos calls it): live only if the last three runs used no fallback, fired the expected rule, finished inside 60 s, and the retake beat take 1 (demo-instrument-decision.md s7).
- Offline proof (airplane mode on stage): only if Monday's offline test passed; not in the default script (surprise-task-rehearsal.md s6 note).
- Voice clip (new recording, same public-domain tune): stand and Q and A only, not in the 3 minutes (demo-instrument-decision.md s6). Never a cover take: they were sung over YouTube karaoke.

## 5. Say / do not say
| Say | Do not say | Why |
|---|---|---|
| "It knows every note you play" | "It hears you", "it listens to you" (while MIDI is live) | MIDI reads keys, it does not listen (demo-instrument-decision.md s1) |
| "Take one, recorded Saturday, replayed"; "now the retake, live" | Anything implying take 1 is live | Take 1 is a labelled replay (build-plan-v0.md s1) |
| "The retake shows the fix on this phrase" | "Proves learning", "proven", "studies show it works" | One immediate change; learning is untested (judge-angles review; success-criteria-draft.md honesty line) |
| "Fits its Outreach Funding" | "HEPPP-funded" | HEPPP ended 1 Jan 2026 (business-case-v0.md s1) |
| "Apps that mark notes exist; we add one explained fix, a retake showing it, a human at the ceiling"; if pressed: "we found no page-documented example among 27 products" | "First", "nobody", "no one else", "only app"; "your own goal" as our difference | Listening and goals are common ground; page silence is not absence (competitor-feedback-mechanics-v1.md s1) |
| "Rules catch what was measured; the model turns it into your words and your plan" (Q and A) | "Our AI hears you"; implying a live model on stage | Stage cues come from rules; the model layer is off or cached (tech-feedback-layer.md s1; build-plan-v0.md s4) |
| "Today, a mock"; "proposed" | "Built on Cisco", "integrated with Webex", "Cisco-backed", "Cisco AI listens" | cisco-fit-note.md s5 never-say lines |
| "We found no music in it" / "no music we could find" | "Zero music programmes", "Music: none", "they have no music" | The UC page is silent on disciplines (verification-overdrive.md s1 fix 3, s2 row "Music: none") |
| Stage build, if asked: "On stage, nothing leaves this laptop; the cue comes from rules on the device." Product design, said with "device" on stage because the rig is a laptop: "Audio stays on the device; the cloud coach sees numbers and your typed goal; a teacher hears a clip only if you share." | "Only numbers go to the cloud", "only anonymous numbers leave the phone", "your data stays in Australia", "we are privacy compliant", "cloud only for the hand-off and sync" | The model input also carries typed goal and words; the provider has no Australian region, so it is an overseas disclosure (privacy-design-v1.md s6); stage build has the model off (build-plan-v0.md s4; verification-overdrive.md s1 fix 5) |
| "84% of users found AI feedback helpful; 60% of users trusted it, against 90% for teachers" (Q and A only) | "60% of students trusted AI" | Denominator is the 3,328 who had used GenAI feedback (verification-overdrive.md s1 fix 4) |
| "An indicatively costed pilot, mostly staff time" (figures in Q and A only) | Any pilot price on stage; "under $5,000"; "fully costed"; "our buyer" without "proposed" | Purchased items are A$4,549 but the real sponsor cost is about A$17,000 or more; no buyer has agreed (business-case-v1.md s3c, s9) |
| "A nine-person test is planned" (Q and A only) | Any nine-person result, or "students loved it" | Ethics may block it; no data exist (nine-student-test-plan.md s1) |
| "Designed to keep audio on the device" | "Compliant", "legal", "fully private" | privacy-design-v0.md s6 |
| "In a browser; built for a cheap phone" (Q and A) | "Works on any phone", "accessible", "meets WCAG", "works offline everywhere" | accessibility-design-v0.md s9; stage is a laptop |
| "Three hours from Canberra" | "Three hours from here" | The stage is in Melbourne (decisions-log.md overnight row) |
| "Surveyed primary teaching degrees average about eight hours" | "Every teacher gets eight hours"; "in a four-year degree" | An average across surveyed degrees (decisions-log.md overnight row) |
| "Users" for the connectivity figure (Q and A) | "Households" | ADII counts users (decisions-log.md overnight row) |
| If asked: "It listens and coaches." | Anything about generating music, in either direction (v0's "it never generates music" is dropped too) | No-music-generation rule; surprise-task-drill.md dropped the line (coordinator, 20:19) |
| "Augment the teacher; hand you to a human" | "Replace lessons", "no teacher needed" | R10 |
| | "Half of schools cut music", "3% of teachers", "89% positive", "least diverse economy", "ANU closed its music school" | state-of-play s5 |
| | Carlos's vocal range or equipment; any cover take; YouTube karaoke | talking-script do-not-say; R13 |

## 6. Three alternative opening lines
- Option 1 (Carlos, hook first, 20 words): "This year I recorded covers alone. What I needed was one fix, and a retake that showed it worked."
  o Replaces beat 1's first sentence; rests on cause, one fix and proof, not on hearing, which 19 of 21 apps already do (self-assessment-v0.md s5).
- Option 2 (Simone, the composite picture, 23 words): "Picture a Year 5 girl tapping rhythms on her desk, three hours from Canberra. There is no music teacher nearby."
  o From surprise-task-rehearsal.md s6; then Carlos tells beat 1 (one extra hand-over, about 2 s).
- Option 3 (the room, 21 words): "Keep your hand up if, when you started an instrument, someone listened and told you one thing to fix."
  o Risks a cold room; use only after a low-energy slot.

## 7. Change log (v0 to v1)
| Beat | v0 line | v1 line | Reason and source |
|---|---|---|---|
| Header | "Roles, instrument and buyer are leans" | Section 0 lists ten Sunday choices | Brief; demo-phrase-and-rights.md vs demo-instrument-decision.md vs small-goals-engine-spec.md disagree on the phrase |
| 1 | "at home, alone" | "alone" | Word budget (2:40) |
| 1 | "Everything I typed about my voice pointed the wrong way, because it could not hear me." | "It could not hear me; everything I typed pointed the wrong way." | Shorter, same claim |
| 1 | "One retake, measurably better." | "My next take measured better: one learner, one take." | n = 1 said aloud; causation not claimed (judge-cross review) |
| 1 | "Nobody sent me." | "Nothing pointed me to one." | "Nobody" banned (brief); keeps the hand-off gap |
| 2 | "nobody heard us and told us one thing to fix" | "nothing told us the one thing to fix" | "Nobody" banned; "heard" dropped to match MIDI wording; teammate stories still to confirm (state-of-play s10) |
| 2 | "Primary teaching degrees average about eight hours of compulsory music, in total." | "Surveyed primary teaching degrees average about eight hours of compulsory music." | Population named (judge-cross review; decisions-log.md overnight row) |
| 3 | "a coach that hears how you play" | "a practice coach that knows every note you play" | MIDI on stage (demo-instrument-decision.md s1, s9 row 4) |
| 3 | "You name a goal: play this song for Mum." | "You name a goal;" | The goal card in the demo shows the words; word budget |
| 3 | "Ten seconds, one fix, a retake that shows it." | "one fix, then a retake that shows it" | Phrase length depends on the Sunday phrase choice |
| 4 | Whole demo live, planted bar-2 rush | Take 1 = labelled replay with two real errors; retake live | build-plan-v0.md s1, s6; demo-instrument-decision.md s1 |
| 4 | "Today's small goal: the first phrase, steady." | "Today's small goal: one phrase, steady." | Phrase not decided; option A deliberately is not the first phrase (coordinator update; demo-phrase-and-rights.md s1) |
| 4 | (silence during take 1) | "Take one, recorded Saturday, replayed through the real scoring." | Say what is live (consistency review fix 3) |
| 4 | "it shows me what it wanted" | "it shows me the beat it wanted" | Matches the timing cue on screen |
| 4 | Cue "You rushed into bar 2. Count one-two before the jump." | "You speed up as you play. Let the click lead." | demo-instrument-decision.md s4, s9 row 3 |
| 4 | "The retake shows it worked. My goal moved, and my skill moved." | "Before, x of N on the beat; now the live number. My goal line moved, and my skill line moved." | One measured number pair (consistency review fix 4); "line" stops it sounding like a measured skill gain |
| 4 | "it offers me one, with my recording and my fix list" | "When a fix needs a real teacher, I tap share; a teacher gets my fix list in Webex. Today, a mock." | Webex mock labelled proposed; no teacher arranged (cisco-fit-note.md s5 line 1; build-plan-v0.md s11) |
| 4 | Phone or tablet mirrored; variants A and B | Laptop Chrome on HDMI; MIDI; on-screen keys fallback | demo-instrument-decision.md s1 contradictions table |
| 5 | "Our proposed buyer is universities" | "Our proposed buyer: a university outreach team." | One buyer, still proposed (business-case-v1.md s9: no buyer has agreed) |
| 5 | "with no music we could find" | "we found no music in it" | Same safe meaning, shorter |
| 5 | "Videos cannot hear you. This can, and it hands you to a human." | "Apps that mark notes exist; we add one explained fix, a retake showing it, and a human at the ceiling." | Listening is common ground; MIDI does not hear (competitor-feedback-mechanics.md s4) |
| 5 | "We lived that gap." (and a draft voice bridge) | Dropped; bridge moved to the add-if-short list | Covered by beat 1 and "three of us"; word budget |
| 5 | (none) | "Keys today; my voice is why it must listen too." | Bridges the voice story to the keyboard demo (demo-instrument-decision.md s6) |
| 6 | "one outreach partner, one term, one measure: does the retake improve?" | "an indicatively costed twelve-week pilot for fifty learners, mostly the outreach team's staff time" | business-case-v1.md s3a, s9; no price on stage (coordinator rule 20:19; figures in qa-prep-v1.md Q13); no HEPPP (verification-overdrive.md s1 fix 2) |
| Say box | "It never generates music" | Dropped; if asked "it listens and coaches" | surprise-task-drill.md (coordinator, 20:19) |
| 6 | "low-risk ethics review at UC usually takes two weeks" | Moved to Q and A | Conditional fact; cut for time (judge-cross review flags readiness overreach) |
| 6 | (one measure) | "At week twelve, go or stop: still practising, retakes showing the fix, hand-offs happening, and interest in further study up from week one." | One evaluation plan (judge-cross disagreement 3); the aspiration outcome the buyer's money requires (self-assessment-v0.md s5 row 2) |
| 7 | "Next: a buddy, shared instruments, more instruments." | "Next: a practice buddy, shared instruments, more instruments." | Kept as a glimpse (Frank: future glimpse at the end) |
| 8 | "The first step into music should not depend on your postcode. We make the first step free..." | "Music should not depend on your postcode. We make the start free, and hand you to a human for the rest." | No "first" (brief); matches surprise-task-rehearsal.md s6; old line kept as option (section 0 row 3) |
| Slides | Slide 5 "UC Aspire ... Music: none." and "0 music programmes found"; slide 7 "about 2 weeks ethics" | "Music: none we could find"; slide 7 = pilot figure; slide 6 = built / mock / future | verification-overdrive.md s1 fix 3 and s2 row "Music: none" (differs); consistency review; cisco-fit-note.md s6 |
| Slide 6, say box | "Offline proof ... only if the whole loop runs on the device" (cloud role unstated) | "Nothing leaves the laptop on stage; cue from rules on the device" | verification-overdrive.md s1 fix 5 and s4 row "Cloud use"; build-plan-v0.md s4 |
| Say box | "84% of student users ... 60% trusted it" | "84% of users ... 60% of users trusted it" | verification-overdrive.md s1 fix 4 and s2 row Henderson (denominator 3,328 users) |
| Openings | "Videos cannot hear you play... on my ninth take"; "Nobody will ever hear her try" | Option 1 rests on one fix plus proof; option 2 from surprise-task s6 | Hearing is common ground and untrue with MIDI (self-assessment-v0.md s5); "nobody" banned |
| Judge pass | v1 script (250 words, 26 s opening, "Two lines..." line, cue not read aloud, proof 4 s, hand-off straight after the retake) | 243 words; opening 21 s; beat 3 judges' rewrite; cue read aloud; "Live now. Watch the on-beat count."; proof held 8 s with both numbers; "Separate example"; model example at the goal card (conditional); mentor bridge in beat 5; partner sets the continue bar | pitch-judge-answer.md (Astra high, three judges); score-lift-answer.md (Astra high coach) |

## Method
- Read: COMMON-RULES, session-rules.md, pitch-v0.md, qa-prep.md, state-of-play-2026-11-06.md (s2, s4 to s10), RESUME.md (7 Nov lines), functional-requirements-v0.md, demo-instrument-decision.md (all), build-plan-v0.md (s1, s2, s4 to s7, s9 to s11), success-criteria-draft.md (s1 to s3), business-case-v0.md (s1 to s3, s8), competitor-feedback-mechanics.md (s1, s4), cisco-fit-note.md (s1, s4 to s7), accessibility-design-v0.md (s1, s8, s9), nine-student-test-plan.md (s1, s3 ethics, s10), surprise-task-rehearsal.md (s6), decisions-log.md (overnight rows), privacy-design-v0.md (s1, s6), key-facts-info-pack.md (s2 to s4), demo-phrase-and-rights.md (s1) and small-goals-engine-spec.md (header, s3) after the coordinator's 20:07 update.
- Word counts: a small Python counter in the scratch folder on the exact quoted lines; seconds at 150 words a minute.
- No web research; every figure is copied from a team file row named beside it.
- Three Codex (GPT-6) critiques read as a second reviewer (judge cross-check, consistency check, judge question set); names were replaced by [person].
  o Kept: label the replay aloud; one measured number pair; "line moved" not "skill moved"; Webex card labelled mock and proposed; scripted ceiling case separate from the successful retake; "none found" not zero; one evaluation plan; population on the eight-hours figure; built / mock / future slide.
  o Rejected: "voice wins under the stated precedence" (consistency review): the team's later decision memo and build plan put MIDI on stage and voice as the story; the requirements file predates that; Sunday decides (section 0 row 2).
  o Rejected: replace the future glimpse with the next validation decision: Frank asked for a glimpse at the end (state-of-play s4); the validation decision is in beat 6.
  o Rejected: drop "free": the business case has the learner paying nothing and the outreach team paying; Q and A carries the funding answer.
  o Rejected: drop "three of us": it is the why-this-team answer; kept pending teammates' confirmation.
  o Deferred to Q and A: noise, devices, latency, AI vs rules, teacher affordability (no room in 2:40, and no test data yet).
- Late team files folded in after the first draft (coordinator updates, 20:07 to 20:16): demo-phrase-and-rights.md, small-goals-engine-spec.md (phrase kept open), verification-overdrive.md (slide 5, cloud wording, Henderson denominator), competitor-feedback-mechanics-v1.md (combination line, no "own goal"), self-assessment-v0.md (aspiration line, hook, model question, soften 24 to 7, no 5 dB, no "two-thirds"), business-case-v1.md (A$17,000 core, never "under $5,000", buyer proposed), privacy-design-v1.md (stage sentence, never-say lines, no first names).
- Codex re-check of the finished v1 script (gpt-6-sol, high, names replaced by roles, stage facts pasted; answer in the scratch folder): what it still flags, and what we did:
  o Timing: 250 words plus the 60 s demo is 2:40 before four hand-overs, so "about 2:40" is optimistic. Accepted as a warning: hand-overs come out of the 20 s buffer (about 5 s each); Tuesday's timed runs decide; cut order in section 1.
  o The demo proof: baseline not yet captured, take 1 is a replay, the live retake may score worse. Already handled: replay labelled in words and on screen, "not yet" line, never edit the number; capture Saturday.
  o The two lines (goal, skill) move from the same retake, not two independent gains. Kept the wording "line moved", flagged for Simone; Q and A must not call it two results.
  o The vocal story motivates a keyboard demo; do not imply it validates keyboard learning. Agreed; no line claims that.
  o Buying case: no buyer agreed; A$17,000 excludes the all-in range. Resolved after the re-check: no price on stage at all (coordinator rule); Q13 carries core and all-in figures.
  o Rejected: replacing the future glimpse with "ethics, learner test, buyer agreement" (Frank asked for a glimpse at the end; the next steps sit in beat 6 and Q and A); "we propose free access" (the learner pays nothing in the business case, so "free" is true for the learner); rewriting the hook to "reads each played note" and the cue line to name "an on-device rule" (team wording from demo-instrument-decision.md s9 is accurate and plainer); "Three of us struggled" (kept pending teammates).
  o Still flagged and left to the team: "My next take measured better" rests on a reconstructed record (n = 1 said aloud; Q and A Q6 carries the caveat); "Surveyed ... degrees" phrasing could be smoother.

### Judge pass (6 Nov night): kept and rejected
- Kept: shorter opening; beat 3 plainer line; cue read aloud; the 5-second pre-retake line (shortened to "Live now. Watch the on-beat count."); proof rewrite with both numbers and "timing on this same phrase, today"; "Separate example" before the hand-off; large replay banner; model example at the goal card (conditional on a real saved answer); mentor and aspiration bridge; partner sets the threshold.
- Rejected, with reasons:
  o Cut beat 2 (composite child and statistic, 15 s; two judges): it is the problem-and-statistic answer Ivan asked for (picture, then statistic) and ties the buyer to rural primary schools.
  o Cut the opening to 6 s (outreach judge): it is Carlos's first-hand evidence and the only measured record; cut to 21 s instead.
  o Close rewrite "We propose outreach-funded practice free to learners, with teacher referrals still to be tested": longer, weaker, and the close is Simone's line matching surprise-task-rehearsal.md s6; the caveat lives in beat 5 ("Proposed") and Q and A.
  o Spoken "demonstrated / untested / next decision" statement after the retake (about 15 s): no room under 2:40; slide 6 (built / mock / future) carries it during beat 5.
  o Drop the future glimpse (vendor judge, 3 s): Frank asked for a glimpse at the end; it is first on the cut list.
  o Committing the whole pitch to rural primary beginners (coach): age group is Simone's Sunday call (section 0 row 7).
  o "Proposed hand-off ... show what a teacher could receive" and "We demo a timing cue and retake, with a proposed teacher hand-off": longer and duller than the v1 lines, which already say "Today, a mock" and "Proposed".
- Criteria mapping from the judges, accepted as a warning: the pitch carries no C1 to C5 results; the Monday templates in success-criteria-draft.md s3 ("Six of nine trusted", "hand-off is built") stay conditional until results exist.
- 6 to 7 Nov overnight: corrected from consistency-audit-v1.md row 7

## Open questions
- Which phrase (section 0 row 1)? The cue, the rule that fires and N in "x of N" all follow from it; re-check the 12 s retake slot for options A and C.
- Does Saturday's capture give a take 1 whose highest-priority rule is the timing cue for the chosen phrase?
- Do Simone and Justin confirm "three of us, one gap"? If not, use the fallback line in section 0 row 8.
- Simone: the close line (row 3) and whether she delivers it (row 4).
- Carlos: slide 1 number (row 5); speak the $4,500 placeholder or not (row 6).
- Monday venue check: HDMI, laptop sound to the PA, hands-free mic for the player, a table at standing height.
- Does a 2:40 run hold with real hand-overs? Time three runs on Tuesday; cut order in section 1.

## Sources
1. pitch-v0.md (team file, 6 Nov): v0 script, slides, demo, say box, openings.
2. demo-instrument-decision.md (team file, 6 Nov): s1 recommendation and hook wording; s3 kit; s4 demo clock, cue, number; s5 fallbacks; s6 voice; s7 go or no-go; s9 Sunday list.
3. demo-phrase-and-rights.md (team file, 6 Nov): s1 Twinkle bars 3-4 recommendation, Ode backup, rights line.
4. small-goals-engine-spec.md (team file, 6 Nov): header (Ode bars 5 to 8 by ease score); s3 `data/phrases.json`.
5. build-plan-v0.md (team file, 6 Nov): s1 demo arc; s4 what runs where; s5 screen names; s6 phrase rules; s9 fallbacks; s11 Cisco wording.
6. business-case-v0.md (team file, 6 Nov): s1 one buyer, HEPPP ended 1 Jan 2026, Outreach Funding; s3 pilot sizes and go or no-go; s8 three answers. Underlying sources [S1] to [S24] are listed there.
7. competitor-feedback-mechanics.md (team file, 6 Nov): s1 and s4 common ground and the Yousician lines.
8. cisco-fit-note.md (team file, 6 Nov): s5 spoken and never-say lines; s6 slide A legend.
9. surprise-task-rehearsal.md (team file, 6 Nov): s6 30 s and 60 s versions, close line.
10. state-of-play-2026-11-06.md (team file): s2 idea, s4 advisor points, s5 safe lines and do-not-say list, s9 close line, s10 owed lines.
11. research-bank.md rows as cited in pitch-v0.md: Fading Notes 2023 https://www.alberts.co/wp-content/uploads/2023/06/Music-Education-ITE-Report_A4_130623.pdf (opened per source file, 6 Nov 2026; not re-opened tonight); first-hand evidence row 2 (n = 1).
12. verification-2026-11-06-afternoon.md s3: Aspire UC https://www.canberra.edu.au/future-students/careers-advisers-and-agents/aspire-uc-schools (opened per source file, 6 Nov 2026; not re-opened tonight).
13. accessibility-design-v0.md s1, s8, s9; privacy-design-v0.md s6; nine-student-test-plan.md s1; decisions-log.md overnight rows (team files).
14. Codex critiques (scratchpad, not team files): judge-cross-answer.md, consistency-answer.md, judge-angles-answer.md; v1 re-check answer1.md in the pitch-v1 scratch folder.
15. Late team files (6 Nov, 20:07 to 20:16): verification-overdrive.md s1, s2, s4; competitor-feedback-mechanics-v1.md s1, s5; self-assessment-v0.md s2, s5; business-case-v1.md s3a, s3c, s9; privacy-design-v1.md s6; tech-feedback-layer.md s1, s6.
