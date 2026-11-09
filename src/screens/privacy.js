import { placeholderScreen } from '../components/placeholder.js'

export const title = 'Privacy'

// Placeholder (Milestone 0). Built in Milestone 1 (reason screen), Milestone 12 (notice) by Person B.
export function render() {
  return placeholderScreen({
    title,
    current: 'privacy',
    milestone: 'Milestone 1 (reason screen), Milestone 12 (notice)',
    owner: 'Person B',
    demo: true,
  })
}
