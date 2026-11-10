// "Who's playing?" — local players on a shared device. No accounts, no passwords, no email,
// nothing sent anywhere. A player is a first name or nickname and a colour, kept in this
// browser only. Work is tagged with the player so a class can share tablets.

import { useSyncExternalStore } from 'react';
import type { PathwayId } from '../state/prefs.tsx';

export const PLAYER_COLOURS = ['sun', 'coral', 'mint', 'lilac', 'sky', 'leaf'] as const;
export type PlayerColour = (typeof PLAYER_COLOURS)[number];
/** Ids are stored, so they stay; the names match the six palette swatches they now show. */
export const COLOUR_NAMES: Record<PlayerColour, string> = { sun: 'Peach', coral: 'Coral', mint: 'Sage', lilac: 'Orchid', sky: 'Sky', leaf: 'Periwinkle' };

export interface Player {
  id: string;
  name: string;
  colour: PlayerColour;
  createdAt: number;
  /** Where they chose to start (a content choice, not an age). */
  start?: PathwayId;
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
  add(name: string, colour: PlayerColour, start?: PathwayId): Player {
    const clean = name.trim().replace(/\s+/g, ' ').slice(0, 20);
    const rnd = crypto.getRandomValues(new Uint32Array(1))[0].toString(36);
    const p: Player = { id: `p-${rnd}`, name: clean, colour, createdAt: Date.now(), start };
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

/** Is this saved record the current player's? A guest sees only records with no owner. */
export function mine(r: { profileId?: string }): boolean {
  const who = players.currentId();
  return who ? r.profileId === who : !r.profileId;
}

/* ---------- Teacher access ----------
   A teacher sets a 4-digit PIN on this device. Only a salted SHA-256 hash is kept, in this
   browser. It keeps children out of the teacher space; it is not an online account. */
const PIN_KEY = 'carmen-teacher-pin-v1';
const OPEN_KEY = 'carmen-teacher-open';

async function hashPin(pin: string, salt: string): Promise<string> {
  const bytes = new TextEncoder().encode(`${salt}:${pin}`);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

export const teacher = {
  hasPin(): boolean {
    try {
      return !!localStorage.getItem(PIN_KEY);
    } catch {
      return false;
    }
  },
  async setPin(pin: string): Promise<void> {
    const salt = [...crypto.getRandomValues(new Uint8Array(8))].map((b) => b.toString(16).padStart(2, '0')).join('');
    localStorage.setItem(PIN_KEY, JSON.stringify({ salt, hash: await hashPin(pin, salt) }));
    teacher.open();
  },
  async check(pin: string): Promise<boolean> {
    try {
      const { salt, hash } = JSON.parse(localStorage.getItem(PIN_KEY) ?? '{}') as { salt?: string; hash?: string };
      if (!salt || !hash) return false;
      const ok = (await hashPin(pin, salt)) === hash;
      if (ok) teacher.open();
      return ok;
    } catch {
      return false;
    }
  },
  /** Forgotten PIN: remove it and the teacher choices kept on this device. Learners' work stays. */
  resetPin() {
    try {
      localStorage.removeItem(PIN_KEY);
      localStorage.removeItem('carmen-teacher-overrides-v1');
      sessionStorage.removeItem(OPEN_KEY);
    } catch {
      /* fine */
    }
    emit();
  },
  open() {
    try {
      sessionStorage.setItem(OPEN_KEY, '1');
    } catch {
      /* fine */
    }
    emit();
  },
  close() {
    try {
      sessionStorage.removeItem(OPEN_KEY);
    } catch {
      /* fine */
    }
    emit();
  },
  isOpen(): boolean {
    try {
      return sessionStorage.getItem(OPEN_KEY) === '1';
    } catch {
      return false;
    }
  },
};
