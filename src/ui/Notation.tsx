import { useEffect, useRef, useState } from 'react';
import { type Phrase, TPQ } from '../music/events.ts';
import { layoutBars } from '../music/layout.ts';
import { midiToLetter } from '../music/theory.ts';
import { DRUM_STAVE, VEX_DURATION, accidentalFor, barTicks, clefForPhrase, drumSoundsIn, noteKey } from '../music/notationKeys.ts';
import { PADS } from './instruments.tsx';

const DUR_WORD: Record<number, string> = { 240: 'quaver', 480: 'crotchet', 720: 'dotted crotchet', 960: 'minim', 1440: 'dotted minim', 1920: 'semibreve' };

/** Plain-language description of a phrase for screen readers and captions. */
export function describePhrase(p: Phrase): string {
  return p.events
    .map((e) => {
      const len = DUR_WORD[e.duration] ?? `${e.duration / TPQ} beats`;
      if (e.kind === 'rest') return `${len} rest`;
      if (e.kind === 'note') return `${midiToLetter(e.midi)} ${len}`;
      return `${PADS.find((p) => p.sound === e.sound)?.name.toLowerCase() ?? e.sound} ${len}`;
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
        const clef = isDrum ? 'percussion' : clefForPhrase(phrase);
        const barLen = barTicks(phrase.meter);
        const laid = layoutBars(phrase.events, phrase.totalTicks, barLen);
        const bars = laid.length;
        const width = Math.max(280, Math.min(el.clientWidth || 560, 760 * Math.max(1, bars / 2)));
        const renderer = new VF.Renderer(el, VF.Renderer.Backends.SVG);
        renderer.resize(width, 140);
        const ctx = renderer.getContext();
        const css = getComputedStyle(el);
        const tok = (n: string, f: string) => css.getPropertyValue(n).trim() || f;
        const C = { ink: tok('--score-ink', '#24264A'), now: tok('--score-now', '#3E5BB5'), miss: tok('--score-miss', '#B0345A'), near: tok('--score-near', '#8A5A12'), good: tok('--score-good', '#1D7383') };
        const firstW = 80;
        const barW = (width - 12 - firstW) / bars;
        let soundingIdx = 0;
        const all: { n: InstanceType<typeof VF.StaveNote>; tie?: boolean }[] = [];
        for (let b = 0; b < bars; b++) {
          const x = b === 0 ? 6 : 6 + firstW + b * barW;
          const w = b === 0 ? barW + firstW : barW;
          const stave = new VF.Stave(x, 14, w);
          if (b === 0) stave.addClef(clef).addTimeSignature(`${phrase.meter[0]}/${phrase.meter[1]}`);
          if (b === bars - 1) stave.setEndBarType(VF.Barline.type.END);
          stave.setContext(ctx).draw();
          const notes = laid[b].map((e) => {
            const d = VEX_DURATION[e.duration] ?? 'q';
            const dots = d.endsWith('d') ? 1 : 0;
            const base = d.replace('d', '');
            const n =
              e.kind === 'rest'
                ? new VF.StaveNote({ keys: [isDrum ? 'c/5' : clef === 'bass' ? 'd/3' : 'b/4'], duration: `${base}r`, clef })
                : e.kind === 'drum'
                  ? new VF.StaveNote({ keys: [DRUM_STAVE[e.sound].key], duration: base, clef, stemDirection: 1 })
                  : new VF.StaveNote({ keys: [noteKey(e.midi)], duration: base, clef, autoStem: true });
            if (dots) VF.Dot.buildAndAttach([n], { all: true });
            if (e.kind === 'note' && accidentalFor(e.midi) && !e.continued) n.addModifier(new VF.Accidental('#'), 0);
            if (e.kind !== 'rest') {
              if (e.continued) soundingIdx--;
              const mark = marks?.[soundingIdx];
              const active = soundingIdx === activeIndex;
              const colour = active ? C.now : mark === 'wrong' || mark === 'missed' ? C.miss : mark === 'early' || mark === 'late' ? C.near : C.ink;
              n.setStyle({ fillStyle: colour, strokeStyle: colour });
              soundingIdx++;
              all.push({ n, tie: e.tie });
            } else n.setStyle({ fillStyle: C.ink, strokeStyle: C.ink });
            return n;
          });
          if (!notes.length) continue;
          const voice = new VF.Voice({ numBeats: phrase.meter[0], beatValue: phrase.meter[1] }).setMode(VF.Voice.Mode.SOFT).addTickables(notes);
          const beams = VF.Beam.generateBeams(notes.filter((n) => !n.isRest()));
          new VF.Formatter().joinVoices([voice]).format([voice], w - (b === 0 ? firstW + 24 : 24));
          voice.draw(ctx, stave);
          beams.forEach((bm) => bm.setContext(ctx).draw());
        }
        all.forEach((item, i) => {
          const next = all[i + 1];
          if (item.tie && next) new VF.StaveTie({ firstNote: item.n, lastNote: next.n, firstIndexes: [0], lastIndexes: [0] }).setContext(ctx).draw();
        });
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
            .map((d) => `${PADS.find((p) => p.sound === d)?.name ?? d}: ${DRUM_STAVE[d].where}`)
            .join(' · ')}
        </p>
      )}
      <figcaption className="sr-only">Music: {describePhrase(phrase)}</figcaption>
      {failed && <p className="note-text">The music picture could not be drawn. The notes are: {describePhrase(phrase)}.</p>}
    </figure>
  );
}
