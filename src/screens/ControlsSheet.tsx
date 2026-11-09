import { useEffect, useRef } from 'react';
import { usePrefs } from '../state/prefs.tsx';
import { SoundCheck } from '../ui/SoundCheck.tsx';

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
    <div id="controls-sheet" ref={ref} className="sheet" role="region" aria-label="Controls">
      <div className="sheet-inner">
        <h2 className="h3">Controls</h2>
        <p className="note-text">Change these any time. They never count against you.</p>
        <div className="toggles">
          {toggle('large', 'Bigger keys and buttons', 'Easier to tap.')}
          {toggle('simplified', 'Simpler layout', 'One octave of keys, four drum pads.')}
          {toggle('noteNames', 'Show note names', 'Letters on the keys.')}
          <label className="toggle">
            <input type="checkbox" checked={prefs.motion === 'reduced'} onChange={(e) => set('motion', e.target.checked ? 'reduced' : 'system')} />
            <span className="toggle-ui" aria-hidden="true" />
            <span>
              <span className="toggle-label">Calm motion</span>
              <span className="toggle-help">No moving effects.</span>
            </span>
          </label>
          <label className="toggle">
            <input type="checkbox" checked={prefs.contrast === 'high'} onChange={(e) => set('contrast', e.target.checked ? 'high' : 'normal')} />
            <span className="toggle-ui" aria-hidden="true" />
            <span>
              <span className="toggle-label">Strong contrast</span>
              <span className="toggle-help">Darker lines and text.</span>
            </span>
          </label>
          {toggle('aiEnabled', 'AI coach', 'A small model on this device looks at your timing. Off means fixed coaching tips only.')}
        </div>
        <SoundCheck compact />
        <label className="field-inline">
          Volume
          <input type="range" min={0} max={1} step={0.05} value={prefs.volume} onChange={(e) => set('volume', Number(e.target.value))} aria-valuetext={`${Math.round(prefs.volume * 100)} percent`} />
        </label>
        <button type="button" className="btn" onClick={onClose}>
          Done
        </button>
      </div>
    </div>
  );
}
