import { lessonStars, nextStep, skillById, skillsForActivity } from '../ai/learner.ts';
import { useEffect, useRef, useState } from 'react';
import { blurb, lessonById, missionById } from '../data/catalog.ts';
import { routeLessons, UNITS } from '../data/route.ts';
import { usePrefs } from '../state/prefs.tsx';
import { Icon, type IconName } from '../ui/icons.tsx';
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

const ZIG = [0, 1, 2, 1, 0, -1, -2, -1];

export function LearnScreen({ go }: { go: (r: string) => void }) {
  const { prefs } = usePrefs();
  const { evidence, estimates, model } = useMyLearning();
  const route = routeLessons(prefs.pathway);
  const step = nextStep(route, estimates);
  const [open, setOpen] = useState<string | null>(null);
  const hereRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    // After the page's own scroll-to-top, bring "you are here" into view.
    const t = window.setTimeout(() => hereRef.current?.scrollIntoView?.({ block: 'center' }), 60);
    return () => window.clearTimeout(t);
  }, []);
  let n = 0;

  const openStop = open ? UNITS.flatMap((u) => u.stops).find((s) => s.id === open) : undefined;

  return (
    <div className="screen learn">
      <div className="learn-head">
        <h1 className="h1">Learn</h1>
        <LearnTabs at="path" go={go} />
      </div>

      <ol className="path" aria-label="Your path">
        {UNITS.map((u, ui) => (
          <li key={u.id} className="path-unit">
            <div className={`unit-banner u-${ui % 5}`}>
              <span className="unit-kicker">Unit {ui + 1}</span>
              <h2 className="unit-name">{u.title}</h2>
              <p className="unit-about">{u.about}</p>
            </div>
            <ol className="nodes">
              {u.stops.map((s) => {
                const off = ZIG[n++ % ZIG.length];
                const here = s.id === step.activityId;
                const isLesson = s.kind === 'lesson';
                const title = isLesson ? lessonById(s.id)?.title : missionById(s.id)?.title;
                if (!title) return null;
                const stars = isLesson ? lessonStars(evidence, s.id) : evidence.some((a) => a.activityId === s.id) ? 3 : 0;
                const state = stars === 3 ? 'done' : stars > 0 ? 'started' : 'new';
                return (
                  <li key={s.id} className={`node-li${here ? ' is-here' : ''}`} style={{ '--off': off } as React.CSSProperties}>
                    {here && (
                      <span className="node-bubble" aria-hidden="true">
                        {step.why === 'practise' ? 'Practise' : 'Start'}
                      </span>
                    )}
                    <button
                      ref={here ? hereRef : undefined}
                      type="button"
                      className={`node node-${state}${isLesson ? '' : ' node-project'}${here ? ' node-here' : ''}`}
                      aria-label={`${title}. ${isLesson ? `${stars} of 3 stars` : stars ? 'Started' : 'Project'}${here ? '. Up next' : ''}`}
                      aria-haspopup="dialog"
                      onClick={() => setOpen(s.id)}
                    >
                      <Icon name={!isLesson ? 'music' : state === 'done' ? 'check' : skillIcon(s.id)} size={34} />
                    </button>
                    {isLesson && <Stars n={stars} size={14} />}
                  </li>
                );
              })}
            </ol>
          </li>
        ))}
      </ol>

      {openStop && (
        <StopSheet
          id={openStop.id}
          kind={openStop.kind}
          stars={openStop.kind === 'lesson' ? lessonStars(evidence, openStop.id) : 0}
          suggested={openStop.id === step.activityId ? (model.kind === 'live' ? 'Carmen picked this for you. ' : '') + WHY[step.why](step.skill ? skillById(step.skill).name : undefined) : undefined}
          onClose={() => setOpen(null)}
          go={go}
        />
      )}
    </div>
  );
}

function skillIcon(id: string): IconName {
  const sk = skillsForActivity(id)[0]?.id;
  if (sk === 'pulse' || sk === 'rests' || sk === 'quavers') return 'drum';
  if (sk === 'reading' || sk === 'duration') return 'notes';
  if (sk === 'explore') return 'sound';
  return 'piano';
}

function StopSheet({ id, kind, stars, suggested, onClose, go }: { id: string; kind: 'lesson' | 'project'; stars: number; suggested?: string; onClose: () => void; go: (r: string) => void }) {
  const l = kind === 'lesson' ? lessonById(id) : undefined;
  const m = kind === 'project' ? missionById(id) : undefined;
  const title = l?.title ?? m?.title ?? '';
  const btn = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    btn.current?.focus();
    const k = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [onClose]);
  return (
    <div className="stop-sheet-wrap" onClick={onClose}>
      <div className="stop-sheet" role="dialog" aria-modal="true" aria-labelledby="stop-h" onClick={(e) => e.stopPropagation()}>
        <p className="kicker">{kind === 'project' ? 'Project with a partner part' : l?.goal}</p>
        <h2 id="stop-h" className="stop-sheet-title">
          {title}
        </h2>
        <p className="stop-sheet-sub">{blurb(id, (l ?? m)!.objective)}</p>
        {kind === 'lesson' && <Stars n={stars} size={28} />}
        {suggested && <p className="stop-sheet-why">{suggested}</p>}
        <button ref={btn} type="button" className="btn btn-big btn-block" onClick={() => go(kind === 'lesson' ? `#/lesson/${id}` : `#/mission/${id}`)}>
          {stars === 3 ? 'Play again' : stars ? 'Keep going' : 'Start'}
        </button>
        <button type="button" className="btn-text" onClick={onClose}>
          Not now
        </button>
      </div>
    </div>
  );
}
