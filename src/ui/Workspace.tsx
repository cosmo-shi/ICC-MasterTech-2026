import { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from 'react';
import { audio } from '../audio/engine.ts';
import type { DrumSound, InstrumentId } from '../music/events.ts';
import { usePrefs } from '../state/prefs.tsx';
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
        <p>Getting the instrument sounds ready…</p>
      ) : status === 'error' ? (
        <>
          <p>{error || 'Sound could not start.'} You can still look at the music.</p>
          <button type="button" className="btn" onClick={() => audio.start()}>
            Try sound again
          </button>
        </>
      ) : (
        <>
          <button type="button" className="btn btn-big" onClick={() => audio.start()}>
            Tap to start sound
          </button>
          {audio.ctx && <p className="note-text">Sound paused. Your music is still here.</p>}
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
}

const OCTAVE_STARTS = [48, 60, 72];

export function Workspace({ instrument, onEvent, highlightNotes, highlightPads, startMidi = 60, label }: Props) {
  const { prefs } = usePrefs();
  const [downNotes, setDownNotes] = useState<Set<number>>(new Set());
  const [downPads, setDownPads] = useState<Set<DrumSound>>(new Set());
  const [low, setLow] = useState(startMidi);
  const minWhite = prefs.large ? 64 : 48;
  const { ref, count } = useWhiteCount(minWhite, prefs.simplified ? 8 : 8, prefs.simplified ? 8 : 15);
  const whiteCount = prefs.simplified ? 8 : count;
  const pads = useMemo(() => (prefs.simplified ? PADS.filter((p) => SIMPLE_PADS.includes(p.sound)) : PADS), [prefs.simplified]);

  useEffect(() => {
    audio.setVolume(prefs.volume);
  }, [prefs.volume]);

  const noteDown = useCallback(
    (midi: number, t: number, source: InputSource) => {
      if (!audio.running) void audio.start();
      audio.noteOn(midi, 0.7);
      setDownNotes((s) => new Set(s).add(midi));
      onEvent?.({ type: 'down', midi, t, source });
    },
    [onEvent],
  );
  const noteUp = useCallback(
    (midi: number, t: number) => {
      audio.noteOff(midi);
      setDownNotes((s) => {
        if (!s.has(midi)) return s;
        const n = new Set(s);
        n.delete(midi);
        return n;
      });
      onEvent?.({ type: 'up', midi, t, source: 'pointer' });
    },
    [onEvent],
  );
  const hit = useCallback(
    (sound: DrumSound, t: number, source: InputSource) => {
      if (!audio.running) void audio.start();
      audio.drum(sound, 0.7);
      setDownPads((s) => new Set(s).add(sound));
      window.setTimeout(() => setDownPads((s) => {
        const n = new Set(s);
        n.delete(sound);
        return n;
      }), 140);
      onEvent?.({ type: 'down', sound, t, source });
    },
    [onEvent],
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

  return (
    <section className={`workspace ws-${instrument}`} aria-label={label ?? (instrument === 'keyboard' ? 'Keyboard' : 'Drums')}>
      <StartSound compact />
      {instrument === 'keyboard' ? (
        <>
          <div className="octave-row">
            <button type="button" className="btn-quiet small" disabled={low <= OCTAVE_STARTS[0]} onClick={() => setLow((l) => Math.max(OCTAVE_STARTS[0], l - 12))}>
              <span aria-hidden="true">◀ </span>Lower
            </button>
            <span className="octave-label">Starts on C{Math.floor(low / 12) - 1}{low === 60 ? ' (middle C)' : ''}</span>
            <button type="button" className="btn-quiet small" disabled={low >= OCTAVE_STARTS[2]} onClick={() => setLow((l) => Math.min(OCTAVE_STARTS[2], l + 12))}>
              Higher<span aria-hidden="true"> ▶</span>
            </button>
          </div>
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
              label="Piano keys. On a computer, keys A to K play the white notes."
            />
          </div>
        </>
      ) : (
        <div ref={ref} className="pads-wrap">
          <Drums pads={pads} down={downPads} highlight={highlightPads} showKeyHints onHit={hit} />
        </div>
      )}
    </section>
  );
}
