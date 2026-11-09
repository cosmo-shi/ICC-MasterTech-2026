import { useEffect, useMemo, useState } from 'react';
import metrics from '../../docs/model-metrics.json';
import { LESSONS, MISSIONS, PATHWAYS } from '../data/catalog.ts';
import { loadModel } from '../ai/model.ts';
import type { SelfCheck } from '../ai/selfcheck.ts';
import { usePrefs } from '../state/prefs.tsx';
import { type AttemptRecord, type CompositionRecord, newId, stamp, store } from '../store/db.ts';
import { Pill } from '../ui/common.tsx';
import { SoundCheck } from '../ui/SoundCheck.tsx';
import type { Lesson } from '../music/lessons.ts';
import { useLearner, resetLearningPicture } from '../ai/useLearner.ts';
import { LEARNER_MODEL_ID, LEARNER_MODEL_VERSION, SKILLS, band, skillLabel } from '../ai/learner.ts';
import learnerMetrics from '../../docs/learner-model-metrics.json';

const titleOf = (id: string) => LESSONS.find((l) => l.id === id)?.title ?? MISSIONS.find((m) => m.id === id)?.title ?? id;

function supportText(a: AttemptRecord): string {
  if (a.kind === 'independent' || a.kind === 'mission-check') return 'On their own, hints hidden';
  const s: string[] = [];
  if (a.support.hintLevel === 3) s.push('answer shown');
  else if (a.support.hintLevel === 2) s.push('clue + keys lit');
  else if (a.support.hintLevel === 1) s.push('question hint');
  if (a.support.heardExample) s.push('heard example');
  if (a.support.slower) s.push('slower tempo');
  if (a.kind === 'mission') s.push('with partner');
  return s.length ? s.join(', ') : 'Practice, no hints';
}

