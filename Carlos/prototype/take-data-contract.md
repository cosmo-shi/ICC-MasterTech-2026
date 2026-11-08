# Take data contract (one structure for voice, keyboard, feedback, engine and hand-off)

- Date: Fri 6 Nov 2026 (overnight draft). Purpose: the one data contract the Saturday coder pastes in; every module speaks it.
- Scope: five objects (Phrase, Take, Features, Cue, Plan), timing rules, pitch rules, invariants plus validator, reconciliation, sixteen fixtures, change rule.
- Status: overnight draft for the team; verify before the pitch. The validator and fixtures were run in Node on mocked data only; nothing ran in a browser, on a phone or on a real take.
- Conclusion: snake_case everywhere, integer milliseconds from "audible beat zero", MIDI numbers with cents, one cue per take, features never carry audio.

## 0. The ten rules in one place
- Naming: snake_case for every key; ids are strings; absent value = `null`, never a missing key (except optional objects marked so).
- Time: integer milliseconds. Take events are measured from audible beat zero (section 2). Dates are ISO 8601 strings.
- Pitch: MIDI number (float for voice, integer for keys), name `C4` = 60, cents signed (plus = sharp), in tune = within 50 cents.
- Percent fields (`*_pct`) run 0 to 100; measures `m` run 0 to 1; confidence runs 0 to 1.
- One take gives one cue; an empty take gives the set-up cue M1, never a music cue.
- Features travel, audio never does: no field in Features, Cue or Plan may hold samples, a waveform or a recording.
- The phrase is any phrase: nothing in the contract names Twinkle or Ode; the demo phrase is data (demo-phrase-and-rights.md section 4).
- Input method is invisible to the feedback layer: it reads Features only.
- Thresholds live in one JSON file (build-plan-v0.md section 7), not in code; the contract fixes names and units, not tuning values.
- Anything marked `unverified` or "team choice" is tuned on Saturday's real takes.

## 1. The five objects
- Leave-device column key: N = stays on the device; LLM = leaves with the LLM call (derived numbers, note names, typed text; goes overseas, only when the cloud coach is on); Y = static public content.
- Source of the column: privacy-design-v1.md section 5.1 (data-flow table) [7]: audio never leaves; features, rule candidates, typed goal, typed words, last two cues and level go with the LLM call; learner ids are pseudonymous ("Learner 12" style); no first names anywhere in the contract or the fixtures.
- The hand-off is outside these five objects: one clip of 10 to 30 s is shared by an expiring link only on explicit per-clip opt-in; the contract carries the fix list and proof lines, never the audio.
- The LLM request envelope (what the proxy forwards): `features` (section 1.3), `rule_candidates` (top three rule IDs with tier), `small_goal` text, `learner_goal` text, `learner_words` (200 characters at most), `last_two_cues` (cause_class and proof), `retake_of` (previous proof), `level`. Nothing else, no ids beyond the random device id.

### 1.1 Phrase (what should have been played)
- Static data in `data/phrases.json`; written by the team, read by every module. The paste-ready lists in demo-phrase-and-rights.md section 4 convert with `start_beat`/`dur_beats` (camelCase to snake_case).

```json
{ "schema": "phrase/v1", "id": "twinkle-b3-4", "title": "Twinkle, bars 3-4", "key": "C",
  "bpm": 90, "beats_per_bar": 4, "ease": 1,
  "notes": [ { "midi": 65, "name": "F4", "start_beat": 0, "dur_beats": 1 },
             { "midi": 65, "name": "F4", "start_beat": 1, "dur_beats": 1 },
             { "midi": 60, "name": "C4", "start_beat": 6, "dur_beats": 2 } ] }
```
- The example shows 3 of the 7 notes; the full list is the phrase block in section 6.

| Field | Type | Unit | Range | Req | Written by | Read by | Leaves device |
|---|---|---|---|---|---|---|---|
| `schema` | string | - | "phrase/v1" | yes | team | validator | Y |
| `id` | string | - | unique | yes | team | all | Y |
| `title` | string | - | text | no | team | UI | Y |
| `key` | string | - | "C" etc | yes | team | engine, UI | Y |
| `bpm` | number | beats per minute | 30 to 200 | yes | team | engine, audio | Y |
| `beats_per_bar` | integer | beats | 2 to 7 | yes | team | audio, UI | Y |
| `ease` | integer | rank | 1 = easiest | no | team (score formula, build-plan section 6) | engine | Y |
| `notes[].midi` | integer | MIDI note | 0 to 127 | yes | team | matcher, UI | Y |
| `notes[].name` | string | note name with octave | `C4` | no | team | UI | Y |
| `notes[].start_beat` | number | beats from phrase start | 0 or more, sorted | yes | team | matcher | Y |
| `notes[].dur_beats` | number | beats | more than 0 | yes | team | matcher | Y |

### 1.2 Take (what was played; one per attempt)
- Stored in IndexedDB `take`; written by the input adapter (voice or keyboard), read by the matcher. Audio is never a field: `audio_blob` in build-plan-v0.md stays a separate, default-null store on the device.

```json
{ "schema": "take/v1", "id": "t-0007", "phrase_id": "twinkle-b3-4", "small_goal_id": "sg-3",
  "session_id": "s-002", "instrument": "keyboard", "input": "midi",
  "started_at": "2026-11-09T10:21:05+11:00", "take_no": 1, "is_retake_of": null, "counts": true,
  "bpm": 60, "beats_per_bar": 4, "count_in_beats": 4, "duration_ms": 8000, "tempo_pct": 67,
  "latency": { "method": "output_timestamp", "correction_ms": 0, "output_ms": null,
               "input_ms": null, "clock_drift_ms": 0 },
  "notes": [ { "i": 0, "pitch_midi": 64, "onset_ms": 12, "onset_raw_ms": 12, "dur_ms": 900,
               "velocity": 80, "rms": null, "conf": 1, "wobbles": null, "pitch_series_midi": null } ] }
```

| Field | Type | Unit | Range | Req | Written by | Read by | Leaves device |
|---|---|---|---|---|---|---|---|
| `schema`, `id` | string | - | "take/v1", unique | yes | adapter | all | N |
| `phrase_id`, `small_goal_id`, `session_id` | string | - | existing ids | yes | app | matcher, engine | N |
| `instrument` | enum | - | "voice", "keyboard" | yes | adapter | features, rules | LLM |
| `input` | enum | - | "mic", "midi", "screen" | yes | adapter | clock mapping | N |
| `started_at` | string | ISO 8601 | - | yes | app | engine (due dates) | N |
| `take_no` | integer | count | 1 or more | yes | app | rules (V1, persistence) | LLM |
| `is_retake_of` | string or null | take id | - | yes | app | cue (proof) | N |
| `counts` | boolean | - | false if empty, M1, M2 or off-day | yes | engine | progress | N |
| `bpm` | number | beats per minute | 30 to 200 | yes | app | beat maths | LLM |
| `beats_per_bar`, `count_in_beats` | integer | beats | default 4 count-in | yes | app | beat maths | N |
| `duration_ms` | integer | ms from audible beat zero | 0 or more | yes | adapter | validator | N |
| `tempo_pct` | number | percent of phrase bpm | 40 to 150 | yes | app | engine | N |
| `latency.method` | enum | - | "output_timestamp", "output_latency_estimate", "loopback", "none" | yes | adapter | M2, debug | N |
| `latency.correction_ms` | number | ms | -1500 to 1500 (Bluetooth can exceed 500) | yes | adapter | debug | N |
| `latency.output_ms`, `.input_ms`, `.clock_drift_ms` | number or null | ms | - | yes | adapter | debug | N |
| `notes[].i` | integer | index | equals array index | yes | adapter | all | N |
| `notes[].pitch_midi` | number | MIDI note | 0 to 127; integer if keys | yes | adapter | matcher | N |
| `notes[].onset_ms` | integer | ms from audible beat zero, compensated | -400 or more; may be negative | yes | adapter | matcher | N |
| `notes[].onset_raw_ms` | integer | ms, before `correction_ms` | - | yes | adapter | recalibration | N |
| `notes[].dur_ms` | integer | ms | 0 or more | yes | adapter | features | N |
| `notes[].velocity` | integer or null | MIDI velocity | 0 to 127 | yes | adapter (keys) | features | N |
| `notes[].rms` | number or null | linear level | 0 to 1 | yes | adapter (voice) | features | N |
| `notes[].conf` | number | confidence | 0 to 1; 1 for a key event | yes | adapter | M1 | N |
| `notes[].wobbles` | integer or null | frames | 0 or more; voice only | yes | voice adapter | V4, V9 | N |
| `notes[].pitch_series_midi` | number[8] or null | MIDI note at 8 points | length 8 exactly | yes | voice adapter | features | N |

### 1.3 Features (derived from one take; the only thing the feedback layer sees)
- This is `take-features/v1` from tech-feedback-layer.md section 2, verbatim plus six additions, called `take-features/v1.1`. Written by the matcher; read by the rules, the LLM proxy and the engine (stored in `feature_set.features`).
- One row per EXPECTED note, same index as the phrase (`notes[i]` matches `phrase.notes[i]`); played notes that matched nothing are only counted in `summary.extra_count`.

```json
{"schema":"take-features/v1.1","instrument":"keyboard","take_no":1,"session_min":6,"target":{"phrase_id":"twinkle-b3-4","key":"C","tempo_bpm":60},
  "notes": [
    {"i":0,"target":"F4","status":"wrong","played_i":0,"cents_off":-100,"octave_off":0,"cents_series":null,"wobbles":null,"held_ratio":0.9,"onset_ms":12,"loud_rel":1,"wrong_note":true},
    {"i":1,"target":"F4","status":"hit","played_i":1,"cents_off":0,"octave_off":0,"cents_series":null,"wobbles":null,"held_ratio":0.92,"onset_ms":-20,"loud_rel":0.98,"wrong_note":false},
    {"i":2,"target":"E4","status":"hit","played_i":2,"cents_off":0,"octave_off":0,"cents_series":null,"wobbles":null,"held_ratio":0.88,"onset_ms":35,"loud_rel":1.02,"wrong_note":false},
    {"i":3,"target":"E4","status":"hit","played_i":3,"cents_off":0,"octave_off":0,"cents_series":null,"wobbles":null,"held_ratio":0.91,"onset_ms":-8,"loud_rel":0.99,"wrong_note":false},
    {"i":4,"target":"D4","status":"hit","played_i":4,"cents_off":0,"octave_off":0,"cents_series":null,"wobbles":null,"held_ratio":0.9,"onset_ms":18,"loud_rel":1.01,"wrong_note":false},
    {"i":5,"target":"D4","status":"hit","played_i":5,"cents_off":0,"octave_off":0,"cents_series":null,"wobbles":null,"held_ratio":0.89,"onset_ms":-25,"loud_rel":1,"wrong_note":false},
    {"i":6,"target":"C4","status":"hit","played_i":6,"cents_off":0,"octave_off":0,"cents_series":null,"wobbles":null,"held_ratio":0.5,"onset_ms":10,"loud_rel":0.95,"wrong_note":false}
  ],
  "summary": {"notes_in_tune":"6/7","old_tune_pct":null,"range_used":["C4","F4"],"comfort_range":null,"above_range":0,"tempo_played":60,"onset_median_ms":10,"onset_spread_ms":20,"pitch_conf_pct":100,"missed_count":0,"extra_count":0,"octave_off_notes":0}}
```
- The example is the demo take 1 (fixture F01) as the matcher derives it: note 0 is E4 where F4 was expected, so `cents_off` is -100 and `wrong_note` true.
- A missed row looks like fixture F09 below: `status` "missed"; `played_i`, `cents_off`, `onset_ms`, `held_ratio`, `loud_rel` are null.

