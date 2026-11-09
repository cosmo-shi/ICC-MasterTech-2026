import { el } from '../components/dom.js'

export const title = 'Page not found'

export function render() {
  return el('section', { class: 'screen wrap', 'aria-labelledby': 'screen-title' }, [
    el('header', { class: 'screen__head' }, [
      el('h1', { id: 'screen-title' }, 'Page not found'),
      el('p', { class: 'screen__lead' }, 'This page does not exist.'),
    ]),
    el('a', { class: 'button', href: '#/' }, 'Go to the start'),
  ])
}
