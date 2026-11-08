# Model slot options v0: which model runs the "typed goal to steps" and "cue to plain words" steps, and what each costs

- Date: Sat 7 Nov 2026 (AEDT), overnight draft.
- Purpose: cost the one stack layer no file has costed, before Monday's lock-in; give the team the honest Q and A line.
- Scope: the two model steps only (goal to steps; cue to plain words). Rules, scoring and pitch tracking are not model steps. Pricing pages opened 2026-11-06 or 2026-11-07.
- Status: overnight draft for the team; verify before the pitch. Nothing was run; every cost is arithmetic on printed prices and a stated usage assumption.

## 1. Bottom line

- Wednesday (stage): rules run live; the model plan is one real hosted call made Saturday or Monday, saved, shown as "Previously generated hosted-model example, recorded [actual date]; replayed offline. Live scoring and feedback use rules." (label changed 7 Nov, see below).
  o This is build-plan-v1 T26 and ai-visibility-note-v0 as written; no live model call on stage, no wifi dependency.
  o Show: the saved plan and a receipt slide (date, model name, JSON sent, JSON returned) for Q and A.
  o Claim: "a language model made this plan; this is its saved answer". Never claim: live AI, "AI-powered" cue, any on-device model.
- Pilot: a hosted model through our own proxy, hybrid: plans on a mid model, cue rewrites on a small model, rules as the always-on fallback.
  o Cloud coach off by default and off under 15 (privacy-design-v1 switch B); the typed goal is the only learner text sent.
  o Cost for 1,000 learners a month at the stated assumption: about US$48 hybrid (section 3). At 50 learners: about US$2.40.
  o Prefer the sponsor university's own licensed endpoint if it offers an in-country one (see the fact below); else our proxy with US-only inference.
- Q and A line (32 words, changed 7 Nov after the hostile review): "A hosted language model made the plan you saw; the receipt shows the date and model. For a pilot, the typed goal and instrument go overseas, never audio, and learners consent first."
  o Old words (37) said "through our own proxy" and "only the typed goal goes"; dropped: the saved call may not have gone through our proxy, and instrument and phrase ids also travel.
  o Say the model name from the receipt slide if asked "which model": placeholder [model name].
  o Label and stage line, old and new: old label "Example output, recorded [date]"; new label "Previously generated hosted-model example, recorded [actual date]; replayed offline. Live scoring and feedback use rules."
  o New stage line: "This dated plan came from the model call on the receipt; the phrase you just heard was scored locally by rules."
- The one fact that would change the answer: whether a sponsor university lets learner goal text leave Australia, or offers an in-country model.
  o If it says no and offers nothing, the pilot model slot becomes rules-only templates (cost US$0) until a campus model exists.
  o The second fact: the T26 10-case test. If the rules template alone passes 9 of 10 cases, the model step adds cost and an APP 8 disclosure for little gain.

## 2. The options table

- Prices are USD per million tokens (MTok), as printed on the official page, on the date shown. "Unverified" means not read on an official page.
- Usage assumption for all rows: 80 calls per learner a month (20 goal plans, 60 cue rewrites), 300 tokens in and 150 out per call (section 3).

