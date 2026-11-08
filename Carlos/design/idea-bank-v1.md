# Idea bank v1: every idea the team and advisers raised, scored for success and uniqueness

- Date: Fri 6 Nov 2026 night (overnight run), drafted 23:20 to 03:00 AEDT; web checks accessed 2026-11-06.
- Purpose: mine every idea (team, advisers, research files) for what makes the product succeed and hard to copy.
- Scope: 71 ideas from the ideas board, concept files, engine spec, hand-off design, pitch v2, trend checks, research files, objections, Sunday sheet rows A18 to A24, transcripts 01 to 09.
- Status: overnight draft for the team; verify before the pitch. Complete 23:45; Codex critique folded.
- Bottom line:
  o No single feature is unique; the hard-to-copy part is a loop plus a human supply: one explained fix proven on the retake, inside the learner's own bounded goal, with a clip-and-fix-list hand-off to supervised pre-service teachers, delivered through programs that already exist.
  o The code can be copied in a month; the reviewer pool and the outreach channel cannot. Lead with that pairing, never with a priority claim.
  o Two ideas dropped too early deserve a second look: the pre-service teacher studio (reborn as the reviewer pool) and cohort cause patterns for the partner teacher (Outbreak Watch, re-aimed).
  o Two kept ideas lack support: "your own goal" as the difference (6 of 27 apps state goals) and the two progress lines (display untested).

## 1. The idea bank

- Key: Unique = high / medium / low with one reason. Verdict = core (build or say by Wednesday), future (pitch future row or slide 8), park (keep on file), drop.
- Source numbers in square brackets point to `## Sources`; T05 to T09 = transcript, with approximate position in percent of the file.
- "Competitor" cites the gap table in competitor-feedback-mechanics-v1.md s4 [13] (columns G, F, C, H, I, T, O) or a web check.
- Cost: S = hours, M = a day or two, L = a week or more, X = needs a partner or ethics before it can be claimed.

### 1a. The feedback loop (what the coach hears and says)

| ID | Idea (15 words max) | Origin (role) | Problem it solves | Evidence for / against | Competitor already? | Cost | Unique | Verdict |
|---|---|---|---|---|---|---|---|---|
| A1 | Listen live: pitch and timing tracked during the take, not after | Carlos's practice record; R1 [18] | Errors found only after the take, too late to fix | For: old melody caught in bar one would have saved takes (n = 1) [17]. Against: listening is common ground [13] | Yes: most of 27 listen live [13] s5b | S (MIDI), M (mic) | Low: table stakes | Core |
| A2 | Translate the learner's vague words into a cause in plain words | Carlos's record; R2 [18] | Learners misdescribe problems ("singing forward" was a recording lag) | For: two wrong self-diagnoses in the record [18]. Against: n = 1; rules cover few causes | C column: 0 Y, 3 P, 19 ? of 27 [13] | M | Medium: no page states it, pages mostly silent | Core |
| A3 | One fix per retake, then before-and-after proof on the retake | Carlos's record; R3 [18]; Stanley, Chris "one fix with proof" [17] | Option piles and scores without a verdict stall practice | For: one cue gave a measured change in one retake (n = 1) [17]; F column 0 Y of 27 [13]. Against: no learner test yet; retake gain is not learning | F column: 0 Y, 2 P (June, Modacity), 21 ? [13]; SmartMusic marks notes green or red, no fix stated (snippet) [27]; Noteflight SoundCheck shows where pitch, rhythm and tempo errors occurred, then retry or submit (snippet) [28] | M | High: the core of the claim, but "not found on pages", not "absent" | Core |
| A4 | Range check and key recommendation before singing | Carlos's record; R4 [18] | Song above the learner's range reads as "bad voice" | For: key change fixed more than any mix tweak (n = 1) [18]. Against: voice is not the stage path [17] s6 | Not checked; vocal apps (Singing Carrots, Vocal Image) state range work (unverified) | M | Low | Future (voice path) |
| A5 | No option piles: the app recommends; the learner never judges versions | Carlos's record; R5 [18] | Eleven versions "awaiting ears", none chosen [17] | For: n = 1 record. Against: none found | Not a feature row; not checked | S | Low: a design rule | Core |
| A6 | Set-up check: microphone, level, five seconds of silence | Carlos's record; R7 [18] | Take recorded on the wrong mic, nothing warned | For: n = 1. Against: none | Common in apps (not checked) | S | Low | Core (mic path) |
| A7 | Pitch guide line while singing | Carlos's record; R8 [18] | "No pitch guide" asked for directly | For: n = 1 request. Against: guide can mask errors | Common (Yousician, Simply Sing listen and show) [13] | S | Low | Future (voice) |
| A8 | Rest cue and session cap; goal re-spreads to tomorrow | Carlos's record; R9 [18] | Voice tired by take six; practice ran two more hours | For: n = 1. Against: none | Not checked | S | Low | Core (one line of copy) |
| A9 | Show visually what the learner should have played instead | Third adviser (probably Madison), T09 ~69%: "visually show the person what they should have been doing instead" | Teachers struggle to articulate feedback | For: adviser from skill-acquisition background [17] s4. Against: untested | Common as note colouring (SmartMusic green/red, snippet [27]) | S to M | Medium: paired with the cause, not alone | Core |
| A10 | AI picks the easiest phrase to start, not bar one | Third adviser, T09 ~76%: "decide what part of the song to start at"; R17 [18] | Starting at the hardest bar kills confidence | For: engine scores Twinkle bars 3-4 lowest (0.257) [6] s5. Against: Ode bars 1-2 gives no visible "skip" moment [6] s1 | Not found in pages read (not checked directly) | M (done in spec) | Medium: a judge-visible moment if Twinkle is chosen | Core |
| A11 | Per-note measurement against the phrase, the answer to "why not ChatGPT" | Objection 1 analysis [15] s2 | General assistants can listen and chat but do not measure notes | For: docs opened on assistants [15]. Against: head-to-head not run; Gemini audio is cheap per minute [15] | Assistants (objection 1); note scoring is common [13] | M (benchmark protocol exists) | Medium: only with a published head-to-head | Core |
| A12 | On-device rules choose the cue; the language model only words it | Engine spec s8; RESUME night summary | Cloud dependence, cost, privacy, stage risk | For: stage runs with no network [6] s8; offline gap [17] s5. Against: rules cover a few causes only | O column: 0 Y, 2 P, 24 ? [13] | M | Medium: honest and robust, not glamorous | Core |
| A13 | Plain words only: no units, no "score", no failure words on screen | R6 [18]; engine spec s10 [6]; third adviser "plain-words prescriptive feedback" [17] | Jargon ("one notch" became 10 dB) blocks beginners | For: n = 1 plus adviser. Against: none | Not a stated feature anywhere (not checked) | S | Low | Core |
| A14 | Add a single sharp-note cue before the benchmark | Sunday sheet A23 [16] | Benchmark take T2 will show a miss in our own rules | For: closes a known gap. Against: new rule, enum and test on Saturday [16] | Not applicable | S to M | Low | Park: report the miss honestly (A23 default) |
| A15 | Script the stage cue on a robust rule, not the fragile "you speed up" | Sunday sheet A24 [16] | K3 may not fire on an honest capture | For: prototype review D1 [16]. Against: changes pitch-v2 line 1:00 [8] | Not applicable | S | Low | Core (decide Sunday) |
| A16 | Catch habits across takes: the same cause three times becomes a pattern | Dan, "agentic AI listens back and catches habits" [17] s4; adviser T07 ~88%: "personalized feedback before you start letting bad habits" | One-off feedback misses repeated errors | For: miss counter already in the spec [6] s8. Against: miss-3 is an unvalidated threshold [15] s4 | Singing Carrots recaps change across sessions [13] s1 | S (exists) | Medium: say "remembers your repeated cause" | Core (wording) |
| A17 | An explicit "I'm not sure" state before naming a cause | Codex critique, adopted after check | A wrong confident cause breaks trust | For: AI trusted 60% vs teachers 90% [17] s5. Against: adds a screen | Not checked | S | Low: a trust rule | Core (rules return no cue when unsure) |

