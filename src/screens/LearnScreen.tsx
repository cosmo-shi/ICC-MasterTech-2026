import { lessonStars, nextStep, skillById, skillsForActivity } from '../ai/learner.ts';
import { PATHWAYS, blurb, lessonById, missionById } from '../data/catalog.ts';
import { routeLessons, START_UNIT, UNITS } from '../data/route.ts';
import { usePrefs } from '../state/prefs.tsx';
import { Icon } from '../ui/icons.tsx';
import { useMyLearning } from '../ui/useAttempts.ts';

/** Three note heads: had a go, matched with practice, matched on your own. */
export function Stars({ n, size = 18 }: { n: number; size?: number }) {
  return (
    <span className="stars" role="img" aria-label={`${n} of 3 stars`}>
      {[0, 1, 2].map((i) => (
        <svg key={i} width={size} height={size} viewBox="0 0 20 20" aria-hidden="true" focusable="false">
          <ellipse cx="10" cy="10" rx="7.5" ry="5.6" transform="rotate(-22 10 10)" className={i < n ? 'star-on' : 'star-off'} />
        </svg>
      ))}
    </span>
  );
}

export function LearnTabs({ at, go }: { at: 'path' | 'theory'; go: (r: string) => void }) {
  return (
    <div className="segmented learn-tabs" role="tablist" aria-label="Learn">
      <button type="button" role="tab" aria-selected={at === 'path'} className="segment" onClick={() => go('#/learn')}>
        <Icon name="learn" size={20} /> Pathway
      </button>
      <button type="button" role="tab" aria-selected={at === 'theory'} className="segment" onClick={() => go('#/theory')}>
        <Icon name="notes" size={20} /> Music words
      </button>
    </div>
  );
}

const WHY: Record<string, (skill?: string) => string> = {
  start: () => 'A good place to begin.',
  next: () => 'Next on your pathway.',
  practise: (s) => `${s ?? 'This'} is still settling. One more go will help.`,
  make: () => 'You’ve been all along the pathway. Make something new!',
};

export function LearnScreen({ go }: { go: (r: string) => void }) {
  const { prefs, set } = usePrefs();
  const { evidence, estimates, model } = useMyLearning();
  const route = routeLessons(prefs.pathway);
  const step = nextStep(route, estimates);
  const nextLesson = lessonById(step.activityId);
  const startUnit = prefs.pathway ? START_UNIT[prefs.pathway] : UNITS[0].id;

  return (
    <div className="screen learn">
      <div className="learn-head">
        <h1 className="h1">Learn</h1>
        <LearnTabs at="path" go={go} />
      </div>

      <div className="start-from" role="radiogroup" aria-label="Start from">
        <span className="start-label">Start from</span>
        {PATHWAYS.map((p) => (
          <button key={p.id} type="button" role="radio" aria-checked={prefs.pathway === p.id} className="chip" onClick={() => set('pathway', p.id)}>
            {p.label}
          </button>
        ))}
      </div>

      {nextLesson && (
        <section className="up-next" aria-labelledby="next-h">
          <p className="kicker">Up next</p>
          <h2 id="next-h" className="up-next-title">
            {nextLesson.title}
          </h2>
          <p className="up-next-why">
            {model.kind === 'live' ? 'Carmen picked this for you. ' : ''}
            {WHY[step.why](step.skill ? skillById(step.skill).name : undefined)}
          </p>
          <button type="button" className="btn btn-big" onClick={() => go(`#/lesson/${nextLesson.id}`)}>
            {step.why === 'practise' ? 'Practise it' : 'Start'}
          </button>
        </section>
      )}

      <ol className="route" aria-label="Pathway">
        {UNITS.map((u, ui) => (
          <li key={u.id} className={`unit${u.id === startUnit ? ' is-start' : ''}`}>
            <div className="unit-head">
              <span className="unit-num" aria-hidden="true">
                {ui + 1}
              </span>
              <div>
                <h2 className="h3 unit-title">{u.title}</h2>
                <p className="unit-about">{u.about}</p>
              </div>
            </div>
            <ol className="stops">
              {u.stops.map((s) => {
                const here = s.id === step.activityId;
                if (s.kind === 'lesson') {
                  const l = lessonById(s.id);
                  if (!l) return null;
                  const stars = lessonStars(evidence, s.id);
                  const skill = skillsForActivity(s.id)[0];
                  return (
                    <li key={s.id} className={`stop${here ? ' is-here' : ''}${stars ? ' is-started' : ''}`}>
                      <button type="button" className="stop-btn" onClick={() => go(`#/lesson/${s.id}`)} aria-current={here ? 'step' : undefined}>
                        <span className="stop-node" aria-hidden="true">
                          {stars === 3 ? <Icon name="check" size={18} /> : null}
                        </span>
                        <span className="stop-body">
                          {here && <span className="here-tag">You are here</span>}
                          <span className="stop-title">{l.title}</span>
                          <span className="stop-sub">{blurb(l.id, l.objective)}</span>
                          <span className="stop-meta">
                            <Stars n={stars} />
                            {skill && <span className="stop-skill">{skill.name}</span>}
                          </span>
                        </span>
                      </button>
                    </li>
                  );
                }
                const m = missionById(s.id);
                if (!m) return null;
                const done = evidence.some((a) => a.activityId === s.id);
                return (
                  <li key={s.id} className={`stop is-project${done ? ' is-started' : ''}`}>
                    <button type="button" className="stop-btn" onClick={() => go(`#/mission/${s.id}`)}>
                      <span className="stop-node" aria-hidden="true">
                        <Icon name="music" size={18} />
                      </span>
                      <span className="stop-body">
                        <span className="stop-kicker">Project with a partner part</span>
                        <span className="stop-title">{m.title}</span>
                        <span className="stop-sub">{blurb(m.id, m.objective)}</span>
                        {done && <span className="stop-meta">Started</span>}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </li>
        ))}
      </ol>
    </div>
  );
}
