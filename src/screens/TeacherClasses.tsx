// Teacher: classes across devices. Classes, a roster of nicknames with single-use codes, assigning
// an activity (with a preview), a live status board, and each learner's review where the teacher
// changes the next activity, switches supports on, corrects Carmen's skill judgement and keeps
// private notes. Everything is on the school's Carmen service; nothing here is stored on this
// device except the teacher's session.
import { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from 'react';
import { SKILLS } from '../ai/learner.ts';
import { SUPPORTS, type SupportId } from '../ai/checkin.ts';
import { ACTIVITIES, activityById } from '../data/curriculum.ts';
import { teacherAuth, type TeachingSpace } from '../auth/teacherAuth.ts';
import { classApi, type Assignment, type Board, type BoardStudent, type ClassSummary, type StudentDetail } from '../sync/classApi.ts';
import { describeEvidence, type LearnerStatus, STATUS_WORDS, statusFor, tally } from '../sync/status.ts';
import { Icon, type IconName } from '../ui/icons.tsx';
import { titleOf } from './LearnScreen.tsx';

const STATUS_ICON: Record<LearnerStatus, IconName> = {
  'not-joined': 'minus',
  'waiting-to-sync': 'pending',
  'not-started': 'ring',
  practising: 'half',
  ready: 'good',
  'may-need-support': 'help',
  'input-problem': 'alert',
};
const ORDER: LearnerStatus[] = ['may-need-support', 'input-problem', 'practising', 'not-started', 'waiting-to-sync', 'not-joined', 'ready'];
const ASSIGNABLE = ACTIVITIES.filter((a) => a.kind === 'lesson' || a.kind === 'project');

function ago(iso: string | null | undefined): string {
  if (!iso) return 'never';
  const m = Math.round((Date.now() - Date.parse(iso)) / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m} min ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h} h ago`;
  return new Date(iso).toLocaleDateString(undefined, { day: 'numeric', month: 'short' });
}
const supportsText = (s: Record<string, boolean> | null | undefined) =>
  Object.entries(s ?? {})
    .filter(([k, v]) => v && k in SUPPORTS)
    .map(([k]) => SUPPORTS[k as SupportId].label)
    .join(', ');

function useAsync() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const run = useCallback(async (f: () => Promise<void>) => {
    setBusy(true);
    setError('');
    try {
      await f();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong.');
    } finally {
      setBusy(false);
    }
  }, []);
  return { busy, error, run, setError };
}

export function TeacherClasses({ space, onSignedOut }: { space: TeachingSpace | null; onSignedOut: () => void }) {
  const session = useSyncExternalStore(teacherAuth.subscribe, teacherAuth.current, teacherAuth.current);
  const spaceId = space?.id;
  const [classes, setClasses] = useState<ClassSummary[] | null>(null);
  const [open, setOpen] = useState<string | null>(null);
  const [name, setName] = useState('');
  const { busy, error, run } = useAsync();
  const load = useCallback(() => run(async () => setClasses(await classApi.classes())), [run]);
  const signedIn = !!session;
  useEffect(() => {
    if (signedIn && spaceId) void load();
  }, [signedIn, spaceId, load]);

  if (teacherAuth.configured && space && !session)
    return (
      <section className="panel" aria-labelledby="cl-h">
        <h2 id="cl-h" className="h2">
          Log in again
        </h2>
        <p>Your login has ended on this device. Your classes are safe; log in again to see them.</p>
        <button type="button" className="btn btn-primary" onClick={onSignedOut}>
          Log in
        </button>
      </section>
    );
  if (!teacherAuth.configured || !session || !space)
    return (
      <section className="panel" aria-labelledby="cl-h">
        <h2 id="cl-h" className="h2">
          Classes across devices
        </h2>
        <p>
          {teacherAuth.configured
            ? 'Classes need a school account. You’re using the device-only PIN view, which shows only what was played on this device.'
            : 'School accounts aren’t set up for this copy of Carmen, so classes can’t be shared across devices yet. The Class and Students tabs show what was played on this device.'}
        </p>
      </section>
    );

  if (open) return <ClassBoard classId={open} back={() => { setOpen(null); void load(); }} />;

  return (
    <section className="dash-block" aria-labelledby="cl-h">
      <h2 id="cl-h" className="h2">
        Your classes
      </h2>
      {error && <p className="form-error" role="alert">{error}</p>}
      {classes && classes.length === 0 && <p>No classes yet. Make one, add your learners by first name or nickname, and give each a code for their device.</p>}
      <ul className="plain class-list">
        {classes?.map((k) => (
          <li key={k.id}>
            <button type="button" className="class-item" onClick={() => setOpen(k.id)}>
              <span className="class-name">{k.name}</span>
              <span className="class-meta">
                {k.students} {k.students === 1 ? 'learner' : 'learners'}
                {!k.teaches && ' · you can see it as the space owner'}
              </span>
              <Icon name="next" size={20} />
            </button>
          </li>
        ))}
      </ul>
      <form
        className="row inline-form"
        onSubmit={(e) => {
          e.preventDefault();
          void run(async () => {
            const k = await classApi.createClass(space.id, name);
            setName('');
            setOpen(k.id);
          });
        }}
      >
        <label className="field">
          <span className="field-label">New class</span>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="For example, 3B Music" maxLength={60} />
        </label>
        <button type="submit" className="btn btn-primary" disabled={busy || !name.trim()}>
          Make the class
        </button>
      </form>
    </section>
  );
}

function ClassBoard({ classId, back }: { classId: string; back: () => void }) {
  const [board, setBoard] = useState<Board | null>(null);
  const [loadedAt, setLoadedAt] = useState<number | null>(null);
  const [focus, setFocus] = useState<string | null>(null); // assignment id on the board
  const [student, setStudent] = useState<string | null>(null);
  const [codes, setCodes] = useState<Record<string, string>>({});
  const [nick, setNick] = useState('');
  const [removing, setRemoving] = useState<string | null>(null);
  const { busy, error, run } = useAsync();

  const load = useCallback(
    () =>
      run(async () => {
        const b = await classApi.board(classId);
        if (!b) throw new Error('This class isn’t available to you any more.');
        setBoard(b);
        setLoadedAt(Date.now());
      }),
    [classId, run],
  );
  useEffect(() => {
    void load();
    // Live enough for a lesson: refresh every 20 s while the page is visible.
    const t = setInterval(() => document.visibilityState === 'visible' && void load(), 20_000);
    return () => clearInterval(t);
  }, [load]);

  const current = board?.assignments.find((a) => a.id === focus) ?? board?.assignments[0] ?? null;
  const rows = useMemo(() => {
    if (!board) return [];
    return board.students
      .filter((s) => !current?.student_ids || current.student_ids.includes(s.id))
      .map((s) => ({ s, status: current ? statusFor(current.activity_id, s.evidence, s.seat, current.created_at) : null }))
      .sort((a, b) => (a.status && b.status ? ORDER.indexOf(a.status) - ORDER.indexOf(b.status) : 0) || a.s.nickname.localeCompare(b.s.nickname));
  }, [board, current]);

  if (student && board)
    return (
      <StudentReview
        studentId={student}
        board={board}
        back={() => {
          setStudent(null);
          void load();
        }}
      />
    );

  const counts = tally(rows.map((r) => r.status).filter((x): x is LearnerStatus => !!x));

  return (
    <div className="class-board">
      <div className="board-head">
        <button type="button" className="btn-quiet" onClick={back}>
          <Icon name="prev" size={20} /> Classes
        </button>
        <h2 className="h2">{board?.class.name ?? 'Class'}</h2>
        <button type="button" className="btn-quiet" onClick={() => void load()} disabled={busy}>
          <Icon name="sync" size={20} /> {busy ? 'Updating…' : 'Update'}
        </button>
      </div>
      <p className="meta-line" role="status">
        {loadedAt ? `Updated ${ago(new Date(loadedAt).toISOString())}. Learners’ devices send their work when they’re online.` : 'Loading…'}
      </p>
      {error && <p className="form-error" role="alert">{error}</p>}

      {board && (
        <>
          <section className="dash-block" aria-labelledby="now-h">
            <h3 id="now-h" className="h3">
              Right now
            </h3>
            {board.assignments.length === 0 ? (
              <p>Nothing assigned. Assign an activity below to see where everyone is.</p>
            ) : (
              <>
                {board.assignments.length > 1 && (
                  <label className="field">
                    <span className="field-label">Activity</span>
                    <select aria-label="Activity on the board" value={current?.id} onChange={(e) => setFocus(e.target.value)}>
                      {board.assignments.map((a) => (
                        <option key={a.id} value={a.id}>
                          {titleOf(a.activity_id)}
                          {a.student_ids ? ` (${a.student_ids.length} learner${a.student_ids.length === 1 ? '' : 's'})` : ''}
                        </option>
                      ))}
                    </select>
                  </label>
                )}
                {current && <AssignmentLine a={current} onClose={() => void run(async () => { await classApi.closeAssignment(current.id); await load(); })} />}
                <p className="tally">
                  {ORDER.filter((k) => counts[k]).map((k) => (
                    <span key={k} className={`status st-${k}`}>
                      <Icon name={STATUS_ICON[k]} size={16} /> {counts[k]} {STATUS_WORDS[k].label.toLowerCase()}
                    </span>
                  ))}
                </p>
                <table className="evidence board-table">
                  <thead>
                    <tr>
                      <th scope="col">Learner</th>
                      <th scope="col">Where they are</th>
                      <th scope="col">Last seen</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map(({ s, status }) => (
                      <tr key={s.id}>
                        <th scope="row">
                          <button type="button" className="link-btn" onClick={() => setStudent(s.id)}>
                            {s.nickname}
                          </button>
                        </th>
                        <td>
                          {status && (
                            <span className={`status st-${status}`} title={STATUS_WORDS[status].about}>
                              <Icon name={STATUS_ICON[status]} size={16} /> {STATUS_WORDS[status].label}
                            </span>
                          )}
                        </td>
                        <td>{ago(s.seat?.seen_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <details className="more-help">
                  <summary>
                    <Icon name="info" size={20} /> What the words mean
                  </summary>
                  <dl className="status-key">
                    {ORDER.map((k) => (
                      <div key={k}>
                        <dt>
                          <Icon name={STATUS_ICON[k]} size={16} /> {STATUS_WORDS[k].label}
                        </dt>
                        <dd>{STATUS_WORDS[k].about}</dd>
                      </div>
                    ))}
                  </dl>
                </details>
              </>
            )}
          </section>

          <AssignForm board={board} onDone={() => void load()} />

          <section className="dash-block" aria-labelledby="roster-h">
            <h3 id="roster-h" className="h3">
              Learners and their devices
            </h3>
            <p className="note-text">First names or nicknames only. Each learner joins on their device with a code from you: Settings, then My class. A code works once, for 14 days. Making a new code unlinks their old device.</p>
            <ul className="plain roster">
              {board.students.map((s) => (
                <li key={s.id} className="roster-row">
                  <button type="button" className="link-btn roster-name" onClick={() => setStudent(s.id)}>
                    {s.nickname}
                  </button>
                  <span className="roster-device">{deviceText(s)}</span>
                  {codes[s.id] ? (
                    <span className="seat-code" role="status">
                      Code for {s.nickname}: <code>{codes[s.id]}</code>
                    </span>
                  ) : (
                    <button type="button" className="btn-quiet small" disabled={busy} onClick={() => void run(async () => { const c = await classApi.issueCode(s.id); setCodes((cur) => ({ ...cur, [s.id]: c })); }).then(load)}>
                      {s.seat?.joined_at ? 'New code' : 'Get a code'}
                    </button>
                  )}
                  {removing === s.id ? (
                    <span className="row" role="group" aria-label={`Remove ${s.nickname}?`}>
                      <span className="note-text">Deletes {s.nickname}’s work, plan and notes from the class.</span>
                      <button type="button" className="btn btn-coral" onClick={() => void run(async () => { await classApi.removeStudent(s.id); setRemoving(null); await load(); })}>
                        Remove
                      </button>
                      <button type="button" className="btn-quiet" onClick={() => setRemoving(null)}>
                        Keep
                      </button>
                    </span>
                  ) : (
                    <button type="button" className="btn-text" onClick={() => setRemoving(s.id)}>
                      Remove
                    </button>
                  )}
                </li>
              ))}
            </ul>
            <form
              className="row inline-form"
              onSubmit={(e) => {
                e.preventDefault();
                void run(async () => {
                  await classApi.addStudent(classId, nick);
                  setNick('');
                  await load();
                });
              }}
            >
              <label className="field">
                <span className="field-label">Add a learner</span>
                <input value={nick} onChange={(e) => setNick(e.target.value)} placeholder="First name or nickname" maxLength={30} autoComplete="off" />
              </label>
              <button type="submit" className="btn btn-primary" disabled={busy || !nick.trim()}>
                Add
              </button>
            </form>
          </section>
        </>
      )}
    </div>
  );
}

function deviceText(s: BoardStudent): string {
  if (s.seat?.joined_at) return `Device linked · last sent ${ago(s.seat.seen_at)}`;
  if (s.seat?.code_waiting) return 'Code given, not used yet';
  return 'No device yet';
}

function AssignmentLine({ a, onClose }: { a: Assignment; onClose: () => void }) {
  const sup = supportsText(a.supports);
  return (
    <div className="assignment-line">
      <p>
        <strong>{titleOf(a.activity_id)}</strong> · {a.student_ids ? `${a.student_ids.length} learner${a.student_ids.length === 1 ? '' : 's'}` : 'whole class'} · set {ago(a.created_at)}
        {sup && <> · help on: {sup}</>}
      </p>
      {a.note && <p className="note-text">“{a.note}”</p>}
      <div className="row">
        <a className="link" href={`#/${activityById(a.activity_id)?.kind === 'project' ? 'mission' : 'lesson'}/${a.activity_id}`}>
          Preview
        </a>
        <button type="button" className="btn-text" onClick={onClose}>
          Stop showing it
        </button>
      </div>
    </div>
  );
}

