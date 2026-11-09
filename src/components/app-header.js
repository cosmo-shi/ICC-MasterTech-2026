import { el } from './dom.js'
import { icon } from './icons.js'

// App header: the app name goes home; Settings is always one tap away.
export function createAppHeader() {
  const settingsLink = el('a', { class: 'app-header__link', href: '#/settings' }, [icon('gear'), 'Settings'])

  const header = el('header', { class: 'app-header' }, [
    el('div', { class: 'app-header__inner wrap' }, [
      el('a', { class: 'app-header__home', href: '#/', 'aria-label': 'Musica, home' }, 'Musica'),
      el('nav', { 'aria-label': 'Main' }, [settingsLink]),
    ]),
  ])

  function setCurrent(routeName) {
    if (routeName === 'settings') settingsLink.setAttribute('aria-current', 'page')
    else settingsLink.removeAttribute('aria-current')
  }

  return { element: header, setCurrent }
}
