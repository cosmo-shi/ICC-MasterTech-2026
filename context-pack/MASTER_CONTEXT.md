# Carmen — master product and implementation context

Version 2.0 · 9 November 2026 · Prepared for Claude Code and the project team


## Current scope and innovation update
This version incorporates the user's requirement for the full primary suite from Foundation-Year 6,
variable complexity and applicability to secondary and older learners.
The current working product name is Carmen; Sound Workshop remains the visual direction.
AI bandmates, gesture instruments and adaptive teaching have documented precedents.
No exclusive USP or educational advantage is established. Read research/INNOVATION_AUDIT.md.
Sections 16-18 embed the current technical contract, feasibility boundaries and primary progression.
The local child-data requirement remains fixed. Optional gesture input is a deliberate local experiment, OFF by default.
The ten foundation lessons are retained; they are not a complete F-6 curriculum catalogue.

## 0. Read this first

Build a real, elegant, child-centred music-learning application. This document is the authoritative product brief for the supplied context pack. It combines the team's idea, whiteboards, mentor feedback, requirements, prior design research and a fresh check of primary sources. It is a specification for work to be implemented; it does not claim that the application, AI model or educational outcomes have already been validated.

The current audience scope is **Australian children across Foundation-Year 6**, especially those with limited access to instruments or teaching resources. Musical complexity and input demands are independent; secondary and adult learners can use suitable contexts and more advanced pathways. The product must teach musical foundations and connect theory, notation, listening, playing and creating. Providing a collection of virtual instruments alone does not fulfil the brief.

The user's priorities are elegant design, flexibility, genuine personalisation, accurate sourced teaching, reusable open content, privacy, safety, accessibility and functioning software. Preserve the full vision while distinguishing the working MVP from future services. Do not silently remove important features to produce a polished shell.

### Status vocabulary

- **User requirement:** explicit direction from the project owner; implement within the agreed scope.
- **Proposed default:** a concrete recommendation so implementation can begin. Record changes with reasons.
- **Source-supported:** supported within the cited source's actual population and method, not universally proven.
- **Hypothesis:** a proposition to test, including product differentiation and educational impact.
- **Future:** retained in the roadmap, excluded from the initial child-facing application.
- **Unverified:** not yet reviewed, measured or implemented. Never present this as passed.

### Context-pack navigation

`CLAUDE.md` is a short project entry point. This master contains the complete brief. `content/lessons.seed.json` contains ten structured lesson drafts with original exercises, source attribution, prerequisites and separate practice/independent-check patterns. `content/content_sources.json` records their source permissions. `content/asset_manifest.template.json` defines asset provenance requirements; it is not evidence that samples have been imported. `references/sources.csv` records the current research audit. The prior research bank and two earlier design reports are preserved under `references/` as background, with their limits stated.

If only this file is supplied, it still contains the product decisions, requirements, lesson sequence, data rules and build checks. Read relevant companion material before implementing its area. Do not automatically import every research document into every coding session.

## 1. Product, audience and purpose

### One-paragraph product definition

A music playground and guided learning app that lets primary-aged children begin making and understanding music on an existing device before obtaining a physical instrument or regular individual tuition. Children can play adaptable virtual instruments, learn pulse, rhythm, pitch, note values and elementary notation, receive feedback on their actual attempts, choose suitable practice and create music they can keep. AI supports a bounded practice cycle; adults and other musicians remain important to expression, relationships, physical technique and supported learning.

### The learner and other stakeholders

| Role | What matters | MVP responsibility |
|---|---|---|
| Primary learner | Australian primary-school beginner, approximately 5–12; no reliable access to a personal instrument or specialist tuition. | This is the primary user, not a buyer persona. |
| Full primary scope | Foundation, Years 1–2, Years 3–4 and Years 5–6, with older extension. | Provide meaningfully different starter pathways in every band; age is not a skill ceiling. Do not infer age from performance. |
| Disabled learner | Individual visual, motor, hearing, reading, attention and sensory needs. | Adapt participation without requesting a diagnosis; test with relevant users. A touchscreen does not itself establish access. |
| Regional/rural learner | Possible unreliable internet, shared devices and limited local teaching. | Core resources available offline after preparation; no mandatory camera or extra instrument. Rural learners are not one homogeneous group. |
| Parent/carer | Trust, understandable data handling, manageable sound, meaningful activity. | Clear adult information and local-data controls; no forced account. |
| Generalist teacher | Accurate content, quick setup, useful evidence, class compatibility. | A modest adult view of current-device progress and lesson purpose; do not invent a complete school-management system. |
| University/outreach partner | Pathways, practical deployment, evaluation and community links. | Potential pilot/distribution partner; no partnership or endorsement is established by this brief. |
| Potential purchaser/funder | Schools, outreach programmes, institutions, grants or government programmes. | Commercial model is unvalidated. Children are not the advertising product. |

Use Australian English and terminology: personalise, practise as a verb, practice as a noun; crotchet (quarter note), quaver (eighth note), minim (half note), bar, stave/staff. Explain vocabulary through demonstrations. Do not turn the child interface into a technical glossary.

### Before and after — hypotheses and observable outcomes

| Barrier before | Intended change | Evidence a prototype can provide |
|---|---|---|
| No personal instrument | Start making music on an available device. | First sound and a short played pattern without extra hardware. |
| No clear starting point | A short sequence teaches a concrete musical idea. | Child can explain or demonstrate the concept. |
| Generic guidance or no feedback | Actual inputs inform one useful next step. | Different attempt histories lead to relevant support. |
| Difficult controls | Access preferences change interaction, not the learner's dignity or stated potential. | The same objective is reachable through supported alternatives. |
| AI does the thinking | Child attempts, chooses help and checks understanding independently. | New-pattern performance with hints hidden. |
| Patchy connectivity | Downloaded activities continue locally. | Offline reload, play, assessment and saving succeed. |
| Isolated learning | A later human pathway connects learning with others. | A credible future service design, not a fake community screen. |

Do not claim that absence of early exposure permanently prevents later creativity, that AI universally causes cognitive decline, or that the prototype closes an education-equity gap. Music has intrinsic expressive, cultural and relational value. Do not justify it only through unsupported promises about IQ, mathematics or future earnings.

## 2. Hackathon and mentor context

The challenge supplied by the team is: “How might we use AI and emerging technology to transform the way students learn and succeed?” Named sponsors: Cisco, University of Canberra, Flinders University and La Trobe University. These names identify the event context; they do not establish product endorsement, procurement interest, technical integration, permission to display logos or access to student data.

The user asks for a fully functioning prototype with startup-quality judgement. This context pack is not the app. The coding agent must implement real input, audio, lessons, feedback, persistence and AI inference, and distinguish tested features from future work. Check the event's permitted pre-work and any requirement for emerging technology in addition to AI. Do not add AR merely to accumulate technologies.

### Meeting notes supplied by the team — 6 November

These are private project recollections, not independently verified public statements. Times and names follow the supplied notes. Empty entries such as “AA” and “A” have no recoverable detail.

| Contributor | Substance of feedback | Product implication |
|---|---|---|
| Ivan Chua, Innovation Central Sydney — 12:11 pm | Specify who learns and what becomes possible. Investigate root causes, not just symptoms. Personal experience can motivate a hypothesis but does not establish others' needs. Consider device-as-interface, instructor support and a playground. Ask about cost, resources, instrument choice and use in public environments. | Use a concrete learner scenario, distinguish cost/teaching/input barriers, and test beyond the team. Provide headphone/sound controls without requiring headphones; visual learning does not replace all listening tasks. |
| Ivan — learning approach | Traditional lessons can depend on an instrument, teacher and common place. Ask how technology changes access and connects individual with social/in-person learning. AR was a possibility, not an agreed feature. | An instrument-free start and bounded support; later connect to human opportunities. |
| Dan — 12:45 pm | Identify the purchaser and pitch audience. Emphasise augmentation, personalised feedback and helping teachers bring learners together. Books and videos already explain theory; personal feedback may be valuable. | Lead the learner-facing pitch with one child experience; explain institutional adoption separately. Do not claim physical bad-habit prevention from touch events. |
| Erin | Consider impact, scalability and transfer to other subjects. | Reusable lesson/event architecture is useful; prove the music use case first. |
| Danni | Look at JMC Academy; ask why music is taught, what skills matter and what transfer to real instruments requires. Could the system watch playing? | JMC is a stakeholder/research lead, not a verified competitor or partner. Camera analysis remains future work; physical technique transfer is a limitation to state. |
| Frank — 3:10 pm | Music is emotional and teaching is human work. Universities can support rural and non-traditional pathways. Consult music stakeholders at UC. Guardrails, human judgement, short assessments and cohort personalisation matter. Simple is best; keep future work clear. | Preserve expression and human relationships. Seek educator review and evaluate independent understanding. Sponsor relevance is a plausible outreach pathway, not an asserted commitment. |
| Kat — 3:40 pm | Check actual instrument and connectivity access. Community groups, instrument rental, mentors, study groups and class plans may remove barriers too. Consider sustainability, scalability and maintainability. | Offline service matters; avoid assuming technology fixes every cause. Keep community/instrument access as a serious later service, with operational responsibilities. |

An earlier formulation suggested replacing an absent educator. The safer and more accurate product promise is a guided starting point when support is scarce, and augmentation where teachers are available. The app cannot reproduce a teacher's relationship, cultural judgement, full musicianship or physical instruction.

### Whiteboard context retained

The boards identify multiple instruments, tap/strum interaction, AI guidance and personalisation. Expected benefits include independence, comfort, access, flexibility and feedback. Risks include social stigma, transferability, scale, cost, accuracy and camera privacy. The broader brainstorm includes autonomy, critical thinking, challenge, creativity, skills, equity, trust, integrity, quality assurance, sovereignty, safety, alternative learning methods, cultural preservation and teacher resources. These explain the team's values; they are not a requirement to implement every brainstormed technology.

## 3. Evidence, competitors and differentiation

### What the research supports — with limits

