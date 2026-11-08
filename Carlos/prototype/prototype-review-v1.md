# Prototype review v1: prototype-skeleton.html before Saturday 09:00

- Date: Fri 6 Nov 2026, 23:10 AEDT. The reviewer did not write the prototype and read it fresh.
- Purpose: an independent check of the keyboard-path skeleton (T9) before the team builds on it Saturday.
- Scope: prototype-skeleton.html (79,590 B, 970 lines) checked against take-data-contract.md, small-goals-engine-spec-v1.md, pitch-v2.md s1, build-plan-v1.md s8 and freeze-and-rehearsal-playbook-v1.md.
- Status: overnight draft for the team; verify before the pitch.
- Bottom line: the scoring core is sound. Self-test 22 of 22 reproduced; the network and storage claims hold in code.
  o Biggest stage risk: the planned cue K3 ("you speed up") is fragile. A real Saturday take 1 will often score X2, K5 or "none".
  o Second: the stage chrome is unfinished. Judges would see dev controls, "Placeholder" text, "No rule found", "missed" and "ms" text, and a dead share button.
  o Fix both Saturday morning (about 3 h, section 6). Neither one blocks the CHECKPOINT A minimum pass.

## 1. What was run
| # | Command (scratch folder mt/proto-review) | Result |
|---|---|---|
| 1 | `node extract.js "<folder>/prototype-skeleton.html"` | PURE-BEGIN to PURE-END block found at html lines 194 to 638; 38,333 B written to pure.js with a module.exports line added |
| 2 | `node -e "const m=require('./pure.js'); const r=m.runSelfTest(); ..."` (Node v24.17.0) | **Self-test: 22 pass, 0 fail** (F01 to F16, three phrases, three stored take 1s: ode K3 4 of 8, twinkle K1, ode 5-8 K1) |
| 3 | `node fixtures.js` | Three adversarial fixtures plus rush and noise sweeps (section 2) |
| 4 | `node verify-codex.js` | All 7 Codex points reproduced (section 5, rows D12 to D14) |
| 5 | Same extract.js scan over the whole html for 33 network and storage patterns | Code has no hits; the only hits are inside the README comment (section 4) |
- Not run: a real browser, a MIDI keyboard or audio timing. The browser claims rest on the README's headless Edge run, which was not repeated here.

## 2. Fixture results
- Stage set-up: Ode bars 1-2 at 80 bpm (beat 750 ms, W = 375 ms), MIDI input, velocity 80.

| Fixture | Cue given | On the beat | Matches the contract rule table? |
|---|---|---|---|
| A1: every note +200 ms, exactly uniform | M2 "Every note is shifted the same amount: likely the phone's delay, not you" / "Tap along once..."; counts false | 0 of 8 | Yes: M2 is read symmetrically, row 2 (contract s3). But no tap-along exists in the build |
| A2: every note +200 ms with human jitter of -45 to +45 (spread 36) | **none**, "No rule found one thing to fix on this take" | 0 of 8 | Yes for v1.1 (no keys timing rule). No for the K7 proposal (contract s8.1), which needs on-time share of at least 0.8 for a pass |
| A3: +200 ms uniform on Twinkle bars 3-4 at 60 bpm | M2 (K5 also fired, outranked) | 0 of 7 | Yes |
| B: last note missing, rest clean | X2 "You skipped a note"; key D4 lit | 7 of 8 | Yes (tier 3; a pass needs missed_count 0) |
| C: octave up throughout (+12, clean timing) | X1 "right note in a different octave" (K1 and K2 also fired, outranked) | **8 of 8** | Yes: X1 outranks K1 and K2 (contract s3 row 4) |
| C2: same, input "screen" | X1, identical | 8 of 8 | Yes (input is invisible to the scorer, rule 8) |

- Findings from the fixtures:
  o C: a retake played an octave up shows "On the beat: 4 of 8 → 8 of 8", because onBeatCount (line 320) counts "wrong" rows.
  o C: those bars also fall off the live line. Its pitch range is the phrase ±2 semitones (line 908), so E5 to G5 draw above the canvas.
  o A2 is the realistic late player. The proof card reads "Not yet..." and then "No rule found one thing to fix", which contradict each other on screen.
- Rush and noise sweeps (Node; these probe the planned stage cue K3):

