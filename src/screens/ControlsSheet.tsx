import { useRef, useState } from 'react';
import { store } from '../store/db.ts';
import { usePrefs } from '../state/prefs.tsx';
import { SoundCheck } from '../ui/SoundCheck.tsx';
import { Icon } from '../ui/icons.tsx';
import { players, usePlayers } from '../store/profiles.ts';
import { Avatar } from './EntryScreen.tsx';
import { Dialog } from '../ui/Dialog.tsx';
import { MyClassSection } from './MyClass.tsx';

export function ControlsSheet({ onClose, onSwitchPlayer }: { onClose: () => void; onSwitchPlayer: () => void }) {
  const { prefs, set } = usePrefs();
  const { players: list, current } = usePlayers();
  const me = list.find((p) => p.id === current);
  const ref = useRef<HTMLDivElement>(null);
  const [forget, setForget] = useState<'idle' | 'confirm' | 'done'>('idle');
  // Remove this player's name and everything saved under it from this device.
  const forgetMe = async () => {
    if (!me) return;
    for (const kind of ['compositions', 'attempts', 'recordings'] as const) {
      const rows = await store.all<{ id: string; profileId?: string }>(kind);
      for (const r of rows) if (r.profileId === me.id) await store.delete(kind, r.id);
    }
    players.remove(me.id);
    setForget('done');
  };

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

  const segmented = <T extends string | number>(label: string, id: string, value: T, options: readonly (readonly [T, string])[], onPick: (v: T) => void) => (
    <div className="setting-row">
      <span id={id} className="setting-label">
        {label}
      </span>
      <div className="segmented" role="radiogroup" aria-labelledby={id}>
        {options.map(([v, l]) => (
          <button key={String(v)} type="button" role="radio" aria-checked={value === v} className="segment" onClick={() => onPick(v)}>
            {l}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <Dialog open onClose={onClose} labelledBy="settings-h" className="settings-dlg">
      <div ref={ref} id="controls-sheet" className="dlg-body">
        <div className="sheet-head">
          <h2 id="settings-h" className="title" tabIndex={-1}>
            Settings
          </h2>
          <button type="button" className="btn btn-primary" onClick={onClose}>
            Done
          </button>
        </div>
        <section className="sheet-group" aria-labelledby="who-h">
          <h3 id="who-h" className="group-h">
            Who’s playing
          </h3>
          <div className="setting-row">
            {me ? <Avatar player={me} size={40} /> : null}
            <span className="setting-label">{me ? me.name : 'Guest: nothing is kept after you close Carmen'}</span>
            <button type="button" className="btn-quiet" onClick={onSwitchPlayer}>
              Change player
            </button>
          </div>
          {me && forget === 'idle' && (
            <button type="button" className="btn-text" onClick={() => setForget('confirm')}>
              Remove {me.name} from this device
            </button>
          )}
          {me && forget === 'confirm' && (
            <div className="row wrap" role="group" aria-label={`Remove ${me.name}?`}>
              <span className="note-text">This deletes {me.name}’s name, music, recordings and lesson tries on this device.</span>
              <button type="button" className="btn btn-coral" onClick={() => void forgetMe()}>
                Yes, remove
              </button>
              <button type="button" className="btn-quiet" onClick={() => setForget('idle')}>
                Keep
              </button>
            </div>
          )}
          {forget === 'done' && (
            <p className="note-text" role="status">
              Removed from this device.
            </p>
          )}
        </section>
        <MyClassSection />
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
        <section className="sheet-group" aria-labelledby="metro-h">
          <h3 id="metro-h" className="group-h">
            Metronome
          </h3>
          {toggle(prefs.metronomeOn, (v) => set('metronomeOn', v), 'Metronome on when I start Play', 'You can still turn it on or off next to Record.')}
          <label className="field-inline">
            Speed in Play
            <input type="range" min={60} max={140} step={5} value={prefs.metronomeTempo} onChange={(e) => set('metronomeTempo', Number(e.target.value))} aria-valuetext={`${prefs.metronomeTempo} beats a minute`} />
            <span className="setting-value">{prefs.metronomeTempo}</span>
          </label>
          {segmented('Beats before you play', 'countin-l', prefs.countIn, [[2, '2 beats'], [4, '4 beats']] as const, (v) => set('countIn', v))}
        </section>
        <section className="sheet-group" aria-labelledby="look-h">
          <h3 id="look-h" className="group-h">
            Look
          </h3>
          {segmented('Day or night', 'theme-l', prefs.theme, [['light', 'Day'], ['dark', 'Night'], ['system', 'Same as device']] as const, (v) => set('theme', v))}
          {toggle(prefs.contrast === 'high', (v) => set('contrast', v ? 'high' : 'normal'), 'Strong contrast')}
          {toggle(prefs.motion === 'reduced', (v) => set('motion', v ? 'reduced' : 'system'), 'Less movement')}
        </section>
        <section className="sheet-group" aria-labelledby="play-h">
          <h3 id="play-h" className="group-h">
            Playing
          </h3>
          {toggle(prefs.large, (v) => set('large', v), 'Bigger keys')}
          {toggle(prefs.simplified, (v) => set('simplified', v), 'Fewer keys', 'One octave, four drums.')}
          {toggle(prefs.noteNames, (v) => set('noteNames', v), 'Note letters', 'On the keys and under the notes you play.')}
          {segmented('Computer-key letters', 'hints-l', prefs.keyHints, [['auto', 'Automatic'], ['on', 'Show'], ['off', 'Hide']] as const, (v) => set('keyHints', v))}
          {segmented('Drums look like', 'drums-l', prefs.drumView, [['kit', 'Drum kit'], ['pads', 'Pads']] as const, (v) => set('drumView', v))}
          {toggle(prefs.aiEnabled, (v) => set('aiEnabled', v), 'Timing helper', 'Carmen listens to your timing, on this device. Off: simple tips.')}
        </section>
        <section className="sheet-group" aria-labelledby="save-h">
          <h3 id="save-h" className="group-h">
            Saving
          </h3>
          {toggle(prefs.saveOnDevice, (v) => set('saveOnDevice', v), 'Keep my music on this device', prefs.saveOnDevice ? 'Kept in this browser.' : 'Off: forgotten when Carmen closes.')}
          <a className="sheet-link" href="#/music">
            <Icon name="music" size={24} /> My music
          </a>
        </section>
        <a className="sheet-link" href="#/teacher">
          <Icon name="lock" size={24} /> Teacher
        </a>
      </div>
    </Dialog>
  );
}
