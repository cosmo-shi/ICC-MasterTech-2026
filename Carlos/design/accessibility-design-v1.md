# Accessibility and low-end design v1: a practice coach that works on a cheap phone, offline

- Date: 6 Nov 2026 (AEDT). Purpose: v0 revised against a no-web GPT-6 Sol (high) critique; accepted leads re-checked on official pages where a page exists; the rest are marked `unverified`.
- Scope: device floors, line-by-line asset budget, three offline bugs, Monday airplane-mode test, WCAG 2.2 checks for the live-audio screen, Saturday fixes, plain-language pairs, stage claims.
- Status: overnight draft for the team; verify before the pitch. Source numbers in [brackets] point to `## Sources`. Budget figures are planning targets, none measured. Parent: accessibility-design-v0.md (unchanged).
- Recommendation: stage = laptop Chrome on localhost with a USB MIDI keyboard (demo-instrument-decision.md); the phone is the learner device and the proof. Say "designed for offline"; claim nothing about accuracy, WCAG or coverage.

## 0. Change log (v0 to v1)
| # | Change | Why | Source |
|---|---|---|---|
| 1 | Floors table now separates install floor (Android 10) from performance floor (none stated; our test phone) | Chrome page gives no RAM figure; 2 GB is our test class | [1] critique |
| 2 | WebAssembly row added: widely available since Oct 2017, but the chosen tracker does not need it | v0 only said "use if profiling shows a gain" | [3], tech-pitch-detection.md |
| 3 | Eviction wording corrected: Chrome evicts all of an origin's data at once, so an offline error page can vanish too | v0 implied the app could still explain itself | [5][6] |
| 4 | `persist()` demoted to a request that Chromium answers by heuristic, no prompt | v0 asked for it; did not say who decides | [5][6] |
| 5 | Asset budget rebuilt as a line-by-line table (about 1.2 MB planned against the 5 MB cap); fallback tracker marked online-only | Critique: count every offline route; Codex 2: a fallback outside the precache fails offline | critique, Codex 2 |
| 6 | Three offline bugs, each with a preventing rule; Monday test now eight steps (interruptions added) | Critique section 2; Codex 2 | [7] critique, Codex 2 |
| 7 | WCAG table widened from 7 to 12 rows: 2.2.1, 1.4.2, 2.2.2, 2.4.7, 2.4.11 added; applicability marked as our judgement | Critique: live-audio screen gaps | [8]-[14] |
| 8 | Saturday fixes cut to five, ordered by risk | Critique section 3 | critique |
| 9 | Cue pairs reworded to describe the current take only; "this time" and "next take" removed | The app may not have two takes to compare | critique |
| 10 | Stage claims: "no mobile data" reworded; "accurately detects pitch or timing", "never loses saved work", "audio never leaves the phone" added | Not tested or not provable yet | critique, privacy-design-v1.md s6 |
| 11 | Mic section added: prompt can be ignored, denial recovery, stop the track | Critique plus MDN | [15][16] |
| 12 | Codex 2 folds: keyboard, names and non-text contrast rows added as `unverified`; release-specific asset URLs; server-side dedupe and timeout; readiness is a recent check; "no silent updates" limited to app-controlled downloads; 1.4.2 trigger stated precisely; source numbers fixed | Review of this file | Codex 2 |

