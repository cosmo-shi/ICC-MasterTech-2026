/*
  Placeholder screen used in Milestone 0. When you build a real screen,
  stop using this in that screen's file. The "Jump to a screen" list then
  disappears from that screen on its own.
*/
import { el } from './dom.js'
import { icon } from './icons.js'
import { ROUTES, hrefFor } from '../router.js'

export function demoBadge() {
  return el('p', { class: 'demo-badge' }, [icon('info'), 'Demo data'])
}

/*
  options:
    title      screen name, shown as the <h1>
    current    route name of this screen (marks it in the jump list)
    milestone  which milestone builds it, e.g. 'Milestone 1'
    owner      'Person A' or 'Person B'
    params     route parameters to show, e.g. { Instrument: 'keyboard' }
    demo       true for mock screens: shows the "Demo data" label
    extra      optional element(s) to show under the details
*/
export function placeholderScreen({ title, current, milestone, owner, params = {}, demo = false, extra = null }) {
  const facts = [
    ['Built in', milestone],
    ['Owner', owner],
    ...Object.entries(params),
  ].filter(([, value]) => value)

  const jump = ROUTES.map((route) =>
    el('li', {}, [
      el('a', { href: hrefFor(route), 'aria-current': route.name === current ? 'page' : null }, [
        route.label,
        icon('arrow', 'jump-list__arrow'),
      ]),
    ]),
  )

  return el('section', { class: 'screen wrap', 'aria-labelledby': 'screen-title' }, [
    el('header', { class: 'screen__head' }, [
      demo ? demoBadge() : null,
      el('h1', { id: 'screen-title' }, title),
      el('p', { class: 'screen__lead' }, 'This screen is a placeholder.'),
    ]),
    el('dl', { class: 'placeholder-facts' }, facts.map(([k, v]) => el('div', {}, [el('dt', {}, k), el('dd', {}, String(v))]))),
    extra ? el('div', { class: 'screen__section' }, extra) : null,
    el('nav', { class: 'screen__section', 'aria-labelledby': 'jump-title' }, [
      el('h2', { id: 'jump-title' }, 'Jump to a screen'),
      el('ul', { class: 'jump-list' }, jump),
    ]),
  ])
}
