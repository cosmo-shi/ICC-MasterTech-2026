import { lazy, Suspense, useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { audio } from './audio/engine.ts';
import { PrefsProvider, usePrefs } from './state/prefs.tsx';
import { Icon } from './ui/icons.tsx';
import { Horizon, Wordmark } from './ui/brand.tsx';
import { PlayScreen } from './screens/PlayScreen.tsx';
import { LearnScreen } from './screens/LearnScreen.tsx';
import { LessonScreen } from './screens/LessonScreen.tsx';
import { MyMusic } from './screens/MyMusic.tsx';
import { ControlsSheet } from './screens/ControlsSheet.tsx';
import { Avatar, EntryScreen } from './screens/EntryScreen.tsx';
import { players, teacher, usePlayers } from './store/profiles.ts';
import { InputLog } from './ui/InputLog.tsx';
import { InstrumentScreen } from './screens/InstrumentScreen.tsx';
import { TEST_DATA } from './fixtures/testMode.ts';
import { TeacherWelcome } from './screens/TeacherWelcome.tsx';
import { listening } from './input/session.ts';

const MissionScreen = lazy(() => import('./screens/MissionScreen.tsx').then((m) => ({ default: m.MissionScreen })));
const TheoryScreen = lazy(() => import('./screens/TheoryScreen.tsx').then((m) => ({ default: m.TheoryScreen })));
const Grownups = lazy(() => import('./screens/Grownups.tsx').then((m) => ({ default: m.Grownups })));

function useHash(): [string, (h: string) => void] {
  const [hash, setHash] = useState(() => window.location.hash || '#/play');
  useEffect(() => {
    const on = () => {
      // Leaving a screen stops the microphone; it never follows the learner to another page.
      listening.stopMic();
      setHash(window.location.hash || '#/play');
    };
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
  const [, section, arg, sub] = hash.split('/');
  const who = usePlayers();
  const me = who.players.find((p) => p.id === who.current);
  const [switching, setSwitching] = useState(false);
  const teacherOpen = useSyncExternalStore(players.subscribe, teacher.isOpen, teacher.isOpen);
  const showEntry = switching || (!who.current && section !== 'teacher' && section !== 'grownups');

  useEffect(() => {
    if (section === 'grownups') window.location.replace('#/teacher');
  }, [section]);

  useEffect(() => {
    mainRef.current?.focus({ preventScroll: true });
    window.scrollTo(0, 0);
  }, [hash]);

  let screen: React.ReactNode;
  if (section === 'learn') screen = <LearnScreen go={go} />;
  else if (section === 'theory') screen = <TheoryScreen topicId={arg} go={go} />;
  else if (section === 'lesson' && arg) screen = <LessonScreen key={hash} lessonId={arg} view={sub} go={go} />;
  else if (section === 'mission' && arg) screen = <MissionScreen key={arg} missionId={arg} go={go} />;
  else if (section === 'music') screen = <MyMusic go={go} />;
  else if (section === 'teacher' || section === 'grownups') screen = teacherOpen ? <Grownups go={go} /> : <TeacherWelcome go={go} />;
  else if (section === 'play' && arg === 'instrument') screen = <InstrumentScreen go={go} />;
  else screen = <PlayScreen key={hash} go={go} makeFrom={arg === 'make' ? sub : undefined} />;

  const current = section === 'lesson' || section === 'mission' || section === 'theory' ? '#/learn' : `#/${section || 'play'}`;

  const scene = (section === 'play' && arg === 'instrument') || section === 'learn' || section === 'lesson' || section === 'mission' || section === 'theory' ? 'learn' : section === 'music' ? 'music' : section === 'teacher' ? 'quiet' : 'play';

  const banner = (
    <>
      {TEST_DATA && (
        <p className="banner test-banner" role="note">
          <Icon name="info" size={20} /> <strong>Test data.</strong> Made-up learners for previewing the teacher screens. Nothing is saved. <a href={window.location.pathname + window.location.hash}>Leave test data</a>
        </p>
      )}
      {saveError && (
        <p className="banner" role="alert">
          {saveError}
        </p>
      )}
    </>
  );

  // Lessons and the teacher space take the whole screen: no tabs, one thing at a time.
  if (section === 'lesson' || section === 'teacher' || section === 'grownups') {
    return (
      <div className={`app-full scene-${scene} full-${section}`}>
        <main id="main" ref={mainRef} tabIndex={-1} className="full-main">
          {banner}
          <Suspense fallback={<p className="support">Loading…</p>}>{screen}</Suspense>
        </main>
        {showEntry && <EntryScreen canClose={!!who.current} onDone={() => setSwitching(false)} go={go} />}
        <InputLog />
      </div>
    );
  }

  return (
    <div className={`app scene-${scene}`}>
      <a href="#main" className="skip-link" onClick={(e) => { e.preventDefault(); mainRef.current?.focus(); }}>
        Skip to the music
      </a>
      <div className="backdrop" aria-hidden="true">
        <Horizon scene={scene} />
      </div>
      <header className="topbar">
        <a className="brand" href="#/play" aria-label="Carmen, go to Play">
          <Wordmark size={28} />
        </a>
        <div className="top-actions">
          <button type="button" className="player-chip" onClick={() => setSwitching(true)} aria-label={me ? `Playing as ${me.name}. Change player` : 'Choose who is playing'}>
            {me ? <Avatar player={me} size={32} /> : <span className="avatar c-guest" style={{ width: 32, height: 32 }} aria-hidden="true">?</span>}
            <span className="player-name">{me ? me.name : 'Guest'}</span>
          </button>
          <button type="button" className="icon-btn" onClick={() => audio.stopAll()} aria-label="Stop all sound">
            <Icon name="stop" size={20} />
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
            <span className="tab-label">{n.label}</span>
          </a>
        ))}
        <button type="button" className="tab-link rail-gear" aria-expanded={settingsOpen} aria-controls="controls-sheet" onClick={() => setSettingsOpen(!settingsOpen)}>
          <span className="tab-icon">
            <Icon name="gear" size={24} />
          </span>
          <span className="tab-label">Settings</span>
        </button>
      </nav>
      {showEntry && <EntryScreen canClose={!!who.current} onDone={() => setSwitching(false)} go={go} />}
      <InputLog />
      {settingsOpen && <ControlsSheet onClose={() => setSettingsOpen(false)} onSwitchPlayer={() => { setSettingsOpen(false); setSwitching(true); }} />}
      <main id="main" ref={mainRef} tabIndex={-1} className={`sheet-main stage-${section || 'play'}`}>
        {banner}
        <Suspense fallback={<p className="support">Loading…</p>}>{screen}</Suspense>
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
