// Three compositions of the Learn screen for design review (?look=a|b|c). Same data, same
// actions, same palette; different structure. See docs/DESIGN_DIRECTION.md.
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

function InstrumentChoice({ lib, variant }: { lib: Library; variant: 'words' | 'tiles' | 'studio' }) {
  const opts: [InstrumentId, string, string][] = [
    ['keyboard', 'Piano', 'Notes, the stave and melodies'],
    ['drums', 'Drums', 'Beat, rhythm and grooves'],
  ];
  return (
    <div className={`lx-inst lx-inst-${variant}`} role="radiogroup" aria-label="Learn on">
      {opts.map(([id, name, about]) => (
        <button key={id} type="button" role="radio" aria-checked={lib.inst === id} className={`lx-inst-opt inst-${id}`} onClick={() => lib.setInst(id)}>
          <span className="lx-inst-name">
            <Icon name={id === 'keyboard' ? 'piano' : 'drum'} size={24} /> {name}
          </span>
          {variant !== 'words' && <span className="lx-inst-about">{about}</span>}
          {variant === 'studio' && id === 'keyboard' && (
            <span className="lx-keys" aria-hidden="true">
              {[0, 1, 2, 3, 4, 5, 6].map((k) => (
                <i key={k} className={k === 0 || k === 1 || k === 3 || k === 4 || k === 5 ? 'has-black' : ''} />
              ))}
            </span>
          )}
          {variant === 'studio' && id === 'drums' && (
            <span className="lx-pads" aria-hidden="true">
              <i>Bass drum</i>
              <i>Snare</i>
              <i>Hi-hat</i>
            </span>
          )}
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

/* ---------- A: Expressive editorial ---------- */
function LookA({ lib }: { lib: Library }) {
  const n = lib.next;
  return (
    <div className="screen lx lx-a">
      <header className="lxa-head">
        <h1 className="lx-display lxa-title">Learn</h1>
        <LearnTabs at="path" go={lib.go} />
        <InstrumentChoice lib={lib} variant="words" />
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
            <p className="lxa-create-lede">Make your own music. Nothing here is marked: try ideas, listen back, keep what you like.</p>
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

/* ---------- B: Contemporary music studio ---------- */
function LookB({ lib }: { lib: Library }) {
  const n = lib.next;
  return (
    <div className="screen lx lx-b">
      <header className="lxb-head">
        <h1 className="lx-display">Learn</h1>
        <LearnTabs at="path" go={lib.go} />
      </header>
      <InstrumentChoice lib={lib} variant="studio" />
      <FromTeacher go={lib.go} />
      <section className="lxb-feature" aria-labelledby="lxb-next">
        <div className="lxb-feature-top">
          <p className="lx-kicker">{n.state === 'new' ? 'Next lesson' : 'Carry on'}</p>
          <h2 id="lxb-next" className="lx-display lxb-feature-title">
            {n.title}
          </h2>
          <p className="lxb-feature-desc">{n.a.learn}</p>
        </div>
        <div className="lxb-score">
          <Preview p={n.preview} track={n.a.track} />
        </div>
        <div className="lx-row lxb-feature-act">
          <Action i={n} />
          <Details i={n} />
          {n.why && <p className="lx-why">{n.why}</p>}
        </div>
      </section>
      {lib.units.map((u, ui) => {
        const done = u.items.filter((i) => i.state === 'done').length;
        return (
          <section key={u.track} className={`lxb-unit tr-${u.track}`} aria-labelledby={`lxb-u${ui}`}>
            <div className="lxb-unit-side">
              <h2 id={`lxb-u${ui}`} className="lx-display lxb-unit-title">
                {u.title}
              </h2>
              <p className="lx-about">{u.about}</p>
              <p className="lxb-count">
                {done} of {u.items.length} completed
              </p>
            </div>
            <ol className="lxb-list">
              {u.items.map((i) => (
                <li key={i.a.id} className={`lxb-item is-${i.state}${i.here ? ' is-next' : ''}`}>
                  <div className="lxb-item-text">
                    <h3 className="lx-item-title">{i.title}</h3>
                    <p className="lx-desc">{i.a.learn}</p>
                    <Status i={i} />
                  </div>
                  <Preview p={i.preview} />
                  <div className="lxb-item-act">
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
        <section className="lxb-studio" aria-labelledby="lxb-create">
          <h2 id="lxb-create" className="lx-display lxb-studio-title">
            Compose and create
          </h2>
          <p className="lxb-studio-lede">Your studio. These projects are for trying ideas; they are described, not marked.</p>
          <ul className="lxb-studio-list">
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

/* ---------- C: Playful modular ---------- */
function LookC({ lib }: { lib: Library }) {
  const n = lib.next;
  return (
    <div className="screen lx lx-c">
      <header className="lxc-head">
        <h1 className="lx-display">Learn</h1>
        <LearnTabs at="path" go={lib.go} />
      </header>
      <div className="lxc-top">
        <section className={`lxc-feature tr-${n.a.track}`} aria-labelledby="lxc-next">
          <p className="lx-kicker">{n.state === 'new' ? 'Up next' : 'Carry on'}</p>
          <h2 id="lxc-next" className="lx-display lxc-feature-title">
            {n.title}
          </h2>
          <p className="lxc-feature-desc">{n.a.learn}</p>
          <Preview p={n.preview} track={n.a.track} />
          <div className="lx-row">
            <Action i={n} />
            <Details i={n} />
          </div>
        </section>
        <InstrumentChoice lib={lib} variant="tiles" />
      </div>
      <FromTeacher go={lib.go} />
      <div className="lxc-modules">
        {lib.units.map((u, ui) => (
          <section key={u.track} className={`lxc-unit tr-${u.track}`} aria-labelledby={`lxc-u${ui}`}>
            <h2 id={`lxc-u${ui}`} className="lx-display lxc-unit-title">
              {u.title}
            </h2>
            <p className="lx-about">{u.about}</p>
            <ol className="lxc-list">
              {u.items.map((i) => (
                <li key={i.a.id} className={`lxc-item is-${i.state}${i.here ? ' is-next' : ''}`}>
                  <span className="lxc-badge" aria-hidden="true">
                    <Icon name={STATUS_ICON[i.state]} size={20} />
                  </span>
                  <div className="lxc-item-text">
                    <h3 className="lx-item-title">{i.title}</h3>
                    <p className="lx-desc">{i.a.learn}</p>
                    <Status i={i} />
                  </div>
                  <div className="lxc-item-act">
                    <Action i={i} quiet={!i.here} />
                    <Details i={i} />
                  </div>
                </li>
              ))}
            </ol>
          </section>
        ))}
      </div>
      {lib.projects.length > 0 && (
        <section className="lxc-create" aria-labelledby="lxc-create">
          <h2 id="lxc-create" className="lx-display lxc-create-title">
            Compose and create
          </h2>
          <p className="lxc-create-lede">Make it your way. No marks, just ideas to try and listen to.</p>
          <ul className="lxc-create-list">
            {lib.projects.map((i, k) => (
              <li key={i.a.id} className={`lxc-proj shape-${k % 3}`}>
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

export function LearnLook({ look, lib }: { look: 'a' | 'b' | 'c'; lib: Library }) {
  return look === 'a' ? <LookA lib={lib} /> : look === 'b' ? <LookB lib={lib} /> : <LookC lib={lib} />;
}
