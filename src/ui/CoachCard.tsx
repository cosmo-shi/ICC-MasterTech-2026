import { useState } from 'react';
import type { CoachDecision } from '../ai/coach.ts';
import coachText from '../data/coach.json';
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
        <h3 id="coach-title" className="coach-label">
          {isAI ? 'AI coach' : 'Coach tips'}
        </h3>
        <span className="coach-sub">{isAI ? 'A small model on this device looked at your timing' : decision.patternSource === 'rules' ? 'Fixed coaching rules on this device' : 'Fixed coaching rules'}</span>
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
                <summary>What the partner changed — checked before it played</summary>
                <ul>
                  {r.verification.verified.map((v) => (
                    <li key={v}>✓ {v}</li>
                  ))}
                  {r.render.tracks.length > 1 && <li>The steady click is the partner's part, not yours.</li>}
                </ul>
              </details>
            </div>
          )}
          {decision.replyRejected && <p className="note-text">A reply was blocked because it failed a music check, so there is no reply this time.</p>}
        </>
      )}

      {onReflect && reflected === undefined && revealed && (
        <fieldset className="reflect">
          <legend>Want to say how it went? (You can skip.)</legend>
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
      {reflected && reflected === 'controls' && <p className="note-text">You can make the keys bigger or simpler in Controls at the top.</p>}
    </section>
  );
}
