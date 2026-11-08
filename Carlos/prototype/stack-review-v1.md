# Stack review v1: what the practice coach runs on, what is proven, what to test first

- Date: Sat 7 Nov 2026, 00:05 to 01:00 AEDT (overnight). Purpose: one place for the stack, its proof status and the first tests, so Monday's lock-in is a choice.
- Scope: the keyboard stage build (prototype-skeleton.html, frozen tonight) and the product stack behind it; no new code; model options sit in model-slot-options-v0.md.
- Status: overnight draft for the team; verify before the pitch. Roles: Infrastructure and rig lead (Carlos), Model and web lead (Justin), Research and UX lead (Simone).

## 1. Bottom line
- The stack in one sentence:
  o One self-contained HTML page (inline JavaScript and CSS, own Web Audio synth, meta CSP with `connect-src 'none'`), served from localhost in Chrome on the stage laptop, reading a class-compliant USB MIDI keyboard through Web MIDI, scoring each take with on-device pure functions against take-data-contract.md (take/v1, take-features/v1.1); on-screen and letter keys as fallback; no network, no storage, no model call on the stage path.
- What is proven (all on a desktop, none on the stage rig):
  o Scoring core: self-test 22 of 22 in Node v24.17.0, re-run tonight with a one-line command (section 6); same result in headless Edge per the skeleton README.
  o Contract: 16 fixtures plus 18 deliberate breakages caught by the validator (skeleton README; prototype-review-v1 s1).
  o Network and storage: no fetch, XHR, socket, external file or storage call in code; CSP blocks connections (prototype-review-v1 s4).
  o Pitch tracker for the later voice path: Pitchy 4.1.0 named every synthetic note right, zero octave errors (tech-pitch-detection M1; synthetic only).
- The three untested things that could sink the stage, and the ten-minute test for each:

| # | Untested thing | Ten-minute test (Sat 09:00 onward) | Pass bar |
|---|---|---|---|
| U1 | A real USB MIDI keyboard into real Chrome on the stage laptop | Serve on localhost, Connect MIDI, allow the prompt, play C to C; unplug and replug; quit Chrome, relaunch, reconnect | Keys light with the right note numbers; replug recovers without reload; no surprise prompt after relaunch, or the prompt is drilled |
| U2 | A real captured take 1 gives the planned cue (K3 "you speed up") | Record five take 1s on the real keyboard; read the cue each gets in the debug line, unedited | At least one capture scores the planned cue; else switch the scripted cue (K1 is robust) and the spoken line (prototype-review-v1 D1) |
| U3 | Sound and beat timing through the real output (HDMI or speakers) | Count-in through the stage output; a steady player plays the phrase on the click three times; press a key and listen for lag | Click audible at the back; on-the-beat count at least 6 of 8 on two of three steady takes (team setting); M2 does not fire; no audible key lag |

- The one decision the stack still needs (Monday lock-in):
  o Does the stage build stay the single file with no service worker and no storage (skeleton, decisions-log overnight rows), or grow into build-plan-v1's PWA with `sw.js` and IndexedDB (s4)?
  o Lean: single file on stage; the PWA and IndexedDB only for the phone proof at the stand, if hours allow. Reason: every added file and the service worker add failure modes to the three minutes and loosen the CSP (section 4, row U9).

## 2. The stack table
- Status key: P = proven in the skeleton (desktop, Node or headless Edge); D = decided but untested on the rig; O = open.
- Versions are from the npm registry, opened 2026-11-07 [9][10][11]; sizes are unpacked package bytes, not shipped bytes.

