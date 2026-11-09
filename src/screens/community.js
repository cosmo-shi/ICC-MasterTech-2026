import { placeholderScreen } from '../components/placeholder.js'

export const title = 'Community'

// Placeholder (Milestone 0). Built in Milestone 12 by Person B.
export function render() {
  return placeholderScreen({
    title,
    current: 'community',
    milestone: 'Milestone 12',
    owner: 'Person B',
    demo: true,
  })
}