function SupportChecks({ value, onChange }: { value: Record<string, boolean>; onChange: (v: Record<string, boolean>) => void }) {
  return (
    <fieldset className="checks">
      <legend className="field-label">Help that starts on</legend>
      {(Object.keys(SUPPORTS) as SupportId[]).map((k) => (
        <label key={k} className="check">
          <input type="checkbox" checked={!!value[k]} onChange={(e) => onChange({ ...value, [k]: e.target.checked })} />
          <span>
            {SUPPORTS[k].label}
            <span className="note-text"> {SUPPORTS[k].does}</span>
          </span>
        </label>
      ))}
    </fieldset>
  );
}

function AssignForm({ board, onDone }: { board: Board; onDone: () => void }) {
  const [open, setOpen] = useState(false);
  const [activity, setActivity] = useState(ASSIGNABLE[0]?.id ?? '');
  const [who, setWho] = useState<string[]>([]);
  const [supports, setSupports] = useState<Record<string, boolean>>({});
  const [note, setNote] = useState('');
  const { busy, error, run } = useAsync();
  if (!open)
    return (
      <section className="dash-block">
        <button type="button" className="btn btn-primary" onClick={() => setOpen(true)}>
          <Icon name="assign" size={20} /> Assign an activity
        </button>
      </section>
    );
  return (
    <section className="dash-block" aria-labelledby="as-h">
      <h3 id="as-h" className="h3">
        Assign an activity
      </h3>
      <form
        className="assign-form"
        onSubmit={(e) => {
          e.preventDefault();
          void run(async () => {
            await classApi.assign(board.class.id, activity, who.length ? who : null, supports, note);
            setOpen(false);
            setWho([]);
            setSupports({});
            setNote('');
            onDone();
          });
        }}
      >
        <label className="field">
          <span className="field-label">Activity</span>
          <select aria-label="Activity" value={activity} onChange={(e) => setActivity(e.target.value)}>
            {ASSIGNABLE.map((a) => (
              <option key={a.id} value={a.id}>
                {titleOf(a.id)} ({a.learn})
              </option>
            ))}
          </select>
        </label>
        <a className="link" href={`#/${activityById(activity)?.kind === 'project' ? 'mission' : 'lesson'}/${activity}`}>
          Preview it as a learner
        </a>
        <fieldset className="checks">
          <legend className="field-label">Who</legend>
          <p className="note-text">Leave everyone unticked for the whole class.</p>
          {board.students.map((s) => (
            <label key={s.id} className="check">
              <input type="checkbox" checked={who.includes(s.id)} onChange={(e) => setWho(e.target.checked ? [...who, s.id] : who.filter((x) => x !== s.id))} />
              <span>{s.nickname}</span>
            </label>
          ))}
        </fieldset>
        <SupportChecks value={supports} onChange={setSupports} />
        <label className="field">
          <span className="field-label">A line for learners (optional)</span>
          <input value={note} onChange={(e) => setNote(e.target.value)} maxLength={200} placeholder="For example, Try it with the metronome on" />
        </label>
        {error && <p className="form-error" role="alert">{error}</p>}
        <div className="row">
          <button type="submit" className="btn btn-primary" disabled={busy || !activity}>
            Assign
          </button>
          <button type="button" className="btn-quiet" onClick={() => setOpen(false)}>
            Cancel
          </button>
        </div>
      </form>
    </section>
  );
}

