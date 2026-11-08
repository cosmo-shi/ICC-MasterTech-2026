# Verification overdrive: the nine overnight files plus qa-prep.md

- Date: Fri 6 Nov 2026 (AEDT, written about 20:10); verification agent (Sonnet); re-check before speaking.
- Purpose: confirm every number, date, price, law and licence claim on stage files first, then business case, then the rest.
- Scope: pitch-v0, qa-prep, success-criteria-draft, business-case-v0 (priority); tech-feedback-layer, tech-pitch-detection, tech-keyboard-input, privacy-design-v0 (claims and licences); build-plan-v0, competitor-feedback-mechanics (spot checks).
- Status: overnight draft for the team; verify before the pitch. Top finding: qa-prep Q13 attaches a $628,416 grant to the wrong university and cites HEPPP as current.
- "opened" = I fetched and read the page or file; "snippet" = search result only; all accessed 2026-11-06. Verdict words: confirmed, differs, unverified, unreachable.

## 1. Fix list, ordered by stage risk
- 1. qa-prep Q13: "$628,416 for the Aspire UC outreach project" is wrong. The 2014 list gives Aspire UC $250,000; $628,416 is Queensland University of Technology's STEM project. Say $250,000 (2014) or drop it.
- 2. qa-prep Q13: "current HEPPP funding is not confirmed on UC pages" misleads. HEPPP was discontinued 1 Jan 2026; replacement is the Outreach Funding Program (UC 2026 grant $384,182). Align with business-case-v0.
- 3. pitch-v0 slide 5: "Music: none" overclaims. The UC page is silent on disciplines; say "no music we could find" (the spoken beat 5 already does).
- 4. Trust figures need the denominator: 83.9% and 60.1% are of the 3,328 students who had used GenAI feedback, not all students. success-criteria C3 and business-case risk row say "60% of students trusted"; say "of users".
- 5. Privacy and offline wording is inconsistent across files (section 4): "cloud only for hand-off and sync" (qa-prep Q9) vs cloud LLM wording (tech-feedback-layer). Pick one stage line.
- 6. Demo device and input conflict across files (section 4): MIDI keyboard (tech-keyboard-input), on-screen keys default (build-plan, pitch variant A), phone microphone on a real keyboard (pitch variant B).
- 7. qa-prep Q9 cites MDN for "service workers unavailable on first load"; the MDN page does not say it. web.dev does. Cite web.dev.
- 8. Lines containing "nobody" (pitch beat 1, beat 2, Option 2; qa-prep Q4): not "nobody has done this", but the programme rule bans "nobody" claims; reword or accept (section 5).
- 9. tech-pitch-detection: @audio/pitch is now 2.2.0 (17 Oct 2026), not 2.0.4; ml5 npm field reads MIT while the repo licence is custom (claim holds, wording should say "npm says MIT, repo custom").
- 10. business-case-v0: 2026 Outreach Funding is "Initial 2026 funding"; a 2027 pilot rides on rollover (guidance allows rollover into 2027) or 2027 amounts. The "27 March acquittal" is 27 March 2027, for 2026 funds.
- 11. Khanmigo $10: the page prices "Enterprise Starter" at $10 per student per year, and its FAQ says "fewer than 1,000" while the card says "1,000 or fewer".
- 12. UC "under $5,000 needs no quote": the policy says invoice or corporate card; "no quote" is not stated. Clause 43 shows ">" where "<" is meant.
- 13. Flinders "teach out": found in the handbook page data ("Teach out from 2026"); the human-readable page and the Flinders creative-arts page do not say so. Safe line: "Flinders no longer lists a music degree for 2027."
- 14. Unchecked on stage-adjacent lines: "4% of new primary graduates", "two-thirds of primary schools", "Music Australia May 2026 report" (search found no such report), UC Copilot, rental $12 to $24, Flinders ethics 2 months, La Trobe 8 weeks.

