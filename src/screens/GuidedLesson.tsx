import { useEffect, useMemo, useRef, useState } from 'react';
import { audio } from '../audio/engine.ts';
import { type GuidedLesson as GL, type GuidedStep, type Beat } from '../data/guided.ts';
import { titleOf } from './LearnScreen.tsx';
import { type MusicEvent, type Phrase, TPQ } from '../music/events.ts';
import { midiToLetter, midiToName } from '../music/theory.ts';
import { usePrefs } from '../state/prefs.tsx';
import { newId, stamp, store } from '../store/db.ts';
import { Icon } from '../ui/icons.tsx';
import { Keyboard } from '../ui/instruments.tsx';
import { Notation } from '../ui/Notation.tsx';
import { usePlayer } from '../ui/usePlayer.ts';
import { LessonShell, type Stage } from './LessonShell.tsx';

// A guided concept lesson (brief 11 Nov, section 5): hear → notice → name → show → try → check once → next.
// Every "Hear" button plays real piano or drum samples; every check is answered by listening or playing.

const STAGE: Record<GuidedStep['kind'], Stage> = {
  listen: 'Demonstrate',
  compare: 'Explore',
  hold: 'Explore',
  names: 'Explain',
  find: 'Practise',
  pulse: 'Demonstrate',
  rhythm: 'Demonstrate',
  build: 'Explore',
  'which-rest': 'Feedback',
  done: 'Continue',
};

const BEAT_WORD: Record<Beat, string> = { sound: 'Sound', pair: 'Two quick sounds', rest: 'Silent beat' };

/** A few notes written one per beat in 4/4, to show them on a stave as a new way of seeing them. */
function notesPhrase(notes: number[]): Phrase {
  const events: MusicEvent[] = notes.map((m, i) => ({ id: `s${i}`, kind: 'note', midi: m, onset: i * TPQ * 2, duration: TPQ * 2, velocity: 0.7, author: 'lesson' }));
  return { id: 'names', instrument: 'keyboard', meter: [4, 4], totalTicks: Math.max(4, notes.length * 2) * TPQ, tempoBpm: 80, events };
}

/** A four-beat pattern as canonical events (480 ticks per crotchet). */
export function patternPhrase(pattern: Beat[], instrument: 'keyboard' | 'drums', bpm: number): Phrase {
  const events: MusicEvent[] = [];
  pattern.forEach((b, i) => {
    const at = i * TPQ;
    const sound = (onset: number, duration: number, k: number): MusicEvent =>
      instrument === 'drums'
        ? { id: `b${i}-${k}`, kind: 'drum', onset, duration, sound: 'snare', velocity: 0.75 }
        : { id: `b${i}-${k}`, kind: 'note', onset, duration, midi: 60, velocity: 0.7 };
    if (b === 'rest') events.push({ id: `b${i}`, kind: 'rest', onset: at, duration: TPQ });
    else if (b === 'sound') events.push(sound(at, TPQ, 0));
    else events.push(sound(at, TPQ / 2, 0), sound(at + TPQ / 2, TPQ / 2, 1));
  });
  return { id: 'guided', instrument, meter: [4, 4], totalTicks: pattern.length * TPQ, tempoBpm: bpm, events };
}

function BeatBoxes({ pattern, now, onToggle }: { pattern: Beat[]; now: number | null; onToggle?: (i: number) => void }) {
  return (
    <ol className="gl-beats" aria-label="Beats">
      {pattern.map((b, i) => {
        const body = (
          <>
            <span className="gl-beat-n">Beat {i + 1}</span>
            <span className={`gl-beat-shape is-${b}`} aria-hidden="true">
              {b === 'pair' ? (
                <>
                  <i />
                  <i />
                </>
              ) : (
                <i />
              )}
            </span>
            <span className="gl-beat-w">{BEAT_WORD[b]}</span>
          </>
        );
        return (
          <li key={i} className={now === i ? 'is-now' : ''}>
            {onToggle ? (
              <button type="button" className="gl-beat-btn" onClick={() => onToggle(i)} aria-label={`Beat ${i + 1}: ${BEAT_WORD[b]}. Tap to change.`}>
                {body}
              </button>
            ) : (
              <div className="gl-beat-btn is-static">{body}</div>
            )}
          </li>
        );
      })}
    </ol>
  );
}

function More({ text }: { text?: string }) {
  if (!text) return null;
  return (
    <details className="gl-more">
      <summary>Tell me more</summary>
      <p>{text}</p>
    </details>
  );
}

