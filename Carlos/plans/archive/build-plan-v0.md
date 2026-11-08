# Build plan v0: the listening practice coach (Sat 7 to Wed 11 Nov)

- Date: Fri 6 Nov 2026, overnight draft. Builds on functional-requirements-v0.md (the loop, R1 to R17).
- Purpose: tell Claude Code and the team what to build Saturday, Monday and Tuesday, in what order, with what fallbacks.
- Scope: one learner, one instrument on stage (keyboard), one demo phrase, the first week of use; voice stays the story.
- Status: overnight draft for the team; verify before the pitch. Stack choices wait on three sibling tech files (section 3).

## 1. Recommendation
- Build one offline web app (PWA) in plain JavaScript; every Must runs on the device, nothing on stage needs the network.
- Stage default: laptop Chrome on the projector, USB MIDI keyboard, phone-width layout; phone or tablet as second device if Monday's test passes.
- Saturday target: the full loop on one laptop with canned data by 19:00, plus a selftest that replays canned features through the cue rules.
- Keyboard first because its input is exact (MIDI note numbers); voice uses the same screens with pitch detection, shown as the story.
- Mock honestly: teacher hand-off card, Webex message, class bar, cloud sync. Optional cloud: one LLM rewrite of the cue, off on stage.
- Demo phrase default: opening of the "Ode to Joy" melody (Beethoven, public domain), played by our own built-in synth.
- Most reliable demo arc: take 1 = a labelled replay of a captured MIDI performance through the real scoring code; the retake is played live.
  o The cue is then repeatable on stage, and the improvement judges see is a real live result.
- Saturday pass line (cut to this if late): one phrase, one input, one measured cue, one retake, offline reload works.

