import { describe, it, expect } from 'vitest'
import { clampBpm, beatIntervalMs } from './metronome.js'

describe('metronome tempo (FR-PLY-09)', () => {
  it('keeps the tempo between 40 and 160', () => {
    expect(clampBpm(20)).toBe(40)
    expect(clampBpm(200)).toBe(160)
    expect(clampBpm(80)).toBe(80)
    expect(clampBpm('100')).toBe(100)
    expect(clampBpm(99.6)).toBe(100)
    expect(clampBpm('abc')).toBe(40)
  })

  it('clicks at the rate shown', () => {
    expect(beatIntervalMs(60)).toBe(1000)
    expect(beatIntervalMs(120)).toBe(500)
    expect(beatIntervalMs(40)).toBe(1500)
    expect(beatIntervalMs(160)).toBe(375)
  })
})
