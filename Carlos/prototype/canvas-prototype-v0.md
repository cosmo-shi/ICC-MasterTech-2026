# Canvas prototype v0: a practice canvas, not a chatbot

Written 2026-11-08 by the session for Carlos, from the idea he gave 20:33 to 21:16; v1 voice and live-model additions from the 21:50 brief. Proposal for the team; nothing here is decided.

## 0. What it is (one breath)
- An empty practice canvas: the learner asks by chip or typed words, and a fixed view appears.
  o A rules router returns a view request {view, params} from a fixed menu; the app draws it, the model never decides.
- File: prototype/canvas-prototype-v0.html, one self-contained page, about 130 KB.
  o No network requests, except one Messages API call per ask when live mode is switched on.
- It opens empty: a mic, a text field, Show and the hint "tap the mic or type".
  o The coach then asks "What do you want to play today?" and offers options cards.

## 1. How to run
- Double-click the file; it works from file:// with no install and no internet.
  o Or run `python -m http.server` in prototype/ and open localhost:8000/canvas-prototype-v0.html.
- Live mode and voice: set ANTHROPIC_API_KEY in the shell, run `python prototype/serve.py` from the folder root.
  o Then open localhost:8000/prototype/canvas-prototype-v0.html; serve.py is standard-library Python only.
- Desk shortcut: on the try screen, "Desk demo: use a sample take" plants a wrong key, then a clean retake.

## 2. The view menu
| View | Trigger words or chip | What renders | Rules decide | Saved model output |
|---|---|---|---|---|
| sheet | sheet, notes, score | Own SVG staff, syllables, note-name toggle, tap a word to hear it | Note layout | none |
| song | a songbook title or keyword | Whole sheet plus the phrase cards | Which song matched | none |
| breakdown | break, bars, split | Phrase cards with Play, Say it, Try this bit | Phrase split | Kick-off line |
| play | play, hear, listen | Count-in, oscillator playback, notes light up | Which bars | none |
| practice | try, go, ready | Keys C4 to C5, letters A to K, optional MIDI, beat strip | Capture grid | none |
| fix | after a take | What happened, one ten-second fix, two buttons | Measurement, one cause | Fix line (cue book) |
| compare | after a retake | Two dot rows, "What changed?" first, then the coach line | Comparison wording | Next fix line |
| glossary | mean, what is | Plain line plus a ten-second task | Which word | Fixed glossary |
| handoff | person, teacher, help; pain, hurt, tired | "Let's ask a person" card, mock Send | Third same cause; safety words | none |
| find-instrument | instrument, real, piano, keyboard | Start-on-screen card, three placeholders | none | none |
| plan | a named piece not in the songbook | Song plan: skills, five days, drill phrase | Generic plan, tempo chips | Skills table, kick-off |
| listen | "Play it to me" on day 5 | Free play from the learner's own sheet | Timing only | Fix line |
| songbook | song, tune, songbook | Five public-domain titles as chips | none | none |
| opening | hi, hello, hey, start, ready, let's go, ok; an opening ask that matches nothing | "What do you want to play today?" with three chips | Greeting rule, first-ask rule | none |
| options | "a pirate song" (no exact title); "a song", "something else", "Pick a song" | Three pirate options, or the five songbook titles; each taps into a real view | Every option resolves to a catalogue entry | none |
| menu | anything else after the opening | "I can show you: sheet, breakdown, playback, a try, a meaning, a person" | Fallback | none |

- Pain, hurt and tired route to a person before any other rule, even with a song title in the text.
- A play request naming pirates ("play some pirate song") still opens the Drunken Sailor sheet; a bare "a pirate song" gets options.
- In live mode the model may pick any view except fix and compare; those come only from a measured take.

## 3. Practice loop and the no-score rule
- Count-in of four clicks, then capture; dots land on or off the beat ticks of the strip.
- The rules engine aligns the take and picks one cause: wrong note, missing, extra, pause between bars, early, late.
- The fix card shows "Beats 3 and 4 came early." and one cue-book line, never a number.
- A clean take shows "That was steady."; no totals or ratings appear on the learner screen.
- The retake card asks "What changed?" first; the learner taps, then the rules line appears.

## 4. Practice record
- Kept in memory and in localStorage under try/catch: causes, tries, got-it marks, words tapped, goal, preferences; never audio or names.
- "Open my record" shows plain words: "Working on: steady beat. Got better: wrong notes in bar 2."
- "Delete my record" wipes it in one tap; a cause seen before gets its second cue variant.

