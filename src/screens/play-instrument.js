import { placeholderScreen } from '../components/placeholder.js'

export const title = 'Play'

// Placeholder (Milestone 0). Built in Milestone 2 (keyboard), Milestone 3 (drums) by Person A.
export function render(params) {
  return placeholderScreen({
    title,
    current: 'play-instrument',
    milestone: 'Milestone 2 (keyboard), Milestone 3 (drums)',
    owner: 'Person A',
    params: { Instrument: params.instrument },
  })
}
