// "I'm a teacher": Log in or Create account with a school email and a one-time code, then a short
// first-use setup (your name, then create or join a teaching space). If school accounts are not set
// up for this copy of Carmen, it says so and offers only the device PIN, labelled as device-only.
import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { AuthBlocked, looksLikeEmail, looksPersonal, teacherAuth, type TeachingSpace } from '../auth/teacherAuth.ts';
import { teacher } from '../store/profiles.ts';
import { Icon } from '../ui/icons.tsx';
import { Wordmark } from '../ui/brand.tsx';
import { TeacherDoor } from './EntryScreen.tsx';

type Step = 'home' | 'email' | 'code' | 'setup' | 'space' | 'pin' | 'pin-reset';
const SPACE_KEY = 'carmen-teacher-space';

// eslint-disable-next-line react-refresh/only-export-components
export function currentSpace(): TeachingSpace | null {
  try {
    return JSON.parse(sessionStorage.getItem(SPACE_KEY) ?? 'null') as TeachingSpace | null;
  } catch {
    return null;
  }
}

export function TeacherWelcome({ go }: { go: (r: string) => void }) {
  const session = useSyncExternalStore(teacherAuth.subscribe, teacherAuth.current, teacherAuth.current);
  const [step, setStepRaw] = useState<Step>('home');
  const [mode, setMode] = useState<'login' | 'create'>('login');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [school, setSchool] = useState('');
  const [spaceName, setSpaceName] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [sentTo, setSentTo] = useState('');
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    heading.current?.focus();
  }, [step]);
  const setStep = (s: Step) => {
    setError('');
    setStepRaw(s);
  };

  const run = async (f: () => Promise<void>) => {
    setBusy(true);
    setError('');
    try {
      await f();
    } catch (e) {
      setError(e instanceof AuthBlocked ? e.message : e instanceof Error ? e.message : 'Something went wrong.');
    } finally {
      setBusy(false);
    }
  };

  const enter = (space: TeachingSpace) => {
    try {
      sessionStorage.setItem(SPACE_KEY, JSON.stringify(space));
    } catch {
      /* fine */
    }
    teacher.open();
  };

  // After signing in: profile, then a space, then in.
  const afterSignIn = async () => {
    const p = await teacherAuth.profile();
    if (!p) {
      setStep('setup');
      return;
    }
    const spaces = await teacherAuth.spaces();
    if (!spaces.length) setStep('space');
    else enter(spaces[0]);
  };

  const back: Partial<Record<Step, Step>> = { email: 'home', code: 'email', pin: 'home', 'pin-reset': 'pin' };

  return (
    <div className="teacher-welcome">
      <div className="tw-bar">
        {back[step] ? (
          <button type="button" className="btn-quiet small" onClick={() => setStep(back[step]!)}>
            <Icon name="back" size={20} /> Back
          </button>
        ) : (
          <button type="button" className="btn-quiet small" onClick={() => go('#/play')}>
            <Icon name="back" size={20} /> Back to Carmen
          </button>
        )}
        <Wordmark size={24} />
      </div>
      <div className="tw-body">
        {step === 'home' && (
          <>
            <h1 ref={heading} tabIndex={-1} className="title">
              Teacher
            </h1>
            <p className="lede">See how your class is going, and choose what learners are offered next.</p>
            {session ? (
              <div className="stack">
                <p>
                  Signed in as <strong>{session.user.email}</strong>.
                </p>
                <button type="button" className="btn btn-big" disabled={busy} onClick={() => run(afterSignIn)}>
                  Continue
                </button>
                <button type="button" className="btn-quiet" disabled={busy} onClick={() => run(() => teacherAuth.signOut())}>
                  Sign out
                </button>
              </div>
            ) : (
              <div className="stack">
                <button type="button" className="btn btn-big" disabled={!teacherAuth.configured} onClick={() => { setMode('login'); setStep('email'); }}>
                  Log in
                </button>
                <button type="button" className="btn-quiet" disabled={!teacherAuth.configured} onClick={() => { setMode('create'); setStep('email'); }}>
                  Create account
                </button>
                {!teacherAuth.configured && (
                  <div className="trouble" role="note">
                    <p>
                      <strong>School accounts aren’t switched on for this copy of Carmen yet.</strong> Logging in needs Carmen’s school service, which hasn’t been set up.
                    </p>
                    <p>Until then you can use a PIN on this device. It only keeps learners out of this view on this device. It is not a school account, and it doesn’t work on another device.</p>
                  </div>
                )}
                <button type="button" className="btn-text" onClick={() => setStep('pin')}>
                  <Icon name="lock" size={20} /> Use a PIN on this device only
                </button>
              </div>
            )}
          </>
        )}

        {step === 'email' && (
          <form
            className="stack"
            onSubmit={(e) => {
              e.preventDefault();
              if (!looksLikeEmail(email)) return setError('That doesn’t look like an email address.');
              void run(async () => {
                await teacherAuth.sendCode(email, mode === 'create');
                setSentTo(email.trim().toLowerCase());
                setStep('code');
              });
            }}
          >
            <h1 ref={heading} tabIndex={-1} className="title">
              {mode === 'create' ? 'Create a teacher account' : 'Log in'}
            </h1>
            <label className="field">
              Your school email
              <input type="email" autoComplete="email" inputMode="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </label>
            {looksPersonal(email) && <p className="note-text">This looks like a personal address. Use the email your school gave you.</p>}
            <p className="note-text">We’ll email you a 6-digit code. There’s no password to remember.</p>
            <button type="submit" className="btn btn-big" disabled={busy || !email}>
              {busy ? 'Sending…' : 'Send me a code'}
            </button>
            {mode === 'login' ? (
              <button type="button" className="btn-text" onClick={() => setMode('create')}>
                New here? Create an account
              </button>
            ) : (
              <button type="button" className="btn-text" onClick={() => setMode('login')}>
                Already have an account? Log in
              </button>
            )}
          </form>
        )}

        {step === 'code' && (
          <form
            className="stack"
            onSubmit={(e) => {
              e.preventDefault();
              void run(async () => {
                await teacherAuth.verifyCode(sentTo, code);
                await afterSignIn();
              });
            }}
          >
            <h1 ref={heading} tabIndex={-1} className="title">
              Check your email
            </h1>
            <p>
              We sent a code to <strong>{sentTo}</strong>. It may take a minute, and it could be in junk mail.
            </p>
            <label className="field">
              Code
              <input value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 8))} inputMode="numeric" autoComplete="one-time-code" required />
            </label>
            <button type="submit" className="btn btn-big" disabled={busy || code.length < 6}>
              {busy ? 'Checking…' : 'Log in'}
            </button>
            <button type="button" className="btn-text" disabled={busy} onClick={() => run(() => teacherAuth.sendCode(sentTo, mode === 'create'))}>
              Send a new code
            </button>
            <p className="note-text">Can’t get into this email any more? Ask your school to update it; Carmen can’t reset school email.</p>
          </form>
        )}

        {step === 'setup' && (
          <form
            className="stack"
            onSubmit={(e) => {
              e.preventDefault();
              void run(async () => {
                await teacherAuth.saveProfile(name, school);
                await afterSignIn();
              });
            }}
          >
            <h1 ref={heading} tabIndex={-1} className="title">
              Welcome
            </h1>
            <p className="lede">Two quick things, then you’re in.</p>
            <label className="field">
              Your name, as learners know you
              <input value={name} maxLength={60} onChange={(e) => setName(e.target.value)} placeholder="Ms Lee" required />
            </label>
            <label className="field">
              School (optional)
              <input value={school} maxLength={100} onChange={(e) => setSchool(e.target.value)} />
            </label>
            <button type="submit" className="btn btn-big" disabled={busy || !name.trim()}>
              Continue
            </button>
          </form>
        )}

        {step === 'space' && (
          <div className="stack">
            <h1 ref={heading} tabIndex={-1} className="title">
              Your teaching space
            </h1>
            <p className="lede">A space is one class or group. Make one, or join a colleague’s with their code.</p>
            <form
              className="stack tw-card"
              onSubmit={(e) => {
                e.preventDefault();
                void run(async () => enter(await teacherAuth.createSpace(spaceName)));
              }}
            >
              <label className="field">
                New space name
                <input value={spaceName} maxLength={60} onChange={(e) => setSpaceName(e.target.value)} placeholder="Year 3 Music" required />
              </label>
              <button type="submit" className="btn" disabled={busy || !spaceName.trim()}>
                Make the space
              </button>
            </form>
            <form
              className="stack tw-card"
              onSubmit={(e) => {
                e.preventDefault();
                void run(async () => enter(await teacherAuth.joinSpace(joinCode)));
              }}
            >
              <label className="field">
                Join code from a colleague
                <input value={joinCode} maxLength={8} autoCapitalize="characters" onChange={(e) => setJoinCode(e.target.value.toUpperCase())} />
              </label>
              <button type="submit" className="btn-quiet" disabled={busy || joinCode.length < 6}>
                Join
              </button>
            </form>
          </div>
        )}

        {step === 'pin' && (
          <div className="stack">
            <p className="tw-device-note">
              <Icon name="lock" size={20} /> Device only. Not a school account.
            </p>
            <TeacherDoor onOpen={() => { try { sessionStorage.removeItem(SPACE_KEY); } catch { /* fine */ } }} heading={heading} />
            {teacher.hasPin() && (
              <button type="button" className="btn-text" onClick={() => setStep('pin-reset')}>
                Forgot the PIN?
              </button>
            )}
          </div>
        )}

        {step === 'pin-reset' && (
          <div className="stack">
            <h1 ref={heading} tabIndex={-1} className="title">
              Reset the PIN?
            </h1>
            <p>A device PIN can’t be recovered. Resetting removes the PIN and the teacher choices made on this device (what learners are offered next). Learners’ own music and tries stay.</p>
            <button
              type="button"
              className="btn btn-coral"
              onClick={() => {
                teacher.resetPin();
                setStep('pin');
              }}
            >
              Reset the PIN
            </button>
            <button type="button" className="btn-quiet" onClick={() => setStep('pin')}>
              Keep it
            </button>
          </div>
        )}

        {error && (
          <p className="trouble" role="alert">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
