import { useEffect, useRef } from 'react';
import type { DrumSound } from '../music/events.ts';
import { midiToLetter } from '../music/theory.ts';

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
const NATURAL_STEP: Record<number, number> = { 0: 0, 2: 1, 4: 2, 5: 3, 7: 4, 9: 5, 11: 6 };

/** Diatonic step of a MIDI note (C4 = 28), and whether it is sharp. */
function diatonic(midi: number): { step: number; sharp: boolean } {
  const pc = ((midi % 12) + 12) % 12;
  const oct = Math.floor(midi / 12) - 1;
  const sharp = !(pc in NATURAL_STEP);
  const base = NATURAL_STEP[sharp ? pc - 1 : pc];
  return { step: oct * 7 + base, sharp };
}
const E4 = diatonic(64).step; // bottom line of the treble stave
const G2 = diatonic(43).step; // bottom line of the bass stave

// Drum kit on a five-line stave (positions in half-spaces from the bottom line).
const DRUM_POS: Record<DrumSound, { pos: number; cross: boolean }> = {
  kick: { pos: 1, cross: false },
  tomLow: { pos: 3, cross: false },
  snare: { pos: 5, cross: false },
  tomHigh: { pos: 7, cross: false },
  hihat: { pos: 9, cross: true },
  crash: { pos: 10, cross: true },
  clave: { pos: 8, cross: true },
};

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

      // Stave geometry: leave room above and below for ledger lines and letters.
      const gap = Math.max(6, Math.min(12, (h - (showLetters ? 20 : 6)) / 8));
      const bottom = (h - (showLetters ? 18 : 0)) / 2 + gap * 2;
      const yOf = (pos: number) => bottom - (pos * gap) / 2;
      const left = 44;
      const head = w - 28;
      const pxPerMs = PX_PER_MS;
      const windowMs = (head - left + 40) / pxPerMs;

      g.strokeStyle = line;
      g.lineWidth = 1;
      for (let i = 0; i < 5; i++) {
        const y = Math.round(yOf(i * 2)) + 0.5;
        g.beginPath();
        g.moveTo(8, y);
        g.lineTo(w - 8, y);
        g.stroke();
      }
      // Clef, drawn from the same shapes as the brand: a label in the reading face.
      g.fillStyle = soft;
      g.font = `700 ${Math.round(gap * 1.25)}px Figtree, system-ui, sans-serif`;
      g.textBaseline = 'middle';
      g.textAlign = 'left';
      if (cl === 'drums') {
        g.fillRect(14, yOf(2), 3, yOf(6) - yOf(2));
        g.fillRect(20, yOf(2), 3, yOf(6) - yOf(2));
      } else {
        // Clefs began life as the letters G and F written on their line; Carmen keeps that idea.
        g.font = `800 ${Math.round(gap * 2.6)}px Figtree, system-ui, sans-serif`;
        g.fillText(cl === 'treble' ? 'G' : 'F', 12, yOf(cl === 'treble' ? 2 : 6));
        g.beginPath();
        g.arc(14 + gap * 2.2, yOf(cl === 'treble' ? 2 : 6), gap * 0.3, 0, Math.PI * 2);
        g.fill();
      }
      // Now line.
      g.strokeStyle = colour(rec.current ? '--record' : '--ink-faint');
      g.lineWidth = 2;
      g.beginPath();
      g.moveTo(head + 0.5, yOf(10) - 6);
      g.lineTo(head + 0.5, yOf(-2) + 6);
      g.stroke();

      const notes = trail.visible(now, windowMs);
      const rx = gap * 0.72;
      const ry = gap * 0.5;
      for (const n of notes) {
        let pos: number;
        let sharp = false;
        let cross = false;
        let label = '';
        if (n.sound) {
          ({ pos, cross } = DRUM_POS[n.sound]);
        } else if (n.midi !== undefined) {
          const d = diatonic(n.midi);
          pos = d.step - (cl === 'bass' ? G2 : E4);
          sharp = d.sharp;
          label = midiToLetter(n.midi);
        } else continue;
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
          g.font = `700 ${Math.round(gap * 1.5)}px Figtree, system-ui, sans-serif`;
          g.textAlign = 'right';
          g.fillText('♯', x - rx * 1.3, y);
        }
        if (showLetters && label) {
          g.fillStyle = soft;
          g.font = `700 ${Math.max(10, Math.round(gap * 1.1))}px Figtree, system-ui, sans-serif`;
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

