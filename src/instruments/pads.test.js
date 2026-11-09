import { describe, it, expect } from 'vitest'
import { orderPads, validateDrumLayout, REQUIRED_PADS } from './pads.js'
import drums from '../data/instruments/drums.json'

const ids = (pads) => pads.map((p) => p.id)

describe('drums.json', () => {
  it('passes the layout check', () => {
    expect(validateDrumLayout(drums)).toEqual([])
  })

  it('has the five pads from FR-PLY-03, each with a label', () => {
    expect(ids(drums.pads).sort()).toEqual([...REQUIRED_PADS].sort())
    expect(drums.pads.every((p) => p.label)).toBe(true)
  })

  it('has a four-pad simplified layout ready for Milestone 9', () => {
    expect(drums.simplifiedPads).toHaveLength(4)
  })
})

describe('validateDrumLayout', () => {
  it('reports a missing pad', () => {
    const bad = { ...drums, pads: drums.pads.filter((p) => p.id !== 'tom') }
    expect(validateDrumLayout(bad).join(' ')).toMatch(/missing pad: tom/)
  })

  it('reports an unknown sound engine and a bad laptop key', () => {
    const bad = {
      ...drums,
      pads: drums.pads.map((p) => (p.id === 'kick' ? { ...p, sound: { engine: 'banjo' } } : p)),
      laptopKeys: { KeyA: 'cowbell' },
    }
    const problems = validateDrumLayout(bad)
    expect(problems.some((p) => p.includes('kick'))).toBe(true)
    expect(problems.some((p) => p.includes('cowbell'))).toBe(true)
  })
})

describe('orderPads', () => {
  it('follows the order given', () => {
    expect(ids(orderPads(drums.pads, ['crash', 'tom', 'hihat', 'snare', 'kick']))).toEqual(['crash', 'tom', 'hihat', 'snare', 'kick'])
  })

  it('skips unknown ids and never loses a pad', () => {
    expect(ids(orderPads(drums.pads, ['cowbell', 'snare']))).toEqual(['snare', 'kick', 'hihat', 'tom', 'crash'])
  })

  it('uses the file order when there is no saved order', () => {
    expect(ids(orderPads(drums.pads, null))).toEqual(ids(drums.pads))
  })
})
