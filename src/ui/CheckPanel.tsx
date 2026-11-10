import { useMemo, useState } from 'react';
import { type CheckKind, type SupportId, SUPPORTS, isRight, listenCheck, readCheck, suggestFrom } from '../ai/checkin.ts';
import type { SkillId } from '../ai/bkt.ts';
import type { Phrase } from '../music/events.ts';
import { Icon } from './icons.tsx';
import { Notation } from './Notation.tsx';
import { usePlayer } from './usePlayer.ts';

/** Listening or reading check. Both are one question; the answer suggests a support. */
export function CheckPanel({
  kind,
  skill,
  target,
  take,
  tempo,
  seed,
  onAnswer,
}: {
  kind: Exclude<CheckKind, 'play'>;
  skill: SkillId;
  target: Phrase;
  take: Phrase | null;
  tempo: number;
  seed: number;
  onAnswer: (right: boolean) => void;
}) {
  const player = usePlayer();
  const [playing, setPlaying] = useState<string | null>(null);
  const [picked, setPicked] = useState<string[]>([]);
  const [answered, setAnswered] = useState<boolean | null>(null);

  // Listening: the learner's own take and a verified version of it. If there is nothing to
  // change in their take, compare their take with the written music instead.
  const listen = useMemo(() => {
    if (kind !== 'listen' || !take) return null;
    const c = listenCheck(take, target, skill);
    const right = c ? { phrase: c.version.phrase, says: c.version.says } : { phrase: target, says: 'This is the lesson’s music' };
    const ask = c ? c.ask : 'Which one is the lesson’s music?';
    const flip = seed % 2 === 1;
    const opts = [
      { id: 'mine', phrase: take, says: 'Your try, as you played it' },
      { id: 'right', ...right },
    ];
    return { ask, options: flip ? opts.reverse() : opts };
  }, [kind, take, target, skill, seed]);
  const read = useMemo(() => (kind === 'read' ? readCheck(target, skill) : null), [kind, target, skill]);

  const hear = (id: string, p: Phrase) => {
    if (playing === id) {
      player.stop();
      setPlaying(null);
      return;
    }
    setPlaying(id);
    void player.play([{ events: p.events }], tempo, { totalTicks: p.totalTicks, countInBeats: 0, onEnd: () => setPlaying(null) });
  };

  const answer = (right: boolean) => {
    player.stop();
    setPlaying(null);
    setAnswered(right);
    onAnswer(right);
  };

  if (kind === 'listen' && listen)
    return (
      <div className="check-q">
        <h2 className="check-q-title">{listen.ask}</h2>
        <div className="ab">
          {listen.options.map((o, i) => (
            <div key={o.id} className={`ab-opt${answered !== null && o.id === 'right' ? ' is-answer' : ''}`}>
              <button type="button" className="ab-play" onClick={() => hear(o.id, o.phrase)} aria-label={`${playing === o.id ? 'Stop' : 'Play'} version ${i ? 'B' : 'A'}`}>
                <Icon name={playing === o.id ? 'stop' : 'playback'} size={32} />
              </button>
              <span className="ab-name">Version {i ? 'B' : 'A'}</span>
              {answered === null ? (
                <button type="button" className="chip" onClick={() => answer(o.id === 'right')}>
                  This one
                </button>
              ) : (
                <span className="ab-says">{o.says}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    );

  if (kind === 'read' && read)
    return (
      <div className="check-q">
        <h2 className="check-q-title">{read.ask}</h2>
        <div className="lp-music">
          <Notation phrase={target} />
        </div>
        <div className="chips read-opts" role={read.multi ? 'group' : 'radiogroup'} aria-label="Answers">
          {read.options.map((o) => {
            const on = picked.includes(o.id);
            const mark = answered !== null ? (read.answer.includes(o.id) ? ' is-answer' : on ? ' is-wrong' : '') : '';
            return (
              <button
                key={o.id}
                type="button"
                role={read.multi ? 'checkbox' : 'radio'}
                aria-checked={on}
                disabled={answered !== null}
                className={`chip${on ? ' is-on' : ''}${mark}`}
                onClick={() => setPicked((p) => (read.multi ? (on ? p.filter((x) => x !== o.id) : [...p, o.id]) : [o.id]))}
              >
                {o.label}
              </button>
            );
          })}
        </div>
        {answered === null && (
          <button type="button" className="btn" disabled={!picked.length} onClick={() => answer(isRight(read, picked))}>
            Check my answer
          </button>
        )}
      </div>
    );

  return <p className="note-text">This check isn’t available for this music.</p>;
}

/** One response, one suggestion. The learner takes it or turns it down. */
export function CheckResult({ kind, right, onUse, onSkip, others, onOther }: { kind: CheckKind; right: boolean; onUse: (s: SupportId) => void; onSkip: () => void; others: CheckKind[]; onOther: (k: CheckKind) => void }) {
  const s = suggestFrom(kind, right);
  const sup = SUPPORTS[s.support];
  return (
    <div className="check-result">
      <p className="check-result-says">{s.says}</p>
      <div className="suggest-card">
        <p className="kicker">Want to try this?</p>
        <p className="suggest-name">{sup.label}</p>
        <p className="note-text">{sup.does}</p>
        <div className="row wrap">
          <button type="button" className="btn" onClick={() => onUse(s.support)}>
            Use it
          </button>
          <button type="button" className="btn-quiet" onClick={onSkip}>
            No thanks
          </button>
        </div>
      </div>
      {others.length > 0 && (
        <div className="chips">
          <span className="note-text">Another check:</span>
          {others.map((k) => (
            <button key={k} type="button" className="chip" onClick={() => onOther(k)}>
              {k === 'listen' ? 'Listen' : k === 'read' ? 'Read' : 'Play'}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
