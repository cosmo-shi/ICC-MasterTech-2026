/*
  Hash routing: the part after # in the address picks the screen, e.g. #/settings.

  Every screen is already listed here, so nobody needs to edit this file again.
  To build a screen, edit its file in src/screens/. A screen file exports:
    export const title = 'Settings'           // shown in the browser tab
    export function render(params) { ... }    // returns an HTMLElement with one <h1>
    export function cleanup() { ... }         // optional: stop sounds and listeners on leave

  params holds the parts of the address marked with ":" below,
  e.g. #/play/drums gives { instrument: 'drums' }.
*/

export const ROUTES = [
  { name: 'onboarding',      path: '/onboarding',           label: 'Onboarding',      load: () => import('./screens/onboarding.js') },
  { name: 'instrument-list', path: '/instruments',          label: 'Instrument list', load: () => import('./screens/instrument-list.js'), needsSound: true },
  { name: 'play-instrument', path: '/play/:instrument',     label: 'Instrument play', load: () => import('./screens/play-instrument.js'), needsSound: true, example: '/play/keyboard' },
  { name: 'units',           path: '/units',                label: 'Units',           load: () => import('./screens/units.js') },
  { name: 'lesson-goal',     path: '/lesson/:id',           label: 'Lesson goal',     load: () => import('./screens/lesson-goal.js'), needsSound: true, example: '/lesson/notes-1' },
  { name: 'lesson-play',     path: '/lesson/:id/play',      label: 'Lesson',          load: () => import('./screens/lesson-play.js'), needsSound: true, example: '/lesson/notes-1/play' },
  { name: 'results',         path: '/lesson/:id/results',   label: 'Results',         load: () => import('./screens/results.js'), example: '/lesson/notes-1/results' },
  { name: 'my-music',        path: '/my-music',             label: 'My Music',        load: () => import('./screens/my-music.js') },
  { name: 'settings',        path: '/settings',             label: 'Settings',        load: () => import('./screens/settings.js') },
  { name: 'teacher',         path: '/teacher',              label: 'Teacher',         load: () => import('./screens/teacher.js') },
  { name: 'community',       path: '/community',            label: 'Community',       load: () => import('./screens/community.js') },
  { name: 'privacy',         path: '/privacy',              label: 'Privacy',         load: () => import('./screens/privacy.js') },
  { name: 'credits',         path: '/credits',              label: 'Credits',         load: () => import('./screens/credits.js') },
]

export const HOME = '__home__'
export const NOT_FOUND = 'not-found'

// Turn "#/lesson/notes-1/play" into { name: 'lesson-play', params: { id: 'notes-1' } }.
export function parseHash(hash) {
  let path = String(hash || '').replace(/^#/, '').split('?')[0]
  if (!path.startsWith('/')) path = '/' + path
  path = path.replace(/\/+$/, '') || '/'

  if (path === '/') return { name: HOME, params: {} }

  const parts = path.split('/').filter(Boolean)
  for (const route of ROUTES) {
    const pattern = route.path.split('/').filter(Boolean)
    if (pattern.length !== parts.length) continue
    const params = {}
    const match = pattern.every((seg, i) => {
      if (seg.startsWith(':')) {
        try {
          params[seg.slice(1)] = decodeURIComponent(parts[i])
        } catch {
          return false
        }
        return true
      }
      return seg === parts[i]
    })
    if (match) return { name: route.name, params }
  }
  return { name: NOT_FOUND, params: {} }
}

export function findRoute(name) {
  return ROUTES.find((r) => r.name === name) || null
}

// A link to a route, filling in an example value for routes with parameters.
export function hrefFor(route) {
  return '#' + (route.example || route.path)
}

/*
  Start the router.
  - outlet: the <main> element screens are drawn into
  - getHomeHash: decides where "#/" goes (onboarding the first time, then the instrument list)
  - onRouteChange: called with { name, params, route } after each screen is drawn
*/
export function startRouter({ outlet, getHomeHash, onRouteChange = () => {} }) {
  let currentModule = null
  let firstRender = true
  let navId = 0

  async function show() {
    const id = ++navId
    const parsed = parseHash(location.hash)

    if (parsed.name === HOME) {
      location.replace(getHomeHash())
      return
    }

    const route = findRoute(parsed.name)
    let mod
    try {
      mod = route ? await route.load() : await import('./screens/not-found.js')
    } catch (err) {
      console.error('Could not load screen', parsed.name, err)
      mod = await import('./screens/not-found.js')
    }
    if (id !== navId) return // the student moved on while this was loading

    if (currentModule && typeof currentModule.cleanup === 'function') {
      try {
        currentModule.cleanup()
      } catch (err) {
        console.error('Screen cleanup failed', err)
      }
    }

    const element = mod.render(parsed.params)
    outlet.replaceChildren(element)
    currentModule = mod
    document.title = mod.title ? `${mod.title} – Musica` : 'Musica'

    if (!firstRender) {
      window.scrollTo(0, 0)
      // Move focus to the new screen's title so screen readers announce it.
      const heading = outlet.querySelector('h1')
      if (heading) {
        heading.setAttribute('tabindex', '-1')
        heading.focus({ preventScroll: true })
      }
    }
    firstRender = false

    onRouteChange({ name: parsed.name, params: parsed.params, route })
  }

  window.addEventListener('hashchange', show)
  show()
}