| Take | Cue |
|---|---|
| Uniform rush from beat zero, 5% / 7% | none / none (4 or 5 of 8 on the beat) |
| Uniform rush 8% / 10% | X2 / X2 (confirms contract s8.2) |
| Rush only from note 5, 8% to 20% | none every time (tempo_played 82.6 to 86.2, under 88) |
| Stored placeholder take 1 with ±25 ms noise per onset, 2000 trials | K3 887 (44%), X2 763 (38%), K5 350 (18%) |
- Reading: K3 fires only when the first note is late and the rest rush. The placeholder was built to do that. An honest captured take will often not.

## 3. Stage flow against pitch-v2
| Pitch beat (clock) | Pitch expects | Prototype shows (line) | Gap |
|---|---|---|---|
| 0:39 "Watch." | App full screen, goal card | Header with Phrase select, orange chip "Phrase choice: OPEN", Tempo, Connect MIDI, Self-test, Reset (125); debug line (190); Self-test box (191) | No stage mode; dev controls are on screen |
| 0:39-0:49 goal | Typed goal "play this song for Mum"; small goal "[PHRASE], steady"; **two progress lines**; plan only if a real saved answer exists, labelled "Example output, recorded [date]" | Small goal "the first phrase, steady" (139); dashed box "EXAMPLE OUTPUT (static text...)" with "Placeholder wording written by hand" (140); no progress lines | Wording clashes with the spoken "one phrase"; placeholder plan visible; progress lines missing; Reset clears the typed goal (936) |
| 0:49-0:59 replay | Banner "TAKE 1 - REPLAY: recorded Saturday, scored now"; played bars drift ahead | "REPLAY: Take 1, recorded Saturday, scored now" (146) plus note "placeholder take built by hand" (147); purple bars drift ahead | Wording order differs; the placeholder note must go. Replay runs about 10.5 s in a 10 s slot (0.25 s lead + 3 s count-in + 6.75 s take + 0.55 s tail) |
| 0:59-1:06 one fix | Card "You speed up as you play. Let the click lead."; "On the beat: x of N" visible | Cause and cue big, but cue is "Let the click lead; stay with it to the end." (432); the count sits in a 14 px muted line (154) | Spoken cue does not match the card (Sunday sheet B9); count unreadable at 10 m |
| 1:06-1:20 live | Label "Live now"; count-in; lit keys; on-screen keys fallback | Banner "Live now. Watch the on-beat count." (159), matches; live count; letters A to K and on-screen keys always on | Matches. Operator must click Start by about 1:08 to clear the 1:12 cut point |
| 1:20-1:28 proof | "On the beat: x of N, then y of N"; if no gain, "Not yet. Same one fix, slower click. One thing until it works." | "On the beat: 4 of 8 → y of 8", a duplicate metric line, then "This take's own cue: ... (miss 2)" or, on a clean retake, "No rule found one thing to fix on this take." (863); per-note table with "missed", "+125 ms", "late" (869 to 875) | Banned copy words ("missed", "late", units; engine spec s10); "No rule found" reads as failure on a success |
| 1:28-1:39 hand-off | Banner "Separate example: a learner still stuck (sample week, scripted)"; "Learner 12"; Justin taps share; Webex screenshot labelled "Proposed: Webex hand-off (mock)" | Banner and Learner 12 match; "Proposed: Webex hand-off (mock)" is plain text (183); share button **disabled** (185); no screenshot | The tap does nothing on stage |
- What a judge sees at each 15 s mark:
  o 0:45: goal card under a busy header; the orange "OPEN" chip and a dashed "Placeholder" box.
  o 1:00: the one-fix card has just replaced the replay; the REPLAY banner stays above it; the count is in small grey text.
  o 1:15: "Live now" banner, a rising "On the beat so far" count, blue bars and lit keys. This part works as scripted.
  o 1:30: the hand-off card and a greyed-out share button; no Webex screen.
  o 1:45: slides.

