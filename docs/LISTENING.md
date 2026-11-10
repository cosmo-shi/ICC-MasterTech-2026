# Listening: how Carmen hears a real instrument

Status: **working (draft)**, 10 Nov 2026. These are benchmark results on recorded samples, not results from learners or real rooms. Phones and real rooms have not been measured yet: see "Not verified" below.

## What it does, and what it does not claim

| Input | What Carmen hears | What it never claims |
|---|---|---|
| MIDI keyboard | Each key pressed and released, and its timing, from the browser's own timestamps | Nothing about touch or technique |
| Microphone, piano or keyboard | **One note at a time**: its letter name, and when it started | Chords, technique, tone, dynamics |
| Microphone, drum or table taps | **When each tap started** (rhythm) | Which drum was hit, how hard it was struck, technique. Volume depends on distance from the microphone, so it does not tell how hard something was hit. |
| Guitar | Not offered | Synthetic plucked strings pass the unit tests, but no real guitar recordings have been checked, so guitar is hidden |

A detection that is not clear is reported as "Carmen couldn't tell". It is never marked as wrong, and it never lowers mastery (see `src/listen/compare.ts` and `evidenceWeight` in the learner model).

## Pipeline (separate parts)

1. **Capture**: `src/input/mic.ts` (microphone, AudioWorklet `public/worklets/mic-tap.js`) and `src/input/midi.ts` (Web MIDI, no system-exclusive access).
   - Echo cancelling, noise suppression and auto-gain are off, because they change timing and pitch.
   - The microphone is never played back out loud.
2. **Estimate plus reliability**: `src/listen/analyser.ts` and `src/listen/pitch.ts`.
   - Onsets come from two energy channels (attack and level), each with its own noise floor.
   - Pitch is estimated with YIN over the 160 ms after an onset, and the frames vote on the note.
   - Every event carries a confidence.
3. **Comparison**: `src/listen/compare.ts`.
   - Gives one of four verdicts: match / octave / different / unclear.
   - Taps become captured inputs for the existing checker, with `soundUnknown`, so the drum sound is never judged.
4. **Learner model update**: `src/ai/bkt.ts`. Unclear takes carry zero weight.
5. **Teaching response**: copy in three parts: what happened, why it matters, one next step.

## Timing calibration

A tap reaches the analyser later than the sound that prompted it, by the device's output delay plus its input delay.

- **How Carmen measures it:** it plays four clicks and takes the median delay to what the microphone hears. That can be the clicks themselves through the speaker, or the learner tapping along when wearing headphones.
- **Without a good calibration** (spread over 120 ms, or too few taps heard), rhythm takes are shown as "couldn't tell" and not counted.
- **During a take**, the count-in clicks are muted out of the analysis and no click plays while the learner taps.

## Benchmark (tools/bench-listen)

How it was run:
- Command: `node tools/bench-listen/run.mjs`, in headless Chromium 153 on a Linux x86-64 container (software WebGL).
- Material: real VCSL piano and drum samples (CC0, the same files Carmen plays).
- Noise: white noise added at an SNR measured against the whole clip.

**Pitch:** 37 single piano notes, C3 to C6, alternating soft and loud samples.

| Condition | Carmen (YIN + onsets) correct / unclear / wrong | Pitchy 4.1.0 correct / unclear / wrong* | Basic Pitch 1.0.1 correct / wrong |
|---|---|---|---|
| Clean | 35 / 2 / 0 | 37 / 0 / 0 | 37 / 0 |
| Noise 20 dB | 35 / 2 / 0 | 37 / 0 / 0 | 37 / 0 |
| Noise 10 dB | 35 / 2 / 0 | 35 / 2 / 0 | 37 / 0 |
| Time per 1.2 s clip | 18 ms | 5 ms | 1,600–1,800 ms |

\* Pitchy was given the true note start (it does no onset detection). Carmen had to find the onset itself.

