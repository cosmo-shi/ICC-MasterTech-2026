import { useEffect, useRef, useState } from 'react';
import { type CompositionRecord, type RecordingRecord, store } from '../store/db.ts';
import { Icon, WelcomeArt } from '../ui/icons.tsx';
import { usePlayer } from '../ui/usePlayer.ts';
import { mine, players } from '../store/profiles.ts';

export function MyMusic({ go }: { go: (r: string) => void }) {
  const [items, setItems] = useState<CompositionRecord[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [renaming, setRenaming] = useState<string | null>(null);
  const [draft, setDraft] = useState('');
  const [recordings, setRecordings] = useState<RecordingRecord[]>([]);
  const [listeningTo, setListeningTo] = useState<{ id: string; url: string } | null>(null);
  // Deleting is immediate, with a short Undo: the record is put back exactly as it was.
  const [undo, setUndo] = useState<{ kind: 'compositions' | 'recordings'; value: CompositionRecord | RecordingRecord } | null>(null);
  const undoTimer = useRef(0);
  const player = usePlayer();

  const remove = (kind: 'compositions' | 'recordings', value: CompositionRecord | RecordingRecord) => {
    void store.delete(kind, value.id);
    if (listeningTo?.id === value.id) setListeningTo(null);
    window.clearTimeout(undoTimer.current);
    setUndo({ kind, value });
    undoTimer.current = window.setTimeout(() => setUndo(null), 8000);
  };
  useEffect(() => () => window.clearTimeout(undoTimer.current), []);
  useEffect(
    () => () => {
      if (listeningTo) URL.revokeObjectURL(listeningTo.url);
    },
    [listeningTo],
  );

  useEffect(() => {
    const load = () =>
      store.all<CompositionRecord>('compositions').then(
        (r) => setItems(r.filter(mine).sort((a, b) => b.createdAt - a.createdAt)),
        () => setError('Your saved music could not be opened in this browser.'),
      ).then(() =>
        store.all<RecordingRecord>('recordings').then(
          (r) => setRecordings(r.filter(mine).sort((a, b) => b.createdAt - a.createdAt)),
          () => setRecordings([]),
        ),
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
      {undo && (
        <div className="undo-bar" role="status">
          <span>Deleted “{undo.value.title}”.</span>
          <button
            type="button"
            className="btn-quiet small"
            onClick={() => {
              void store.put(undo.kind, undo.value);
              setUndo(null);
            }}
          >
            <Icon name="undo" size={18} /> Undo
          </button>
        </div>
      )}
      {items && items.length === 0 && recordings.length === 0 && (
        <div className="panel empty">
          <WelcomeArt width={200} />
          <p className="h2">Nothing saved yet</p>
          <p className="support">Record something on Play, then press Save. Or play your own instrument with “Use my instrument”.</p>
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
                  <button type="button" className="btn-quiet" onClick={() => remove('compositions', c)} aria-label={`Delete ${c.title}`}>
                    <Icon name="trash" size={18} /> Delete
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
      {recordings.length > 0 && (
        <section className="recordings" aria-labelledby="rec-h">
          <h2 id="rec-h" className="h2">
            Recordings
          </h2>
          <p className="support">Sound from the microphone, kept because you pressed Record. It stays in this browser and is never sent anywhere.</p>
          <ul className="music-list">
            {recordings.map((r) => (
              <li key={r.id} className="music-item">
                {renaming === r.id ? (
                  <form
                    className="row wrap"
                    onSubmit={(e) => {
                      e.preventDefault();
                      void store.put('recordings', { ...r, title: draft.trim().slice(0, 60) || r.title });
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
                      <span className="music-title">
                        <Icon name="mic" size={18} /> {r.title}
                      </span>
                      <span className="music-meta">
                        {r.instrument === 'piano' ? 'Piano' : 'Drum'} · {r.durationSec} s · {Math.max(1, Math.round(r.size / 1024))} KB
                      </span>
                    </div>
                    {listeningTo?.id === r.id && <audio controls autoPlay src={listeningTo.url} />}
                    <div className="row wrap">
                      <button
                        type="button"
                        className="btn-quiet"
                        onClick={() => setListeningTo(listeningTo?.id === r.id ? null : { id: r.id, url: URL.createObjectURL(new Blob([r.bytes], { type: r.mime })) })}
                      >
                        {listeningTo?.id === r.id ? 'Close' : <><span aria-hidden="true">▶ </span>Listen</>}
                      </button>
                      <button type="button" className="btn-quiet" onClick={() => { setRenaming(r.id); setDraft(r.title); }}>
                        Rename
                      </button>
                      <button type="button" className="btn-quiet" onClick={() => remove('recordings', r)} aria-label={`Delete ${r.title}`}>
                        <Icon name="trash" size={18} /> Delete
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