| Field | Type | Unit | Range | Req | Written by | Read by | Leaves device |
|---|---|---|---|---|---|---|---|
| `schema` | string | - | "take-features/v1.1" | yes | matcher | proxy | LLM |
| `instrument`, `take_no`, `session_min` | enum, integer, number | -, count, minutes | as take | yes | matcher | rules, LLM | LLM |
| `target.phrase_id`, `.key`, `.tempo_bpm` | string, string, number | -, -, bpm | - | yes | matcher | LLM | LLM |
| `notes[].i` | integer | index | equals phrase index | yes | matcher | all | LLM |
| `notes[].target` | string | note name | `F4` | yes | matcher | UI, LLM | LLM |
| `notes[].status` | enum | - | "hit", "wrong", "missed" (NEW) | yes | matcher | rules, UI | LLM |
| `notes[].played_i` | integer or null | index into `take.notes` (NEW) | null if missed | yes | matcher | UI replay | N |
| `notes[].cents_off` | integer or null | cents, plus = sharp | after octave removal; null if missed | yes | matcher | V5 to V7, F2 | LLM |
| `notes[].octave_off` | integer | octaves (NEW) | -3 to 3; 0 normally | yes | matcher | X1 | LLM |
| `notes[].cents_series` | integer[8] or null | cents vs target | length 8 | yes | matcher | V8 | LLM |
| `notes[].wobbles` | integer or null | frames | 0 or more | yes | matcher | V4, V9 | LLM |
| `notes[].held_ratio` | number or null | ratio | 0 or more | yes | matcher | K5, V12, F4 | LLM |
| `notes[].onset_ms` | integer or null | ms vs expected start | negative = early | yes | matcher | V10, V11, F3 | LLM |
| `notes[].loud_rel` | number or null | ratio to take median | 0 or more | yes | matcher | K6, V4, F7 | LLM |
| `notes[].wrong_note` | boolean | - | keys only; voice always false | yes | matcher | K1, K2 | LLM |
| `summary.notes_in_tune` | string | "n/N" | - | yes | matcher | UI, LLM | LLM |
| `summary.old_tune_pct` | number or null | percent | 0 to 100 | yes | matcher | V3 | LLM |
| `summary.range_used`, `.comfort_range` | string[2] or null | note names | - | yes | matcher / range check | V2, UI | LLM |
| `summary.above_range` | integer | notes | 0 or more | yes | matcher | V2, F8 | LLM |
| `summary.tempo_played` | number or null | bpm | - | yes | matcher | K3, F3 | LLM |
| `summary.onset_median_ms`, `.onset_spread_ms` | number or null, integer or null | ms | spread = population standard deviation | yes | matcher | M2, V10, V11 | LLM |
| `summary.pitch_conf_pct` | integer | percent | 0 to 100; keys 100; empty take 0 | yes | matcher | M1 | LLM |
| `summary.missed_count`, `.extra_count`, `.octave_off_notes` | integer | notes | 0 or more (NEW) | yes | matcher | M1, X1, UI | LLM |

- Derived fields (formulas, so two coders get the same number):
  o `held_ratio` = `dur_ms` / (`dur_beats` x 60000 / `take.bpm`).
  o `loud_rel` = level of the note / median level over the take; level = `velocity` if not null, else `rms`.
  o `tempo_played` = `take.bpm` x expected span / played span, over the earliest and latest matched notes (spans in ms).
  o `notes_in_tune` counts rows with status "hit", |`cents_off`| at most 50 and `octave_off` 0.
- The proxy recomputes `summary` from `notes` and drops any key not in the schema (tech-feedback-layer.md section 2); the v1.1 additions must be added to the proxy schema before Saturday lunch.

### 1.4 Cue (the one fix: cause, fix, proof)
- Written by the rules (Layer 1) or the LLM proxy (Layer 2); read by the UI, the engine (persistence, ceiling) and the hand-off card. Fields are the engine store `cue` plus the feedback output schema.

```json
{ "schema": "cue/v1", "id": "cue-t-0007", "take_id": "t-0007", "rule_id": "K1", "cause_class": "K1",
  "miss_no": 1, "cause_text": "You started on the wrong key", "cue_text": "Find the starting key on screen before you begin.",
  "visual_hint": { "kind": "light_key", "expected_i": 0, "midi": 65 },
  "proof_metric": "Opening key right", "proof_before": "no", "proof_after": "yes",
  "proof_n": { "metric": "F1", "before": 0, "target": 1, "of": 1 },
  "handoff_flag": false, "next_goal_hint": "same", "ceiling": false, "source": "rules" }
```

| Field | Type | Unit | Range | Req | Written by | Read by | Leaves device |
|---|---|---|---|---|---|---|---|
| `schema`, `id`, `take_id` | string | - | "cue/v1" | yes | rules or proxy | engine | N |
| `rule_id` | string | - | rule ID or "PASS" | yes | rules | engine | N |
| `cause_class` | enum | - | rule IDs (M1 to M2, V1 to V12, K1 to K6, X1, X2) plus "none", "handoff", "out_of_scope" | yes | rules or LLM | engine, UI | LLM (the LLM returns it) |
| `miss_no` | integer | count | 0 to 3; 0 on a pass | yes | engine | ladder | N |
| `cause_text` | string | words | one sentence, names only what was measured | yes | rules or LLM | UI | LLM |
| `cue_text` | string | words | 20 words or fewer, no numbers with units | yes | rules or LLM | UI | LLM |
| `visual_hint` | object | - | `kind` in "light_key", "mark_note", "none" | yes | rules | UI | N |
| `proof_metric`, `proof_before`, `proof_after` | string | - | plain words | yes | rules or LLM | UI card | LLM |
| `proof_n` | object or null | counts | `before`, `target`, `of` integers | yes | rules | UI, progress | N |
| `handoff_flag` | boolean | - | true exactly when `miss_no` = 3 | yes | engine | hand-off card | N |
| `next_goal_hint` | enum | - | "same", "easier", "harder" | yes | rules or LLM | engine | LLM |
| `ceiling` | boolean | - | - | yes | engine | hand-off card | N |
| `source` | enum | - | "rules", "llm_cached", "llm_live" | yes | app | debug | N |

- Write sequence: the rules or proxy write `rule_id`, `cause_class`, texts, `visual_hint`, proof strings, `next_goal_hint`; then the engine fills `miss_no`, `handoff_flag`, `ceiling` and sets `take.counts` (the adapter writes `counts` true provisionally).
- `proof_after` holds the target text until a retake exists; the engine then overwrites it with the measured value. An LLM cue sets `rule_id` to the Layer 1 candidate it followed, else "LLM".
- A pass (no rule fires) is still a cue: `cause_class` "none", `miss_no` 0, `next_goal_hint` "harder".
- `next_goal_hint` is one word in the contract; the feedback layer's "one line" text becomes the UI string built from it.

### 1.5 Plan (the small goals and the two progress lines)
- Written by the engine (split, schedule, progress); read by the UI and the hand-off card. Fields from small-goals-engine-spec.md section 3, with progress recomputed from counting takes on every change.

```json
{ "schema": "plan/v1",
  "goal": { "id": "g-1", "text": "play Twinkle for Mum", "type": "song_for_someone", "focus_fundamental": null,
    "target_date": "2026-11-23", "date_fixed": true, "phrase_set_id": "twinkle", "plan_source": "rules", "status": "active" },
  "small_goals": [
    { "id": "sg-1", "goal_id": "g-1", "order": 1, "phrase_id": "twinkle-b3-4", "fragment": "full", "fundamental": "F1",
      "tempo_pct": 70, "pass_rule": { "id": "F1", "bar": 1 }, "why_text": "A sure start makes the rest easier",
      "is_run_through": false, "due_date": "2026-11-09", "first_due_date": "2026-11-09", "status": "open" } ],
  "progress": { "date": "2026-11-09", "goal_pct": 0, "skill_pct": 0,
    "skill_levels": { "F1": 0, "F2": 0, "F3": 0, "F4": 0, "F5": 0, "F7": 0, "F9": 0 }, "ahead_days": 0 } }
```

| Field | Type | Unit | Range | Req | Written by | Read by | Leaves device |
|---|---|---|---|---|---|---|---|
| `goal.text` | string | learner's words | 200 characters or fewer | yes | learner | LLM split, UI | LLM (typed text; names and places stripped before the call) [7] |
| `goal.type` | enum | - | "song_for_someone", "cover_sounds_good", "fix_one_thing", "play_a_song", "out_of_scope" | yes | engine | engine | N |
| `goal.focus_fundamental` | string or null | - | F1 to F9 | yes | engine | engine | N |
| `goal.target_date`, `goal.date_fixed` | string, boolean | ISO date, - | - | yes | learner / engine | schedule | N |
| `goal.plan_source` | enum | - | "rules", "llm_cached", "llm_live" | yes | engine | debug | N |
| `goal.status` | enum | - | "active", "done", "parked" | yes | engine | UI | N |
| `small_goals[].order` | integer | rank | 1 to 8 | yes | engine | UI | N |
| `small_goals[].phrase_id` | string | - | in `phrases.json` | yes | engine | matcher | N |
| `small_goals[].fragment` | enum | - | "full", "first_half", "second_half" | yes | engine | UI | N |
| `small_goals[].fundamental` | string | - | F1 to F9 | yes | engine | pass functions | N |
| `small_goals[].tempo_pct` | number | percent | 40 to 150 | yes | engine | take | N |
| `small_goals[].pass_rule` | object | - | `id`, `bar` (0 to 1) | yes | engine | engine | N |
| `small_goals[].why_text` | string | words | no banned words | yes | engine | UI | N |
| `small_goals[].is_run_through` | boolean | - | - | yes | engine | UI | N |
| `small_goals[].due_date`, `.first_due_date` | string | ISO date | - | yes | engine | schedule | N |
| `small_goals[].status` | enum | - | "open", "passed", "parked" | yes | engine | UI | N |
| `progress.goal_pct` | number | percent | 0 to 100 | yes | engine | UI | N |
| `progress.skill_pct` | number | percent | 0 to 100 | yes | engine | UI | N |
| `progress.skill_levels` | object | dots | each 0 to 3 | yes | engine | UI | N |
| `progress.ahead_days` | integer | days | 0 or more | yes | engine | UI | N |

- Progress formulas stay in small-goals-engine-spec.md section 7 (goal_pct = passed / total steps; skill_pct over fundamentals); only counting takes (`counts` true) move them.

## 2. Timing rules
### One clock, one unit
- Master clock: the AudioContext clock (`ctx.currentTime`, sample-counted). Reason: clicks are scheduled on it and voice frames are timed by sample count inside an AudioWorklet [8][9].
- Unit: integer milliseconds everywhere in a take; `ctx.currentTime` (seconds) is converted once, in the adapter, with `Math.round(s * 1000)`. Rounding to whole ms is below what a beat check can resolve.
- Zero point = audible beat zero: the instant the learner hears beat one of the phrase (after the count-in), not the instant it was scheduled.
- Every `onset_ms` (take) and every `onset_ms` (features) uses this zero; negative = before the beat.
- Expected start of note `i` in ms = `start_beat` x 60000 / `take.bpm`, where `take.bpm` is the PLAYED tempo = round(phrase `bpm` x `tempo_pct` / 100, 1).
- A `fragment` (first_half, second_half) is its own phrase record with its own id and beat zero; Features rows index the phrase named by `phrase_id`.

### How each input maps onto the clock
| Input | Event time source | Mapping to the audio clock | Latency correction |
|---|---|---|---|
| Voice (mic) | Frame time from sample count in an AudioWorklet (`currentFrame`) [9] | Already audio clock | `correction_ms` = measured round trip from loopback (output + input + air); no loopback = `output_latency_estimate` and flag |
| MIDI keyboard | `MIDIMessageEvent.timeStamp`, a DOMHighResTimeStamp of when the system received the message [12]; its origin is assumed to be the `performance.now()` origin (verify on the stage laptop); delay before receipt is unmeasured [10] | `ctx_ms = ts.contextTime x 1000 + (event_ms - ts.performanceTime)`, with `ts = ctx.getOutputTimestamp()` sampled at take start and again at take end [8] | 0 is assumed when `output_timestamp` works (the pair refers to the sound being rendered); MIDI device and touch delay are not measured |
| On-screen key | `pointerdown` `event.timeStamp` (performance clock) | Same mapping as MIDI | 0 plus touch delay (unmeasured, ignored) |

- `getOutputTimestamp()` returns the sample frame currently being rendered at the output and an estimate of when it was rendered, on the `performance.now()` clock [8]; so one pair maps the two clocks.
- Fallback when it is unavailable or returns zeros: `ctx_ms` from `ctx.currentTime` read next to `performance.now()`, and `correction_ms` = `ctx.outputLatency` x 1000; `method` = "output_latency_estimate". Browser support is `unverified`.
- Every correction is an estimate of one path, not a measurement of the learner's ear: `getOutputTimestamp()` says nothing about MIDI, touch or microphone capture delay, and a loopback measures speaker-to-mic, which can differ from speaker-to-ear. Judge timing only at a tolerance validated on the stage setup.
- Record drift: take the pair at take start and take end; store the disagreement in `latency.clock_drift_ms`; above 5 ms is logged and shown in the debug line (team choice).

### Compensation rule (the one formula)
- `onset_raw_ms` = `event_ctx_ms` - `beat_zero_ctx_ms` where `beat_zero_ctx_ms` is the audio-clock time scheduled for beat zero.
- `onset_ms` = `onset_raw_ms` - `latency.correction_ms`.
- Store both; the raw value lets a later recalibration recompute every onset without a retake.
- Loopback (voice): play 8 clicks, detect them in the mic; the median offset is `correction_ms`. It is the whole round trip, so do not also subtract `outputLatency` [tech-pitch-detection.md section 3].
- Residual shift: if all onsets are shifted alike (median above 150 ms, spread below 30 ms) rule M2 fires and asks for a tap calibration; that tap is the fallback correction.
- Bluetooth earphones add large delay that can change with the route: recalibrate on any route change or use wired or speaker for scoring (size `unverified`, hence the 1500 ms range).