### 1b. The goal engine (what keeps the learner coming back)

| ID | Idea (15 words max) | Origin (role) | Problem it solves | Evidence for / against | Competitor already? | Cost | Unique | Verdict |
|---|---|---|---|---|---|---|---|---|
| B1 | Two-track goal: learner's own result split into small goals, one fundamental each | Carlos, 6 Nov evening [4]; R14 [18] | Beginners want a result, not a course | For: autonomy g = .638 [11]; n = 1 cue fixed cover and voice [4]. Against: "trick" doubt untested [17] s12 | G column: 1 Y (June), 5 P of 27 [13] | M | Low alone: own goals are stated by 6 of 27 | Core, but not the claim |
| B2 | Two progress lines: "your goal" and "skills practised" | Carlos [4]; R15 [18]; engine s7 [6] | Learners cannot see skill growth inside a song goal | For: progress monitoring d = 0.40, mostly health goals [12]. Against: this display is untested [6] s7 | T column: 0 Y, 3 P, 10 N [13] | S | Medium: two lines not found, but weak proof | Core (test it) |
| B3 | Ahead line as a buffer: "2 days in hand" | Carlos, 5 Nov "two weeks ahead" [17] s3; engine s7 [6] | Falling behind feels like failure | For: no direct study [12] s8. Against: same | Ahead (iOS) uses streaks and XP [12] s4 | S | Medium: wording, easy to copy | Park for the pitch; keep as app copy |
| B4 | A miss re-spreads the goals; no streak, no shame copy | Small-goals rule 4 [12] s6; engine s6 [6] | Streak loss drives quitting | For: self-forgiveness predicted less procrastination (correlational) [12]; one missed day had little effect on habit [11] s2. Against: correlational | Most apps use streaks (Yousician, Duolingo) [9] s2 | S | Medium: visible contrast with Duolingo | Core |
| B5 | Bounded catalogue of supported phrase goals instead of free-typed goal splitting | Objection 1 design change [15]; Sunday A21 [16] | Free-typed splitting is easy for assistants to copy; typed text is a privacy exposure | For: removes typed-text disclosure [16] A21. Against: loses the typed-goal stage moment; catalogue build time unknown [16] | June takes free goals [13] | M | Medium: makes every goal measurable | Core (build both; decide Sunday) |
| B6 | Adaptive difficulty: one knob per change; code decides, model words it | Third adviser [17] s4; R16 [18]; engine s8 [6] | Overload or boredom | For: adviser steer; novelty fades about week 4 [11] s1.3. Against: no evidence AI personalisation beats adaptive difficulty [9] s8 | Common (Yousician levels) [9] | S (spec) | Low | Core |
| B7 | Off-day check: warm-up comparison offers an easy day | Engine s8 [6]; R16 [18] | A bad day reads as regression | For: retrieval 61% vs 40% at a week [11] s2. Against: transfer to warm-up uncertain [6] | Not found (not checked) | S | Medium | Future |
| B8 | Micro-chunks: four notes at a time is the reward | Carlos, T09 ~86%: "you can just learn four notes at a time" | Big pieces feel impossible | For: proximal subgoals built mastery [12] s6. Against: too many subgoals cut satisfaction [12] | Common in lesson apps (not checked) | S | Low | Core (inside B1) |
| B9 | A real audience and date as the goal ("play Twinkle for Mum on her birthday") | Engine worked example [6] s6; Carlos's goal phrasing [17] s2 | Practice without a deadline drifts | For: commitment device +40% completion in one online course [12] s3. Against: one course; birthday date is a soft commitment | Not found (not checked) | S | Medium: emotional, demo-friendly | Core (demo copy) |
| B10 | Implementation-intention prompt: "when and where will you practise?" | Research only: gamification file s2 [11] | Reminders alone do nothing | For: d = .65 over 94 tests [11]; reminders alone null at scale [12] s3. Against: not raised by any adviser | Not checked | S | Low | Core (one screen, cheap) |
| B11 | Spaced warm-up of the last passed phrase | Engine s8 [6] | Skills fade between sessions | For: retrieval and distributed practice high utility [11] s2. Against: untested in music here | Common (not checked) | S | Low | Core (inside B7) |
| B12 | Duolingo-style gamification ("a musical Duolingo") | Third adviser, T09 ~83%: "would you consider gamifying it in any way" | Lower the barrier, add habit | For: meta-analyses g about .46 to .50 [17] s5. Against: novelty fades week 4; badges plus leaderboards can harm [11] s1.3 | Yes: Duolingo Music, Yousician levels [11] s7 | M | Low | Drop as skin; keep structure (B1 to B4) |
| B13 | Bosses, raids, world map, leaderboards (Questline game layer) | Carlos's lead, 5 Nov [4] | Make the journey feel like a game | For: relatedness g = 1.776 if social [11]. Against: Carlos cut it as over-gamified [17] s3; leaderboards harm low performers [11] | boot.dev, Duolingo [1] row 21 | L | Low | Drop |

