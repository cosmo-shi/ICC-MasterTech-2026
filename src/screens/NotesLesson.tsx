// L05 "Keyboard notes: C, D and E" as a full teaching sequence (video QA vertical slice):
// hear → notice and name → show and connect → guided → independent → reflect and create.
// The stave and the keys are always on the same screen, linked both ways. Untimed: pitch only.
import { useCallback, useMemo, useRef, useState } from 'react';
import { lessonById } from '../data/catalog.ts';
import { checkAttempt } from '../engine/checker.ts';
import type { CapturedInput } from '../engine/checker.ts';
import { type Phrase, TPQ } from '../music/events.ts';
import { midiToLetter } from '../music/theory.ts';
import { usePrefs } from '../state/prefs.tsx';
import { type AttemptRecord, newId, stamp, store } from '../store/db.ts';
import { C4, L05_STEPS, NOTES, SHARP_EXPLAINER, describeChange, judgeTap, sequenceResult, type TapResult } from '../teach/l05.ts';
import { Dialog } from '../ui/Dialog.tsx';
import { FeedbackSheet } from '../ui/FeedbackSheet.tsx';
import { Icon } from '../ui/icons.tsx';
import { Notation } from '../ui/Notation.tsx';
import { MiniKeys, NotePair, WrongPairs, playOne } from '../ui/NotePair.tsx';
import { usePlayer } from '../ui/usePlayer.ts';
import { type LiveEvent, Workspace } from '../ui/Workspace.tsx';
import { LessonShell } from './LessonShell.tsx';

const TEMPO = 80;

function tune(notes: number[], id: string): Phrase {
  // One note on its own is a semibreve, so the bar has no rests to explain.
  if (notes.length === 1)
    return { id, instrument: 'keyboard', meter: [4, 4], tempoBpm: TEMPO, totalTicks: 4 * TPQ, events: [{ id: `${id}-0`, kind: 'note', onset: 0, duration: 4 * TPQ, midi: notes[0], velocity: 0.7 }] };
  return {
    id,
    instrument: 'keyboard',
    meter: [4, 4],
    tempoBpm: TEMPO,
    totalTicks: Math.max(4, Math.ceil(notes.length / 4) * 4) * TPQ,
    events: notes.map((m, i) => ({ id: `${id}-${i}`, kind: 'note' as const, onset: i * TPQ, duration: TPQ, midi: m, velocity: 0.7 })),
  };
}

type SeqFeedback = ReturnType<typeof sequenceResult>;

