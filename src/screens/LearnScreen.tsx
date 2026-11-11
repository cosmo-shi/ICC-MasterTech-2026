import { guidedById } from '../data/guided.ts';
import { lessonStars, nextFor, reasonText } from '../ai/learner.ts';
import { useState } from 'react';
import { blurb, lessonById, missionById } from '../data/catalog.ts';
import { type Activity, type TrackId, activityById, lessonFor, positionInTrack, trackActivities, trackById } from '../data/curriculum.ts';
import { LearnLibrary, type LibItem, type Library } from './learn/Library.tsx';
import { Icon, type IconName, type IconSize } from '../ui/icons.tsx';
import { Dialog } from '../ui/Dialog.tsx';
import { useMyLearning } from '../ui/useAttempts.ts';
import { usePrefs } from '../state/prefs.tsx';
import type { InstrumentId } from '../music/events.ts';
/** Three marks: had a go, matched with practice, matched on your own. A shape for each, never colour alone. */
export function Stars({ n, size = 16 }: { n: number; size?: IconSize }) {
  return (
    <span className="stars" role="img" aria-label={`${n} of 3`}>
      {[0, 1, 2].map((i) => (
        <span key={i} className={i < n ? 'star-on' : 'star-off'}>
          <Icon name={i < n ? "good" : "missed"} size={size} />
        </span>
      ))}
    </span>
  );
}

export function LearnTabs({ at, go }: { at: 'path' | 'theory'; go: (r: string) => void }) {
  return (
    <div className="segmented learn-tabs" role="tablist" aria-label="Learn">
      <button type="button" role="tab" aria-selected={at === 'path'} className="segment" onClick={() => go('#/learn')}>
        <Icon name="learn" size={20} /> Lessons
      </button>
      <button type="button" role="tab" aria-selected={at === 'theory'} className="segment" onClick={() => go('#/theory')}>
        <Icon name="notes" size={20} /> Music theory
      </button>
    </div>
  );
}

export const TRACK_ICON: Record<TrackId, IconName> = { foundations: 'click', piano: 'piano', drums: 'drum', create: 'music' };
export const titleOf = (id: string) => guidedById(id)?.title ?? lessonById(id)?.title ?? missionById(id)?.title ?? id;

const READING: Record<Activity['reading'], string> = { none: 'Listen and copy', symbols: 'Rhythm symbols', stave: 'Notes on the stave' };
const INPUT: Record<Activity['input'], string> = { tap: 'Tap in time', keys: 'Find the keys', hold: 'Hold keys down', make: 'Make your own' };

