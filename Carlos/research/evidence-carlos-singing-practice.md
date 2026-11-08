# Evidence: Carlos's AI-assisted singing practice

*For the MasterTech team. First-hand evidence for an AI practice coach that listens, gives one fix, and refers to a teacher.*

## Source note (read first)

- **The original chats are lost.** No transcript of the singing sessions survives on Carlos's PC.
- This report is rebuilt from the project's own records, written by Claude (the AI assistant) during those sessions:
  o devlogs for 26 Aug, 4 Sep and 24 Sep 2026
  o per-song notes ("sidecars") for each song
  o the setup/handoff guide
  o the timestamps of the raw recordings
- **Quotes** are Carlos's words **as Claude logged them** at the time. They are short, specific and in quotation marks in the logs, but they may be lightly trimmed. They can't be checked against the original messages.
- Quotes are tagged by **devlog session**, e.g. *(26 Aug, S5)* = 26 August devlog, Session 5. Message numbers aren't available.
- Anything uncertain is marked **unclear**.

**Context.** Carlos recorded himself singing covers through OBS: an AT2020 mic into a Focusrite Scarlett, over karaoke videos playing on YouTube. The assistant's original job was audio cleanup: noise removal, EQ, mixing and loudness. **Voice coaching was never the stated goal.** It crept in because the problems Carlos heard turned out to be partly about his singing.

---

## 1. What Carlos asked (in order)

All on 26 Aug while recording "She". Each came after listening back to a mix.

| # | Carlos's words (as logged) | Session | What he was reacting to |
|---|---|---|---|
| 1 | "feels lacking, I sound too loud, needs effects like the actual song." | S5 | The first processed mix (v1) |
| 2 | "I think I'm singing forward." | S9 | A later mix (v5) |
| 3 | Asked for "final touches + a sound-quality test round," and first for tools so the assistant can "listen" | S11 | General. The quoted words are his; the rest is the log's paraphrase |
| 4 | "voice too loud, eclipsing the instruments" | S11 | Mix v6 |
| 5 | "the instrumentals are a bit loud" | S13 | Mix v7e |
| 6 | "my voice is too high and not whole" | S13 | Mix v7f |
| 7 | "some parts off key — no pitch guide." | S15 | His first take in a lower key |
| 8 | "Weird after the instrumental" | S17 | Take 8, about the last section of the song |

On 4 Sep there was one more note: take 1 "was not finished", so take 2 was "the real one". This is paraphrased in the log, not a direct quote.

**What is missing:**
- No question about **breath, clarity, vibrato or nerves** was logged.
- Five of the eight are about **the mix** (volume, effects, timing). Only 6, 7 and 8 are about **the voice itself**, and Carlos framed even those as sound problems ("too high", "weird"), not "how do I sing this better?"

---

## 2. What the assistant suggested, and why

**Singing and capture coaching:**

