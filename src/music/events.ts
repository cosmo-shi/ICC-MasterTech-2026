// Canonical musical events. One representation drives sound, notation, checking and replay.
// Time is in integer ticks: 480 ticks per crotchet (pack v2, AI_MUSIC_INTERACTION.md).

export const TPQ = 480;

export type InstrumentId = 'keyboard' | 'drums';
export type DrumSound = 'kick' | 'snare' | 'hihat' | 'tomHigh' | 'tomLow' | 'crash' | 'clave';
export const DRUM_SOUNDS: readonly DrumSound[] = ['kick', 'snare', 'hihat', 'tomHigh', 'tomLow', 'crash', 'clave'];

export type Author = 'learner' | 'lesson' | 'partner';

export interface NoteEvent {
  id: string;
  kind: 'note';
  onset: number; // ticks
  duration: number; // ticks
  midi: number;
  velocity: number; // 0..1 intentional dynamic
  author?: Author;
}

export interface DrumEvent {
  id: string;
  kind: 'drum';
  onset: number;
  duration: number;
  sound: DrumSound;
  velocity: number;
  author?: Author;
}

export interface RestEvent {
  id: string;
  kind: 'rest';
  onset: number;
  duration: number;
  author?: Author;
}

export type SoundingEvent = NoteEvent | DrumEvent;
export type MusicEvent = SoundingEvent | RestEvent;

export interface Phrase {
  id: string;
  instrument: InstrumentId;
  meter: [number, number];
  totalTicks: number;
  tempoBpm: number;
  events: MusicEvent[];
}

export function isSounding(e: MusicEvent): e is SoundingEvent {
  return e.kind !== 'rest';
}

export function soundingEvents(p: Phrase): SoundingEvent[] {
  return p.events.filter(isSounding).sort((a, b) => a.onset - b.onset);
}

export function ticksToMs(ticks: number, bpm: number): number {
  return (ticks / TPQ) * (60000 / bpm);
}

export function msToTicks(ms: number, bpm: number): number {
  return (ms / (60000 / bpm)) * TPQ;
}

/** Lossless beats→ticks conversion. Throws if a value cannot be represented exactly. */
export function beatsToTicks(beats: number): number {
  const t = beats * TPQ;
  if (Math.abs(t - Math.round(t)) > 1e-9) throw new Error(`Beat value ${beats} is not representable at ${TPQ} TPQ`);
  return Math.round(t);
}

export function sameSound(a: SoundingEvent, b: SoundingEvent): boolean {
  if (a.kind === 'note' && b.kind === 'note') return a.midi === b.midi;
  if (a.kind === 'drum' && b.kind === 'drum') return a.sound === b.sound;
  return false;
}

export function clonePhrase(p: Phrase): Phrase {
  return { ...p, meter: [p.meter[0], p.meter[1]], events: p.events.map((e) => ({ ...e })) };
}