### 1c. The human hand-off and the teacher side

| ID | Idea (15 words max) | Origin (role) | Problem it solves | Evidence for / against | Competitor already? | Cost | Unique | Verdict |
|---|---|---|---|---|---|---|---|---|
| C1 | Hand-off card: chosen clip, goal, fixes tried with before-and-after, to a human | Carlos [17] s2; R10 [18]; Frank "human plus AI" [17] s4 | AI hits a technique limit; teacher time is scarce | For: 60% trust AI feedback vs 90% teachers (Henderson 2025) [17] s5. Against: no referral happened in the record [17]; mock on stage [6] s9 | H column: 0 Y, 4 P, 20 ? [13]; SmartMusic sends recording and score to the class teacher (snippet) [27]; Noteflight SoundCheck: student retries or submits the take, teacher comments in the score (snippet) [28] | M (mock), X (real) | High: the trigger-plus-fix-list loop not found [13] s5a | Core |
| C2 | "Ask for help" any time; app suggests after repeated difficulty; drop "ceiling" | Objection 3 design change [15]; Sunday A20 [16] | Waiting for three misses delays help | For: answers the mentor objection directly [15]. Against: "ask any time" may sound like a staffed service [16] A20 | Teacher links exist for existing teachers [13] s5b | S | Medium | Core |
| C3 | Supervised pre-service teachers as the reviewer pool | Hand-off design v1 s1, s5 [7] | Who answers the hand-off in a regional town | For: 58% of surveyed universities say students never see a music lesson on practicum [7]; about 8 hours of music in a primary degree [17] s5. Against: no university has agreed; checks and supervision needed [7] s5 | Not found; Lessonface is a paid marketplace [13] s5a | X | High: institutional supply a vendor cannot copy | Core as the pilot ask; labelled proposed until a university agrees |
| C4 | Mentor receives a strengths-and-gaps overview, not raw clips | Teammate, T09 ~16%: "the student has good ears but is struggling to uh understand music notes" | Mentor minutes wasted on diagnosis | For: answers objection 3 "so their time counts" [15]. Against: overview quality depends on few rules | Teacher gradebooks exist (SmartMusic, snippet) [27] | S (card field) | Medium | Core (inside C1) |
| C5 | Partner program teacher assigns the starting phrase; voice option without a keyboard | Objection 2 design change [15]; Sunday A18 [16] | App floats outside existing teaching | For: ACT program writes home practice into Year 5-6 band (per partner map, [16] A18). Against: needs a willing partner | Yes: SmartMusic teacher assignment (snippet) [27] | M, X | Low: SmartMusic does assignment | Future (load selectable phrases Saturday) |
| C6 | Taster lesson, then a chance to talk to a real music teacher | Frank, T08 ~18%: "basic lesson or so. and some stretchy opportunity, you know, to talk to real music teacher" | Learners do not know if an instrument fits them | For: Frank's sponsor view [17] s4. Against: needs teacher supply (C3) | Lessonface, teacher marketplaces [13] | X | Medium | Core as the pathway step of C1 |
| C7 | Classroom dashboard: teacher sees each student's stats against the class | Teammate, T07 ~72%: "the teacher could see the, like the stats of what this student is doing" | Classroom teacher oversight | For: none in files. Against: comparison harms low performers [11] s1.3; surveillance [3] principles | Yes: SmartMusic gradebook (snippet) [27]; Piano Marvel teams [9] | M | Low | Drop |
| C8 | Sell to private tutors: augment the tutor between lessons | Dan [17] s4; adviser T07 ~73%: "guitar teaching is a bit of a side puscle" | Tutors cannot hear home practice | For: Dan offered to be a customer [17] s4. Against: one buyer rule; outreach chosen [17] s6 | Yousician Edu, flowkey for Teachers, Piano Marvel [13] s5b | M | Low | Park (second buyer after Wednesday) |
| C9 | University student mentors take the hand-off and introduce study pathways | Pitch v2 2:00 [8]; objection 4 [15] | Outreach funding needs a higher-education link | For: UNSW ASPIRE ambassadors, AIME mentoring models (snippet) [15] s5. Against: music gain is not aspiration evidence [15] | Mentor programs exist, not with practice data [15] | X | High: joins C3 to the funder's purpose | Core as the pilot ask; labelled proposed until a partner agrees |
| C10 | Ride inside free instrument programs as home practice between sessions | Objection 2 answer [15] s3 | "Why not go to free programs?" | For: programs run in class with a teacher; home practice is the gap [15]. Against: program pages mixed opened and snippet [15] | SmartMusic serves school ensembles (snippet) [27] | X | Medium: partner posture, not rival | Core (positioning) |
| C11 | AI reviews students so professors personalise their teaching | Teammate, T08 ~19%: "having the AI review also students that can personalize also how to teach" | Staff cannot see 450 students | For: Scott and Rodney: a lecturer cannot attend to 450 [17] s4. Against: staff-side, not student hero [1] rules | Cogniti, Cognito (campus era) [14] | M | Low | Drop |
| C12 | Named review owner and a reply-time promise for each hand-off | Codex critique, adopted after check | An unanswered card is worse than none | For: hand-off design has time limits and an unanswered path [7] s3, s4. Against: needs a partner to staff it | Lessonface sells booked lessons [13] | X | Medium: an operating promise, part of the moat | Core in the pilot ask (proposed) |

