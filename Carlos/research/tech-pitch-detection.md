# Tech note: on-device pitch and onset detection for the practice coach

- Date: Fri 6 Nov 2026 (AEDT), overnight draft.
- Purpose: pick the pitch and onset tracker for Saturday's build (R1, R4, R8, R11, R12).
- Scope: voice and single keyboard notes, browser web app, phone and laptop, offline-capable.
- Status: overnight draft for the team; verify before the pitch. Recommendation: Pitchy primary, SwiftF0 fallback.

## 1. Recommendation
- Primary: Pitchy (McLeod pitch method), plain JS, no model, permissive licence [1][2].
  o Package is 33 KB unpacked; main file 18 KB; one dependency (fft.js) [1][27].
  o Measured tonight: 0.06 ms compute per 2048-sample frame on a desktop CPU [M1].
  o That is compute only; the frame itself holds 42.7 ms of audio, and smoothing adds about 80 ms more.
  o Synthetic test: every note named right, voice E2 to A5, piano A1 to C7, zero octave errors [M1].
  o Needs no GPU, no WebAssembly, no download beyond the app; works the same offline.
- Fallback (an accuracy upgrade, chosen on Saturday data, not an automatic switch): SwiftF0 on ONNX Runtime Web, MIT, 135 KB model [3][4].
  o Provenance flag: its training data is released CC BY-NC-SA 4.0 for research use; check before shipping the weights [28].
  o Highest pitch F1 of 19 trackers, tied with RMVPE, in its author's own benchmark (not independent) [3].
  o Streaming needs 176 ms lookahead, so the live line lags; fine for the proof screen [3].
  o Its browser demo runs fully client side with a 4.6 MB runtime WASM file [4].
  o The demo runs ONNX Runtime single-threaded on the WASM backend in a worker: no special server headers [4].
- Emergency fallback if a bundling problem blocks Pitchy: plain autocorrelation in about 50 lines (cwilso demo, MIT) [14].
- Avoid for the entry: GPL, AGPL, non-commercial or custom licences (IP goes to a university and sponsor).
  o pitchfinder (GPL-3), aubio.js core (GPL-3), Essentia.js (AGPL-3), SPICE (CC BY-NC 4.0), ml5 (custom) [5]-[9].
  o Assigned IP covers the team's code only; third-party packages keep their licences: keep a notices file.
  o Pitchy has no trained weights, so no training-data question at all; neural options all carry one.
- Keyboard: a real keyboard through the microphone uses the same tracker; report the note name, not cents.
  o Web MIDI would be exact, but iOS Safari does not support it; Android Chrome does [16].

## 2. Library comparison
| Option | Method | Licence | Size | Voice | Keyboard note | Live? | Last release | Status |
|---|---|---|---|---|---|---|---|---|
| Pitchy | McLeod (MPM) | MIT on npm 4.1.0; repo now 0BSD | 33 KB | Good | Good | Yes | 4.1.0, 4 Jan 2024 | Repo pushed 5 Nov 2026 [1][2] |
| SwiftF0 | Small CNN on spectrogram, 14,386 params, 16 kHz | MIT | 135 KB model + 4.6 MB runtime | Very good (author benchmark) | Good (46.9 to 2,093.8 Hz) | Yes, 176 ms lookahead | Repo pushed 25 Sep 2026 | Active [3][4] |
| CREPE (TF.js) | CNN on 1,024 samples at 16 kHz | MIT | 1.96 MB web model + 1.47 MB tf.min.js | Very good (equal or better than pYIN, paper) | Good | Yes, heavier | Python repo pushed Aug 2024; web demo uses TF.js 0.8 | Research code [10][27] |
| ml5.js pitchDetection | CREPE wrapper | Custom ml5 licence (code-of-conduct terms) | TF.js + 1.96 MB model | Very good | Good | Yes | Only legacy 0.12.2 (25 Apr 2022); ml5 1.x has no pitch module | Legacy [9][11] |
| Spotify Basic Pitch (TS) | CNN note transcription, polyphonic, 22.05 kHz | Apache-2.0 | 0.92 MB model | Good (includes vocals) | Good, chords too | Windowed, after the take | 1.0.1, 5 Aug 2022 | Quiet since May 2023 [12] |
| SPICE (TF.js) | Self-supervised CNN, 16 kHz | CC BY-NC 4.0 | 8.1 MB download archive | Good (trained on sung audio) | Unsure | Yes | Published 2020 | Do not use: non-commercial [8] |
| aubio.js (aubiojs) | aubio YIN and others in WASM | Wrapper MIT; aubio core GPL-3 | 427 KB | Good | Good | Yes | 0.2.1, 8 Nov 2022 | Repo pushed Aug 2023 [6] |
| Essentia.js | WASM YIN, pYIN, onsets | AGPL-3.0 | 10 MB unpacked | Good | Good | Yes | 0.1.3, 24 Jun 2021 | Repo pushed Dec 2025 [7] |
| pitchfinder | YIN (from aubio code), McLeod, AMDF, wavelet | GPL-3 ("GNU v3" on npm) | 229 KB | Good | Good | Yes | 2.3.4, 16 Dec 2025 | Active [5] |
| @audio/pitch | YIN, McLeod, pYIN, SWIPE, others | MIT in package.json; repo licence non-standard | 58 KB | Untested | Untested | Yes | 2.0.4 (2026) | New, 2 stars [13] |
| Plain autocorrelation (cwilso PitchDetect) | Autocorrelation | MIT | Tiny | Fair | Fair | Yes | Pushed Sep 2022 | Demo code [14] |
| Meyda | Features only (RMS, spectral flux) | MIT | 16 KB min | No pitch | No pitch | Yes | 5.6.3, 21 Apr 2024 | Use for onsets [15][27] |

