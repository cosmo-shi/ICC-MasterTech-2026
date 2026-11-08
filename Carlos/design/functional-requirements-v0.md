# Functional requirements v0: the listening practice coach (voice first)

- Draft 6 Nov 2026 from first-hand evidence (evidence-carlos-singing-practice.md) and advisor feedback (notes 5 and 6 Nov).
- Scope for Wednesday: one learner, one instrument (voice), the first week. Guitar and keyboard follow the same loop.
- Evidence strength: one user, reconstructed from logs; treat each requirement as a hypothesis to test with the nine students.

## The loop (what the demo shows)
- Set-up check: right microphone, level fine, five seconds of room noise. Thirty seconds, once.
- Range check: sirens, lowest note, highest full note. The app picks a key that fits and says so in plain words.
- One small goal: a phrase, not a song. The learner records ten seconds.
- Live line: pitch shown while singing; a flag when the learner drifts to the old melody or above their range.
- One fix: the app names a cause in plain words and gives one cue ("don't get louder; narrow the vowel").
- Retake, then proof: before and after in singing terms ("high notes lighter, wobbles 24 to 7"), never in dB.
- Stop cue after about forty minutes or when the voice tires; the goal re-spreads to tomorrow.
- Hand-off: when the fix needs technique beyond a cue, the app offers a teacher, with the recording and the fix list attached.

## Requirements
| ID | Requirement | Why (evidence) | Priority |
|---|---|---|---|
| R1 | Listen live: pitch and volume tracked during the take, not after | Every problem was found after the take by scripts; a listener catches the old melody in bar one (ev. 6) | Must |
| R2 | Translate the learner's words into a cause | "Singing forward" was a 0.2 s recording lag; "too high" was range, not tone (ev. 6) | Must |
| R3 | One fix per retake, with a before-and-after in singing terms | The one cue given worked measurably; eleven mix versions with no verdict stalled practice (ev. 3, 9) | Must |
| R4 | Range check first; recommend a key; say when a note is above range for now | The song sat above the learner's range; a key change fixed more than any mix tweak (ev. 2, 9) | Must |
| R5 | No option piles: recommend, do not ask the learner to judge versions | Every version was left "awaiting ears" and never closed (ev. 3) | Must |
| R6 | Plain words only; no dBFS, LUFS or engineering terms | Jargon and gain numbers were a barrier; "one notch" became 10 dB (ev. 6, 9) | Must |
| R7 | Set-up check before the first take: microphone, level, silence | First take recorded the webcam mic; nothing warned him (ev. 3) | Should |
| R8 | A pitch guide while singing (reference line or quiet guide track) | Asked for directly: "no pitch guide" (ev. 7) | Should |
| R9 | Rest cue and session cap; goals re-spread, no streak | Voice tired by take six; the evening ran two more hours (ev. 5, 9) | Should |
| R10 | Teacher hand-off at the technique ceiling, with recording and fix list | Mix voice versus octave was left to the learner and never resolved; no referral happened (ev. 7) | Must |
| R11 | Audio stays on the device by default; sharing is opt-in | Practice is private by choice; regional users may be offline (ev. 8; ADII 2025) | Must |
| R12 | Offline-capable for the loop; cloud only for the hand-off and sync | Regional connectivity gap (research-bank.md, Kat) | Should |
| R13 | Backing tracks: built-in or rights-cleared; never a YouTube karaoke video | Every take was practice-only on rights grounds (ev. 8) | Must |
| R14 | Goal-led: the learner names the result they want; the AI splits it into small goals that each carry one fundamental; coaching rides inside the learner's own goal | The user wanted production quality, not lessons (ev. 9); the one cue that fixed his cover also fixed his singing (ev. 3); autonomy g = .638 (gamification-research.md) | Must |
| R15 | Two progress lines: "your goal" (distance to the result) and "your skill" (fundamentals banked, shown as the ahead line) | Progress monitoring d = 0.40 (procrastination file section 5); the "two weeks ahead" moment (Carlos, 5 Nov) | Should |

| R16 | Difficulty adjusts to the learner: enough challenge to problem-solve, never overload; an off-day check | Third advisor, 6 pm (skill acquisition); novelty fades by week four (gamification-research.md) | Should |
| R17 | The AI picks where in the song to start (the easiest phrase, not the first); show visually what the learner should have done | Third advisor, 6 pm; R3 one fix with proof | Should |

## Non-goals for Wednesday
- Mixing, effects, loudness or any audio engineering; AI-generated music; leaderboards or a game; a teacher marketplace.

## Open questions
- Does a beginner want lessons or a good-sounding result? Our answer is both at once (R14); test with the nine students whether the hidden fundamentals feel like help or like homework.
- Which pitch tracker runs on a phone offline with enough accuracy for voice? Candidates to test Saturday.
- Who is the teacher at the hand-off in a regional town? (question 26 and tonight's asks)

## Sources

- evidence-carlos-singing-practice.md, first-hand evidence; the "ev." numbers in the table point to it.
- Advisor feedback in the notes of 5 and 6 Nov 2026, as named in the body.
  o Includes the third advisor at the 6 pm session (R16, R17) and Kat (R12).
- research-bank.md, regional connectivity gap (R12), as cited in the body.
- gamification-research.md, autonomy effect and novelty fade (R14, R16), as cited in the body.
- The procrastination file, section 5, progress monitoring effect (R15), as cited in the body.
  o Now research/procrastination-small-goals-evidence.md in this folder.
- ADII 2025, named in R11; the body gives no URL.
- Carlos, 5 Nov 2026, the "two weeks ahead" moment (R15), as stated in the body.