| Evidence | Design implication | Limit |
|---|---|---|
| ACER's 2025 NSW primary music-teaching survey identifies resource and preparation needs. [ACER_MUSIC] | Make setup and demonstrations understandable to generalist adults. | NSW evidence is not a national prevalence estimate or proof the app solves staffing problems. Do not repeat inconsistent sample descriptions from a repository summary. |
| Australian Curriculum music includes listening, creating, responding and performing. [ACARA_ARTS] | Theory and scoring must sit alongside making and musical expression. | The app does not cover the complete curriculum. No curriculum endorsement or full alignment is claimed. |
| AERO describes explicit instruction and fading scaffolds. [AERO_EXPLICIT; AERO_SCAFFOLD] | Small goals, demonstrations, guided attempts, specific feedback and independent checks. | Guidance across education is not a validated sequence for this app. |
| The reviewed violin-feedback trial reports different outcomes for visual/motion targets and sound. [VIOLIN_FEEDBACK] | Give one relevant feedback target after a phrase; avoid a crowded display during listening. | A short violin study does not establish benefits for touchscreen primary learners. |
| Bastani et al. distinguish aided practice performance from later unassisted learning. [AI_LEARNING] | Include a new task without hints and a rules-only comparison. | High-school mathematics, not primary music; safeguards did not establish universal learning gains. |
| The supplied music-learning bank discusses self-regulation, belonging, adaptation and practical setup. [USER_BANK] | Goal, attempt, reflection, strategy, retry; available access settings without diagnosis. | Individual items have different evidence strength; source summaries are not independent replications. |
| UNICEF RITEC foregrounds agency, competence, relationships, creativity and safety. [RITEC] | Learner choice, original creations and non-coercive interaction. | A design framework is not proof of wellbeing or learning efficacy. |

The supplied bank is preserved separately and distinguishes commentary, abstracts, reviews, qualitative studies and experiments. Do not turn its hypotheses into quantitative marketing. In particular, do not infer a diagnosis, learning style or intrinsic musical talent from note errors.

### Current competitive verdict
The expanded audit covers 29 products, programmes, research precedents and model/tooling entries.
The earlier ideas are useful capabilities, not verified unique inventions.
School AI accompaniment, generated teaching examples, adaptive musical questions and gesture instruments all have precedents.
The candidate advantage is a reliable local learning loop around student-owned music, checked musical changes,
learner direction and independent evidence. Its usefulness and commercial value remain unvalidated.
Use research/competitor_matrix.csv and research/INNOVATION_AUDIT.md for exact sources, availability and review limits.
Do not infer a missing feature from missing documentation or claim a first/only product.

## 4. MVP boundary and functional requirements

### Working release boundary

The target MVP includes two sampled instruments, retained foundation activities, four distinct primary starter pathways and an older extension. It connects actual local input, learned musical response planning, symbolic reply validation, learner choice, independent checks, creation/replay, useful teacher evidence and offline resources. Optional gesture input is a separate disabled-by-default local experiment. All supplied lessons and new mission plans remain drafts requiring educator review. Build a real musical interaction and then complete meaningful pathways across the full primary scope; do not label the starter data a complete curriculum.

A third instrument — simplified guitar — is a stretch after this works. A guitar simulation must describe what it supports and must not imply realistic fretting or physical technique. This scope preserves the explicit minimum of two instruments. No screen may pretend an unimplemented instrument, community or course is functional.

### Plain-language feature requirements

IDs group closely related behaviours for readability. Give compound behaviours separate acceptance checks. Priority M = working MVP; S = stretch; F = future.

| ID / priority | Feature | Functional requirement |
|---|---|---|
| FR01 M | Choose an instrument | The system shall allow the child to choose a playable keyboard or drum kit. |
| FR02 M | Play instruments | The system shall produce the mapped sound when the child taps a key/pad or uses its assigned computer key. |
| FR03 M | Play sounds together | The system shall support at least four simultaneous sounds in the declared test setup. Four is a proposed engineering floor, not a research-derived limit. |
| FR04 M | Adapt controls | The system shall provide control-size and spacing settings and a simplified note/pad layout. |
| FR05 M | Choose input | The system shall provide touch and computer-keyboard routes and allow remapping without requiring a diagnosis. |
| FR06 M | Choose a goal | The system shall offer rhythm, notes/reading and creative exploration as child-understandable choices. |
| FR07 M | Explore freely | The system shall provide free play without correctness scores or forced lessons. |
| FR08 M | Learn foundations | The system shall provide the staged pulse, rhythm, pitch, note-value, rest and notation activities described in section 6. |
| FR09 M | Connect theory | Each activity shall connect its concept to an audible example and a playable action. |
| FR10 M | Read notation | The system shall display correct target notation and relate the child's input to the relevant note or rhythmic event. |
| FR11 M | Hear an example | The system shall allow the child to hear and replay a target before attempting it. |
| FR12 M | Practise rhythm | The system shall provide a metronome with a user-controlled tempo, initially 40–160 bpm, and suitable play-along tasks. |
| FR13 M | Check notes | Assessed activities shall identify matching, wrong, missed and additional instrument events using actual captured inputs. |
| FR14 M | Check timing | Timed activities shall identify early, within-window and late inputs against the target using declared lesson-specific windows. Untimed pitch tasks shall not receive timing penalties. |
| FR15 M | Retry and review | The system shall replay an attempt, allow retry and show a factual comparison with previous attempts at the same task/settings. |
| FR16 M | Reflect | The system shall invite an optional reflection after an attempt and provide a skip route. |
| FR17 M | Relevant AI support | Actual local model inference shall propose bounded musical response plans using the current phrase, goal and supported evidence; validate before playback. |
| FR18 M | Personalised activity | The system shall suggest an activity from the approved bank using available attempt evidence and compatible access preferences. |
| FR19 M | Explain suggestions | The system shall explain the observed evidence behind a suggestion without inventing a cause or diagnosis. |
| FR20 M | Control the path | The child shall be able to accept or reject a suggestion, retry, choose another available activity or return to free play. |
| FR21 M | Request help | Each lesson shall provide a question, clue and answer/demonstration. A child may request the answer without earning it through repeated failure. |
| FR22 M | Check independently | The system shall offer a different pattern testing the same concept with hints hidden; the child may stop or exit the check. |
| FR23 M | Create music | The system shall record original performances as timed instrument events, not microphone recordings. |
| FR24 M | Keep creations | The system shall name, save, replay and delete compositions locally. Default titles shall avoid requesting a real name. |
| FR25 M | Track progress | The system shall save completed attempts locally and show useful skill/attempt history on that device. |
| FR26 M | Offline activities | The system shall download and verify a core activity pack, show its readiness and support play, lessons, scoring, local coaching/help and saving after an offline reload. |
| FR27 M | AI control | The system shall allow AI coaching to be switched off while preserving learning and non-AI help. |
| FR28 M | AI identification | The interface shall identify AI-generated or AI-selected support accurately. Fixed local help shall not be labelled as generated AI. |
| FR29 M | Coaching scope | Coaching inputs shall use bounded music-related choices. If any text entry is later added, unrelated requests shall receive a fixed music-scope redirect. |
| FR30 M | Choose gamification | Gamification shall begin off and remain switchable without losing progress. |
| FR31 M | Skill badges | When enabled, badges shall reflect defined evidence, including an independent task where appropriate; no attendance or usage-duration badges. |
| FR32 S/F | Other instruments | A playable guitar may be added as the third instrument. If unavailable options are shown, they shall say “Coming soon”; wind playback remains future. Prefer hiding unavailable options in the core child flow. |
| FR33 M | Clear local data | The system shall delete current-device progress, preferences and compositions through a clear local reset/delete flow with appropriate confirmation. |
| FR34 M | Control sound/effects | The system shall provide a master stop, instrument volume and separate optional decorative effects controls. |
| FR35 M | Teacher/adult evidence | Show learning intentions, actual attempts, model contribution, support, decisions and independent checks. Provide local assignment/review controls without implying secure remote school administration. |
| FR36 M | Recover | The system shall handle interrupted audio, unavailable storage, interrupted downloads and unavailable AI with truthful recovery options. |

| FR37 M | Full primary progression | Provide distinct Foundation, Years 1–2, Years 3–4 and Years 5–6 starter pathways and an older extension using a common variable-complexity architecture. |
| FR38 M | Check musical replies | Preserve original learner work; reject replies that break declared symbolic constraints and label model versus reviewed-rule provenance accurately. |
| FR39 S | Optional gesture control | Offer a local, opt-in expressive mapping with equivalent touch/keyboard controls and no frame saving/upload. |

### Future service requirements — retain, do not fake

| ID | Future capability | Required before child-facing release of that capability |
|---|---|---|
| F01 | Institution-managed learning groups and shared music | Verified organisation/roles, safe sharing defaults, access controls and moderation ownership. |
| F02 | Teacher/mentor recording feedback | Appropriate vetting, consent/assent processes, reporting, blocking, retention and responsible human oversight; “certified” is not a universally defined status. |
| F03 | Instrument borrowing/rental and local groups | Verified providers, availability and safeguarding responsibilities; no unsafe direct matching. |
| F04 | Physical-instrument support | Separate audio/MIDI/camera consent and validation; no unsupported fingering, posture or breath claims. |
| F05 | AR and gesture expansion | Optional local hand-gesture experiment is specified now; immersive AR and further tracking remain future pending demonstrated benefit and access testing. |
| F06 | Wider ages, more languages and culturally specific instruments | Appropriate content, fluent review, co-design and relevant cultural authority. |

## 5. Quality requirements and acceptance targets

Targets marked proposed are implementation/test goals, not already measured outcomes. Do not equate a source's guideline with complete product certification.

