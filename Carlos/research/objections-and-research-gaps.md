# Four adviser objections and the research gaps

- Date: 2026-11-06 night (AEDT, into 7 Nov); sources accessed 2026-11-06.
- Purpose: honest verdicts on four objections from a creative-side adviser, plus what to research and build next.
- Scope: general AI assistants, free music programs in Australia, mentor hand-off timing, audience versus buyer.
- Status: overnight draft for the team; verify before the pitch. Lines marked `unverified` or `snippet` are not pitch-ready.
- Bottom line: we win on "measurement plus proof on the retake plus a human at the end", not on intelligence; two of the four answers rest on files that are still proposals.

## 1. Verdict table

| # | Objection (ten words) | Honest one-line answer | Our position | Evidence |
|---|---|---|---|---|
| 1 | Why not use other AI models instead of the app? | Assistants can listen and talk; our difference is per-note measurement, a structured retake and offline use, still to be tested against them. | Medium | Partly (docs opened; head-to-head test not run) |
| 2 | Free programs with instruments exist; why not go there? | Go there; the app is home practice between sessions and can ride inside such a program. | Strong | Partly (program pages mixed opened and snippet) |
| 3 | Why wait for the ceiling; hand over to the mentor now? | The learner can ask for a mentor at any time; the ceiling rule only governs when the app offers, to protect scarce mentor minutes. | Medium | Partly (rates and shortage sourced; timing rule untested) |
| 4 | Best audience is school age but stakeholders are universities. | User is a Year 5 to 10 learner, payer is the outreach team, mentor is a university student. | Medium | Partly (funding wording is snippet; mentor-ambassador models sourced) |

- Position "medium" on 1 and 4 is deliberate: the team has not benchmarked assistants, and no buyer has agreed.
- Cost is not a clean win over cloud audio models (section 2): Gemini audio input is cheap per minute.
- Sink verdict: objection 4 is the one most likely to sink the pitch (both Codex passes and I agree). A strong note-feedback demo cannot rescue a buyer-outcome link with no named budget holder, school or cohort.
  o My view: agree. Objections 1 to 3 have a design answer; objection 4 needs a human yes, so no wording fixes it.
  o Two-week plan (Codex, adopted in outline):
    o Days 1-3: talk to an outreach budget holder, a school or music partner, and check the Android flow.
    o Days 4-5: agree a small pilot and success criteria.
    o Days 6-12: run it, record non-use.
    o Days 13-14: seek a written commitment, else drop the buyer claim.
    o Two weeks can show feasibility, not long-term aspiration effects.
  o Before Wednesday only the first step is possible: one real conversation, or say plainly the buyer is a proposal.

## 2. Objection 1: "Why can't I just use other AI models rather than the app?"

### What is true in the objection
- General assistants take audio and talk back; official docs show this today.
  o Gemini "can analyze and understand audio input", incl. "Emotion detection in speech and music" and timestamps [4].
  o OpenAI lists realtime audio models and live transcription at per-minute rates [3].
- Cost is not our edge: audio input to a Flash-Lite model is a fraction of a cent per take (arithmetic below).
- A learner can already ask an assistant "was that in tune?"; it may answer plausibly (accuracy `unverified`).

### What the team files already say
- competitor-feedback-mechanics-v1.md: apps compared; general assistants were NOT covered (gap).
- tech-feedback-layer.md s3, s6: rules-based measurement layer plus an LLM that phrases one cue; Layer 1 runs offline at $0.
- tech-feedback-layer.md s6 cost: US$0.014 (all Haiku) to US$0.095 (all Sonnet) per 20-minute session, about 15 takes.
  o Flag: the file prints US$; the brief quoted A$. Say "US$" or convert once, never mix.