| Option | Price as printed (input / output per MTok) | Cost per 1,000 learners a month | Privacy (provider page) | Offline | Latency | Build hours | Licence | Stage risk | Honesty label |
|---|---|---|---|---|---|---|---|---|---|
| 1a Hosted, Anthropic, small model (Haiku 5.5, prompts up to 100k) | $0.10 / $0.50 [1] | $8.40 | API content "not retained by default" except Covered Models (Haiku 5.5 is not one on the page read); retained data not used for training without permission; ZDR by agreement; inference `us` or `global` only, no Australian region [2][3] | No (needs a connection; rules fallback) | Docs rank it "Fastest"; no millisecond figure [4]; target under 2.5 s is unverified | 2.5 for the goal-split proxy already in build-plan-v1 T26; the rewrite adds about 1 | Commercial API terms (unverified, not read) | Low if saved; wifi if live | new label (section 1) |
| 1b Hosted, Anthropic, mid model (Sonnet 5.5) | $2.00 / $10.00 [1] | $168.00 | Same page as 1a [2][3] | No | Docs rank it "Fast" [4]; no figure | Same as 1a | Same | Low if saved | Same |
| 1c Hosted, OpenAI, small (gpt-6-luna, standard tier) | $0.10 / $0.50 [5] | $8.40 | API data not used for training by default; abuse logs up to 30 days; ZDR needs approval; Australia is listed for regional storage only, not processing, and needs modified abuse monitoring or ZDR [6] | No | No figure read | Same as 1a (OpenAI-compatible contract in web-app-architecture) | Commercial API terms (unverified) | Low if saved | Same |
| 1d Hosted, OpenAI, mid (gpt-5.6-terra, standard) | $2.00 / $12.00 [5] | $192.00 | Same page as 1c [6] | No | No figure read | Same | Same | Low if saved | Same |
| 1e Hosted, Google, small (gemini-3.5-flash-lite, paid tier) | $0.30 / $2.50 (output includes thinking tokens) [7] | $37.20 before thinking tokens | Paid services: prompts and responses not used to improve products; logged "for a limited period" for abuse (period not stated); free tier IS used to improve products; no Australia residency commitment stated [7][8] | No | No figure read | Same as 1a | Commercial API terms (unverified) | Low if saved; never use the free tier for learner text | Same |
| 1f Hosted, Google, mid (gemini-3.8-flash, paid) | $0.75 / $3.75 to 31 Dec 2026, then $1.50 / $7.50 [7] | $63.00 to 31 Dec; $126.00 from 1 Jan 2027 | Same as 1e [7][8] | No | No figure read | Same | Same | Low if saved | Same |
| 2 In-browser model (WebLLM on WebGPU; Transformers.js on WASM or WebGPU) | Free per call; the device pays in download and battery | $0 token cost; bandwidth: about 278 to 712 MB one-time per device for a 0.5B to 1B model (third-party listings, snippet) [9][10][11] | Nothing leaves the device; no APP 8 disclosure for the goal | Yes after the weights are cached | Desktop GPU: about 96 tokens per second for a 1B model in one report (snippet, unverified); phones: one report found no run completed [11] | 12 to 20 (unverified estimate: model choice, caching, schema checks, fallback; none in build-plan-v1) | WebLLM and Transformers.js licences not read here; model licences differ per model (unverified) | High: a download on the stage laptop and an untested model; small models break schema-locked JSON (unverified) | "Runs on this device" only if it really does |
| 3 Browser built-in model (Chrome Prompt API, Gemini Nano) | Free; no data sent to Google or third parties when used [12] | $0 | Stays on the device per the Chrome page [12] | Yes, once the model is downloaded | Not stated | 3 to 6 (unverified estimate) plus a fallback | Chrome feature; terms not read | Very high for Android: "Chrome for Android, iOS ... not yet supported" [12]; desktop needs 22 GB free, more than 4 GB VRAM, 16 GB RAM, 4 cores [12]. Stage laptop may qualify; the cheap phone never does | "On-device, desktop Chrome only" |
| 4 Rules-only templates, plus the saved labelled answer for the stage | None | $0 | Nothing leaves the device | Yes | Instant | 0 extra: it is the engine Must (small-goals-engine-spec-v1 s4) | Own code | Lowest | Template: "the coach splits your goal into small steps"; saved model answer: new label (section 1) (build-plan-v1 s267) |
| 5 Conference vendor's own AI products | Not priced | Not costed | Not read | Not read | Not read | Not estimated | Not read | n/a | n/a |

### 2b. Companion table: the stage question, the honest answer, the verdict

- Source: GPT-6 Sol hostile review, 7 Nov (own-knowledge critic; its statements are not sources). Verdicts apply to claims about Wednesday's demo.
- "Do not claim" rows say what the team may say instead.

