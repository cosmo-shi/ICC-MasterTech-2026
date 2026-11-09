// Songbook: short opening phrases of traditional, public-domain tunes (src/data/songs.json).
// The learner types a song name; findSong picks the closest match, allowing small typos.
// Nothing is generated: if a song is not in the book, Carmen says so and lists the songs it knows.

import songData from '../data/songs.json';
import { TPQ, beatsToTicks, type MusicEvent, type Phrase } from './events.ts';

export interface Song {
  id: string;
  title: string;
  aliases: string[];
  source: string;
  phrase: Phrase;
}

const LETTERS: Record<string, number> = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };

/** "C4" → 60, "F#4" → 66. Sharps only. */
export function nameToMidi(name: string): number {
  const m = /^([A-G])(#?)(\d)$/.exec(name);
  if (!m) throw new Error(`Not a note name: ${name}`);
  return (Number(m[3]) + 1) * 12 + LETTERS[m[1]] + (m[2] ? 1 : 0);
}

interface SongSeed {
  id: string;
  title: string;
  aliases: string[];
  source: string;
  tempoBpm: number;
  notes: [string, number][];
}

export function songToPhrase(s: SongSeed): Phrase {
  let at = 0;
  const events: MusicEvent[] = s.notes.map(([name, beats], i) => {
    const e: MusicEvent = { id: `${s.id}-${i}`, kind: 'note', onset: beatsToTicks(at), duration: beatsToTicks(beats), midi: nameToMidi(name), velocity: 0.7, author: 'lesson' };
    at += beats;
    return e;
  });
  const bar = 4 * TPQ;
  const totalTicks = Math.ceil(beatsToTicks(at) / bar) * bar;
  return { id: `song-${s.id}`, instrument: 'keyboard', meter: [4, 4], totalTicks, tempoBpm: s.tempoBpm, events };
}

export const SONGS: Song[] = (songData.songs as SongSeed[]).map((s) => ({ id: s.id, title: s.title, aliases: s.aliases, source: s.source, phrase: songToPhrase(s) }));

/** Lower case, no accents or punctuation, single spaces. */
export function normalise(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9 ]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Edit distance between two short strings (for small typos). Swapping two neighbouring letters counts as one. */
export function editDistance(a: string, b: string): number {
  const d: number[][] = Array.from({ length: a.length + 1 }, (_, i) => Array.from({ length: b.length + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0)));
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
    }
  }
  return d[a.length][b.length];
}

/** How well a request matches one name: 1 = exact, 0 = not at all. */
function score(query: string, name: string): number {
  if (!query || !name) return 0;
  if (query === name) return 1;
  if (name.includes(query) && query.length >= 4) return 0.9;
  if (query.includes(name) && name.length >= 4) return 0.85;
  const allowed = Math.max(1, Math.floor(name.length / 5));
  const d = editDistance(query, name);
  if (d <= allowed) return 0.8 - d * 0.05;
  // Word overlap, ignoring very short words.
  const qw = new Set(query.split(' ').filter((w) => w.length > 2));
  const nw = name.split(' ').filter((w) => w.length > 2);
  if (!qw.size || !nw.length) return 0;
  const hits = nw.filter((w) => [...qw].some((q) => q === w || editDistance(q, w) <= (w.length > 5 ? 1 : 0))).length;
  return hits / Math.max(nw.length, qw.size) * 0.7;
}

/** The best matching song, or null if nothing matches well enough. */
export function findSong(request: string, songs: Song[] = SONGS): Song | null {
  const q = normalise(request);
  if (q.length < 2) return null;
  let best: { song: Song; s: number } | null = null;
  for (const song of songs) {
    for (const name of [song.title, ...song.aliases].map(normalise)) {
      const s = score(q, name);
      if (!best || s > best.s) best = { song, s };
    }
  }
  return best && best.s >= 0.5 ? best.song : null;
}
