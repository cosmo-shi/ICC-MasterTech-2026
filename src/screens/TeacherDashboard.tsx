import { useMemo, useState } from 'react';
import { estimateSkills, nextStep, SKILLS, type SkillEstimate, type SkillId, skillById, suggestGroups } from '../ai/learner.ts';
import { LESSONS, MISSIONS } from '../data/catalog.ts';
import { routeLessons } from '../data/route.ts';
import { type AttemptRecord, type CompositionRecord, newId, stamp, store } from '../store/db.ts';
import { type Player, players, usePlayers } from '../store/profiles.ts';
import { Icon } from '../ui/icons.tsx';
import { isNote, toEvidence, useAllRecords } from '../ui/useAttempts.ts';
import { usePlayer } from '../ui/usePlayer.ts';
import { Avatar } from './EntryScreen.tsx';
import { usePrefs } from '../state/prefs.tsx';

const titleOf = (id: string) => LESSONS.find((l) => l.id === id)?.title ?? MISSIONS.find((m) => m.id === id)?.title ?? id;
const DAY = 864e5;

/** What a teacher could try, per skill. Teacher-facing; drafts pending educator review. */
const TEACHER_MOVES: Record<SkillId, string> = {
  explore: 'Model one sound loud then soft; ask them to copy and then change it.',
  pulse: 'March or pat the beat together first, then play along at a slower tempo with the metronome.',
  rests: 'Say the rhythm aloud with a silent gesture (hands open) on each rest before playing.',
  quavers: 'Chant “ta ta ti-ti ta” while patting the beat, then move it to the drum.',
  direction: 'Sing or play two notes and show higher/lower with a hand; let the child lead.',
  'note-names': 'Find the pairs of black keys together; C is always just to the left of a pair.',
  reading: 'Point to each note as you both say its letter, then play slowly without the metronome.',
  duration: 'Count the minim aloud (“1-2”) while holding the key down, then let them count.',
  create: 'Ask them to play you their idea and say one thing they changed.',
};

const STATUS_WORD: Record<SkillEstimate['status'], string> = { 'not-yet': 'Not tried', starting: 'Starting', growing: 'Growing', secure: 'Secure' };

export interface ChildLearning {
  player: Player;
  attempts: AttemptRecord[];
  notes: AttemptRecord[];
  pieces: CompositionRecord[];
  estimates: SkillEstimate[];
  lastAt?: number;
}

export function useClassLearning(): { children: ChildLearning[]; unowned: number; modelName: string; modelKind: string; fellBack: boolean } {
  const { attempts, pieces } = useAllRecords();
  const { players: list } = usePlayers();
  return useMemo(() => {
    const children: ChildLearning[] = [];
    const runs = list.map((p) => {
      const mine = attempts.filter((a) => a.profileId === p.id);
      const real = mine.filter((a) => !isNote(a));
      return { p, mine, real, est: estimateSkills(real.map(toEvidence)) };
    });
    for (const { p, mine, real, est } of runs)
      children.push({
        player: p,
        attempts: real,
        notes: mine.filter(isNote),
        pieces: pieces.filter((c) => c.profileId === p.id),
        estimates: est.estimates,
        lastAt: real[0]?.createdAt,
      });
    const m = runs[0]?.est.model;
    const unowned = attempts.filter((a) => !a.profileId && !isNote(a)).length;
    return { children, unowned, modelName: m ? `${m.id} v${m.version}` : '', modelKind: m?.kind ?? 'baseline', fellBack: runs.some((r) => r.est.fellBack) };
  }, [attempts, pieces, list]);
}

/** Empty, half or full circle, so status never relies on colour alone. */
function StatusDot({ s }: { s: SkillEstimate['status'] }) {
  return (
    <svg className="st-dot" width="12" height="12" viewBox="0 0 12 12" aria-hidden="true" focusable="false">
      {s === 'not-yet' ? (
        <path d="M3 6h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      ) : (
        <>
          <circle cx="6" cy="6" r="4.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
          {s === 'growing' && <path d="M6 1.5a4.5 4.5 0 0 1 0 9z" fill="currentColor" />}
          {s === 'secure' && <circle cx="6" cy="6" r="4.5" fill="currentColor" />}
        </>
      )}
    </svg>
  );
}

function StatusCell({ e }: { e?: SkillEstimate }) {
  const s = e?.status ?? 'not-yet';
  return (
    <span className={`st st-${s}`}>
      <StatusDot s={s} /> {STATUS_WORD[s]}
    </span>
  );
}

/** Children who look stuck: a skill still "starting" after two or more tries, newest first. */
function needsHand(c: ChildLearning) {
  const step = nextStep(routeLessons(null), c.estimates);
  if (step.why !== 'practise' || !step.skill) return null;
  const e = c.estimates.find((x) => x.skill === step.skill)!;
  const tries = c.attempts.filter((a) => skillById(step.skill!).lessons.includes(a.activityId));
  const hinted = tries.filter((a) => (a.support?.hintLevel ?? 0) >= 2).length;
  return { skill: step.skill, evidence: e.evidence, hinted, lesson: step.activityId };
}