### When a take is unusable (reviewer points, kept)
- Keep unrounded clock values during a take; round only the final difference once into `onset_raw_ms`.
- Tab hidden, AudioContext suspended or interrupted: stop the take, mark it incomplete (`counts` false) and restart the count-in and the clock mapping on return; UI timers may be throttled and a suspended context stops its clock.
- Context rebuilt, device route or sample rate changed: stop, re-anchor the clock pair, recalibrate; never divide frames by a presumed old rate. One context keeps one rate for its life.
- Retake shorter than the phrase: the denominator stays the full expected list; unmatched tail notes are "missed" and a take with any missed note cannot pass (rule X2, validator). `tempo_played` is null with fewer than two matched notes, so a short take cannot look perfect on tempo.

### Beat alignment and matching
- Count-in: `count_in_beats` clicks (default 4) scheduled on the audio clock; beat zero follows the last click by one beat.
- Matcher (both inputs): for expected note `i` consider unmatched played notes with |`onset_ms` - expected start| at most W ms, where W = min(400, half the smallest gap between expected onsets at `take.bpm`) (team choice). The half-gap cap keeps windows from overlapping at fast tempos (at 80 bpm W is 375 ms; at 200 bpm 150 ms).
  o Keys, deterministic: walk the expected notes in order; for each, take the unmatched played note in the window with the same MIDI pitch nearest in time; else the same pitch class (octave error); else the nearest in time (a wrong note). A wrong press that a correct press displaces is counted in `extra_count`.
  o Out of scope for v1: chords. A phrase with two notes on the same `start_beat` is rejected by `validatePhrase`; no take is scored against it (fixture F12).
  o Repeated pitches (F11) and fast tempos (F13) are covered by the in-order walk and the half-gap window.
  o Voice: nearest in time; pitch is judged afterwards by cents (section 3). Onset = the earliest frame of the qualifying pitched run, backdated, not the end of the 80 ms confirmation [tech-pitch-detection.md section 3; Codex review].
  o Unmatched expected = "missed"; unmatched played = counted in `extra_count`.
- On time = |`features.notes[i].onset_ms`| at most 150 ms (demo tolerance, a fifth of a beat at 80 bpm, not a teaching standard).
- A take ends after 3 s of silence (build-plan-v0.md section 7) or at `duration_ms`; the adapter sets `duration_ms`.

## 3. Pitch rules
| Item | Rule |
|---|---|
| Note name | Sharps only, ASCII `#`, scientific pitch: `C4` = 60, `A4` = 69 (440 Hz). Name = `NAMES[m mod 12]` + (floor(m / 12) - 1) [tech-pitch-detection.md section 6] |
| MIDI number | Hz to MIDI: m = 69 + 12 log2(f / 440). Keys give integers; voice gives floats; the fractional part is the cents |
| Cents | `cents_off` = round((played - target) x 100), plus = sharp, after octave removal; `cents_series` uses the same sign |
| In tune | |`cents_off`| at most 50 (the line tech-feedback-layer.md sources [2][3]); every other cutoff is a team choice |
| Hold exercise | The optional 2-second hold uses plus or minus 25 cents; it is a separate exercise mode and never part of a take |
| Confidence | `notes[].conf` 0 to 1 from the detector clarity (gate 0.9 for voice, team choice); 1 for a key event; `pitch_conf_pct` = mean of `conf` x 100 for voice, 100 for keys, 0 for an empty take |
| Voice band | 60 to 1500 Hz only; frames outside it are not notes |
| Octave error | Pitch class right, octave wrong: `octave_off` = round((played - target) / 12) if the remainder is within 50 cents; `cents_off` is computed after removing it; keys also set `wrong_note` true |
| Wrong note (keys) | Played integer pitch differs from the expected pitch; voice never sets it (voice uses cents) |
| Range | Allowed shift and "above your range" use `summary.comfort_range` and the formulas in tech-pitch-detection.md section 6 |

- Rule X1 is NEW, proposed here, because no rule in tech-feedback-layer.md catches an octave error: tier 3, cause "You played the right note in a different octave", cue "Find the note in the octave shown on screen, then play it again.", proof "Notes in the right octave: 2 of 7 to 7 of 7"; it outranks K1 and K2 in the same tier. The feedback layer owner must add it to the rules table and the LLM enum.
- Rule X2 is NEW, proposed after the second review: any expected note with status "missed" (and no M1) gives tier 3, cause "You skipped a note", cue "Play every note in the line, slower if you need to.", proof "Notes played: 5 of 7 to 7 of 7". Without it a keys take that drops a note could pass.
- Rule M2 is read symmetrically in the contract: |onset median| above 150 ms with spread under 30 ms (the feedback layer wrote "above 150" only); an early uniform shift is as likely an over-correction as a late one.
- Cue precedence (one winner per take; first row that fires wins, then the larger miss, then the cause not in the last two cues; this extends the tier order of tech-feedback-layer.md section 3):

| Order | Rule or tier | Note |
|---|---|---|
| 1 | M1 (empty take, or confidence under 60) | An empty take always ends here |
| 2 | M2 (uniform shift) | Set-up cue, not counted |
| 3 | V1 tired voice, V2 above range | Tiers 1 and 2 |
| 4 | X1, then K1, then V3, then X2 | Tier 3: octave, opening key, old tune, skipped note; K2 sits with K1 |
| 5 | V5 to V9 | Tiers 4 and 5 (pitch and note shape) |
| 6 | V10, V11, K3, K4 | Tier 6 (timing) |
| 7 | K5, V12 | Tier 7 (lengths) |
| 8 | K6, then "none" | Tier 8, then a pass |
- A phrase that fails `validatePhrase` (a chord) never reaches the table. A calibrated late start plus a flat note gives V5; the retake addresses timing next.

## 4. Invariants and the validator
### What must always hold
| # | Invariant | Checked on |
|---|---|---|
| 1 | `take.notes[i].i` equals its index and `onset_ms` never decreases | take |
| 2 | `dur_ms` 0 or more; `conf` 0 to 1; `velocity` null or integer 0 to 127; `pitch_midi` 0 to 127; keys have integer pitch | take |
| 3 | `features.notes` has exactly one row per expected note, same index | features |
| 4 | A "missed" row has null `cents_off` and null `onset_ms`; any other row has a numeric `onset_ms` | features |
| 5 | `summary.missed_count` and `summary.notes_in_tune` equal the counts recomputed from the rows (other summary fields are not checked here) | features |
| 6 | Features hold no audio: no key named audio, samples, pcm, blob, waveform, buffer or wav; no number array longer than 8; no string over 200 characters; the same scan runs on the cues | features, cues |
| 7 | Exactly one cue per take; `cause_class` in the enum; `cue_text` 1 to 20 words; `handoff_flag` only when `miss_no` = 3 | cue |
| 8 | An empty take has `counts` false and gets cue M1, never a music cue | take, cue |
| 9 | `take.bpm` above 0; `latency.correction_ms` finite; every `onset_ms` finite | take |
| 10 | Schema strings match; `take.phrase_id` equals the phrase; instrument and input pair (keyboard with midi or screen, voice with mic) | take, features |
| 11 | A take whose cue is M1 or M2 has `counts` false | take, cue |
| 12 | The cue set is checked first: no duplicate cue ids, no cue for another take, exactly one for this take; `handoff_flag` true exactly when `miss_no` is 3; a pass ("none") needs `missed_count` 0 | cue |
| 13 | Phrase: non-empty notes, finite `bpm` 30 to 200, integer `midi`, strictly increasing `start_beat` (chords rejected), `dur_beats` above 0; take: finite `bpm` 30 to 200 agreeing with `phrase.bpm` x `tempo_pct`; integer onsets, `onset_ms` at least -400 and equal to the raw onset minus the correction; unique `played_i`; every nullable number finite or null | phrase, take, features |
- Inputs of the wrong type (null, a non-array `notes`, a missing summary) return an error immediately instead of reading on. Still not checked: Plan fields beyond the audio scan, Cue proof strings and links between a retake and its parent, `counts` for off-days; add schemas for them if the team wants a full validator.
- Not checked by the validator (needs more than structure): that the cue is the right one for the features; that timings are plausible. Fixtures cover those (section 6).

### Validator (JavaScript, run in Node on the sixteen fixtures with mocked data and twenty-two deliberate breakages; NOT run in a browser or on a real take)
```js
// Run in Node tonight on the sixteen fixtures with mocked data; NOT run in a browser or on a real take.
const CAUSES = ["M1","M2","V1","V2","V3","V4","V5","V6","V7","V8","V9","V10","V11","V12",
  "K1","K2","K3","K4","K5","K6","X1","X2","none","handoff","out_of_scope"];
const BANNED = /audio|sample|pcm|blob|wave|buffer|recording|base64|wav/i;   // key names that must never appear
const isObj = (v) => v !== null && typeof v === "object" && !Array.isArray(v);
const fin = Number.isFinite, int = Number.isInteger;
const nullOr = (v, ok) => v === null || ok(v);
function validatePhrase(p) {                                   // phrases with chords or overlaps are rejected in v1
  const e = [];
  if (!isObj(p) || !Array.isArray(p.notes) || p.notes.length === 0) return ["phrase.notes must be a non-empty array"];
  if (!(fin(p.bpm) && p.bpm >= 30 && p.bpm <= 200)) e.push("phrase.bpm must be finite, 30 to 200");
  p.notes.forEach((n, k) => {
    if (!(int(n.midi) && n.midi >= 0 && n.midi <= 127)) e.push(`phrase note ${k}: midi`);
    if (!(fin(n.start_beat) && n.start_beat >= 0)) e.push(`phrase note ${k}: start_beat`);
    if (!(fin(n.dur_beats) && n.dur_beats > 0)) e.push(`phrase note ${k}: dur_beats`);
    if (k > 0 && !(n.start_beat > p.notes[k - 1].start_beat)) e.push(`phrase note ${k}: chord or unsorted start_beat (chords not supported in v1)`);
  });
  return e;
}
function validateTake(phrase, take, features, cues, plan = null) {
  const e = [], bad = (m) => e.push(m);
  if (!isObj(take) || !isObj(features) || !Array.isArray(cues) || !cues.every(isObj)) return ["take, features must be objects; cues an array of objects"];
  validatePhrase(phrase).forEach(bad);
  if (!Array.isArray(take.notes) || !Array.isArray(features.notes) || !isObj(features.summary) || !isObj(take.latency)) return [...e, "take.notes, features.notes, features.summary, take.latency required"];
  const n = take.notes, f = features.notes, s = features.summary, L = take.latency;
  if (take.schema !== "take/v1" || features.schema !== "take-features/v1.1") bad("schema string");
  if (take.phrase_id !== phrase.id) bad("take.phrase_id does not match the phrase");
  if (!({ keyboard: ["midi", "screen"], voice: ["mic"] }[take.instrument] || []).includes(take.input)) bad("instrument and input do not pair");
  if (features.instrument !== take.instrument) bad("features.instrument differs from take");
  if (!(fin(take.bpm) && take.bpm >= 30 && take.bpm <= 200)) bad("take.bpm must be finite, 30 to 200");
  if (!(fin(take.tempo_pct) && take.tempo_pct >= 40 && take.tempo_pct <= 150) || Math.abs(Math.round(phrase.bpm * take.tempo_pct) / 100 - take.bpm) > 0.1) bad("tempo_pct / bpm disagree with phrase.bpm");
  if (!int(take.take_no) || take.take_no < 1 || !int(take.duration_ms) || take.duration_ms < 0 || typeof take.counts !== "boolean") bad("take_no, duration_ms or counts");
  if (!["output_timestamp", "output_latency_estimate", "loopback", "none"].includes(L.method) || !(fin(L.correction_ms) && Math.abs(L.correction_ms) <= 1500)) bad("latency.method or correction_ms (finite, within 1500)");
  n.forEach((x, k) => {                                        // invariants 1, 2, 9
    if (x.i !== k) bad(`note ${k}: i must equal its index`);
    if (!(int(x.onset_ms) && x.onset_ms >= -400 && int(x.onset_raw_ms))) bad(`note ${k}: onset_ms and onset_raw_ms must be integers, onset_ms at least -400`);
    else if (x.onset_ms !== Math.round(x.onset_raw_ms - (fin(L.correction_ms) ? L.correction_ms : 0))) bad(`note ${k}: onset_ms is not onset_raw_ms minus correction_ms`);
    if (k > 0 && x.onset_ms < n[k - 1].onset_ms) bad(`note ${k}: onsets not sorted`);
    if (!(int(x.dur_ms) && x.dur_ms >= 0)) bad(`note ${k}: dur_ms must be a non-negative integer`);
    if (!(fin(x.conf) && x.conf >= 0 && x.conf <= 1)) bad(`note ${k}: conf outside 0..1`);
    if (!nullOr(x.velocity, (v) => int(v) && v >= 0 && v <= 127)) bad(`note ${k}: velocity`);
    if (!nullOr(x.rms, (v) => fin(v) && v >= 0 && v <= 1)) bad(`note ${k}: rms`);
    if (!nullOr(x.wobbles, (v) => int(v) && v >= 0)) bad(`note ${k}: wobbles`);
    if (!nullOr(x.pitch_series_midi, (v) => Array.isArray(v) && v.length === 8 && v.every(fin))) bad(`note ${k}: pitch_series_midi`);
    if (!(fin(x.pitch_midi) && x.pitch_midi >= 0 && x.pitch_midi <= 127)) bad(`note ${k}: pitch_midi must be finite, 0 to 127`);
    else if (take.input !== "mic" && !int(x.pitch_midi)) bad(`note ${k}: key input must be an integer pitch`);
  });
  if (f.length !== phrase.notes.length) bad("features.notes length != phrase.notes length");
  const seen = new Set();
  f.forEach((r, k) => {                                        // invariants 3, 4
    if (r.i !== k) bad(`feature ${k}: i must equal its index`);
    if (r.status === "missed") {
      if (![r.played_i, r.cents_off, r.onset_ms, r.held_ratio, r.loud_rel].every((v) => v === null)) bad(`feature ${k}: missed row must be null in played_i, cents_off, onset_ms, held_ratio, loud_rel`);
    } else if (r.status === "hit" || r.status === "wrong") {
      if (!(int(r.played_i) && r.played_i >= 0 && r.played_i < n.length) || seen.has(r.played_i)) bad(`feature ${k}: played_i out of range or used twice`);
      seen.add(r.played_i);
      if (!(fin(r.cents_off) && fin(r.onset_ms) && fin(r.held_ratio) && r.held_ratio >= 0)) bad(`feature ${k}: cents_off, onset_ms, held_ratio must be finite (held_ratio at least 0)`);
      if (!nullOr(r.loud_rel, (v) => fin(v) && v >= 0)) bad(`feature ${k}: loud_rel`);
    } else bad(`feature ${k}: status`);
    if (!int(r.octave_off) || typeof r.wrong_note !== "boolean") bad(`feature ${k}: octave_off or wrong_note`);
  });
  const hit = f.filter((r) => r.status !== "missed").length;        // invariant 5: recompute, never trust the client
  const tuneOk = f.filter((r) => r.status === "hit" && Math.abs(r.cents_off) <= 50 && r.octave_off === 0).length;
  if (s.missed_count !== f.length - hit) bad("summary.missed_count disagrees with rows");
  if (s.notes_in_tune !== `${tuneOk}/${f.length}`) bad("summary.notes_in_tune disagrees with rows");
  if (s.extra_count !== n.length - hit) bad("summary.extra_count disagrees with rows");
  if (s.octave_off_notes !== f.filter((r) => r.octave_off !== 0).length) bad("summary.octave_off_notes disagrees with rows");
  if (!(int(s.pitch_conf_pct) && s.pitch_conf_pct >= 0 && s.pitch_conf_pct <= 100)) bad("summary.pitch_conf_pct");
  (function scan(v, path) {                                    // invariant 6: no audio in features, cues or plan
    if (Array.isArray(v)) {
      if (v.length > 8 && v.some((x) => typeof x === "number")) bad(`${path}: number array longer than 8 (audio-like)`);
      v.forEach((x, k) => scan(x, `${path}[${k}]`));
    } else if (isObj(v)) {
      for (const [k, x] of Object.entries(v)) { if (BANNED.test(k)) bad(`${path}.${k}: forbidden key`); scan(x, `${path}.${k}`); }
    } else if (typeof v === "string" && v.length > 200) bad(`${path}: string over 200 chars`);
  })({ features, cues, plan }, "payload");
  const ids = cues.map((c) => c.id);                           // invariant 7: validate the whole cue set first
  if (new Set(ids).size !== ids.length) bad("duplicate cue ids");
  if (cues.some((c) => c.take_id !== take.id)) bad("cue belongs to another take");
  const mine = cues.filter((c) => c.take_id === take.id);
  if (mine.length !== 1) bad(`expected exactly 1 cue for take ${take.id}, found ${mine.length}`);
  if (n.length === 0 && take.counts !== false) bad("empty take must have counts=false");
  if (mine.length === 1) {
    const c = mine[0], words = typeof c.cue_text === "string" ? c.cue_text.trim().split(/\s+/).filter(Boolean).length : 0;
    if (!CAUSES.includes(c.cause_class)) bad("cue.cause_class not in the enum");
    if (words < 1 || words > 20) bad("cue_text must be a string of 1 to 20 words");
    if (!(int(c.miss_no) && c.miss_no >= 0 && c.miss_no <= 3) || typeof c.handoff_flag !== "boolean" || c.handoff_flag !== (c.miss_no === 3)) bad("miss_no, handoff_flag (true exactly when miss_no is 3)");
    if (["M1", "M2"].includes(c.cause_class) && take.counts !== false) bad("M1 or M2 take must have counts=false");
    if (n.length === 0 && c.cause_class !== "M1") bad("empty take must give the set-up cue M1");
    if (c.cause_class === "none" && s.missed_count !== 0) bad("a pass needs missed_count 0");
  }
  return e;
}
module.exports = { validateTake, validatePhrase, CAUSES };
```

