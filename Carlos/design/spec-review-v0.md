# Spec review v0: the teammate's Music App Requirements Specification against the overnight plan

- Date: Sun 8 Nov 2026 12:50 (AEDT), from Carlos's request at 12:35 over Remote Control; spec file `Music-App-Requirements-Specification/index.md` (38 KB, dated 7 Nov) opened 2026-11-08.
- Question: is the specification sound, and where does it collide with the files built on 6 and 7 Nov?
- Scope: the whole spec (sections 2 to 6); compared with morning-notes-2026-11-07, feature-feasibility-menu-v1, privacy-design-v1, nearest-competitors-v1, idea-bank-v1, pitch-v2, cisco-fit-note-v1.
- Status: review for the team; proposes only. Every team decision below is marked as one. No names beyond session-rules.md.

## 0. Verdict (conclusion first)

- The spec is the best-structured document in the folder: IDs, MoSCoW plus a Demo column, testable acceptance criteria, NFRs with a test each, risks, data flow, traceability to the whiteboard problems. Keep it as the master.
- It describes a different product from the overnight files: on-screen instruments plus theory lessons for Years 3 to 8 classrooms, not a practice coach for a real instrument at home.
- Three collisions need a team call before building (section 2): the demo input (touch versus MIDI), counts on screen versus one fix and no score, and the buyer (generalist classroom teacher versus the ACT Instrumental Music Program).
- The prototype list is 77 P rows; the realistic capacity measured on 6 Nov is 34.5 hours for the whole team, which fits about 15 to 20 rows. Section 3 proposes the cut.
- Four things the overnight files carry that the spec lacks (section 4): the stop rule and human hand-off, the copyright line, the Webex and sponsor story, and the plain-words validator.
- Alignment is strong on the parts that matter most to judges: no AI music (FR-AIC-13), de-identified packets only (FR-AIC-11), offline fallback (FR-AIC-07), no streaks or leaderboards (FR-GAM-03, FR-TCH-05), labelled AI (FR-AIC-08).

## 1. What the spec gets right

| Area | Spec | Why it helps |
|---|---|---|
| Structure | 15 modules, 9 NFR groups, Demo column P / M / F | The "strike everything not P" step (6.5 item 1) is exactly the Saturday freeze the plan needed |
| AI stance | Ask before tell (FR-AIC-01), evidence in every message (02), praise only on success (03), no generation (13) | Answers the whiteboard problem 1 directly; same spirit as the one-fix rule |
| Privacy | Device-only attempts (FR-ASM-07), no raw audio or video (FR-PRV-04), age band not birth date (FR-ONB-04), most protective defaults (NFR-PRI-02) | Matches privacy-design-v1 almost line for line |
| Honesty | Pre-written responses in the demo, no key in the front end (constraint 4, NFR-SEC-02) | Same as model-slot-options-v0: one saved, labelled call |
| Risks | Phone sound delay, iOS vibration, autoplay block, chatbot perception | The team already sees the four traps the overnight files flagged |
| Frameworks | Personas, stories, flow, data flow, traceability, stakeholder map (section 6) | The stakeholder row is where cisco-landscape-v0 and morning-notes s10 plug in |

## 2. Three collisions with the overnight plan (team decisions)

| # | Spec says | Overnight files say | Why it matters | Proposed call |
|---|---|---|---|---|
| 1 | Touch instruments on a 360 px phone; MIDI keyboard is C and out of scope (FR-PLY-13, section 5) | Stage demo = laptop plus USB MIDI keyboard (pitch-v2, stack-review-v1); Web MIDI already in the skeleton | Rhythm judged on a glass screen with 50 to 200 ms audio delay looks unfair on stage; the spec's own risk table says so | Touch is the P path for phones; MIDI stays the stage input as a bonus row (a few lines of code). Decide Sunday night |
| 2 | Results as counts: notes correct out of total, beats early, on time, late (FR-PRG-01) | Stand-out idea 1: one fix per take, never a score (morning-notes s3; nearest-competitors s0) | Counts out of total are a score in disguise; every app in the 27-product table shows one | Show the evidence (which beats, which notes) and the one fix; no totals, no percentage. Keep the counts in the stored attempt for the teacher view |
| 3 | Student = Years 3 to 8 classroom learner; buyer = generalist teacher with no music training (FR-TCH-03, persona 2) | Buyer = a sponsor outreach team; framing = home-practice companion inside the ACT Instrumental Music Program (morning-notes s2, s10) | The whole team wrote the spec; the classroom-generalist problem is real and sourced (Alberts 2020, teacher shortage) | Adopt the spec's framing as the vision; keep the ACT program as the named pilot channel and Outreach Funding as the money (business-case-v0). One story, not two |

