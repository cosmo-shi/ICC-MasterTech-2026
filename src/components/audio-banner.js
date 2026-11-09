/*
  "Tap to start sound" banner (FR-PLY-12).

  Browsers keep sound off until the student taps something. Most of the time
  the age-band tap in onboarding unlocks sound. This banner is the fallback: on
  screens that make sound it appears only if sound is still blocked, and one
  tap unlocks sound for every instrument (they all share Tone.js's one audio context).

  Tone.js is loaded only when a sound screen opens, so other screens never
  create an audio context. No microphone or camera is ever requested.
*/
import { el } from './dom.js'
import { icon } from './icons.js'

let tonePromise = null

function loadTone() {
  if (!tonePromise) {
    globalThis.TONE_SILENCE_LOGGING = true
    tonePromise = import('tone')
  }
  return tonePromise
}

export function createAudioBanner() {
  let Tone = null
  let wanted = false
  let listening = false

  const button = el('button', { type: 'button', class: 'button' }, [icon('speaker'), 'Tap to start sound'])
  const message = el('p', { class: 'sound-banner__text' }, 'Sound is off until you tap. Tap once to turn it on.')

  // The live region stays on the page so screen readers hear the message when it appears.
  const live = el('div', { class: 'visually-hidden', 'aria-live': 'polite' })
  const element = el('div', { class: 'sound-banner', role: 'region', 'aria-label': 'Sound', hidden: true }, [
    el('div', { class: 'sound-banner__inner wrap' }, [message, button]),
  ])
  const wrapper = el('div', {}, [live, element])

  function isRunning() {
    return Tone && Tone.getContext().state === 'running'
  }

  function render() {
    const show = wanted && Tone && !isRunning()
    const wasHidden = element.hidden
    element.hidden = !show
    if (show && wasHidden) live.textContent = 'Sound is off. Use the Tap to start sound button.'
    if (!show) live.textContent = ''
  }

  button.addEventListener('click', async () => {
    if (!Tone) return
    try {
      await Tone.start() // must run inside the tap
    } catch (err) {
      console.error('Could not start sound', err)
    }
    render()
  })

  // Called on every screen change. needsSound comes from the route table in router.js.
  async function update(needsSound) {
    wanted = Boolean(needsSound)
    if (!wanted) {
      render()
      return
    }
    try {
      Tone = await loadTone()
    } catch (err) {
      console.error('Could not load sound library', err)
      return
    }
    if (!listening) {
      // Hide the banner as soon as any tap unlocks sound (e.g. the age-band tap).
      Tone.getContext().on('statechange', render)
      listening = true
    }
    render()
  }

  return { element: wrapper, update }
}
