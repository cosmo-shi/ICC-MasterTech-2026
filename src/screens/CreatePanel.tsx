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

  return (
    <div className="create">
      <div className="row wrap">
        {state === 'idle' || state === 'recorded' ? (
          <button type="button" className="btn btn-coral" onClick={startRecording}>
            <span aria-hidden="true">● </span>
            {phrase ? 'Record a new take' : 'Record my music'}
          </button>
        ) : (
          <button type="button" className="btn btn-coral" onClick={stopRecording}>
            <span aria-hidden="true">■ </span>Stop recording
          </button>
        )}
        <label className="check">
          <input type="checkbox" checked={click} onChange={(e) => setClick(e.target.checked)} disabled={state !== 'idle' && state !== 'recorded'} />
          Play a steady click while I record
        </label>
        {click && (
          <label className="field-inline">
            Speed
            <input type="range" min={60} max={140} step={5} value={tempo} onChange={(e) => setTempo(Number(e.target.value))} aria-valuetext={`${tempo} beats a minute`} />
            <span>{tempo}</span>
          </label>
        )}
      </div>
      <p className="status-line" role="status">
        {state === 'countin' && 'Four clicks, then play…'}
        {state === 'recording' && 'Recording the notes you play (not your voice). Up to one minute.'}
        {state === 'recorded' && phrase && (phrase.events.length ? `Recorded ${phrase.events.length} sounds.` : 'No sounds were recorded. Press record and play some keys or pads.')}
      </p>
      <Workspace instrument={instrument} onEvent={onEvent} />
      {previous && state === 'recorded' && (
        <div className="row wrap">
          <button type="button" className="btn-quiet" onClick={bringBack}>
            <Icon name="undo" size={22} /> Bring back my last take
          </button>
        </div>
      )}
      {state === 'recorded' && phrase && phrase.events.length > 0 && (
        <div className="save-box">
          <div className="row wrap">
            <button type="button" className="btn-quiet" onClick={() => (player.playing ? player.stop() : void player.play([phrase], phrase.tempoBpm, { totalTicks: phrase.totalTicks }))}>
              {player.playing ? 'Stop' : <><span aria-hidden="true">▶ </span>Play it back</>}
            </button>
          </div>
          <label className="field">
            Name (optional — no real names needed)
            <input type="text" value={title} maxLength={60} onChange={(e) => setTitle(e.target.value)} />
          </label>
          <div className="row wrap">
            <button type="button" className="btn" onClick={doSave} disabled={save === 'saving' || save === 'saved'}>
              {save === 'saved' ? 'Kept in My music' : save === 'saving' ? 'Saving…' : 'Save my sound'}
            </button>
            {save === 'failed' && <p className="note-text">It could not be saved. Your recording is still here; try again.</p>}
          </div>
          <p className="note-text save-where" role="status">
            {save === 'saved'
              ? store.isPersistent
                ? 'Saved in this browser on this device. It is not on other devices.'
                : 'Kept in My music until this page is closed. A grown-up can turn on “Save on this device”.'
              : store.isPersistent
                ? 'Saving keeps it in this browser on this device.'
                : 'Saving is off on this device, so it is kept only until the page is closed.'}
          </p>
        </div>
      )}
    </div>
  );
}