function StudentReview({ studentId, board, back }: { studentId: string; board: Board; back: () => void }) {
  const [d, setD] = useState<StudentDetail | null>(null);
  const [next, setNext] = useState('');
  const [supports, setSupports] = useState<Record<string, boolean>>({});
  const [skills, setSkills] = useState<Record<string, 'practise' | 'secure'>>({});
  const [version, setVersion] = useState(0);
  const [saved, setSaved] = useState('');
  const [conflict, setConflict] = useState(false);
  const [note, setNote] = useState('');
  const { busy, error, run } = useAsync();

  const fill = (x: StudentDetail) => {
    setD(x);
    setNext(x.plan?.next_activity_id ?? '');
    setSupports(x.plan?.supports ?? {});
    setSkills(x.plan?.skill_overrides ?? {});
    setVersion(x.plan?.version ?? 0);
  };
  useEffect(() => {
    void run(async () => {
      const x = await classApi.student(studentId);
      if (!x) throw new Error('This learner isn’t in your class any more.');
      fill(x);
    });
  }, [studentId, run]);

  const name = d?.student.nickname ?? board.students.find((s) => s.id === studentId)?.nickname ?? 'Learner';
  return (
    <div className="student-review">
      <div className="board-head">
        <button type="button" className="btn-quiet" onClick={back}>
          <Icon name="prev" size={20} /> {board.class.name}
        </button>
        <h2 className="h2">{name}</h2>
      </div>
      {error && <p className="form-error" role="alert">{error}</p>}
      {d && (
        <>
          <section className="dash-block" aria-labelledby="plan-h">
            <h3 id="plan-h" className="h3">
              What {name} sees next
            </h3>
            <p className="note-text">Changes reach {name}’s device the next time it’s online. {name} can still turn help off.</p>
            <form
              className="assign-form"
              onSubmit={(e) => {
                e.preventDefault();
                void run(async () => {
                  setSaved('');
                  const r = await classApi.setPlan(studentId, { next_activity: next || null, supports, skill_overrides: skills }, version);
                  if (r.conflict) {
                    setConflict(true);
                    setNext(r.plan.next_activity_id ?? '');
                    setSupports(r.plan.supports ?? {});
                    setSkills(r.plan.skill_overrides ?? {});
                    setVersion(r.version);
                    return;
                  }
                  setConflict(false);
                  setVersion(r.version);
                  setSaved(`Saved. ${name}’s device gets it next time it’s online.`);
                });
              }}
            >
              {conflict && (
                <p className="fb-warning" role="alert">
                  <Icon name="alert" size={20} /> Another teacher changed this plan while you were looking. This is their version now. Check it, change what you need, and save again.
                </p>
              )}
              <label className="field">
                <span className="field-label">Next activity</span>
                <select aria-label="Next activity" value={next} onChange={(e) => setNext(e.target.value)}>
                  <option value="">Let Carmen suggest (from {name}’s tries)</option>
                  {ASSIGNABLE.map((a) => (
                    <option key={a.id} value={a.id}>
                      {titleOf(a.id)}
                    </option>
                  ))}
                </select>
              </label>
              <SupportChecks value={supports} onChange={setSupports} />
              <fieldset className="checks">
                <legend className="field-label">Correct Carmen’s view of a skill</legend>
                <p className="note-text">Carmen guesses from tries on the device. If you’ve seen otherwise in class, say so here: it changes what {name} is offered.</p>
                {SKILLS.map((s) => (
                  <label key={s.id} className="field-inline">
                    {s.name}
                    <select aria-label={s.name} value={skills[s.id] ?? ''} onChange={(e) => setSkills(e.target.value ? { ...skills, [s.id]: e.target.value as 'practise' | 'secure' } : Object.fromEntries(Object.entries(skills).filter(([k]) => k !== s.id)))}>
                      <option value="">Carmen’s guess</option>
                      <option value="practise">Still practising</option>
                      <option value="secure">Secure: I’ve seen it</option>
                    </select>
                  </label>
                ))}
              </fieldset>
              <div className="row">
                <button type="submit" className="btn btn-primary" disabled={busy}>
                  Save for {name}
                </button>
                {saved && (
                  <span className="note-text" role="status">
                    {saved}
                  </span>
                )}
              </div>
            </form>
          </section>

          <section className="dash-block" aria-labelledby="ev-h">
            <h3 id="ev-h" className="h3">
              What Carmen saw
            </h3>
            {d.evidence.length === 0 ? (
              <p>Nothing sent yet. Work done offline arrives when {name}’s device is online.</p>
            ) : (
              <ul className="plain evidence-list">
                {d.evidence.slice(0, 40).map((e) => (
                  <li key={e.id}>
                    <span className="meta-line">
                      {titleOf(e.activity_id)} · {ago(e.attempted_at)}
                    </span>
                    <span>{describeEvidence(e)}</span>
                  </li>
                ))}
              </ul>
            )}
            <p className="note-text">Summaries only: which activity, how it went, which help was on. No recordings. Kept for about a school year.</p>
          </section>

          <section className="dash-block" aria-labelledby="notes-h">
            <h3 id="notes-h" className="h3">
              Notes for teachers
            </h3>
            <p className="note-text">Only teachers of this class see these. {name} never does.</p>
            <ul className="plain evidence-list">
              {d.notes.map((n) => (
                <li key={n.id}>
                  <span className="meta-line">
                    {n.mine ? 'You' : (n.author ?? 'A teacher')} · {ago(n.created_at)}
                  </span>
                  <span>{n.body}</span>
                </li>
              ))}
            </ul>
            <form
              className="row inline-form"
              onSubmit={(e) => {
                e.preventDefault();
                void run(async () => {
                  const n = await classApi.addNote(studentId, note);
                  setNote('');
                  setD({ ...d, notes: [n, ...d.notes] });
                });
              }}
            >
              <label className="field">
                <span className="field-label">Add a note</span>
                <input value={note} onChange={(e) => setNote(e.target.value)} maxLength={1000} placeholder="What you noticed in class" />
              </label>
              <button type="submit" className="btn btn-primary" disabled={busy || !note.trim()}>
                Add note
              </button>
            </form>
          </section>
        </>
      )}
    </div>
  );
}
