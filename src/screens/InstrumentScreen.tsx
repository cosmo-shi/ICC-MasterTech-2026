// "Use my instrument": play a real piano, keyboard, drum or table into Carmen.
// One step per screen: what you play → how Carmen hears it → check → activity → play → feedback.
// The microphone is asked for only when "Microphone" is pressed, shows a visible Listening state
// with Stop, stops when this screen is left or hidden, and keeps audio only when Record is used.
import { useEffect, useMemo, useRef, useState } from 'react';
import { audio } from '../audio/engine.ts';
import { checkAttempt, type CapturedInput, type CheckResult } from '../engine/checker.ts';
import { listening } from '../input/session.ts';
import { mic } from '../input/mic.ts';
import { midiInput } from '../input/midi.ts';
import { compareNote, describeFreePlay, noteFeedback, rhythmClarity, type NoteVerdict } from '../listen/compare.ts';
import { describeTaps, rhythmFeedback, unclearFeedback, type Feedback } from '../listen/feedback.ts';
import type { HeardNote } from '../listen/analyser.ts';
import type { Assessment } from '../music/lessons.ts';
import { type MusicEvent, type Phrase, TPQ } from '../music/events.ts';
import { midiToLetter } from '../music/theory.ts';
import { inputsToPhrase } from '../ai/coach.ts';
import { newId, store, type RecordingRecord } from '../store/db.ts';
import { players } from '../store/profiles.ts';
import { Icon } from '../ui/icons.tsx';
import { Notation } from '../ui/Notation.tsx';
import { usePlayer } from '../ui/usePlayer.ts';
import { factMark } from '../ui/common.tsx';
import { InputTrouble, LevelMeter, TimingCheck, useListening } from '../ui/InputPanel.tsx';
import { StartSound } from '../ui/Workspace.tsx';

type Inst = 'piano' | 'drums';
type Via = 'mic' | 'midi';
type Step = 'what' | 'how' | 'check' | 'activity' | 'do';
type Activity = 'note' | 'rhythm' | 'free';

const ACTIVITIES: Record<Inst, { id: Activity; title: string; sub: string; icon: 'notes' | 'drum' | 'music' }[]> = {
  piano: [
    { id: 'note', title: 'Play a note', sub: 'Carmen shows a note. You play it, Carmen tells you which note it heard.', icon: 'notes' },
    { id: 'rhythm', title: 'Copy a rhythm', sub: 'Hear a short rhythm, then play it on any key.', icon: 'drum' },
    { id: 'free', title: 'Free play', sub: 'Play anything. Carmen describes what it heard, without marking it.', icon: 'music' },
  ],
  drums: [
    { id: 'rhythm', title: 'Copy a rhythm', sub: 'Hear a short rhythm, then tap it.', icon: 'drum' },
    { id: 'free', title: 'Free play', sub: 'Tap anything. Carmen describes the spaces between your taps.', icon: 'music' },
  ],
};