| Option | Stage question | Honest answer | Verdict | May say instead |
|---|---|---|---|---|
| 1a Anthropic small | "Is Haiku producing this cue now?" | "No. Rules produce the live cue; a dated model response illustrates a plan step, if we have the receipt." | Risky | "Rules chose the cue; the model wording is a saved example." |
| 1b Anthropic mid | "What did Sonnet actually do?" | "It produced the saved plan shown. It did not score this retake." | Risky | Show the receipt (date, model, request, response, usage). |
| 1c OpenAI small | "Can you prove this model made this output?" | "Only with the dated request, response, model id and usage record." | Risky | Claim only what the receipt proves. |
| 1d OpenAI mid | "Why pay for the mid model?" | "We have not shown it beats rules or the small model; we would test first." | Risky | "Priced, not chosen; the 10-case test decides." |
| 1e Google small | "Are thinking tokens in your estimate?" | "No: it assumes 150 billed output tokens; measure real usage." | Risky | Say the cost is an estimate on a stated floor. |
| 1f Google mid | "Does this price survive January?" | "No: the page's own January price doubles." | Risky | Quote both prices with dates. |
| 2 In-browser | "Show it running offline here." | "We cannot; not built or tested on this laptop or a cheap phone." | Do not claim | "We costed it and did not build it; rules run offline." |
| 3 Chrome built-in | "Does it work on the learner's phone?" | "Not shown; Chrome's page says Android is unsupported [12]." | Do not claim | "Desktop Chrome only today; our offline path is rules." |
| 4 Rules plus saved answer | "Where is the AI in this retake?" | "None. Rules score it; the labelled plan is a saved hosted-model example." | Safe | Use as is. |
| 5 Vendor products | "Which product is integrated?" | "None; no integration or tested fit." | Do not claim | "No vendor AI product is part of the build." |
| Hybrid (pilot design) | "Is your two-model proxy working?" | "No. It is a pilot design; Wednesday uses rules plus one saved call." | Risky | "A pilot design, costed, not built." |

- Option 5: cisco-fit-note-v1 names no honest fit; it lists AI Defense as not added because it needs a hosted service the team does not have (line 98). Not costed.
  o Cisco's own pages define agentic AI as autonomous (ai-visibility-note-v0 [1]); do not use them as a model slot or as a claim.
- Option 2 and 3 build hours are unverified estimates, not from any team file. Treat as order of magnitude only.

## 3. The cost arithmetic

- Assumption per learner a month: 20 goal plans plus 60 cue rewrites = 80 calls; each 300 tokens in, 150 out.
  o Per learner: 80 x 300 = 24,000 in; 80 x 150 = 12,000 out.
  o Per 1,000 learners: 24 MTok in, 12 MTok out.
  o The 300-token input is the brief's figure. tech-feedback-layer s6 uses a larger prompt (about 1,000-token system prompt plus 700 user tokens, 400 out), and 2,000 in and 600 out for a goal split; this table is a floor, the sensitivity row shows a heavier prompt.

| Option | Input arithmetic | Output arithmetic | Monthly per 1,000 learners |
|---|---|---|---|
| 1a Haiku 5.5 | 24 x $0.10 = $2.40 | 12 x $0.50 = $6.00 | $8.40 |
| 1a with US-only inference (1.1x, printed) [1][3] | | | $9.24 |
| 1b Sonnet 5.5 | 24 x $2.00 = $48.00 | 12 x $10.00 = $120.00 | $168.00 |
| 1b with US-only inference (1.1x) | | | $184.80 |
| Hybrid (recommended): 20 plans on Sonnet, 60 rewrites on Haiku | Plans on Sonnet (per 1,000 learners: 6 MTok in, 3 MTok out): 6 x $2.00 = $12.00 | Plans: 3 x $10.00 = $30.00, so $42.00. Rewrites on Haiku (18 MTok in, 9 MTok out): 18 x $0.10 = $1.80 and 9 x $0.50 = $4.50, so $6.30 | $48.30 |
| 1c gpt-6-luna | 24 x $0.10 = $2.40 | 12 x $0.50 = $6.00 | $8.40 |
| 1d gpt-5.6-terra | 24 x $2.00 = $48.00 | 12 x $12.00 = $144.00 | $192.00 |
| 1e Gemini 3.5 Flash-Lite | 24 x $0.30 = $7.20 | 12 x $2.50 = $30.00 | $37.20 (thinking tokens would add) |
| 1f Gemini 3.8 Flash, to 31 Dec 2026 | 24 x $0.75 = $18.00 | 12 x $3.75 = $45.00 | $63.00 |
| 1f from 1 Jan 2027 | 24 x $1.50 = $36.00 | 12 x $7.50 = $90.00 | $126.00 |
| 2 In-browser, 3 Chrome built-in, 4 rules | none | none | $0 |
| Sensitivity: Haiku 5.5 with a 1,000-token system prompt uncached (1,300 in) | 104 x $0.10 = $10.40 | 12 x $0.50 = $6.00 | $16.40 |
| Sensitivity: Sonnet 5.5 with the same | 104 x $2.00 = $208.00 | 12 x $10.00 = $120.00 | $328.00 |