## 4. Privacy and network check
| Claim (README lines 59 to 64) | Code check | Verdict |
|---|---|---|
| No fetch, XHR, WebSocket, external script, font or image | No fetch(, XMLHttpRequest, WebSocket, EventSource, sendBeacon, src=, href=, link, img, @import, url( in code. Hits at lines 21, 63 are README text only | Holds |
| CSP blocks connections | Meta CSP: default-src 'none'; script-src and style-src 'unsafe-inline'; img-src data:; connect-src 'none'; base-uri and form-action 'none' | Holds for fetch, XHR and sockets; img-src data: lets a Webex screenshot be inlined without loosening it |
| No audio stored, no mic | No getUserMedia; notes held as numbers in S.rec | Holds |
| No storage | No localStorage, sessionStorage, indexedDB, cookie, caches or service worker in code (hits at 28, 66 are README text) | Holds |
| Typed goal never sent | Textarea (138) has no spellcheck="false". Chrome Enhanced Spell Check, if switched on in the stage profile, sends text typed in text boxes to Google [2] | **Gap, outside the page's code**: add spellcheck="false" autocomplete="off"; check the stage profile |
| No names | Only "Learner 12" and a placeholder "Mum" | Holds |
- Note: the meta CSP cannot stop the browser's own services (spell check, sync, translate). "Nothing leaves the page" is true of the page's code only.

## 5. Defects by stage risk
| # | Defect (line) | Fix | Min | Blocks A? |
|---|---|---|---|---|
| D1 | Planned cue K3 is fragile (462, 622): 44% of noisy placeholder variants give K3; real rushes give X2 or none | Saturday: record 5 or more take 1s and keep one that scores K3 in this code, with no hand edits. Else switch the scripted cue to whatever the capture gives (K1 is robust) and edit the spoken line. Drift-aware matcher (contract s8.2) only if time allows | 30 (capture and pick); 90 to 120 for the matcher (unverified) | No (blocks C and T10) |
| D2 | No stage mode: header controls, OPEN chip, debug, Self-test visible (125, 190, 191) | `#stage` hash hides them; keep a small sound and MIDI status dot | 20 | No |
| D3 | Proof card copy: "No rule found..." on success; "(miss n)"; per-note table with "missed", "late", "ms" (439, 863, 869 to 875) | In stage mode, show only "On the beat: x of N, then y of N" plus the pitch's "Not yet..." line; move the table to debug; pass text "Steady. Next time a little harder." | 25 | No |
| D4 | Spoken cue does not match card: "stay with it to the end" (432) | One wording in both places (Simone's copy.json) | 5 | No |
| D5 | "On the beat: x of N" on the one-fix card is 14 px muted (154) | Big line "On the beat: x of N" | 10 | No |
| D6 | Share button disabled; no Webex screenshot (183, 185) | Enable the button so it reveals an inlined data: image or a mock panel with the corner label "Proposed: Webex hand-off (mock)" | 30 | No |
| D7 | Goal card: "the first phrase"; placeholder plan box; no progress lines (139, 140) | Small goal "[PHRASE], steady"; hide the plan box unless a real saved answer exists; add two static progress lines (T16 later) | 30 | No |
| D8 | M1 and M2 wording says "phone"; M2 asks for a tap-along that does not exist (421, 422) | Keys M1 text from engine spec s10 ("No keys came through. Check the cable, then press any key."); M2 on keys: "Timing looks shifted; check the sound output" until a tap calibration exists | 15 | No |
| D9 | Keyboard dies mid-retake: the first notes are missed, so the cue is X2 and the proof card says "Not yet" plus "You skipped a note" | Add a one-key restart (for example Escape = abort and re-arm the count-in), drilled as P5 row 1 | 15 | No |
| D10 | Reset clears the typed goal and leaves the tempo as it was (936); no panic key on the laptop keyboard | Reset re-seeds the stage goal and 80 bpm; Escape releases all notes (P3.7 reset in 10 s or less) | 10 | No |
| D11 | Wrong keys count as "on the beat" (320); octave-up bars drawn off canvas (908) | Count "hit" only for the stage count (team call: the K7 proposal counts "wrong"); widen the roll range to the played notes | 15 | No |
| D12 | Rule thresholds compare rounded values: spread 29.76 rounds to 30, so M2 misses it (315); tempo 87.995 rounds to 88.0, so K3 fires (303); K6 at exactly +40% misses on float error | Keep raw values for rule tests; round for display only | 15 | No |
| D13 | K4 reading includes the wrong note in the "later and later" run (464); the tech table is ambiguous | Team call; low stage risk | 5 | No |
| D14 | takeCounts ignores an incoming counts false; the K6 proof says "yes" at the firing boundary (539) | Gate the ladder on take.counts; make the proof the inverse of the trigger | 10 | No |
| D15 | Retake slot tight: replay about 10.5 s in a 10 s slot | Two-beat count-in for the replay only, or start the replay on "Take one," | 5 | No |
- CHECKPOINT A minimum pass (one on-screen take with count-in, scored) already exists in this file. None of D1 to D15 blocks it.
- D1 blocks CHECKPOINT C's "each capture fires its planned rule" (T10, 13:00).

## 6. Saturday fix order
| Slot | Task | Who (proposal) | Done when |
|---|---|---|---|
| 09:00-09:30 | T1 rig check with this file served from localhost (not file://, whose MIDI permission behaviour is unverified); confirm the self-test shows 22 of 22 on the stage laptop | Carlos | Real note numbers light keys; self-test 22 of 22 |
| 09:30-10:00 | D1 part 1: record 5 or more take 1s on the real keyboard; read the cue each gets in the debug line | Justin plays; Carlos | One capture gives the planned cue with no edits, or the team switches the cue and the spoken line |
| 10:00-10:20 | D2 stage mode | Carlos | Full screen shows only cards, roll and keys |
| 10:20-10:45 | D3 plus D5 proof and one-fix copy | Carlos with Simone's wording | Card reads exactly the pitch lines |
| 10:45-11:00 | D4, D7, D8 copy fixes | Simone (text), Carlos (paste) | No banned words on screen (engine spec s10 list) |
| 11:00-11:30 | D6 share reveals the mock Webex screen | Simone | Tap shows the labelled screen |
| 11:30-11:45 | D9 plus D10 restart and reset | Carlos | Reset to replay-ready in 10 s or less, timed twice |
| 11:45-12:00 | Re-run self-test plus a timed 60 s arc | All | 22 of 22; arc inside 60 s |
- Cut rule: at 11:30, anything not started goes to the fix list. Keep the order D1 > D2 > D3 > D6 > D4 > D5 > D7 > the rest.
  o D11 to D15 wait until after CHECKPOINT B.
  o The drift-aware matcher is not Saturday morning work.

## Second review, 7 Nov (Astra, verified)
- The skeleton changed after sections 1 to 6 were written. It is now 84,682 B, saved 23:17; sections 1 to 6 cite the older 79,590 B lines.
  o Re-extracted pure block: html lines 217 to 684. Self-test still shows **22 pass, 0 fail** (Node v24.17.0).
  o Already fixed in the new file: D3 pass copy (now "Step 1 done."), D7 plan box (hidden), D8 M2 wording ("sound set-up"), D11 count (onBeatCount line 345 counts "hit" only), D12 raw tempo and level (rawTempo, rawLevelRise).
  o Still true on the new file: D1. The placeholder K3 holds in 797 of 2000 noisy trials (40%); its last onset sits 5 ms inside W.
- Astra (GPT-6 Astra, high) reviewed the new file. Every function it names exists in the file, so no claim is rejected on that ground.

| # | Claimed defect | Where (confirmed in file) | Reproduced? (Node, astra.js) | Verdict | Saturday task |
|---|---|---|---|---|---|
| A1 | Steady rush loses note identity; X2 outranks K3 | matchTake, PRECEDENCE | Yes: Ode played at 90 vs 80 gives X2, 2 of 8 on the beat, 1 missed, 1 extra | Confirmed (same as D1) | Sequence fallback in matchTake: exactly 8 notes in the exact pitch order, plausible tempo; keep errors on the 80 bpm grid; new fixture |
| A2 | One wrong middle key passes ("Step 1 done") | firedRules, pickRule, RULES.none | Yes: F#4 for G4 at note 4 gives none, 7 of 8 | Confirmed, high stage risk | A pass also needs zero wrong keys (contract v1.2) |
| A3 | K7 absent; scattered late notes pass | RULES, PRECEDENCE | Yes: +200 ms on notes 2, 4 and 6 gives none, 5 of 8 | Confirmed (contract s8.1) | Build K7 plus F17 as in contract s8.1 |
| A4 | M2 diagnosed from one matched note | firedRules (M2) | Yes: a lone opening E at +200 gives M2 over X2 with 7 missed | Confirmed | M2 needs most notes matched (share is a team number, unverified) |
| A5 | Extra notes have no consequence | firedRules, pickRule | Yes: a perfect take plus an extra C gives none, extra 1 | Confirmed, team call | A pass needs extra_count 0, or tolerate one stray (decide) |
| A6 | validatePhrase accepts overlaps; a null row throws | validatePhrase | Yes: durations 2 then 1 give no error; notes:[null] throws | Confirmed, low risk (phrases are fixed data) | Check that the previous note ends before the next starts; guard row objects |
| A7 | validateTake checks features against themselves, not the take; Plan unchecked | validateTake | Partly: plan {} accepted. A relabelled row was caught only because the summary was left inconsistent | Confirmed by design (contract s4 lists both as not checked) | None for Saturday |
| A8 | K6 proof says "yes" with no evidence | proofCount (K6), rawLevelRise | Yes: K6 baseline, then a one-note retake gives proof_after "yes" | Confirmed, low risk | Return "no" unless two levels exist |
| A9 | Third-miss flag computed but hidden; hand-off is scripted | buildCue, scoreAndShowRetake | Flag yes (ceiling true at the third K3, Node); what the screen shows was not checked in a browser | Confirmed in part; scripted card is the pitch design | Show the hand-off button when ceiling is true (after CHECKPOINT B) |
| A10 | Excluded set-up takes still get a before and after count | scoreAndShowRetake | Yes: a +200 ms uniform retake gives M2 with counts false, but the card shows "4 of 8 → 0 of 8" | Confirmed | Hide the count pair when counts is false |
| A11 | "22 pass" includes 6 stage checks; nothing proves the browser works | runSelfTest, FIXTURES | Yes: 16 fixtures plus 3 phrases plus 3 stored takes | Cosmetic, true | Add A1 to A5 as regression fixtures |
| A12 | Placeholder banner lacks the word REPLAY | BANNER_PLACEHOLDER (line 694) | Read | Cosmetic | Wording only |
| A13 | Empty take labelled midi when midiAccess exists | finishLive | Read | Cosmetic (the contract pairs either input) | None |
| A14 | Every MIDI input enabled; two ports merge | bindMidi | Read: binds every connected input | Confirmed by reading | Select one input; abort the take on its disconnect |
| A15 | Pedal is global; unplug while pedalled leaves voices sustained | onMidi, releaseAll | Read: with a prefix, sustained voices are not cleared | Confirmed by reading | Scope the pedal per source; clear on disconnect |
| A16 | Events delayed over 1 s get handler time | evMs (line 747) | Read | Confirmed by reading | Drop stale events |
| A17 | Fallback clock subtracts output latency only; playhead also subtracts base | sampleAnchor, audibleNowS | Read | Confirmed; playhead only | Test on the stage laptop (open question in the README) |
| A18 | Audio start failure sits outside the MIDI try | connectMidi | Read: await audioOn() comes before try | Confirmed by reading | Wrap it in the try |

- Five stage guards accepted (all browser code; cheapest first):
  o 1. Hear the real HDMI or wired output before starting; abort and re-anchor on an output change.
  o 2. Blur and visibilitychange abort active and pending runs (blur, line 802, only releases notes).
  o 3. Cancel a deferred note-on if release, reset or disconnect lands while audio is starting.
  o 4. One playback lock: Hear the phrase cannot overlap the replay or the count-in.
  o 5. Abort a take after a long frame gap or a clock jump; never score a stale take.
- build-plan-v1 cross-check (s8, Sat 11:00 to 12:30):
  o A1 to A5 go into T8 (keyboard features and K-rules, Carlos).
  o A14 to A16 and guards 2 and 3 go into T7 (Web MIDI adapter with statechange and panic, Justin).
  o A8 and A10 go into T9.
  o Contract s7 freezes changes after Saturday 12:00, so the v1.2 rule edits (A1 to A5, K7) must land before lunch or wait.
  o The extra time is a reviewer estimate (unverified): about 90 min in T8 and 45 min in T7. T8 then overruns its 1.5 h block; cut A5 and A6 first.

- Saturday morning test list (merged, deduplicated):
| # | Check | Expected result |
|---|---|---|
| 1 | Self-test in Node and in Chrome on the stage laptop (localhost) | 22 pass, 0 fail; then the added A1 to A5 fixtures pass |
| 2 | Open localhost with Wi-Fi off; allow, then deny MIDI | No external request; both paths leave a playable take |
| 3 | Zero, one and two MIDI inputs connected | Fallback works with none; only the selected input records |
| 4 | Note-off, velocity 0, pedal, unplug mid-take | No stuck sound; the interrupted take is not scored |
| 5 | Tap or release during audio start; hold a laptop letter | No ghost notes, no repeats |
| 6 | Double-click Start; Hear the phrase, then Start | One audible timeline, one take |
| 7 | Tab change, blur, sleep and Reset during the count-in | Abort; a clean restart |
| 8 | Correct Ode at 80; then a wrong middle key | 8 of 8 and a pass; then 7 of 8 and no pass |
| 9 | Correct sequence at 90 against 80 | K3, no false "skipped note", lower on-beat count |
| 10 | Record 5 or more real take 1s; read each cue | One honest capture gives the scripted cue with no edits, or the cue and spoken line change |
| 11 | Live retake: improvement, then the third-miss path | Measured count pair; true REPLAY label; hand-off shows at miss 3 |
| 12 | Reset to replay-ready, timed twice | 10 s or less, goal and 80 bpm restored |
| 13 | Timed 60 s arc on the stage screen | Inside 60 s; no banned words, "ms" or debug text visible |
| 14 | Stage Chrome profile settings | Enhanced Spell Check off; the goal box has spellcheck off |

## Method
- Second review (7 Nov, 00:55 to 01:20): read the Astra answer; re-extracted the changed skeleton; reran the self-test, my fixtures and an astra.js reproduction script.
  o It confirmed 13 claims (9 by Node run, 4 by reading), 1 in part, 1 by design and 3 cosmetic; none rejected.
  o It added the pass gate (A2, A5), the M2 coverage guard (A4), the MIDI input guards and test rows 3 to 9.
  o It retired D3, D7, D8, D11 and D12, which are already fixed in the 23:17 file.
- Read order as briefed: HTML (all 970 lines in four parts), contract s0 to s5 and s8, engine spec s9 and s10, pitch-v2 s1 and s2, build plan s8, playbook P2.2, P3 and P5.
- Node v24.17.0 scripts in the scratch folder mt/proto-review: extract.js, fixtures.js, verify-codex.js; outputs in fixtures-out.txt. No team data used.
- Codex 1 call, gpt-6-sol, effort high. Input: the pure block only (names grep-checked: none) plus a spec summary. Ask: logic defects.
  o Kept, each verified in Node: rounding at the M2, K3 and on-time boundaries; K6 float boundary; K6 proof inverse; takeCounts ignoring counts; K4 reading (kept as a team call).
  o Codex found no matcher defect against the stated rule.
- Web: one search (Chrome spell check data flow); used as a snippet only, not opened.
- Effort figures in minutes are reviewer estimates, unverified.

## Open questions
- Which cue is the stage cue if no honest capture gives K3: K1 (robust) or K3 after the drift-aware matcher?
- Should wrong keys count as "on the beat" on the proof card (D11; the K7 proposal says yes)?
- Accept K7 (contract s8.1) Saturday, so a late-but-steady retake stops showing "No rule found"?
- Does Chrome on the stage laptop keep the MIDI grant on file:// and after a relaunch (unverified; test it)?
- Is Enhanced Spell Check off in the stage Chrome profile?
- Ode bars 5-8 note list matches the reviewer's own knowledge of the tune (E E F G G F E D C C D E D. C C); still check it against a score (unverified).

## Sources
1. prototype-skeleton.html, this folder: lines 1 to 66 (README), 125 to 191 (cards), 194 to 638 (pure block), 639 to 970 (browser part). Opened.
2. Google Chrome Enterprise help, "Navigating spell check using Chrome", https://support.google.com/chrome/a/answer/13616585 , accessed 2026-11-06, snippet.
3. take-data-contract.md s0, s1.3, s1.4, s2, s3, s4, s5, s8.1 to s8.3. Opened.
4. small-goals-engine-spec-v1.md s9, s10 (copy rules, banned words). Opened.
5. pitch-v2.md s1 (script and stage actions), s2 (slide 4 labels). Opened.
6. build-plan-v1.md s8 (Saturday blocks, checkpoint cut rules). Opened.
7. freeze-and-rehearsal-playbook-v1.md P2.2, P3, P5. Opened.
8. tech-feedback-layer.md s3 rows M2, K3, K4 (lines 92, 107, 108). Opened (grep).
