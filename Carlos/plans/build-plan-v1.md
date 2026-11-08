# Build plan v1: the listening practice coach (Sat 7 to Wed 11 Nov)

- Date: Fri 6 Nov 2026 (AEDT), overnight. Revises build-plan-v0.md (left unchanged) after three reviews and tonight's tech files.
- Purpose: what to build Saturday to Tuesday, in what order, the test each block must pass, and what is cut at each checkpoint.
- Recommendation: keyboard path demos by Saturday 12:30, voice path by 19:00; one shared take record; stage build makes no network call.
- Status: overnight draft for the team; verify before the pitch. Binding schema: take-data-contract.md. Sections 1 to 13 keep v0's numbering; 14 to 16 are new.

## 0. Decide first (Sunday, with Simone)
### Two things stated once (no longer open)
| Item | v1 statement | Source |
|---|---|---|
| Stage input | One USB MIDI keyboard into Chrome on the stage laptop; on-screen keys (and laptop letter keys) are the only fallback; no microphone on stage | demo-instrument-decision.md s1, s5; tech-keyboard-input.md s1; verification-overdrive.md s4 row "Demo input" |
| Stage build and the cloud | No external requests on the stage path (localhost only): cues come from the on-device rules (Layer 1); no live LLM call, no live Webex post | functional-requirements-v0.md R11, R12; verification-overdrive.md s4 row "Cloud use" |
| The one model step that really runs | Goal split (T26): the learner's typed goal goes through the proxy to the model with schema-locked output (nine fundamental ids, supplied phrases only); real answers recorded Saturday evening or Monday; on stage the saved answer shows with the tag "example output, recorded <date>"; live only at the stand when online and consented | self-assessment-v0.md s1 row 8, s5 row 5; small-goals-engine-spec.md s4, s11; tech-feedback-layer.md s4, s7 |
| What leaves the device (only when the cloud coach is switched on) | For the goal split: the typed goal (names and places stripped, length capped), instrument, phrase ids. Never audio, never a recording. The model provider has no Australian region, so this is an overseas disclosure; the offline rules template stays the Must | privacy-design-v1.md s1, s5.1, s6 |
- Stage line that matches all three: "It knows every key you play; the cue is worked out on this laptop. Online, a model turns your goal into small steps; here is one it made."
- Answer to "where is the AI?": "Rules catch what was measured; the model turns your own goal into a plan. Offline, a built-in plan takes over."
- Never on stage with the MIDI keyboard: "it hears you" (demo-instrument-decision.md s1).

### The four decisions
| # | Decision | Options | What each costs | Lean | Owner (role) |
|---|---|---|---|---|---|
| D1 | Demo phrase | (a) Twinkle bars 3-4, F F E E D D C (demo-phrase-and-rights.md s1); (b) Ode to Joy bars 1-2, E E F G G F E D (demo-instrument-decision.md s4); (c) Ode to Joy bars 5-8, 15 notes (small-goals-engine-spec.md s5) | See section 6 cost table: (a) shows R17 live but needs engine fixtures re-keyed (about 1 h); (b) fits the 12 s retake slot, matches the freeze default, but no visible R17; (c) matches engine fixtures but about 19 s a take at 63 bpm, breaks the slot | None: team decides; build is phrase-agnostic | Research and UX lead (Simone), with the model and web lead |
| D2 | Instrument on stage | (a) MIDI keyboard live, voice as story; (b) voice live, only if Saturday's noisy-room whole-loop test passes AND the loop is ahead of plan; (c) real keyboard through a microphone | (a) as built; (b) needs checkpoint D green plus a stage mic; (c) needs a keyboard that makes its own sound plus mic tests in hall noise | (a), with (b) as the documented overturn rule | Research and UX lead (Simone) |
| D3 | Hand-off mock depth | (1) in-app card plus a static Webex-style screen, no network; (2) as (1) plus a real Webex post to a team test space on Tuesday; (3) in-app card only | (1) about 1.5 h; (2) +2 to 3 h, a bot token to guard, and still "mock pilot" wording; (3) about 1 h, weaker Cisco fit | (1); (2) is never on the stage path | Infrastructure and rig lead (Carlos) |
| D4 | What is cut if Saturday ends half done | (a) keep the keyboard arc whole, voice becomes a recorded take run through the real detector; (b) keyboard arc plus a live voice pitch line with no voice cue; (c) both half built | (a) loses live voice only; (b) costs about 2 h of extra polish for a line that proves little; (c) risks no clean arc at all | (a), set now so nobody argues at 17:00 | Model and web lead (Justin) calls it at checkpoint C |
- D1 does not block Saturday: all three phrase files load, every selftest runs on all three, one replay take is captured for each.
  o Sunday writes the choice into `data/stage.json`; nothing else changes. Freeze (Tuesday 15:00) locks it.

## 1. Recommendation
- One offline web app (PWA), plain JavaScript modules, no bundler; every Must runs on the device.
- Stage: laptop Chrome on HDMI, USB MIDI keyboard, app on localhost; phone is the "works in your pocket" proof at the stand.
- One shared take record for keys and voice (section 7): adapters differ, everything after the adapter is the same code.
- Saturday order: rig check, phrase and take contract, keyboard vertical slice by 12:30, voice slice by 19:00 (section 8).
- Demo arc unchanged from v0: take 1 = labelled replay of a captured take through the real scoring code; the retake is live.
  o The planted error in take 1 maps to exactly one rule, and the selftest asserts that rule fires (section 6).
- Feedback: rules table from tech-feedback-layer.md s3 is authoritative; the per-take LLM rewrite is a post-pitch stretch.
- One model step is a Must by Monday 14:00: the goal split (T26), run for real, saved, shown labelled; rules template is its offline fallback.
- Mock honestly: hand-off card and Webex-style screen, sample week, class bar. Each labelled on screen or in speaker notes.
- Realistic effort is about 45 developer hours against v0 16 (section 8 table); Saturday holds the must-pass items only.
- Saturday pass line (cut to this if late): one phrase, MIDI or on-screen keys, one measured cue, live retake, count pair, cold offline reload.

## 2. Product scope for Wednesday
### In scope
| Item | Wednesday version |
|---|---|
| Learner | One beginner; age band set Sunday (accessibility-design-v0.md s8 leans young adult); copy swaps in `copy.json` |
| Instrument on stage | MIDI keyboard (section 0); voice shown from a recorded take run through the real detector, called a tested prototype |
| Learner goal | "Play this song for mum" (keys) chosen from chips; "make this cover sound good" as copy only |
| Phrase | Whatever D1 picks, from a data file; easiest-first claimed only if the ease score shows it (section 6) |
| Learner words | Three chips ("too high", "I'm rushing", "can't hear it") shown beside the measured cause (R2, rules only) |
| Time span shown | Day 1 live; days 2 to 7 from seeded data, labelled "sample week" |
| Loop | Set-up and range shown as completed steps (labelled), small goal, live line, one fix, live retake, proof, two lines, hand-off card |
### Non-goals (say no on Saturday)
- Mixing, effects, loudness or engineering terms (R6). Describe the synth as "plays our typed note list as a fixed guide".
- Accounts, real cloud sync, leaderboards, streaks, badges, game skins, a teacher marketplace.
- Any network call in the stage build: LLM wording, live Webex post, analytics, CDN fonts or scripts.
- Guitar camera coaching (vision slide only); a second instrument live; sampled pianos (keep the 5 MB budget and the stage rights line).
- Real student data; any copyrighted song, recording or backing video (R13).

## 3. Decision points (settled by tonight's tech files)
| Area | v0 default | Tech file says | v1 adopts |
|---|---|---|---|
| Pitch tracker | pitchy on AnalyserNode | Pitchy primary (MIT on npm 4.1.0; repo 0BSD); SwiftF0 fallback (MIT, 135 KB model + 4.6 MB runtime, training-data provenance flag); plain autocorrelation as emergency (tech-pitch-detection.md s1) | Pitchy 4.1.0 vendored into `vendor/` as a local ES module with fft.js; no CDN at runtime. SwiftF0 deferred past Wednesday; accessibility-design-v1.md marks it online-only (4.7 MB breaks the 5 MB precache cap) with 50-line autocorrelation as the offline fallback |
| Mic frames | AnalyserNode | AudioWorklet frames, clarity gate | AudioWorklet; timestamp frames by `currentFrame` (MDN, opened [20]); AnalyserNode only for the level meter |
| Keyboard input | Web MIDI on laptop, on-screen keys elsewhere | Class-compliant 25 to 32 key USB MIDI into Chrome; on-screen keys fallback; iPad has no Web MIDI (tech-keyboard-input.md s1, s8) | Same; Bluetooth MIDI avoided on stage |
| Sound | Web Audio oscillators | Tone.js or smplr (MIT) with Salamander samples (CC BY 3.0) | Tone.js oscillator synth (MIT), no samples: keeps the 5 MB budget and the "no recording" stage line (demo-phrase-and-rights.md s6) |
| Feedback display | Key lights | Lit keys plus piano roll (ghost bars expected, solid bars played); staff notation optional (VexFlow MIT) | Lit keys plus piano roll; no staff notation before Wednesday |
| Cue logic | 5 rules | 20 rules with tiers, tie-breaks, persistence ladder (tech-feedback-layer.md s3) | Full table as data in `data/rules.json`; stage arc uses K-rules only |
| LLM layer | Proxy as Monday stretch | Layer 2 Sonnet or Haiku, schema-locked JSON, about US$0.04 per routed 20-minute session, mock mode (tech-feedback-layer.md s4, s6) | Per-take rewrite not built before Wednesday; goal split built (T26) on Sonnet with structured output, cached for stage; no "AI writes the cue" claim |
| Engine | Hand templates, 5 to 8 steps | Pure functions, nine fundamentals F1 to F9, offline classifier, spread and re-spread, miss ladder (small-goals-engine-spec.md s1 to s9) | Adopted as specified; model split built once (T26) with three labelled states: live (online, consented), example (saved answer, tagged), template (offline rules plan) |
| Asset budget | Under 5 MB, `unverified (Codex knowledge)` | 5 MB planning target; Android 10 floor for current Chrome (accessibility-design-v0.md s2, s3) | Measure built size Monday; Android 10+ only |
| Licences | Permissive only | No GPL, AGPL, non-commercial (decisions-log.md, overnight row) | `NOTICES.md` in the app plus an about screen: Pitchy, fft.js, Tone.js |
- Facts still constraining every option (from v0; verification-overdrive.md s6 left the starred ones unverified):
  o Mic needs a secure context (HTTPS, localhost); on plain http `navigator.mediaDevices` is undefined [1].
  o Web MIDI needs a secure context and a permission prompt, even without SysEx, since Chrome 124 [3][4]*.
  o No Web MIDI in Safari, so none on iPad [5]*.
  o AudioContext created outside a tap starts suspended; the Start tap calls `resume()` [18].
  o Requesting mic processing off is not proof it is off: log `track.getSettings()`, which reports applied values, some possibly missing (MDN, opened [22]).

