// Shared pieces for playing a real instrument into Carmen: the live status pill with Stop, the
// level meter, the timing check and plain-words help when the microphone or MIDI can't be used.
import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { audio } from '../audio/engine.ts';
import { listening } from '../input/session.ts';
import { mic } from '../input/mic.ts';
import { midiInput } from '../input/midi.ts';
import { calibrate } from '../listen/compare.ts';
import type { HeardOnset } from '../listen/analyser.ts';
import type { InstrumentId } from '../music/events.ts';
import { TPQ } from '../music/events.ts';
import { Icon } from './icons.tsx';

// eslint-disable-next-line react-refresh/only-export-components
export function useListening() {
  useSyncExternalStore(listening.subscribe, listening.snapshot, listening.snapshot);
  return listening;
}

/** How loud the microphone input is, against the room's background. Words go with the bar. */
export function LevelMeter({ big }: { big?: boolean }) {
  const l = useListening();
  const { db, floorDb, clipping } = l.level;
  const pct = Math.max(0, Math.min(100, ((db + 70) / 70) * 100));
  const floor = Math.max(0, Math.min(100, ((floorDb + 70) / 70) * 100));
  const words = !l.listening ? 'Not listening' : clipping ? 'Very loud: move back a little' : db - floorDb > 12 ? 'Hearing you' : 'Quiet';
  return (
    <div className={`level${big ? ' big' : ''}`}>
      <div className="level-bar" aria-hidden="true">
        <span className="level-floor" style={{ width: `${floor}%` }} />
        <span className={`level-now${clipping ? ' is-loud' : ''}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="level-words">{words}</span>
    </div>
  );
}

/** What the microphone or MIDI state means, and what to do, in plain words. */
export function InputTrouble({ kind }: { kind: 'mic' | 'midi' }) {
  useListening();
  if (kind === 'mic') {
    if (mic.state === 'denied')
      return (
        <div className="trouble" role="alert">
          <p>
            <strong>The microphone is blocked for Carmen.</strong> You can still play on the screen.
          </p>
          <p>To use it, allow the microphone for this site in your browser’s settings (on iPhone: Settings, Safari, Microphone), then press Try again.</p>
        </div>
      );
    if (mic.state === 'unavailable' || mic.state === 'error')
      return (
        <div className="trouble" role="alert">
          <p>
            <strong>{mic.error || 'The microphone could not start.'}</strong> You can still play on the screen.
          </p>
        </div>
      );
    if (listening.stoppedBecause)
      return (
        <p className="trouble" role="status">
          {listening.stoppedBecause} Nothing was kept.
        </p>
      );
    return null;
  }
  if (midiInput.state === 'unsupported')
    return (
      <p className="trouble" role="status">
        This browser can’t use MIDI. It works in Chrome or Edge on a computer or Android. On iPhone and iPad, use the microphone or the screen.
      </p>
    );
  if (midiInput.state === 'denied')
    return (
      <p className="trouble" role="alert">
        MIDI was not allowed. Allow it in the browser’s site settings, then try again.
      </p>
    );
  if (midiInput.state === 'none')
    return (
      <p className="trouble" role="status">
        No MIDI keyboard found. Plug it in (or pair it), then press Look again.
      </p>
    );
  return null;
}

/**
 * Timing check: Carmen plays four clicks and measures how long they take to come back through the
 * microphone (or how long after them the learner's taps arrive, with headphones). Without it,
 * tapped rhythms are not marked.
 */
export function TimingCheck({ onDone }: { onDone?: (ok: boolean) => void }) {
  const l = useListening();
  const [stage, setStage] = useState<'idle' | 'running' | 'ok' | 'failed'>('idle');
  const cancel = useRef<(() => void) | null>(null);
  useEffect(() => () => cancel.current?.(), []);

  const run = async () => {
    if (!audio.running) await audio.start();
    if (!audio.running || !l.listening) return;
    setStage('running');
    const heard: HeardOnset[] = [];
    const off = l.onHeard((h) => h.kind === 'onset' && heard.push(h));
    const bpm = 90;
    const pb = audio.schedule([], bpm, { countInBeats: 0, totalTicks: 4 * TPQ, click: true });
    if (!pb) {
      off();
      setStage('failed');
      return;
    }
    const clicks = [0, 1, 2, 3].map((b) => pb.startCtxTime + (b * 60) / bpm);
    const id = window.setTimeout(() => {
      off();
      const c = calibrate(clicks, heard);
      if (c && c.ok) {
        l.setLatency(c.latency);
        setStage('ok');
        onDone?.(true);
      } else {
        setStage('failed');
        onDone?.(false);
      }
    }, ((4 * 60) / bpm) * 1000 + 700);
    cancel.current = () => {
      window.clearTimeout(id);
      off();
      pb.cancel();
    };
  };

  return (
    <div className="timing-check">
      <button type="button" className={stage === 'ok' ? 'btn-quiet' : 'btn'} onClick={run} disabled={stage === 'running' || !l.listening}>
        <Icon name="click" size={22} /> {stage === 'running' ? 'Listening to four clicks…' : stage === 'ok' ? 'Check timing again' : 'Check timing'}
      </button>
      <p className="note-text" role="status">
        {stage === 'idle' && (l.latency === null ? 'Carmen plays four clicks. If you wear headphones, tap along with them.' : `Timing was checked on this device (${Math.round(l.latency * 1000)} ms).`)}
        {stage === 'running' && 'Stay still. If you wear headphones, tap along.'}
        {stage === 'ok' && l.latency !== null && `Done. Sound takes about ${Math.round(l.latency * 1000)} ms to reach the microphone; Carmen allows for that.`}
        {stage === 'failed' && 'Carmen couldn’t measure it. Turn the sound up, or tap along with the clicks, then try again. Until then, rhythms are not marked.'}
      </p>
    </div>
  );
}

/** Shown on the instrument while something outside the screen is playing into Carmen. */
export function InputStatus({ instrument }: { instrument: InstrumentId }) {
  const l = useListening();
  if (l.mode === 'midi')
    return (
      <div className="input-status is-midi" role="status">
        <Icon name="midi" size={20} />
        <span>{midiInput.devices[0] ?? 'MIDI keyboard'} is connected</span>
        <button type="button" className="btn-quiet small" onClick={() => l.chooseScreen()}>
          Stop using it
        </button>
      </div>
    );
  if (l.mode === 'mic' && l.listening)
    return (
      <div className="input-status is-mic" role="status">
        <span className="mic-dot" aria-hidden="true" />
        <span className="input-status-words">
          <strong>Listening</strong>
          {instrument === 'drums' ? (l.latency === null ? ' · check timing to mark rhythms' : ' for taps') : ' · notes on screen only'}
        </span>
        <LevelMeter />
        <button type="button" className="btn-quiet small" onClick={() => l.stopMic()}>
          <Icon name="stop" size={18} /> Stop listening
        </button>
      </div>
    );
  if (l.stoppedBecause)
    return (
      <p className="input-status" role="status">
        {l.stoppedBecause}
      </p>
    );
  return null;
}

/**
 * "Play on": choose this screen, a MIDI instrument or (drums) taps into the microphone, inside a
 * lesson. Asking for the microphone happens only when that option is pressed.
 */
export function PlayOnSheet({ instrument, onClose }: { instrument: InstrumentId; onClose: () => void }) {
  const l = useListening();
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    ref.current?.querySelector<HTMLElement>('h2')?.focus();
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', esc);
    return () => window.removeEventListener('keydown', esc);
  }, [onClose]);
  const [asked, setAsked] = useState<'mic' | 'midi' | null>(null);
  return (
    <div className="sheet" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div ref={ref} className="sheet-inner" role="dialog" aria-modal="true" aria-labelledby="playon-h">
        <div className="sheet-head">
          <h2 id="playon-h" className="title" tabIndex={-1}>
            Play on
          </h2>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close">
            <Icon name="close" size={22} />
          </button>
        </div>
        <div className="pick-list" role="radiogroup" aria-labelledby="playon-h">
          <button type="button" role="radio" aria-checked={l.mode === 'screen'} className="pick" onClick={() => { l.chooseScreen(); onClose(); }}>
            <Icon name={instrument === 'drums' ? 'drum' : 'piano'} size={28} />
            <span>
              <span className="pick-title">This screen</span>
              <span className="pick-sub">Tap the {instrument === 'drums' ? 'drums' : 'keys'} here.</span>
            </span>
          </button>
          <button
            type="button"
            role="radio"
            aria-checked={l.mode === 'midi'}
            className="pick"
            onClick={async () => {
              setAsked('midi');
              if (await l.connectMidi()) onClose();
            }}
          >
            <Icon name="midi" size={28} />
            <span>
              <span className="pick-title">{instrument === 'drums' ? 'Electronic drum kit (MIDI)' : 'MIDI keyboard'}</span>
              <span className="pick-sub">By cable or Bluetooth. Every key and its timing.</span>
            </span>
          </button>
          {instrument === 'drums' && (
            <button
              type="button"
              role="radio"
              aria-checked={l.mode === 'mic'}
              className="pick"
              onClick={async () => {
                setAsked('mic');
                await l.startMic({ pitch: false });
              }}
            >
              <Icon name="mic" size={28} />
              <span>
                <span className="pick-title">Taps into the microphone</span>
                <span className="pick-sub">A drum, a table or clapping. Carmen hears when each tap starts, not which drum or how hard. Nothing is sent or kept.</span>
              </span>
            </button>
          )}
        </div>
        {asked === 'midi' && <InputTrouble kind="midi" />}
        {asked === 'mic' && <InputTrouble kind="mic" />}
        {l.mode === 'mic' && l.listening && (
          <div className="stack">
            <LevelMeter big />
            <TimingCheck onDone={(ok) => ok && onClose()} />
          </div>
        )}
        {instrument === 'keyboard' && <p className="note-text">To play a piano note into the microphone, use “Use my instrument” on Play.</p>}
      </div>
    </div>
  );
}
