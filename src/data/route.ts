// The learning route: units in a deliberate order (sound before symbol, pulse before rhythm,
// pitch direction before note names, reading after hearing, making music at the end of every unit).
// Draft sequence pending review by a primary music educator.

import type { PathwayId } from '../state/prefs.tsx';

export interface RouteStop {
  /** Lesson (L..) or partner project (mission) id. */
  id: string;
  kind: 'lesson' | 'project';
}

export interface Unit {
  id: string;
  title: string;
  /** One line for children. */
  about: string;
  stops: RouteStop[];
}

const L = (id: string): RouteStop => ({ id, kind: 'lesson' });
const P = (id: string): RouteStop => ({ id, kind: 'project' });

export const UNITS: Unit[] = [
  { id: 'u-sound', title: 'Sounds', about: 'Loud, soft, high, low. Tell a story with sound.', stops: [L('L00'), P('F_SOUND_STORY')] },
  { id: 'u-beat', title: 'Beat and rhythm', about: 'Feel the beat, leave a space, fit two sounds in.', stops: [L('L01'), L('L02'), L('L03'), P('P12_RHYTHMIC_CONVERSATION')] },
  { id: 'u-pitch', title: 'High and low', about: 'Hear notes go up and down, then find C, D and E.', stops: [L('L04'), L('L05'), L('L06'), P('P34_MELODIC_REPLY')] },
  { id: 'u-long', title: 'Long, short and silent', about: 'Hold a note, read rests, play what you see.', stops: [L('L07'), L('L08')] },
  { id: 'u-make', title: 'Make your music', about: 'Answer a tune and build a piece from two ideas.', stops: [L('L09'), P('P56_FORM_AND_TEXTURE'), P('OLDER_EXTENSION')] },
];

/** Where each starting point begins. Everything stays open; this only sets "you are here". */
export const START_UNIT: Record<PathwayId, string> = { F: 'u-sound', '1-2': 'u-beat', '3-4': 'u-pitch', '5-6': 'u-long', older: 'u-long' };

/** Lessons in route order, starting from the chosen unit and wrapping round to the earlier ones. */
export function routeLessons(start: PathwayId | null): string[] {
  const all = UNITS.flatMap((u) => u.stops.filter((s) => s.kind === 'lesson').map((s) => s.id));
  if (!start) return all;
  const unit = UNITS.findIndex((u) => u.id === START_UNIT[start]);
  const first = UNITS[unit].stops.find((s) => s.kind === 'lesson')!.id;
  const i = all.indexOf(first);
  return [...all.slice(i), ...all.slice(0, i)];
}

export const unitOf = (id: string) => UNITS.find((u) => u.stops.some((s) => s.id === id));