export function NotesLesson({ go }: { go: (r: string) => void }) {
  const lesson = lessonById('L05')!;
  const { prefs } = usePrefs();
  const [index, setIndex] = useState(0);
  const step = L05_STEPS[index];
  const [played, setPlayed] = useState<number[]>([]);
  const [tap, setTap] = useState<TapResult | null>(null);
  const [lastWrong, setLastWrong] = useState<number | null>(null);
  const [seq, setSeq] = useState<SeqFeedback | null>(null);
  const [done, setDone] = useState(false);
  const [hint, setHint] = useState(false);
  const [sharpOpen, setSharpOpen] = useState(false);
  const [links, setLinks] = useState(0);
  const [linked, setLinked] = useState<number | null>(null);
  const [mine, setMine] = useState<number[]>([]);
  const [pick, setPick] = useState(3);
  const [reflectAns, setReflectAns] = useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [saveFailed, setSaveFailed] = useState(false);
  const player = usePlayer();
  const inputs = useRef<CapturedInput[]>([]);
  const t0 = useRef(0);
  // One saved record per try: a rotation, a re-render or a double press can never save it twice (DATA-01).
  const savedFor = useRef<string | null>(null);
  const tryId = useRef(newId("att"));

  const notes = useMemo(() => ('notes' in step ? step.notes : 'target' in step ? [step.target] : []), [step]);
  const phrase = useMemo(() => tune(step.kind === 'create' && mine.length ? mine : notes, step.id), [step, mine, notes]);
  const original = useMemo(() => tune(notes, `${step.id}-o`), [step, notes]);

  const reset = useCallback(() => {
    player.stop();
    setPlayed([]);
    setTap(null);
    setLastWrong(null);
    setSeq(null);
    setDone(false);
    setHint(false);
    setSheetOpen(false);
    setLinks(0);
    setLinked(null);
    inputs.current = [];
    tryId.current = newId("att");
  }, [player]);

  const next = () => {
    reset();
    if (index + 1 < L05_STEPS.length) {
      const n = L05_STEPS[index + 1];
      if (n.kind === 'create') setMine([...n.notes]);
      setIndex(index + 1);
    } else go('#/lesson/L05/summary');
  };

  const hear = (p: Phrase) => void player.play([{ events: p.events }], TEMPO, { totalTicks: p.events.reduce((t, e) => Math.max(t, e.onset + e.duration), 0), countInBeats: 0 });

  const saveIndependent = (ok: boolean) => {
    if (savedFor.current === tryId.current) return;
    savedFor.current = tryId.current;
    const target = tune(notes, 'L05-own');
    const res = checkAttempt(target, inputs.current, lesson.assessment, TEMPO);
    const record: AttemptRecord = {
      id: tryId.current,
      createdAt: stamp(),
      activityId: 'L05',
      activityVersion: lesson.version,
      kind: 'independent',
      instrument: 'keyboard',
      tempoBpm: TEMPO,
      support: { hintLevel: 0, heardExample: false, largeControls: prefs.large, simplified: prefs.simplified, aiEnabled: prefs.aiEnabled, slower: false },
      inputs: inputs.current,
      summary: res.summary,
      passed: ok && res.passed,
      checkerVersion: res.checkerVersion,
    };
    store.put('attempts', record).then(
      () => setSaveFailed(false),
      () => setSaveFailed(true),
    );
  };

  const onEvent = (e: LiveEvent) => {
    if (e.type !== 'down' || e.midi === undefined) return;
    const m = e.midi;
    if (step.kind === 'listen') return;
    if (step.kind === 'find') {
      if (done) return;
      const r = judgeTap(step.target, m);
      setTap(r);
      setLastWrong(r.ok ? null : m);
      if (r.ok) setDone(true);
      return;
    }
    if (step.kind === 'link') {
      if (m === 60 || m === 62 || m === 64) {
        setLinked(m);
        setLinks((n) => n + 1);
      }
      return;
    }
    if (step.kind === 'create') {
      // Only one note differs from the first tune.
      setMine(notes.map((n, i) => (i === pick ? m : n)));
      return;
    }
    // copy and independent: collect notes, judge when the pattern is complete
    if (seq || done) return;
    if (!inputs.current.length) t0.current = e.t;
    inputs.current.push({ id: `${tryId.current}-${inputs.current.length}`, onsetMs: e.t - t0.current, midi: m, source: e.source === 'midi' ? 'midi' : e.source === 'key' ? 'key' : 'pointer' });
    const p = [...played, m];
    setPlayed(p);
    if (p.length >= notes.length) {
      const r = sequenceResult(notes, p);
      setSeq(r);
      if (r.ok) setDone(true);
      if (step.kind === 'independent') {
        saveIndependent(r.ok);
        setSheetOpen(true);
      }
    }
  };

  const tryAgain = () => {
    player.stop();
    setPlayed([]);
    setSeq(null);
    setSheetOpen(false);
    inputs.current = [];
    tryId.current = newId("att");
  };

  // What the keys show: the target as a hint only when asked, the linked note, or nothing.
  const highlight = new Set<number>();
  if (step.kind === 'find' && (step.guided ? hint || !!tap : hint) && !done) highlight.add(step.target);
  if (step.kind === 'link' && linked !== null) highlight.add(linked);
  if (step.kind === 'listen' && player.beat !== null) highlight.add(notes[player.beat] ?? -1);
  if ((step.kind === 'copy') && player.beat !== null) highlight.add(notes[player.beat] ?? -1);

  const activeIndex =
    player.beat !== null ? player.beat : step.kind === 'link' && linked !== null ? notes.indexOf(linked) : step.kind === 'create' ? pick : step.kind === 'copy' || step.kind === 'independent' ? (seq ? undefined : played.length) : undefined;
  // Every wrong note is marked on the stave, not just the first.
  const marks = seq && !seq.ok && seq.wrong.length ? notes.map((_, i) => (seq.wrong.some((w) => w.index === i) ? 'wrong' : 'ok')) : undefined;

  const facts = step.kind === 'find' ? NOTES[midiToLetter(step.target) as 'C' | 'D' | 'E'] : null;

  let task: React.ReactNode;
  let foot: React.ReactNode;
  const continueBtn = (label = 'Continue', enabled = true) => (
    <button type="button" className="btn btn-big btn-block" onClick={next} disabled={!enabled}>
      {label}
    </button>
  );

  switch (step.kind) {
    case 'listen':
      task = (
        <>
          <p className="kicker">Listen</p>
          <h1 className="lp-title small" tabIndex={-1}>{step.title}</h1>
          <p className="lp-say">{step.text}</p>
          <button type="button" className="btn-quiet" onClick={() => hear(phrase)} aria-pressed={player.playing}>
            <Icon name={player.playing ? 'stop' : 'ear'} size={20} /> Hear C, D and E
          </button>
        </>
      );
      foot = continueBtn();
      break;
    case 'find':
      task = (
        <>
          <p className="kicker">{step.guided ? 'Find it' : 'Your turn'}</p>
          <h1 className="lp-title small" tabIndex={-1}>{step.title}</h1>
          {step.guided && facts && <p className="lp-say">{facts.keys}</p>}
          {!step.guided && hint && facts && <p className="lp-say">{facts.keys}</p>}
          <div className="lp-actions">
            <button type="button" className="btn-quiet" onClick={() => playOne(step.target)}>
              <Icon name="ear" size={20} /> Hear {midiToLetter(step.target)}
            </button>
            {!done && (
              <button type="button" className="btn-quiet" onClick={() => setHint(true)} disabled={hint}>
                <Icon name="hint" size={20} /> Show me
              </button>
            )}
          </div>
          {step.id === 'find-c' && done && (
            <button type="button" className="btn-text" onClick={() => setSharpOpen(true)}>
              What is the black key after C?
            </button>
          )}
          {tap && (
            <div className={`lp-check ${tap.ok ? 'is-good' : 'is-miss'}`} role="status">
              <Icon name={tap.ok ? 'good' : 'near'} size={24} />
              <p>
                <strong>{tap.observed}</strong> {tap.ok ? (facts?.stave ?? '') : tap.next}
              </p>
            </div>
          )}
          {tap && !tap.ok && lastWrong !== null && <NotePair expected={step.target} played={lastWrong} />}
        </>
      );
      foot = continueBtn(done ? 'Continue' : `Press ${midiToLetter(step.target)} on the keys`, done);
      break;
    case 'copy':
      task = (
        <>
          <p className="kicker">Copy</p>
          <h1 className="lp-title small" tabIndex={-1}>{step.title}</h1>
          <p className="lp-say">{step.id === 'up' ? 'Each note is one step higher. On the stave, each one sits a little higher too.' : 'Now the other way: each note one step lower, and lower on the stave.'}</p>
          <button type="button" className="btn-quiet" onClick={() => hear(phrase)}>
            <Icon name="ear" size={20} /> Hear it
          </button>
          {seq && (
            <div className={`lp-check ${seq.ok ? 'is-good' : 'is-miss'}`} role="status">
              <Icon name={seq.ok ? 'good' : 'near'} size={24} />
              <p>
                <strong>{seq.ok ? seq.observed : seq.title}.</strong> {seq.ok ? '' : `${seq.observed} ${seq.next}`}
              </p>
            </div>
          )}
          {seq && <WrongPairs wrong={seq.wrong} />}
        </>
      );
      foot = done ? continueBtn() : seq ? (
        <button type="button" className="btn btn-big btn-block" onClick={tryAgain}>Try that note</button>
      ) : (
        <p className="status-big" role="status">Play the notes ({played.length} of {notes.length})</p>
      );
      break;
    case 'link':
      task = (
        <>
          <p className="kicker">Show and connect</p>
          <h1 className="lp-title small" tabIndex={-1}>{step.title}</h1>
          <p className="lp-say">Press C, D or E on the keys and watch the stave. Or tap a note on the stave to find its key.</p>
          {linked !== null && (
            <p className="lp-check is-good" role="status">
              <Icon name="notes" size={24} /> {NOTES[midiToLetter(linked) as 'C' | 'D' | 'E'].stave}
            </p>
          )}
        </>
      );
      foot = continueBtn(links >= 3 ? 'Continue' : `Try ${3 - links} more`, links >= 3);
      break;
    case 'independent':
      task = (
        <>
          <p className="kicker">On your own</p>
          <h1 className="lp-title small" tabIndex={-1}>Read the stave and play these four notes</h1>
          <p className="lp-say">No letter names this time. Take as long as you need.</p>
        </>
      );
      foot = done ? continueBtn() : (
        <p className="status-big" role="status">Play the notes ({played.length} of {notes.length})</p>
      );
      break;
    case 'create':
      task = (
        <>
          <p className="kicker">Make it yours</p>
          <h1 className="lp-title small" tabIndex={-1}>{step.title}</h1>
          <p className="lp-say">Tap a note on the stave to choose it (note {pick + 1} is chosen). Then press any key to change it.</p>
          <div className="lp-actions">
            <button type="button" className="btn-quiet" onClick={() => hear(phrase)}>
              <Icon name="playback" size={20} /> Play mine
            </button>
            <button type="button" className="btn-quiet" onClick={() => hear(original)}>
              <Icon name="ear" size={20} /> Play the first tune
            </button>
          </div>
          <p className="lp-say" role="status">{describeChange(notes, mine)}</p>
        </>
      );
      foot = continueBtn();
      break;
    case 'reflect':
      task = (
        <>
          <p className="kicker">Think back</p>
          <h1 className="lp-title small" tabIndex={-1}>Which note was easiest to find?</h1>
          <div className="lp-actions" role="group" aria-label="Easiest note">
            {['C', 'D', 'E'].map((l) => (
              <button key={l} type="button" className="btn-quiet" aria-pressed={reflectAns === l} onClick={() => setReflectAns(l)}>
                {l}
              </button>
            ))}
          </div>
          {reflectAns && <p className="lp-say">{NOTES[reflectAns as 'C' | 'D' | 'E'].keys} The two black keys are your landmark for all three.</p>}
        </>
      );
      foot = continueBtn('Finish');
      break;
  }

  const showKeys = step.kind !== 'reflect';
  return (
    <LessonShell step={index + 1} steps={L05_STEPS.length} onClose={() => go('#/learn')} stepKey={step.id} foot={foot} sheet={
      <>
        {step.kind === 'independent' && seq && (
          <FeedbackSheet
            open={sheetOpen}
            onClose={() => setSheetOpen(false)}
            tone={seq.ok ? 'good' : 'miss'}
            title={seq.ok ? 'You read it and played it on your own' : seq.title}
            observed={seq.observed}
            why={seq.ok ? 'Reading the stave and finding the keys without letter names is what this lesson is for.' : 'Each line and space on the stave is one key. Find the landmark, then count.'}
            tag="On your own"
            warning={saveFailed ? 'This try couldn’t be saved on this device, so it won’t show in your progress.' : undefined}
            primary={seq.ok ? { label: 'Continue', onClick: next } : { label: seq.wrong.length === 1 ? 'Try that note' : 'Try again', onClick: tryAgain }}
            secondary={seq.ok ? undefined : { label: 'Show me how', onClick: () => { setSheetOpen(false); hear(original); } }}
          >
            <WrongPairs wrong={seq.wrong} />
          </FeedbackSheet>
        )}
        <Dialog open={sharpOpen} onClose={() => setSharpOpen(false)} labelledBy="sharp-t" className="explainer">
          <div className="dlg-body">
            <div className="dlg-head">
              <h2 id="sharp-t" className="fb-title" tabIndex={-1}>{SHARP_EXPLAINER.title}</h2>
              <button type="button" className="icon-btn quiet dlg-close" aria-label="Close" onClick={() => setSharpOpen(false)}>
                <Icon name="close" size={24} />
              </button>
            </div>
            <MiniKeys from={60} to={66} label="Middle C, C sharp and the keys around them" marks={{ 60: { tone: 'good', word: 'C' }, 61: { tone: 'now', word: 'C♯' } }} onKey={(m) => playOne(m)} />
            <div className="lp-actions">
              <button type="button" className="btn-quiet" onClick={() => playOne(60)}><Icon name="ear" size={20} /> Hear C</button>
              <button type="button" className="btn-quiet" onClick={() => playOne(61)}><Icon name="ear" size={20} /> Hear C♯</button>
            </div>
            <Notation phrase={{ ...tune([60, 61], 'sharp'), meter: [2, 4], totalTicks: 2 * TPQ }} />
            <ul className="explainer-lines">
              {SHARP_EXPLAINER.lines.map((l) => <li key={l}>{l}</li>)}
            </ul>
          </div>
          <div className="dlg-foot">
            <button type="button" className="btn btn-big" onClick={() => setSharpOpen(false)} data-primary>Back to the lesson</button>
          </div>
        </Dialog>
      </>
    }>
      <div className="lp-try l05">
        <div className="lp-task">
          {task}
          <div className="lp-music">
            <Notation
              phrase={phrase}
              activeIndex={activeIndex}
              marks={marks}
              onNoteTap={(i) => {
                if (step.kind === 'link') {
                  setLinked(notes[i]);
                  setLinks((n) => n + 1);
                  playOne(notes[i]);
                } else if (step.kind === 'create') setPick(i);
                else playOne(phrase.events[i] && phrase.events[i].kind === 'note' ? (phrase.events[i] as { midi: number }).midi : C4);
              }}
            />
          </div>
        </div>
        {showKeys && (
          <div className="lp-instrument">
            <Workspace instrument="keyboard" onEvent={onEvent} highlightNotes={highlight} startMidi={60} />
          </div>
        )}
      </div>
    </LessonShell>
  );
}