export function GuidedLesson({ lesson, go }: { lesson: GL; go: (r: string) => void }) {
  const { prefs } = usePrefs();
  const tapInstrument: 'keyboard' | 'drums' = lesson.instrument === 'keyboard' ? 'keyboard' : prefs.instrument === 'drums' ? 'drums' : 'keyboard';
  const [i, setI] = useState(0);
  const step = lesson.steps[i];
  const [ready, setReady] = useState(false);
  const [saved, setSaved] = useState(false);
  const tries = useRef(0);
  const heard = useRef(false);
  const next = () => {
    setReady(false);
    setI((n) => Math.min(lesson.steps.length - 1, n + 1));
  };

  const complete = async (what: string) => {
    if (saved) return;
    await store.put('attempts', {
      id: newId('att'),
      createdAt: stamp(),
      activityId: lesson.id,
      activityVersion: lesson.version,
      kind: 'concept',
      instrument: tapInstrument,
      tempoBpm: 0,
      support: { hintLevel: 0, heardExample: heard.current, largeControls: prefs.large, simplified: prefs.simplified, aiEnabled: prefs.aiEnabled, slower: false },
      inputs: [],
      passed: true,
      note: `mini-check passed: ${what}; tries ${tries.current}`,
    });
    setSaved(true);
  };

  const nextTitle = step.kind === 'done' ? titleOf(step.next) : '';
  const foot =
    step.kind === 'done' ? (
      <div className="gl-foot">
        <button type="button" className="btn btn-big btn-block" onClick={() => go(`#/lesson/${step.next}`)}>
          Next: {nextTitle}
        </button>
        <button type="button" className="btn-text" onClick={() => go('#/learn')}>
          Back to Learn
        </button>
      </div>
    ) : (
      <button type="button" className="btn btn-big btn-block" disabled={!ready} onClick={next}>
        {ready ? 'Next' : 'Try it first'}
      </button>
    );

  return (
    <LessonShell step={i + 1} steps={lesson.steps.length} stepKey={`${lesson.id}-${i}`} stage={step.kind === 'compare' && step.check ? 'Feedback' : step.kind === 'listen' && step.explain ? 'Explain' : STAGE[step.kind]} onClose={() => go('#/learn')} foot={foot}>
      <div className="gl">
        <p className="kicker">{lesson.title}</p>
        <h1 className="lp-title" tabIndex={-1}>
          {step.title}
        </h1>
        <p className="lp-say">{step.say}</p>
        <StepBody
          key={i}
          step={step}
          inst={tapInstrument}
          onReady={() => setReady(true)}
          onHeard={() => (heard.current = true)}
          onTry={() => (tries.current += 1)}
          onCheckPassed={(what) => void complete(what)}
        />
        {'more' in step && <More text={step.more} />}
      </div>
    </LessonShell>
  );
}

/** Light keys while notes sound: one note after another. */
function useNotePlayer() {
  const [lit, setLit] = useState<Set<number>>(new Set());
  const timers = useRef<number[]>([]);
  useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), []);
  const play = async (notes: number[], gap = 750, hold = 600) => {
    if (!audio.running) await audio.start();
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
    notes.forEach((m, k) => {
      timers.current.push(
        window.setTimeout(() => {
          audio.noteOn(m, 0.7);
          setLit(new Set([m]));
        }, k * gap),
        window.setTimeout(() => {
          audio.noteOff(m);
          setLit(new Set());
        }, k * gap + hold),
      );
    });
  };
  return { lit, play };
}