## 4. Architecture
### What runs where
| Part | Runs on | Stage build |
|---|---|---|
| UI, screens 0 to 8 | Laptop or phone browser, phone-width layout | Laptop, full screen |
| Input adapters | Device: `midi.js`, `onscreen-keys.js`, `mic.js` + `voice-notes.js` | MIDI, on-screen keys ready |
| Clock | Device: `clock.js` (one audible beat zero, section 4 timing) | Yes |
| Matcher, features, rules | Device, pure functions, same for both inputs | Yes |
| Small-goals engine | Device, pure functions | Yes |
| Store | IndexedDB; audio blob null by default (R11) | Seeded start state, reset in 10 s |
| Synth guide and count-in | Tone.js oscillators on the AudioContext clock | Yes |
| Telemetry | Local log, export JSON (C2 timestamps) | Logging on, never uploaded |
| Goal-split proxy (T26) | One serverless function holding the API key; validates, strips names and places, calls the model, checks the schema | Off; saved answers from `data/cached-splits.json`, tagged "example output" |
| Per-take LLM wording | Not built | Off |
- Proxy logs (privacy-design-v1.md s5.1 and change-log row 1): a random pseudonymous device id, call counts, schema pass or fail, latency; rate limiter in memory; no IP kept beyond the request; logs live 14 days.
  o Hosting and CDN platform logs are separate: switch off or shorten; tech to confirm on the chosen host.
- Fallback: offline, timeout over 3 s, invalid JSON or refusal = the rules template plan (small-goals-engine-spec.md s4); the screen never waits on the model.
| Hand-off | In-app card plus Webex-style mock screen (D3) | Mock, labelled |
### Timing (new in v1; the reviews found v0's "MIDI is exact" too loose)
- Every onset is stored in ms from the audible beat zero of the count-in (shared take, section 7).
- Count-in and guide are scheduled on `AudioContext.currentTime` with look-ahead, never on JS timers.
- Map audio time to page time with `getOutputTimestamp()`: it returns `contextTime` and `performanceTime` for the frame now at the output (MDN, opened [21]).
  o MIDI: convert `event.timeStamp` (page clock) to ms from beat zero in `midi.js`.
  o Voice: timestamp frames by sample count (`currentFrame`, advances 128 per render block, [20]); never by `requestAnimationFrame`.
- Residual device delay: measured once at set-up by a tap-along with the click (keys) and a clap-back test (mic), stored per device as `calibration`.
  o `getOutputTimestamp` covers output timing only; `currentFrame` places captured frames; neither measures mic capture delay alone, so the clap-back test does.
  o M2 mid-take only suggests re-running set-up; it never rewrites timing, so a learner who is late every note still gets the late cue.
- Pitch is exact on MIDI; timing is only as good as this clock. Log `e.timeStamp` and `performance.now()` for ten notes on each device.
### PWA and offline (v0 kept, two fixes)
- Files: `index.html`, `manifest.webmanifest`, `sw.js`, icons 192 and 512 px, `src/`, `vendor/`, `data/`.
- Hand-written service worker: precache shell, cache-first, versioned cache, activate deletes old caches [8][19].
- New: the build version (release tag) shows in a corner of every screen; check it against the tag Carlos pushed, and run the asset check (every precached file present) after each deploy.
- New: a cold offline test = server stopped or Wi-Fi off, browser closed, reopen, full loop incl. replay. "Loaded once" is not proof.
- Laptop localhost works offline only via the cached build or a running local server; test both ways [19].
- Laptop and phone are separate origins: separate storage, permissions and seed data; seed each device.
- Storage: `navigator.storage.persist()`; Safari may delete script data after 7 days unused; "reload demo data" button [9].
### Serving the app (v0 table kept)
| Option | Mic and MIDI | Offline | Verdict |
|---|---|---|---|
| Laptop localhost | Yes [1] | Yes | Stage default |
| Phone from a free static HTTPS host, load once, then cold offline test | Yes | After a full load and a cold reopen | Phone proof (C5a) |
| Phone over laptop LAN IP, plain http | No [1] | n/a | Never |
| Phone over LAN HTTPS with mkcert | Yes once the CA is trusted [10] | Needs the laptop | Backup only |
- GitHub Pages from a private repo needs a paid plan and the site is public [11]*; Carlos picks the host.
### Stage set-up (from demo-instrument-decision.md s3)
- Laptop on HDMI in duplicate mode; keyboard on its own cable (spare cable and USB-C adapter carried); app sound via HDMI to the PA if routed.
- Presenter at the keyboard with a hands-free mic; operator behind the laptop owns both fallbacks.
- Cue text and number at least about 50 mm tall on the screen for a 10 m view (planning floor from that memo); checked in the room.
- Backup laptop with the same build, seed and recording; recording also on a phone.

## 5. Screens (one job each; build names are canonical, pitch files should adopt them)
| # | Screen | Its one job | Data in | Data out | Req |
|---|---|---|---|---|---|
| 0 | Goal entry | Learner names the result they want | Chips or free text | `goal`, plan from engine | R14 |
| 1 | Set-up check | Right input, level fine, room quiet | Input list, 5 s level, `getSettings()` log | `learner.input_ok`, noise floor | R7 |
| 2 | Range check | Voice: comfortable notes and key; keys: hand position | Siren, lowest, highest; or C to G | `range_low/high`, key | R4 |
| 3 | Next small goal | Today's one small goal and why it helps the goal | `small_goal`, its fundamental | Start take | R14, R16, R17 |
| 4 | Live line | Ghost bars and played bars, lit next key, count-in | Phrase, adapter events | Shared take | R1, R8 |
| 5 | One fix card | One cause, one cue, the visual of what to play; learner's chip shown beside the measured cause | Take features through rules | `cue` | R2, R3, R5, R6, R17 |
| 6 | Retake proof | Before and after on the same phrase, one count pair | Two takes | Pass or same cue; `progress` | R3 |
| 7 | Two progress lines | "Your goal" and "your skill" plus ahead line; rest banner here | `progress` | Nothing | R15, R9 |
| 8 | Hand-off card | At the ceiling: goal, fix tried, proof so far, share toggle, ask | Cues with miss 3, consent | Webex-style mock | R10, R11 |
| T | Two questions (test mode only) | Trust and usefulness 1 to 5; help, neutral or homework | After the retake | Local export | C3, C4 |
- Replay label: take 1 on screen 4 carries "Take 1, recorded Saturday" whenever it comes from a capture file.
- Ceiling on stage: shown as a separate scripted case ("after three sessions on the same fix"), never as if a successful retake triggered it.
- Copy rules (Simone owns): plain words, no dB or Hz on screen, one sentence a card, no shaming copy.

## 6. The demo phrase (phrase-agnostic)
### How the build stays agnostic
- Each phrase is one file `data/phrases/<id>.json` in the expected-notes format: `{ id, bpm, beatsPerBar, notes: [{ midi, startBeat, durBeats }] }`.
  o Paste-ready lists for all candidates are in demo-phrase-and-rights.md s4; Ode bars 5-8 is typed from the engine spec's source and checked by ear.
- `data/stage.json` names the stage phrase, its harder "next goal" phrase, tempo, and the replay capture file.
- Ease score: one formula in code, small-goals-engine-spec.md s5 (E = 0.30 S + 0.25 J + 0.20 D + 0.15 R + 0.10 H).
  o R17 ("starts at the easiest part") is said on stage only if the chosen phrase is the strict minimum, not a tie-break win.
- Take-1 replay: captured after the matcher and rules pass their selftest, never before; one planted error per capture, mapped to one rule.
- Selftest: `--suite stage` loads `stage.json`, replays the capture, asserts the expected rule id and the before count; a fixture retake asserts the comparison logic.
  o The live after count is whatever Wednesday's retake scores; never asserted, never edited.
