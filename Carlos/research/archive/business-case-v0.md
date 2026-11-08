# Business case v0: the listening practice coach

- Date: Fri 6 Nov 2026 (AEDT), overnight draft.
- Purpose: the business case outline the programme requires; reviewers test customer value, evidence, technical feasibility and what it would take to proceed.
- Recommendation: one buyer in the pitch = a sponsor university's outreach team, paying from its own Outreach Funding allocation; the ask = a costed 12-week pilot; the learner pays nothing.
- Status: overnight draft for the team; verify before the pitch. Figures marked placeholder or assumption are not facts.

## 1. Recommendation
- Pitch one buyer: the university outreach and pathway team (UC Aspire-style programmes), not the learner.
  o The learner gets the first step free; the university buys reach into regional and low-SES schools.
- HEPPP is gone: discontinued 1 Jan 2026 after running 2010 to 2025 [S1].
  o Its outreach part is now the Outreach Funding Program: about $44m a year, paid to Table A universities [S2][S3].
  o Never say "HEPPP-funded" on stage; say "fits the university's Outreach Funding".
- The money is real at each sponsor: 2026 Outreach Funding grants are UC $384,182, Flinders $902,208, La Trobe $1,419,938 (national total $43,735,160) [S7].
  o Determination approved 10 Feb 2026, "Initial 2026 funding"; 2027 amounts not yet seen (TODO check).
  o A $5,000 pilot is 1.3% of UC's 2026 outreach grant (our arithmetic).
  o For scale: 2025 HEPPP participation grants were UC $1.51m, Flinders $3.45m, La Trobe $5.07m, but HEPPP also funded enrolled-student support [S4].
- Catch: Outreach Funding must build aspiration for higher education, must not be recruitment, and cannot fund enrolled-student support [S3].
  o So the app rides inside an outreach activity (music hook, university students as hand-off mentors, a pathway conversation), not as a stand-alone music app.
  o Frame the ask as "a scoped evaluation of a music-led outreach activity", with the app as one component.
  o The pilot must measure interest in further study separately from enjoyment of music, or it does not count as outreach.
- Fallback ask, same slide: a one-unit pilot in an education-faculty arts unit (UC 9885, Flinders EDUC2338, La Trobe EDU3009) [universities-brief.md].
- Keep consumer and tutor routes on the vision slide only; both face priced, crowded markets (section 4).

## 2. Buyer options
| Option | Who signs | What they need to see | Decision cycle | Price logic | Main risk |
|---|---|---|---|---|---|
| A. University via outreach and pathway programmes (lean) | Outreach or widening-participation manager; spend certified by the VC or delegate in the annual acquittal [S3] | Reaches priority cohorts (low SES, regional or remote, First Nations) [S3]; builds aspiration, not recruitment [S3]; evaluation plan using SEHEEF [S3]; phone, offline, no instrument; minimal IT | Calendar year: funds paid monthly, spend within the year; 2026 activity reported by 27 Mar 2027 [S3]; 2027 rules TODO check | Per programme or per school cohort, paid from the outreach allocation; under $5,000 needs no quote at UC [universities-brief.md s4] | A music app is not outreach by itself; must show the link to higher-education aspiration |
| B. Costed one-unit pilot (education-faculty arts unit) | Unit convenor, then course director, LMS team, central IT, AI risk, procurement (7 steps) [universities-brief.md s4] | Fits the unit task and its GenAI category; LTI 1.3 or a plain link; privacy review; ethics if research | A semester ahead; ethics 2 weeks (UC) to 2 months (Flinders) [universities-brief.md s4] | Flat pilot fee or free pilot for evidence; UC: under $5,000 card or invoice, $5,000 to $50,000 one quote [universities-brief.md s4] | Small cohort; pre-service teachers are not the young learner without access |
| C. Learner direct (consumer subscription) | The learner or a parent | Hears me, one fix, cheaper than lessons | Instant, app store | Market anchors: about US$65 to US$180 a year (section 4) | Crowded (Yousician, Simply, flowkey, Skoove); a paywall excludes the target learner |
| D. Tutor or music teacher (B2B2C) | Independent teacher or studio | Saves lesson time; student arrives with recording and fix list | Weeks; word of mouth | Teacher seat; anchor: Piano Maestro teacher plans US$119.99 or US$179.99 a year [S8] | Few teachers in regional towns, the very gap we exist to fill |