## 5. Where the files disagreed, and what the contract chose
| # | Topic | What each note said | Chosen | Why |
|---|---|---|---|---|
| 1 | Key naming | Keyboard note and phrase lists: `startBeat`, `durBeats`. Feedback layer and engine: snake_case. Codex review: camelCase `pitchMidi` | snake_case everywhere (`start_beat`, `dur_beats`, `midi`) | One style removes a class of bugs; the phrase lists convert with a one-line rename |
| 2 | Time unit | Feedback layer: `onset_ms`. Pitch note: clicks in audio-clock seconds. Keyboard note: `TOL_MS` | Integer milliseconds; seconds converted once in the adapter | Matches `onset_ms` already in the feedback schema |
| 3 | Clock | Voice snippet times with `requestAnimationFrame` and `performance.now()`. Keyboard snippet uses `performance.now()` plus a guess. Pitch note text says sample counts | Audio clock is master; MIDI and screen events mapped with `getOutputTimestamp()`; voice by sample count | The Codex review showed the voice snippet's onsets time screen updates, not samples; ours is the only mapping with one reference |
| 4 | Latency | Keyboard: add `outputLatency` to `performance.now()`. Pitch note: loopback round trip. Codex: loopback cannot isolate mic delay | `correction_ms` plus `method`; loopback for voice, output timestamp for keys; raw onset kept | Both estimates are partial; storing the raw value lets Saturday's real tests fix it without retakes |
| 5 | In-tune cutoff | Pitch snippet: 25 cents. Feedback layer: 50 cents (sourced). Codex: 25 | 50 for takes, rules and features; 25 only for the hold exercise | 50 is the only sourced figure; the hold is a different task |
| 6 | Timing tolerance | Keyboard: 150 ms. Engine: 150 ms. Feedback rules V10, V11: 120 ms on the median, M2: 150 ms | On time = 150 ms per note; V10 and V11 keep 120 ms on the median | They answer different questions (one note vs the whole take); tune all on Saturday |
| 7 | Feature storage | Build plan: columns (`note_accuracy`, `onset_dev_ms_mean`...). Engine spec: the take-features JSON verbatim | The JSON, version v1.1 | Engine spec already supersedes the build plan; one JSON travels to the proxy |
| 8 | Strict schema | Feedback schema `additionalProperties: false`, numbers required | v1.1 adds `status`, `played_i`, `octave_off`, three summary counts; missed rows use null | A missed note has no onset or cents; the proxy schema must be updated |
| 9 | Percent scales | Engine measure m 0 to 1; feedback `*_pct` | `*_pct` 0 to 100, `m` 0 to 1, `conf` 0 to 1 | Matches the names; the validator does not mix them |
| 10 | Empty take | Build plan: "we heard nothing". Feedback: M1 needs `pitch_conf_pct` below 60 | Empty take = M1, `pitch_conf_pct` 0, `counts` false | One set-up cue; no new rule |
| 11 | Octave error | No rule anywhere | New rule X1 and `octave_off` | A demo list must include it; otherwise it hits K2 or V6 wrongly |
| 12 | Progress fields | Build plan: `skill_banked` list. Engine: `skill_levels` map | `skill_levels` map | Engine spec is later and richer |
| 13 | Wrong note on voice | Feedback layer: keyboard only | Voice always false | Voice is judged by cents, as the layer says |
| 14 | Spread, K5 spread | "Spread of onset offsets" and "held_ratio spread" undefined | Population standard deviation; max minus min | Needs one definition for the fixtures; team may redefine |
| 15 | Tempo | Keyboard snippet 80 bpm. Demo file: 90 target, 63 at 70% | `phrase.bpm` is the target; `take.bpm` the played tempo | Both numbers are real; the take needs the played one |
| 16 | Count-in | Keyboard: 4 clicks. Pitch note: clicks, no count | `count_in_beats`, default 4 | A field, not a constant |
| 17 | Acoustic keyboard through the mic | Pitch note lists it; keyboard note makes it a later trial | Mic path treats it as voice-style input; not for Saturday | Codex review agreed; Saturday uses MIDI or screen keys |
| 18 | Cue proof | Feedback: strings. Engine: `proof_before`, `proof_after` | Strings plus `proof_n` counts | Strings for UI; counts for the before-and-after card and progress |
| 19 | Matching window | Keyboard note: 400 ms search; Codex: overlaps at fast tempo | W = min(400, half the smallest expected gap) | A fixed 400 ms overlaps at 200 bpm (F13) |
| 20 | M2 direction | Feedback layer: median above 150 only | Absolute value | Early uniform shift is the same set-up problem |
| 21 | Missed notes | No rule for a keys take that drops a note | New rule X2 (tier 3); a pass needs missed_count 0 | Otherwise a short retake can pass (second review) |
| 22 | Chords | Keyboard note: chord grouping a known gap | Phrases with chords are rejected in v1 | One note per beat position keeps the matcher deterministic |
| 23 | Correction range | Contract draft: plus or minus 500 ms | Plus or minus 1500 ms | Bluetooth output can exceed 500 ms |

## 6. Sixteen fixture takes for the selftest (F01 to F10, then F11 to F16 added after the second review)
- F01 to F10 use the demo phrase (7 notes) below; F11 to F16 carry their own small phrase in their block; fixtures use 60 bpm so one beat is 1000 ms and expected onsets are 0, 1000 ... 6000 ms. The phrase is data: swap it and regenerate the take notes.
- Each case lists the cue the full rules table must give. The reference run covers only the rules the cases touch (M1, M2, X1, X2, K1, V5, V10, V11, K5) and passed 16 of 16 in Node on mocked data; every other rule in the real engine must still not fire on these takes (checked by hand: no wobbles, no loudness change, no range issue, `old_tune_pct` null).
- Fixtures carry `pitch_series_midi` null for brevity; `counts` is false for F09 and F10 (M1). F02 is the retake of F01 (`take_no` 2, `is_retake_of` fx-01), but the fixtures do not yet test proof values or the miss ladder.
- `tempo_pct` 66.7 gives 60 bpm from the 90 bpm target. Learner ids in any fixture or card follow the pseudonym style ("Learner 12"); no first names.

### Phrase used by F01 to F10
```json
{"schema":"phrase/v1","id":"twinkle-b3-4","title":"Twinkle, bars 3-4","key":"C","bpm":90,"beats_per_bar":4,"ease":1,"notes":[
  {"midi":65,"name":"F4","start_beat":0,"dur_beats":1},
  {"midi":65,"name":"F4","start_beat":1,"dur_beats":1},
  {"midi":64,"name":"E4","start_beat":2,"dur_beats":1},
  {"midi":64,"name":"E4","start_beat":3,"dur_beats":1},
  {"midi":62,"name":"D4","start_beat":4,"dur_beats":1},
  {"midi":62,"name":"D4","start_beat":5,"dur_beats":1},
  {"midi":60,"name":"C4","start_beat":6,"dur_beats":2}
]}
```

