# Tech note: keyboard input and feedback for the demo

- Date: Fri 6 Nov 2026 (AEDT), overnight draft.
- Purpose: decide how the keyboard path takes input and shows "what you should have played" (R1, R3, R8, R12, R17).
- Recommendation: a 25 to 32 key USB MIDI keyboard into Chrome, with on-screen keys as the built-in fallback; lit keys plus a simple piano roll for feedback.
- Status: overnight draft for the team; verify before the pitch.

## 1. Recommendation
- Input on stage: a class-compliant USB MIDI keyboard into Chrome over a cable (Option B).
  o Discrete note events (pitch, velocity, time), no microphone guessing in a noisy hall; offline once cached (R12, cold-reload test needed).
  o Cheapest found: Korg nanoKEY2 (25 keys) about A$91 to A$129; M-Audio Keystation Mini 32 MK3 about A$98 (sources 9 to 12).
- Same screen also takes touch input: on-screen keys are the fallback and the "no instrument" path (Option A).
  o Fits the idea as it stands: "on a phone, with or without an instrument" (state-of-play section 2).
- Option C (real keyboard heard by the microphone) is the vision for home pianos; hand over to tech-pitch-detection.md.
- Stage device: a laptop running Chrome, wired to the projector, is the fewest-links set-up; a tablet is the story device (section 8).
- iPad is the weak point: no Web MIDI in Safari on any version (source 1); on iPad use on-screen keys; a Web MIDI browser app only after a device test.
- Feedback screen for a beginner: lit keys for the next note, a piano roll with "expected" ghost bars and "played" solid bars on one beat grid.
  o Staff notation (VexFlow, MIT) only as an optional toggle; a child beginner starts with lit keys.
- Sound: smplr (MIT) or Tone.js (MIT) with the Salamander Grand Piano samples (CC BY 3.0) cached for offline use; credit the samples.

## 2. Option A: on-screen keyboard on a tablet or phone
| Factor | Finding | Source |
|---|---|---|
| Touch to app | Touch latency on modern Android 10 to 35 ms, 20 ms typical | 15 |
| Audio round trip | Average of 20 popular Android phones: 109 ms (Jan 2017) to 39 ms (Jan 2021) | 15 |
| Tap to tone (estimate) | Google's rule: round trip plus about 15 ms, so roughly 54 ms on a 2021 average phone (our arithmetic, native apps, not browser) | 15 |
| Browser audio | AudioContext latencyHint default "interactive"; browser may ignore it; read baseLatency to see the real value | 17 |
| Multi-touch | navigator.maxTouchPoints reports the limit; phones "typically 5" | 19 |
| Haptics | Vibration API works in Chrome for Android; not supported in Safari on iOS (all listed versions) | 20 |
| Pointer Events | Full support in Safari iOS from 13.2, Chrome for Android, Firefox 59+; 97.5% global | 49 |
| Polyphony | No browser-imposed chord limit found; touch points and the sound engine's voices set the limit | unverified |

- Key size versus hands:
  o Real piano white key about 23.5 mm wide; octave 164 to 165 mm (source 23).
  o Touch target guidance: at least 1 cm by 1 cm (Parhi et al. 2006 via NN/g); fingertips 1.6 to 2 cm wide (source 21).
  o WCAG 2.2 AA minimum 24 by 24 CSS px; Apple 44 pt and Material 48 dp for controls (sources 22, 24).
  o Young children tap less accurately; they need large controls (source 21). No touch-specific child key size found.
- What fits on a tablet (our arithmetic from Apple specs: iPad 10th gen, 2360 px at 264 ppi, about 227 mm wide in landscape, source 25):
| Layout | White keys | Key width | Verdict |
|---|---|---|---|
| Two octaves C to C | 15 | about 15 mm | Fine for adults; tight for a 7-year-old |
| One octave plus a fifth | 12 | about 19 mm | Good middle ground |
| One octave C to C | 8 | about 28 mm | Larger than a real key; best for a child |
- Phone: a long side of about 14 to 15 cm (assumed, unverified) gives 8 white keys at about 18 mm.
- Design rules for the demo layout:
  o Landscape only; one octave plus a fifth by default; octave shift buttons.
  o Track each finger with Pointer Events (pointerdown, pointermove, pointerup, pointercancel by pointerId); one sounding note per pointerId.
  o Set touch-action: none on the keyboard, or the browser may pan or zoom and fire pointercancel (source 51).
  o Touch browsers capture the pointer on pointerdown, so pointerenter does not fire on the next key; hit-test pointermove coordinates for slides (source 51).
  o Start audio only after a tap (browsers block audio until a user gesture; sources 26, 27).
  o Haptic tick on Android only; never rely on it.