- Critic recomputation, 7 Nov (own-knowledge critic, same inputs: 1,000 learners, 20 plans and 60 rewrites, 300 in, 150 out, my printed prices): it agrees with every row; no input differs.
  o Agreed: hybrid $48.30 ($42.00 plans plus $6.30 rewrites); 50 learners $2.415, shown as $2.42; Haiku $8.40; Sonnet $168; terra $192; Flash-Lite $37.20; Flash $63 then $126.
  o New figure, my arithmetic: hybrid with US-only inference, 1.1 x $48.30 = $53.13 (1.1x printed on [1][3] for Anthropic; applied to both models, unverified for Haiku 5.5's lower tier but the page says the multiplier applies).
  o Re-verify on pitch day: prices and the multiplier, retention terms and the account settings, processing versus storage region, and the account's own rate limits (the arithmetic establishes none).
- Pilot scale (the same arithmetic, linear): 50 learners is 5 percent of 1,000; 150 learners is 15 percent.

| Option | 50 learners a month | 150 learners a month |
|---|---|---|
| 1a Haiku 5.5 | $0.42 | $1.26 |
| Hybrid (recommended) | $2.42 | $7.25 |
| 1b Sonnet 5.5 | $8.40 | $25.20 |
| 1d gpt-5.6-terra | $9.60 | $28.80 |

- Existing lines in business-case-v1 (quoted, not recomputed): LLM, routed, 36 sessions x US$0.043 per learner = US$1.548; US$77.4 / 0.69 = A$112 for 50 learners; US$232.2 / 0.69 = A$337 for 150 learners.
  o Different usage assumption (sessions, not calls); the two are not reconciled here. Both are tiny against the pilot all-in of A$25,000 to A$50,000 in the same file.
  o Cost is not the deciding factor between providers; privacy and the stage claim are.
- Prices can change; Gemini 3.8 Flash's price doubles on 1 Jan 2027 per its page [7]. Anthropic's page says Sonnet 5's earlier-scheduled rise to $3 / $15 on 1 Sep 2026 will not occur [1].

## 4. Privacy and honesty consequences per option

- Basis: privacy-design-v1 s5 (LLM call row), APP 8 (enforceable contract plus monitoring, or the consent exception with the specific APP 8 warning), switch B consent.

| Option | Data leaves the device | Leaves Australia | Retained by provider | Used for training | Consent line needed | Stage label |
|---|---|---|---|---|---|---|
| 1 Hosted Anthropic | Typed goal (names and places stripped), instrument, phrase ids; never audio | Yes: `us` or `global` only [3] | Not by default, except Covered Models (30 days); abuse logs unknown; ZDR by agreement [2] | Not without permission [2] | Switch B text plus APP 8 route: enforceable contract and monitoring, or consent after the warning that APP 8 will not apply | new label (section 1) |
| 1 Hosted OpenAI | Same payload | Probably yes; Australia is regional storage, not processing, with conditions [6] | Abuse logs up to 30 days; ZDR needs approval [6] | No by default [6] | Same | Same |
| 1 Hosted Google, paid tier | Same payload | Yes likely: no residency commitment stated; may be cached in any country [8] | Limited period for abuse, length not stated [8] | No on paid; YES on free tier [7][8] | Same; never use the free tier | Same |
| 2 In-browser | No | No | No | No | None for the goal; a download notice for the weights | "Runs on this device" |
| 3 Chrome built-in | No | No | No | No | None; Chrome downloads the model once | "On-device, desktop Chrome" |
| 4 Rules and saved answer | No | No | No | No | None; the saved answer was our own call, made with team-written text only | the new section 1 label for the saved plan; "the coach splits your goal" for the template |

- Honesty: the saved plan must come from a real call with the same schema, and the receipt must show it; a made-up plan shown as saved would break C4.
  o Saved-plan input text on stage must be invented demo text, never a real learner goal.
- This does not contradict privacy-design-v1; it adds that OpenAI lists Australia for stored data only, so "no Australian region" is true for Anthropic and not a claim to make about every provider.

## 5. What the stage build needs for each option

| Option | Hours | Dependencies | Saved-answer file and label | Fallback when the model is unavailable |
|---|---|---|---|---|
| 1 Hosted (T26) | 2.5 total, split Saturday 1.5 and Monday by 14:00 (build-plan-v1) | One serverless function holding the key; schema check; name and place stripping | `data/cached-splits.json`, keyed by hash of the demo goal plus phrase id; each entry stores date, model name, request JSON, response JSON; screen tag new label (section 1) | Rules template plan, tag "the coach splits your goal into small steps"; Wi-Fi off gives it with no wait |
| 2 In-browser | 12 to 20 (unverified) | Weights cached before the stage, WebGPU on the laptop | Same file; plus "runs on this device" only if run live on stage | Rules template |
| 3 Chrome built-in | 3 to 6 (unverified) | Desktop Chrome that meets the page's requirements; one model download | Same file | Rules template; hide the feature if `availability()` is not ready |
| 4 Rules only | 0 extra | Engine Must | None needed | None needed |

- The saved-answer format and labels follow ai-visibility-note-v0 s1 and s3 and build-plan-v1 (one saved plan, plus a receipt slide); this note adds the four stored fields (date, model, request, response).
### 5b. Own proxy: the pilot minimum (hours are my estimates, unverified; no team file estimates them)

| Item | Minimum | Hours (estimate) |
|---|---|---|
| Keys | Server-held, rotatable; never in the browser | 1 |
| Access | Authenticated requests; per-learner rate limit | 2 |
| Validation | Request size cap; output schema check; timeout and rate-error handling; rules fallback | 3 |
| Logging | Metadata only (time, tokens, status, no goal text); access controlled | 2 |
| Retention | Documented deletion period for logs (privacy-design-v1: 14 days proposed) | 1 |
| Kill switch | Cloud-off flag; app falls back to rules at once | 1 |
| Cost cap | Provider spending limit plus usage alerts | 1 |
| Total | | about 11 |

- Cut for a first pilot: two-model routing, per-take cue rewrites, reviewer summaries, and any claim of automated name stripping.
  o Start with one optional goal-plan call; test whether it beats the rules plan before adding more.
  o A stripped goal can still identify a learner; the university settles the overseas disclosure route (APP 8 guidance, OAIC chapter 8, 2026-11-07, snippet via critic, unverified).
- Do not run per-take cue rewrites before Wednesday: build-plan-v1 says not built; one saved example only.

## 6. The spoken answers

| Question | Answer | Words |
|---|---|---|
| Which model, and where does the data go? | "A hosted language model made the plan you saw; the receipt shows the date and model. For a pilot, the typed goal and instrument go overseas, never audio, and learners consent first." | 32 |
| Why not run the model live? | "The stage cue comes from rules, so a live model call there would be for show. A live plan call needs wifi and sends the typed goal overseas. We show the saved, dated, labelled answer." | 35 |
| Could this run offline on a cheap phone? | "Partly. Scoring and rule cues are designed to run offline on a cheap phone; we test that Monday. The model plan needs a connection; offline you get the rules template. We found no language model that runs on a A$150 Android." | 41 |

- Third answer is honest: Chrome's built-in model is not supported on Android [12]; one report found in-browser models did not complete on phones [11], snippet only. Say "we found none", not "none exists".

## 7. Proposed rows (propose only; no existing file edited)

- sunday-decisions-sheet.md, next free A number:

| ID | Decision | Options | Lean | Cost of wrong |
|---|---|---|---|---|
| A (next free) | Pilot model slot | (a) hosted small and mid model through our proxy, hybrid; (b) rules only; (c) in-browser or Chrome built-in | (a) with (b) as the fallback and the default under 15 | Choosing (c) risks a download and an untested model on stage and fails on a A$135 to A$180 phone; choosing (a) without consent wording breaks APP 8 |

- questions-for-sponsor.md, next free number (46 if no one else adds one):

| # | Question | Status | Note |
|---|---|---|---|
| 46 | University outreach or IT: may a pilot send a learner's typed practice goal (no audio, no name) to an overseas model provider, or does the university offer its own in-country licensed model endpoint to point the app at? | open | Added overnight 6 to 7 Nov; decides the pilot model slot (model-slot-options-v0.md) |

## Method

- Codex calls: 1 attempted (gpt-6-sol, medium, option landscape). Result: usage limit error ("try again at Nov 7th 12:40 AM"); nothing kept. Critique call 2 (gpt-6-sol, high, sections 2 to 4, vendors replaced by roles, run 00:46): exit 0. A third review (hostile technical review, run by the coordinator) is folded in under its own heading below.
  o Kept (as notes, not table edits): (1) the hybrid is the recommended pilot but has no own row in section 2: its stage risk, offline and label equal rows 1a and 1b, privacy equals row 1 Anthropic, hours equal 1a; (2) a saved answer shows a real call happened, not that the app can answer a new goal offline: on stage show the rules plan on a new typed goal beside the saved model plan; (3) stripping names and places does not guarantee a goal stops being personal information, and "contract settles APP 8" is too strong: the route (contract plus monitoring, or consent with the specific warning) must be chosen and documented in the notice, and whether the team is an APP entity is open; (4) the sensitivity rows are a floor: tech-feedback-layer prices a 1,700-in, 400-out call and a 2,000-in, 600-out goal split, which this note does not re-price, so "cost is not the deciding factor" rests on the business-case lines only; measure real token counts Saturday; (5) "nothing leaves the device" for options 2 and 3 excludes the weights download and any telemetry; Chrome may remove the model below 10 GB free; options 2 and 3 on a phone need a device trial; (6) an added choice worth costing: rules-only for learners with an optional hosted call when connected, and a precomputed library of plans for common goals (both US$0 per call).
  o Rejected: none. The critique found no multiplication or pilot-scaling error in sections 3.
- Pages opened: Anthropic pricing, data residency, API and data retention; OpenAI pricing and your-data guide; Google Gemini pricing and terms; Chrome Prompt API; WebLLM docs; Transformers.js docs.
- Pages not opened: Cisco AI products page; WebLLM config file with VRAM figures (search snippet used); Google regional availability list; the commercial terms of any provider.
- Team files read: web-app-architecture, tech-feedback-layer (s1, s4, s6), ai-visibility-note-v0, privacy-design-v1 (LLM rows), build-plan-v1 (T26 lines), business-case-v1 (cost lines), cisco-fit-note-v1 (grep), accessibility-design-v1 (grep), objections s1 (grep), feedback-ledger-v1 (F72, F120, F149), sunday-decisions-sheet and questions-for-sponsor (tails).

### Codex hostile review, 7 Nov

- Call 3 (gpt-6-sol, high, run by the coordinator, answer read in full): no quota error.
  o Kept: verdict columns (2b); the label and stage-line change; the Q and A rewrite (proxy claim and "only the typed goal" dropped); the proxy minimum table (5b); the US-only hybrid figure; the three verification tasks.
  o Kept as advice: for the pilot, start with one optional goal-plan call and test it against rules; show a fresh goal getting a rules plan beside the saved model example; a prerecorded answer chosen by input match must say "saved answer selected".
  o Rejected: none as dishonest. The recommendation (rules live, one saved and labelled hosted call) stands; the review says it is safe when the receipt is genuine.
  o Not taken as fact: the critic's price and retention statements; only my opened pages [1] to [12] carry sources. Its own links (OpenAI model page, rate limits, Google pricing "hl=en", OAIC chapter 8) were not opened by me.
- The hybrid pilot design is "Risky" in the review and is labelled a pilot design, not a built system, in every spoken line.

## Open questions

- Does any sponsor university allow learner goal text overseas, or offer an in-country model endpoint? (row 46 above)
- Which provider holds the schema-locked JSON best on the T26 10-case test? Run the same cases on one small and one mid model, record hold rate, cost and time.
- Real latency for goal plans and rewrites: no provider page states milliseconds; measure 20 calls each on Saturday.
- Which commercial terms apply to the proxy key: retention of abuse logs, ZDR request, subprocessors (privacy-design-v1 open item).
- Gemini 3.5 Flash-Lite thinking tokens: do they raise the output count above the 150 assumed?
- Verification task 1, role: Carlos (model lead). Make the evidence real: run the hosted call on invented demo text; save dated request, model id, response, usage.
  o Settled when: the replay works with Wi-Fi off and every screen label matches section 1.
- Verification task 2, role: Carlos with the infra lead. Verify cost and capacity on pitch day: re-open the chosen provider's pricing, retention and region pages and the account's rate-limit page.
  o Settled when: representative prompts give recorded billed tokens, latency and schema failures, and the cost table is re-run on those.
- Verification task 3, role: the sponsor university's outreach team (via Frank). Decide the pilot boundary: written answer on overseas processing of learner goals or its own licensed endpoint (row 46).
  o Settled when: the notice and consent route are checked against OAIC APP 8 guidance and the answer is filed.
- Are in-browser and Chrome built-in options worth any hours before Wednesday? This note says no; the unverified hour estimates should be replaced by a test if the team disagrees.

## Sources

1. https://platform.claude.com/docs/en/about-claude/pricing, 2026-11-07, opened. Haiku 5.5 up to 100k $0.10 / $0.50; Sonnet 5.5 $2 / $10; US-only inference 1.1x.
2. https://platform.claude.com/docs/en/manage-claude/api-and-data-retention, 2026-11-07, opened. Not retained by default except Covered Models (30 days); never used for training without permission.
3. https://platform.claude.com/docs/en/manage-claude/data-residency, 2026-11-07, opened. Inference geo `us` or `global`; workspace geo `us` only.
4. https://platform.claude.com/docs/en/models/overview (latency rank "Fastest"/"Fast"), via tech-feedback-layer.md [1b], team file, not re-opened here.
5. https://developers.openai.com/api/docs/pricing, 2026-11-07, opened (the openai.com/api/pricing page returned 403). gpt-6-luna $0.10 / $0.50; gpt-5.6-terra $2.00 / $12.00; standard tier.
6. https://developers.openai.com/api/docs/guides/your-data, 2026-11-07, opened.
7. https://aistudio.google.com/docs/pricing (redirect from ai.google.dev/gemini-api/docs/pricing), 2026-11-07, opened. The final 3,573 characters were not read.
8. https://aistudio.google.com/docs/terms (redirect from ai.google.dev/gemini-api/terms), 2026-11-07, opened.
9. https://webllm.mlc.ai/docs/, 2026-11-07, opened. Requires WebGPU; no sizes or mobile statement on the page.
10. https://huggingface.co/docs/transformers.js/index, 2026-11-07, opened. WASM default, WebGPU opt-in, q4 option; no mobile guidance.
11. Search snippet: WebLLM config lists Llama-3.2-1B-Instruct-q4f16_1 at 879.04 MB VRAM; third-party listings 712 MB and 278 MB downloads; a phone test report. 2026-11-07, snippet, unverified.
12. https://developer.chrome.com/docs/ai/prompt-api, 2026-11-07, opened. Web: Chrome 148 intent to ship; extensions 138; Android not supported; 22 GB, over 4 GB VRAM, 16 GB RAM; en, ja, es, de, fr.
13. Team files: web-app-architecture.md, tech-feedback-layer.md, ai-visibility-note-v0.md, privacy-design-v1.md, build-plan-v1.md, business-case-v1.md, cisco-fit-note-v1.md.
