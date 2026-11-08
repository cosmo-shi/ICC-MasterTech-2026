# Merged flowchart v0: the teammate spec as the frame, the overnight coach as the engine

Written 2026-11-08 20:20 by the session for Carlos, from the folder's own files only. Diagrams are Mermaid: GitHub renders them in the repo view; VS Code needs a Mermaid preview extension; or paste a block into a Mermaid live editor. Proposals until the team decides; the three open team calls are marked on the diagrams.

## 0. How to read this (conclusion first)

- Frame = the spec's modules and roles (ONB, INS, PLY, LSN, ASM, AIC, HNT, PRG, TCH, PRV, OFF).
- Engine = the overnight loop inside ASM, AIC, HNT and PRG: rules measure, one fix, no score, retake, stop rule, practice record.
- Five diagrams: product map (1), learner session loop (2), engine detail (3), data flow (4), stage versus desk (5).
- Marked on the diagrams: team call 1 input, team call 2 counts, team call 3 buyer (spec-review-v0 s2).

| Diagram | From the spec | From the overnight files |
|---|---|---|
| 1 Product map | Module names, roles, prototype scope | Which modules the engine lives in; the drop of the guitar |
| 2 Session loop | Onboarding without an account, lesson and task entry, hint ladder | Goal in own words, one fix card, retake card, stop rule, hand-off |
| 3 Engine | Attempt record FR-ASM-04, de-identified AI call | Rules decide, the model explains, validator, packet, record |
| 4 Data flow | Starter data flow s6.4 (device versus off device) | Practice record stays, summary leaves on send only |
| 5 Stage and desk | Prototype scope: front end only, offline fallback | Laptop plus USB MIDI keyboard, saved labelled call, 60 s demo |

## 1. Product map: where the engine sits inside the frame

```mermaid
flowchart TB
  subgraph FRAME["Teammate spec: the frame (modules and roles)"]
    ONB["ONB onboarding: no account, age band, consent"]
    INS["INS instrument selection"]
    PLY["PLY instrument play: on-screen keyboard and drum pads"]
    LSN["LSN lessons: note reading, rhythm"]
    ACC["ACC adaptable controls"]
    OFF["OFF offline use"]
    PRV["PRV privacy and consent"]
    GAM["GAM gamification, opt-in badges as can-do statements"]
    TCH["TCH teacher tools"]
    COM["COM community and verified mentors (mock)"]
  end
  subgraph ENGINE["Overnight coach: the engine (inside ASM, AIC, HNT, PRG)"]
    ASM["ASM performance checking = rules engine measures the take"]
    AIC["AIC coach = one fix card, plain words, model explains"]
    HNT["HNT hint ladder = ask before tell, ten-second task"]
    PRG["PRG results = evidence and retake change, never a score"]
    REC["Practice record on the device (proposed FR-AIC-15)"]
    STOP["Stop rule: third miss, ask a person (proposed FR-AIC-14)"]
  end
  ONB --> INS --> PLY --> LSN --> ASM
  ASM --> AIC --> HNT --> PRG
  PRG --> REC --> ASM
  AIC --> STOP --> COM
  REC -. "mentor summary on send only (FR-AIC-16)" .-> COM
  PRG -. "counts move here (team call 2)" .-> TCH
  MIDI["Real instrument input: USB MIDI keyboard (team call 1)"] --> ASM
  MIC["Microphone input: voice, phone path"] --> ASM
  PLY --> ASM
  GUITAR["Guitar on glass: proposed drop"] -.-> INS
  ACC --- PLY
  OFF --- ASM
  PRV --- REC
  GAM --- PRG
```

- The spec keeps every module name and ID; the overnight work changes what four of them do inside.
- Three inputs feed one checker: on-screen keys, a MIDI keyboard, the microphone; the loop is the same.

## 2. Learner session loop: one practice session, not a chat

```mermaid
flowchart TD
  A["Open the app: no account, pick age band, consent screen (ONB)"] --> B["Goal in the learner's own words and today's step"]
  B --> C{"Input today?"}
  C -->|"on-screen keys or pads (PLY)"| D["Lesson or task: note reading or rhythm (LSN)"]
  C -->|"real instrument: MIDI keyboard or microphone"| D
  D --> E["Count-in, then one take (big Play it button)"]
  E --> F["Rules engine measures the take and picks one cause (ASM)"]
  F --> G["Fix card: what happened, one ten-second fix, Try again (AIC, HNT)"]
  G --> H{"What does that mean?"}
  H -->|"tap"| I["Glossary line or model sentence in plain words, then back"]
  I --> G
  H -->|"no"| J["Retake"]
  J --> K["Learner says what changed first, then the coach shows it (PRG)"]
  K --> L{"Same cause three times?"}
  L -->|"no"| M["Got it? mark, record updated, next step"]
  M --> B
  L -->|"yes"| N["Card becomes: Let's ask a person"]
  N --> O["Hand-off card preview: goal, last causes, what was tried, own words"]
  O --> P{"Learner or guardian taps Send?"}
  P -->|"no"| M
  P -->|"yes"| Q["Summary goes to teacher or verified mentor (TCH, COM)"]
  Q --> M
```

- No number, grade, star or pass or fail appears anywhere on this path (sunday-notes s3).
- The spec's hint ladder sits between the fix card and the retake; the model never decides.
- Small line under the card: nobody sees this unless you send it.

## 3. Engine detail: rules decide, the model explains