## 2. Stage files: pitch-v0, qa-prep, success-criteria-draft
| File | Section | Claim as written | URL (source no.) | Opened or snippet | Verdict | Correction |
|---|---|---|---|---|---|---|
| pitch-v0 | beat 2, slide 2 | primary degrees average about 8 hours compulsory music (7.98) | [1] | opened | confirmed | "average compulsory hours ... in a generalist primary teaching degree is 7.98" |
| pitch-v0 | slide 2 | down from 17 in 2009 | [1] | opened | confirmed | 2009 audit "17"; report says "53% decline over 13 years" |
| pitch-v0 | s5 say table | 84% of student users found AI feedback helpful; 60% trusted it vs 90% teachers | [2] | opened (PDF) | confirmed | 83.9%, 60.1%, 90.5%; denominator is the 3,328 users |
| pitch-v0 | s5 | 72% of surveyed universities offer no primary music specialisation | [1] | opened | confirmed | text: "72% do not offer a primary music specialism" |
| pitch-v0 | s5 | about 4% of new primary graduates (research-bank "Claim 2") | [1] | opened | unverified | no 4% graduate figure found in Fading Notes text; trace the research-bank row |
| pitch-v0 | s5, Q and A | two-thirds of primary schools lack quality sequential music | n/a | not checked | unverified | no URL in the file; keep Q and A only |
| pitch-v0 | beat 5, slide 5 | UC runs free outreach into small rural primary schools and Year 9 regional classes | [3] | opened | confirmed | Passport "free ... small rural primary schools" within three hours of Bruce; UC 4 Yourself Year 9 |
| pitch-v0 | slide 5 | "Music: none." | [3] | opened | differs | page does not mention music or any discipline; say "no music we could find" |
| pitch-v0 | beat 6, slide 7 | UC low-risk ethics usually about two weeks | [4] | opened | confirmed | "usually assessed within two weeks"; source is a June 2020 guide, may be superseded |
| pitch-v0 | slide 1 | wobbles 24 to 7 in one retake (n = 1) | evidence file (out of scope) | not checked | unverified | personal record; Carlos's privacy call |
| qa-prep | Q3, Q7 | 49.7% of 6,960 sought GenAI feedback | [2] | opened | confirmed | 49.7% (n=3461) of 6,960 |
| qa-prep | Q7 | caveat: 10,132 of about 192,000 invited, four universities | [2] | opened | confirmed | 5% volunteered; 79% completed; Deakin, Monash, Queensland, UTS |
| qa-prep | Q7 | 84% helpful (82% teachers), 60% vs 90% trust | [2] | opened | confirmed | users only |
| qa-prep | Q8 | 36 of 49 invited institutions replied; range 1 to 19; ACT 6.5; 58% no practicum music | [1] | opened | confirmed | 58% = "do not observe or participate" |
| qa-prep | Q3, Q10 | La Trobe ChatGPT Edu, 40,000 licences by FY27 | [5] | opened | confirmed | "by the end of the 2027 financial year"; 5,000 interim; Copilot stays for staff |
| qa-prep | Q10 | Flinders Gemini Enterprise, about 30,000 students | [6] | opened | confirmed | "30,000 Flinders students will have access"; page updated 4 Nov 2026 |
| qa-prep | Q3, Q10 | UC Copilot | n/a | not checked | unverified | no URL |
| qa-prep | Q3, Q15 | Flinders music degree in teach-out from 2026 | [7] | opened (raw page data) | confirmed | handbook data "Teach out from 2026"; creative-arts page no longer lists a music degree |
| qa-prep | Q9 | service workers unavailable on first load (MDN and web.dev) | [8][9] | opened | differs | MDN page silent; web.dev says the worker "doesn't have control of your pages yet" until reload |
| qa-prep | Q12 | very remote 30.5% always or often; national 15.9%; 21 point gap | [10] | opened (PDF) | confirmed | 21 points is the access-score gap between major cities and very remote, not the 14.6 point connection gap |
| qa-prep | Q12 | instrument rental about $12 to $24 a month; libraries lend free | n/a | not re-opened | unverified | carried from the afternoon file |
| qa-prep | Q13 | UC rule: under $5,000 no quote; $5,000 to $50,000 one written quote (cl.43) | [11] | opened | differs | under $5,000 = invoice or corporate card; $5,000 to $50,000 = "One written quotation" |
| qa-prep | Q13 | 2014 list shows $628,416 for the Aspire UC outreach project | [12] | opened | differs | Aspire UC Schools Outreach Project = $250,000; $628,416 = QUT STEM-related outreach |
| qa-prep | Q13 | current HEPPP funding not confirmed on UC pages | [13] | opened | differs | HEPPP discontinued 1 Jan 2026 |
| qa-prep | Q11 | OAIC: do not put personal information into publicly available generative AI tools | n/a | not re-opened | unverified | OAIC guidance exists on this; not fetched |
| qa-prep | Q14 | Flinders ethics 2 months ahead; La Trobe 8 weeks | n/a | not re-opened | unverified | marked snippet in source file |
| qa-prep | Q2 | UC Possible Future Passport K to 6, small rural schools within 3 hours of Bruce; UC 4 Yourself Year 9 regional | [3] | opened | confirmed | |
| success-criteria | C3 | Henderson 2025: 83.9% helpful (82.2% teachers); 60.1% trusted (90.5% teachers) | [2] | opened | confirmed | users only; wording "trusted" needs "of those who used it" |
| success-criteria | C3 | DOI 10.1080/02602938.2025.2502582 | [2] | doi.org blocked (403) | unverified | PDF opened via UTS handle; DOI string not seen in the text I read |
| success-criteria | C5 | named low-end phone | n/a | n/a | unverified | file marks it `unverified` |

