import { placeholderScreen } from '../components/placeholder.js'

export const title = 'Results'

// Placeholder (Milestone 0). Built in Milestone 7 by Person B.
export function render(params) {
  return placeholderScreen({
    title,
    current: 'results',
    milestone: 'Milestone 7',
    owner: 'Person B',
    params: { Lesson: params.id },
  })
}