| ID | Requirement | Verification |
|---|---|---|
| N01 Privacy | No child input, attempt, composition, reflection or progress leaves the device in the MVP. | Network capture through play, lessons, AI, error handling and reset; inspect third-party dependencies. |
| N02 Data minimisation | No required identity, age, school, diagnosis, email, location, camera, microphone or child account; age-appropriate defaults apply to everyone. | Inspect all forms, permissions and storage records. |
| N03 Safety | No open chat, public profiles, direct messaging, ads, purchases, external child-facing links or emotional-companion behaviour. | Route and copy audit, including empty and error states. |
| N04 Access | Target WCAG 2.2 AA across complete supported flows; provide equivalent usable paths where instrument geometry is specialised. | Manual keyboard/screen-reader/zoom checks, automated checks and relevant learner testing. Do not declare conformance from an automated scan. |
| N05 Controls | Proposed target: main actions and equivalent playable pads at least 48×48 CSS px; enlarged mode around 64 px or greater where feasible. | Real-device checks; prevent overlapping hit areas. WCAG AA's 24 px target criterion is not an ideal child-control recommendation. |
| N06 Readability | Default child instructions around 18–20 CSS px, short sentences, replayable demonstrations and optional offline narration where available. | Actual reading/tasks and 200% text enlargement. Do not claim a universal reading level or dyslexia treatment. |
| N07 Audio latency | Proposed maximum target: input activation to audible onset ≤100 ms at the 95th percentile on each declared device using built-in/wired audio. Aim lower where possible. | Document physical measurement method, input/output chain and sample size. Software timestamps alone cannot certify audible latency. |
| N08 Timing integrity | Proposed checker calculation error ≤10 ms against timestamped synthetic fixtures. Physical capture accuracy is a separate measurement. | Known-offset fixtures on a common clock; real-device latency investigation. |
| N09 Offline | After “Ready offline” is shown, all MVP core resources including model assets remain available across a tested offline reload. | Airplane mode/reload, required resource inventory and failed-download test. Browser eviction/private-mode limits must be explained honestly. |
| N10 Persistence | Completed saves survive normal reload/restart unless browser site data is cleared or unavailable. | Force reload, quota errors, reset and schema migration checks. Never show “Saved” before transaction success. |
| N11 AI bounds | Only valid content/strategy IDs may be selected; uncertain or failed inference yields local help. | Invalid IDs, incompatible lessons, malformed output, model-load failure and stale-result tests. |
| N12 Grounding | Factual feedback must match the recorded attempt and must not assert inferred causes. | Every displayed claim references a measured fact; deliberate contradictory outputs are rejected. |
| N13 Responsiveness | Portrait and landscape work; laptop and tablet layouts remain coherent; no forced orientation. | Declare tested browser/device versions and inspect small screens, large text and touch. |
| N14 First use | Proposed formative goal: at least 4 of 5 observed first-time users make a sound within 30 seconds of an interactive home screen without adult prompting. | Small study for finding issues, not a population efficacy claim. Record age group and access conditions. |
| N15 AI responsiveness | Proposed goal: local inference and coaching selection complete within 1 second after a short phrase on declared devices without disrupting audio. | Profile with model loaded on the weakest target device. Display truthful waiting/fallback state. |
| N16 Download budget | Proposed initial core-pack budget ≤10 MB compressed, including essential audio, fonts, lessons and model; optional packs separately sized. | Build-report actual bytes. Adjust deliberately if real instrument quality requires it; do not hide downloads. |
| N17 Maintainability | Source-backed lesson data, deterministic tests, schema versions and clear audio/checker/coach boundaries. | Add a lesson without changing scoring logic; validate data and run relevant tests. |
| N18 Content rights | Every shipped lesson, sample, font, icon and model has item-level rights/provenance; unknown or prohibited entries fail the content build. | Manifest checks and notices audit. |
| N19 Security | No runtime secrets in child assets; self-host dependencies; no untrusted HTML execution; strict network and permission policies. | Build/secret/dependency review, CSP and request checks, safe rendering/import tests. |
| N20 Ethical design/cost | Core prototype free; no streaks, loss-aversion rewards, attendance pressure, purchases or learner rankings. Musical metronomes/count-ins are allowed. | Product/copy audit, including settings. |

## 6. Pedagogical model and content sequence

### Principles

Use an **experience → name/explain → supported practice → feedback → choice → independent application → create** cycle. Different activities can enter at different points; free exploration remains available. Explicit teaching and playful agency coexist. Fade support as evidence grows, never lock children into failure or assign fixed ability labels.

Teach musical fundamentals for their own musical value. Pair listening with action and notation. Use simple visual blocks as a bridge, then show conventional notation explicitly. Do not permanently substitute arbitrary colour codes for notes or assume a hearing alternative reproduces every auditory task. Provide meaningful alternative participation goals and state their limits.

Real-time input response matters; constant corrective narration does not. During a phrase, show a clear playhead and optional focused cue. After a phrase, give one specific observation and one possible strategy. Avoid red flashes on every miss, modal interruptions, overlapping speech and instrument sound, and praise after every tap.

### Retained foundation sequence — ten draft activities

These are child-adapted drafts, not an endorsed primary curriculum. College-level Open Music Theory is used as a factual reference, not copied as a child lesson plan. Source concepts and exact licence obligations are retained; examples are newly authored. A primary music educator must review the sequence, explanations, notation and difficulty before a real-child pilot.

| Lesson | Objective and task | Evidence / independence | Sources |
|---|---|---|---|
| L00 Make a sound | Explore keyboard and drums, stop sound and choose comfortable controls. | Child intentionally produces/stops a sound; no correctness score. | ACARA_ARTS; original product activity |
| L01 Find the pulse | Tap an even four-beat drum pattern with a count-in and audible/visible pulse. | Try a different-length independent pattern with prompts hidden. | OMT_METER; AERO_SCAFFOLD |
| L02 Leave a space | Alternate played beats and silent beats; represent a one-beat rest. | Distinguish an intended silence from an omitted required hit. | OMT_RHYTHM |
| L03 Two sounds in a beat | Compare one crotchet with two quavers in a simple 4/4 context. | A new arrangement tests subdivision, not faster button pressing for its own sake. | OMT_RHYTHM; OMT_METER |
| L04 Higher and lower | Hear and play contrasting pitches at matched volume; follow an up/down contour. | Untimed pitch sequence; do not conflate pitch with loudness. | OMT_PITCH |
| L05 Meet C, D and E | Connect three pitches, their key positions and names; show the black-key grouping when explaining C. | Play a new C/D/E sequence without flashing target keys. | OMT_PITCH |
| L06 Read a small melody | Connect C4/D4/E4 to the treble stave and play a short sequence. | C4 ledger line, D4 below first line, E4 on bottom line; distinct independent sequence. | OMT_NOTATION; OMT_PITCH |
| L07 Hold a sound | In 4/4 with a crotchet beat, compare a two-beat minim with one-beat crotchets. | Use note-on/note-off input on keyboard; do not grade drum decay as a held-note action. | OMT_RHYTHM |
| L08 Read, play and rest | Combine familiar pitches, durations and silence over two bars. | New integrated pattern with hints hidden; assess relevant dimensions separately. | OMT_NOTATION; OMT_RHYTHM; OMT_METER |
| L09 Make a musical answer | Create a short response using known notes or drum sounds; hear, revise and keep it. | Check that a creation was made/saved, not whether its artistic content is “correct”. Invite optional explanation. | ACARA_ARTS; OMT_NOTATION; original exercise design |

`content/lessons.seed.json` contains these lesson drafts with practice events, independent alternatives, help levels, source IDs and honest review status. The JSON is a starter content pack, not proof of musical or developmental validation. Do not launch the drafts to children as “teacher approved”.

### Whole-primary progression and choice

Foundation-Year 6 is the product scope, not an age-restricted slice. Use content/primary_suite.plan.json and section 18 for four distinct band pathways and an older extension. The ten seeds below are retained foundation drafts, not the entire suite. Curriculum identifiers are checked references; activity alignment and coverage remain draft.

### Progression and choice

Prerequisites are concept dependencies, not a coercive locked road. Offer a recommended route, a demonstration or an explanation when a child enters an unfamiliar activity. Allow exploration and revisiting. Show activity completion separately from skill confidence. An assisted success does not by itself establish independent competence.

Proposed evidence rule for a small skill badge: two successful independent patterns for that skill on separate attempts under recorded settings. This is a product rule to validate, not a standardised mastery criterion. A child can turn badges off. Changing an access setting must not be portrayed as cheating.

### Musical correctness rules

- Use one canonical event representation for sound, notation, targets and replay. Do not maintain inconsistent note arrays in different components.
- Middle C is C4, MIDI 60, using A4=440 Hz as the chosen equal-temperament reference. A pitch formula may use `440 * 2 ** ((midi - 69) / 12)`. This tuning convention is not universal music culture.
- A beat is the declared unit for the exercise. In the initial 4/4 lessons it is a crotchet; do not teach that a crotchet always equals one beat in every metre.
- A rest is an intentional silent span. An absent input is “missed” only if a sound was expected there; an input during a rest is extra.
- Instrument identity, note pitch, onset timing and held duration are separate assessment dimensions. Do not report “wrong note” for a timing-only issue.
- Untimed note-recognition tasks test pitch/sequence only. Timing windows apply only to tasks teaching timing.
- Drum events are one-shot sounds; key holds are note-on/note-off pairs. Pointer cancellation, release outside a key and focus loss must stop held notes safely.
- New sounds and creations are not wrong simply because they differ from a lesson example. AI must not compose the child's assessed answer for them.
- Avoid a canonical “happy major/sad minor” rule or claims that Western notation exhausts music. Cultural learning needs appropriate context and authority.

### Content sourcing and licence policy

“Free to access”, “royalty-free”, “open access”, “open source” and “public domain” are different. Do not treat a web lesson as a reusable asset because it has no paywall. This policy is designed for a possible real startup, not a non-commercial-only exception.

| Material | Allowed starting point | Conditions |
|---|---|---|
| Lesson theory and explanations | Open Music Theory pages listed in the source catalogue, CC BY-SA 4.0. | Keep attribution, adaptation notice and licence. Distribute adapted lesson material under CC BY-SA 4.0. Exclude third-party embeds and examples with separate rights. Do not automatically relicense unrelated app code; review boundaries if content and code become inseparable. |
| Curriculum orientation | ACARA core curriculum material covered by CC BY 4.0. | Respect exceptions for photos, videos, support resources, third-party materials, trademarks and ICIP. Use required attribution when reproducing material. Do not copy consultation drafts as current curriculum or invent curriculum-code alignment. |
| Music examples | Newly authored short symbolic exercises in the supplied pack. | Supplied as part of the open lesson pack under CC BY-SA 4.0; preserve source context. Do not market generic motifs as unique compositions. |
| Instrument samples | Candidate: Versilian Community Sample Library, expressly released as CC0. | Inspect actual selected files and any exceptions, pin revision, preserve a licence snapshot and hash every imported asset. The master brief contains no downloaded sample library. |
| Musical notation software | VexFlow code under MIT. | Preserve notices and check any bundled musical font separately. |
| UI fonts | Grandstander and Atkinson Hyperlegible Next from the official repositories, OFL 1.1. | Self-host exact files, preserve OFL notices and respect reserved names when modifying fonts. |
| AI training data | Seeded synthetic event patterns generated by the project; no recordings or behaviour from children. | Document generation, training split, licence, limitations and dataset hash. No unverified external music/model dataset. |
| Reference imagery | Product/studio case studies and prior moodboards. | Inspiration only; no right to reuse characters, screenshots, logos or imagery in the shipped app is assumed. |

