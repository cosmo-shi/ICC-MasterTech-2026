/*
  Shared audio module for every instrument (keyboard now, drums in Milestone 3).

  - Sound is made with Tone.js. By default it is generated in code (a synth).
    If an instrument's JSON lists licensed sample files, those are used instead.
  - Tone.js is loaded only when a sound screen opens (it is a large library).
  - startAudio() turns sound on during a tap. It never starts Tone twice:
    the onboarding tap or the "Tap to start sound" banner may already have done it.
  - Notes play at Tone.immediate() (the audio clock right now) rather than
    Tone.now(), which adds a 0.1 s look-ahead. This keeps taps under 50 ms (NFR-PER-01).
*/

let tonePromise = null
let Tone = null

export function loadTone() {
  if (!tonePromise) {
    globalThis.TONE_SILENCE_LOGGING = true
    tonePromise = import('tone').then((mod) => {
      Tone = mod
      return mod
    })
  }
  return tonePromise
}

// Tone.js once it has loaded, or null before that.
export function getToneIfLoaded() {
  return Tone
}

export function isAudioRunning() {
  return Boolean(Tone) && Tone.getContext().state === 'running'
}

/*
  Turn sound on. Call this at the very start of a tap or key press handler,
  before any await, so the browser counts it as part of the tap.
*/
export function startAudio() {
  if (!Tone || isAudioRunning()) return Promise.resolve()
  return Tone.start().catch((err) => console.error('Could not start sound', err))
}

// The audio clock in seconds. Note times and metronome beats use the same clock (NFR-PER-05).
export function audioTime() {
  return Tone ? Tone.immediate() : 0
}

function createSynth(sound = {}) {
  const synth = new Tone.PolySynth(Tone.Synth, {
    oscillator: { type: sound.oscillator || 'triangle' },
    envelope: sound.envelope || { attack: 0.005, decay: 0.4, sustain: 0.25, release: 1 },
  }).toDestination()
  synth.maxPolyphony = sound.maxPolyphony || 16
  synth.volume.value = sound.volume ?? -8
  return synth
}

function createSampler(samples, sound, onFallback) {
  return new Promise((resolve) => {
    const sampler = new Tone.Sampler({
      urls: samples.urls,
      baseUrl: samples.baseUrl,
      release: sound?.envelope?.release ?? 1,
      onload: () => resolve(sampler),
      onerror: (err) => {
        console.warn('[audio] Sample files did not load, using the generated synth instead (fallback).', err)
        sampler.dispose()
        onFallback()
        resolve(createSynth(sound))
      },
    }).toDestination()
    if (sound?.volume !== undefined) sampler.volume.value = sound.volume
  })
}

/*
  A voice plays notes for one instrument.
    const voice = await createVoice(layout.sound, layout.samples)
    voice.noteOn('C4'); voice.noteOff('C4'); voice.releaseAll()
  Every call returns the audio-clock time the note was played at.
*/
export async function createVoice(sound, samples = null) {
  await loadTone()
  let usingSamples = Boolean(samples && samples.urls)
  const source = usingSamples
    ? await createSampler(samples, sound, () => { usingSamples = false })
    : createSynth(sound)

  return {
    get usesSamples() {
      return usingSamples
    },
    noteOn(note, velocity = 0.9) {
      const time = Tone.immediate()
      source.triggerAttack(note, time, velocity)
      return time
    },
    noteOff(note) {
      const time = Tone.immediate()
      source.triggerRelease(note, time)
      return time
    },
    releaseAll() {
      source.releaseAll(Tone.immediate())
    },
    dispose() {
      source.dispose()
    },
  }
}

// One voice per instrument, kept so returning to a screen is instant.
const voices = new Map()

export function getVoice(id, sound, samples) {
  if (!voices.has(id)) voices.set(id, createVoice(sound, samples))
  return voices.get(id)
}
