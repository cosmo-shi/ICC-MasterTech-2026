import { lessonById } from '../data/catalog.ts';
import { THEORY, THEORY_GROUPS, type TheoryExample, topicById } from '../data/theory.ts';
import { Icon } from '../ui/icons.tsx';
import { Notation } from '../ui/Notation.tsx';
import { usePlayer } from '../ui/usePlayer.ts';
import { LearnTabs } from './LearnScreen.tsx';

/** Each category keeps one track hue so it is findable by place, words and colour. */
const GROUP_TONE: Record<string, string> = { 'Beat and rhythm': 'tr-foundations', 'High and low': 'tr-piano', 'How it sounds': 'tr-drums', 'Building music': 'tr-create' };
const GROUP_ABOUT: Record<string, string> = {
  'Beat and rhythm': 'How music moves in time: the beat, note lengths, rests and bars.',
  'High and low': 'Where notes sit: pitch, the stave, clefs, sharps and flats.',
  'How it sounds': 'Loud and soft, fast and slow, smooth and short.',
  'Building music': 'How ideas join up: patterns, phrases, call and response, form.',
};

/** Hear-it button for a topic card: plays the first example from the same event list as its notation. */
function HearFirst({ t }: { t: (typeof THEORY)[number] }) {
  const player = usePlayer();
  const ex = t.examples[0];
  if (!ex) return null;
  return (
    <button type="button" className="lx-btn lx-btn-quiet" onClick={() => (player.playing ? player.stop() : void player.play([ex.phrase], ex.phrase.tempoBpm, { totalTicks: ex.phrase.totalTicks }))}>
      <Icon name={player.playing ? 'stop' : 'playback'} size={16} /> {player.playing ? 'Stop' : 'Hear it'}
      <span className="sr-only">: {t.title}</span>
    </button>
  );
}

function TheoryIndexLook({ go }: { go: (r: string) => void }) {
  return (
    <div className="screen lx lxt">
      <header className="lxt-head">
        <h1 className="lx-display lxt-title">Music theory</h1>
        <LearnTabs at="theory" go={go} />
        <p className="lxt-lede">The words musicians use, each with real notation you can hear.</p>
      </header>
      <nav className="lxt-jump" aria-label="Categories">
        {THEORY_GROUPS.map((g, i) => (
          <a key={g} href={`#/theory`} className={`lxt-jump-link ${GROUP_TONE[g]}`} onClick={(e) => { e.preventDefault(); document.getElementById(`tg-${i}`)?.scrollIntoView({ block: 'start' }); }}>
            {g}
          </a>
        ))}
      </nav>
      {THEORY_GROUPS.map((g, gi) => (
        <section key={g} id={`tg-${gi}`} className={`lxt-group ${GROUP_TONE[g]}`} aria-labelledby={`tgh-${gi}`}>
          <div className="lxt-group-head">
            <h2 id={`tgh-${gi}`} className="lx-display lxt-group-title">{g}</h2>
            <p className="lx-about">{GROUP_ABOUT[g]}</p>
          </div>
          <ul className="lxt-grid">
            {THEORY.filter((t) => t.group === g).map((t) => (
              <li key={t.id} className="lxt-card">
                <h3 className="lx-item-title">{t.title}</h3>
                <p className="lx-desc">{t.short}</p>
                {t.examples[0] && (
                  <div className="lx-preview" aria-hidden="true">
                    <Notation phrase={t.examples[0].phrase} />
                  </div>
                )}
                <div className="lx-row">
                  <HearFirst t={t} />
                  <button type="button" className="lx-link" onClick={() => go(`#/theory/${t.id}`)}>
                    Read about it<span className="sr-only">: {t.title}</span>
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

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

/** Music theory: every topic has words, notation and sound from the same event list. */
export function TheoryScreen({ topicId, go }: { topicId?: string; go: (r: string) => void }) {
  const topic = topicId ? topicById(topicId) : undefined;

  if (topic) {
    const lesson = topic.tryLesson ? lessonById(topic.tryLesson) : undefined;
    return (
      <div className={`screen theory lx lxt-topic ${GROUP_TONE[topic.group]}`}>
        <nav className="crumbs" aria-label="Breadcrumb">
          <button type="button" className="link" onClick={() => go('#/theory')}>
            <Icon name="back" size={20} /> Music theory
          </button>
        </nav>
        <p className="kicker">{topic.group}</p>
        <h1 className="lx-display lxt-topic-title">{topic.title}</h1>
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

  return <TheoryIndexLook go={go} />;
}