- "Good / very good" is a class judgement from method and papers, not a measured score on our phrase.
- Latency per frame: only Pitchy measured, on a desktop; phone timings are `unverified`, expect several times slower.
- pYIN in JS: only @audio/pitch (new, untested) and Essentia.js (AGPL) found; no mature permissive option.
- Sizes are raw bytes; servers compress JS and WASM further.

### M1: what the synthetic test showed (Pitchy 4.1.0, Node 24, desktop)
| Signal | Notes tried | Right note | Octave errors | Mean error | Note |
|---|---|---|---|---|---|
| Sine, clean / light noise | 42 | 42 / 42 | 0 | 0.0 / 2.4 cents | Baseline |
| Voice-like, 10 harmonics, steady | 42 | 42 / 42 | 0 | 0.0 / 1.0 cents | E2 to A5 |
| Voice-like with vibrato +-30 cents | 42 | 42 / 42 | 0 | 30 cents | Reading follows the vibrato; smooth over 100 to 200 ms |
| Piano-like, weak fundamental, stretched partials | 64 | 64 / 64 | 0 | 16 cents | Stretch shifts the reading; name the note, skip cents |
- Synthetic tones are kinder than a real room, a phone microphone or guide-tone bleed; section 9 is the real check.

## 3. Onset and timing ("did the note start on the beat")
- Keyboard: energy onset is enough; a piano attack is a sharp jump.
  o Every 10 ms compute RMS; flag an onset when it jumps well above the last 50 ms; ignore 100 ms after.
  o Spectral flux (Meyda spectralFlux) is the textbook upgrade for soft attacks [15][26].
- Voice: use the pitch onset, not the energy onset.
  o Onset = earliest frame of a run of about 80 ms with clear, steady pitch after silence.
  o Consonants and breath fire energy detectors early; but a consonant can be heard as the start too.
  o Both rules are hypotheses: check them against a few hand-marked recordings before scoring anyone late.
- Timing chain for the beat check:
  o Schedule clicks on AudioContext.currentTime; time input frames by sample count inside an AudioWorklet.
  o The AnalyserNode loop in section 8 ticks at screen rate (about 16 ms jitter); fine for pitch, rough for beats.
  o outputLatency estimates output delay and varies by device [25]; nothing reports microphone delay.
  o Calibrate once by loopback: play 8 clicks through the speaker, detect them in the microphone; the median offset is the round trip.
  o Tap-along calibration is simpler but mixes in human reaction time; use it only as a fallback.
  o Bluetooth earphones add large delay; recalibrate or ask for wired or speaker (size `unverified`).
- Tolerance (how late is "late") is a team choice; start wide for beginners and tighten later.

## 4. Browser support
| Feature | iOS Safari | Android Chrome | Note |
|---|---|---|---|
| getUserMedia (microphone) | Yes since 11; installed apps failed only on 11.0 to 11.2 | Yes | HTTPS required [16] |
| AudioWorklet | Safari 14.1+ | Chrome 66+ | Mobile mirrors desktop [17] |
| WebAssembly / SIMD / threads | Yes / 16.4+ / 14.5+ | Yes | Threads need COOP and COEP headers [16] |
| WebGL2 / WebGPU (for TF.js) | 15+ / 26+ | Yes / Yes | Pitchy needs neither [16] |
| outputLatency / baseLatency | 18.4+ / 14.1+ | Chrome 102+ / 58+ | Beat alignment [17] |
| navigator.audioSession | 16.4+, experimental | No | Silent-switch workaround [18] |
| Screen Wake Lock | Yes | Yes | Keeps the screen on during a take [16] |
| Web MIDI | No | Yes | Keyboard by cable only on Android or laptop [16] |