function StepBody({
  step,
  inst,
  onReady,
  onHeard,
  onTry,
  onCheckPassed,
}: {
  step: GuidedStep;
  inst: 'keyboard' | 'drums';
  onReady: () => void;
  onHeard: () => void;
  onTry: () => void;
  onCheckPassed: (what: string) => void;
}) {
  const np = useNotePlayer();
  const player = usePlayer();
  const [down, setDown] = useState<Set<number>>(new Set());
  const [msg, setMsg] = useState<{ tone: 'good' | 'miss'; text: string } | null>(null);
  const [done, setDone] = useState(false);
  const finish = () => {
    if (!done) {
      setDone(true);
      onReady();
    }
  };
  useEffect(() => {
    if (step.kind === 'done') onReady();
  }, [step.kind, onReady]);

  // Keys the learner presses (all steps that show a keyboard).
  const pressStart = useRef(new Map<number, number>());
  const [lengths, setLengths] = useState<number[]>([]);
  const [found, setFound] = useState(0);
  const onDown = (midi: number, t: number) => {
    if (!audio.running) void audio.start();
    audio.noteOn(midi, 0.7);
    pressStart.current.set(midi, t);
    setDown((d) => new Set(d).add(midi));
    if (step.kind === 'find') {
      const want = step.notes[found];
      if (want === undefined) return;
      if (midi === want) {
        const n = found + 1;
        setFound(n);
        setMsg(n === step.notes.length ? { tone: 'good', text: `You played ${step.notes.map(midiToLetter).join(', ')}.` } : null);
        if (n === step.notes.length) finish();
      } else {
        onTry();
        setMsg({ tone: 'miss', text: `You played ${midiToLetter(midi)}. This step needs ${midiToLetter(want)}: it’s the lit key. Try again from there.` });
      }
    }
  };
  const onUp = (midi: number, t: number) => {
    audio.noteOff(midi);
    setDown((d) => {
      const n = new Set(d);
      n.delete(midi);
      return n;
    });
    const s = pressStart.current.get(midi);
    if (s !== undefined && step.kind === 'hold') {
      const ms = Math.max(0, t - s);
      const nl = [...lengths.slice(-3), ms];
      setLengths(nl);
      if (nl.some((x) => x < 400) && nl.some((x) => x >= 900)) finish();
    }
  };

  const keyboard = (opts: { names?: boolean; lit?: number[]; low?: number; whites?: number }) => (
    <div className="gl-kb">
      <Keyboard
        low={opts.low ?? 60}
        whiteCount={opts.whites ?? 8}
        down={new Set([...down, ...np.lit])}
        highlight={new Set(opts.lit ?? [])}
        showNames={!!opts.names}
        showKeyHints={false}
        onDown={(m, t) => onDown(m, t)}
        onUp={(m, t) => onUp(m, t)}
        label="Piano keys"
      />
    </div>
  );

  const tap = () => {
    if (!audio.running) void audio.start();
    if (inst === 'drums') audio.drum('snare', 0.75);
    else {
      audio.noteOn(60, 0.7);
      window.setTimeout(() => audio.noteOff(60), 220);
    }
  };

  // ---- Steps ----
  if (step.kind === 'listen' || step.kind === 'names') {
    const notes = step.notes;
    const label = step.kind === 'listen' ? step.button : `Hear ${notes.map(midiToLetter).join(', ')}`;
    return (
      <>
        <button
          type="button"
          className="btn btn-big gl-hear"
          onClick={() => {
            onHeard();
            void np.play(notes).then(() => window.setTimeout(finish, notes.length * 750));
          }}
        >
          <Icon name="playback" size={24} /> {label}
        </button>
        {keyboard({ names: step.kind === 'names', lit: step.kind === 'names' ? notes : [] })}
        {step.kind === 'names' && (
          <p className="gl-caption">
            {notes.map((m) => midiToName(m)).join(' · ')}
          </p>
        )}
        {step.kind === 'names' && step.stave && (
          <figure className="gl-stave">
            <Notation phrase={notesPhrase(notes)} />
            <figcaption className="gl-caption">{step.stave}</figcaption>
          </figure>
        )}
      </>
    );
  }

  if (step.kind === 'compare') {
    return <Compare step={step} np={np} keyboard={keyboard} onHeard={onHeard} onTry={onTry} onRight={() => { if (step.check) onCheckPassed(`${midiToName(step.first)} vs ${midiToName(step.second)}, chose the ${step.ask} note`); finish(); }} />;
  }

  if (step.kind === 'hold') {
    const last = lengths[lengths.length - 1];
    const short = lengths.some((x) => x < 400);
    const long = lengths.some((x) => x >= 900);
    return (
      <>
        {keyboard({ lit: [step.midi], whites: 5 })}
        <div className="gl-hold" aria-live="polite">
          <div className="gl-hold-bar">
            <span style={{ width: `${Math.min(100, ((last ?? 0) / 1500) * 100)}%` }} />
          </div>
          <ul className="gl-checks">
            <li className={short ? 'is-done' : ''}>
              <Icon name={short ? 'check' : 'ring'} size={20} /> A short note
            </li>
            <li className={long ? 'is-done' : ''}>
              <Icon name={long ? 'check' : 'ring'} size={20} /> A long note (hold for about a second)
            </li>
          </ul>
          {last !== undefined && <p className="gl-caption">That note lasted {(last / 1000).toFixed(1)} seconds. Same key, same pitch: only the length changed.</p>}
        </div>
      </>
    );
  }

  if (step.kind === 'find') {
    return (
      <>
        {keyboard({ names: true, lit: step.lit ? step.notes.slice(found, found + 1) : [] })}
        <p className="gl-caption">
          {step.notes.map((m, k) => (
            <span key={k} className={`gl-seq${k < found ? ' is-done' : k === found ? ' is-now' : ''}`}>
              {k < found && <Icon name="check" size={16} />} {midiToName(m)}
            </span>
          ))}
        </p>
        {msg && <p className={`gl-msg is-${msg.tone}`} role="status">{msg.text}</p>}
      </>
    );
  }

  if (step.kind === 'pulse') {
    return <Pulse step={step} player={player} onTap={tap} onReady={finish} inst={inst} />;
  }

  if (step.kind === 'rhythm') {
    return <Rhythm step={step} player={player} inst={inst} onHeard={() => { onHeard(); finish(); }} />;
  }

  if (step.kind === 'build') {
    return <Build bpm={step.bpm} player={player} inst={inst} onReady={finish} />;
  }

  if (step.kind === 'which-rest') {
    return <WhichRest step={step} player={player} inst={inst} onTry={onTry} onRight={() => { onCheckPassed('heard which rhythm had a silent beat'); finish(); }} />;
  }

  return null;
}

