import { useEffect, useState } from 'react';
import { usePrefs } from '../state/prefs.tsx';
import { type CompositionRecord, store } from '../store/db.ts';
import { Icon } from '../ui/icons.tsx';
import { usePlayer } from '../ui/usePlayer.ts';
import { mine, players } from '../store/profiles.ts';
import { CreatePanel } from './CreatePanel.tsx';
import { lessonById } from '../data/catalog.ts';

/** The most recent saved piece, so a learner can pick up where they left off. */
function useLatestPiece(): CompositionRecord | null {
  const [latest, setLatest] = useState<CompositionRecord | null>(null);
  useEffect(() => {
    const load = () =>
      store.all<CompositionRecord>('compositions').then(
        (r) => setLatest(r.filter(mine).sort((a, b) => b.createdAt - a.createdAt)[0] ?? null),
        () => setLatest(null),
      );
    load();
    const off1 = store.subscribe(load);
    const off2 = players.subscribe(load);
    return () => {
      off1();
      off2();
    };
  }, []);
  return latest;
}

export function PlayScreen({ go, makeFrom }: { go: (r: string) => void; makeFrom?: string }) {
  const { prefs, set } = usePrefs();
  const from = makeFrom ? lessonById(makeFrom) : undefined;
  const ideaPhrase = from ? (from.practice ?? from.independent) : null;
  const idea = from && ideaPhrase ? { title: from.title, lessonId: from.id, phrase: ideaPhrase } : undefined;
  const [instrument, setInstrument] = useState(idea ? idea.phrase.instrument : prefs.instrument);
  const latest = useLatestPiece();
  const player = usePlayer();
  return (
    <div className="screen play">
      <h1 className="sr-only">Play</h1>
      <div className="play-bar">
        <div className="segmented instrument-switch" role="group" aria-label="Instrument">
          {(['keyboard', 'drums'] as const).map((i) => (
            <button
              key={i}
              type="button"
              className="segment"
              aria-pressed={instrument === i}
              onClick={() => {
                setInstrument(i);
                set('instrument', i);
              }}
            >
              <Icon name={i === 'keyboard' ? 'piano' : 'drum'} size={20} />
              {i === 'keyboard' ? 'Piano' : 'Drums'}
            </button>
          ))}
        </div>
        {!idea && (
          <button type="button" className="input-chip" onClick={() => go('#/play/instrument')}>
            <Icon name="listen" size={20} /> <span className="chip-long">Use my instrument</span><span className="chip-short">My instrument</span>
          </button>
        )}
        {latest && !idea && (
          <div className="last-piece">
            <button
              type="button"
              className="last-play"
              aria-label={player.playing ? `Stop ${latest.title}` : `Play your last piece, ${latest.title}`}
              onClick={() => (player.playing ? player.stop() : void player.play([{ events: latest.events }], latest.tempoBpm, { totalTicks: latest.totalTicks }))}
            >
              <span className="last-icon">
                <Icon name={player.playing ? 'stop' : 'playback'} size={14} />
              </span>
              <span className="last-text">
                <span className="last-kicker">Last time</span>
                <span className="last-title">{latest.title}</span>
              </span>
            </button>
            <button type="button" className="last-more" onClick={() => go('#/music')} aria-label="All my music">
              <Icon name="music" size={20} />
            </button>
          </div>
        )}
      </div>
      <CreatePanel key={instrument} instrument={instrument} idea={idea} activityId={idea?.lessonId} onBackToLesson={idea ? () => go(`#/lesson/${idea.lessonId}/summary`) : undefined} />
    </div>
  );
}