## 3. business-case-v0
| Section | Claim as written | URL (source no.) | Opened or snippet | Verdict | Correction |
|---|---|---|---|---|---|
| 1, 5 | HEPPP discontinued 1 Jan 2026, ran 2010 to 2025 | [13] | opened | confirmed | |
| 1, 5 | Outreach Funding about $44m a year from 2026 | [14] | opened | confirmed | "approximately $44 million annually"; commenced 1 Jan 2026 |
| 1 | 2026 grants UC $384,182; Flinders $902,208; La Trobe $1,419,938; total $43,735,160 | [15] | opened (PDF) | confirmed | Determination No. 5812, approved 10 Feb 2026, "Initial 2026 funding" |
| 1 | $5,000 is 1.3% of UC's grant | arithmetic | n/a | confirmed | 5,000 / 384,182 = 1.30% |
| 1 | 2025 HEPPP participation: UC $1.51m, Flinders $3.45m, La Trobe $5.07m | [16] | opened (xlsx) | confirmed | 1,513,884; 3,451,715; 5,070,841 |
| 1, 2 | not recruitment; cannot fund enrolled-student support; Principles 2, 5, 7, 9; SEHEEF | [17] | opened (PDF) | confirmed | "distinctly separate from student recruitment"; provider-agnostic option in Principle 2 |
| 7 table | acquittal 27 March | [17] | opened | differs | 27 March 2027, for 2026 funds; the 2028 row wording is ambiguous |
| 5 | Regional Partnerships Project Pool $12.9m since 2022 | [18] | opened | confirmed | |
| 5 | artsACT up to $5k all year; $5k to $50k two rounds; about $1.35m 2025-26; music eligible | [19] | opened | confirmed | |
| 5 | Music Australia stimulus $5k to $100k matched, closed 13 Oct 2026, activity 2027 | [20] | opened | confirmed | 50:50 cash match; activity 27 Jan to 31 Dec 2027 |
| 3, 6 | $87 an hour = QMTA 2026 recommended minimum, excl GST | [21] | opened | confirmed | Professional Members; associate $77, student $67 |
| 3 | Vercel Hobby non-commercial; Pro $20 a month | [22] | opened | confirmed | |
| 4 | Skoove US$149.99 per 12 months; US$29.99 a month | [23] | opened | confirmed | |
| 4 | Piano Maestro teacher plans US$119.99 and US$179.99 a year | [24] | opened | confirmed | |
| 4 | Khanmigo US$10 per student per year, 1,000 licences or fewer | [25] | opened | differs | "Enterprise Starter" $10/student/year; FAQ says "fewer than 1,000" |
| 4 | Yousician for Teachers ended | [26] | opened | confirmed | "has come to an end" |
| 3, 6 arithmetic | 50 x $87 = $4,350; 300 x $87 = $26,100; $1,044 a term; A$31 to A$63 per learner | arithmetic | n/a | confirmed | 87 / 2.77 = 31.4; 174 / 2.77 = 62.8 |
| 4 | Studiosity DMU GBP 1,196,390; Duolingo closes 31 Jul 2027; Fender free for schools; Cogniti; Create NSW; Creative Victoria; CreateSA; Cisco NIIN; 56 + 15 study hubs | not reopened | n/a | unverified | not in the priority set; sources S9 to S11, S13 to S16, S19 to S23 |
| 4 | Yousician June US$159.99; Melodics, Rocksmith+, Piano Marvel, Justin Guitar, Fender, Simply prices | trend-check file | not reopened | unverified | 5 Nov agent data; US App Store prices move |

