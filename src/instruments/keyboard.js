/*
  On-screen keyboard (FR-PLY-01, 02, 07, 08, 11).

  - Keys come from the layout in src/data/instruments/keyboard.json.
  - Multitouch: every finger is tracked by its pointer id, so 3 fingers play a chord.
    Sliding a finger to another key moves the note there.
  - Laptop keys play notes (map in keyboard.json). Tab + Enter/Space also play a key.
  - Note names hide instantly via the html.hide-note-names class (set from settings).
  - Touching the keys never scrolls the page; the Lower/Higher buttons scroll the keys.

  const kb = createKeyboard({ layout, voice, onNoteOn, onNoteOff })
  container.append(kb.element) ... later kb.destroy()
*/
import './keyboard.css'
import { el } from '../components/dom.js'
import { icon } from '../components/icons.js'
import { buildKeys, keyCodeLabel } from './notes.js'
import { startAudio } from './audio.js'

export function createKeyboard({ layout, voice, range = layout.range, onNoteOn = () => {}, onNoteOff = () => {} }) {
  const keys = buildKeys(range)
  const codeByNote = new Map(Object.entries(layout.laptopKeys || {}).map(([code, note]) => [note, code]))
  const buttons = new Map() // note -> button
  const holders = new Map() // note -> Set of who is holding it (pointer ids, laptop keys)
  const pointerNotes = new Map() // pointerId -> note

  // ---------- Build the keys ----------
  let whiteIndex = 0
  const keyButtons = keys.map((key) => {
    const code = codeByNote.get(key.note)
    const button = el(
      'button',
      {
        type: 'button',
        class: key.isBlack ? 'kb__key kb__key--black' : 'kb__key kb__key--white',
        'data-note': key.note,
        'aria-label': key.spoken,
        style: key.isBlack ? `--i: ${whiteIndex}` : null,
      },
      [
        el('span', { class: 'kb__name', 'aria-hidden': 'true' }, key.label),
        code ? el('span', { class: 'kb__hint', 'aria-hidden': 'true' }, keyCodeLabel(code)) : null,
      ],
    )
    if (!key.isBlack) whiteIndex += 1
    buttons.set(key.note, button)
    return button
  })
  const whiteCount = whiteIndex

  const keysRow = el('div', { class: 'kb__keys', style: `--white-count: ${whiteCount}` }, keyButtons)
  const scroller = el('div', { class: 'kb__scroll', role: 'group', 'aria-label': `Keyboard, ${keys.length} keys` }, [keysRow])

  const lower = el('button', { type: 'button', class: 'button button--quiet kb__shift' }, [icon('arrow', 'kb__arrow-left'), 'Lower notes'])
  const higher = el('button', { type: 'button', class: 'button button--quiet kb__shift' }, ['Higher notes', icon('arrow')])
  const nav = el('div', { class: 'kb__nav' }, [lower, higher])

  const element = el('div', { class: 'kb' }, [nav, scroller])

  // ---------- Playing notes ----------
  function press(note, holder) {
    const button = buttons.get(note)
    if (!button) return
    let set = holders.get(note)
    if (!set) holders.set(note, (set = new Set()))
    if (set.has(holder)) return
    set.add(holder)
    if (set.size === 1) {
      button.classList.add('is-down')
      const time = voice.noteOn(note)
      onNoteOn({ note, time })
    }
  }

  function release(note, holder) {
    const set = holders.get(note)
    if (!set || !set.delete(holder)) return
    if (set.size === 0) {
      buttons.get(note)?.classList.remove('is-down')
      const time = voice.noteOff(note)
      onNoteOff({ note, time })
    }
  }

  function releaseAll() {
    for (const [note, set] of holders) {
      for (const holder of [...set]) release(note, holder)
    }
    pointerNotes.clear()
  }

  // ---------- Touch, pen and mouse (multitouch) ----------
  function noteAt(x, y) {
    const target = document.elementFromPoint(x, y)
    const button = target && target.closest('.kb__key')
    return button && keysRow.contains(button) ? button.dataset.note : null
  }

  function onPointerDown(event) {
    if (event.button !== 0) return
    const button = event.target.closest('.kb__key')
    if (!button) return
    event.preventDefault() // no text selection, no focus jump, no double-tap zoom
    startAudio() // first tap turns sound on (does nothing if already on)
    try {
      keysRow.setPointerCapture(event.pointerId)
    } catch {
      // some browsers refuse capture for synthetic events; playing still works
    }
    pointerNotes.set(event.pointerId, button.dataset.note)
    press(button.dataset.note, event.pointerId)
  }

  function onPointerMove(event) {
    const current = pointerNotes.get(event.pointerId)
    if (current === undefined) return
    const next = noteAt(event.clientX, event.clientY)
    if (next === current) return
    if (current) release(current, event.pointerId)
    pointerNotes.set(event.pointerId, next)
    if (next) press(next, event.pointerId)
  }

  function onPointerEnd(event) {
    const current = pointerNotes.get(event.pointerId)
    if (current === undefined) return
    pointerNotes.delete(event.pointerId)
    if (current) release(current, event.pointerId)
  }

  keysRow.addEventListener('pointerdown', onPointerDown)
  keysRow.addEventListener('pointermove', onPointerMove)
  keysRow.addEventListener('pointerup', onPointerEnd)
  keysRow.addEventListener('pointercancel', onPointerEnd)
  keysRow.addEventListener('lostpointercapture', onPointerEnd)
  keysRow.addEventListener('contextmenu', (e) => e.preventDefault()) // long press must not open a menu

  // ---------- Tab + Enter/Space on a focused key ----------
  keysRow.addEventListener('keydown', (event) => {
    if ((event.key === 'Enter' || event.key === ' ') && event.target.matches('.kb__key')) {
      event.preventDefault()
      if (event.repeat) return
      startAudio()
      press(event.target.dataset.note, 'focus')
    }
  })
  keysRow.addEventListener('keyup', (event) => {
    if ((event.key === 'Enter' || event.key === ' ') && event.target.matches('.kb__key')) {
      release(event.target.dataset.note, 'focus')
    }
  })
  keysRow.addEventListener('focusout', (event) => {
    if (event.target.matches?.('.kb__key')) release(event.target.dataset.note, 'focus')
  })

  // ---------- Laptop keys (FR-PLY-08) ----------
  function isTyping(target) {
    return target instanceof Element && target.closest('input, textarea, select, [contenteditable="true"]')
  }

  function onKeyDown(event) {
    if (event.repeat || event.ctrlKey || event.metaKey || event.altKey || isTyping(event.target)) return
    const note = layout.laptopKeys?.[event.code]
    if (!note) return
    event.preventDefault()
    startAudio()
    press(note, `key:${event.code}`)
    buttons.get(note)?.scrollIntoView({ block: 'nearest', inline: 'nearest' })
  }

  function onKeyUp(event) {
    const note = layout.laptopKeys?.[event.code]
    if (note) release(note, `key:${event.code}`)
  }

  window.addEventListener('keydown', onKeyDown)
  window.addEventListener('keyup', onKeyUp)
  window.addEventListener('blur', releaseAll)
  document.addEventListener('visibilitychange', releaseAll)

  // ---------- Lower / Higher buttons (FR-PLY-02) ----------
  function octaveWidth() {
    const white = keysRow.querySelector('.kb__key--white')
    return white ? white.getBoundingClientRect().width * 7 : 300
  }

  function updateNav() {
    const max = scroller.scrollWidth - scroller.clientWidth
    lower.disabled = scroller.scrollLeft <= 1
    higher.disabled = scroller.scrollLeft >= max - 1
    nav.hidden = max <= 1 // everything fits: no need for the buttons
  }

  lower.addEventListener('click', () => scroller.scrollBy({ left: -octaveWidth(), behavior: 'smooth' }))
  higher.addEventListener('click', () => scroller.scrollBy({ left: octaveWidth(), behavior: 'smooth' }))
  scroller.addEventListener('scroll', updateNav, { passive: true })
  const resizeObserver = new ResizeObserver(updateNav)
  resizeObserver.observe(scroller)
  resizeObserver.observe(keysRow)

  function destroy() {
    releaseAll()
    window.removeEventListener('keydown', onKeyDown)
    window.removeEventListener('keyup', onKeyUp)
    window.removeEventListener('blur', releaseAll)
    document.removeEventListener('visibilitychange', releaseAll)
    resizeObserver.disconnect()
  }

  return { element, releaseAll, destroy }
}