## 3. Option B: a cheap USB or Bluetooth MIDI keyboard
### Price band (AUD, Australian retailers, accessed 2026-11-06)
| Model | Keys | Price seen | Connection | Source |
|---|---|---|---|---|
| Korg nanoKEY2 | 25 low-profile, velocity | A$91 (Liveschool, snippet); A$109 (Billy Hyde, snippet); A$129 (Mannys, opened) | USB, bus-powered; iPad via Camera Connection Kit per Korg (not guaranteed) | 9, 10, 11, 46 |
| M-Audio Keystation Mini 32 MK3 | 32 mini | A$97.95 (Scarlett, snippet); A$99 (Joondalup, sold out, snippet) | USB | 12 |
| Akai MPK Mini IV | 25 mini | A$179 at several stores (snippet) | USB; MK3 is "class-compliant, plug-and-play", no driver (Akai FAQ) | 13, 14 |
| Korg microKEY2 Air 25 | 25 mini | A$149 (Liveschool, Turra; snippet) to A$219 (Mannys, snippet) | USB plus Bluetooth LE MIDI; 2 AA batteries | 16 |
| ESI Xkey Air 25 | 25 full-size | price not checked | "Fully class compliant, USB and Bluetooth MIDI"; Android named | 18 |
- Band: about A$90 to A$130 for a USB-only 25 to 32 key controller; A$150 to A$220 with Bluetooth.
- Class compliant means no vendor driver to install; it does not prove USB power, host support or Chrome access. Most new Android apps support only class-compliant devices (Android MIDI developer, Google Group, snippet; source 30).
- Akai warns the MK3 has no low-power mode for iOS; a powered hub may be needed (source 14).

