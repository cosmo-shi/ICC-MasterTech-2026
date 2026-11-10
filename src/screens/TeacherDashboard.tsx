import { useMemo, useState } from 'react';
import { BAND_WORDS, type Band, learnerFrom, nextFor, reasonText, SKILLS, type SkillEstimate, type SkillId, skillById, suggestGroups, teacherOverrides, LESSON_INFOS, type TeacherOverrides } from '../ai/learner.ts';
import { ACTIVITIES, routeFrom } from '../data/curriculum.ts';
import { type AttemptRecord, type CompositionRecord, newId, stamp, store } from '../store/db.ts';
import { type Player, players, usePlayers } from '../store/profiles.ts';
import { Icon } from '../ui/icons.tsx';
import { isNote, useAllRecords, useOverrides } from '../ui/useAttempts.ts';
import { usePlayer } from '../ui/usePlayer.ts';
import { Avatar } from './EntryScreen.tsx';
import { titleOf } from './LearnScreen.tsx';
import { usePrefs } from '../state/prefs.tsx';
import { traceLearner } from '../ai/trace.ts';
import { SUPPORTS, type SupportId } from '../ai/checkin.ts';
import { TEST_DATA } from '../fixtures/testMode.ts';

const DAY = 864e5;

/** What a teacher could try, per skill. Teacher-facing; drafts pending educator review. */
const TEACHER_MOVES: Record<SkillId, string> = {
  pulse: 'March or pat the beat together first, then play along at a slower tempo with the metronome.',
  rests: 'Say the rhythm aloud with a silent gesture (hands open) on each rest before playing.',
  subdivision: 'Chant “ta ta ti-ti ta” while patting the beat, then move it to the drum or key.',
  pitch: 'Find the pairs of black keys together; C is always just to the left of a pair. Sing the notes before playing.',
  reading: 'Point to each note as you both say its letter, then play slowly without the metronome.',
  duration: 'Count the minim aloud (“1-2”) while holding the key down, then let them count.',
};

export interface ChildLearning {
  player: Player;
  attempts: AttemptRecord[];
  notes: AttemptRecord[];
  pieces: CompositionRecord[];
  estimates: SkillEstimate[];
  overrides: TeacherOverrides;
  /** What the child is offered next, and why (model, teacher or route). */
  next?: { id: string; why: string; by: 'model' | 'teacher' | 'route' };
  lastAt?: number;
}

export function useClassLearning(): { children: ChildLearning[]; unowned: number } {
  const { attempts, pieces } = useAllRecords();
  const { players: list } = usePlayers();
  const all = useOverrides();
  const { prefs } = usePrefs();
  return useMemo(() => {
    const children = list.map((p): ChildLearning => {
      const mine = attempts.filter((a) => a.profileId === p.id);
      const real = mine.filter((a) => !isNote(a));
      const ovr = all[p.id] ?? { skills: {} };
      const m = learnerFrom(real, ovr);
      const plan = nextFor(m.planning, ovr, { infos: LESSON_INFOS, route: routeFrom(p.start ?? null), aiEnabled: prefs.aiEnabled });
      const by = plan.teacher ? 'teacher' : plan.provenance === 'learner-model' ? 'model' : 'route';
      return {
        player: p,
        attempts: real,
        notes: mine.filter(isNote),
        pieces: pieces.filter((c) => c.profileId === p.id),
        estimates: m.estimates,
        overrides: ovr,
        next: plan.next && { id: plan.next.lessonId, why: by === 'teacher' ? 'You chose this.' : by === 'model' ? reasonText(plan) : 'Next on their route.', by },
        lastAt: real[0]?.createdAt,
      };
    });
    const unowned = attempts.filter((a) => !a.profileId && !isNote(a)).length;
    return { children, unowned };
  }, [attempts, pieces, list, all, prefs.aiEnabled]);
}