### F01 demo take 1: both planted errors
```json
{"schema":"take/v1","id":"fx-01","phrase_id":"twinkle-b3-4","small_goal_id":"sg-demo-1","session_id":"s-fixture","instrument":"keyboard","input":"midi","started_at":"2026-11-07T10:00:00+11:00","take_no":1,"is_retake_of":null,"counts":true,"bpm":60,"beats_per_bar":4,"count_in_beats":4,"duration_ms":8000,"tempo_pct":66.7,"latency":{"method":"output_timestamp","correction_ms":0,"output_ms":null,"input_ms":null,"clock_drift_ms":0},"notes":[
    {"i":0,"pitch_midi":64,"onset_ms":12,"onset_raw_ms":12,"dur_ms":900,"velocity":80,"rms":null,"conf":1,"wobbles":null,"pitch_series_midi":null},
    {"i":1,"pitch_midi":65,"onset_ms":980,"onset_raw_ms":980,"dur_ms":920,"velocity":78,"rms":null,"conf":1,"wobbles":null,"pitch_series_midi":null},
    {"i":2,"pitch_midi":64,"onset_ms":2035,"onset_raw_ms":2035,"dur_ms":880,"velocity":82,"rms":null,"conf":1,"wobbles":null,"pitch_series_midi":null},
    {"i":3,"pitch_midi":64,"onset_ms":2992,"onset_raw_ms":2992,"dur_ms":910,"velocity":79,"rms":null,"conf":1,"wobbles":null,"pitch_series_midi":null},
    {"i":4,"pitch_midi":62,"onset_ms":4018,"onset_raw_ms":4018,"dur_ms":900,"velocity":81,"rms":null,"conf":1,"wobbles":null,"pitch_series_midi":null},
    {"i":5,"pitch_midi":62,"onset_ms":4975,"onset_raw_ms":4975,"dur_ms":890,"velocity":80,"rms":null,"conf":1,"wobbles":null,"pitch_series_midi":null},
    {"i":6,"pitch_midi":60,"onset_ms":6010,"onset_raw_ms":6010,"dur_ms":1000,"velocity":76,"rms":null,"conf":1,"wobbles":null,"pitch_series_midi":null}
  ]}
```
- Expected cue: `K1`, you started on the wrong key
- Derived (reference run): notes_in_tune 6/7, onset median 10 ms, spread 20 ms, conf 100%, missed 0, extra 0, octave-off 0, wrong opening note true

### F02 demo retake: opening note fixed, last note still short
```json
{"schema":"take/v1","id":"fx-02","phrase_id":"twinkle-b3-4","small_goal_id":"sg-demo-1","session_id":"s-fixture","instrument":"keyboard","input":"midi","started_at":"2026-11-07T10:00:00+11:00","take_no":2,"is_retake_of":"fx-01","counts":true,"bpm":60,"beats_per_bar":4,"count_in_beats":4,"duration_ms":8000,"tempo_pct":66.7,"latency":{"method":"output_timestamp","correction_ms":0,"output_ms":null,"input_ms":null,"clock_drift_ms":0},"notes":[
    {"i":0,"pitch_midi":65,"onset_ms":12,"onset_raw_ms":12,"dur_ms":900,"velocity":80,"rms":null,"conf":1,"wobbles":null,"pitch_series_midi":null},
    {"i":1,"pitch_midi":65,"onset_ms":980,"onset_raw_ms":980,"dur_ms":920,"velocity":78,"rms":null,"conf":1,"wobbles":null,"pitch_series_midi":null},
    {"i":2,"pitch_midi":64,"onset_ms":2035,"onset_raw_ms":2035,"dur_ms":880,"velocity":82,"rms":null,"conf":1,"wobbles":null,"pitch_series_midi":null},
    {"i":3,"pitch_midi":64,"onset_ms":2992,"onset_raw_ms":2992,"dur_ms":910,"velocity":79,"rms":null,"conf":1,"wobbles":null,"pitch_series_midi":null},
    {"i":4,"pitch_midi":62,"onset_ms":4018,"onset_raw_ms":4018,"dur_ms":900,"velocity":81,"rms":null,"conf":1,"wobbles":null,"pitch_series_midi":null},
    {"i":5,"pitch_midi":62,"onset_ms":4975,"onset_raw_ms":4975,"dur_ms":890,"velocity":80,"rms":null,"conf":1,"wobbles":null,"pitch_series_midi":null},
    {"i":6,"pitch_midi":60,"onset_ms":6010,"onset_raw_ms":6010,"dur_ms":1000,"velocity":76,"rms":null,"conf":1,"wobbles":null,"pitch_series_midi":null}
  ]}
```
- Expected cue: `K5`, some notes are long and some short
- Derived (reference run): notes_in_tune 7/7, onset median 10 ms, spread 20 ms, conf 100%, missed 0, extra 0, octave-off 0, wrong opening note false

### F03 clean take
```json
{"schema":"take/v1","id":"fx-03","phrase_id":"twinkle-b3-4","small_goal_id":"sg-demo-1","session_id":"s-fixture","instrument":"keyboard","input":"midi","started_at":"2026-11-07T10:00:00+11:00","take_no":1,"is_retake_of":null,"counts":true,"bpm":60,"beats_per_bar":4,"count_in_beats":4,"duration_ms":8000,"tempo_pct":66.7,"latency":{"method":"output_timestamp","correction_ms":0,"output_ms":null,"input_ms":null,"clock_drift_ms":0},"notes":[
    {"i":0,"pitch_midi":65,"onset_ms":12,"onset_raw_ms":12,"dur_ms":900,"velocity":80,"rms":null,"conf":1,"wobbles":null,"pitch_series_midi":null},
    {"i":1,"pitch_midi":65,"onset_ms":980,"onset_raw_ms":980,"dur_ms":920,"velocity":78,"rms":null,"conf":1,"wobbles":null,"pitch_series_midi":null},
    {"i":2,"pitch_midi":64,"onset_ms":2035,"onset_raw_ms":2035,"dur_ms":880,"velocity":82,"rms":null,"conf":1,"wobbles":null,"pitch_series_midi":null},
    {"i":3,"pitch_midi":64,"onset_ms":2992,"onset_raw_ms":2992,"dur_ms":910,"velocity":79,"rms":null,"conf":1,"wobbles":null,"pitch_series_midi":null},
    {"i":4,"pitch_midi":62,"onset_ms":4018,"onset_raw_ms":4018,"dur_ms":900,"velocity":81,"rms":null,"conf":1,"wobbles":null,"pitch_series_midi":null},
    {"i":5,"pitch_midi":62,"onset_ms":4975,"onset_raw_ms":4975,"dur_ms":890,"velocity":80,"rms":null,"conf":1,"wobbles":null,"pitch_series_midi":null},
    {"i":6,"pitch_midi":60,"onset_ms":6010,"onset_raw_ms":6010,"dur_ms":1850,"velocity":76,"rms":null,"conf":1,"wobbles":null,"pitch_series_midi":null}
  ]}
```
- Expected cue: `none`, every note was where the phrase asks for it
- Derived (reference run): notes_in_tune 7/7, onset median 10 ms, spread 20 ms, conf 100%, missed 0, extra 0, octave-off 0, wrong opening note false

### F04 flat note (voice, top notes 70 cents flat)
```json
{"schema":"take/v1","id":"fx-04","phrase_id":"twinkle-b3-4","small_goal_id":"sg-demo-1","session_id":"s-fixture","instrument":"voice","input":"mic","started_at":"2026-11-07T10:00:00+11:00","take_no":1,"is_retake_of":null,"counts":true,"bpm":60,"beats_per_bar":4,"count_in_beats":4,"duration_ms":8000,"tempo_pct":66.7,"latency":{"method":"loopback","correction_ms":0,"output_ms":null,"input_ms":null,"clock_drift_ms":0},"notes":[
    {"i":0,"pitch_midi":64.3,"onset_ms":30,"onset_raw_ms":30,"dur_ms":880,"velocity":null,"rms":0.2,"conf":0.95,"wobbles":0,"pitch_series_midi":null},
    {"i":1,"pitch_midi":64.3,"onset_ms":975,"onset_raw_ms":975,"dur_ms":900,"velocity":null,"rms":0.21,"conf":0.95,"wobbles":0,"pitch_series_midi":null},
    {"i":2,"pitch_midi":63.95,"onset_ms":2040,"onset_raw_ms":2040,"dur_ms":860,"velocity":null,"rms":0.22,"conf":0.95,"wobbles":0,"pitch_series_midi":null},
    {"i":3,"pitch_midi":64.06,"onset_ms":2990,"onset_raw_ms":2990,"dur_ms":900,"velocity":null,"rms":0.23,"conf":0.95,"wobbles":0,"pitch_series_midi":null},
    {"i":4,"pitch_midi":61.96,"onset_ms":4020,"onset_raw_ms":4020,"dur_ms":890,"velocity":null,"rms":0.24,"conf":0.95,"wobbles":0,"pitch_series_midi":null},
    {"i":5,"pitch_midi":62.03,"onset_ms":4965,"onset_raw_ms":4965,"dur_ms":880,"velocity":null,"rms":0.25,"conf":0.95,"wobbles":0,"pitch_series_midi":null},
    {"i":6,"pitch_midi":60.02,"onset_ms":6015,"onset_raw_ms":6015,"dur_ms":1800,"velocity":null,"rms":0.26,"conf":0.95,"wobbles":0,"pitch_series_midi":null}
  ]}
```
- Expected cue: `V5`, the high note falls a little short of the target
- Derived (reference run): notes_in_tune 5/7, onset median 15 ms, spread 26 ms, conf 95%, missed 0, extra 0, octave-off 0, wrong opening note false

### F05 late start (voice, comes in after the beat)
```json
{"schema":"take/v1","id":"fx-05","phrase_id":"twinkle-b3-4","small_goal_id":"sg-demo-1","session_id":"s-fixture","instrument":"voice","input":"mic","started_at":"2026-11-07T10:00:00+11:00","take_no":1,"is_retake_of":null,"counts":true,"bpm":60,"beats_per_bar":4,"count_in_beats":4,"duration_ms":8000,"tempo_pct":66.7,"latency":{"method":"loopback","correction_ms":0,"output_ms":null,"input_ms":null,"clock_drift_ms":0},"notes":[
    {"i":0,"pitch_midi":64.97,"onset_ms":200,"onset_raw_ms":200,"dur_ms":880,"velocity":null,"rms":0.2,"conf":0.95,"wobbles":0,"pitch_series_midi":null},
    {"i":1,"pitch_midi":65.04,"onset_ms":1150,"onset_raw_ms":1150,"dur_ms":900,"velocity":null,"rms":0.21,"conf":0.95,"wobbles":0,"pitch_series_midi":null},
    {"i":2,"pitch_midi":63.95,"onset_ms":2120,"onset_raw_ms":2120,"dur_ms":860,"velocity":null,"rms":0.22,"conf":0.95,"wobbles":0,"pitch_series_midi":null},
    {"i":3,"pitch_midi":64.06,"onset_ms":3260,"onset_raw_ms":3260,"dur_ms":900,"velocity":null,"rms":0.23,"conf":0.95,"wobbles":0,"pitch_series_midi":null},
    {"i":4,"pitch_midi":61.96,"onset_ms":4180,"onset_raw_ms":4180,"dur_ms":890,"velocity":null,"rms":0.24,"conf":0.95,"wobbles":0,"pitch_series_midi":null},
    {"i":5,"pitch_midi":62.03,"onset_ms":5140,"onset_raw_ms":5140,"dur_ms":880,"velocity":null,"rms":0.25,"conf":0.95,"wobbles":0,"pitch_series_midi":null},
    {"i":6,"pitch_midi":60.02,"onset_ms":6230,"onset_raw_ms":6230,"dur_ms":1800,"velocity":null,"rms":0.26,"conf":0.95,"wobbles":0,"pitch_series_midi":null}
  ]}
```
- Expected cue: `V10`, you come in after the beat
- Derived (reference run): notes_in_tune 7/7, onset median 180 ms, spread 47 ms, conf 95%, missed 0, extra 0, octave-off 0, wrong opening note false

### F06 uneven lengths (keys)
```json
{"schema":"take/v1","id":"fx-06","phrase_id":"twinkle-b3-4","small_goal_id":"sg-demo-1","session_id":"s-fixture","instrument":"keyboard","input":"midi","started_at":"2026-11-07T10:00:00+11:00","take_no":1,"is_retake_of":null,"counts":true,"bpm":60,"beats_per_bar":4,"count_in_beats":4,"duration_ms":8000,"tempo_pct":66.7,"latency":{"method":"output_timestamp","correction_ms":0,"output_ms":null,"input_ms":null,"clock_drift_ms":0},"notes":[
    {"i":0,"pitch_midi":65,"onset_ms":12,"onset_raw_ms":12,"dur_ms":900,"velocity":80,"rms":null,"conf":1,"wobbles":null,"pitch_series_midi":null},
    {"i":1,"pitch_midi":65,"onset_ms":980,"onset_raw_ms":980,"dur_ms":400,"velocity":78,"rms":null,"conf":1,"wobbles":null,"pitch_series_midi":null},
    {"i":2,"pitch_midi":64,"onset_ms":2035,"onset_raw_ms":2035,"dur_ms":880,"velocity":82,"rms":null,"conf":1,"wobbles":null,"pitch_series_midi":null},
    {"i":3,"pitch_midi":64,"onset_ms":2992,"onset_raw_ms":2992,"dur_ms":450,"velocity":79,"rms":null,"conf":1,"wobbles":null,"pitch_series_midi":null},
    {"i":4,"pitch_midi":62,"onset_ms":4018,"onset_raw_ms":4018,"dur_ms":900,"velocity":81,"rms":null,"conf":1,"wobbles":null,"pitch_series_midi":null},
    {"i":5,"pitch_midi":62,"onset_ms":4975,"onset_raw_ms":4975,"dur_ms":420,"velocity":80,"rms":null,"conf":1,"wobbles":null,"pitch_series_midi":null},
    {"i":6,"pitch_midi":60,"onset_ms":6010,"onset_raw_ms":6010,"dur_ms":900,"velocity":76,"rms":null,"conf":1,"wobbles":null,"pitch_series_midi":null}
  ]}
```
- Expected cue: `K5`, some notes are long and some short
- Derived (reference run): notes_in_tune 7/7, onset median 10 ms, spread 20 ms, conf 100%, missed 0, extra 0, octave-off 0, wrong opening note false