type KeyboardFn = (o: { names?: boolean; lit?: number[]; low?: number; whites?: number }) => React.ReactNode;

function Compare({ step, np, keyboard, onHeard, onTry, onRight }: { step: Extract<GuidedStep, { kind: 'compare' }>; np: ReturnType<typeof useNotePlayer>; keyboard: KeyboardFn; onHeard: () => void; onTry: () => void; onRight: () => void }) {
  const [heardBoth, setHeardBoth] = useState(false);
  const [answer, setAnswer] = useState<'first' | 'second' | null>(null);
  const [showKeys, setShowKeys] = useState(false);
  const right = (step.ask === 'higher' ? step.first > step.second : step.first < step.second) ? 'first' : 'second';
  const n1 = midiToLetter(step.first);
  const n2 = midiToLetter(step.second);
  const higher = step.first > step.second ? n1 : n2;
  const choose = (a: 'first' | 'second') => {
    setAnswer(a);
    if (a === right) onRight();
    else onTry();
  };
  return (
    <>
      <div className="gl-row">
        <button type="button" className="btn gl-hear" onClick={() => { onHeard(); setHeardBoth(true); void np.play([step.first, step.second], 900, 700); }}>
          <Icon name="playback" size={24} /> Hear both notes
        </button>
        <button type="button" className="btn btn-quiet" onClick={() => void np.play([step.first])}>
          Hear note 1
        </button>
        <button type="button" className="btn btn-quiet" onClick={() => void np.play([step.second])}>
          Hear note 2
        </button>
      </div>
      {keyboard({ names: answer === right || showKeys })}
      <fieldset className="gl-choice" disabled={!heardBoth || answer === right}>
        <legend>Which one sounds {step.ask}?</legend>
        <button type="button" className={`btn btn-big${answer === 'first' ? ' is-picked' : ''}`} onClick={() => choose('first')}>
          First note
        </button>
        <button type="button" className={`btn btn-big${answer === 'second' ? ' is-picked' : ''}`} onClick={() => choose('second')}>
          Second note
        </button>
      </fieldset>
      {!heardBoth && <p className="gl-caption">Press Hear both notes first.</p>}
      {answer && (
        <p className={`gl-msg is-${answer === right ? 'good' : 'miss'}`} role="status">
          {answer === right ? (
            <>
              <Icon name="check" size={20} /> {step.good ?? `Yes. The ${right} note, ${higher}, sounds ${step.ask}. ${higher === n1 ? n1 : n2} is further ${step.ask === 'higher' ? 'right' : 'left'} on the keyboard.`}
            </>
          ) : (
            <>
              {step.miss ?? `Not this time. The first note was ${n1} and the second was ${n2}. ${higher} sounds higher: it’s further to the right on the keyboard. Listen to both again, then choose.`}
            </>
          )}
        </p>
      )}
      <button type="button" className="btn-text gl-access" onClick={() => setShowKeys((s) => !s)} aria-pressed={showKeys}>
        {showKeys ? 'Hide the note names' : 'Can’t hear it? Show the notes on the keys'}
      </button>
      {showKeys && <p className="gl-caption">The keys light up as each note plays. A key further to the right plays a higher note. Seeing this is not the same as hearing it, and that’s fine.</p>}
    </>
  );
}

