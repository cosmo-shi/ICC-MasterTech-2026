# Q and A prep - twenty likely judge questions

- Date: Fri 6 Nov 2026, overnight draft; companion to pitch-v0.md.
- Purpose: short answers for the judges (Cisco plus UC, Flinders, La Trobe) after the three-minute pitch on Wed 11 Nov.
- Rule: answer in one sentence, then one number with its source, then stop; hand over with a bridge line (section 6) when it is a teammate's area.
- Status: overnight draft for the team; verify before the pitch. Every number cites a source file and row; no new web research.

## 1. Customer value
### Q1. Who exactly is the learner, and is this really "students learning and succeeding"?
- A young person without access: regional, rural, remote or low income; adult beginners welcome (state-of-play s2).
- Age group not yet fixed; Sunday decision, beginner onwards (state-of-play s7).
- Students in two senses: school students reached by university outreach, and first-year university students on pathway programmes.
- Late starters are real: 40% of continuous adult players did not play in high school (research-bank music table, Romeiser row).
- Whether a hobby learner fits the challenge is open with Jeff (questions-for-sponsor 21).

### Q2. Why would a university pay for this?
- Outreach already exists and reaches the right kids: UC's Possible Future Passport (K to 6, small rural schools within 3 hours of Bruce) and UC 4 Yourself (Year 9 regional) (verification s3).
- We found no music in that outreach (verification s3, "Creative or music activity in schools: none confirmed").
- Universities train the teachers who lack music: about 8 hours in a primary degree, 72% of surveyed universities offer no primary music specialisation (research-bank music table, "Pre-service hours" and "Claim 2" rows).
- Fading Notes itself asks for free learning students can do during their degree (universities-brief s6, p.40).
- Buyer is provisional (state-of-play s6); the learner never pays for the first step.

### Q3. Why now?
- Students already ask AI for feedback: 49.7% of 6,960 surveyed students (research-bank music table, Henderson row).
- Music training in teaching degrees fell from 17 hours (2009) to about 8 (research-bank, "Pre-service hours" row).
- Every sponsor already runs an approved AI platform: UC Copilot, La Trobe ChatGPT Edu, Flinders Gemini Enterprise (universities-brief summary).
- Flinders' only music degree is in teach-out from 2026 (research-bank sponsor table, BCIM note).

### Q4. Why not just YouTube, or Yousician?
- Videos cannot hear you; nobody tells you the bad habit in week one (state-of-play s2, the hook; talking-script Picture B).
- AI music apps exist (Yousician, Simply, flowkey, Skoove, ROLI); we do not claim to be the only one (state-of-play s5).
- Our combination: one fix with proof on the retake; works without an instrument; hides fundamentals inside your own goal; hands you to a human (state-of-play s9).
- Reached through free university outreach, so cost is not the barrier (verification s3).
- Honest gap: we have not run a feature-by-feature test against each app this week.

## 2. Evidence
### Q5. What have you actually tested?
- Carlos's own practice record: two bursts (26 Aug and 4 Sep 2026), reconstructed from logs; the original chats are lost (research-bank first-hand evidence intro).
- Measured: one cue changed the next take; pitch wobbles 33 to 13 and 24 to 7, high notes about 5 dB lighter (first-hand evidence table, row 2).
- The concept was tested on advisors over three hub days, not on learners (state-of-play s4).
- Not yet tested: a prototype with any learner; the nine-student plan runs if time allows (state-of-play s10).

### Q6. Isn't one user just an anecdote?
- Yes, and we say n = 1 every time; it is a design source, not proof (research-bank first-hand evidence table).
- It turned into hypotheses we can test: listen live, one fix with proof, range first, hand-off (functional-requirements R1 to R17).
- We show the rows that cut against us: eleven mixes never chosen (row 3), no teacher referral (row 4), he wanted a result, not lessons (row 5).
- What would convince a judge: a learner test plus a qualified teacher validating the method (advisor steer, questions-for-sponsor 7).

### Q7. Students trust teachers more than AI. Isn't that fatal?
- It is our design brief: 84% of users found AI feedback helpful (82% for teachers), but 60% trusted it against 90% for teachers (research-bank music table, "Claim 3" Henderson row).
- About half already ask: 49.7% of 6,960 students sought GenAI feedback (same row).
- So the app gives one small fix with proof on the retake, and hands to a human at the ceiling.
- Caveat: volunteer sample, 10,132 of about 192,000 invited, four universities, perceptions only (same row).
- Never quote 89%; it is not in the paper (research-bank "Where 89% might come from" row).

