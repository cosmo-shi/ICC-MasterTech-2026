import { useEffect, useState } from 'react';
import { usePrefs } from '../state/prefs.tsx';
import { type CompositionRecord, store } from '../store/db.ts';
import { Motif } from '../ui/common.tsx';
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
  const studio = prefs.pathway === 'older';
  return (
    <div className="screen play">
      <header className="play-head">
        <div className="hello">
          {!studio && <Motif size={44} />}
          <div>
            <h1 className="h1">{studio ? 'Studio' : 'Make some music'}</h1>
            <p className="lede">{studio ? 'Play freely and record an idea. Nothing here is marked.' : 'Tap the keys or pads. Nothing is marked here — just play.'}</p>
          </div>
        </div>
        <div className="mode-switch big" role="group" aria-label="Choose an instrument">
          {(['keyboard', 'drums'] as const).map((i) => (
            <button
              key={i}
              type="button"
              className={`seg${instrument === i ? ' is-on' : ''}`}
              aria-pressed={instrument === i}
              onClick={() => {
                setInstrument(i);
                set('instrument', i);
              }}
            >
              {i === 'keyboard' ? 'Keyboard' : 'Drums'}
            </button>
          ))}
        </div>
      </header>
      {latest && (
        <section className="continue" aria-labelledby="continue-h">
          <Icon name="saved" size={32} />
          <div className="continue-text">
            <h2 id="continue-h" className="continue-label">
              Carry on from last time
            </h2>
            <p className="continue-title">{latest.title}</p>
          </div>
          <div className="row wrap">
            <button
              type="button"
              className="btn-quiet"
              onClick={() => (player.playing ? player.stop() : void player.play([{ events: latest.events }], latest.tempoBpm, { totalTicks: latest.totalTicks }))}
            >
              {player.playing ? 'Stop' : <><span aria-hidden="true">▶ </span>Hear it</>}
            </button>
            <button type="button" className="btn-quiet" onClick={() => go('#/music')}>
              All my music
            </button>
          </div>
        </section>
      )}
      <CreatePanel key={instrument} instrument={instrument} />
      {!studio && (
        <aside className="panel invite">
          <h2 className="h3">Want to learn something?</h2>
          <p>Choose a pathway: there are activities for Foundation through Year 6, and for older learners.</p>
          <button type="button" className="btn" onClick={() => go('#/learn')}>
            Go to Learn
          </button>
        </aside>
      )}
    </div>
  );
}
