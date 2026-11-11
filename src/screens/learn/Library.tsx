// The Learn library (direction A, "expressive editorial", chosen by momo 10 Nov): the next lesson,
// units as numbered chapters, and Compose and create as its own section. See docs/DESIGN_DIRECTION.md.
import type { Activity } from '../../data/curriculum.ts';
import type { InstrumentId, Phrase } from '../../music/events.ts';
import { Icon } from '../../ui/icons.tsx';
import { Notation } from '../../ui/Notation.tsx';
import { FromTeacher } from '../MyClass.tsx';
import { LearnTabs } from '../LearnScreen.tsx';

export interface LibItem {
  a: Activity;
  title: string;
  stars: number;
  state: 'new' | 'started' | 'done';
  here: boolean;
  preview: Phrase | null;
  open: () => void;
  info: () => void;
}
export interface Library {
  inst: InstrumentId;
  setInst: (i: InstrumentId) => void;
  next: LibItem & { why: string };
  units: { id: string; track: string; title: string; about: string; items: LibItem[] }[];
  projects: LibItem[];
  go: (r: string) => void;
}

/** Says what the button does: the first thing the learner will actually do in that activity
 *  (brief 11 Nov, section 6: no "Try the rhythm" on lessons that are not about rhythm). */
const FIRST_ACTION: Record<string, string> = {
  L00: 'Explore sounds',
  N01: 'Hear the example',
  B00: 'Tap the beat',
  L01: 'Tap the beat',
  L02: 'Practise counted rests',
  L03: 'Practise crotchets and quavers',
  L07: 'Practise minims and crotchets',
  L04: 'Hear high and low',
  L05: 'Find the notes',
  S01: 'Hear C and C♯',
  P01: 'Start playing',
  P02: 'Start playing',
  L06: 'Read the notes',
  L08: 'Read the melody',
  P03: 'Read the notes',
  D01: 'Start playing',
  D02: 'Start playing',
  D03: 'Start playing',
};
/** The first action of an activity, before the learner has started it. */
export function actionLabelFor(a: Activity): string {
  if (a.kind === 'project' || a.input === 'make') return 'Start composing';
  return FIRST_ACTION[a.id] ?? 'Start';
}
export function actionLabel(i: LibItem): string {
  if (i.state === 'done') return 'Review';
  if (i.state === 'started') return 'Continue';
  if (i.a.kind === 'project' || i.a.input === 'make') return 'Start composing';
  return FIRST_ACTION[i.a.id] ?? 'Start';
}
const STATUS = { new: 'Not started', started: 'In progress', done: 'Completed' } as const;
const PROJECT_STATUS = { new: 'Not started', started: 'Saved', done: 'Saved' } as const;
const STATUS_ICON = { new: 'ring', started: 'half', done: 'good' } as const;

function Status({ i }: { i: LibItem }) {
  return (
    <span className={`lx-status st-${i.state}`}>
      <Icon name={STATUS_ICON[i.state]} size={16} /> {(i.a.kind === 'project' ? PROJECT_STATUS : STATUS)[i.state]}
    </span>
  );
}

function Action({ i, quiet }: { i: LibItem; quiet?: boolean }) {
  return (
    <button type="button" className={quiet || i.state === 'done' ? 'lx-btn lx-btn-quiet' : 'lx-btn'} onClick={i.open}>
      {actionLabel(i)}
      <span className="sr-only">: {i.title}</span>
    </button>
  );
}

function Details({ i }: { i: LibItem }) {
  return (
    <button type="button" className="lx-link" onClick={i.info} aria-haspopup="dialog">
      What you’ll learn<span className="sr-only">: {i.title}</span>
    </button>
  );
}

const TRACK_ICON = { foundations: 'click', piano: 'piano', drums: 'drum', create: 'music' } as const;

function Preview({ p, track }: { p: Phrase | null; track?: string }) {
  if (!p || !p.events.length)
    return track ? (
      <div className="lx-preview lx-preview-icon" aria-hidden="true">
        <Icon name={TRACK_ICON[track as keyof typeof TRACK_ICON] ?? 'music'} size={48} />
      </div>
    ) : null;
  return (
    <div className="lx-preview" aria-hidden="true">
      <Notation phrase={p} />
    </div>
  );
}

