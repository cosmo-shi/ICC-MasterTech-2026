/*
  Settings store (FR-ACC-08): preferences saved on this device only.

  - Nothing here ever leaves the device. Never add a name, date of birth or location.
  - Defaults are the most protective choice (NFR-PRI-02).
  - To add a setting in a later milestone, add ONE line to DEFAULTS (and,
    if it is a choice from a list, its allowed values to ALLOWED).

  Use it like this:
    import { getSettings, updateSettings, subscribe } from '../settings/settings.js'
    getSettings().highContrast            // read
    updateSettings({ highContrast: true }) // change and save
    const stop = subscribe((s) => ...)     // run code on every change; call stop() to end
*/

export const STORAGE_KEY = 'musica.settings.v1'

export const DEFAULTS = Object.freeze({
  // Onboarding (Milestone 1)
  ageBand: null,          // 'under13' | '13to17' | '18plus'; nothing else about age is stored
  goal: null,             // 'notes' | 'rhythm' | 'play'
  onboardingDone: false,

  // Controls and accessibility (Milestone 9)
  controlSize: 'medium',  // FR-ACC-01
  simplifiedLayout: false,// FR-ACC-02
  padOrder: null,         // FR-ACC-03: array of pad ids, or null for the default order
  highContrast: false,    // FR-ACC-04
  colourBlindNotes: false,// FR-ACC-05
  showNoteNames: true,    // FR-PLY-11

  // Optional extras, off until the student turns them on
  vibration: false,       // FR-PLY-10
  gamification: false,    // FR-GAM-01: off by default
})

// Settings that must be one value from a fixed list.
export const ALLOWED = Object.freeze({
  ageBand: [null, 'under13', '13to17', '18plus'],
  goal: [null, 'notes', 'rhythm', 'play'],
  controlSize: ['small', 'medium', 'large'],
})

function isValid(key, value) {
  if (key in ALLOWED) return ALLOWED[key].includes(value)
  if (key === 'padOrder') {
    return value === null || (Array.isArray(value) && value.every((v) => typeof v === 'string'))
  }
  return typeof value === typeof DEFAULTS[key]
}

// Keep only known keys with valid values; anything else falls back to the default.
export function sanitise(raw) {
  const clean = { ...DEFAULTS }
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return clean
  for (const key of Object.keys(DEFAULTS)) {
    if (key in raw && isValid(key, raw[key])) clean[key] = raw[key]
  }
  return clean
}

function getDeviceStorage() {
  try {
    return globalThis.localStorage ?? null
  } catch {
    return null // storage blocked, e.g. some private windows
  }
}

/*
  Make a store. The app uses the shared one below; tests pass a fake storage.
  If storage is missing or throws, the store still works for this visit (in memory).
*/
export function createSettingsStore(storage = getDeviceStorage()) {
  let current = load()
  const listeners = new Set()

  function load() {
    if (!storage) return { ...DEFAULTS }
    try {
      const text = storage.getItem(STORAGE_KEY)
      return text ? sanitise(JSON.parse(text)) : { ...DEFAULTS }
    } catch {
      return { ...DEFAULTS }
    }
  }

  function save() {
    if (!storage) return
    try {
      storage.setItem(STORAGE_KEY, JSON.stringify(current))
    } catch {
      // Storage full or blocked: keep working in memory.
    }
  }

  function notify() {
    const snapshot = get()
    for (const fn of listeners) fn(snapshot)
  }

  function get() {
    return { ...current }
  }

  function update(partial) {
    const next = sanitise({ ...current, ...partial })
    const changed = Object.keys(next).some(
      (key) => JSON.stringify(next[key]) !== JSON.stringify(current[key]),
    )
    if (!changed) return get()
    current = next
    save()
    notify()
    return get()
  }

  function reset() {
    current = { ...DEFAULTS }
    if (storage) {
      try {
        storage.removeItem(STORAGE_KEY)
      } catch {
        // ignore
      }
    }
    notify()
    return get()
  }

  function subscribe(fn) {
    listeners.add(fn)
    return () => listeners.delete(fn)
  }

  return { get, update, reset, subscribe }
}

// The one shared store for the app.
const store = createSettingsStore()

export const getSettings = () => store.get()
export const updateSettings = (partial) => store.update(partial)
export const resetSettings = () => store.reset()
export const subscribe = (fn) => store.subscribe(fn)