### New evidence found tonight
| Finding | Detail | Source |
|---|---|---|
| Gemini audio limits | 32 tokens per second (1 minute = 1,920 tokens); 9.5 hours per prompt; understands non-speech sounds; page says nothing about pitch | [4] opened 2026-11-06 |
| Gemini audio input price | gemini-3.5-flash-lite $0.30; gemini-3.1-flash-lite $0.50; gemini-3-flash-preview $1.00 per 1M tokens; free tier listed | [5] opened 2026-11-06 |
| OpenAI audio price | gpt-realtime-2.1-mini $10 per 1M audio input tokens; gpt-realtime-2.1 $32; gpt-live-1 $0.05 per minute; gpt-4o-transcribe $0.006 per minute | [3] opened 2026-11-06 |
| Pitch in cents, ms per note | No official page opened states that any assistant reports pitch in cents or timing per note against an expected phrase, or compares a retake | [3][4] absence only; not proof |
| Study caution | One adult-beginner study found no significant extra gain from visual pitch feedback alone (Codex knowledge, link given) | `unverified` until opened |

- Our arithmetic (not a vendor figure), 20 minutes of continuous audio at 1,920 tokens a minute is 38,400 tokens.
  o At $0.30 per 1M tokens: about US$0.012 input; at $1.00: about US$0.038. Comparable to our US$0.014 to US$0.095.
  o 15 takes of 10 seconds is 150 seconds: 4,800 tokens, under US$0.005 input. Output tokens extra.
  o gpt-live-1 at $0.05 a minute over 20 minutes is US$1.00: 10 to 70 times our range.
- Honest difference: measurement plus structured retake proof plus offline plus a hand-off path; not intelligence and not price.

### Honest spoken line (32 words)
- "Assistants can listen and chat. Our coach measures each note against the phrase, shows the same measures on the retake, and runs offline. We would test that against them with teachers."

### Sharpest version and follow-up (second Codex pass, Astra high; leads, not verified)
- Sharpest: an assistant gives practice steps and existing apps (e.g. Yousician, not opened) already score playing.
  o A MIDI demo does not prove a cheap-phone mic works or that a higher retake score means learning.
  o Follow-up: same beginner, same phrase, three tools; what measurable result makes yours worth installing?
- Agree: a better retake score shows a better attempt, not lasting learning. Measure next-day performance on a fresh phrase.

### Design change the objection earns
- Replace free-typed goal splitting with a bounded set of supported phrase goals, each tied to a measurable practice task (assistants can substitute goal splitting easily). Agreed.

### What to research more
- Head-to-head test: same 10 recorded phrases (some wrong on purpose) into two current assistants and our feature layer; teachers rate. Owner: tech lead; where: any free assistant tier.
- Open OpenAI voice help page and plan limits (cited by Codex only) and Gemini consumer limits; check whether a free assistant accepts a 10-second clip on a cheap phone offline (it will not; verify and state plainly).
- Open the SingingCoach study (Paney and Tharp) before using it either way.

## 3. Objection 2: "Australia has free music programs with actual instruments; why not go there?"

### What is true in the objection
- Several programs give free lessons or instruments; they offer a teacher, an ensemble and peers, which an app cannot.
- Entry can be gated (aptitude test, selected schools, waiting lists); coverage is uneven.

### What the team files already say
- research-bank.md and universities-brief.md: regional learners have weaker internet; UC outreach to rural primary schools (Aspire UC) exists.
- business-case-v1.md s1: the app "rides inside an outreach activity", not a stand-alone music app.
- competitor-feedback-mechanics-v1.md: no map of free programs yet (gap).