## 4. Contradictions between the files
| Topic | File A says | File B says | Fix |
|---|---|---|---|
| Demo input | pitch-v0 s4: variant A on-screen keys default; variant B real keyboard with phone microphone | tech-keyboard-input: USB MIDI keyboard into Chrome is the recommendation (Option B); build-plan: Web MIDI on laptop Chrome, on-screen keys elsewhere | One decision at Tuesday freeze; pitch variant B should say "MIDI cable", not "microphone" |
| Learner instrument | success-criteria and pitch: voice-first coach (C1 wobble counts on a voice phrase) | build-plan: keyboard first, "voice replayed from a recorded take" | Say which one the nine-student test uses (success-criteria open question already flags it) |
| Phrase | pitch-v0: "one rights-cleared tune", undecided | build-plan: "Ode to Joy"; tech-keyboard: "unverified" melody | Pick Ode to Joy; check the arrangement you play is your own transcription |
| Cloud use | qa-prep Q9: "cloud only for the hand-off and sync"; success-criteria: "audio stays on the device" | tech-feedback-layer: cloud LLM sees feature JSON for wording; privacy-design: slide line "only what you choose to share leaves it" is accurate only if the cloud tip is opt-in | Choose: tip opt-in, or say "numbers, not sound" |
| Offline | build-plan: whole app offline, nothing on stage needs network | tech-feedback-layer: Layer 1 offline, cloud only for wording; qa-prep Q12: offline "designed, not validated" | Consistent in substance; keep "designed, not validated" |
| Funding | qa-prep Q13: current HEPPP unconfirmed; $628,416 | business-case: HEPPP gone; Outreach Funding grants | Replace Q13 text with business-case figures |
| Costs | qa-prep Q10, Q13: "not costed yet; no number on stage" | business-case: pilot costed about $4,500 and $26,200; tech-feedback: about $0.04 a session | Fine if stage stays "not costed"; add the figures to Q and A as backup |
| Buyer wording | pitch-v0: "universities"; qa-prep Q19: buyer question open | business-case: "a sponsor university's outreach team", paying from Outreach Funding | Use "a university outreach team" on stage |
| Trust figure | pitch/qa-prep: "of student users" | success-criteria, business-case risks: "of students" | Say "users" everywhere |

## 5. Scans
- (a) Names outside the allowed list: scanned all ten files for two-word capitalised names; none are people outside the list. Two citation names only: "Dalla Bella" (tech-feedback-layer, paper author) and "Takashi Mizuhiki" (tech-keyboard-input, source author), both allowed as citations. Single-word names (for example a first name alone) were not scanned.
- (c) "first", "nobody", "only", "generating music" lines:
  o pitch-v0 beat 1: "Nobody sent me." (about being referred to a teacher; not an originality claim).
  o pitch-v0 beat 2: "nobody heard us and told us one thing to fix." Option 2: "Nobody will ever hear her try."
  o qa-prep Q4: "nobody tells you the bad habit in week one."
  o qa-prep Q3, Q15: "Flinders' only music degree"; business-case: "never 'first'" (a guard line, fine).
  o pitch-v0 s5 and qa-prep Q16, Q18: "It never generates music"; "we never generate music" (guard lines; spoken only if asked). build-plan s2: "the app never makes music ... only plays our synth guide" (backing synth is playback, still avoid saying it aloud).
  o No line claims "first" or "no one else" about the product.
- (d) Ariely and Wertenbroch: a case-insensitive grep of all ten files returned no match.
- (e) Figures with no URL and no `unverified` mark: pitch-v0 "4%" and "two-thirds"; qa-prep UC Copilot, rental prices, OAIC line, Flinders and La Trobe ethics times (source files only).