## 1. Critique ledger (one row per point)
| # | Critique point | Verdict | Evidence |
|---|---|---|---|
| 1 | Android 10 is Chrome's install floor, not a performance floor | accepted | Page says "Android 10 and up"; no RAM line [1] opened 2026-11-06 |
| 2 | 2 GB and WebAssembly do not predict smooth tracking; measure | accepted | No source gives a RAM floor [1]; WASM "near-native" with no numbers [2]; keep as test plan |
| 3 | AudioWorklet runs on its own thread, secure origin | accepted | "separate Web Audio thread"; Baseline widely available since April 2021; HTTPS only [4] opened |
| 4 | 5 MB precache unsure until built; count every offline route | accepted | Own arithmetic; no source; table in section 3 |
| 5 | Remove the optional model before essential assets | accepted | Consistent with build-plan-v1.md (no model on the stage path) |
| 6 | Precache a complete versioned set; retire old caches on activation | accepted | "Old caches don't tidy themselves"; use `caches.keys` and `caches.delete` [7] opened |
| 7 | Keep reports in IndexedDB, outside the asset cache | corrected | Sound design, but eviction deletes IndexedDB and Cache API together [6]; so a queued report is not safe from eviction: say "saved on this device", not "never lost" |
| 8 | After eviction even the explanatory page may be missing | accepted | "all of its data, not parts of it, is deleted at the same time" [6] opened |
| 9 | Do not rely on Background Sync | accepted | "Limited availability ... not Baseline" [21] opened; support table did not load, browser list `unverified` |
| 10 | `persist()` is a request, not a guarantee | accepted | Chrome approves or denies by interaction history, no prompt; PWA install is one criterion; user can always delete [5][6] opened |
| 11 | Mic needs HTTPS and permission; ask after a tap; handle denial; stop the track | accepted | Secure context, prompt required, NotAllowedError [15] opened; denial/allow steps in Chrome settings [16] opened |
| 12 | The permission promise may never settle | added (not in critique) | MDN: "may neither resolve nor reject" [15] opened |
| 13 | Supported capture settings vary by device | corrected | MDN says capabilities "depend on the browser and media hardware"; unknown constraints are ignored [17] opened; per-phone effect `unverified` until tested |
| 14 | Bug 1: stale shell mixed with new code | accepted | Old worker may serve early fetches, new one takes control later; breaks lazy subresources [7] opened |
| 15 | Bug 2: update or reload loop; reload once on controller change | `unverified` | `skipWaiting` "may be a bad idea" [7]; the loop and the once-only reload are engineering practice, not on that page |
| 16 | Bug 3: upload waits forever; stable request ID, safe retries | `unverified` | Sound design (idempotent retries); no page opened |
| 17 | Monday six-step test | accepted | Steps use [6][7][15][16]; step 6 is our own addition to the failure list |
| 18 | Levels: 4.1.3 AA, 1.4.1 A, 2.5.7 AA, 2.5.8 AA, 2.3.3 AAA | accepted | 4.1.3 [9], 1.4.1 [10], 2.5.8 [11], 2.3.3 [12] opened; 2.5.7 AA from v0's opened "what's new" page [13] |
| 19 | 24 px has exceptions, 44 is a design target | accepted | Spacing, equivalent, inline, user-agent, essential [11] opened; 44 is a platform convention |
| 20 | 3:1 lightness is conditional | accepted | Still needs another cue when meaning depends on telling two colours apart [10] opened |
| 21 | 1.2.2 versus 1.2.1 for spoken cues | accepted | v0 opened both W3C pages [13a][13b]; not re-opened tonight |
| 22 | Add 2.2.1 A for response times | accepted | Turn off, adjust, or extend; real-time and essential exceptions [8] opened |
| 23 | Add 1.4.2 A for audio over 3 seconds | accepted | Pause/stop or independent volume [14] opened |
| 24 | Add 2.2.2 A | accepted | Applies to auto-starting, parallel, over 5 s; "essential" exception [18] opened |
| 25 | Add 2.4.7 AA and 2.4.11 AA | accepted | 2.4.7 [19], 2.4.11 [20] opened; 2.4.11 text is "not entirely hidden" |
| 26 | Live mic input is not automatically a live-captions duty | `unverified` | Not checked against 1.2.4; our judgement: no spoken live audio from people, only tones and our cues |
| 27 | Five Saturday fixes | accepted | Reordered, section 6 |
| 28 | Plain-language pairs describe the current take | accepted | Our check: v0 cues claimed a comparison the app may not make |
| 29 | Read-and-act test is comprehension, not a grade | accepted | Same as v0's point that the formula cannot separate the versions [v0] |
| 30 | Two minutes per person | accepted | Our proposal; no source |
| 31 | Reword "uses no mobile data" | accepted | Update checks and hand-off use some data |
| 32 | Withhold "accurately detects", "never loses saved work", "audio never leaves the phone" | accepted | No test; eviction deletes everything [6]; teacher share is a path [privacy-design-v1.md] |
| 33 | One to three cents is a share of allowance | accepted | Own arithmetic from the carrier plan, section 4 |
| 34 | Critique's Chrome-requirements URL | corrected | Its URL (16737843) opened and says Android 10; v0's URL differs; both fine, use [1] |

