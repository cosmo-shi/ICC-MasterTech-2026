// Musical reply plans: compile a bounded operation into events, then verify the declared
// symbolic change before anything is played. A plan is data, never code or HTML.

import { type MusicEvent, type NoteEvent, type Phrase, type SoundingEvent, TPQ, clonePhrase, isSounding } from '../music/events.ts';

export const OPERATIONS = ['echo', 'add_part', 'replace_with_rest', 'transpose', 'dynamics', 'section_order'] as const;
export type Operation = (typeof OPERATIONS)[number];

export type ReplyParams =
  | { op: 'echo'; tempoScale: number }
  | { op: 'add_part'; part: 'pulse' | 'drone' | 'backbeat'; tempoScale: number }
  | { op: 'replace_with_rest'; eventId: string }
  | { op: 'transpose'; semitones: number }
  | { op: 'dynamics'; direction: 'softer' | 'louder' }
  | { op: 'section_order'; splitTick: number };

export type Provenance = 'local-model' | 'rules' | 'learner-directed';

export interface ReplyPlan {
  planId: string;
  params: ReplyParams;
  source: 'learner' | 'target';
  provenance: Provenance;
  evidenceFactIds: string[];
  templateId: string;
}

export interface Track {
  id: string;
  author: 'learner' | 'partner' | 'lesson';
  instrument: 'keyboard' | 'drums';
  events: MusicEvent[];
}

export interface ReplyRender {
  tempoBpm: number;
  totalTicks: number;
  tracks: Track[];
}

export interface Verification {
  ok: boolean;
  violations: string[];
  verified: string[]; // human-readable invariants that were proven
}

const MAX_EVENTS = 96;
const MAX_TICKS = 16 * TPQ * 4; // 16 bars of 4/4
const MAX_VELOCITY = 0.9;

function sounding(events: MusicEvent[]): SoundingEvent[] {
  return events.filter(isSounding).sort((a, b) => a.onset - b.onset || a.id.localeCompare(b.id));
}

function sameTiming(a: MusicEvent, b: MusicEvent): boolean {
  return a.onset === b.onset && a.duration === b.duration;
}

function sameContent(a: MusicEvent, b: MusicEvent): boolean {
  if (a.kind !== b.kind || !sameTiming(a, b)) return false;
  if (a.kind === 'note' && b.kind === 'note') return a.midi === b.midi && Math.abs(a.velocity - b.velocity) < 1e-9;
  if (a.kind === 'drum' && b.kind === 'drum') return a.sound === b.sound && Math.abs(a.velocity - b.velocity) < 1e-9;
  return true;
}

function pulseTrack(source: Phrase, part: 'pulse' | 'drone' | 'backbeat'): Track {
  const events: MusicEvent[] = [];
  const beats = Math.round(source.totalTicks / TPQ);
  for (let b = 0; b < beats; b++) {
    if (part === 'backbeat' && b % 2 === 0) continue;
    if (part === 'drone') {
      if (b % 4 !== 0) continue;
      events.push({ id: `partner-${b}`, kind: 'note', onset: b * TPQ, duration: Math.min(4, beats - b) * TPQ, midi: 48, velocity: 0.35, author: 'partner' });
    } else {
      events.push({ id: `partner-${b}`, kind: 'drum', onset: b * TPQ, duration: TPQ, sound: part === 'pulse' ? 'clave' : 'snare', velocity: b % 4 === 0 ? 0.55 : 0.4, author: 'partner' });
    }
  }
  return { id: 'partner', author: 'partner', instrument: part === 'drone' ? 'keyboard' : 'drums', events };
}