export function InstrumentScreen({ go }: { go: (r: string) => void }) {
  const l = useListening();
  const [inst, setInst] = useState<Inst | null>(null);
  const [via, setVia] = useState<Via | null>(null);
  const [step, setStep] = useState<Step>('what');
  const [activity, setActivity] = useState<Activity | null>(null);
  const [asked, setAsked] = useState<Via | null>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    heading.current?.focus({ preventScroll: true });
  }, [step]);
  // Leaving this screen always stops the microphone.
  useEffect(() => () => listening.stopMic(), []);

  const back = () => {
    if (step === 'what') go('#/play');
    else if (step === 'how') setStep('what');
    else if (step === 'check') {
      listening.chooseScreen();
      setStep('how');
    } else if (step === 'activity') setStep('check');
    else setStep('activity');
  };

  const chooseVia = async (v: Via) => {
    setAsked(v);
    setVia(v);
    if (v === 'mic') {
      if (await l.startMic({ pitch: inst === 'piano' })) setStep('check');
    } else if (await l.connectMidi()) setStep('check');
  };

  // If the microphone stopped (page hidden, unplugged), go back to the check so it can restart.
  const lost = via === 'mic' && (step === 'do' || step === 'activity') && !l.listening;

  const title = {
    what: 'What will you play?',
    how: 'How will Carmen hear it?',
    check: via === 'mic' ? 'Check the microphone' : 'Check the keyboard',
    activity: 'What would you like to do?',
    do: ACTIVITIES[inst ?? 'piano'].find((a) => a.id === activity)?.title ?? '',
  }[step];

  return (
    <div className="screen instrument-screen">
      <div className="flow-bar">
        <button type="button" className="btn-quiet small" onClick={back}>
          <Icon name="back" size={20} /> Back
        </button>
        {l.mode === 'mic' && l.listening && (
          <span className="mic-live" role="status">
            <span className="mic-dot" aria-hidden="true" /> Listening
            <button type="button" className="btn-quiet small" onClick={() => { l.stopMic(); setStep('how'); }}>
              <Icon name="stop" size={18} /> Stop
            </button>
          </span>
        )}
      </div>
      <h1 ref={heading} tabIndex={-1} className="title flow-title">
        {title}
      </h1>
      {step === 'do' && <StartSound compact />}

      {step === 'what' && (
        <>
          <div className="pick-list">
            <button type="button" className="pick" onClick={() => { setInst('piano'); setStep('how'); }}>
              <Icon name="piano" size={32} />
              <span>
                <span className="pick-title">Piano or keyboard</span>
                <span className="pick-sub">One note at a time, or rhythms on any key.</span>
              </span>
            </button>
            <button type="button" className="pick" onClick={() => { setInst('drums'); setStep('how'); }}>
              <Icon name="drum" size={32} />
              <span>
                <span className="pick-title">A drum, or tapping a table</span>
                <span className="pick-sub">Rhythms: when each tap starts.</span>
              </span>
            </button>
          </div>
          <p className="note-text">Guitar isn’t ready yet: Carmen hasn’t been checked with real guitars.</p>
        </>
      )}

      {step === 'how' && inst && (
        <>
          <div className="pick-list">
            <button type="button" className="pick" onClick={() => chooseVia('mic')}>
              <Icon name="mic" size={32} />
              <span>
                <span className="pick-title">Microphone</span>
                <span className="pick-sub">Carmen listens on this device to hear your {inst === 'piano' ? 'notes' : 'taps'}. Nothing is sent anywhere. Sound is kept only if you press Record.</span>
              </span>
            </button>
            <button type="button" className="pick" onClick={() => chooseVia('midi')}>
              <Icon name="midi" size={32} />
              <span>
                <span className="pick-title">{inst === 'piano' ? 'MIDI keyboard' : 'Electronic drum kit (MIDI)'}</span>
                <span className="pick-sub">By cable or Bluetooth. Every key and exactly when.</span>
              </span>
            </button>
            <button type="button" className="pick" onClick={() => go('#/play')}>
              <Icon name="play" size={32} />
              <span>
                <span className="pick-title">The screen</span>
                <span className="pick-sub">Play the {inst === 'piano' ? 'keys' : 'drums'} on this screen instead.</span>
              </span>
            </button>
          </div>
          {asked && (
            <div className="stack">
              <InputTrouble kind={asked} />
              {asked === 'mic' && (mic.state === 'denied' || mic.state === 'error') && (
                <button type="button" className="btn" onClick={() => chooseVia('mic')}>
                  Try again
                </button>
              )}
              {asked === 'midi' && midiInput.state === 'none' && (
                <button type="button" className="btn" onClick={() => chooseVia('midi')}>
                  Look again
                </button>
              )}
            </div>
          )}
        </>
      )}

      {step === 'check' && inst && via && <CheckStep inst={inst} via={via} onNext={() => setStep('activity')} />}

      {step === 'activity' && inst && (
        <div className="pick-list">
          {ACTIVITIES[inst].map((a) => (
            <button key={a.id} type="button" className="pick" onClick={() => { setActivity(a.id); setStep('do'); }}>
              <Icon name={a.icon} size={32} />
              <span>
                <span className="pick-title">{a.title}</span>
                <span className="pick-sub">{a.sub}</span>
              </span>
            </button>
          ))}
        </div>
      )}

      {lost && (
        <div className="stack">
          <InputTrouble kind="mic" />
          <button type="button" className="btn" onClick={() => chooseVia('mic')}>
            <Icon name="mic" size={22} /> Listen again
          </button>
        </div>
      )}

      {step === 'do' && inst && via && !lost && (
        <>
          {activity === 'note' && <NoteActivity via={via} />}
          {activity === 'rhythm' && <RhythmActivity via={via} />}
          {activity === 'free' && <FreeActivity inst={inst} via={via} />}
          {via === 'mic' && <RecordBar inst={inst} activity={activity ?? 'free'} />}
        </>
      )}
    </div>
  );
}

