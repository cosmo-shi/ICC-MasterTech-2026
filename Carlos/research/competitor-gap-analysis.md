# Competitor Gap Analysis: The Student's Compass

- Date: 5 Nov 2026. Purpose: answer the judges' point that Studiosity, Cogniti and Cognito already do AI tutoring.
- "Cohort" in the first brief was a mishearing; Carlos confirmed the names as Cogniti (USyd) and Cognito (cognito.org).
- Scope: Australian products first, then global platforms; only facts read on the page are recorded.
  o "unverified" = claim seen in a search summary or not stated on any page opened.
  o Codes like [S3] point to the "Sources checked" list at the end.

## What "Cohort" most likely means (resolved: Cogniti and Cognito, see above)

- No AI tutor product called "Cohort", "Cohort.ai" or "Kohort" sold to Australian universities was found.
- Most likely candidates, in order:

| Rank | Candidate | One line | Source |
|---|---|---|---|
| 1 (most likely) | Cogniti (University of Sydney) | Teacher-built AI tutor agents inside the LMS; the best-known Australian university AI tutor | [S12][S13][S14] |
| 2 | Cadmus (Melbourne) | Assessment platform in the LMS, tracks the writing process; vendor claims over half of Australian universities | [S21] |
| 3 | Kortext study+ (UK, Microsoft) | AI study tools on Azure over approved content; joined Instructure Canvas partner program July 2026 | [S22] |

- Ruled out: Cohorte (European AI bootcamp), Cohoort (Tel Aviv, listed inactive), Disco (cohort course platform). [S23][S24]
- Action: ask the judges which product they meant; prepare the Cogniti answer first.

## Table 1: Who does what

| Product | What it is | Who buys and pays | Where data lives | Model source | Assignment-aware | Learning-outcome mapping | Socratic or answer-giving | Student owns data | Sources |
|---|---|---|---|---|---|---|---|---|---|
| Studiosity Writing Feedback Plus | AI feedback on drafts in six areas, minutes, "never rewrites" | University licence; free to students | Vendor cloud; policy says servers may be "hosted outside Australia"; region not named | Not disclosed; "closed system", "trained ethically on university assessments" | Partial: student may upload task PDF, gets "task coverage" | No (not found); Macquarie: "doesn't know your specific task" | Feedback only, neither Socratic nor answer-giving | No: clients receive session content and transcripts | [S1][S2][S3][S4][S5] |
| Studiosity Validate | Authorship check: timed questions generated from the assignment, writing sample | University licence | Vendor cloud; region not named | Not disclosed | Yes: educator sets AI Use Level (AIAS, Aug 2026) per assessment | No (not found); "learning objectives" only guide threshold choice | Question-based check, not tutoring | No: educator dashboard per student | [S6][S7][S8] |
| Studiosity Connect Live | Human specialist live chat: English, maths, science, study skills | University licence; capped sessions (Murdoch 20 a year) | Vendor; audio and transcripts may go to clients | Human | No | No (not found) | Human guidance | No | [S9][S10][S3] |
| Cogniti (USyd) | Teacher builds course AI agents with instructions and resources; embedded in LMS | Institution; Microsoft Marketplace since Jan 2026; price not published | Built on Microsoft Azure; region unverified | Azure; USyd platform used Azure OpenAI GPT-4 Turbo (Cogniti link unverified) | Partial: teacher loads course materials | No (not found) | Teacher-configurable; Socratic possible | No: 2024 article says "teachers have full visibility over conversations" | [S12][S13][S14][S15] |
| UNE Madgwick | AI workspace where students build their own study assistants | University; free to students | Unverified | Model-agnostic, built by Simtheory (Newcastle NSW) | Unverified | No (not found) | Unverified | Unverified | [S16] |
| RMIT Val "Writing Help" | In-house AI persona replacing the Studiosity subscription in 2026 | RMIT, in-house | Unverified | Unverified | Unverified | Unverified | Unverified | Unverified | [S11] |
| Khanmigo | Khan Academy AI tutor and teacher assistant, K-12 focus | Learners USD 4/month; teachers free; districts on request | Unverified | OpenAI GPT-4 (2023 launch coverage) | No: Khan content | No (not found) | Socratic (coverage) | Unverified | [S17][S18] |
| Claude for Education learning mode | Campus-wide Claude with a Socratic learning mode; Canvas LTI | Institution, campus-wide deals | Anthropic cloud; region unverified | Anthropic (own) | No: only what the student pastes | No (not found) | Socratic: "What evidence supports your conclusion?" | Unverified | [S19][S20] |
| ChatGPT Edu and Study Mode | Institutional ChatGPT; Study Mode = Socratic hints, toggle on or off | Institution (UNSW 80,000 users); cost not published | OpenAI; Australia listed for residency at rest (help page, unverified) | OpenAI (own) | No | No (not found) | Socratic in Study Mode, student can switch off | Unverified | [S25][S26][S27] |
| Gemini for Education (LearnLM) | Gemini with LearnLM tuning; Guided Learning mode | Free with Google for Education | Google cloud; region unverified | Google (own) | No | No (not found) | Step-by-step guided (coverage) | Unverified; "not used to train" | [S28][S29] |
| Microsoft Copilot Study and Learn agent | Question-led chat, flashcards, quizzes; ages 13+ | Included in M365 Education A1/A3/A5 | Microsoft cloud; region unverified | Microsoft (model mix unverified) | No | No (not found) | Question-led: "the learner does the thinking" | Unverified | [S30][S31] |
| Turnitin Clarity | Writing space showing instructions, rubric, AI-use level; optional AI assistant | Paid add-on to Feedback Studio from Q3 2025 | Turnitin cloud; region unverified | "Not tied to any specific AI model" (coverage, unverified) | Yes: instructions, rubric, AI level per assignment | No (not found) | Writing aid when enabled | No: educator sees typing, pastes, draft history | [S32][S33] |