- A fourth, smaller one: the coach as a message thread with typed answers (FR-AIC-04) is the chatbot look the spec itself lists as a risk.
  o Put the coach question on the fix card with two or three tap answers (morning-notes s7); typed text stays as the fallback.

## 3. Scope: 77 P rows against 34.5 hours

- Capacity on 6 Nov: 12.75 h (rig), 12.4 h (model and web), 9.4 h (research and UX), realistic rates; MUST was already 1 h over (feature-feasibility-menu-v1 capacity table).
- The spec's P list is 77 rows plus three mock screens; at the menu's rates that is roughly three to five times the capacity.
- Proposed stage set, about 18 rows, enough for the 60 s demo and the desk demo:

| Keep as P (stage) | Rows | Why |
|---|---|---|
| Keyboard plays, two octaves, note names toggle, computer keys, tap-to-start | PLY-01, 02, 07, 08, 11, 12 | The one instrument the story needs |
| Metronome and one rhythm lesson | PLY-09, LSN-01, 02, 07 | The take the coach judges |
| Checking and the attempt record | ASM-01, 02, 04, 05, 07 | The evidence every coach line quotes |
| Coach loop | AIC-01, 02, 03, 07, 08, 09, 11, 13 | The differentiator; offline fallback is the stage mode |
| Hint ladder level 1 and 2 | HNT-01, 02 | Cheap, shows the ask-before-tell idea |
| Age band and under-age defaults | ONB-01, 03, 04, 05 | Privacy story in one screen |
| Free play | CMP-01 | Zero extra cost once the keyboard exists |

| Move to M (mock) or drop for the hackathon | Rows | Saving |
|---|---|---|
| Guitar strum, chords, six strings | PLY-04, 05, 06 | The costliest and least convincing instrument on a screen; show the tile |
| Drums | PLY-03 | Second cheapest instrument; keep only if the team wants the drums persona live (US-01) |
| Drag-and-drop pads, vibration, size presets persisting | ACC-03, PLY-10, ACC-08 | Settings work the demo never shows |
| Recording, My Music, delete | CMP-02, 03, 04 | Nice, not core; a mock screen tells the story |
| Gamification (off by default) | GAM-01, 02, 03, 05 | A feature that is off cannot be demoed; one toggle on a mock Settings screen |
| Offline install, unit download, indicator | OFF-02, 03, 04 | OFF-01 (works with the network off) is the one that matters; say it, show it |
| Stave rendering with highlight and played-note display | LSN-03, 04, 05, 06 | Two days of rendering work; keep only if the note-reading lesson is the demo (then drop the rhythm lesson instead) |
| Progress history, unit counts | PRG-02, 03, 04 | Mock screen |

- Rule for the cut: every kept row must appear in the 60 s demo or answer a desk question in qa-stale-answers-v0. The rest is a slide.
- NFRs to label "designed to meet", not "tested": WCAG 2.2 AA (NFR-ACC-01), four browsers (NFR-PLT-01), the 4-of-5 child tests (NFR-USE-01, 02), 50 ms tap-to-sound (NFR-PER-01). No children and no test lab exist before Wednesday.

## 4. What the overnight files add that the spec lacks

