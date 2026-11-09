/*
  Metronome controls: tempo 40-160 BPM, start/stop, flashing beat marker,
  optional vibration on each beat (FR-PLY-09, FR-PLY-10).
  The beat marker shows the beat as a filled, bigger dot AND as words
  ("Beat 2 of 4"), so it does not rely on colour.

  const panel = createMetronomePanel(layout.metronome)
  container.append(panel.element) ... later panel.destroy()
*/
import './metronome.css'
import { el } from '../components/dom.js'
import { createMetronome, clampBpm } from './metronome.js'
import { startAudio } from './audio.js'
import { getSettings } from '../settings/settings.js'

let panelCount = 0

export function createMetronomePanel({ minBpm = 40, maxBpm = 160, startBpm = 80, beatsPerBar = 4 } = {}) {
  const id = `metronome-${++panelCount}`
  let bpm = clampBpm(startBpm, minBpm, maxBpm)
  let metronome = null
  let destroyed = false

  const bpmNumber = el('span', { class: 'metro__bpm-number' }, String(bpm))
  const bpmOutput = el('p', { class: 'metro__bpm', id: `${id}-bpm` }, [bpmNumber, el('span', { class: 'metro__bpm-unit' }, 'beats a minute')])

  const slower = el('button', { type: 'button', class: 'button button--quiet metro__step', 'aria-label': 'Slower' }, '−')
  const faster = el('button', { type: 'button', class: 'button button--quiet metro__step', 'aria-label': 'Faster' }, '+')

  const slider = el('input', {
    type: 'range',
    class: 'metro__slider',
    min: minBpm,
    max: maxBpm,
    step: 1,
    value: bpm,
    'aria-label': 'Tempo',
    'aria-describedby': `${id}-bpm`,
  })

  const dots = Array.from({ length: beatsPerBar }, () => el('span', { class: 'metro__dot' }))
  const marker = el('div', { class: 'metro__dots', 'aria-hidden': 'true' }, dots)
  const beatText = el('p', { class: 'metro__beat-text' }, 'Stopped')

  const toggle = el('button', { type: 'button', class: 'button metro__toggle', 'aria-pressed': 'false', disabled: true }, 'Start')

  const element = el('section', { class: 'metro', 'aria-labelledby': `${id}-title` }, [
    el('div', { class: 'metro__row' }, [el('h2', { class: 'metro__title', id: `${id}-title` }, 'Metronome'), toggle]),
    el('div', { class: 'metro__tempo' }, [slower, bpmOutput, faster]),
    slider,
    el('div', { class: 'metro__beat' }, [marker, beatText]),
  ])

  function showBeat(beat) {
    dots.forEach((dot, i) => dot.classList.toggle('is-on', i === beat - 1))
    beatText.textContent = beat ? `Beat ${beat} of ${beatsPerBar}` : 'Stopped'
  }

  function setBpm(value) {
    bpm = clampBpm(value, minBpm, maxBpm)
    bpmNumber.textContent = String(bpm)
    slider.value = String(bpm)
    slider.setAttribute('aria-valuetext', `${bpm} beats a minute`)
    slower.disabled = bpm <= minBpm
    faster.disabled = bpm >= maxBpm
    if (metronome) metronome.setBpm(bpm)
  }

  function setRunning(running) {
    toggle.textContent = running ? 'Stop' : 'Start'
    toggle.setAttribute('aria-pressed', String(running))
    if (!running) showBeat(0)
  }

  slower.addEventListener('click', () => setBpm(bpm - 1))
  faster.addEventListener('click', () => setBpm(bpm + 1))
  slider.addEventListener('input', () => setBpm(slider.value))

  toggle.addEventListener('click', () => {
    if (!metronome) return
    startAudio() // in the tap, before anything else
    if (metronome.isRunning()) {
      metronome.stop()
    } else {
      metronome.start()
      setRunning(true)
    }
  })

  createMetronome({
    minBpm,
    maxBpm,
    startBpm: bpm,
    beatsPerBar,
    onBeat: ({ beat }) => {
      if (destroyed) return
      showBeat(beat)
      if (getSettings().vibration && typeof navigator.vibrate === 'function') navigator.vibrate(30)
    },
    onStop: () => setRunning(false),
  })
    .then((m) => {
      if (destroyed) {
        m.dispose()
        return
      }
      metronome = m
      metronome.setBpm(bpm)
      toggle.disabled = false
    })
    .catch((err) => {
      console.error('Metronome could not start', err)
      beatText.textContent = 'Metronome not available'
    })

  setBpm(bpm)

  return {
    element,
    destroy() {
      destroyed = true
      if (metronome) metronome.dispose()
    },
  }
}