```mermaid
flowchart LR
  T["Take: notes and timing from keys, MIDI or microphone"] --> R["Rules engine: on-beat window, pass rule, cue rules"]
  R --> C1["One cause chosen (for example beats 3 and 4 early)"]
  C1 --> S["Learner state update: cause counts, got-it marks, words tapped"]
  Q["Learner question, typed or spoken"] --> RT["Rules router"]
  RT -->|"pain, tiredness, technique"| HO["Hand-off to a person, model never sees it"]
  RT -->|"ordinary question"| PK
  S --> PK["Packet: cause and numbers, goal, age band, top patterns, cue book, vocabulary"]
  PK --> ON{"Online and cloud consent on?"}
  ON -->|"no"| GL["Glossary and cue-book line (offline fallback, OFF)"]
  ON -->|"yes"| M["Model: one sentence and one task, de-identified packet only"]
  M --> V["Validator: length, plain words, no notes or lyrics, no technique or health advice"]
  V -->|"fail"| GL
  V -->|"pass"| FC["Fix card"]
  GL --> FC
  FC --> LOG["Exchange logged for the educator"]
  S --> AR["Attempt record keeps every note and timing (FR-ASM-04)"]
  AR --> TV["Teacher view: counts and hard concepts (FR-TCH-04), class aggregates only (FR-TCH-05)"]
  TV --> CB["Teacher promotes lines that worked into the cue book for the next release"]
  CB --> R
```

- Rules are fixed between releases; the learner state changes every take; the model is stateless (morning-notes s9).
- Under 15: typed text and measured numbers only, cloud off by default (morning-notes s8).

## 4. Data flow: on the device versus off the device

```mermaid
flowchart LR
  subgraph DEV["On the device (spec s6.4 plus the practice record)"]
    I1["Instruments and lessons"]
    I2["Rules engine and attempt record"]
    I3["Practice record: causes, fixes, words tapped, goal, preferences"]
    I4["Glossary and offline hints"]
  end
  subgraph OFFD["Leaves the device"]
    O1["De-identified packet to the AI service: online, consent on"]
    O2["Mentor summary: only when the learner or guardian taps Send"]
    O3["Class aggregates to the teacher view: only when sharing is on"]
  end
  I2 --> O1
  I3 --> O2
  I2 --> O3
  NEVER["Never leaves: audio, video, names, school, labels about the child"]
```

- One box for the spec's data-flow page: the record stays; the summary leaves only on send (sunday-notes s5).
- The record is openable by the child or guardian in plain words at any time (proposed FR-PRG-06).
- It ages, never ranks, and deletes or exports in one tap (FR-PRG-05, FR-TCH-05).

## 5. Stage versus desk: what runs where this week

```mermaid
flowchart TB
  subgraph STAGE["Stage, 3-minute pitch (Wed 11 Nov)"]
    S1["Laptop Chrome on localhost, USB MIDI keyboard (team call 1)"]
    S2["Demo phrase: bars 1 and 2 of Ode to Joy, public domain, own synth"]
    S3["Take 1 with a planted wrong key, not note 1"]
    S4["Fix card, one line"]
    S5["Live retake, what changed, one line, no numbers"]
    S6["Saved, labelled model call (no live network)"]
    S1 --> S2 --> S3 --> S4 --> S5
    S6 -.-> S4
  end
  subgraph DESK["Desk conversations (Mon 9 to Wed 11 Nov)"]
    D1["Same page on a phone: on-screen keys or microphone path"]
    D2["Live model call if the venue network allows, labelled live"]
    D3["Saved answers as the fallback"]
    D4["Teacher view and mentor hand-off as mock screens"]
    D1 --> D2
    D2 -.-> D3
    D1 --> D4
  end
  FB["Fallback: keyboard not detected, on-screen keys take over"] -.-> S1
```

- Stage input is team call 1; the on-screen keys are the fallback either way (freeze-and-rehearsal-playbook).
- Desk is where the phone-first story and the no-instrument access line are shown (morning-notes s7).

## 6. Team calls marked on the diagrams

| Call | Where it shows | Proposed call (spec-review-v0 s2) |
|---|---|---|
| 1 Input | Diagram 1 MIDI node, diagram 5 stage | MIDI keyboard on stage, on-screen keys as input and fallback |
| 2 Counts | Diagram 1 dotted edge to TCH, diagram 3 teacher view | Counts move from the learner's results to the teacher view |
| 3 Buyer | Not drawn: changes the pitch, not the flow | Sponsor outreach team, home-practice framing, teacher as user |
| 4 Coach look | Diagram 2 fix card | Tap answers on the fix card, typed text as the fallback |

## Method

- Written by the session from the named project files, opened 2026-11-08; no Codex, no local model, no web search.
- Diagram shapes follow the files; nothing new was decided here. Node text uses the spec's module IDs where one exists.
- Not rendered to an image on this PC; view on GitHub, in a Mermaid preview, or in a Mermaid live editor.

## Open questions

- Which input does the team put on stage (call 1), and does that change diagram 5 only or diagram 1 too?
- Does the team accept the counts move (call 2) so FR-PRG-01 changes in the spec?
- Who redraws the spec's data-flow image (s6.4) from diagram 4, and in which tool?
- Should diagram 2 become the user flow the spec's order of work asks for in step 3?

## Sources

- Music-App-Requirements-Specification/index.md s2 (roles, prototype scope), s3 module list, s6.4 starter data flow, s6.5 order of work, opened 2026-11-08.
- sunday-notes-2026-11-08.md s1 to s5 (direction, on-screen instrument, no-score rule, practice record, seven rows), opened 2026-11-08.
- morning-notes-2026-11-07.md s7 (screen top to bottom), s8 (rules decide, model explains), s9 (flow per prompt), opened 2026-11-08.
- spec-review-v0.md s2 (three collisions and the fourth), opened 2026-11-08.
- demo-instrument-decision.md and freeze-and-rehearsal-playbook.md for the stage nodes, as summarised in RESUME.md, opened 2026-11-08.
