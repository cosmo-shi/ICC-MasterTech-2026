import { useEffect, useRef, useState } from 'react';
import { type Phrase, TPQ } from '../music/events.ts';
import { layoutBar } from '../music/layout.ts';
import { midiToLetter } from '../music/theory.ts';

const DUR: Record<number, string> = { 240: '8', 480: 'q', 720: 'qd', 960: 'h', 1440: 'hd', 1920: 'w' };
const DUR_WORD: Record<number, string> = { 240: 'quaver', 480: 'crotchet', 960: 'minim', 1920: 'semibreve' };

function noteKey(midi: number): string {
  const letter = midiToLetter(midi).toLowerCase().replace('♯', '#');
  return `${letter}/${Math.floor(midi / 12) - 1}`;
}

// A one-line percussion stave draws its only line where a treble stave has its top line (F5).
const DRUM_LINE = 'f/5';

/** Plain-language description of a phrase for screen readers and captions. */
export function describePhrase(p: Phrase): string {
  return p.events
    .map((e) => {
      const len = DUR_WORD[e.duration] ?? `${e.duration / TPQ} beats`;
      if (e.kind === 'rest') return `${len} rest`;
      if (e.kind === 'note') return `${midiToLetter(e.midi)} ${len}`;
      return `${e.sound === 'kick' ? 'bass drum' : e.sound} ${len}`;
    })
    .join(', ');
}

interface Props {
  phrase: Phrase;
  activeIndex?: number;
  marks?: (string | null)[]; // per sounding event: 'ok' | 'wrong' | 'missed' | 'early' | 'late'
  hidePitchNames?: boolean;
}

export function Notation({ phrase, activeIndex, marks }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const el = ref.current;
    if (!el) return;
    import('vexflow/bravura')
      .then(async (mod) => {
        const VF = mod.default;
        await document.fonts?.ready;
        if (cancelled || !el) return;
        el.innerHTML = '';
        const isDrum = phrase.instrument === 'drums';
        const bars = Math.max(1, Math.round(phrase.totalTicks / (TPQ * 4)));
        const width = Math.max(280, Math.min(el.clientWidth || 560, 760));
        const renderer = new VF.Renderer(el, VF.Renderer.Backends.SVG);
        renderer.resize(width, 132);
        const ctx = renderer.getContext();
        const barW = (width - 12) / bars;
        let soundingIdx = 0;
        for (let b = 0; b < bars; b++) {
          const stave = new VF.Stave(6 + b * barW, 8, barW, isDrum ? { numLines: 1 } : undefined);
          if (b === 0) {
            stave.addClef(isDrum ? 'percussion' : 'treble').addTimeSignature(`${phrase.meter[0]}/${phrase.meter[1]}`);
          }
          if (b === bars - 1) stave.setEndBarType(VF.Barline.type.END);
          stave.setContext(ctx).draw();
          const barStart = b * TPQ * 4;
          const evs = layoutBar(phrase.events, barStart, TPQ * 4);
          const notes = evs.map((e) => {
            const d = DUR[e.duration] ?? 'q';
            const dots = d.endsWith('d') ? 1 : 0;
            const base = d.replace('d', '');
            const n =
              e.kind === 'rest'
                ? new VF.StaveNote({ keys: [isDrum ? DRUM_LINE : 'b/4'], duration: `${base}r`, clef: isDrum ? 'percussion' : 'treble' })
                : isDrum
                  ? new VF.StaveNote({ keys: [DRUM_LINE], duration: base, clef: 'percussion', stemDirection: 1 })
                  : new VF.StaveNote({ keys: [e.kind === 'note' ? noteKey(e.midi) : 'b/4'], duration: base, clef: 'treble', autoStem: true });
            if (dots) VF.Dot.buildAndAttach([n], { all: true });
            if (e.kind !== 'rest') {
              const mark = marks?.[soundingIdx];
              const active = soundingIdx === activeIndex;
              const colour = active ? '#3658D4' : mark === 'wrong' || mark === 'missed' ? '#B23A1B' : mark === 'early' || mark === 'late' ? '#8A5A00' : '#2B2341';
              n.setStyle({ fillStyle: colour, strokeStyle: colour });
              soundingIdx++;
            }
            return n;
          });
          if (!notes.length) continue;
          const voice = new VF.Voice({ numBeats: 4, beatValue: 4 }).setMode(VF.Voice.Mode.SOFT).addTickables(notes);
          const beams = VF.Beam.generateBeams(notes);
          new VF.Formatter().joinVoices([voice]).format([voice], barW - (b === 0 ? 80 : 24));
          voice.draw(ctx, stave);
          beams.forEach((bm) => bm.setContext(ctx).draw());
        }
        const svg = el.querySelector('svg');
        svg?.setAttribute('aria-hidden', 'true');
        svg?.setAttribute('focusable', 'false');
        setFailed(false);
      })
      .catch(() => !cancelled && setFailed(true));
    return () => {
      cancelled = true;
    };
  }, [phrase, activeIndex, marks]);

  return (
    <figure className="notation">
      <div ref={ref} className="notation-svg" />
      <figcaption className="sr-only">Music: {describePhrase(phrase)}</figcaption>
      {failed && <p className="note-text">The music picture could not be drawn. The notes are: {describePhrase(phrase)}.</p>}
    </figure>
  );
}