export function ClassView({ openChild }: { openChild: (id: string) => void }) {
  const { children, unowned, modelName, modelKind, fellBack } = useClassLearning();
  const [now] = useState(() => Date.now());
  const active = children.filter((c) => c.lastAt && now - c.lastAt < 7 * DAY).length;
  const stuck = children.map((c) => ({ c, n: needsHand(c) })).filter((x) => x.n);
  const groups = suggestGroups(children.map((c) => ({ id: c.player.id, estimates: c.estimates })));
  const byId = (id: string) => children.find((c) => c.player.id === id)!;
  const shownSkills = SKILLS.filter((s) => s.id !== 'explore');

  if (!children.length)
    return (
      <div className="empty-state">
        <p>
          <strong>No players on this device yet.</strong> When children choose “New player” on the first screen, their progress shows up here. Nothing is sent anywhere.
        </p>
        {unowned > 0 && <p className="note-text">{unowned} tries were made as a guest and are not linked to anyone.</p>}
      </div>
    );

  return (
    <div className="dash">
      <ul className="dash-stats" aria-label="This device">
        <li>
          <span className="stat-n">{children.length}</span> players
        </li>
        <li>
          <span className="stat-n">{active}</span> played this week
        </li>
        <li>
          <span className="stat-n">{children.reduce((n, c) => n + c.attempts.length, 0)}</span> tries
        </li>
        <li>
          <span className="stat-n">{children.reduce((n, c) => n + c.pieces.length, 0)}</span> pieces made
        </li>
      </ul>

      <section className="dash-block" aria-labelledby="hand-h">
        <h2 id="hand-h" className="h2">
          Who might like a hand
        </h2>
        {stuck.length === 0 ? (
          <p className="note-text">No one looks stuck right now. A child appears here when a skill is still starting after two or more tries.</p>
        ) : (
          <ul className="hand-list">
            {stuck.map(({ c, n }) => (
              <li key={c.player.id} className="hand">
                <button type="button" className="hand-who" onClick={() => openChild(c.player.id)}>
                  <Avatar player={c.player} size={40} />
                  <span>
                    <span className="hand-name">{c.player.name}</span>
                    <span className="hand-skill">
                      {skillById(n!.skill).name} · {n!.evidence} tries{n!.hinted ? `, ${n!.hinted} with clues shown` : ''}
                    </span>
                  </span>
                </button>
                <p className="hand-move">
                  <strong>Try:</strong> {TEACHER_MOVES[n!.skill]} <span className="muted">Lesson: {titleOf(n!.lesson)}.</span>
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="dash-block" aria-labelledby="groups-h">
        <h2 id="groups-h" className="h2">
          Could practise together
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

      <section className="dash-block" aria-labelledby="grid-h">
        <h2 id="grid-h" className="h2">
          Skills across the class
        </h2>
        <p className="note-text">
          <StatusDot s="not-yet" /> not tried · <StatusDot s="starting" /> starting · <StatusDot s="growing" /> growing · <StatusDot s="secure" /> secure (shown on their own, with no hints). Select a name to see their work.
        </p>
        <div className="table-wrap" tabIndex={0} role="region" aria-label="Skills table (scrolls sideways)">
          <table className="skill-grid">
            <thead>
              <tr>
                <th scope="col">Player</th>
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
                      <StatusCell e={c.estimates.find((e) => e.skill === s.id)} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <p className="note-text provenance">
        Worked out on this device by the {modelKind === 'live' ? 'plugged-in learner model' : 'built-in learner model'} ({modelName}){fellBack ? ', after the plugged-in model failed' : ''}, from tries on this device only. These are suggestions for you to check, not grades.
        {unowned > 0 && ` ${unowned} guest tries are not included.`}
      </p>
    </div>
  );
}

function supportText(a: AttemptRecord): string {
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
  if (!c) return <p className="note-text">No players on this device yet.</p>;

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
      <div className="chips child-pick" role="radiogroup" aria-label="Choose a player">
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
            {c.attempts.length} {c.attempts.length === 1 ? 'try' : 'tries'} · {c.pieces.length} {c.pieces.length === 1 ? 'piece' : 'pieces'} · {c.lastAt ? `last played ${new Date(c.lastAt).toLocaleDateString()}` : 'not played yet'}
          </p>
        </div>
      </header>

      <section className="dash-block" aria-labelledby="cs-h">
        <h3 id="cs-h" className="h3">
          Skills
        </h3>
        <ul className="skill-bars">
          {SKILLS.map((s) => {
            const e = c.estimates.find((x) => x.skill === s.id)!;
            return (
              <li key={s.id} className="skill-bar">
                <span className="skill-name">
                  {s.name}
                  <span className="muted"> · {s.teacher}</span>
                </span>
                <span className="bar" aria-hidden="true">
                  <span className={`bar-fill st-${e.status}`} style={{ width: `${e.evidence ? Math.round(e.level * 100) : 0}%` }} />
                </span>
                <span className="skill-st">
                  <StatusCell e={e} /> {e.evidence ? `(${e.evidence} tries)` : ''}
                </span>
                {(e.status === 'starting' || e.status === 'growing') && <span className="skill-move">Try: {TEACHER_MOVES[s.id]}</span>}
              </li>
            );
          })}
        </ul>
      </section>

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
                  <Icon name="playback" size={14} /> Play
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
          Recent tries
        </h3>
        {c.attempts.length === 0 ? (
          <p className="note-text">No tries yet.</p>
        ) : (
          <div className="table-wrap" tabIndex={0} role="region" aria-label="Recent tries">
            <table className="evidence">
              <thead>
                <tr>
                  <th scope="col">When</th>
                  <th scope="col">Activity</th>
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
                    <td>{supportText(a)}</td>
                    <td>
                      {a.summary ? `${a.summary.correctSound}/${a.summary.expected} sounds, ${a.summary.onTime} on time${a.summary.restViolations ? `, ${a.summary.restViolations} in rests` : ''}` : a.passed ? 'completed' : '—'}
                      {prefs.badges && a.passed && (a.kind === 'independent' || a.kind === 'mission-check') ? ' ★' : ''}
                    </td>
                    <td>{a.coach ? `${a.coach.label}${a.coach.pattern ? `: ${a.coach.pattern}` : ''}` : '—'}</td>
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
          Manage player
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
              Remove player
            </button>
          )}
        </div>
      </section>
    </div>
  );
}
