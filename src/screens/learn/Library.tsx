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
  units: { track: string; title: string; about: string; items: LibItem[] }[];
  projects: LibItem[];
  go: (r: string) => void;
}

/** Says what the button does: the first thing the learner will actually do. */
export function actionLabel(i: LibItem): string {
  if (i.state === 'done') return 'Practise again';
  if (i.state === 'started') return 'Continue';
  if (i.a.kind === 'project') return 'Start composing';
  return { tap: 'Try the rhythm', keys: 'Find the notes', hold: 'Start playing', make: 'Start composing' }[i.a.input];
}
const STATUS = { new: 'Not started', started: 'In progress', done: 'Completed' } as const;
const STATUS_ICON = { new: 'ring', started: 'half', done: 'good' } as const;

function Status({ i }: { i: LibItem }) {
  return (
    <span className={`lx-status st-${i.state}`}>
      <Icon name={STATUS_ICON[i.state]} size={16} /> {STATUS[i.state]}
      {i.state === 'started' && i.a.kind === 'lesson' ? ` · ${i.stars} of 3` : ''}
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
      Lesson details<span className="sr-only">: {i.title}</span>
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
          <p className="lx-kicker">{n.state === 'new' ? 'Your next lesson' : 'Carry on'}</p>
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
        <div className="lxa-feature-score">
          <Preview p={n.preview} track={n.a.track} />
        </div>
      </section>
      {lib.units.map((u, ui) => (
        <section key={u.track} className={`lxa-unit tr-${u.track}`} aria-labelledby={`lxa-u${ui}`}>
          <div className="lxa-unit-head">
            <span className="lxa-num" aria-hidden="true">
              {two(ui)}
            </span>
            <div>
              <h2 id={`lxa-u${ui}`} className="lx-display lxa-unit-title">
                {u.title}
              </h2>
              <p className="lx-about">{u.about}</p>
            </div>
          </div>
          <ol className="lxa-list">
            {u.items.map((i) => (
              <li key={i.a.id} className={`lxa-item is-${i.state}${i.here ? ' is-next' : ''}`}>
                <div className="lxa-item-text">
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
      ))}
      {lib.projects.length > 0 && (
        <section className="lxa-create" aria-labelledby="lxa-create">
          <div className="lxa-create-head">
            <h2 id="lxa-create" className="lx-display lxa-create-title">
              Compose and create
            </h2>
            <p className="lxa-create-lede">Write and play your own music.</p>
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
