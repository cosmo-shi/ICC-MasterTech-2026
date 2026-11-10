import { useEffect, useState, useSyncExternalStore } from 'react';
import metrics from '../../docs/model-metrics.json';
import { LESSONS, MISSIONS, PATHWAYS } from '../data/catalog.ts';
import { loadModel } from '../ai/model.ts';
import type { SelfCheck } from '../ai/selfcheck.ts';
import { usePrefs } from '../state/prefs.tsx';
import { store } from '../store/db.ts';
import { SoundCheck } from '../ui/SoundCheck.tsx';
import type { Lesson } from '../music/lessons.ts';
import { teacher } from '../store/profiles.ts';
import { teacherAuth } from '../auth/teacherAuth.ts';
import { currentSpace } from './TeacherWelcome.tsx';
import { Icon } from '../ui/icons.tsx';
import { Wordmark } from '../ui/brand.tsx';
import { ChildView, ClassView } from './TeacherDashboard.tsx';
import { TeacherClasses } from './TeacherClasses.tsx';
import learnerMetrics from '../../docs/learner-model-metrics.json';

/** Who is signed in, which space, and Sign out; or plainly "device only" for the PIN view. */
function AccountLine({ go }: { go: (h: string) => void }) {
  const session = useSyncExternalStore(teacherAuth.subscribe, teacherAuth.current, teacherAuth.current);
  const space = currentSpace();
  if (!session || !space)
    return (
      <p className="account-line">
        <Icon name="lock" size={16} /> Device-only teacher view (PIN). Class data here comes from this device only.
      </p>
    );
  return (
    <p className="account-line">
      <span>
        {session.user.email} · <strong>{space.name}</strong>
        {space.join_code && <> · join code <code>{space.join_code}</code></>}
      </span>
      <button
        type="button"
        className="btn-quiet small"
        onClick={async () => {
          await teacherAuth.signOut();
          teacher.close();
          go('#/play');
        }}
      >
        Sign out
      </button>
    </p>
  );
}

export function Grownups({ go }: { go: (h: string) => void }) {
  const { prefs, set, saveError } = usePrefs();
  const [confirmClear, setConfirmClear] = useState(false);
  const [cleared, setCleared] = useState(false);
  const model = loadModel();
  const [tab, setTab] = useState<Tab>(() => (teacherAuth.current() && currentSpace() ? 'classes' : 'class'));
  const [childId, setChildId] = useState<string | null>(null);
  return (
    <div className="screen grownups">
      <header className="teacher-bar">
        <Wordmark size={24} />
        <h1 className="teacher-title">Teacher</h1>
        <button type="button" className="btn-quiet" onClick={() => { teacher.close(); go('#/play'); }}>
          <Icon name="lock" size={20} /> Exit
        </button>
      </header>
      <AccountLine go={go} />
      <div className="dash-tabs" role="tablist" aria-label="Teacher">
        {TABS.map(([id, label]) => (
          <button key={id} type="button" role="tab" id={`tab-${id}`} aria-selected={tab === id} aria-controls="gu-panel" className={`dash-tab${tab === id ? ' is-on' : ''}`} onClick={() => setTab(id)}>
            {label}
          </button>
        ))}
      </div>
      <div id="gu-panel" role="tabpanel" aria-labelledby={`tab-${tab}`}>
        {tab === 'class' && (
          <ClassView openChild={(id) => { setChildId(id); setTab('child'); }} />
        )}
        {tab === 'classes' && <TeacherClasses space={currentSpace()} onSignedOut={() => { teacher.close(); go('#/teacher'); }} />}
        {tab === 'child' && <ChildView childId={childId} setChild={setChildId} />}
        {tab === 'lessons' && (
          <>
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

            <section className="panel" aria-labelledby="start-h">
              <h2 id="start-h" className="h2">Starting point</h2>
              <p>Children can change this on Learn. It only sets “you are here”; every lesson stays open.</p>
          <div className="row wrap">
            <label className="field-inline">
              Starting point on this device
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
          </>
        )}
        {tab === 'ai' && (
          <>
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

            <section className="panel" aria-labelledby="lm-h">
              <h2 id="lm-h" className="h2">About the learner model</h2>
              <p>
                A second model, Bayesian Knowledge Tracing, keeps one estimate per skill (beat, rests, two sounds in a beat, right notes, reading, holding notes) and updates it after every try. Tries with help count for less than tries on their own, and a skill is only called secure after a pass on their own. It is fitted to simulated learners, not children.
              </p>
              <p>It changes three things a child sees: what “Up next” offers and the reason shown with it; whether a lesson starts slower or with a watch-it demonstration; and which fact the feedback mentions first. On each child’s page you can see the tries behind every estimate and override it, or choose their next activity yourself.</p>
              <p>
                On a separate group of {learnerMetrics.learners} simulated learners, its next suggestion trained the truly weakest skill {Math.round(learnerMetrics.model.targetsWeakest * 1000) / 10}% of the time; the fixed route managed {Math.round(learnerMetrics.rulesBaseline.targetsWeakest * 1000) / 10}%. This shows the software works as designed. It says nothing yet about real children’s learning.
              </p>
            </section>
          </>
        )}
        {tab === 'device' && (
          <>
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

        <section className="panel" aria-labelledby="credits-h">
          <h2 id="credits-h" className="h2">
            Credits
          </h2>
          <ul className="plain">
            <li>Lesson content adapts Open Music Theory (Shaffer, Hughes, Moseley and contributors; ed. Shaffer and Wharton), CC BY-SA 4.0. Changes: new child-facing wording, sequence and exercises.</li>
            <li>Piano and percussion sounds: Versilian Community Sample Library (VCSL), CC0.</li>
            <li>Font: Nunito, SIL Open Font License 1.1.</li>
            <li>
              Interface icons: Lucide (Lucide Contributors; some icons from Feather), ISC and MIT. <a href="/licences/lucide.txt">Licence text</a>
            </li>
            <li>Music notation: VexFlow (MIT) with the Bravura music font (SIL OFL).</li>
            <li>Background on the need: ABC Classic (2023), ACMF (2024), ABC Education (2023), ASME submission (2022), Limelight (2020), Music Australia (2026), ABC News (2026).</li>
          </ul>
        </section>

          </>
        )}
      </div>
    </div>
  );
}

const TABS = [
  ['classes', 'Classes'],
  ['class', 'This device'],
  ['child', 'Students'],
  ['lessons', 'Lessons'],
  ['ai', 'AI'],
  ['device', 'Device'],
] as const;
type Tab = (typeof TABS)[number][0];

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