/** Dash, open, half or full circle, so the band never relies on colour alone. */
const BAND_ICON = { new: 'minus', growing: 'ring', nearly: 'half', secure: 'good' } as const;
function BandDot({ b }: { b: Band }) {
  return <Icon name={BAND_ICON[b]} size={16} className="st-dot" />;
}

function BandCell({ e }: { e?: SkillEstimate }) {
  const b = e?.band ?? 'new';
  return (
    <span className={`st st-${b}`}>
      <BandDot b={e?.override === 'secure' ? 'secure' : b} /> {e?.override ? (e.override === 'secure' ? 'Secure (you)' : 'Practise (you)') : BAND_WORDS[b]}
    </span>
  );
}

/** Children the model says need practice on a skill after repeated tries. */
function needsHand(c: ChildLearning) {
  const e = [...c.estimates].filter((x) => x.needsPractice && !x.uncertain).sort((x, y) => y.recentFails - x.recentFails)[0];
  if (!e) return null;
  const ids = new Set(e.evidenceAttemptIds);
  const tries = c.attempts.filter((a) => ids.has(a.id));
  const hinted = tries.filter((a) => (a.support?.hintLevel ?? 0) >= 2).length;
  return { skill: e.skill, tries: e.observations, hinted, lesson: c.next?.id };
}