## 2. Device and browser floors (checked on official pages)
| Item | Finding | Src |
|---|---|---|
| Android and Chrome | Chrome on Android needs Android 10 or newer; no RAM requirement stated | [1] |
| Our test class | 2 GB RAM, Android 10 or later, about A$135 to A$180; a working definition, not a standard | v0 [2][3] |
| AudioWorklet | Baseline "widely available", since April 2021; HTTPS or localhost only; runs on a separate audio thread | [4] |
| WebAssembly | `WebAssembly.instantiate` is Baseline widely available since Oct 2017; some parts vary. Pitchy is plain JavaScript, so we do not depend on it | [3], tech-pitch-detection.md |
| Background Sync | Limited availability, not Baseline: do not use | [21] |
| Storage quota | Chromium: an origin can use up to 60% of total disk, best-effort or persistent | [5][6] |
| Storage eviction | Default is best-effort; LRU eviction under low disk or when browsers exceed their share (Chrome up to 80%); all of an origin's data goes at once | [5][6] |
| `persist()` | Chromium decides itself, no prompt; PWA installation is one input; users can always clear | [5][6] |
| Microphone | Needs HTTPS or localhost; permission prompt; user may ignore it so the promise may never settle; denial gives NotAllowedError | [15] |
| Mic recovery on Android | Settings, Site settings, Microphone; blocked sites can be set to Allow again | [16] |

- Performance floor: none exists on paper. Test: three cold starts on the named phone; log time to first take, dropped pitch frames, memory.
  o Keep a simpler fallback: plain autocorrelation (tech-pitch-detection.md) if the tracker stalls the phone.
- Stage device is the laptop, so none of these phone floors constrain the demo; they constrain the phone proof only.

## 3. Asset budget, line by line (planning targets unless stated)
| Part | Target (MB) | Basis |
|---|---|---|
| Pitchy 4.1.0 plus fft.js, vendored | 0.03 | Pitchy index.js 18,393 B; npm 33 KB unpacked (measured in tech-pitch-detection.md) |
| AudioWorklet processor file | 0.01 | Our target; one small file |
| App JavaScript (engine, scoring, MIDI, UI) | 0.50 | Our target; no bundler (build-plan-v1.md) |
| Synth | 0.40 | Tone.js oscillator synth is the plan; its size is `unverified`: check on jsDelivr Monday, or use raw OscillatorNode (about 0) |
| Fonts | 0.00 | System font stack; CDN fonts banned (build-plan-v1.md) |
| Phrase files, cue text, stage json | 0.05 | Text only |
| Icons and manifest | 0.10 | Two PNG sizes |
| HTML and CSS | 0.10 | Our target |
| Service worker | 0.01 | Hand-written |
| Total planned | 1.20 | Sum of the rows; cap stays 5 MB |
| Not in the budget: SwiftF0 fallback | 4.7 | 135 KB model plus 4.6 MB runtime. Precached it would total about 5.9 MB, over the cap, so it is online-only: it is NOT an offline fallback. The offline fallback is the 50-line autocorrelation |

- Count two ways Monday: transferred bytes on first load, and stored bytes (Cache Storage plus worklet plus JSON) for every offline route.
- Cut order if over: optional fallback model, then synth samples, then icons, then fonts. Essential assets stay.
- A 5 MB install costs about A$0.007 at A$1.30 per GB and A$0.025 at the A$5 add-on rate (our arithmetic on the carrier plan, v0 [6]). It is a share of a plan's allowance, not an extra charge.

## 4. Data cost (kept from v0)
| Plan (Boost, Telstra network, from 5 May 2026) | Price | Data |
|---|---|---|
| 7-day | A$14 | 6 GB |
| 28-day | A$28 | 8 GB |
| 28-day | A$39 | 30 GB |
| Add-on, 7 days or 28 days | A$5 or A$20 | 1 GB or 4 GB |

- Source: v0 sources [6][7] (opened in v0, not re-opened tonight); one carrier only.
- Rules: precache once, show the download size first, offer "wait for Wi-Fi", no app-controlled downloads or updates on mobile data without the learner agreeing (the browser still checks for a new service worker itself), no audio upload unless the learner sends it.

