import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { InstrumentId } from '../music/events.ts';
import { store } from '../store/db.ts';

export type PathwayId = 'F' | '1-2' | '3-4' | '5-6' | 'older';

export interface Prefs {
  instrument: InstrumentId;
  large: boolean;
  simplified: boolean;
  noteNames: boolean;
  motion: 'system' | 'reduced';
  contrast: 'normal' | 'high';
  aiEnabled: boolean;
  badges: boolean;
  saveOnDevice: boolean;
  pathway: PathwayId | null;
  volume: number;
}

const DEFAULTS: Prefs = {
  instrument: 'keyboard',
  large: false,
  simplified: false,
  noteNames: true,
  motion: 'system',
  contrast: 'normal',
  aiEnabled: true,
  badges: false,
  saveOnDevice: false,
  pathway: null,
  volume: 0.7,
};

const KEY = 'carmen-prefs-v1';

function read(): Prefs {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return { ...DEFAULTS, ...JSON.parse(raw) };
  } catch {
    /* storage blocked: defaults still work */
  }
  return DEFAULTS;
}

interface Ctx {
  prefs: Prefs;
  set: <K extends keyof Prefs>(k: K, v: Prefs[K]) => void;
  saveError: string | null;
}

const PrefsContext = createContext<Ctx | null>(null);

export function PrefsProvider({ children }: { children: ReactNode }) {
  const [prefs, setPrefs] = useState<Prefs>(read);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(prefs));
    } catch {
      /* ignore */
    }
    const root = document.documentElement;
    root.dataset.size = prefs.large ? 'large' : 'normal';
    root.dataset.contrast = prefs.contrast;
    root.dataset.motion = prefs.motion;
  }, [prefs]);

  useEffect(() => {
    store.setPersistent(prefs.saveOnDevice).then(
      () => setSaveError(null),
      (e: Error) => setSaveError(e.message),
    );
  }, [prefs.saveOnDevice]);

  const set = useCallback(<K extends keyof Prefs>(k: K, v: Prefs[K]) => setPrefs((p) => ({ ...p, [k]: v })), []);
  const value = useMemo(() => ({ prefs, set, saveError }), [prefs, set, saveError]);
  return <PrefsContext.Provider value={value}>{children}</PrefsContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function usePrefs(): Ctx {
  const c = useContext(PrefsContext);
  if (!c) throw new Error('PrefsProvider missing');
  return c;
}