Do not use commercial song recordings, downloaded YouTube audio, scraped Spotify material or copied competitor courses. An old composition does not make a modern arrangement, edition or performance public domain. Public-domain status can differ by jurisdiction. Use verified CC0 or appropriately licensed items rather than assuming age clears rights.

MAESTRO is specifically **not approved** under this startup's default content policy: its official licence includes a non-commercial restriction. A research paper using a dataset does not confer rights to us. Open Music Theory itself includes third-party media on some pages; copy neither its embedded players nor its tracking code.

Each lesson must record title, objective, prerequisites, source URLs, exact licence/version, creator/attribution, changes, examples, review status and version. Each imported file must additionally record original path/revision, downloaded date, local path, SHA-256, licence snapshot, modifications and approval status. Unknown rights mean omit the asset and record the gap; never invent clearance or a hash.

### Lesson editorial process

1. Select the objective and verify the referenced theory.
2. Write a short child-facing explanation and original playable examples.
3. Check beat totals, durations, pitch spelling, stave position and independent-task differences automatically where possible.
4. Review with a qualified primary music educator; record reviewer/date and specific changes, not a fabricated endorsement.
5. Test comprehension and access with the intended learners using appropriate adult consent/child assent arrangements.
6. Publish a versioned lesson pack; retain correction history and a way to replace a defective pack.

Content for culturally specific instruments is not an AI dataset by default. Open licensing does not erase cultural protocols or communal authority. Do not include sacred/restricted material or train models on cultural knowledge without appropriate permission and collaboration.

## 7. AI role, feedback and learner agency

### Current architecture: local musical response planning
Child data stays on the device. Do not add an external LLM API, cloud transcription, remote child analytics or child chat.
Use the detailed contract in section 16 and specs/AI_MUSIC_INTERACTION.md.
A real local learned model proposes an approved response plan related to the student's phrase and selected objective.
A deterministic compiler/verifier checks the claimed symbolic change before authentic sampled playback.
Model planning, note generation, acoustic sample playback and assessment are different capabilities; label them accurately.

The old synthetic timing classifier is retained only as a descriptive engineering baseline.
It is not a headline innovation, a model of a child's understanding or evidence of educational benefit.
Camera ML alone cannot fulfil the claimed pedagogical AI contribution.
Unknown model/version/rights, missing inference or unsupported device performance must remain explicit gaps.

The first gate is actual local model/runtime feasibility, including provenance, musical constraints and comparison with good rules.
A compact learned response planner is the smallest initial route to investigate.
Small symbolic models are candidates only after dependency/checkpoint review.
Do not silently use a large Apple-Silicon audio model as a universal browser solution.

### Required records
Keep immutable learner events, optional learner intention, actual input/clock conditions, chosen goal,
model/version, response plan, verified symbolic changes, support settings and independent evidence separately.
Never train on child sessions in this MVP.
Record a model card with exact rights, weights/hash, data provenance, held-out evaluation, baseline,
device performance, uncertainty/fallback and intended/non-intended use.
A supplied manifest template or fixture is not such a record.

### Failure and learner authority
Reject stale, unknown, unsafe or musically invalid outputs before playing them.
Use a reviewed local fallback with accurate provenance when needed.
Let the learner reject a suggestion, retain their work, choose support or turn the partner off.
The model cannot alter scores, infer causes or grade creative worth.
Independent checks retain access adjustments and use fresh material with teaching hints removed.

### Example feedback

| Measured observation | Appropriate response | Avoid |
|---|---|---|
| Required event 3 occurred outside the late boundary. | “The third sound came after the beat. Listen once, or try it more slowly.” | “You have poor rhythm” or an invented reason. |
| C4 was expected and D4 was activated. | “That was D. The target is C. Want to hear them?” | “Your finger position is wrong” from a touch event. |
| A silent beat was filled with an extra hit. | “This space is a rest. Keep counting while it stays quiet.” | Calling the entire original creation wrong. |
| Too few events or device timing is unreliable. | “Let’s listen once and try again.” | A confident ability judgement or a fake score. |

Avoid standalone “Genius!”, “Perfect musician!”, generic flattery, mascot disappointment and claims to understand the child's emotions. Warmth is welcome: “You tried a different ending” gives specific acknowledgement. AI is a tool, not a secret friend, therapist or human teacher.

Reflection choices might include “I lost the beat”, “I chose the wrong note”, “The controls were tricky”, “I want another try” and “Skip”. These are the child's reports, not model diagnoses. Do not automatically alter access settings based on a mistake. Offer the relevant control and let the child choose.

“Real-time feedback” means immediate sound/action visibility and timely factual checking. Coaching normally follows a short phrase. Never block audio on model inference, interrupt every note with speech or promise cloud-like conversation offline.

## 8. User experience and screen behaviour

### Main journey

1. Open an inviting workspace and make a sound.
2. Choose keyboard/drums, or follow a short guided start.
3. Adjust supported controls at any point.
4. Choose a learning goal; listen to a short example.
5. Play the activity; keep attention on one concept.
6. Hear/review the attempt, optionally reflect and request help.
7. Choose retry, a suggested activity, another activity or free play.
8. Try a new related pattern with hints hidden.
9. Create, name, save, replay and revise something original.

```mermaid
flowchart TD
  A[Open instrument workspace] --> B{Explore or learn?}
  B -->|Explore| C[Create and save music]
  B -->|Learn| D[Choose goal and try activity]
  D --> E[Review actual attempt]
  E --> F{Choose next step}
  F -->|Help| G[Optional reflection and support]
  G --> F
  F -->|Retry or another activity| D
  F -->|Independent check| H[New pattern without hints]
  H --> E
  F -->|Create| C
```

### Screens and states

| Screen | Required behaviour | Important states |
|---|---|---|
| Start/discover | Instrument/play invitation, optional guided start; no marketing landing page blocking entry. | First launch, audio not started, offline pack preparation. |
| Instrument workspace | Actual playable surface, visible stop/replay, access controls, clear learn/create routes. | Held note, multiple touches, changed mapping, quiet effects, lost focus. |
| Lesson | One short objective, demonstration, correct notation and exercise controls in the same musical workspace. | Count-in, playing, paused, no attempt yet, practice versus independent check. |
| Attempt review | Factual results, replay, optional reflection/hints, bounded next-step choices. | Assisted/independent labels, ambiguous evidence, AI unavailable, rejected suggestion. |
| My music | Locally saved compositions, replay, rename, delete and return to playing. | Empty, saving, saved, save failed, storage unavailable. |
| Adult information/settings | Purpose, reviewed/draft content status, source credits, local privacy information, current-device progress and reset. | Shared-device mode, deletion confirmation, unsupported feature, actual version. |

An adult-area navigation challenge is not identity verification, parental consent or secure authentication. Do not add a fake “parent verified” badge. Avoid collecting extra personal information to protect a data-free function.

### Sound in public/shared environments

Let the child start audio explicitly and stop all sound immediately. Do not autoplay decorative audio. Offer visible timing and instructions; recommend personal volume adjustment where appropriate. A silent visual task can practise some concepts, but do not pretend it assesses listening. Do not require headphones, hardware haptics, landscape orientation or a microphone for core learning.

## 9. Design direction — elegant Sound Workshop

### Resolve the earlier alternatives

Two prior reports proposed related but distinct directions: **Sound Workshop** (Grandstander + Atkinson Hyperlegible Next; cream/plum/cobalt) and **Paper Playground** (Gabarito + Figtree; paper/teal/tomato). This document chooses **Sound Workshop as the proposed implementation default**, because the concise prior brief recommended it and its palette has checked text pairs. This is not a user-tested final brand decision. Preserve Paper Playground as an alternative, not a second simultaneous token system.

“Sound Workshop” is a design-direction label and provisional working name, not a cleared trademark. The project owner can choose the product name. Do not invent a final logo or imply a brand clearance search has occurred.

Elegant means clear hierarchy, restraint, confident spacing and consistent behaviour. Playful means agency, original shape language, humour and responsive sound. It does not mean every element is rounded, animated or decorated. The user explicitly rejects generic AI-generated app aesthetics and wants a distinct, welcoming identity with childlike imagination.

### Typography

| Role | Default | Rules |
|---|---|---|
| Short display heading | Grandstander variable, about 650 weight, 32–40 CSS px. | Reserve expressive lettering for short phrases; no long instructions or all-caps walls. |
| Reading and instructions | Atkinson Hyperlegible Next, 400; initially 18–20 px, around 1.5 line height. | Live text, short sentences, left alignment, enlargement and wrapping. |
| Controls | Atkinson Hyperlegible Next, about 650, around 18 px. | Verb labels such as Play, Stop, Listen again, Save my sound. |
| Supporting adult text | Same reading family, normally at least 16 px. | Never hide task-critical information in tiny secondary text. |
| Music notation | A checked notation renderer/font. | Do not use arbitrary emoji or a text font to approximate notation. Provide accessible labels separately. |

Self-host OFL-licensed font files. Keep their notices. Use one display and one reading family, not every font researched earlier. The presence of a font in the design reports does not prove optimal reading performance for every child. No font should be marketed as treating dyslexia.

### Colour tokens