### F07 wrong opening note (keys, G4 for F4)
```json
{"schema":"take/v1","id":"fx-07","phrase_id":"twinkle-b3-4","small_goal_id":"sg-demo-1","session_id":"s-fixture","instrument":"keyboard","input":"midi","started_at":"2026-11-07T10:00:00+11:00","take_no":1,"is_retake_of":null,"counts":true,"bpm":60,"beats_per_bar":4,"count_in_beats":4,"duration_ms":8000,"tempo_pct":66.7,"latency":{"method":"output_timestamp","correction_ms":0,"output_ms":null,"input_ms":null,"clock_drift_ms":0},"notes":[
    {"i":0,"pitch_midi":67,"onset_ms":12,"onset_raw_ms":12,"dur_ms":900,"velocity":80,"rms":null,"conf":1,"wobbles":null,"pitch_series_midi":null},
    {"i":1,"pitch_midi":65,"onset_ms":980,"onset_raw_ms":980,"dur_ms":920,"velocity":78,"rms":null,"conf":1,"wobbles":null,"pitch_series_midi":null},
    {"i":2,"pitch_midi":64,"onset_ms":2035,"onset_raw_ms":2035,"dur_ms":880,"velocity":82,"rms":null,"conf":1,"wobbles":null,"pitch_series_midi":null},
    {"i":3,"pitch_midi":64,"onset_ms":2992,"onset_raw_ms":2992,"dur_ms":910,"velocity":79,"rms":null,"conf":1,"wobbles":null,"pitch_series_midi":null},
    {"i":4,"pitch_midi":62,"onset_ms":4018,"onset_raw_ms":4018,"dur_ms":900,"velocity":81,"rms":null,"conf":1,"wobbles":null,"pitch_series_midi":null},
    {"i":5,"pitch_midi":62,"onset_ms":4975,"onset_raw_ms":4975,"dur_ms":890,"velocity":80,"rms":null,"conf":1,"wobbles":null,"pitch_series_midi":null},
    {"i":6,"pitch_midi":60,"onset_ms":6010,"onset_raw_ms":6010,"dur_ms":1850,"velocity":76,"rms":null,"conf":1,"wobbles":null,"pitch_series_midi":null}
  ]}
```
- Expected cue: `K1`, you started on the wrong key
- Derived (reference run): notes_in_tune 6/7, onset median 10 ms, spread 20 ms, conf 100%, missed 0, extra 0, octave-off 0, wrong opening note true

### F08 octave error (voice, last two lower notes an octave down)
```json
{"schema":"take/v1","id":"fx-08","phrase_id":"twinkle-b3-4","small_goal_id":"sg-demo-1","session_id":"s-fixture","instrument":"voice","input":"mic","started_at":"2026-11-07T10:00:00+11:00","take_no":1,"is_retake_of":null,"counts":true,"bpm":60,"beats_per_bar":4,"count_in_beats":4,"duration_ms":8000,"tempo_pct":66.7,"latency":{"method":"loopback","correction_ms":0,"output_ms":null,"input_ms":null,"clock_drift_ms":0},"notes":[
    {"i":0,"pitch_midi":64.97,"onset_ms":30,"onset_raw_ms":30,"dur_ms":880,"velocity":null,"rms":0.2,"conf":0.95,"wobbles":0,"pitch_series_midi":null},
    {"i":1,"pitch_midi":65.04,"onset_ms":975,"onset_raw_ms":975,"dur_ms":900,"velocity":null,"rms":0.21,"conf":0.95,"wobbles":0,"pitch_series_midi":null},
    {"i":2,"pitch_midi":63.95,"onset_ms":2040,"onset_raw_ms":2040,"dur_ms":860,"velocity":null,"rms":0.22,"conf":0.95,"wobbles":0,"pitch_series_midi":null},
    {"i":3,"pitch_midi":64.06,"onset_ms":2990,"onset_raw_ms":2990,"dur_ms":900,"velocity":null,"rms":0.23,"conf":0.95,"wobbles":0,"pitch_series_midi":null},
    {"i":4,"pitch_midi":50.04,"onset_ms":4020,"onset_raw_ms":4020,"dur_ms":890,"velocity":null,"rms":0.24,"conf":0.95,"wobbles":0,"pitch_series_midi":null},
    {"i":5,"pitch_midi":50.03,"onset_ms":4965,"onset_raw_ms":4965,"dur_ms":880,"velocity":null,"rms":0.25,"conf":0.95,"wobbles":0,"pitch_series_midi":null},
    {"i":6,"pitch_midi":60.02,"onset_ms":6015,"onset_raw_ms":6015,"dur_ms":1800,"velocity":null,"rms":0.26,"conf":0.95,"wobbles":0,"pitch_series_midi":null}
  ]}
```
- Expected cue: `X1`, you played the right note in a different octave
- Derived (reference run): notes_in_tune 5/7, onset median 15 ms, spread 26 ms, conf 95%, missed 0, extra 0, octave-off 2, wrong opening note false

### F09 dropout (voice, tracker lost three notes)
```json
{"schema":"take/v1","id":"fx-09","phrase_id":"twinkle-b3-4","small_goal_id":"sg-demo-1","session_id":"s-fixture","instrument":"voice","input":"mic","started_at":"2026-11-07T10:00:00+11:00","take_no":1,"is_retake_of":null,"counts":false,"bpm":60,"beats_per_bar":4,"count_in_beats":4,"duration_ms":8000,"tempo_pct":66.7,"latency":{"method":"loopback","correction_ms":0,"output_ms":null,"input_ms":null,"clock_drift_ms":0},"notes":[
    {"i":0,"pitch_midi":64.97,"onset_ms":30,"onset_raw_ms":30,"dur_ms":880,"velocity":null,"rms":0.2,"conf":0.5,"wobbles":0,"pitch_series_midi":null},
    {"i":1,"pitch_midi":65.04,"onset_ms":975,"onset_raw_ms":975,"dur_ms":900,"velocity":null,"rms":0.21,"conf":0.5,"wobbles":0,"pitch_series_midi":null},
    {"i":2,"pitch_midi":63.95,"onset_ms":2040,"onset_raw_ms":2040,"dur_ms":860,"velocity":null,"rms":0.22,"conf":0.5,"wobbles":0,"pitch_series_midi":null},
    {"i":3,"pitch_midi":60.02,"onset_ms":6015,"onset_raw_ms":6015,"dur_ms":1800,"velocity":null,"rms":0.26,"conf":0.5,"wobbles":0,"pitch_series_midi":null}
  ]}
```
- Expected cue: `M1`, the app could not hear you clearly
- Derived (reference run): notes_in_tune 4/7, onset median 22.5 ms, spread 25 ms, conf 50%, missed 3, extra 0, octave-off 0, wrong opening note false

### F10 empty take
```json
{"schema":"take/v1","id":"fx-10","phrase_id":"twinkle-b3-4","small_goal_id":"sg-demo-1","session_id":"s-fixture","instrument":"voice","input":"mic","started_at":"2026-11-07T10:00:00+11:00","take_no":1,"is_retake_of":null,"counts":false,"bpm":60,"beats_per_bar":4,"count_in_beats":4,"duration_ms":8000,"tempo_pct":66.7,"latency":{"method":"loopback","correction_ms":0,"output_ms":null,"input_ms":null,"clock_drift_ms":0},"notes":[]}
```
- Expected cue: `M1`, the app could not hear you clearly
- Derived (reference run): notes_in_tune 0/7, onset median null ms, spread null ms, conf 0%, missed 7, extra 0, octave-off 0, wrong opening note false

### F11 repeated notes (keys, same pitch twice)
- Phrase: `{"schema":"phrase/v1","id":"p-repeat","title":"p-repeat","key":"C","bpm":60,"beats_per_bar":4,"ease":1,"notes":[{"midi":60,"name":"C4","start_beat":0,"dur_beats":1},{"midi":60,"name":"C4","start_beat":1,"dur_beats":1}]}`
```json
{"schema":"take/v1","id":"fx-11","phrase_id":"p-repeat","small_goal_id":"sg-demo-1","session_id":"s-fixture","instrument":"keyboard","input":"midi","started_at":"2026-11-07T10:00:00+11:00","take_no":1,"is_retake_of":null,"counts":true,"bpm":60,"beats_per_bar":4,"count_in_beats":4,"duration_ms":2000,"tempo_pct":100,"latency":{"method":"output_timestamp","correction_ms":0,"output_ms":null,"input_ms":null,"clock_drift_ms":0},"notes":[
    {"i":0,"pitch_midi":60,"onset_ms":0,"onset_raw_ms":0,"dur_ms":900,"velocity":80,"rms":null,"conf":1,"wobbles":null,"pitch_series_midi":null},
    {"i":1,"pitch_midi":60,"onset_ms":1000,"onset_raw_ms":1000,"dur_ms":900,"velocity":80,"rms":null,"conf":1,"wobbles":null,"pitch_series_midi":null}
  ]}
```
- Expected cue: `none`, every note was where the phrase asks for it
- Derived (reference run): notes_in_tune 2/2, onset median 0 ms, spread 0 ms, conf 100%, missed 0, extra 0, octave-off 0, wrong opening note false

### F12 chord phrase (rejected: chords not supported in v1)
- Phrase: `{"schema":"phrase/v1","id":"p-chord","title":"p-chord","key":"C","bpm":60,"beats_per_bar":4,"ease":1,"notes":[{"midi":60,"name":"C4","start_beat":0,"dur_beats":1},{"midi":64,"name":"E4","start_beat":0,"dur_beats":1}]}`
```json
{"schema":"take/v1","id":"fx-12","phrase_id":"p-chord","small_goal_id":"sg-demo-1","session_id":"s-fixture","instrument":"keyboard","input":"midi","started_at":"2026-11-07T10:00:00+11:00","take_no":1,"is_retake_of":null,"counts":false,"bpm":60,"beats_per_bar":4,"count_in_beats":4,"duration_ms":1000,"tempo_pct":100,"latency":{"method":"output_timestamp","correction_ms":0,"output_ms":null,"input_ms":null,"clock_drift_ms":0},"notes":[
    {"i":0,"pitch_midi":60,"onset_ms":0,"onset_raw_ms":0,"dur_ms":900,"velocity":80,"rms":null,"conf":1,"wobbles":null,"pitch_series_midi":null},
    {"i":1,"pitch_midi":64,"onset_ms":0,"onset_raw_ms":0,"dur_ms":900,"velocity":80,"rms":null,"conf":1,"wobbles":null,"pitch_series_midi":null}
  ]}
```
- Expected: `validatePhrase` rejects the phrase (two notes on one beat); no take is scored and no cue is made.

### F13 overlapping windows at 200 bpm (keys; window shrinks to half the gap, so the early note matches note 1 and note 0 is missed)
- Phrase: `{"schema":"phrase/v1","id":"p-overlap","title":"p-overlap","key":"C","bpm":200,"beats_per_bar":4,"ease":1,"notes":[{"midi":60,"name":"C4","start_beat":0,"dur_beats":1},{"midi":60,"name":"C4","start_beat":1,"dur_beats":1}]}`
```json
{"schema":"take/v1","id":"fx-13","phrase_id":"p-overlap","small_goal_id":"sg-demo-1","session_id":"s-fixture","instrument":"keyboard","input":"midi","started_at":"2026-11-07T10:00:00+11:00","take_no":1,"is_retake_of":null,"counts":true,"bpm":200,"beats_per_bar":4,"count_in_beats":4,"duration_ms":600,"tempo_pct":100,"latency":{"method":"output_timestamp","correction_ms":0,"output_ms":null,"input_ms":null,"clock_drift_ms":0},"notes":[
    {"i":0,"pitch_midi":60,"onset_ms":250,"onset_raw_ms":250,"dur_ms":250,"velocity":80,"rms":null,"conf":1,"wobbles":null,"pitch_series_midi":null}
  ]}
```
- Expected cue: `X2`, you skipped a note
- Derived (reference run): notes_in_tune 1/2, onset median -50 ms, spread 0 ms, conf 100%, missed 1, extra 0, octave-off 0, wrong opening note false

