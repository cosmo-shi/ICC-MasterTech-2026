// Carmen's own icon set (direction A, "Colour Bars"): chunky filled shapes and thick
// rounded strokes drawn from the instruments — bars, keycaps, drum shells, note heads.
// Icons are decorative (aria-hidden); a text label or aria-label always carries meaning.

type IconName =
  | 'play'
  | 'learn'
  | 'music'
  | 'grownups'
  | 'gear'
  | 'stop'
  | 'playback'
  | 'undo'
  | 'click'
  | 'piano'
  | 'drum'
  | 'back'
  | 'forward'
  | 'sound'
  | 'saved'
  | 'empty'
  | 'path-F'
  | 'path-1-2'
  | 'path-3-4'
  | 'path-5-6'
  | 'path-older';

const S = { fill: 'none', stroke: 'currentColor', strokeWidth: 2.6, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };

function paths(name: IconName) {
  switch (name) {
    case 'play': // three bars, getting quieter
      return (
        <>
          <rect x="3" y="4" width="5" height="16" rx="2" fill="currentColor" />
          <rect x="10" y="4" width="5" height="16" rx="2" fill="currentColor" opacity=".7" />
          <rect x="17" y="4" width="4" height="16" rx="2" fill="currentColor" opacity=".45" />
        </>
      );
    case 'learn': // a melody line through three notes
      return (
        <>
          <path d="M4 18c3 0 4-8 8-8s5 6 8 6" {...S} />
          <circle cx="4" cy="18" r="2.6" fill="currentColor" />
          <circle cx="12" cy="10" r="2.6" fill="currentColor" />
          <circle cx="20" cy="16" r="2.6" fill="currentColor" />
        </>
      );
    case 'music': // a tape with two reels
    case 'saved':
      return (
        <>
          <rect x="3" y="5" width="18" height="14" rx="4" {...S} />
          <circle cx="9" cy="12" r="2.3" fill="currentColor" />
          <circle cx="15" cy="12" r="2.3" fill="currentColor" />
        </>
      );
    case 'empty':
      return (
        <>
          <rect x="3" y="5" width="18" height="14" rx="4" {...S} strokeDasharray="3 3" />
          <path d="M12 9v6M9 12h6" {...S} />
        </>
      );
    case 'grownups': // clipboard with a tick
      return (
        <>
          <rect x="5" y="4.5" width="14" height="17" rx="3" {...S} />
          <path d="M9 3h6" {...S} strokeWidth={3.4} />
          <path d="M8.5 13l2.5 2.5 4.5-5" {...S} />
        </>
      );
    case 'gear':
      return (
        <>
          <circle cx="12" cy="12" r="3.4" {...S} />
          <path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M5.3 18.7l2.1-2.1M16.6 7.4l2.1-2.1" {...S} />
        </>
      );
    case 'stop':
      return <rect x="6" y="6" width="12" height="12" rx="2.5" fill="currentColor" />;
    case 'playback':
      return <path d="M7.5 4.8v14.4a.8.8 0 0 0 1.2.7l11.4-7.2a.8.8 0 0 0 0-1.4L8.7 4.1a.8.8 0 0 0-1.2.7z" fill="currentColor" />;
    case 'undo':
      return <path d="M8 6L3.5 10.5 8 15M4 10.5h10a5.5 5.5 0 0 1 0 11h-3" {...S} />;
    case 'click': // metronome
      return (
        <>
          <path d="M7 21l3-17h4l3 17z" {...S} />
          <path d="M12 15l5-8" {...S} />
        </>
      );
    case 'piano':
      return (
        <>
          <rect x="2" y="5" width="20" height="14" rx="3" {...S} />
          <path d="M8 5v8M14 5v8" stroke="currentColor" strokeWidth={3.2} />
        </>
      );
    case 'drum':
      return (
        <>
          <ellipse cx="12" cy="8" rx="9" ry="3.5" {...S} />
          <path d="M3 8v8c0 2 4 3.5 9 3.5s9-1.5 9-3.5V8" {...S} />
        </>
      );
    case 'back':
      return <path d="M15 5l-7 7 7 7" {...S} strokeWidth={3} />;
    case 'forward':
      return <path d="M9 5l7 7-7 7" {...S} strokeWidth={3} />;
    case 'sound':
      return (
        <>
          <path d="M4 9.5h3.5L12 6v12l-4.5-3.5H4z" fill="currentColor" />
          <path d="M15.5 9c1.5 1.6 1.5 4.4 0 6M18.5 6.5c3 3 3 8 0 11" {...S} />
        </>
      );
    case 'path-F': // soft wave then loud wave
      return (
        <>
          <path d="M2 12c1.5-1.5 3-1.5 4.5 0s3 1.5 4.5 0" {...S} />
          <path d="M12.5 12c1.2-6 3.3-6 4.5 0s3.3 6 4.5 0" {...S} strokeWidth={3.4} />
        </>
      );
    case 'path-1-2': // two drums answering
      return (
        <>
          <circle cx="8" cy="9" r="5" fill="currentColor" />
          <circle cx="16.5" cy="15.5" r="5" {...S} />
        </>
      );
    case 'path-3-4': // contour up, answer down
      return (
        <>
          <path d="M3 18l5-7 4 4 5-9" {...S} />
          <circle cx="8" cy="11" r="2" fill="currentColor" />
          <circle cx="17" cy="6" r="2" fill="currentColor" />
        </>
      );
    case 'path-5-6': // A and B blocks
      return (
        <>
          <rect x="2" y="6" width="9" height="12" rx="3" fill="currentColor" />
          <rect x="13" y="6" width="9" height="12" rx="3" {...S} />
        </>
      );
    case 'path-older': // layered parts
      return (
        <>
          <rect x="3" y="4" width="18" height="4.5" rx="2.2" fill="currentColor" />
          <rect x="3" y="10" width="13" height="4.5" rx="2.2" fill="currentColor" opacity=".7" />
          <rect x="3" y="16" width="8" height="4.5" rx="2.2" fill="currentColor" opacity=".45" />
        </>
      );
  }
}