type Player = ReturnType<typeof usePlayer>;

function Pulse({ step, player, onTap, onReady, inst }: { step: Extract<GuidedStep, { kind: 'pulse' }>; player: Player; onTap: () => void; onReady: () => void; inst: 'keyboard' | 'drums' }) {
  const [taps, setTaps] = useState(0);
  const [bpm, setBpm] = useState(step.bpm);
  const [started, setStarted] = useState(false);
  const phrase = useMemo<Phrase>(() => ({ id: 'pulse', instrument: inst, meter: [4, 4], totalTicks: step.beats * TPQ, tempoBpm: bpm, events: [] }), [step.beats, bpm, inst]);
  const now = player.beat;
  return (
    <>
      <div className="gl-row">
        <button type="button" className="btn gl-hear" onClick={() => { setStarted(true); if (player.playing) player.stop(); else void player.play([phrase], bpm, { totalTicks: phrase.totalTicks, click: true }); }}>
          <Icon name={player.playing ? 'stop' : 'playback'} size={24} /> {player.playing ? 'Stop the beat' : 'Hear the beat'}
        </button>
        <label className="gl-speed">
          Speed
          <input type="range" min={60} max={120} step={4} value={bpm} onChange={(e) => setBpm(Number(e.target.value))} aria-valuetext={`${bpm} beats a minute`} />
          <span>{bpm}</span>
        </label>
      </div>
      <ol className="gl-pulse" aria-label="Beats">
        {Array.from({ length: step.beats }, (_, k) => (
          <li key={k} className={now === k ? 'is-now' : now !== null && k < now ? 'is-past' : ''}>
            <span className="sr-only">Beat {k + 1}</span>
            <span aria-hidden="true">{(k % 4) + 1}</span>
          </li>
        ))}
      </ol>
      <button
        type="button"
        className="gl-tap"
        onPointerDown={(e) => {
          e.preventDefault();
          onTap();
          const n = taps + 1;
          setTaps(n);
          if (started && n >= step.taps) onReady();
        }}
        onKeyDown={(e) => {
          if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            onTap();
            const n = taps + 1;
            setTaps(n);
            if (started && n >= step.taps) onReady();
          }
        }}
      >
        Tap
      </button>
      <p className="gl-caption" aria-live="polite">
        {taps ? `${taps} ${taps === 1 ? 'tap' : 'taps'}.` : 'Tap the big button with the beat.'} {!started && taps > 0 ? 'Press Hear the beat, then tap along.' : ''}
      </p>
    </>
  );
}

function Rhythm({ step, player, inst, onHeard }: { step: Extract<GuidedStep, { kind: 'rhythm' }>; player: Player; inst: 'keyboard' | 'drums'; onHeard: () => void }) {
  const [beatToo, setBeatToo] = useState(true);
  const phrase = useMemo(() => patternPhrase(step.pattern, inst, step.bpm), [step.pattern, inst, step.bpm]);
  const sounding = phrase.events.filter((e) => e.kind !== 'rest');
  const active = player.tick === null ? undefined : sounding.reduce((acc, e, k) => (e.onset <= (player.tick ?? -1) ? k : acc), -1);
  return (
    <>
      <div className="gl-row">
        <button type="button" className="btn gl-hear" onClick={() => { onHeard(); if (player.playing) player.stop(); else void player.play([phrase], step.bpm, { totalTicks: phrase.totalTicks, click: beatToo, countInBeats: 4 }); }}>
          <Icon name={player.playing ? 'stop' : 'playback'} size={24} /> {player.playing ? 'Stop' : 'Hear the rhythm while the beat continues'}
        </button>
        <label className="gl-toggle">
          <input type="checkbox" checked={beatToo} onChange={(e) => setBeatToo(e.target.checked)} /> Play the beat too
        </label>
      </div>
      <BeatBoxes pattern={step.pattern} now={player.beat !== null && player.beat >= 0 ? player.beat : null} />
      {step.notation && <Notation phrase={phrase} activeIndex={active !== undefined && active >= 0 ? active : undefined} />}
    </>
  );
}

