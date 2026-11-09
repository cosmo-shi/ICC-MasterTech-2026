import { useCallback, useRef, useState } from 'react';
import { Icon } from '../ui/icons.tsx';
import { audio } from '../audio/engine.ts';
import type { Lesson } from '../music/lessons.ts';
import { usePrefs } from '../state/prefs.tsx';
import { type AttemptRecord, newId, stamp, store } from '../store/db.ts';
import { type LiveEvent, Workspace } from '../ui/Workspace.tsx';
import { Recorder } from '../music/capture.ts';
import { CreatePanel } from './CreatePanel.tsx';
import { MoreDetail } from '../ui/MoreDetail.tsx';
import { SongFinder } from '../ui/SongFinder.tsx';

/** L00 (explore, no score) and L09 (make a musical answer: completion = a saved creation). */
export function FreeLesson({ lesson, go }: { lesson: Lesson; go: (r: string) => void }) {
  const { prefs, set } = usePrefs();
  const [instrument, setInstrument] = useState(prefs.instrument);
  const [sounds, setSounds] = useState(0);
  const [stopped, setStopped] = useState(false);
  const [done, setDone] = useState(false);
  const [recorder] = useState(() => new Recorder(performance.now()));
  const rec = useRef(recorder);
  const isCreate = lesson.assessment.mode === 'creative-completion';
  const [hint, setHint] = useState(0);
  const [songKeys, setSongKeys] = useState<ReadonlySet<number> | undefined>(undefined);

  const onEvent = useCallback((e: LiveEvent) => {
    rec.current.handle(e);
    if (e.type === 'down') setSounds((n) => n + 1);
  }, []);

  const complete = async (note: string) => {
    const r: AttemptRecord = {
      id: newId('att'),
      createdAt: stamp(),
      activityId: lesson.id,
      activityVersion: lesson.version,
      kind: 'practice',
      instrument,
      tempoBpm: 0,
      support: { hintLevel: hint, heardExample: false, largeControls: prefs.large, simplified: prefs.simplified, aiEnabled: prefs.aiEnabled, slower: false },
      inputs: rec.current.inputs.slice(0, 200),
      passed: true,
      note,
    };
    await store.put('attempts', r);
    setDone(true);
  };

  return (
    <div className="screen lesson">
      <nav className="crumbs" aria-label="Breadcrumb">
        <button type="button" className="link" onClick={() => go('#/learn')}>
          <Icon name="back" size={18} /> Learn
        </button>
      </nav>
      <header className="lesson-head">
        <div>
          <p className="eyebrow">{lesson.goal}</p>
          <h1 className="h1">{lesson.title}</h1>
          <p className="lede">{lesson.instruction}</p>
        </div>
        <div className="mode-switch" role="group" aria-label="Instrument">
          {(['keyboard', 'drums'] as const).map((i) => (
            <button key={i} type="button" className={`seg${instrument === i ? ' is-on' : ''}`} aria-pressed={instrument === i} onClick={() => { setInstrument(i); set('instrument', i); }}>
              {i === 'keyboard' ? 'Keyboard' : 'Drums'}
            </button>
          ))}
        </div>
      </header>
      <div className="lesson-grid">
        <section className="panel task">
          <p>{lesson.explanation}</p>
          <MoreDetail lessonId={lesson.id} />
          {!isCreate && (
            <>
              <p>
                Sounds played: <strong>{sounds}</strong>. {stopped ? 'You stopped the sound.' : 'The Stop button at the top turns every sound off.'}
              </p>
              <div className="row wrap">
                <button type="button" className="btn-quiet" onClick={() => { audio.stopAll(); setStopped(true); }}>
                  Stop all sound
                </button>
                {sounds > 0 && stopped && !done && (
                  <button type="button" className="btn" onClick={() => complete('made and stopped a sound')}>
                    I made a sound and stopped it
                  </button>
                )}
              </div>
              {done && <p className="note-text">Next, you could try “Find the pulse”.</p>}
              {instrument === 'keyboard' && <SongFinder onShowKeys={setSongKeys} />}
            </>
          )}
          {isCreate && (
            <>
              <p>{lesson.creationPrompt}</p>
              <CreatePanel instrument={instrument} activityId={lesson.id} onSaved={() => complete('saved a creation')} />
              {done && <p className="note-text">It’s in My music. There’s no right or wrong here.</p>}
            </>
          )}
          {isCreate && (
          <div className="hints">
            {hint < lesson.hints.length ? (
              <button type="button" className="btn-quiet small" onClick={() => setHint((h) => h + 1)}>
                {hint === 0 ? 'I’d like an idea' : 'Another idea'}
              </button>
            ) : null}
            <ol className="hint-list">
              {lesson.hints.slice(0, hint).map((h) => (
                <li key={h.level} className="hint">
                  {h.text}
                </li>
              ))}
            </ol>
          </div>
          )}
          <div className="row wrap">
            <button type="button" className="btn-quiet" onClick={() => go('#/learn')}>
              Choose another activity
            </button>
          </div>
        </section>
        <div className="instrument-col">{isCreate ? null : <Workspace instrument={instrument} onEvent={onEvent} highlightNotes={songKeys} />}</div>
      </div>
    </div>
  );
}