## Table 2: Business model gaps

| Product | How it makes money | Customer | Lock-in | What a university cannot do with it | Source |
|---|---|---|---|---|---|
| Studiosity (all modules) | Institution subscription; UK tender totals GBP 260k to 1.2M (unverified) | Institution | Multi-year contracts; feedback history stays on vendor platform | Cannot host it, see the model, or map feedback to unit outcomes | [S3][S34] |
| Cogniti | Marketplace listing; pricing not disclosed | Institution | Azure-based platform; agents built inside Cogniti | Self-hosting and open source not stated; price unknown | [S13][S14] |
| UNE Madgwick | Built by a startup for UNE; terms unverified | Institution | Unverified | Unverified | [S16] |
| RMIT Val | In-house | RMIT | Low, owned by RMIT | Shows universities are leaving Studiosity to own the tool | [S11] |
| Khanmigo | Per-learner and district licences | Families, districts | Khan content library | University use not found; K-12 focus | [S18] |
| Claude for Education | Campus-wide licences | Institution | Anthropic models only | Cannot run on campus or swap models | [S19] |
| ChatGPT Edu | Per-seat licences; UNSW declined to share cost | Institution | OpenAI models and workspace | Cannot run on campus; Study Mode can be switched off | [S25][S26] |
| Gemini for Education | Free tier to grow Google Workspace; paid AI Pro add-on | Institution | Google Workspace ecosystem | Cannot run on campus; general tutor, not unit-aware | [S28] |
| Copilot Study and Learn | Bundled in M365 Education; Copilot academic USD 18/user/month (search, unverified) | Institution | Microsoft 365 tenancy | Cannot map to unit outcomes; general study agent | [S30][S31] |
| Turnitin Clarity | Paid add-on to existing Turnitin licence | Institution | Requires Feedback Studio | Cannot use without Turnitin; integrity first, learning second | [S32] |

- Pattern: every product is sold to the institution, and the student is the user, not the customer.
  o Data flows toward the institution or vendor dashboard, not toward the student's own record.

## Table 3: Infrastructure gaps

| Product | Hosting | Data residency | On-campus or local models | Integration points | Privacy posture | Source |
|---|---|---|---|---|---|---|
| Studiosity | Vendor SaaS | Not named; may be "hosted outside Australia"; UK notice cites Australia and US (unverified) | No | LTI 1.3: Canvas, Moodle, Blackboard Ultra, Brightspace | No LLM training on student content; GDPR aligned, SOC 2 practices | [S1][S3][S4] |
| Cogniti | Microsoft Azure | Institution-selected Azure region (trade press, unverified) | No local option stated | LMS embed, no separate student account | "Conversations remain confidential", no commercial training (stated aim) | [S13][S14][S15] |
| UNE Madgwick | Unverified | Unverified | Model-agnostic; MCP connectors to university systems | University systems via MCP | Contrasted with commercial AI training on student data | [S16] |
| Khanmigo | Vendor SaaS | Unverified | No | Unverified | Parents can view children's history | [S18] |
| Claude for Education | Anthropic cloud | Unverified | No | Canvas LTI (help article 16 Mar 2026); Panopto, Wiley | "Enterprise-grade" controls; training terms not on page | [S19][S20] |
| ChatGPT Edu | OpenAI cloud | Australia at rest listed; inference residency separate (unverified) | No | SSO and admin controls (unverified) | Edu prompts not used for training (coverage) | [S25][S27] |
| Gemini for Education | Google cloud | Unverified | No | Google Workspace; Workspace LTI (link only) | Not human-reviewed or used to train; admin retention rules | [S28] |
| Copilot Study and Learn | Microsoft 365 cloud | Unverified | No | M365 Education tenancy; admin age-gating | Page gives little data detail | [S30] |
| Turnitin Clarity | Turnitin cloud | Unverified | No | Feedback Studio, LMS via Turnitin | Records typing patterns, pastes, time spent for educators | [S32] |

