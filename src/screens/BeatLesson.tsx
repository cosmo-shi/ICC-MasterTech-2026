// L01 "Steady beat" foundations (video QA PED-02): the pulse first, then one big drum, then the
// three drum sounds one at a time, then listening, and only then copying (slower) and on your own.
// Nothing here is marked: the timed, checked part is the shared lesson flow that follows.
import { useRef, useState } from 'react';
import { audio, type ScheduledPlayback } from '../audio/engine.ts';
import type { DrumSound, MusicEvent } from '../music/events.ts';
import { TPQ } from '../music/events.ts';
import { pulseWords } from '../teach/beat.ts';
import { Icon } from '../ui/icons.tsx';
import { Notation } from '../ui/Notation.tsx';
import { usePlayer } from '../ui/usePlayer.ts';
import { LessonShell } from './LessonShell.tsx';

const TEMPO = 72;
const SOUNDS: { sound: DrumSound; name: string; what: string }[] = [
  { sound: 'kick', name: 'Bass drum', what: 'The low, deep thump. Drummers play it with a foot pedal.' },
  { sound: 'snare', name: 'Snare', what: 'A sharp crack in the middle.' },
  { sound: 'hihat', name: 'Hi-hat', what: 'A short, high tick.' },
];

const drumEv = (id: string, beat: number, sound: DrumSound): MusicEvent => ({ id, kind: 'drum', onset: beat * TPQ, duration: TPQ, sound, velocity: 0.75 });
const restEv = (id: string, beat: number): MusicEvent => ({ id, kind: 'rest', onset: beat * TPQ, duration: TPQ });
const PATTERN = [drumEv('a', 0, 'kick'), drumEv('b', 1, 'snare'), drumEv('c', 2, 'kick'), drumEv('d', 3, 'snare')];
const WITH_REST = [drumEv('a', 0, 'kick'), drumEv('b', 1, 'snare'), drumEv('c', 2, 'kick'), restEv('r', 3)];
const phrase = (events: MusicEvent[], id: string) => ({ id, instrument: 'drums' as const, meter: [4, 4] as [number, number], tempoBpm: TEMPO, totalTicks: 4 * TPQ, events });

type StepId = 'pulse' | 'one' | 'sounds' | 'listen' | 'rest';
const STEPS: StepId[] = ['pulse', 'one', 'sounds', 'listen', 'rest'];

