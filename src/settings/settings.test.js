import { describe, it, expect, vi } from 'vitest'
import { createSettingsStore, DEFAULTS, STORAGE_KEY, sanitise } from './settings.js'

// A pretend localStorage, so tests run without a browser.
function fakeStorage(initial = {}) {
  const data = new Map(Object.entries(initial))
  return {
    getItem: (k) => (data.has(k) ? data.get(k) : null),
    setItem: (k, v) => data.set(k, String(v)),
    removeItem: (k) => data.delete(k),
    raw: data,
  }
}

describe('settings store', () => {
  it('starts with the most protective defaults', () => {
    const s = createSettingsStore(fakeStorage()).get()
    expect(s).toEqual(DEFAULTS)
    expect(s.gamification).toBe(false)
    expect(s.highContrast).toBe(false)
    expect(s.controlSize).toBe('medium')
  })

  it('keeps preferences for the next launch (FR-ACC-08)', () => {
    const storage = fakeStorage()
    createSettingsStore(storage).update({ highContrast: true, controlSize: 'large' })

    const nextLaunch = createSettingsStore(storage).get()
    expect(nextLaunch.highContrast).toBe(true)
    expect(nextLaunch.controlSize).toBe('large')
  })

  it('never stores anything except known settings', () => {
    const storage = fakeStorage()
    createSettingsStore(storage).update({ name: 'Sam', dateOfBirth: '2015-01-01', ageBand: 'under13' })

    const saved = JSON.parse(storage.getItem(STORAGE_KEY))
    expect(saved).not.toHaveProperty('name')
    expect(saved).not.toHaveProperty('dateOfBirth')
    expect(saved.ageBand).toBe('under13')
  })

  it('falls back to defaults when saved data is broken', () => {
    const s = createSettingsStore(fakeStorage({ [STORAGE_KEY]: '{not json' })).get()
    expect(s).toEqual(DEFAULTS)
  })

  it('replaces wrong values with the default', () => {
    const storage = fakeStorage({
      [STORAGE_KEY]: JSON.stringify({ highContrast: 'yes', controlSize: 'huge', ageBand: '7', vibration: true }),
    })
    const s = createSettingsStore(storage).get()
    expect(s.highContrast).toBe(false)
    expect(s.controlSize).toBe('medium')
    expect(s.ageBand).toBe(null)
    expect(s.vibration).toBe(true)
  })

  it('checks the pad order is a list of names', () => {
    expect(sanitise({ padOrder: ['kick', 'snare'] }).padOrder).toEqual(['kick', 'snare'])
    expect(sanitise({ padOrder: [1, 2] }).padOrder).toBe(null)
    expect(sanitise({ padOrder: 'kick' }).padOrder).toBe(null)
  })

  it('keeps working in memory when storage throws', () => {
    const broken = {
      getItem: () => { throw new Error('blocked') },
      setItem: () => { throw new Error('blocked') },
      removeItem: () => { throw new Error('blocked') },
    }
    const store = createSettingsStore(broken)
    expect(store.get()).toEqual(DEFAULTS)
    expect(store.update({ highContrast: true }).highContrast).toBe(true)
    expect(store.reset()).toEqual(DEFAULTS)
  })

  it('works with no storage at all', () => {
    const store = createSettingsStore(null)
    expect(store.update({ showNoteNames: false }).showNoteNames).toBe(false)
  })

  it('tells subscribers about changes, and stops when asked', () => {
    const store = createSettingsStore(fakeStorage())
    const fn = vi.fn()
    const stop = store.subscribe(fn)

    store.update({ highContrast: true })
    expect(fn).toHaveBeenCalledTimes(1)
    expect(fn.mock.calls[0][0].highContrast).toBe(true)

    store.update({ highContrast: true }) // no real change: no call
    expect(fn).toHaveBeenCalledTimes(1)

    stop()
    store.update({ highContrast: false })
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('reset clears the saved copy', () => {
    const storage = fakeStorage()
    const store = createSettingsStore(storage)
    store.update({ controlSize: 'small' })
    store.reset()
    expect(storage.getItem(STORAGE_KEY)).toBe(null)
    expect(createSettingsStore(storage).get()).toEqual(DEFAULTS)
  })

  it('does not let callers change the store by editing a returned copy', () => {
    const store = createSettingsStore(fakeStorage())
    const copy = store.get()
    copy.highContrast = true
    expect(store.get().highContrast).toBe(false)
  })
})
