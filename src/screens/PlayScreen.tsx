import { useState } from 'react';
import { usePrefs } from '../state/prefs.tsx';
import { Motif } from '../ui/common.tsx';
import { CreatePanel } from './CreatePanel.tsx';

export function PlayScreen({ go }: { go: (r: string) => void }) {
  const { prefs, set } = usePrefs();
  const [instrument, setInstrument] = useState(prefs.instrument);
  return (
    <div className="screen play">
      <header className="play-head">
        <div className="hello">
          <Motif size={44} />
          <div>
            <h1 className="h1">Make some music</h1>
            <p className="lede">Tap the keys or pads. Nothing is marked here — just play.</p>
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
      <CreatePanel key={instrument} instrument={instrument} />
      <aside className="panel invite">
        <h2 className="h3">Want to learn something?</h2>
        <p>Choose a pathway: there are activities for Foundation through Year 6, and for older learners.</p>
        <button type="button" className="btn" onClick={() => go('#/learn')}>
          Go to Learn
        </button>
      </aside>
    </div>
  );
}