export function compileReply(plan: ReplyPlan, source: Phrase): ReplyRender {
  const src = clonePhrase(source);
  const author: Track['author'] = plan.source === 'learner' ? 'learner' : 'lesson';
  const base: Track = { id: plan.source, author, instrument: src.instrument, events: src.events };
  const p = plan.params;
  switch (p.op) {
    case 'echo':
      return { tempoBpm: src.tempoBpm * p.tempoScale, totalTicks: src.totalTicks, tracks: [base] };
    case 'add_part':
      return { tempoBpm: src.tempoBpm * p.tempoScale, totalTicks: src.totalTicks, tracks: [base, pulseTrack(src, p.part)] };
    case 'replace_with_rest': {
      const events = src.events.map((e): MusicEvent => (e.id === p.eventId && isSounding(e) ? { id: `${e.id}-rest`, kind: 'rest', onset: e.onset, duration: e.duration, author: 'partner' } : e));
      return { tempoBpm: src.tempoBpm, totalTicks: src.totalTicks, tracks: [{ ...base, events }] };
    }
    case 'transpose': {
      const events = src.events.map((e): MusicEvent => (e.kind === 'note' ? { ...e, midi: e.midi + p.semitones } : e));
      return { tempoBpm: src.tempoBpm, totalTicks: src.totalTicks, tracks: [{ ...base, events }] };
    }
    case 'dynamics': {
      const scale = (v: number) => (p.direction === 'softer' ? Math.max(0.12, v * 0.45) : Math.min(MAX_VELOCITY, v * 1.6));
      const events = src.events.map((e): MusicEvent => (isSounding(e) ? { ...e, velocity: scale(e.velocity) } : e));
      return { tempoBpm: src.tempoBpm, totalTicks: src.totalTicks, tracks: [{ ...base, events }] };
    }
    case 'section_order': {
      const span = src.totalTicks;
      const events = src.events.map((e): MusicEvent => ({ ...e, onset: e.onset >= p.splitTick ? e.onset - p.splitTick : e.onset + (span - p.splitTick) }));
      events.sort((a, b) => a.onset - b.onset);
      return { tempoBpm: src.tempoBpm, totalTicks: span, tracks: [{ ...base, events }] };
    }
  }
}