| Layer | Choice | Version pinned | Licence | Size | Status | Decided in (file, row) | Feedback it answers |
|---|---|---|---|---|---|---|---|
| Input (stage) | Web MIDI from a class-compliant 25 to 32 key USB keyboard in Chrome; `requestMIDIAccess({sysex:false})`; `statechange` re-binds on replug | Browser API; Chrome current (permission prompt for all Web MIDI rolled out from 124 [2], all users by 125 per tech-keyboard-input s3) | n/a | 0 KB | D (code exists; never run on a real keyboard) | decisions-log overnight stage row; build-plan-v1 s0, s3 row "Keyboard input"; tech-keyboard-input s1 | F122 (keyboard feedback on a device); F35 (no "hearing" claim on MIDI) |
| Input (fallback, no instrument) | On-screen keys C4 to C5 and letters A S D F G H J K | In the skeleton | own code | in file | P in headless Edge (synthetic letter keys); touch untested | sunday-decisions-sheet B1; skeleton README | F99, F101, F123 (no-instrument path) |
| Input (voice, not on stage) | Mic in an AudioWorklet, Pitchy (McLeod method) plus fft.js, vendored | pitchy 4.1.0 (4 Jan 2024), fft.js 4.0.4 | MIT (npm metadata; repo now 0BSD per tech-pitch-detection) | 33,090 B + 22,390 B unpacked | O (not built; Saturday 17:30 proof gates any claim) | decisions-log overnight voice-path row; build-plan-v1 s3 rows "Pitch tracker", "Mic frames" | F35, F72 (listening back) |
| Signal and features | Clock from `AudioContext` with `getOutputTimestamp()` pair; integer ms from audible beat zero; Features v1.1 | take-features/v1.1 | own code | in file | P for the maths in Node; D on real hardware timing | take-data-contract s2, s3 | none directly; underpins F07 (same measure moves) |
| Matcher | In-order walk, window W = min(400, half the smallest gap) ms; chords rejected | take/v1 | own code | in file | P (F11, F13 fixtures) | take-data-contract s2 "Beat alignment" | none |
| Rules and cue | 20-rule table plus X1, X2; tiered, one winner; keys stage arc uses K-rules | cue/v1; thresholds team guesses | own code | in file | P in Node; K3 fragile on noisy takes (44 percent of 2000 variants) | tech-feedback-layer s3; take-data-contract s3; prototype-review-v1 D1 | F120, F72 (make the AI's part visible: rules on this laptop) |
| Proof card | "On the beat: x of N, then y of N" | in file | own code | in file | P for the count; copy defects D3, D5, D11 open | pitch-v2 1:20; prototype-review-v1 D3, D5 | F07 (live loop, same measure); success-conditions rank 2 |
| Sound | Own oscillator plus envelope synth (count-in, guide, replay, played notes) | in file | own code | 0 KB | P in headless Edge; real output untested | skeleton README "Sound" | none |
| Goal plan (engine) | Pure-function small-goals engine; three labelled states: live, example (saved), template (offline) | small-goals-engine-spec-v1 | own code | not in skeleton | O (engine not in the skeleton; plan box hidden) | build-plan-v1 s3 row "Engine"; s0 row "The one model step" | F120, F149 (show the model step honestly) |
| Model slot | Goal split (T26) through a proxy, schema-locked output; stage shows a saved answer only if a real one exists by the Tuesday freeze | see model-slot-options-v0.md (written tonight) | provider terms | n/a | O (not run; Must by Mon 14:00) | build-plan-v1 s0; decisions-log overnight stage row; sheet A8 | F21 (managed endpoint only); F15 (privacy); F149 |
| Hand-off packet | Stage default: a screenshot in the deck (decisions-log stage row; cisco-fit-note-v1 s2). In app: card plus the same mock screen as an inlined `data:` image; "Learner 12"; labelled "Proposed: Webex hand-off (mock)" | in file | own code; Webex screenshot labelled mock | in file | D (share button disabled, no screenshot yet: D6) | cisco-fit-note-v1 s2; build-plan-v1 D3 (1) | F85, F92 (integrate existing tech); F25, F151 (a human at the ceiling) |
| Storage | Stage: none (skeleton has no localStorage, IndexedDB, cookie or cache). Product: IndexedDB plus `navigator.storage.persist()` | n/a | n/a | n/a | P (none on stage); product O (T20 not built) | decisions-log skeleton row; build-plan-v1 s4 row "Store" (conflict: see section 7) | F15 |
| Delivery | `python -m http.server 8000 --bind 127.0.0.1` in the app folder; Chrome at `http://localhost:8000/prototype-skeleton.html` | Python 3.7 or later for `--directory` [7]; this PC has 3.14.6 | PSF | n/a | D (the review said localhost, not file://) | build-plan-v1 s4 "Serving the app"; prototype-review-v1 s6 row 1 | F100 (offline must work and be shown) |
| Delivery (phone proof, stretch) | Same files plus `manifest.webmanifest` and `sw.js` on a free static HTTPS host; cold offline test | not built | n/a | n/a | O (T22, T23 not built) | build-plan-v1 s4 "PWA and offline"; accessibility-design-v1 s5 | F100, F101 |
| Test harness | Node v24 one-liner over the PURE block; in-browser `#selftest` | Node 24 LTS "Krypton" (26 is the latest LTS) [8]; laptop run v24.17.0 | MIT (Node) | n/a | P | prototype-review-v1 s1; skeleton README "Verified in" | none |
| Libraries planned but not in the skeleton | Tone.js (build-plan-v1 s3 row "Sound") | tone 15.1.22 latest; `next` tag 15.5.66 | MIT | 5,401,640 B unpacked; depends on standardized-audio-context and tslib | Superseded in the skeleton by its own synth | build-plan-v1 s3; skeleton README | none |

- Reading the table:
  o Everything on the stage path is own code inside one file; the only third-party dependency is Chrome itself.
  o Tone.js is no longer needed for the keyboard stage; vendoring it would add a bundled build file and a notices line for no stage gain.
  o Pitchy and fft.js enter only with the voice path, as files in `vendor/`, never from a CDN.

## 3. Data flow
- Stage build (keyboard), one line per hop:
  o Key press on the USB keyboard, then Windows MIDI stack, then Chrome Web MIDI `midimessage` with a page-clock `timeStamp`.
  o `midi.js` logic in the page maps the event onto the AudioContext clock via one `getOutputTimestamp()` pair; ms from audible beat zero.
  o Take record (take/v1) held in page memory as numbers; no audio exists on this path.
  o Matcher, then Features (v1.1), then rules: one cue chosen on the laptop.
  o Proof card computes before and after from the stored take 1 and the live retake.
  o Hand-off card shows a static, labelled mock with a pseudonymous id; nothing is sent.
- What never leaves the laptop on stage: key events, takes, features, cues, the typed goal (the page has no send path; CSP `connect-src 'none'`).
  o Caveat: "no storage" holds for the page's code; Chrome still keeps its own permission and cache state. CSP covers the page's code only; Chrome's own services (Enhanced Spell Check, sync, translate) sit outside it (prototype-review-v1 s4). Add `spellcheck="false"` and use a clean stage profile.
- Where the stage build has no network and no storage (decisions-log overnight rows "On stage" and "prototype-skeleton.html is the Saturday 09:00 starting point"):
  o No network: no LLM call, no Webex post, no CDN fonts or scripts; model output only as a saved answer labelled "example output, recorded <date>", and only if real.
  o No storage: a reload returns the seeded start state; Reset re-seeds in 10 s (D10 fix).
- Product path (not on stage, for Q and A): typed goal (names and places stripped, length capped), instrument and phrase ids go through the proxy to the model; an overseas disclosure; never audio (build-plan-v1 s0; privacy-design-v1 s5.1).
  o A clip reaches a teacher only by explicit per-clip opt-in through an expiring link; Webex carries text and link only (privacy-design-v1 s5.1).

## 4. Untested list, ordered by stage risk
| # | Item | Ten-minute test | Pass bar | Who (role) | By when | Fallback if it fails |
|---|---|---|---|---|---|---|
| U1 | MIDI keyboard into Chrome on the stage laptop | Section 1 U1; also repeat one note fast, release all keys, and check `chrome://settings/content/midiDevices` shows localhost allowed | Section 1 U1; plus one scored onset per press, no stuck or doubled notes (velocity-0 note-on handled as note-off, as the skeleton README says) | Rig lead | Sat 09:00-09:20 | On-screen keys at once (sheet B1 option b); keyboard owner named (success-conditions s7 row 3, sheet A3) carries a second keyboard if one exists |
| U2 | Planned cue fires on a real take 1 | Section 1 U2 | Section 1 U2 | Model and web lead plays; rig lead reads | Sat 09:30-10:00 | Script the cue the capture gives (K1 robust); change the spoken line; drift-aware matcher only after checkpoint B |
| U3 | Sound and timing on the stage output | Section 1 U3; log `e.timeStamp` and `performance.now()` for ten notes (build-plan-v1 s4 timing); film the count-in and a take on a phone and compare what was heard with the on-beat result | Section 1 U3; the same steady take scores alike on laptop speakers and on HDMI, or the team fixes one route and rehearses only that | Rig lead | Sat 10:00-10:15 (laptop speakers); HDMI in the room Monday | Laptop speakers; "sound off, watch the bars" (tech-keyboard-input s8) |
| U4 | Self-test in real Chrome on the stage laptop | Open `...prototype-skeleton.html#selftest` from localhost | 22 of 22 | Rig lead | Sat 09:00 with U1 | Node one-liner (section 6) proves the core; fix the browser glue |
| U5 | file:// versus localhost | Double-click the file once; Connect MIDI; note prompt behaviour; relaunch and repeat | Record what happens; stage uses localhost either way | Rig lead | Sat 09:20 | Localhost only. file:// is a secure context [3], but whether Chrome remembers a MIDI grant for a file page is `unverified`; a 2015 Chromium review proposed "always ask" for file URLs [12] |
| U6 | Cold start: Wi-Fi off, fresh Chrome launch, server started from a shortcut, full arc | Time from power-on to replay-ready | Under 2 minutes; whole arc runs with Wi-Fi off | Rig lead | Sat 11:45 with the timed arc | Second laptop with the same build (playbook) |
| U7 | Another app holding the keyboard (vendor tool, DAW) | Open the vendor app, then Chrome; then close it | Chrome sees the keyboard with the other app closed | Rig lead | Sat 09:20 | Close every MIDI app before the pitch (stage checklist). Windows MIDI Services makes MIDI 1.0 endpoints multi-client and reached retail Windows 11 from February 2026 [6]; note the laptop's Windows build (winver); whether it has the service is `unverified` |
| U8 | Stage Chrome profile | Fresh profile: spell check off, translate off, no sync, notifications off, zoom 100 percent | No pop-ups during a 3-minute run | Rig lead | Sat 10:15 | Guest window, rehearsed |
| U9 | CSP if anything is added | Load page with DevTools console open after each added file | Zero CSP errors | Model and web lead | Each time a file is added | Keep the single file. Inference, `unverified`: a service worker, manifest or AudioWorklet module needs `script-src`/`worker-src`/`manifest-src` beyond today's `default-src 'none'` and inline-only policy [5] |
| U10 | Readability at 10 m | Cue, count and banner on the venue screen from the back row | Cue text about 50 mm tall (build-plan-v1 s4) | Research and UX lead | Mon in the room | Bigger font in `#stage` mode |
| U11 | On-screen keys full loop (stand) | Run the whole arc on touch or letters | Same cue and proof as with the keyboard | Rig lead | Tue 15:00 (success-conditions rank 9) | Say "untested" for the no-instrument claim |
| U12 | T26 goal split, real saved answer | One real call through the proxy; save the answer and date | Schema passes; answer uses only supplied phrase ids | Model and web lead | Mon 14:00 (sheet A8) | Rules-only on stage; no plan box (skeleton switch stays false) |
| U13 | Voice path (not stage) | Saturday 17:30 proof protocol, adults only | tech-voice-path-proof s0 bars | Model and web lead | Sat 17:30 | Keyboard only; voice as a labelled recorded take (decisions-log) |
| U14 | Phone PWA cold offline (stand, stretch) | accessibility-design-v1 s5 airplane test | Two takes in airplane mode after a cold reopen | Rig lead | Mon | Phone stays out of the story; laptop only |
| U15 | Output device switch: HDMI plugged in or changed after the page loaded | Open the page on laptop speakers, then plug HDMI and set it as the default output; play the count-in | Sound follows the chosen output, or a page reload fixes it; note which | Rig lead | Mon in the room | Plug HDMI and pick the output BEFORE opening the page; reload after any change. Chrome's behaviour on a mid-session device change is `unverified (own knowledge)` |
| U16 | Laptop sleep, screen saver, USB power saving, notifications | Leave the page idle 15 minutes on battery and on mains; then play | Keyboard still seen; audio still runs; no toast appeared | Rig lead | Sat 10:15 with U8 | Mains power; Windows power plan set to never sleep; Do not disturb on; plug the keyboard straight into the laptop, no unpowered hub (`unverified (own knowledge)` for USB selective suspend effects) |
| U17 | Display scaling and projector resolution | Duplicate mode at the venue resolution; check the roll and keys fit without scrolling | Whole stage view visible at 100 percent zoom | Research and UX lead | Mon in the room | Fixed zoom level written on the checklist |

## 5. Minimal stage stack versus stretch stack
| | Minimal stage stack (lock this) | Stretch stack (only if ahead) |
|---|---|---|
| Files | One HTML file, localhost | Plus `manifest.webmanifest`, `sw.js`, icons, `vendor/` |
| Input | USB MIDI, on-screen keys, letters | Plus voice via Pitchy in an AudioWorklet (stand only) |
| Cue | K-rules from the table, one cue | Plus learner-word chips (T24) |
| Model | None live; saved answer only if real | Live goal split at the stand when online and consented (T26) |
| Storage | None; Reset re-seeds | IndexedDB plus `persist()` (T20) |
| Hand-off | Card plus inlined mock screen (D6) | Real test post to a team space at rehearsal only (D3 option 2) |
| Hours (build-plan-v1 s8 estimates, ours) | Saturday morning fix list about 3 h (prototype-review-v1 s6) plus T10 1 h | T22 1.5, T23 1.5, T20 1.5, T11 plus T13 6, T26 2.5, T24 1 |
| Feedback answered | F07, F120 (rules visible), F122, F99 to F101 via the on-screen loop | F72 (listening back), F100 (offline on a phone), F149 (live model step) |

## 6. Prepare before leaving on Sunday
- Files vendored, no CDN:
  o Stage needs nothing beyond `prototype-skeleton.html` (own synth, no libraries).
  o If the voice path is built: `vendor/pitchy.js` and `vendor/fft.js` from npm 4.1.0 and 4.0.4, with licence texts in `NOTICES.md`.
- Pinned downloads (offline copies on the laptop and both sticks): Chrome version noted, Python installer, Node 24 LTS installer, any keyboard vendor manual.
- The offline run command (Windows, in the app folder):
  o `python -m http.server 8000 --bind 127.0.0.1` then open `http://localhost:8000/prototype-skeleton.html#stage`.
  o Keep the same port every time: the MIDI grant is per origin, and the port is part of the origin.
  o Python 3.14.6 on this PC maps `.js`, `.mjs` and `.webmanifest` to the right types (checked locally); check the stage laptop's Python.
- The Node self-test command (from the folder; tested tonight, 22 pass 0 fail):

```
node -e "const fs=require('fs');const h=fs.readFileSync(process.argv[1],'utf8');const s=h.slice(h.indexOf('/* PURE-BEGIN'),h.indexOf('/* PURE-END */'));const r=new Function(s+';return runSelfTest();')();console.log(r.pass,'pass',r.fail,'fail')" prototype-skeleton.html
```

- Backup copies: two USB sticks (each with the build, the 20-second screen recording, the deck PDF, the run commands) and one cloud copy of the same; no learner data on any of them.
- "The laptop is ready" check (five lines):
  1. Wi-Fi off; server started; `#selftest` shows 22 of 22.
  2. Keyboard plugged in; Connect MIDI; keys light; replug recovers.
  3. Count-in audible on the stage output; one steady take scores on the beat.
  4. Stage profile: no spell check, translate, sync or notifications; full screen; build tag visible.
  5. Reset to replay-ready in 10 s or less, timed twice; backup laptop passes 1 to 4.

## 7. Build rules carried from the files
| Rule | Source row |
|---|---|
| No network call on the stage path: no LLM, no Webex post, no analytics, no CDN | decisions-log 2026-11-06 overnight "On stage"; build-plan-v1 s0 row "Stage build and the cloud", s2 non-goals |
| No storage on stage; the skeleton has none and that is its proven state | decisions-log overnight skeleton row; prototype-review-v1 s4 |
| Take 1 is a labelled replay of a real Saturday capture; `TAKE1_IS_CAPTURE` true only then | decisions-log overnight skeleton row; skeleton switches |
| Model output only as a real saved answer, tagged "example output, recorded <date>"; never faked | decisions-log overnight stage row and correction row; sheet A8 |
| take-data-contract.md is binding: snake_case, integer ms from audible beat zero, pinned take/v1 and take-features/v1.1; one owner after Sat 12:00 | decisions-log overnight contract row; take-data-contract s7 |
| No GPL, AGPL or non-commercial code; Pitchy (MIT) lean; notices file | decisions-log overnight licence row |
| Pseudonymous ids only ("Learner 12"); no first names in app, demo or mock | decisions-log overnight privacy row |
| Never "it hears you" with the MIDI keyboard; no generating-music wording | build-plan-v1 s0; decisions-log stage-script row |
| Conflict to settle: build-plan-v1 s4 lists IndexedDB and a service worker in the stage build; the decisions-log skeleton row and the skeleton have neither | section 1 decision |

## 8. Risks and unknowns register
| Risk | Likelihood | Impact on the three minutes | Mitigation | Owner (role) |
|---|---|---|---|---|
| Keyboard not seen or prompt reappears on stage | Medium | Loses the live retake | Localhost on a fixed port; grant before; on-screen keys at once (B1) | Rig lead |
| Captured take 1 does not give K3 | High (44 percent on noisy variants) | Spoken cue contradicts the card | Five captures; script what fires (D1, D4) | Model and web lead |
| Audio route: HDMI sound missing or delayed | Medium | No count-in, timing looks wrong | Test in the room Monday; laptop speakers fallback | Rig lead |
| Stage chrome shows dev text ("No rule found", "missed", "ms") | High until D2, D3 land | Looks unfinished to judges | `#stage` mode Saturday 10:00 | Rig lead |
| Clock mapping off on the stage laptop | Low to medium | "On the beat" count unbelievable | U3 log and phone film; M2 wording for keys (D8). `getOutputTimestamp()` estimates when a frame is rendered, not when sound reaches the ear through HDMI, so "audible beat zero" is only as good as the U3 listening check | Model and web lead |
| Browser services send typed goal text | Low | Privacy line untrue | `spellcheck="false"`; clean profile | Rig lead |
| A late code change breaks the self-test | Medium | Wrong cue live | Freeze Tue 15:00; Node one-liner before every commit | Model and web lead |
| Laptop failure | Low | No demo | Backup laptop; 20-second recording | Rig lead |
| Windows update during travel changes the MIDI stack | Low | U1 regresses | Pause updates until Thursday; re-run the five-line check Monday | Rig lead |
| No real model answer by the freeze | Medium | No plan box; AI story rests on rules | Say rules on stage; the model step in Q and A only | Model and web lead |

## Method
- Read: the brief's list in order, by section (no whole 85 KB file read; skeleton header and markers only).
- Measured locally: npm registry JSON for pitchy, fft.js, tone; Python mimetypes; Node one-liner self-test (22 pass, 0 fail) on prototype-skeleton.html, read only.
- Codex call 1: gpt-6-sol, high, critique of sections 2, 4 and 8 (roles only, no names): quota error at 00:02 ("try again at 12:40 AM").
- Codex call 2 (the one retry, 00:46): gpt-6-sol, high, same prompt; answered. Codex has no web access, so its cited links were not used as sources.
  o Kept: run U1 and U3 together on the real HDMI route; fast repeated notes and stuck-note check in U1; phone-film timing check in U3; Chrome prompt 124 rollout, 125 all users; "audible beat zero" is an estimate until heard; "no storage" is about page code, not Chrome's own state; U9 CSP inference judged correct.
  o Kept as `unverified (Codex knowledge)`, not in the tables: Windows MIDI Services shipped on updated 25H2 and later (midi.org, opened, confirms a February 2026 retail rollout only).
  o Rejected: reordering U4 below the cue test (the self-test is the five-minute gate that proves the stage laptop runs the same code; it stays with U1); U5 and U14 already sit low and are kept for the record.
- No start-of-run Codex knowledge draft: the brief authorised the end critique only, and the tech files already hold the verified knowledge.
- Pages opened: MDN requestMIDIAccess, MDN Secure contexts, MDN ServiceWorkerContainer.register, MDN CSP guide, Chrome blog Web MIDI permission prompt, midi.org Windows 11 article, Python http.server docs, Node previous releases.

## Open questions
- Monday lock-in: single file on stage (lean) or build-plan-v1's PWA with IndexedDB and a service worker? (section 1)
- Does Chrome on the stage laptop remember the MIDI grant for localhost after a relaunch, and for a file:// page at all? (U1, U5; `unverified`)
- Does the stage laptop have Windows MIDI Services (multi-client), and which keyboard vendor apps are installed? (U7; `unverified`)
- Which HDMI or speaker output is the stage default, and is the venue sound routed from the laptop? (U3; Monday in the room)
- Keep a scripted K3 from the stored capture, or adopt the robust cue the capture gives? (D1; Sunday sheet)
- Is a second USB keyboard available, and who owns it on the day? (success-conditions s7 row 3; sheet A3)
- Does the voice path ever enter the single file? If yes, the CSP needs a source for the AudioWorklet module (U9; inference, `unverified`).
- Which Python and Chrome versions are on the stage and backup laptops? Write them on the stage checklist Saturday.
- Unverified items in this file: 4 marked `unverified`, plus 2 `unverified (own knowledge)` rows (U15, U16) and 1 Codex-knowledge note in Method (file:// grant persistence; Windows MIDI Services on the stage laptop; CSP needs for a worker, manifest or worklet; the on-beat pass bar of 6 of 8 is a team setting).

## Sources
1. MDN, Navigator.requestMIDIAccess(), https://developer.mozilla.org/en-US/docs/Web/API/Navigator/requestMIDIAccess, 2026-11-07, opened.
2. Chrome for Developers, Web MIDI permission prompt, https://developer.chrome.com/blog/web-midi-permission-prompt, 2026-11-07, opened.
3. MDN, Secure contexts, https://developer.mozilla.org/en-US/docs/Web/Security/Defenses/Secure_Contexts, 2026-11-07, opened.
4. MDN, ServiceWorkerContainer.register(), https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerContainer/register, 2026-11-07, opened.
5. MDN, Content Security Policy guide, https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CSP, 2026-11-07, opened.
6. MIDI Association, MIDI 2.0 coming to Windows 11, https://midi.org/midi-2-0-coming-to-windows-11, 2026-11-07, opened.
7. Python docs, http.server, https://docs.python.org/3/library/http.server.html, 2026-11-07, opened.
8. Node.js, Previous releases, https://nodejs.org/en/about/previous-releases, 2026-11-07, opened.
9. npm registry, pitchy, https://registry.npmjs.org/pitchy, 2026-11-07, opened.
10. npm registry, fft.js, https://registry.npmjs.org/fft.js, 2026-11-07, opened.
11. npm registry, tone, https://registry.npmjs.org/tone, 2026-11-07, opened.
12. Chromium code review 903683005 (file URL permissions, 2015), https://codereview.chromium.org/903683005, 2026-11-07, snippet.