function InstrumentChoice({ lib }: { lib: Library }) {
  const opts: [InstrumentId, string][] = [
    ['keyboard', 'Piano'],
    ['drums', 'Drums'],
  ];
  return (
    <div className="lx-inst lx-inst-words" role="radiogroup" aria-label="Learn on">
      {opts.map(([id, name]) => (
        <button key={id} type="button" role="radio" aria-checked={lib.inst === id} className={`lx-inst-opt inst-${id}`} onClick={() => lib.setInst(id)}>
          <span className="lx-inst-name">
            <Icon name={id === 'keyboard' ? 'piano' : 'drum'} size={24} /> {name}
          </span>
          {lib.inst === id && (
            <span className="lx-chosen">
              <Icon name="check" size={16} /> Chosen
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

const two = (n: number) => String(n + 1).padStart(2, '0');

export function LearnLibrary({ lib }: { lib: Library }) {
  const n = lib.next;
  return (
    <div className="screen lx lx-a">
      <header className="lxa-head">
        <h1 className="lx-display lxa-title">Learn</h1>
        <LearnTabs at="path" go={lib.go} />
        <InstrumentChoice lib={lib} />
      </header>
      <FromTeacher go={lib.go} />
      <section className={`lxa-feature tr-${n.a.track}`} aria-labelledby="lxa-next">
        <div className="lxa-feature-text">
          <p className="lx-kicker">{n.state === 'started' ? 'Carry on' : 'Up next'}</p>
          <h2 id="lxa-next" className="lx-display lxa-feature-title">
            {n.title}
          </h2>
          <p className="lxa-feature-desc">{n.a.learn}</p>
          {n.why && <p className="lx-why">{n.why}</p>}
          <div className="lx-row">
            <Action i={n} />
            <Details i={n} />
          </div>
        </div>
        {n.preview && n.preview.events.length > 0 && (
          <div className="lxa-feature-score">
            <Preview p={n.preview} />
          </div>
        )}
      </section>
      {lib.units.map((u, ui) => {
        const done = u.items.filter((i) => i.state === 'done').length;
        return (
          <section key={u.id} className={`lxa-unit tr-${u.track}`} aria-labelledby={`lxa-u${ui}`}>
            <div className="lxa-unit-head">
              <span className="lxa-num" aria-hidden="true">
                {two(ui)}
              </span>
              <div className="lxa-unit-words">
                <p className="lx-kicker">Unit {ui + 1}</p>
                <h2 id={`lxa-u${ui}`} className="lx-display lxa-unit-title">
                  {u.title}
                </h2>
                <p className="lx-about">{u.about}</p>
                <div className="lxa-unit-progress">
                  <span className="lxa-bar" role="progressbar" aria-label={`${u.title}: concepts explored`} aria-valuemin={0} aria-valuemax={u.items.length} aria-valuenow={done}>
                    <span style={{ width: `${(done / Math.max(1, u.items.length)) * 100}%` }} />
                  </span>
                  <span className="lxa-count">
                    {done} of {u.items.length} explored
                  </span>
                </div>
              </div>
            </div>
            <ol className="lxa-list">
              {u.items.map((i) => (
                <li key={i.a.id} className={`lxa-item is-${i.state}${i.here ? ' is-next' : ''}`}>
                  <div className="lxa-item-text">
                    {i.here && <span className="lxa-upnext">Up next</span>}
                    <h3 className="lx-item-title">{i.title}</h3>
                    <p className="lx-desc">{i.a.learn}</p>
                    <Status i={i} />
                  </div>
                  <div className="lxa-item-act">
                    <Action i={i} quiet={!i.here} />
                    <Details i={i} />
                  </div>
                </li>
              ))}
            </ol>
          </section>
        );
      })}
      {lib.projects.length > 0 && (
        <section className="lxa-create" aria-labelledby="lxa-create">
          <div className="lxa-create-head">
            <h2 id="lxa-create" className="lx-display lxa-create-title">
              Compose and create
            </h2>
            <p className="lxa-create-lede">Listen to an idea, then create a musical reply.</p>
            <p className="lxa-create-note">Your music projects: experiment, save and improve your ideas. These projects aren’t scored.</p>
          </div>
          <ul className="lxa-create-list">
            {lib.projects.map((i) => (
              <li key={i.a.id}>
                <h3 className="lx-item-title">{i.title}</h3>
                <p className="lx-desc">{i.a.learn}</p>
                <div className="lx-row">
                  <Action i={i} />
                  <Details i={i} />
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