export function Icon({ name, size = 24, className }: { name: IconName; size?: number; className?: string }) {
  return (
    <svg className={`icon${className ? ` ${className}` : ''}`} width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      {paths(name)}
    </svg>
  );
}

/** Carmen's mark: four note-coloured bars (C, E, F, G), like a short rising phrase. */
export function Logo({ size = 36 }: { size?: number }) {
  return (
    <svg className="logo-mark" width={size} height={size} viewBox="0 0 40 40" aria-hidden="true" focusable="false">
      <rect x="2" y="14" width="7" height="22" rx="3.5" fill="var(--n-c)" />
      <rect x="11" y="9" width="7" height="27" rx="3.5" fill="var(--n-e)" />
      <rect x="20" y="4" width="7" height="32" rx="3.5" fill="var(--n-f)" />
      <rect x="29" y="11" width="7" height="25" rx="3.5" fill="var(--n-g)" />
    </svg>
  );
}

/** Three original child musicians (different skin tones and hair). Decorative. */
export function Band({ width = 200 }: { width?: number }) {
  const kid = (x: number, shirt: string, skin: string, hair: React.ReactNode) => (
    <g transform={`translate(${x} 0)`}>
      <rect x="10" y="40" width="40" height="30" rx="16" fill={shirt} />
      <circle cx="30" cy="26" r="16" fill={skin} />
      {hair}
      <circle cx="24" cy="28" r="2" fill="var(--night)" />
      <circle cx="36" cy="28" r="2" fill="var(--night)" />
      <path d="M25 34q5 4 10 0" fill="none" stroke="var(--night)" strokeWidth="2" strokeLinecap="round" />
    </g>
  );
  return (
    <svg className="band" width={width} height={(width * 70) / 200} viewBox="0 0 200 70" aria-hidden="true" focusable="false">
      {kid(10, 'var(--n-d)', '#8D5524', <path d="M14 24c0-12 8-18 16-18s16 6 16 18c-4-6-10-8-16-8s-12 2-16 8z" fill="var(--night)" />)}
      {kid(70, 'var(--n-g)', '#F1C27D', <path d="M13 30c-2-16 6-24 17-24s19 8 17 24c-2-8-6-12-8-13-6 4-14 5-26 13z" fill="#C24E1C" />)}
      {kid(130, 'var(--n-b)', '#C68642', <><circle cx="30" cy="10" r="8" fill="var(--night)" /><path d="M14 24c2-10 8-14 16-14s14 4 16 14c-6-4-26-4-32 0z" fill="var(--night)" /></>)}
    </svg>
  );
}

export type { IconName };