## 6. Remaining files
| File | Section | Claim as written | Opened or snippet | Verdict | Correction |
|---|---|---|---|---|---|
| tech-feedback-layer | s2, s6 | `claude-sonnet-5-5`, `claude-haiku-5-5` | opened [27] | confirmed | |
| tech-feedback-layer | s6 | Sonnet $2 / $2.50 / $0.10 / $10; Haiku (to 100k) $0.10 / $0.125 / $0.01 / $0.50 per MTok | opened [28] | confirmed | cache read $0.10 on Sonnet (5% of input) |
| tech-feedback-layer | s5 | cache minimum 512 tokens, 5-minute default | opened [29] | confirmed | |
| tech-feedback-layer | s5 | `output_config.format` json_schema, additionalProperties false; both models supported; grammar cached 24 h | opened [30] | confirmed | |
| tech-feedback-layer | s5 | default effort Sonnet high, Haiku medium; latency Fast / Fastest | opened [27] | confirmed | |
| tech-feedback-layer | s5 | non-default temperature returns 400 on Sonnet 5.5 | opened [31] | confirmed | page also lists top_p and top_k |
| tech-feedback-layer | s5 | `tool_choice` any or tool returns 400; Haiku accepts thinking disabled | skill only | unverified | not on the model page |
| tech-feedback-layer | s6 | per-call costs $0.0055 and $0.00028; routed session about $0.043 | arithmetic | confirmed | within rounding |
| tech-pitch-detection | s2 | Pitchy: MIT on npm 4.1.0 (4 Jan 2024); repo 0BSD, pushed 5 Nov 2026 | opened (registry, API) [32] | confirmed | |
| tech-pitch-detection | s2 | SwiftF0 MIT; 46.9 to 2,093.8 Hz; 176 ms lookahead | opened [33] | confirmed | README: 46.875 to 2093.75 Hz |
| tech-pitch-detection | s2 | pitchfinder GPL-3; aubio core GPL-3; Essentia.js AGPL-3 | opened [32] | confirmed | |
| tech-pitch-detection | s2 | Basic Pitch Apache-2.0 1.0.1 (5 Aug 2022); Meyda MIT 5.6.3 (21 Apr 2024); cwilso MIT; CREPE MIT | opened [32] | confirmed | |
| tech-pitch-detection | s2 | @audio/pitch MIT, version 2.0.4 | opened [32] | differs | npm latest 2.2.0, 17 Oct 2026 |
| tech-pitch-detection | s2 | ml5 custom licence; legacy 0.12.2 (25 Apr 2022); 1.x has no pitch module | opened [34] | partly | repo licence is custom; npm lists MIT for 0.12.2 and 1.4.0; "no pitch module" unverified |
| tech-pitch-detection | s2 | SPICE CC BY-NC 4.0 | n/a | unverified | not opened |
| tech-keyboard-input | s9 | Tone.js MIT 15.1.22 (Apr 2025); smplr MIT 1.1.0 (28 Sep 2026); VexFlow 5.0.0 MIT; OSMD 2.2.1 BSD-3; abcjs 6.7.2 MIT; html-midi-player BSD-2; webmidi Apache-2.0 | opened [32] | confirmed | |
| tech-keyboard-input | s9 | WebAudioFont GPL-3.0-or-later; soundfont-player MIT 0.12.0 | opened [32] | confirmed | archive status not checked |
| tech-keyboard-input | s9 | Salamander Grand Piano CC BY 3.0 | n/a | unverified | not opened |
| tech-keyboard-input | s3 | keyboard prices A$91 to A$219 | n/a | unverified | mostly snippets, marked in file |
| privacy-design-v0 | s2 | Children's Online Privacy Code must be registered by 10 Dec 2026; consultation 31 Mar to 5 Jun 2026 | opened [35] | confirmed | exposure-draft date not on the page; commencement not stated |
| privacy-design-v0 | s2 | statutory tort in force 10 Jun 2025; any person can be defendant | opened [36] | confirmed | |
| privacy-design-v0 | s3 | presume capacity over 15 unless unsure; under 18 by maturity | opened [37] | confirmed | |
| privacy-design-v0 | s2 | small business exemption (turnover) | opened [38] | confirmed | $3 million or less; exceptions listed |
| build-plan-v0 | s3 | Web MIDI prompts since Chrome 124; no Web MIDI on Safari or iPad | not rechecked | unverified | source file marks it opened; not re-fetched here |
| build-plan-v0 | s6 | Ode to Joy 1824; Beethoven died 1827; AU public domain for authors died before 1955 | snippet | unverified | marked snippet in the file |
| build-plan-v0 | s5 | Webex create-message limit 7,439 bytes | snippet | unverified | marked snippet |
| build-plan-v0 | s4 | GitHub Pages from a private repo needs a paid plan | snippet | unverified | marked snippet |
| competitor-feedback-mechanics | tables | Piano Marvel "99% two notes, 90% three"; Melodics stars at 50, 75, 90% | snippet | unverified | rows 12 and 27 are snippets |