### F14 sung octave error (voice, one note, F3 for F4)
- Phrase: `{"schema":"phrase/v1","id":"p-one","title":"p-one","key":"C","bpm":60,"beats_per_bar":4,"ease":1,"notes":[{"midi":65,"name":"F4","start_beat":0,"dur_beats":1}]}`
```json
{"schema":"take/v1","id":"fx-14","phrase_id":"p-one","small_goal_id":"sg-demo-1","session_id":"s-fixture","instrument":"voice","input":"mic","started_at":"2026-11-07T10:00:00+11:00","take_no":1,"is_retake_of":null,"counts":true,"bpm":60,"beats_per_bar":4,"count_in_beats":4,"duration_ms":1000,"tempo_pct":100,"latency":{"method":"loopback","correction_ms":0,"output_ms":null,"input_ms":null,"clock_drift_ms":0},"notes":[
    {"i":0,"pitch_midi":53,"onset_ms":0,"onset_raw_ms":0,"dur_ms":900,"velocity":null,"rms":0.2,"conf":0.95,"wobbles":0,"pitch_series_midi":null}
  ]}
```
- Expected cue: `X1`, you played the right note in a different octave
- Derived (reference run): notes_in_tune 0/1, onset median 0 ms, spread 0 ms, conf 95%, missed 0, extra 0, octave-off 1, wrong opening note false

### F15 no onsets (voice, nothing detected)
- Phrase: `{"schema":"phrase/v1","id":"p-one","title":"p-one","key":"C","bpm":60,"beats_per_bar":4,"ease":1,"notes":[{"midi":65,"name":"F4","start_beat":0,"dur_beats":1}]}`
```json
{"schema":"take/v1","id":"fx-15","phrase_id":"p-one","small_goal_id":"sg-demo-1","session_id":"s-fixture","instrument":"voice","input":"mic","started_at":"2026-11-07T10:00:00+11:00","take_no":1,"is_retake_of":null,"counts":false,"bpm":60,"beats_per_bar":4,"count_in_beats":4,"duration_ms":1000,"tempo_pct":100,"latency":{"method":"loopback","correction_ms":0,"output_ms":null,"input_ms":null,"clock_drift_ms":0},"notes":[]}
```
- Expected cue: `M1`, the app could not hear you clearly
- Derived (reference run): notes_in_tune 0/1, onset median null ms, spread null ms, conf 0%, missed 1, extra 0, octave-off 0, wrong opening note false

### F16 early start (voice, 220 and 140 ms early)
- Phrase: `{"schema":"phrase/v1","id":"p-early","title":"p-early","key":"C","bpm":60,"beats_per_bar":4,"ease":1,"notes":[{"midi":65,"name":"F4","start_beat":0,"dur_beats":1},{"midi":64,"name":"E4","start_beat":1,"dur_beats":1}]}`
```json
{"schema":"take/v1","id":"fx-16","phrase_id":"p-early","small_goal_id":"sg-demo-1","session_id":"s-fixture","instrument":"voice","input":"mic","started_at":"2026-11-07T10:00:00+11:00","take_no":1,"is_retake_of":null,"counts":true,"bpm":60,"beats_per_bar":4,"count_in_beats":4,"duration_ms":2000,"tempo_pct":100,"latency":{"method":"loopback","correction_ms":0,"output_ms":null,"input_ms":null,"clock_drift_ms":0},"notes":[
    {"i":0,"pitch_midi":65,"onset_ms":-220,"onset_raw_ms":-220,"dur_ms":800,"velocity":null,"rms":0.2,"conf":0.95,"wobbles":0,"pitch_series_midi":null},
    {"i":1,"pitch_midi":64,"onset_ms":860,"onset_raw_ms":860,"dur_ms":800,"velocity":null,"rms":0.2,"conf":0.95,"wobbles":0,"pitch_series_midi":null}
  ]}
```
- Expected cue: `V11`, you come in before the beat
- Derived (reference run): notes_in_tune 2/2, onset median -180 ms, spread 40 ms, conf 95%, missed 0, extra 0, octave-off 0, wrong opening note false

