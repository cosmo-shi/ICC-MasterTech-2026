import { lessonStars, nextFor, reasonText } from '../ai/learner.ts';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { blurb, lessonById, missionById } from '../data/catalog.ts';
import { type Activity, type TrackId, TRACKS, activityById, positionInTrack, trackActivities, trackById } from '../data/curriculum.ts';
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

export const TRACK_ICON: Record<TrackId, IconName> = { foundations: 'click', piano: 'piano', drums: 'drum', create: 'music' };
export const titleOf = (id: string) => lessonById(id)?.title ?? missionById(id)?.title ?? id;

const READING: Record<Activity['reading'], string> = { none: 'Listen and copy', symbols: 'Rhythm symbols', stave: 'Notes on the stave' };
const INPUT: Record<Activity['input'], string> = { tap: 'Tap in time', keys: 'Find the keys', hold: 'Hold keys down', make: 'Make your own' };

/** Which instrument, in words a child can scan. Shared ideas say both. */
export function InstrumentLine({ a }: { a: Activity }) {
  if (a.instrument === 'either')
    return (
      <span className="inst-line">
        <Icon name="drum" size={18} />
        <Icon name="piano" size={18} />
        Drums or piano
      </span>
    );
  return (
    <span className="inst-line">
      <Icon name={a.instrument === 'drums' ? 'drum' : 'piano'} size={18} />
      {a.instrument === 'drums' ? 'Drums' : 'Piano'}
    </span>
  );
}

function Level({ n }: { n: number }) {
  return (
    <span className="level-dots" role="img" aria-label={`Music level ${n} of 4`}>
      {[1, 2, 3, 4].map((i) => (
        <i key={i} className={i <= n ? 'on' : ''} />
      ))}
    </span>
  );
}

const ZIG = [0, 1, 2, 1, 0, -1, -2, -1];

/** Track name as a label with its icon: one fact, not squeezed into a sentence. */
export function TrackTag({ id }: { id: TrackId }) {
  return (
    <span className={`track-tag tr-${id}`}>
      <Icon name={TRACK_ICON[id]} size={16} /> {trackById(id).name}
    </span>
  );
}

/** Progress through a track, separate from the title: a dot per step, and the words. */
export function TrackProgress({ id, at, done }: { id: string; at: number; done: (id: string) => boolean }) {
  const a = activityById(id)!;
  const list = trackActivities(a.track);
  return (
    <span className="track-progress">
      <span className="tp-dots" aria-hidden="true">
        {list.map((x, i) => (
          <i key={x.id} className={i + 1 === at ? 'is-here' : done(x.id) ? 'is-done' : ''} />
        ))}
      </span>
      <span className="tp-words">
        Step {at} of {list.length}
      </span>
    </span>
  );
}

export function LearnScreen({ go }: { go: (r: string) => void }) {
  const { attempts, planning, overrides, context } = useMyLearning();
  const plan = nextFor(planning, overrides, context());
  const nextId = plan.next?.lessonId ?? 'L00';
  const nextAct = activityById(nextId)!;
  const [track, setTrack] = useState<TrackId>(nextAct.track);
  const [open, setOpen] = useState<string | null>(null);

  const started = (id: string) => attempts.some((a) => a.activityId === id);
  const starsFor = (a: Activity) => (a.kind === 'lesson' ? lessonStars(attempts, a.id) : started(a.id) ? 3 : 0);
  const pos = positionInTrack(nextId)!;
  // Shown only when it is evidence (the model ran on this child's tries) or a teacher's choice.
  const why = plan.teacher ? 'Your teacher picked this for you.' : plan.provenance === 'learner-model' ? reasonText(plan) : '';
  const nextStars = starsFor(nextAct);
  const list = trackActivities(track);

  return (
    <div className="screen learn">
      <div className="learn-head">
        <h1 className="h1">Learn</h1>
        <LearnTabs at="path" go={go} />
      </div>

      <section className={`resume tr-${nextAct.track}`} aria-labelledby="resume-h">
        <div className="resume-top">
          <span className="kicker">{nextStars ? 'Carry on' : 'Up next'}</span>
          <TrackTag id={nextAct.track} />
        </div>
        <h2 id="resume-h" className="resume-title">
          {titleOf(nextId)}
        </h2>
        <p className="resume-learn">{nextAct.learn}</p>
        <div className="resume-facts">
          <InstrumentLine a={nextAct} />
          <TrackProgress id={nextId} at={pos.index} done={(x) => starsFor(activityById(x)!) === 3} />
        </div>
        {why && (
          <p className="resume-why">
            <Icon name="ear" size={18} /> {why}
          </p>
        )}
        <button type="button" className="btn btn-big" onClick={() => go(nextAct.kind === 'lesson' ? `#/lesson/${nextId}` : `#/mission/${nextId}`)}>
          {nextStars ? 'Keep going' : 'Start'}
        </button>
      </section>

      <div className="track-tabs" role="tablist" aria-label="Tracks">
        {TRACKS.map((t) => (
          <button key={t.id} type="button" role="tab" aria-selected={track === t.id} aria-controls="track-panel" className={`track-tab tr-${t.id}`} onClick={() => setTrack(t.id)}>
            <Icon name={TRACK_ICON[t.id]} size={22} />
            <span>{t.name}</span>
          </button>
        ))}
      </div>

      <div id="track-panel" role="tabpanel" className={`track-panel tr-${track}`}>
        <div className="track-banner">
          <h2 className="track-name">{trackById(track).name}</h2>
          <p className="track-about">{trackById(track).about}</p>
        </div>
        {track !== nextAct.track && <TrackPick list={list} starsFor={starsFor} started={started} onOpen={setOpen} />}
        <ol className="nodes" aria-label={`${trackById(track).name} steps`}>
          {list.map((a, i) => {
            const here = a.id === nextId;
            const stars = starsFor(a);
            const state = stars === 3 ? 'done' : stars > 0 ? 'started' : 'new';
            const project = a.kind === 'project';
            return (
              <li key={a.id} className={`node-li${here ? ' is-here' : ''}`} style={{ '--off': ZIG[i % ZIG.length] } as React.CSSProperties}>
                {here && (
                  <span className="node-bubble" aria-hidden="true">
                    {stars ? 'Carry on' : 'Start'}
                  </span>
                )}
                <button
                  type="button"
                  className={`node node-${state}${project ? ' node-project' : ''}${here ? ' node-here' : ''}`}
                  aria-label={`Step ${i + 1}: ${titleOf(a.id)}. ${project ? (stars ? 'Started' : 'Project') : `${stars} of 3 stars`}${here ? '. Up next' : ''}`}
                  aria-haspopup="dialog"
                  onClick={() => setOpen(a.id)}
                >
                  <Icon name={state === 'done' ? 'check' : project ? 'music' : a.instrument === 'drums' ? 'drum' : a.instrument === 'keyboard' ? 'piano' : TRACK_ICON[a.track]} size={34} />
                </button>
                <span className="node-label">{titleOf(a.id)}</span>
                {!project && <Stars n={stars} size={14} />}
              </li>
            );
          })}
        </ol>
      </div>

      {open && <StopSheet id={open} stars={starsFor(activityById(open)!)} started={started} onClose={() => setOpen(null)} go={go} />}
    </div>
  );
}

