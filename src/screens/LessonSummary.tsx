import { lessonStars, nextStep, skillsForActivity } from '../ai/learner.ts';
import { lessonById } from '../data/catalog.ts';
import { routeLessons } from '../data/route.ts';
import { usePrefs } from '../state/prefs.tsx';
import { Icon } from '../ui/icons.tsx';
import { useMyLearning } from '../ui/useAttempts.ts';
import { Stars } from './LearnScreen.tsx';

export type CycleStep = 'hear' | 'learn' | 'try' | 'listen' | 'make';
const STEPS: [CycleStep, string][] = [
  ['hear', 'Hear it'],
  ['learn', 'Learn'],
  ['try', 'Try'],
  ['listen', 'Listen back'],
  ['make', 'Make it yours'],
];

/** The same five steps in every lesson, so children always know where they are. */
export function LessonCycle({ at, done }: { at: CycleStep; done: Record<CycleStep, boolean> }) {
  return (
    <ol className="cycle" aria-label="Lesson steps">
      {STEPS.map(([id, label], i) => (
        <li key={id} className={`cycle-step${done[id] ? ' is-done' : ''}${at === id ? ' is-now' : ''}`} aria-current={at === id ? 'step' : undefined}>
          <span className="cycle-dot" aria-hidden="true">
            {done[id] ? <Icon name="check" size={14} /> : i + 1}
          </span>
          <span className="cycle-label">
            {label}
            {done[id] && <span className="sr-only"> (done)</span>}
          </span>
        </li>
      ))}
    </ol>
  );
}

type Dim = 'pitch' | 'onset' | 'rest' | 'duration';
const WELL: Record<Dim, (x: number, y: number) => string> = {
  pitch: (x, y) => `You found the right notes: ${x} of ${y}.`,
  onset: (x, y) => `Your sounds landed on the beat: ${x} of ${y}.`,
  rest: () => 'Your rests stayed silent.',
  duration: (x, y) => `You held the notes for their full length: ${x} of ${y}.`,
};
const PRACTISE: Record<Dim, string> = {
  pitch: 'Find the right notes. Listen first, then play slowly.',
  onset: 'Land on the beat. Tap along with the beat before you start.',
  rest: 'Keep the rests silent. Count them in your head.',
  duration: 'Hold the long notes for their whole length.',
};
const STAR_TEXT = ['You haven’t tried this one yet.', 'You had a go. Try again to match it.', 'You matched it with practice. Try a new one on your own for the third.', 'You matched a new one on your own.'];

