// "Who's playing?" — local players on a shared device. No accounts, no passwords, no email,
// nothing sent anywhere. A player is a first name or nickname and a colour, kept in this
// browser only. Work is tagged with the player so a class can share tablets.

import { useSyncExternalStore } from 'react';

export const PLAYER_COLOURS = ['sun', 'coral', 'mint', 'lilac', 'sky', 'leaf'] as const;
export type PlayerColour = (typeof PLAYER_COLOURS)[number];

export interface Player {
  id: string;
  name: string;
  colour: PlayerColour;
  createdAt: number;
}

const KEY = 'carmen-players-v1';
const CURRENT = 'carmen-current-player-v1';
/** 'guest' = just playing; nothing about learning is kept after the page closes. */
export type CurrentPlayer = string | 'guest' | null;

interface State {
  players: Player[];
  current: CurrentPlayer;
}

function read(): State {
  try {
    const players = JSON.parse(localStorage.getItem(KEY) ?? '[]') as Player[];
    const current = sessionStorage.getItem(CURRENT) ?? localStorage.getItem(CURRENT);
    return { players: Array.isArray(players) ? players : [], current: current && (current === 'guest' || players.some((p) => p.id === current)) ? current : null };
  } catch {
    return { players: [], current: null };
  }
}

let state: State = read();
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((f) => f());

function save() {
  try {
    localStorage.setItem(KEY, JSON.stringify(state.players));
    if (state.current) {
      localStorage.setItem(CURRENT, state.current);
      sessionStorage.setItem(CURRENT, state.current);
    } else {
      localStorage.removeItem(CURRENT);
      sessionStorage.removeItem(CURRENT);
    }
  } catch {
    /* storage blocked: players last for this visit only */
  }
}

export const players = {
  subscribe(f: () => void) {
    listeners.add(f);
    return () => {
      listeners.delete(f);
    };
  },
  get: () => state,
  /** The current player's id, or undefined for a guest / nobody yet. */
  currentId: (): string | undefined => (state.current && state.current !== 'guest' ? state.current : undefined),
  current: (): Player | undefined => state.players.find((p) => p.id === state.current),
  add(name: string, colour: PlayerColour): Player {
    const clean = name.trim().replace(/\s+/g, ' ').slice(0, 20);
    const rnd = crypto.getRandomValues(new Uint32Array(1))[0].toString(36);
    const p: Player = { id: `p-${rnd}`, name: clean, colour, createdAt: Date.now() };
    state = { players: [...state.players, p], current: p.id };
    save();
    emit();
    return p;
  },
  rename(id: string, name: string) {
    state = { ...state, players: state.players.map((p) => (p.id === id ? { ...p, name: name.trim().slice(0, 20) || p.name } : p)) };
    save();
    emit();
  },
  remove(id: string) {
    state = { players: state.players.filter((p) => p.id !== id), current: state.current === id ? null : state.current };
    save();
    emit();
  },
  choose(id: CurrentPlayer) {
    state = { ...state, current: id };
    save();
    emit();
  },
};

export function usePlayers(): State {
  return useSyncExternalStore(players.subscribe, players.get, players.get);
}

/** A grown-up check: a sum a young child is unlikely to answer. Not security; it just keeps little fingers out. */
export function grownupQuestion(seed: number): { text: string; answer: number } {
  const a = 6 + (seed % 4);
  const b = 7 + ((seed >> 3) % 3);
  return { text: `${a} × ${b}`, answer: a * b };
}

/** Is this saved record the current player's? A guest sees only records with no owner. */
export function mine(r: { profileId?: string }): boolean {
  const who = players.currentId();
  return who ? r.profileId === who : !r.profileId;
}
