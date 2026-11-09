import { describe, it, expect } from 'vitest'
import { parseHash, ROUTES, HOME, NOT_FOUND, hrefFor } from './router.js'

describe('parseHash', () => {
  it('sends an empty address home', () => {
    expect(parseHash('').name).toBe(HOME)
    expect(parseHash('#').name).toBe(HOME)
    expect(parseHash('#/').name).toBe(HOME)
  })

  it('finds simple screens', () => {
    expect(parseHash('#/settings')).toEqual({ name: 'settings', params: {} })
    expect(parseHash('#/instruments')).toEqual({ name: 'instrument-list', params: {} })
  })

  it('reads parameters from the address', () => {
    expect(parseHash('#/play/drums')).toEqual({ name: 'play-instrument', params: { instrument: 'drums' } })
    expect(parseHash('#/lesson/rhythm-1')).toEqual({ name: 'lesson-goal', params: { id: 'rhythm-1' } })
    expect(parseHash('#/lesson/rhythm-1/play')).toEqual({ name: 'lesson-play', params: { id: 'rhythm-1' } })
    expect(parseHash('#/lesson/rhythm-1/results')).toEqual({ name: 'results', params: { id: 'rhythm-1' } })
  })

  it('ignores a trailing slash and a query', () => {
    expect(parseHash('#/settings/').name).toBe('settings')
    expect(parseHash('#/settings?x=1').name).toBe('settings')
  })

  it('reports unknown addresses as not found', () => {
    expect(parseHash('#/nope').name).toBe(NOT_FOUND)
    expect(parseHash('#/play').name).toBe(NOT_FOUND)
    expect(parseHash('#/play/%E0%A4%A').name).toBe(NOT_FOUND)
  })

  it('has one route for every screen in SPEC section 9', () => {
    const files = [
      'onboarding', 'instrument-list', 'play-instrument', 'units', 'lesson-goal', 'lesson-play',
      'results', 'my-music', 'settings', 'teacher', 'community', 'privacy', 'credits',
    ]
    expect(ROUTES.map((r) => r.name).sort()).toEqual([...files].sort())
  })

  it('every example link opens its own screen', () => {
    for (const route of ROUTES) {
      expect(parseHash(hrefFor(route)).name).toBe(route.name)
    }
  })
})