- Selftest shape (extends test/selftest.mjs, build-plan-v0.md section 13): load a fixture, run matcher then rules, assert `cue.cause_class` equals the expected value, and run `validateTake`; green bar needs sixteen of sixteen.
- Also run twenty-two negative checks: the original ten (unsorted onsets, negative duration, an audio key, a long number array, two cues, no cue, a wrong miss count, an M1 take that counts, a wrong `notes_in_tune`, a bad instrument and input pair) plus null notes, Infinity bpm, a fractional onset, an onset below -400, a correction that does not match the onsets, an empty take with no cue, a cue for another take, a whitespace cue text, a duplicate `played_i`, miss 3 without a hand-off, an audio-named key in the plan, a pass with a missed note, and a NaN mic pitch (that last one trips the instrument check first in the Node run). Each must make the validator report an error.
- Saturday acceptance gate (a Codex reviewer's point, kept): one real microphone take, one real MIDI take and one screen-key take must each pass the validator before the contract counts as proven; until then it is a contract sketch.

## 7. Change rule (after Saturday lunch, 12:00)
- One owner of the contract file: the coder who holds the matcher; no one else edits it.
- A change needs a named reason (a failing real take or a stage test), not a preference.
- Any change updates this file, the validator, the proxy schema and all sixteen fixtures in one release; the green bar must pass, then the three real-input takes.
- Additions are not free (the proxy schema is strict and the validator checks versions): an added field needs the same release; renames, removals and unit changes are frozen until the pitch is over, and the demo runs on pinned versions (take/v1, take-features/v1.1).
- Tell the other lane in the group message before merging; a lane that did not hear keeps the old field until it is told.

## 8. Open issues from the prototype (6 to 7 Nov): proposals, not rules

- Source: the open-questions list in the README block of prototype-skeleton.html (this folder, lines 40 to 49) [13] and small-goals-engine-spec.md section 2 (F3 pass bar 0.8) [4]; numbers below were recomputed in Node tonight (script in the scratch folder, not shipped).
- Status: PROPOSAL. Nothing here changes the binding take/v1 plus take-features/v1.1 rules; each fix is drafted as v1.2 with the fixture that proves it. Fixtures F17 and F18 are v1.2 candidates and are not part of the sixteen-fixture green bar until the team accepts them.
- Neither fix adds or renames a field; the strict proxy schema stays valid.

### 8.1 Issue 1: keys have no rule for notes that are late or early without a tempo change
- Symptom (prototype README): a retake with 3 of 7 notes 230 ms late got cue "none" while the proof card said "Not yet" (its on-the-beat count was 4 of 7).
- Cause: the keys rules only look at tempo (K3, K4) and lengths (K5); V10 and V11 use the median and are voice-only, and the median of 3 late notes among 7 is about 0 ms.
- Recomputed: Twinkle bars 3-4 at 60 bpm, notes 1, 3, 5 shifted +230 ms: all 7 notes match (230 is inside W = 400), on time = 4 of 7 = 57%, v1.1 gives "none".

#### Proposed rule K7 (v1.2)
| Item | Proposal |
|---|---|
| Trigger | Share of expected notes with status "hit" or "wrong" and absolute onset_ms at most 150 is below 0.8 (the F3 pass bar, engine spec section 2). Applies to keys only |
| Window | Unchanged: the matcher window W (section 2). A note beyond W is "missed" and belongs to X2, not K7 |
| Direction | Count off-beat notes later than +150 and earlier than -150; the larger side names the cue; a tie says late |
| Tier and order | Tier 6, after K3 and K4 (a tempo cause explains timing drift better), before K5 |
| Cue, late | "Press each key right on the click, not after it." |
| Cue, early | "Wait for the click, then press the key." |
| Cause text | late: "Several notes land after the beat"; early: "Several notes land before the beat" |
| Proof | Metric "Notes on the beat", proof_n metric F3: before = on-time count, target = N, of = N (for example 4 of 7 to 7 of 7) |
| Pass link | "none" for a keys take also needs the on-time share at 0.8 or more; this makes the cue and the proof card agree |

- Why not reuse V10 and V11: they test the median and a spread, which a minority of late notes does not move.
- Why the F3 bar and no new number: 0.8 is already the engine's steady-beat bar; the 150 ms tolerance is the contract's demo value. Both are team guesses to tune on Saturday.
- Checked against the sixteen fixtures: the on-time shares of every keyboard fixture are fx-01:7/7:K1, fx-02:7/7:K5, fx-03:7/7:none, fx-06:7/7:K5, fx-07:7/7:K1, fx-11:2/2:none, fx-13:1/2:X2 (id:on time:N:v1.1 cue). Only F13 sits below 0.8 (1 of 2) and its cue X2 has tier 3, so no v1.1 cue changes.
- Also checked: 4 of 7 notes 210 ms early gives K7 early (on time 3 of 7); a clean take stays "none" (7 of 7); a 6% rush on Ode bars 1-2 at 80 bpm (all notes inside W) gives K7 early, not K3, because 6% is under the K3 threshold.

#### Fixture F17 (proposal)
```json
{"schema":"take/v1","id":"fx-17","phrase_id":"twinkle-b3-4","small_goal_id":"sg-demo-1","session_id":"s-fixture","instrument":"keyboard","input":"midi","started_at":"2026-11-07T10:00:00+11:00","take_no":1,"is_retake_of":null,"counts":true,"bpm":60,"beats_per_bar":4,"count_in_beats":4,"duration_ms":9000,"tempo_pct":66.7,"latency":{"method":"output_timestamp","correction_ms":0,"output_ms":null,"input_ms":null,"clock_drift_ms":0},"notes":[
    {"i":0,"pitch_midi":65,"onset_ms":12,"onset_raw_ms":12,"dur_ms":900,"velocity":80,"rms":null,"conf":1,"wobbles":null,"pitch_series_midi":null},
    {"i":1,"pitch_midi":65,"onset_ms":1230,"onset_raw_ms":1230,"dur_ms":900,"velocity":80,"rms":null,"conf":1,"wobbles":null,"pitch_series_midi":null},
    {"i":2,"pitch_midi":64,"onset_ms":2035,"onset_raw_ms":2035,"dur_ms":900,"velocity":80,"rms":null,"conf":1,"wobbles":null,"pitch_series_midi":null},
    {"i":3,"pitch_midi":64,"onset_ms":3230,"onset_raw_ms":3230,"dur_ms":900,"velocity":80,"rms":null,"conf":1,"wobbles":null,"pitch_series_midi":null},
    {"i":4,"pitch_midi":62,"onset_ms":4018,"onset_raw_ms":4018,"dur_ms":900,"velocity":80,"rms":null,"conf":1,"wobbles":null,"pitch_series_midi":null},
    {"i":5,"pitch_midi":62,"onset_ms":5230,"onset_raw_ms":5230,"dur_ms":900,"velocity":80,"rms":null,"conf":1,"wobbles":null,"pitch_series_midi":null},
    {"i":6,"pitch_midi":60,"onset_ms":6010,"onset_raw_ms":6010,"dur_ms":1900,"velocity":80,"rms":null,"conf":1,"wobbles":null,"pitch_series_midi":null}
  ]}
```
- Change note (7 Nov): the last note was held only 900 ms of its 2000 ms, which made today's rules give K5 (held-ratio spread 0.45), as in F02; it is now held 1900 ms (spread 0.05), so v1.1 gives `none`. Found by the prototype agent; re-checked in Node.
- Expected under v1.1: `none`. Expected under v1.2: `K7` (late), proof "Notes on the beat: 4 of 7 to 7 of 7". The take was not passed through validateTake tonight (only the matcher and rules were run); it has the same shape as F01. Reference run: all seven rows match, onset_ms +230 on notes 1, 3 and 5.

### 8.2 Issue 2: K3 (+10 percent tempo) against the matching window
- Rule recap: K3 fires when tempo_played is at least take.bpm x 1.10 (tier 6); the window is W = min(400, half the smallest gap between expected onsets) (section 2); X2 (missed note) is tier 3 and outranks K3.
- The arithmetic. A uniform rush by r from beat zero puts note k at expected time e_k divided by (1 + r); the error is e_k x (1 - 1/(1 + r)). At r = 10% that is 9.09% of the onset time.

| Phrase at 80 bpm (beat 750 ms) | Smallest gap | W | Last onset | Error of last note at 10% | First note outside W | Largest uniform rush that stays inside W |
|---|---|---|---|---|---|---|
| Ode bars 1-2 (8 quarter notes) | 750 ms | 375 ms | 5250 ms | 477.3 ms | note 6 (409.1 ms) | 7.7% |
| Ode bars 5-8 (15 notes, an eighth pair) | 375 ms | 187.5 ms | 10500 ms | 954.5 ms | note 3 (204.5 ms) | 1.8% |

- Formula for the last column: r = 1 / (1 - W / last onset) - 1: bars 1-2: 1 / (1 - 375 / 5250) - 1 = 7.7%; bars 5-8: 1 / (1 - 187.5 / 10500) - 1 = 1.8%.
- What v1.1 does with the 10% rush (reference run): bars 1-2 give rows hit x6, wrong, missed (note 6 is claimed by the neighbouring played D4, note 7 is missed, one played note is extra), cue X2; bars 5-8 give three hits then a run of missed and wrong rows (8 extra notes), cue X2. In both, tempo_played is computed from the damaged matches (75.4 and 80.7 bpm), so K3 could not fire even if X2 were absent. The prototype README's 477 ms figure is confirmed; its "K3 cannot fire on bars 5-8" is also confirmed, and the error of the last note there is larger than a whole beat (954.5 against 750 ms).

| Option | Verdict |
|---|---|
| (a) Wider window | Rejected. Bars 1-2 need W of at least 477 ms, but 375 ms (half the gap) is exactly where a played note becomes nearer the previous expected note, so the match becomes ambiguous; bars 5-8 would need 955 ms, more than a gap |
| (b) Drift-aware matcher | Proposed (v1.2). Keeps the window small and fixes the cause: the matcher compares against a tempo-adjusted grid |
| (c) Lower K3 threshold | Rejected as the fix. It must be at most 7.7% for bars 1-2 and 1.8% for bars 5-8; 1.8% is far below the 150 ms tolerance (20% of a beat at 80 bpm), so it would fire on ordinary timing noise. A 7% threshold is a possible stop-gap for bars 1-2 only |

#### Drafted v1.2 matcher (proposal; untested beyond the Node run below)
- Step 1: run the v1.1 in-order walk. Take the pitch-correct matches among the earliest four expected notes; with at least two, fit scale s = (played span) / (expected span) between the earliest and latest of them, and offset o so the earliest pair lines up.
- Step 2: predicted time of expected note i = o + s x e_i; re-run the walk with windows centred on the predicted times, width min(400, half the smallest gap x s).
- Step 3: onset_ms is still measured against the expected grid (played minus e_i), so "on the beat" and the proof card keep their meaning; tempo_played = take.bpm / s when a fit exists, else the v1.1 formula.
- Step 4: X2 fires only if notes are still missed after step 2. K3 keeps its 10% threshold. No field is added.
- Known limit: a rush that starts mid-phrase (the stored take 1 on Ode bars 1-2 rushes from note 5) is not seen by a fit on the earliest four notes; re-anchoring on the last two matched notes after every match is the natural extension (not tested).

#### Fixture F18 (proposal)
- Phrase: `{"schema":"phrase/v1","id":"ode-b1-2","title":"Ode, bars 1-2","key":"C","bpm":90,"beats_per_bar":4,"ease":1,"notes":[{"midi":64,"name":"E4","start_beat":0,"dur_beats":1},{"midi":64,"name":"E4","start_beat":1,"dur_beats":1},{"midi":65,"name":"F4","start_beat":2,"dur_beats":1},{"midi":67,"name":"G4","start_beat":3,"dur_beats":1},{"midi":67,"name":"G4","start_beat":4,"dur_beats":1},{"midi":65,"name":"F4","start_beat":5,"dur_beats":1},{"midi":64,"name":"E4","start_beat":6,"dur_beats":1},{"midi":62,"name":"D4","start_beat":7,"dur_beats":1}]}`
```json
{"schema":"take/v1","id":"fx-18","phrase_id":"ode-b1-2","small_goal_id":"sg-demo-1","session_id":"s-fixture","instrument":"keyboard","input":"midi","started_at":"2026-11-07T10:00:00+11:00","take_no":1,"is_retake_of":null,"counts":true,"bpm":80,"beats_per_bar":4,"count_in_beats":4,"duration_ms":9000,"tempo_pct":88.9,"latency":{"method":"output_timestamp","correction_ms":0,"output_ms":null,"input_ms":null,"clock_drift_ms":0},"notes":[
    {"i":0,"pitch_midi":64,"onset_ms":0,"onset_raw_ms":0,"dur_ms":600,"velocity":80,"rms":null,"conf":1,"wobbles":null,"pitch_series_midi":null},
    {"i":1,"pitch_midi":64,"onset_ms":682,"onset_raw_ms":682,"dur_ms":600,"velocity":80,"rms":null,"conf":1,"wobbles":null,"pitch_series_midi":null},
    {"i":2,"pitch_midi":65,"onset_ms":1364,"onset_raw_ms":1364,"dur_ms":600,"velocity":80,"rms":null,"conf":1,"wobbles":null,"pitch_series_midi":null},
    {"i":3,"pitch_midi":67,"onset_ms":2045,"onset_raw_ms":2045,"dur_ms":600,"velocity":80,"rms":null,"conf":1,"wobbles":null,"pitch_series_midi":null},
    {"i":4,"pitch_midi":67,"onset_ms":2727,"onset_raw_ms":2727,"dur_ms":600,"velocity":80,"rms":null,"conf":1,"wobbles":null,"pitch_series_midi":null},
    {"i":5,"pitch_midi":65,"onset_ms":3409,"onset_raw_ms":3409,"dur_ms":600,"velocity":80,"rms":null,"conf":1,"wobbles":null,"pitch_series_midi":null},
    {"i":6,"pitch_midi":64,"onset_ms":4091,"onset_raw_ms":4091,"dur_ms":600,"velocity":80,"rms":null,"conf":1,"wobbles":null,"pitch_series_midi":null},
    {"i":7,"pitch_midi":62,"onset_ms":4773,"onset_raw_ms":4773,"dur_ms":600,"velocity":80,"rms":null,"conf":1,"wobbles":null,"pitch_series_midi":null}
  ]}
```
- Expected under v1.1: `X2`. Expected under v1.2: `K3` (tempo_played 88 bpm against 80 bpm; all eight rows "hit"; extra 0). Reference run (Node, mocked): v1.1 X2 with statuses hhhhhhwm; v1.2 K3 with statuses hhhhhhhh. Under v1.2, K7 would also fire (on time 3 of 8, early) but K3 outranks it.
- Add an Ode bars 5-8 variant of F18 when the team confirms the note list (the prototype typed it from the engine spec's description; open question 14).

### 8.3 M1 for an empty keys take
- Symptom: the contract's M1 cue "Hold the phone closer and play it again." makes no sense when no key press arrives from a keyboard or the on-screen keys.
- Proposal (text only, no schema change): when take.input is "midi" or "screen" and the take is empty, M1 uses cause "The app did not hear any keys" and cue "Check the keyboard is connected or tap a key on screen, then play it again." (15 words, under the 20-word limit). Voice keeps the existing wording.
- The proof line for the keys variant is "Notes heard: 0 of N to N of N".

## Method
- Section 8 (added 7 Nov for the prototype issues): recomputed the K3 and window arithmetic in Node, ran the K7 and drift-aware matcher on mocked takes, checked K7 against the sixteen fixtures; no new Codex call (budget); results are proposals.
- Read the nine named sections plus the Codex input review and compared them field by field.
- Wrote a reference matcher, rule subset and the validator in Node, built sixteen fixtures, ran them: 16 of 16 cues (or rejections) matched, 22 of 22 broken takes caught. The script is not shipped (one-file rule); the validator is reproduced above.
- Opened MDN `getOutputTimestamp` (2026-11-06): confirms pair semantics. Opened MDN `MIDIMessageEvent`: does not state the timeStamp clock, so that mapping is marked verify.
- Codex critique (gpt-6-sol, medium, no names, fixtures F03 to F10 trimmed from the prompt): 8 findings.
  o Kept and fixed: the Features example was inconsistent (now the real F01 output); F02 lacked retake fields (added); validator too weak (added schema, pair, finite, notes_in_tune, counts and cue-scan checks plus three negative tests); matcher order made deterministic; write sequence for engine-owned cue fields; tempo rounding and fragment rule; timing corrections described as estimates; MIDI timeStamp checked against the W3C spec; Saturday real-take acceptance gate.
  o Kept as open: fixtures for repeated notes, chords and overlaps; proxy logging policy.
  o Rejected: none. Not repeated after folding (one critique per file, budget).
- Coordinator message (20:16) folded in: leave-device column now follows privacy-design-v1.md section 5.1; typed goal and words travel with the LLM call; pseudonymous ids, no first names.
- Not verified: browser behaviour of `getOutputTimestamp()` and MIDI timestamps on the stage laptop (Saturday test); nothing in the contract ran in a browser.
- Second review (gpt-6-sol, high, no web, names stripped; file contract-recheck-answer.md), verified in Node against the real validator and fixtures:
  o Folded: the validator rewrite (type guards, finite bpm in range, integer onsets of at least -400, onset equals raw minus correction, unique played_i, row shapes by status, whole cue set checked before the per-take checks, whitespace text, hand-off equivalence, audio scan on the plan, regex on key names); timing points (unusable-take list, 1500 ms correction range, round once); six fixtures F11 to F16; X2 and the cue precedence table; versioning freeze in the change rule.
  o Adjusted: F12 (chord) became a phrase rejection, not a cue; F13 (overlap) became X2 because the window shrinks to half the gap; F16 got onsets with spread so V11 fires (the reviewer's uniform early shift gives M2 under the feedback layer rule).
  o Rejected: M2 only on "independent evidence of bad calibration" (no such measure exists in the data; the contract keeps the feedback layer's uniform-shift rule, made symmetric); an out_of_scope cue for chords and overlaps (replaced by rejection and the half-gap window); full schemas for Plan and Cue proof (listed as unchecked in section 4, not built tonight).


## Open questions
1. The Web MIDI spec defines the event time as a high-resolution time of receipt [12] but defers the origin; confirm it equals the `performance.now()` origin on the stage laptop (log both in the handler, 15 minutes). Device and browser delay stay unmeasured either way.
2. Does `getOutputTimestamp()` return usable values on the stage browser? If not, fallback method and a loopback test decide.
3. Typed goal and words go with the LLM call per privacy-design-v1.md section 5.1 [7]; who strips names and places (proxy or client), and is the cloud coach off for under 15 as v1 says?
4. Does the team accept new rule X1 (octave error)? The feedback layer owner must add it and the LLM enum.
5. Spread definitions (standard deviation, max minus min) and the 150 ms versus 120 ms thresholds: tune on real takes.
6. Which demo phrase? The contract carries any phrase; the fixtures are Twinkle bars 3-4 pending the team's choice.
7. Matcher cases still without a fixture: a wrong press followed by the correct press inside one window, a stray extra note, a double-tapped key. Add them when real takes show which occur.
8. Proxy and platform logs: v1 proposes 14 days and no IP; the client contract cannot guarantee that, so the tech owner confirms the hosting and CDN logs.
9. Who owns `counts` and the ladder fields? The contract says the engine after the rules; the engine owner confirms.
10. Reported by the coordinator, not read in full by me: small-goals-engine-spec-v1.md logs five disagreements with this contract's names. It treats an octave error as a cause of F1/F2 (an F1 or F2 hit needs `octave_off` 0, rule X1 joins F2) and a half-phrase as its own phrase record. The second agrees with section 2 here; for the first, confirm the engine reads `octave_off` and not `wrong_note` (voice never sets `wrong_note`). Its files are unchanged by me.
11. build-plan-v1.md declares this file the binding schema and sets the stage retake at 80 bpm from `stage.json`. At 80 bpm from a 90 bpm phrase `tempo_pct` is 88.9 and W is 375 ms; the fixtures run at 60 bpm, so add one 80 bpm fixture once the stage phrase file exists.
12. X2, symmetric M2 and the cue precedence table are proposals; the feedback layer owner accepts them or the contract drops them.
13. Prototype issues (section 8, proposals): accept K7 (late or early keys notes), the v1.2 drift-aware matcher with fixtures F17 and F18, and the keys wording for M1? Until accepted the binding v1.1 rules stand.
14. Ode bars 5-8 notes in the prototype were typed from the engine spec's description, not a score; confirm them before an F18 variant is built on them.

## Sources
1. tech-keyboard-input.md sections 6 and 10 (this folder), opened 2026-11-06.
2. tech-pitch-detection.md sections 3, 6, 8 (this folder), opened 2026-11-06.
3. tech-feedback-layer.md sections 2, 3, 4 (this folder), opened 2026-11-06.
4. small-goals-engine-spec.md sections 2, 3, 7, 11 (this folder), opened 2026-11-06.
5. build-plan-v0.md sections 6 and 7 (this folder), opened 2026-11-06.
6. demo-phrase-and-rights.md sections 1 and 4 (this folder), opened 2026-11-06.
7. privacy-design-v1.md sections 1, 5 and 5.1 (this folder; replaces v0 for the leave-device column), opened 2026-11-06.
8. https://developer.mozilla.org/en-US/docs/Web/API/AudioContext/getOutputTimestamp, accessed 2026-11-06, opened.
9. https://developer.mozilla.org/en-US/docs/Web/API/AudioWorkletGlobalScope/currentFrame, snippet (cited by the Codex review; not opened), accessed 2026-11-06.
10. https://developer.mozilla.org/en-US/docs/Web/API/MIDIMessageEvent, accessed 2026-11-06, opened (silent on the timeStamp clock).
12. https://www.w3.org/TR/webmidi/, accessed 2026-11-06, opened (first 100,000 of about 113,000 characters): event timeStamp is a DOMHighResTimeStamp, the time the system received the message; the origin is deferred to the DOM Event definition.
13. prototype-skeleton.html (this folder), README block and open-questions list, opened 2026-11-07 (the file mtime says 22:51 on 6 Nov); an internal build, not a public source.
11. Codex GPT-6 review of the two input notes (scratchpad file input-paths-answer.md; a second opinion, not truth).