/** Level meter and "what Carmen heard", so the learner knows it works before starting. */
function CheckStep({ inst, via, onNext }: { inst: Inst; via: Via; onNext: () => void }) {
  const l = useListening();
  const [last, setLast] = useState<string>('');
  useEffect(() => {
    if (via === 'mic')
      return l.onHeard((h) => {
        if (h.own) return;
        if (h.kind === 'note') setLast(h.confidence >= 0.6 ? `a note: ${midiToLetter(h.midi)}` : 'a sound, but not a clear note');
        else if (inst === 'drums') setLast('a tap');
      });
    return midiInput.listen((n) => n.type === 'down' && setLast(inst === 'piano' ? `a note: ${midiToLetter(n.midi)}` : 'a hit'));
  }, [l, via, inst]);
  return (
    <div className="stack check-step">
      {via === 'mic' ? (
        <>
          <p className="lead">{inst === 'piano' ? 'Play one note and let it ring.' : 'Tap once on your drum or the table.'}</p>
          <LevelMeter big />
        </>
      ) : (
        <p className="lead">
          {midiInput.devices[0] ?? 'MIDI keyboard'} is connected. {inst === 'piano' ? 'Press any key.' : 'Hit any pad.'}
        </p>
      )}
      <p className="heard" role="status" aria-live="polite">
        {last ? (
          <>
            Carmen heard <strong>{last}</strong>.
          </>
        ) : (
          'Nothing heard yet.'
        )}
      </p>
      {via === 'mic' && (
        <details className="more" open={inst === 'drums'}>
          <summary>Timing check {inst === 'drums' ? '(needed for rhythms)' : '(needed for rhythms only)'}</summary>
          <TimingCheck />
        </details>
      )}
      <button type="button" className="btn btn-big" onClick={onNext} disabled={!last}>
        Carry on <Icon name="forward" size={22} />
      </button>
    </div>
  );
}

function FeedbackCard({ f, children }: { f: Feedback; children?: React.ReactNode }) {
  return (
    <div className="listen-feedback" role="status" aria-live="polite">
      <p className="fb-what">{f.what}</p>
      <p className="fb-why">{f.why}</p>
      <p className="fb-next">
        <Icon name="forward" size={18} /> {f.next}
      </p>
      <div className="row wrap">{children}</div>
    </div>
  );
}

const NOTE_TARGETS = [60, 62, 64, 65, 67, 69, 71, 72];
const notePhrase = (midi: number): Phrase => ({
  id: 'listen-note',
  instrument: 'keyboard',
  meter: [4, 4],
  totalTicks: 4 * TPQ,
  tempoBpm: 80,
  events: [{ id: 'n1', kind: 'note', onset: 0, duration: 4 * TPQ, midi, velocity: 0.7 }],
});