- Screen lock and background: assume the microphone stops.
  o Reports: iOS ends the audio track after backgrounding; Home Screen apps lose it at once [21].
  o Fix: Wake Lock during a take; on visibilitychange re-run getUserMedia and resume the context [21].
  o requestAnimationFrame pauses in a hidden tab, so the section 8 loop stops by design.
- iOS silent switch: Web Audio defaults to "ambient" and goes quiet when muted [18].
  o Set navigator.audioSession.type = "play-and-record" before the guide tone and microphone; test it [18].
  o Matters for R8 (guide tone); the microphone itself still works.
- Sample rate: never assume 44.1 kHz; always pass ctx.sampleRate to the tracker.
  o WebKit reports: one shared rate across the page; distortion after getUserMedia until reload [22].
  o A wrong rate shifts every reading by a fixed amount; log the rate on the debug screen.
- Voice processing: request echoCancellation, noiseSuppression and autoGainControl off [24].
  o Plain false is a preference, not a guarantee; read the track settings back to confirm [24].
- Permission prompts: Home Screen apps can re-prompt for camera and microphone [23].
  o A WebKit report ties re-prompts to hash-route changes in Home Screen apps; avoid hash routing [23].
  o For the demo, run in a Safari tab, not an installed app, unless offline is being shown.
- AudioContext must start inside a tap on both platforms (the "Start" button in section 8).

## 5. Offline and model size
| Stack | Initial load added | Fits a low-end phone? |
|---|---|---|
| Pitchy | 18 KB + fft.js | Yes, trivially |
| SwiftF0 + ONNX Runtime Web | 135 KB model + 4.6 MB demo runtime (14.8 MB for the stock 1.31.1 threaded WASM) | Yes; use the smaller build |
| CREPE + TF.js | 1.96 MB model + 1.47 MB tf.min.js | Download yes; CPU per frame `unverified` |
| Basic Pitch + TF.js | 0.92 MB model + TF.js | Yes; after-take use only |
- Sizes from [4][10][12][27]; low-end CPU speed is `unverified` until the Saturday phone test.
- Pattern: a service worker precaches index.html, the JS bundle and any model file at install.
  o Self-host every file; no CDN at runtime; the initial visit needs a connection.
  o Test: load once, airplane mode, close the tab, reopen; the loop must still run.
- Quota is not the problem: Safari 17+ and Chrome allow an origin up to about 60% of disk [19][20].
  o Eviction is per origin and best effort; call navigator.storage.persist() [19][20].
  o Safari deletes script-made data after 7 days without interaction when tracking prevention is on [20].
  o So an app unused for a week may re-download; keep the bundle small (Pitchy wins again).
- R11: audio never leaves the device in this stack; nothing is uploaded unless the learner shares.

## 6. Range check maths (R4)
| Quantity | Formula | Example |
|---|---|---|
| Note number from Hz | m = 69 + 12 log2(f / 440) | 196 Hz gives 55 (G3) |
| Hz from note number | f = 440 x 2^((m - 69) / 12) | 57 gives 220 Hz (A3) |
| Cents off target | c = 1200 log2(f / f_target) | 200 Hz against 196 Hz gives +35 |
| Note name | NAMES[m mod 12] + (floor(m / 12) - 1) | 60 gives C4 |
| Allowed key shift k (semitones) | V_low - S_low <= k <= V_high - S_high | Voice 45 to 65, song 52 to 67: k from -7 to -2 |
| Best shift | k = round(voice centre - song centre), kept inside the allowed range | 55 - 59.5 = -4.5, so -4 or -5 |
- V = learner's full notes; S = song's lowest and highest melody note; no allowed k means pick an easier phrase.
- Finding "full notes" from a siren (team heuristic, to tune Saturday):
  o Keep frames with clarity of 0.9 or more and level above the room noise from the set-up check.
  o A siren glides, so it gives the extent, not held notes; then ask: "hold your lowest note", "hold your highest".
  o A note counts as full when it stays within 50 cents of one semitone for 300 ms or more.
  o Low = lowest full note; high = highest full note; plain words: "this song fits you 4 notes lower".
  o Above-range flag (R4): any target note above the learner's high full note gets "above your range for now".

