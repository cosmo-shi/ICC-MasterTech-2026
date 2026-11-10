import { useMemo, useRef, useState } from 'react';
import { audio } from '../audio/engine.ts';
import { type Phrase, TPQ } from '../music/events.ts';
import { isBlackKey, midiToLetter } from '../music/theory.ts';
import { Icon } from './icons.tsx';
import { Notation } from './Notation.tsx';

/** Plays one note for a moment. Returns false if sound isn't on yet (the press turns it on). */
export function playOne(midi: number, ms = 700): boolean {
  if (!audio.running) {
    void audio.start();
    return false;
  }
  if (!audio.noteOn(midi, 0.75)) return false;
  window.setTimeout(() => audio.noteOff(midi), ms);
  return true;
}

/** A small, real keyboard (white and black keys in their true places) for a range of notes. */
export function MiniKeys({ from, to, marks, onKey, label }: { from: number; to: number; marks: Record<number, { tone: 'good' | 'miss' | 'now'; word: string }>; onKey?: (midi: number) => void; label: string }) {
  const whites: number[] = [];
  for (let m = from; m <= to; m++) if (!isBlackKey(m)) whites.push(m);
  const w = 100 / whites.length;
  const blacks: { m: number; left: number }[] = [];
  whites.forEach((m, i) => {
    if (m + 1 <= to && isBlackKey(m + 1)) blacks.push({ m: m + 1, left: (i + 1) * w });
  });
  const key = (m: number, cls: string, style: React.CSSProperties) => {
    const mark = marks[m];
    const name = midiToLetter(m);
    return (
      <button
        key={m}
        type="button"
        className={`mk ${cls}${mark ? ` mk-${mark.tone}` : ''}`}
        style={style}
        onClick={() => onKey?.(m)}
        aria-label={`${name}${m === 60 ? ' (middle C)' : ''}${mark ? `, ${mark.word}` : ''}`}
        tabIndex={onKey ? 0 : -1}
      >
        {mark && <span className="mk-word">{mark.word}</span>}
        {cls === 'mk-w' && <span className="mk-name">{name}</span>}
      </button>
    );
  };
  return (
    <div className="minikeys" role="group" aria-label={label}>
      {whites.map((m, i) => key(m, 'mk-w', { left: `${i * w}%`, width: `${w}%` }))}
      {blacks.map(({ m, left }) => key(m, 'mk-b', { left: `calc(${left}% - ${w * 0.3}%)`, width: `${w * 0.6}%` }))}
    </div>
  );
}

/**
 * The wrong-note comparison: the note the music asked for and the note that was played, each one
 * audible, on the keys and on the stave, side by side (video QA PED-01).
 */
export function NotePair({ expected, played }: { expected: number; played: number }) {
  const [last, setLast] = useState<'music' | 'yours' | null>(null);
  const t = useRef(0);
  const lo = Math.min(expected, played);
  const hi = Math.max(expected, played);
  const from = lo - (((lo % 12) + 12) % 12); // the C at or below
  const to = Math.max(from + 11, hi + (isBlackKey(hi + 1) ? 1 : 0));
  const exp = midiToLetter(expected);
  const got = midiToLetter(played);
  const phrase: Phrase = useMemo(
    () => ({
      id: 'pair',
      instrument: 'keyboard',
      meter: [2, 4],
      totalTicks: TPQ * 2,
      tempoBpm: 80,
      events: [
        { id: 'm', kind: 'note', onset: 0, duration: TPQ, midi: expected, velocity: 0.7 },
        { id: 'y', kind: 'note', onset: TPQ, duration: TPQ, midi: played, velocity: 0.7 },
      ],
    }),
    [expected, played],
  );
  const hear = (which: 'music' | 'yours') => {
    window.clearTimeout(t.current);
    setLast(which);
    playOne(which === 'music' ? expected : played);
    t.current = window.setTimeout(() => setLast(null), 700);
  };
  return (
    <div className="note-pair">
      <div className="np-buttons">
        <button type="button" className="btn-quiet np-btn np-good" onClick={() => hear('music')} aria-pressed={last === 'music'}>
          <Icon name="ear" size={20} /> Hear {exp}
          <span className="np-sub">the music</span>
        </button>
        <button type="button" className="btn-quiet np-btn np-miss" onClick={() => hear('yours')} aria-pressed={last === 'yours'}>
          <Icon name="ear" size={20} /> Hear {got}
          <span className="np-sub">what you played</span>
        </button>
      </div>
      <MiniKeys
        from={from}
        to={to}
        label={`${exp}, the note the music asked for, and ${got}, the note you played`}
        marks={{ [expected]: { tone: 'good', word: 'Music' }, [played]: { tone: 'miss', word: 'You' } }}
        onKey={(m) => playOne(m)}
      />
      <Notation phrase={phrase} marks={[null, 'wrong']} />
      <p className="np-caption">
        On the stave: {exp} first, then {got}, {expected === played ? 'the same' : expected > played ? `lower` : `higher`}.
      </p>
    </div>
  );
}
