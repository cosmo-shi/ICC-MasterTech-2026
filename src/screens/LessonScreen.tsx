import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { audio } from '../audio/engine.ts';
import { type CoachDecision, decide } from '../ai/coach.ts';
import { lessonById, pathwayById, LESSONS } from '../data/catalog.ts';
import { checkAttempt, type CheckResult } from '../engine/checker.ts';
import { Recorder } from '../music/capture.ts';
import { type DrumSound, type Phrase, soundingEvents, TPQ } from '../music/events.ts';
import { usePrefs } from '../state/prefs.tsx';
import { type AttemptRecord, newId, stamp, store } from '../store/db.ts';
import { CoachCard } from '../ui/CoachCard.tsx';
import { BeatDots, FactList, LiveStatus, Pill, factMark } from '../ui/common.tsx';
import { MoreDetail } from '../ui/MoreDetail.tsx';
import { Notation, describePhrase } from '../ui/Notation.tsx';
import { usePlayer } from '../ui/usePlayer.ts';
import { type LiveEvent, Workspace } from '../ui/Workspace.tsx';
import { FreeLesson } from './FreeLesson.tsx';

type Phase = 'ready' | 'countin' | 'playing' | 'review';
type Mode = 'practice' | 'independent';

interface Props {
  lessonId: string;
  go: (route: string) => void;
}

export function LessonScreen({ lessonId, go }: Props) {
  const lesson = lessonById(lessonId);
  if (!lesson) return (
      <div className="panel" role="alert">
        <p>That activity was not found. It may have been renamed.</p>
        <button type="button" className="btn" onClick={() => go('#/learn')}>
          See all activities
        </button>
      </div>
    );
  if (lesson.assessment.mode === 'free-exploration' || lesson.assessment.mode === 'creative-completion') return <FreeLesson lesson={lesson} go={go} />;
  return <AssessedLesson key={lessonId} lessonId={lessonId} go={go} />;
}

