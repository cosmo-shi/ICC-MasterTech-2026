/*
  Note helpers. Plain JavaScript with no browser or audio code, so it can be tested.
  Notes are written like "C4" or "C#4" (sharps only; 4 is the octave, C4 is middle C).
*/

const LETTERS = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']

// "C#4" -> { name: 'C#', letter: 'C', sharp: true, octave: 4, midi: 61 }
export function parseNote(note) {
  const match = /^([A-G])(#?)(-?\d)$/.exec(String(note))
  if (!match) throw new Error(`Not a note: ${note}`)
  const [, letter, sharp, octaveText] = match
  const name = letter + sharp
  const index = LETTERS.indexOf(name)
  if (index === -1) throw new Error(`Not a note: ${note}`) // e.g. E# or B#
  const octave = Number(octaveText)
  return { name, letter, sharp: sharp === '#', octave, midi: (octave + 1) * 12 + index }
}

export function noteFromMidi(midi) {
  return LETTERS[midi % 12] + (Math.floor(midi / 12) - 1)
}

// Every key from range.from to range.to, in order, with what to print and what to say.
export function buildKeys(range) {
  const start = parseNote(range.from).midi
  const end = parseNote(range.to).midi
  if (end < start) throw new Error('Range goes backwards')
  const keys = []
  for (let midi = start; midi <= end; midi++) {
    const note = noteFromMidi(midi)
    const { letter, sharp, octave } = parseNote(note)
    keys.push({
      note,
      midi,
      isBlack: sharp,
      label: sharp ? `${letter}♯` : letter,
      spoken: sharp ? `${letter} sharp ${octave}` : `${letter} ${octave}`,
    })
  }
  return keys
}

// The letter printed on a laptop key, from its key code: KeyZ -> Z, Digit2 -> 2.
export function keyCodeLabel(code) {
  return String(code).replace(/^Key/, '').replace(/^Digit/, '')
}

// Check keyboard.json. Returns a list of problems; an empty list means it is fine.
export function validateKeyboardLayout(layout) {
  const problems = []
  let keys = []
  try {
    keys = buildKeys(layout.range)
  } catch (err) {
    problems.push(`range: ${err.message}`)
  }
  const inRange = new Set(keys.map((k) => k.note))
  if (keys.filter((k) => !k.isBlack).length < 14) problems.push('range must cover at least two octaves')

  for (const [code, note] of Object.entries(layout.laptopKeys || {})) {
    if (!inRange.has(note)) problems.push(`laptop key ${code} plays ${note}, which is not on the keyboard`)
  }

  const m = layout.metronome || {}
  if (!(m.minBpm <= m.startBpm && m.startBpm <= m.maxBpm)) problems.push('metronome startBpm must be between minBpm and maxBpm')
  return problems
}
