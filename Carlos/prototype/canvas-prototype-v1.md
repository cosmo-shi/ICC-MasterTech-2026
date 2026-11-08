# Canvas prototype v1: the model composes the canvas, the rules keep it safe

Written 2026-11-08 by the session for Carlos, from his four asks after the first live run of v0 at the venue. Proposal for the team; nothing here is decided. v0 stays as the fallback.

## 0. What it is (one breath)
- One coach line and one canvas: the learner asks by chip, voice or typing, and blocks appear.
  o Live mode: the model returns a canvas spec, a small block tree; the page validates it, then draws it.
  o Saved mode: the v0 rules router still answers, now drawn with the same blocks.
- File: prototype/canvas-prototype-v1.html, one self-contained page, about 343 KB with the piano samples inside.
  o No network request except one Messages API call per typed ask in live mode.

## 1. What changed from v0, and why
| Carlos asked | v1 answer |
|---|---|
| "Free rein to show anything" ("next syllable" showed nothing) | The model composes any mix of ten block types; state carries the position, so "next syllable", "again", "slower" work |
| "Too much on the screen" | One big coach line, one canvas, three chips at most; labels, request and sources behind one footer toggle; model panel behind a gear |
| "Smoother, cleaner animation" | Blocks fade and rise in with a stagger; views cross-fade; notes and keys light from the audio clock; only transform and opacity animate |
| "Actual instrument sound" | Eight sampled acoustic-grand notes, C4 to C5, embedded; one buffer source per note, velocity and release; soft wood-knock metronome |

- Also new: a count-in shown as four dots, not numbers; tempo slow (60) or normal (90) for play and practice.
- Kept from v0: songbook, drills, saved plans, cue book, measurement, record, teacher mock, voice in and out.

## 2. The block set
| Block | Fields the model fills | What draws |
|---|---|---|
| line | text, at most twenty words | The one coach sentence, large, always first |
| sheet | song, from, to, mark (none, notes, syllables), indices, syllables, names | Own SVG staff; marked notes glow, marked syllables get a soft box |
| keys | keys (C4 to C5 names), press | Eight keys; listed keys glow; press sounds and depresses each once |
| chips | up to three of label and say | Tap answers; say is sent back as the next ask |
| steps | two to four steps | A short dotted list |
| card | title, text | A quiet card, one sentence |
| play | song, from, to, tempo | Four clicks, then the bars on the piano, each note lit in time |
| practice | song, from, to, tempo | The try screen: strip, Play it, keys; the rules measure the take |
| person | text (optional) | "Let's ask a person" card with a mock Send |
| word | title, text, task | Plain-words meaning and a ten-second task |

- Rules-only blocks the model can never send: take (the fix), compare (the retake), listen (play it to me), record.
- Every block carries every field in the schema; unused fields are "", 0, false or empty lists.
- Indices are note positions in the song; one syllable per note, so a syllable index is the note index.

## 3. State sent with every live ask
| Field | Example |
|---|---|
| text | the typed or spoken words, capped at 120 characters |
| position | song sailor, bar two, note and syllable index 7, syllable text "en" |
| shown | the bars on screen: sailor, bars 2 to 2 |
| lastBlocks | one-line summary of each block on screen, for "again" and "that word" |
| take | last measured cause and bars, or null |
| misses | same cause in a row, for the stop-after-three rule |
| tempo, names, lastAsk | slow or normal; note names on; the previous ask |

- Never sent: audio, the practice record, names, the key.
- The system prompt holds the block schema, every songbook note as index:bar:syllable:key, and the coaching rules.

## 4. Validator rules (live replies)
- Rejected, rules fallback: a block type off the set, more than six blocks, an index or bar out of range.
  o Also rejected: an index outside the bars shown, a song off the songbook, an unknown field.
- Stripped, listed in the label: a block whose text breaks the text rules; chips past three; a second line or play.
- Text rules for model text: no digits, no notation, no score, grade, percent, star, points, pass or fail.
  o Also no counting a take ("seven of eight", "two wrong notes"), no verdicts ("perfect", "well done").
  o Bar and beat numbers are rewritten as words: "Bar 2 is next" becomes "Bar two is next".
- Fix and compare after a take come only from the rules engine and the saved cue book.
- Pain, hurt, tired and help, person, teacher route to a person before any model call, in both modes.
- No key or no serve.py: the saved rules router answers, labelled "saved fallback".

| Outcome | Label behind "about this screen" |
|---|---|
| Valid reply | live: (model that answered) composed this canvas; the validator checked it |
| Valid, some blocks stripped | the same, plus "stripped:" and the reasons |
| Rejected reply | saved fallback: live reply rejected by the validator (reason); rules router |
| 401, 429, status, timed out, offline, refusal | saved fallback: live (reason); rules router |
| No key and no serve.py | saved fallback: live needs a key or serve.py; rules router |
| Saved mode | saved: rules router, no model call |

- Request shape unchanged from v0: claude-opus-5-5, version 2026-10-21, fallbacks "default", effort low.
  o New: max_tokens 2048 in the page and in serve.py; output_config.format json_schema with the canvas schema.

## 5. How to run
- Saved mode: double-click the html; it works from file:// in Safari or Chrome, with sound.
- Live mode: in the shell, set ANTHROPIC_API_KEY, then run `python3 prototype/serve.py` from the folder root.
  o Open http://localhost:8000/prototype/canvas-prototype-v1.html, tap the gear, tick "Use the live model".
  o The key lives only in that shell; never in a file, the repo, a chat or a screenshot.