## 2. Product scope for Wednesday
### In scope
| Item | Wednesday version |
|---|---|
| Learner | One young beginner; age group set Sunday with Simone (state-of-play section 7) |
| Instrument on stage | Keyboard (Web MIDI or on-screen keys); voice replayed from a recorded take, called a tested prototype, never claimed as proven coaching |
| Learner goal | "Play this song for mum" (keyboard); "make this cover sound good" shown as copy only |
| Phrase | One phrase, easiest first (R17), our own synth backing (R13) |
| Time span shown | Day 1 live; days 2 to 7 from seeded data, labelled "sample week" on screen (the first week of use, illustrated, not measured) |
| Loop | Set-up check, range check, next small goal, live line, one fix, retake proof, two progress lines, hand-off |
### Non-goals (say no on Saturday)
- Mixing, effects, loudness or any engineering terms (R6); the app never makes music, it only listens and plays our synth guide.
- Accounts, sign-in, real cloud sync, leaderboards, streaks, badges, game skins, a teacher marketplace.
- Guitar camera coaching (vision slide only, after Justin's IP check); a second instrument live on stage.
- Real student data; any copyrighted song or third-party backing video on stage (R13).

## 3. Decision points (sibling tech files, written in parallel tonight)
| File | If it recommends | Then | Default if silent or late |
|---|---|---|---|
| tech-pitch-detection.md | A JS library running on AnalyserNode or AudioWorklet | Use it in `src/audio/pitch.js`; selftest replays a WAV through it | Web Audio AnalyserNode + pitchy (McLeod method, 0BSD licence, returns Hz and a clarity 0 to 1) [2] |
| tech-pitch-detection.md | A WASM or ML tracker (heavier, more accurate on voice) | Use it for voice only; keyboard path stays MIDI; check offline asset budget (section 4) | Same default; voice shown from a recorded take |
| tech-pitch-detection.md | "Voice too unreliable on a phone" | Voice leaves the live demo; recorded take with real detection replayed | Same |
| tech-keyboard-input.md | Web MIDI over USB | Laptop Chrome on stage; Android tablet only with a tested OTG adapter | Web MIDI on laptop Chrome, on-screen keys everywhere else |
| tech-keyboard-input.md | Microphone on an acoustic or speaker keyboard | Keyboard notes go through the pitch path; tighter rules for single notes | On-screen keys as the always-works path |
| tech-keyboard-input.md | On-screen keys only | Phone or tablet is the stage device; no cable risk | Keep MIDI as optional |
| tech-feedback-layer.md | Rules-based cues only | Build `cues.js` table; no proxy | Rules table first (Saturday), LLM proxy stretch (Monday) |
| tech-feedback-layer.md | LLM cue through a proxy | Proxy rewrites the rules cue text only; sends cue id + numbers, never audio (R11) | Proxy off on stage; cached rewrites shipped in the app |
| tech-feedback-layer.md | On-device small model | Treat as stretch after freeze risk check; offline budget grows | Not on Saturday |

- Rule: Saturday 09:00 stand-up reads the three files (if present) and fills the "chosen" column on the Miro board; otherwise defaults hold.
- Facts checked tonight that constrain every option:
  o Microphone access needs a secure context: HTTPS, `localhost` or `file://`; on plain http `navigator.mediaDevices` is undefined [1].
  o Web MIDI needs HTTPS and a permission prompt; since Chrome 124 even plain (non-SysEx) MIDI asks the user [3][4].
  o Web MIDI: Chrome desktop, Chrome Android, Edge, Firefox desktop yes; Safari macOS and iOS (so every iPad) no [5].
  o AudioWorklet: Safari iOS 14.5+, Chrome Android, Firefox 76+ [6].
  o An AudioContext created outside a user gesture starts `suspended`; the "Start practice" tap must call `resume()` [18].
  o `file://` counts as secure for the mic but is not an installable PWA origin; use localhost or HTTPS [1][7].

## 4. Architecture
### What runs where
| Part | Runs on | Notes |
|---|---|---|
| UI (all screens) | Phone, tablet or laptop browser | Plain JS modules, one page, phone-width layout |
| Input: microphone | Device | `getUserMedia`, AnalyserNode or AudioWorklet, pitch library (section 3) |
| Input: keyboard | Device | Web MIDI note on/off + velocity; on-screen keys as fallback |
| Feature extraction | Device | Per take: note accuracy, onset timing, evenness, cents off, range used |
| Cue rules | Device | Table of rules, one cue out, plain words (R3, R6) |
| Small-goals engine | Device | Templates split the learner goal into 5 to 8 small goals (section 7) |
| Store | Device, IndexedDB | Takes as feature JSON; audio blob optional and off by default (R11) |
| Synth backing | Device | Web Audio oscillators; no audio files needed |
| Telemetry | Device | Local event log, export as JSON for the user test; never uploaded |
| LLM cue rewrite | Optional cloud, tiny proxy | Stretch; off on stage; cached rewrites as fallback |
| Teacher hand-off | Mock | Card with fix list and take; "send" shows a mock Webex message |
| Class bar, cloud sync | Mock | Synthetic numbers, labelled as a mock in the speaker notes |

### PWA and offline
- Files: `index.html`, `manifest.webmanifest`, `sw.js`, icons 192 px and 512 px, `src/`, `data/`.
- Installable needs: manifest with `name` or `short_name`, 192 and 512 px icons, `start_url`, `display`; HTTPS or localhost [7].
  o A service worker is not required to install, but it is what makes the app work offline [7].
- Service worker: hand-written, MDN pattern; install precaches the app shell, fetch is cache-first, cache name versioned, activate deletes old caches [8].
  o Choose hand-written over a build plugin: no bundler, about 40 lines, fewer moving parts on Tuesday.
  o Bump the cache name on every deploy; stale shells are the classic "it worked yesterday" bug.
  o The page that registers the worker is not controlled until reloaded; a new worker waits until old pages close unless it calls `skipWaiting()` and `clients.claim()` [19].
  o Offline test = install, close the app, airplane mode, reopen, run the whole loop including the replay take. "Loaded once" is not proof.
  o The laptop (localhost) and the phone (HTTPS host) are separate origins: separate storage, permissions and seed data. Seed each device.
- Offline asset budget: target under 5 MB precached (synth, not samples); measure on Monday. Planning figure, `unverified (Codex knowledge)`.
- Storage: IndexedDB for takes; localStorage only for settings (5 MiB per origin cap) [9].
  o Call `navigator.storage.persist()`; Chrome and Safari decide silently from site engagement [9].
  o Safari can delete script data after 7 days without interaction; add a "reload demo data" button [9].
### Serving the app to devices
| Option | Mic and MIDI work? | Offline on stage? | Verdict |
|---|---|---|---|
| Laptop: `localhost` static server | Yes (localhost is secure) [1] | Yes, nothing leaves the laptop | Stage default |
| Phone: free static HTTPS host, load once, then service worker | Yes (HTTPS) | Yes after first full load | Phone default; preload Monday on venue Wi-Fi |
| Phone: laptop LAN IP over plain http | No, mic is blocked [1] | n/a | Never |
| Phone: laptop LAN over HTTPS with mkcert | Yes once the root CA is installed and trusted on the phone [10] | Needs the laptop and a LAN | Backup only; set up Saturday if time |
- GitHub Pages from a private repo needs a paid plan, and the site itself is still public [11]. Carlos picks the host; repo stays private.
### Stage set-up (offline)
- Laptop on projector (HDMI), Chrome full screen at phone width; USB MIDI keyboard; laptop mic as voice fallback.
- Phone or tablet as second device, only if Monday's three-run test passes:
  o Android: scrcpy mirrors screen to the laptop over USB, 35 to 70 ms claimed, audio forwarding needs Android 11+ [12].
  o iPad: wired HDMI adapter, `unverified`; no Web MIDI on iPad, so on-screen keys only [5].
  o Wireless casting: avoid on stage (venue Wi-Fi), `unverified (Codex knowledge)`.
- Screen recording of a full good run is the last fallback (plan-2026-11-02-to-11.md rehearsal checklist).

## 5. Screens (one job each)
| # | Screen | Its one job | Data in | Data out | Req |
|---|---|---|---|---|---|
| 0 | Goal entry | Learner names the result they want | Free text or two chips ("play this song for mum", "make this cover sound good") | `goal` row; seeds small goals | R14 |
| 1 | Set-up check | Right input, level fine, room quiet | Input list, 5 s level and noise sample | `learner.input_ok`, noise floor | R7 |
| 2 | Range check | Find the comfortable notes; keyboard: find middle C and hand position | Voice: siren, lowest, highest full note; keyboard: play C to G | `learner.range_low/high`; key chosen, said in plain words | R4 |
| 3 | Next small goal | Show today's one small goal and why it helps the learner's goal | `small_goal` (next due), its fundamental | Start take | R14, R16 |
| 4 | Live pitch line | Show target line and the learner's line while playing | Phrase notes, live pitch or MIDI, count-in | `take` + `feature_set` | R1, R8 |
| 5 | One fix card | Name one cause and one cue; show visually what to do | `feature_set` through cue rules | `cue` row | R2, R3, R5, R6, R17 |
| 6 | Retake proof | Before and after on the same phrase, in music words | Two `feature_set` rows | Pass or re-spread; `progress` update | R3 |
| 7 | Two progress lines | "Your goal" and "your skill" (ahead line), no streak | `progress` rows over the week | Nothing | R15, R9 |
| 8 | Hand-off card | When the fix needs a teacher: take, fix list, offer | Takes, cues with `ceiling = true` | Mock Webex message | R10, R11 |
- Rest cue: banner on screen 3 or 6 after the session cap (R9); goals re-spread to tomorrow, no streak lost.
- Copy rules (Simone owns): plain words, no dB or Hz on screen, one sentence a card, no shaming copy.
- Before-and-after examples for keyboard: "3 wrong notes to 0", "rushed the long note to steady"; voice: "wobbles 24 to 7" (functional-requirements-v0.md).

## 6. The demo phrase
### How to choose it
- Rule (R17): the app starts at the easiest phrase, not bar one. Score each phrase, sort ascending.
  o Score = range span (semitones) + largest leap + notes per second + rhythm changes; lower is easier.
- Stage phrase: four bars, one hand, five-finger position, stepwise, ends on the home note.
- Demo arc: take 1 is a captured MIDI performance with two real errors (one wrong note, one rushed long note), replayed through the scoring code and labelled "replay".
  o The app picks one cue; the presenter plays the retake live; the proof card compares the two.
### Candidates (all played by our own synth from note data we type in; no recording or arrangement copied)
| Melody | Why | Rights status |
|---|---|---|
| "Ode to Joy" theme, opening phrase (Beethoven, Symphony 9, first performed 1824) | Stepwise, five notes (C to G in C), one hand, widely known | Composer died 1827; published works by creators who died before 1955 are public domain in Australia [13][14]; snippet for the dates [15] |
| "Twinkle Twinkle" melody ("Ah! vous dirai-je, maman", printed 1761, composer unknown) | Very familiar to children; one leap of a fifth | Melody 1761, lyrics 1806 and 1838 per snippet [16]; public domain by the same rule [13] |
| "Frere Jacques" (traditional) | Round, good for a later "jam with the app" glimpse | `unverified`; composer attribution debated, check before use |
- Do not reuse modern arrangements, engravings or MIDI files: they carry their own copyright [14]. Type the notes ourselves.
- The learner-goal chip "make this cover sound good" stays text only; no copyrighted song plays anywhere (R13).
### Tempo and key
- Keyboard: C major, fixed; tempo starts at 70% of target (for example 63 of 90 bpm), rises 10% after two clean takes (R16).
- Count-in: four synth clicks; backing = synth melody guide (quiet) plus a drone on the home note.
- Voice: range check picks the key; transpose the phrase so its top note sits two semitones under the highest full note.
- Tempo and key changes are free because backing is synthesised from note data, not audio.

## 7. Data model and small-goals engine
### Tables (IndexedDB object stores; same shape as SQL later)
| Table | Key fields |
|---|---|
| learner | id, display_name (local only), instrument, input_ok, noise_floor, range_low, range_high, key, session_cap_min |
| goal | id, learner_id, text, type (song_for_someone, cover_sounds_good), target_date, phrase_set_id, created_at |
| small_goal | id, goal_id, order, phrase_id, fundamental, tempo_pct, pass_rule (json), due_date, status (open, passed, re-spread) |
| take | id, small_goal_id, started_at, input (midi, mic, on_screen), audio_blob (null by default), is_retake_of |
| feature_set | id, take_id, note_accuracy, wrong_notes (list), onset_dev_ms_mean, evenness, cents_off_median, range_used, clarity_mean |
| cue | id, take_id, rule_id, cause_text, cue_text, visual_hint (json), ceiling (bool), source (rules, llm_cached, llm_live) |
| progress | id, learner_id, date, goal_pct, skill_banked (list of fundamentals), ahead_days |
### Fundamentals (one per small goal)
| Fundamental | Keyboard measure | Voice measure |
|---|---|---|
| Right notes | wrong_notes count | cents_off_median under threshold |
| Steady pulse | onset deviation from the beat | onset deviation from the beat |
| Note length | held duration vs written | held duration vs written |
| Even touch | velocity spread | volume spread |
| Comfortable range | n/a (hand position) | notes inside range_low..range_high |
| Phrase shape | dynamics rise and fall | breath placement at phrase end |
### Scoring contract (agree by Saturday 11:00; every layer codes to it)
- Pipeline: input events, then note events, then aligned take, then feature_set, then one cue.
  o MIDI: note on/off gives pitch, onset, duration, velocity directly; exact.
  o Mic: pitch frames with clarity; drop frames under a clarity gate; merge frames within a semitone into a note; ignore notes under about 100 ms (tune on real takes).
  o Align: match played notes to target notes in order (simple edit-distance alignment); extra, missing and wrong notes fall out of it.
  o Silence: no notes for 3 s ends the take; an empty take gives "we heard nothing" (set-up problem), never a music cue.
- Which features each input supports:

| Feature | MIDI | Mic (keyboard tone) | Mic (voice) |
|---|---|---|---|
| Wrong, missing, extra notes | Yes | Likely, after tests | Approximate (cents bands) |
| Onset timing | Yes | Likely | Rough |
| Duration | Yes | Rough | Rough |
| Evenness | Velocity | Level, rough | Level, rough |
| Wobble, breath | No | No | Not on Saturday |

- Mic rows are planning estimates to confirm with Saturday's real takes, `unverified`.
### Engine logic
- Split: goal type picks a template of 5 to 8 small goals; each small goal = one phrase + one fundamental + one pass rule.
  o Saturday: hand-written templates (Simone writes them); LLM split is a stretch, cached for stage.
- Order: phrases sorted easiest first (section 6); fundamentals ordered right notes, pulse, length, touch, shape.
- Schedule: small goals spread evenly from today to target_date (default 14 days), at most one new small goal a day, session cap 20 to 40 min (R9).
  o The sample week therefore shows small goals 1 to 5 or so, with one miss re-spread; the rest sit ahead on the goal line.
- Pass: pass rule met on a take; the fundamental is "banked" for the skill line.
- Miss: the small goal and all later ones re-spread from the next fresh start (tomorrow); no streak, no reset, no shaming copy.
- Adjust (R16): two clean first takes, tempo +10% or longer phrase; two misses, split the phrase or tempo -10%; off-day check after three misses.
- Ceiling: same cue fired three sessions in a row without a pass, or a rule marked `ceiling`; the hand-off card is offered.
- Progress lines: goal_pct = passed small goals over total; ahead_days = banked fundamentals minus the plan for today, in days.
### Cue rules (rules first, LLM optional)
| Priority | Rule (feature) | Cause in plain words | Cue (example) |
|---|---|---|---|
| 1 | wrong_notes > 0 | "You played F where the phrase asks for E" | "Bar 2, third note: E, one white key left"; key lights on screen |
| 2 | onset_dev_ms_mean > threshold, early on long notes | "The long note ended early" | "Count two on the long note" |
| 3 | evenness poor (velocity spread) | "Some notes were much louder than others" | "Same weight on every finger" |
| 4 | voice cents_off high on top notes while level rises | "Top notes went sharp as you got louder" | "Don't get louder; narrow the vowel" (voice story only; n = 1 evidence; a teacher should validate) |
| 5 | range_used beyond range_high | "That note is above your range for now" | "We moved it down two steps" |
- Cause text names only what was measured (an observable event), never a guess about fingers or technique.
- One cue per retake (R3): highest-priority rule wins; thresholds live in one JSON file so Justin and Simone tune without code.

## 8. Hour blocks
### Sat 7 Nov, at home, about 10 hours (target: loop on one laptop with canned data by evening)
| Time | Block | Owner | Output |
|---|---|---|---|
| 09:00-09:30 | Stand-up (Webex or Miro): read the three tech files, confirm defaults, age group if Simone has it | All | Chosen stack row on Miro |
| 09:30-11:00 | Scoring contract (section 7): event, take, feature_set and cue shapes as one JSON schema file | Carlos + Justin | `data/contract.json` agreed |
| 09:30-10:30 | Repo scaffold, `app/` layout, static server, `sw.js` + manifest, IndexedDB wrapper | Carlos (Claude Code session 1) | App shell loads offline on localhost |
| 09:30-12:00 | Phrase data, synth backing, live pitch line with MIDI and on-screen keys | Justin (Claude Code session 2) | Line follows the keyboard |
| 09:30-12:00 | Screen copy, goal templates (5 to 8 small goals), cue wording, design language | Simone | Copy JSON + templates |
| 12:00-12:30 | Lunch, then vertical slice merged: one phrase, MIDI in, one measured cue, retake, proof | All | Saturday pass line met early |
| 12:30-14:30 | Feature extraction + cue rules + selftest with canned features | Carlos (session 3) | `npm test` or `node test/selftest.mjs` green |
| 12:30-14:30 | Microphone path: set-up check, range check, pitch library on a recorded take | Justin | Pitch line from mic and from WAV |
| 14:30-16:30 | Screens 3, 5, 6, 7 wired to engine and store; seeded week of data | Justin + Carlos | Loop clickable end to end |
| 14:30-16:30 | Hand-off card + mock Webex screen; progress line visuals | Simone (with Carlos) | Screens 7 and 8 |
| 16:30-17:30 | First full run on one laptop; fix list | All | Bug list, max 10 items |
| 17:30-18:30 | Fix top items; record a clean run as the screen-recording fallback v1 | Justin, Carlos | Recording v1 |
| 18:30-19:00 | Deploy to static HTTPS host; phone loads it once; commit | Carlos | URL + tagged commit |
| Evening, optional | LLM proxy spike (cue rewrite), only if all of the above is green | Carlos | Cached rewrites JSON |

- The blocks are tight for three people (mentor-style critique, section Method). Cut in this order when behind:
  o LLM proxy; phone mirroring; live voice processing (keep the recorded take); seven-day engine (keep a static sample-week card); screens 1, 2 and 8 as static cards.
- By 19:00 name the exact keyboard, cable, adapter and backup laptop for Wednesday, and test that chain once.
### Sun 8 Nov (travel)
- No build. Teammates open the deployed build on two laptops and tick the checklist (plan day table). 30 minutes.
### Mon 9 Nov (8 am criteria; afternoon at the venue)
| Time | Block | Owner | Output |
|---|---|---|---|
| 08:00-12:00 | ICM; read success criteria; map each to a screen or a slide | All, Simone leads the map | Criteria map |
| 12:15 | Bus to MCEC | | |
| Arrival + 1 h | Re-scope: cut anything no criterion asks for; decide LLM proxy yes or no | All | Updated non-goals list |
| Next 1 h | Real phone and tablet test at venue noise: mic, MIDI permission, offline after airplane mode | Justin, Carlos | Pass or fail per device, three runs |
| Next 1 h | Stage device decision (laptop vs phone); mirroring test; venue Wi-Fi preload | Carlos | Stage set-up locked |
| Rest | First run-through on the stand; fix list | All | Pitch v2 timing |
### Tue 10 Nov (freeze 15:00)
| Time | Block | Owner | Output |
|---|---|---|---|
| Breakfast | Surprise task first | All | Task answered |
| Until 13:00 | Fixes from Monday; polish demo arc; cached LLM rewrites if kept | Justin, Carlos | Release candidate |
| 13:00-15:00 | Freeze prep: bump cache name, redeploy, reload on every stage device, new screen recording | Carlos | Frozen build + recording v2 |
| 15:00 | Feature freeze; only fixes after this | | |
| 15:00-18:00 | Rehearsals 1, 2, 3 with the live demo, timed (target 2:40) | All | Pitch v3, Q and A sheet |
### Wed 11 Nov morning (fixes only)
- 7 am bus; on arrival: battery, sleep off, airplane mode test, one full run, recording on a second device.
- Only fixes to a failing step; no new copy, no new screens.

## 9. Fallback paths
| Failure | Trigger | Fallback | Ready by |
|---|---|---|---|
| Pitch detection late or inaccurate | Saturday 14:30 line jumps or misses on voice | Replay a pre-recorded take through real detection; else canned feature JSON; else "wizard of Oz" cue from a hidden key | Sat 17:30 |
| MIDI fails on stage | No device in the list or permission denied | On-screen keys, same phrase, same cue path | Sat 12:00 |
| LLM proxy down | Timeout over 2 s | Rules cue text (always shown first); cached rewrites | Default |
| Phone mic fails | Flat level on set-up check | Laptop mic, or keyboard path | Mon test |
| Network down | No Wi-Fi at venue | Everything local; laptop on localhost; phone from service worker | Sat 19:00 |
| Mirroring fails | Projector blank or lag | Laptop is the stage device; phone only at the stand | Mon |
| MIDI keyboard unplugs mid-demo | Device leaves the input list | Listen for MIDI state changes, show "keyboard reconnected", resume the take | Sat 16:30 |
| Stuck MIDI note | A note sounds or shows forever | "All notes off" on any screen change and a hidden panic key | Sat 16:30 |
| Audio silent after a tap | AudioContext still suspended | Start button calls `resume()`; status dot shows audio on [18] | Sat 12:00 |
| Service worker did not install | Offline reopen fails in the test | Laptop on localhost is the stage path; re-run the offline test after each deploy | Mon |
| Stage laptop dies | No boot or no display | Backup laptop with the same build, seed data and keyboard chain | Sun check |
| Everything fails | Demo will not start in 10 s | Screen recording of a good run, narrated live | Sat v1, Tue v2 |

## 10. Risks
| Risk | L | I | Trigger | Response |
|---|---|---|---|---|
| Voice pitch tracking jumps octaves or wobbles | H | M | Line jumps an octave in tests | Keyboard on stage; voice from a recorded take; clarity gate on the line |
| Mic permission or insecure URL on a device | M | H | No prompt; `mediaDevices` undefined | Only HTTPS or localhost [1]; Monday device test |
| Web MIDI prompt or no support | M | M | iPad, or prompt denied | On-screen keys; laptop Chrome as stage [4][5] |
| Venue noise bleeds into the mic | H | M | Line moves before playing | Keyboard via MIDI is noise-proof; mic close; headphones for backing |
| Backing synth feeds back into the mic | M | M | Pitch follows the backing | Headphones or backing off during voice take |
| Stale service-worker cache | M | H | Old screens after deploy | Versioned cache name; reload checklist on freeze day [8] |
| Battery or screen sleep mid-demo | M | H | Dim screen | Charge, sleep off, power cable on stage |
| Scope creep (cohort, buddy, game layer) | H | H | New screen requested after Monday 15:00 | Non-goals list; criteria map decides |
| Late decisions (age group, instrument) | M | M | Not settled Sunday | Build age-neutral copy; swap copy JSON only |
| Two machines on a Drive-synced repo | M | H | Conflicted files | Carlos commits from one machine (state-of-play section 12) |
| Overclaiming Cisco or AI | M | H | Slide says "integrated" for a mock | Section 11 wording; "mock" in speaker notes |
| Library licence vs Participant Agreement IP terms | L | M | A copyleft dependency | Permissive libraries only (pitchy is 0BSD [2]); list licences in README |
- Likelihood and impact are planning estimates, `unverified (Codex knowledge)` for the generic rows; rehearse on the stage devices.
- Judge questions to rehearse (one owner each, plan rehearsal checklist):
  o "Is that correction derived from what was played?" Show input event, measured difference and cue together.
  o "Are the week-long gains real?" No: labelled sample week; the real proof is the live retake and the nine-student test.
  o "Does it work with Wi-Fi off?" Turn Wi-Fi off on stage before the demo, if the Monday test passed.
  o "Where is the voice coaching?" The recorded take, called a tested prototype, plus the n = 1 evidence story.

## 11. Cisco fit (kept honest)
- Webex is the programme's live channel (key-facts-info-pack.md); our hand-off message is shown as a Webex message.
- Wednesday version: a mock Webex screen with the hand-off card. Real post is possible later through the Webex messages API.
  o The API takes a POST to `/v1/messages` with `roomId` and `markdown`, bot token as Bearer; markdown limit 7,439 bytes (snippet) [17].
  o If Carlos wants a live post on Tuesday: bot token stays out of the repo; send to a team test space; still say "mock pilot".
- Duo sign-in: in the story slide only, not in the demo (friday-selection-pack section 10).
- Do not say: "built on Cisco", "integrated with Webex" for a mock, or any Cisco product we did not run.

## 12. Definition of done per day
| Day | Done means |
|---|---|
| Sat 7 Nov | Loop end to end on one laptop, offline, canned week of data; selftest green; recording v1; deployed URL loaded once on a phone |
| Sun 8 Nov | Two teammates opened the build on their laptops; checklist ticked |
| Mon 9 Nov | Criteria map; non-goals updated; stage device chosen after three-run test; one run-through on the stand |
| Tue 10 Nov | Surprise task done; frozen build at 15:00 on every stage device; recording v2; three timed rehearsals at 2:40 or under |
| Wed 11 Nov | One clean full run before the pitch; no changes except fixes |

## 13. Claude Code working method (Saturday)
- One Claude Code session per layer, each with its own short brief: shell + PWA + store; audio + input; engine + cues + selftest; screens + copy.
  o Each session reads this file, functional-requirements-v0.md and the chosen tech file only; no other context.
- Selftest first, then code: `test/selftest.mjs` replays every JSON in `test/fixtures/` through `engine/cues.js` and asserts the cue id.
  o Fixtures: one per rule, plus "clean take" (no cue) and "two errors" (priority check).
  o Also replay captured note-event files (real MIDI takes from Saturday) through alignment, features and cues: tests the whole pipeline, not only the rules.
  o If the pitch library runs in Node (pitchy says Node and browser [2]), a second check replays `data/demo-take.wav` and checks note accuracy.
- Commit discipline: Carlos commits and pushes, once per green block; message names the block; nobody else runs git.
- Keep `data/thresholds.json` and `data/copy.json` outside code so Simone and Justin tune without a session.
### Proposed `app/` layout (Saturday creates it; nothing created tonight)
```
app/
  index.html
  manifest.webmanifest
  sw.js
  icons/            icon-192.png, icon-512.png
  src/
    main.js         router, screen switching
    screens/        goal-entry, setup-check, range-check, next-goal, live-line, fix-card, retake-proof, progress, handoff
    audio/          mic.js, pitch.js, midi.js, onscreen-keys.js, synth.js
    engine/         phrases.js, features.js, cues.js, small-goals.js, progress.js
    store/          db.js (IndexedDB), seed.js (canned week)
    mocks/          webex-message.js, class-bar.js
    telemetry.js    local event log, export JSON
  data/             phrases.json, thresholds.json, copy.json, cached-cues.json, demo-take.wav
  test/
    selftest.mjs
    fixtures/       one JSON per rule
  proxy/            optional LLM cue-rewrite proxy (stretch, off on stage)
```

## Method
- Read: session-rules.md, RESUME.md, functional-requirements-v0.md, state-of-play-2026-11-06.md (sections 1, 2, 5 to 8, 10 to 12), plan-2026-11-02-to-11.md, web-app-architecture.md, friday-selection-pack-2026-11-06.md (sections 8, 10), decisions-log.md, grep of notes day 3 and key-facts-info-pack.md.
- Reused from web-app-architecture.md: SQLite-style table thinking, mock identity and Webex nudge as mocks, "cached outputs for the stage"; dropped the gateway, model router and tutor harness.
- Did not read the three sibling tech files (instruction); section 3 holds decision points instead.
- Codex 1 (gpt-6-sol, medium): knowledge draft of the PWA offline pattern, secure-context options, browser support, mirroring, and a demo risk table.
  o Kept after web checks: secure-context rule, Web MIDI support and Chrome permission prompt, AudioWorklet support, storage advice, mkcert phone step, scrcpy.
  o Kept as `unverified (Codex knowledge)`: asset budget, wireless casting weakness, generic risk likelihoods.
  o Changed: Codex suggested Workbox; plan uses the hand-written MDN worker for fewer dependencies.
- Codex 2 (gpt-6-sol, high): mentor critique of the full plan, names stripped. Kept after checks:
  o Labelled replay for take 1, live retake; a scoring contract and vertical slice by Saturday lunch; Saturday pass line and cut order.
  o Cues name observable events only; seeded week labelled as sample; schedule fixed to a 14-day default.
  o AudioContext `resume()` on the start tap [18]; service-worker control and update rules [19]; separate storage per origin; extra fallbacks (unplug, stuck note, backup laptop).
  o Not taken: dropping the voice cue entirely; kept for the voice story only, marked n = 1 and teacher-to-validate.
- Web pages opened: MDN getUserMedia, MDN Web MIDI, caniuse Web MIDI and AudioWorklet, MDN service-worker tutorial, MDN installable PWAs, MDN storage quotas, MDN Web Audio best practices, MDN Using Service Workers, Chrome Web MIDI blog, mkcert, scrcpy, pitchy, NLA copyright duration.
- Snippet only (search results): GitHub Pages plans, Australian duration sheet, Ode to Joy dates, Twinkle melody dates, Webex messages API.

## Open questions
- Success criteria: "due" (team writes them) or "given" (organisers hand them out) at 8 am Monday? state-of-play and the plan file differ.
- Age group (Sunday, Simone): sets the copy and design language; the build keeps copy in one JSON so it swaps late.
- Stage device: laptop only, or phone mirrored? Decided Monday after the three-run test.
- Who brings the keyboard, and does it have USB MIDI? Which adapter for the stage laptop?
- Host for the HTTPS build (free static host vs paid GitHub Pages); Carlos decides; repo stays private.
- Keep the LLM proxy at all? Only if the criteria reward it; which provider and where the key lives (never in the repo).
- Telemetry for the nine-student test: what we log, consent wording, and export path (Simone's privacy story).
- Thresholds for pass rules and cues: need real takes from Saturday to tune.

## Sources
1. MDN, MediaDevices.getUserMedia(), https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia, accessed 2026-11-06, opened.
2. pitchy repository (README), https://github.com/ianprime0509/pitchy, accessed 2026-11-06, opened.
3. MDN, Web MIDI API, https://developer.mozilla.org/en-US/docs/Web/API/Web_MIDI_API, accessed 2026-11-06, opened.
4. Chrome for Developers, Web MIDI permission prompt, https://developer.chrome.com/blog/web-midi-permission-prompt/, accessed 2026-11-06, opened.
5. Can I use, Web MIDI API, https://caniuse.com/midi, accessed 2026-11-06, opened.
6. Can I use, AudioWorklet, https://caniuse.com/mdn-api_audioworklet, accessed 2026-11-06, opened.
7. MDN, Making PWAs installable, https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Making_PWAs_installable, accessed 2026-11-06, opened.
8. MDN, Make PWAs work offline with service workers, https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Tutorials/js13kGames/Offline_Service_workers, accessed 2026-11-06, opened.
9. MDN, Storage quotas and eviction criteria, https://developer.mozilla.org/en-US/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria, accessed 2026-11-06, opened.
10. mkcert repository (README), https://github.com/FiloSottile/mkcert, accessed 2026-11-06, opened.
11. GitHub Docs, GitHub Pages plan availability, https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site, accessed 2026-11-06, snippet.
12. scrcpy repository (README), https://github.com/Genymobile/scrcpy, accessed 2026-11-06, opened.
13. National Library of Australia, How long does copyright last?, https://www.library.gov.au/research/access-collection/copyright-library-collections/how-long-does-copyright-last, accessed 2026-11-06, opened.
14. Arts Law Centre / Australian Copyright Council, Duration of copyright (G023), https://www.artslaw.com.au/images/uploads/Duration%20of%20Copyright%20(G023v16).pdf, accessed 2026-11-06, snippet.
15. Cantorion, Symphony No. 9, https://cantorion.org/pieces/147/Symphony-No.-9, accessed 2026-11-06, snippet.
16. Britannica, Did Mozart write "Twinkle, Twinkle, Little Star"?, https://www.britannica.com/story/did-mozart-write-twinkle-twinkle-little-star, accessed 2026-11-06, snippet.
17. Webex for Developers, Create a Message, https://developer.webex.com/docs/api/v1/messages/create-a-message, accessed 2026-11-06, snippet.
18. MDN, Web Audio API best practices (autoplay policy), https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Best_practices, accessed 2026-11-06, opened.
19. MDN, Using Service Workers, https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers, accessed 2026-11-06, opened.
