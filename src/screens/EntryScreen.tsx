import { useEffect, useRef, useState } from 'react';
import { usePrefs } from '../state/prefs.tsx';
import { PLAYER_COLOURS, type Player, type PlayerColour, players, usePlayers } from '../store/profiles.ts';
import { Band, Horizon, Wordmark } from '../ui/icons.tsx';

export function Avatar({ player, size = 48 }: { player: Pick<Player, 'name' | 'colour'>; size?: number }) {
  return (
    <span className={`avatar c-${player.colour}`} style={{ width: size, height: size, fontSize: size * 0.42 }} aria-hidden="true">
      {player.name.slice(0, 1).toUpperCase()}
    </span>
  );
}

/** "Who's playing?" — the first screen on a shared device. */
export function EntryScreen({ onDone, canClose }: { onDone: () => void; canClose: boolean }) {
  const { players: list } = usePlayers();
  const { prefs, set } = usePrefs();
  const [adding, setAdding] = useState(list.length === 0);
  const [name, setName] = useState('');
  const [colour, setColour] = useState<PlayerColour>(PLAYER_COLOURS[list.length % PLAYER_COLOURS.length]);
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => heading.current?.focus(), [adding]);

  const choose = (id: string) => {
    players.choose(id);
    if (!prefs.saveOnDevice) set('saveOnDevice', true);
    onDone();
  };
  const create = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    const p = players.add(name, colour);
    choose(p.id);
  };
  const guest = () => {
    players.choose('guest');
    onDone();
  };

  return (
    <div className="entry" role="dialog" aria-modal="true" aria-labelledby="entry-h">
      <div className="backdrop" aria-hidden="true">
        <Horizon scene="play" />
      </div>
      <div className="entry-top">
        <Wordmark size={40} />
      </div>
      <div className="entry-sheet">
        <Band width={200} />
        {!adding ? (
          <>
            <h1 id="entry-h" ref={heading} tabIndex={-1} className="title entry-title">
              Who’s playing?
            </h1>
            <ul className="who-list">
              {list.map((p) => (
                <li key={p.id}>
                  <button type="button" className="who" onClick={() => choose(p.id)}>
                    <Avatar player={p} size={56} />
                    <span className="who-name">{p.name}</span>
                  </button>
                </li>
              ))}
              <li>
                <button type="button" className="who who-new" onClick={() => setAdding(true)}>
                  <span className="avatar c-new" style={{ width: 56, height: 56 }} aria-hidden="true">
                    +
                  </span>
                  <span className="who-name">New player</span>
                </button>
              </li>
            </ul>
            <div className="entry-foot">
              <button type="button" className="btn-quiet" onClick={guest}>
                Just play, don’t keep anything
              </button>
              {canClose && (
                <button type="button" className="btn-quiet" onClick={onDone}>
                  Back
                </button>
              )}
            </div>
          </>
        ) : (
          <form onSubmit={create} className="entry-form">
            <h1 id="entry-h" ref={heading} tabIndex={-1} className="title entry-title">
              {list.length ? 'New player' : 'Hello! What’s your name?'}
            </h1>
            <label className="field">
              <span className="field-label">First name or a nickname</span>
              <input value={name} onChange={(e) => setName(e.target.value)} maxLength={20} autoComplete="off" autoCapitalize="words" enterKeyHint="go" />
            </label>
            <fieldset className="colour-pick">
              <legend className="field-label">Pick your colour</legend>
              <div className="colour-row">
                {PLAYER_COLOURS.map((c) => (
                  <label key={c} className={`colour-opt c-${c}${colour === c ? ' is-on' : ''}`}>
                    <input type="radio" name="colour" value={c} checked={colour === c} onChange={() => setColour(c)} />
                    <span className="sr-only">{c}</span>
                  </label>
                ))}
              </div>
            </fieldset>
            {name.trim() && (
              <p className="entry-preview">
                <Avatar player={{ name, colour }} size={40} /> {name.trim()}
              </p>
            )}
            <p className="support">Your music and progress stay on this device. Nothing is sent anywhere, and there is no password.</p>
            <div className="row wrap">
              <button type="submit" className="btn btn-big" disabled={!name.trim()}>
                Let’s play
              </button>
              {list.length > 0 && (
                <button type="button" className="btn-quiet" onClick={() => setAdding(false)}>
                  Back
                </button>
              )}
              {list.length === 0 && (
                <button type="button" className="btn-quiet" onClick={guest}>
                  Just play, don’t keep anything
                </button>
              )}
            </div>
          </form>
        )}
      </div>
      <a className="entry-grownups" href="#/grownups" onClick={onDone}>
        For teachers and parents
      </a>
    </div>
  );
}