| Token | Value | Use |
|---|---|---|
| Canvas | `#FFF8E8` | Calm warm ground; clean behind text and playable controls. |
| Main ink | `#2B2341` | Text, labels and strong outlines. |
| Primary action | `#3658D4` | One consistent primary-action colour; white labels. |
| Coral | `#FF7954` | Warm sound objects/illustration; dark ink labels. |
| Sunflower | `#FFD65C` | Rhythm objects and limited highlights; dark ink labels. |
| Mint | `#A7DFC3` | Secondary objects; dark ink labels. |
| Lilac | `#C4B4E8` | Secondary instrument family; dark ink labels. |
| Supporting ink | `#675D75` | Secondary text on canvas where tested. |

Prior exact-colour checks: ink/canvas about 13.98:1; white/cobalt 5.99:1; ink/coral 5.72:1; ink/yellow 10.59:1; ink/mint 9.85:1; ink/lilac 7.78:1. White/coral is about 2.59:1 and is unsuitable for text. Recalculate actual CSS pairs, opacities and states. These figures do not certify the interface.

Colour never carries the only distinction between notes, selected controls or results. Use labels, position, shape or outline too. Distinguish pitch from instrument family; do not imply that one colour universally represents a musical emotion.

### Composition and shape rules

- Start with a small related family of circles, arches, bars and loops. Keep line weight, corner behaviour and faces consistent.
- Use a few large, useful shapes rather than a dashboard of identical cards. The instrument occupies the main visual field.
- Keep a stable header/navigation and a compact control shelf; place contextual help beside the current musical task.
- Put personality in short headings, an optional original character and purposeful transitions. Keep controls geometrically stable.
- Light material/print irregularity may appear in artwork, not behind instructions, notation or hit targets.
- Do not use purple-gradient assistant panels, generic sparkles, glossy random 3D, frosted-glass controls, music-note wallpaper, endless pill cards or a copied Duolingo path.
- Prefer a recognisable original motif to a pile of unrelated asset-pack illustrations. Do not copy another brand's mascot, exact layout or typography lock-up.
- No required product content should say “Claude”, “AI-generated prototype”, “replace this text”, “demo metric”, “lorem ipsum” or expose source IDs/model jargon. A brief accurate “AI coach” label is required where relevant.
- No invented testimonials, adoption numbers, school logos or sponsor endorsements.

### Interaction details and responsiveness

Main playable controls should visibly depress or change state when activated, then recover predictably. A held key shows a stable held state; a rhythm pattern has a clear playhead. Decorative effects are optional and never add sound over a listening task. Reduced-motion mode retains understandable static feedback.

A classic keyboard's black-key geometry can conflict with large touch targets on narrow phones. Do not enlarge invisible hit areas over adjacent keys. Provide an equivalent enlarged note-pad layout, a limited lesson pitch range and clear octave navigation. The C-finding explanation must still show the relevant two-black-key group. Never force a five-key simplification into a lesson requiring a missing pitch.

Prototype at small phone width, tablet and laptop; use portrait and landscape layouts. On phones, place review/help below the instrument or in a dismissible sheet that does not conceal essential keys. On wide layouts it can sit beside the workspace. Keep focus visible, preserve control position and allow text enlargement without covering sound controls.

### References — principles, not asset licences

| Reference | Principle to learn | What not to copy |
|---|---|---|
| Yoto/Pentagram | Child control integrated with coherent identity and understandable actions. | Physical-player graphics, symbol, proprietary type or card artwork. |
| Young V&A/Pentagram | Expressive display typography can invite participation while serving a wider identity. | Its modified typeface, exact illustrations and layouts. |
| Toca Boca | Creative agency and a consistent world. | Characters, stories, commercial mechanics or branded assets. |
| Pok Pok | Open-ended interaction and space for experimentation. | Its toys, sounds, graphics or unverified developmental claims. |
| Chrome Music Lab/Ableton | Make the first interaction audible and meaningful. | Whole course structures, protected recordings or an assumption that free access means reuse permission. |

The prior trend reports are cultural/reference signals, not evidence that an aesthetic improves learning. The current direction is based on stable principles: readable text, memorable shapes, coherent roles, calm activity space and learner control. Do not chase every 2026 visual trend or label ordinary fonts “AI fonts”.

## 10. System architecture and data contracts

### Recommended implementation shape

If a repository exists, inspect its actual stack and instructions before changing it. Preserve an adequate existing architecture rather than replacing it for fashion. For a new codebase, a small TypeScript web application with a component framework, custom CSS tokens, Web Audio, IndexedDB, service-worker offline support and a bounded local model is a reasonable proposed default. Pin actual current compatible package versions at build time; this brief does not invent a lockfile or installed commands.

Use the browser as the distribution/interface layer. Use well-supported APIs; Web Audio 1.1 is a draft, not a promise that every new attribute is implemented. Feature-detect optional APIs. Tone.js may help audio scheduling; VexFlow may render notation. Both need notices and version checks. No CDN, external font or remote player should become a runtime dependency of a downloaded core lesson.

| Module | Responsibility | Must not do |
|---|---|---|
| Input adapter | Map touch/key events to canonical instrument events, including release/cancel. | Infer identity, diagnosis or ability. |
| Audio engine | Local sample/synth playback, scheduling, voice limits, volume and stop. | Wait for AI, network or a UI animation. |
| Lesson engine | Load approved versioned content and advance states. | Ask a model to invent the next lesson or answer. |
| Notation view | Render the same canonical target/played events. | Use a conflicting pitch/time representation. |
| Checker | Deterministic alignment and per-dimension facts. | Convert all mistakes into one unexplained ability score. |
| Local coach | Model inference plus reviewed strategy selection and validation. | Change scores or access settings silently. |
| Local store | Transactional preferences, attempts, creations and schema migration. | Upload child data or claim encryption without implementation. |
| Offline manager | Resource manifest, verification, cache versions and readiness. | Say ready before required files are cached. |
| Adult information | Purpose, source rights, local data controls and honest limits. | Claim to authenticate a teacher or supply a secure school portal. |

### Data flow

```mermaid
flowchart TD
  A[Touch or keyboard input] --> B[Canonical local events]
  B --> C[Local audio engine]
  B --> D[Local lesson checker]
  E[Approved lesson data] --> D
  D --> F[Measured attempt facts]
  F --> G[Local storage]
  F --> H{Local AI enabled and ready?}
  H -->|Yes| I[On-device model and strategy selector]
  H -->|No| J[Reviewed local help]
  I --> K[Validate grounded support]
  K -->|Invalid| J
  K -->|Valid| L[Learner chooses next action]
  J --> L
  L --> D
```

The host may deliver application/resource files. No arrow carrying child activity goes to a remote AI, analytics or application backend in the MVP. Distribution requests can still expose IP/device metadata to infrastructure: inspect hosting logs and third-party request chains before making privacy claims.

### Canonical entities

| Entity | Minimum fields | Storage/lifecycle |
|---|---|---|
| Preferences | Schema version, instrument, input map, size/spacing, reduced motion, effect volume, AI and badge switches. | Device; defaults work without a profile. |
| Lesson | ID/version, objective, prerequisites, supported instrument/capabilities, example/assessment patterns, help ladder, sources/licence/review status. | Bundled/versioned public content; no child data. |
| Musical event | ID, canonical onset/duration ticks, pitch or drum sound, intentional dynamics and authorship; kind note/drum/rest. Legacy lesson drafts import from beats losslessly. | Musical time is not a wall-clock timestamp. Preserve raw live input separately. |
| Captured input | Event ID, relative onset/release, mapped action, actual pitch/sound and input type. | Local attempt; no pointer coordinates unless needed transiently. |
| Attempt | Local ID, lesson/version, tempo, support level, input/control/calibration settings, captured inputs and checker version/facts. | Device only; keep limited history; respect ephemeral mode/reset. |
| Coach decision | Attempt/version, evidence fact IDs, model/version, strategy, approved activity, displayed template, learner choice. | Local only if needed; no transcript of open conversation. |
| Composition | Local ID/title, instrument/sound versions, tempo, events, duration and version. | Device; rename/save/replay/delete. |
| Asset | Provenance/licence, exact revision/path/hash, byte size, format, sample root pitch if relevant. | Public resources; offline manifest. |

Store plain structured data, not rendered HTML. Use a versioned schema and input validation. Do not let imported lesson files, titles or model outputs execute script. If file import is added later, constrain type/size/event count and render text safely.

### Musical time and checking

Keep expected music in a canonical musical-time representation, importing legacy beat-valued lessons losslessly into ticks, and map it to the audio-clock timeline for playback. Declare the relationship between input timestamps and the audio clock; do not casually compare `Date.now()`, animation frames and audio scheduling times as though they are the same. Use a documented mapping and test it.

Count-in events are outside the scored region. Raw captured input must remain available locally for comparison; quantisation can be offered for creation but must not silently rewrite assessed evidence. Latency compensation must be explicit and bounded. A delayed output chain is not automatically the child's error.

Align expected and played events one-to-one, preserving sequence with a declared candidate window and a stable tie-breaking policy. Nearest-event matching alone can double-credit one input, or shift a sequence after an extra note. Use a tested monotonic alignment approach and separate pitch, onset and duration facts. Matching windows must consider the smallest expected gap so quaver tasks do not accidentally match to the adjacent event.

A proposed initial on-time window is ±0.20 beat capped at 150 ms; it is configurable per task and must be validated with educators/learners. This is not the ±10 ms checker-calculation goal or the ≤100 ms output-latency target. Record tolerance changes with the attempt; comparisons at different tempi/settings must be labelled accordingly.

Release-based duration scoring is used only where the input can express it. Pause, interrupted audio, focus loss and an unavailable audio clock invalidate or pause the timed region; do not grade silent failures. Provide listening/retry and factual recovery instead.

### Persistence and offline behaviour

Use a transactional store such as IndexedDB for structured local records. Avoid synchronous large writes in the audio path. Persist a finished attempt after completion; store compositions atomically; distinguish unsaved, saving, saved and failed. A successful local transaction is not a cloud backup.

Use a resource manifest with version/hash/bytes for application shell, lessons, essential samples/fonts and the local model. Verify required resources before “Ready offline”. Offer a separate download action for optional packs; show actual size. Keep the current valid pack if an update fails. Do not interrupt an active lesson to activate an incompatible service-worker update.

