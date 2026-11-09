import { useState, type FormEvent } from 'react';
import { TPQ } from '../music/events.ts';
import { SONGS, type Song, findSong } from '../music/songs.ts';
import { Notation } from './Notation.tsx';
import { usePlayer } from './usePlayer.ts';

interface Props {
  /** Light these keys on the keyboard (or nothing). */
  onShowKeys: (notes: ReadonlySet<number> | undefined) => void;
}

/**
 * "Play a song you know": type a song name, see the start of the tune as notation,
 * hear it, and light up its keys. Only songs in Carmen's songbook (traditional,
 * public domain, src/data/songs.json). Nothing is made up: unknown songs get an honest "not yet".
 */
export function SongFinder({ onShowKeys }: Props) {
  const [text, setText] = useState('');
  const [song, setSong] = useState<Song | null>(null);
  const [missing, setMissing] = useState<string | null>(null);
  const [showKeys, setShowKeys] = useState(false);
  const player = usePlayer();

  const choose = (s: Song | null, asked: string) => {
    player.stop();
    setSong(s);
    setMissing(s ? null : asked);
    setShowKeys(false);
    onShowKeys(undefined);
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    choose(findSong(text), text.trim());
  };

  const toggleKeys = (on: boolean) => {
    setShowKeys(on);
    onShowKeys(on && song ? new Set(song.phrase.events.flatMap((e) => (e.kind === 'note' ? [e.midi] : []))) : undefined);
  };

  const listen = () => {
    if (!song) return;
    if (player.playing) return player.stop();
    void player.play([{ events: song.phrase.events }], song.phrase.tempoBpm, { totalTicks: song.phrase.totalTicks, countInBeats: 0, click: false });
  };

  // The note sounding now, so the music follows along while it plays.
  const active =
    song && player.beat !== null
      ? song.phrase.events.findIndex((e) => e.onset / TPQ <= player.beat! && player.beat! < (e.onset + e.duration) / TPQ)
      : undefined;

  return (
    <section className="song-finder" aria-labelledby="song-h">
      <h2 id="song-h" className="h3">
        Play a song you know
      </h2>
      <form className="song-form" onSubmit={submit}>
        <label className="field">
          Song name
          <input type="text" value={text} maxLength={60} placeholder="For example: Twinkle, Twinkle" autoComplete="off" onChange={(e) => setText(e.target.value)} />
        </label>
        <button type="submit" className="btn">
          Find it
        </button>
      </form>

      <div role="status" aria-live="polite">
        {missing && <p className="note-text">“{missing}” isn’t in Carmen’s songbook yet. Try one of these:</p>}
      </div>

      {(missing || !song) && (
        <ul className="song-chips" aria-label="Songs in the songbook">
          {SONGS.map((s) => (
            <li key={s.id}>
              <button type="button" className="btn-quiet small" onClick={() => { setText(s.title); choose(s, s.title); }}>
                {s.title}
              </button>
            </li>
          ))}
        </ul>
      )}

      {song && (
        <div className="song-card">
          <h3 className="h3">{song.title}</h3>
          <Notation phrase={song.phrase} activeIndex={active !== undefined && active >= 0 ? active : undefined} />
          <div className="row wrap">
            <button type="button" className="btn-quiet" onClick={listen}>
              {player.playing ? 'Stop' : <><span aria-hidden="true">▶ </span>Listen</>}
            </button>
            <label className="check">
              <input type="checkbox" checked={showKeys} onChange={(e) => toggleKeys(e.target.checked)} />
              Light up the keys
            </label>
          </div>
          <p className="note-text">The start of the tune. {song.source}.</p>
        </div>
      )}
    </section>
  );
}
