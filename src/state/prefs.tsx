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
  theme: 'system' | 'light' | 'dark';
  aiEnabled: boolean;
  badges: boolean;
  saveOnDevice: boolean;
  pathway: PathwayId | null;
  volume: number;
  drumView: 'pads' | 'kit';
}

const DEFAULTS: Prefs = {
  instrument: 'keyboard',
  large: false,
  simplified: false,
  noteNames: true,
  motion: 'system',
  contrast: 'normal',
  theme: 'system',
  aiEnabled: true,
  badges: false,
  saveOnDevice: false,
  pathway: null,
  volume: 0.7,
  drumView: 'kit',
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
    // Presentation only: older learners get a quieter, less decorated layout. Not stored as age.
    root.dataset.presentation = prefs.pathway === 'older' ? 'studio' : 'workshop';
  }, [prefs]);

  // Light, dark or follow the device. Dark is the same place after sunset, not a different look.
  useEffect(() => {
    const mq = window.matchMedia?.('(prefers-color-scheme: dark)');
    const apply = () => {
      const dark = prefs.theme === 'dark' || (prefs.theme === 'system' && !!mq?.matches);
      document.documentElement.dataset.theme = dark ? 'dark' : 'light';
      document.querySelector('meta[name="theme-color"]')?.setAttribute('content', dark ? '#0b1424' : '#5b2e8c');
    };
    apply();
    mq?.addEventListener?.('change', apply);
    return () => mq?.removeEventListener?.('change', apply);
  }, [prefs.theme]);

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