function AssessedLesson({ lessonId, go }: Props) {
  const lesson = lessonById(lessonId)!;
  const { prefs } = usePrefs();
  const pathway = pathwayById(prefs.pathway);
  const [mode, setMode] = useState<Mode>('practice');
  const [phase, setPhase] = useState<Phase>('ready');
  const [slower, setSlower] = useState(false);
  const [hintLevel, setHintLevel] = useState(0);
  const [heardExample, setHeardExample] = useState(false);
  const [result, setResult] = useState<CheckResult | null>(null);
  const [decision, setDecision] = useState<CoachDecision | null>(null);
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved' | 'failed'>('idle');
  const [showNotation, setShowNotation] = useState(pathway ? pathway.showNotationByDefault || lesson.showStave : true);
  const [liveCount, setLiveCount] = useState(0);
  const recorder = useRef<Recorder | null>(null);
  const attemptId = useRef<string>('');
  const player = usePlayer();
  const listen = usePlayer();

  const target: Phrase = (mode === 'practice' ? lesson.practice : lesson.independent)!;
  const tempo = Math.round(lesson.tempoBpm * (slower ? 0.8 : 1));
  const timed = lesson.assessment.checkTiming;
  const expected = soundingEvents(target);
  const totalBeats = target.totalTicks / TPQ;

  // Hint level 2+ in practice shows the target keys/pads. Never in an independent check.
  const showTargets = mode === 'practice' && hintLevel >= 2;
  const highlightNotes = useMemo(() => new Set(showTargets ? expected.filter((e) => e.kind === 'note').map((e) => (e as { midi: number }).midi) : []), [showTargets, expected]);
  const highlightPads = useMemo(() => new Set<DrumSound>(showTargets ? expected.filter((e) => e.kind === 'drum').map((e) => (e as { sound: DrumSound }).sound) : []), [showTargets, expected]);

  const finish = useCallback(() => {
    const rec = recorder.current;
    if (!rec) return;
    recorder.current = null;
    rec.closeAll((totalBeats + 1) * (60000 / tempo));
    const res = checkAttempt(target, rec.inputs, lesson.assessment, tempo);
    const d = decide({ target, inputs: rec.inputs, result: res, aiEnabled: prefs.aiEnabled, independentCheck: mode === 'independent', tempoBpm: tempo });
    setResult(res);
    setDecision(d);
    setPhase('review');
    const id = newId('att');
    attemptId.current = id;
    const record: AttemptRecord = {
      id,
      createdAt: stamp(),
      activityId: lesson.id,
      activityVersion: lesson.version,
      kind: mode,
      instrument: target.instrument,
      tempoBpm: tempo,
      support: { hintLevel: mode === 'independent' ? 0 : hintLevel, heardExample, largeControls: prefs.large, simplified: prefs.simplified, aiEnabled: prefs.aiEnabled, slower },
      inputs: rec.inputs,
      summary: res.summary,
      passed: res.passed,
      checkerVersion: res.checkerVersion,
      coach: {
        focus: d.focus,
        label: d.label,
        patternSource: d.patternSource,
        pattern: d.pattern,
        modelId: d.model?.modelId,
        modelVersion: d.model?.modelVersion,
        modelStatus: d.model?.status,
        confidence: d.model?.confidence,
        latencyMs: d.model?.latencyMs,
        replyPlanId: d.reply?.plan.planId,
        replyOp: d.reply?.plan.params.op,
        verified: d.reply?.verification.verified,
        rejected: d.replyRejected,
      },
    };
    setSaveState('saving');
    store.put('attempts', record).then(
      () => setSaveState('saved'),
      () => setSaveState('failed'),
    );
  }, [target, lesson, tempo, prefs, mode, hintLevel, heardExample, slower, totalBeats]);

  const start = async () => {
    listen.stop();
    setResult(null);
    setDecision(null);
    setLiveCount(0);
    setSaveState('idle');
    if (!audio.running) await audio.start();
    if (timed) {
      setPhase('countin');
      await player.play([], tempo, {
        countInBeats: 4,
        click: true,
        totalTicks: target.totalTicks,
        tailBeats: 0.75,
        onBeat0: (pb) => {
          recorder.current = new Recorder(pb.beat0PerfMs);
          window.setTimeout(() => setPhase((p) => (p === 'countin' ? 'playing' : p)), Math.max(0, pb.beat0PerfMs - performance.now()));
        },
        onEnd: finish,
      });
    } else {
      recorder.current = new Recorder(performance.now());
      setPhase('playing');
    }
  };

  const onEvent = useCallback(
    (e: LiveEvent) => {
      const rec = recorder.current;
      if (!rec) return;
      const inp = rec.handle(e);
      if (inp) {
        setLiveCount((c) => {
          const n = c + 1;
          // Untimed pitch tasks finish after the expected number of notes (with a short pause for release).
          if (!timed && n >= expected.length) window.setTimeout(finish, 450);
          return n;
        });
      }
    },
    [timed, expected.length, finish],
  );

  useEffect(() => {
    // Leaving or switching mode cancels any capture so nothing is graded silently.
    return () => {
      recorder.current = null;
    };
  }, [mode]);

  const reflect = (id: string | null) => {
    if (!attemptId.current) return;
    store.all<AttemptRecord>('attempts').then((rows) => {
      const r = rows.find((x) => x.id === attemptId.current);
      if (r) void store.put('attempts', { ...r, reflection: id ?? 'skipped' });
    });
  };

  const recordChoice = (choice: string) => {
    store.all<AttemptRecord>('attempts').then((rows) => {
      const r = rows.find((x) => x.id === attemptId.current);
      if (r && r.coach) void store.put('attempts', { ...r, coach: { ...r.coach, learnerChoice: choice } });
    });
  };

  const hearExample = async () => {
    setHeardExample(true);
    await listen.play([{ events: target.events }], tempo, { totalTicks: target.totalTicks, countInBeats: timed ? 4 : 0, click: timed });
  };

  const marks = result ? result.facts.map(factMark) : undefined;
  const activeIndex = phase === 'playing' && !timed ? liveCount : undefined;
  const beatNow = player.beat ?? listen.beat;
  const ix = LESSONS.findIndex((l) => l.id === lesson.id);
  const nextInPath = pathway?.recommended.find((id) => id !== lesson.id && LESSONS.findIndex((l) => l.id === id) > ix) ?? LESSONS[ix + 1]?.id;

  const hints = lesson.hints;
  const goIndependent = () => {
    recordChoice('independent-check');
    setMode('independent');
    setPhase('ready');
    setResult(null);
    setDecision(null);
    setHintLevel(0);
    setHeardExample(false);
  };

  return (
    <div className="screen lesson">
      <nav className="crumbs" aria-label="Breadcrumb">
        <button type="button" className="link" onClick={() => go('#/learn')}>
          ← All activities
        </button>
      </nav>
      <header className="lesson-head">
        <div>
          <p className="eyebrow">
            {lesson.goal} · {mode === 'practice' ? 'Practice' : 'On my own'}
          </p>
          <h1 className="h1">{lesson.title}</h1>
          <p className="lede">{lesson.objective}</p>
        </div>
        <div className="mode-switch" role="group" aria-label="Activity mode">
          <button type="button" className={`seg${mode === 'practice' ? ' is-on' : ''}`} aria-pressed={mode === 'practice'} onClick={() => { setMode('practice'); setPhase('ready'); setResult(null); setDecision(null); }}>
            Practice
          </button>
          <button type="button" className={`seg${mode === 'independent' ? ' is-on' : ''}`} aria-pressed={mode === 'independent'} onClick={goIndependent}>
            On my own
          </button>
        </div>
      </header>

      <div className="lesson-grid">
        <section className="panel task" aria-labelledby="task-h">
          <h2 id="task-h" className="h3">
            {mode === 'practice' ? lesson.instruction : 'A new pattern. No hints this time — you can stop whenever you like.'}
          </h2>
          {mode === 'practice' && (
            <>
              <p>{lesson.explanation}</p>
              <MoreDetail lessonId={lesson.id} />
            </>
          )}

          {showNotation ? (
            <Notation phrase={target} marks={marks} activeIndex={activeIndex} />
          ) : (
            <p className="note-text">Music: {describePhrase(target)}</p>
          )}
          <div className="row wrap">
            <button type="button" className="btn-quiet" onClick={() => setShowNotation((s) => !s)}>
              {showNotation ? 'Hide the music picture' : 'Show the music picture'}
            </button>
          </div>

          {timed && <BeatDots beats={phase === 'countin' ? 4 : totalBeats} current={phase === 'countin' ? 4 + (beatNow ?? -4) : beatNow ?? -1} countIn={phase === 'countin'} />}

          <div className="row wrap action-row">
            {phase !== 'countin' && phase !== 'playing' && (
              <>
                <button type="button" className="btn-quiet" onClick={() => (listen.playing ? listen.stop() : void hearExample())}>
                  {listen.playing ? 'Stop' : <><span aria-hidden="true">▶ </span>Listen first</>}
                </button>
                <button type="button" className="btn btn-big" onClick={start}>
                  {result ? 'Try again' : timed ? 'Start (4 clicks, then play)' : 'Start'}
                </button>
              </>
            )}
            {phase === 'countin' && <p className="status-big" role="status">Get ready… listen to the clicks</p>}
            {phase === 'playing' && (
              <>
                <p className="status-big" role="status">
                  {timed ? 'Play now' : `Play the notes (${liveCount} of ${expected.length})`}
                </p>
                <button type="button" className="btn-quiet" onClick={() => { player.stop(); finish(); }}>
                  I'm done
                </button>
                <button type="button" className="btn-quiet" onClick={() => { player.stop(); recorder.current = null; setPhase('ready'); }}>
                  Stop without checking
                </button>
              </>
            )}
          </div>
          <label className="check">
            <input type="checkbox" checked={slower} onChange={(e) => setSlower(e.target.checked)} disabled={phase === 'countin' || phase === 'playing'} />
            Slower ({Math.round(lesson.tempoBpm * 0.8)} beats a minute instead of {lesson.tempoBpm})
          </label>

          {mode === 'practice' && (
            <div className="hints" aria-live="polite">
              {hintLevel === 0 ? (
                <button type="button" className="btn-quiet" onClick={() => setHintLevel(1)}>
                  I'd like a hint
                </button>
              ) : (
                <ol className="hint-list">
                  {hints.slice(0, hintLevel).map((h) => (
                    <li key={h.level} className={`hint hint-${h.level}`}>
                      <span className="hint-kind">{h.level === 'question' ? 'Think' : h.level === 'clue' ? 'Clue' : 'Answer'}</span> {h.text}
                    </li>
                  ))}
                  {hintLevel < 3 && (
                    <li>
                      <button type="button" className="btn-quiet small" onClick={() => setHintLevel((h) => h + 1)}>
                        {hintLevel === 1 ? 'Another clue' : 'Show me the answer'}
                      </button>
                    </li>
                  )}
                  {hintLevel >= 3 && (
                    <li>
                      <button type="button" className="btn-quiet small" onClick={hearExample}>
                        <span aria-hidden="true">▶ </span>Hear it, with the keys lit up
                      </button>
                    </li>
                  )}
                </ol>
              )}
              {hintLevel >= 2 && <p className="note-text">The {target.instrument === 'keyboard' ? 'keys' : 'pads'} you need are lit up.</p>}
            </div>
          )}
        </section>

        <div className="instrument-col">
          <Workspace instrument={target.instrument} onEvent={onEvent} highlightNotes={highlightNotes} highlightPads={highlightPads} />
        </div>

        {phase === 'review' && result && decision && (
          <section className="panel review" aria-labelledby="review-h">
            <h2 id="review-h" className="h2">
              {result.passed ? (mode === 'independent' ? 'You did it on your own' : 'That matched') : 'Here is what happened'}
            </h2>
            <p className="pill-row">
              <Pill tone={mode === 'independent' ? 'lilac' : 'paper'}>{mode === 'independent' ? 'On my own — no hints' : hintLevel ? `Practice with ${hintLevel === 3 ? 'the answer' : 'hints'}` : 'Practice'}</Pill>
              {slower && <Pill>Slower tempo</Pill>}
              <Pill tone={saveState === 'failed' ? 'coral' : 'paper'}>
                {saveState === 'saving' ? 'Saving…' : saveState === 'saved' ? (store.isPersistent ? 'Saved on this device' : 'Kept until you close this page') : saveState === 'failed' ? 'Could not save' : ''}
              </Pill>
            </p>
            <FactList result={result} />
            <LiveStatus text={`${result.summary.correctSound} of ${result.summary.expected} sounds matched.`} />
            <CoachCard decision={decision} onChoice={recordChoice} onReflect={mode === 'practice' ? reflect : undefined} />
            <div className="next">
              <h3 className="h3">What next? You choose.</h3>
              <div className="row wrap">
                <button type="button" className="btn" onClick={() => { recordChoice('retry'); void start(); }}>
                  Try again
                </button>
                {!slower && (
                  <button type="button" className="btn-quiet" onClick={() => { recordChoice('slower'); setSlower(true); setPhase('ready'); }}>
                    Try it slower
                  </button>
                )}
                {mode === 'practice' && (
                  <button type="button" className="btn-quiet" onClick={goIndependent}>
                    Try a new one on my own
                  </button>
                )}
                {nextInPath && (
                  <button type="button" className="btn-quiet" onClick={() => { recordChoice(`next:${nextInPath}`); go(`#/lesson/${nextInPath}`); }}>
                    Next: {lessonById(nextInPath)?.title}
                  </button>
                )}
                <button type="button" className="btn-quiet" onClick={() => go('#/play')}>
                  Just play
                </button>
              </div>
              {result.passed && mode === 'practice' && <p className="note-text">Suggestion: try a new pattern on your own. It shows what you can do without help. You can say no.</p>}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
