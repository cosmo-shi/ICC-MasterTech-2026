import { useCallback, useRef, useState } from 'react';
import { audio } from '../audio/engine.ts';
import { inputsToPhrase } from '../ai/coach.ts';
import { Recorder } from '../music/capture.ts';
import { type InstrumentId, type Phrase, TPQ } from '../music/events.ts';
import { type CompositionRecord, newId, stamp, store } from '../store/db.ts';
import { Icon } from '../ui/icons.tsx';
import { usePlayer } from '../ui/usePlayer.ts';
import { type LiveEvent, Workspace } from '../ui/Workspace.tsx';

const MAX_SECONDS = 60;

interface Props {
  instrument: InstrumentId;
  activityId?: string;
  onSaved?: (c: CompositionRecord) => void;
}

/** Record as note events (never microphone audio), replay, name and save locally. No score. */
export function CreatePanel({ instrument, activityId, onSaved }: Props) {
  const [state, setState] = useState<'idle' | 'countin' | 'recording' | 'recorded'>('idle');
  const [click, setClick] = useState(false);
  const [tempo, setTempo] = useState(90);
  const [phrase, setPhrase] = useState<Phrase | null>(null);
  const [previous, setPrevious] = useState<{ phrase: Phrase; title: string } | null>(null);
  const [title, setTitle] = useState('');
  const [save, setSave] = useState<'idle' | 'saving' | 'saved' | 'failed'>('idle');
  const rec = useRef<Recorder | null>(null);
  const timer = useRef(0);
  const player = usePlayer();
  const clickPlayer = usePlayer();

  const stopRecording = useCallback(() => {
    window.clearTimeout(timer.current);
    clickPlayer.stop();
    const r = rec.current;
    rec.current = null;
    if (!r) return;
    const t = click ? tempo : 60;
    const lastMs = Math.max(0, ...r.inputs.map((i) => (i.releaseMs ?? i.onsetMs) + 400));
    r.closeAll(lastMs);
    const beats = Math.max(4, Math.ceil(((lastMs / 1000) * t) / 60 / 4) * 4);
    const total = beats * TPQ;
    const base: Phrase = { id: 'c', instrument, meter: [4, 4], totalTicks: total, tempoBpm: t, events: [] };
    const p = inputsToPhrase(r.inputs, base, t);
    setPhrase(p);
    setState('recorded');
    setTitle(`My ${instrument === 'keyboard' ? 'tune' : 'beat'} ${new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`);
    setSave('idle');
  }, [click, tempo, instrument, clickPlayer]);

  const startRecording = async () => {
    if (!audio.running) await audio.start();
    // Keep the last take so a new recording never loses it by accident.
    if (phrase && phrase.events.length) setPrevious({ phrase, title });
    setPhrase(null);
    if (click) {
      setState('countin');
      await clickPlayer.play([], tempo, {
        countInBeats: 4,
        click: true,
        totalTicks: Math.floor((MAX_SECONDS * tempo) / 60) * TPQ,
        onBeat0: (pb) => {
          rec.current = new Recorder(pb.beat0PerfMs);
          window.setTimeout(() => setState('recording'), Math.max(0, pb.beat0PerfMs - performance.now()));
        },
      });
    } else {
      rec.current = new Recorder(performance.now());
      setState('recording');
    }
    timer.current = window.setTimeout(stopRecording, (MAX_SECONDS + 3) * 1000);
  };

  const onEvent = useCallback((e: LiveEvent) => {
    rec.current?.handle(e);
  }, []);

  const bringBack = () => {
    if (!previous) return;
    player.stop();
    setPhrase(previous.phrase);
    setTitle(previous.title);
    setPrevious(phrase && phrase.events.length ? { phrase, title } : null);
    setState('recorded');
    setSave('idle');
  };

  const doSave = async () => {
    if (!phrase) return;
    setSave('saving');
    const c: CompositionRecord = {
      id: newId('mus'),
      title: title.trim().slice(0, 60) || 'My music',
      createdAt: stamp(),
      instrument,
      tempoBpm: phrase.tempoBpm,
      totalTicks: phrase.totalTicks,
      events: phrase.events,
      origin: activityId ? 'lesson' : 'free-play',
      activityId,
    };
    try {
      await store.put('compositions', c);
      setSave('saved');
      onSaved?.(c);
    } catch {
      setSave('failed');
    }
  };

  const recording = state === 'countin' || state === 'recording';
  const hasTake = state === 'recorded' && !!phrase && phrase.events.length > 0;

  return (
    <div className="create">
      <div className="transport" role="group" aria-label="Recording">
        {recording ? (
          <button type="button" className="rec is-on" onClick={stopRecording}>
            <span className="rec-dot" aria-hidden="true" />
            {state === 'countin' ? 'Get ready…' : 'Stop'}
          </button>
        ) : (
          <button type="button" className="rec" onClick={startRecording}>
            <span className="rec-dot" aria-hidden="true" />
            {phrase ? 'Record again' : 'Record'}
          </button>
        )}
        <button
          type="button"
          className="tbtn"
          disabled={!hasTake || recording}
          aria-label={player.playing ? 'Stop playback' : 'Play back'}
          onClick={() => (player.playing ? player.stop() : phrase && void player.play([phrase], phrase.tempoBpm, { totalTicks: phrase.totalTicks }))}
        >
          <Icon name={player.playing ? 'stop' : 'playback'} size={26} />
          <span className="tbtn-label">{player.playing ? 'Stop' : 'Play'}</span>
        </button>
        <button type="button" className="tbtn" disabled={!previous || recording} onClick={bringBack} aria-label="Undo: bring back my last take">
          <Icon name="undo" size={26} />
          <span className="tbtn-label">Undo</span>
        </button>
        <button type="button" className="tbtn" aria-pressed={click} disabled={recording} onClick={() => setClick((c) => !c)} aria-label="Steady click while recording">
          <Icon name="click" size={26} />
          <span className="tbtn-label">Click</span>
        </button>
      </div>
      {click && !recording && (
        <label className="speed">
          Click speed
          <input type="range" min={60} max={140} step={5} value={tempo} onChange={(e) => setTempo(Number(e.target.value))} aria-valuetext={`${tempo} beats a minute`} />
          <span>{tempo}</span>
        </label>
      )}
      <p className="status-line" role="status">
        {state === 'countin' && 'Four clicks, then play.'}
        {state === 'recording' && 'Recording. Press Stop when you finish.'}
        {state === 'recorded' && phrase && !phrase.events.length && 'Nothing recorded. Press Record, then play.'}
      </p>
      <Workspace instrument={instrument} onEvent={onEvent} />
      {hasTake && (
        <div className="save-drawer">
          <label className="field">
            Name it
            <input type="text" value={title} maxLength={60} onChange={(e) => setTitle(e.target.value)} />
          </label>
          <button type="button" className="btn" onClick={doSave} disabled={save === 'saving' || save === 'saved'}>
            {save === 'saved' ? 'Saved' : save === 'saving' ? 'Saving…' : 'Save'}
          </button>
          <p className="save-where" role="status">
            {save === 'failed'
              ? 'That didn’t save. Your take is still here, so try again.'
              : save === 'saved'
                ? store.isPersistent
                  ? 'In My music on this device.'
                  : 'In My music until you close Carmen.'
                : store.isPersistent
                  ? 'Saves to My music on this device.'
                  : 'Saves to My music until you close Carmen.'}
          </p>
        </div>
      )}
    </div>
  );
}