Support private/ephemeral sessions on shared devices: progress stays in memory and is not saved unless that mode is changed deliberately. Use this as the proposed child-first default, with clearly explained device saving as an option. When saving is enabled, local records remain until the adult/child clears them or browser storage is removed; implement a transparent data limit rather than secretly retaining unlimited attempts.

Browser eviction, private browsing and shared OS/browser access can affect persistence and privacy. Explain this without frightening children. A simple local avatar or a “grown-up” button is not secure separation between users. Do not claim local records are encrypted or inaccessible to other device users.

## 11. Child privacy, security and safety

### Australian context — checked 8 November 2026

The OAIC explains that privacy protection is not limited by age, and consent capacity is contextual. It is not safe to assume all primary children can authorise a service's data processing. OAIC's Children's Online Privacy Code page describes a draft/finalisation process with registration due by 10 December 2026; do not present every draft provision as already in force. Recheck the registered instrument and commencement arrangements before any deployment involving real children. [OAIC_CHILDREN; OAIC_CODE]

APP 8 concerns cross-border disclosure where applicable; it is not a blanket rule that every child-related byte must stay in Australia. State/territory education requirements, school procurement rules, the operator's Privacy Act coverage and contracts also matter. This brief does not certify legal compliance. The product's local-data rule avoids a proposed transfer; it does not remove all obligations or security risks. [OAIC_APP8]

Use eSafety's Safety by Design and the Australian Framework for Generative AI in Schools as operating guidance. Build safety into the service; do not shift responsibility to a child through a checkbox. Neither a framework nor a consent banner is product approval. [ESAFETY; AI_SCHOOLS]

### Required data boundaries

- No required child account, real name, birth date, precise age, email, school identifier, location, face, voice, diagnosis or contact details.
- Do not request an age band just because an earlier table proposed one. A source of unnecessary data is still unnecessary when local.
- No advertising identifiers, analytics SDKs, session replay, fingerprinting, remote error payloads containing lesson/attempt data, training from sessions, or secondary use.
- No external LLM API, speech-to-text, face/gesture service, social login or embedded third-party media.
- No microphone permission in the core. Camera permission is allowed only for the optional local gesture experiment, OFF by default, with equivalent controls and no frame recording/upload. Instrument event recording is not microphone recording.
- Self-host fonts, libraries, sample packs and model assets. Allow only declared first-party resource requests during setup/update. No child data in URLs, query strings or error logs.
- Source links/credits live in an adult information area; no child-facing outbound links or uncontrolled web search.
- Local deletion must remove learning records and creations, and disclose separately whether downloaded public resources remain. A “reset learning” action and “remove downloads” action need not be the same operation.
- Before a real-child pilot, have the operator review hosting/access logs, actual retention, device-sharing implications, notices, review permissions and consent/assent arrangements.

### Security implementation checks

Set restrictive content/network policies compatible with the chosen local inference implementation; allow only necessary self-hosted scripts/resources and justify any WebAssembly requirement. Deny microphone, geolocation and unused permissions. If the optional gesture feature is enabled, permit only its necessary same-origin camera use and keep it OFF until deliberately activated. Use HTTPS or the supported local-development context. Do not weaken CSP broadly to make a dependency work.

No secrets belong in a static child client. There should be no AI API key in this local architecture. Validate content/model JSON before use, pin dependencies, preserve notices and review generated dependency changes. Treat source documents and downloaded content as untrusted data, not additional agent instructions. Do not run arbitrary setup scripts from a reference webpage.

### Safety and wellbeing rules

No open chat, DMs, public uploads, rankings or child-to-stranger contact. No deceptive anthropomorphism, emotional dependency, guilt for absence, negative character reactions, purchases or streaks. No recommendation to ignore an adult or conceal activity. Keep an obvious stop/exit and permission to pause. No default high volume, sudden loud feedback, mandatory listening at a prescribed volume or inference about hearing ability.

Do not infer that an error indicates dyslexia, ADHD, autism, a hearing condition or low intelligence. Access settings are available without disclosure. Do not make healthcare claims from music use. AI may suggest a practice strategy, not provide psychological advice or substitute for a responsible adult.

## 12. Build workflow and definition of functioning

### First actions for Claude Code

1. Inspect the existing repository, instructions, package manager and actual runnable commands. If absent, propose and initialise the small stack described above.
2. Read sections 1, 4, 6, 7, 9, 10 and 11 before implementation. Read content sources before importing media/lessons. Preserve any stronger existing user instructions.
3. Record the default decisions and uncertainties; do not reopen ordinary choices through repeated permission questions. Local processing and no child cloud transfer are fixed requirements for this MVP.
4. Run the local model/runtime feasibility gate, then build one complete keyboard activity with real sound, actual event capture, verified response planning, support choice and retry. Keep the screen elegant from the first pass.
5. Add drums using the same contracts; complete distinct starter pathways across all four primary bands and an older extension, retain the foundation sequence, then verify creation, teacher evidence and offline behaviour.
6. Verify actual behaviour at each working checkpoint. Update truthful status and known limitations. Do not equate successful compilation with a working instrument or successful offline use.

### Suggested implementation checkpoints

| Checkpoint | Deliverable | Exit check |
|---|---|---|
| A Foundation | Project runs, design tokens, first sound and stop. | Touch and keyboard play on a phone/laptop; no unexpected network dependency. |
| B Learning slice | Pulse/notes activity with canonical events and real assessment. | Known input fixtures produce correct facts; review/retry and help routes work. |
| C Breadth | Second instrument and all ten activity routes. | Every visible activity has content, example, attempt, review and appropriate independent check. |
| D AI | Actual local model, model card and verified musical reply loop. | Phrase/goal-conditioned planning, baseline comparison, invariant rejection, learner control and no remote child data. |
| E Ownership/access | Creation, saving/replay/delete, access preferences and opt-in badges. | Persistent and ephemeral paths behave as stated. |
| F Offline | Versioned cached core including model and fonts. | Offline reload and full golden path succeed. |
| G Finish | Responsive/reduced-motion/keyboard/error states and demo. | Real-device visual check, content validation and accurate feature status. |

The earlier two-day constraint was preparation before departure, not a verified release deadline. Preserve the sequence regardless of the available hours. If time is short, remove stretch breadth and nonessential visual polish rather than presenting a fake AI or a nonfunctional course. A real functioning scope is smaller than a fictional startup portal.

### Acceptance suite

| Area | Required scenarios |
|---|---|
| Instruments | Each key/pad produces the mapped sound; multi-touch and polyphony; stop; note release outside control; pointer cancel; focus loss; no stuck notes. |
| Music data | Note pitches/spellings, C4 placement, 4/4 totals, rests and durations agree across notation, playback and checker. |
| Scoring | Exact, early, late, wrong, missing, extra, double-hit, rest violation, ambiguous alignment, half-beat spacing, untimed pitch and changed-tolerance fixtures. |
| AI | Actual model loads/runs; baseline comparison; uncertain/invalid/stale results; incompatible recommendation; factual contradiction; AI off and failed model. |
| Agency | Skip reflection, request answer, reject recommendation, choose another route, stop independent check, return to free play. |
| Creativity | Record original events, stop, save, rename, reload, replay and delete; artistic work never receives a correctness score. |
| Privacy | No child payload leaves device in every mode; no third-party font/sample/analytics fetch; no hidden transcript/logging; reset and ephemeral mode. |
| Offline | Initial pack incomplete, completed pack, airplane-mode reload, model availability, interrupted update and storage eviction notice. |
| Access | Full keyboard navigation, focus visibility, screen-reader labels, text enlargement, reduced motion, non-colour feedback, alternate large playable controls. |
| Design | Small phone portrait/landscape, tablet/laptop, loading/error/empty/saved states; no placeholder copy, clipped labels or inaccessible black-key targets. |
| Rights | Every shipped content/asset has a known compatible licence, required attribution and exact local hash; no unknown/NC/ND asset enters the build by default. |

Document tests actually run, device/browser versions, failures and limitations. The context-pack validation script only checks its starter data; it does not test the application, educator suitability, legal compliance, accessibility or learner outcomes.

### Demonstration script

Show one child's experience: no owned instrument, make a sound, choose comfortable controls, learn pulse/rest or C/D/E notation, make an attempt, receive a factual observation, choose support, try a different pattern independently, then make and keep a variation. Disconnect the network and repeat a short downloaded activity. Show adult information only briefly to explain sources and local data. Label future guitar/community/AR plans as future.

Use synthetic demonstration records for any developer instrumentation. Do not invent child testimonials or claim a school pilot. A demo recording is a backup, not proof a live broken feature works.

## 13. Startup and longer-term operating context

The primary beneficiary is the child. The first possible distribution/funding route is institutional outreach or school/community support, with caregivers as another access route. This is a hypothesis to validate; sponsors are not automatically buyers. Keep the core prototype free and do not monetise child data. Optional adult/institutional services can be investigated later without assuming a business model has been approved.

| Startup question | Next evidence/action | Avoid |
|---|---|---|
| Is access the actual bottleneck? | Interview children with adults, generalist teachers, outreach staff and relevant disabled musicians. Check device, instrument, internet and social opportunities separately. | Treating the team's experience as universal. |
| Does personal feedback help? | Compare the complete flow against sourced exercises plus simple guidance and a rules-only coach. | Assuming ML is better because it is ML. |
| Can institutions deploy it? | Review managed browsers, shared devices, connectivity, resource downloads and IT/content review. | Building an LMS integration before need/approval is known. |
| Who pays and sustains it? | Validate an institutional or grant-supported route, support effort and content maintenance cost. | Selling attention or requiring children to pay to finish a basic lesson. |
| Can content remain trustworthy? | Named editorial owner, qualified reviewers, versioning, corrections and rights records. | Infinite model-generated curricula. |
| Can it scale responsibly? | Size/download budgets, local inference profiles, compatibility matrix and human support responsibilities. | Equating cloud scale with educational readiness. |
| What connects to people? | Co-design optional teacher/community/instrument-borrowing pathways with real partners. | A public child social network. |
| What transfers to other subjects? | Reuse the bounded practice/feedback/choice architecture after testing a new domain. | Claiming this prototype validates all creative education. |

