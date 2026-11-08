# Accessibility and low-end design v0: a practice coach that works on a cheap phone, offline

- Date: 6 Nov 2026 (AEDT). Purpose: low-end Android, data cost, offline-first and plain-language design for the practice coach.
- Scope: device floor, asset budget, data cost, offline behaviour, WCAG 2.2 AA items, two reading levels, demo age group, claims to hold back.
- Status: overnight draft for the team; verify before the pitch. Source numbers in [brackets] point to `## Sources`. Planning figures are labelled; none is a measured result.

## 1. Recommendation (conclusion first)
- Design for a 2 GB RAM Android phone on Chrome (Android 10 or later) costing about A$135 to A$180, and test on one.
  o "Low-end" in this file means that class. It is our working definition, not an industry standard.
- Target a 5 MB precache (a target until the build is measured), rules-based pitch and timing, no model needed to run it.
- Target zero practice traffic after install (update checks and hand-off excepted); install costs about one to three cents of a plan's allowance.
- Biggest technical risk is not storage: it is pitch and timing accuracy on this phone (mic latency, room noise, the app's own cue sounds leaking into the mic). Test it before any accessibility claim.
- Demo language: young adult beginner (section 7). Teen and Year 5 versions are written below so the choice stays open until Sunday.
- Do not say "accessible", "meets WCAG" or "works offline everywhere" on stage (section 8).

## 2. Low-end Android in 2026 and what it implies
| Item | Finding | Src |
|---|---|---|
| Android floor | Current Chrome on Android runs on Android 10 and up. Phones older than that cannot run a current Chrome, so they are out of scope | [1] |
| Example cheap phone | Moto E15: 2 GB RAM, 64 GB, Android 14 Go, MediaTek Helio G81 Extreme, A$135 listed as an "expected" price by an aggregator, released Jan 2025 | [2] |
| Price band | Galaxy A05 4 GB/64 GB around A$162 on a comparison site (updated 13 May 2026); Moto g15 about A$177 to A$178 at two retailers. Both from search snippets, not retailer pages | [3] |
| Band to plan on | About A$135 to A$180. Check live retailer pages on the day; two of three prices here are snippets | [2][3] |
| Android Go RAM rule | Go edition targets low-RAM phones; the exact threshold was not confirmed. `unverified (Codex knowledge)` | none |
| Web Audio | AudioWorklet (custom audio code on its own thread) is "widely available" since April 2021, but only on HTTPS or localhost | [4] |

- What it implies for the build (our reasoning, to be confirmed on the phone).
  o Web Audio: start the audio context after a tap; run pitch and onset in an AudioWorklet and send only small results to the screen.
  o WebAssembly: use only if profiling shows a gain; a plain-JavaScript tracker is the safer first path on a 2 GB phone.
  o Models: skip for the loop. If one is added later, size alone is not the test: measure memory and delay on the 2 GB phone (TensorFlow.js memory guidance, not opened this run, `unverified (Codex knowledge)`).
  o The limit that bites a cheap phone is RAM and start-up time, not storage: Chromium allows an origin up to 60% of disk [5].
  o Check "RAM" on the box: some listings add virtual RAM from storage (reviewer note in a search result, snippet).

## 3. Offline asset budget
| Part | Planning target (MB) |
|---|---|
| App JavaScript | 1.5 |
| WebAssembly (only if used) | 0.5 |
| Optional small model | 1.0 |
| Audio (short synthesised tones, cue sounds) | 0.5 |
| HTML, CSS, icons, fonts | 1.5 |
| Total precache | 5 |

- Why 5 MB: our arithmetic, not a device limit.
  o At 1 Mbps (a weak regional link, assumed) 5 MB takes about 40 seconds; at 10 MB, 80 seconds, which we hypothesise is where an install gets abandoned (no evidence).
  o At 5 MB the install costs about one to three cents (section 4).
  o Synthesised tones and text cues rather than sample libraries keep audio near 0.5 MB; the build plan already targets under 5 MB, itself `unverified (Codex knowledge)`.
- Rule: measure the built app on Monday; if over 5 MB, cut the optional model first, then fonts.

## 4. Data cost (Australian prepaid)
| Plan (Boost, Telstra network, from 5 May 2026) | Price | Data | A$ per GB |
|---|---|---|---|
| 7-day | A$14 | 6 GB | 2.33 |
| 28-day | A$28 | 8 GB | 3.50 |
| 28-day | A$39 | 30 GB | 1.30 |
| Add-on pack, 7 days | A$5 | 1 GB | 5.00 |
| Add-on pack, 28 days | A$20 | 4 GB | 5.00 |

- Source: carrier critical information summary [6] (plan lines and data packs read from the PDF text); the plan table is cross-checked against [7]. One carrier only; other carriers not checked.
- Cost of one install (5 MB, 0.005 GB, our arithmetic): A$0.007 at A$1.30/GB, up to A$0.025 at the A$5 add-on rate.
- Cost of one week of use after install: 0 MB of practice traffic, so A$0, if every rule below holds.
  o Real small leftovers: the service-worker update check and any teacher hand-off. A 100 KB report would cost under A$0.001; size is our guess, `unverified`.
- Rules to keep it near zero after install:
  o Precache everything the loop needs once; show the download size before downloading on mobile data; offer "wait for Wi-Fi".
  o No fonts, analytics, streaming cues or silent updates on mobile data; no audio upload unless the learner sends it.
  o Updates: compact and versioned, applied only when the learner agrees on mobile data.

## 5. Offline-first behaviour (aligned with privacy-design-v0.md, not repeated)
- What is cached: app shell, lesson and cue text, tones, pitch code, any model, before the app says "Ready offline".
  o On every launch check the assets still exist: browsers may evict storage after inactivity or pressure; ask `navigator.storage.persist()` but never promise it [5].
- First run with no network and no cache: impossible to download, so the app must say so plainly and name what is missing (a PWA cannot fetch itself).
  o Mitigation: install on Wi-Fi first (venue, school, library), test in airplane mode.
- Queued hand-off: "Send to teacher" saves the report in IndexedDB, shows "Waiting for connection", retries when the app is next open and online, shows "Sent" only after the server confirms.
  o Do not rely on Background Sync: MDN marks it limited availability, not Baseline [8].
- Honest indicator: "Practice audio and results stay on this phone unless you choose to send a teacher report. You can delete saved practice here." Show it on the take screen, not in a footer.

## 6. Accessibility items that matter most here
| Need | Design | WCAG 2.2 | Src |
|---|---|---|---|
| Screen reader, live line | Name the chart "Pitch during this take"; do not announce each point; after the take say "High note a little low; second try matched" | 4.1.3 Status Messages, AA | [9] |
| Screen reader, cue card | Heading "One thing to try next", then the fix, then the proof, in reading order; announce a new cue once | 4.1.3 AA | [9] |
| Colour-independent feedback | Words plus arrows plus line style (solid, dashed) alongside colour; W3C accepts a colour difference that also has a 3:1 lightness contrast as an extra cue | 1.4.1 Use of Color, A | [10] |
| Captions for spoken cues | Every spoken cue also shown as text; any cue video is captioned; audio-only cues are covered by 1.2.1's text alternative (1.2.2 is for synchronized media) | 1.2.2 Captions (Prerecorded), A; 1.2.1, A | [11][12] |
| On-screen keys | At least 24 by 24 CSS px at AA (spacing exception exists); aim 44 by 44 as design target; the second figure is a platform convention, see tech-keyboard-input.md | 2.5.8 Target Size (Minimum), AA | [2a] |
| Motor: no precise slides | Any slide or drag across keys needs a tap alternative | 2.5.7 Dragging Movements, AA (new in 2.2) | [13] |
| Reduced motion | Offer a still chart and honour the system setting; this is Level AAA, so it is good practice, not an AA requirement | 2.3.3, AAA | [14] |

- Also on the AA list but not opened this run, `unverified (Codex knowledge)`: contrast 1.4.3 and non-text contrast 1.4.11, reflow 1.4.10, visible and unobscured focus (2.4.7, 2.4.11), accessible names 4.1.2. Check each against the WCAG 2.2 text before claiming it.
- Offline test must include a phone restart and a cleared-cache case, not only airplane mode: if the browser evicts the app shell, the launch check cannot run.
- Test with a real screen reader (TalkBack on the 2 GB phone) for one full take. No test, no claim.

## 7. Plain language: the same three fixes, two ways
| Fix | Year 5 reader | Young adult beginner |
|---|---|---|
| Flat high note | "Your high note was a bit too low. Try it again, a little higher. This time it reached the note." | "The high note landed a little flat. Aim slightly higher on the next take. Your line reached the target this time." |
| Late start | "You came in after the beat. Start when you hear the first click. This time you did." | "You came in late. Start on the first click. Your next take began on the beat." |
| Uneven rhythm | "Some notes came too close together. Leave the same gap between each one. Your next try was steadier." | "The gaps between notes were uneven. Keep each gap the same length. Your next take was steadier." |

- Differences kept on purpose: concrete everyday words for Year 5; the musical word (flat, take, target) for the adult, never childish, never jargon (R6).
- Reading-level test, in this order:
  o Step 1, a quick score: the Flesch-Kincaid grade (word and syllable counts only). The Style Manual benchmark of about grade 7 or lower comes from secondary reports only [15].
  o Our rough count scored all six cues at grade 0 to 2, so the formula cannot tell the two versions apart. A score is a floor check, not proof [16].
  o Step 2, the real test: five readers per group read each cue aloud, say what to do, then do it unaided. Pass = four of five act correctly first time. Pass mark is our proposal.
  o Step 3, read every cue aloud once; if it sounds unnatural, simplify (state-agency advice, snippet [15]).

## 8. Demo age group: recommend young adult beginner
- Reasons.
  o Judges are adults; the pitch story is an adult beginner (evidence file) and they can judge that language without translation.
  o The buyer reaches school-age learners later through outreach (state-of-play section 5), so the pitch can say "same loop, language swapped" and mean it.
  o Adult needs less consent machinery on stage (privacy-design-v0.md covers under-18 rules); fewer questions for Q and A.
- If the team picks teenager: keep adult wording, shorten text, drop "beginner" framing, test with the nine students.
- If the team picks primary child: change more than words.
  o Year 5 cue set above; larger keys; a shorter session cap; guardian consent and school context; a teacher or parent in the loop.
  o Test the cues with children before saying they work. Nothing in this file tests a child.

## 9. Five claims not to make on stage without evidence
| Do not say | Why | What would earn it |
|---|---|---|
| "It meets WCAG 2.2 AA" or "it is fully accessible" | Only partial checks exist; conformance needs a full audit | Named audit plus assistive-technology test |
| "Works on any cheap Android phone" | One assumed class, none tested; Android 9 and older cannot run current Chrome [1] | Pass on named phones, three runs each |
| "Uses no mobile data" | Update checks and hand-off use some; not measured | Measured byte count over a week |
| "Works for regional or remote learners" | The connectivity gap is real (ADII 2025 via research-bank), but we have not tested in a low-signal setting | Pilot in a regional school or home |
| "Helps learners with disability, or is as effective for children as adults" | No disabled or child participants tested | Tested with those users, with consent |

## Method
- Codex 1 (gpt-6-sol, medium, run earlier tonight by the orchestrator, no web): knowledge draft. Kept the structure and the 5 MB budget idea; every figure re-checked or labelled; dropped its A$39/30 GB to A$28/8 GB "per GB" framing in favour of a per-plan table.
- Opened: Chrome help [1], MobGadgets E15 [2], MDN AudioWorklet [4], web.dev storage [5], carrier PDF [6] (text extracted locally with pdftotext), WhistleOut plan table [7], MDN Background Sync [8], four W3C Understanding pages and the WCAG 2.2 "what's new" page [9]-[14].
- Snippet only: phone price comparison [3], Style Manual readability reports and Flesch-Kincaid limits [15][16].
- Failed (403/404/429/timeout): Opel, JB Hi-Fi, Optus, Boost plan page, BuyMobile, Officeworks, PriceMe, Style Manual page, Android Go page (no RAM rule on it).
- Own arithmetic: install cost, 40-second download, Flesch-Kincaid counts (naive syllable counter, rough).
- Codex 2 (gpt-6-sol, medium): critique of the file body. Kept: soften headline claims to targets; add pitch-accuracy risk; add restart and cleared-cache tests; clarify 1.2.1 versus 1.2.2 and the 3:1 wording; label the abandonment point a hypothesis. Noted but not changed: the 1 to 3 cent figure is a plan-allowance share, already labelled; feedback lines like "steadier" need the app to compare takes, added to open questions. Its "empty Method" point came from the excerpt it was sent.

## Open questions
- Which age group does the team choose on Sunday? This file recommends young adult beginner.
- Which exact 2 GB phone will the team buy or borrow for testing, and what does its retailer page show today?
- Does the 5 MB precache hold once the build exists (measure Monday)?
- Is the Android Go RAM threshold needed on stage? If so, source it from Google.
- Who tests with TalkBack, and is there a screen-reader user in the nine students?
- Can the app prove "steadier" or "reached the target" between takes? Cue text must only claim what it measured.
- Reading test pass mark (four of five): is that enough for the team?

## Sources
1. Google Chrome Help, system requirements for Chrome on Android, https://support.google.com/chrome/answer/95346?co=GENIE.Platform%3DAndroid&hl=en-UK, accessed 2026-11-06, opened ("Android 10 and up").
2. MobGadgets, Motorola Moto E15 in Australia, https://mobgadgets.com/gadget/au/motorola-moto-e15, accessed 2026-11-06, opened (A$135 "expected retail price"; 2 GB; Android 14 Go; Helio G81 Extreme).
   - 2a. W3C, Understanding SC 2.5.8 Target Size (Minimum), https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html, accessed 2026-11-06, opened (AA; 24 by 24 CSS px; exceptions).
3. Web search results for Galaxy A05 and Moto g15 Australian prices (BuyWisely, PriceMe listings), searched 2026-11-06, snippet only (A05 4/64 about A$162.61 as of 13 May 2026; g15 Officeworks A$177, Harvey Norman A$178).
4. MDN, AudioWorklet, https://developer.mozilla.org/en-US/docs/Web/API/AudioWorklet, accessed 2026-11-06, opened.
5. web.dev, Offline data (storage, eviction, persist), https://web.dev/learn/pwa/offline-data, accessed 2026-11-06, opened.
6. Boost Mobile Prepaid Critical Information Summary (effective 5 May 2026), https://www.telstra.com.au/content/dam/tcom/help/critical-information-summaries/personal/boost/pre-paid/Boost%20Mobile%20Prepaid%20%28from%205%20May%29.pdf, accessed 2026-11-06, opened (pdftotext).
7. WhistleOut, Boost Mobile plan price increase 2026, https://www.whistleout.com.au/MobilePhones/News/Boost-Mobile-plan-price-increase-2026, accessed 2026-11-06, opened.
8. MDN, Background Synchronization API, https://developer.mozilla.org/en-US/docs/Web/API/Background_Synchronization_API, accessed 2026-11-06, opened ("Limited availability").
9. W3C, Understanding SC 4.1.3 Status Messages, https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html, accessed 2026-11-06, opened (AA).
10. W3C, Understanding SC 1.4.1 Use of Color, https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html, accessed 2026-11-06, opened (A).
11. W3C, Understanding SC 1.2.2 Captions (Prerecorded), https://www.w3.org/WAI/WCAG22/Understanding/captions-prerecorded.html, accessed 2026-11-06, opened (A).
12. W3C, Understanding SC 1.2.1 Audio-only and Video-only (Prerecorded), https://www.w3.org/WAI/WCAG22/Understanding/audio-only-and-video-only-prerecorded.html, accessed 2026-11-06, opened (A).
13. W3C, What's new in WCAG 2.2, https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/, accessed 2026-11-06, opened (2.5.7 and 2.5.8 are AA).
14. W3C, Understanding SC 2.3.3 Animation from Interactions, https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html, accessed 2026-11-06, opened (AAA).
15. Search results on Australian Style Manual readability (grade 7 or lower benchmark, secondary reports; stylemanual.gov.au page itself not opened), searched 2026-11-06, snippet only.
16. Search results on Flesch-Kincaid limits (Jindal and MacDermid 2017; Tanprasert and Kauchak 2021, ACL GEM workshop), searched 2026-11-06, snippet only.
- ADII 2025 figures: cited via research-bank.md (verified there), not re-opened.