### Program map (what is known; blank means not found tonight)
| Program | Who it serves | In school time? | Instruments supplied? | Regional reach | Source |
|---|---|---|---|---|---|
| WA Instrumental Music School Services | Years 3 to 12, after aptitude test and other criteria | Not stated | Not stated; page links buying guides; parent info says some supplied by families (snippet) | 450+ government schools, metro and regional | [9] opened; [10] snippet |
| Qld Instrumental Music Program | Qld state schools since 1971; considers location and socioeconomic circumstances | Not stated | Not stated | Eight education regions listed; detail not stated | [11] opened |
| NSW, Vic, ACT school programs | Not researched in this file; filled later the same night in free-programs-partner-map.md (NSW, Vic and ACT rows) | | | | free-programs-partner-map.md |
| Music in Me (was National Music Teacher Mentoring Program) | K-6 classroom teachers, mentored by music teachers; students indirectly | In class | Not applicable | Remote, regional, metro; focus on regional, remote, lower ICSEA; 7,000+ students in 161 schools since inception (older figure) | [12] snippet |
| Salvation Army Just Brass | Primary-age kids, local programs, families pay nothing | Varies (local schools or Salvos) | Yes, typically a brass instrument plus lessons and band practice | 20 programs nationally, e.g. Port Macquarie, Castlemaine | [13] snippet |
| Musica Viva In Schools | Schools incl. low-SES areas; instruments from a national donation drive | In class | Some, via donations | 900+ schools, 280,000 students a year (as quoted by a Salvation Army page) | [13] snippet |
| Australian Children's Music Foundation | Disadvantaged children and youth; weekly classes and instruments | Varies | Reported yes (secondary sources) | Remote communities reported; no official count | [14] snippet |
| The Song Room | Primary students, teachers, First Nations programs; "across Australia" | Not stated | Not stated | National; no counts | [15] opened |
| Rural Aid Gift of Music | Individuals or schools that apply; donated instruments | n/a | Yes, matched donations | Regional and remote (e.g. 37 ukuleles to Bedourie) | [14] snippet |
| Music: Count Us In | Mass school singing day; roughly 600,000 to 650,000 students, 3,000 to 3,400 schools (year varies) | In school | No | National | [16] snippet |

### Honest answer
- Complement, not replacement: programs run in class time with a teacher present; the app serves practice at home between sessions.
- The pitch posture is partner, not rival: offer it THROUGH a program.
- Two programs most worth a partnership conversation:
  o Music in Me (mentoring teachers in regional and remote primary schools): reaches regional, lower-ICSEA schools and already trains the people who run the weekly lesson; it needs a home-practice tool. Fits the Outreach Funding audience.
  o Salvation Army Just Brass: free instrument plus weekly band; kids have an instrument at home but no one between rehearsals; local volunteers could use the clip hand-off.
- Runners-up: a state instrumental program (Qld or WA) where lessons are sparse and practice weeks are long.

### Honest spoken line (32 words)
- "Those programs are brilliant and we want to join them. They run in class with a teacher; the app covers practice at home between sessions, so a learner arrives having already tried."

### Sharpest version and follow-up (second Codex pass; leads, not verified)
- Sharpest: free programs give instruments, teachers, peers and belonging; offline access supplies no instrument or quiet room. Follow-up: which learners have an unmet practice need after existing provision, and what shows they would use the app between sessions?
- Lead to check: Pizzicato Effect (pizzicatoeffect.org.au) as another free-lessons-and-instruments program; not opened, `unverified`.

### Design change the objection earns
- Start from a short phrase assigned by a partner program's teacher, with a voice option for learners without a keyboard. Agreed; it also fits the partner-not-rival posture.

### What to research more
- Open each program's own page for cost, eligibility, waitlists and school-time delivery; NSW Music Program, Vic Itinerant Instrumental, ACT Music Program, ACMF site (blocked tonight: certificate error), Musica Viva site (404 on the page tried).
- Data: how many school-age learners in the pilot regions have a free-program place (state education department data or a school survey). Owner: research lead.
- Ask one program lead the question: "Would your students use a home practice tool?"

## 4. Objection 3: "Why not take the hand-over as soon as possible and give it to my mentor?"

### What is true in the objection
- If a mentor is the best help, delaying it is wrong; frustration and a muddy recording both justify a human.
- The ceiling rule can read as a gate; the team's own design says otherwise but the pitch has to say it.