## 7. Verdict table per file
| File | Claims checked | Confirmed | Differs | Unverified |
|---|---|---|---|---|
| pitch-v0 | 10 | 5 | 1 | 4 |
| qa-prep | 23 | 14 | 4 | 5 |
| success-criteria-draft | 3 | 1 | 0 | 2 |
| business-case-v0 | 20 | 17 | 1 | 2 (grouped, ~20 individual figures) |
| tech-feedback-layer | 8 | 7 | 0 | 1 |
| tech-pitch-detection | 7 | 5 | 1 | 1 (ml5 counted partly) |
| tech-keyboard-input | 4 | 2 | 0 | 2 |
| privacy-design-v0 | 4 | 4 | 0 | 0 |
| build-plan-v0 | 4 | 0 | 0 | 4 |
| competitor-feedback-mechanics | 1 | 0 | 0 | 1 |

- "Differs" for qa-prep counts Q9 MDN, Q13 procurement wording, $628,416, HEPPP; one of these (procurement) is a nuance, not an error.

## Method
- Fetched primary pages with WebFetch; downloaded PDFs and a spreadsheet with curl into the scratch folder and read them with pdftotext and a small script; read npm registry and GitHub API for licences, versions and dates.
- Tallied the nine files with grep for numbers, licences, "first/nobody/only", and Ariely; read pitch-v0, qa-prep, success-criteria and business-case in full.
- No Codex, no local models, no delegation. Nothing outside the hackathon folder and the public web used as a source.
- Not done in the time and budget: full name scan across all ten files; Salamander, SPICE, Chrome 124 and Chrome 125 Web MIDI claims; copyright-duration claims; consumer-app prices; the "4%" graduate figure.

## Open questions
- Who corrects qa-prep Q13 (the $250,000 vs $628,416 error and the HEPPP line) before Wednesday?
- Is the Flinders teach-out line worth saying, since only raw page data shows it?
- Which cloud wording goes on the slide: "numbers, not sound" or "stays on your phone"?
- Which demo input is final (MIDI cable, on-screen keys, microphone)?
- Remaining checks if time allows: Salamander licence, Chrome 124 and 125 Web MIDI behaviour, Australian copyright duration, "4% of new primary graduates", full name scan.