## 7. Decision table against the requirements
| Requirement | Pitchy (primary) | SwiftF0 (fallback) | CREPE TF.js | Basic Pitch |
|---|---|---|---|---|
| R1 listen live | Yes: under 0.1 ms a frame on desktop, 43 ms window | Yes, 176 ms lag | Yes, heavier | No: after the take |
| R4 range check and key | Yes, clarity gates noisy frames | Yes, confidence per frame | Yes | Partly: note list |
| R8 pitch guide | Yes, guide tone plus live line | Line lags the guide | Yes | No |
| R11 audio on device | Yes | Yes | Yes | Yes |
| R12 offline | Yes, about 20 KB | Yes, about 5 MB | Yes, about 3.5 MB | Yes |
| Build risk on Saturday | Lowest: one import | Medium: copy the demo's worker code | Medium: old demo code | Medium |
| Licence for university and sponsor IP | MIT / 0BSD | MIT; ONNX Runtime Web MIT | MIT | Apache-2.0 |
| Training-data provenance | None (no weights) | Flag: CC BY-NC-SA research data [28] | Trained weights: not checked | Trained weights: not checked |

## 8. Minimal code snippet (UNTESTED in a browser)
- Logic run in Node tonight with mocked audio [M2]: 40 cents flat rejected; a 100 ms silence and a 100 ms off-tune slip pause the count without adding to it; done after 2.0 s of in-tune time.
- Revised after the Codex critique: only in-tune time counts; the context starts inside the tap; one stream per tap; error message shown.
- Voice band only (60 to 1,500 Hz); low piano notes need a 4096-sample window (85 ms), since A1 gives only 2.35 cycles in 2048.
- Not yet run on a real microphone, phone or browser; thresholds marked "team choice" need tuning.

```js
// UNTESTED in a browser. Needs <button id="go"> and <div id="out"> and HTTPS (or localhost).
import { PitchDetector } from "https://cdn.jsdelivr.net/npm/pitchy@4.1.0/+esm"; // demo only: bundle locally for offline

const TARGET_MIDI = 57;    // A3, the note the learner should sing
const IN_TUNE_CENTS = 25;  // team choice: within +-25 cents counts as on the note
const HOLD_MS = 2000;      // two seconds of in-tune singing
const GRACE_MS = 150;      // team choice: a gap this short pauses the count, a longer one resets it
const NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const hzToMidi = (hz) => 69 + 12 * Math.log2(hz / 440);
const noteName = (m) => { const r = Math.round(m); return NAMES[((r % 12) + 12) % 12] + (Math.floor(r / 12) - 1); };

async function start(onUpdate) {
  const ctx = new AudioContext();                     // create and resume inside the tap (iOS)
  ctx.resume();
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false },
  });
  const analyser = ctx.createAnalyser();
  analyser.fftSize = 2048;                            // 42.7 ms at 48 kHz; voice range, not low piano
  ctx.createMediaStreamSource(stream).connect(analyser);
  const buf = new Float32Array(analyser.fftSize);
  const detector = PitchDetector.forFloat32Array(buf.length);
  detector.minVolumeAbsolute = 0.005;                 // team choice: RMS gate, set from the room-noise check
  const recent = [];                                  // last 5 readings, median-smoothed
  let heldMs = 0, lastTick = performance.now(), lastGood = 0;
  document.addEventListener("visibilitychange", () => { heldMs = 0; recent.length = 0; });

  function tick() {
    analyser.getFloatTimeDomainData(buf);
    const [hz, clarity] = detector.findPitch(buf, ctx.sampleRate); // always pass the real rate
    const now = performance.now(), dt = Math.min(now - lastTick, 50); // cap: a paused tab adds nothing
    lastTick = now;
    if (clarity >= 0.9 && hz > 60 && hz < 1500) {    // team choice: clarity gate; voice band only
      recent.push(hzToMidi(hz)); if (recent.length > 5) recent.shift();
      const midi = [...recent].sort((a, b) => a - b)[Math.floor(recent.length / 2)];
      const centsOff = Math.round((midi - TARGET_MIDI) * 100);
      if (Math.abs(centsOff) <= IN_TUNE_CENTS) { heldMs += dt; lastGood = now; } // only in-tune time counts
      else if (now - lastGood > GRACE_MS) heldMs = 0;
      onUpdate({ sung: noteName(midi), target: noteName(TARGET_MIDI), centsOff, heldMs, done: heldMs >= HOLD_MS });
    } else {
      if (now - lastGood > GRACE_MS) { heldMs = 0; recent.length = 0; }
      onUpdate({ sung: null });
    }
    requestAnimationFrame(tick);                      // about 60 checks a second while visible
  }
  tick();
}

const go = document.querySelector("#go");
go.addEventListener("click", () => {
  go.disabled = true;                                 // one stream, one loop
  start((r) => {
    document.querySelector("#out").textContent = r.sung === null ? "listening..." :
      `${r.sung} (target ${r.target}) ${r.centsOff > 0 ? "+" : ""}${r.centsOff} cents, ` +
      `held ${(r.heldMs / 1000).toFixed(1)} s${r.done ? " - held for two seconds!" : ""}`;
  }).catch((e) => { go.disabled = false; document.querySelector("#out").textContent = "Microphone error: " + e.message; });
});
```

