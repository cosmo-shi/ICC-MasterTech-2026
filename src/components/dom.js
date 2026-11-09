/*
  Tiny helper for building HTML elements in plain JavaScript.
    el('p', { class: 'note' }, 'Hello')
    el('a', { href: '#/settings', 'aria-current': 'page' }, [icon('gear'), 'Settings'])
  Text is always added as text, never as HTML, so it is safe.
*/
export function el(tag, attrs = {}, children = []) {
  const node = document.createElement(tag)
  for (const [key, value] of Object.entries(attrs)) {
    if (value === false || value === null || value === undefined) continue
    if (key.startsWith('on') && typeof value === 'function') {
      node.addEventListener(key.slice(2).toLowerCase(), value)
    } else if (value === true) {
      node.setAttribute(key, '')
    } else {
      node.setAttribute(key, String(value))
    }
  }
  for (const child of [].concat(children)) {
    if (child === null || child === undefined || child === false) continue
    node.append(child instanceof Node ? child : document.createTextNode(String(child)))
  }
  return node
}