**Taps:** 80 drum hits per condition (kick, snare, hi-hat, clave, low tom). Each drum is normalised to the same peak, with a random strength from 0.4 to 1.0.

| Condition | Found | Extra | Median timing error | 95th percentile |
|---|---|---|---|---|
| Clean | 80 / 80 | 0 | 0.1 ms | 5.6 ms |
| Noise 20 dB | 67 / 80 | 0 | 0.1 ms | 5.4 ms |
| Noise 10 dB | 66 / 80 | 0 | 0.6 ms | 5.4 ms |

**Basic Pitch** load cost:
- 0.5 to 0.7 s to load the model.
- The model files are about 0.9 MB, plus the TensorFlow.js runtime (266 MB of node_modules; the bundled size would be well over 1 MB).

The onset thresholds were tuned on this benchmark: rise 7 dB and 10 dB above the floor, instead of 8 and 14. The tuning used a grid that scored hits found, phantom taps on drums, phantom taps on sustained piano notes, and phantom taps on noise alone. The chosen setting gives no phantom taps in any of the grid's tests. Missed taps under heavy noise are the cost.

### Choice

- **Carmen's own YIN analyser is used in the app.**
  - Its accuracy matches Pitchy on these samples.
  - It finds its own onsets and reports doubt as "unclear" rather than a wrong note.
  - It needs no new dependency, and it is fast enough for real-time work: about 2% of real time per note on this machine, with pitch frames analysed every second hop.
- **Pitchy** (MIT at 4.1.0; the current repository says 0BSD) is a good fallback if YIN proves weak on real phones. Swapping it in is a one-line change (`detect` option).
- **Basic Pitch is not shipped.**
  - It is accurate, but here it takes longer than real time (about 1.4× the clip length with software WebGL) and loads a large runtime.
  - It is a candidate for later offline review of a whole phrase (polyphonic) on capable devices, not for live feedback.

## Licences (checked 10 Nov 2026)

| Item | Licence | Source checked | Used? |
|---|---|---|---|
| Basic Pitch TS code | Apache-2.0 | npm package LICENSE; github.com/spotify/basic-pitch-ts | Benchmark only |
| Basic Pitch model weights | Shipped inside the Apache-2.0 npm package; no separate weights licence is stated | npm package `model/` | Benchmark only |
| Pitchy 4.1.0 | MIT (package LICENSE); the repository now states 0BSD | npm package; github.com/ianprime0509/pitchy | Benchmark only |
| fft.js (Pitchy dependency) | MIT | npm package | Benchmark only |
| VCSL samples | CC0 | ASSETS.md | Yes |
| GuitarSet | CC BY 4.0, 8.2 GB | zenodo.org/records/3371780 | No. Candidate for evaluating guitar single notes; too large to fetch in this environment |
| E-GMD | CC BY 4.0, 444 h, 90 GB | magenta.tensorflow.org/datasets/e-gmd | No. Candidate for evaluating tap onsets on real kits |
| IDMT-SMT-Guitar | CC BY-NC-ND 4.0, "provided for evaluation purpose" | idmt.fraunhofer.de | **Not used.** Non-commercial and no-derivatives terms; not to be used for product training |

No learner audio is used for training. No model is trained on audio at all: the listener is signal processing.

## Evaluation still to do (design)

- Collect beginner attempts with consent:
  - single piano notes and tapped rhythms on a range of phones, in classrooms;
  - the teacher writes what was actually played (the "teacher-reviewed interpretation").
- Score:
  - detection: correct / unclear / wrong;
  - timing error after calibration.
- Report phone and room results separately from this synthetic benchmark.
- Keep each performance out of any tuning set.
- To judge teaching, check whether the support Carmen chose helps on a **fresh related task**, not on a retry of the same phrase.

## Not verified

- Real iPhone and Android microphones:
  - latency;
  - whether Safari honours `echoCancellation: false`;
  - AudioWorklet timing on iOS.
- Real rooms (talking children, other instruments), acoustic pianos and real guitars.
- CPU and battery cost on low-end phones.