### 1d. Access and inclusion

| ID | Idea (15 words max) | Origin (role) | Problem it solves | Evidence for / against | Competitor already? | Cost | Unique | Verdict |
|---|---|---|---|---|---|---|---|---|
| D1 | Works without an instrument: on-screen keys or voice | Simone's access steer [17] s3; Kat "prove it" [17] s4 | No instrument at home | For: rental about $12 to $24 a month on contracts [17] s5. Against: I column 15 Y of 27, table stakes [13] | Yes: 15 of 27 [13] | S | Low | Core, never the claim |
| D2 | Offline-capable loop on a low-end device; cloud only for hand-off and sync | Kat [17] s4; R12 [18] | Regional connectivity gaps | For: 30.5% of very remote users have frequent connection problems vs 15.9% [17] s5. Against: unproven on a cheap phone; stage is a laptop [RESUME] | O column: 0 Y, 2 P, 1 N, 24 ? [13] | M to L | High if measured and published; zero if only claimed | Core (measure it) |
| D3 | Audio stays on the device by default; sharing opt-in | R11 [18] | Privacy, minors | For: practice is private by choice (n = 1) [18]. Against: typed goal goes to the model (overseas disclosure) [RESUME] | Not checked | S | Medium | Core |
| D4 | Built-in rights-cleared phrases; never a karaoke video | R13 [18] | Copyright risk on stage | For: rights work done [16]. Against: none | Not applicable | S | Low | Core |
| D5 | Shared, lent or rented instruments in the community layer | Kat, T08 ~74%: "renting an instrument, because I think that's a good compromise"; pitch v2 2:18 [8] | Instrument cost | For: some NSW and Qld libraries lend free; no ACT lender found [17] s5. Against: logistics, not software | Library and rental schemes exist [17] s5 | X | Medium | Future |
| D6 | AI recommends an instrument (hands, taste) and offers tasters | Teammate, T07 ~14%: "Is it possible for an AI to actually recommend you an instrument?" | Children never get to explore | For: kids want drums, parents push piano (adviser, T09 ~35%). Against: no evidence physique predicts fit | Instrument quizzes common (not checked) | M | Low | Park |
| D7 | Digitised diverse and cultural instruments (Chinese flute, Zimbabwean instruments) | Teammate, T05 ~66%; adviser T07 ~45% | Narrow Western-only offer | For: real cultural gap in feedback apps [9] s2. Against: GarageBand erhu and pipa since 2016; consent cannot be secured by 11 Nov [9] s9 | Partial: erhu, dizi, bansuri pitch apps [9] s2 | L, X | Medium | Drop for Wednesday; future slide only if consent route named |
| D8 | Recorder as an entry instrument schools already own | Teammate, T09 ~22%: "plastic recording yeah it seems to be the easiest one" | No instrument at home | For: uses instruments already in schools (claim, unverified). Against: single-line pitch on a cheap mic untested | Recorder apps exist (not checked) | M | Medium | Future: pilot candidate if mic scoring works (section 3) |
| D9 | Confidence before skill: private practice before playing in front of others | Teammate, T07 ~30%: "I was always scared if I would make a mistake and embarrass myself"; adviser T09 ~80% | Fear of embarrassment stops beginners | For: third adviser "confidence before skill" [17] s4; adults "should have known singing was so much fun" (anecdote, T08 ~31%). Against: no measure yet | Most apps are private by default | S | Medium: framing, not feature | Core (problem picture) |
| D10 | Minimal infrastructure: a browser app, no install, no accounts | Kat, T08 ~73%: "minimizes the amount of infrastructure that's required" | Universities will not fund heavy tech | For: Kat's scalability steer [17] s4. Against: PWA offline audio feasibility open [17] s8 | Many web apps | S | Low | Core |
| D11 | Inclusion for students with disability | Teammate, T05 ~39%: "a student with disability a student from a low scs background" | Physical access barriers | For: accessibility design file exists (not read for this bank). Against: not tested | Not checked | M | Low | Core (accessibility-design-v1) |
| D12 | Less AI, more people at the centre if feasibility fails | Kat, T08 ~65%: "less AI and tech based and more on bringing people into the center" | Tech-only answer to a human problem | For: Frank "teaching is a human business" [17] s4. Against: none | Not applicable | S | Medium | Core (pitch stance) |

