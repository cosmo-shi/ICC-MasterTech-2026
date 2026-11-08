# Student's Compass - web app architecture and model flexibility (draft 5 Nov 2026)

- Yes, a web app. Browser only for students and staff; nothing installed on devices (privacy principle).
- Model-agnostic by design: the compass harness sits in a gateway, so any model behind it behaves the same.
- Mental model: an Odysseus-style self-hosted workspace, but locked to one assignment and forced into compass mode.

## Layers
| Layer | What it does | Runs where (demo) | Runs where (pilot) |
|---|---|---|---|
| Student web UI | Card, guide chat, weekly check, stuck map, journey record | Laptop, browser | University web host |
| Staff web UI | Card approval, cohort heatmap, opt-in journey view | Same app, staff role | Same |
| Compass gateway | Applies the card policy, harness, output guard, logging | Laptop, one Python service | Campus VM or container |
| Model router | One OpenAI-compatible contract to many providers | Same service | Same |
| Providers | Local models, campus-hosted models, licensed cloud, student's own | Ollama on the laptop + one cloud key | Campus GPU, vendor enclave, BYO |
| Store | Assignments, cards, sessions, checks, outcome scores, journeys | SQLite | Postgres on campus |
| Identity and comms | Sign-in, weekly nudges | Mock login | Duo (OIDC), Webex bot |

## Model flexibility: three slots, one contract
- Contract: every provider is called through the OpenAI-compatible chat API. The gateway never cares which model answers.
  o Local: Ollama, vLLM or llama.cpp expose that API already.
  o Cloud: OpenAI, Anthropic, Gemini, OpenRouter through a router library such as LiteLLM.
  o Campus: whatever the university hosts, same API, pointed at by URL.
- Slot A, campus default: the university's own model. Default for every student, data never leaves.
- Slot B, licensed cloud: a university key to a frontier model for tasks the card allows. Logged like A.
- Slot C, bring your own: DROPPED 5 Nov on advisor feedback (John).
  o Consumer subscriptions (ChatGPT, Claude) forbid wrapper use in their terms; students will not paste keys.
  o Institutions already license models (Flinders Gemini Enterprise, UNSW ChatGPT, unverified), so slot B covers it.
  o Never say "API" or "key" in the pitch; say "runs on the university's own AI".
  o Clarified 5 Nov: Odysseus takes developer API keys (OpenAI, OpenRouter) and Copilot, not Pro or Max logins.
  o Anthropic blocked subscription OAuth in third-party tools from Jan 2026 (docs Feb, enforced Apr 2026); OpenAI's terms are similar.
  o So "put your Claude or ChatGPT in" was only ever possible with a pay-as-you-go key, which students do not have.
- Card decides the slot per task part: for example "explain concepts: any slot; critique draft: A or B; write answer: none".
- Registry table: provider, URL, model name, slot, cost class, max context, allowed card levels. Add a row, no code change.

## The harness: model-independent compass mode
| Step | Mechanism | Why it works on any model |
|---|---|---|
| 1 Policy prompt | System prompt built from the card: allowed uses, banned outputs, unit outcomes, tone | Every chat model takes a system prompt |
| 2 Direction dial | Student picks explain / question-me / critique; gateway sets the matching instruction | Instruction, not model feature |
| 3 Output guard | A small second model classifies each reply: direction or deliverable; deliverables are rewritten into hints | Works on the text, blind to which model wrote it |
| 4 Ask-back rule | If the student asks for the answer, the gateway injects a reflective question before any help | Gateway logic, not the model's choice |
| 5 Council (optional) | Two or three models answer; a judge picks the most Socratic, most outcome-aligned reply | Odysseus-style side by side, here with a rule |
| 6 Journey log | Each turn tagged with outcome, dial setting, guard result; student can read every entry | Pure logging |
| 7 Outcome scoring | Weekly checks scored per outcome by a grader model with the rubric; stored to the stuck map | Again just text in, score out |

- Guard failure modes to show honestly: a clever student can split a task into tiny steps. The map shows that pattern too.
- Red-team set: 30 "write it for me" prompts run against each model nightly; publish the hold rate per model on the staff screen.

## Odysseus: use as reference, not as base
- Reference: its provider list and local-first stance match slot A and slot C exactly.
- Do not fork for the entry until the licence is checked against the Participant Agreement (IP goes to La Trobe and the sponsor).
  o A copyleft licence would conflict; a permissive one still needs attribution. Check the repository licence file first.
- Recommended: build our own thin gateway (a few hundred lines) and cite Odysseus as prior art in the architecture slide.

## Suggested stack (team skills: research and design, ML and web, infrastructure and AI)
| Part | Choice | Reason |
|---|---|---|
| Front end | React or Next.js, or plain HTML with htmx if time is short | Fast to demo, runs anywhere |
| Gateway | Python FastAPI | ML lead and infra lead both fluent |
| Router | LiteLLM (or a 50-line adapter) | One call, many providers, Ollama included |
| Local model | Ollama with a small open instruct model | Runs on a laptop for the demo |
| Guard and grader | Same small model, separate prompts | No second dependency |
| Store | SQLite for the demo, Postgres later | Zero setup |
| Packaging | Docker compose, one command | Reproducible on campus |
| Identity | Mock for demo; Duo OIDC noted on the slide | Cisco fit without building it |
| Nudges | Webex bot webhook for weekly checks, shown as a mock message | Cisco fit, cheap to fake |

## Data model (minimum)
| Table | Key fields |
|---|---|
| assignment | unit, brief text, rubric, learning outcomes, card json, approved by, approved at |
| provider | name, url, model, slot, allowed levels |
| session | student, assignment, started |
| turn | session, role, text, dial, outcome tag, guard verdict, provider |
| check | assignment, week, outcome, questions |
| check_result | student, check, score, answered at |
| journey | student, assignment, generated summary, student approved, shared with |

## What the demo proves
- Same "write my answer" prompt to two providers (campus local, institution-licensed cloud) gives guided replies, no answers.
- The card changes and the gateway refuses a slot it allowed a minute ago.
- Staff screen shows the hold rate per model from the red-team set.

## Open build questions
- Which small open model holds compass mode best under the guard? Test three on 7 Nov.
- Latency of guard plus reply on a laptop; if over four seconds, stream the reply and guard in parallel.
- Does Flinders' prompt-appendix rule accept the journey record format? Ask on 5 or 6 Nov.

## Sources

- Advisor feedback from John on 5 Nov 2026, which dropped slot C, as stated in the body.
- Odysseus, the self-hosted workspace named as reference and prior art; the body gives no URL.
- The Participant Agreement, IP clause (La Trobe and the sponsor), as named in the body.
- Anthropic docs, Feb 2026, on subscription OAuth in third-party tools; the body gives no URL.
- Institution licences (Flinders Gemini Enterprise, UNSW ChatGPT), named in the body and marked unverified.