## 5. Offline behaviour: three bugs, three rules, one test
| Bug | What the learner sees | Rule that prevents it |
|---|---|---|
| 1 Stale shell mixed with new code | New screen, old script; buttons dead, or wrong cue text | One versioned cache holds the whole offline set; every asset URL carries the release (for example `app.v12.js`) so an old page cannot fetch a new script; install fails if any file fails; activate deletes every cache not on the allow list; show the build version on screen [7] |
| 2 Update or reload loop | App reloads again and again, or restarts mid-take | One update prompt per waiting version; apply only when the learner agrees and no take is running; reload once after the new worker takes control; no `skipWaiting` mid-take (`unverified` as a loop rule; lifecycle caution in [7]) |
| 3 Upload waits forever | "Sending..." never ends | Report saved on the device with a stable request ID; retry on open, on reconnect, and "Send now"; show "Sent" only after the server confirms; the server must deduplicate by that ID; each send has a timeout and a visible failed state with "Send now" (`unverified`, design rule) |

- Other rules.
  o "Ready offline" is a recent check, not a lasting property: confirm the cache holds every required file on launch, and handle a missing file during use (if the shell itself is gone, the launch check cannot run).
  o Eviction deletes Cache Storage and IndexedDB together [6]: a queued report can go too; say "saved on this device" and never "never lost".
  o First run with no network and no cache: nothing to show; the venue and school must install on Wi-Fi first.
  o Laptop localhost: works offline only from the cached build or a running local server; test both (build-plan-v1.md).

### Monday airplane-mode test (named 2 GB phone, Chrome; three cold sessions for C5a)
1. Install on Wi-Fi. Record transferred bytes; confirm every lesson and cue shows "Ready offline".
2. Airplane mode on. Force-close Chrome, reopen from the icon, complete two takes. Restart the phone and repeat.
3. Deny the mic, read the message, then allow it in Chrome Site settings [16]; check that recording stops when the take ends.
4. Queue a teacher report offline. Close and reopen. Restore the network; check one confirmed delivery, not two.
5. Deploy a changed build. Open online, accept the update between takes, then repeat step 2; check the build version shows the new number.
6. Clear site data, go offline, open the app; write down exactly what the learner sees; make the stage claim match.
7. Interruptions during a take: switch tabs, lock the screen, unplug or switch headset, revoke the mic in Site settings, then return; check that tracks and audio stop and a clear Resume appears.
8. Open an old tab during the update in step 5; check it does not run a mixed old page with new scripts.
- Log for every run: date, phone model, Chrome version, build version, pass or fail, load time, time to first cue.

## 6. WCAG 2.2 checks for the live-audio practice screen
| SC | Level | What the screen must do | Src |
|---|---|---|---|
| 4.1.3 Status Messages | AA | Recording started, error, and result each announced once through a status region with no focus move; never announce each pitch point | [9] |
| 1.4.1 Use of Color | A | Words, arrows and solid or dashed lines beside colour; W3C notes a hue difference with at least 3:1 luminance contrast can count as an extra cue, but never replaces a second cue when meaning depends on telling two colours apart | [10] |
| 2.5.8 Target Size (Minimum) | AA | Start, Stop, Retry, Mute and keys at least 24 by 24 CSS px, or meet the spacing rule; design to 44 px (convention) | [11] |
| 2.5.7 Dragging Movements | AA | No slide across keys without a tap alternative | [13] |
| 2.2.1 Timing Adjustable | A | Any time limit we set (session timeout, auto-advancing cue, take cap) can be turned off, adjusted or extended; the beat itself is arguably a real-time or essential limit (our judgement) | [8] |
| 1.4.2 Audio Control | A | Strictly applies to audio that plays automatically over 3 s; ours starts after a tap, so likely not triggered (our judgement). Still ship Mute or pause, and a volume control separate from system volume | [14] |
| 2.2.2 Pause, Stop, Hide | A | The live pitch line updates automatically; the "essential" exception may cover it, so offer pause or a static result after the take anyway (our judgement) | [18] |
| 2.4.7 Focus Visible | AA | Every control shows a keyboard focus ring | [19] |
| 2.4.11 Focus Not Obscured (Minimum) | AA | A sticky Start bar or cue card must not entirely hide the focused control | [20] |
| 1.2.1 and 1.2.2 | A | Spoken cues also appear as text; 1.2.2 only for prerecorded synchronized media | [13a][13b] |
| 2.3.3 Animation from Interactions | AAA | Honour reduced-motion; good practice, not an AA need | [12] |
| 1.2.4 Captions (Live) | AA | Not checked against the synchronized-media definition; our view: no live spoken audio from people on this screen; record the decision | `unverified` |
| 2.1.1 Keyboard, 2.1.2 No Keyboard Trap | A | Start, stop, retry, mute and every cue reachable and leavable by keyboard | `unverified (Codex knowledge)` |
| 4.1.2 Name, Role, Value; 1.4.11 Non-text Contrast | A; AA | Controls named with states (recording, muted); chart lines and focus ring meet contrast | `unverified (Codex knowledge)` |
| Non-visual result | n/a | The pitch result must be readable as text, not only as a chart | our design rule |

