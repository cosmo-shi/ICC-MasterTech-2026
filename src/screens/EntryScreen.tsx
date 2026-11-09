import { useEffect, useRef, useState } from 'react';
import { lessonById } from '../data/catalog.ts';
import { routeLessons } from '../data/route.ts';
import { type PathwayId, usePrefs } from '../state/prefs.tsx';
import { PLAYER_COLOURS, type Player, type PlayerColour, players, teacher, usePlayers } from '../store/profiles.ts';
import { Band, Horizon, Icon, type IconName, Wordmark } from '../ui/icons.tsx';

export function Avatar({ player, size = 48 }: { player: Pick<Player, 'name' | 'colour'>; size?: number }) {
  return (
    <span className={`avatar c-${player.colour}`} style={{ width: size, height: size, fontSize: size * 0.42 }} aria-hidden="true">
      {player.name.slice(0, 1).toUpperCase() || '?'}
    </span>
  );
}

const STARTS: { id: PathwayId; title: string; sub: string; icon: IconName }[] = [
  { id: 'F', title: 'I’m brand new', sub: 'Loud, soft and sound stories', icon: 'path-F' },
  { id: '1-2', title: 'I can clap a beat', sub: 'Beat and rhythm', icon: 'path-1-2' },
  { id: '3-4', title: 'I know some notes', sub: 'High, low, C D E', icon: 'path-3-4' },
  { id: '5-6', title: 'I read a little music', sub: 'Long notes, rests, reading', icon: 'path-5-6' },
  { id: 'older', title: 'I’m in high school or older', sub: 'Studio style', icon: 'path-older' },
];

type Step = 'welcome' | 'pick' | 'name' | 'look' | 'start' | 'ready' | 'teacher';