### What the team files already say
- handoff-design-v1.md s1: "the learner may ask for a human at any time"; s2 T4: tapping "Ask a teacher" or "I can't do this" offers a human at once.
- handoff-design-v1.md s2: miss 3 on one cause (valid comparable takes) triggers the offer; pain or strain is an immediate stop (T6).
- handoff-design-v1.md s1 and s4: pre-service teachers as a supervised pool; one 10 to 30 second clip, the goal, the fixes tried with before and after.
- Conflict kept in the log: build-plan-v0.md s7 says "same cue three sessions in a row".

### New evidence found tonight
| Finding | Detail | Source |
|---|---|---|
| Lesson cost, WA | WAMTA recommended minimum: $110 per hour (accredited), $95 (teaching), $75 (provisional), $70 (student); same figures listed for 2024, 2025, 2026 | [6] opened 2026-11-06 |
| Lesson cost, Qld, Vic | QMTA 2022 guideline: recommended minimum $76 per hour; Vic $89 per hour via a teacher's site (secondhand) | [7] snippet; Vic `unverified` |
| Regional shortage | NSW parliamentary committee submissions from regional conservatoriums name low studio-teacher pay and weak supply; advocacy, not independent data | [8] snippet |
| Rural research | Peer-reviewed article in Music Education Research (2023) on rural and regional music education, interview study | [8] snippet |
| Feedback | Hattie and Timperley 2007: feedback is one of the most powerful influences on learning, but effect can be positive or negative; timing is covered | [17] snippet (not opened; 403) |
| Deliberate practice | Ericsson et al. 1993 abstract: expert performance tracks accumulated deliberate practice; later revisiting (2019) found a smaller effect than the original | [18] snippet |

- Lesson-to-practice ratio: no figure found; the arithmetic is the team's to state (one 30-minute lesson a week against daily practice is our assumption, `unverified`).
- Cost per mentor minute at $75 to $110 an hour is about A$1.25 to A$1.83 a minute (our arithmetic); pre-service mentors are cheaper but supervised.

### Honest answer
- The learner can always go to the mentor; the app is for the days between mentor sessions.
- The hand-off sends the clip plus the cause, so the mentor's minutes count.
- Say plainly: the ceiling trigger is a scarce-time rule for the app's proactive offer, not a gate on help.
- Residual risk: whether a sensible default is miss 3 or miss 2; untested with learners.

### Honest spoken line (31 words)
- "A learner can ask for a mentor any time. The ceiling rule protects limited mentor minutes: when a clip goes over, it carries the cause and the tries, so their time counts."

### Sharpest version and follow-up (second Codex pass; leads, not verified)
- Sharpest: three failures may only delay help and encourage deliberate failure; repeated wrong notes do not show their cause; packaging a clip does not create mentor availability. Follow-up: can you show the rule beats sending the first clip?
- Agree: the miss-3 count is an unvalidated prompt, not evidence of a ceiling. Webex sending needs a connection even when practice is offline.

### Design change the objection earns
- Make "Ask for help" learner-controlled at all times (already T4), with the app only suggesting it after repeated difficulty.
  o Preview the clip and a tentative cause, shared when connected through the partner's approved channel.
  o Agreed: drop the word "ceiling" from learner and pitch wording.

### What to research more
- Open Hattie and Timperley 2007 and the Ericsson 1993 full text; cite only quotes read.
- Open the QMTA, VMTA and AMEB-aligned fee pages; get a 30-minute rate.
- Find an official regional music teacher supply source (NSW committee final report, state education data).
- Test the trigger: five learners, hand-off at miss 2 versus miss 3; measure mentor minutes and drop-off. Owner: UX lead.

## 5. Objection 4: "Target audience is still a problem: school age is best but stakeholders are universities."

