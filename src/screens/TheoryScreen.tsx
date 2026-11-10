import { lessonById } from '../data/catalog.ts';
import { THEORY, THEORY_GROUPS, type TheoryExample, topicById } from '../data/theory.ts';
import { Icon } from '../ui/icons.tsx';
import { Notation } from '../ui/Notation.tsx';
import { usePlayer } from '../ui/usePlayer.ts';
import { LearnTabs } from './LearnScreen.tsx';

function Example({ ex }: { ex: TheoryExample }) {
  const player = usePlayer();
  return (
    <figure className="theory-example">
      <div className="theory-example-head">
        <figcaption className="theory-example-label">{ex.label}</figcaption>
        <button
          type="button"
          className="btn-quiet small"
          onClick={() => (player.playing ? player.stop() : void player.play([ex.phrase], ex.phrase.tempoBpm, { totalTicks: ex.phrase.totalTicks }))}
          aria-label={player.playing ? `Stop ${ex.label}` : `Hear ${ex.label}`}
        >
          <Icon name={player.playing ? 'stop' : 'playback'} size={16} /> {player.playing ? 'Stop' : 'Hear it'}
        </button>
      </div>
      <Notation phrase={ex.phrase} />
    </figure>
  );
}

/** Music words: every topic has words, notation and sound from the same event list. */
export function TheoryScreen({ topicId, go }: { topicId?: string; go: (r: string) => void }) {
  const topic = topicId ? topicById(topicId) : undefined;

  if (topic) {
    const lesson = topic.tryLesson ? lessonById(topic.tryLesson) : undefined;
    return (
      <div className="screen theory">
        <nav className="crumbs" aria-label="Breadcrumb">
          <button type="button" className="link" onClick={() => go('#/theory')}>
            <Icon name="back" size={20} /> Music words
          </button>
        </nav>
        <p className="kicker">{topic.group}</p>
        <h1 className="h1">{topic.title}</h1>
        <p className="theory-short">{topic.short}</p>
        {topic.body.map((p) => (
          <p key={p} className="theory-body">
            {p}
          </p>
        ))}
        {topic.facts && (
          <dl className="theory-facts">
            {topic.facts.map(([t, dsc]) => (
              <div key={t}>
                <dt>{t}</dt>
                <dd>{dsc}</dd>
              </div>
            ))}
          </dl>
        )}
        <div className="theory-examples">
          {topic.examples.map((ex) => (
            <Example key={ex.label} ex={ex} />
          ))}
        </div>
        <div className="row wrap">
          {lesson && (
            <button type="button" className="btn" onClick={() => go(`#/lesson/${lesson.id}`)}>
              Try it: {lesson.title}
            </button>
          )}
          <button type="button" className="btn-quiet" onClick={() => go('#/play')}>
            Play with it
          </button>
        </div>
        {topic.related.length > 0 && (
          <section className="theory-related" aria-labelledby="rel-h">
            <h2 id="rel-h" className="h3">
              Related words
            </h2>
            <ul className="chips">
              {topic.related.map((r) => (
                <li key={r}>
                  <button type="button" className="chip" onClick={() => go(`#/theory/${r}`)}>
                    {topicById(r)?.title}
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    );
  }

  return (
    <div className="screen theory">
      <div className="learn-head">
        <h1 className="h1">Learn</h1>
        <LearnTabs at="theory" go={go} />
      </div>
      {THEORY_GROUPS.map((g) => (
        <section key={g} className="theory-group" aria-labelledby={`g-${g}`}>
          <h2 id={`g-${g}`} className="h3">
            {g}
          </h2>
          <ul className="theory-list">
            {THEORY.filter((t) => t.group === g).map((t) => (
              <li key={t.id}>
                <button type="button" className="theory-item" onClick={() => go(`#/theory/${t.id}`)}>
                  <span className="theory-item-title">{t.title}</span>
                  <span className="theory-item-short">{t.short}</span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