export function LessonSummary({ lessonId, go }: { lessonId: string; go: (r: string) => void }) {
  const lesson = lessonById(lessonId)!;
  const { prefs } = usePrefs();
  const { attempts, evidence, estimates, model } = useMyLearning();
  const mine = attempts.filter((a) => a.activityId === lessonId && a.summary);
  const best = [...mine].sort((a, b) => (b.summary!.correctSound + b.summary!.onTime) - (a.summary!.correctSound + a.summary!.onTime) || b.createdAt - a.createdAt)[0];
  const stars = lessonStars(evidence, lessonId);
  const a = lesson.assessment;

  const dims: { dim: Dim; x: number; y: number }[] = [];
  if (best?.summary) {
    const s = best.summary;
    if (a.checkPitch) dims.push({ dim: 'pitch', x: s.correctSound, y: s.expected });
    if (a.checkTiming) dims.push({ dim: 'onset', x: s.onTime, y: s.expected });
    if (a.checkRestViolations) dims.push({ dim: 'rest', x: s.restViolations ? 0 : 1, y: 1 });
    if (a.checkDuration && s.durationOk + s.durationIssues > 0) dims.push({ dim: 'duration', x: s.durationOk, y: s.durationOk + s.durationIssues });
  }
  const ratio = (d: { x: number; y: number }) => (d.y ? d.x / d.y : 0);
  const well = [...dims].sort((p, q) => ratio(q) - ratio(p)).find((d) => ratio(d) >= 0.75);
  const work = [...dims].sort((p, q) => ratio(p) - ratio(q)).find((d) => ratio(d) < 1);
  const step = nextStep(routeLessons(prefs.pathway).filter((id) => id !== lessonId || work), estimates);
  const next = lessonById(step.activityId);
  const after = lessonById(nextStep(routeLessons(prefs.pathway).filter((id) => id !== lessonId), estimates).activityId);
  const theory = skillsForActivity(lessonId)[0]?.theory;

  return (
    <div className="screen summary">
      <nav className="crumbs" aria-label="Breadcrumb">
        <button type="button" className="link" onClick={() => go('#/learn')}>
          <Icon name="back" size={18} /> Pathway
        </button>
      </nav>
      <p className="kicker">Lesson summary</p>
      <h1 className="h1">{lesson.title}</h1>
      <LessonCycle at="make" done={{ hear: mine.length > 0, learn: mine.length > 0, try: mine.length > 0, listen: mine.length > 0, make: false }} />

      <section className="score" aria-labelledby="score-h">
        <h2 id="score-h" className="sr-only">
          Score
        </h2>
        <Stars n={stars} size={40} />
        <p className="score-text">{STAR_TEXT[stars]}</p>
        <p className="score-key">One note head for having a go, two for matching it with practice, three for matching a new one on your own.</p>
      </section>

      {dims.length > 0 && (
        <ul className="dim-list" aria-label="Your best try">
          {dims.map((d) => (
            <li key={d.dim} className={`dim ${ratio(d) >= 1 ? 'is-good' : ratio(d) >= 0.5 ? 'is-near' : 'is-miss'}`}>
              <span className="dim-name">{d.dim === 'pitch' ? 'Right notes' : d.dim === 'onset' ? 'On the beat' : d.dim === 'rest' ? 'Rests silent' : 'Held long enough'}</span>
              <span className="dim-val">{d.dim === 'rest' ? (d.x ? 'Yes' : 'Not yet') : `${d.x} of ${d.y}`}</span>
            </li>
          ))}
        </ul>
      )}

      <div className="summary-grid">
        <section className="summary-card" aria-labelledby="well-h">
          <h2 id="well-h" className="h3">
            What went well
          </h2>
          <p>{well ? WELL[well.dim](well.x, well.y) : mine.length ? 'You had a go and listened to your own take.' : 'Have a go first, then come back here.'}</p>
        </section>
        <section className="summary-card" aria-labelledby="work-h">
          <h2 id="work-h" className="h3">
            One thing to practise
          </h2>
          <p>{work ? PRACTISE[work.dim] : 'Try a new one on your own, or make it yours.'}</p>
          <div className="row wrap">
            <button type="button" className="btn-quiet" onClick={() => go(`#/lesson/${lessonId}`)}>
              Practise it
            </button>
            {theory && (
              <button type="button" className="btn-quiet" onClick={() => go(`#/theory/${theory}`)}>
                <Icon name="notes" size={18} /> Music words
              </button>
            )}
          </div>
        </section>
      </div>

      <section className="up-next" aria-labelledby="sum-next-h">
        <p className="kicker">{model.kind === 'live' ? 'Carmen suggests' : 'Next step'}</p>
        <h2 id="sum-next-h" className="up-next-title">
          {step.activityId === lessonId ? 'Make it yours' : next?.title}
        </h2>
        <p className="up-next-why">
          {step.activityId === lessonId ? 'Turn this idea into your own music.' : step.why === 'practise' ? 'One more go at this will help.' : 'Next on your pathway.'}
        </p>
        <div className="row wrap">
          {next && step.activityId !== lessonId && (
            <button type="button" className="btn btn-big" onClick={() => go(`#/lesson/${next.id}`)}>
              Go to {next.title}
            </button>
          )}
          <button type="button" className={step.activityId === lessonId ? 'btn btn-big' : 'btn-quiet'} onClick={() => go(`#/play/make/${lessonId}`)}>
            Make it yours
          </button>
          {step.activityId === lessonId && after && (
            <button type="button" className="btn-quiet" onClick={() => go(`#/lesson/${after.id}`)}>
              Then: {after.title}
            </button>
          )}
        </div>
      </section>
      <p className="note-text">Worked out from your tries on this device. Nothing is sent anywhere.</p>
    </div>
  );
}