- Self-test: add `?selftest=1` to the address for the in-page banner.

## Demo script (laptop, 3 to 4 minutes)
0. Open the page as in section 5. Shows: "What do you want to play today?" and three chips.
1. Tap "a pirate song". Shows: three chips and the copyright card.
2. Tap "Drunken Sailor". Shows: the sheet with words; tap any word to hear the piano.
3. Optional: tap the gear, tick live, close. The footer dot turns green-blue.
4. Type `next syllable`. Shows: "Next word: “What”.", the word boxed, the key glowing and pressed.
5. Type `next syllable` again. Shows: "shall" marked; the position moved on.
6. Type `show me only bar 2`. Shows: bar two alone with its words.
7. Type `play it slower`. Shows: four dots, then bar two slowly, each note lit as it sounds.
8. Type `let me try bar 1`. Shows: the try screen. Tap "Desk demo: use a sample take".
   o Shows: what happened in plain words, the beat strip and one ten-second fix.
9. Tap "Try again", then the desk demo again. Shows: "What changed?"; tap "It felt steadier".
10. Type `what does that word mean`. Shows: a word card with a ten-second task.
11. Type `my wrist hurts`. Shows: "Let's ask a person"; no model call, even in live mode.
12. Tap "about this screen", then "show the request". Shows: the honest label and the JSON.
- In live mode the wording of steps 4 to 10 comes from the model and will vary; the label says so.

## If something goes wrong
- No sound: tap anything once; Safari unlocks audio on the first tap.
- Piano sounds synthetic: "about this screen" says if the samples failed and the synth fallback plays.
- Live label says "status 502": serve.py's 12-second socket timeout cut a long reply; carry on saved.
- "live needs a key or serve.py": start serve.py with the key in its shell, or paste a key in the gear panel.
- "key not accepted": check the key; the demo continues on the rules.
- No MIDI in Safari: expected; use the screen keys or letters A S D F G H J K.
- Mic greyed out: voice needs Chrome or Edge on localhost; type instead.

## What is not real
- No live API call was made while building; no key was used. Live paths were tested with a stubbed fetch.
- Not opened in a browser: layout, animation, Safari audio decoding and sample sound are unseen and unheard.
- Web MIDI untested; teacher numbers are sample data; instrument loan schemes are placeholders.
- Voice in uses the browser vendor's speech service, not on-device speech.

## Self-test and checks
| Check | Result |
|---|---|
| JavaScriptCore run of the core, sliced from the html | 107 of 107 passed |
| Of which: v0 tests kept unchanged | 74 |
| Of which: v0 live-view tests replaced by canvas-spec equivalents | 11 |
| Of which: new tests | 22: block set, six-block cap, indices, take counts, state and next syllable, safety first, no-key fallback, request shape, again and slower, rules canvases, tempo |
| Stubbed-DOM smoke run of the page script under JavaScriptCore | 20 of 20: demo path, next syllable, bar range, take, retake, safety, no key, good and score-only live replies |
| Browser `?selftest=1` | the 107 plus the layout guard; not run in a browser here |
| External URLs in the html | one: the Messages API URL; no src=, href=, @import or link |
| API-key-looking strings | zero |
| File size | 342,942 bytes, under 450 KB; samples about 158 KB of that |

## Method
- Built by the session in one file, vanilla HTML, CSS and JavaScript; no library, no Codex, no web search.
- Core logic kept DOM-free between the CORE markers, sliced out with Python and run under JavaScriptCore.
- Samples: eight mp3s downloaded to scratch, mixed to mono, trimmed to 1.9 s with a 0.6 s fade, normalised.
  o Re-encoded with afconvert to 48 kbps mono AAC, embedded as base64, decoded once with decodeAudioData.
- serve.py: one line changed, the max_tokens cap from 1024 to 2048; ALLOWED and MAX_BODY untouched.

## Open questions
- Is serve.py's 12-second timeout long enough for a six-block canvas, or should the team raise it?
- Should "help" always go to a person, even "help me read bar 2", as the brief asks?
- Strip or reject: is stripping one bad block better on stage than falling back to the rules?
- Should taps on rules-made chips also go to the model when live mode is on?
- Where does the CC BY 3.0 piano credit sit on a pitch slide or stage screen?
- Does the count-in as four dots read clearly to a nine-year-old?

## Sources
- prototype/canvas-prototype-v0.md and canvas-prototype-v0.html, the baseline, opened 2026-11-08.
- design/spec-review-v0.md s2 and notes/sunday-notes-2026-11-08.md s3 (no-score rule), opened 2026-11-08.
- session-rules.md, allowed names and doc style, opened 2026-11-08.
- Piano samples: https://raw.githubusercontent.com/gleitz/midi-js-soundfonts/gh-pages/FluidR3_GM/acoustic_grand_piano-mp3/ (C4, D4, E4, F4, G4, A4, B4, C5), downloaded 2026-11-08.
- Licence, README.md of that project, fetched 2026-11-08: the Fluid soundfont renders are "Released under Creative Commons Attribution 3.0 license", https://creativecommons.org/licenses/by/3.0/us/.
  o The repository's LICENSE.txt is MIT (copyright 2012); it covers the code, not the sounds; holder's name left out under the names rule.
  o Attribution used in the page: FluidR3_GM soundfont, rendered to mp3 by the MIDI.js Soundfonts project, CC BY 3.0, trimmed, mono, re-encoded.
- Bundled Claude API reference and the v0 request shape (model id, version header, fallbacks, structured output), as checked tonight.