/** The way in: a short sign-up for a new player, a picker for returning ones, and a separate door for teachers. */
export function EntryScreen({ onDone, go, canClose, initial }: { onDone: () => void; go: (r: string) => void; canClose: boolean; initial?: 'teacher' }) {
  const { players: list } = usePlayers();
  const { set } = usePrefs();
  const [step, setStep] = useState<Step>(initial ?? (list.length ? 'pick' : 'welcome'));
  const [name, setName] = useState('');
  const [colour, setColour] = useState<PlayerColour>(PLAYER_COLOURS[list.length % PLAYER_COLOURS.length]);
  const [start, setStart] = useState<PathwayId | null>(null);
  const [made, setMade] = useState<Player | null>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => heading.current?.focus(), [step]);

  const choose = (p: Player) => {
    players.choose(p.id);
    set('saveOnDevice', true);
    if (p.start) set('pathway', p.start);
    onDone();
  };
  const finishSignUp = () => {
    setMade({ id: '', name: name.trim(), colour, createdAt: 0, start: start ?? 'F' });
    setStep('ready');
  };
  // The player is created on the last tap, so the welcome screen isn't closed early.
  const enter = (route: string) => {
    players.add(name, colour, start ?? 'F');
    set('saveOnDevice', true);
    set('pathway', start ?? 'F');
    onDone();
    go(route);
  };
  const first = lessonById(routeLessons(start ?? 'F')[0]);

  const progress = { name: 1, look: 2, start: 3 } as Record<Step, number>;
  const back: Partial<Record<Step, Step>> = { name: list.length ? 'pick' : 'welcome', look: 'name', start: 'look', teacher: list.length ? 'pick' : 'welcome' };

  return (
    <div className={`entry entry-${step}`} role="dialog" aria-modal="true" aria-labelledby="entry-h">
      {(step === 'welcome' || step === 'pick') && (
        <div className="entry-scene" aria-hidden="true">
          <Horizon scene="play" />
        </div>
      )}
      {progress[step] && (
        <div className="entry-bar">
          <button type="button" className="icon-btn quiet" aria-label="Back" onClick={() => setStep(back[step]!)}>
            <Icon name="back" size={22} />
          </button>
          <div className="progress" role="progressbar" aria-label="Sign up" aria-valuemin={0} aria-valuemax={3} aria-valuenow={progress[step]}>
            <span style={{ width: `${(progress[step] / 3) * 100}%` }} />
          </div>
        </div>
      )}
      {step === 'teacher' && (
        <div className="entry-bar">
          <button type="button" className="icon-btn quiet" aria-label="Back" onClick={() => (initial ? go('#/play') : setStep(back.teacher!))}>
            <Icon name="back" size={22} />
          </button>
        </div>
      )}

      <div className="entry-body">
        {step === 'welcome' && (
          <>
            <div className="entry-hero">
              <Wordmark size={56} />
              <Band width={240} />
            </div>
            <h1 id="entry-h" ref={heading} tabIndex={-1} className="entry-title">
              Make music. Find out how it works.
            </h1>
          </>
        )}

        {step === 'pick' && (
          <>
            <div className="entry-hero small">
              <Wordmark size={40} />
            </div>
            <h1 id="entry-h" ref={heading} tabIndex={-1} className="entry-title">
              Who’s playing?
            </h1>
            <ul className="who-list">
              {list.map((p) => (
                <li key={p.id}>
                  <button type="button" className="who" onClick={() => choose(p)}>
                    <Avatar player={p} size={72} />
                    <span className="who-name">{p.name}</span>
                  </button>
                </li>
              ))}
              <li>
                <button type="button" className="who" onClick={() => setStep('name')}>
                  <span className="avatar c-new" style={{ width: 72, height: 72 }} aria-hidden="true">
                    +
                  </span>
                  <span className="who-name">New player</span>
                </button>
              </li>
            </ul>
          </>
        )}

        {step === 'name' && (
          <form className="entry-form" id="name-form" onSubmit={(e) => { e.preventDefault(); if (name.trim()) setStep('look'); }}>
            <h1 id="entry-h" ref={heading} tabIndex={-1} className="entry-title">
              What should we call you?
            </h1>
            <input className="big-input" aria-label="Your first name or a nickname" placeholder="First name or nickname" value={name} onChange={(e) => setName(e.target.value)} maxLength={20} autoComplete="off" autoCapitalize="words" enterKeyHint="next" />
          </form>
        )}

        {step === 'look' && (
          <>
            <h1 id="entry-h" ref={heading} tabIndex={-1} className="entry-title">
              Pick your colour
            </h1>
            <div className="look-preview">
              <Avatar player={{ name, colour }} size={120} />
              <span className="who-name">{name.trim()}</span>
            </div>
            <div className="colour-row" role="radiogroup" aria-label="Colour">
              {PLAYER_COLOURS.map((c) => (
                <button key={c} type="button" role="radio" aria-checked={colour === c} aria-label={c} className={`colour-opt c-${c}${colour === c ? ' is-on' : ''}`} onClick={() => setColour(c)} />
              ))}
            </div>
          </>
        )}

        {step === 'start' && (
          <>
            <h1 id="entry-h" ref={heading} tabIndex={-1} className="entry-title">
              Where do you want to start?
            </h1>
            <div className="start-list" role="radiogroup" aria-label="Where to start">
              {STARTS.map((s) => (
                <button key={s.id} type="button" role="radio" aria-checked={start === s.id} className={`start-card${start === s.id ? ' is-on' : ''}`} onClick={() => setStart(s.id)}>
                  <Icon name={s.icon} size={40} />
                  <span>
                    <span className="start-title">{s.title}</span>
                    <span className="start-sub">{s.sub}</span>
                  </span>
                </button>
              ))}
            </div>
          </>
        )}

        {step === 'ready' && made && (
          <>
            <Avatar player={made} size={120} />
            <h1 id="entry-h" ref={heading} tabIndex={-1} className="entry-title">
              Hi {made.name}!
            </h1>
            {first && (
              <div className="first-lesson">
                <span className="kicker">Your first lesson</span>
                <span className="first-title">{first.title}</span>
              </div>
            )}
          </>
        )}

        {step === 'teacher' && <TeacherDoor onOpen={() => { onDone(); go('#/teacher'); }} heading={heading} />}
      </div>

      <div className="entry-foot">
        {step === 'welcome' && (
          <>
            <button type="button" className="btn btn-big btn-block" onClick={() => setStep('name')}>
              Get started
            </button>
            <button type="button" className="btn-text" onClick={() => setStep('teacher')}>
              I’m a teacher
            </button>
          </>
        )}
        {step === 'pick' && (
          <>
            {canClose && (
              <button type="button" className="btn-quiet btn-block" onClick={onDone}>
                Back
              </button>
            )}
            <button type="button" className="btn-text" onClick={() => setStep('teacher')}>
              <Icon name="grownups" size={18} /> Teacher
            </button>
          </>
        )}
        {step === 'name' && (
          <button type="submit" form="name-form" className="btn btn-big btn-block" disabled={!name.trim()}>
            Continue
          </button>
        )}
        {step === 'look' && (
          <button type="button" className="btn btn-big btn-block" onClick={() => setStep('start')}>
            Continue
          </button>
        )}
        {step === 'start' && (
          <button type="button" className="btn btn-big btn-block" disabled={!start} onClick={finishSignUp}>
            Continue
          </button>
        )}
        {step === 'ready' && (
          <>
            {first && (
              <button type="button" className="btn btn-big btn-block" onClick={() => enter(`#/lesson/${first.id}`)}>
                Start my first lesson
              </button>
            )}
            <button type="button" className="btn-text" onClick={() => enter('#/play')}>
              Just play first
            </button>
          </>
        )}
      </div>
    </div>
  );
}