export function Grownups() {
  const { prefs, set, saveError } = usePrefs();
  const [attempts, setAttempts] = useState<AttemptRecord[]>([]);
  const [compositions, setCompositions] = useState<CompositionRecord[]>([]);
  const [confirmClear, setConfirmClear] = useState(false);
  const [cleared, setCleared] = useState(false);
  const [open, setOpen] = useState<string | null>(null);
  const [noteFor, setNoteFor] = useState<string | null>(null);
  const [noteText, setNoteText] = useState('');
  const model = loadModel();

  useEffect(() => {
    const load = () => {
      store.all<AttemptRecord>('attempts').then((r) => setAttempts(r.sort((a, b) => b.createdAt - a.createdAt)), () => setAttempts([]));
      store.all<CompositionRecord>('compositions').then(setCompositions, () => setCompositions([]));
    };
    load();
    return store.subscribe(load);
  }, []);

  const byActivity = useMemo(() => {
    const m = new Map<string, AttemptRecord[]>();
    for (const a of attempts) m.set(a.activityId, [...(m.get(a.activityId) ?? []), a]);
    return m;
  }, [attempts]);

  const aiDecisions = attempts.filter((a) => a.coach?.patternSource === 'local-model');
  const latencies = aiDecisions.map((a) => a.coach?.latencyMs ?? 0).sort((x, y) => x - y);
  const medianLatency = latencies.length ? latencies[Math.floor(latencies.length / 2)] : null;

  const addNote = async (activityId: string) => {
    if (!noteText.trim()) return;
    await store.put('attempts', {
      id: newId('note'),
      createdAt: stamp(),
      activityId,
      activityVersion: '-',
      kind: 'practice',
      instrument: 'keyboard',
      tempoBpm: 0,
      support: { hintLevel: 0, heardExample: false, largeControls: false, simplified: false, aiEnabled: false, slower: false },
      inputs: [],
      passed: false,
      note: `Teacher observation: ${noteText.trim().slice(0, 300)}`,
    } satisfies AttemptRecord);
    setNoteFor(null);
    setNoteText('');
  };

  return (
    <div className="screen grownups">
      <h1 className="h1">For grown-ups</h1>
      <p className="lede">This area is for teachers, parents and carers. It is not locked: anyone using this device can open it. It is not a school account system.</p>

      <section className="panel" aria-labelledby="ev-h">
        <h2 id="ev-h" className="h2">
          Teacher view: learning on this device
        </h2>
        <p>
          Each activity separates <strong>independent</strong> evidence (a fresh pattern with hints hidden) from <strong>assisted</strong> practice. A pass with help is useful, but it is not shown as independent understanding.
        </p>
        <p className="pill-row">
          <Pill>{attempts.filter((a) => !a.note?.startsWith('Teacher')).length} attempts</Pill>
          <Pill tone="lilac">{attempts.filter((a) => (a.kind === 'independent' || a.kind === 'mission-check') && a.passed).length} independent successes</Pill>
          <Pill tone="mint">{aiDecisions.length} AI coach decisions{medianLatency !== null ? ` · median ${medianLatency.toFixed(2)} ms` : ''}</Pill>
          <Pill>{compositions.length} saved pieces</Pill>
        </p>
        {attempts.length === 0 && <p className="note-text">No activity yet on this device{store.isPersistent ? '' : ' in this session'}.</p>}
        <div className="table-wrap" tabIndex={0} role="region" aria-label="Evidence by activity">
          <table className="evidence">
            <caption className="sr-only">Evidence by activity</caption>
            <thead>
              <tr>
                <th scope="col">Activity</th>
                <th scope="col">Independent</th>
                <th scope="col">Assisted</th>
                <th scope="col">Coach</th>
                <th scope="col">Details</th>
              </tr>
            </thead>
            <tbody>
              {[...byActivity.entries()].map(([id, rows]) => {
                const real = rows.filter((r) => !r.note?.startsWith('Teacher'));
                const indep = real.filter((r) => r.kind === 'independent' || r.kind === 'mission-check');
                const assisted = real.filter((r) => r.kind === 'practice' || r.kind === 'mission');
                const ai = real.filter((r) => r.coach?.patternSource === 'local-model').length;
                const rules = real.filter((r) => r.coach && r.coach.patternSource !== 'local-model').length;
                const badge = indep.filter((r) => r.passed).length >= 2;
                return (
                  <tr key={id}>
                    <th scope="row">
                      {titleOf(id)}
                      {prefs.badges && badge && <span className="badge"> ★ skill badge</span>}
                    </th>
                    <td>
                      {indep.filter((r) => r.passed).length} of {indep.length}
                    </td>
                    <td>
                      {assisted.filter((r) => r.passed).length} of {assisted.length}
                    </td>
                    <td>
                      {ai ? `${ai} AI` : ''}
                      {ai && rules ? ' · ' : ''}
                      {rules ? `${rules} rules` : ''}
                      {!ai && !rules ? '—' : ''}
                    </td>
                    <td>
                      <button type="button" className="btn-quiet small" aria-expanded={open === id} onClick={() => setOpen(open === id ? null : id)}>
                        {open === id ? 'Hide' : 'Show'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {open && (
          <div className="detail">
            <h3 className="h3">{titleOf(open)}</h3>
            <ol className="attempt-list">
              {(byActivity.get(open) ?? []).map((a) => (
                <li key={a.id} className="attempt">
                  <p className="attempt-head">
                    <span>{new Date(a.createdAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</span>
                    {!a.note?.startsWith('Teacher') && <Pill tone={a.kind === 'independent' || a.kind === 'mission-check' ? 'lilac' : 'paper'}>{supportText(a)}</Pill>}
                    {!a.note?.startsWith('Teacher') && <Pill tone={a.passed ? 'mint' : 'paper'}>{a.passed ? 'matched / completed' : 'not yet'}</Pill>}
                  </p>
                  {a.summary && (
                    <p>
                      {a.summary.correctSound}/{a.summary.expected} sounds matched; {a.summary.wrong} wrong, {a.summary.missed} missed, {a.summary.extra} extra
                      {a.summary.restViolations ? ` (${a.summary.restViolations} in rests)` : ''}; timing: {a.summary.onTime} on time, {a.summary.early} early, {a.summary.late} late at {a.tempoBpm} bpm.
                    </p>
                  )}
                  {a.coach && (
                    <p>
                      Coach focus: {a.coach.focus}. Timing description: {a.coach.pattern ?? '—'} by{' '}
                      {a.coach.patternSource === 'local-model'
                        ? `on-device model ${a.coach.modelId} v${a.coach.modelVersion} (confidence ${(a.coach.confidence ?? 0).toFixed(2)}, ${a.coach.latencyMs?.toFixed(2)} ms)`
                        : a.coach.patternSource === 'rules'
                          ? `fixed rules${a.coach.modelStatus ? ` (model ${a.coach.modelStatus})` : a.support.aiEnabled ? '' : ' (AI turned off)'}`
                          : 'not applicable'}
                      .{a.coach.replyOp && ` Reply: ${a.coach.replyOp.replace('_', ' ')}, checked (${(a.coach.verified ?? []).join('; ')}).`}
                      {a.coach.rejected?.length ? ` A reply was blocked: ${a.coach.rejected.join('; ')}.` : ''}
                      {a.coach.learnerChoice && ` Learner chose: ${a.coach.learnerChoice}.`}
                    </p>
                  )}
                  {a.reflection && <p>Learner reflection: {a.reflection}</p>}
                  {a.note && <p>{a.note}</p>}
                </li>
              ))}
            </ol>
            {noteFor === open ? (
              <form className="row wrap" onSubmit={(e) => { e.preventDefault(); void addNote(open); }}>
                <label className="field">
                  Your observation (stays on this device)
                  <input value={noteText} maxLength={300} onChange={(e) => setNoteText(e.target.value)} />
                </label>
                <button type="submit" className="btn">
                  Add note
                </button>
              </form>
            ) : (
              <button type="button" className="btn-quiet" onClick={() => setNoteFor(open)}>
                Add my own observation
              </button>
            )}
          </div>
        )}
        <div className="row wrap">
          <label className="field-inline">
            Set the suggested pathway on this device
            <select value={prefs.pathway ?? ''} onChange={(e) => set('pathway', (e.target.value || null) as typeof prefs.pathway)}>
              <option value="">None</option>
              {PATHWAYS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </section>

      <LearningPicture attempts={attempts} />

      <ClassReadiness />

      <section className="panel" aria-labelledby="priv-h">
        <h2 id="priv-h" className="h2">
          Privacy and data
        </h2>
        <ul className="plain">
          <li>Everything a learner plays, every attempt and every saved piece stays on this device. Carmen sends none of it anywhere.</li>
          <li>No account, name, age, school, location, microphone or camera. Recording means note events, not audio.</li>
          <li>The AI coach is a small model that runs inside this page. It looks only at timing numbers from an attempt.</li>
          <li>Downloading the app from a web host can still show that host the device's IP address, like any website.</li>
          <li>Records on this device are not encrypted and other people using this browser could see them.</li>
        </ul>
        <div className="toggles">
          <label className="toggle">
            <input type="checkbox" checked={prefs.saveOnDevice} onChange={(e) => set('saveOnDevice', e.target.checked)} />
            <span className="toggle-ui" aria-hidden="true" />
            <span>
              <span className="toggle-label">Save on this device</span>
              <span className="toggle-help">Off: everything is forgotten when the page closes (best for shared devices). On: kept in this browser until cleared. Up to 300 attempts are kept.</span>
            </span>
          </label>
          <label className="toggle">
            <input type="checkbox" checked={prefs.aiEnabled} onChange={(e) => set('aiEnabled', e.target.checked)} />
            <span className="toggle-ui" aria-hidden="true" />
            <span>
              <span className="toggle-label">AI coach</span>
              <span className="toggle-help">Off: the fixed coaching rules are used instead, and labelled “Coach tips”.</span>
            </span>
          </label>
          <label className="toggle">
            <input type="checkbox" checked={prefs.badges} onChange={(e) => set('badges', e.target.checked)} />
            <span className="toggle-ui" aria-hidden="true" />
            <span>
              <span className="toggle-label">Skill badges (off by default)</span>
              <span className="toggle-help">A badge appears in this view after two independent successes on fresh patterns. No streaks, points or rankings.</span>
            </span>
          </label>
        </div>
        {saveError && <p className="note-text">{saveError}</p>}
        <div className="row wrap">
          {confirmClear ? (
            <>
              <button
                type="button"
                className="btn btn-coral"
                onClick={async () => {
                  await store.clearAll();
                  setConfirmClear(false);
                  setCleared(true);
                }}
              >
                Yes, delete all learning records and saved music
              </button>
              <button type="button" className="btn-quiet" onClick={() => setConfirmClear(false)}>
                Cancel
              </button>
            </>
          ) : (
            <button type="button" className="btn-quiet" onClick={() => { setConfirmClear(true); setCleared(false); }}>
              Delete everything on this device
            </button>
          )}
        </div>
        {cleared && (
          <p className="note-text" role="status">
            Deleted. Settings like bigger keys are kept; the app's downloaded files (sounds, fonts) stay so it still works offline.
          </p>
        )}
      </section>

      <section className="panel" aria-labelledby="ai-h">
        <h2 id="ai-h" className="h2">
          About the AI coach
        </h2>
        <p>
          Model <code>{model?.modelId ?? 'not loaded'}</code> v{model?.version} ({metrics.architecture}, {metrics.parameters} numbers, about {Math.round(metrics.weightsBytes / 1024)} KB). It describes the timing of an attempt as steady, early, late, speeding up, slowing down or uneven, and picks one of a few checked musical replies. It never changes a score, never writes words, and does not judge creative work.
        </p>
        <p>
          Trained on made-up practice data, not on children. On new made-up rhythms it agreed with the true pattern {Math.round(metrics.heldOut.model.top1Accuracy * 100)}% of the time; the fixed rules managed {Math.round(metrics.heldOut.rulesBaseline.accuracy * 100)}%. That shows the software works. It does not show that children learn more with it — that needs a proper trial with teachers.
        </p>
        <p>Known gap: device sound delay is not calibrated yet, so “late” can sometimes be the device, not the child.</p>
        <AiSelfCheck />
      </section>

      <section className="panel" aria-labelledby="content-h">
        <h2 id="content-h" className="h2">
          Lessons and where they come from
        </h2>
        <p>
          <strong>All lessons and projects are drafts.</strong> They have not been reviewed by a primary music teacher yet, and they are not a complete Foundation–Year 6 programme.
        </p>
        <details>
          <summary>Pathways and Australian Curriculum links (orientation only, not certified)</summary>
          <ul className="plain">
            {PATHWAYS.map((p) => (
              <li key={p.id}>
                <strong>{p.label}</strong>: {p.invitation} {p.curriculumCodes.length ? `Related content descriptions: ${p.curriculumCodes.join(', ')}.` : 'Extension for older learners; not mapped.'}
              </li>
            ))}
          </ul>
        </details>
        <details>
          <summary>Class talk for each project</summary>
          <ul className="activity-notes">
            {MISSIONS.map((m) => (
              <li key={m.id}>
                <p>
                  <strong>{m.title}</strong>
                </p>
                <p>{m.contextActivity}</p>
              </li>
            ))}
          </ul>
        </details>
        <details>
          <summary>Activity notes for teachers</summary>
          <ul className="activity-notes">
            {LESSONS.map((l) => (
              <li key={l.id}>
                <p>
                  <strong>{l.title}</strong> · {l.goal} · {l.instruments.map((i) => (i === 'keyboard' ? 'keyboard' : 'drums')).join(' or ')}
                </p>
                <p>Learning intention: {l.objective}</p>
                <p>What Carmen checks: {checksText(l)}</p>
                {l.independent && <p>“On my own” uses a different pattern with hints hidden, so it is recorded separately from practice.</p>}
                <p className="muted">
                  Limits: draft content ({l.reviewStatus.replace(/_/g, ' ')}).{l.assessment.checkTiming ? ' Timing depends on the device’s sound delay, which is not calibrated yet.' : ''}
                </p>
                <a className="link" href={`#/lesson/${l.id}`}>
                  Preview {l.title}
                </a>
              </li>
            ))}
            {MISSIONS.map((m) => (
              <li key={m.id}>
                <p>
                  <strong>{m.title}</strong> · partner project
                </p>
                <p>Learning intention: {m.objective}</p>
                <p>Evidence: {m.independentEvidence}</p>
                <p className="muted">Not inferred: {m.doNotInfer}</p>
                <a className="link" href={`#/mission/${m.id}`}>
                  Preview {m.title}
                </a>
              </li>
            ))}
          </ul>
        </details>
      </section>

      <section className="panel" aria-labelledby="credits-h">
        <h2 id="credits-h" className="h2">
          Credits
        </h2>
        <ul className="plain">
          <li>Lesson content adapts Open Music Theory (Shaffer, Hughes, Moseley and contributors; ed. Shaffer and Wharton), CC BY-SA 4.0. Changes: new child-facing wording, sequence and exercises.</li>
          <li>Piano and percussion sounds: Versilian Community Sample Library (VCSL), CC0.</li>
          <li>Fonts: Grandstander and Atkinson Hyperlegible Next, SIL Open Font License 1.1.</li>
          <li>Music notation: VexFlow (MIT) with the Bravura music font (SIL OFL).</li>
          <li>Background on the need: ABC Classic (2023), ACMF (2024), ABC Education (2023), ASME submission (2022), Limelight (2020), Music Australia (2026), ABC News (2026).</li>
        </ul>
      </section>
    </div>
  );
}

function AiSelfCheck() {
  const [res, setRes] = useState<SelfCheck | null>(null);
  const [busy, setBusy] = useState(false);
  const run = async () => {
    setBusy(true);
    const { runSelfCheck } = await import('../ai/selfcheck.ts');
    setRes(runSelfCheck());
    setBusy(false);
  };
  const pct = (x: number) => `${Math.round(x * 100)}%`;
  return (
    <div className="detail">
      <h3 className="h3">Check the model on this device</h3>
      <p className="note-text">Runs the model on 600 made-up practice attempts it was not trained on, here in this browser. No learner data is used.</p>
      <div className="row">
        <button type="button" className="btn-quiet" onClick={run} disabled={busy}>
          {busy ? 'Checking…' : 'Run the check'}
        </button>
      </div>
      <p role="status" className="status-line">
        {res &&
          (res.status === 'unavailable'
            ? 'The model could not be loaded here, so the coach is using the fixed rules.'
            : `${res.samples} attempts. When it answered, it matched the true pattern ${pct(res.modelAgree)} of the time; it held back on ${pct(res.abstainRate)}. The fixed rules matched ${pct(res.rulesAgree)}. Average time per answer here: ${res.perAnswerMs < 0.01 ? 'under 0.01' : res.perAnswerMs.toFixed(2)} ms.`)}
      </p>
    </div>
  );
}

function checksText(l: Lesson): string {
  const a = l.assessment;
  if (a.mode === 'free-exploration') return 'nothing; it is free play.';
  if (a.mode === 'creative-completion') return 'only that a piece was made and saved. Creative work is never marked.';
  const parts: string[] = [];
  if (a.checkPitch) parts.push('which notes');
  if (a.checkTiming) parts.push('when each sound starts');
  if (a.checkDuration) parts.push('how long notes are held');
  if (a.checkRestViolations) parts.push('silence in the rests');
  return `${parts.join(', ')}, sound by sound.`;
}

/** Practical checks before a class: sound, saving and offline copy. Reads only this device. */
function ClassReadiness() {
  const supported = 'serviceWorker' in navigator;
  const [offline, setOffline] = useState<'checking' | 'ready' | 'not-ready' | 'unsupported'>(supported ? 'checking' : 'unsupported');
  useEffect(() => {
    if (!supported) return;
    let live = true;
    void navigator.serviceWorker.getRegistration().then((r) => live && setOffline(r?.active ? 'ready' : 'not-ready'));
    return () => {
      live = false;
    };
  }, [supported]);
  return (
    <section className="panel" aria-labelledby="ready-h">
      <h2 id="ready-h" className="h2">
        Before a class
      </h2>
      <ul className="readiness">
        <li>
          <strong>Sound</strong>
          <SoundCheck compact />
        </li>
        <li>
          <strong>Saving</strong>
          <span>{store.isPersistent ? 'On: work stays in this browser on this device.' : 'Off: work is kept only until the page is closed. Turn it on under Privacy and data if learners will come back to this device.'}</span>
        </li>
        <li>
          <strong>Without internet</strong>
          <span>
            {offline === 'checking' && 'Checking…'}
            {offline === 'ready' && 'Ready: this device has an offline copy of Carmen.'}
            {offline === 'not-ready' && 'Not ready yet. Open Carmen once while online, then reload.'}
            {offline === 'unsupported' && 'This browser cannot keep an offline copy.'}
          </span>
        </li>
      </ul>
    </section>
  );
}

const BAND_WORDS = { new: 'Not enough tries yet', growing: 'Growing', nearly: 'Nearly there', secure: 'Secure (shown on their own)' } as const;

/** The on-device learner model's picture: a guess from this device's attempts, not a test score. */
function LearningPicture({ attempts }: { attempts: AttemptRecord[] }) {
  const { state, aiEnabled, since } = useLearner();
  const [confirm, setConfirm] = useState(false);
  const last = attempts.find((a) => a.coach?.tailor?.nextLessonId);
  return (
    <section className="panel" aria-labelledby="picture-h">
      <h2 id="picture-h" className="h2">
        Learning picture (on this device)
      </h2>
      <p>
        A guess from this device's attempts, <strong>not a test score</strong>. The on-device learner model (<code>{LEARNER_MODEL_ID}</code> v{LEARNER_MODEL_VERSION}, Bayesian Knowledge
        Tracing) updates after every try. Tries with help count for less, and a skill is only called secure after a pass on their own. It only suggests what to try next: nothing is locked
        and the learner can always choose.
      </p>
      {!aiEnabled && <p className="note-text">The AI coach is turned off, so suggestions follow the pathway route and this picture is not used.</p>}
      {state.attemptsUsed === 0 ? (
        <p className="note-text">No scored tries yet{since ? ' since the last reset' : ''}.</p>
      ) : (
        <div className="table-wrap" tabIndex={0} role="region" aria-label="Learning picture by skill">
          <table className="evidence">
            <caption className="sr-only">Learning picture by skill</caption>
            <thead>
              <tr>
                <th scope="col">Skill</th>
                <th scope="col">Picture</th>
                <th scope="col">Estimate</th>
                <th scope="col">On their own</th>
                <th scope="col">With practice or help</th>
              </tr>
            </thead>
            <tbody>
              {SKILLS.filter((k) => state.skills[k].observations > 0).map((k) => {
                const sk = state.skills[k];
                return (
                  <tr key={k}>
                    <th scope="row">{skillLabel(k)}</th>
                    <td>{BAND_WORDS[band(sk)]}</td>
                    <td>{Math.round(sk.p * 100)}%</td>
                    <td>
                      {sk.independentPasses} of {sk.independent}
                    </td>
                    <td>{sk.assisted}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      {last?.coach?.tailor && (
        <p className="note-text">
          Last suggestion: {titleOf(last.coach.tailor.nextLessonId!)} ({last.coach.tailor.reasonId}).
        </p>
      )}
      <p className="note-text">
        Checked on made-up learners only: it picked the weakest skill {Math.round(learnerMetrics.model.targetsWeakest * 100)}% of the time, against {Math.round(learnerMetrics.rulesBaseline.targetsWeakest * 100)}% for the fixed route. That
        shows the software works, not that children learn more. See <code>docs/LEARNER_MODEL_CARD.md</code>.
      </p>
      {confirm ? (
        <div className="row wrap">
          <button type="button" className="btn" onClick={() => { resetLearningPicture(Date.now()); setConfirm(false); }}>
            Yes, start the picture again
          </button>
          <button type="button" className="btn-quiet" onClick={() => setConfirm(false)}>
            Cancel
          </button>
        </div>
      ) : (
        <button type="button" className="btn-quiet" onClick={() => setConfirm(true)}>
          Reset learning picture
        </button>
      )}
      <p className="note-text">Reset only starts the picture again from now. It does not delete any tries or music.</p>
    </section>
  );
}
