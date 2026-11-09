import { useMemo, useState } from 'react';
import { LESSON_INFOS } from '../ai/learner.ts';
import { lessonById } from '../data/catalog.ts';
import { cellsFrom, cellsToPhrase, describeChanges, makeSpec, setCell } from '../music/maker.ts';
import { onTheBeat } from '../music/versions.ts';
import { inputsToPhrase } from '../ai/coach.ts';
import { type AttemptRecord, newId, stamp, store } from '../store/db.ts';
import { Icon } from '../ui/icons.tsx';
import { Notation } from '../ui/Notation.tsx';
import { useMyLearning } from '../ui/useAttempts.ts';
import { usePlayer } from '../ui/usePlayer.ts';
import { LessonShell } from './LessonShell.tsx';

interface Version {
  n: number;
  cells: string[];
  savedId?: string;
}

/** Make your own: the lesson's idea becomes the learner's decisions, one per beat. Every version
 *  they keep is saved separately, so nothing is overwritten, and any two can be compared. */
export function MakeStep({ lessonId, go }: { lessonId: string; go: (r: string) => void }) {
  const lesson = lessonById(lessonId)!;
  const src = (lesson.practice ?? lesson.independent)!;
  const skills = LESSON_INFOS.find((l) => l.id === lessonId)?.skills ?? [];
  const spec = useMemo(() => makeSpec(skills, src), [skills, src]);
  const { attempts } = useMyLearning();

  // Start from the lesson's music, or from the learner's own last try (put on the beat, verified).
  const ownCells = useMemo(() => {
    const last = [...attempts].filter((a: AttemptRecord) => a.activityId === lessonId && a.kind !== 'check' && a.inputs.length).sort((a, b) => b.createdAt - a.createdAt)[0];
    if (!last) return null;
    const take = inputsToPhrase(last.inputs, src, last.tempoBpm);
    return cellsFrom(onTheBeat(take, src).phrase, spec);
  }, [attempts, lessonId, src, spec]);
  const lessonCells = useMemo(() => cellsFrom(src, spec), [src, spec]);

  const [cells, setCells] = useState<string[]>(lessonCells);
  const [from, setFrom] = useState<'lesson' | 'mine'>('lesson');
  const [versions, setVersions] = useState<Version[]>([]);
  const [compare, setCompare] = useState<[number, number] | null>(null);
  const [playing, setPlaying] = useState<string | null>(null);
  const player = usePlayer();
  const phrase = cellsToPhrase(cells, spec, lesson.tempoBpm, 'mine');
  const last = versions[versions.length - 1];
  const changed = last ? describeChanges(last.cells, cells, spec) : describeChanges(from === 'lesson' ? lessonCells : (ownCells ?? lessonCells), cells, spec);

  const play = (key: string, c: string[]) => {
    if (playing === key) {
      player.stop();
      setPlaying(null);
      return;
    }
    const p = cellsToPhrase(c, spec, lesson.tempoBpm, key);
    setPlaying(key);
    void player.play([{ events: p.events }], lesson.tempoBpm, { totalTicks: p.totalTicks, countInBeats: 0, onEnd: () => setPlaying(null) });
  };

  const keep = async () => {
    const n = (last?.n ?? 0) + 1;
    const id = newId('cmp');
    const v: Version = { n, cells: [...cells], savedId: id };
    setVersions((vs) => [...vs, v]);
    await store
      .put('compositions', {
        id,
        title: `My ${lesson.title.toLowerCase()} ${n}`,
        createdAt: stamp(),
        instrument: spec.instrument,
        tempoBpm: lesson.tempoBpm,
        totalTicks: phrase.totalTicks,
        events: phrase.events,
        origin: 'lesson',
        activityId: lessonId,
      })
      .catch(() => undefined);
    if (versions.length >= 1) setCompare([versions[versions.length - 1].n, n]);
  };

  const byN = (n: number) => versions.find((v) => v.n === n)!;

  return (
    <LessonShell step={5} steps={6} stepKey="make" onClose={() => go(`#/lesson/${lessonId}/summary`)}
      foot={
        <div className="lp-foot-row">
          <button type="button" className="btn-quiet" onClick={() => go(`#/lesson/${lessonId}/summary`)}>
            {versions.length ? 'Done' : 'Skip for now'}
          </button>
          <button type="button" className="btn btn-big" onClick={() => void keep()}>
            {versions.length ? 'Keep this version' : 'Keep it'}
          </button>
        </div>
      }
    >
      <div className="make">
        <div className="make-head">
          <p className="kicker">Make your own</p>
          <h1 className="lp-title small" tabIndex={-1}>
            {spec.ask}
          </h1>
          {ownCells && (
            <div className="segmented" role="radiogroup" aria-label="Start from">
              {(['lesson', 'mine'] as const).map((f) => (
                <button key={f} type="button" role="radio" aria-checked={from === f} className="segment" onClick={() => { setFrom(f); setCells(f === 'lesson' ? lessonCells : ownCells); }}>
                  {f === 'lesson' ? 'Start from the lesson' : 'Start from my try'}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="make-score">
          <Notation phrase={phrase} />
        </div>

        <ol className="make-grid" aria-label="Your beats" style={{ '--beats': spec.beats } as React.CSSProperties}>
          {cells.map((c, i) => (
            <li key={i} className={`make-beat${c === 'held' ? ' is-held' : ''}`}>
              <span className="make-beat-n">Beat {i + 1}</span>
              {c === 'held' ? (
                <span className="make-held">held</span>
              ) : (
                <div className="make-choices" role="radiogroup" aria-label={`Beat ${i + 1}`}>
                  {spec.choices.map((ch) => (
                    <button key={ch.id} type="button" role="radio" aria-checked={c === ch.id} className={`make-choice${c === ch.id ? ' is-on' : ''}${ch.id === 'rest' ? ' is-rest' : ''}`} onClick={() => setCells((cs) => setCell(cs, i, ch.id))}>
                      {ch.label}
                    </button>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ol>

        <div className="compare" role="group" aria-label="Listen">
          <button type="button" className="chip" onClick={() => play('now', cells)}>
            <Icon name={playing === 'now' ? 'stop' : 'playback'} size={18} /> Play mine
          </button>
          <button type="button" className="chip" onClick={() => play('lesson', lessonCells)}>
            <Icon name={playing === 'lesson' ? 'stop' : 'ear'} size={18} /> Play the lesson’s
          </button>
        </div>
        {changed.length > 0 && (
          <p className="make-changed">
            <strong>{last ? `Since version ${last.n}:` : 'Your changes:'}</strong> {changed.join(' · ')}
          </p>
        )}

        {versions.length > 0 && (
          <section className="versions" aria-labelledby="ver-h">
            <h2 id="ver-h" className="h3">
              Your versions <span className="muted">(saved in My music)</span>
            </h2>
            <ul className="version-list">
              {versions.map((v) => (
                <li key={v.n}>
                  <button type="button" className="chip" onClick={() => play(`v${v.n}`, v.cells)}>
                    <Icon name={playing === `v${v.n}` ? 'stop' : 'playback'} size={16} /> Version {v.n}
                  </button>
                  <button type="button" className="btn-text" onClick={() => setCells(v.cells)}>
                    Change this one
                  </button>
                </li>
              ))}
            </ul>
            {compare && (
              <div className="compare-box">
                <p className="kicker">Compare</p>
                <div className="compare">
                  {compare.map((n) => (
                    <button key={n} type="button" className="chip" onClick={() => play(`c${n}`, byN(n).cells)}>
                      <Icon name={playing === `c${n}` ? 'stop' : 'playback'} size={16} /> Version {n}
                    </button>
                  ))}
                </div>
                <p className="note-text">{describeChanges(byN(compare[0]).cells, byN(compare[1]).cells, spec).join(' · ') || 'The same music.'}</p>
                <p className="make-q">Which do you like better, and why?</p>
              </div>
            )}
          </section>
        )}
      </div>
    </LessonShell>
  );
}