/** PIN pad: create a PIN the first time, then enter it. */
export function TeacherDoor({ onOpen, heading }: { onOpen: () => void; heading?: React.RefObject<HTMLHeadingElement | null> }) {
  const exists = teacher.hasPin();
  const [pin, setPin] = useState('');
  const [firstPin, setFirstPin] = useState<string | null>(null);
  const [error, setError] = useState('');
  const title = exists ? 'Teacher sign-in' : firstPin ? 'Type it again' : 'Make a teacher PIN';

  const submit = async (value: string) => {
    if (exists) {
      if (await teacher.check(value)) onOpen();
      else {
        setError('That PIN isn’t right.');
        setPin('');
      }
    } else if (!firstPin) {
      setFirstPin(value);
      setPin('');
    } else if (value === firstPin) {
      await teacher.setPin(value);
      onOpen();
    } else {
      setError('Those didn’t match. Start again.');
      setFirstPin(null);
      setPin('');
    }
  };
  const press = (d: string) => {
    setError('');
    const v = (pin + d).slice(0, 4);
    setPin(v);
    if (v.length === 4) void submit(v);
  };

  return (
    <div className="pin">
      <Icon name="grownups" size={40} />
      <h1 id="entry-h" ref={heading} tabIndex={-1} className="entry-title">
        {title}
      </h1>
      {!exists && !firstPin && <p className="pin-sub">4 numbers, for teachers only</p>}
      <div className="pin-dots" aria-label={`${pin.length} of 4 numbers entered`} role="status">
        {[0, 1, 2, 3].map((i) => (
          <span key={i} className={i < pin.length ? 'on' : ''} />
        ))}
      </div>
      <p className="pin-error" role="alert">
        {error}
      </p>
      <div className="pin-pad">
        {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((d) => (
          <button key={d} type="button" className="pin-key" onClick={() => press(d)}>
            {d}
          </button>
        ))}
        <span />
        <button type="button" className="pin-key" onClick={() => press('0')}>
          0
        </button>
        <button type="button" className="pin-key" aria-label="Delete" onClick={() => setPin((p) => p.slice(0, -1))}>
          <Icon name="back" size={22} />
        </button>
      </div>
    </div>
  );
}
