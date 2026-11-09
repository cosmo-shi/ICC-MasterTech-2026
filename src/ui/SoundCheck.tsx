import { useState } from 'react';
import { audio } from '../audio/engine.ts';
import { type MusicEvent, TPQ } from '../music/events.ts';
import { Icon } from './icons.tsx';
import { usePlayer } from './usePlayer.ts';

// Three piano notes going up, then a drum: the same samples the lessons use.
const TEST: MusicEvent[] = [
  { id: 't1', kind: 'note', onset: 0, duration: TPQ, midi: 60, velocity: 0.7 },
  { id: 't2', kind: 'note', onset: TPQ, duration: TPQ, midi: 64, velocity: 0.7 },
  { id: 't3', kind: 'note', onset: 2 * TPQ, duration: TPQ, midi: 67, velocity: 0.7 },
  { id: 't4', kind: 'drum', onset: 3 * TPQ, duration: TPQ, sound: 'snare', velocity: 0.7 },
];

/**
 * Quick sound check: play a short test and ask whether it was heard. Nothing is
 * recorded; the answer only decides whether to show tips.
 */
export function SoundCheck({ compact }: { compact?: boolean }) {
  const player = usePlayer();
  const [stage, setStage] = useState<'idle' | 'playing' | 'asked' | 'heard' | 'not-heard'>('idle');

  const run = async () => {
    setStage('playing');
    await player.play([{ events: TEST }], 100, { totalTicks: 4 * TPQ, onEnd: () => setStage('asked') });
    if (!audio.running) setStage('not-heard');
  };

  return (
    <div className={`sound-check${compact ? ' compact' : ''}`}>
      <div className="row wrap">
        <button type="button" className="btn-quiet" onClick={run} disabled={stage === 'playing'}>
          <Icon name="sound" size={22} /> {stage === 'playing' ? 'Playing the test…' : 'Play a test sound'}
        </button>
      </div>
      <div role="status" className="sound-check-result">
        {stage === 'asked' && (
          <fieldset className="choice-set">
            <legend>Did you hear three piano notes and a drum?</legend>
            <div className="chips">
              <button type="button" className="chip" onClick={() => setStage('heard')}>
                Yes
              </button>
              <button type="button" className="chip" onClick={() => setStage('not-heard')}>
                No
              </button>
            </div>
          </fieldset>
        )}
        {stage === 'heard' && <p className="note-text">Sound is working.</p>}
        {stage === 'not-heard' && (
          <div className="tips">
            <p className="tips-head">Things to try</p>
            <ul className="plain">
              <li>Turn the device volume up, and the Volume slider in Controls.</li>
              <li>On a tablet or phone, check the silent switch or mute button.</li>
              <li>If headphones are plugged in, check they are on and in the ears.</li>
              <li>Then press “Play a test sound” again.</li>
            </ul>
            {audio.status === 'error' && <p className="note-text">{audio.error ?? 'The instrument sounds could not be loaded.'}</p>}
          </div>
        )}
      </div>
    </div>
  );
}
