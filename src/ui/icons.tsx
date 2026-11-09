// Carmen's icon and illustration family ("Songbook Horizon").
// Geometry rules shared by every icon, the brand mark and the scenery:
//   - 24-unit grid, 2-unit round strokes, 2.5-unit corner radius
//   - one filled shape per icon at most, and when it is musical it is the Carmen
//     note head: an ellipse 3.2 × 2.4, tilted -20°
//   - curves come from the horizon: gentle, wide arcs rather than sharp zig-zags
// Icons are decorative (aria-hidden); a visible label or aria-label carries meaning.

type IconName =
  | 'play'
  | 'learn'
  | 'music'
  | 'saved'
  | 'empty'
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
  | 'path-F'
  | 'path-1-2'
  | 'path-3-4'
  | 'path-5-6'
  | 'path-older'
  | 'check'
  | 'notes'
  | 'ear'
  | 'people'
  | 'close'
  | 'lock'
  | 'hint'
  | 'star';

const S = { fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };

/** The note head: Carmen's one repeated shape. */
const Head = ({ x, y, fill = 'currentColor', scale = 1 }: { x: number; y: number; fill?: string; scale?: number }) => (
  <ellipse cx={x} cy={y} rx={3.2 * scale} ry={2.4 * scale} transform={`rotate(-20 ${x} ${y})`} fill={fill} />
);