- Advisor fit: one buyer; augment the tutor; sponsors must see something to act on; prove accessibility; scalable, maintainable, minimal infrastructure (state-of-play s4).
- Logic: A matches the learner and the judges; B is the cheapest proof; C and D are revenue options later.
- Outreach rules we must design to [S3]:
  o Provider-agnostic: materials need not carry university branding (Principle 2).
  o Collaboration across providers is encouraged (Principle 7): a sector offer is allowed.
  o Reach regardless of campus presence (Principle 5): fits a phone app.
  o Evaluation required (Principle 9): our measures double as their report.

## 3. What it takes to proceed (one slide for a sponsor university)
- Ask: a 12-week pilot in one outreach programme (preferred) or one arts unit, starting in the 2027 school year.
- Why 12 weeks: gamification effects dip from week 4 and recover weeks 6 to 10, so measure late [gamification-research.md].

| Cost line | 12-week pilot figure | Basis |
|---|---|---|
| Hosting (static, offline-capable web app) | US$0 (demo, Hobby) to US$20 a month (Pro, commercial use) | Vercel Hobby is "personal, non-commercial"; Pro $20 a month [S12] |
| LLM calls for the plain-words fix | See tech-feedback-layer.md | Features per take only; audio stays on the device |
| Part-time coordinator | Placeholder: 0.2 FTE for 12 weeks, costed by the university at its own rates | Assumption |
| Teacher hand-off hours | Placeholder: 1 to 2 hours per learner over 12 weeks, at $87 an hour | Hours = assumption; $87 = QMTA 2026 recommended minimum private rate, excl. GST and on-costs [S24]; who teaches is open (question 26) |
| Ethics approval (only if data become research) | 2 weeks (UC low risk) to 2 months (Flinders); La Trobe 8 weeks (snippet) | universities-brief.md s4 |
| Devices and instruments | None: the learner's own phone; on-screen keys or voice | R11, R12; instrument rental from about $12 a month if wanted [research-bank.md] |

- Two pilot sizes (illustrative arithmetic on the placeholders above; LLM excluded, see tech-feedback-layer.md):

| Size | Learners | Hand-off hours | Hand-off cash | Hosting | Cash total | UC approval band |
|---|---|---|---|---|---|---|
| Small | 50 | 1 each = 50 h | about $4,350 | US$60 (3 months Pro) | about $4,500 plus LLM | Under $5,000: card or invoice |
| Full | 150 | 2 each = 300 h | about $26,100 | US$60 | about $26,200 plus LLM | $5,000 to $50,000: one written quote |

  o Coordinator time is in-kind in both (assumption); in-kind still costs the sponsor staff hours.
  o Hand-off by supervised university music or education students would cut cash; rate and supervision TODO.
- University supplies: one programme or unit, a coordinator, the consent and ethics path, school contacts, hand-off mentors (music or education students).
- We supply: the app, set-up, a one-hour coordinator briefing, a weekly data summary.
- We measure: weekly active learners; retakes with a measured fix; hand-offs offered and taken; week-10 retention; learner-reported confidence; interest in further study, asked separately from enjoyment of music (SEHEEF-aligned).
- Feedback quality check before launch: a qualified teacher scores a sample of the app's fixes as right or wrong (question 20).
- Consent, recordings and deletion: guardian consent for minors expected (check with each ethics office and school system); audio stays on the device by default (R11); school permissions TODO per state.
- Go or no-go at week 12 (proposed, to agree with the sponsor):
  o Go if most learners still practise in weeks 8 to 12, most retakes show a measured fix, and hand-offs happen.
  o No-go if use collapses after week 4 or the fix does not hold on retake.
  o Thresholds: TODO set with the sponsor; no number is invented here.

