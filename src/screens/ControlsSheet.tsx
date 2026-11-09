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

  const toggle = (k: 'large' | 'simplified' | 'noteNames' | 'aiEnabled', label: string, help: string) => (
    <label className="toggle">
      <input type="checkbox" checked={prefs[k]} onChange={(e) => set(k, e.target.checked)} />
      <span className="toggle-ui" aria-hidden="true" />
      <span>
        <span className="toggle-label">{label}</span>
        <span className="toggle-help">{help}</span>
      </span>
    </label>
  );

  return (
    <div id="controls-sheet" ref={ref} className="sheet" role="dialog" aria-label="Settings">
      <div className="sheet-inner">
        <div className="sheet-head">
          <h2 className="h2">Settings</h2>
          <button type="button" className="btn" onClick={onClose}>
            Done
          </button>
        </div>
        <section className="sheet-group" aria-label="Sound">
          <h3 className="h3">Sound</h3>
          <label className="field-inline">
            Volume
            <input type="range" min={0} max={1} step={0.05} value={prefs.volume} onChange={(e) => set('volume', Number(e.target.value))} aria-valuetext={`${Math.round(prefs.volume * 100)} percent`} />
          </label>
          <SoundCheck compact />
        </section>
        <section className="sheet-group" aria-label="Seeing and using Carmen">
          <h3 className="h3">Seeing and using</h3>
          <div className="toggles">
            {toggle('large', 'Bigger keys', 'Easier to tap.')}
            {toggle('simplified', 'Fewer keys', 'One octave, four drums.')}
            {toggle('noteNames', 'Note letters', 'C, D, E… on the keys.')}
            <label className="toggle">
              <input type="checkbox" checked={prefs.motion === 'reduced'} onChange={(e) => set('motion', e.target.checked ? 'reduced' : 'system')} />
              <span className="toggle-ui" aria-hidden="true" />
              <span>
                <span className="toggle-label">Less movement</span>
                <span className="toggle-help">Keys don’t bounce.</span>
              </span>
            </label>
            <label className="toggle">
              <input type="checkbox" checked={prefs.contrast === 'high'} onChange={(e) => set('contrast', e.target.checked ? 'high' : 'normal')} />
              <span className="toggle-ui" aria-hidden="true" />
              <span>
                <span className="toggle-label">Strong contrast</span>
                <span className="toggle-help">Darker text and edges.</span>
              </span>
            </label>
            {toggle('aiEnabled', 'Timing helper', 'Carmen’s model listens to your timing, on this device. Off: simple tips instead.')}
          </div>
        </section>
        <a className="sheet-link" href="#/grownups">
          <Icon name="grownups" size={22} /> For teachers and parents
        </a>
      </div>
    </div>
  );
}