- Pattern: none of the verified products offers an on-campus or local-model deployment.
  o Closest exception: UNE Madgwick is model-agnostic; hosting not confirmed.

## The gap we can own

- Learning-outcome mapping is missing everywhere checked.
  o Studiosity checks writing quality; no product page maps work to unit learning outcomes.
  o Compass maps weekly checks to the unit outline, which is what OBE asks for.
- A private "stuck map" owned by the student does not exist in any product found.
  o Studiosity sends session content to clients; Cogniti teachers see full conversations; Clarity records typing.
  o Compass shows the student first; staff see only an anonymous cohort heatmap.
- Assignment rules as guidance, not surveillance.
  o Studiosity Validate and Turnitin Clarity set an AI level, then check compliance.
  o Compass turns the brief and rubric into a "how you may use AI here" card for learning.
- University-hosted or local models, on campus compute.
  o Every verified incumbent runs in a vendor cloud; Studiosity may host outside Australia.
  o Compass can run local models inside the university network, keeping data on campus.
- No vendor lock-in, model-agnostic, open architecture.
  o Universities are already leaving vendors: RMIT replaced Studiosity with its own Val persona in 2026.
  o Compass is a framework a university owns, not a per-seat subscription.
- One journey across a unit, not one-off draft checks.
  o Studiosity reviews a single draft; general tutors forget the unit between chats.
  o Compass keeps the student's own learning-journey record; markers see it only on opt-in.
- Fits campus identity and network: Duo sign-in, Webex nudges, secure access, on-campus compute.
  o Incumbents integrate with the LMS only; Compass builds on the campus identity layer.

### Where the incumbents are clearly stronger

- Human tutors: Studiosity Connect Live offers human specialists in English, maths, science, study skills.
- Scale and evidence: Studiosity cites 20+ years, 29 partners, 8.8-point retention uplift (Nous 2026).
- Adoption and integration: Cogniti is on Microsoft Marketplace; Gemini and Copilot come free with suites.
- Concept overlap is real: Validate and Clarity already set an AI-use level per assignment.
  o Our claim must be the student-owned outcome map, not the AI card alone.

## Cognito (cognito.org), added 5 Nov after the judges' names were confirmed
- What it is: free revision platform for KS3, GCSE, A-level, IB and AP students in "over 100 countries".
  o Video lessons, revision notes, "1.5m+ quiz questions", flashcards, exam-style questions with "AI marking".
  o Claims "students improve by 2 grades" on average; self-reported, unverified.
- Who pays: page says "it's FREE"; no paid tiers shown; business model not stated (unverified).
- Data: privacy policy linked; hosting location and student data ownership not stated.
- Gap for Compass:
  o Secondary exam boards, not university units; no assignment, brief or rubric awareness.
  o Checks map to exam-board syllabus topics, not to a unit's learning outcomes set by a coordinator.
  o Generic quizzes for everyone; Compass checks are generated per assignment and feed a private stuck map.
  o No Socratic guide described; its AI marks answers, it does not guide the work.
  o Credit where due: AI marking of short answers at scale is proven here; our weekly check grader is the same idea.
- Source: https://cognito.org/ read 5 Nov 2026.

## One-line answers for the judges

- "Studiosity checks a draft for the university; Compass maps a student's progress against the unit's learning outcomes."
- "In Studiosity and Cogniti the institution sees the student's work; in Compass the student owns the stuck map, staff see only anonymous trends."
- "Cognito proves AI-marked quizzes lift grades at school level; Compass brings that to a university unit, mapped to its learning outcomes."
- "Studiosity is a vendor-cloud subscription; Compass runs on the university's own network and models, like RMIT and UNE now want."

## Sources checked

- All dates are 5 Nov 2026. "Read" = page opened; "search only" = seen in a search summary, page not opened or blocked.