### Web MIDI support (caniuse, accessed 2026-11-06)
| Browser | Web MIDI | Note |
|---|---|---|
| Chrome desktop | Yes, from 43 | Permission prompt for all Web MIDI: rollout from Chrome 124, all users by 125 (sources 3, 50) |
| Edge | Yes, from 79 | Chromium |
| Firefox desktop | Yes, from 108 | |
| Chrome for Android | Yes (current version listed) | Device needs USB host (OTG) |
| Samsung Internet | Yes, from 4 | |
| Safari macOS | No | Third-party extension only (Safari 18.4+), not WebKit |
| Safari iOS / iPadOS | No, all listed versions | Every iPad browser in Australia runs on WebKit; alternative engines are EU-only and none had shipped by June 2026 (source 48) |
- Requirements: secure context (HTTPS or localhost); user permission; may be blocked by the "midi" Permissions Policy (source 2).
- Note input needs no sysex; ask for sysex only if needed (sources 2, 3).
- Android platform: MIDI support optional since Android 6.0; USB host, BLE and virtual transports (source 7).
- Reports of Chrome Android with USB MIDI are mixed and device-specific (2016 to 2020 threads; source 31, snippet); a May 2026 help page says it works on Android if the tablet acts as a USB host (source 47, snippet). Test the exact tablet.
- Bluetooth MIDI on Android: pairing usually goes through a separate app (Android's MIDI BLE Connect) before Chrome sees the device (sources 8, 32, snippet).

### iOS workarounds
| Option | What it is | Status |
|---|---|---|
| Web MIDI Browser (Takashi Mizuhiki) | Free iPad/iPhone browser that exposes Web MIDI and Bluetooth MIDI to web apps | Last version 1.0.6, March 2016; 16 ratings (opened, source 5) |
| MIDIWeb Browser (5of12 LLP) | Free browser for WebMIDI sites; iOS 17.6+; "Open Site as App" | Version 2.1, recent (opened, source 6) |
| Laptop as host | Keyboard into a laptop running Chrome; iPad shows the same app or is not used | No dependency on Apple |
| Native wrapper | Capacitor or similar app with a native MIDI plugin | Too much for Wednesday (unverified effort) |

## 4. Option C: a real keyboard heard through the microphone
- Strength: no cable, works on any acoustic or digital piano at home or in a school hall.
- Limits for the demo:
  o Single notes are tractable; chords are much harder (trend-check-music-learning.md: one vendor claims 99% for two notes, 90% for three, by mic).
  o flowkey's own reply to a user: MIDI makes "note detection 100% precise"; the user found the mic unreliable for chords (source 34, opened).
  o A noisy venue adds risk; Option B avoids it.
- Hand-over: tracker choice, onset detection and accuracy belong to tech-pitch-detection.md; this note assumes single-note phrases if Option C is used.

## 5. Sound in the browser
| Library | Licence | Size | Fit | Source |
|---|---|---|---|---|
| Tone.js | MIT | npm latest 15.1.22 (Apr 2025); Bundlephobia shows 342 kB min, 81 kB gzip but for 15.5.62 (next tag), so measure our build | Synths, PolySynth, Sampler, scheduling; Tone.start() after a tap | 26, 28, 29 |
| smplr | MIT | npm 1.1.0 (28 Sep 2026); 1.08 MB unpacked | SplendidGrandPiano, Soundfont, SF2; CacheStorage for offline (HTTPS only) | 27, 28 |
| soundfont-player | MIT | 0.12.0 | Archived May 2023; author points to smplr | 33, 28 |
| WebAudioFont | GPL-3.0-or-later | 3.0.4 | Copyleft; avoid for a closed demo | 35, 28 |
| Raw Web Audio oscillators | Browser built-in | 0 kB | Beeps only; fine for a fallback | 17 |

| Sample set | Licence | Note | Source |
|---|---|---|---|
| FluidR3_GM (gleitz rendering) | CC BY 3.0 | Attribution | 36 |
| MusyngKite (gleitz rendering) | CC BY-SA 3.0 | Share-alike | 36 |
| Salamander Grand Piano | CC BY 3.0 Unported | 16 velocity layers, 48 kHz/24-bit | 37 |
| smplr SplendidGrandPiano | Not stated in the smplr README | Check before use | 27 |
- Latency on Android:
  o Native low-latency flag = continuous output 45 ms or less; pro flag = round trip 20 ms or less (source 38).
  o CDD sets round trip 20 ms or lower for pro audio; musicians generally need 10 ms (source 38).
  o No browser figure found; measure on the demo tablet (Monday test: film tap and sound with a phone slow-motion camera).
- Tone.js adds a scheduling lookAhead of 0.1 s by default; for live keys set lookAhead to 0 or use Tone.immediate() (source 52).
- The 39 ms and 54 ms figures are 2021 native-app averages; they do not predict a browser on our tablet.
  o baseLatency and outputLatency each cover only part of the path; measure tap to sound on the real set-up.
- Practical: create the AudioContext with latencyHint "interactive"; preload samples before the take; keep built-in speakers or wired output (Bluetooth speakers add delay, unverified figure).

## 6. Notation and "what you should have played" (R17)
| Display | Beginner fit | Library | Licence | Source |
|---|---|---|---|---|
| Lit keys (next note glows) | Best for a child; no reading needed | Custom SVG | n/a | |
| Piano roll (bars on a time grid) | Shows timing at a glance | Custom SVG or html-midi-player | BSD-2-Clause (html-midi-player) | 28 |
| Staff notation | Needed later; hard for a beginner in week one | VexFlow 5.0.0 | MIT | 28, 39 |
| Score from MusicXML | Full scores, colours notes via data model | OpenSheetMusicDisplay 2.2.1 (uses VexFlow) | BSD-3-Clause | 28, 40 |
| ABC notation | Light, has synth playback | abcjs 6.7.2 | MIT | 28, 41 |
- Overlay for "what you should have played":
  o Expected notes as pale bars; played notes as solid bars on the same beat grid; a playhead line.
  o Colour: right pitch on time, right pitch early or late (show the offset), wrong pitch (show the expected key lit), missed.
  o After the take: replay expected then played; name one fix chosen by a rule (for example the earliest mistimed note, else the earliest wrong note) (R3).
  o Before and after = take 1 versus take 2 on the same phrase: "3 of 8 on time" to "7 of 8 on time" (illustrative numbers).
  o 150 ms at 80 bpm is a fifth of a beat: present it as a demo tolerance, not a learning standard.
- Minimal phrase data model (one JSON object):

```json
{ "id": "ode-bar1", "bpm": 80, "beatsPerBar": 4,
  "notes": [ { "midi": 64, "startBeat": 0, "durBeats": 1 },
             { "midi": 64, "startBeat": 1, "durBeats": 1 },
             { "midi": 65, "startBeat": 2, "durBeats": 1 },
             { "midi": 67, "startBeat": 3, "durBeats": 1 } ] }
```
- Matching rule: nearest unmatched expected note in time; same pitch within plus or minus 150 ms = on time (tolerance to tune; unverified value).

## 7. What learning apps show on screen
| Product | What the screen shows | Source |
|---|---|---|
| Simply Piano | Live note feedback; visual keyboard at the bottom when struggling; blue = correct, yellow = correct after a hint, red = wrong (moving stages only), grey keys = notes heard; correct key lit yellow after a mistake | 42 (opened) |
| flowkey | Video of a pianist with next notes lit on the keyboard; full sheet music view on tablets in portrait; Wait Mode pauses until the right notes; Just Play keeps going; loops and hands separately; mic or Bluetooth/MIDI | 34 (opened) |
| Skoove | Sheet music with a keyboard video; played notes lit; notes marked correct or incorrect in real time (colours not confirmed) | 43 (snippet) |
| Yousician (piano) | Four notation options: enhanced, falling notes, coloured, sheet; falling notes coloured by hand (blue left, purple right) with finger numbers | 44 (snippet) |
| Playground Sessions | Notes turn green when right, red when wrong (review and listing); a "pink = rhythmically close" colour is unverified | 45 (snippet) |
- Pattern: every product lights the next key or note and colours the result; we add one fix in plain words and the before-and-after (R3).

## 8. Stage set-up and fallback
### Recommended set-up (one instrument on stage)
| Item | Choice | Why |
|---|---|---|
| Stage screen | Laptop, Chrome, wired HDMI to the projector | Fewest links; Web MIDI native; no wireless mirroring in a busy venue |
| Instrument | One 25 to 32 key USB MIDI keyboard, bus-powered, on a cable | Exact notes; no driver if class compliant (sources 14, 18, 30) |
| App | Served from localhost or HTTPS; page, code, phrase and every sample cached | Web MIDI needs a secure context (source 2); test a cold reload with networking off (R12) |
| Learner device in the story | Android tablet or phone, Chrome, same app with on-screen keys | Shows "with or without an instrument"; no extra hardware |
| iPad, if that is what the team has | On-screen keys only; a MIDI browser app is an experiment, not a fallback | Safari has no Web MIDI (source 1) |
- Tablet as the stage device instead: only if USB-C to HDMI output works on that exact tablet (unverified per model) and Chrome sees the keyboard over OTG (test).
- Bluetooth MIDI on stage: avoid; pairing steps and radio noise in a crowded hall (pairing source 8; interference unverified).

### Fallback ladder (rehearse each step once on Tuesday)
| If | Then | Time on stage |
|---|---|---|
| Keyboard not detected | Re-plug; the page listens for statechange, no reload needed (snippet) | 5 s |
| Still not detected or permission denied | Same page switches to on-screen keys; the laptop's letter keys A S D F G H J K play C to C | 5 s |
| No sound | Visual feedback still runs; say "sound off, watch the bars" | 0 s |
| Laptop or app fails | Play a 20-second screen recording of the same take, recorded Tuesday | 10 s |
- Carry: a spare USB cable, a USB-C to USB-A adapter, a powered hub (Akai warns of iOS power limits, source 14).
- Grant the MIDI permission before the pitch, then rehearse after a fresh browser launch (permission persistence unverified; sources 3, 50).

## 9. Rights and licence table
| Item | Licence | What we must do | Source |
|---|---|---|---|
| Tone.js | MIT | Keep the copyright notice in the bundle | 26, 28 |
| smplr | MIT | Keep the notice; check each sample set separately | 27, 28 |
| soundfont-player | MIT, archived | Do not use; unmaintained | 33 |
| VexFlow | MIT | Keep the notice | 28, 39 |
| OpenSheetMusicDisplay | BSD-3-Clause | Keep the notice; do not use their name to endorse | 28, 40 |
| abcjs | MIT | Keep the notice | 28 |
| html-midi-player | BSD-2-Clause | Keep the notice | 28 |
| webmidi.js (optional helper) | Apache-2.0 | Keep the notice and licence text | 28 |
| WebAudioFont | GPL-3.0-or-later | Avoid; copyleft would cover our app if distributed | 28, 35 |
| Salamander Grand Piano samples | CC BY 3.0 Unported | Credit the author on an about screen | 37 |
| FluidR3_GM (gleitz) | CC BY 3.0 | Credit | 36 |
| MusyngKite (gleitz) | CC BY-SA 3.0 | Credit; share-alike on changed samples | 36 |
| smplr SplendidGrandPiano | Not stated in the README | Check the source project before use, or use Salamander | 27 |
| Practice phrase | Our own transcription of a public-domain melody | Pick a melody whose composer died long ago; confirm before the pitch | unverified |
| Competitor screens | Their copyright | Describe them; no screenshots in the deck without permission | |
- No library generates music; all are players or renderers (state-of-play section 5 rule holds).

## 10. Snippet: Web MIDI note-on to expected note (untested)
- About 45 lines; plain JavaScript; Chrome, Edge, Firefox desktop or Chrome for Android over HTTPS.
- Prefers a same-pitch match within a time window; a wrong key does not use up the expected note.
- Revised after the Codex critique (count-in, e.timeStamp, note-off, status line); still untested.
- Known gaps: no audio-to-performance clock calibration (getOutputTimestamp), no duration scoring, no chord grouping.

```js
// UNTESTED sketch: Web MIDI note-on/off -> compare with the expected phrase
const phrase = { bpm: 80, notes: [
  { midi: 64, startBeat: 0, durBeats: 1 }, { midi: 64, startBeat: 1, durBeats: 1 },
  { midi: 65, startBeat: 2, durBeats: 1 }, { midi: 67, startBeat: 3, durBeats: 1 } ] };
const TOL_MS = 150, SEARCH_MS = 400;   // demo tolerance (a fifth of a beat at 80 bpm), not a teaching standard
const beatMs = 60000 / phrase.bpm, ctx = new AudioContext({ latencyHint: "interactive" });
let t0 = Infinity; const used = new Set(); const log = [];

function startTake() {                  // from a button tap: 4 count-in clicks, then judge
  ctx.resume(); used.clear(); log.length = 0;
  for (let k = 0; k < 4; k++) {         // short clicks scheduled on the audio clock
    const o = ctx.createOscillator(), at = ctx.currentTime + (k * beatMs) / 1000;
    o.connect(ctx.destination); o.start(at); o.stop(at + 0.03);
  }
  t0 = performance.now() + 4 * beatMs + (ctx.outputLatency || 0) * 1000;  // calibrate per device
}
function judge(midi, t) {
  const rel = t - t0; if (rel < -SEARCH_MS) return;        // ignore notes during the count-in
  const near = phrase.notes.map((n, i) => ({ n, i, off: rel - n.startBeat * beatMs }))
    .filter((c) => !used.has(c.i) && Math.abs(c.off) <= SEARCH_MS)
    .sort((a, b) => Math.abs(a.off) - Math.abs(b.off));
  const hit = near.find((c) => c.n.midi === midi);         // prefer same pitch (copes with chords)
  if (!hit) return log.push({ midi, expected: near[0] ? near[0].n.midi : null,
    verdict: near[0] ? "wrong note" : "extra" });           // a wrong key does not use up the expected note
  used.add(hit.i); const off = Math.round(hit.off);
  log.push({ midi, offsetMs: off, verdict: Math.abs(off) <= TOL_MS ? "on time" : off < 0 ? "early" : "late" });
}
const missed = () => phrase.notes.filter((_, i) => !used.has(i));  // call after the last note's window

function listen(input) {
  input.onmidimessage = (e) => {
    const [status, note, vel] = e.data, type = status & 0xf0;
    if (type === 0x90 && vel > 0) judge(note, e.timeStamp); // note-on; timeStamp assumed on performance.now() clock (verify)
    else if (type === 0x80 || type === 0x90) noteOff(note);  // note-off, or note-on with velocity 0
  };
}
if (navigator.requestMIDIAccess) {
  navigator.requestMIDIAccess().then((access) => {         // permission prompt (Chrome 124 rollout, all users by 125)
    access.inputs.forEach(listen);
    setStatus(access.inputs.size ? "keyboard ready" : "no keyboard: use the keys on screen");
    access.onstatechange = (e) => {
      if (e.port.type !== "input") return;
      if (e.port.state === "connected") { listen(e.port); setStatus("keyboard ready"); }
      else setStatus("keyboard unplugged: use the keys on screen");
    };
  }, () => setStatus("MIDI blocked: use the keys on screen"));
} else setStatus("no Web MIDI here (iPad Safari): use the keys on screen");
// On-screen keys stay visible and call judge(note, performance.now()) on pointerdown, noteOff on pointerup/pointercancel.
// noteOff() and setStatus() are app functions (sound release, note length, status line), not shown.
```

## Method
- Codex call 1: gpt-6-sol, medium, knowledge draft (libraries, prices, Web MIDI, product screens, data model).
  o Kept after web checks: Web MIDI table, Tone.js/smplr/VexFlow/OSMD/abcjs licences, gleitz and Salamander licences, WebAudioFont GPL, Android 45 ms flag, maxTouchPoints, Vibration API, Xkey Air BLE, Akai class compliance.
  o Not kept or downgraded: Playground Sessions "pink = rhythmically close" (not found; marked unverified); child key widths 50 to 60 px (no source; replaced by our tablet arithmetic); its AUD price bands (replaced by retailer prices).
- Codex call 2: gpt-6-sol, high, critique of the finished file (people names absent).
  o Kept after checks: Chrome 125 for all users (opened); touch implicit capture and touch-action (MDN, opened); snippet bugs (wrong key consumed the expected note, no count-in, performance.now() instead of e.timeStamp, no note-off, no empty-input status); cold-reload offline test; demo-tolerance framing; Tone.js size mixes versions.
  o Also checked: Tone.js lookAhead 0.1 s (Tone wiki, opened).
  o Not changed: its EU alternative-engine point (already covered, Australia is outside the EU); its second opinion agrees with the laptop plus USB keyboard plan.
- Web: about 30 pages opened (marked opened in Sources); the rest are search snippets.
- npm registry queried directly for versions, licences and unpacked sizes (2026-11-06).

## Open questions
- Which keyboard can the team get by Monday in Melbourne: buy one (about A$90 to A$130), borrow, or does anyone own one?
- Which devices do we have: Android tablet, iPad, or only laptops? This decides Option A versus the laptop stage plan.
- Does the chosen Android tablet see a USB MIDI keyboard in Chrome over OTG? Test before buying a cable.
- Real tap-to-sound delay on the demo device in the browser: measure (slow-motion video of tap and sound).
- Age group (state-of-play section 7): it sets the key count on screen (8 keys for a child, 12 to 15 for a teen or adult).
- Lit keys only, or lit keys plus piano roll, or staff? Decide with the age group.
- Which public-domain phrase for the demo, and who transcribes it?
- Does the keyboard demo replace the voice demo, or show the same loop with voice as the story (state-of-play section 7 lean)?
- Timing tolerance (150 ms here) and count-in: tune with two or three people on Monday.
- Is e.timeStamp on the same clock as performance.now() in Chrome for Android? Log both for ten notes and compare.
- Rule for the one fix on keyboard: timing or wrong notes as the priority? Keep it to one rule for the demo.

## Sources
1. caniuse, Web MIDI API, https://caniuse.com/midi, accessed 2026-11-06, opened.
2. MDN, Web MIDI API, https://developer.mozilla.org/en-US/docs/Web/API/Web_MIDI_API, accessed 2026-11-06, opened.
3. Chrome for Developers, MIDI access now requires user permission, https://developer.chrome.com/blog/web-midi-permission-prompt, accessed 2026-11-06, opened.
4. MDN, MIDIMessageEvent, https://developer.mozilla.org/en-US/docs/Web/API/MIDIMessageEvent, accessed 2026-11-06, opened.
5. App Store, Web MIDI Browser, https://apps.apple.com/us/app/web-midi-browser/id953846217, accessed 2026-11-06, opened.
6. App Store, MIDIWeb Browser, https://apps.apple.com/us/app/id6757226617, accessed 2026-11-06, opened.
7. Android Open Source Project, MIDI, https://source.android.com/docs/core/audio/midi, accessed 2026-11-06, opened.
8. OffGrid, Android connectivity guide (MIDI BLE Connect), https://uploads-ssl.webflow.com/60fc328d7214f6b87c58ad7d/6330bb22e239120aeadfa3a1_OffGrid%20-%20Android%20Connectivity.pdf, accessed 2026-11-06, snippet.
9. Liveschool, Korg nanoKEY2, https://shop.liveschool.net/products/midi-controller-korg-nanokey2-controller-keyboard-black, accessed 2026-11-06, snippet.
10. Billy Hyde Music, Korg nanoKEY2 white, https://billyhydemusic.com.au/products/korg-nanokey2-controller-keyboard-wh, accessed 2026-11-06, snippet.
11. Mannys, Korg nanoKEY2 black, https://mannys.com.au/korg-nanokey2-black-2nd-gen-portable-midi-keys, accessed 2026-11-06, opened.
12. Scarlett Music and Joondalup Music, Keystation Mini 32 MK3, https://www.scarlettmusic.com.au/m-audio-keystation-mini-32-mk3-32-key-usb-midi-con and https://joondalupmusic.com.au/products/m-audio-keystation-mini-mk3-32-key-usb-controller, accessed 2026-11-06, snippet (Scarlett page returned 404 when opened).
13. DJ City and Scarlett Music, Akai MPK Mini IV, https://djcity.com.au/product/akai-professional-mpk-mini-iv-compact-midi-keyboard-grey/, accessed 2026-11-06, snippet.
14. Akai Pro, MPK mini mk3 FAQ, https://support.akaipro.com/en/support/solutions/articles/69000798861-akai-pro-mpk-mini-mk3-frequently-asked-questions, accessed 2026-11-06, opened.
15. Android Developers Blog, An update on Android's audio latency (2021), https://android-developers.googleblog.com/2021/03/an-update-on-androids-audio-latency.html, accessed 2026-11-06, opened.
16. Liveschool, Turra Music, Mannys, Korg microKEY2 Air 25, https://shop.liveschool.net/products/midi-controller-korg-microkey2-air-25-key-bluetooth and https://turramusic.com.au/products/korg-microkey-2-air-25 and https://mannys.com.au/korg-microkey-2-air-25-key-bluetooth-midi-controller, accessed 2026-11-06, snippet.
17. MDN, AudioContext() constructor, https://developer.mozilla.org/en-US/docs/Web/API/AudioContext/AudioContext, accessed 2026-11-06, opened.
18. ESI Audio, Xkey Air 25, https://www.esi-audio.com/products/xkeyair25/, accessed 2026-11-06, opened.
19. MDN, Navigator.maxTouchPoints, https://developer.mozilla.org/en-US/docs/Web/API/Navigator/maxTouchPoints, accessed 2026-11-06, opened.
20. caniuse, Vibration API, https://caniuse.com/vibration, accessed 2026-11-06, opened.
21. Nielsen Norman Group, Touch targets on touchscreens, https://www.nngroup.com/articles/touch-target-size/, accessed 2026-11-06, opened.
22. W3C, Understanding SC 2.5.8 Target Size (Minimum), https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html, accessed 2026-11-06, opened.
23. Wikipedia, Musical keyboard, https://en.wikipedia.org/wiki/Musical_keyboard, accessed 2026-11-06, snippet.
24. Front-End Checklist, Touch targets (Apple 44 pt, Material 48 dp), https://frontendchecklist.io/rules/accessibility/touch-targets, accessed 2026-11-06, snippet (secondary; Apple and Google pages not opened).
25. Apple Support, iPad (10th generation) tech specs, https://support.apple.com/en-au/111840, accessed 2026-11-06, opened.
26. Tone.js repository, https://github.com/Tonejs/Tone.js, accessed 2026-11-06, opened.
27. smplr repository, https://github.com/danigb/smplr, accessed 2026-11-06, opened.
28. npm registry, https://registry.npmjs.org/ (packages tone, smplr, soundfont-player, webaudiofont, vexflow, opensheetmusicdisplay, abcjs, html-midi-player, webmidi), accessed 2026-11-06, opened.
29. Bundlephobia, tone, https://bundlephobia.com/package/tone, accessed 2026-11-06, opened.
30. android-midi Google Group, Permission to access USB MIDI device, https://groups.google.com/g/android-midi/c/AL1afmM7I9g, accessed 2026-11-06, snippet.
31. android-midi Google Group, WebMidi on Android 9 / Fire HD, https://groups.google.com/g/android-midi/c/iZSyfT3l_Pw, accessed 2026-11-06, snippet.
32. Android Open Source Project, MIDI test procedure (MIDI BLE Connect), https://source.android.com/devices/audio/midi_test, accessed 2026-11-06, snippet.
33. soundfont-player repository, https://github.com/danigb/soundfont-player, accessed 2026-11-06, opened.
34. App Store, flowkey, https://apps.apple.com/us/app/id1020357408, accessed 2026-11-06, opened.
35. WebAudioFont repository, https://github.com/surikov/webaudiofont, accessed 2026-11-06, opened.
36. gleitz, midi-js-soundfonts, https://github.com/gleitz/midi-js-soundfonts, accessed 2026-11-06, opened.
37. Salamander Grand Piano repository, https://github.com/sfzinstruments/SalamanderGrandPiano, accessed 2026-11-06, opened.
38. Android Developers, Audio latency (NDK guide), https://developer.android.com/ndk/guides/audio/audio-latency, accessed 2026-11-06, opened.
39. VexFlow repository, https://github.com/vexflow/vexflow, accessed 2026-11-06, opened.
40. OpenSheetMusicDisplay repository, https://github.com/opensheetmusicdisplay/opensheetmusicdisplay, accessed 2026-11-06, opened.
41. abcjs repository, https://github.com/paulrosen/abcjs, accessed 2026-11-06, opened.
42. Simply Piano help, Learning with Simply Piano: the basics, https://piano-help.hellosimply.com/en/articles/7943490-learning-with-simply-piano-the-basics, accessed 2026-11-06, opened.
43. Piano Dreamers, Skoove review, https://www.pianodreamers.com/skoove-review/, accessed 2026-11-06, snippet.
44. Yousician support, Notation options in piano, https://support.yousician.com/hc/en-us/articles/208678605-How-to-change-notation-styles-in-piano, accessed 2026-11-06, snippet (403 when opened).
45. AlternativeTo, Playground Sessions, https://www.alternativeto.net/software/playground-sessions/about/, accessed 2026-11-06, snippet.
46. Korg, nanoKEY2 product page, https://www.korg.com/us/products/computergear/nanokey2/, accessed 2026-11-06, opened.
47. SightReader, MIDI help, https://sight-reader.pages.dev/help/midi, accessed 2026-11-06, snippet.
48. MacRumors, WebKit rule and iOS browser performance (17 Jun 2026), https://macrumors.com/2026/06/17/webkit-rule-costs-ios-users-browser-performance, accessed 2026-11-06, snippet.
49. caniuse, Pointer Events, https://caniuse.com/pointer, accessed 2026-11-06, opened.
50. Chrome for Developers, Chrome 124 release notes, https://developer.chrome.com/release-notes/124, accessed 2026-11-06, opened.
51. MDN, Pointer events, https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events, accessed 2026-11-06, opened.
52. Tone.js wiki, Performance, https://github.com/Tonejs/Tone.js/wiki/Performance, accessed 2026-11-06, opened.