### What is true in the objection
- The user, the payer and the mentor differ; a judge could think "university students are the audience" and fear a glance.
- Adults who have chosen a course are the wrong fit for Outreach Funding (cannot fund enrolled-student support, per business-case-v1.md).
- A music practice tool alone may not count as outreach; it needs a link to higher-education aspiration (Codex draft; also business-case-v1.md s1 "catch").

### What the team files already say
- business-case-v1.md s1: one buyer, the outreach team; the learner pays nothing; the app rides inside an outreach activity; determination 5812, UC $384,182.
- handoff-design-v1.md s1, s5: reviewers are pre-service teachers (UC 9885, Flinders EDUC2338, La Trobe EDU3009).
- privacy-design-v1.md s3.1: guardian loop for a university-run pilot; under 15, a guardian taps each share.
- sunday-decisions-sheet.md A4: age group still open (Year 5 child, teen, young adult); pitch-v1 uses a Year 5 picture with young-adult copy.

### New evidence found tonight
| Finding | Detail | Source |
|---|---|---|
| Program purpose | Outreach Funding replaces the outreach part of HEPPP; about $44 million in 2026 "to deliver targeted outreach initiatives"; guidance describes activities that build aspiration for higher education | [19] snippet (full guidance PDF timed out twice; wording not quoted) |
| Exclusion | Pathway or preparation courses are excluded (funded elsewhere) | [19] snippet |
| UNSW ASPIRE | 56 partner schools in disadvantaged communities, Sydney, regional and remote NSW; "Integral to the program is the involvement of UNSW students as ASPIRE Ambassadors, acting as role models"; about 200 ambassadors, 2,000+ volunteer hours a year (self-reported) | [20] snippet |
| UOW In2Uni | Primary and secondary low-SES students; student academic mentoring; Kids In2Uni for stage-three students with a mentor pre-visit | [21] snippet |
| AIME | University students mentor Indigenous high school students, years 7 to 12; hour-a-week formats; started 2005 | [22] snippet |
| UC Aspire | Possible Future Passport (K-6 rural primary), UC 4 Yourself (Year 9) | research-bank.md (team file); not re-opened tonight |