### Q8. How solid is the "eight hours" figure?
- Primary source: Fading Notes 2023, average 7.98 compulsory hours, range 1 to 19, down from 17 in 2009 (research-bank "Pre-service hours" row).
- 36 of 49 invited institutions replied; hours are respondent estimates; universities are de-identified (universities-brief summary; research-bank "Claim 2" row).
- ACT average 6.5 hours (universities-brief s6, Table 5); 58% say students never see a music lesson on practicum (state-of-play s5).
- Repeated by Music Australia's May 2026 report (research-bank "Pre-service hours" row); strength rated strong.

## 3. Feasibility
### Q9. Can pitch tracking run offline on a phone, and is it accurate enough?
- Not proven yet; it is our top technical risk (state-of-play s12); we prove the loop on one phrase first.
- Design: the listen-fix-retake loop on the device; cloud only for the hand-off and sync (state-of-play s7, requirement R12).
- Offline web apps are a documented pattern, but service workers are unavailable on first load, so install needs a connection once (verification s5, MDN and web.dev).
- Tracker choice and accuracy target are open (state-of-play s8); on-screen keys in the demo need no pitch tracking.

### Q10. What does the AI cost per learner?
- Not costed yet; we will not quote a number on stage.
- Design keeps the expensive part small: listening runs on the device; the language model only words one fix.
- Sponsors already license AI platforms (UC Copilot; La Trobe ChatGPT Edu, 40,000 licences by FY27; Flinders Gemini Enterprise, about 30,000 students), so a pilot could sit on an approved one (universities-brief summary and s1).
- Costing is a pilot deliverable (Open questions).

### Q11. You would record minors. What about privacy?
- Audio stays on the device by default; sharing is opt-in, for the hand-off only (requirement R11; state-of-play s7).
- OAIC: do not put personal information into publicly available generative AI tools (research-bank AI table, OAIC row).
- Privacy law differs by sponsor: ACT, Victorian, NSW and Commonwealth regimes (universities-brief s4, snippets).
- La Trobe requires an AI adoption risk assessment, and a privacy impact assessment if needed (universities-brief s4, opened).
- We would ask each university's privacy officer what a pilot needs (questions-for-sponsor 5 and 13).

### Q12. What if there is no internet, or no instrument?
- Very remote users report connection problems "always or often" at 30.5%, against 15.9% nationally; access gap to very remote is 21 points (verification s5, ADII 2025).
- The practice loop is designed to run offline (not yet validated); the hand-off and sync wait for a connection (requirement R12).
- Day one needs no instrument: voice, or on-screen keys (pitch-v0 demo variant A).
- Some NSW and Qld libraries lend instruments free; no ACT lender found; rental from about $12 to $24 a month on 6 to 36 month contracts (verification s4, monthly figures are arithmetic).
- Say "users", never "households" (pitch-v0 say box).

## 4. What it takes to proceed
### Q13. What would a pilot cost, and who funds it?
- Not costed; no public price range for unit-level ed-tech pilots was found (universities-brief s4).
- UC rule of thumb: under $5,000 needs no quote; $5,000 to $50,000 needs one written quote (universities-brief s4, UC Procurement cl.43, opened).
- Outreach money exists: a 2014 government list shows $628,416 for the Aspire UC outreach project; current HEPPP funding is not confirmed on UC pages (verification s3, snippet).
- Do not promise a price; offer to cost it with the partner.

### Q14. Who signs, and how long do approvals take?
- Path: unit convenor, course lead, LMS team, central IT, AI risk and privacy, procurement, ethics (universities-brief s4 table).
- UC: all corporate software goes through central IT regardless of cost (universities-brief s4, cl.33-34, opened).
- Ethics if pilot data become research: UC low risk about 2 weeks; Flinders submit 2 months ahead; La Trobe 8 weeks (universities-brief s4; La Trobe snippet).
- Studying one's own students adds consent safeguards (universities-brief s4, unverified per university).

### Q15. Who are the teachers at the hand-off in a regional town?
- Honest answer: not decided; options are music students, community musicians, university staff (state-of-play s7).
- None of the sponsors has a music school, so performance teachers come from outside (universities-brief summary; research-bank sponsor table note, to confirm).
- The hand-off can be remote: the learner sends the recording and fix list (requirement R10).
- Open with Frank's UC music contact (questions-for-sponsor 26).