## 4. Comparable pricing models
### Consumer music apps (US prices as listed)
| Product | Clearly yearly plan | Other listed prices | Source |
|---|---|---|---|
| Yousician "June" AI guitar teacher | US$159.99 | US$29.99 a month | trend-check-music-learning.md [3] |
| Skoove | US$149.99 per 12 months | US$29.99 a month; lifetime option | [S25], opened tonight |
| Melodics | US$179.99 | US$34.99 a month | trend-check [25] |
| Rocksmith+ | US$139.99 | US$19.99 a month; free tier | trend-check [17] |
| Piano Marvel | US$129.99 | US$17.99 a month; free tier | trend-check [23] |
| Justin Guitar app | US$64.99 | US$8.99 a month | trend-check [15] |
| Fender Play | US$44.99 to US$149.99 (tiers) | Free for schools (Fender Play EDU) [S9] | trend-check [12] |
| Simply Piano | Not comparable: US$19.99 to US$179.99, periods unlabelled | Free 2 courses | trend-check [4][5] |
| flowkey | Not comparable: yearly plans exist, no price on its help page | Free limited | [S26]; trend-check [8] |

- Range for clearly yearly full plans: about US$65 to US$180 (Fender's lowest tier US$44.99); a paywall the target learner may not cross.
- Caveat: US App Store prices, mixed tiers; Australian prices not checked (TODO).

### Institutional and school models
| Product | Model | Figure | Source |
|---|---|---|---|
| Studiosity | "Fixed-price per student model" for universities | UK example: De Montfort University, GBP 1,196,390 contract, Sep 2025, 12 months with extensions to Jul 2030 | [S10][S11] |
| Cogniti (University of Sydney) | University-built; on Microsoft Marketplace since 2026 | Price not published; public community repository holds docs, no licence file seen | [S13][S14] |
| Duolingo for Schools | Free | Closes 31 Jul 2027; teacher tools saw low use | [S15] snippet-level |
| Yousician for Teachers | Ended | "has come to an end" | [S16] |
| Fender Play EDU | Free for schools via LMS or SIS | Rostering and single sign-on | [S9] snippet |
| Piano Maestro (Simply) | Teacher subscription | US$119.99 a year (studio) or US$179.99 a year (studio plus home) | [S8] |
| Khan Academy Districts with Khanmigo | Per student | US$10 per student per year, 1,000 licences or fewer, US schools | [S17] |

- Signal, not a law: two free teacher offers closed (Duolingo, Yousician) while Fender's stays free; institution-paid per-student models exist (Studiosity, Khanmigo).
  o Lesson for us: price per programme or per learner, paid by the institution, with an evaluation report attached.
  o A large Studiosity contract shows universities pay for feedback at scale; it does not validate our price.
- Outreach cost per participant: no public Australian figure found (unverified); Outreach Funding reports list participants per activity from 2027, which may publish it [S3].

## 5. Funding angles
| Angle | What it is | Fit | Status | Source |
|---|---|---|---|---|
| HEPPP | Equity grants to Table A universities, 2010 to 2025 | None now | Discontinued 1 Jan 2026 | [S1] |
| Outreach Funding Program | About $44m a year from 2026 for pre-access outreach to low-SES, regional or remote, First Nations people | Strong if framed as aspiration-building; not recruitment | Allocated by formula to universities, no application round; 2026: UC $384,182, Flinders $902,208, La Trobe $1,419,938 | [S2][S3][S5][S7] |
| Needs-Based Funding | Supports enrolled equity students | Weak: our learner is pre-access | From 1 Jan 2026 | [S2] |
| Regional Partnerships Project Pool | Collaborative regional outreach; $12.9m awarded since 2022; consortia led by universities or Regional University Study Hubs | Model for a later consortium bid | Two phases awarded; no open round seen | [S6] |
| University Study Hubs | 56 regional and 15 suburban hubs | Venue for hand-off sessions and shared instruments | Operating | [S2] |
| artsACT Arts Activities Funding | Up to $5k (all year) and $5k to $50k (two rounds); music and new media eligible; about $1.35m in 2025-26 | Possible for a Canberra community music pilot; applicant rules TODO check | Open per round | [S18] |
| Create NSW Arts and Cultural Funding Program | Several streams for NSW artists and organisations | Weak: aimed at artists and touring | Many streams closed | [S19] snippet-level |
| Creative Victoria Creative Projects Fund | $10k to $30k for Victorian creatives and small organisations | Weak; 2026 round closed | Closed | [S20] snippet |
| CreateSA Music Development Office | Support for SA contemporary music artists and businesses | Weak: industry, not education | Programs listed | [S21] |
| Music Australia, Songwriting and Recording in Schools Stimulus | $5k to $100k matched funding for school, TAFE and university music programs | Partner route (a school or university applies) | Closed 13 Oct 2026; activity 2027 | [S22] |
| Cisco and NIIN | Industry-led, university-enabled prototyping network; Innovation Central hubs | Follow-on path is via the sponsor, since the IP goes to La Trobe and the sponsor "to make it easy for the sponsor to keep working with you" [key-facts-info-pack.md] | No public winner grant found | [S23] snippet |

- Best two: the sponsor's own Outreach Funding (no application, already allocated) and a later multi-university consortium.

## 6. Three-year sketch and unit economics
| Year | Shape | Learners (assumption) | Who pays | What must be true |
|---|---|---|---|---|
| 2027 | 12-week pilot, one sponsor, one outreach programme or one unit | 50 to 150 (assumption) | Sponsor outreach budget; under $5,000 cash plus in-kind coordinator (assumption) | Use holds past week 4; fix holds on retake |
| 2028 | Two universities; second cohort; add one arts-unit pilot | 300 to 800 (assumption) | Each university's outreach budget | Evaluation report accepted in the 27 March acquittal |
| 2029 | Sector offer: a multi-university outreach collaboration (Principle 7) | 2,000 to 5,000 (assumption) | Pooled outreach budgets; per-learner fee | Hand-off mentors available in regional areas |

- No revenue is forecast; price is set later to cover cost per learner plus support.

### Unit economics per learner per month (placeholders, not quotes)
| Line | Placeholder range | Driver |
|---|---|---|
| LLM | See tech-feedback-layer.md; placeholder A$0.05 to A$0.50 | Calls per session times sessions; rules-first layer cuts calls |
| Hosting | Placeholder A$0.01 to A$0.20 | Static app; US$20 a month Pro plan spread over learners [S12] |
| Hand-off (pilot) | About A$31 to A$63 | 1 to 2 teacher hours per 12 weeks (2.77 months) at $87 an hour [S24]; hours = assumption |
| Hand-off (at scale) | Lower if only some learners reach the ceiling | Share of learners needing a teacher = assumption, to measure in the pilot |
| Coordinator | Placeholder; in-kind from the university | Assumption |
| Total (pilot) | About A$31 to A$64 plus coordinator | Human time dominates; software is cents |

- Business point: the cost is people, not compute.
  o Comparison, our arithmetic: weekly private lessons at the same $87 minimum are about $1,044 a term of 12 weeks; the pilot buys 1 to 2 teacher hours a term plus daily coached practice.
  o The university already pays outreach staff; the app makes each teacher hour go further.

## 7. Risks to the case
| Risk | Why it matters | Mitigation |
|---|---|---|
| Prior art | Yousician June, Simply, flowkey, Skoove already listen [trend-check] | Claim the combination: goal-led small goals, one fix with proof, no instrument needed, human hand-off; never "first" |
| Funding fit | Outreach money must build aspiration, not teach music or recruit [S3] | Package with a pathway conversation and university-student mentors; provider-agnostic materials; measure interest in further study |
| Feedback accuracy | The value claim rests on one right fix; our evidence is one user (n = 1) [evidence-carlos-singing-practice.md] | Teacher-scored sample of fixes across phones, rooms and voices before the pilot; state tested limits on stage |
| Cost of hand-off | At $87 an hour, teacher time is most of the pilot cost [S24] | Cap hours per learner; supervised student mentors; measure what share of learners needs a teacher |
| Trust | 60% of students trusted GenAI feedback vs 90% for teachers [state-of-play s5] | Human hand-off; plain-words cue with a measured before-and-after |
| Adoption | IT, privacy and AI-risk reviews (7 steps) [universities-brief.md s4] | Start in outreach, not the LMS; audio on device; under $5,000 |
| Novelty fade | Effects dip after week 4 [gamification-research.md] | 12-week pilot measured at weeks 8 to 12; no streaks; social layer later |
| Teacher supply in regional towns | Hand-off needs a human; regional teachers are scarce (no national count found) [research-bank.md] | Remote hand-off to music or education students; Study Hubs as venues [S2] |
| Free offers fold | Duolingo for Schools and Yousician for Teachers ended [S15][S16] | Institution-paid from day one, with an evaluation it can report |
| IP ownership | IP goes to La Trobe and the sponsor [key-facts-info-pack.md] | Treat the sponsor as the commercial partner; agree team roles in the next step |

## 8. The three pitch answers in business terms
| Answer | Business version |
|---|---|
| Solves a problem | Universities must spend outreach money on regional and low-SES learners and report results; we give them a low-cost, phone-only activity with built-in evaluation |
| Beats what exists | Consumer apps charge about US$65 to US$180 a year and the free school offers have folded; we are institution-paid, need no instrument, and hand off to a human |
| Why this team | A measured one-user record, verified research, and a 12-week pilot whose small size fits under UC's $5,000 approval line and is 1.3% of UC's 2026 outreach grant |

## Method
- Read: state-of-play, universities-brief s4 and s5, research-bank, questions 23 and 31, competitor-gap-analysis Table 2, trend-check product table, gamification-research.
- Codex call 1: gpt-6-sol, medium, knowledge draft on pricing, HEPPP, grants, hosting.
  o Kept after web checks: HEPPP closed, Outreach Funding, RPPPP $12.9m, Khanmigo $10, Duolingo closure, Fender EDU, Piano Maestro, Music Australia stimulus.
  o Rejected or unused: the GPT-6 Luna per-call price (left to tech-feedback-layer.md); Yousician yearly prices (not re-checked).
- Codex call 2: gpt-6-sol, high, critique of the finished draft (no names).
  o Kept: replace share estimates with the published 2026 determination (verified, S7); 2027 reporting date unknown; cost the pilot in one total; measure aspiration apart from music; teacher-scored fix check; standardise consumer prices (Skoove re-checked, S25).
  o Rejected: none outright; its flowkey yearly prices were not found on the page (S26), so not used.
- Web: department pages and guidance PDF opened; HEPPP allocations spreadsheet parsed; vendor pages opened where not blocked.
- Consumer prices reused from trend-check-music-learning.md (accessed 5 Nov 2026 by that file's agent; not re-opened tonight).

## Open questions
- Buyer: does Simone agree on university outreach as the one buyer (questions 23, 31)?
- Which sponsor programme hosts the pilot (UC Aspire, Small Schools Program), and who there owns the outreach budget?
- Is a music hook accepted as aspiration-building under the Outreach Funding guidance? Ask a sponsor outreach manager.
- 2027 Outreach Funding amounts and reporting dates: not yet published (check).
- Who does the hand-off, at what rate, with what supervision and checks (question 26)?
- LLM cost per session: fill from tech-feedback-layer.md when written.
- Go or no-go thresholds: agree with the sponsor before recruitment; none invented here.
- IP: the IP goes to La Trobe and the 2026 industry sponsor; which party is the commercial partner, and the team's role after 12 Nov?
- Australian consumer prices and any Australian school-licence figures: not checked.
- Outreach cost per participant: no public Australian figure found.

## Sources
- S1 Department of Education, HEPPP page, https://www.education.gov.au/heppp , accessed 2026-11-06, opened.
- S2 Department of Education, Access and Participation, https://www.education.gov.au/access-and-participation , accessed 2026-11-06, opened.
- S3 Department of Education, Outreach Funding Guidance (PDF, updated 19 Feb 2026), https://www.education.gov.au/download/20042/outreach-funding-guidance/44110/document/pdf , accessed 2026-11-06, opened.
- S4 Department of Education, 2010-2025 HEPPP Participation Allocations (xlsx), https://www.education.gov.au/heppp/resources/20102025-higher-education-participation-and-partnerships-program-heppp-participation-allocations , accessed 2026-11-06, opened.
- S5 Department of Education, Outreach Funding Program, https://www.education.gov.au/access-and-participation/outreach-funding-program , accessed 2026-11-06, opened.
- S6 Department of Education, Regional Partnerships Project Pool Program, https://www.education.gov.au/rpppp , accessed 2026-11-06, opened.
- S7 Department of Education (HEIMS), Determination No. 5812, Outreach Funding Program 2026, approved 10 Feb 2026, https://app.heims.education.gov.au/HeimsOnline/IPInfo/Determination/Download/6602 , accessed 2026-11-06, opened.
- S8 Simply, Piano Maestro subscription options, https://piano-help.hellosimply.com/en/articles/13750836-piano-maestro-subscription-options , accessed 2026-11-06, opened.
- S9 Fender, Get Fender Play for FREE (education support), https://education-support.fender.com/hc/en-us/articles/47444822476827-Get-Fender-Play-for-FREE , accessed 2026-11-06, snippet (page 403).
- S10 Studiosity, Multi-institutional case study (PDF), https://www.studiosity.com/hubfs/Studiosity/Downloads/B2B/Multi-Institutional%20Case%20Study%20Studiosity%2B%20in%20Universities.pdf , accessed 2026-11-06, opened.
- S11 UK Find a Tender, De Montfort University, Provision of Studiosity, notice 050806-2025, https://www.find-tender.service.gov.uk/Notice/050806-2025 , accessed 2026-11-06, opened.
- S12 Vercel pricing, https://vercel.com/pricing , accessed 2026-11-06, opened.
- S13 University of Sydney news, Cogniti on Microsoft Marketplace (15 Jun 2026), https://www.sydney.edu.au/news-opinion/news/2026/06/15/ai-education-platform-cogniti-goes-global-on-microsoft-marketplace.html , accessed 2026-11-06, opened.
- S14 GitHub, cogniti-education/cogniti-community, https://github.com/cogniti-education/cogniti-community , accessed 2026-11-06, opened.
- S15 PiunikaWeb, Duolingo for Schools discontinued after July 2027 (24 Apr 2026), https://piunikaweb.com/2026/04/24/duolingo-for-schools-is-being-discontinued-after-july-2027/ , accessed 2026-11-06, opened (secondary; quotes the Duolingo email).
- S16 Yousician, Schools page, https://yousician.com/schools , accessed 2026-11-06, opened.
- S17 Khan Academy Districts pricing, https://us.khanacademy.org/schools/pricing , accessed 2026-11-06, opened.
- S18 artsACT, Arts Activities Funding, https://www.arts.act.gov.au/funding/arts-activities-funding , accessed 2026-11-06, opened.
- S19 NSW Government, Arts and Cultural Funding Program, https://www.nsw.gov.au/grants-and-funding/arts-and-cultural-funding-program , accessed 2026-11-06, opened.
- S20 Creative Victoria, Creative Projects Fund (page blocked; via search), https://creative.vic.gov.au/funding-opportunities/find-a-funding-opportunity/creative-projects-fund , accessed 2026-11-06, snippet.
- S21 CreateSA, Music Development Office Funding, https://www.create.sa.gov.au/funding-and-grants/Music-Development-Office-Funding , accessed 2026-11-06, opened.
- S22 Creative Australia, National Songwriting and Recording in Schools Stimulus, https://creative.gov.au/investments-opportunities/national-songwriting-and-recording-schools-stimulus , accessed 2026-11-06, opened.
- S23 Cisco, National Industry Innovation Network, https://www.cisco.com/site/au/en/solutions/global-partners/niin.html , accessed 2026-11-06, snippet (page did not render).
- S24 Queensland Music Teachers Association, Tuition Rates 2026, https://www.qmta.org.au/tuition , accessed 2026-11-06, opened.
- S25 Skoove help, Skoove Premium prices, https://help.skoove.com/en/articles/5417607-what-is-skoove-premium-and-how-much-does-it-cost , accessed 2026-11-06, opened.
- S26 flowkey help, subscription plans, https://help.flowkey.com/en/articles/4466337-which-subscription-plans-are-available , accessed 2026-11-06, opened (no prices shown).
- trend-check-music-learning.md sources [3] to [25]: App Store and vendor pages listed there, accessed 5 Nov 2026.