### 1e. Social layer

| ID | Idea (15 words max) | Origin (role) | Problem it solves | Evidence for / against | Competitor already? | Cost | Unique | Verdict |
|---|---|---|---|---|---|---|---|---|
| E1 | Practice buddy on the same goal | Carlos 5 Nov [4]; pitch v2 2:18 [8] | Solo practice fades | For: relatedness g = 1.776 vs competence .277 [11] s1.2; one buddy rule [12] s6. Against: safeguarding for minors | Tonic social practice studios [9] s2 | M, X | Medium | Future |
| E2 | Level-matched jam: AI finds who you can jam with, at your level | Adviser and team, 6 Nov 6 pm [19]; Jeff's social question [17] s4 | Jamming with someone far better intimidates | For: relatedness the largest lever [11]. Against: BandMix matches on self-rated level 1 to 5 (opened) [25]; JamFan, Jam Nation match skill (snippet) [26] | Yes, on self-rated level [25][26] | L, X | Medium: only if matched on measured takes | Future |
| E3 | Community forum or mentor match, like native-speaker chat in language apps | Teammate, T08 ~71%: "connecting student to mentor, or just like some sort of community forum" | Isolation | For: Kat's people-centred layer [17] s4. Against: moderation for minors | Common in language apps (per teammate) | M, X | Low | Park |
| E4 | Class task bar: everyone's own tasks, one shared bar, no names | Carlos 5 Nov [4] | Lonely effort | For: cooperative over competitive [11] s2. Against: designed for a unit cohort | Not checked | S | Medium | Park (fits a program cohort, not solo learners) |
| E5 | Ensemble or orchestra mode on a slide | Chris "one instrument in the demo, orchestra on a slide" [17] s4 | Music is social | For: Chris. Against: scope | Yamaha SYNCROOM remote ensemble [9] s2 | L | Low | Future |
| E6 | Adult and community singing (choirs) as a second audience | Adviser anecdote, T08 ~31% [19] | Adults regret not singing earlier | For: 40% of continuous adult players did not play in high school [17] s5. Against: dilutes one learner | Choir and singing apps (not checked) | S | Low | Park |
| E7 | In-classroom gamification where all students sign up | Teammate, T07 ~58%: "implement a sort of gamification aspect to it in that, let's say, um, in the context of a classroom" | Jeff's in-person question | For: social link. Against: leaderboard harms [11] | Yousician Edu, Piano Marvel teams [13] | M | Low | Drop |

### 1f. Sensing, records and learning methods

| ID | Idea (15 words max) | Origin (role) | Problem it solves | Evidence for / against | Competitor already? | Cost | Unique | Verdict |
|---|---|---|---|---|---|---|---|---|
| F1 | Phone camera tracks guitar fingers and chord shapes | Justin, T05 ~75%: "use a camera to track our fingers and like see the position" | Hand position errors audio cannot hear | For: MediaPipe 21 landmarks, 3 to 5 static chords staged [9] s3. Against: fretboard pose research-grade (2026); occlusion [9] s3 | Guru waitlist, ROLI infrared hardware [9] s3 | L | High but unshippable by Wednesday | Park (future slide, labelled) |
| F2 | AR simulated instrument | Teammate, T07 ~57% | No instrument | For: emerging-tech label. Against: headsets cost; Simply Piano on Vision Pro [9] s3 | Yes [9] | L | Low | Drop |
| F3 | USB MIDI keyboard input for the stage | RESUME night summary; Stanley "keyboard is lowest-hanging" [17] s4 | Mic risk on stage | For: exact notes and timing [9] s3. Against: needs an instrument | flowkey, Piano Marvel, ROLI [9] s3 | S | Low | Core (stage only) |
| F4 | Student-owned practice record shared by choice | Compass and Questline chronicle [3][4] | Progress sits in vendor accounts | For: no learner-owned practice record shared with a lecturer found [9] s2. Against: AMEB recorded-video exams exist [9] | Partial: AMEB credentials [9] | M | Medium | Future (pathway evidence, section 3) |
| F5 | Teach-the-AI (Apprentice) for music theory | Apprentice, 5 Nov [10]; [9] s4 | Passive learning | For: music-theory teachable agent, 28 students, higher scores (preprint) [9] s4. Against: concept not new; small samples [10] s3 | Axiom Flow and four others [10] s3 | L | Low | Park |
| F6 | Explore what instruments sound and look like ("a taster") | Teammate, T07 ~12%; teammate T09 ~15%: "this is like just like a testing area" | Children cannot try instruments | For: Frank's taster idea [22]. Against: GarageBand already lets you play many instruments [9] s9 | Yes: GarageBand [9] | M | Low | Park |
| F7 | Practice studio for pre-service primary teachers (as the lead) | Trend check verdict [9] s9; selection pack M2 | Teachers get about 8 music hours | For: 72% of surveyed universities offer no primary music specialisation [17] s5. Against: dropped as the lead 6 Nov [17] s3 | ANU beginner unit, no AI tool found [9] s2 | M | Medium | Revived as C3 (section 3) |

