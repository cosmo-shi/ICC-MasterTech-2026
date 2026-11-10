// The learner's side of a class: join with the code the teacher gives, see whether work has gone
// to the teacher, leave. And "From your teacher" in Learn: what the teacher set next.
import { useState } from 'react';
import { activityById } from '../data/curriculum.ts';
import { classLink, useMyClass } from '../sync/index.ts';
import type { ClassLinkInfo } from '../sync/classLink.ts';
import { Icon, type IconName } from '../ui/icons.tsx';
import { titleOf } from './LearnScreen.tsx';

function syncLine(l: ClassLinkInfo): { icon: IconName; text: string } {
  switch (l.state) {
    case 'synced':
      return { icon: 'good', text: 'Up to date with your teacher.' };
    case 'syncing':
      return { icon: 'sync', text: 'Sending…' };
    case 'pending':
      return { icon: 'pending', text: l.pending === 1 ? 'One try is waiting to send.' : `${l.pending} tries are waiting to send.` };
    case 'offline':
      return { icon: 'cloudOff', text: l.error ?? 'No connection. Your work is safe here.' };
    case 'revoked':
      return { icon: 'alert', text: l.error ?? 'This device isn’t linked any more. Ask your teacher for a new code.' };
    default:
      return { icon: 'alert', text: l.error ?? 'Carmen couldn’t reach your class. It will try again.' };
  }
}

export function MyClassSection() {
  const { key, link } = useMyClass();
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [leaving, setLeaving] = useState(false);

  if (!classLink.configured)
    return (
      <section className="sheet-group" aria-labelledby="class-h">
        <h3 id="class-h" className="group-h">
          My class
        </h3>
        <p className="note-text">Joining a class isn’t set up for this copy of Carmen yet. Your work stays on this device.</p>
      </section>
    );

  return (
    <section className="sheet-group my-class" aria-labelledby="class-h">
      <h3 id="class-h" className="group-h">
        My class
      </h3>
      {link ? (
        <>
          <p className="setting-label">
            {link.className}, as {link.nickname}
          </p>
          <p className="sync-line" role="status">
            <Icon name={syncLine(link).icon} size={20} /> {syncLine(link).text}
          </p>
          <p className="note-text">Your teacher sees which activities you tried, how they went and which help was on. Never recordings or anything you say.</p>
          <div className="row">
            {link.state !== 'revoked' && (
              <button type="button" className="btn-quiet" onClick={() => void classLink.sync(key)}>
                <Icon name="sync" size={20} /> Send now
              </button>
            )}
            {!leaving ? (
              <button type="button" className="btn-text" onClick={() => setLeaving(true)}>
                Leave this class
              </button>
            ) : (
              <span className="row" role="group" aria-label="Leave this class?">
                <span className="note-text">Work already sent stays with your teacher. New work stays here.</span>
                <button type="button" className="btn btn-coral" onClick={() => void classLink.leave(key).then(() => setLeaving(false))}>
                  Leave
                </button>
                <button type="button" className="btn-quiet" onClick={() => setLeaving(false)}>
                  Stay
                </button>
              </span>
            )}
          </div>
          {link.state === 'revoked' && (
            <button type="button" className="btn-quiet" onClick={() => void classLink.leave(key).then(() => setOpen(true))}>
              Enter a new code
            </button>
          )}
        </>
      ) : !open ? (
        <>
          <p className="note-text">Has your teacher given you a code? Join their class to see what they set, and send them how you’re going.</p>
          <button type="button" className="btn-quiet" onClick={() => setOpen(true)}>
            <Icon name="assign" size={20} /> Join my class
          </button>
        </>
      ) : (
        <form
          className="join-form"
          onSubmit={(e) => {
            e.preventDefault();
            setBusy(true);
            setError('');
            classLink
              .join(key, code)
              .then(() => setOpen(false), (er: Error) => setError(er.message))
              .finally(() => setBusy(false));
          }}
        >
          <label className="field">
            <span className="field-label">Class code</span>
            <input value={code} onChange={(e) => setCode(e.target.value)} autoComplete="off" autoCapitalize="characters" spellCheck={false} inputMode="text" maxLength={8} aria-describedby="join-help" aria-invalid={!!error} />
          </label>
          <p id="join-help" className="note-text">
            6 letters and numbers, from your teacher. Only new work is sent, from now on.
          </p>
          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}
          <div className="row">
            <button type="submit" className="btn btn-primary" disabled={busy || code.trim().length < 6}>
              {busy ? 'Joining…' : 'Join'}
            </button>
            <button type="button" className="btn-quiet" onClick={() => setOpen(false)}>
              Not now
            </button>
          </div>
        </form>
      )}
    </section>
  );
}

/** "From your teacher": the next activity the teacher chose and what they assigned. */
export function FromTeacher({ go }: { go: (h: string) => void }) {
  const { key, link } = useMyClass();
  if (!link) return null;
  // A named player's "Carry on" already follows the teacher's next choice; a guest sees it here.
  const items = [
    ...(link.plan?.next_activity_id && key === 'guest' ? [{ id: link.plan.next_activity_id, note: 'Your teacher chose this next for you.' }] : []),
    ...link.assignments.filter((a) => a.activity_id !== link.plan?.next_activity_id).map((a) => ({ id: a.activity_id, note: a.note ?? '' })),
  ].filter((x) => activityById(x.id));
  if (!items.length) return null;
  return (
    <section className="from-teacher-card" aria-labelledby="ft-h">
      <h2 id="ft-h" className="h3">
        <Icon name="assign" size={24} /> From your teacher
      </h2>
      <ul className="plain ft-list">
        {items.slice(0, 3).map((x) => (
          <li key={x.id}>
            <button type="button" className="ft-item" onClick={() => go(activityById(x.id)?.kind === 'project' ? `#/mission/${x.id}` : `#/lesson/${x.id}`)}>
              <span className="ft-title">{titleOf(x.id)}</span>
              {x.note && <span className="ft-note">{x.note}</span>}
              <Icon name="next" size={20} />
            </button>
          </li>
        ))}
      </ul>
      {link.state === 'offline' && <p className="note-text">Offline: this is what your teacher set last time Carmen connected.</p>}
    </section>
  );
}