## 5. The hard ones
### Q16. Aren't you just another tutor app? What about prior art?
- AI music coaches exist; Yousician, Simply, flowkey, Skoove and ROLI are named in our research (state-of-play s5).
- Our claim is the combination, never "first" (state-of-play s12): one fix with proof, goal-led, works without an instrument, human hand-off, reached through outreach.
- Beginner-to-peer music buddy apps: none found, but that is inference, not a sourced fact (verification s6).
- We coach with feedback; we never generate music (state-of-play s2).

### Q17. Won't AI replace music teachers?
- No: the ceiling hands the learner to a human with the recording and fix list (requirement R10).
- AI goes where it is cheap: feedback between lessons (advisor point, state-of-play s4).
- Students trust teachers more (90% vs 60%), so the human stays at the centre (research-bank Henderson row).
- The app sends people to teachers they would never have reached.

### Q18. Isn't hiding the fundamentals inside the learner's goal a trick?
- Honest doubt, from our own record: the user wanted a good result, not lessons (research-bank first-hand evidence table, row 5, weak).
- Nothing is hidden from the learner: two visible lines, "your goal" and "your skill" (state-of-play s2).
- The one cue that improved the cover also improved the singing (research-bank first-hand evidence table, row 2).
- Evidence leans our way: autonomy g .64; progress monitoring d .40; badges plus leaderboards can harm, so no streaks (state-of-play s5).
- Only a learner test settles it.

### Q19. Why universities and not schools?
- Schools are where the learner is; universities are how we reach them: UC outreach already runs into small rural primary schools, free (verification s3).
- A school with one generalist teacher has no music lead to buy it: about 8 hours of music in a primary degree (research-bank "Pre-service hours" row).
- Universities train those teachers, so the same tool can serve pre-service teachers as a pilot option (state-of-play s3).
- Schools stay the setting; the buyer question is still open (questions-for-sponsor 23 and 31).

### Q20. What does Cisco have to do with it? And who owns the IP?
- Cisco: we make no product claim on stage; the fit is to be confirmed with the Cisco representative (problem-framing design principles; assumption A9).
- Plausible fit to test, unverified: the connectivity and sync layer for regional learners, and the remote hand-off lesson.
- IP: ownership terms are not in our sources; check the programme terms with Jeff before answering.
- Any material from a teammate's previous employer is checked before it enters the build (state-of-play s10).

## 5b. Three more, from the judge-panel simulation
### Extra A. Which parts of that demo were actually live? (from the judge-panel simulation)
- Say exactly which input ran: on-screen keys (variant A) or the microphone (variant B) (pitch-v0 section 4).
- If the fallback recording ran, say so in the first sentence; it shows the same flow, recorded the day before.
- No accuracy figure exists yet; tracker choice is open (state-of-play s8).
- The hand-off card is a proposed flow until a teacher partner exists (Q15).

### Extra B. After one term, what result would make you continue or stop? (from the simulation)
- Proposed measures, to agree with the partner, not data: the retake improves on the phrase; learners come back weekly by choice; a qualified teacher validates the fixes; hand-offs actually happen.
- The weekly-use and one-term shape mirrors the team's earlier pilot template (problem-framing "What success looks like in 12 months", marked "goal to agree with a sponsor, not data").
- No success threshold or stop rule is set yet; we would set it with the partner before the term starts.

### Extra C. Who may receive a child's recording, and who authorises it? (from the simulation)
- Default: audio never leaves the device; sharing is opt-in, per recording, for the hand-off only (requirement R11).
- Guardian consent, teacher vetting and school approval are not yet designed; they come from the partner's rules (questions-for-sponsor 5 and 13).
- La Trobe already requires an AI adoption risk assessment, and a privacy impact assessment if needed (universities-brief s4, opened).
- Honest line: "Until a partner's child-safety and privacy rules are in place, nothing is shared."