### 1g. Campus-era ideas (2 to 5 Nov), before the music pivot

| ID | Idea (15 words max) | Origin (role) | Problem it solves | Evidence for / against | Competitor already? | Cost | Unique | Verdict |
|---|---|---|---|---|---|---|---|---|
| G1 | Deadline Air Traffic Control: forecast deadline storms, replan across units (score 21) | Ideas board 6 [1] | Deadline pile-ups | For: planning fallacy 33.9 vs 55.5 days [17] s5. Against: Greenwich static map [1] | Partly [1] | M | Medium | Drop (music chosen) |
| G2 | Lost Moments: tap "lost", get a rewind tonight (20) | Ideas board 3 [1] | Shy students lose the thread | For: Slido and Webex fit [1]. Against: Echo360 confusion flag [1] | Partly [1] | M | Medium | Drop |
| G3 | Misconception Outbreak Watch: spot wrong ideas spreading in a cohort (20) | Ideas board 19 [1] | Shared errors found too late | For: no product found [1]. Against: LLM diagnosis needs human check [1] | Research only [1] | M | High (uniqueness 5) | Re-aim as cohort cause patterns (section 3) |
| G4 | Outcome Map and Journey Record (19) | Ideas board 1 [1] | "Am I understanding?" | For: no outcome-mapping product found [5] s4. Against: quiz-app look [1] | Partly: Cognito [1] | M | Medium | Drop (record survives as F4) |
| G5 | Questline: any unit outline becomes a journey map (19) | Carlos 5 Nov [4] | Units feel like task lists | For: autonomy, relatedness [11]. Against: chocolate-covered broccoli risk [4] | boot.dev, Duolingo [1] | L | Medium | Engine kept (B1); skin dropped |
| G6 | Live Sensory Map for neurodivergent students (18) | Ideas board 5 [1] | Finding calm space | For: strong Meraki fit [1]. Against: sensors per room [1] | NBCC pilot [1] | L | Medium | Drop |
| G7 | Study Squad Radar: join an in-person study pod (18) | Ideas board 4 [1] | New-student isolation | For: Cisco Spaces fit [1]. Against: accuracy, stranger safety [1] | Partly [1] | M | Medium | Drop (its social logic lives in E1, E2) |
| G8 | Feed-Forward Thread: marker comments become habit cards (18) | Ideas board 10 [1] | Feedback forgotten | For: reuses feedback [1]. Against: cross-unit data [1] | OnTask [1] | M | Low | Drop (echo in A16 "repeated cause") |
| G9 | Student's Compass: Socratic guide plus AI-use card | Direction 3 [2][3] | "What is allowed?" | For: hint-only tutor evidence [3]. Against: tutor crowded; card not unique [5] s4 | Studiosity, Turnitin Clarity [1] | M | Low | Drop |
| G10 | Show the Working: student-owned process record shared with marker | Direction 1 [2] | Thinking not credited | For: OBE fit [2]. Against: surveillance perception [2] | Not checked | M | Medium | Drop |
| G11 | Campus AI Sandbox: guardrailed models under coordinator rules | Direction 2 [2] | Uncontrolled AI | For: data stays home [2]. Against: fails the answer gate, infrastructure [2] | Cogniti [2] | L | Low | Drop |
| G12 | Marker-side grading of how students prompt | Scott liked it, T04 ~13% [24] | Assessing understanding | For: Scott's interest. Against: "marker-side grading is a feature not a product" (John, Chris) [17] s4 | Studiosity, Turnitin [14] | M | Low | Drop |
| G13 | Thirteen lower-scored campus ideas (2, 7, 8, 9, 11 to 18, 20) | Ideas board [1] | Various | Scores 11 to 17 of 25 [1] Table C | Most have incumbents [1] | M to L | Low to medium | Drop |

- Count: 17 + 13 + 12 + 12 + 7 + 7 + 13 rows = 81 rows covering 93 ideas (G13 bundles 13).

## 2. The combination that is distinctive

- The pick: five ideas that are each copyable, but together need a measured loop plus a human supply plus a channel.

| # | Part | Ideas | Evidence it works | Why hard to copy |
|---|---|---|---|---|
| 1 | One explained fix, proven on the retake | A2, A3, A9, A16 | n = 1 measured change after one cue [17] s5; F column 0 Y of 27 [13]; teachers struggle to articulate feedback (adviser, T09 ~69%) | Weak alone: a funded app could add it; the moat is the next three |
| 2 | Inside the learner's own bounded goal | B1, B5, B2, B9 | Autonomy g = .638 [11]; progress monitoring d = 0.40 [12]; commitment +40% completion (one course) [12] | Bounded phrases make every goal measurable, which free chat cannot promise |
| 3 | Runs on the device, offline | A12, D2, D3 | Connectivity gap 30.5% vs 15.9% [17] s5; O column 24 ? of 27 [13] | Only if the team publishes its own latency and device result |
| 4 | Clip-and-fix-list hand-off to supervised pre-service teachers | C1, C2, C3, C4 | 60% trust AI vs 90% teachers [17] s5; 58% of universities: students never see a music lesson on practicum [7] | Needs university placements, checks and supervision: an institutional asset, not code |
| 5 | Delivered through outreach and free programs | C9, C10, C5 | Outreach Funding program purpose (snippet) [15] s5; ambassador models (snippet) [15] | A vendor would need the university as partner; the university is the judge |

