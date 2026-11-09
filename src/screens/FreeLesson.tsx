import { useCallback, useRef, useState } from 'react';
import { Icon } from '../ui/icons.tsx';
import { audio } from '../audio/engine.ts';
import type { Lesson } from '../music/lessons.ts';
import { usePrefs } from '../state/prefs.tsx';
import { type AttemptRecord, newId, stamp, store } from '../store/db.ts';
import { type LiveEvent, Workspace } from '../ui/Workspace.tsx';
import { Recorder } from '../music/capture.ts';
import { CreatePanel } from './CreatePanel.tsx';
import { LessonShell } from './LessonShell.tsx';
import { Stars } from './LearnScreen.tsx';

/** L00 (explore, no score) and L09 (make a musical answer: completion = a saved creation). */
export function FreeLesson({ lesson, go }: { lesson: Lesson; go: (r: string) => void }) {
  const { prefs, set } = usePrefs();
  const [instrument, setInstrument] = useState(prefs.instrument);
  const [sounds, setSounds] = useState(0);
  const [done, setDone] = useState(false);
  const [recorder] = useState(() => new Recorder(performance.now()));
  const rec = useRef(recorder);
  const isCreate = lesson.assessment.mode === 'creative-completion';
  const [hint, setHint] = useState(0);

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

  const instrumentPick = (
    <div className="seg-row" role="group" aria-label="Instrument">
      {(['keyboard', 'drums'] as const).map((i) => (
        <button key={i} type="button" className={`seg${instrument === i ? ' is-on' : ''}`} aria-pressed={instrument === i} onClick={() => { setInstrument(i); set('instrument', i); }}>
          <Icon name={i === 'keyboard' ? 'piano' : 'drum'} size={18} /> {i === 'keyboard' ? 'Keyboard' : 'Drums'}
        </button>
      ))}
    </div>
  );
  const side =
    hint < lesson.hints.length ? (
      <button type="button" className="icon-btn quiet" aria-label={hint ? 'Another idea' : 'I’d like an idea'} onClick={() => setHint((h) => h + 1)}>
        <Icon name="hint" size={24} />
      </button>
    ) : null;

  const foot = done ? (
    <button type="button" className="btn btn-big btn-block" onClick={() => go('#/learn')}>
      Continue
    </button>
  ) : isCreate ? null : (
    <button type="button" className="btn btn-big btn-block" disabled={sounds === 0} onClick={() => { audio.stopAll(); void complete('made and stopped a sound'); }}>
      {sounds === 0 ? 'Play any sound' : 'Stop the sound and finish'}
    </button>
  );

  return (
    <LessonShell step={done ? 5 : sounds > 0 ? 3 : 1} steps={5} stepKey={done ? 'done' : 'play'} onClose={() => go('#/learn')} side={side} foot={foot}>
      {done ? (
        <div className="lp-center">
          <Stars n={3} size={48} />
          <h1 className="lp-title" tabIndex={-1}>{isCreate ? 'Saved in My music' : 'You made a sound and stopped it'}</h1>
          <p className="lp-say">{isCreate ? 'There’s no right or wrong here.' : 'Next on your path: finding the beat.'}</p>
        </div>
      ) : (
        <div className="lp-try">
          <div className="lp-task">
            <p className="kicker">{lesson.goal}</p>
            <h1 className="lp-title small" tabIndex={-1}>{isCreate ? lesson.creationPrompt : lesson.instruction}</h1>
            {hint > 0 && (
              <ol className="hint-list" aria-live="polite">
                {lesson.hints.slice(0, hint).map((h) => (
                  <li key={h.level} className="hint">
                    {h.text}
                  </li>
                ))}
              </ol>
            )}
            {instrumentPick}
            {!isCreate && sounds > 0 && <p className="note-text" role="status">{sounds} {sounds === 1 ? 'sound' : 'sounds'}</p>}
          </div>
          <div className="lp-instrument">
            {isCreate ? <CreatePanel instrument={instrument} activityId={lesson.id} onSaved={() => complete('saved a creation')} /> : <Workspace instrument={instrument} onEvent={onEvent} />}
          </div>
        </div>
      )}
    </LessonShell>
  );
}