| Code | URL | Status |
|---|---|---|
| S1 | https://studiosity.com/connect/policy_agreements/privacy | Read (page showed a load-error banner) |
| S2 | https://students.mq.edu.au/support/study/writing/studiosity | Read |
| S3 | https://www.studiosity.com/ | Read |
| S4 | https://www.ucl.ac.uk/study/current-students/academic-support-and-skills/academic-skills/studiosity | Search only (403) |
| S5 | https://support.studiosity.com/en/articles/14012571-upload-your-task-requirements-to-get-more-detailed-feedback | Read |
| S6 | https://www.studiosity.com/blog/aias | Read |
| S7 | https://support.studiosity.com/en/articles/15593797-educators-what-is-validate-and-how-does-it-work | Read |
| S8 | https://www.studiosity.com/validate-students | Read |
| S9 | https://support.studiosity.com/en/articles/8710502-how-can-i-talk-to-a-human-for-study-help | Read |
| S10 | https://www.murdoch.edu.au/mymurdoch/support-advice/learning-study/learning-support/studiosity | Read |
| S11 | https://www.rmit.edu.au/students/support-services/study-support/studiosity | Read |
| S12 | https://cogniti.ai/ | Read |
| S13 | https://news.microsoft.com/source/asia/2026/06/16/usyd-takes-cogniti-global/ | Read |
| S14 | https://www.sydney.edu.au/news-opinion/news/2026/06/15/ai-education-platform-cogniti-goes-global-on-microsoft-marketplace.html | Read |
| S15 | https://news.microsoft.com/en-au/features/teaching-and-learning-in-the-ai-era-how-the-university-of-sydney-is-empowering-staff-and-students-with-ai-across-the-institution/ | Read (dated 17 Jun 2024) |
| S16 | https://www.itnews.com.au/news/university-of-new-england-to-give-every-student-access-to-ai-620763 | Read |
| S17 | https://www.techlearning.com/news/what-is-khanmigo-the-gpt-4-learning-tool-explained-by-sal-khan | Search only |
| S18 | https://khanmigo.ai/pricing | Read |
| S19 | https://www.anthropic.com/news/introducing-claude-for-education | Read |
| S20 | https://support.claude.com/en/articles/11725453-set-up-the-claude-lti-in-canvas-by-instructure | Search only |
| S21 | https://cadmus.io/news/cadmus-secures-backing-to-safeguard-university-learning-in-the-age-of-ai | Search only |
| S22 | https://kortext.com/blog/news/kortext-iq-ai-assistant-higher-education/ | Search only |
| S23 | https://teams-cohorte.pages.dev/case-studies/opit | Search only |
| S24 | https://www.startuphub.ai/startups/cohoort.md | Search only |
| S25 | https://www.itnews.com.au/news/unsw-to-offer-chatgpt-edu-to-10000-staff-620351 | Search only |
| S26 | https://www.unsw.edu.au/newsroom/news/2026/09/unsw-partners-with-openai-to-support-the-first-generation-of-ai- | Read |
| S27 | https://help.openai.com/en/articles/9903489-data-residency-for-chatgpt | Search only (403) |
| S28 | https://edu.google.com/intl/ALL_us/gemini-built-for-education-higher-ed/ | Read |
| S29 | https://www.engadget.com/ai/geminis-new-guided-learning-mode-can-quiz-students-and-create-interactive-study-aids-181743349.html | Search only |
| S30 | https://support.microsoft.com/en-us/education/copilot/study-learn-agent | Read |
| S31 | https://www.neowin.net/amp/microsoft-brings-365-copilot-to-schools-for-18month-adds-new-ai-teaching-tools/ | Search only |
| S32 | https://www.turnitin.co.uk/press/turnitin-launches-turnitin-clarity-bringing-transparency-and-integrity-insights-to-education | Read |
| S33 | https://thejournal.com/Articles/2025/03/04/New-Turnitin-Product-Offers-AI-Powered-Writing-Tools-with-Instructor-Guardrails.aspx | Search only |
| S34 | https://www.contractsfinder.service.gov.uk/Notice/580bd516-cc86-4bc6-90d4-c305d7ecdaec | Search only (403) |
| S35 | https://www.itnews.com.au/news/university-of-sydney-creates-own-genaicogniti-608334 | Read (28 May 2024) |
| S36 | https://www.adelaide.edu.au/student/academic-skills/studiosity | Read |
| S37 | https://openai.com/index/chatgpt-study-mode/ | Blocked (403); Study Mode facts from coverage, unverified |
| S38 | https://www.deakin.edu.au/students/study-support1/study-resources/artificial-intelligence/approved-genai-tools-for-learning | Search only (403) |

- Australian universities seen using Studiosity:
  o Verified on page: Macquarie, Murdoch, Adelaide (draft feedback in about two minutes).
  o Search only: Deakin (Studiosity+, plus its own "Deakin GEM"), JCU, UNE, Swinburne, Newcastle.
  o Dropped: RMIT removed Studiosity in late 2025, replaced by Val "Writing Help" in 2026.
