import { lessonStars, nextStep, skillsForActivity } from '../ai/learner.ts';
import { lessonById } from '../data/catalog.ts';
import { routeLessons } from '../data/route.ts';
import { usePrefs } from '../state/prefs.tsx';
import { Icon } from '../ui/icons.tsx';
import { useMyLearning } from '../ui/useAttempts.ts';
import { Stars } from './LearnScreen.tsx';
import { LessonShell } from './LessonShell.tsx';

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

  const nextIsMake = step.activityId === lessonId;
  return (
    <LessonShell
      step={5}
      steps={5}
      stepKey="summary"
      onClose={() => go('#/learn')}
      foot={
        <div className="lp-foot-row">
          <button type="button" className="btn-quiet" onClick={() => go(nextIsMake && after ? `#/lesson/${after.id}` : `#/play/make/${lessonId}`)}>
            {nextIsMake ? (after ? 'Next lesson' : 'Back to path') : 'Make it yours'}
          </button>
          <button type="button" className="btn btn-big" onClick={() => go(nextIsMake || !next ? `#/play/make/${lessonId}` : `#/lesson/${next.id}`)}>
            {nextIsMake || !next ? 'Make it yours' : 'Next lesson'}
          </button>
        </div>
      }
    >
      <div className="lp-center summary">
        <Stars n={stars} size={56} />
        <h1 className="lp-title" tabIndex={-1}>
          {stars === 3 ? 'Lesson complete!' : stars === 2 ? 'Matched it!' : lesson.title}
        </h1>
        <p className="lp-say">{STAR_TEXT[stars]}</p>

        {dims.length > 0 && (
          <ul className="dim-list" aria-label="Your best try">
            {dims.map((d) => (
              <li key={d.dim} className={`dim ${ratio(d) >= 1 ? 'is-good' : ratio(d) >= 0.5 ? 'is-near' : 'is-miss'}`}>
                <span className="dim-val">{d.dim === 'rest' ? (d.x ? 'Yes' : 'Not yet') : `${d.x}/${d.y}`}</span>
                <span className="dim-name">{d.dim === 'pitch' ? 'Right notes' : d.dim === 'onset' ? 'On the beat' : d.dim === 'rest' ? 'Rests silent' : 'Held long'}</span>
              </li>
            ))}
          </ul>
        )}

        <div className="summary-cards">
          <section className="summary-card is-good" aria-labelledby="well-h">
            <h2 id="well-h" className="h3">
              <Icon name="check" size={20} /> What went well
            </h2>
            <p>{well ? WELL[well.dim](well.x, well.y) : mine.length ? 'You had a go. That’s how it starts.' : 'Have a go first, then come back here.'}</p>
          </section>
          <section className="summary-card" aria-labelledby="work-h">
            <h2 id="work-h" className="h3">
              <Icon name="hint" size={20} /> Practise next
            </h2>
            <p>{work ? PRACTISE[work.dim] : 'Try a new one on your own, or make it yours.'}</p>
            <div className="chips">
              <button type="button" className="chip" onClick={() => go(`#/lesson/${lessonId}`)}>
                Practise it
              </button>
              {theory && (
                <button type="button" className="chip" onClick={() => go(`#/theory/${theory}`)}>
                  <Icon name="notes" size={16} /> Music words
                </button>
              )}
            </div>
          </section>
        </div>
        {!nextIsMake && next && (
          <p className="up-next-line">
            <span className="kicker">{model.kind === 'live' ? 'Carmen suggests' : 'Up next'}</span> {next.title}
            {step.why === 'practise' ? ' (one more go will help)' : ''}
          </p>
        )}
      </div>
    </LessonShell>
  );
}
