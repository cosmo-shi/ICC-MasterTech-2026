/*
  Settings. Milestone 0: a placeholder plus two working controls, so saving
  preferences on the device (FR-ACC-08) can be tested now. Milestone 9 builds
  the full screen around them.
*/
import { placeholderScreen } from '../components/placeholder.js'
import { el } from '../components/dom.js'
import { icon } from '../components/icons.js'
import { getSettings, updateSettings, subscribe } from '../settings/settings.js'

export const title = 'Settings'

let stopListening = null

function highContrastSetting(settings) {
  const state = el('span', { class: 'switch__state' })
  const input = el('input', {
    type: 'checkbox',
    role: 'switch',
    id: 'setting-high-contrast',
    'aria-describedby': 'setting-high-contrast-hint',
  })
  input.checked = settings.highContrast

  const sync = (on) => {
    input.checked = on
    state.textContent = on ? 'On' : 'Off'
  }
  sync(settings.highContrast)
  input.addEventListener('change', () => updateSettings({ highContrast: input.checked }))

  const block = el('div', { class: 'setting' }, [
    el('label', { class: 'switch', for: 'setting-high-contrast' }, [
      el('span', {}, ['High contrast ', state]),
      input,
    ]),
    el('p', { class: 'setting__hint', id: 'setting-high-contrast-hint' }, 'Black background, white text, yellow buttons.'),
  ])
  return { block, sync: (s) => sync(s.highContrast) }
}

function controlSizeSetting(settings) {
  const sizes = [
    ['small', 'Small'],
    ['medium', 'Medium'],
    ['large', 'Large'],
  ]
  const inputs = sizes.map(([value, label]) => {
    const input = el('input', { type: 'radio', name: 'control-size', value })
    input.checked = settings.controlSize === value
    input.addEventListener('change', () => {
      if (input.checked) updateSettings({ controlSize: value })
    })
    return el('label', { class: 'choice__option' }, [input, el('span', {}, [icon('tick'), label])])
  })

  const block = el('div', { class: 'setting' }, [
    el('fieldset', { class: 'choice', 'aria-describedby': 'setting-size-hint' }, [
      el('legend', {}, 'Size of keys and pads'),
      el('div', { class: 'choice__options' }, inputs),
    ]),
    el('p', { class: 'setting__hint', id: 'setting-size-hint' }, 'Bigger keys and pads are easier to tap.'),
  ])
  const sync = (s) => {
    for (const label of inputs) {
      const input = label.querySelector('input')
      input.checked = input.value === s.controlSize
    }
  }
  return { block, sync }
}

export function render() {
  const settings = getSettings()
  const contrast = highContrastSetting(settings)
  const size = controlSizeSetting(settings)

  // Keep the controls in step if a setting changes somewhere else.
  stopListening = subscribe((s) => {
    contrast.sync(s)
    size.sync(s)
  })

  return placeholderScreen({
    title,
    current: 'settings',
    milestone: 'Milestone 9 (full screen)',
    owner: 'Person B',
    extra: [
      el('h2', {}, 'Saved on this device'),
      contrast.block,
      size.block,
    ],
  })
}

export function cleanup() {
  if (stopListening) stopListening()
  stopListening = null
}
