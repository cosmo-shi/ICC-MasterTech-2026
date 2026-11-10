import { useSyncExternalStore } from 'react';
import { inputDebug } from '../input/debug.ts';

/** On-screen event log for phone testing (?debug=input). Not shown otherwise. */
export function InputLog() {
  const lines = useSyncExternalStore((cb) => inputDebug.subscribe(cb), () => inputDebug.lines);
  if (!inputDebug.enabled) return null;
  return (
    <aside className="input-log" aria-label="Input test log">
      <strong>Input test</strong>
      <ol>
        {lines.map((l, i) => (
          <li key={i}>
            {l.t} {l.what} {l.detail}
          </li>
        ))}
      </ol>
    </aside>
  );
}
