import { describe, it, expect } from 'vitest'
import { parseNote, noteFromMidi, buildKeys, keyCodeLabel, validateKeyboardLayout } from './notes.js'
import keyboard from '../data/instruments/keyboard.json'

describe('parseNote', () => {
  it('reads letters, sharps and octaves', () => {
    expect(parseNote('C4').midi).toBe(60)
    expect(parseNote('A4').midi).toBe(69)
    expect(parseNote('C#4')).toMatchObject({ letter: 'C', sharp: true, octave: 4, midi: 61 })
  })

  it('rejects things that are not notes', () => {
    expect(() => parseNote('H4')).toThrow()
    expect(() => parseNote('E#4')).toThrow()
    expect(() => parseNote('C')).toThrow()
  })

  it('turns a number back into a note', () => {
    expect(noteFromMidi(60)).toBe('C4')
    expect(noteFromMidi(73)).toBe('C#5')
  })
})

describe('buildKeys', () => {
  const keys = buildKeys({ from: 'C4', to: 'C6' })

  it('makes two octaves: 25 keys, 15 white and 10 black (FR-PLY-02)', () => {
    expect(keys).toHaveLength(25)
    expect(keys.filter((k) => !k.isBlack)).toHaveLength(15)
    expect(keys.filter((k) => k.isBlack)).toHaveLength(10)
  })

  it('prints and says the right name on every key (FR-PLY-01)', () => {
    expect(keys[0]).toMatchObject({ note: 'C4', label: 'C', spoken: 'C 4' })
    expect(keys[1]).toMatchObject({ note: 'C#4', label: 'C♯', spoken: 'C sharp 4', isBlack: true })
    expect(keys.at(-1).note).toBe('C6')
  })
})

describe('keyboard.json', () => {
  it('passes the layout check', () => {
    expect(validateKeyboardLayout(keyboard)).toEqual([])
  })

  it('reports a laptop key that plays a note off the keyboard', () => {
    const bad = { ...keyboard, laptopKeys: { KeyZ: 'C2' } }
    expect(validateKeyboardLayout(bad)).toHaveLength(1)
  })

  it('maps laptop keys across both octaves', () => {
    const notes = Object.values(keyboard.laptopKeys)
    expect(notes).toContain('C4')
    expect(notes).toContain('C6')
    expect(new Set(notes).size).toBe(notes.length)
  })

  it('shows laptop keys as plain letters', () => {
    expect(keyCodeLabel('KeyZ')).toBe('Z')
    expect(keyCodeLabel('Digit2')).toBe('2')
  })
})