export function BeatLesson({ go, onPractise }: { go: (r: string) => void; onPractise: () => void }) {
  const [i, setI] = useState(0);
  const step = STEPS[i];
  const player = usePlayer();
  const pb = useRef<ScheduledPlayback | null>(null);
  const taps = useRef<number[]>([]);
  const [tapCount, setTapCount] = useState(0);
  const [result, setResult] = useState<string | null>(null);
  const [heard, setHeard] = useState<Set<DrumSound>>(new Set());
  const [lit, setLit] = useState<DrumSound | null>(null);

  const beats = (n: number, events: MusicEvent[] = []) =>
    player.play([{ events }], TEMPO, { totalTicks: n * TPQ, countInBeats: 0, click: true, onBeat0: (p) => (pb.current = p), onEnd: () => step === 'one' && finishTaps() });

  const finishTaps = () => {
    const beatMs = 60000 / TEMPO;
    const b0 = pb.current?.beat0PerfMs ?? 0;
    setResult(pulseWords(taps.current.map((t) => (t - b0) / beatMs)));
  };

  const hit = (sound: DrumSound, t: number) => {
    if (!audio.running) {
      void audio.start();
      return;
    }
    audio.drum(sound, 0.8);
    setLit(sound);
    window.setTimeout(() => setLit((s) => (s === sound ? null : s)), 140);
    if (step === 'one' && player.playing) {
      taps.current.push(t);
      setTapCount(taps.current.length);
    }
    if (step === 'sounds') setHeard((h) => new Set(h).add(sound));
  };

  const next = () => {
    player.stop();
    setResult(null);
    taps.current = [];
    setTapCount(0);
    if (i + 1 < STEPS.length) setI(i + 1);
    else onPractise();
  };

  const beatNow = player.beat;
  const dots = (
    <div className="beats beat-big" aria-hidden="true">
      {[0, 1, 2, 3].map((b) => (
        <span key={b} className={`beat${beatNow !== null && beatNow % 4 === b ? ' is-now' : ''}${step === 'rest' && b === 3 ? ' is-rest' : ''}`}>
          {b + 1}
        </span>
      ))}
    </div>
  );

  let body: React.ReactNode;
  let foot: React.ReactNode = (
    <button type="button" className="btn btn-big btn-block" onClick={next}>
      Continue
    </button>
  );
  if (step === 'pulse') {
    body = (
      <>
        <p className="kicker">Listen</p>
        <h1 className="lp-title" tabIndex={-1}>Feel the beat</h1>
        <p className="lp-say">A steady beat goes on and on, like footsteps. Pat your knees with each click and count 1, 2, 3, 4.</p>
        {dots}
        <button type="button" className="btn-quiet" onClick={() => (player.playing ? player.stop() : void beats(16))} aria-pressed={player.playing}>
          <Icon name={player.playing ? 'stop' : 'click'} size={20} /> {player.playing ? 'Stop the beat' : 'Start the beat'}
        </button>
      </>
    );
  } else if (step === 'one') {
    body = (
      <>
        <p className="kicker">Your turn</p>
        <h1 className="lp-title" tabIndex={-1}>Tap the drum with the beat</h1>
        <p className="lp-say">Press Start, listen for two clicks, then tap the big drum once on every click.</p>
        {dots}
        <button type="button" className={`big-pad${lit === 'kick' ? ' is-down' : ''}`} onPointerDown={(e) => { e.preventDefault(); hit('kick', e.timeStamp); }} onKeyDown={(e) => (e.key === ' ' || e.key === 'Enter') && hit('kick', e.timeStamp)}>
          Bass drum
        </button>
        {player.playing && <p className="lp-say" role="status">Taps: {tapCount}</p>}
        {result && <p className="lp-check is-good" role="status"><Icon name="info" size={24} /> {result}</p>}
      </>
    );
    foot = player.playing ? (
      <button type="button" className="btn-quiet btn-block" onClick={() => { player.stop(); finishTaps(); }}>Stop</button>
    ) : (
      <div className="lp-foot-row">
        <button type="button" className="btn-quiet" onClick={() => { taps.current = []; setTapCount(0); setResult(null); void beats(10); }}>
          {result ? 'Again' : 'Start'}
        </button>
        <button type="button" className="btn btn-big" onClick={next} disabled={!result}>Continue</button>
      </div>
    );
  } else if (step === 'sounds') {
    body = (
      <>
        <p className="kicker">Notice</p>
        <h1 className="lp-title" tabIndex={-1}>Three drum sounds</h1>
        <p className="lp-say">Tap each one and listen. Which is lowest? Which is shortest?</p>
        <div className="sound-row">
          {SOUNDS.map((s) => (
            <button key={s.sound} type="button" className={`sound-pad pad-${s.sound}${lit === s.sound ? ' is-down' : ''}`} onPointerDown={(e) => { e.preventDefault(); hit(s.sound, e.timeStamp); }} onKeyDown={(e) => (e.key === ' ' || e.key === 'Enter') && hit(s.sound, e.timeStamp)}>
              <span className="sound-name">{s.name}</span>
              <span className="sound-what">{s.what}</span>
              {heard.has(s.sound) && <span className="sound-heard"><Icon name="check" size={16} /> Heard</span>}
            </button>
          ))}
        </div>
      </>
    );
    foot = (
      <button type="button" className="btn btn-big btn-block" onClick={next} disabled={heard.size < 3}>
        {heard.size < 3 ? `Tap ${3 - heard.size} more` : 'Continue'}
      </button>
    );
  } else {
    const events = step === 'listen' ? PATTERN : WITH_REST;
    body = (
      <>
        <p className="kicker">{step === 'listen' ? 'Listen' : 'Rests'}</p>
        <h1 className="lp-title" tabIndex={-1}>{step === 'listen' ? 'Bass, snare, bass, snare' : 'A rest keeps the beat going'}</h1>
        <p className="lp-say">
          {step === 'listen'
            ? 'Bass drum on beats 1 and 3, snare on beats 2 and 4. Count along as it plays.'
            : 'Beat 4 is a crotchet rest. Keep counting, but leave that beat silent. The beat doesn’t stop.'}
        </p>
        <Notation phrase={phrase(events, step)} activeIndex={beatNow !== null ? beatNow % 4 : undefined} />
        {dots}
        <button type="button" className="btn-quiet" onClick={() => (player.playing ? player.stop() : void beats(8, [...events, ...events.map((e) => ({ ...e, id: `${e.id}2`, onset: e.onset + 4 * TPQ }))]))} aria-pressed={player.playing}>
          <Icon name={player.playing ? 'stop' : 'ear'} size={20} /> {player.playing ? 'Stop' : 'Hear it'}
        </button>
      </>
    );
    if (step === 'rest')
      foot = (
        <button type="button" className="btn btn-big btn-block" onClick={next}>
          Now copy it, slower
        </button>
      );
  }

  return (
    <LessonShell step={i + 1} steps={STEPS.length + 2} onClose={() => go('#/learn')} stepKey={step} foot={foot}>
      <div className="lp-center beat-lesson">{body}</div>
    </LessonShell>
  );
}
