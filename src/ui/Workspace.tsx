import { type ReactNode, useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import { audio } from '../audio/engine.ts';
import type { DrumSound, InstrumentId } from '../music/events.ts';
import { usePrefs } from '../state/prefs.tsx';
import { Icon } from './icons.tsx';
import { NoteTrail, Trail, type TrailNote } from './NoteTrail.tsx';
import { Drums, Keyboard, PADS, SIMPLE_PADS, type InputSource, keyToOffset, useComputerKeys, useWhiteCount } from './instruments.tsx';

export interface LiveEvent {
  type: 'down' | 'up';
  midi?: number;
  sound?: DrumSound;
  t: number; // performance.now() domain (event.timeStamp)
  source: InputSource;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAudioStatus() {
  return useSyncExternalStore(
    (cb) => audio.subscribe(cb),
    () => `${audio.status}|${audio.error ?? ''}|${audio.ctx?.state ?? 'none'}`,
  );
}

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

const OCTAVE_STARTS = [48, 60, 72];

export function Workspace({ instrument, onEvent, highlightNotes, highlightPads, startMidi = 60, label, trail, recording = false, dock }: Props) {
  const { prefs } = usePrefs();
  const [downNotes, setDownNotes] = useState<Set<number>>(new Set());
  const [downPads, setDownPads] = useState<Set<DrumSound>>(new Set());
  const [low, setLow] = useState(startMidi);
  const minWhite = prefs.large ? 64 : 48;
  const { ref, count } = useWhiteCount(minWhite, prefs.simplified ? 8 : 8, prefs.simplified ? 8 : 15);
  const whiteCount = prefs.simplified ? 8 : count;
  const pads = useMemo(() => (prefs.simplified ? PADS.filter((p) => SIMPLE_PADS.includes(p.sound)) : PADS), [prefs.simplified]);
  const [trailStore] = useState(() => new Trail());
  const held = useRef(new Map<number, TrailNote>());
  const lowRef = useRef(low);
  useEffect(() => {
    lowRef.current = low;
  }, [low]);
  const trailDown = useCallback((y: number, t: number, key?: number) => {
    const tr = trailStore;
    const n: TrailNote = { y: Math.max(0, Math.min(1, y)), start: t, end: key === undefined ? t + 120 : undefined };
    tr.notes.push(n);
    if (key !== undefined) held.current.set(key, n);
    tr.wake();
  }, [trailStore]);
  const trailUp = useCallback((key: number, t: number) => {
    const n = held.current.get(key);
    if (n) n.end = t;
    held.current.delete(key);
  }, []);

  useEffect(() => {
    audio.setVolume(prefs.volume);
  }, [prefs.volume]);

  const noteDown = useCallback(
    (midi: number, t: number, source: InputSource) => {
      if (!audio.running) void audio.start();
      audio.noteOn(midi, 0.7);
      setDownNotes((s) => new Set(s).add(midi));
      trailDown((midi - lowRef.current) / 24, performance.now(), midi);
      onEvent?.({ type: 'down', midi, t, source });
    },
    [onEvent, trailDown],
  );
  const noteUp = useCallback(
    (midi: number, t: number) => {
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
      if (!audio.running) void audio.start();
      audio.drum(sound, 0.7);
      setDownPads((s) => new Set(s).add(sound));
      const i = pads.findIndex((p) => p.sound === sound);
      trailDown(pads.length > 1 ? 1 - i / (pads.length - 1) : 0.5, performance.now());
      window.setTimeout(() => setDownPads((s) => {
        const n = new Set(s);
        n.delete(sound);
        return n;
      }), 140);
      onEvent?.({ type: 'down', sound, t, source });
    },
    [onEvent, pads, trailDown],
  );

  // Release everything if the page loses focus, so no note gets stuck.
  useEffect(() => {
    const lost = () => {
      const t = performance.now();
      setDownNotes((s) => {
        s.forEach((m) => {
          audio.noteOff(m);
          onEvent?.({ type: 'up', midi: m, t, source: 'pointer' });
        });
        return new Set();
      });
    };
    window.addEventListener('blur', lost);
    document.addEventListener('visibilitychange', lost);
    return () => {
      window.removeEventListener('blur', lost);
      document.removeEventListener('visibilitychange', lost);
    };
  }, [onEvent]);

  useComputerKeys(
    true,
    (key, t) => {
      if (instrument === 'keyboard') {
        const off = keyToOffset(key);
        if (off !== null) noteDown(low + off, t, 'key');
      } else {
        const p = pads.find((x) => x.key.toLowerCase() === key);
        if (p) hit(p.sound, t, 'key');
      }
    },
    (key, t) => {
      if (instrument === 'keyboard') {
        const off = keyToOffset(key);
        if (off !== null) noteUp(low + off, t);
      }
    },
  );

  const octave =
    instrument === 'keyboard' ? (
      <div className="octave" role="group" aria-label="Which notes">
        <button type="button" className="icon-btn quiet" disabled={low <= OCTAVE_STARTS[0]} onClick={() => setLow((l) => Math.max(OCTAVE_STARTS[0], l - 12))} aria-label="Lower notes">
          <Icon name="back" size={20} />
        </button>
        <span className="octave-label">{low === 60 ? 'Middle C' : low < 60 ? 'Low notes' : 'High notes'}</span>
        <button type="button" className="icon-btn quiet" disabled={low >= OCTAVE_STARTS[2]} onClick={() => setLow((l) => Math.min(OCTAVE_STARTS[2], l + 12))} aria-label="Higher notes">
          <Icon name="forward" size={20} />
        </button>
      </div>
    ) : null;

  return (
    <section className={`workspace ws-${instrument}${dock ? ' has-dock' : ''}`} aria-label={label ?? (instrument === 'keyboard' ? 'Keyboard' : 'Drums')}>
      <StartSound compact />
      {trail && <NoteTrail trail={trailStore} recording={recording} />}
      {(dock || octave) && (
        <div className="ws-bar">
          {dock}
          {octave}
        </div>
      )}
      {instrument === 'keyboard' ? (
        <div ref={ref} className="kb-wrap">
          <Keyboard
            low={low}
            whiteCount={whiteCount}
            down={downNotes}
            highlight={highlightNotes}
            showNames={prefs.noteNames}
            showKeyHints={!prefs.simplified}
            onDown={noteDown}
            onUp={noteUp}
            label="Piano keys. On a computer keyboard, A to K play the white keys."
          />
        </div>
      ) : (
        <div ref={ref} className="pads-wrap">
          <Drums pads={pads} down={downPads} highlight={highlightPads} showKeyHints onHit={hit} />
        </div>
      )}
    </section>
  );
}