function paths(name: IconName) {
  switch (name) {
    case 'play': // a note: head, stem, flag
      return (
        <>
          <Head x={8.5} y={17.5} scale={1.15} />
          <path d="M12 17V4.5c2.5 1.2 5 2.6 5.5 6" {...S} />
        </>
      );
    case 'learn': // an open songbook with a note on the right page
      return (
        <>
          <path d="M12 6.5C9.5 5 6.5 4.6 3 5v13.5c3.5-.4 6.5 0 9 1.5 2.5-1.5 5.5-1.9 9-1.5V5c-3.5-.4-6.5 0-9 1.5zM12 6.5V20" {...S} />
          <Head x={16} y={13} scale={0.8} />
        </>
      );
    case 'music': // my folder of pieces
    case 'saved':
      return (
        <>
          <path d="M3 8.5V18a2.5 2.5 0 0 0 2.5 2.5h13A2.5 2.5 0 0 0 21 18v-7.5A2.5 2.5 0 0 0 18.5 8H12l-2-2.5H5.5A2.5 2.5 0 0 0 3 8z" {...S} />
          <Head x={11} y={16} scale={0.85} />
          <path d="M13.7 15.3V10.6" {...S} />
        </>
      );
    case 'empty':
      return (
        <>
          <path d="M3 8.5V18a2.5 2.5 0 0 0 2.5 2.5h13A2.5 2.5 0 0 0 21 18v-7.5A2.5 2.5 0 0 0 18.5 8H12l-2-2.5H5.5A2.5 2.5 0 0 0 3 8z" {...S} strokeDasharray="2.5 3" />
          <path d="M12 11.5v5M9.5 14h5" {...S} />
        </>
      );
    case 'grownups': // clipboard with a tick
      return (
        <>
          <rect x="5" y="4.5" width="14" height="16.5" rx="2.5" {...S} />
          <path d="M9.5 3.5h5" {...S} strokeWidth={3} />
          <path d="M8.8 13l2.3 2.3 4.2-4.6" {...S} />
        </>
      );
    case 'gear':
      return (
        <>
          <circle cx="12" cy="12" r="3" {...S} />
          <path d="M12 3v2.2M12 18.8V21M3 12h2.2M18.8 12H21M5.6 5.6l1.6 1.6M16.8 16.8l1.6 1.6M5.6 18.4l1.6-1.6M16.8 7.2l1.6-1.6" {...S} />
        </>
      );
    case 'stop':
      return <rect x="6.5" y="6.5" width="11" height="11" rx="2.5" fill="currentColor" />;
    case 'playback':
      return <path d="M8 5.6v12.8c0 .8.9 1.3 1.6.9l10-6.4c.6-.4.6-1.4 0-1.8l-10-6.4C8.9 4.3 8 4.8 8 5.6z" fill="currentColor" />;
    case 'undo':
      return <path d="M8.5 5.5L4 10l4.5 4.5M4.5 10H14a5.5 5.5 0 0 1 0 11h-3" {...S} />;
    case 'click': // metronome
      return (
        <>
          <path d="M8.2 20.5h7.6a1.5 1.5 0 0 0 1.5-1.8L14.6 5.2a1.5 1.5 0 0 0-1.5-1.2h-2.2a1.5 1.5 0 0 0-1.5 1.2L6.7 18.7a1.5 1.5 0 0 0 1.5 1.8z" {...S} />
          <path d="M12 16.5l5-8.5" {...S} />
        </>
      );
    case 'piano':
      return (
        <>
          <rect x="3" y="5" width="18" height="14" rx="2.5" {...S} />
          <path d="M9 5v7.5M15 5v7.5M12 12.5V19" {...S} />
        </>
      );
    case 'drum':
      return (
        <>
          <ellipse cx="12" cy="9" rx="8" ry="3" {...S} />
          <path d="M4 9v7c0 1.7 3.6 3 8 3s8-1.3 8-3V9M8 12l-1 6.5M16 12l1 6.5" {...S} />
        </>
      );
    case 'check':
      return <path d="M5 12.5l4.5 4.5L19 7.5" {...S} strokeWidth={2.6} />;
    case 'notes': // a stave with two notes: the music-words library
      return (
        <>
          <path d="M3 7h18M3 11h18M3 15h18" {...S} strokeWidth={1.4} opacity={0.55} />
          <Head x={8} y={15} />
          <path d="M11 14.4V5" {...S} />
          <Head x={15.5} y={11} />
          <path d="M18.5 10.4V3.5" {...S} />
        </>
      );
    case 'ear': // listen back
      return <path d="M7 9.5a5 5 0 0 1 10 0c0 3-3 3.6-3 6.5a3 3 0 0 1-5.6 1.4M10 9.5a2 2 0 0 1 4 0" {...S} />;
    case 'people':
      return (
        <>
          <circle cx="9" cy="8.5" r="3" {...S} />
          <path d="M3.5 19c.5-3.2 2.7-5 5.5-5s5 1.8 5.5 5" {...S} />
          <circle cx="16.5" cy="9.5" r="2.4" {...S} />
          <path d="M16.5 14c2.2 0 3.8 1.5 4.2 4" {...S} />
        </>
      );
    case 'close':
      return <path d="M6.5 6.5l11 11M17.5 6.5l-11 11" {...S} strokeWidth={2.4} />;
    case 'lock':
      return (
        <>
          <rect x="5" y="11" width="14" height="9" rx="2.5" {...S} />
          <path d="M8.5 11V8a3.5 3.5 0 0 1 7 0v3" {...S} />
        </>
      );
    case 'hint': // a small light: an idea
      return (
        <>
          <path d="M9 17h6M10 20h4M12 3.5a5.5 5.5 0 0 0-3.2 10c.7.5 1.2 1.3 1.2 2.2v.3h4v-.3c0-.9.5-1.7 1.2-2.2A5.5 5.5 0 0 0 12 3.5z" {...S} />
        </>
      );
    case 'star':
      return <Head x={12} y={12} scale={2.4} />;
    case 'back':
      return <path d="M14.5 5.5L8 12l6.5 6.5" {...S} strokeWidth={2.4} />;
    case 'forward':
      return <path d="M9.5 5.5L16 12l-6.5 6.5" {...S} strokeWidth={2.4} />;
    case 'sound':
      return (
        <>
          <path d="M4 9.5h3l4.5-4v13l-4.5-4H4a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1z" {...S} />
          <path d="M15.5 9c1.4 1.7 1.4 4.3 0 6M18.5 6.5c2.8 3.1 2.8 7.9 0 11" {...S} />
        </>
      );
    case 'path-F': // a quiet hill then a loud hill
      return (
        <>
          <path d="M2.5 16c2-2.2 4-2.2 6 0" {...S} />
          <path d="M9.5 16c2.8-8 7.2-8 10 0" {...S} strokeWidth={2.6} />
          <Head x={14.5} y={8} scale={0.75} />
        </>
      );
    case 'path-1-2': // two notes answering
      return (
        <>
          <Head x={7} y={15} />
          <path d="M9.8 14.3V6" {...S} />
          <ellipse cx="16.5" cy="11" rx="3.2" ry="2.4" transform="rotate(-20 16.5 11)" {...S} />
          <path d="M19.3 10.3V3.5" {...S} />
        </>
      );
    case 'path-3-4': // a melody climbing the hill
      return (
        <>
          <path d="M3 19c4-1 6-5 9-8s5-5 9-6" {...S} />
          <Head x={7.5} y={15} scale={0.8} />
          <Head x={13} y={10} scale={0.8} />
          <Head x={18.5} y={6.2} scale={0.8} />
        </>
      );
    case 'path-5-6': // A then B
      return (
        <>
          <rect x="2.5" y="6" width="8.5" height="12" rx="2.5" {...S} />
          <rect x="13" y="6" width="8.5" height="12" rx="2.5" {...S} />
          <Head x={6.8} y={12} scale={0.8} />
        </>
      );
    case 'path-older': // layered parts on a stave
      return (
        <>
          <path d="M3 7h18M3 12h18M3 17h18" {...S} strokeWidth={1.6} />
          <Head x={8} y={7} scale={0.8} />
          <Head x={13} y={12} scale={0.8} />
          <Head x={18} y={17} scale={0.8} />
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

/** The brand mark: a note-head sun resting on a stave that curves like hills.
 *  Built on the icon grid so it holds together from 20 px (navigation) to app-icon size. */
export function Logo({ size = 32, tile = false }: { size?: number; tile?: boolean }) {
  return (
    <svg className={`logo-mark${tile ? ' is-tile' : ''}`} width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      {tile && <rect width="24" height="24" rx="6" fill="var(--sky-top)" />}
      <ellipse cx="13.5" cy="9.2" rx="5" ry="3.7" transform="rotate(-20 13.5 9.2)" fill="var(--sun-disc)" />
      <g fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round">
        <path d="M3 15.2c3-2.2 6-2.6 9-1.2s6 1 9-1" />
        <path d="M3 19.2c3-2.2 6-2.6 9-1.2s6 1 9-1" />
      </g>
    </svg>
  );
}

/** "carmen" in the brand face with the mark. The only place lettering is drawn large outside titles. */
export function Wordmark({ size = 30 }: { size?: number }) {
  return (
    <span className="wordmark" style={{ fontSize: size }}>
      <Logo size={Math.round(size * 1.15)} />
      <span className="wordmark-text">carmen</span>
    </span>
  );
}

type Scene = 'play' | 'learn' | 'music' | 'quiet';

/** The Carmen horizon: three hills whose crests are drawn as stave lines, a note-head
 *  sun, and (outside quiet screens) a couple of quaver birds. Colours come from tokens,
 *  so the same drawing becomes the night scene in dark mode. */
export function Horizon({ scene = 'play', className }: { scene?: Scene; className?: string }) {
  const sunX = scene === 'learn' ? 186 : scene === 'music' ? 168 : scene === 'quiet' ? 236 : 214;
  const sunY = scene === 'quiet' ? 96 : scene === 'learn' ? 74 : 62;
  const crest = 'M0 112 C60 92 120 86 190 96 S320 120 400 98';
  return (
    <svg className={`horizon${className ? ` ${className}` : ''}`} viewBox="0 0 400 160" preserveAspectRatio="xMidYMax slice" aria-hidden="true" focusable="false">
      <circle cx={sunX} cy={sunY} r="46" fill="var(--sun-disc)" opacity="0.18" />
      <ellipse cx={sunX} cy={sunY} rx="26" ry="19" transform={`rotate(-20 ${sunX} ${sunY})`} fill="var(--sun-disc)" />
      {scene !== 'quiet' && (
        <g fill="none" stroke="var(--on-sky-soft)" strokeWidth="2" strokeLinecap="round">
          <path d="M150 40q7-6 14 0q7-6 14 0" />
          <path d="M262 26q5-4 10 0q5-4 10 0" />
        </g>
      )}
      <path d="M0 100 C70 70 140 74 200 88 S330 70 400 84 V160 H0z" fill="var(--hill-far)" />
      <path d={`${crest} V160 H0z`} fill="var(--hill-mid)" />
      <g fill="none" stroke="var(--stave-line)" strokeWidth="1.4">
        {[0, 7, 14, 21, 28].map((d) => (
          <path key={d} d={crest} transform={`translate(0 ${d + 6})`} />
        ))}
      </g>
      <path d="M0 140 C90 124 170 126 250 136 S360 142 400 132 V160 H0z" fill="var(--hill-near)" />
    </svg>
  );
}

/** Three children making music, drawn with the same strokes and note-head shapes. Decorative. */
export function Band({ width = 220 }: { width?: number }) {
  const kid = (x: number, shirt: string, skin: string, hair: React.ReactNode, prop: React.ReactNode) => (
    <g transform={`translate(${x} 0)`}>
      <path d="M8 86c0-16 9-26 22-26s22 10 22 26z" fill={shirt} />
      <circle cx="30" cy="38" r="17" fill={skin} />
      {hair}
      <ellipse cx="24" cy="40" rx="2.2" ry="1.7" transform="rotate(-20 24 40)" fill="#2a1736" />
      <ellipse cx="36" cy="40" rx="2.2" ry="1.7" transform="rotate(-20 36 40)" fill="#2a1736" />
      <path d="M25 47q5 4 10 0" fill="none" stroke="#2a1736" strokeWidth="2" strokeLinecap="round" />
      {prop}
    </g>
  );
  return (
    <svg className="band" width={width} height={(width * 90) / 220} viewBox="0 0 220 90" aria-hidden="true" focusable="false">
      {kid(
        8,
        'var(--sky-mid)',
        '#8d5524',
        <path d="M13 36c0-13 8-20 17-20s17 7 17 20c-4-6-10-9-17-9s-13 3-17 9z" fill="#2a1736" />,
        <g fill="none" stroke="var(--ink)" strokeWidth="2" strokeLinecap="round"><path d="M10 74h40" /><path d="M14 74v10M46 74v10" /></g>,
      )}
      {kid(
        80,
        'var(--sun)',
        '#f1c27d',
        <path d="M12 44c-3-18 6-27 18-27s21 9 18 27c-2-9-6-14-9-15-6 4-15 6-27 15z" fill="#b5481c" />,
        <g><ellipse cx="54" cy="22" rx="3.2" ry="2.4" transform="rotate(-20 54 22)" fill="var(--ink)" /><path d="M57 21V8" stroke="var(--ink)" strokeWidth="2" strokeLinecap="round" /></g>,
      )}
      {kid(
        152,
        'var(--dusk)',
        '#c68642',
        <>
          <circle cx="30" cy="20" r="8" fill="#2a1736" />
          <path d="M14 36c2-11 8-15 16-15s14 4 16 15c-6-4-26-4-32 0z" fill="#2a1736" />
        </>,
        <g fill="none" stroke="var(--ink)" strokeWidth="2" strokeLinecap="round"><ellipse cx="30" cy="78" rx="14" ry="4" /></g>,
      )}
    </svg>
  );
}

export type { IconName };
