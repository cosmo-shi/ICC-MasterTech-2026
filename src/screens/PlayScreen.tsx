import { useEffect, useState } from 'react';
import { usePrefs } from '../state/prefs.tsx';
import { type CompositionRecord, store } from '../store/db.ts';
import { Icon } from '../ui/icons.tsx';
import { usePlayer } from '../ui/usePlayer.ts';
import { CreatePanel } from './CreatePanel.tsx';

/** The most recent saved piece, so a learner can pick up where they left off. */
function useLatestPiece(): CompositionRecord | null {
  const [latest, setLatest] = useState<CompositionRecord | null>(null);
  useEffect(() => {
    const load = () =>
      store.all<CompositionRecord>('compositions').then(
        (r) => setLatest(r.sort((a, b) => b.createdAt - a.createdAt)[0] ?? null),
        () => setLatest(null),
      );
    load();
    return store.subscribe(load);
  }, []);
  return latest;
}

export function PlayScreen({ go }: { go: (r: string) => void }) {
  const { prefs, set } = usePrefs();
  const [instrument, setInstrument] = useState(prefs.instrument);
  const latest = useLatestPiece();
  const player = usePlayer();
  return (
    <div className="screen play">
      <h1 className="sr-only">Play</h1>
      <div className="play-bar">
        <div className="seg-tabs" role="group" aria-label="Instrument">
          {(['keyboard', 'drums'] as const).map((i) => (
            <button
              key={i}
              type="button"
              className="seg-tab"
              aria-pressed={instrument === i}
              onClick={() => {
                setInstrument(i);
                set('instrument', i);
              }}
            >
              <Icon name={i === 'keyboard' ? 'piano' : 'drum'} size={22} />
              {i === 'keyboard' ? 'Piano' : 'Drums'}
            </button>
          ))}
        </div>
        {latest && (
          <div className="last-piece">
            <button
              type="button"
              className="last-play"
              aria-label={player.playing ? `Stop ${latest.title}` : `Play your last piece, ${latest.title}`}
              onClick={() => (player.playing ? player.stop() : void player.play([{ events: latest.events }], latest.tempoBpm, { totalTicks: latest.totalTicks }))}
            >
              <span className="last-icon">
                <Icon name={player.playing ? 'stop' : 'playback'} size={18} />
              </span>
              <span className="last-title">{latest.title}</span>
            </button>
            <button type="button" className="last-more" onClick={() => go('#/music')} aria-label="All my music">
              <Icon name="forward" size={20} />
            </button>
          </div>
        )}
      </div>
      <CreatePanel key={instrument} instrument={instrument} />
    </div>
  );
}