### Honest resolution
- USER: a Year 5 to 10 learner (final age band is the team's call, row A4).
- PAYER: the university outreach team, from Outreach Funding.
- MENTOR: a university student (a pre-service teacher); university students are never the user.
- Consequences if school age:
  o Under 15: guardian permission for each share (privacy-design-v1.md s3.1); child can decline.
  o Schools: access through a school or program partner, with its consent and supervision.
  o The nine-adult test is a usability check on the interface, not the audience statement.
  o Pitch picture and demo copy must match one age band (A4 mismatch today).
- Risk that stays: a school-age pilot needs the school and the ethics route; no partner school and no ethics body has agreed.
- Risk that stays: the funding fit (aspiration, not recruitment) needs the outreach team to confirm in writing.

### Honest spoken line (33 words)
- "The learner is a Year 5 to 10 student, the payer is the university outreach team, and the mentor is a university student. University students are never the learners; they coach through it."

### Sharpest version and follow-up (second Codex pass; leads, not verified)
- Sharpest: schoolchildren as users and outreach teams as buyers, with no shown relationship that makes either commit.
  o Music improvement is not evidence of higher-education aspiration.
  o Follow-up: which budget holder funds which school cohort, through which delivery partner, against what outcome beyond engagement?
- Codex reading of the guidance (supports aspiration and access; excludes enrolled-student support; separates outreach from recruitment) matches business-case-v1.md s1; I could not open the PDF, so it stays `snippet`.

### Design change the objection earns
- Package the pilot as a university-school outreach activity for one named cohort (e.g. Years 7 to 9 beginners): supported practice, mentor contact, a pathway conversation. Agreed; it also settles row A4.

### What a sceptical adviser would still say (Codex critique, folded)
- Funding fit is unproved: what changes in a child's understanding of higher education, and how is it measured? Needs a written view from the outreach team.
- The buyer is hypothetical; an allocation is not a purchase. Show a delivery partner and an owner for the pilot.
- Years 5 to 10 is too wide; pick one pilot band.
- Objection 1: the real rival is an assistant plus pitch tools; our difference is a claim until teachers rate it. Cost and offline are not proven advantages (our arithmetic compares input only; clips awaiting review need a plan).
- Objection 3: "ask any time" is a service promise; state who answers, in what time, and the queue when requests exceed capacity.
  o Five learners cannot set the best threshold; they can expose usability problems.
  o Hand-off cost must include supervision and safeguarding, not lesson rates.
- Objection 2: "between sessions" is plausible, not a shown gap; Qld policy already expects self-directed practice (Codex, link `unverified`). A partner needs a lead willing to distribute it and learners with a device and a place to practise.

### What to research more
- Open the full Outreach Funding Guidance (19 Feb 2026 PDF) and the Guidelines 2025 (F2025L01613); quote the eligible-activity and exclusion text. Where: education.gov.au.
- Open UC Aspire, UNSW ASPIRE, UOW In2Uni and AIME own pages for mentor roles; check whether any runs creative-arts activities.
- Ask the outreach contact: does a music-practice tool fit as an activity? Which schools would they ask?
- Ethics route: UC human research ethics (low-risk pathway) and ACT Education research approval. Owner: business lead.

## 6. How we make the app: what to look into more

| Pri | Question | Owner role | Hours | File that owns the answer |
|---|---|---|---|---|
| 1 | General-assistant head-to-head: do assistants measure notes and compare retakes? | Tech lead | 4 | competitor-feedback-mechanics (new section) |
| 2 | Audience statement: one age band, one picture, one copy set | Research and UX lead (Simone) | 2 | sunday-decisions-sheet A4; pitch-v1 |
| 3 | Phone-mic proof: pitch accuracy and timing on a cheap phone mic | Tech lead (Justin) | 6 | tech-feedback-layer |
| 4 | Free-program partnership map and two outreach calls (Music in Me, Just Brass) | Business lead | 4 | business-case-v1 s5 |
| 5 | Mentor economics: lesson rate, mentor minutes per learner, pool size | Business lead | 3 | handoff-design-v1 s5 |
| 6 | Model step: which model phrases the cue, offline fallback | Tech lead | 4 | tech-feedback-layer s6 |
| 7 | Android floor test: one low-cost phone, browser audio, offline mode | Tech lead | 3 | web-app-architecture |
| 8 | MIDI keyboard path (child key count) | Tech lead | 3 | tech-keyboard-input |
| 9 | Ethics route and school permission for a school-age pilot | Business lead plus the mentor | 4 | privacy-design-v1 s3.1; handoff-design-v1 s6 |

- Hours are our estimates, `unverified`; the first four change what is said on Wednesday.

## Method
- Codex call 1 (gpt-6-sol, medium, names stripped): strongest honest answer and settling evidence per objection. Kept: framing of the four answers, the funding-fit risk, the "test with teachers" idea. Rejected: all links unless opened (marked snippet or unverified).
- Codex call 2 (gpt-6-sol, high): critique of sections 1 to 5. Kept: funding-fit, hypothetical buyer, age-band, "never use" wording fixed to "never the learners", service-promise and queue question, supervision cost. Rejected as unverified: the Qld policy link (not opened).
- Codex call 3 (GPT-6 Astra, high, no web, names stripped): a second devil's-advocate pass on the four objections; folded as the Sharpest version and Design change lines.
  o Its two program leads (Yousician, Pizzicato Effect) were not opened and stay unverified.
- Pages opened: OpenAI pricing, Gemini audio and pricing, WAMTA fees, Song Room, Qld IMP, WA IMSS.
- Pages failed: education.gov.au guidance and program pages (timeout), acmf.org.au (certificate), musiccountusin site (DNS), Hattie article (403), Musica Viva page (404), UC page (DNS).
- Search snippets only: everything marked snippet.

## Open questions
- Which single age band does the pitch use (row A4)? It decides the picture, key count and the guardian loop.
- Do we state the US$ cost figure at all, given it is not a clean win over cloud audio?
- Will the outreach team confirm in writing that a music-led activity fits the guidance (aspiration, not recruitment)?
- Is the default offer at miss 2 or miss 3, and does the pitch say "ask any time" out loud?
- Which two programs do we contact before 11 Nov, if any?

## Sources
1. tech-feedback-layer.md s6, in this folder (team file, 2026-11-06).
2. business-case-v1.md, handoff-design-v1.md, privacy-design-v1.md, research-bank.md, sunday-decisions-sheet.md (team files, 2026-11-06).
3. https://developers.openai.com/api/docs/pricing; accessed 2026-11-06; opened.
4. https://aistudio.google.com/docs/audio (redirect from ai.google.dev/gemini-api/docs/audio); 2026-11-06; opened.
5. https://aistudio.google.com/docs/pricing (redirect from ai.google.dev/gemini-api/docs/pricing); 2026-11-06; opened (first 100,000 characters).
6. https://wamta.au/resources/teaching-fees; 2026-11-06; opened.
7. https://www.qmta.org.au/s/Teaching-Fees-QMTA-2022-Guidelines-for-schools.pdf; 2026-11-06; snippet.
8. https://www.parliament.nsw.gov.au/lcdocs/submissions/87123/0046%20Riverina%20Conservatorium%20of%20Music.pdf and related NSW committee submissions; 2026-11-06; snippet.
9. https://www.education.wa.edu.au/instrumental-music; 2026-11-06; opened.
10. https://www.education.wa.edu.au/dl/4lgpx3d6; 2026-11-06; snippet.
11. https://queenslandschoolmusic.education.qld.gov.au/; 2026-11-06; opened.
12. https://ayo.com.au/introducing-the-national-music-teacher-mentoring-program/ and https://education.nsw.gov.au/teaching-and-learning/curriculum/creative-arts/planning-programming-and-assessing-creative-arts-k-6/music-in-me; 2026-11-06; snippet.
13. https://others.org.au/news/2019/01/24/just-brass-program-receives-thousands-of-donated-instruments and https://www.salvationarmy.org.au/news/music-program-hits-the-right-note/; 2026-11-06; snippet.
14. https://media.ruralaid.org.au/rural-aid-program-the-gift-of-music-is-asking-for-donations-of-old-instruments/ and https://issuu.com/acmf_foundation/docs/acmf_impactreport_v15_newbrand2; 2026-11-06; snippet.
15. https://www.songroom.org.au/; 2026-11-06; opened.
16. https://themusicnetwork.com/news/music-count-us-in-shines-a-light-across-australia; 2026-11-06; snippet.
17. https://findanexpert.unimelb.edu.au/scholarlywork/334554-the-power-of-feedback (Hattie and Timperley 2007, Review of Educational Research 77(1)); 2026-11-06; snippet.
18. https://stafforini.com/works/ericsson-1993-role-deliberate-practice/ and https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6731745/; 2026-11-06; snippet.
19. https://www.education.gov.au/download/20042/outreach-funding-guidance/44110/document/pdf and https://www.education.gov.au/access-and-participation/outreach-funding-program; 2026-11-06; snippet (fetch timed out).
20. https://www.ncsehe.edu.au/?p=6936 and https://newsroom.unsw.edu.au/news/class-act; 2026-11-06; snippet.
21. https://www.uow.edu.au/media/2014/primary-school-students-to-taste-university-life-across-uows-regional-campuses.php; 2026-11-06; snippet.
22. https://westernsydney.edu.au/badanami/badanami_centre_for_indigenous_education/about_us/mentoring_programs/australian_indigenous_mentoring_experience_aime and https://www.monash.edu/news/articles/mentors-help-indigenous-students-aime-high; 2026-11-06; snippet.
