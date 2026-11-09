import { useEffect, useRef, useState } from 'react';
import { type Phrase, TPQ } from '../music/events.ts';
import { layoutBar } from '../music/layout.ts';
import { midiToLetter } from '../music/theory.ts';
import { DRUM_STAVE, accidentalFor, drumSoundsIn, noteKey } from '../music/notationKeys.ts';
import { PADS } from './instruments.tsx';

// Symbols under marked notes, so right/wrong is never shown by colour alone.
const MARK_SYMBOL: Record<string, string> = { ok: '✓', wrong: '✗', missed: '○', early: '←', late: '→' };
const MARK_WORD: Record<string, string> = { ok: 'right', wrong: 'wrong note', missed: 'missed', early: 'early', late: 'late' };
const MARK_TONE: Record<string, string> = { ok: 'good', wrong: 'miss', missed: 'miss', early: 'near', late: 'near' };

const DUR: Record<number, string> = { 240: '8', 480: 'q', 720: 'qd', 960: 'h', 1440: 'hd', 1920: 'w' };
const DUR_WORD: Record<number, string> = { 240: 'quaver', 480: 'crotchet', 960: 'minim', 1920: 'semibreve' };


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
  marks?: (string | null)[]; // per sounding event: 'ok' | 'wrong' | 'missed' | 'early' | 'late' (live while playing, then the checker's)
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
        renderer.resize(width, 160);
        // Colours come from the theme tokens, so Day and Night both work.
        const css = getComputedStyle(el);
        const tok = (name: string, fallback: string) => css.getPropertyValue(name).trim() || fallback;
        const COLOUR = { ink: tok('--ink', '#2a1736'), now: tok('--dusk', '#6a3593'), good: tok('--good', '#0f7565'), near: tok('--near', '#7d5100'), miss: tok('--miss', '#a8264f') };
        const ctx = renderer.getContext();
        const barW = (width - 12) / bars;
        let soundingIdx = 0;
        for (let b = 0; b < bars; b++) {
          const stave = new VF.Stave(6 + b * barW, 8, barW);
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
                ? new VF.StaveNote({ keys: ['b/4'], duration: `${base}r`, clef: isDrum ? 'percussion' : 'treble' })
                : e.kind === 'drum'
                  ? new VF.StaveNote({ keys: [DRUM_STAVE[e.sound].key], duration: base, clef: 'percussion', stemDirection: 1 })
                  : new VF.StaveNote({ keys: [e.kind === 'note' ? noteKey(e.midi) : 'b/4'], duration: base, clef: 'treble', autoStem: true });
            if (dots) VF.Dot.buildAndAttach([n], { all: true });
            if (e.kind === 'note' && accidentalFor(e.midi)) n.addModifier(new VF.Accidental('#'), 0);
            if (e.kind !== 'rest') {
              const mark = marks?.[soundingIdx] ?? null;
              const active = soundingIdx === activeIndex;
              // A played note shows its result; the note to play now is highlighted.
              const colour = mark ? COLOUR[MARK_TONE[mark] as 'good' | 'near' | 'miss'] ?? COLOUR.ink : active ? COLOUR.now : COLOUR.ink;
              n.setStyle({ fillStyle: colour, strokeStyle: colour });
              if (mark && MARK_SYMBOL[mark]) {
                const ann = new VF.Annotation(MARK_SYMBOL[mark]).setVerticalJustification(VF.Annotation.VerticalJustify.BOTTOM);
                ann.setStyle({ fillStyle: colour, strokeStyle: colour });
                ann.setFont('sans-serif', 15, 'bold');
                n.addModifier(ann, 0);
              }
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
      {phrase.instrument === 'drums' && (
        <p className="drum-key">
          {drumSoundsIn(phrase)
            .map((s) => `${PADS.find((p) => p.sound === s)?.name ?? s}: ${DRUM_STAVE[s].where}`)
            .join(' · ')}
        </p>
      )}
      <figcaption className="sr-only">Music: {describePhrase(phrase)}</figcaption>
      {marks && marks.some((m) => m) && (
        <p className="mark-key" aria-hidden="true">
          {[...new Set(marks.filter((m): m is string => !!m && !!MARK_SYMBOL[m]))].map((m) => (
            <span key={m} className={`mark-key-${MARK_TONE[m]}`}>
              {MARK_SYMBOL[m]} {MARK_WORD[m]}
            </span>
          ))}
        </p>
      )}
      {failed && <p className="note-text">The music picture could not be drawn. The notes are: {describePhrase(phrase)}.</p>}
    </figure>
  );
}
