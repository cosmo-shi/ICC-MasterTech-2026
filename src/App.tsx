import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { audio } from './audio/engine.ts';
import { PrefsProvider, usePrefs } from './state/prefs.tsx';
import { Icon, Logo } from './ui/icons.tsx';
import { PlayScreen } from './screens/PlayScreen.tsx';
import { LearnScreen } from './screens/LearnScreen.tsx';
import { LessonScreen } from './screens/LessonScreen.tsx';
import { MyMusic } from './screens/MyMusic.tsx';
import { ControlsSheet } from './screens/ControlsSheet.tsx';

const MissionScreen = lazy(() => import('./screens/MissionScreen.tsx').then((m) => ({ default: m.MissionScreen })));
const Grownups = lazy(() => import('./screens/Grownups.tsx').then((m) => ({ default: m.Grownups })));

function useHash(): [string, (h: string) => void] {
  const [hash, setHash] = useState(() => window.location.hash || '#/play');
  useEffect(() => {
    const on = () => setHash(window.location.hash || '#/play');
    window.addEventListener('hashchange', on);
    return () => window.removeEventListener('hashchange', on);
  }, []);
  const go = (h: string) => {
    audio.stopAll();
    window.location.hash = h;
  };
  return [hash, go];
}

const NAV = [
  { href: '#/play', label: 'Play', icon: 'play' },
  { href: '#/learn', label: 'Learn', icon: 'learn' },
  { href: '#/music', label: 'My music', icon: 'music' },
] as const;

function Shell() {
  const [hash, go] = useHash();
  // Settings belong to the page they were opened on, so they close when the page changes.
  const [settingsAt, setSettingsAt] = useState<string | null>(null);
  const settingsOpen = settingsAt === hash;
  const setSettingsOpen = (open: boolean) => setSettingsAt(open ? hash : null);
  const { saveError } = usePrefs();
  const mainRef = useRef<HTMLElement>(null);
  const [, section, arg] = hash.split('/');

  useEffect(() => {
    mainRef.current?.focus({ preventScroll: true });
    window.scrollTo(0, 0);
  }, [hash]);

  let screen: React.ReactNode;
  if (section === 'learn') screen = <LearnScreen go={go} />;
  else if (section === 'lesson' && arg) screen = <LessonScreen lessonId={arg} go={go} />;
  else if (section === 'mission' && arg) screen = <MissionScreen key={arg} missionId={arg} go={go} />;
  else if (section === 'music') screen = <MyMusic go={go} />;
  else if (section === 'grownups') screen = <Grownups />;
  else screen = <PlayScreen go={go} />;

  const current = section === 'lesson' || section === 'mission' ? '#/learn' : `#/${section || 'play'}`;

  return (
    <div className="app">
      <a href="#main" className="skip-link" onClick={(e) => { e.preventDefault(); mainRef.current?.focus(); }}>
        Skip to the music
      </a>
      <header className="topbar">
        <a className="brand" href="#/play" aria-label="Carmen, go to Play">
          <Logo size={34} />
          <span className="brand-name">Carmen</span>
        </a>
        <div className="top-actions">
          <button type="button" className="icon-btn" onClick={() => audio.stopAll()} aria-label="Stop all sound">
            <Icon name="stop" size={22} />
          </button>
          <button type="button" className="icon-btn" aria-expanded={settingsOpen} aria-controls="controls-sheet" aria-label="Settings" onClick={() => setSettingsOpen(!settingsOpen)}>
            <Icon name="gear" size={24} />
          </button>
        </div>
      </header>
      <nav className="tabs" aria-label="Main">
        {NAV.map((n) => (
          <a key={n.href} href={n.href} className="tab-link" aria-current={current === n.href ? 'page' : undefined}>
            <span className="tab-icon">
              <Icon name={n.icon} size={24} />
            </span>
            {n.label}
          </a>
        ))}
        <a href="#/grownups" className="tab-link tab-grownups" aria-current={current === '#/grownups' ? 'page' : undefined}>
          <span className="tab-icon">
            <Icon name="grownups" size={24} />
          </span>
          Grown-ups
        </a>
      </nav>
      {settingsOpen && <ControlsSheet onClose={() => setSettingsOpen(false)} />}
      <main id="main" ref={mainRef} tabIndex={-1} className={`stage stage-${section || 'play'}`}>
        {saveError && (
          <p className="banner" role="alert">
            {saveError}
          </p>
        )}
        <Suspense fallback={<p className="lede">Loading…</p>}>{screen}</Suspense>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <PrefsProvider>
      <Shell />
    </PrefsProvider>
  );
}