- Applicability notes are our judgement. Conformance needs a full audit; none has been run.
- Also unopened tonight: contrast 1.4.3, reflow 1.4.10, and the two rows marked `unverified (Codex knowledge)`. Check before any claim.
- One full take with TalkBack on the named phone. No test, no claim.

## 7. Five highest-value Saturday fixes (ordered by risk)
1. Status region: announce start, error and final feedback once; never per pitch point.
2. Named, visible Start, Stop, Retry and Mute buttons with focus rings; keyboard reachable; sticky bars never cover focus.
3. Learner-paced: start when ready, feedback stays until dismissed; no auto-advance timers.
4. Text, arrows and dashed or solid lines with every colour cue; a still-chart switch.
5. Generous touch targets (24 px minimum, 44 px aim); one TalkBack take on the phone.

## 8. Plain language: three fixes, two reading levels
| Fix | Simpler | Young adult beginner |
|---|---|---|
| Flat high note | "That high note sounded low. Try singing it a little higher." | "Your high note was below the target. Aim a little higher next time." |
| Late start | "You started after the beat. Start on the first click." | "Your entry was late. Start on the first click." |
| Uneven rhythm | "The notes were not evenly spaced. Leave the same gap between each one." | "Your note spacing varied. Aim for an even gap between notes." |

- Rule: describe the current take, then one action. Add "this time it reached the note" only when the app compared two takes.
- "Click" must match what the learner hears; change to "first beat" if the count-in is not clicks.
- Two-minute read-and-act test, per person.
  o Show one cue on a mock screen, no explanation. Ask: what would you do? Then do it.
  o Watch the first action, ask what confused them, write down the words they used; revise any cue that caused hesitation.
  o Five readers per group; pass = four of five act correctly first time (our proposal). It tests understanding, not a reading grade or accessibility.
- Flesch-Kincaid is a floor check only; our naive count put every cue at grade 0 to 2 and could not tell the versions apart (v0).

## 9. Claims not to make on stage
| Do not say | Why | What would earn it |
|---|---|---|
| "It meets WCAG 2.2 AA" or "fully accessible" | Partial checks only | Named audit plus assistive-technology test |
| "Works on any cheap Android" | No phone tested; one assumed class | Pass on named phones, three runs each |
| "Uses no mobile data" | Update checks and hand-off use data | Say "built to run offline after a full download"; measure a week |
| "Accurately detects pitch or timing" | Phone latency and noise unmeasured; the stage runs on MIDI, not the mic | Phone test with logged error against known notes |
| "Never loses your work" | Eviction or the user can delete everything [6] | Say "saved on this device"; eviction test |
| "Audio never leaves the phone" | A teacher share is a path | Use the privacy sentence: audio stays on the phone unless you share a clip |
| "Works for regional or remote learners" | Gap is real; nothing tested in low signal | Regional pilot |
| "Helps learners with disability, or children as well as adults" | No such participants tested | Tested with those users, with consent |

- Stage consequence: the live demo is MIDI plus synth on a laptop. Do not say the app "listens" on stage unless the phone mic proof has passed.

## Method
- Codex 1 (earlier tonight, orchestrator, gpt-6-sol high, no web): the critique in the input file. Every row of section 1 is a lead, not a fact.
- Opened tonight: [1]-[20] listed under Sources. Not re-opened: v0's [13a][13b] and carrier pages.
- No searches were run for private names; queries and prompts contained no team material.
- Own arithmetic: asset totals, install cost, test steps.
- Codex 2 (gpt-6-sol, medium, no names, no web): critique of this file. Kept: source-number fixes, release-specific URLs, dedupe and timeout, launch-check limit, interruption tests, 1.4.2 trigger, fallback tracker offline, keyboard/names/contrast rows (marked `unverified`). Not folded: its 2.2.2 and 1.2.4 doubts, recorded as judgement or `unverified` rows. Its "overstates re-checked" point is right for items marked `unverified` in the ledger.