/** Which instrument, in words a child can scan. Shared ideas say both. */
export function InstrumentLine({ a }: { a: Activity }) {
  if (a.instrument === 'either')
    return (
      <span className="inst-line">
        <Icon name="drum" size={20} />
        <Icon name="piano" size={20} />
        Drums or piano
      </span>
    );
  return (
    <span className="inst-line">
      <Icon name={a.instrument === 'drums' ? 'drum' : 'piano'} size={20} />
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

/** Units of each instrument, in teaching order (brief 11 Nov, section 4): sounds before notes, hearing
 *  before naming, the beat before rhythm symbols, notation after both. Units list activity ids, so a
 *  unit can draw on more than one track. Compose and create is its own section. */
export interface Unit {
  id: string;
  title: string;
  about: string;
  /** Track colour for the unit block. */
  track: TrackId;
  ids: string[];
}
export const UNITS: Record<InstrumentId, Unit[]> = {
  keyboard: [
    { id: 'u-sound', track: 'foundations', title: 'Sounds, silence and musical choices', about: 'Make a sound, stop it and change it.', ids: ['L00'] },
    { id: 'u-pitch', track: 'piano', title: 'Discovering notes and pitch', about: 'Start by hearing how notes can sound higher or lower. Later, learn how musicians name and write them.', ids: ['N01', 'L04', 'L05', 'P01', 'P02', 'S01'] },
    { id: 'u-beat', track: 'foundations', title: 'Feel the beat', about: 'Tap a steady beat, then make rhythms with sounds and silences.', ids: ['B00', 'L01', 'L02', 'L03', 'L07'] },
    { id: 'u-read', track: 'piano', title: 'Reading music', about: 'Read notes on the stave and play them.', ids: ['L06', 'L08', 'P03'] },
  ],
  drums: [
    { id: 'u-sound', track: 'foundations', title: 'Sounds, silence and musical choices', about: 'Make a sound, stop it and change it.', ids: ['L00'] },
    { id: 'u-beat', track: 'foundations', title: 'Feel the beat', about: 'Tap a steady beat, then make rhythms with sounds and silences.', ids: ['B00', 'L01', 'L02', 'L03'] },
    { id: 'u-kit', track: 'drums', title: 'Grooves on the kit', about: 'Rock beat, hi-hat and fills.', ids: ['D01', 'D02', 'D03'] },
  ],
};
const CREATE_IDS: Record<InstrumentId, string[]> = {
  keyboard: ['L09', 'F_SOUND_STORY', 'P34_MELODIC_REPLY', 'P56_FORM_AND_TEXTURE', 'OLDER_EXTENSION'],
  drums: ['L09', 'F_SOUND_STORY', 'P12_RHYTHMIC_CONVERSATION', 'P56_FORM_AND_TEXTURE', 'OLDER_EXTENSION'],
};
const onInstrument = (a: Activity, inst: InstrumentId) => a.instrument === 'either' || a.instrument === inst;

export function LearnScreen({ go }: { go: (r: string) => void }) {
  const { attempts, planning, overrides, context } = useMyLearning();
  const { prefs, set } = usePrefs();
  const plan = nextFor(planning, overrides, context());
  const nextId = plan.next?.lessonId ?? 'L00';
  const nextAct = activityById(nextId)!;
  const [inst, setInst] = useState<InstrumentId>(nextAct.instrument === 'either' ? prefs.instrument : nextAct.instrument);
  const [open, setOpen] = useState<string | null>(null);

  const started = (id: string) => attempts.some((a) => a.activityId === id);
  const starsFor = (a: Activity) => (a.kind === 'lesson' ? lessonStars(attempts, a.id) : started(a.id) ? 3 : 0);
  // Shown only when it is evidence (the model ran on this child's tries) or a teacher's choice.
  const why = plan.teacher ? 'Your teacher picked this for you.' : plan.provenance === 'learner-model' ? reasonText(plan) : '';
  const openLesson = (id: string) => {
    const a = activityById(id)!;
    if (a.instrument === 'either') set('instrument', inst);
    go(a.kind === 'lesson' ? `#/lesson/${id}` : `#/mission/${id}`);
  };

  // One library object drives the screen: same data as the progress model, see learn/Library.tsx.
  const item = (a: Activity): LibItem => {
    const stars = starsFor(a);
    const project = a.kind === 'project';
    const state = project ? (stars ? 'started' : 'new') : stars === 3 ? 'done' : stars > 0 ? 'started' : 'new';
    const base = lessonById(a.id);
    return { a, title: titleOf(a.id), stars, state, here: a.id === nextId, preview: base ? (lessonFor(base, inst).practice ?? null) : null, open: () => openLesson(a.id), info: () => setOpen(a.id) };
  };
  const lib: Library = {
    inst,
    setInst: (i) => {
      setInst(i);
      set('instrument', i);
    },
    next: { ...item(nextAct), why },
    units: UNITS[inst].map((u) => ({ ...u, items: u.ids.map((id) => activityById(id)).filter((x): x is Activity => !!x && onInstrument(x, inst)).map(item) })),
    // Composing gets its own section: the create lesson and every creative project for this instrument.
    projects: CREATE_IDS[inst].map((id) => activityById(id)).filter((x): x is Activity => !!x && onInstrument(x, inst)).map(item),
    go,
  };
  return (
    <>
      <LearnLibrary lib={lib} />
      {open && <StopSheet id={open} stars={starsFor(activityById(open)!)} started={started} onClose={() => setOpen(null)} go={(r) => (r.startsWith('#/lesson/') || r.startsWith('#/mission/') ? openLesson(open) : go(r))} />}
    </>
  );
}

function StopSheet({ id, stars, started, onClose, go }: { id: string; stars: number; started: (id: string) => boolean; onClose: () => void; go: (r: string) => void }) {
  const a = activityById(id)!;
  const pos = positionInTrack(id)!;
  const l = lessonById(id);
  const m = missionById(id);
  const after = trackActivities(a.track)[pos.index];
  const first = a.prerequisites.filter((p) => !started(p)).map(titleOf);
  const controls = Object.entries(a.controls)
    .map(([inst, c]) => (a.instrument === 'either' ? `${inst === 'drums' ? 'Drums' : 'Piano'}: ${c}` : c))
    .join(' · ');
  return (
    <Dialog open onClose={onClose} labelledBy="stop-h" className={`stop-dlg tr-${a.track}`}>
      <div className="dlg-body stop-sheet">
        <div className="resume-top">
          <TrackTag id={a.track} />
          {a.kind === 'project' && <span className="kicker">Project</span>}
        </div>
        <h2 id="stop-h" className="stop-sheet-title" tabIndex={-1}>
          {titleOf(id)}
        </h2>
        <p className="stop-sheet-sub">{blurb(id, (l ?? m)?.objective ?? a.learn)}</p>
        <TrackProgress id={id} at={pos.index} done={(x) => started(x)} />
        {a.kind === 'lesson' && <Stars n={stars} size={32} />}
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
                <button type="button" className="btn btn-big btn-block" data-autofocus onClick={() => go(a.kind === 'lesson' ? `#/lesson/${id}` : `#/mission/${id}`)}>
          {stars === 3 ? 'Play again' : stars ? 'Keep going' : 'Start'}
        </button>
        {after && <p className="stop-sheet-after">After this: {titleOf(after.id)}</p>}
        <button type="button" className="btn-text" onClick={onClose}>
          Not now
        </button>
      </div>
    </Dialog>
  );
}