### The three options (D1) and what each costs
| Option | Notes, length | Retake time incl. 4-beat count-in | R17 on stage | Planted error and rule | Count pair | Rework if chosen |
|---|---|---|---|---|---|---|
| (a) Twinkle bars 3-4 | 7 notes, 8 beats | 9 s at 80 bpm; 11.4 s at 63 | Visible: skips bars 1-2 (leap of a fifth) | Wrong first key, K1 (tier 3); or rush, K3 | K1 is yes or no; K3 gives "on the beat 4 of 8 to 8 of 8" | Engine fixtures re-keyed (cases 1, 3, 5, 10 and the 14-day example), about 1 h; freeze playbook default line edited |
| (b) Ode bars 1-2 | 8 notes, 8 beats | 9 s at 80 bpm | Not visible (bar 1 is already easiest); show "bars 9-12 come later" | Rush from note 5, K3 (tier 6) | "On the beat: 4 of 8 to 8 of 8" | Least: matches demo-instrument-decision.md s4 and the freeze default |
| (c) Ode bars 5-8 | 15 notes, 16 beats | About 19 s at 63 bpm (demo-instrument-decision.md s4 arithmetic) | Visible only by tie-break (bars 1-4 score the same) | Any; more room for errors | Larger counts | Breaks the 12 s retake slot; needs a two-bar slice, which becomes option (b) or similar |
- Times are our arithmetic: (beats + 4) x 60 / bpm.
- Voice story: whichever melody wins, the scored voice take is sung on "loo" (consonants break the line; demo-phrase-and-rights.md s3).
- Rights line for any of the three: "Public-domain melody, notes typed by us, sound made by our app: no third-party recording or arrangement, no karaoke video."
  o Ode and Twinkle dates in v0 were snippet-level; verification-overdrive.md s6 left them unverified; demo-phrase-and-rights.md s4, s6 holds the stronger check.
### Tempo and key
- Keys: C major; learner practice starts at 70% of target, +10% after two clean takes (R16).
  o Stage exception: the demo retake runs at 80 bpm from `stage.json` (9 s with count-in); 70% of 80 bpm would take 12.9 s and overrun the 12 s slot.
- Voice: range check transposes the phrase so its top note sits two semitones under the highest full note.
- Guide during a voice take: headphones, or guide muted after the count-in (the mic tracks a speaker guide).

## 7. Data model, shared take and small-goals engine
### Stores (small-goals-engine-spec.md s3 adopted whole)
- `learner`, `goal`, `small_goal`, `session`, `take`, `feature_set`, `cue`, `progress` as in that table; `progress` always recomputed from counted takes.
- Static files: `fundamentals.json`, `phrases/*.json`, `templates.json`, `rules.json`, `thresholds.json`, `copy.json`, `stage.json`.
### The shared take (one record for both inputs, the feedback layer and the engine)
- Binding schema: take-data-contract.md (landed 20:19 tonight): `take/v1` plus `take-features/v1.1`. Where the record below differs, the contract wins on Saturday; differences are listed in Open questions.
  o Contract choices that differ from this sketch: phrase fields `start_beat`, `dur_beats`; master clock = AudioContext time in integer ms; features v1.1 adds `status`, `played_i`, `octave_off` and three summary counts; missed rows use null.
  o Its validator was run in Node on fixtures only, never in a browser or on a real take: checkpoint A is its first real test.
  o Update since v1 was drafted: the contract now has 16 fixtures, a rewritten validator, rule X2 for skipped notes, a cue precedence table and pinned schema versions for the frozen demo. Saturday uses those as written; where its precedence differs from the tier order in section 7, the contract wins (Open questions).
- Naming: snake_case for everything stored; phrase files keep the published expected-notes names (`midi`, `startBeat`, `durBeats`); the loader converts once.
- Three layers: `raw` (what the adapter saw), `alignment` (one row per expected note, plus extras), `features` (take-features/v1, verbatim).
- JSONC: remove comments before `JSON.parse`.

```jsonc
{
  "id": "take-0042",
  "session_id": "s-07",
  "small_goal_id": "sg-03",             // null for a free take
  "phrase_id": "phrase-under-test",      // file name in data/phrases/; D1 decides which
  "input": "midi",                       // midi | on_screen | mic; nothing after the adapter reads this
  "is_retake_of": "take-0041",           // null for take 1
  "source": "live",                      // live | replay_capture (screen shows "recorded Saturday")
  "audio_blob": null,                    // R11: null unless the learner opts in to keep it
  "counts": true,                        // false if gated: M1 cannot hear, M2 device delay, off-day
  "gate_reason": null,                   // cant_hear | device_delay | off_day | null
  "timing": {
    "beat_zero_perf_ms": 81234.5,        // page-clock time of the audible first beat, via getOutputTimestamp
    "bpm": 80, "beats_per_bar": 4,       // copied from the phrase file and stage.json
    "calibration_ms": 0                  // per-device offset from the M2 tap-along; subtracted in the adapter
  },
  "raw": {
    "notes": [{
      "pitch_midi": 64.0,                // MIDI note; voice keeps a fraction for cents (63.92)
      "onset_ms": 34,                    // from audible beat zero, after calibration; may be negative
      "duration_ms": 690,                // key-down to key-up, or voiced span
      "velocity": 72,                    // 0-127 from MIDI; null for voice and on-screen keys
      "confidence": 1.0                  // 1 for key events; Pitchy clarity mean for voice
    }],
    "end_reason": "phrase_complete"      // phrase_complete (length + 2 beats) | stop_tapped | input_lost
  },
  "alignment": [{
    "expected_i": 0,                     // index into the phrase notes; null for an extra note
    "status": "matched",                 // matched | wrong | missed | extra
    "raw_i": 0,                          // index into raw.notes; null when missed
    "onset_error_ms": 34                 // played onset minus written onset; null when missed
  }],
  "features": {                          // take-features/v1 (tech-feedback-layer.md s2), unchanged names
    "instrument": "keyboard",            // voice | keyboard; picks V or K rules
    "take_no": 2, "session_min": 4.5,
    "target": { "key": "C", "tempo_bpm": 80, "phrase_id": "phrase-under-test" },
    "notes": [{
      "i": 0, "target": "E4",
      "cents_off": 0,                    // 0 on keys by construction
      "cents_series": [0,0,0,0,0,0,0,0], // voice: 8 points across the note
      "wobbles": 0,                      // feedback-layer meaning: frame flips over 50 cents (V4, V8, V9 thresholds use it)
      "held_ratio": 0.98,                // duration_ms over written duration: the "long note ended early" check
      "onset_ms": 34,                    // = alignment onset_error_ms
      "loud_rel": null,                  // acoustic level, voice only; never filled from MIDI velocity
      "wrong_note": false
    }],
    "summary": {
      "notes_in_tune": "8/8", "old_tune_pct": 0, // old_tune_pct = share matching the melody in the old key (V3)
      "range_used": ["C4","G4"], "comfort_range": ["A3","D5"], "above_range": 0,
      "tempo_played": 82, "onset_median_ms": 20, "onset_spread_ms": 25, "pitch_conf_pct": 100
    }
  },
  "local_only": {                        // never sent anywhere; the engine and the test export read it
    "velocity_rel": [1.0, 0.9],          // keys: velocity over take median, called "key strike", not loudness (K6, F7, F9 keys)
    "wobble_excursions": [0],            // nine-student-test-plan.md s7 count per held note (C1 headline); never mixed with "wobbles"
    "missed": 0, "extra": 0              // counts from alignment, for proof lines
  },
  "measures": { "F1": 1, "F2": 1, "F3": 0.5 }, // engine: F1..F9 shares 0..1 (small-goals-engine-spec.md s2)
  "passed": false,                       // the small goal's fundamental met its pass bar
  "cue_id": "K3", "cue_shown_perf_ms": 81251.0 // C2: telemetry pairs take end with cue shown
}
```
- Reconciled with tech-feedback-layer.md s2: `features` keeps every v1 field name, so its schema and 20-case test set work unchanged.
  o A later per-take rewrite may send `features` only; the goal split (T26) sends its own payload (typed goal, instrument, phrase ids), documented in section 0.
- Reconciled with small-goals-engine-spec.md s3: `take` fields `session_id`, `counts`, `measure(s)`, `passed` are here; `feature_set.features` stores the same block verbatim.
- Matching (one rule for both inputs): nearest unmatched expected note of the same semitone within the window = matched; a nearby wrong pitch fills an empty slot as wrong; leftovers are extra; unfilled slots are missed.
- Timing window: plus or minus 150 ms for both inputs, labelled a demo setting (a fifth of a beat at 80 bpm), tuned on Saturday takes.
- Voice in tune: nearest semitone for matching; plus or minus 50 cents for "in tune" (feedback layer); 25 cents only for an optional sustained-hold check.
- Take end: phrase length plus two beats, a Stop tap, or input lost; never "3 s of silence" (a rest or hesitation would cut the take).
### Fundamentals and rules
- Fundamentals F1 to F9 and pass functions: small-goals-engine-spec.md s2, unchanged; keys use F1 to F5, F7, F9; voice adds F6, F8.
- Rules: tech-feedback-layer.md s3 (M1, M2, V1 to V12, K1 to K6), tiers and persistence ladder, as data in `rules.json`.
- Corrections taken from the review:
  o "Long note ended early" reads `held_ratio` (note-off against written length), not onset deviation.
  o K6 and F7 on keys read `velocity_rel` and say "key strike"; neither is used for the stage cue.
  o Cause text names only what was measured, never fingers or technique.
### Engine logic
- As small-goals-engine-spec.md s4 to s9: offline classifier and templates, `spread()` and re-spread, ahead line never negative, miss 1/2/3 ladder, off-day check, ceiling at miss 3.
- Only counted takes move the lines, the controller or the ceiling (M1, M2, off-day takes never count).
- On screen: the template plan says "the coach splits your goal into small steps"; only a T26 model answer may say a model made it, tagged live or "example output".