function StopSheet({ id, stars, started, onClose, go }: { id: string; stars: number; started: (id: string) => boolean; onClose: () => void; go: (r: string) => void }) {
  const a = activityById(id)!;
  const pos = positionInTrack(id)!;
  const l = lessonById(id);
  const m = missionById(id);
  const after = trackActivities(a.track)[pos.index];
  const first = a.prerequisites.filter((p) => !started(p)).map(titleOf);
  const btn = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    btn.current?.focus();
    const k = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [onClose]);
  const controls = Object.entries(a.controls)
    .map(([inst, c]) => (a.instrument === 'either' ? `${inst === 'drums' ? 'Drums' : 'Piano'}: ${c}` : c))
    .join(' · ');
  // Portal: the page sheet is its own stacking layer, so this would sit under the tab bar.
  return createPortal(
    <div className="stop-sheet-wrap" onClick={onClose}>
      <div className={`stop-sheet tr-${a.track}`} role="dialog" aria-modal="true" aria-labelledby="stop-h" onClick={(e) => e.stopPropagation()}>
        <div className="resume-top">
          <TrackTag id={a.track} />
          {a.kind === 'project' && <span className="kicker">Project</span>}
        </div>
        <h2 id="stop-h" className="stop-sheet-title">
          {titleOf(id)}
        </h2>
        <p className="stop-sheet-sub">{blurb(id, (l ?? m)?.objective ?? a.learn)}</p>
        <TrackProgress id={id} at={pos.index} done={(x) => started(x)} />
        {a.kind === 'lesson' && <Stars n={stars} size={28} />}
        <dl className="stop-facts">
          <div>
            <dt>You’ll learn</dt>
            <dd>{a.learn}</dd>
          </div>
          <div>
            <dt>Play on</dt>
            <dd>
              <InstrumentLine a={a} />
              <span className="facts-sub">{controls}</span>
            </dd>
          </div>
          <div>
            <dt>Music</dt>
            <dd>
              <Level n={a.level} /> <span className="facts-sub">{READING[a.reading]} · {INPUT[a.input]}</span>
            </dd>
          </div>
        </dl>
        {first.length > 0 && <p className="stop-sheet-note">Helps to try first: {first.join(', ')}</p>}
                <button ref={btn} type="button" className="btn btn-big btn-block" onClick={() => go(a.kind === 'lesson' ? `#/lesson/${id}` : `#/mission/${id}`)}>
          {stars === 3 ? 'Play again' : stars ? 'Keep going' : 'Start'}
        </button>
        {after && <p className="stop-sheet-after">After this: {titleOf(after.id)}</p>}
        <button type="button" className="btn-text" onClick={onClose}>
          Not now
        </button>
      </div>
    </div>,
    document.body,
  );
}

/** When you switch tracks: where to begin in this one, and why, in one plain line. */
function TrackPick({ list, starsFor, started, onOpen }: { list: Activity[]; starsFor: (a: Activity) => number; started: (id: string) => boolean; onOpen: (id: string) => void }) {
  const ready = list.find((a) => starsFor(a) < 3 && a.prerequisites.every(started));
  const pick = ready ?? list.find((a) => starsFor(a) < 3) ?? list[0];
  const stars = starsFor(pick);
  const missing = pick.prerequisites.filter((p) => !started(p));
  // Nothing here is ready yet: point to what it builds on, and say why.
  if (!ready && missing.length && !stars)
    return (
      <button type="button" className="track-pick" onClick={() => onOpen(missing[0])}>
        <span className="kicker">Try this first</span>
        <span className="track-pick-title">{titleOf(missing[0])}</span>
        <span className="track-pick-why">{titleOf(pick.id)} builds on it.</span>
      </button>
    );
  const why = stars ? 'You started this one.' : pick === list[0] ? 'The first step here.' : 'You’ve tried what it builds on.';
  return (
    <button type="button" className="track-pick" onClick={() => onOpen(pick.id)}>
      <span className="kicker">{stars ? 'Carry on here' : 'Start here'}</span>
      <span className="track-pick-title">{titleOf(pick.id)}</span>
      <span className="track-pick-why">{why}</span>
    </button>
  );
}
