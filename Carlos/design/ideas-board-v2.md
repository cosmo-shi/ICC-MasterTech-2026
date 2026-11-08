# Ideas board v2 (5 Nov 2026)

- 5 Nov 2026: teammates rejected the tutor; mentors said "why not just Claude?" and "too basic".
- This board lists 20 non-chatbot ideas, scored, so the team can pick and combine on Friday.

## Ground rules used
- No chat tutor and no chatbot persona; every idea names what a general chatbot structurally cannot do.
- The student is the hero in every row; staff benefits are by-products only.
- No access to students' phones, laptops, screens or keystrokes; campus sensing is aggregate or opt-in.
- "Who already does it" = found in this round's searches; "not checked" = no search this round.

## Table A: all 20 ideas (plus 21 added 5 Nov from Carlos's lead, see gamified-journey-concept.md)

| # | Name | One-line pitch | Student moment | Emerging tech used | Why not just Claude | Who already does it | Cisco fit |
|---|---|---|---|---|---|---|---|
| 1 | Outcome Map + Journey Record (Compass part) | Weekly two-minute checks light up which unit outcomes the student holds, privately | Week 5, unsure they really understand before marking week | Small local model on campus compute, AI-marked short answers | Claude never sees the unit outline, the rubric or weeks of the student's checks | Partly: Cognito AI-marks school syllabus quizzes; no product maps to unit outcomes | Plausible: Duo sign-in, local model on Cisco UCS |
| 2 | AI-Use Card (Compass part) | Each assignment opens with one screen: what AI use is allowed here | Assignment released, afraid of breaking an unwritten AI rule | LLM reads brief and rubric, coordinator approves | Claude has no authority; only the coordinator's approved card is the rule | Yes: Studiosity Validate and Turnitin Clarity set an AI level per assessment | Weak |
| 3 | Lost Moments | Tap "lost" in a lecture; tonight get a four-minute rewind of exactly those moments | Lecture 3, an international student loses the thread, too shy to ask | Live transcript, timestamp alignment, room-level aggregation | Claude was not in the room and cannot see 200 classmates tapping at once | Partly: Echo360 confusion flag counts per slide; no AI recap found | Strong: Slido (Cisco) taps plus Webex transcript |
| 4 | Study Squad Radar | See where classmates in your unit study right now and join an in-person pod | Week 3, a first-year eating lunch alone wants a study group | Wi-Fi occupancy analytics (aggregate counts), opt-in pins | Claude has no campus presence and cannot coordinate strangers in one building | Partly: Cisco Spaces occupancy (admin use); UBC occupancy app project 2018 to 2019 | Strong: Cisco Spaces and Meraki Wi-Fi occupancy |
| 5 | Live Sensory Map | Live noise, light and crowd levels show neurodivergent students where calm space is now | Autistic student overwhelmed between classes needs quiet in five minutes | IoT environmental sensors, campus digital twin | Claude cannot hear or measure a room; it has no live building data | Partly: NBCC sensor twin pilot (Canada); static maps at TCD, VU, NCI | Strong: Meraki MT sensors plus Cisco Spaces maps |
| 6 | Deadline Air Traffic Control | Forecasts each student's deadline storms six weeks ahead and replans across all units | Week 2, part-time worker with four assignments due in week 9 | Planning agent over LMS calendars, anonymous cohort collision signal | Claude cannot see every unit's due dates, nor 300 classmates sharing the pile-up | Partly: Greenwich Map My Assessment (static map); Adelaide clash tool is staff-only | Plausible: Webex nudges, Duo-gated LMS data |
| 7 | Sim Black Box | Aviation-style replay after a clinical or trades sim, each decision point on a timeline | Nursing student after a failed deteriorating-patient sim | Edge video and positioning analytics, multimodal timeline | Claude was not in the sim room and has no sensor or video feed | Yes: TeamVision (Monash, CHI 2025, 221 students); Laerdal SimCapture video debrief | Plausible: Meraki MV cameras with on-camera analytics |
| 8 | Bedside Skills Passport | Supervisor taps once to sign a competency; the student owns a verifiable skills wallet | Final placement week, three required skills still unsigned | Verifiable credentials, NFC or QR sign-off | Claude cannot vouch; it has no supervisor identity or institutional signature | Not checked this round; ePortfolio tools likely (unverified) | Plausible: Duo identity for supervisor sign-off |
| 9 | Ghost Cohort | Shows what last year's students did at this exact week, and what helped them pass | Week 4, a first-year behind and sure they are the only one | Anonymised longitudinal pathway mining, minimum group sizes | Claude has no memory of past cohorts in this unit | Not checked this round; staff-facing predictive analytics exist (unverified) | Weak |
| 10 | Feed-Forward Thread | Every marker comment becomes a habit card that follows the student into the next task | Starting assignment 2, feedback from another unit already forgotten | NLP over marker feedback, clustering across units | Claude never sees past marker feedback across units and semesters | Partly: OnTask (open source; USyd, UTS, UniSA) sends personalised feedback | Weak |
| 11 | Campus Network Twin Lab | ICT students fix replays of real, anonymised campus network incidents in a twin | Networking student who has only configured perfect textbook labs | Digital twin, network telemetry replay | Claude has no live telemetry and cannot host a running network | Not checked; Cisco Modeling Labs is the base tool (sponsor's own) | Strong: Cisco Modeling Labs, ThousandEyes, NetAcad |
| 12 | Admin Autopilot | An agent prepares dreaded forms (special consideration, enrolment change) for one-tap approval | Student in hospital misses a deadline and cannot face paperwork | Agents that act across student systems, audit log | Claude has no access to student systems and no delegated authority to submit | Partly: UNSW Copilot Studio agent, Melbourne Stop 1 (answer, not file); Lorikeet demo | Plausible: Duo step-up approval, Webex status messages |
| 13 | Lecture Lens | Live captions in the student's language plus a glossary built from this unit's lectures | International student meets "differential diagnosis" for the first time at speed | Real-time speech translation, term extraction | Claude is not in the room live and lacks the unit's lecture corpus | Not checked; live translation in meeting tools exists (unverified) | Strong: Webex real-time translation and captions |
| 14 | Placement Pre-Flight | A ten-minute VR walk of the actual ward or site before day one, with scenario injects | Night before first placement, anxious about an unknown hospital | 360 capture, VR, scenario simulation | Claude cannot place you inside the real host site | Not checked this round | Weak |
| 15 | Remote Bench | Online and regional students run real lab equipment from home in booked slots | Regional engineering student who cannot travel to campus labs weekly | Remote labs, robotics, live video | Claude cannot move a real instrument or return real measurements | Yes: LabsLand (incl. Monash Malaysia FPGA labs) | Plausible: secure access to lab gear, Webex video |
| 16 | Fair Team Telemetry | Group projects show contribution signals early, so students fix free-riding before grades suffer | Week 8, one teammate silent, student fears a shared bad mark | Event signals from the shared assignment space only, team analytics | Claude cannot see a team's shared workspace or coordinate four people | Not checked; peer-evaluation tools exist (unverified) | Weak |
| 17 | Campus Wayfinder | Indoor turn-by-turn and haptic cues guide blind and low-vision students to class | Blind student's room changes in week 6; orientation is not repeated | Indoor positioning, BLE beacons, haptic wearable | Claude cannot locate you indoors or sense the building | Yes: GoodMaps at Michigan State; NaviLens at SIUE | Strong: Cisco Spaces indoor location and BLE |
| 18 | Real Brief Exchange | Employers post short briefs mapped to unit outcomes; students earn verified industry evidence | Third-year with good grades and nothing to show an employer | Outcome-to-skill matching, verified records | Claude cannot connect you to a real employer or verify your work | Yes: Riipen (course-embedded industry projects) | Plausible: Cisco Networking Academy employer links |
| 19 | Misconception Outbreak Watch | Treats wrong ideas like an outbreak: spots spread in a cohort, sends each student a booster | Week 6, student holds the same wrong idea as 80 classmates unknowingly | Answer clustering, cohort epidemiology, small local model | Claude sees one student; it cannot see a misconception spreading across a cohort | None found as a product; research only (arXiv 2605.00294, AERA 2026) | Plausible: on-campus compute on Cisco UCS |
| 20 | Skills Gym | Instrumented tools and manikins count reps and coach technique like a sports lab | Apprentice welder or nursing student practising alone after hours | IoT sensors on tools, edge analytics | Claude cannot feel torque, pressure or angle on a real tool | Not checked; welding simulators exist (unverified) | Plausible: Meraki IoT gateway |
| 21 | Questline (gamified unit journey) | AI turns any unit outline into a map with regions, bosses and side quests; no content changes | Week 3, fogged region, one ten-minute side quest, a party of two | LLM world-builder, persistent cohort state, Webex parties | Claude cannot read the outline, hold 450 students' state or run a shared cohort world | boot.dev and Duolingo own their content, single discipline; none found wrapping existing units (not checked) | Webex parties and bot, Duo |

### Where each idea came from

| Method | Ideas |
|---|---|
| Reverse brainstorm ("how do we make students fail or drop out?") | 6 (stack deadlines), 9 (make them feel alone), 12 (bury them in forms), 16 (let one person carry the team) |
| Borrow from another field | 6 air traffic control; 7 aviation debrief; 19 public health; 20 sport coaching; 10 coaching feed-forward |
| Familiar thing, new place | 3 sports instant replay in lectures; 4 rideshare map for study groups; 5 weather radar for senses; 14 real-estate virtual tour for placements |
| Combine | 11 telemetry plus labs; 17 indoor location plus haptics; 18 outcome map plus employers |
| Compass non-tutor parts | 1 outcome map and journey record; 2 AI-use card |

## Table B: pros and cons

| # | Name | Three pros | Three cons | Demo by 10 Nov |
|---|---|---|---|---|
| 1 | Outcome Map + Journey Record | Fills a verified gap (no outcome mapping found); student owns the data; reuses Compass work | Needs clean outcomes from coordinators; weekly checks may feel like homework; AI marking accuracy unproven at university level | Yes |
| 2 | AI-Use Card | Fixes students' first fear; built in hours; fits Flinders AI scale | Studiosity Validate and Turnitin Clarity already do it; low uniqueness; staff approval slows release | Yes |
| 3 | Lost Moments | Slido and Webex fit naturally; anonymous, no device access; helps shy and EAL students | Needs lecture recording consent; Echo360 flag is precedent; small classes give noisy signal | Yes |
| 4 | Study Squad Radar | Tackles first-year isolation; strong Cisco Spaces fit; aggregate counts, no tracking | Wi-Fi accuracy about 9 m, floor level only; pins need critical mass; stranger-safety concerns | Partly |
| 5 | Live Sensory Map | No live sensor plus quiet-space map found anywhere; strong Meraki fit; no personal data at all | Sensors needed per room; smaller user group, harder business case; static maps may feel enough | Partly |
| 6 | Deadline Air Traffic Control | Every student feels pile-ups; data already in the LMS; cohort signal pushes staff to fix design | Needs calendars from every unit; static maps exist (Greenwich); replans fail if staff never move dates | Yes |
| 7 | Sim Black Box | Video debrief is a trusted method; Monash proves it works in Australia; serves health and trades | TeamVision already exists; cameras raise privacy flags; hardware heavy | No |
| 8 | Bedside Skills Passport | Real pain on nursing and VET placements; portable, student-owned credential; one-tap interaction | ePortfolio incumbents likely; supervisors resist new apps; accreditation and credential standards work | Partly |
| 9 | Ghost Cohort | Answers "am I the only one"; student-facing use of cohort history is rare; cheap with synthetic data | Needs years of history and ethics approval; re-identification risk in small units; past paths may not fit | Partly |
| 10 | Feed-Forward Thread | Reuses feedback already written; works across units; open-source OnTask could be the base | Marker comments vary in quality; needs cross-unit data access; could feel like nagging | Yes |
| 11 | Campus Network Twin Lab | Strongest Cisco fit; real incidents beat textbook labs; matches the team's exact skills | Serves ICT students only; anonymising incidents needs security review; may read as Cisco training | Partly |
| 12 | Admin Autopilot | On the 2026 agentic trend; removes friction when students are weakest; time saved is measurable | Deep integration with student systems; vendors crowding in; liability for a wrong submission | Partly |
| 13 | Lecture Lens | Large international student group; Webex already captions; personal glossary sticks | Commodity feature; technical terms mistranslated; judges will see low uniqueness | Yes |
| 14 | Placement Pre-Flight | Cuts first-placement anxiety; site-specific is novel; reusable per host site | Needs filming access in hospitals; headsets scarce; generic VR nursing products exist | No |
| 15 | Remote Bench | Equity for regional and online students; proven model; real data, not simulation | LabsLand already mature; hardware cost; booking contention | Partly |
| 16 | Fair Team Telemetry | Group-work pain is universal; early warning beats end-of-term peer marks; student-run | Signals can be gamed; feels like monitoring; peer-evaluation tools exist | Yes |
| 17 | Campus Wayfinder | Life-changing for a small group; strong Cisco Spaces BLE fit; physical, not a chatbot | GoodMaps and NaviLens deployed; needs the student's phone; accuracy is safety-critical | No |
| 18 | Real Brief Exchange | Industry evidence beats grades; links outcomes to jobs; employers get a talent pipeline | Riipen exists; employer supply hard to start; marketplace chicken-and-egg | Partly |
| 19 | Misconception Outbreak Watch | No product found; acts before exams, not after; cohort data stays anonymous, help goes to students | LLM diagnosis needs human checking (ASEE 2026); needs enough weekly answers; "outbreak" may alarm | Yes |
| 20 | Skills Gym | Sport-coaching reps are a proven model; hands-on VET focus is rare in pitches; Cisco IoT fit | Hardware per tool; CPR and welding feedback products exist; hard to demo in five days | No |

## Table C: quick scores (1 to 5)

| # | Name | Customer value | Evidence | Feasibility | Proceed | Uniqueness | Total /25 |
|---|---|---|---|---|---|---|---|
| 1 | Outcome Map + Journey Record | 4 | 4 | 4 | 3 | 4 | 19 |
| 2 | AI-Use Card | 3 | 4 | 5 | 4 | 1 | 17 |
| 3 | Lost Moments | 4 | 3 | 5 | 4 | 4 | 20 |
| 4 | Study Squad Radar | 4 | 3 | 4 | 3 | 4 | 18 |
| 5 | Live Sensory Map | 4 | 3 | 4 | 3 | 4 | 18 |
| 6 | Deadline Air Traffic Control | 5 | 3 | 5 | 4 | 4 | 21 |
| 7 | Sim Black Box | 4 | 4 | 2 | 3 | 2 | 15 |
| 8 | Bedside Skills Passport | 4 | 2 | 4 | 3 | 2 | 15 |
| 9 | Ghost Cohort | 4 | 3 | 3 | 3 | 4 | 17 |
| 10 | Feed-Forward Thread | 4 | 3 | 4 | 4 | 3 | 18 |
| 11 | Campus Network Twin Lab | 3 | 2 | 4 | 3 | 3 | 15 |
| 12 | Admin Autopilot | 4 | 2 | 3 | 2 | 3 | 14 |
| 13 | Lecture Lens | 4 | 3 | 4 | 3 | 1 | 15 |
| 14 | Placement Pre-Flight | 3 | 2 | 2 | 2 | 3 | 12 |
| 15 | Remote Bench | 3 | 4 | 2 | 3 | 1 | 13 |
| 16 | Fair Team Telemetry | 4 | 2 | 4 | 3 | 3 | 16 |
| 17 | Campus Wayfinder | 3 | 2 | 2 | 2 | 2 | 11 |
| 18 | Real Brief Exchange | 3 | 2 | 3 | 3 | 1 | 12 |
| 19 | Misconception Outbreak Watch | 4 | 3 | 4 | 4 | 5 | 20 |
| 20 | Skills Gym | 3 | 3 | 2 | 2 | 2 | 12 |
| 21 | Questline | 4 | 3 | 4 | 4 | 4 | 19 (first-pass, Carlos's lead) |

- Scores are first-pass team estimates, not measurements; re-score together on Friday.
- 4 and 5 tie with 10 at 18; 5 is in the top five for Cisco fit and breadth (neurodiverse, campus).

## Top five to bring on Friday

### 6. Deadline Air Traffic Control (21)
- 60-second demo:
  o Student signs in with Duo; four units' due dates merge; week 9 glows red as a storm.
  o The planner proposes start dates per task; one tap drops the plan into the calendar.
  o Anonymous cohort view: "312 students share this collision"; coordinator moves one date; storm shrinks.
- Biggest risk:
  o Depends on clean LMS calendar data and on staff actually moving dates.
  o Judges may cite Greenwich's static map; our edge is the personal forecast plus cohort signal.
- Combines with:
  o 12 Admin Autopilot drafts the extension request when the storm cannot be avoided.
  o 9 Ghost Cohort shows how last year's students got through the same week.

### 3. Lost Moments (20)
- 60-second demo:
  o A 30-second lecture clip plays; three judges tap "lost" on Slido; a spike appears live.
  o Each tapper gets a four-minute rewind: clip, plain-language recap, three glossary terms.
  o Lecturer sees one line: "the room got lost at 23:40", by-product only.
- Biggest risk:
  o Echo360's confusion flag already counts taps per slide (no AI recap found).
  o Recording consent and small classes where three taps mean little.
- Combines with:
  o 19 Misconception Outbreak Watch: lost spikes become early outbreak signals.
  o 13 Lecture Lens adds the glossary in the student's own language.

### 19. Misconception Outbreak Watch (20)
- 60-second demo:
  o 450 synthetic weekly-check answers cluster into "dosage unit confusion", spreading tutorial to tutorial.
  o Student sees: "you and 80 others hold this idea"; a three-minute booster follows.
  o Next week's check shows the recovery curve, like a public health dashboard.
- Biggest risk:
  o LLM misconception diagnosis needs a human check (West Point ASEE 2026 study).
  o Needs enough answers each week; small units stay below the minimum group size.
- Combines with:
  o 1 Outcome Map: the booster lands on the student's private map as a stuck outcome turning green.
  o 3 Lost Moments: lecture spikes and check answers confirm each other.

### 1. Outcome Map + Journey Record (19)
- 60-second demo:
  o Compass beats 1 and 3 without the guide chat: weekly check lights a stuck outcome.
  o Journey record shows what changed since week 1, owned by the student, shareable by choice.
  o Coordinator heatmap appears only after the student beats, minimum group size enforced.
- Biggest risk:
  o Judges heard Compass already; without the tutor it may look like a quiz app.
  o Unit outcomes are often vague; mapping quality depends on the coordinator.
- Combines with:
  o 19 supplies the cohort intelligence; 2 AI-Use Card becomes one screen inside it.

### 5. Live Sensory Map (18)
- 60-second demo:
  o Campus floor plan shows live noise, light and crowd per room.
  o One real Meraki MT sensor if the team can borrow one, otherwise replayed readings.
  o Student filters "quiet, dim, under ten people", walks there, optionally books the room.
- Biggest risk:
  o Sensor hardware per room; NBCC's pilot shows the idea is emerging elsewhere.
  o Smaller user group makes the business case harder; frame as universal design.
- Combines with:
  o 4 Study Squad Radar: one live campus layer for "where are my people" and "where is calm".

## Combinations worth trying
- 3 + 19: lecture taps and weekly answers triangulate a misconception before either alone could prove it.
- 19 + 1: cohort detection finds the problem; the private map delivers the fix to one student.
- 6 + 12: the forecast warns, the agent acts; warning without action is just another notification.
- 4 + 5 (Campus Pulse): same Cisco Spaces and Meraki stack serves social and sensory needs at once.
- 7 + 8 (+ 20): reps in the gym, replay after the sim, signed into the passport: one competence loop.

## Sources checked

| URL | What it showed | Read | Status |
|---|---|---|---|
| https://echo360.com/?p=58909 | Confusion flag: anonymous counts per slide, hotspot map; no AI mentioned; page dated 29 Jan 2019 | 5 Nov 2026 | Read |
| https://answers.uillinois.edu/104898 | Echo360 confusion flag guide | 5 Nov 2026 | Search result; page 404 when opened |
| https://staff.acu.edu.au/our_university/learning_and_teaching/technology_enhanced_learning/innovation/intel_case_study_echo360_confusion_flag | Lecturer notes the flag does not say what is confusing | 5 Nov 2026 | Search only |
| https://echo360.com/?p=100280 | AskEcho AI study aids (flashcards, FAQs) from recordings; vendor claim | 5 Nov 2026 | Search only |
| https://spaces.cisco.com/five-ways-occupancy-people-counting-technology-benefits-universities/ | Cisco Spaces occupancy for libraries, labs; mostly admin purpose | 5 Nov 2026 | Search only |
| https://tlef.ubc.ca/funded-proposals/entry/259/ | UBC 2018 to 2019 project: student study-space occupancy app from Cisco Wi-Fi data | 5 Nov 2026 | Search only |
| https://nbcc.ca/core/research-projects/increasing-campus-accessibility-for-the-neurodiverse-student-population | Light, noise, traffic sensors; digital twin "will" be student-facing; pilot ongoing; vendor unnamed | 5 Nov 2026 | Read |
| https://www.tcd.ie/disability/disability-service-projects/tcd-sense-map-launch/ | TCD Sense Map: filterable static map; survey says 68% lack easy quiet space | 5 Nov 2026 | Search only |
| https://images.campaigns.vu.edu.au/Web/VictoriaUniversity/%7Bb9f77ef8-99fd-4695-9e0d-ab3f5099721c%7D_City_Tower_Sensory_Map.pdf | Victoria University static sensory map, Melbourne | 5 Nov 2026 | Search only |
| https://www.gre.ac.uk/articles/public-relations/map-my-assessment | Greenwich Map My Assessment: type, weighting, due date per assessment | 5 Nov 2026 | Search result; page 404 when opened |
| https://adelaide.edu.au/learning-enhancement-innovation/blog-the-learning-cog/how-to-avoid-assessment-clashes | Adelaide assessment clash tool is staff-only, not student-facing | 5 Nov 2026 | Search only |
| https://www.su.rhul.ac.uk/voice/campaigns/priority8/reducedeadlinestacking/ | Students' union campaign for deadline visualisation tools | 5 Nov 2026 | Search only |
| https://arxiv.org/html/2501.09930v3 | TeamVision, Monash nursing: positioning, lapel mics, cameras; 56 teams, 221 students; educator-facing | 5 Nov 2026 | Read (first 100k characters) |
| https://laerdal.com/information/simcapture-for-nursing-education/ | SimCapture video-assisted debriefing; AI role not specified | 5 Nov 2026 | Search only |
| https://arxiv.org/pdf/2605.00294 | LLMs identify challenging, central topics from quizzes; 3,802 medical enrolments | 5 Nov 2026 | Search only |
| https://convention2.allacademic.com/one/aera/aera26/online_program_direct_link/view_paper/2284094/ | AERA 2026: clustering open-ended answers into misunderstanding groups | 5 Nov 2026 | Search only |
| https://nemo.asee.org/public/conferences/374/papers/51778/download | ASEE 2026 (West Point): LLM misconception diagnosis needs human oversight | 5 Nov 2026 | Search only |
| https://www.technologyrecord.com/article/unsw-enhances-student-support-with-ai-agent-built-on-microsoft-copilot-studio | UNSW student support agent: information access, not form filing | 5 Nov 2026 | Search only |
| https://arts.unimelb.edu.au/__data/assets/pdf_file/0009/5494077/Start-year_2026_Graduate-Information-Session.pdf | Melbourne "Stop 1 AI Assistant" answers questions; enrolment stays in portal | 5 Nov 2026 | Search only |
| https://greenwich.demo.lorikeetcx.ai/ | Vendor demo: agent submits structured requests, staff decide | 5 Nov 2026 | Search only |
| https://ibl.ai/blog/ai-campus-2026-agent-infrastructure-higher-education.md | Vendor blog citing Deloitte and Gartner 2026: shift to agentic AI; secondary | 5 Nov 2026 | Search only |
| https://www.stackai.com/blog/the-top-6-ai-agent-use-cases-for-education-in-2026 | Vendor list of 2026 agent use cases: advising, admissions, outreach | 5 Nov 2026 | Search only |
| https://labsland.com/en/universities/ | Remote real labs for universities; Monash Malaysia FPGA use cited | 5 Nov 2026 | Search only |
| https://edsurge.com/news/2019-12-11-riipen-raises-3-75-million-to-unite-college-students-and-employers-via-course-projects | Riipen matches employer projects to course outcomes | 5 Nov 2026 | Search only |
| https://ontasklearning.org/ | OnTask: open-source personalised feedback; USyd, UTS, UNSW, UniSA origins | 5 Nov 2026 | Search only |
| https://www.rcpd.msu.edu/news/ability-blog/msu-improves-campus-accessibility-through-introducing-goodmaps | GoodMaps indoor navigation in Michigan State buildings | 5 Nov 2026 | Search only |
| https://www.siue.edu/access/support/current-students/accessible-wayfinding.shtml | NaviLens codes rolled out across SIUE buildings | 5 Nov 2026 | Search only |
| https://www.slido.com/education | Slido anonymous Q&A and polls for education; no AI summary feature found | 5 Nov 2026 | Search only |

- Rows 1, 2 and the competitor facts in Table A also rely on competitor-gap-analysis.md (sources read 5 Nov 2026).
- "Search only" = seen in a search summary, page not opened; confirm before quoting on a slide.