## Open questions
- Which exact 2 GB phone is the named test phone, and who holds it Monday?
- Does the count-in use clicks or beats, so the cue wording matches?
- Can the app compare two takes, so "reached the target" is a measured claim?
- Is Tone.js (size unverified) worth its bytes versus raw oscillators?
- Who runs TalkBack, and is a screen-reader user among the nine students?
- Pass mark for the read-and-act test: is four of five enough?
- Which of 2.2.1, 1.4.2 and 2.2.2 does the team treat as applicable versus essential?

## Sources
1. Google Chrome Help, Chrome system requirements, https://support.google.com/chrome/answer/16737843?hl=en-GB, 2026-11-06, opened ("Android 10 and up"; no RAM line).
2. MDN, WebAssembly, https://developer.mozilla.org/en-US/docs/WebAssembly, 2026-11-06, opened ("near-native performance", no numbers or support dates).
3. MDN, WebAssembly.instantiate(), https://developer.mozilla.org/en-US/docs/WebAssembly/Reference/JavaScript_interface/instantiate_static, 2026-11-06, opened (Baseline widely available since October 2017).
4. MDN, AudioWorklet, https://developer.mozilla.org/en-US/docs/Web/API/AudioWorklet, 2026-11-06, opened.
5. web.dev, Offline data, https://web.dev/learn/pwa/offline-data/, 2026-11-06, opened (persist, 60% and 80% limits).
6. MDN, Storage quotas and eviction criteria, https://developer.mozilla.org/en-US/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria, 2026-11-06, opened (best-effort, LRU, all-or-nothing).
7. Chrome for Developers, Service worker lifecycle, https://developer.chrome.com/docs/workbox/service-worker-lifecycle, 2026-11-06, opened.
8. W3C, SC 2.2.1 Timing Adjustable, https://www.w3.org/WAI/WCAG22/Understanding/timing-adjustable.html, 2026-11-06, opened (Level A).
9. W3C, SC 4.1.3 Status Messages, https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html, 2026-11-06, opened (AA).
10. W3C, SC 1.4.1 Use of Color, https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html, 2026-11-06, opened (A).
11. W3C, SC 2.5.8 Target Size (Minimum), https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html, 2026-11-06, opened (AA).
12. W3C, SC 2.3.3 Animation from Interactions, https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html, 2026-11-06, opened (AAA).
13. W3C, What's new in WCAG 2.2, https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/, opened in v0 2026-11-06 (2.5.7 AA); not re-opened.
   - 13a. W3C, SC 1.2.2 Captions (Prerecorded), https://www.w3.org/WAI/WCAG22/Understanding/captions-prerecorded.html, opened in v0.
   - 13b. W3C, SC 1.2.1, https://www.w3.org/WAI/WCAG22/Understanding/audio-only-and-video-only-prerecorded.html, opened in v0.
14. W3C, SC 1.4.2 Audio Control, https://www.w3.org/WAI/WCAG22/Understanding/audio-control.html, 2026-11-06, opened (A).
15. MDN, MediaDevices.getUserMedia(), https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia, 2026-11-06, opened.
16. Google Chrome Help, site permissions on Android, https://support.google.com/chrome/answer/2693767?hl=en&co=GENIE.Platform%3DAndroid, 2026-11-06, opened (microphone allow and block).
17. MDN, Media Capture constraints, https://developer.mozilla.org/en-US/docs/Web/API/Media_Capture_and_Streams_API/Constraints, 2026-11-06, opened.
18. W3C, SC 2.2.2 Pause, Stop, Hide, https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html, 2026-11-06, opened (A).
19. W3C, SC 2.4.7 Focus Visible, https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html, 2026-11-06, opened (AA).
20. W3C, SC 2.4.11 Focus Not Obscured (Minimum), https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html, 2026-11-06, opened (AA).
- Also relied on in-folder files: tech-pitch-detection.md, tech-keyboard-input.md, build-plan-v1.md, demo-instrument-decision.md, privacy-design-v1.md s6, accessibility-design-v0.md.
21. MDN, Background Synchronization API, https://developer.mozilla.org/en-US/docs/Web/API/Background_Synchronization_API, 2026-11-06, opened ("Limited availability"; support table did not load).
