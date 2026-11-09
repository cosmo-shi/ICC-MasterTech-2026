import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { audio } from './audio/engine.ts';
import { PrefsProvider, usePrefs } from './state/prefs.tsx';
import { Motif } from './ui/common.tsx';
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
  { href: '#/play', label: 'Play' },
  { href: '#/learn', label: 'Learn' },
  { href: '#/music', label: 'My music' },
  { href: '#/grownups', label: 'Grown-ups' },
];

function Shell() {
  const [hash, go] = useHash();
  const [controlsOpen, setControlsOpen] = useState(false);
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
    <>
      <a href="#main" className="skip-link" onClick={(e) => { e.preventDefault(); mainRef.current?.focus(); }}>
        Skip to the music
      </a>
      <header className="topbar">
        <a className="brand" href="#/play" aria-label="Carmen, go to Play">
          <Motif size={32} />
          <span className="brand-name">Carmen</span>
        </a>
        <nav className="nav" aria-label="Main">
          {NAV.map((n) => (
            <a key={n.href} href={n.href} className="nav-link" aria-current={current === n.href ? 'page' : undefined}>
              {n.label}
            </a>
          ))}
        </nav>
        <div className="top-actions">
          <button type="button" className="btn-quiet" aria-expanded={controlsOpen} aria-controls="controls-sheet" onClick={() => setControlsOpen((o) => !o)}>
            Controls
          </button>
          <button type="button" className="btn btn-stop" onClick={() => audio.stopAll()}>
            <span aria-hidden="true">■ </span>Stop
          </button>
        </div>
      </header>
      {controlsOpen && <ControlsSheet onClose={() => setControlsOpen(false)} />}
      {saveError && (
        <p className="banner" role="alert">
          {saveError}
        </p>
      )}
      <main id="main" ref={mainRef} tabIndex={-1}>
        <Suspense fallback={<p className="lede">Loading…</p>}>{screen}</Suspense>
      </main>
      <footer className="foot">
        <p>Carmen keeps everything on this device. No account, no tracking. Lessons are drafts awaiting review by a music teacher.</p>
      </footer>
    </>
  );
}

export default function App() {
  return (
    <PrefsProvider>
      <Shell />
    </PrefsProvider>
  );
}
