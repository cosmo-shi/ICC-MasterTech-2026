import type { CoachDecision } from '../ai/coach.ts';
import { Icon } from './icons.tsx';
import { usePlayer } from './usePlayer.ts';

interface Props {
  decision: CoachDecision;
  onChoice?: (choice: string) => void;
  /** The take's own what/why/next is shown instead (lessons). */
  hideObservation?: boolean;
}

/** One observation the try supports, and (when it passes the music check) a short example to hear.
 *  No labels about how it was worked out: the Teacher space shows that. */
export function CoachCard({ decision, onChoice, hideObservation }: Props) {
  const player = usePlayer();
  const r = decision.reply;
  if (hideObservation && !r) return null;
  return (
    <section className="coach" aria-label="What happened">
      {!hideObservation && <p className="coach-obs">{decision.observation}</p>}
      {r && (
        <div className="reply">
          <button
            type="button"
            className="chip chip-example"
            onClick={() => {
              if (player.playing) player.stop();
              else {
                void player.play(r.render.tracks, r.render.tempoBpm, { totalTicks: r.render.totalTicks, countInBeats: 0 });
                onChoice?.(`hear-reply:${r.plan.planId}`);
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
