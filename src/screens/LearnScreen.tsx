import { useEffect, useState } from 'react';
import { LESSONS, MISSIONS, PATHWAYS, blurb, missionById, pathwayById } from '../data/catalog.ts';
import { usePrefs } from '../state/prefs.tsx';
import { Icon, type IconName } from '../ui/icons.tsx';
import { type AttemptRecord, store } from '../store/db.ts';
import { useLearner } from '../ai/useLearner.ts';
import { planNext, reasonText } from '../ai/tailor.ts';

const GOAL_ORDER = ['Explore', 'Rhythm', 'Notes', 'Reading music', 'Rhythm and notes', 'Create'];

export function LearnScreen({ go }: { go: (r: string) => void }) {
  const { prefs, set } = usePrefs();
  const pathway = pathwayById(prefs.pathway);
  const [attempts, setAttempts] = useState<AttemptRecord[]>([]);
  useEffect(() => {
    const load = () => store.all<AttemptRecord>('attempts').then(setAttempts, () => setAttempts([]));
    load();
    return store.subscribe(load);
  }, []);

  const status = (id: string) => {
    const mine = attempts.filter((a) => a.activityId === id);
    const indep = mine.filter((a) => (a.kind === 'independent' || a.kind === 'mission-check') && a.passed).length;
    if (indep > 0) return `Done on my own${indep > 1 ? ` ×${indep}` : ''}`;
    if (mine.some((a) => a.passed)) return 'Done with practice';
    if (mine.length) return 'Started';
    return '';
  };

  const mission = pathway ? missionById(pathway.missionId) : undefined;

  // On-device learner model: a suggestion only. Everything stays open.
  const learner = useLearner();
  const [notNow, setNotNow] = useState(false);
  const plan = planNext(learner.state, learner.context());
  const suggested = plan.provenance === 'learner-model' && plan.next ? LESSONS.find((l) => l.id === plan.next!.lessonId) : undefined;

  return (
    <div className="screen learn">
      <h1 className="h1">Learn</h1>
      <section aria-labelledby="path-h" className="paths">
        <h2 id="path-h" className="h2">
          Pick a pathway
        </h2>
        <p className="lede">Pick any one. Everything stays open, and you can switch whenever you like.</p>
        <div className="path-grid" role="radiogroup" aria-label="Pathway">
          {PATHWAYS.map((p) => (
            <button
              key={p.id}
              type="button"
              role="radio"
              aria-checked={prefs.pathway === p.id}
              className={`path tone-${p.tone}${prefs.pathway === p.id ? ' is-on' : ''}`}
              onClick={() => set('pathway', p.id)}
            >
              <span className="path-top">
                <span className="path-badge" aria-hidden="true">
                  {p.short}
                </span>
                <Icon name={`path-${p.id}` as IconName} size={40} className="path-icon" />
              </span>
              <span className="path-label">{p.label}</span>
              <span className="path-text">{p.invitation}</span>
            </button>
          ))}
        </div>
      </section>

      {suggested && !notNow && (
        <section className="panel route suggest" aria-labelledby="suggest-h">
          <h2 id="suggest-h" className="h2">
            Suggested for you
          </h2>
          <button type="button" className="route-item" onClick={() => go(`#/lesson/${suggested.id}`)}>
            <span className="route-title">{suggested.title}</span>
            <span className="route-sub">{blurb(suggested.id, suggested.objective)}</span>
            {status(suggested.id) && <span className="route-status">{status(suggested.id)}</span>}
          </button>
          <details className="why">
            <summary>Why?</summary>
            <p className="note-text">{reasonText(plan)} This comes from your tries on this device. You can still pick anything.</p>
          </details>
          <button type="button" className="btn-quiet small" onClick={() => setNotNow(true)}>
            Not now
          </button>
        </section>
      )}

      {pathway && mission && (
        <section className="panel route" aria-labelledby="route-h">
          <h2 id="route-h" className="h2">
            Your route · {pathway.label}
          </h2>
          <ol className="route-list">
            {pathway.recommended.map((id) => {
              const l = LESSONS.find((x) => x.id === id)!;
              return (
                <li key={id}>
                  <button type="button" className="route-item" onClick={() => go(`#/lesson/${id}`)}>
                    <span className="route-title">{l.title}</span>
                    <span className="route-sub">{blurb(l.id, l.objective)}</span>
                    {status(id) && <span className="route-status">{status(id)}</span>}
                  </button>
                </li>
              );
            })}
            <li>
              <button type="button" className="route-item is-mission" onClick={() => go(`#/mission/${mission.id}`)}>
                <span className="route-title">{mission.title}</span>
                <span className="route-sub">{blurb(mission.id, mission.objective)}</span>
                {status(mission.id) && <span className="route-status">{status(mission.id)}</span>}
              </button>
            </li>
          </ol>
        </section>
      )}

      <section aria-labelledby="all-h">
        <h2 id="all-h" className="h2">
          All activities
        </h2>
        {GOAL_ORDER.map((g) => {
          const ls = LESSONS.filter((l) => l.goal === g);
          if (!ls.length) return null;
          return (
            <div key={g} className="goal-group">
              <h3 className="h3">{g}</h3>
              <ul className="card-list">
                {ls.map((l) => (
                  <li key={l.id}>
                    <button type="button" className="card-btn" onClick={() => go(`#/lesson/${l.id}`)}>
                      <span className="card-title">{l.title}</span>
                      <span className="card-sub">{blurb(l.id, l.objective)}</span>
                      <span className="card-meta">
                        {l.instruments.map((i) => (i === 'keyboard' ? 'Keyboard' : 'Drums')).join(' or ')}
                        {status(l.id) && ` · ${status(l.id)}`}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
        <div className="goal-group">
          <h3 className="h3">Partner projects</h3>
          <ul className="card-list">
            {MISSIONS.map((m) => (
              <li key={m.id}>
                <button type="button" className="card-btn" onClick={() => go(`#/mission/${m.id}`)}>
                  <span className="card-title">{m.title}</span>
                  <span className="card-sub">{blurb(m.id, m.objective)}</span>
                  <span className="card-meta">
                    {PATHWAYS.find((p) => p.missionId === m.id)?.label}
                    {status(m.id) && ` · ${status(m.id)}`}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
