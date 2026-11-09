import { placeholderScreen } from '../components/placeholder.js'

export const title = 'My Music'

// Placeholder (Milestone 0). Built in Milestone 11 by Person A.
export function render() {
  return placeholderScreen({
    title,
    current: 'my-music',
    milestone: 'Milestone 11',
    owner: 'Person A',
  })
}
