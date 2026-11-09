/*
  Drum pad helpers. Plain JavaScript with no browser or audio code, so it can be tested.
*/

export const REQUIRED_PADS = ['kick', 'snare', 'hihat', 'tom', 'crash'] // FR-PLY-03
export const ENGINES = ['membrane', 'noise', 'metal']

/*
  Put pads in the given order. Unknown ids are skipped; pads the order forgets
  are added at the end, so a pad can never disappear (FR-ACC-03 in Milestone 9
  saves the student's order in settings.padOrder).
*/
export function orderPads(pads, order) {
  const byId = new Map(pads.map((p) => [p.id, p]))
  const result = []
  for (const id of Array.isArray(order) ? order : []) {
    const pad = byId.get(id)
    if (pad && !result.includes(pad)) result.push(pad)
  }
  for (const pad of pads) {
    if (!result.includes(pad)) result.push(pad)
  }
  return result
}

// Check drums.json. Returns a list of problems; an empty list means it is fine.
export function validateDrumLayout(layout) {
  const problems = []
  const pads = Array.isArray(layout.pads) ? layout.pads : []
  const ids = pads.map((p) => p.id)

  if (new Set(ids).size !== ids.length) problems.push('pad ids must be unique')
  for (const id of REQUIRED_PADS) {
    if (!ids.includes(id)) problems.push(`missing pad: ${id}`)
  }
  for (const pad of pads) {
    if (!pad.label) problems.push(`pad ${pad.id} has no label`)
    if (!ENGINES.includes(pad.sound?.engine)) problems.push(`pad ${pad.id} has an unknown sound engine`)
  }
  for (const id of layout.order || []) {
    if (!ids.includes(id)) problems.push(`order names an unknown pad: ${id}`)
  }
  for (const id of layout.simplifiedPads || []) {
    if (!ids.includes(id)) problems.push(`simplifiedPads names an unknown pad: ${id}`)
  }
  for (const [code, id] of Object.entries(layout.laptopKeys || {})) {
    if (!ids.includes(id)) problems.push(`laptop key ${code} plays an unknown pad: ${id}`)
  }

  const m = layout.metronome
  if (m && !(m.minBpm <= m.startBpm && m.startBpm <= m.maxBpm)) {
    problems.push('metronome startBpm must be between minBpm and maxBpm')
  }
  return problems
}
