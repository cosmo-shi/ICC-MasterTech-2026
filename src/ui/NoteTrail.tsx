import { useEffect, useRef } from 'react';
import type { DrumSound } from '../music/events.ts';
import { midiToLetter } from '../music/theory.ts';
import { DRUM_STAVE, diatonic, stavePosition } from '../music/notationKeys.ts';
import { trailGeometry } from '../music/trailGeometry.ts';

export interface TrailNote {
  midi?: number;
  sound?: DrumSound;
  start: number; // performance.now()
  end?: number;
}

/** Shared between the instrument (which adds notes) and the drawing (which wakes to draw them). */
export class Trail {
  notes: TrailNote[] = [];
  private onWake: () => void = () => {};
  wake() {
    this.onWake();
  }
  listen(f: () => void) {
    this.onWake = f;
  }
  /** Notes still on screen; older ones are dropped. */
  visible(now: number, windowMs: number) {
    this.notes = this.notes.filter((n) => (n.end ?? now) > now - windowMs);
    return this.notes;
  }
}

const PX_PER_MS = 0.085; // the paper moves at a steady speed whatever the screen width
// Stave positions come from the same module as the lesson score, so the two always agree.
const BRAVURA = { treble: '\uE050', bass: '\uE062', drums: '\uE069' };
let musicFont: 'loading' | 'ready' | null = null;

/** "What you played", written as music: note heads on a stave, moving left as time passes.
 *  Treble clef for middle and high notes, bass clef for low notes, a drum stave for drums.
 *  It is a picture of the sound, so screen readers skip it (the notes are spoken elsewhere). */
