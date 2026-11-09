import { useState } from 'react';
import type { CoachDecision } from '../ai/coach.ts';
import coachText from '../data/coach.json';
import { Logo } from './icons.tsx';
import { usePlayer } from './usePlayer.ts';

interface Props {
  decision: CoachDecision;
  onChoice?: (choice: string) => void;
  onReflect?: (id: string | null) => void;
}

export function CoachCard({ decision, onChoice, onReflect }: Props) {
  const [revealed, setRevealed] = useState(decision.focus === 'passed');
  const [reflected, setReflected] = useState<string | null | undefined>(undefined);
  const player = usePlayer();
  const isAI = decision.label === 'AI coach';
  const r = decision.reply;

  return (
    <section className={`coach ${isAI ? 'coach-ai' : 'coach-tips'}`} aria-labelledby="coach-title">
      <header className="coach-head">
        <span className="coach-avatar" aria-hidden="true">
          <Logo size={26} />
        </span>
        <h3 id="coach-title" className="coach-label">
          Carmen <span className="coach-sub">· {isAI ? 'listened to your timing' : 'tip'}</span>
        </h3>
      </header>

      <p className="coach-q">{decision.question}</p>

      {!revealed ? (
        <div className="row">
          <button type="button" className="btn" onClick={() => setRevealed(true)}>
            Show me what happened
          </button>
        </div>
      ) : (
        <>
          <p className="coach-obs">{decision.observation}</p>
          {r && (
            <div className="reply">
              <button
                type="button"
                className="btn btn-sun"
                onClick={() => {
                  if (player.playing) player.stop();
                  else {
                    void player.play(r.render.tracks, r.render.tempoBpm, { totalTicks: r.render.totalTicks, countInBeats: 0 });
                    onChoice?.(`hear-reply:${r.plan.planId}`);
                  }
                }}
              >
                {player.playing ? 'Stop' : <><span aria-hidden="true">▶ </span>{r.replyText}</>}
              </button>
              <details className="checked">
                <summary>What Carmen changed</summary>
                <ul>
                  {r.verification.verified.map((v) => (
                    <li key={v}>✓ {v}</li>
                  ))}
                  {r.render.tracks.length > 1 && <li>The metronome beat is Carmen’s part, not yours.</li>}
                </ul>
              </details>
            </div>
          )}
          {decision.replyRejected && <p className="note-text">Carmen’s answer didn’t pass its music check, so it won’t play this time.</p>}
        </>
      )}

      {onReflect && reflected === undefined && revealed && (
        <fieldset className="reflect">
          <legend>How did that feel?</legend>
          <div className="chips">
            {coachText.reflections.map((x) => (
              <button
                type="button"
                key={x.id}
                className="chip"
                onClick={() => {
                  setReflected(x.id);
                  onReflect(x.id);
                }}
              >
                {x.text}
              </button>
            ))}
            <button
              type="button"
              className="chip chip-quiet"
              onClick={() => {
                setReflected(null);
                onReflect(null);
              }}
            >
              Skip
            </button>
          </div>
        </fieldset>
      )}
      {reflected && reflected === 'controls' && <p className="note-text">You can make the keys bigger or simpler in Settings (the gear at the top).</p>}
    </section>
  );
}
