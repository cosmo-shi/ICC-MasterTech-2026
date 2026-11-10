import { useEffect, useState } from 'react';
import { type CompositionRecord, store } from '../store/db.ts';
import { Icon, WelcomeArt } from '../ui/icons.tsx';
import { usePlayer } from '../ui/usePlayer.ts';
import { mine, players } from '../store/profiles.ts';

export function MyMusic({ go }: { go: (r: string) => void }) {
  const [items, setItems] = useState<CompositionRecord[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [renaming, setRenaming] = useState<string | null>(null);
  const [draft, setDraft] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const player = usePlayer();

  useEffect(() => {
    const load = () =>
      store.all<CompositionRecord>('compositions').then(
        (r) => setItems(r.filter(mine).sort((a, b) => b.createdAt - a.createdAt)),
        () => setError('Your saved music could not be opened in this browser.'),
      );
    load();
    const off1 = store.subscribe(load);
    const off2 = players.subscribe(load);
    return () => {
      off1();
      off2();
    };
  }, []);

  const play = (c: CompositionRecord) => {
    if (playingId === c.id) {
      player.stop();
      setPlayingId(null);
      return;
    }
    setPlayingId(c.id);
    void player.play([{ events: c.events }], c.tempoBpm, { totalTicks: c.totalTicks, onEnd: () => setPlayingId(null) });
  };

  return (
    <div className="screen mymusic">
      <h1 className="h1">My music</h1>
      {!store.isPersistent && (
        <div className="save-status">
          <Icon name="music" size={28} />
          <p>Saving is off, so this music goes when Carmen closes.</p>
        </div>
      )}
      {error && <p className="note-text">{error}</p>}
      {items && items.length === 0 && (
        <div className="panel empty">
          <WelcomeArt width={200} />
          <p className="h2">Nothing saved yet</p>
          <p className="support">Record something on Play, then press Save.</p>
          <button type="button" className="btn" onClick={() => go('#/play')}>
            Make some music
          </button>
        </div>
      )}
      <ul className="music-list">
        {items?.map((c) => (
          <li key={c.id} className="music-item">
            {renaming === c.id ? (
              <form
                className="row wrap"
                onSubmit={(e) => {
                  e.preventDefault();
                  void store.put('compositions', { ...c, title: draft.trim().slice(0, 60) || c.title });
                  setRenaming(null);
                }}
              >
                <label className="field">
                  New name
                  <input value={draft} maxLength={60} onChange={(e) => setDraft(e.target.value)} autoFocus />
                </label>
                <button type="submit" className="btn">
                  Save name
                </button>
                <button type="button" className="btn-quiet" onClick={() => setRenaming(null)}>
                  Cancel
                </button>
              </form>
            ) : (
              <>
                <div className="music-info">
                  <span className="music-title">{c.title}</span>
                  <span className="music-meta">
                    {c.instrument === 'keyboard' ? 'Keyboard' : 'Drums'} · {c.events.filter((e) => e.kind !== 'rest').length} sounds
                    {c.partner && ` · with a partner change (${c.partner.op.replace('_', ' ')})`}
                  </span>
                </div>
                <div className="row wrap">
                  <button type="button" className="btn-quiet" onClick={() => play(c)} aria-label={`${playingId === c.id ? 'Stop' : 'Play'} ${c.title}`}>
                    {playingId === c.id ? 'Stop' : <><span aria-hidden="true">▶ </span>Play</>}
                  </button>
                  <button
                    type="button"
                    className="btn-quiet"
                    onClick={() => {
                      setRenaming(c.id);
                      setDraft(c.title);
                    }}
                  >
                    Rename
                  </button>
                  {confirmDelete === c.id ? (
                    <>
                      <button type="button" className="btn btn-coral" onClick={() => { void store.delete('compositions', c.id); setConfirmDelete(null); }}>
                        Yes, delete it
                      </button>
                      <button type="button" className="btn-quiet" onClick={() => setConfirmDelete(null)}>
                        Keep it
                      </button>
                    </>
                  ) : (
                    <button type="button" className="btn-quiet" onClick={() => setConfirmDelete(c.id)}>
                      Delete
                    </button>
                  )}
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
