import { useCallback, useMemo, useRef, useState } from 'react';
import { audio } from '../audio/engine.ts';
import { runModel, type ModelResult } from '../ai/model.ts';
import { compileReply, type ReplyParams, type ReplyPlan, type ReplyRender, type Verification, verifyReply } from '../ai/reply.ts';
import { rulesPattern } from '../ai/rules.ts';
import type { Pattern } from '../ai/features.ts';
import coachText from '../data/coach.json';
import { blurb, missionById, PATHWAYS } from '../data/catalog.ts';
import { Icon } from '../ui/icons.tsx';
import { Recorder, clipAt, gridEvidence, quantise } from '../music/capture.ts';
import { freshTask, type IndependentTask } from '../music/fresh.ts';
import { type InstrumentId, type Phrase, TPQ, isSounding } from '../music/events.ts';
import { midiToLetter } from '../music/theory.ts';
import { usePrefs } from '../state/prefs.tsx';
import { type AttemptRecord, type CompositionRecord, newId, stamp, store } from '../store/db.ts';
import { BeatDots, Pill } from '../ui/common.tsx';
import { Notation } from '../ui/Notation.tsx';
import { usePlayer } from '../ui/usePlayer.ts';
import { type LiveEvent, Workspace } from '../ui/Workspace.tsx';

type Step = 1 | 2 | 3 | 4;

interface Analysis {
  source: 'local-model' | 'rules';
  pattern: Pattern | 'insufficient';
  model?: ModelResult;
}

interface Prediction {
  question: string;
  options: { id: string; label: string }[];
  /** Which option the verified change makes true. */
  truth: (v: Verification) => string;
}

function predictionFor(op: ReplyParams['op']): Prediction {
  switch (op) {
    case 'dynamics':
      return { question: 'What do you think will change?', options: [{ id: 'notes', label: 'The notes' }, { id: 'loud', label: 'How loud it is' }, { id: 'rhythm', label: 'The rhythm' }], truth: () => 'loud' };
    case 'replace_with_rest':
      return { question: 'Will the pattern get shorter, or keep its length?', options: [{ id: 'shorter', label: 'Get shorter' }, { id: 'same', label: 'Keep its length' }], truth: () => 'same' };
    case 'transpose':
      return { question: 'Will the rhythm change?', options: [{ id: 'yes', label: 'Yes' }, { id: 'no', label: 'No, only the pitch' }], truth: () => 'no' };
    case 'section_order':
      return { question: 'Will any notes inside A or B change?', options: [{ id: 'yes', label: 'Yes' }, { id: 'no', label: 'No, only the order' }], truth: () => 'no' };
    default:
      return { question: 'Will your part change?', options: [{ id: 'yes', label: 'Yes' }, { id: 'no', label: 'No, a new part is added' }], truth: () => 'no' };
  }
}

const PHRASE_BEATS: Record<string, number> = { F_SOUND_STORY: 4, P12_RHYTHMIC_CONVERSATION: 4, P34_MELODIC_REPLY: 4, P56_FORM_AND_TEXTURE: 8, OLDER_EXTENSION: 8 };