| Gap | Where it lives | Proposed row |
|---|---|---|
| The coach knows when to stop: third miss on one cause hands the learner to a person; pain or tiredness routes to a person at once | morning-notes s3 rank 3, s8 | FR-AIC-14: after three attempts with the same cause, the coach stops coaching and suggests the teacher; M, P |
| Copyright line: no song content, no notes or tabs of a protected tune, public-domain or team-written phrases only | morning-notes s4 | Constraint 6: lesson melodies and "3 songs" (FR-GAM-04) are public domain or written by the team |
| The teacher hand-off and the Webex mock; the Cisco story | cisco-fit-note-v1 s5, cisco-landscape-v0 s3 | The TCH mock screen shows the hand-off card; one desk line on Webex Music mode for the mentor call |
| Sponsor value: Outreach Funding per university, pre-service teachers as mentors, La Trobe as IP holder | morning-notes s10, business-case-v0 | Fills the stakeholder map row the spec lists as Should |
| Plain-words validator on every coach line (length, Year 5 words, no notes, no technique) | morning-notes s5, s8 | NFR-AIS-04 covers length only; add the vocabulary check |
| Evidence the loop works and how often the cue fires | prototype-review-v1 D1, qa-stale-answers-v0 s2 | A desk card, not a requirement |

## 5. Smaller corrections

| Item | Spec | Suggested |
|---|---|---|
| Age bands | Under 13, 13 to 17, 18 and over (FR-ONB-04) | Under 15, 15 to 17, 18 and over: the Privacy Act guidance presumes capacity at 15 and the draft Children's Code uses 15 (privacy-design-v1 rows 3, C18, s104 to 105); 13 is the US line |
| Section 1 | Missing from the export; numbering starts at 2 | Add the problem statement and the three whiteboard problems as section 1 so the traceability matrix has a home |
| Table export | Every cell on its own line | Re-export from the source document before sharing outside the team |
| Whiteboard problem 1 | "AI reliance is leading to cognitive decline" stated as fact | Say "concern"; the usual citation is a 2025 MIT Media Lab preprint with 54 participants (from memory, unverified; verify or drop before the pitch). Never cite the retracted 2002 self-control paper named in session-rules.md |
| On-screen instruments | Not positioned against existing free tools | Free browser instrument toys exist (Chrome Music Lab is one, from memory, unverified); the differentiator is the coach loop, say so on slide 2 |
| Prototype device | Not named | Name the stage laptop and one phone as the two reference devices on Sunday night; test tap-to-sound on both on Monday |
| Sample licences | "licence allows this use" (constraint 2) | Tone.js synthesis needs no samples; if samples are used, record the licence in decisions-log |

## 6. Suggested order for Sunday night and Monday

- Sunday night: the three calls in section 2; strike every row not in the section 3 stage set; name the two reference devices.
- Monday morning (success criteria released 8 am): re-check the stage set against the criteria; move rows only if a criterion demands it.
- Monday: keyboard, metronome, take record, checking, offline coach loop in that order; the stave only if the note-reading lesson wins.
- Tuesday: fix card, hint ladder, age band screen, mock screens (teacher dashboard with the hand-off card, community, wind tile); first full run of the 60 s demo.
- Wednesday: polish, two spoken lines if recorded (voice-output-decision-v0), rehearsals.

## Method

- The spec was read in full (2,004 lines as exported); row counts by pattern match on the Demo column (77 P, 21 F).
- Compared against the named project files, opened 2026-11-08; no Codex call, no local model, no web search.
- Two items are from memory and marked unverified in section 5; nothing else is new fact.

## Open questions

- Which teammate owns the spec, and is the Demo column already agreed or a proposal?
- Touch or MIDI on stage, and which phone is the reference device?
- Does the team accept evidence without totals on the results screen?
- Is the note-reading lesson or the rhythm lesson the one in the 60 s demo?
- Who writes section 1 and the stakeholder map, and by when?

## Sources

- Music-App-Requirements-Specification/index.md (team spec, 7 Nov), opened 2026-11-08.
- feature-feasibility-menu-v1.md capacity table (34.5 h realistic; 12.75, 12.4, 9.4 by role), opened 2026-11-08.
- privacy-design-v1.md rows 3, C18 and lines 104 to 108 (15 as the presumption; draft Code s13), opened 2026-11-08.
- morning-notes-2026-11-07.md s2 to s5, s7, s8, s10 and idea-bank-v1.md D1 (on-screen keys as the access idea), opened 2026-11-08.
- nearest-competitors-v1.md s0 (27 products, all show a score), as cited in morning-notes s3, 2026-11-08.
- pitch-v2.md, stack-review-v1.md, cisco-fit-note-v1.md s5, cisco-landscape-v0.md s3, business-case-v0.md s0, opened 2026-11-07 and 08.