## 8. Hour blocks and checkpoints
### Roles (freeze-and-rehearsal-playbook.md s2.2)
- Model and web lead (Justin): inputs, clock, voice. Infrastructure and rig lead (Carlos): rig, contract, matcher, rules, shell, deploy. Research and UX lead (Simone): copy, templates, cards, test kit.
- Owners are proposals; the roles table is still open in that playbook.
- Keyboard, cable and adapter: infrastructure and rig lead secures them before Saturday 09:00 (borrow or buy); else on-screen keys Saturday and a tested keyboard by Monday 14:00.
### Sat 7 Nov (at home; engine times follow small-goals-engine-spec.md s12)
| Time | Block (task ids, section 14) | Owner | Test before the next block |
|---|---|---|---|
| 09:00-09:30 | Stand-up; T1 rig check: plug the keyboard, Chrome MIDI permission, note numbers on a test page, HDMI to a TV | All; Carlos | Real keyboard's note numbers appear; or "no keyboard yet" logged and on-screen keys become Saturday's input |
| 09:30-11:00 | T2 three phrase files + `stage.json`; T3 adopt take-data-contract.md (take/v1, features v1.1, its validator and ten fixtures), `thresholds.json`; T4 matcher test-first | Carlos (Claude Code session 1) | `--suite match` on all three phrases plus the contract validator, green |
| By 12:00 | Features schema v1.1 copied into the proxy schema and `rules.json` inputs (the contract's six additions; required before lunch) | Carlos | Validator accepts all ten contract fixtures; proxy schema rejects a v1 payload missing them |
| 09:30-11:00 | T20 shell + localhost + IndexedDB; T5 clock, count-in on the audio clock; T6 on-screen keys adapter | Justin (session 2) | Count-in clicks land on the audio clock; on-screen keys emit shared-take notes |
| 09:30-11:00 | `templates.json`, `fundamentals.json` learner names, `copy.json`, rule wording read-through | Simone | Files load; no banned or engineering words |
| 11:00-12:30 | T7 Web MIDI adapter with statechange and panic; live line (ghost and played bars, lit key) | Justin | Unplug, replug, deny permission: on-screen keys still finish the same take |
| 11:00-12:30 | T8 keyboard features + K-rules + persistence; T9 fix card and proof card | Carlos | `--suite cues`: keys cases of the 20-case set (tech-feedback-layer.md s9) plus clean and two-error priority, green; V cases join at 16:30 |
| 12:30 | CHECKPOINT A: keyboard path demo | All | On the laptop: count-in, take, one cue, live retake, count pair, by MIDI (if present) and on-screen keys |
| 12:30-13:00 | Lunch; team watches the rough 60-second arc | All | |
| 13:00-14:30 | T10 replay captures (one per phrase) + `--suite stage`; T15 classifier, templates, spread: `--suite split`, `--suite schedule` | Carlos | Both suites green; each capture fires its planned rule |
| 13:00-14:30 | T11 mic: permission, Pitchy vendored, AudioWorklet frame clock, clarity gate (M1), set-up check with `getSettings()` log | Justin | Laptop mic: A3 and C4 named right, within 10 cents of a tuner (tech-pitch-detection.md s9 step 2) |
| 13:00-14:30 | T19 hand-off card + Webex-style mock screen (D3 option 1); T18 sample-week card content | Simone | Card fields match section 11 |
| 14:30 | CHECKPOINT B | Carlos, Justin | Suites match, cues, stage, split, schedule green; mic names notes |
| 14:30-16:30 | T13 voice adapter: frames to notes (backdate onsets), same take; cents_off, wobbles (both counts), held_ratio, above_range, old_tune_pct; V-rules | Justin | A recorded WAV through Pitchy in Node gives notes and one V-cue (`--suite voice`) |
| 14:30-16:30 | T17 screens 0, 3 to 8 wired to engine and store; T16 progress lines (goal, skill, ahead) | Carlos | Keyboard arc runs through the real screens |
| 14:30-16:30 | T24 chips copy; T31 two-question screen copy; recording script; sings for T13 tests | Simone | Copy in `copy.json` |
| 16:30 | CHECKPOINT C | All | Keyboard arc through screens; one recorded voice take gives a V-cue |
| 16:30-17:30 | T22 service worker, manifest, build version; cold offline test on the laptop | Carlos | Wi-Fi off, browser closed, reopen: full loop incl. replay |
| 16:30-17:30 | T12 range check (voice) and hand position (keys) | Justin | Range within one semitone of a tuner |
| 17:30-19:00 | Voice slice live: five sung takes with count-in, inspect onset offsets; cue; retake; proof. Then the noisy-room whole-loop run (D2 overturn test) | Justin, Simone | Five takes give sensible onsets and one cue each; noisy-room result logged pass or fail |
| 17:30-19:00 | T23 deploy to HTTPS host; tech-pitch-detection.md s9 30-minute phone test on one Android (and an iPhone if present) | Carlos | Phone: notes named, offline cold reopen runs |
| 19:00 | CHECKPOINT D: voice path demo | All | Live sung take to proof on the laptop |
| 19:00-20:00 | Three timed 60-second keyboard arcs on the stage laptop to a TV; T25 recording v1; Carlos tags the commit | All | Three runs in a row with no restart |
| 20:00-21:30, only if D is green | T26 part 1 (1.5 of 2.5 h): proxy, schema, first live cases; part 2 Monday by 14:00 | Carlos | `--suite split --llm cached`: every case a valid plan, 9 of 10 accepted without fallback, case 8 gives no steps |
| Evening | Otherwise nothing new. Fix list only | | |
### Cut rule at each checkpoint (wording adopted from the delivery-lead review, where sharper)
| Checkpoint | Minimum pass (must) | Target (if ahead) | If red |
|---|---|---|---|
| A, 12:30 | One on-screen take with count-in and stored note events, scored by the matcher fixture | Full keyboard arc: cue, live retake, count pair | Stop MIDI and voice work at once; two builders fix this path until 14:00; still red at 14:00 = no Saturday voice work. Do not call a minimum pass a full-arc pass |
| B, 14:30 | One fixed fixture produces the specified K-rule and its count | All suites green, mic names A3 and C4 | Red at 15:00 = only that rule and phrase; drop extra rules, engine scheduling, mock screens. Mic misses either test note twice = no live mic Saturday |
| C, 16:30 | Replay, measured cue, live on-screen retake, count pair, once, with no hand edits to data | Same through the real screens | All builders fix it; no new screens, no voice. Still red at 18:00 = prepare the labelled recording for the pitch |
| D, 19:00 | Three keyboard arcs in a row, then recording v1 | Live voice: 3 of 5 sung takes match at least 6 of 8 notes, show the intended cue, one retake reaches proof | Voice fails that bar = no live voice (D4 a); a recorded voice claim needs its own passing detector replay |
| Mon 14:00 | One valid, schema-checked real model answer saved (T26) | Labelled example screen | Remove every "a model made this" claim; show the rules plan |
| Tue 12:00 to 14:00 | Candidate tagged at 12:00; same release tag on every device; two cold offline loops on the stage laptop | | Use the tested local-server path and the recording; freeze at 15:00 regardless |
- Never cut: fixed phrase file, real input through the scoring path, labelled replay, one measured cue, live retake, visible count pair, cold offline run, recording fallback.
### Sun 8 Nov (travel)
- 30 to 60 minutes with Simone: D1 to D4 (section 0), age band; write `stage.json`; Carlos re-runs `--suite stage` and re-records the arc if the phrase changed.
- Two teammates open the deployed build on their laptops and tick the checklist.
### Mon 9 Nov
| Time | Block | Owner | Test |
|---|---|---|---|
| 08:00-12:00 | Criteria in; map each to section 14 rows; add C6 if a criterion is uncovered (success-criteria-draft.md s3) | Simone leads | Every official criterion has a task or a slide |
| Arrival + 1 h | Rig on the venue screen or a stand-in; app sound to PA; 10 m readability | Carlos | Arc runs on that screen three times |
| Next 1 h | C5a: three cold offline sessions on the named low-end Android (Android 10+) with load, cue, retake times | Justin | 3 of 3, times logged |
| By 14:00 (laptop, on the bus or at the venue) | T26 goal split if not done Saturday; labelled "example output" screen; offline test shows the rules plan instead | Carlos | Same test as Saturday 20:00; Wi-Fi off gives the template plan with no wait |
| Next 1 to 2 h | Carry-overs from Saturday cuts only (T16 controller, T12, T24, T21 export, T28 test mode if the ethics answer allows) | Carlos, Justin | Selftest `--suite all` green |
| Rest | First run-through on the stand | All | Pitch timing |
### Tue 10 Nov (freeze 15:00, playbook s2)
| Time | Block | Owner | Test |
|---|---|---|---|
| Breakfast | Surprise task | All | Answered |
| Until 12:00 | Fixes from Monday only; release candidate tagged at 12:00 | Justin, Carlos | `--suite all` green |
| 12:00-14:00 | Bump cache, redeploy, check build version on every device, cold offline run on each; recording v2 | Carlos | Same version everywhere; offline loop passes twice |
| 14:00-15:00 | Go or no-go questions 1 to 9 (playbook s2.2), three leads sign | All | All "yes" |
| 15:00 | Freeze: no new screen, rule, library, threshold, phrase, key, tempo or error pattern | | |
| 15:00-18:00 | Rehearsals 1 to 3, timed | All | 2:40 target |
### Wed 11 Nov
- Fixes to a failing step only; battery, sleep off, airplane-mode check, one full run, recording on a second device.
### Hour budget (developer hours; v1 estimates are ours, not measured)
| Block | v0 plan | Red-team realistic | v1 estimate | Where in v1 |
|---|---:|---:|---:|---|
| Rig check (T1) | 0 | not listed | 1 | Sat 09:00 |
| Contract, phrase files, fixtures (T2, T3) | 1.5 | 2 | 2 | Sat AM |
| Shell, server, storage (T20) | 1 | 3 (with offline) | 1.5 | Sat AM |
| Service worker and cold offline (T22) | in shell | in shell | 1.5 | Sat 16:30 |
| Clock, count-in, synth (T5, T29) | in input | in input | 2 | Sat AM |
| On-screen keys, MIDI, live line (T6, T7) | 2.5 | 5 (with synth) | 3 | Sat AM |
| Matcher, features, K-rules, tests (T4, T8) | 2 | 4 | 3.5 | Sat AM |
| Vertical integration, cards, proof (T9) | 0.5 | 2 | 2 | Sat 11:00 |
| Replay captures (T10) | 0 | in tests | 1 | Sat 13:00 |
| Mic path and set-up check (T11) | 2 (with voice) | 5 (with voice) | 2.5 | Sat 13:00 |
| Voice adapter and V-rules (T13) | in mic | in mic | 3.5 | Sat 14:30 |
| Phone test and noisy-room test (T14) | 0 | not listed | 1.5 | Sat 17:30 |
| Range check (T12) | in screens | in screens | 1.5 | Sat 16:30 |
| Engine split and schedule (T15) | in rules | not listed | 2 | Sat 13:00 |
| Engine progress, controller, ceiling (T16) | in screens | in screens | 2 | Sat 14:30, Mon |
| Screens, store, sample week (T17, T18) | 2 | 4 | 3 | Sat 14:30 |
| Hand-off card and mock (T19) | 2 | 2 | 1.5 | Sat 13:00 |
| Telemetry, test mode, question screen (T21, T28, T31) | 0 | not listed | 1.5 | Mon |
| Learner-word chips (T24) | 0 | not listed | 1 | Mon |
| Full runs, fixes, recording (T25) | 2 | 3 | 3 | Sat 19:00, Tue |
| Deploy and phone cold offline (T23) | 0.5 | 1.5 | 1.5 | Sat 17:30, Mon |
| Notices and about screen (T27) | 0 | not listed | 0.5 | Mon |
| Goal split through the proxy, cached (T26) | 0 (stretch) | cut | 2.5 | Sat 20:00 or Mon by 14:00 |
| Total | 16 | 31.5 | 45 | |
### Hour estimates side by side (review figures shown; v1 keeps its own)
| Task group | v1 | Delivery-lead review | Where we differ |
|---|---:|---:|---|
| T1 rig | 1 | 1.5 | Agree in substance |
| T2, T3 phrase and contract | 2 | 3 | Contract file now exists; three phrases cost about 1 h more (cut 5) |
| T20 shell, storage | 1.5 | 2.5 | Review allows for storage integration |
| T5, T29 clock, sound | 2 | 3 | Real-device beat-zero check |
| T6, T7 keys, MIDI, display | 3 | 4 | Permission and unplug tests |
| T4, T8 matcher, keyboard rules | 3.5 | 6 | Contract validator and fixtures already written (Node only) |
| T9 cue and proof | 2 | 3 | Integration point; on the critical path |
| T10 replay | 1 | 1.5 | Small |
| T11 to T14 voice and phone | 9 | 14 | Largest gap; first outright cut |
| T15, T16 engine | 4 | 6 | Engine spec gives formulas and fixtures |
| T17 to T19 screens, week, hand-off | 4.5 | 6 | Core screens only Saturday |
| T22, T23 offline, deploy | 3 | 4 | Cold reopen per origin |
| T21, T24, T28, T31 extras | 2.5 | 4 | Review cuts them Monday |
| T25 runs, recording | 3 | 4 | Fix time after rehearsal |
| T26 model split | 2.5 | 5 | Consent path and saved output |
| T27 notices | 0.5 | 0.5 | Agree |
| Total | 45 | about 68 | Both exceed Saturday; review capacity 36 h max, 24 to 27 productive |
- v1 keeps 45 h because the contract, engine spec and rules table cut design time; the review's 68 h is the safer ceiling. Plan cuts against 68.
- Capacity, our assumption: Saturday two developers x 10 h = 20 h with Claude Code, plus Simone about 8 h of copy, cards and testing.
- So Saturday holds about 26 h of must-pass work if the cut rules hold; about 16 h spill to Monday afternoon and Tuesday morning.
- The red-team's "essential keyboard demo 18 to 22 h" matches v1's keyboard rows (about 21 h incl. integration and runs).
- Claude Code speeds typing, not integration, device tests or rehearsal; do not plan on more than the table.

### Critical path (delivery-lead review, adapted)
| Item | Latest safe start | Required finish |
|---|---|---|
| Keyboard confirmed, or commit to on-screen keys | Sat 09:00 | Sat 09:30 |
| Shared take shape (take-data-contract.md) and one phrase fixture frozen | Sat 09:30 | Sat 12:00 |
| Clock, input and matcher into one real take | Sat 10:30 | Sat 16:00 |
| T8 rule plus T9: cue, live retake, count pair from the scored take | Sat 16:00 at the latest | Sat 19:00 |
| Replay capture and recording v1 | Sat 19:00 | Sat 21:00 |
| Phrase choice written in `stage.json`, `--suite stage` green, re-record if changed | Sun | Sun night |
| Cold offline and venue-device checks | Mon 09:00 | Mon evening |
| Release candidate, version checks, rehearsals | Tue 09:00 | Freeze 15:00 |
- The one slip that kills the live demo: T9, the cue and proof card wired to the scored take. A missing keyboard has a fallback; a disconnected cue does not.
- Integration contract (45 minutes, Saturday before 12:00): one captured take asserted end to end: note, feature, chosen rule, displayed sentence, count.
- T26 runs off the critical path with one owner: a 45-minute real, redacted goal request Saturday (saved), integration Monday 09:00 to 14:00.

### Outright cuts, in order (if the team falls behind; review order adopted)
| Order | Cut | Hours saved (review) | What the pitch loses |
|---|---|---:|---|
| 1 | Live voice path and range check | about 14 | "Sing into your phone" as a shown feature |
| 2 | Full adaptive controller; keep one rules-based next step | about 6 | Week-long adaptation claims |
| 3 | Test mode, telemetry export, question screen | 3 to 4 | Learner evidence; report the test as not run |
| 4 | In-app Webex-style screen and class bar; keep the labelled hand-off card | 2 to 3 | Interactive Cisco mock, class view |
| 5 | Three-phrase support; build only the phrase chosen Sunday | 1 to 2 | Easiest-first comparison |

## 9. Fallback paths
| Failure | Trigger | Fallback | Ready by |
|---|---|---|---|
| Keyboard not seen | No note on screen 2 s after the first retake key, or missing from the list | Re-plug once (statechange); then on-screen keys, laptop letters A S D F G H J K = C to C, same cue path | Sat 12:30 |
| Fallback 1 fails | Not working within 5 s, any dialog, frozen screen, retake not started by 1:35 | Second tab: recording of the same run, narrated | Sat v1, Tue v2 |
| Planted cue misfires | Replay fires a rule other than the planned one | Re-capture with one clear error; `--suite stage` must pass before freeze | Sat 14:30 |
| Live retake does not improve | Count pair same or worse | App keeps the cue and slows the click (persistence rule); line: "Not yet. Same one fix, slower click." | Sat 12:30 |
| Pitch detection weak on voice | Checkpoint B or D fails | Recorded voice take through the real detector, labelled; else canned feature JSON | Sat 19:00 |
| Audio silent | AudioContext suspended | Start tap calls `resume()`; status dot; "sound off, watch the bars" | Sat 11:00 |
| Stuck MIDI note | Note shows forever | All notes off on screen change; hidden panic key | Sat 12:30 |
| Devices on different builds | Version corner differs | Laptop build on localhost; phone off the stage | Tue 14:00 |
| Service worker did not install | Cold reopen fails | Laptop with local server running is the stage path | Mon |
| Network down | No venue Wi-Fi | Nothing needed: stage build makes no network call | Sat 17:30 |
| Stage laptop dies | No boot or display | Backup laptop, same build and seed, HDMI swap | Sun check |
| Everything fails | Demo will not start in 10 s | Recording, narrated live | Sat v1, Tue v2 |

## 10. Risks
| Risk | L | I | Trigger | Response |
|---|---|---|---|---|
| Parallel blocks will not integrate | H | H | No arc by 13:00 Saturday | Checkpoint A cut rule; slice before layers |
| Cue implausible or retake scores worse | H | H | Replay fires the wrong rule | One planted error, asserted by `--suite stage`; generous tested tolerance |
| Timing false cues from clock or latency | M | H | All onsets shifted alike | Audio-clock scheduling, `getOutputTimestamp`, M2 tap-along, per-device calibration |
| Voice tracking jumps or wobbles | H | M | Octave jumps on tests | Keyboard on stage; recorded voice take; clarity gate |
| Phrase still undecided after Sunday | M | M | No `stage.json` change by Sunday night | Freeze default in the playbook applies (Ode bars 1-2) unless the team writes otherwise |
| Velocity read as loudness | M | L | "Louder" cue from a MIDI take | `velocity_rel` named key strike; K6 not on stage |
| Mic permission or insecure URL | M | H | `mediaDevices` undefined | HTTPS or localhost only [1] |
| Web MIDI prompt or no support | M | M | iPad or denied | On-screen keys; laptop Chrome on stage [4][5] |
| Venue noise or guide bleed into the mic | H | M | Line moves before playing | MIDI on stage; headphones for any voice take |
| Stale service-worker cache | M | H | Old screens | Version corner, versioned cache, Tuesday 12:00 to 14:00 checks |
| Monday criteria or the surprise task eat build time | H | H | New work Monday afternoon | Treat the 60-second arc as frozen; meet new criteria on a slide or static card where honest |
| Nine-student test blocked by ethics | M | M | No written determination | Plan does not depend on its numbers; C1 to C4 report "not run" honestly (nine-student-test-plan.md s1) |
| Licence vs IP terms | L | M | Copyleft dependency | Pitchy MIT/0BSD, Tone.js MIT, fft.js; NOTICES.md |
| Overclaiming Cisco or AI | M | H | "Integrated", "AI splits" | Section 11 wording; "the coach splits" |
| Two machines on a synced repo | M | H | Conflicted files | Carlos commits from one machine |
- L and I are planning estimates, `unverified`.
- Judge questions (owner each): "Is that cue from what was played?" (show event, measured difference, cue); "Are the week's gains real?" (no, labelled sample); "Wi-Fi off?" (yes, if Monday passed); "Where is the voice coaching?" (recorded take, tested prototype, n = 1 story).

## 11. Cisco fit (kept honest; cisco-fit-note.md s4)
- Wednesday: in-app hand-off card (C5b needs it) plus the Webex view; cisco-fit-note-v1.md makes the stage default for the Webex view a screenshot in the deck, and a live post rehearsal only. v1 follows that; D3 option 1's in-app mock screen becomes the stand version.
- cisco-fit-note-v1.md also: a card message needs `text` or `markdown` (fallbackText unsupported); revoke the take at its host first, then delete the Webex message; new Guest Issuer apps were disabled 21 Jan 2026, so any guest join uses the plain Meetings web link.
- Card fields (all from app data): learner (first name or "Learner 12", age band only); goal; fix tried (with "three sessions, no pass"); proof so far in playing terms; shared take link (nonfunctional in the mock, labelled so; no upload exists); the ask ("one technique in a 10-minute lesson?").
- handoff-design-v0.md is still a skeleton tonight; adopt its fields when it fills in, if they differ.
- Real call, D3 option 2 only, Tuesday, team test space: `POST https://webexapis.com/v1/messages`, bot token as Bearer from an environment variable, `roomId`, `markdown` (the full hand-off as fallback text) and one adaptive card 1.3 (cisco-fit-note.md s4).
  o No `Media` element in Webex cards, so the take is always a link; default message carries text and features only, no audio file.
  o Markdown limit 7,439 bytes: cisco-fit-note.md marks it verified; v0's snippet was left unverified by verification-overdrive.md s6.
- The learner is never put in a Webex space; the bot writes to the teacher (cisco-fit-note.md s4 privacy rules).
- Do not say "built on Cisco" or "integrated with Webex" for a mock.

## 12. Definition of done per day (task ids from section 14)
| Day | Done means | Matrix rows it closes |
|---|---|---|
| Sat 7 Nov | T1 to T11, T13, T15, T17 to T20, T22, T25 done; suites match, cues, stage, split, schedule, voice green; checkpoints A to D logged; cold offline laptop run; recording v1; phone loaded once | R1 (partial), R3, R5 to R8, R11, R12 (laptop), R13 to R15, R17 visual only; C1 measure code; C5(b) card |
| Sun 8 Nov | D1 to D4 written; `stage.json` set; `--suite stage` green on the chosen phrase; two teammates ran the build | Decisions |
| Mon 9 Nov | Criteria mapped to section 14; T26 recorded and labelled by 14:00 with the offline fallback shown; T12, T16, T21, T23, T24, T27, T28, T31 done or cut in writing; C5(a) 3 of 3 on the named phone; rig on venue screen | R2 (partial), R4, R9, R10, R14 (model split), R16; C2, C3, C4 instrumentation ready (outcomes "not run" until measured); C5(a) |
| Tue 10 Nov | Release candidate 12:00; same build version on every device; go or no-go 9 of 9; recording v2; three timed rehearsals | Freeze (playbook s2.1) |
| Wed 11 Nov | One clean full run before the pitch; no changes except fixes | |

## 13. Claude Code working method and app layout
- One session per layer, each with a short brief: shell and PWA; inputs and clock; matcher, features, rules and selftest; engine; screens and copy.
  o Each session reads this file, functional-requirements-v0.md and only its own tech file.
- Selftest first: `node test/selftest.mjs --suite <match|cues|stage|split|schedule|progress|controller|voice|all>`.
  o Fixtures: one per rule, clean take, two-error priority; captured note files replayed through matcher, features and rules.
  o Voice: Pitchy runs in Node, so `--suite voice` replays a recorded WAV and checks notes and the cue.
- Carlos commits and pushes once per green block; nobody else runs git.
- Tunables outside code: `thresholds.json`, `copy.json`, `rules.json`, `stage.json`.
### Proposed `app/` layout (Saturday creates it; nothing created tonight)
```
app/
  index.html
  manifest.webmanifest
  sw.js                 versioned cache; build version string
  NOTICES.md            Pitchy, fft.js, Tone.js licences
  icons/                icon-192.png, icon-512.png
  vendor/               pitchy (4.1.0) + fft.js, tone (pinned), all local
  src/
    main.js             router, screen switching, version corner
    screens/            goal-entry, setup-check, range-check, next-goal, live-line, fix-card, retake-proof, progress, handoff, questions
    audio/              clock.js, mic.js, pitch-worklet.js, voice-notes.js, midi.js, onscreen-keys.js, synth.js
    engine/             phrases.js, match.js, features.js, rules.js, small-goals.js, progress.js, controller.js
    store/              db.js (IndexedDB), seed.js (sample week), reset.js (10 s demo reset)
    mocks/              webex-message.js, class-bar.js
    telemetry.js        local event log, export JSON
  data/
    phrases/            one file per candidate phrase (expected-notes format)
    stage.json          chosen phrase, harder phrase, tempo, replay capture
    captures/           take-1 replay files, one per phrase
    rules.json, thresholds.json, fundamentals.json, templates.json, copy.json
  test/
    selftest.mjs
    fixtures/           match/, cues/, split/, schedule/, voice/
```
- Changed from v0: `proxy/` now serves the goal split only (T26), with `data/cached-splits.json`; `cached-cues.json` removed (no per-take rewrite).

## 14. Requirement-to-task matrix
### Tasks
| Id | Task | Id | Task |
|---|---|---|---|
| T1 | Rig check: keyboard, cable, permission, HDMI | T17 | Screens 0 to 8 wired; rest banner, session cap |
| T2 | Phrase files, `stage.json`, ease score | T18 | Seeded sample week, labelled |
| T3 | Shared take schema, thresholds, fixtures | T19 | Hand-off card, Webex-style mock, opt-in share toggle |
| T4 | Matcher and its suite | T20 | Shell, server, IndexedDB; audio blob null by default |
| T5 | Clock, count-in, calibration (M2) | T21 | Telemetry: take end and cue shown timestamps, export |
| T6 | On-screen keys adapter | T22 | Service worker, manifest, version, cold offline test |
| T7 | Web MIDI adapter, statechange, panic | T23 | HTTPS deploy; phone cold offline x3 |
| T8 | Keyboard features, K-rules, persistence | T24 | Learner-word chips beside the measured cause |
| T9 | Fix card visual, retake proof count pair | T25 | Recordings v1 and v2 |
| T10 | Replay captures and `--suite stage` | T26 | Goal split via proxy (structured output), cached answers, "example output" label, rules fallback |
| T11 | Mic, Pitchy, worklet clock, set-up check, M1 | T27 | NOTICES.md and about screen |
| T12 | Range check and key; keys hand position | T28 | Test mode: group A, B, C cue timing (nine-student-test-plan.md s1) |
| T13 | Voice adapter, voice features (both wobble counts), V-rules | T29 | Synth guide and drone; guide muted for voice |
| T14 | Phone 30-minute test; noisy-room loop test | T30 | 10 s demo reset |
| T15 | Engine split, templates, schedule | T31 | Two-question screen (trust, usefulness; help or homework) |
| T16 | Progress lines, controller, off-day, ceiling | | |
### Matrix
| Row | Requirement or criterion | Tasks | Gap left |
|---|---|---|---|
| R1 | Listen live, pitch and volume | T5, T6, T7, T11, T13 | Partial: MIDI gives key events and key strike, not acoustic volume; live voice only if checkpoint D passes |
| R2 | Learner words to cause | T24 | Partial: chips map to candidate rules and the measured rule wins; free-text translation: none |
| R3 | One fix, before and after | T8, T9, T13 | none |
| R4 | Range check, key | T12 | none (Monday if cut) |
| R5 | No option piles | T8 (one cue by tier) | none |
| R6 | Plain words | T8, copy.json review | none |
| R7 | Set-up check | T11 | none |
| R8 | Pitch guide | T9 (ghost bars), T29 | none |
| R9 | Rest cue, session cap, re-spread | T16, T17 | none |
| R10 | Hand-off with recording and fix list | T16 (ceiling), T19 | Delivery to a real teacher: none (mock) |
| R11 | Audio on device, opt-in share | T20, T19 | Actual upload of a shared take: none (mock link) |
| R12 | Offline loop | T22, T23 | none |
| R13 | Rights-cleared backing | T2, T29 | Chosen melody's public-domain check still to verify once by eye (demo-phrase-and-rights.md s4) |
| R14 | Goal-led, split into small goals | T15, T17, T26 | Live model split only online; stage shows a saved, labelled example |
| R15 | Two progress lines | T16, T17 | none |
| R16 | Adaptive difficulty, off-day check | T16 | none |
| R17 | Easiest phrase first; show what to play | T2, T9 | Visual part: none; easiest-first only if D1 (a) and the computed ranking is shown on screen |
| C1 | Wobble count, take 1 vs retake (nine students) | T13 (excursion count), T21, T28 | Test may be blocked by ethics; no participant audio kept (nine-student-test-plan.md s7) |
| C2 | Seconds from take end to cue | T21 | none |
| C3 | Trust and usefulness 1 to 5; expert cause check | T31, T21 | Expert review of the nine causes is a human task: none in the build |
| C4 | Help or homework | T31 | none |
| C5 | (a) three cold offline phone sessions; (b) hand-off card at the ceiling | T22, T23, T19, T16 | none |
- Tasks with no requirement behind them: T1, T5, T7, T10, T14, T25, T30 (stage reliability) and T18, the class bar (presentation). They stay because the demo needs them, not because a requirement does.

## 15. Red-team points (three reviews: failure modes, input paths, consistency)
| # | Point | Verdict | Why (one line) |
|---|---|---|---|
| 1 | One developer cannot integrate parallel blocks | Accepted | Checkpoint A at 12:30 with a hard cut at 13:30 |
| 2 | Implausible cue or worse retake score | Accepted | One planted error per capture, asserted in `--suite stage` |
| 3 | Rig fails on the day | Accepted | T1 rig check moved to Saturday 09:00; venue screen Monday |
| 4 | Devices on different builds after offline update | Accepted | Build version corner; Tuesday 12:00 to 14:00 check |
| 5 | Monday criteria or surprise task eat integration | Accepted | Arc frozen after checkpoint D; new criteria on slides or static cards |
| 6 | Choose and test the keyboard first | Accepted | T1 at 09:00, not 19:00 |
| 7 | Exact phrase pitches and beats before scoring | Accepted | T2 before T4; three candidate files |
| 8 | Vertical slice before parallel layers; v0's noon merge impossible | Accepted | Slice now ends 12:30 after features and rules exist |
| 9 | Capture the flawed take after scoring works | Accepted | T10 at 13:00, after `--suite cues` |
| 10 | Rehearse projector and 60 s on Saturday | Accepted | 19:00 to 20:00 block to a TV |
| 11 | Freeze deployment earlier Tuesday | Accepted | Release candidate 12:00 |
| 12 | Cut list order (LLM, live voice, mirroring; engine; setup, range, hand-off) | Partly accepted | Voice live is cut only at checkpoint D; hand-off card kept (C5b needs it) |
| 13 | Ten answers before Saturday code | Accepted | Answered in sections 0, 6, 8, 9, or listed in Open questions |
| 14 | "MIDI is exact" ignores timing | Accepted | Section 4 timing; one audible beat zero |
| 15 | Early end needs note-off, not onset | Accepted | `held_ratio` rule |
| 16 | Velocity is not loudness | Accepted | `velocity_rel`, "key strike", off the stage cue |
| 17 | 3 s silence must not end a take | Accepted | Phrase length plus two beats, Stop, or input lost |
| 18 | Pitchy ESM and CDN break offline | Accepted | Vendored local module, pinned 4.1.0 |
| 19 | Semitone grouping plus 100 ms gate unsure on voice | Accepted | Backdated onsets; tested on hand-marked takes at checkpoint D |
| 20 | Synth guide bleeds into the mic | Accepted | Headphones or guide muted after count-in |
| 21 | Count-in on JS timers drifts | Accepted | Audio-clock scheduling with look-ahead |
| 22 | Localhost offline only while served | Accepted | Cold test both with and without the local server |
| 23 | Loading once is not offline proof | Accepted | Cold reopen in airplane mode, C5(a) x3 |
| 24 | Optional model call can vary | Accepted | No live call on stage; goal split runs for real off stage, saved, labelled; rules authoritative |
| 25 | Realistic 31.5 h vs 16 h | Accepted, revised | v1 estimate 45 h incl. engine, tests and rig rows the review did not list |
| 26 | Shared take for both inputs, beat zero, ms onsets | Accepted | Section 7 record |
| 27 | Timing tolerance 150 ms for both inputs | Accepted | Labelled a demo setting |
| 28 | `getOutputTimestamp` and sample-count frames | Accepted | Checked on MDN [20][21] |
| 29 | `getSettings()` to prove processing is off | Accepted | Set-up check logs it [22] |
| 30 | Loopback cannot isolate mic delay | Accepted | M2 tap-along calibration per device instead |
| 31 | SwiftF0 licence of weights unsure | Deferred | Not used before Wednesday |
| 32 | iOS MIDI browser apps not dependable | Accepted | iPad = on-screen keys only |
| 33 | Voice wins under requirement precedence | Rejected for the stage | Every later team file and advisor steer chose keyboard on stage; requirements header and C1 need a team edit (Open questions) |
| 34 | C5 phone test vs laptop stage | Accepted | Phone tested for C5(a); laptop on stage |
| 35 | 60 s cannot hold setup and range | Accepted | Shown as labelled completed steps |
| 36 | Ceiling card must not follow a success | Accepted | Separate scripted case |
| 37 | Use one measured count pair from the demo | Accepted | Proof card shows only the live pair; 24 to 7 labelled as one learner's record |
| 38 | "Hears" vs "follows the keys"; templates are not AI | Accepted | Section 0 stage line; section 7 engine wording |
| 39 | Cloud cue rewrite contradicts R12 | Accepted | Stage build has zero network calls |
| 40 | Hand-off "built" claim in criteria s3 | Accepted (for the criteria file) | Build calls it a labelled mock; criteria wording is the team's edit |
| 41 | Screen names differ between build and pitch | Accepted | Build names canonical (section 5) |
| 42 | Gaps R2, R14, R11, R10, R1, R17 have no task | Accepted | Tasks T24, T15, T19, T20, T13; remaining gaps named in section 14 |
| 43 | C1 to C5 not measured by the build | Accepted | T21, T28, T31, T13 add the measures |
| 44 | Codex shared-take draft: rename `old_tune_pct` to `tune_pct` | Rejected | It means the old-key melody share (V3), not tune share |
| 45 | Codex shared-take draft: `wobbles` = excursion count | Rejected | Rule thresholds use frame flips; excursions kept separately for C1 |

## 16. Change log v0 to v1
| Section | v0 | v1 | Reason and source |
|---|---|---|---|
| Top | No decision block | Section 0: stage input and cloud stated once; D1 to D4 | Brief; verification-overdrive.md s1 items 5, 6 and s4 rows "Demo input", "Cloud use" |
| 1 | Optional cloud rewrite; pass line | No network on the stage path; slice and voice times; 45 h | Reviews (red-team 6, consistency); R12 |
| 2 | "App never makes music" | "Plays our typed note list as a fixed guide"; chips for R2 | Consistency review; verification-overdrive.md s5 scan |
| 3 | Defaults waiting on tech files | Choices filled from the files; SwiftF0 deferred; no samples | tech-pitch-detection.md s1, s5; tech-keyboard-input.md s1, s9; accessibility-design-v0.md s3 |
| 3 | Four facts marked opened | Chrome 124 prompt and Safari row marked unverified | verification-overdrive.md s6 row build-plan-v0 s3 |
| 4 | "MIDI exact"; AnalyserNode | Timing subsection; AudioWorklet frames; version corner; cold test with and without server | Red-team s5; input-paths s3; MDN [20][21][22] |
| 4 | GitHub Pages paid plan, opened-level | Marked unverified | verification-overdrive.md s6 row build-plan-v0 s4 |
| 5 | 9 screens | Test-mode question screen; replay label; ceiling as scripted case; names canonical | Consistency review; success-criteria-draft.md C3, C4 |
| 6 | Ode opening chosen | Phrase-agnostic; three options with costs; ease formula from the engine spec | Brief; demo-phrase-and-rights.md s1, s3; demo-instrument-decision.md s4; engine spec s5 |
| 6 | Ode dates as snippet | Kept, marked unverified, pointed to the stronger check | verification-overdrive.md s6 row build-plan-v0 s6 |
| 7 | Loose feature columns; 5 rules | Engine stores; one shared take; feedback rules table; three metric corrections | input-paths review s2; tech-feedback-layer.md s2, s3; small-goals-engine-spec.md s2, s3 |
| 8 | Parallel blocks, merge at noon, 16 h | Slice by 12:30, voice by 19:00, tests and cut rules at four checkpoints, hour table | Red-team s2, s6; engine spec s12; input-paths s4 |
| 8 | Freeze prep 13:00 to 15:00 | Release candidate 12:00; go or no-go 14:00 | Red-team s2; freeze-and-rehearsal-playbook.md s2 |
| 9 | 12 fallbacks | Demo-memo triggers (2 s, 5 s, 1:35); misfire, no-improvement, build-mismatch rows | demo-instrument-decision.md s5; red-team s1 |
| 10 | 12 risks | Integration, timing, velocity, phrase, ethics, criteria rows | Red-team s1; nine-student-test-plan.md s1 |
| 11 | Webex 7,439 bytes snippet | Card fields and call from the Cisco note; three depth options | cisco-fit-note.md s4; verification-overdrive.md s6 row build-plan-v0 s5 |
| 12 | Day list | Day list tied to matrix rows and task ids | Brief |
| 13 | `proxy/`, `cached-cues.json` | proxy kept for the goal split only; cached-cues removed; `vendor/`, `phrases/`, `stage.json`, `captures/`, `NOTICES.md` added | No per-take LLM before Wednesday; offline vendoring |
| 0, 1, 3, 8, 12, 14 | LLM off everywhere; "where is the AI?" unanswered | One model step (goal split, T26) runs for real, saved and labelled "example output"; Must by Monday 14:00 | self-assessment-v0.md s1 row 8, s4, s5 row 5 |
| 0, 4 | Proxy "logs features and answer" (tech file) | Proxy logs pseudonymous device id and counts, limiter in memory, no IP kept; what leaves the device stated; overseas provider named as such | privacy-design-v1.md s0 row 1, s1, s5.1, s6 |
| 7, 8 | Shared take sketched here | take-data-contract.md binding; features v1.1 into the proxy schema by Saturday 12:00 | take-data-contract.md s1.3, s2, s5 rows 7, 8 |
| 11 | Webex-style mock screen on stage | Screenshot in the deck on stage; live post rehearsal only; text or markdown required; revoke order | cisco-fit-note-v1.md |
| 6, 7, 8, 11, 14 | (Codex re-check) | Stage tempo exception 80 bpm; live after-count never asserted; set-up calibration with clap-back; release-tag check; R1, R2 partial; R17 visual only; nonfunctional share link labelled; rights line narrowed | Codex 2 re-check, Method |
| 8, 3 | Checkpoints as targets; one hour table | Minimum pass vs target per checkpoint; sharper cut wording; critical path; ordered outright cuts; side-by-side hours (45 vs 68); T26 45-minute Saturday request; SwiftF0 online-only | Delivery-lead review (Codex, scratch build-feasibility-answer.md); accessibility-design-v1.md |
| 14 to 16 | none | Matrix, red-team verdicts, this log | Brief |

## Method
- Read: COMMON-RULES, session-rules.md, state-of-play-2026-11-06.md, functional-requirements-v0.md, build-plan-v0.md (whole); the three review answers (whole).
- Read by section: tech-pitch-detection.md s1, s2, s5, s7, s9; tech-keyboard-input.md s1, s6, s8, s9; tech-feedback-layer.md s1 to s4, s6 to s9; small-goals-engine-spec.md s1 to s3, s5, s11 to s13; demo-instrument-decision.md s1, s3 to s5; demo-phrase-and-rights.md s1, s3, s4, s6; cisco-fit-note.md s4; freeze-and-rehearsal-playbook.md s2; accessibility-design-v0.md s2, s3; nine-student-test-plan.md s1, s7; success-criteria-draft.md s1 to s3; decisions-log.md last rows; handoff-design-v0.md (skeleton only).
- Read after coordinator notes: verification-overdrive.md s1, s4, s6 rows; self-assessment-v0.md s1 row 8, s5 row 5; privacy-design-v1.md lines on the proxy, overseas call and data flow.
- Not read: RESUME.md (skipped for budget; state-of-play covers it), pitch files, privacy-design-v0.md.
- Review verdicts: 45 points in section 15; rejected only the "voice wins on stage" verdict and two Codex shared-take renames; deferred SwiftF0.
- Coordinator note checked: it said the pitchy package is now 2.2.0; verification-overdrive.md s6 says that of @audio/pitch; Pitchy 4.1.0 is confirmed there. v1 keeps 4.1.0.
- Codex 1 (gpt-6-sol, medium): unified take record from the three structures (prompt held no names or team ideas beyond the generic app).
  o Kept: snake_case for stored fields, raw / alignment / derived layers, per-take timing block, proxy whitelist = feature block only, velocity never as loudness, alignment rule.
  o Rejected: renaming `old_tune_pct` (it means the old-key melody share); `wobbles` as the excursion count (rule thresholds use frame flips); renaming phrase-file fields (the brief keeps the published expected-notes format).
- Codex 2 (gpt-6-sol, high): re-check of the finished v1, names stripped; 15 issues returned.
  o Folded (13): 12.9 s tempo overrun, live count not assertable, T26 slot vs budget, model states contradiction, input-delay calibration, version vs release tag, "no external requests" wording, R1 and R2 partial, nonfunctional share link, R17 claim, cue suite coverage, instrumentation vs results, fallback labels, rights wording.
  o Rejected: hour total "46.5 h" (rows sum to 45 h; re-added by hand).
  o Still flagged and not fixable tonight: keyboard not yet secured (Open questions); Monday is crowded (criteria, rig, phone, T26 part 2, carry-overs); overall verdict "keyboard demo plausible; not freeze-ready until instrument, tempo, release version and claim labels are settled".
- Delivery-lead review (Codex gpt-6-sol high, run by the coordinator, names stripped), folded after the first finish:
  o Kept: minimum pass vs target at each checkpoint, its cut wording, critical path with T9 as the killing slip, 45-minute integration fixture, keyboard owner before 09:00, T26 45-minute Saturday request and Monday 14:00 drop rule, ordered outright cuts, 68 h shown beside v1's 45 h.
  o Rejected: locking Ode bars 1-2 at Saturday 09:00 (the brief puts the phrase to the team Sunday; three phrase files cost about 1 h and are cut 5 if behind); replacing v1's hours (kept, both shown).
- Web pages opened tonight: MDN getOutputTimestamp [21], MDN AudioWorkletGlobalScope.currentFrame [20], MDN MediaStreamTrack.getSettings [22].
- Hour estimates (section 8) are ours: per task, from the red-team table plus rows it did not list; not measured.

## Open questions
- D1 to D4 (section 0): Sunday, with Simone; if nothing is written, the freeze default (Ode bars 1-2) applies.
- Requirements header and C1 still say voice first: edit them to "keyboard on stage, voice in the test", or keep voice and accept D2 (b)?
- Does anyone own a class-compliant USB MIDI keyboard for Saturday 09:00? If not, who buys one (about A$90 to A$130) and when?
- Wobble: C1 headline = excursion count (nine-student plan), rules = frame flips (feedback layer). Confirm both stay, never in one sentence.
- Proxy host and logs: does the chosen host keep IP-linked platform logs, and can the limiter run in memory (privacy-design-v1.md)?
- Cloud coach consent for under 15: off by default (privacy-design-v1.md s5)? Affects whether T26 can run at the stand with a young visitor.
- Ethics answer for the nine-student test: if none by Monday, C1 to C4 report "not run"; T28 and T31 still ship.
- Roles: are the three leads (playbook s2.2) as assumed in section 8?
- handoff-design-v0.md: when it fills in, do its card fields replace section 11's?
- take-data-contract.md vs this file (contract wins Saturday; team to confirm): phrase fields `start_beat`/`dur_beats` vs the published `startBeat`/`durBeats` in demo-phrase-and-rights.md and tech-keyboard-input.md (one loader conversion either way); AudioContext ms clock vs v1's page-clock beat zero via `getOutputTimestamp`; the contract's fixture phrase twinkle-b3-4 at 60 bpm vs D1 still open.
- take-data-contract.md cue precedence table and rule X2 vs the tech-feedback-layer.md tiers used in section 7: confirm one order before `--suite cues` is written.
- freeze-and-rehearsal-playbook-v1.md switches to on-screen keys at once when the keyboard is missing; v1 section 9 re-plugs once first (5 s). Team picks one; both files stay as they are.
- Who owns the keyboard, cable and adapter tonight (review: 20 minutes Friday, a named owner and a photo of the device)?
- cisco-fit-note-v1.md vs D3: screenshot on stage (that note) vs in-app mock screen (v1 D3 option 1); v1 uses the screenshot on stage and the in-app screen at the stand. Confirm.

## Sources
- Sources 1 to 19 are build-plan-v0.md's list, carried unchanged with v0's opened or snippet marks; not re-opened tonight. Starred items in v1 (3, 4, 5, 11, and the Ode dates 15) were left unverified by verification-overdrive.md s6.
1. MDN, getUserMedia, https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia, 2026-11-06, opened (v0).
3. MDN, Web MIDI API, https://developer.mozilla.org/en-US/docs/Web/API/Web_MIDI_API, 2026-11-06, opened (v0); unverified per verification-overdrive.md.
4. Chrome for Developers, Web MIDI permission prompt, https://developer.chrome.com/blog/web-midi-permission-prompt/, 2026-11-06, opened (v0); unverified per verification-overdrive.md.
5. Can I use, Web MIDI, https://caniuse.com/midi, 2026-11-06, opened (v0); unverified per verification-overdrive.md.
8. MDN, offline service workers, https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Tutorials/js13kGames/Offline_Service_workers, 2026-11-06, opened (v0).
9. MDN, storage quotas and eviction, https://developer.mozilla.org/en-US/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria, 2026-11-06, opened (v0).
10. mkcert, https://github.com/FiloSottile/mkcert, 2026-11-06, opened (v0).
11. GitHub Docs, Pages plans, https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site, 2026-11-06, snippet (v0); unverified.
18. MDN, Web Audio best practices, https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Best_practices, 2026-11-06, opened (v0).
19. MDN, Using Service Workers, https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers, 2026-11-06, opened (v0).
- Numbers 2, 6, 7, 12 to 17: see build-plan-v0.md Sources (pitchy README, AudioWorklet support, installable PWAs, scrcpy, NLA, Arts Law, Cantorion, Britannica, Webex create-message).
20. MDN, AudioWorkletGlobalScope.currentFrame, https://developer.mozilla.org/en-US/docs/Web/API/AudioWorkletGlobalScope/currentFrame, 2026-11-07, opened.
21. MDN, AudioContext.getOutputTimestamp(), https://developer.mozilla.org/en-US/docs/Web/API/AudioContext/getOutputTimestamp, 2026-11-07, opened.
22. MDN, MediaStreamTrack.getSettings(), https://developer.mozilla.org/en-US/docs/Web/API/MediaStreamTrack/getSettings, 2026-11-07, opened.
- Team files used (local, this folder): the files listed in Method; claims taken from them carry their own source marks.
- Review answers (second reviewer, not truth): scratch files build-redteam-answer.md, input-paths-answer.md, consistency-answer.md.