/** Verify exactly the declared relation between source and render. */
export function verifyReply(plan: ReplyPlan, source: Phrase, render: ReplyRender, opts: { independentCheck?: boolean } = {}): Verification {
  const v: string[] = [];
  const ok: string[] = [];
  const p = plan.params;
  if (!(OPERATIONS as readonly string[]).includes(p.op)) return { ok: false, violations: ['unknown operation'], verified: [] };
  if (opts.independentCheck) v.push('replies are not allowed during an independent check');

  // General bounds
  const all = render.tracks.flatMap((t) => t.events);
  if (all.length > MAX_EVENTS) v.push('too many events');
  if (render.totalTicks > MAX_TICKS || render.totalTicks <= 0) v.push('length out of range');
  if (!(render.tempoBpm >= 40 && render.tempoBpm <= 160)) v.push('tempo outside 40–160 bpm');
  for (const e of all) {
    if (!Number.isFinite(e.onset) || !Number.isFinite(e.duration) || e.onset < 0 || e.duration <= 0 || e.onset + e.duration > render.totalTicks) v.push(`${e.id}: timing out of range`);
    if (isSounding(e) && !(e.velocity > 0 && e.velocity <= MAX_VELOCITY + 1e-9)) v.push(`${e.id}: volume out of range`);
    if (e.kind === 'note' && (e.midi < 36 || e.midi > 96)) v.push(`${e.id}: pitch out of range`);
  }
  if (v.length === 0) ok.push('within length, tempo, pitch and volume limits');

  const main = render.tracks[0];
  const srcS = sounding(source.events);
  const outS = sounding(main?.events ?? []);

  switch (p.op) {
    case 'echo': {
      if (render.tracks.length !== 1) v.push('echo must not add parts');
      if (srcS.length !== outS.length || srcS.some((e, i) => !sameContent(e, outS[i]))) v.push('echo changed the music');
      else ok.push('every note kept the same sound, start and length');
      if (!(p.tempoScale >= 0.6 && p.tempoScale <= 1)) v.push('echo tempo change out of range');
      break;
    }
    case 'add_part': {
      if (render.tracks.length !== 2) v.push('add_part must add exactly one part');
      if (srcS.length !== outS.length || srcS.some((e, i) => !sameContent(e, outS[i]))) v.push('original part was changed');
      else ok.push('your part is unchanged');
      const partner = render.tracks[1];
      if (partner && (partner.author !== 'partner' || partner.events.some((e) => e.author !== 'partner'))) v.push('partner part not labelled');
      else if (partner) ok.push('added part is labelled as the partner');
      break;
    }
    case 'replace_with_rest': {
      const target = srcS.find((e) => e.id === p.eventId);
      if (!target) {
        v.push('event to silence not found');
        break;
      }
      const remaining = srcS.filter((e) => e.id !== p.eventId);
      if (remaining.length !== outS.length || remaining.some((e, i) => !sameContent(e, outS[i]))) v.push('other events changed');
      else ok.push('every other sound is unchanged');
      const rest = main.events.find((e) => e.kind === 'rest' && e.onset === target.onset && e.duration === target.duration && e.author === 'partner');
      if (!rest) v.push('rest does not keep the original time slot');
      else ok.push('the quiet space keeps the same time slot');
      break;
    }
    case 'transpose': {
      if (!Number.isInteger(p.semitones) || p.semitones === 0 || Math.abs(p.semitones) > 12) v.push('transpose amount out of range');
      if (srcS.length !== outS.length) v.push('note count changed');
      else if (srcS.some((e, i) => !sameTiming(e, outS[i]) || e.kind !== outS[i].kind)) v.push('rhythm changed');
      else if (srcS.some((e, i) => e.kind === 'note' && (outS[i] as NoteEvent).midi - e.midi !== p.semitones)) v.push('not every note moved by the same amount');
      else ok.push(`rhythm kept; every note moved ${p.semitones > 0 ? 'up' : 'down'} by ${Math.abs(p.semitones)} semitones`);
      if (!srcS.some((e) => e.kind === 'note')) v.push('no notes to transpose');
      break;
    }
    case 'dynamics': {
      if (srcS.length !== outS.length || srcS.some((e, i) => !sameTiming(e, outS[i]) || (e.kind === 'note' && (outS[i] as NoteEvent).midi !== e.midi))) v.push('pitch or rhythm changed');
      else ok.push('pitch and rhythm kept');
      const dir = p.direction === 'softer' ? -1 : 1;
      if (srcS.some((e, i) => Math.sign(outS[i].velocity - e.velocity) !== dir && Math.abs(outS[i].velocity - e.velocity) > 1e-9)) v.push('a note moved the wrong way in volume');
      if (srcS.every((e, i) => Math.abs(outS[i].velocity - e.velocity) < 1e-9)) v.push('nothing changed');
      else ok.push(`volume changed to ${p.direction}`);
      break;
    }
    case 'section_order': {
      const s = p.splitTick;
      if (s <= 0 || s >= source.totalTicks || s % TPQ !== 0) {
        v.push('section boundary not on a beat inside the phrase');
        break;
      }
      const a = srcS.filter((e) => e.onset < s);
      const b = srcS.filter((e) => e.onset >= s);
      if (a.some((e) => e.onset + e.duration > s)) v.push('a note crosses the section boundary');
      const lenB = source.totalTicks - s;
      const expected = [...b.map((e) => ({ ...e, onset: e.onset - s })), ...a.map((e) => ({ ...e, onset: e.onset + lenB }))].sort((x, y) => x.onset - y.onset || x.id.localeCompare(y.id));
      if (expected.length !== outS.length || expected.some((e, i) => !sameContent(e, outS[i]))) v.push('sections changed inside');
      else ok.push('both sections kept every note; only their order changed');
      if (a.length === 0 || b.length === 0) v.push('one section is empty');
      break;
    }
  }
  return { ok: v.length === 0, violations: v, verified: v.length === 0 ? ok : [] };
}
