# Gamified unit journey - concept page (draft 5 Nov 2026, from Carlos's lead)

- Revision, 5 Nov night (Carlos): the game layer below is optional skin, not the product.
  o The product is the engine: AI reads the unit and splits every big assessment into small next goals.
  o The student chains small wins and finds they are ahead; that is the moment to show on stage.
  o Keep: goal breakdown, progress line, chronicle, one buddy on the same goal, the class task bar (everyone's own tasks, one shared bar, no names). Drop as product: bosses, raids, world map.
  o Evidence for this cut: gamification-research.md sections 1.3, 2 and 9; procrastination-small-goals-evidence.md sections 5 and 6. Scoring: friday-selection-pack-2026-11-06.md.

- Revision, 6 Nov evening (Carlos): the two-track goal. This is where the small-goals engine goes inside the music coach.
  o Each learner has their own goal and purpose ("make this cover sound good", "play this song for my mum", "pass the audition").
  o The app serves that goal, and the AI splits it into small goals that each carry one fundamental (breath, vowel, timing, a chord change).
  o So the learner improves on the thing they want and improves overall, without being told they are doing a course.
  o Carlos's own record is the proof case: he wanted a good-sounding cover; the one cue that fixed the cover ("narrow the vowel") also fixed his singing (evidence-carlos-singing-practice.md, section 3).
  o Evidence: autonomy is the strongest motivational lever in gamified learning (g = .638, Li, Hew, Du 2024; gamification-research.md section 2); progress monitoring on a self-set goal lifts attainment (d = 0.40, Harkin 2016; procrastination-small-goals-evidence.md section 5); one fix with proof (evidence file, section 9).
  o Prior art, said honestly: Yousician and Simply Piano teach through songs you pick. Ours differs in three ways: the goal is the learner's own and can be anything (a cover, a performance, a voice); every small goal shows proof of the fundamental it carried; and the path ends at a human.
  o Two progress lines on screen: "your goal" (how close the cover is) and "your skill" (the fundamentals banked). The second is the "two weeks ahead" moment from the unit version.

- One line: AI turns any existing unit outline into a journey the student travels, without changing the content or the assessments.
- Working name: "Questline". The unit is the campaign; outcomes are regions; assessments are bosses; weeks are chapters.
- Answer test: the student learns and succeeds differently because the unit has a shape, a path and a story, not a list of tasks.
- Why not boot.dev or Duolingo: they own and write their content for one discipline. We wrap any unit's existing content.
- Why not just Claude: Claude cannot read the coordinator's outline, hold 450 students' state, or run a shared world for a cohort.

## What makes a task feel like a journey (borrowed from game design)
| Game principle | Task version today | Journey version |
|---|---|---|
| A map you can see | A list of due dates in the LMS | A world map of the unit: regions per learning outcome, fog where you have not been |
| A goal you chose | "Submit assignment 2" | "Reach the clinic boss ready": the assessment is a destination with a route |
| Challenge matched to skill | Same worksheet for everyone | Side quests scale to your stuck regions; AI generates the next one |
| Feedback that carries forward | A mark, then nothing | Progress stays on the map; the chronicle records what changed |
| Identity and story | Student number | "Junior clinician on rotation" in health; "associate on a case file" in law |
| A party | Study alone at 11 pm | Co-op quests with two or three classmates on the same stuck region |
| Rest and return | Fall behind, feel lost | Fog lifts when you come back; the map shows the shortest way to catch up |

## The five AI roles (none is a chat tutor)
- World-builder: reads the unit outline, outcomes, weekly topics and assessments; drafts the map once. Coordinator approves in minutes.
  o This is what makes it general: any discipline, any unit, zero rewriting of content.
- Quest-master: picks and generates the next side quest from the student's stuck regions and the week's topic.
  o Quests are short practice items mapped to one outcome, with direction not answers (the Compass guard reused).
- Chronicler: writes the student's journey in plain words from their own record. "Week 3: dosage calculations fogged. Week 5: cleared."
  o The student owns it; it doubles as the AI-use appendix sponsors already ask for.
- Party-matcher: finds two or three classmates stuck in the same region this week and proposes a co-op quest.
  o Chris: "we learn better talking and engaging with humans."
- Raid-caller: when a misconception spreads through the cohort, it becomes a raid the whole cohort clears together.
  o Reuses Misconception Outbreak Watch (ideas board 19); anonymous, minimum group size.

## What the student sees
| Moment | Screen |
|---|---|
| Week 1 | The unit map, four regions, two bosses, their path drawn. "You are here." |
| Week 3, 11 pm | Dosage region fogged; one side quest offered, ten minutes; a party of two classmates online |
| Before assessment 1 | Boss pre-flight: three practice encounters on the regions the boss tests; readiness shown, no score shared |
| After assessment 1 | Chronicle entry written; map updates; marker feedback becomes a habit card for the next chapter |
| Week 12 | The chronicle is a story of the unit, owned by the student, shareable by choice |

## Guardrails against bad gamification
- Progress, not points: no XP, no leaderboards, no streak shaming. Public leaderboards hurt low performers.
- Cooperative, not competitive: parties and raids, never rankings.
- Private by default: the map is the student's; staff see cohort fog, not names.
- The game is the structure, not the content: the coordinator's material and assessments stay exactly as they are.
- Optional narrative skin: a student can switch the story off and keep the map.
- Honest evidence: gamification research in higher education shows small gains in engagement and mixed gains in learning; our claim is engagement and visibility, measured in a pilot. [evidence needed: a 2020 to 2025 meta-analysis of gamification in HE]

## Discipline flavour from the same engine
| Discipline | Skin | Boss | Side quest |
|---|---|---|---|
| Health | Rotation on a ward | Case study, OSCE | A patient vignette on one outcome |
| Law | Associate on a case file | Problem question, moot | Spot the issue in a short fact pattern |
| Engineering | Build log on a project | Design report, lab | One calculation or diagram check |
| Business | Analyst on an engagement | Case report | One data read or decision call |

## How it combines with the board
- 1 Outcome Map + Journey Record is the map and chronicle. This idea gives them shape and story.
- 4 Study Squad Radar is the party-matcher. 19 Outbreak Watch is the raid. 10 Feed-Forward Thread is the habit card.
- 6 Deadline Air Traffic Control becomes the campaign calendar across all units: boss storms visible weeks ahead.

## Cisco fit (plausible, to confirm)
- Webex: party channels and raid calls; Webex bot delivers the weekly chapter.
- Duo: sign-in. Campus-hosted models: the world-builder and quest-master run on university infrastructure.

## 60-second demo
- Beat 1: coordinator drops a unit outline; the map appears with four regions and two bosses; one click approves.
- Beat 2: student at week 3 sees the fogged region, takes a ten-minute side quest, a party invite pops.
- Beat 3: boss pre-flight shows readiness; the chronicle writes the week; cohort fog shows the coordinator where to teach.

## Risks
- "Chocolate-covered broccoli": if the quests are the same old worksheets, the skin wears off in two weeks.
- Students may find the narrative childish; keep the default skin plain and professional, story optional.
- World-builder quality depends on how well the outline is written; coordinator approval is the check.
- Judges may see it as a game, not a learning transformation; lead with the map and the chronicle, not the skin.

## Questions for 6 Nov
- Would a coordinator approve a generated unit map in under ten minutes? What would they change first?
- Does a professional skin (rotation, case file) feel motivating or patronising to third-year students?
- Which is the stronger lead: the map alone (idea 1) or the map with story and party (this page)?

## Sources

- Carlos's lead and his revisions of 5 Nov night and 6 Nov evening, as the body states.
- gamification-research.md, sections 1.3, 2 and 9, as cited in the body.
  o Section 2 carries the autonomy effect (g = .638, 2024 meta-analysis).
- procrastination-small-goals-evidence.md, sections 5 and 6, as cited in the body.
  o Section 5 carries the progress-monitoring effect (d = 0.40, 2016 meta-analysis).
- friday-selection-pack-2026-11-06.md, for the scoring behind the 5 Nov cut.
- evidence-carlos-singing-practice.md, sections 3 and 9, Carlos's own record as the proof case.
- The ideas board, ideas 1, 4, 6, 10 and 19, as named in the body.
- Chris's quote on learning with humans, as given in the body.