| Suggestion | Reason given |
|---|---|
| Set mic gain so your loudest part peaks around −10 to −6 dBFS, never −3 | Avoid clipping and distortion |
| Start every take with 5 s of silence | The noise remover learns the room from it |
| Sing into the logo side of the AT2020 (it's side-address); about 15 cm for verses, 25–30 cm for choruses | Early takes sounded dark and off-axis |
| "whisper the verse, open the chorus" (the bigger dynamic arc) | The chorus was only about 3 dB louder than the verse, so the performance sounded flat |
| Turn the gain knob down one notch | Take 4's chorus peaked at −3 dBFS |
| **Range test:** sirens, lowest note, highest full note, highest note at all | To check whether "too high and not whole" was the mix or the song |
| Lower the song 3 semitones, then 5 | The range test put Carlos's full-voice top at A#3 (baritone). The song went 2–3 semitones higher |
| A guide track: Carlos's own earlier vocal, pitch-shifted to the new key, played quietly under the backing | Answering "off key — no pitch guide" |
| A lyrics video playing in the new key on a second screen | He had no lyric or pitch reference once the key changed |
| For the climax: sing it in **mix voice**, drop the highest phrases an octave, or pick a compromise key | The climax sits about 17 semitones above the verses, but Carlos's full-voice span is 16. **No key fits both halves.** |
| Practice loops of just the climax | So he could drill the hard part in isolation |
| On "as sure as the stars shine above" (4 Sep): **"don't get louder / narrow vowel"**, with looped practice clips | High held notes (C4/C#4) above his comfortable ceiling |
| An alternative: lower the second song by 3 semitones | It would fit his range exactly, but with no headroom at either end |

**Mix-side fixes (not coaching):**
- Adding reverb and "effects".
- Balancing his voice against the backing.
- A "rider" that automatically rides his volume in the quiet intro.
- Correcting a timing offset.
- Re-shaping EQ per take.

---

## 3. What happened next

| Suggestion | Came back and said? | What the recordings showed |
|---|---|---|
| Gain/silence setup | No reaction logged | The first take used the **webcam mic** by mistake (a Windows default). Fixed by the assistant. Later takes had a silent head |
| Mic placement | No reaction logged | Presence +2.7 dB, muddiness −3.3 dB: the dark sound was fixed |
| "whisper the verse, open the chorus" | No reaction logged | Dynamic spread almost doubled (6.4 → 12.7 LU). A clear performance change |
| Gain down one notch | No reaction logged | He turned it down about **10 dB instead of about 3**: the next take was too quiet |
| Range test | **Did it** (a 31 s test recording exists) | Found the A#3 ceiling |
| Key −3 | Sang it; said "some parts off key — no pitch guide" | He sang mostly the **old** melody over the new key |
| Guide track + lyrics video | Used them | Take 8: verses in key; the climax was still too high |
| Key −5 + technique on the climax | Sang the final take of the night | In key throughout: 82 % of verse notes and 75 % of climax notes in scale. Logged as the "keeper candidate" |
| Mix voice / octave choice for the climax | **Never reported** | Unclear what he chose |
| "don't get louder / narrow vowel" (4 Sep) | No words logged, but he re-recorded right away | The high notes came out **about 5 dB lighter, with far fewer pitch wobbles** (33→13 and 24→7 "flip" frames). Slightly breathier. The log calls it "measurable evidence the technique note worked" |
| Lower the second song by 3 | No reaction logged | Not done |

**The biggest gap: Carlos never gave a verdict on any finished version.**
- "She" got **11 mix versions plus variants** (v1–v11b), each with a suggested A/B ("v7c vs v7e", "v11 darker vs v11b brighter").
- The second song got v1, v1b, v2 and v3.
- Every one is logged as **"awaiting Carlos's ears"** and never closed.
- A 13 Sep cleanup deleted the superseded versions. Two "She" finalists were kept, still "open for Carlos's ears".
- Whether Carlos never answered or answered without it being logged is **unclear**. The logs consistently write down his reactions when he gave them, which leans towards "never answered".

---

## 4. How Carlos judged progress

- **Listening back to the mixes.** Every one of his eight comments came after hearing a rendered version.
- **Comparing to the original record** ("needs effects like the actual song").
- **How it felt to sing**: "singing forward", and his voice was noted as "tiring" during the 6th take.
- **Not logged:** a pitch app, a teacher, or anyone else hearing the recordings.
- The **assistant** judged progress by measurement instead:
  o pitch tracking (how much of the take was above his ceiling, % of notes in key)
  o loudness of the voice versus the backing
  o tone balance
  o a 4-point "scorecard"
- Carlos never saw a progress summary in singing terms (e.g. "you're 30 % more in tune than last time"). **Unclear** whether he ever read the numbers.

---

## 5. Pattern of the sessions

**26 Aug: one long evening on "She"** (recording timestamps, local time):

| Time | What |
|---|---|
| 17:20 | First full take with the right mic → mix → "feels lacking, I sound too loud…" |
| 17:49 | Take after the mic-placement coaching |
| 17:56 | Take after "whisper the verse, open the chorus" |
| 18:08, 18:10 | Two aborted starts (85 s, 64 s) |
| 18:11 | Take with the technique the right way round |
| 18:35 | Take over a better karaoke backing. Cleanest recording; "voice was tiring" |
| *18:38–19:50* | ***No singing for about 70 min.*** *Listening and mix feedback: "eclipsing", "instrumentals a bit loud", "too high and not whole"* |
| 19:50 | Range test (31 s) |
| 19:56 | Short capture (unclear: probably an abort) and the first take in key −3 → "off key — no pitch guide" |
| 20:05 | Recorded the lyrics video (not singing) |
| 20:11 | Take with the lyrics video, key −3 |
| 20:23 | Take in key −5 |
| 20:33 | Abort |
| 20:38 | Final take, key −5 (keeper candidate) |

That's about **3 h 20 min, 9 real takes**, with 19 logged work sessions by the assistant the same day.

**4 Sep:** 21:51–22:11, a second song, "You're Nobody 'Til Somebody Loves You". 3 takes in 20 minutes: one unfinished, one real, one after the coaching tip.

**24 Sep:** no singing. Carlos chose a new direction, "vintage Sinatra-style" jazz covers with self-made backing tracks, for **personal use**. The assistant built a jazz trio backing for "Fly Me to the Moon". Logged as **"unheard"**: Carlos never listened to it or sang over it.

**After 24 Sep:** **no singing recorded.** A 31 Oct automated test run happened "while Carlos slept".

**Overall pattern:** two bursts of practice, then a stop.
- The first burst was intense: a full evening, about 9 takes.
- The second was short: 20 minutes.
- Both happened in the evening.

**Why he stopped:** **unclear. No reason is logged.** Two facts sit next to it:
- The work shifted from *singing* to *building* (a new jazz backing).
- The singing pipeline had been left with many open "awaiting ears" decisions.

**Exchange length:** individual message lengths are **unclear**. The logs show many short complaint-and-fix cycles within one evening.

---

## 6. What a text chat could not do

| Moment | What happened |
|---|---|
| **The assistant couldn't hear** | Carlos asked for tools so it could "listen". It built analysis scripts that turn audio into numbers and pictures as a stand-in for ears. Even then, every final judgement was left to "Carlos's ears" |
| "I think I'm singing forward." | Carlos's own description pointed the wrong way. Measurement showed the **recording** put his voice about 0.2 s *late*, caused by OBS timing drift, not his singing |
| "voice too loud, eclipsing the instruments" | True only in **verse 1** (a sparse intro), not across the whole song. The words alone couldn't say where |
| "the instrumentals are a bit loud" | Came after the voice had just been turned *down* for "eclipsing". His direction flipped within the hour: was he hearing differently, or were the descriptions too coarse? **Unclear** |
| "my voice is too high and not whole" | First guessed as a **tone/EQ** problem and fixed in the mix, which over-corrected. The log later says it was "**register, not EQ**": the song was simply above his range |
| "Weird after the instrumental" | Needed analysis to decode: no key change; the melody just climbs higher in the last section |
| "some parts off key" | The assistant could only find out *after* the take that he'd sung the old melody. A live listener would have caught it in the first bar |
| The gain instruction | "One notch down" by text became about 10 dB down in practice |
| Setup | The first take recorded the **webcam mic**; nothing warned him while singing |
| The climax choice | Mix voice versus octave versus key is a technique judgement that needs someone to hear him try each one. It was left as "Carlos decides" and never resolved |

---

## 7. What Carlos seemed to want and never got

- **A verdict.** "Which version is better?" was asked of him again and again; he never got a clear answer, and never gave one. A listening coach could simply say "this one, because…"
- **A pitch reference while singing.** He asked for exactly this ("no pitch guide"). It had to be hand-built as a backing file, not a live display.
- **Real-time feedback.** Every problem was found *after* a take, by analysis.
- **Technique help for notes above his range** (mix voice, narrowing vowels). The one tip given worked, measurably. Then it stopped there. This is exactly where a **real teacher** referral fits, and it never happened.
- **A comparison against the real record.** "Needs effects like the actual song." A reference-track comparison was built, but needed a purchased reference file and was never used.
- **Someone to sing to.** The jazz backing was built but never sung over. **Unclear** why.

---

## 8. Habits and barriers mentioned

- **Practises alone at home**, recording into OBS over YouTube karaoke videos. No other person appears in any session (inferred from the logs; not stated by Carlos).
- **Voice fatigue** in a long session ("voice was tiring", 6th take).
- **Private by choice:** the jazz covers are "for personal use and likely won't be published" (24 Sep). The reason isn't logged.
- **Rights barrier to sharing:**
  o Karaoke videos from YouTube can't be used for a published cover.
  o Purchased karaoke tracks can be published but not monetised on YouTube.
  o Every take here was logged as "practice only".
- **Technical setup burden:** the webcam-mic trap, gain levels in dBFS, and a setup guide written in audio-engineer language.
- **Competing for the PC:** one entry notes work was paused because Carlos was gaming. Minor.
- **Nerves, cost, time pressure, attitudes to coaches: none mentioned.**

---

## 9. Claude's honest view (opinion)

**What would make a listening practice coach genuinely useful to someone like Carlos:**
1. **Translate vague words into a cause.** Carlos's descriptions were honest but often pointed the wrong way ("singing forward", "too high" read as tone). The most valuable thing in these sessions was turning a feeling into a measured answer.
2. **One fix, with proof.** The "don't get louder / narrow vowel" tip was the best moment in the record: one cue, one retake, a measurable improvement. A coach should do that and *show* the before/after in singing terms.
3. **Know range from effort.** Telling a beginner "this note is above your range right now; here's the key that fits" saved more frustration than any mix tweak.
4. **Catch it live.** A pitch line or a "you're on the old melody" flag during the take beats a report afterwards.
5. **Refer at the right moment.** The climax that was beyond his range was the natural "this is where a teacher helps" point.

**What would make it annoying or useless:**
1. **Too many choices.** 11 versions, none chosen. Options without a recommendation became homework, and the open decisions piled up right before practice stopped (the causal link is **unclear**).
2. **Mixing up sound engineering with singing.** Half the effort went to making the recording sound better, not making Carlos sing better. For a beginner coach that's a distraction.
3. **Setup friction.** Mic defaults, gain numbers and file juggling. Each one is a reason not to start.
4. **Jargon.** LUFS, dBFS and "presence P50" mean nothing to a beginner.
5. **Long sessions without rest cues.** The voice was tiring by the 6th take, yet the evening ran another two hours.

**Devil's advocate.** Carlos said in the 5 Nov team meeting that the team should test its own bias.
- This is **one user**, who already had good equipment and the patience for a 3-hour session.
- He wanted *production quality* more than lessons.
- He stopped after two practice bursts, and he never once asked "how do I improve my singing?"
- That could mean beginners don't actually *seek* coaching, they seek a good-sounding result. It could also mean the coaching was hidden inside a mixing tool.
- **This record can't tell which.**

---

## 10. Privacy check: for Carlos to decide

- Carlos's **name**, that he lives in **Australia**, and the **dates and times** he practised (evenings).
- **Equipment:** AT2020 mic, Focusrite Scarlett, EMEET webcam, the Brave browser.
- **Song choices:** "She" (Aznavour/Costello), "You're Nobody 'Til Somebody Loves You" (Dean Martin arrangement), "Fly Me to the Moon", and the Sinatra-style jazz direction, which is logged as **personal use**.
- **Vocal ability data:** baritone, full-voice range F#2–A#3, notes that were off key, and "voice was tiring".
- **Backing sources:** YouTube karaoke videos, including KaraFun's channel. These were **practice-only on rights grounds**, which could raise questions if shown on stage.
- **Unfinished work:** the many unheard versions and the stop after 24 Sep, if Carlos would rather not present that.
- **The assistant setup itself:** a personal AI workspace with several other projects (not named here).

## Sources

- Devlogs of 26 Aug, 4 Sep and 24 Sep 2026, written by Claude during Carlos's sessions.
  o Quotes are Carlos's words as logged, tagged by devlog session; the original chats are lost.
- Per-song notes ("sidecars") for each song, from the same project records.
- The setup and handoff guide from the same project records.
- Timestamps of the raw recordings, used for the session pattern in section 5.
- Carlos's remark in the 5 Nov 2026 team meeting on testing the team's own bias.
- No external sources or URLs are cited in this file.
