import { type ReactNode, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import { audio } from '../audio/engine.ts';
import type { DrumSound, InstrumentId } from '../music/events.ts';
import { usePrefs } from '../state/prefs.tsx';
import { isBlackKey, midiToName } from '../music/theory.ts';
import { Icon } from './icons.tsx';
import { NoteTrail, Trail, type TrailNote } from './NoteTrail.tsx';
import { GM_DRUMS, listening } from '../input/session.ts';
import { midiInput } from '../input/midi.ts';
import { InputStatus } from './InputPanel.tsx';
import { DrumKit, Drums, Keyboard, PADS, SIMPLE_PADS, type InputSource, keyToOffset, useComputerKeys, useWhiteCount } from './instruments.tsx';

export interface LiveEvent {
  type: 'down' | 'up';
  midi?: number;
  sound?: DrumSound;
  t: number; // performance.now() domain (event.timeStamp)
  source: InputSource;
  soundUnknown?: boolean;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAudioStatus() {
  return useSyncExternalStore(
    (cb) => audio.subscribe(cb),
    () => `${audio.status}|${audio.error ?? ''}|${audio.ctx?.state ?? 'none'}`,
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useMedia(query: string): boolean {
  return useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia?.(query);
      mq?.addEventListener?.('change', cb);
      return () => mq?.removeEventListener?.('change', cb);
    },
    () => !!window.matchMedia?.(query).matches,
    () => false,
  );
}

/** On a phone held upright, the piano is narrow. Suggest turning sideways once; never force it.
 *  Dismissing it, or turning the phone, hides it for good. */
function RotateTip() {
  const { prefs, set } = usePrefs();
  const phoneUpright = useMedia('(orientation: portrait) and (max-width: 600px) and (pointer: coarse)');
  const sideways = useMedia('(orientation: landscape)');
  useEffect(() => {
    if (sideways && !prefs.rotateTipDismissed && phoneOrTablet()) set('rotateTipDismissed', true);
  }, [sideways, prefs.rotateTipDismissed, set]);
  if (prefs.rotateTipDismissed || !phoneUpright) return null;
  return (
    <div className="rotate-tip" role="note">
      <Icon name="rotate" size={28} />
      <p>
        <strong>More room to play.</strong>
        Turn your phone sideways to make the keys wider and easier to reach. You can keep playing upright.
      </p>
      <button type="button" className="icon-btn" aria-label="Dismiss: keep playing upright" onClick={() => set('rotateTipDismissed', true)}>
        <Icon name="close" size={20} />
      </button>
    </div>
  );
}
const phoneOrTablet = () => typeof window !== 'undefined' && !!window.matchMedia?.('(pointer: coarse)').matches;

export function StartSound({ compact }: { compact?: boolean }) {
  const s = useAudioStatus();
  const [status, error] = s.split('|');
  if (audio.running) return null;
  return (
    <div className={`start-sound${compact ? ' compact' : ''}`} role="status">
      {status === 'loading' ? (
        <p>Getting the sounds ready…</p>
      ) : status === 'error' ? (
        <>
          <p>Sound didn’t start. {error ?? ''}</p>
          <button type="button" className="btn" onClick={() => audio.start()}>
            Try again
          </button>
        </>
      ) : (
        <>
          {compact && <p>{audio.ctx ? 'Sound is paused.' : 'Sound is off.'}</p>}
          <button type="button" className="btn btn-big" onClick={() => audio.start()}>
            <Icon name="sound" size={24} /> {audio.ctx ? 'Turn sound back on' : 'Turn sound on'}
          </button>
        </>
      )}
    </div>
  );
}

interface Props {
  instrument: InstrumentId;
  onEvent?: (e: LiveEvent) => void;
  highlightNotes?: ReadonlySet<number>;
  highlightPads?: ReadonlySet<DrumSound>;
  startMidi?: number;
  label?: string;
  /** Show "what you played" above the instrument. */
  trail?: boolean;
  recording?: boolean;
  /** Controls that belong to the instrument (record, play back…), placed right above it. */
  dock?: ReactNode;
}

// The full keyboard: C2 to C7, 36 white keys. The screen shows a window onto it.
const RANGE_LOW = 36;
const RANGE_WHITES = 36;
const WHITES: number[] = [];
for (let m = RANGE_LOW; WHITES.length < RANGE_WHITES; m++) if (!isBlackKey(m)) WHITES.push(m);
const whiteIndex = (midi: number) => Math.max(0, WHITES.indexOf(isBlackKey(midi) ? midi - 1 : midi));

function prefersLessMotion(pref: string) {
  return pref === 'reduced' || (typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches);
}

/** A map of the whole keyboard with a window showing which keys are on screen.
 *  Drag or tap it to glide along the keyboard; arrow keys move one key, Page keys an octave. */
function KeyNavigator({ first, count, onGo, onSettle }: { first: number; count: number; onGo: (i: number) => void; onSettle: () => void }) {
  const max = RANGE_WHITES - count;
  const dragging = useRef(false);
  const at = (e: React.PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const frac = (e.clientX - r.left) / r.width;
    onGo(Math.max(0, Math.min(max, Math.round(frac * RANGE_WHITES - count / 2))));
  };
  return (
    <div
      className="kb-nav"
      role="slider"
      tabIndex={0}
      aria-label="Move along the keyboard"
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={first}
      aria-valuetext={`From ${midiToName(WHITES[first])} to ${midiToName(WHITES[Math.min(RANGE_WHITES - 1, first + count - 1)])}`}
      onPointerDown={(e) => {
        e.preventDefault();
        e.currentTarget.setPointerCapture?.(e.pointerId);
        dragging.current = true;
        at(e);
      }}
      onPointerMove={(e) => dragging.current && at(e)}
      onPointerUp={() => {
        dragging.current = false;
        onSettle();
      }}
      onPointerCancel={() => {
        dragging.current = false;
      }}
      onKeyDown={(e) => {
        const step = { ArrowLeft: -1, ArrowRight: 1, PageDown: -7, PageUp: 7 }[e.key];
        if (step) {
          e.preventDefault();
          onGo(Math.max(0, Math.min(max, first + step)));
        } else if (e.key === 'Home' || e.key === 'End') {
          e.preventDefault();
          onGo(e.key === 'Home' ? 0 : max);
        }
      }}
      style={{ ['--n' as string]: RANGE_WHITES }}
    >
      <span className="kb-nav-keys" aria-hidden="true" />
      {[0, 7, 14, 21, 28, 35].map((i) => (
        <span key={i} className={`kb-nav-c${i === 14 ? ' is-middle' : ''}`} style={{ left: `${((i + 0.5) / RANGE_WHITES) * 100}%` }} aria-hidden="true">
          {i === 14 ? 'Middle C' : midiToName(WHITES[i])}
        </span>
      ))}
      <span className="kb-nav-window" style={{ left: `${(first / RANGE_WHITES) * 100}%`, width: `${(count / RANGE_WHITES) * 100}%` }} aria-hidden="true" />
    </div>
  );
}

export function Workspace({ instrument, onEvent, highlightNotes, highlightPads, startMidi = 60, label, trail, recording = false, dock }: Props) {
  const { prefs, set } = usePrefs();
  const [downNotes, setDownNotes] = useState<Set<number>>(new Set());
  const [downPads, setDownPads] = useState<Set<DrumSound>>(new Set());
  const minWhite = prefs.large ? 64 : 48;
  const { ref, count } = useWhiteCount(minWhite, 8, prefs.simplified ? 8 : 15);
  const whiteCount = prefs.simplified ? 8 : count;
  const scrolling = instrument === 'keyboard' && !prefs.simplified;
  // Which white key is at the left edge of the screen (index into WHITES).
  const [first, setFirst] = useState(() => whiteIndex(prefs.simplified ? 60 : startMidi));
  const scroller = useRef<HTMLDivElement>(null);
  const maxFirst = RANGE_WHITES - whiteCount;
  const shown = Math.min(first, maxFirst);
  const low = WHITES[shown];
  const lowC = low % 12 === 0 ? low : low + (12 - (low % 12)); // computer letters start on the first C on screen
  const keyWidth = () => (scroller.current ? scroller.current.clientWidth / whiteCount : 0);
  const goTo = useCallback(
    (i: number, smooth: boolean) => {
      const el = scroller.current;
      const idx = Math.max(0, Math.min(RANGE_WHITES - whiteCount, i));
      setFirst(idx);
      if (!el) return;
      el.scrollTo({ left: (idx * el.clientWidth) / whiteCount, behavior: smooth && !prefersLessMotion(prefs.motion) ? 'smooth' : 'auto' });
    },
    [whiteCount, prefs.motion],
  );
  // Keep the same keys in view when the screen size or the number of keys changes.
  useLayoutEffect(() => {
    const el = scroller.current;
    if (el) el.scrollLeft = (Math.min(first, RANGE_WHITES - whiteCount) * el.clientWidth) / whiteCount;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [whiteCount]);
  // Computer-key letters: shown where there is a mouse or trackpad, hidden on touch screens
  // (phones in either direction). Settings can force them on for a connected keyboard.
  const finePointer = useMedia('(hover: hover) and (pointer: fine)');
  const hints = !prefs.simplified && (prefs.keyHints === 'on' || (prefs.keyHints === 'auto' && finePointer));
  const pads = useMemo(() => (prefs.simplified ? PADS.filter((p) => SIMPLE_PADS.includes(p.sound)) : PADS), [prefs.simplified]);
  const [trailStore] = useState(() => new Trail());
  const held = useRef(new Map<number, TrailNote>());
  const trailDown = useCallback(
    (n: TrailNote) => {
      trailStore.notes.push(n);
      if (n.midi !== undefined) held.current.set(n.midi, n);
      trailStore.wake();
    },
    [trailStore],
  );
  const trailUp = useCallback((key: number, t: number) => {
    const n = held.current.get(key);
    if (n) n.end = t;
    held.current.delete(key);
  }, []);

  useEffect(() => {
    audio.setVolume(prefs.volume);
  }, [prefs.volume]);

  // A press counts (sound, lit key, captured input) only if it actually sounded. If sound is not
  // ready yet, the press starts it and the status line says so; nothing is recorded.
  const heldNotes = useRef(new Set<number>());
  const noteDown = useCallback(
    (midi: number, t: number, source: InputSource) => {
      if (!audio.running) {
        void audio.start();
        return;
      }
      if (!audio.noteOn(midi, 0.7)) return;
      heldNotes.current.add(midi);
      setDownNotes((s) => new Set(s).add(midi));
      trailDown({ midi, start: performance.now() });
      onEvent?.({ type: 'down', midi, t, source });
    },
    [onEvent, trailDown],
  );
  const noteUp = useCallback(
    (midi: number, t: number) => {
      if (!heldNotes.current.has(midi)) return; // never sounded, or already released
      heldNotes.current.delete(midi);
      audio.noteOff(midi);
      trailUp(midi, performance.now());
      setDownNotes((s) => {
        if (!s.has(midi)) return s;
        const n = new Set(s);
        n.delete(midi);
        return n;
      });
      onEvent?.({ type: 'up', midi, t, source: 'pointer' });
    },
    [onEvent, trailUp],
  );
  const hit = useCallback(
    (sound: DrumSound, t: number, source: InputSource) => {
      if (!audio.running) {
        void audio.start();
        return;
      }
      if (!audio.drum(sound, 0.7)) return;
      setDownPads((s) => new Set(s).add(sound));
      const now = performance.now();
      trailDown({ sound, start: now, end: now + 100 });
      window.setTimeout(() => setDownPads((s) => {
        const n = new Set(s);
        n.delete(sound);
        return n;
      }), 140);
      onEvent?.({ type: 'down', sound, t, source });
    },
    [onEvent, trailDown],
  );

  // Release everything if the page loses focus or this screen goes, so no note gets stuck.
  // (The on-screen keys release their own fingers; this covers computer keys and MIDI.)
  useEffect(() => {
    const lost = () => {
      const t = performance.now();
      for (const m of [...heldNotes.current]) noteUp(m, t);
    };
    const onVis = () => document.visibilityState === 'hidden' && lost();
    window.addEventListener('blur', lost);
    document.addEventListener('visibilitychange', onVis);
    return () => {
      window.removeEventListener('blur', lost);
      document.removeEventListener('visibilitychange', onVis);
      lost();
    };
  }, [noteUp]);

  // Instruments outside the screen. A MIDI keyboard plays the keys (an electronic kit plays the
  // drums). The microphone hears taps on the drums only, and only once the timing check has been
  // done: which drum was hit, or how hard, cannot be heard, so the sound is never judged.
  useEffect(() => {
    const offMidi = midiInput.listen((n) => {
      if (instrument === 'keyboard') {
        if (n.type === 'down') noteDown(n.midi, n.t, 'midi');
        else noteUp(n.midi, n.t);
      } else if (n.type === 'down') {
        const sound = GM_DRUMS[n.midi];
        if (sound) hit(sound, n.t, 'midi');
      }
    });
    const offMic = listening.onHeard((h) => {
      if (h.kind !== 'onset' || h.own || instrument !== 'drums' || listening.latency === null) return;
      const now = performance.now();
      trailDown({ sound: 'snare', start: now, end: now + 100 });
      onEvent?.({ type: 'down', sound: 'snare', t: h.tPerf, source: 'mic', soundUnknown: true });
    });
    return () => {
      offMidi();
      offMic();
    };
  }, [instrument, noteDown, noteUp, hit, onEvent, trailDown]);

  useComputerKeys(
    true,
    (key, t) => {
      if (instrument === 'keyboard') {
        const off = keyToOffset(key);
        if (off !== null) noteDown((scrolling ? lowC : 60) + off, t, 'key');
      } else {
        const p = pads.find((x) => x.key.toLowerCase() === key);
        if (p) hit(p.sound, t, 'key');
      }
    },
    (key, t) => {
      if (instrument === 'keyboard') {
        const off = keyToOffset(key);
        if (off !== null) noteUp((scrolling ? lowC : 60) + off, t);
      }
    },
  );

  const cStart = (dir: -1 | 1) => {
    // The previous / next C, so the octave buttons always land on a C.
    const target = dir < 0 ? Math.ceil(shown / 7) * 7 - 7 : Math.floor(shown / 7) * 7 + 7;
    goTo(target, true);
  };
  const octaveBtn = (dir: -1 | 1) => (
    <button
      type="button"
      className="kb-oct"
      disabled={dir < 0 ? shown <= 0 : shown >= maxFirst}
      onClick={() => cStart(dir)}
      aria-label={dir < 0 ? 'Lower notes, one octave' : 'Higher notes, one octave'}
    >
      <Icon name={dir < 0 ? 'back' : 'forward'} size={20} />
    </button>
  );
  const drumView =
    instrument === 'drums' ? (
      <div className="segmented drum-view" role="radiogroup" aria-label="Drums look like">
        {(
          [
            ['kit', 'Drum kit'],
            ['pads', 'Pads'],
          ] as const
        ).map(([v, l]) => (
          <button key={v} type="button" role="radio" aria-checked={prefs.drumView === v} className="segment" onClick={() => set('drumView', v)}>
            {l}
          </button>
        ))}
      </div>
    ) : null;
  const centre = WHITES[Math.min(RANGE_WHITES - 1, shown + Math.floor(whiteCount / 2))];

  return (
    <section className={`workspace ws-${instrument}${dock ? ' has-dock' : ''}`} aria-label={label ?? (instrument === 'keyboard' ? 'Keyboard' : 'Drums')}>
      <StartSound compact />
      {instrument === 'keyboard' && <RotateTip />}
      {trail && <NoteTrail trail={trailStore} recording={recording} clef={instrument === 'drums' ? 'drums' : centre < 57 ? 'bass' : 'treble'} letters={prefs.noteNames} />}
      <InputStatus instrument={instrument} />
      {(dock || drumView) && (
        <div className="ws-bar">
          {dock}
          {drumView}
        </div>
      )}
      {instrument === 'keyboard' ? (
        <div ref={ref} className="kb-wrap">
          {scrolling && (
            <div className="kb-top">
              {octaveBtn(-1)}
              <KeyNavigator first={shown} count={whiteCount} onGo={(i) => goTo(i, false)} onSettle={() => goTo(shown, true)} />
              {octaveBtn(1)}
            </div>
          )}
          <div
            ref={scroller}
            className="kb-scroll"
            onScroll={(e) => {
              const w = keyWidth();
              if (w) setFirst(Math.round(e.currentTarget.scrollLeft / w));
            }}
          >
            <Keyboard
              low={scrolling ? RANGE_LOW : 60}
              whiteCount={scrolling ? RANGE_WHITES : whiteCount}
              style={scrolling ? { width: `${(RANGE_WHITES / whiteCount) * 100}%` } : undefined}
              hintsFrom={scrolling ? lowC : 60}
              down={downNotes}
              highlight={highlightNotes}
              showNames={prefs.noteNames}
              showKeyHints={hints}
              onDown={noteDown}
              onUp={noteUp}
              label="Piano keys. Slide along the keys to glide. On a computer keyboard, A to K play the white keys from the first C on screen."
            />
          </div>
        </div>
      ) : (
        <div ref={ref} className="pads-wrap">
          {prefs.drumView === 'kit' ? (
            <DrumKit pads={pads} down={downPads} highlight={highlightPads} showKeyHints={hints} onHit={hit} />
          ) : (
            <Drums pads={pads} down={downPads} highlight={highlightPads} showKeyHints={hints} onHit={hit} />
          )}
        </div>
      )}
    </section>
  );
}