## 9. Saturday test plan (30 minutes, one phone, one laptop)
| Minutes | Step | Pass mark (team choice) |
|---|---|---|
| 0 to 5 | Serve the page over HTTPS to both devices (localhost works only on the laptop itself) | Both show "listening..." after the tap |
| 5 to 10 | Debug line shows ctx.sampleRate and applied mic settings; play A3 and C4 from a keyboard or tuner app | Right note; within 10 cents of a reference tuner |
| 10 to 18 | Target phrase note: sing and hold it 2 s, five times per device; then twice a semitone flat on purpose | 5 of 5 held; both flat takes rejected |
| 18 to 23 | Keyboard: every third note C3 to C5 through the microphone | Right note name, no octave errors |
| 23 to 27 | Siren plus "hold lowest, hold highest"; compare with a tuner reading | Range within one semitone of the tuner |
| 27 to 30 | Airplane mode reload; lock screen and return; iOS silent switch on with a guide tone | Loop runs offline; mic recovers; note what fails |
- Add if time allows: noisy room, quiet singer, guide tone playing through the speaker, repeated keyboard notes.
- Record results in a table per device; a pitch-accuracy fail triggers a SwiftF0 trial, other fails get a demo workaround.
- Demo safety: laptop Chrome as the stage device; the phone is the "it works in your pocket" proof.

## Method
- Codex 1: gpt-6-sol, medium, knowledge draft; kept licence leads (SPICE NC, ml5 custom, aubio GPL), each re-checked on the web; replaced its unsure sizes with measured files.
- Codex 2: gpt-6-sol, high, critique of the full draft. Kept after checking: hold-timer bug (fixed, re-run), iOS tap activation (fixed), Pitchy volume gate maths (confirmed in source: 10^(dB/10) on RMS, so switched to an absolute gate), A1 window limit, offline CDN import, onset rules as hypotheses, loopback over tap calibration, SwiftF0 training-data provenance (confirmed, [28]), SwiftF0 as a data-driven not automatic fallback. Not adopted: none rejected outright; the AudioWorklet timing chain stays a described design, not built.
- npm registry and GitHub API read for every package: version, date, licence, size; CDN file sizes fetched.
- Browser support from caniuse data (Nov 2026 build) and MDN browser-compat-data, read directly.
- M1: synthetic accuracy and speed test of Pitchy 4.1.0, Node 24, AMD Ryzen 9 9950X3D desktop; script kept in scratch, not here.
- M2: section 8 snippet run in Node with a mocked microphone (scripted 40 cents flat, then on note with a 100 ms gap).

## Open questions
- Devices: who brings an iPhone and an Android phone on Saturday? Both platforms need the 30-minute test.
- Hosting for the phone test: an HTTPS page (Carlos pushes) or a local HTTPS server with a test certificate?
- Keyboard in the demo: real keyboard through the microphone, Web MIDI on the laptop, or an on-screen keyboard?
- Thresholds: in-tune band (25 cents?), hold time (2 s), beat lateness window; set from Saturday data, not guesses.
- Offline on stage: show airplane mode live, or state it and keep it for questions?
- Licence: confirm the Participant Agreement accepts MIT, 0BSD and Apache-2.0 dependencies with notices kept.
- Accuracy: SwiftF0's lead rests on its author's benchmark; worth one independent check before any accuracy claim.
- Phone speed: Pitchy and SwiftF0 per-frame time on a low-end Android is unmeasured.

