import { placeholderScreen } from '../components/placeholder.js'

export const title = 'Lesson goal'

// Placeholder (Milestone 0). Built in Milestone 6 by Person A.
export function render(params) {
  return placeholderScreen({
    title,
    current: 'lesson-goal',
    milestone: 'Milestone 6',
    owner: 'Person A',
    params: { Lesson: params.id },
  })
}
