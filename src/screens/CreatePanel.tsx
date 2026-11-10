import { useCallback, useRef, useState } from 'react';
import { audio } from '../audio/engine.ts';
import { inputsToPhrase } from '../ai/coach.ts';
import { Recorder } from '../music/capture.ts';
import { type InstrumentId, type Phrase, TPQ } from '../music/events.ts';
import { type CompositionRecord, newId, stamp, store } from '../store/db.ts';
import { Icon } from '../ui/icons.tsx';
import { usePrefs } from '../state/prefs.tsx';
import { usePlayer } from '../ui/usePlayer.ts';
import { type LiveEvent, Workspace } from '../ui/Workspace.tsx';

const MAX_SECONDS = 60;

interface Props {
  instrument: InstrumentId;
  activityId?: string;
  onSaved?: (c: CompositionRecord) => void;
  /** "Make it yours": a lesson's idea to start from. */
  idea?: { title: string; phrase: Phrase };
  onBackToLesson?: () => void;
}

/** Record as note events (never microphone audio), replay, name and save locally. No score. */
export function CreatePanel({ instrument, activityId, onSaved, idea, onBackToLesson }: Props) {
  const [state, setState] = useState<'idle' | 'countin' | 'recording' | 'recorded'>('idle');
  const { prefs } = usePrefs();
  const [click, setClick] = useState(prefs.metronomeOn);
  const [tempo, setTempo] = useState(idea ? idea.phrase.tempoBpm : prefs.metronomeTempo);
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
        countInBeats: prefs.countIn,
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

  const dock = (
    <div className="dock" role="group" aria-label="Recording">
      <button type="button" className={`rec${recording ? ' is-on' : ''}`} onClick={recording ? stopRecording : startRecording}>
        <span className="rec-dot" aria-hidden="true" />
        <span className="rec-text">
          <span className="rec-label">{recording ? (state === 'countin' ? 'Get ready' : 'Stop') : phrase ? 'Record again' : 'Record'}</span>
          <span className="rec-sub">{state === 'countin' ? `${prefs.countIn} beats, then play` : state === 'recording' ? 'Recording…' : click ? `Metronome ${tempo}` : 'Tap to start'}</span>
        </span>
      </button>
      <button
        type="button"
        className="tool"
        aria-label={player.playing ? 'Stop playback' : 'Play back my take'}
        disabled={!hasTake || recording}
        onClick={() => (player.playing ? player.stop() : phrase && void player.play([phrase], phrase.tempoBpm, { totalTicks: phrase.totalTicks }))}
      >
        <Icon name={player.playing ? 'stop' : 'playback'} size={22} />
        <span>{player.playing ? 'Stop' : 'Play'}</span>
      </button>
      <button type="button" className="tool" disabled={!previous || recording} onClick={bringBack} aria-label="Undo: bring back my last take">
        <Icon name="undo" size={22} />
        <span>Undo</span>
      </button>
      <button type="button" className="tool tool-toggle" aria-pressed={click} disabled={recording} onClick={() => setClick((c) => !c)} aria-label="Metronome while recording">
        <Icon name="click" size={22} />
        <span>Metronome</span>
      </button>
      {click && !recording && (
        <label className="speed">
          Speed
          <input type="range" min={60} max={140} step={5} value={tempo} onChange={(e) => setTempo(Number(e.target.value))} aria-valuetext={`${tempo} beats a minute`} />
          <span>{tempo}</span>
        </label>
      )}
    </div>
  );

  const ideaPlayer = player;
  return (
    <div className="create">
      {idea && (
        <section className="idea" aria-labelledby="idea-h">
          <div>
            <p className="kicker">Make it yours</p>
            <h2 id="idea-h" className="h3 idea-title">
              Start from “{idea.title}”
            </h2>
            <p className="support">Hear the idea, then record your own version. Change a note, change the rhythm, or add an ending.</p>
          </div>
          <div className="row wrap">
            <button
              type="button"
              className="btn-quiet"
              disabled={recording}
              onClick={() => (ideaPlayer.playing ? ideaPlayer.stop() : void ideaPlayer.play([idea.phrase], idea.phrase.tempoBpm, { totalTicks: idea.phrase.totalTicks }))}
            >
              <Icon name={ideaPlayer.playing ? 'stop' : 'playback'} size={18} /> {ideaPlayer.playing ? 'Stop' : 'Hear the idea'}
            </button>
            {onBackToLesson && (
              <button type="button" className="btn-quiet" onClick={onBackToLesson}>
                Lesson summary
              </button>
            )}
          </div>
        </section>
      )}
      <Workspace instrument={instrument} onEvent={onEvent} trail recording={state === 'recording'} dock={dock} />
      <p className="status-line" role="status">
        {state === 'recorded' && phrase && !phrase.events.length && 'Nothing recorded. Press Record, then play.'}
      </p>
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
            {save === 'failed' ? 'That didn’t save. Your take is still here, so try again.' : !store.isPersistent ? 'Saving is off: this goes when Carmen closes.' : ''}
          </p>
        </div>
      )}
    </div>
  );
}
