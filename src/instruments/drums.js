/*
  Drum pads (FR-PLY-03, FR-PLY-07, FR-PLY-08).

  - Pads and their sounds come from src/data/instruments/drums.json.
  - Multitouch: every finger that lands on a pad hits it at once, so
    several pads sound together. Sliding a finger does not hit other pads.
  - Laptop keys (A S D F G by default) and Tab + Enter/Space also hit pads.

  const pads = createDrumPads({ layout, kit, order, onHit })
  container.append(pads.element) ... later pads.destroy()
*/
import './drums.css'
import { el } from '../components/dom.js'
import { keyCodeLabel } from './notes.js'
import { orderPads } from './pads.js'
import { startAudio } from './audio.js'

export function createDrumPads({ layout, kit, order = layout.order, onHit = () => {} }) {
  const pads = orderPads(layout.pads, order)
  const codeByPad = new Map(Object.entries(layout.laptopKeys || {}).map(([code, id]) => [id, code]))
  const buttons = new Map() // pad id -> button
  const holders = new Map() // pad id -> Set of pointer ids / keys holding it down (for the look only)
  const pointerPads = new Map() // pointerId -> pad id

  const padButtons = pads.map((pad) => {
    const code = codeByPad.get(pad.id)
    const button = el(
      'button',
      { type: 'button', class: 'drum-pad', 'data-pad': pad.id },
      [
        el('span', { class: 'drum-pad__label' }, pad.label),
        code ? el('span', { class: 'drum-pad__hint', 'aria-hidden': 'true' }, keyCodeLabel(code)) : null,
      ],
    )
    buttons.set(pad.id, button)
    return button
  })

  const grid = el('div', { class: 'drum-pads', role: 'group', 'aria-label': `Drum pads, ${pads.length} pads` }, padButtons)
  const element = el('div', { class: 'drums' }, [grid])

  // ---------- Hitting ----------
  function hit(padId, holder) {
    const button = buttons.get(padId)
    if (!button) return
    let set = holders.get(padId)
    if (!set) holders.set(padId, (set = new Set()))
    set.add(holder)
    button.classList.add('is-down')
    const time = kit.hit(padId)
    onHit({ pad: padId, time })
  }

  function lift(padId, holder) {
    const set = holders.get(padId)
    if (!set) return
    set.delete(holder)
    if (set.size === 0) buttons.get(padId)?.classList.remove('is-down')
  }

  function liftAll() {
    for (const [padId, set] of holders) {
      set.clear()
      buttons.get(padId)?.classList.remove('is-down')
    }
    pointerPads.clear()
  }

  // ---------- Touch, pen and mouse (multitouch) ----------
  function onPointerDown(event) {
    if (event.button !== 0) return
    const button = event.target.closest('.drum-pad')
    if (!button) return
    event.preventDefault()
    startAudio() // first tap turns sound on (does nothing if already on)
    try {
      grid.setPointerCapture(event.pointerId)
    } catch {
      // some browsers refuse capture for synthetic events; hitting still works
    }
    pointerPads.set(event.pointerId, button.dataset.pad)
    hit(button.dataset.pad, event.pointerId)
  }

  function onPointerEnd(event) {
    const padId = pointerPads.get(event.pointerId)
    if (padId === undefined) return
    pointerPads.delete(event.pointerId)
    lift(padId, event.pointerId)
  }

  grid.addEventListener('pointerdown', onPointerDown)
  grid.addEventListener('pointerup', onPointerEnd)
  grid.addEventListener('pointercancel', onPointerEnd)
  grid.addEventListener('lostpointercapture', onPointerEnd)
  grid.addEventListener('contextmenu', (e) => e.preventDefault())

  // ---------- Tab + Enter/Space on a focused pad ----------
  grid.addEventListener('keydown', (event) => {
    if ((event.key === 'Enter' || event.key === ' ') && event.target.matches('.drum-pad')) {
      event.preventDefault()
      if (event.repeat) return
      startAudio()
      hit(event.target.dataset.pad, 'focus')
    }
  })
  grid.addEventListener('keyup', (event) => {
    if ((event.key === 'Enter' || event.key === ' ') && event.target.matches('.drum-pad')) {
      lift(event.target.dataset.pad, 'focus')
    }
  })

  // ---------- Laptop keys (FR-PLY-08) ----------
  function isTyping(target) {
    return target instanceof Element && target.closest('input, textarea, select, [contenteditable="true"]')
  }

  function onKeyDown(event) {
    if (event.repeat || event.ctrlKey || event.metaKey || event.altKey || isTyping(event.target)) return
    const padId = layout.laptopKeys?.[event.code]
    if (!padId) return
    event.preventDefault()
    startAudio()
    hit(padId, `key:${event.code}`)
  }

  function onKeyUp(event) {
    const padId = layout.laptopKeys?.[event.code]
    if (padId) lift(padId, `key:${event.code}`)
  }

  window.addEventListener('keydown', onKeyDown)
  window.addEventListener('keyup', onKeyUp)
  window.addEventListener('blur', liftAll)

  function destroy() {
    liftAll()
    window.removeEventListener('keydown', onKeyDown)
    window.removeEventListener('keyup', onKeyUp)
    window.removeEventListener('blur', liftAll)
  }

  return { element, releaseAll: liftAll, destroy }
}