## Sources
- All accessed 2026-11-06 (AEDT).
1. Pitchy on npm (registry metadata: version, date, licence, size), https://www.npmjs.com/package/pitchy, opened
2. Pitchy repository, README and licence, https://github.com/ianprime0509/pitchy, opened
3. SwiftF0 repository README (params, benchmark, lookahead, range, MIT), https://github.com/lars76/swift-f0, opened
4. SwiftF0 browser demo repository (file tree: model.onnx 135,090 B; ORT WASM 4,604,319 B), https://github.com/swift-f0/swift-f0.github.io, opened
5. pitchfinder on npm ("GNU v3") and README (YIN from aubio), https://github.com/peterkhayes/pitchfinder, opened
6. aubiojs repository (MIT wrapper), https://github.com/qiuxiang/aubiojs ; aubio (GPL-3.0), https://github.com/aubio/aubio, opened
7. Essentia.js repository and npm (AGPL-3.0), https://github.com/MTG/essentia.js, opened
8. SPICE model card on Kaggle ("CC BY-NC 4.0"), https://www.kaggle.com/models/google/spice, opened (via Kaggle API)
9. ml5.js licence text, https://github.com/ml5js/ml5-next-gen/blob/main/LICENSE.md, opened
10. CREPE repository and web demo (model 1,964,037 B; TF.js 0.8), https://github.com/marl/crepe ; paper https://arxiv.org/abs/1802.06182, opened
11. ml5 npm versions and ml5-next-gen source modules (no pitch module), https://www.npmjs.com/package/ml5 ; https://github.com/ml5js/ml5-next-gen, opened
12. Basic Pitch TS repository (model 916,929 B, 22,050 Hz), https://github.com/spotify/basic-pitch-ts ; paper https://arxiv.org/abs/2203.09893, opened
13. @audio/pitch repository and package.json, https://github.com/audiojs/pitch, opened
14. cwilso PitchDetect repository metadata (MIT), https://github.com/cwilso/PitchDetect, opened
15. Meyda repository and npm (MIT, 5.6.3), https://github.com/meyda/meyda, opened
16. caniuse data (stream, wasm, wasm-simd, wasm-threads, webgl2, webgpu, sharedarraybuffer, wake-lock, midi), https://github.com/Fyrd/caniuse, opened
17. MDN browser-compat-data (AudioWorklet, AudioContext.outputLatency, baseLatency), https://github.com/mdn/browser-compat-data, opened
18. MDN compat for AudioSession (Safari 16.4, experimental), same repository, opened; WebKit bug 251532 and 264473 on silent switch, https://bugs.webkit.org/show_bug.cgi?id=251532, snippet
19. WebKit, "Updates to Storage Policy" (10 Aug 2023), https://webkit.org/blog/14403/updates-to-storage-policy/, opened
20. MDN, Storage quotas and eviction criteria, https://developer.mozilla.org/en-US/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria, opened
21. WebKit bugs on microphone in background, https://bugs.webkit.org/show_bug.cgi?id=226620 ; https://bugs.webkit.org/show_bug.cgi?id=204681, snippet
22. WebKit bugs on sample rate and distortion, https://bugs.webkit.org/show_bug.cgi?id=251091 ; https://bugs.webkit.org/show_bug.cgi?id=154538, snippet
23. WebKit bug 215884, re-prompts in standalone mode, https://bugs.webkit.org/show_bug.cgi?id=215884, snippet
24. MDN, MediaTrackConstraints.echoCancellation, https://developer.mozilla.org/en-US/docs/Web/API/MediaTrackConstraints/echoCancellation, opened
25. MDN, AudioContext.outputLatency, https://developer.mozilla.org/en-US/docs/Web/API/AudioContext/outputLatency, opened
26. Bello et al., "A Tutorial on Onset Detection in Music Signals", IEEE TSAP 13(5), 2005, doi 10.1109/TSA.2005.851998, snippet
27. jsDelivr file sizes: tf.min.js 4.22.0 (1,469,843 B), ort-wasm-simd-threaded.wasm 1.31.1 (14,848,852 B), pitchy index.js (18,393 B), meyda.min.js (16,094 B), https://www.jsdelivr.com/, opened
28. SwiftF0 training repository (dataset CC BY-NC-SA 4.0, research use), https://github.com/lars76/swift-f0-training ; dataset card https://huggingface.co/datasets/lars1234/pitch-benchmark, opened
- M1, M2: measurements by this session, scripts in the run's scratch folder (not in the repo).