export function NoteTrail({ trail, recording, clef, letters }: { trail: Trail; recording: boolean; clef: 'treble' | 'bass' | 'drums'; letters: boolean }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const rec = useRef(recording);
  const opts = useRef({ clef, letters });

  useEffect(() => {
    const c = canvas.current;
    if (!c) return;
    const st = { raf: 0, running: false };
    const colour = (name: string) => getComputedStyle(c).getPropertyValue(name).trim() || '#888';

    const draw = () => {
      const dpr = window.devicePixelRatio || 1;
      const w = c.clientWidth;
      const h = c.clientHeight;
      if (c.width !== Math.round(w * dpr) || c.height !== Math.round(h * dpr)) {
        c.width = Math.round(w * dpr);
        c.height = Math.round(h * dpr);
      }
      const g = c.getContext('2d');
      if (!g) return false;
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      g.clearRect(0, 0, w, h);
      const { clef: cl, letters: showLetters } = opts.current;
      const now = performance.now();
      const ink = colour('--ink');
      const soft = colour('--ink-soft');
      const line = colour('--ink-faint');

      const left = 44;
      const head = w - 28;
      const pxPerMs = PX_PER_MS;
      const windowMs = (head - left + 40) / pxPerMs;
      const notes = trail.visible(now, windowMs);
      // Stave geometry: sized so every visible note, its ledger lines and its sharp fit (9B: D♯ was cut off).
      const placed = notes.flatMap((n) => (n.sound ? [{ n, pos: DRUM_STAVE[n.sound].pos, cross: DRUM_STAVE[n.sound].cross }] : n.midi !== undefined ? [{ n, pos: stavePosition(n.midi, cl === 'bass' ? 'bass' : 'treble'), cross: false }] : []));
      const { gap, yOf } = trailGeometry(h, placed.map((p) => p.pos), showLetters);

      g.strokeStyle = line;
      g.lineWidth = 1;
      for (let i = 0; i < 5; i++) {
        const y = Math.round(yOf(i * 2)) + 0.5;
        g.beginPath();
        g.moveTo(8, y);
        g.lineTo(w - 8, y);
        g.stroke();
      }
      // Clef: real clef signs from the Bravura music font (loaded with the score), so the
      // trail reads like the score. Until the font is ready the stave shows no clef.
      if (musicFont === 'ready') {
        g.fillStyle = soft;
        g.textBaseline = 'alphabetic';
        g.textAlign = 'left';
        g.font = `${Math.round(gap * 4)}px Bravura`;
        g.fillText(BRAVURA[cl], 12, yOf(cl === 'treble' ? 2 : cl === 'bass' ? 6 : 4));
      }
      // Now line.
      g.strokeStyle = colour(rec.current ? '--record' : '--ink-faint');
      g.lineWidth = 2;
      g.beginPath();
      g.moveTo(head + 0.5, yOf(10) - 6);
      g.lineTo(head + 0.5, yOf(-2) + 6);
      g.stroke();

      const rx = gap * 0.72;
      const ry = gap * 0.5;
      for (const { n, pos, cross } of placed) {
        const sharp = n.midi !== undefined && !n.sound && diatonic(n.midi).sharp;
        const label = n.midi !== undefined && !n.sound ? midiToLetter(n.midi) : '';
        const x = head - (now - n.start) * pxPerMs;
        if (x < left - rx) continue;
        const y = yOf(pos);
        const held = n.end === undefined;
        const col = held ? colour('--sun-deep') : rec.current ? colour('--record') : ink;

        // Ledger lines.
        g.strokeStyle = line;
        g.lineWidth = 1.2;
        for (let p = -2; p >= pos; p -= 2) {
          g.beginPath();
          g.moveTo(x - rx * 1.7, yOf(p));
          g.lineTo(x + rx * 1.7, yOf(p));
          g.stroke();
        }
        for (let p = 10; p <= pos; p += 2) {
          g.beginPath();
          g.moveTo(x - rx * 1.7, yOf(p));
          g.lineTo(x + rx * 1.7, yOf(p));
          g.stroke();
        }
        // How long it was held: a soft line after the head.
        const x1 = head - (now - (n.end ?? now)) * pxPerMs;
        if (x1 - x > rx * 2) {
          g.strokeStyle = col;
          g.globalAlpha = 0.35;
          g.lineWidth = ry * 0.9;
          g.lineCap = 'round';
          g.beginPath();
          g.moveTo(x + rx, y);
          g.lineTo(x1, y);
          g.stroke();
          g.globalAlpha = 1;
        }
        // Note head: Carmen's tilted oval, or a cross for cymbals.
        g.fillStyle = col;
        g.strokeStyle = col;
        if (cross) {
          g.lineWidth = 2;
          g.beginPath();
          g.moveTo(x - rx * 0.8, y - ry);
          g.lineTo(x + rx * 0.8, y + ry);
          g.moveTo(x + rx * 0.8, y - ry);
          g.lineTo(x - rx * 0.8, y + ry);
          g.stroke();
        } else {
          g.beginPath();
          g.ellipse(x, y, rx, ry, -0.35, 0, Math.PI * 2);
          g.fill();
        }
        // Stem.
        g.lineWidth = 1.4;
        g.beginPath();
        if (pos < 4) {
          g.moveTo(x + rx * 0.92, y - 1);
          g.lineTo(x + rx * 0.92, y - gap * 3.2);
        } else {
          g.moveTo(x - rx * 0.92, y + 1);
          g.lineTo(x - rx * 0.92, y + gap * 3.2);
        }
        g.stroke();
        if (sharp) {
          // The engraved sharp from the music font, centred on the note head like printed music.
          g.textAlign = 'right';
          if (musicFont === 'ready') {
            g.textBaseline = 'alphabetic';
            g.font = `${Math.round(gap * 4)}px Bravura`;
            g.fillText('\uE262', x - rx * 1.25, y);
          } else {
            g.textBaseline = 'middle';
            g.font = `700 ${Math.round(gap * 2)}px 'Carmen Music', system-ui, sans-serif`;
            g.fillText('♯', x - rx * 1.25, y);
          }
          g.textBaseline = 'alphabetic';
        }
        if (showLetters && label) {
          g.fillStyle = soft;
          g.font = `700 ${Math.max(11, Math.min(14, Math.round(gap * 1.1)))}px 'Carmen Music', 'Atkinson Hyperlegible Next', system-ui, sans-serif`;
          g.textAlign = 'center';
          g.fillText(label, x, h - 8);
        }
      }
      return notes.length > 0;
    };

    const loop = () => {
      const busy = draw();
      if (busy) st.raf = requestAnimationFrame(loop);
      else st.running = false;
    };
    trail.listen(() => {
      if (st.running) return;
      st.running = true;
      st.raf = requestAnimationFrame(loop);
    });
    draw();
    if (!musicFont) {
      musicFont = 'loading';
      import('vexflow/bravura')
        .then(() => document.fonts?.load('20px Bravura'))
        .then(() => {
          musicFont = 'ready';
          draw();
        })
        .catch(() => (musicFont = null));
    } else if (musicFont === 'loading') document.fonts?.ready.then(() => draw());
    const ro = new ResizeObserver(() => draw());
    ro.observe(c);
    const mo = new MutationObserver(() => draw());
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'data-contrast'] });
    return () => {
      cancelAnimationFrame(st.raf);
      ro.disconnect();
      mo.disconnect();
      trail.listen(() => {});
    };
  }, [trail]);

  useEffect(() => {
    rec.current = recording;
    opts.current = { clef, letters };
    trail.wake();
  }, [recording, clef, letters, trail]);

  return <canvas ref={canvas} className={`trail${recording ? ' is-recording' : ''}`} aria-hidden="true" />;
}

