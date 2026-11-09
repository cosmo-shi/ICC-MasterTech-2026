import { placeholderScreen } from '../components/placeholder.js'

export const title = 'Onboarding'

// Placeholder (Milestone 0). Built in Milestone 1 by Person B.
export function render() {
  return placeholderScreen({
    title,
    current: 'onboarding',
    milestone: 'Milestone 1',
    owner: 'Person B',
  })
}