function NoteActivity({ via }: { via: Via }) {
  const l = useListening();
  const player = usePlayer();
  const [target, setTarget] = useState(60);
  const [waiting, setWaiting] = useState(false);
  const [verdict, setVerdict] = useState<NoteVerdict | null>(null);
  const [live, setLive] = useState('');
  const phrase = useMemo(() => notePhrase(target), [target]);
  useEffect(() => {
    if (via === 'mic') l.setPitch(true);
  }, [l, via]);

  useEffect(() => {
    if (!waiting) return;
    let pendingOnset: number | null = null;
    const settle = (v: NoteVerdict) => {
      window.clearTimeout(pendingOnset ?? 0);
      setVerdict(v);
      setWaiting(false);
    };
    if (via === 'midi')
      return midiInput.listen((n) => {
        if (n.type !== 'down') return;
        const heard: HeardNote = { kind: 'note', time: 0, midi: n.midi, cents: 0, confidence: 1, agreement: 1 };
        settle(compareNote(target, heard));
      });
    const off = l.onHeard((h) => {
      if (h.own) return;
      if (h.kind === 'onset') {
        setLive('Hearing a sound…');
        // A sound with no steady pitch: say so, never call it a wrong note.
        pendingOnset = window.setTimeout(() => settle(compareNote(target, undefined)), 900);
      } else {
        setLive(h.confidence >= 0.6 ? `Heard ${midiToLetter(h.midi)}` : 'Not a clear note');
        settle(compareNote(target, h));
      }
    });
    return () => {
      off();
      window.clearTimeout(pendingOnset ?? 0);
    };
  }, [waiting, via, l, target]);

  const hear = () => void player.play([{ events: phrase.events }], 80, { totalTicks: 2 * TPQ });
  const difference = () => {
    if (!verdict || verdict.kind === 'unclear') return;
    const ev: MusicEvent[] = [
      { id: 'h', kind: 'note', onset: 0, duration: TPQ * 1.5, midi: verdict.heard, velocity: 0.7 },
      { id: 't', kind: 'note', onset: 2 * TPQ, duration: TPQ * 1.5, midi: target, velocity: 0.7 },
    ];
    void player.play([{ events: ev }], 80, { totalTicks: 4 * TPQ });
  };
  const next = () => {
    const options = NOTE_TARGETS.filter((m) => m !== target);
    setTarget(options[Math.floor(Math.random() * options.length)]);
    setVerdict(null);
    setLive('');
  };
  const f = verdict ? noteFeedback(verdict) : null;

  return (
    <div className="stack activity">
      <div className="target-note">
        <Notation phrase={phrase} />
        <p className="target-name" aria-label={`The note is ${midiToLetter(target)}`}>
          {midiToLetter(target)}
        </p>
      </div>
      {!f && (
        <div className="row wrap">
          <button type="button" className="btn-quiet" onClick={hear}>
            <Icon name="sound" size={22} /> Hear it
          </button>
          {waiting ? (
            <p className="live-heard" role="status">
              <span className="mic-dot" aria-hidden="true" /> {live || `Play ${midiToLetter(target)}`}
            </p>
          ) : (
            <button type="button" className="btn btn-big" onClick={() => { player.stop(); setWaiting(true); setLive(''); }}>
              <Icon name="listen" size={24} /> Play it
            </button>
          )}
        </div>
      )}
      {f && (
        <FeedbackCard f={f}>
          {verdict?.kind === 'different' && (
            <button type="button" className="btn-quiet" onClick={difference}>
              <Icon name="ear" size={22} /> Hear the difference
            </button>
          )}
          <button type="button" className="btn-quiet" onClick={() => { setVerdict(null); setWaiting(true); setLive(''); }}>
            <Icon name="undo" size={22} /> Try again
          </button>
          <button type="button" className="btn" onClick={next}>
            Next note <Icon name="forward" size={22} />
          </button>
        </FeedbackCard>
      )}
    </div>
  );
}

const ASSESS: Assessment = {
  mode: 'timed-onsets',
  score: true,
  checkPitch: false,
  checkTiming: true,
  checkDuration: false,
  checkRestViolations: true,
  onTimeWindow: { beats: 0.2, maxMs: 150 },
  durationTolerance: { beats: 0.5, maxMs: 400 },
};

/** Short rhythms in beats (4/4). null marks a crotchet rest. */
const RHYTHMS: { onsets: number[]; rests: number[] }[] = [
  { onsets: [0, 1, 2, 3], rests: [] },
  { onsets: [0, 1, 2], rests: [3] },
  { onsets: [0, 1, 1.5, 2, 3], rests: [] },
  { onsets: [0, 2, 3], rests: [1] },
  { onsets: [0, 0.5, 1, 2, 2.5, 3], rests: [] },
];
function rhythmPhrase(i: number, tempo: number): Phrase {
  const r = RHYTHMS[i % RHYTHMS.length];
  const events: MusicEvent[] = [];
  const all = [...r.onsets.map((b) => ({ b, rest: false })), ...r.rests.map((b) => ({ b, rest: true }))].sort((a, b) => a.b - b.b);
  all.forEach((x, k) => {
    const nextB = all[k + 1]?.b ?? 4;
    const onset = Math.round(x.b * TPQ);
    const duration = Math.round((nextB - x.b) * TPQ);
    events.push(x.rest ? { id: `r${k}`, kind: 'rest', onset, duration } : { id: `e${k}`, kind: 'drum', onset, duration, sound: 'snare', velocity: 0.7 });
  });
  return { id: `listen-rhythm-${i}`, instrument: 'drums', meter: [4, 4], totalTicks: 4 * TPQ, tempoBpm: tempo, events };
}