Before deployment with real children, resolve the operator, hosting and log policy, age-appropriate notices, content review, intended test population, data-handling accountability and incident/correction process. These are operating decisions to make concrete, not additional marketing screens.

## 14. Open decisions and known gaps

| Item | Current default | What would resolve it |
|---|---|---|
| Product name | Carmen is the working product name; Sound Workshop is the design direction. | Appropriate availability checks before commercial branding. |
| Learner scope | Foundation-Year 6 with an older extension, independent complexity dimensions. | Educator/learner review across every band and relevant access needs. |
| Existing codebase | Not supplied or inspected in this task. | Claude Code repository inspection; do not claim migrations are necessary. |
| Actual model | Compact local response planner or suitable symbolic model proposed; no weights supplied. | Actual inference, rights, baseline/invariant checks and target-device profiling. |
| Lesson review | Ten sourced drafts; no educator approval recorded. | Qualified primary music review and actual checks. |
| Curriculum alignment | Primary identifiers checked in the research report/plan; activity mapping is draft and partial. | Educator review, full coverage evidence and jurisdiction-specific mapping. |
| Samples | VCSL is an approved source candidate; no samples bundled here. | Exact-file inspection, revision/hash/rights manifest and pitch/quality checks. |
| Font files | Source/licence checked; binaries not bundled. | Pin/self-host exact files with notices. |
| Primary privacy code | OAIC page describes finalisation due by 10 December 2026. | Recheck final instrument/commencement and deployment obligations. |
| Physical technique | Not taught/verified by virtual inputs. | Separate physical-instrument study and appropriate human teaching. |
| Comparative advantage | Combination-level hypothesis. | Hands-on competitor and learner comparison. |
| Gestures/AR/community | Optional local hand gesture experiment now specified; immersive AR and community services remain future. | Actual benefit, access, operational and device evidence. |

These gaps must not be silently converted into fake content, permissions or results. They also do not prevent building the local, bounded prototype from the supplied brief.

## 15. Sources and evidence handling

The accompanying `references/sources.csv` is the source index for the identifiers used here. It distinguishes official-page review, indexed extract, documentation and inherited user notes. Research references are not a reusable asset catalogue. The prior reports' broad counts (120 entries in one, 148 screened/115 retained in the other) describe those earlier scans; this task does not claim to have independently re-reviewed all of them.

The two user-supplied research-bank markdowns were identical after whitespace normalisation and are preserved once. The earlier design alternatives are preserved separately; the current recommendation resolves them. Public source content has been paraphrased selectively; no third-party song recordings, screenshots, font binaries or commercial lesson libraries are included.

### Core source links

