// Carmen's identity art: the brand mark, the wordmark, the header horizon and the welcome picture.
// These are brand illustration, not interface icons (interface icons come from Lucide, see icons.tsx).
// Geometry: 24-unit grid, round strokes, the tilted note head as the one filled motif.
// All of it is decorative (aria-hidden); a visible label or aria-label carries meaning.

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

/** Welcome art: the two instruments Carmen plays (keys and a drum head) under a phrase of
 *  note heads on a curved stave. Same geometry as the icons: round strokes, tilted heads. Decorative. */
export function WelcomeArt({ width = 260 }: { width?: number }) {
  const keys = [0, 1, 2, 3, 4, 5, 6];
  return (
    <svg className="welcome-art" width={width} height={(width * 132) / 260} viewBox="0 0 260 132" aria-hidden="true" focusable="false">
      <g fill="none" stroke="var(--welcome-line, var(--ink-soft))" strokeWidth="1.6" strokeLinecap="round" opacity="0.6">
        {[0, 7, 14, 21, 28].map((d) => (
          <path key={d} d={`M6 ${34 + d} C70 ${18 + d} 150 ${22 + d} 254 ${8 + d}`} />
        ))}
      </g>
      {[
        [44, 44, 'var(--sun)'],
        [82, 33, 'var(--sw-peri)'],
        [120, 33, 'var(--sw-orchid)'],
        [158, 22, 'var(--sw-sky)'],
        [204, 18, 'var(--sun)'],
      ].map(([x, y, c], i) => (
        <g key={i}>
          <ellipse cx={x as number} cy={y as number} rx="9" ry="6.8" transform={`rotate(-20 ${x} ${y})`} fill={c as string} />
          <path d={`M${(x as number) + 8} ${(y as number) - 2}V${(y as number) - 30}`} stroke="var(--ink)" strokeWidth="2.4" strokeLinecap="round" />
        </g>
      ))}
      <g transform="translate(14 76)">
        <rect x="0" y="0" width="150" height="50" rx="10" fill="var(--key-black, #23264a)" />
        {keys.map((k) => (
          <rect key={k} x={6 + k * 20} y="6" width="18" height="38" rx="3" fill="var(--key-white, #fffdfb)" />
        ))}
        {[0, 1, 3, 4, 5].map((k) => (
          <rect key={k} x={19 + k * 20} y="6" width="10" height="22" rx="2" fill="var(--key-black, #23264a)" />
        ))}
        <rect x="26" y="6" width="18" height="38" rx="3" fill="var(--sun)" opacity="0.85" />
      </g>
      <g transform="translate(206 100)">
        <ellipse cx="0" cy="0" rx="36" ry="13" fill="var(--pad, #f7c797)" />
        <ellipse cx="0" cy="0" rx="36" ry="13" fill="none" stroke="var(--drum-rim, #7897d7)" strokeWidth="4" />
        <path d="M-36 0v14c0 7 16 12 36 12s36-5 36-12V0" fill="none" stroke="var(--drum-rim, #7897d7)" strokeWidth="4" strokeLinejoin="round" />
        <path d="M-28 -34l20 26M30 -40l-18 30" stroke="var(--ink)" strokeWidth="3" strokeLinecap="round" />
      </g>
    </svg>
  );
}