function Build({ bpm, player, inst, onReady }: { bpm: number; player: Player; inst: 'keyboard' | 'drums'; onReady: () => void }) {
  const [pattern, setPattern] = useState<Beat[]>(['sound', 'sound', 'sound', 'sound']);
  const cycle: Beat[] = ['sound', 'rest', 'pair'];
  const phrase = useMemo(() => patternPhrase(pattern, inst, bpm), [pattern, inst, bpm]);
  const hasRest = pattern.includes('rest');
  const hasSound = pattern.some((b) => b !== 'rest');
  return (
    <>
      <BeatBoxes pattern={pattern} now={player.beat !== null && player.beat >= 0 ? player.beat : null} onToggle={(k) => setPattern((p) => p.map((b, j) => (j === k ? cycle[(cycle.indexOf(b) + 1) % cycle.length] : b)))} />
      <button
        type="button"
        className="btn btn-big gl-hear"
        onClick={() => {
          if (player.playing) return player.stop();
          void player.play([phrase], bpm, { totalTicks: phrase.totalTicks, click: true, countInBeats: 4 });
          if (hasRest && hasSound) onReady();
        }}
      >
        <Icon name={player.playing ? 'stop' : 'playback'} size={24} /> {player.playing ? 'Stop' : 'Play my rhythm'}
      </button>
      <p className="gl-caption">{hasRest && hasSound ? 'Your rhythm has sounds and a silence. Play it to hear the pattern.' : hasRest ? 'Add at least one sound.' : 'Tap a beat to make it a silent beat.'}</p>
    </>
  );
}

function WhichRest({ step, player, inst, onTry, onRight }: { step: Extract<GuidedStep, { kind: 'which-rest' }>; player: Player; inst: 'keyboard' | 'drums'; onTry: () => void; onRight: () => void }) {
  // Which rhythm is played first changes after a wrong answer, so the next try is a fresh listen.
  const [restFirst, setRestFirst] = useState(false);
  const [answer, setAnswer] = useState<1 | 2 | null>(null);
  const [heard, setHeard] = useState<[boolean, boolean]>([false, false]);
  const pats = restFirst ? [step.withRest, step.without] : [step.without, step.withRest];
  const rightN: 1 | 2 = restFirst ? 1 : 2;
  const hear = (k: 0 | 1) => {
    const ph = patternPhrase(pats[k], inst, step.bpm);
    setHeard((h) => (k === 0 ? [true, h[1]] : [h[0], true]));
    void player.play([ph], step.bpm, { totalTicks: ph.totalTicks, click: true, countInBeats: 4 });
  };
  const choose = (n: 1 | 2) => {
    setAnswer(n);
    if (n === rightN) onRight();
    else onTry();
  };
  const wrongText = `Rhythm ${rightN === 1 ? 2 : 1} has a sound on every beat. In rhythm ${rightN}, beat ${step.restBeat} is a crotchet rest: keep counting through beat ${step.restBeat}, but don’t play a sound. Listen once more, then try again.`;
  return (
    <>
      <div className="gl-row">
        <button type="button" className="btn gl-hear" onClick={() => hear(0)}>
          <Icon name="playback" size={24} /> Hear rhythm 1
        </button>
        <button type="button" className="btn gl-hear" onClick={() => hear(1)}>
          <Icon name="playback" size={24} /> Hear rhythm 2
        </button>
      </div>
      <p className="gl-caption">The beat clicks under both rhythms. Count 1, 2, 3, 4.</p>
      <fieldset className="gl-choice" disabled={!(heard[0] && heard[1]) || answer === rightN}>
        <legend>Which rhythm has a silent beat?</legend>
        <button type="button" className={`btn btn-big${answer === 1 ? ' is-picked' : ''}`} onClick={() => choose(1)}>
          Rhythm 1
        </button>
        <button type="button" className={`btn btn-big${answer === 2 ? ' is-picked' : ''}`} onClick={() => choose(2)}>
          Rhythm 2
        </button>
      </fieldset>
      {!(heard[0] && heard[1]) && <p className="gl-caption">Hear both rhythms first.</p>}
      {answer === rightN && (
        <>
          <p className="gl-msg is-good" role="status">
            <Icon name="check" size={20} /> Yes. Beat {step.restBeat} of rhythm {rightN} is silent.
          </p>
          <BeatBoxes pattern={pats[rightN - 1]} now={null} />
        </>
      )}
      {answer !== null && answer !== rightN && (
        <>
          <p className="gl-msg is-miss" role="status">
            {wrongText}
          </p>
          <button
            type="button"
            className="btn"
            onClick={() => {
              setRestFirst((r) => !r);
              setAnswer(null);
              setHeard([false, false]);
            }}
          >
            Try a fresh pair
          </button>
        </>
      )}
    </>
  );
}