| ID | Source and permitted role |
|---|---|
| OMT_HOME | [Open Music Theory](https://openmusictheory.github.io/) — original contributor/editor information and CC BY-SA 4.0 notice. |
| OMT_RHYTHM | [Rhythmic values](https://openmusictheory.github.io/rhythmicValues.html) — factual note/rest values; adapt with attribution/ShareAlike, omit separate media. |
| OMT_PITCH | [Pitches and octave designations](https://openmusictheory.github.io/pitches.html) — keyboard/register facts; CC BY-SA 4.0. |
| OMT_NOTATION | [Basic notation](https://openmusictheory.github.io/basicNotation.html) — stave/clef/ledger-line facts; CC BY-SA 4.0. |
| OMT_METER | [Meter and time signatures](https://openmusictheory.github.io/meter.html) — metre reference; third-party recordings/embeds excluded. |
| ACARA_ARTS | [The Arts: learning-area information](https://www.australiancurriculum.edu.au/curriculum-information/understand-this-learning-area/the-arts) — curriculum orientation, not a full mapping. |
| ACARA_TERMS | [ACARA copyright and terms](https://www.australiancurriculum.edu.au/copyright-and-terms-of-use/) — licence exclusions, attribution, ICIP and no endorsement. |
| AERO_EXPLICIT | [Explicit instruction practice guide](https://www.edresearch.edu.au/guides-resources/practice-guides/explicit-instruction-practice-guide-full-publication) — teaching sequence guidance. |
| AERO_SCAFFOLD | [Scaffold practice](https://www.edresearch.edu.au/guides-resources/practice-guides/scaffold-practice) — support and gradual removal. |
| VCSL | [Versilian Community Sample Library](https://versilian-studios.com/vcsl/) and [repository](https://github.com/sgossner/VCSL) — CC0 candidate samples, file-level import still required. |
| OAIC_CODE | [Children's Online Privacy Code](https://www.oaic.gov.au/privacy/privacy-registers/privacy-codes/childrens-online-privacy-code) — status must be rechecked before deployment. |
| OAIC_CHILDREN | [Children and young people](https://www.oaic.gov.au/privacy/your-privacy-rights/more-privacy-rights/children-and-young-people) — consent-capacity guidance. |
| OAIC_APP8 | [APP 8 guidance](https://www.oaic.gov.au/privacy/australian-privacy-principles/australian-privacy-principles-guidelines/chapter-8-app-8-cross-border-disclosure-of-personal-information) — cross-border handling, not blanket localisation. |
| ESAFETY | [Safety by Design](https://www.esafety.gov.au/industry/safety-by-design) — provider responsibility, user control and accountability. |
| AI_SCHOOLS | [Australian Framework for Generative AI in Schools](https://www.education.gov.au/schooling/resources/australian-framework-generative-artificial-intelligence-ai-schools) — responsible school-use context. |
| WCAG22 | [WCAG 2.2](https://www.w3.org/TR/WCAG22/) — complete-flow accessibility requirements. |
| CLAUDE_MEMORY | [Claude Code project memory](https://code.claude.com/docs/en/memory) — concise project instructions, detailed context loaded deliberately; imports do not save context. |

See the CSV for competitor pages, design precedents, font/code licences, technical references and research links. Reverify unstable product/legal facts when implementation or deployment occurs. A source identifier in a child screen is not useful pedagogy; keep provenance in structured content and adult credits.


## 16. Current AI musical interaction contract

Status: proposed implementation contract; no model, app execution or measured result supplied.
Scope: Foundation-Year 6 suite, variable complexity and an older extension.

### Product behaviour
Learners play or construct their own short phrase on real sampled instruments.
They choose a musical intention and can direct, reject or revise the partner.
A teacher-selected objective constrains the system's musical reply and the evidence it can collect.
The system supports musical conversation, but AI jamming and gestures are established precedents.
The candidate advantage is the reliable teaching/evidence loop, not novelty of a bandmate.

### Modes
- explore: musical play; no accuracy grade or hidden ability score.
- controlled_contrast: a declared symbolic transformation with explicit invariants.
- accompaniment: add a separate response part while preserving student-authored parts; no single-variable perceptual claim.
- guided_practice: a known target with one feedback priority and optional teaching cues.
- independent_check: a fresh related task; no teaching hints or answer-generating partner; retain access adjustments.

Mode must be part of the attempt record. A learner's changed intention does not retroactively make an imitation score a creativity judgement.

### Canonical events
Use integer musical ticks, default 480 per crotchet, plus unmodified input timestamps for live attempts.
A phrase records meter, total ticks, instrument, event kind, onset, duration, optional MIDI pitch,
intentional dynamic value and authorship. Keep the original event snapshot immutable.
Rest events are silent time in the phrase; they are not submitted note-ons.
The retained lesson seeds express time in beats. Import them losslessly into canonical ticks and retain their source versions; do not silently round unrepresentable timing.

An event stream is not evidence of fingering, posture, physical technique or emotion.

Represent these separately:
- authored musical material;
- raw live input and its clock/calibration conditions;
- quantised/assisted playback;
- model/teacher-added material;
- learner explanation and choice;
- independent evidence.

Derive playback, notation and inspection from canonical events without overwriting raw attempts.

### Interaction pipeline
1. Validate the task and capture the student's phrase.
2. Compute supported musical facts locally.
3. Ask for a learner prediction/intention when appropriate; allow an accessible response or skip.
4. Select an approved goal and response family.
5. Invoke the local learned planner/model outside the audio hot path.
6. Validate the returned plan against the request, task, prerequisites and actual phrase.
7. Compile the plan into a bounded musical response and verify the promised invariants.
8. Play through the sample engine; label the partner's contribution.
9. Let the learner compare, direct, reject or revise.
10. Offer a fresh independent task and update evidence only from what it measures.

Audio must not wait for steps 5-7. Start with replies between phrases; continuous tempo-following is a separate future feature.

### Minimum genuine AI contribution
The claimed AI route requires actual learned-model inference that materially influences the selected
musical response or response plan, conditioned on the phrase and goal.
A rules baseline remains mandatory for comparison.

A trained model selecting an approved operation is learned planning, not unrestricted melody generation.
A model predicting notes is note generation, not proof that its answer teaches the concept.
A synthetic timing classifier is a descriptive baseline, not a validated diagnosis of learning.
Camera landmark inference alone does not demonstrate the claimed pedagogical AI feature.

Do not add an external API to bypass the local-child-data requirement.
If no viable local route passes the feasibility gate, retain the useful guided core and mark the AI path blocked/experimental.
Do not fake inference with prerecorded replies or fixture outputs.

### Candidate model routes
Route A: a compact local learned planner proposes approved operation/parameter IDs, with reviewed examples
and explicit limits. It can adapt a musical response without generating the acoustic audio.
The training/evaluation data must be licensed and documented; synthetic data alone cannot validate
learner needs or causal educational benefits.

Route B: a small local symbolic music model proposes note events, then task checks admit/reject them.
Magenta Music documents browser note models, but exact dependencies, checkpoints and rights require a spike.
A generic continuation model is not inherently conditioned on a teaching objective. [U16-U17]

Route A is the smaller initial engineering target; its usefulness still has to beat an inspectable rules policy.
Do not choose an architecture solely to obtain an AI label.
Large audio models, cloud generations and continuous multi-agent ensembles are outside the default MVP.

### Response contract
content/music_reply.schema.json defines a response plan, not executable code.
A response includes request/phrase hashes, goal ID, provenance kind, model card ID where applicable,
operation/parameters, referenced evidence and an approved feedback-template ID.

Runtime validation must reject:
- unknown/stale request or phrase hashes;
- unknown goals, operations, templates or evidence IDs;
- an output marked model without a loaded approved model/version;
- fixture provenance on a production model path;
- invalid pitch, tick, duration, gain, event count or phrase length;
- incompatible instruments/access settings;
- missing or altered student-authored material where preservation is required;
- changes outside the task's permitted symbolic fields;
- no change when the task claims a contrast;
- an answer/hint on an independent-check path.

Use a maximum of two bounded repair attempts. Then offer a reviewed local fallback with accurate provenance.
Never display an invalid response merely because the AI explanation sounds plausible.

### Initial operations
transpose: change MIDI pitches by a bounded interval; preserve onsets, durations, instrument and authored order.
dynamics: change intentional dynamic values; preserve pitch/time/instrument. Acoustic timbre may also change naturally.
replace_with_rest: silence an identified event while retaining its time slot and all unaffected events.
section_order: reorder unchanged, learner-authored blocks; preserve each block's internal events.
add_part: add a separate, labelled partner track while preserving the student's original tracks.
echo: replay without a change; it cannot be labelled as a contrasting example.

The verifier proves only the declared symbolic relation. It does not certify expressive quality or pedagogical efficacy.

### Feedback and student control
Use one supported observation, a musical demonstration or comparison, and choices over next action.
The learner can turn the partner off, repeat, slow playback, choose other help or retain their own interpretation.
Do not score original composition by agreement with an AI preference.
Intent is selected or reported by the learner; timing alone cannot reveal it.
Do not produce a conversational child-friend persona or open-ended child chat.

### Optional gesture experiment
Default OFF. An adult/learner deliberately enables the camera with an understandable explanation.
Process only the needed hand signal locally; no raw-frame saving/upload and no emotion/identity inference.
Start with one continuous expressive control, such as dynamics, plus an on-screen/keyboard equivalent.
Do not use camera timing as a replacement for accurate percussion note-on assessment.
Use a worker or otherwise measured scheduling strategy so vision does not block audio.
Pause on inactivity; stop tracks on exit/disable. Handle low confidence, occlusion and lost tracking safely.
Record a meaningful control value only if needed; avoid storing raw landmark streams.

Gesture control is an access/interaction experiment, not a uniqueness claim. [U09-U10; U21]

### Teacher view
Show goal, phrase, verified operation, model contribution, support settings, learner decisions,
independent-check evidence and uncertainty. Let teachers change sequence/support and override recommendations.
Local adult navigation is not secure remote class administration. No backend auth is supplied by this pack.

### Acceptance evidence
The coding agent must produce a real model card and measured runtime report, versioned screenshots or logs
of the working flow, invariant-check outcomes, fallback behaviour, offline/network observations and rights records.
The fixtures are examples for verification; they are not successful executions, model outputs or learner results.


## 17. Feasibility and sustainability contract

Research checked 9 November 2026. Engineering budgets below are proposed, not measured or established standards.

### Fixed constraints
Existing-device access, authentic sampled sound, learner authority, teacher control and local child-data processing remain the defaults.
No required physical instrument, camera, microphone, headset or external AI account.
Core music, reviewed content and saving work offline after preparation.
No cloud AI calls or uploaded child sessions in the default MVP.

### Technical options
| Option | Evidence/benefit | Decision |
|---|---|---|
| Small local learned response planner | A bounded model can select approved musical operations; educational benefit remains unproven. | First feasibility target; compare against rules and record actual inference. |
| Legacy Magenta note models | Browser symbolic inference is documented. [U16-U17] | Candidate spike only; inspect versions, dependencies, checkpoint rights and memory. |
| Magenta RealTime 2 | Live local audio models exist; 230M and 2.4B variants have documented Apple-Silicon routes. [U18-U20] | Research comparator; not the default school-browser engine. |
| Browser gesture model | Recognised hand signals can drive expressive controls; synchronous calls can block the UI. [U21] | Optional worker-based experiment with equivalent touch/keyboard access. |
| ONNX Runtime Web | Different backends support different devices/operators. [U22] | Runtime option only after an actual model/export/operator spike. |
| WebXR/headset instrument | Relevant research exists. [U14-U15; U23] | Future research; no headset dependence or AR uniqueness claim. |
| Large continuous audio generation | Adds exactness, hardware, licensing and operational challenges. | Excluded from the initial local-browser learning path. |

Do not use the 2025 Magenta RT hardware description as a complete account of the 2026 state.
MRT2 is newer and more local-capable, but Apple-Silicon support is not Chromebook or browser support.
A nominal model size or runtime feature list is not a benchmark.

### Gate before model integration
Time-box an initial feasibility investigation; one or two working days is a planning estimate, not a promise.
1. Inspect the real repository, build constraints and intended deployment devices.
2. Identify exact model, runtime, checkpoint, dependencies and rights.
3. Run real cold/warm inference on representative low-cost hardware.
4. Demonstrate an actual phrase-conditioned response and record how often constraints reject it.
5. Compare latency, correctness and choices with a rules baseline.
6. Confirm offline loading and lack of child-data network transfer.
7. Choose, revise or reject the route based on evidence.

Synthetic training can demonstrate engineering behaviour, not a validated model of a child's understanding.
Do not split near-duplicate versions of the same phrase family across training and test sets.
Any educator-labelled response policy needs clear labelling rules and held-out contexts.
Do not train or fine-tune on child sessions in this MVP.

### Initial budgets to test
- Sound: aim for responsive direct playback; an initial p95 end-to-end target of 50 ms is proposed.
  Browser callback duration is not end-to-end acoustic latency.
- Replies: initial warm p95 target of 2 seconds between phrases; provide visible waiting and a 5-second timeout.
- Downloads: aim for a core first-use bundle around 10 MB and optional additional model/sounds within a declared total budget.
  Select actual limits with device/access testing; do not claim a chosen model already fits.
- Memory: record incremental model memory and browser stability, not only parameter count.
- Gesture: start with a modest sampling rate and one expressive mapping; tune from measurements rather than assuming precision.
- Musical verification: zero known broken invariants admitted to the controlled-contrast flow; report rejected/abstained outputs too.

Every number is a proposed acceptance target. The pack supplies no measured app/model result.

### Authentic sound
Keep synthesis/generation separate from the teaching model. Imported acoustic samples need suitable attack/decay,
note release, tuning, articulations and appropriate dynamics on target devices.
VCSL is a CC0 candidate, not a guarantee that every sound has many velocity layers. [U25]
Stage optional richer packs; avoid making a large download the entrance fee to musical participation.
Use intentional dynamic controls rather than pretending ordinary touch force measures piano technique.

### Reliability and maintenance
Keep model, music compiler, verifier, audio engine, content and storage behind distinct interfaces.
Pin exact dependencies and hashes after selection. Maintain model/sample/font notices separately.
Self-host required files, retain a reproducible build and feature-detect optional browser capabilities.
A fallback is reviewed deterministic support and must be labelled that way.
Do not silently exchange models or claim offline capability while fetching an unbundled checkpoint.

Content is a continuing operational responsibility: educator authorship, editorial review, cultural permissions,
curriculum-version mapping, accessible alternatives and teacher training all require resources.

### Financial sustainability
On-device processing avoids a per-turn vendor inference bill in the default architecture, but does not make delivery free.
Count content review, software maintenance, hosting/downloads, privacy/security, accessibility, training and school support.

For a possible future cloud route only:
N = active learners x sessions per period x model turns per session.
Variable model cost = N x measured fully loaded cost per turn, including repairs and retries.
Example assumptions: 200 learners x 20 sessions x 12 turns = 48,000 turns per period.
At assumed A$0.001, A$0.005 or A$0.02 per turn, that is A$48, A$240 or A$960.
These are sensitivity assumptions, not quoted provider prices, a recommended price or a permission to introduce cloud processing.
Include school onboarding/support and content amortisation before estimating margin.

A school/programme licence and budgeted pilots are hypotheses. Confirm budget owner, procurement route,
renewal reason and willingness to pay. Grants and competition prizes are not recurring customer demand.
Do not publish market-size, savings or return-on-investment figures without relevant evidence.

### Environmental and access sustainability
Avoid continuous inference and camera use when a short musical turn suffices.
Measure device load, thermal behaviour, battery and download size on intended devices.
Local execution is not inherently lower carbon; do not claim carbon neutrality or a quantified environmental advantage.
A technology that needs a new device can undermine the access objective even if it is technically impressive.

### Evaluation before scaling
Test usability across all primary bands and an older group, with relevant disabled learners and support people.
Compare the same lesson/time/input adjustments using rules and learned planning.
Measure independent application, delayed retention, meaningful choices, teacher time and operating cost separately.
Adopt the gesture feature only where it improves participation or an educational task over equivalent controls.

### Readiness boundary
A successful pack validator checks data consistency. It does not certify audio, AI, pedagogy, accessibility,
privacy compliance, school approval, commercial viability or global uniqueness.


## 18. Whole-primary progression and implementation status

Every band needs listening/context, skills, making and appropriate sharing/performance. The identifiers below are checked content-description references, not product certification or completed achievement.

| Band | Suggested starter mission | Checked identifiers |
|---|---|---|
| Foundation | F_SOUND_STORY | AC9AMUFE01, AC9AMUFD01, AC9AMUFC01, AC9AMUFP01 |
| Years 1-2 | P12_RHYTHMIC_CONVERSATION | AC9AMU2E01, AC9AMU2E02, AC9AMU2D01, AC9AMU2C01, AC9AMU2P01 |
| Years 3-4 | P34_MELODIC_REPLY | AC9AMU4E01, AC9AMU4E02, AC9AMU4D01, AC9AMU4C01, AC9AMU4P01 |
| Years 5-6 | P56_FORM_AND_TEXTURE | AC9AMU6E01, AC9AMU6E02, AC9AMU6D01, AC9AMU6C01, AC9AMU6P01 |

Use the full eight-domain matrix in the research report and structured primary-suite plan. First Nations E02 coverage needs authorised material and appropriate context; the plan does not claim it is supplied. Preserve vocal, physical and group experiences where relevant. The older extension is not complete secondary/senior curriculum coverage.

The implementation status remains pre-build: source-informed drafts, no weights/samples/fonts, no executed app, no measured device results, no child testing and no educator approval. The archive validator is a data-consistency check only.