function RhythmActivity({ via }: { via: Via }) {
  const l = useListening();
  const player = usePlayer();
  const [which, setWhich] = useState(0);
  const [tempo, setTempo] = useState(80);
  const [phase, setPhase] = useState<'ready' | 'countin' | 'playing' | 'done'>('ready');
  const [result, setResult] = useState<{ res?: CheckResult; f: Feedback; take?: Phrase } | null>(null);
  const phrase = useMemo(() => rhythmPhrase(which, tempo), [which, tempo]);
  const midiTaps = useRef<number[]>([]);
  const deviceFault = useRef(false);
  useEffect(() => {
    if (via === 'mic') l.setPitch(false);
    if (via !== 'midi') return;
    return midiInput.listen((n) => n.type === 'down' && midiTaps.current.push(n.t));
  }, [l, via]);
  const needsTiming = via === 'mic' && l.latency === null;
  const beatMs = 60000 / tempo;
  const expected = phrase.events.filter((e) => e.kind !== 'rest').length;

  const hear = () => void player.play([{ events: phrase.events }], tempo, { totalTicks: phrase.totalTicks, countInBeats: 4 });
  const go = async () => {
    setResult(null);
    midiTaps.current = [];
    deviceFault.current = false;
    if (!audio.running) await audio.start();
    setPhase('countin');
    let beat0 = 0;
    // Count-in clicks only; no click while the learner plays, so the microphone hears only them.
    await player.play([], tempo, {
      countInBeats: 4,
      click: via !== 'mic',
      totalTicks: phrase.totalTicks,
      tailBeats: 0.9,
      onBeat0: (pb) => {
        beat0 = pb.beat0PerfMs;
        const wait = pb.beat0PerfMs - performance.now();
        if (wait < 0 || wait > 4 * beatMs + 1500) deviceFault.current = true;
        window.setTimeout(() => setPhase((p) => (p === 'countin' ? 'playing' : p)), Math.max(0, wait));
      },
      onEnd: () => finish(beat0),
    });
  };
  const finish = (beat0: number) => {
    setPhase('done');
    if (deviceFault.current) {
      setResult({ f: unclearFeedback('device') });
      return;
    }
    const from = beat0 - beatMs * 0.5;
    const to = beat0 + 4 * beatMs + beatMs * 0.75;
    let inputs: CapturedInput[];
    if (via === 'mic') {
      const heard = l.heardSince(from).filter((h) => h.kind === 'onset' && h.tPerf <= to);
      const clear = rhythmClarity(heard.filter((h) => h.kind === 'onset'), expected, l.latency !== null);
      if (!clear.clear) {
        setResult({ f: unclearFeedback(clear.reason ?? 'too-few') });
        return;
      }
      inputs = heard.map((h, i) => ({ id: `mic${i}`, onsetMs: h.tPerf - beat0, source: 'mic' as const, sound: 'snare' as const, soundUnknown: true }));
    } else {
      inputs = midiTaps.current.filter((t) => t >= from && t <= to).map((t, i) => ({ id: `midi${i}`, onsetMs: t - beat0, source: 'midi' as const, sound: 'snare' as const, soundUnknown: true }));
    }
    const res = checkAttempt(phrase, inputs, ASSESS, tempo);
    setResult({ res, f: rhythmFeedback(res), take: inputsToPhrase(inputs, phrase, tempo) });
  };
  const difference = () => {
    if (!result?.take) return;
    // Yours (hi-hat), a bar's gap, then the rhythm (snare).
    const yours = result.take.events.map((e) => (e.kind === 'drum' ? { ...e, sound: 'hihat' as const } : e));
    const theirs = phrase.events.map((e) => ({ ...e, id: `t${e.id}`, onset: e.onset + 5 * TPQ }));
    void player.play([{ events: [...yours, ...theirs] }], tempo, { totalTicks: 9 * TPQ, countInBeats: 0 });
  };

  return (
    <div className="stack activity">
      <Notation phrase={phrase} marks={result?.res ? result.res.facts.map(factMark) : undefined} activeIndex={undefined} />
      <p className="beat-state" role="status">
        {phase === 'countin' ? 'Get ready: 1, 2, 3, 4…' : phase === 'playing' ? (via === 'mic' ? 'Your turn. Tap now.' : 'Your turn. Play now.') : tempo < 80 ? `Slower: ${tempo} beats a minute` : ''}
      </p>
      {needsTiming && (
        <div className="stack">
          <p className="lead">First, a timing check, so Carmen can tell when your taps really happen.</p>
          <TimingCheck />
        </div>
      )}
      {!result && (
        <div className="row wrap">
          <button type="button" className="btn-quiet" onClick={hear} disabled={phase === 'countin' || phase === 'playing'}>
            <Icon name="sound" size={22} /> Hear it
          </button>
          <button type="button" className="btn btn-big" onClick={go} disabled={needsTiming || phase === 'countin' || phase === 'playing'}>
            <Icon name="listen" size={24} /> Your turn
          </button>
        </div>
      )}
      {result && (
        <FeedbackCard f={result.f}>
          {result.f.compare && result.take && (
            <button type="button" className="btn-quiet" onClick={difference}>
              <Icon name="ear" size={22} /> Hear the difference
            </button>
          )}
          {result.f.slower && tempo >= 80 && (
            <button type="button" className="btn-quiet" onClick={() => { setTempo(64); setResult(null); setPhase('ready'); }}>
              Try slower
            </button>
          )}
          <button type="button" className="btn-quiet" onClick={() => { setResult(null); setPhase('ready'); }}>
            <Icon name="undo" size={22} /> Try again
          </button>
          <button type="button" className="btn" onClick={() => { setWhich((w) => w + 1); setTempo(80); setResult(null); setPhase('ready'); }}>
            New rhythm <Icon name="forward" size={22} />
          </button>
        </FeedbackCard>
      )}
    </div>
  );
}