- Stage line (one sentence): "It hears one thing, tells you why in plain words, proves the fix on your next take, and when it can't, a trainee music teacher hears your clip."
- Honest claim wording: "We did not find this combination documented in 27 products we checked" (no priority or exclusivity claim).
- Sharper wedge (Codex suggestion, checked against our files and adopted): lead with home practice between sessions of an existing free program: C10 + C5 + A3 + C1 + C3.
  o The program supplies learners and the starting phrase; the coach handles narrow measurable fundamentals; trainees see only cases it cannot resolve.
- Weakest link: C3 and C9, uncommitted; an incumbent could add cue-and-retake and teacher packaging in six months (Codex view; plausible, not a prediction).
  o Noteflight SoundCheck already shows error locations, retry and teacher comments [28]; our step beyond it is the cause, the one fix, the retake proof and the outside reviewer.
- What a judge can attack: parts 4 and 5 are proposals; no university or program has agreed (objection 4) [15] s1.
- Why this beats "own goal" as the claim: 6 of 27 apps state goals [13]; the two-sided pool is the new piece.
  o Two-sided value: learners get a human; future teachers get real music practice they lack.

## 3. Dropped too early, and kept without evidence

### Dropped too early (second look)
| Idea | Dropped when | Why it deserves a second look |
|---|---|---|
| F7 pre-service teacher studio | 6 Nov, as the lead [17] s3 | Reborn as the reviewer pool (C3): the same evidence (8 hours, 58% no practicum lesson) now powers the moat |
| G3 Misconception Outbreak Watch | 5 Nov, campus era | Re-aim: anonymous cause patterns for a partner teacher ("most of the group rushes bar 2"); uniqueness 5 of 5 on the board [1]; cheap from take data; minimum group size rule reused |
| F4 student-owned practice record | Folded into Questline, then quiet | Gives outreach a pathway artefact (answers objection 4); AMEB shows recorded evidence is valued [9] |
| E2 level-matched jam | Moved to the vision slide | Distinct only if matched on measured takes, not self-rating (BandMix self-rates, opened [25]); relatedness is the largest lever [11] |
| D8 recorder | Never discussed after 6 pm | Uses instruments schools already hold; answers "no instrument" without rentals; needs a mic test |
| B10 implementation intention | Never raised | d = .65 over 94 tests [11]; one screen; beats reminders, which are null at scale [12] |

### Kept without enough evidence
| Idea | What the files claim | What the evidence says |
|---|---|---|
| B1 "your own goal" as the difference | Beats what exists [17] s9 | 6 of 27 apps state goals; June takes your goal [13] s1 |
| B2 two progress lines | Lifts attainment | d = 0.40 from mostly health-goal trials; this display untested [6] s7 |
| Hidden fundamentals ("not told it is a course") | Help, not homework | Untested; the "trick" doubt stays open [17] s12 |
| C1 miss-3 trigger | The right moment to hand off | Unvalidated threshold; may delay help or invite deliberate failure [15] s4 |
| D2 offline on a cheap phone | Accessibility USP | Stage is a laptop with MIDI; no device test yet [RESUME] |
| D1 no instrument | Equity edge | 15 of 27 apps work without an instrument [13] |
| C1 via Webex | Hand-off channel | Webex Guest Issuer apps disabled 21 Jan 2026 [RESUME] |

## 4. Ideas that answer the four adviser objections

| Objection [15] | Ideas that answer it | One-line use |
|---|---|---|
| 1 "Why not other AI models?" | A11, A12, B5, D2 | Measures each note, works offline, goals bounded to measurable phrases; publish the head-to-head |
| 2 "Free programs exist; why not go there?" | C10, C5, D5, D8 | We go there: home practice between sessions, phrase set by the program teacher |
| 3 "Hand over to the mentor sooner" | C2, C4, C3 | Ask any time; the card makes mentor minutes count; the pool supplies mentors |
| 4 "School-age users, university stakeholders" | C9, C3, F4, G3 re-aimed | Learner Year 5 to 10, payer outreach, mentor a pre-service teacher; record and cohort patterns as outreach evidence |

## 5. Three experiments before Wednesday

- Target: the most valuable uncertain idea is A3 (one explained fix beats a plain score on the retake), since parts 4 and 5 need partners, not tests.

| # | Experiment | Set-up | Measure | Pass line (proposed) | When, who |
|---|---|---|---|---|---|
| 1 | Score vs fix | 6 to 9 adults, one phrase with a planted habit; half see green/red notes only, half see cause plus one fix | Retake change on the target fundamental; "which helped?" | Fix arm improves more on the target and is preferred by most | Saturday, research and UX lead; adults-only usability check (ethics row 33) |
| 2 | Head-to-head with a free assistant | 10 recorded phrases with planted errors (assistant-benchmark-protocol.md) | Hand-marked: right cause named, one actionable fix | Our rules name the cause more often; misses reported | Saturday to Monday, model and web lead |
| 3 | Hand-off card value | Show 3 cards (clip plus fix list) and 3 bare clips to 1 to 2 music-literate people | Seconds to a useful reply; reply quality | Card replies faster and more specific | Sunday or Monday, Carlos via Frank's UC music contact (question 26) |

