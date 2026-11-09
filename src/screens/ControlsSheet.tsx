import { useEffect, useRef } from 'react';
import { usePrefs } from '../state/prefs.tsx';
import { SoundCheck } from '../ui/SoundCheck.tsx';
import { Icon } from '../ui/icons.tsx';

export function ControlsSheet({ onClose }: { onClose: () => void }) {
  const { prefs, set } = usePrefs();
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    ref.current?.querySelector<HTMLElement>('input, button')?.focus();
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', esc);
    return () => window.removeEventListener('keydown', esc);
  }, [onClose]);

  const toggle = (checked: boolean, onChange: (v: boolean) => void, label: string, help?: string) => (
    <label className="toggle">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span className="toggle-ui" aria-hidden="true" />
      <span>
        <span className="toggle-label">{label}</span>
        {help && <span className="toggle-help">{help}</span>}
      </span>
    </label>
  );

  return (
    <div id="controls-sheet" className="sheet" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div ref={ref} className="sheet-inner" role="dialog" aria-modal="true" aria-labelledby="settings-h">
        <div className="sheet-head">
          <h2 id="settings-h" className="title">
            Settings
          </h2>
          <button type="button" className="btn btn-primary" onClick={onClose}>
            Done
          </button>
        </div>
        <section className="sheet-group" aria-labelledby="sound-h">
          <h3 id="sound-h" className="group-h">
            Sound
          </h3>
          <label className="field-inline">
            Volume
            <input type="range" min={0} max={1} step={0.05} value={prefs.volume} onChange={(e) => set('volume', Number(e.target.value))} aria-valuetext={`${Math.round(prefs.volume * 100)} percent`} />
          </label>
          <SoundCheck compact />
        </section>
        <section className="sheet-group" aria-labelledby="look-h">
          <h3 id="look-h" className="group-h">
            Look
          </h3>
          <div className="segmented" role="radiogroup" aria-labelledby="look-h">
            {(
              [
                ['light', 'Day'],
                ['dark', 'Night'],
                ['system', 'Same as device'],
              ] as const
            ).map(([v, l]) => (
              <button key={v} type="button" role="radio" aria-checked={prefs.theme === v} className="segment" onClick={() => set('theme', v)}>
                {l}
              </button>
            ))}
          </div>
          {toggle(prefs.contrast === 'high', (v) => set('contrast', v ? 'high' : 'normal'), 'Strong contrast')}
          {toggle(prefs.motion === 'reduced', (v) => set('motion', v ? 'reduced' : 'system'), 'Less movement')}
        </section>
        <section className="sheet-group" aria-labelledby="play-h">
          <h3 id="play-h" className="group-h">
            Playing
          </h3>
          {toggle(prefs.large, (v) => set('large', v), 'Bigger keys')}
          {toggle(prefs.simplified, (v) => set('simplified', v), 'Fewer keys', 'One octave, four drums.')}
          {toggle(prefs.noteNames, (v) => set('noteNames', v), 'Note letters on keys')}
          {toggle(prefs.aiEnabled, (v) => set('aiEnabled', v), 'Timing helper', 'Carmen listens to your timing, on this device. Off: simple tips.')}
        </section>
        <a className="sheet-link" href="#/grownups">
          <Icon name="grownups" size={22} /> For teachers and parents
        </a>
      </div>
    </div>
  );
}
