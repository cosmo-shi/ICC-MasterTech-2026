/*
  Instrument play screen: #/play/<instrument id>.

  The instrument's layout comes from src/data/instruments/<id>.json (NFR-MNT-01).
  BUILDERS turns a layout "type" into an instrument (keyboard, drums).
*/
import './play-instrument.css'
import { el } from '../components/dom.js'
import { getSettings, updateSettings, subscribe } from '../settings/settings.js'
import { getVoice, getDrumKit } from '../instruments/audio.js'
import { createKeyboard } from '../instruments/keyboard.js'
import { createDrumPads } from '../instruments/drums.js'
import { createMetronomePanel } from '../instruments/metronome-panel.js'

export let title = 'Play'

const layouts = import.meta.glob('../data/instruments/*.json', { import: 'default' })

const BUILDERS = {
  keyboard: async (layout) => {
    const voice = await getVoice(layout.id, layout.sound, layout.samples)
    return createKeyboard({ layout, voice })
  },
  drums: async (layout) => {
    const kit = await getDrumKit(layout.id, layout.pads)
    // The student's saved pad order (Milestone 9) wins over the file's order.
    const order = getSettings().padOrder || layout.order
    return createDrumPads({ layout, kit, order })
  },
}

let teardown = []
let runId = 0 // changes when the student leaves, so late-loading parts know to stop

function settingSwitch({ key, label, hint }) {
  const id = `play-${key}`
  const state = el('span', { class: 'switch__state' })
  const input = el('input', { type: 'checkbox', role: 'switch', id, 'aria-describedby': `${id}-hint` })
  const sync = (s) => {
    input.checked = s[key]
    state.textContent = s[key] ? 'On' : 'Off'
  }
  sync(getSettings())
  input.addEventListener('change', () => updateSettings({ [key]: input.checked }))
  teardown.push(subscribe(sync))

  return el('div', { class: 'setting play__setting' }, [
    el('label', { class: 'switch', for: id }, [el('span', {}, [label, ' ', state]), input]),
    el('p', { class: 'setting__hint', id: `${id}-hint` }, hint),
  ])
}

function notReady(name) {
  return el('section', { class: 'screen wrap', 'aria-labelledby': 'screen-title' }, [
    el('header', { class: 'screen__head' }, [
      el('h1', { id: 'screen-title' }, name ? `${name} is not ready yet` : 'Instrument not found'),
      el('p', { class: 'screen__lead' }, 'Pick another instrument for now.'),
    ]),
    el('a', { class: 'button', href: '#/instruments' }, 'Choose an instrument'),
  ])
}

export function render(params) {
  cleanup()
  const id = params.instrument
  const path = `../data/instruments/${id}.json`
  const loader = layouts[path]

  const status = el('p', { class: 'play__status', role: 'status' }, 'Getting the sound ready…')
  const instrumentArea = el('div', { class: 'play__instrument' }, [status])
  const head = el('header', { class: 'screen__head' }, [el('h1', { id: 'screen-title' }, 'Play')])
  const top = el('div', { class: 'wrap play__top' }, [head])
  const screen = el('section', { class: 'screen play', 'aria-labelledby': 'screen-title' }, [top, instrumentArea])

  if (!loader) return notReady(id ? id.charAt(0).toUpperCase() + id.slice(1) : null)

  const myRun = runId
  loader()
    .then(async (layout) => {
      if (myRun !== runId) return
      title = layout.name
      head.querySelector('h1').textContent = layout.name
      document.title = `${layout.name} – Musica`

      const build = BUILDERS[layout.type]
      if (!build) {
        screen.replaceWith(notReady(layout.name))
        return
      }

      const switches = []
      if (layout.type === 'keyboard') {
        switches.push(settingSwitch({ key: 'showNoteNames', label: 'Note names', hint: 'Show the letter on each key.' }))
      }
      if (typeof navigator.vibrate === 'function') {
        switches.push(settingSwitch({ key: 'vibration', label: 'Vibrate on each beat', hint: 'The phone buzzes with the metronome.' }))
      }
      if (layout.metronome) {
        const metronome = createMetronomePanel(layout.metronome)
        teardown.push(() => metronome.destroy())
        top.append(metronome.element)
      }

      const instrument = await build(layout)
      if (myRun !== runId) {
        instrument.destroy() // the student already left this screen
        return
      }
      teardown.push(() => instrument.destroy())
      // Order on screen: name, metronome, instrument, then the switches,
      // so the keys are on the first screen of a phone.
      instrumentArea.replaceChildren(instrument.element)
      if (switches.length) screen.append(el('div', { class: 'wrap play__settings' }, switches))
    })
    .catch((err) => {
      console.error('Could not open instrument', id, err)
      status.textContent = 'The sound could not load. Reload the page to try again.'
    })

  return screen
}

export function cleanup() {
  for (const fn of teardown) {
    try {
      fn()
    } catch (err) {
      console.error(err)
    }
  }
  teardown = []
  runId += 1
  title = 'Play'
}