## Method
- Read COMMON-RULES, session-rules, state of play, RESUME (night summary), functional requirements; then each named source by headings and sections.
- Transcripts 01 to 09: a keyword window script (scratch only) pulled idea moments; quotes 20 words max with position in percent.
- Web: 8 searches or fetches (jam matching, BandMix level, SmartMusic, Noteflight SoundCheck); 2 pages 404 or emptied; nothing invented.
- Codex: one call, gpt-6-sol high (23:30, before the 00:40 reset), sections 1 and 2 with names replaced by roles.
  o Kept after check: SoundCheck-type overlap on A3 and C1 (verified by search, [28]); wedge C10 + C5 + A3 + C1 + C3; rows A17 and C12; verdicts C3, C9, B3, D8 changed.
  o Not folded (Codex memory, unverified): ROLI coach naming strengths and weaknesses, Melodics error tracking, Modacity goals, Duolingo Music; listed in Open questions.
  o Rejected: none outright; F1 already park.
- CHECKPOINT 23:40: sections 1 to 5 drafted; remaining = Codex critique fold, final checks.

## Open questions
- Will one university confirm pre-service teachers can review clips under supervision (C3)? Without it, part 4 is a proposal.
- Typed goal or bounded catalogue (A21)? The catalogue strengthens objection 1 and privacy.
- Twinkle bars 3-4 (visible easiest-start moment, A10) or Ode bars 1-2?
- Does any app already show cause plus one fix plus retake proof? Saturday hands-on test of June and Yousician [13] s6.
- Is the recorder a viable mic instrument on a cheap phone (D8)?
- Codex leads to open before Wednesday, unverified (Codex knowledge): ROLI Learn AI coach (strengths and weaknesses wording), Melodics (errors across attempts), Modacity (goals and recordings), Duolingo Music.
- Who is the named review owner and what reply time can a partner promise (C12)?

## Sources
1. ideas-board-v2.md, Tables A to C (folder file).
2. solution-directions.md, Directions 1 to 3.
3. student-compass-concept.md, five parts and principles.
4. gamified-journey-concept.md, revisions 5 and 6 Nov, guardrails.
5. research-synthesis.md, s4 to s9.
6. small-goals-engine-spec-v1.md, s1, s2, s5 to s10.
7. handoff-design-v1.md, s1, s2, s5.
8. pitch-v2.md, s1 rows 2:00 and 2:18, s2 slides 6 and 8.
9. trend-check-music-learning.md, s2 (open angles), s3, s4, s8, s9.
10. trend-check-teachable-agents.md, s3, s4.
11. gamification-research.md, s1.2, s1.3, s2, s7.
12. procrastination-small-goals-evidence.md, s3, s4, s6, s8.
13. competitor-feedback-mechanics-v1.md, s1, s4 gap table (27 products), s5.
14. competitor-gap-analysis.md (campus era, Compass).
15. objections-and-research-gaps.md, s1 to s5.
16. sunday-decisions-sheet.md, rows A18 to A24.
17. state-of-play-2026-11-06.md, s2 to s6, s12.
18. functional-requirements-v0.md, loop and R1 to R17.
19. notes-2026-11-06-hub-day-3.md, lines about 35, 67 to 68, 104, 131 to 132, 196.
20. recordings/transcripts/05 (5 Nov evening): positions 14%, 39%, 66%, 75%.
21. recordings/transcripts/07 (6 Nov meeting 1): positions 12%, 14%, 30%, 37%, 45%, 57%, 58%, 72%, 73%, 88%.
22. recordings/transcripts/08 (6 Nov meeting 2): positions 18%, 19%, 31%, 65%, 71%, 73%, 74%.
23. recordings/transcripts/09 (6 Nov 6 pm): positions 15%, 16%, 22%, 35%, 69%, 76%, 80%, 83%, 86%.
24. recordings/transcripts/04 (5 Nov advisers): position 13%.
25. BandMix blog, "BandMix 101: experience level", https://blog.bandmix.com/bandmix-101-experience-level/ , accessed 2026-11-06, opened (self-rated, five levels per instrument).
26. Web search summary on skill-matched jam apps (JamFan https://peerlist.io/podkopovp/project/jamfan ; Jam Nation https://apps.apple.com/mx/app/jam-nation/id6677019054 ), accessed 2026-11-06, snippet.
27. SmartMusic features via search summary (MakeMusic educator brochure https://www.makemusic.com/wp-content/uploads/2013/01/SM_13043_Educator.pdf ; district article https://www.rcschools.net/apps/news/article/1481236 ), accessed 2026-11-06, snippet; makemusic.com/assessment returned 404; Common Sense review page opened but reviews removed.
28. Noteflight SoundCheck via search summary (support overview https://support.noteflight.com/hc/en-us/articles/360045725372-SoundCheck-in-Noteflight-Learn-Assessment-Overview ; product page https://www.noteflight.com/soundcheck ), accessed 2026-11-06, snippet.
- RESUME = RESUME.md night summary, 7 Nov (folder file).