## 6. Bridge lines
| Topic | Owner (role) | Bridge line |
|---|---|---|
| Problem, statistics, research | Simone (problem, research, UX) | "Simone checked those numbers; Simone?" |
| Privacy, minors, integrity | Simone (privacy and integrity story) | "Privacy was Simone's design brief; she can take that." |
| How the app works, accuracy, offline | Justin (demo, model pipeline, front end) | "Justin built that loop; Justin, how does it hear the note?" |
| Instruments and the demo | Justin | "Justin plays; he can tell you what the phone sees." |
| Cost, hosting, Cisco, pilot | Carlos (what next, infrastructure, Cisco integration) | "That is the what-next question; Carlos?" |
| The n = 1 evidence | Carlos (his own record) | "It is my record, so I will answer that one." |
| Buyer, universities | Carlos, with Simone on the research | "Carlos has the pilot path; Simone has the numbers behind it." |

- Rule (plan rehearsal checklist): each person owns one hard question: privacy (Simone), feasibility (Justin), cost (Carlos).
- One answer, one speaker; no pile-ons; if unsure, say "we do not know yet, and here is how we will find out".

## 7. Five questions we cannot yet answer
| # | Question | Where it is tracked |
|---|---|---|
| 1 | Who are the hand-off teachers in a regional town? | questions-for-sponsor 26 |
| 2 | Who pays: the university or the learner? | questions-for-sponsor 23 and 31 |
| 3 | What would make a sponsor pilot this, and who decides it proceeds? | questions-for-sponsor 17 and 9 |
| 4 | What privacy and regulatory limits apply to minors' audio? | questions-for-sponsor 5 and 13 |
| 5 | Does a hobby-instrument learner count as "students learn and succeed"? | questions-for-sponsor 21 |

- Holding line for all five: "We do not know yet; it is on our list for the sponsors, and here is our current lean."

## Method
- Sources: research-bank.md, universities-brief.md, verification-2026-11-06-afternoon.md, problem-framing.md, state-of-play-2026-11-06.md s5; design references from state-of-play s2 to s12 and functional-requirements-v0.md (R numbers).
- No new web research. URLs copied from source files, not re-opened tonight.
- Codex call 1 (gpt-6-sol, high): judge-panel simulation (five judges by role), pitch and Q and A pasted with person names replaced by roles.
  o Kept: its three unprepared questions became section 5b (live vs recorded demo; continue or stop after one term; who may receive a child's recording).
  o Kept: Q12 now says the offline loop is designed, not validated; Q2 says "we found no music" rather than "none of it has music".
  o Rejected: none of its Q and A points; its suggested answers were thinner than the sourced ones already here, so only the questions were used.
- Codex call 2 (gpt-6-sol, medium, resume): re-check of the pitch script only (see pitch-v0.md Method).
- Quota: both calls completed; no rate-limit error.

## Open questions
- Pilot cost and per-learner AI cost: team must cost both before Wednesday or keep saying "not costed".
- Cisco fit: needs a named product confirmed by the Cisco representative (problem-framing assumption A9).
- IP ownership of hackathon work: check the info pack terms with Jeff.

## Sources
1. research-bank.md, music-education table: rows "Claim 1", "Claim 2", "Pre-service hours", "Claim 3" (Henderson), "Where 89% might come from", Romeiser row.
2. research-bank.md, AI table: Henderson row (6,960 students), OAIC row.
3. research-bank.md, sponsor table (Flinders BCIM teach-out note); meeting-2 table (UC outreach, instruments, connectivity rows); first-hand evidence table rows 1 to 5.
4. universities-brief.md: summary; s1 table; s4 buying path, privacy, ethics, cost; s6 pitch lines.
5. verification-2026-11-06-afternoon.md: verdicts; s3 (UC programmes, HEPPP); s4 (instruments); s5 (ADII, PWA); s6 (comparators).
6. state-of-play-2026-11-06.md: s2, s3, s4, s5, s7, s8, s10, s12.
7. Underlying URLs (opened per source files on 6 Nov 2026): Henderson open copy https://opus.lib.uts.edu.au/handle/10453/196513 ; Fading Notes https://www.alberts.co/wp-content/uploads/2023/06/Music-Education-ITE-Report_A4_130623.pdf ; ADII 2025 https://digitalinclusionindex.org.au/wp-content/uploads/2025/10/ADII-Report-2025_V6-Remediated.pdf ; Aspire UC https://www.canberra.edu.au/future-students/careers-advisers-and-agents/aspire-uc-schools ; MDN offline PWAs https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Offline_and_background_operation ; UC procurement https://policies.canberra.edu.au/document/view-current.php?id=126 .