## 5. Teacher view (mock)
- Labelled "teacher view, mock data": class aggregates from sample data plus this device's record.
- Two "ask the data" chips draw an own-SVG bar chart or a topic list; no names, never records side by side.

## 6. Songbook
| Title | Source line in the file | Bars used | Keywords |
|---|---|---|---|
| Ode to Joy (opening) | classical melody (1824), poem text (1785), public domain | 1 to 2 | joy, ode |
| What Shall We Do with the Drunken Sailor | traditional sea shanty, public domain | 1 to 4 | pirate, pirates, sailor, sea, shanty, drunken |
| Twinkle Twinkle Little Star | traditional melody, 1806 poem, public domain | 1 to 4 | twinkle, star |
| Mary Had a Little Lamb | traditional rhyme (1830), public domain | 1 to 4 | mary, lamb |
| Hot Cross Buns | traditional street cry, public domain | 1 to 4 | hot, cross, buns |

- Own notation typed by the session; every note sits on the eight white keys C4 to C5; all 4/4.
- Ode to Joy stays at bars 1 and 2 under the session rule, with its original German syllables.

## 7. Copyright line in the prototype
| Request | What renders | What never renders |
|---|---|---|
| Songbook title or keyword | Sheet, syllables, playback, phrase cards | Any arrangement from elsewhere |
| Saved popular title (He's a Pirate, Let It Go, Shape of You) | Goal saved by title, skills, five-day plan, team drill | Notes, lyrics, rhythm or playback of the piece |
| Any other named piece | Generic rules plan, "fast or slow" chips, team drill | Notes of the piece |
| "Play it to me" from own sheet | Timing and steadiness line, one fix | A transcription; pitches are dropped |

- The plan view carries the line "This coach does not show or play copyrighted music; it listens to you and gives one fix."
- The He's a Pirate drill is team-written: D minor feel, two bars, quarters and eighths, counted "1 and 2".

## 8. What is not real
- Live mode is real only with a key: serve.py with ANTHROPIC_API_KEY, or a key pasted for one tab.
  o Without a key every line is saved and labelled; no live call was made while building this page.
- Voice in uses the browser vendor's speech service, not on-device speech; audio leaves the device.
- No on-device speech yet; the real app would run recognition and the coach voice locally.
- No real MIDI test here; Web MIDI is optional and the page runs without it.
- No real loan schemes: three placeholders, labelled as placeholders; teacher numbers are sample data.
- No sheet library and no licensed catalogue; own SVG only, five public-domain tunes.

## 9. Self-test and checks
| Check | Result |
|---|---|
| Node self-test of the core block | 85 of 85 passed, exit 0 |
| Browser `?selftest=1` | the same 85 plus the layout guard, banner "86 of 86 passed"; not run in a browser here |
| `node --check` core and both page scripts | all parse |
| Stubbed-page smoke run | opening, options, option taps, live safety, no key, good reply, rejected reply, 401, refusal |
| serve.py local run without a key | page served; POST /api/coach answers 501, so the page tries a pasted key |
| External URLs, src=, @import, link | one hit: the Messages API URL |
| API-key prefix string anywhere in prototype/ | zero hits |
| File size | about 130 KB, under 200 KB |

## 10. Mapping to merged-flowchart-v0
| Diagram | Where it shows in the prototype |
|---|---|
| 2 Session loop | Goal in own words, count-in, take, fix card, meaning link, retake, "What changed?", third-miss hand-off |
| 3 Engine | Router with safety first, rules measure and pick one cause, cue book as the saved model line, record update |
| 4 Data flow | Record stays on the device, summary leaves only on Send (mock), teacher sees aggregates only |

## 11. Stage note
- Stage: the saved, labelled model output; public-domain or team-written phrases only.
- Desk: live mode through serve.py only if the venue network allows, labelled live; the rules carry on if it fails.

## 12. Live model mode
- The model picks the view and words one line; the rules decide the rest.
  o Rules route first: pain, hurt and tired go to a person with no model call.
  o Takes, causes, the third-miss stop rule and the record never come from the model.
- Switch: tap "model: saved" for the panel, then tick "cloud" (default off); the tag reads "model: live (claude-opus-5-5)".

| Sent per ask | Never sent |
|---|---|
| The typed or spoken text, as text | Audio |
| Current song id and the last view | The practice record |
| A measured take summary: cause, start and end bar | Names |
| The fixed system prompt and the view schema | The key, to any file, log or address |

| Run mode | Where the key lives | Use |
|---|---|---|
| serve.py proxy, POST /api/coach | ANTHROPIC_API_KEY in the shell, sent as a header only | Production shape; the browser never holds a key |
| Pasted key | This tab's sessionStorage, one key name, "clear key" removes it | Prototype only, when serve.py is not running |

- Desk rule for the key: short expiry (one day), scoped to one workspace, made in the Claude Console by its owner.
  o Never in a file, the repo, a chat or a screenshot; serve.py first, the pasted key only as a fallback.
  o Delete the key after the demo; a leaked key spends money.

- The request in words: one POST to the Messages API, model claude-opus-5-5, max_tokens 1024.
  o Low effort, server-side fallbacks on, structured output against a fixed JSON schema of five fields.
  o No thinking field and no temperature; a 12-second timeout and no retry loop.
- The validator: a menu view, catalogue ids only, one line of at most twenty words.
  o The line holds no digits, no score or ranking words and no notation; at most four options.

| Outcome | Label under the canvas |
|---|---|
| Valid reply | model: live (claude-opus-5-5) |
| Reply fails the validator | model: live, reply rejected by the validator, rules fallback: reason |
| 401, 429, other status, timeout, offline | model: live, key not accepted / rate limited / status / timed out / offline, rules fallback |
| No key and no serve.py | model: live needs a key or serve.py; rules fallback |
| Refusal or max_tokens stop | model: live, stop reason, rules fallback |

| Per call (estimate, unverified) | Value |
|---|---|
| Input | about 3 KB system prompt and schema, under 1 KB user message; not measured |
| Output | under 200 tokens; not measured |
| Price basis | claude-opus-5-5 at USD 4 in and USD 20 out per million tokens; unverified, pricing page not opened |
| Latency | not measured; low effort, 12-second cap |

## 13. Voice
- Voice in: the mic button is push-to-talk with browser speech recognition, en-AU, interim words in the field.
  o The final words go through the same Show path as typed text.
- Works in Chrome or Edge on localhost or https; audio goes to the browser vendor; typing always works.
  o Without the API, or if permission fails, the mic is disabled with "type instead".
- Coach voice: a toggle, default off, speaks the coach line of each new card with the browser voice.
  o Lines with digits are not spoken; the no-score rule covers spoken lines too.
- The real app would run speech recognition and the coach voice on the device.
  o The same API already offers an on-device mode in newer browsers (MDN, opened 2026-11-08); not used here.

## Demo script (laptop, 3 to 4 minutes)

0. Open the page: `python prototype/serve.py` in the folder root, then localhost:8000/prototype/canvas-prototype-v0.html.
   o Shows: an empty canvas, the mic, the text field, Show and "tap the mic or type". Label: "model: saved".
1. Tap the mic and say "hi", or type it and press Show.
   o Shows: the coach card "What do you want to play today?" with "a pirate song", "Twinkle", "something else".
   o Label: "model: saved"; the voice line names the browser speech service. With live on: "model: live (claude-opus-5-5)".
2. Say "a pirate song", or tap that chip.
   o Shows: "Pirate songs we can do" with three options: Drunken Sailor, He's a Pirate plan, the drill phrase.
   o Label: "model: saved" and the copyright line. With live on: "model: live (claude-opus-5-5)".
3. Tap "What Shall We Do with the Drunken Sailor".
   o Shows: the sheet with syllables, then the phrase cards. Label: its public-domain source line.
   o With live on: "model: live, option resolved by the rules".
4. Type "I want to play He's a Pirate now", press Show.
   o Shows: song plan, skills, five days, team drill phrase; no sheet of that tune.
   o Label: "saved model output: skills and a plan, no notes" and the copyright line.
5. Tap "Try this bit" on the drill phrase card.
   o Shows: the try screen for the drill, keys C4 to C5, beat strip. Label: "prototype, saved model output".
6. Type "play some pirate song", press Show.
   o Shows: the Drunken Sailor sheet with syllables, then the phrase cards. Label: its public-domain source line.
7. Tap "Break it down".
   o Shows: phrase cards; card one carries "Let's get this started: bar 1, six notes, say the words first."
   o Labels: "split by the rules engine" and "from the saved cue book (saved model output)".
8. Tap "Say it" on the bars 1 and 2 card.
   o Shows: four clicks, then a click per syllable with each word lit. No label change.
9. Tap "Try this bit" on the same card.
   o Shows: the try screen for bars 1 and 2. Label: "prototype, saved model output".
10. Tap "Desk demo: use a sample take".
   o Shows: fix card, the planted wrong key in plain words, one ten-second fix.
   o Labels: "rules engine measured this" and "from the saved cue book (saved model output)".
11. Tap "Try again", then "Desk demo: use a sample take" again for the clean retake.
   o Shows: two dot rows and "What changed?"; the learner taps an answer first.
   o Then the coach line "Every beat landed this time." Label: "worded by the rules from the two takes".
12. Tap "What does that mean?" in the chip row.
   o Shows: a glossary word, plain line, ten-second task. Label: "ten-second task, fixed glossary".
13. Tap "Ask a person".
   o Shows: "Let's ask a person" card; tap Send for "Would send to your teacher (mock)".
   o Label: "Nobody sees this unless you send it."
14. Tap "Open my record".
   o Shows: plain words, for example "Got better: wrong notes in bar 2." Label: "never audio, never names".
15. Tap "Teacher view (mock)", then "hardest concept this week".
   o Shows: class totals and a bar chart. Labels: "teacher view, mock data" and "inspired by generative dashboards; mock".
16. Tap "Learner screen" (top) to go back.
   o Shows: the learner canvas as it was. Label: "prototype, saved model output".
17. For a judge, tap "show the request" in the footer.
   o Shows: the view request JSON and the rule that chose it, under the canvas.

## If something goes wrong

- No sound: tap any key or chip once to unlock audio, then repeat the step.
- MIDI keyboard not detected: use the on-screen keys or the letters A S D F G H J K.
- Page opened from file://: MIDI and voice need localhost; restart with the serve.py line in step 0.
- Mic permission denied: allow the microphone in the address bar, or type the words instead.
- Voice not available (file://, Firefox): the mic shows "mic off"; typing works the same.
- Live call failed: the label says why and the demo continues on the rules.
- "key not accepted": check the key in the panel or the serve.py shell; carry on in saved mode.

## Method
- Built by the session in one file with vanilla HTML, CSS and JavaScript; no Codex, local model or web search.
- Checks: the Node self-test, `node --check` on every script block, a stubbed-page smoke run, and greps.
  o v1: live paths tested with a stubbed fetch only; serve.py tested locally without a key; no real API call.
- Drill phrases and notation were written fresh by the session; nothing was copied from any score or site.

## Open questions
- Which chips stay on the canvas, and does "Pick a song" earn its place?
- Does the typed field stay, given the morning-notes rule against a text box for children?
- Who owns keyboard input on stage: on-screen keys or the USB MIDI keyboard (team call 1)?
- Which licensed catalogue would the real product use, and who checks its terms for learners?
- Should Ode to Joy grow past bars 1 and 2 now that the songbook holds longer tunes?
- Should "play it to me" also report wrong keys for copyrighted pieces, as morning-notes s4 allows?
- Does cloud mode need a guardian's consent for under-15s, even with text and numbers only?
- Should the pasted-key path stay at all, or only serve.py, under the team's paid-key policy?
- When does on-device speech replace the browser vendor's service, before any child uses voice?

## Sources
- session-rules.md, hard rules and allowed names, opened 2026-11-08.
- design/merged-flowchart-v0.md, diagrams 2, 3, 4 and 5, opened 2026-11-08.
- notes/morning-notes-2026-11-07.md s4 copyright table, s7 screen, s8 rules decide, s9 flow per prompt, opened 2026-11-08.
- notes/sunday-notes-2026-11-08.md s3 no-score rule and s4 practice record, opened 2026-11-08.
- prototype/demo-phrase-and-rights.md, public-domain status and own-synth rights line, opened 2026-11-08.
- prototype/prototype-skeleton.html, audio, MIDI and key ideas reused in new code, opened 2026-11-08.
- Structured outputs, https://platform.claude.com/docs/en/build-with-claude/structured-outputs.md, opened 2026-11-08 (home session): json_schema format, additionalProperties false, no length limits.
- Authentication, section "Browser-based applications", https://platform.claude.com/docs/en/manage-claude/authentication.md, opened 2026-11-08 (home session): the browser header is required, a back end is the advised shape.
- Web Speech API on MDN, https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API, opened 2026-11-08 (home session): recognition uses the platform's service by default; an on-device option exists (SpeechRecognition.available and install); browser support table not readable in that fetch.
- Bundled Claude API reference (request shape, model id, version header, fallbacks), consulted 2026-11-08.