function FreeActivity({ inst, via }: { inst: Inst; via: Via }) {
  const l = useListening();
  const player = usePlayer();
  const [on, setOn] = useState(false);
  const [notes, setNotes] = useState<{ midi: number; t: number }[]>([]);
  const [taps, setTaps] = useState<{ time: number }[]>([]);
  const [done, setDone] = useState('');
  useEffect(() => {
    if (via === 'mic') l.setPitch(inst === 'piano');
  }, [l, via, inst]);
  useEffect(() => {
    if (!on) return;
    if (via === 'midi')
      return midiInput.listen((n) => {
        if (n.type !== 'down') return;
        setNotes((x) => [...x, { midi: n.midi, t: n.t }]);
        setTaps((x) => [...x, { time: n.t / 1000 }]);
      });
    return l.onHeard((h) => {
      if (h.own) return;
      if (h.kind === 'note' && h.confidence >= 0.6) setNotes((x) => [...x, { midi: h.midi, t: h.tPerf }]);
      if (h.kind === 'onset') setTaps((x) => [...x, { time: h.time }]);
    });
  }, [on, via, l]);
  const stop = () => {
    setOn(false);
    setDone(inst === 'piano' ? describeFreePlay(notes) : describeTaps(taps));
  };
  const replay = () => {
    if (!notes.length) return;
    const t0 = notes[0].t;
    const ev: MusicEvent[] = notes.slice(0, 64).map((n, i) => ({ id: `f${i}`, kind: 'note', onset: Math.round(((n.t - t0) / 1000) * 2 * TPQ), duration: TPQ, midi: n.midi, velocity: 0.7 }));
    const total = (ev[ev.length - 1]?.onset ?? 0) + 2 * TPQ;
    void player.play([{ events: ev }], 120, { totalTicks: total });
  };
  return (
    <div className="stack activity">
      {!on && !done && (
        <button type="button" className="btn btn-big" onClick={() => { setNotes([]); setTaps([]); setDone(''); setOn(true); }}>
          <Icon name="listen" size={24} /> Start
        </button>
      )}
      {on && (
        <>
          <p className="live-heard" role="status">
            <span className="mic-dot" aria-hidden="true" /> {inst === 'piano' ? (notes.length ? `Heard ${notes.slice(-6).map((n) => midiToLetter(n.midi)).join(' ')}` : 'Play anything…') : taps.length ? `${taps.length} ${taps.length === 1 ? 'tap' : 'taps'}` : 'Tap anything…'}
          </p>
          <button type="button" className="btn" onClick={stop}>
            <Icon name="stop" size={22} /> I’ve finished
          </button>
        </>
      )}
      {done && (
        <div className="listen-feedback" role="status">
          <p className="fb-what">{done}</p>
          <div className="row wrap">
            {inst === 'piano' && notes.length > 1 && (
              <button type="button" className="btn-quiet" onClick={replay}>
                <Icon name="playback" size={22} /> Hear what Carmen heard
              </button>
            )}
            <button type="button" className="btn" onClick={() => { setNotes([]); setTaps([]); setDone(''); setOn(true); }}>
              Play again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/** Record keeps the microphone sound, separately from listening. Saved only on this device. */
function RecordBar({ inst, activity }: { inst: Inst; activity: Activity }) {
  useListening();
  const [state, setState] = useState<'idle' | 'recording' | 'review' | 'saved' | 'failed'>('idle');
  const [clip, setClip] = useState<{ blob: Blob; durationSec: number; url: string } | null>(null);
  const [title, setTitle] = useState('');
  const limit = useRef(0);
  useEffect(
    () => () => {
      window.clearTimeout(limit.current);
      if (mic.recording) void mic.stopRecording();
    },
    [],
  );
  useEffect(
    () => () => {
      if (clip) URL.revokeObjectURL(clip.url);
    },
    [clip],
  );
  if (typeof MediaRecorder === 'undefined') return null;

  const stop = async () => {
    window.clearTimeout(limit.current);
    const r = await mic.stopRecording();
    if (!r || r.blob.size === 0) {
      setState('failed');
      return;
    }
    setClip({ ...r, url: URL.createObjectURL(r.blob) });
    setTitle(`${inst === 'piano' ? 'Piano' : 'Drum'} recording`);
    setState('review');
  };
  const start = () => {
    if (!mic.startRecording()) {
      setState('failed');
      return;
    }
    setState('recording');
    // Recordings stop by themselves after two minutes, to keep the device's storage small.
    limit.current = window.setTimeout(() => void stop(), 120_000);
  };
  const save = async () => {
    if (!clip) return;
    const rec: RecordingRecord = {
      id: newId('rec'),
      title: title.trim() || 'My recording',
      createdAt: Date.now(),
      mime: clip.blob.type || 'audio/webm',
      bytes: await clip.blob.arrayBuffer(),
      size: clip.blob.size,
      durationSec: Math.round(clip.durationSec),
      instrument: inst,
      activityId: `instrument-${activity}`,
      profileId: players.currentId(),
    };
    try {
      await store.put('recordings', rec);
      setState('saved');
      setClip(null);
    } catch {
      setState('failed');
    }
  };

  return (
    <div className="record-bar">
      {state === 'idle' && (
        <button type="button" className="btn-quiet rec-btn" onClick={start}>
          <span className="rec-dot" aria-hidden="true" /> Record
        </button>
      )}
      {state === 'recording' && (
        <p className="recording-now" role="status">
          <span className="rec-dot is-on" aria-hidden="true" /> Recording. The sound is being kept.
          <button type="button" className="btn" onClick={() => void stop()}>
            <Icon name="stop" size={20} /> Stop recording
          </button>
        </p>
      )}
      {state === 'review' && clip && (
        <form
          className="rec-review"
          onSubmit={(e) => {
            e.preventDefault();
            void save();
          }}
        >
          <audio controls src={clip.url} />
          <label className="field">
            <span>Name</span>
            <input value={title} maxLength={40} onChange={(e) => setTitle(e.target.value)} />
          </label>
          <p className="note-text">
            {store.isPersistent
              ? `Kept only in this browser on this device (${Math.max(1, Math.round(clip.blob.size / 1024))} KB). You can delete it in My music.`
              : `Saving on this device is off, so it is kept only until Carmen closes (${Math.max(1, Math.round(clip.blob.size / 1024))} KB).`}
          </p>
          <div className="row wrap">
            <button type="submit" className="btn">
              <Icon name="saved" size={20} /> Save
            </button>
            <button type="button" className="btn-quiet" onClick={() => { setClip(null); setState('idle'); }}>
              <Icon name="trash" size={20} /> Delete it
            </button>
          </div>
        </form>
      )}
      {state === 'saved' && (
        <p className="note-text" role="status">
          {store.isPersistent ? 'Saved in My music, on this device.' : 'In My music until Carmen closes.'}{' '}
          <button type="button" className="link-btn" onClick={() => setState('idle')}>
            Record another
          </button>
        </p>
      )}
      {state === 'failed' && (
        <p className="trouble" role="alert">
          The recording couldn’t be kept.{' '}
          <button type="button" className="link-btn" onClick={() => setState('idle')}>
            Try again
          </button>
        </p>
      )}
    </div>
  );
}