export function MissionScreen({ missionId, go }: { missionId: string; go: (r: string) => void }) {
  const mission = missionById(missionId);
  const { prefs } = usePrefs();
  const pathway = PATHWAYS.find((p) => p.missionId === missionId);
  const [step, setStep] = useState<Step>(1);
  const [instrument, setInstrument] = useState<InstrumentId>(mission?.instruments[0] ?? 'keyboard');
  const [recState, setRecState] = useState<'idle' | 'countin' | 'recording' | 'done'>('idle');
  const [phrase, setPhrase] = useState<Phrase | null>(null);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [params, setParams] = useState<ReplyParams | null>(null);
  const [paramsBy, setParamsBy] = useState<'learner' | 'partner-model' | 'partner-rules'>('learner');
  const [prediction, setPrediction] = useState<string | null>(null);
  const [reply, setReply] = useState<{ plan: ReplyPlan; render: ReplyRender; verification: Verification } | null>(null);
  const [kept, setKept] = useState<'partner' | 'mine' | null>(null);
  const [reason, setReason] = useState<string | null>(null);
  const [task, setTask] = useState<IndependentTask | null>(null);
  const [answer, setAnswer] = useState<string | null>(null);
  const [rawInputs, setRawInputs] = useState<AttemptRecord['inputs']>([]);
  const rec = useRef<Recorder | null>(null);
  const player = usePlayer();
  const clips = usePlayer();
  const op = mission?.operation ?? 'echo';
  const beats = PHRASE_BEATS[missionId] ?? 4;
  const tempo = pathway?.defaultTempo ?? 90;
  const fewWords = pathway?.words === 'few';
  const pred = useMemo(() => predictionFor(op), [op]);

  const finishRecording = useCallback(() => {
    const r = rec.current;
    rec.current = null;
    if (!r) return;
    r.closeAll(beats * (60000 / tempo));
    let p = quantise(r.inputs, tempo, beats * TPQ, TPQ / 2, instrument);
    if (op === 'section_order') p = clipAt(p, (beats / 2) * TPQ);
    setRawInputs(r.inputs);
    setPhrase(p);
    setRecState('done');
    // Timing description of the live playing against the click.
    const ev = gridEvidence(r.inputs, tempo);
    let a: Analysis = { source: 'rules', pattern: rulesPattern(ev) };
    if (prefs.aiEnabled) {
      const m = runModel(ev);
      if (m.status === 'ok' && m.pattern) a = { source: 'local-model', pattern: m.pattern, model: m };
      else a = { ...a, model: m };
    }
    setAnalysis(a);
  }, [beats, tempo, instrument, op, prefs.aiEnabled]);

  const record = async () => {
    if (!audio.running) await audio.start();
    setPhrase(null);
    setReply(null);
    setParams(null);
    setKept(null);
    setRecState('countin');
    await player.play([], tempo, {
      countInBeats: 4,
      click: true,
      totalTicks: beats * TPQ,
      tailBeats: 0.5,
      onBeat0: (pb) => {
        rec.current = new Recorder(pb.beat0PerfMs);
        window.setTimeout(() => setRecState((s) => (s === 'countin' ? 'recording' : s)), Math.max(0, pb.beat0PerfMs - performance.now()));
      },
      onEnd: finishRecording,
    });
  };

  const onEvent = useCallback((e: LiveEvent) => {
    rec.current?.handle(e);
  }, []);

  if (!mission) return (
      <div className="panel" role="alert">
        <p>That project was not found. It may have been renamed.</p>
        <button type="button" className="btn" onClick={() => go('#/learn')}>
          See all activities
        </button>
      </div>
    );

  const soundingInPhrase = phrase?.events.filter(isSounding) ?? [];
  const hasNotes = soundingInPhrase.some((e) => e.kind === 'note');
  const sectionsOk = op !== 'section_order' || (phrase && phrase.events.some((e) => e.onset < (beats / 2) * TPQ) && phrase.events.some((e) => e.onset >= (beats / 2) * TPQ));

  /** Partner proposal: in F and Older, the on-device timing result shapes the suggestion. */
  const partnerChooses = () => {
    const unsteady = analysis && analysis.pattern !== 'steady' && analysis.pattern !== 'insufficient';
    const by = analysis?.source === 'local-model' ? 'partner-model' : 'partner-rules';
    if (op === 'add_part') {
      setParams({ op: 'add_part', part: unsteady ? 'pulse' : hasNotes ? 'drone' : 'backbeat', tempoScale: 1 });
      setParamsBy(by);
    } else if (op === 'dynamics') {
      const avg = soundingInPhrase.reduce((s, e) => s + e.velocity, 0) / Math.max(1, soundingInPhrase.length);
      setParams({ op: 'dynamics', direction: avg >= 0.5 ? 'softer' : 'louder' });
      setParamsBy('partner-rules');
    } else if (op === 'section_order') {
      setParams({ op: 'section_order', splitTick: (beats / 2) * TPQ });
      setParamsBy('partner-rules');
    }
  };

  const makeReply = () => {
    if (!phrase || !params) return;
    const plan: ReplyPlan = {
      planId: `${mission.id}:${params.op}`,
      params,
      source: 'learner',
      provenance: paramsBy === 'partner-model' ? 'local-model' : paramsBy === 'partner-rules' ? 'rules' : 'learner-directed',
      evidenceFactIds: [],
      templateId: 'notice-one-change',
    };
    const render = compileReply(plan, phrase);
    const verification = verifyReply(plan, phrase, render);
    setReply({ plan, render, verification });
    setStep(3);
  };

  const keep = async (which: 'partner' | 'mine') => {
    if (!phrase || !reply) return;
    setKept(which);
    const events = which === 'partner' ? reply.render.tracks.flatMap((t) => t.events) : phrase.events;
    const c: CompositionRecord = {
      id: newId('mus'),
      title: `${mission.title}${which === 'partner' ? ' (with partner)' : ''}`,
      createdAt: stamp(),
      instrument,
      tempoBpm: tempo,
      totalTicks: phrase.totalTicks,
      events,
      origin: 'mission',
      activityId: mission.id,
      partner: { op: reply.plan.params.op, accepted: which === 'partner', provenance: reply.plan.provenance },
    };
    await store.put('compositions', c);
    const att: AttemptRecord = {
      id: newId('att'),
      createdAt: stamp(),
      activityId: mission.id,
      activityVersion: '2.0.0-draft',
      kind: 'mission',
      instrument,
      tempoBpm: tempo,
      support: { hintLevel: 0, heardExample: true, largeControls: prefs.large, simplified: prefs.simplified, aiEnabled: prefs.aiEnabled, slower: false },
      inputs: rawInputs,
      passed: true,
      coach: {
        focus: 'creation',
        label: analysis?.source === 'local-model' ? 'AI coach' : 'Coach tips',
        patternSource: analysis?.source ?? 'none',
        pattern: analysis?.pattern,
        modelId: analysis?.model?.modelId,
        modelVersion: analysis?.model?.modelVersion,
        modelStatus: analysis?.model?.status,
        confidence: analysis?.model?.confidence,
        latencyMs: analysis?.model?.latencyMs,
        replyPlanId: reply.plan.planId,
        replyOp: reply.plan.params.op,
        verified: reply.verification.verified,
        learnerChoice: `kept-${which}; chosen-by-${paramsBy}; predicted-${prediction ?? 'skipped'}${reason ? `; reason-${reason}` : ''}`,
      },
      note: `Partner change ${paramsBy === 'learner' ? 'directed by the learner' : 'proposed by the partner'}`,
    };
    await store.put('attempts', att);
  };

  const newTask = () => {
    const f = freshTask(op);
    const plan: ReplyPlan = { planId: 'fresh', params: f.params, source: 'learner', provenance: 'rules', evidenceFactIds: [], templateId: 'compare-new-idea' };
    const render = compileReply(plan, f.source);
    const v = verifyReply(plan, f.source, render);
    if (!v.ok) return newTask();
    const changed: Phrase = { ...f.source, tempoBpm: render.tempoBpm, events: render.tracks.flatMap((t) => t.events) };
    let clipsList: IndependentTask['clips'];
    if (f.task.id === 'which-quieter') clipsList = f.task.answer === 'first' ? [{ caption: 'First', phrase: changed }, { caption: 'Second', phrase: f.source }] : [{ caption: 'First', phrase: f.source }, { caption: 'Second', phrase: changed }];
    else if (f.task.id === 'which-order') {
      const A = { ...f.source, totalTicks: 4 * TPQ, events: f.source.events.filter((e) => e.onset < 4 * TPQ) };
      const B = { ...f.source, totalTicks: 4 * TPQ, events: f.source.events.filter((e) => e.onset >= 4 * TPQ).map((e) => ({ ...e, onset: e.onset - 4 * TPQ })) };
      clipsList = [
        { caption: 'This is A', phrase: A },
        { caption: 'This is B', phrase: B },
        { caption: 'Now listen', phrase: f.task.answer === 'BA' ? changed : f.source },
      ];
    } else clipsList = [{ caption: 'First version', phrase: f.source }, { caption: 'Second version', phrase: changed }];
    setTask({ ...f.task, clips: clipsList });
    setAnswer(null);
  };

  const submitAnswer = async (id: string) => {
    if (!task) return;
    setAnswer(id);
    const att: AttemptRecord = {
      id: newId('att'),
      createdAt: stamp(),
      activityId: mission.id,
      activityVersion: '2.0.0-draft',
      kind: 'mission-check',
      instrument,
      tempoBpm: 0,
      support: { hintLevel: 0, heardExample: false, largeControls: prefs.large, simplified: prefs.simplified, aiEnabled: prefs.aiEnabled, slower: false },
      inputs: [],
      passed: id === task.answer,
      note: `${task.question} Answered "${task.options.find((o) => o.id === id)?.label}" (${id === task.answer ? 'matches' : 'does not match'} the music).`,
    };
    await store.put('attempts', att);
  };

  const describeParams = (p: ReplyParams): string => {
    switch (p.op) {
      case 'dynamics':
        return p.direction === 'softer' ? 'Make it quieter' : 'Make it louder';
      case 'transpose':
        return `Move it ${p.semitones > 0 ? 'higher' : 'lower'} by ${Math.abs(p.semitones)} steps`;
      case 'replace_with_rest': {
        const i = soundingInPhrase.findIndex((e) => e.id === p.eventId);
        return `Leave sound ${i + 1} quiet`;
      }
      case 'section_order':
        return 'Play B first, then A';
      case 'add_part':
        return p.part === 'pulse' ? 'Add a steady click' : p.part === 'backbeat' ? 'Add a snare on beats 2 and 4' : 'Add a long low note';
      default:
        return 'Echo';
    }
  };

  const stepButton = (n: Step, label: string, enabled: boolean) => (
    <li>
      <button type="button" className={`stepper-btn${step === n ? ' is-on' : ''}`} aria-current={step === n ? 'step' : undefined} disabled={!enabled} onClick={() => setStep(n)}>
        <span className="stepper-n">{n}</span> {label}
      </button>
    </li>
  );

  return (
    <div className="screen mission">
      <nav className="crumbs" aria-label="Breadcrumb">
        <button type="button" className="link" onClick={() => go('#/learn')}>
          <Icon name="back" size={18} /> Learn
        </button>
      </nav>
      <header className="lesson-head">
        <div>
          <p className="eyebrow">Partner project</p>
          <h1 className="h1">{mission.title}</h1>
          <p className="lede">{fewWords ? mission.steps[0] : blurb(mission.id, mission.objective)}</p>
          {mission.band === 'F' && <p className="note-text">A grown-up can help with the buttons. The music choices are yours.</p>}
        </div>
      </header>
      <ol className="stepper" aria-label="Steps">
        {stepButton(1, 'Make your idea', true)}
        {stepButton(2, 'Choose a change', !!phrase && soundingInPhrase.length > 0)}
        {stepButton(3, 'Hear the partner', !!reply)}
        {stepButton(4, 'On my own', true)}
      </ol>

      {step === 1 && (
        <div className="lesson-grid">
          <section className="panel task">
            <h2 className="h3">
              {op === 'section_order' ? `Play idea A for ${beats / 2} beats, then idea B for ${beats / 2} beats.` : `Play a short idea, ${beats} beats long.`}
            </h2>
            {mission.instruments.length > 1 && (
              <div className="mode-switch" role="group" aria-label="Instrument">
                {mission.instruments.map((i) => (
                  <button key={i} type="button" className={`seg${instrument === i ? ' is-on' : ''}`} aria-pressed={instrument === i} onClick={() => setInstrument(i)} disabled={recState === 'countin' || recState === 'recording'}>
                    {i === 'keyboard' ? 'Keyboard' : 'Drums'}
                  </button>
                ))}
              </div>
            )}
            <BeatDots beats={recState === 'countin' ? 4 : beats} current={recState === 'countin' ? 4 + (player.beat ?? -4) : player.beat ?? -1} countIn={recState === 'countin'} />
            <div className="row wrap">
              {recState !== 'countin' && recState !== 'recording' ? (
                <button type="button" className="btn btn-coral btn-big" onClick={record}>
                  <span aria-hidden="true">● </span>{phrase ? 'Record again' : 'Record (4 clicks first)'}
                </button>
              ) : (
                <p className="status-big" role="status">
                  {recState === 'countin' ? 'Get ready…' : op === 'section_order' && (player.beat ?? 0) >= beats / 2 ? 'Now idea B' : op === 'section_order' ? 'Idea A' : 'Play now'}
                </p>
              )}
            </div>
            {phrase && (
              <>
                {soundingInPhrase.length === 0 ? (
                  <p className="note-text">No sounds were recorded. Try again and play while the clicks go.</p>
                ) : (
                  <>
                    <Notation phrase={phrase} />
                    <p className="note-text">Your timing has been tidied to the nearest half beat for the partner. Your exact playing is kept for your teacher.</p>
                    {analysis && (
                      <div className={`coach ${analysis.source === 'local-model' ? 'coach-ai' : 'coach-tips'} compact`}>
                        <p className="coach-label">{analysis.source === 'local-model' ? 'Carmen listened to your timing, on this device' : 'A tip'}</p>
                        <p className="coach-obs">{coachText.observations[analysis.pattern]}</p>
                      </div>
                    )}
                    {!sectionsOk && <p className="note-text">Both A and B need at least one sound. Try recording again.</p>}
                    <div className="row wrap">
                      <button type="button" className="btn-quiet" onClick={() => (player.playing ? player.stop() : void player.play([phrase], tempo, { totalTicks: phrase.totalTicks }))}>
                        {player.playing ? 'Stop' : <><span aria-hidden="true">▶ </span>Hear my idea</>}
                      </button>
                      <button type="button" className="btn" onClick={() => setStep(2)} disabled={!sectionsOk}>
                        Next: choose a change
                      </button>
                    </div>
                  </>
                )}
              </>
            )}
          </section>
          <div className="instrument-col">
            <Workspace instrument={instrument} onEvent={onEvent} />
          </div>
        </div>
      )}

      {step === 2 && phrase && (
        <section className="panel">
          <h2 className="h3">{mission.learnerControl}</h2>
          <fieldset className="choice-set">
            <legend>Choose the change</legend>
            <div className="chips">
              {op === 'dynamics' &&
                (['softer', 'louder'] as const).map((d) => (
                  <ChoiceChip key={d} on={params?.op === 'dynamics' && params.direction === d} onClick={() => { setParams({ op: 'dynamics', direction: d }); setParamsBy('learner'); }}>
                    {d === 'softer' ? 'Make it quieter' : 'Make it louder'}
                  </ChoiceChip>
                ))}
              {op === 'transpose' &&
                [2, 5, -2, -5].map((s) => (
                  <ChoiceChip key={s} on={params?.op === 'transpose' && params.semitones === s} onClick={() => { setParams({ op: 'transpose', semitones: s }); setParamsBy('learner'); }} disabled={!hasNotes}>
                    {s > 0 ? 'Higher' : 'Lower'} — {Math.abs(s) === 2 ? 'a small step' : 'a bigger leap'}
                  </ChoiceChip>
                ))}
              {op === 'replace_with_rest' &&
                soundingInPhrase.map((e, i) => (
                  <ChoiceChip key={e.id} on={params?.op === 'replace_with_rest' && params.eventId === e.id} onClick={() => { setParams({ op: 'replace_with_rest', eventId: e.id }); setParamsBy('learner'); }}>
                    Sound {i + 1} (beat {Math.floor(e.onset / TPQ) + 1}
                    {e.onset % TPQ ? '½' : ''}){e.kind === 'note' ? ` — ${midiToLetter(e.midi)}` : ''}
                  </ChoiceChip>
                ))}
              {op === 'section_order' && (
                <ChoiceChip on={params?.op === 'section_order'} onClick={() => { setParams({ op: 'section_order', splitTick: (beats / 2) * TPQ }); setParamsBy('learner'); }}>
                  Swap: B first, then A
                </ChoiceChip>
              )}
              {op === 'add_part' &&
                (['pulse', 'backbeat', 'drone'] as const).map((p) => (
                  <ChoiceChip key={p} on={params?.op === 'add_part' && params.part === p} onClick={() => { setParams({ op: 'add_part', part: p, tempoScale: 1 }); setParamsBy('learner'); }}>
                    {p === 'pulse' ? 'A steady click' : p === 'backbeat' ? 'Snare on 2 and 4' : 'A long low note'}
                  </ChoiceChip>
                ))}
              {(op === 'add_part' || op === 'dynamics' || op === 'section_order') && (
                <button type="button" className="chip chip-quiet" onClick={partnerChooses}>
                  Partner, you suggest
                </button>
              )}
            </div>
            {op === 'transpose' && !hasNotes && <p className="note-text">This change needs keyboard notes. Record your idea on the keyboard.</p>}
          </fieldset>
          {params && paramsBy !== 'learner' && (
            <p className="note-text">
              {paramsBy === 'partner-model'
                ? `Carmen listened to your timing and suggests: ${describeParams(params)}. You can pick something else.`
                : `Carmen suggests: ${describeParams(params)}. You can pick something else.`}
            </p>
          )}
          {params && (
            <fieldset className="choice-set">
              <legend>
                {pred.question} <span className="muted">(guess, or skip)</span>
              </legend>
              <div className="chips">
                {pred.options.map((o) => (
                  <ChoiceChip key={o.id} on={prediction === o.id} onClick={() => setPrediction(o.id)}>
                    {o.label}
                  </ChoiceChip>
                ))}
                <button type="button" className="chip chip-quiet" onClick={() => setPrediction('skipped')}>
                  Skip
                </button>
              </div>
            </fieldset>
          )}
          <div className="row wrap">
            <button type="button" className="btn-quiet" onClick={() => setStep(1)}>
              Back
            </button>
            <button type="button" className="btn" disabled={!params} onClick={makeReply}>
              Make the partner version
            </button>
          </div>
        </section>
      )}

      {step === 3 && reply && phrase && (
        <section className="panel">
          {reply.verification.ok ? (
            <>
              <h2 className="h3">Listen to both. What changed?</h2>
              <div className="compare">
                <div className="compare-col">
                  <p className="compare-title">
                    <Pill tone="paper">Yours</Pill>
                  </p>
                  <Notation phrase={phrase} />
                  <button type="button" className="btn-quiet" onClick={() => void clips.play([phrase], tempo, { totalTicks: phrase.totalTicks })}>
                    <span aria-hidden="true">▶ </span>Play mine
                  </button>
                </div>
                <div className="compare-col">
                  <p className="compare-title">
                    <Pill tone="mint">Partner version · {describeParams(reply.plan.params)}</Pill>
                  </p>
                  <Notation phrase={{ ...phrase, events: reply.render.tracks[0].events }} />
                  <button type="button" className="btn btn-sun" onClick={() => void clips.play(reply.render.tracks, reply.render.tempoBpm, { totalTicks: reply.render.totalTicks })}>
                    <span aria-hidden="true">▶ </span>Play the partner version
                  </button>
                </div>
              </div>
              <details className="checked" open={pathway?.words !== 'few'}>
                <summary>Checked before it played</summary>
                <ul>
                  {reply.verification.verified.map((v) => (
                    <li key={v}>✓ {v}</li>
                  ))}
                  <li>
                    Who chose the change: {reply.plan.provenance === 'learner-directed' ? 'you' : reply.plan.provenance === 'local-model' ? 'Carmen, from how it heard your timing' : 'Carmen, using a set rule'}.
                  </li>
                </ul>
              </details>
              {prediction && prediction !== 'skipped' && (
                <p className="note-text">
                  You guessed “{pred.options.find((o) => o.id === prediction)?.label}”. {prediction === pred.truth(reply.verification) ? 'That matches what the check found.' : `The check found: ${pred.options.find((o) => o.id === pred.truth(reply.verification))?.label}. Listen again and see if you can hear it.`}
                </p>
              )}
              {(missionId === 'P56_FORM_AND_TEXTURE' || missionId === 'OLDER_EXTENSION') && (
                <fieldset className="choice-set">
                  <legend>Which version would you keep, and why?</legend>
                  <div className="chips">
                    {['It starts stronger', 'It ends better', 'It surprises the listener', 'It keeps the beat clearer', 'Mine says what I meant'].map((r) => (
                      <ChoiceChip key={r} on={reason === r} onClick={() => setReason(r)}>
                        {r}
                      </ChoiceChip>
                    ))}
                  </div>
                </fieldset>
              )}
              <div className="row wrap">
                <button type="button" className="btn" onClick={() => keep('partner')} disabled={!!kept}>
                  Keep the partner version
                </button>
                <button type="button" className="btn-quiet" onClick={() => keep('mine')} disabled={!!kept}>
                  Keep mine
                </button>
                <button type="button" className="btn-quiet" onClick={() => { setStep(2); setReply(null); setKept(null); }}>
                  Try a different change
                </button>
              </div>
              {kept && (
                <p className="note-text" role="status">
                  Kept in My music{kept === 'partner' ? ' — the partner part is labelled' : ''}. Your original idea is saved too in your attempts.{' '}
                  <button type="button" className="link" onClick={() => { setStep(4); newTask(); }}>
                    Next: try one on my own
                  </button>
                </p>
              )}
            </>
          ) : (
            <>
              <h2 className="h3">The partner's version did not pass the music check, so it was not played.</h2>
              <ul>
                {reply.verification.violations.map((v) => (
                  <li key={v}>{v}</li>
                ))}
              </ul>
              <button type="button" className="btn" onClick={() => setStep(2)}>
                Choose another change
              </button>
            </>
          )}
        </section>
      )}

      {step === 4 && (
        <section className="panel">
          <h2 className="h3">On my own: new music, no hints</h2>
          <p>Listen, then answer. Play each part as often as you like.</p>
          {!task ? (
            <button type="button" className="btn btn-big" onClick={newTask}>
              Start
            </button>
          ) : (
            <>
              <div className="row wrap">
                {task.clips.map((c) => (
                  <button key={c.caption} type="button" className="btn-quiet" onClick={() => void clips.play([c.phrase], c.phrase.tempoBpm, { totalTicks: c.phrase.totalTicks })}>
                    <span aria-hidden="true">▶ </span>{c.caption}
                  </button>
                ))}
              </div>
              <fieldset className="choice-set">
                <legend>{task.question}</legend>
                <div className="chips">
                  {task.options.map((o) => (
                    <button key={o.id} type="button" className={`chip${answer === o.id ? ' is-on' : ''}`} aria-pressed={answer === o.id} onClick={() => submitAnswer(o.id)} disabled={!!answer}>
                      {o.label}
                    </button>
                  ))}
                </div>
              </fieldset>
              {answer && (
                <p className="coach-obs" role="status">
                  {answer === task.answer ? 'That matches the music.' : `The music was: ${task.options.find((o) => o.id === task.answer)?.label}. Want to listen again?`}
                </p>
              )}
              {answer && (
                <div className="row wrap">
                  <button type="button" className="btn" onClick={newTask}>
                    Try another new one
                  </button>
                  <button type="button" className="btn-quiet" onClick={() => go('#/learn')}>
                    Back to Learn
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      )}

    </div>
  );
}

function ChoiceChip({ on, onClick, children, disabled }: { on: boolean; onClick: () => void; children: React.ReactNode; disabled?: boolean }) {
  return (
    <button type="button" className={`chip${on ? ' is-on' : ''}`} aria-pressed={on} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}
