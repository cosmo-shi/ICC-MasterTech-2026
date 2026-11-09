import { placeholderScreen } from '../components/placeholder.js'

export const title = 'Instruments'

// Placeholder (Milestone 0). Built in Milestone 1 by Person B.
export function render() {
  return placeholderScreen({
    title,
    current: 'instrument-list',
    milestone: 'Milestone 1',
    owner: 'Person B',
  })
}
