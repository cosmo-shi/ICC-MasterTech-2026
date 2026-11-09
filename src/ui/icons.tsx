// Carmen's own small 2D icon set: rounded strokes in ink, one accent fill, drawn from
// the instrument shapes (keycaps, drum circles, note ovals, phrase blocks). Every icon
// is decorative (aria-hidden); the text beside it carries the meaning.

type IconName = 'play' | 'learn' | 'music' | 'grownups' | 'path-F' | 'path-1-2' | 'path-3-4' | 'path-5-6' | 'path-older' | 'empty' | 'sound' | 'undo' | 'saved';

const S = { fill: 'none', stroke: 'currentColor', strokeWidth: 2.5, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };

function paths(name: IconName) {
  switch (name) {
    case 'play': // two keycaps and a black key
      return (
        <>
          <rect x="4" y="5" width="9" height="22" rx="3" {...S} />
          <rect x="13" y="5" width="9" height="22" rx="3" {...S} />
          <rect x="22" y="5" width="6" height="22" rx="3" {...S} />
          <rect x="10" y="5" width="6" height="12" rx="2" fill="currentColor" />
          <rect x="19.5" y="5" width="5.5" height="12" rx="2" fill="currentColor" />
        </>
      );
    case 'learn': // a short melody: three note ovals climbing
      return (
        <>
          <ellipse cx="8" cy="23" rx="4" ry="3" className="accent" {...S} />
          <ellipse cx="16" cy="18" rx="4" ry="3" className="accent" {...S} />
          <ellipse cx="24" cy="13" rx="4" ry="3" className="accent" {...S} />
          <path d="M12 23V8M20 18V5M28 13V3" {...S} />
        </>
      );
    case 'music': // a folder holding a note
      return (
        <>
          <path d="M4 9a3 3 0 0 1 3-3h6l3 3h9a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3z" {...S} />
          <ellipse cx="14" cy="21" rx="3" ry="2.3" fill="currentColor" />
          <path d="M17 21v-8l5 2" {...S} />
        </>
      );
    case 'grownups': // a clipboard with a tick
      return (
        <>
          <rect x="7" y="6" width="18" height="22" rx="3" {...S} />
          <rect x="12" y="3.5" width="8" height="5" rx="2" {...S} />
          <path d="M11.5 18l3 3 6-7" {...S} />
        </>
      );
    case 'path-F': // a sound story: soft wave then loud wave
      return (
        <>
          <path d="M3 16c2-2 4-2 6 0s4 2 6 0" {...S} />
          <path d="M17 16c1.5-8 4.5-8 6 0s4.5 8 6 0" {...S} strokeWidth={3.5} />
        </>
      );
    case 'path-1-2': // a rhythm conversation: two drum circles answering
      return (
        <>
          <circle cx="10" cy="12" r="6" className="accent" {...S} />
          <circle cx="22" cy="20" r="6" {...S} />
          <path d="M8 12h4M20 20h0.01M24 20h0.01" {...S} />
        </>
      );
    case 'path-3-4': // a melody contour with an answer
      return (
        <>
          <path d="M3 22l6-8 5 5 6-11" {...S} />
          <circle cx="9" cy="14" r="2.2" fill="currentColor" />
          <circle cx="20" cy="8" r="2.2" fill="currentColor" />
          <path d="M22 22l4-4 3 2" {...S} strokeDasharray="0.1 4" />
        </>
      );
    case 'path-5-6': // A and B phrase blocks
      return (
        <>
          <rect x="3" y="9" width="12" height="14" rx="3" className="accent" {...S} />
          <rect x="17" y="9" width="12" height="14" rx="3" {...S} />
          <path d="M7 19l2-6 2 6M8 17h2M21 13v6h2.5a1.5 1.5 0 0 0 0-3H21h2a1.5 1.5 0 0 0 0-3z" {...S} strokeWidth={1.8} />
        </>
      );
    case 'path-older': // layered parts
      return (
        <>
          <rect x="4" y="5" width="24" height="6" rx="3" {...S} />
          <rect x="4" y="13" width="18" height="6" rx="3" className="accent" {...S} />
          <rect x="4" y="21" width="12" height="6" rx="3" {...S} />
        </>
      );
    case 'empty': // an open folder waiting for a note
      return (
        <>
          <path d="M4 10a3 3 0 0 1 3-3h6l3 3h9a3 3 0 0 1 3 3v11a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3z" {...S} />
          <path d="M16 15v6M13 18h6" {...S} />
        </>
      );
    case 'sound': // a speaker with waves
      return (
        <>
          <path d="M5 13h5l6-5v16l-6-5H5z" {...S} />
          <path d="M20 12c2 2 2 6 0 8M24 9c4 4 4 10 0 14" {...S} />
        </>
      );
    case 'undo':
      return <path d="M10 8L5 13l5 5M5 13h13a7 7 0 0 1 0 14h-4" {...S} />;
    case 'saved': // a folder with a tick
      return (
        <>
          <path d="M4 9a3 3 0 0 1 3-3h6l3 3h9a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3z" {...S} />
          <path d="M11 18l3.5 3.5L21 15" {...S} />
        </>
      );
  }
}

export function Icon({ name, size = 24, className }: { name: IconName; size?: number; className?: string }) {
  return (
    <svg className={`icon${className ? ` ${className}` : ''}`} width={size} height={size} viewBox="0 0 32 32" aria-hidden="true" focusable="false">
      {paths(name)}
    </svg>
  );
}

export type { IconName };