export function ClassView({ openChild, part = 'overview', go }: { openChild: (id: string) => void; part?: 'overview' | 'progress' | 'assign'; go?: (r: string) => void }) {
  const { children, unowned } = useClassLearning();
  const [now] = useState(() => Date.now());
  const active = children.filter((c) => c.lastAt && now - c.lastAt < 7 * DAY).length;
  const stuck = children.map((c) => ({ c, n: needsHand(c) })).filter((x) => x.n);
  const groups = suggestGroups(children.map((c) => ({ id: c.player.id, estimates: c.estimates })));
  const byId = (id: string) => children.find((c) => c.player.id === id)!;

  if (!children.length || children.every((c) => c.attempts.length === 0))
    return (
      <div className="empty-state">
        <h2 className="h2">No practice recorded yet.</h2>
        <p>Start a lesson to record this learner’s practice. Learners are added when someone chooses “New player” on the first screen of this device.</p>
        {go && (
          <button type="button" className="btn" onClick={() => go('#/learn')}>
            Choose a lesson
          </button>
        )}
        {unowned > 0 && <p className="note-text">{unowned} practice attempts were made as a guest and are not linked to anyone.</p>}
      </div>
    );

  if (part === 'assign') return <Assignments children={children} openChild={openChild} />;
  if (part === 'progress') return <ProgressGrid children={children} openChild={openChild} unowned={unowned} />;

  return (
    <div className="dash">
      <ul className="dash-stats" aria-label="This device">
        <li>
          <span className="stat-n">{children.length}</span> learners
        </li>
        <li>
          <span className="stat-n">{active}</span> active learners this week
        </li>
        <li>
          <span className="stat-n">{children.reduce((n, c) => n + c.attempts.length, 0)}</span> practice attempts
        </li>
        <li>
          <span className="stat-n">{children.reduce((n, c) => n + c.pieces.length, 0)}</span> compositions
        </li>
      </ul>

      <section className="dash-block" aria-labelledby="hand-h">
        <h2 id="hand-h" className="h2">
          Review recommended
        </h2>
        {stuck.length === 0 ? (
          <p className="note-text">No review needed right now. A learner appears here when two or more practice attempts show a skill still needs practice.</p>
        ) : (
          <ul className="hand-list">
            {stuck.map(({ c, n }) => (
              <li key={c.player.id} className="hand">
                <button type="button" className="hand-who" onClick={() => openChild(c.player.id)}>
                  <Avatar player={c.player} size={40} />
                  <span>
                    <span className="hand-name">{c.player.name}</span>
                    <span className="hand-skill">
                      {skillById(n!.skill).name} · {n!.tries} practice attempts{n!.hinted ? `, ${n!.hinted} with clues shown` : ''}
                    </span>
                  </span>
                </button>
                <p className="hand-move">
                  <strong>Try:</strong> {TEACHER_MOVES[n!.skill]} {n!.lesson && <span className="muted">Offered next: {titleOf(n!.lesson)}.</span>}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="dash-block" aria-labelledby="groups-h">
        <h2 id="groups-h" className="h2">
          Suggested practice groups
        </h2>
        {groups.length === 0 ? (
          <p className="note-text">Groups appear when two or more children are working on the same skill.</p>
        ) : (
          <ul className="group-list">
            {groups.slice(0, 4).map((g) => (
              <li key={g.skill} className="group">
                <p className="group-skill">{skillById(g.skill).name}</p>
                <p className="group-kids">
                  {g.children.map((id) => (
                    <span key={id} className="group-kid">
                      <Avatar player={byId(id).player} size={28} /> {byId(id).player.name}
                    </span>
                  ))}
                </p>
                <p className="hand-move">{TEACHER_MOVES[g.skill]}</p>
              </li>
            ))}
          </ul>
        )}
      </section>

    </div>
  );
}

/** Skill progress for every learner: a table with a sticky name column on wide screens, a list on phones. */
function ProgressGrid({ children, openChild, unowned }: { children: ChildLearning[]; openChild: (id: string) => void; unowned: number }) {
  const shownSkills = SKILLS;
  return (
    <div className="dash">
      <section className="dash-block" aria-labelledby="grid-h">
        <h2 id="grid-h" className="h2">
          Skill progress
        </h2>
        <p className="note-text">
          <BandDot b="new" /> limited evidence · <BandDot b="growing" /> still learning · <BandDot b="nearly" /> almost secure · <BandDot b="secure" /> secure on their own. Progress is estimated from recorded practice, not a score. Select a name to review the practice behind it.
        </p>
        <div className="table-wrap" tabIndex={0} role="region" aria-label="Skills table (scrolls sideways)">
          <table className="skill-grid">
            <thead>
              <tr>
                <th scope="col">Learner</th>
                {shownSkills.map((s) => (
                  <th key={s.id} scope="col">
                    {s.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {children.map((c) => (
                <tr key={c.player.id}>
                  <th scope="row">
                    <button type="button" className="grid-who" onClick={() => openChild(c.player.id)}>
                      <Avatar player={c.player} size={28} /> {c.player.name}
                    </button>
                  </th>
                  {shownSkills.map((s) => (
                    <td key={s.id}>
                      <BandCell e={c.estimates.find((e) => e.skill === s.id)} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <p className="note-text provenance">
        Progress is estimated from recorded practice. Review a student’s work before changing their learning plan.
        {unowned > 0 && ` ${unowned} guest practice attempts are not included.`}
      </p>
      <ul className="skill-list" aria-label="Skill progress by learner">
        {children.map((c) => (
          <li key={c.player.id}>
            <button type="button" className="grid-who" onClick={() => openChild(c.player.id)}>
              <Avatar player={c.player} size={28} /> {c.player.name}
            </button>
            <dl>
              {shownSkills.map((sk) => (
                <div key={sk.id}>
                  <dt>{sk.name}</dt>
                  <dd>
                    <BandCell e={c.estimates.find((e) => e.skill === sk.id)} />
                  </dd>
                </div>
              ))}
            </dl>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Assignments on this device: what each learner is offered next, and the teacher's choice. */
function Assignments({ children, openChild }: { children: ChildLearning[]; openChild: (id: string) => void }) {
  return (
    <div className="dash">
      <p className="note-text">Choose what each learner sees next on this device. “Let the model suggest” uses their recorded practice.</p>
      <ul className="assign-list">
        {children.map((c) => (
          <li key={c.player.id} className="assign-row">
            <button type="button" className="grid-who" onClick={() => openChild(c.player.id)}>
              <Avatar player={c.player} size={28} /> {c.player.name}
            </button>
            <label className="field">
              <span className="sr-only">Next activity for {c.player.name}</span>
              <select value={c.overrides.next ?? ''} onChange={(e) => teacherOverrides.set(c.player.id, { ...c.overrides, next: e.target.value || undefined })} aria-label={`Next activity for ${c.player.name}`}>
                <option value="">Let the model suggest{c.next && !c.overrides.next ? ` (${titleOf(c.next.id)})` : ''}</option>
                {ACTIVITIES.map((a) => (
                  <option key={a.id} value={a.id}>
                    {titleOf(a.id)}
                  </option>
                ))}
              </select>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}

function supportText(a: AttemptRecord): string {
  if (a.kind === 'check') return `Check: ${a.probe?.check ?? ''}`;
  if (a.kind === 'independent' || a.kind === 'mission-check') return 'On their own';
  const s: string[] = [];
  if (a.support.hintLevel === 3) s.push('answer shown');
  else if (a.support.hintLevel === 2) s.push('clue and keys lit');
  else if (a.support.hintLevel === 1) s.push('question hint');
  if (a.support.slower) s.push('slower');
  if (a.kind === 'mission') s.push('with partner part');
  return s.length ? `Practice: ${s.join(', ')}` : 'Practice';
}

export function ChildView({ childId, setChild }: { childId: string | null; setChild: (id: string) => void }) {
  const { children } = useClassLearning();
  const { prefs } = usePrefs();
  const c = children.find((x) => x.player.id === childId) ?? children[0];
  const [note, setNote] = useState('');
  const [rename, setRename] = useState<string | null>(null);
  const [confirmRemove, setConfirmRemove] = useState(false);
  const player = usePlayer();
  const setOverride = (o: TeacherOverrides) => c && teacherOverrides.set(c.player.id, o);
  if (!c) return <p className="note-text">No learners on this device yet.</p>;

  const addNote = async () => {
    if (!note.trim()) return;
    await store.put('attempts', {
      id: newId('note'),
      createdAt: stamp(),
      activityId: 'note',
      activityVersion: '-',
      kind: 'practice',
      instrument: 'keyboard',
      tempoBpm: 0,
      support: { hintLevel: 0, heardExample: false, largeControls: false, simplified: false, aiEnabled: false, slower: false },
      inputs: [],
      passed: false,
      note: `Teacher observation: ${note.trim().slice(0, 300)}`,
      profileId: c.player.id,
    } satisfies AttemptRecord);
    setNote('');
  };
  const removePlayer = async (alsoWork: boolean) => {
    if (alsoWork) {
      for (const a of [...c.attempts, ...c.notes]) await store.delete('attempts', a.id);
      for (const p of c.pieces) await store.delete('compositions', p.id);
    }
    players.remove(c.player.id);
    setConfirmRemove(false);
  };

  return (
    <div className="dash child">
      <div className="chips child-pick" role="radiogroup" aria-label="Choose a learner">
        {children.map((x) => (
          <button key={x.player.id} type="button" role="radio" aria-checked={x.player.id === c.player.id} className="chip chip-who" onClick={() => setChild(x.player.id)}>
            <Avatar player={x.player} size={28} /> {x.player.name}
          </button>
        ))}
      </div>

      <header className="child-head">
        <Avatar player={c.player} size={64} />
        <div>
          <h2 className="h2">{c.player.name}</h2>
          <p className="note-text">
            {c.attempts.length} practice {c.attempts.length === 1 ? 'attempt' : 'attempts'} · {c.pieces.length} {c.pieces.length === 1 ? 'composition' : 'compositions'} · {c.lastAt ? `last practised ${new Date(c.lastAt).toLocaleDateString()}` : 'no practice recorded yet'}
          </p>
        </div>
      </header>

      <section className="dash-block" aria-labelledby="nx-h">
        <h3 id="nx-h" className="h3">
          What {c.player.name} sees next
        </h3>
        {c.next && (
          <p className="next-line">
            <strong>{titleOf(c.next.id)}</strong> <span className={`by by-${c.next.by}`}>{c.next.by === 'model' ? 'Suggested by the learner model' : c.next.by === 'teacher' ? 'Your choice' : 'Route order (not enough evidence yet)'}</span>
            <span className="muted"> {c.next.why}</span>
          </p>
        )}
        <label className="field">
          Choose their next activity
          <select value={c.overrides.next ?? ''} onChange={(e) => setOverride({ ...c.overrides, next: e.target.value || undefined })}>
            <option value="">Let the model suggest</option>
            {ACTIVITIES.map((a) => (
              <option key={a.id} value={a.id}>
                {titleOf(a.id)}
              </option>
            ))}
          </select>
        </label>
      </section>

      <SupportPlan c={c} onChange={setOverride} />

      <section className="dash-block" aria-labelledby="cs-h">
        <h3 id="cs-h" className="h3">
          Skills: evidence and your review
        </h3>
        <p className="note-text">Progress is estimated from recorded practice. Review a student’s work before changing their learning plan.</p>
        <details className="how-estimated">
          <summary>How progress is estimated</summary>
          <p className="note-text">Each practice attempt records what was played against the written music. A small statistical model on this device turns those attempts into a band for each skill. Attempts with help, slower or with unclear input count for less, or not at all. You can override any band, and your choice changes what {c.player.name} is offered next.</p>
        </details>
        <ul className="skill-rows">
          {SKILLS.map((s) => {
            const e = c.estimates.find((x) => x.skill === s.id)!;
            const ids = new Set(e.evidenceAttemptIds);
            const tries = c.attempts.filter((a) => ids.has(a.id)).slice(0, 4);
            return (
              <li key={s.id} className="skill-row">
                <div className="skill-row-head">
                  <span className="skill-name">{s.name}</span>
                  <BandCell e={e} />
                </div>
                <p className="muted small-text">{s.teacher}</p>
                <p className="skill-evidence">
                  {e.observations === 0
                    ? 'No tries that show this yet.'
                    : `${e.observations} ${e.observations === 1 ? 'try' : 'tries'}: ${e.independent} on their own, ${e.assisted} in practice or with help${e.recentFails ? `; ${e.recentFails} of the latest were tricky` : ''}.`}
                  {e.uncertain && e.observations > 0 && ' Too few tries to be sure.'}
                  {e.override && ` Model alone says: ${BAND_WORDS[e.band].toLowerCase()}.`}
                </p>
                {tries.length > 0 && (
                  <ul className="skill-tries">
                    {tries.map((a) => (
                      <li key={a.id}>
                        <span className={a.passed ? 'mark-good' : 'mark-miss'}>
                          <Icon name={a.passed ? 'good' : 'missed'} size={16} />
                        </span>{' '}
                        {titleOf(a.activityId)} · {supportText(a)} · {a.passed ? 'matched' : 'not yet'} <span className="muted">{new Date(a.createdAt).toLocaleDateString()}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {e.needsPractice && <p className="skill-move">Try: {TEACHER_MOVES[s.id]}</p>}
                <div className="seg-mini" role="radiogroup" aria-label={`Your review of ${s.name}`}>
                  {([undefined, 'practise', 'secure'] as const).map((v) => (
                    <button
                      key={v ?? 'model'}
                      type="button"
                      role="radio"
                      aria-checked={e.override === v}
                      className="chip"
                      onClick={() => {
                        const skills = { ...c.overrides.skills };
                        if (v) skills[s.id] = v;
                        else delete skills[s.id];
                        setOverride({ ...c.overrides, skills });
                      }}
                    >
                      {v === undefined ? 'Use the model' : v === 'practise' ? 'Needs practice' : 'Secure'}
                    </button>
                  ))}
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      <ModelTrace c={c} />

      <section className="dash-block" aria-labelledby="cp-h">
        <h3 id="cp-h" className="h3">
          Their music
        </h3>
        {c.pieces.length === 0 ? (
          <p className="note-text">No saved pieces yet.</p>
        ) : (
          <ul className="piece-list">
            {c.pieces.slice(0, 8).map((p) => (
              <li key={p.id} className="piece-row">
                <button type="button" className="btn-quiet small" onClick={() => void player.play([{ events: p.events }], p.tempoBpm, { totalTicks: p.totalTicks })}>
                  <Icon name="playback" size={16} /> Play
                </button>
                <span className="piece-title">{p.title}</span>
                <span className="muted">
                  {p.origin === 'lesson' && p.activityId ? `made from ${titleOf(p.activityId)}` : p.origin === 'mission' ? 'project' : 'free play'} · {new Date(p.createdAt).toLocaleDateString()}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="dash-block" aria-labelledby="ct-h">
        <h3 id="ct-h" className="h3">
          Practice attempts
        </h3>
        {c.attempts.length === 0 ? (
          <p className="note-text">No practice recorded yet.</p>
        ) : (
          <div className="table-wrap" tabIndex={0} role="region" aria-label="Practice attempts">
            <table className="evidence">
              <thead>
                <tr>
                  <th scope="col">When</th>
                  <th scope="col">Activity</th>
                  <th scope="col">How</th>
                  <th scope="col">Help used</th>
                  <th scope="col">Result</th>
                  <th scope="col">Coach</th>
                </tr>
              </thead>
              <tbody>
                {c.attempts.slice(0, 12).map((a) => (
                  <tr key={a.id}>
                    <td>{new Date(a.createdAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</td>
                    <th scope="row">{titleOf(a.activityId)}</th>
                    <td>{a.input?.unclear ? 'Microphone: input unclear (not counted)' : a.input?.mode === 'mic' ? 'Microphone' : a.input?.mode === 'midi' ? 'MIDI keyboard' : 'On screen'}</td>
                    <td>{supportText(a)}</td>
                    <td>
                      {a.summary ? `${a.summary.correctSound}/${a.summary.expected} sounds, ${a.summary.onTime} on time${a.summary.restViolations ? `, ${a.summary.restViolations} in rests` : ''}` : a.passed ? 'completed' : 'none'}
                      {prefs.badges && a.passed && (a.kind === 'independent' || a.kind === 'mission-check') ? ', on their own' : ''}
                    </td>
                    <td>
                      {a.coach ? `${a.coach.label}${a.coach.pattern ? `: ${a.coach.pattern}` : ''}` : 'none'}
                      {a.coach?.tailor?.startTipUsed ? ` · started with “${a.coach.tailor.startTipUsed}”` : ''}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="dash-block" aria-labelledby="cn-h">
        <h3 id="cn-h" className="h3">
          Your notes
        </h3>
        {c.notes.length > 0 && (
          <ul className="plain">
            {c.notes.map((n) => (
              <li key={n.id}>
                <span className="muted">{new Date(n.createdAt).toLocaleDateString()}:</span> {n.note?.replace('Teacher observation: ', '')}
              </li>
            ))}
          </ul>
        )}
        <form className="row wrap" onSubmit={(e) => { e.preventDefault(); void addNote(); }}>
          <label className="field">
            Add an observation (stays on this device)
            <input value={note} maxLength={300} onChange={(e) => setNote(e.target.value)} />
          </label>
          <button type="submit" className="btn" disabled={!note.trim()}>
            Add note
          </button>
        </form>
      </section>

      <section className="dash-block" aria-labelledby="cm-h">
        <h3 id="cm-h" className="h3">
          Manage learner
        </h3>
        <div className="row wrap">
          {rename === null ? (
            <button type="button" className="btn-quiet" onClick={() => setRename(c.player.name)}>
              Rename
            </button>
          ) : (
            <form className="row wrap" onSubmit={(e) => { e.preventDefault(); players.rename(c.player.id, rename); setRename(null); }}>
              <label className="field">
                Name
                <input value={rename} maxLength={20} onChange={(e) => setRename(e.target.value)} />
              </label>
              <button type="submit" className="btn">
                Save
              </button>
            </form>
          )}
          {confirmRemove ? (
            <>
              <button type="button" className="btn btn-coral" onClick={() => void removePlayer(true)}>
                Remove {c.player.name} and delete their work
              </button>
              <button type="button" className="btn-quiet" onClick={() => void removePlayer(false)}>
                Remove the name only
              </button>
              <button type="button" className="btn-quiet" onClick={() => setConfirmRemove(false)}>
                Cancel
              </button>
            </>
          ) : (
            <button type="button" className="btn-quiet" onClick={() => setConfirmRemove(true)}>
              Remove learner
            </button>
          )}
        </div>
      </section>
    </div>
  );
}

const CHECK_NAME = { listen: 'Listen', read: 'Read', play: 'Play' } as const;

/** How the model used each try: evidence, the estimate before and after, and what it chose,
 *  next to what the rules alone would have done. Checks are listed as single responses. */
function ModelTrace({ c }: { c: ChildLearning }) {
  const { prefs } = usePrefs();
  const steps = useMemo(() => traceLearner(c.attempts, LESSON_INFOS, { route: routeFrom(c.player.start ?? null), aiEnabled: prefs.aiEnabled }), [c.attempts, c.player.start, prefs.aiEnabled]);
  const checks = c.attempts.filter((a) => a.kind === 'check' && a.probe);
  const recent = steps.slice(-6).reverse();
  return (
    <section className="dash-block" aria-labelledby="tr-h">
      <h3 id="tr-h" className="h3">
        How the model used {c.player.name}’s tries
      </h3>
      {recent.length === 0 ? (
        <p className="note-text">No practice recorded yet.</p>
      ) : (
        <div className="table-wrap" tabIndex={0} role="region" aria-label="Model trace (scrolls sideways)">
          <table className="evidence trace">
            <thead>
              <tr>
                <th scope="col">Try</th>
                <th scope="col">Counts as</th>
                <th scope="col">Evidence</th>
                <th scope="col">Estimate before and after</th>
                <th scope="col">Model chose</th>
                <th scope="col">Rules alone</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((st) => (
                <tr key={st.attempt.id} className={st.differs ? 'is-diff' : ''}>
                  <th scope="row">
                    {titleOf(st.attempt.activityId)}
                    <span className="muted"> {new Date(st.attempt.createdAt).toLocaleDateString()}</span>
                  </th>
                  <td>{st.why}</td>
                  <td>{st.changes.length ? st.changes.map((x) => `${skillById(x.skill).name}: ${x.pass ? 'pass' : 'miss'}`).join('; ') : 'none'}</td>
                  <td>
                    {st.changes.length
                      ? st.changes.map((x) => (
                          <span key={x.skill} className="trace-est">
                            {skillById(x.skill).name}: {BAND_WORDS[x.bandBefore].toLowerCase()}, then {BAND_WORDS[x.bandAfter].toLowerCase()}
                            {x.uncertain ? ' (too few tries)' : ''}
                          </span>
                        ))
                      : 'No change'}
                  </td>
                  <td>
                    {st.model.checkIn ? 'Offer checks. ' : ''}
                    {st.model.start.length ? `Start ${st.model.start.join(' and ')}. ` : ''}
                    Next: {st.model.next ? titleOf(st.model.next) : 'none'}
                  </td>
                  <td>
                    {st.rules.checkIn ? 'Offer checks. ' : ''}Next: {st.rules.next ? titleOf(st.rules.next) : 'none'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <p className="note-text">Bands come from the model’s probability; rows where the model and the rules differ are marked. The rules baseline follows the route and offers checks after three misses in a row in one visit.</p>
      <h4 className="h4">Checks {c.player.name} chose</h4>
      {checks.length === 0 ? (
        <p className="note-text">None yet. Checks are offered after a difficulty keeps coming back.</p>
      ) : (
        <ul className="plain">
          {checks.slice(0, 8).map((a) => (
            <li key={a.id}>
              {CHECK_NAME[a.probe!.check]} check on {skillById(a.probe!.skill as SkillId)?.name ?? a.probe!.skill.toLowerCase()} ({titleOf(a.activityId)}): {a.probe!.right ? 'answered as expected' : 'answered differently'}
              {a.probe!.support ? `; ${a.probe!.supportTaken ? 'took' : 'turned down'} “${SUPPORTS[a.probe!.support as SupportId]?.label ?? a.probe!.support}”` : ''}.{' '}
              <span className="muted">Offered by {a.probe!.offeredBy === 'learner-model' ? 'the model' : 'the rules'}.</span>
            </li>
          ))}
        </ul>
      )}
      <p className="note-text">Each check is one response. It suggests a support to try; it is not a diagnosis and is not counted as evidence of the skill.</p>
    </section>
  );
}

/** Which support suits a skill that needs practice, and why. Teacher-facing suggestion, never automatic. */
const SKILL_SUPPORT: Record<SkillId, { id: SupportId; why: string }> = {
  pulse: { id: 'slower', why: 'Their beat drifted in recent attempts; a slower beat gives more time to land with the click.' },
  rests: { id: 'count-aloud', why: 'They played in rests; seeing the counts and “rest” under the score keeps the count going.' },
  subdivision: { id: 'count-aloud', why: 'Quaver pairs were uneven; counting “1 and 2 and” under the score shows where each one goes.' },
  pitch: { id: 'hear-first', why: 'Some notes were different from the written music; hearing it first gives the sound to aim for.' },
  reading: { id: 'hear-first', why: 'Reading from the stave was tricky; hearing it first links the sound to the notes.' },
  duration: { id: 'count-aloud', why: 'Notes were let go early; the counts under a minim show how long to hold.' },
};

/** A learner's support plan on this device: recommended support with its reason, and switches that take effect in their next lesson. */
function SupportPlan({ c, onChange }: { c: ChildLearning; onChange: (o: TeacherOverrides) => void }) {
  const on = new Set(c.overrides.supports ?? []);
  const hand = needsHand(c);
  const rec = hand ? SKILL_SUPPORT[hand.skill] : null;
  const toggle = (id: SupportId) => {
    const next = new Set(on);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    onChange({ ...c.overrides, supports: [...next] });
  };
  return (
    <section className="dash-block" aria-labelledby="sp-h">
      <h3 id="sp-h" className="h3">
        Support plan
      </h3>
      {rec ? (
        <p className="sp-rec">
          <strong>Recommended: {SUPPORTS[rec.id].label}.</strong> {rec.why} ({hand!.tries} practice attempts on {skillById(hand!.skill).name.toLowerCase()}.)
        </p>
      ) : (
        <p className="note-text">{c.attempts.length ? 'No support recommended from the recorded practice.' : 'No practice recorded yet, so nothing is recommended.'}</p>
      )}
      <ul className="sp-list">
        {(Object.keys(SUPPORTS) as SupportId[]).map((id) => (
          <li key={id}>
            <label className="sp-row">
              <input type="checkbox" checked={on.has(id)} onChange={() => toggle(id)} />
              <span>
                <span className="sp-label">{SUPPORTS[id].label}</span>
                <span className="note-text"> {SUPPORTS[id].does}</span>
              </span>
            </label>
          </li>
        ))}
      </ul>
      <p className="note-text" role="status">
        {on.size ? `${on.size} on. ${TEST_DATA ? 'Test data: kept for this visit only.' : 'Saved on this device.'} It starts in ${c.player.name}’s next lesson, and they can still switch it off.` : 'Nothing switched on.'}
      </p>
    </section>
  );
}
