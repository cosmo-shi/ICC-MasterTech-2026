import type { ListenCoach } from '../ai/listenCoach.ts';
import { Icon } from './icons.tsx';
import { usePlayer } from './usePlayer.ts';

/**
 * The coach's read of the timing. "Carmen listened to your timing" only when the on-device model
 * ran; otherwise "A tip" (reviewed rules). One observation, one next step, and a verified example.
 */
export function ListenCoachCard({ coach, onHear }: { coach: ListenCoach; onHear?: (planId: string) => void }) {
  const player = usePlayer();
  const r = coach.reply;
  return (
    <section className="listen-coach" aria-label="Coach">
      <p className="lc-source">
        <Icon name={coach.source === 'local-model' ? 'ear' : 'hint'} size={18} />
        {coach.source === 'local-model' ? 'Carmen listened to your timing' : 'A tip'}
      </p>
      <p className="lc-obs">{coach.observation}</p>
      <p className="lc-tip">{coach.tip}</p>
      {r && (
        <div className="lc-reply">
          <button
            type="button"
            className="chip chip-example"
            onClick={() => {
              if (player.playing) player.stop();
              else {
                void player.play(r.render.tracks, r.render.tempoBpm, { totalTicks: r.render.totalTicks, countInBeats: 0 });
                onHear?.(r.planId);
              }
            }}
          >
            <Icon name={player.playing ? 'stop' : 'playback'} size={18} /> {player.playing ? 'Stop' : r.replyText}
          </button>
          <details className="checked">
            <summary>What changed</summary>
            <ul>
              {r.verification.verified.map((v) => (
                <li key={v}>✓ {v}</li>
              ))}
              {r.render.tracks.length > 1 && <li>The metronome beat is added, it isn’t your part.</li>}
            </ul>
          </details>
        </div>
      )}
    </section>
  );
}