## Sources
1. https://www.alberts.co/wp-content/uploads/2023/06/Music-Education-ITE-Report_A4_130623.pdf, 2026-11-06, opened (pdftotext)
2. https://opus.lib.uts.edu.au/bitstream/10453/196513/2/1919553.pdf (Henderson et al. 2025 open copy; handle https://opus.lib.uts.edu.au/handle/10453/196513), 2026-11-06, opened
3. https://www.canberra.edu.au/future-students/careers-advisers-and-agents/aspire-uc-schools, 2026-11-06, opened
4. https://www.canberra.edu.au/uc-research/graduate-research/current-research-students/study/research-project-management/integrity-and-ethics/ethics/accordion/human-ethics/human-ethics-documents/Helpful-Information-for-Applicants-V062020.pdf, 2026-11-06, opened
5. https://www.itnews.com.au/news/openai-gets-edge-over-microsoft-copilot-at-la-trobe-622438, 2026-11-06, opened
6. https://www.flinders.edu.au/ai-accelerator, 2026-11-06, opened
7. https://handbook.flinders.edu.au/courses/2026/BCIM (raw page data), http://www.flinders.edu.au/study/creative-arts-media, 2026-11-06, opened
8. https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Offline_and_background_operation, 2026-11-06, opened
9. https://web.dev/learn/pwa/service-workers, 2026-11-06, opened
10. https://digitalinclusionindex.org.au/wp-content/uploads/2025/10/ADII-Report-2025_V6-Remediated.pdf, 2026-11-06, opened (pdftotext)
11. https://policies.canberra.edu.au/document/view-current.php?id=126, 2026-11-06, opened
12. https://www.education.gov.au/heppp/heppp-2014-partnerships-projects, 2026-11-06, opened
13. https://www.education.gov.au/heppp, 2026-11-06, opened
14. https://www.education.gov.au/access-and-participation/outreach-funding-program, 2026-11-06, opened
15. https://app.heims.education.gov.au/HeimsOnline/IPInfo/Determination/Download/6602, 2026-11-06, opened (PDF)
16. https://www.education.gov.au/download/15824/2010-2025-higher-education-participation-and-partnerships-program-heppp-participation-allocations/39373/2010-2024-higher-education-participation-and-partnerships-program-heppp-participation-allocations/xlsx, 2026-11-06, opened
17. https://www.education.gov.au/download/20042/outreach-funding-guidance/44110/document/pdf, 2026-11-06, opened
18. https://www.education.gov.au/rpppp, 2026-11-06, opened
19. https://www.arts.act.gov.au/funding/arts-activities-funding, 2026-11-06, opened
20. https://creative.gov.au/investments-opportunities/national-songwriting-and-recording-schools-stimulus, 2026-11-06, opened
21. https://www.qmta.org.au/tuition, 2026-11-06, opened
22. https://vercel.com/pricing, 2026-11-06, opened
23. https://help.skoove.com/en/articles/5417607-what-is-skoove-premium-and-how-much-does-it-cost, 2026-11-06, opened
24. https://piano-help.hellosimply.com/en/articles/13750836-piano-maestro-subscription-options, 2026-11-06, opened
25. https://us.khanacademy.org/schools/pricing, 2026-11-06, opened
26. https://yousician.com/schools, 2026-11-06, opened
27. https://platform.claude.com/docs/en/about-claude/models/overview, 2026-11-06, opened
28. https://platform.claude.com/docs/en/about-claude/pricing, 2026-11-06, opened
29. https://platform.claude.com/docs/en/build-with-claude/prompt-caching, 2026-11-06, opened (first 100,000 characters)
30. https://platform.claude.com/docs/en/build-with-claude/structured-outputs, 2026-11-06, opened
31. https://platform.claude.com/docs/en/models/sonnet-5-5/overview, 2026-11-06, opened
32. https://registry.npmjs.org/<package>/latest and https://api.github.com/repos/<owner>/<repo> (pitchy, tone, smplr, vexflow, opensheetmusicdisplay, abcjs, html-midi-player, webmidi, pitchfinder, essentia.js, aubiojs, @audio/pitch, meyda, soundfont-player, webaudiofont, @spotify/basic-pitch, ml5), 2026-11-06, opened
33. https://raw.githubusercontent.com/lars76/swift-f0/main/README.md, 2026-11-06, opened
34. https://raw.githubusercontent.com/ml5js/ml5-library/main/LICENSE.md, 2026-11-06, opened
35. https://www.oaic.gov.au/privacy/privacy-registers/privacy-codes/childrens-online-privacy-code, 2026-11-06, opened
36. https://www.oaic.gov.au/privacy/your-privacy-rights/more-privacy-rights/statutory-tort-for-serious-invasions-of-privacy, 2026-11-06, opened
37. https://www.oaic.gov.au/privacy/your-privacy-rights/more-privacy-rights/children-and-young-people, 2026-11-06, opened
38. https://www.oaic.gov.au/privacy/privacy-guidance-for-organisations-and-government-agencies/organisations/small-business, 2026-11-06, opened
39. Web searches (snippet): La Trobe ChatGPT Edu 40,000; Flinders Gemini Enterprise 30,000; Music Australia May 2026 report (nothing found), 2026-11-06, snippet
