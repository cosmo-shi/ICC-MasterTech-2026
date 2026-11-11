import { useEffect, useRef } from 'react';
import type { DrumSound } from '../music/events.ts';
import { midiToLetter } from '../music/theory.ts';
import { DRUM_STAVE, diatonic, stavePosition } from '../music/notationKeys.ts';
import { trailGeometry } from '../music/trailGeometry.ts';
import { accidentalColumns, headSides, spaceColumns, trailColumns } from '../music/chords.ts';

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
      // Notes that start together are one chord: one column, one stem, heads stacked (a second
      // puts the upper head on the other side of the stem), sharps in their own columns.
      // Notes played one after another are separate columns, never drawn on top of each other.
      const letterFont = `700 ${Math.max(11, Math.min(14, Math.round(gap * 1.1)))}px 'Carmen Music', 'Atkinson Hyperlegible Next', system-ui, sans-serif`;
      g.font = letterFont;
      const cols = trailColumns(placed.map((p) => ({ ...p, start: p.n.start, end: p.n.end })));
      const info = cols.map((c) => {
        const items = [...c.items].sort((a, b) => a.pos - b.pos);
        const sides = headSides(items.map((i) => i.pos));
        const sharpItems = items.filter((i) => i.n.midi !== undefined && !i.n.sound && diatonic(i.n.midi).sharp).reverse();
        const accCols = accidentalColumns(sharpItems.map((i) => i.pos));
        const nAcc = sharpItems.length ? Math.max(...accCols) + 1 : 0;
        const label = showLetters ? items.filter((i) => i.n.midi !== undefined && !i.n.sound).map((i) => midiToLetter(i.n.midi!)).join(' ') : '';
        const headW = rx * 2 * (sides.includes(1) ? 2 : 1);
        const left = rx + nAcc * gap * 1.4; // room for sharps before the heads
        const width = Math.max(headW + left, label ? g.measureText(label).width + 6 : 0);
        return { c, items, sides, sharpItems, accCols, label, left, width };
      });
      const xs = spaceColumns(
        info.map((k) => head - (now - k.c.start) * pxPerMs),
        info.slice(0, -1).map((k, i) => Math.max(k.width, info[i + 1].left + rx * 2) + 4),
      );
      info.forEach((k, ci) => {
        const x = xs[ci];
        if (x < left - rx) return;
        const held = k.c.end === undefined;
        const col = held ? colour('--sun-deep') : rec.current ? colour('--record') : ink;
        const top = k.items[k.items.length - 1].pos;
        const bottom = k.items[0].pos;
        // Ledger lines, once per column, wide enough for heads on both sides of the stem.
        const wide = k.sides.includes(1) ? rx * 3.4 : rx * 1.7;
        g.strokeStyle = line;
        g.lineWidth = 1.2;
        for (let p = -2; p >= bottom; p -= 2) {
          g.beginPath();
          g.moveTo(x - rx * 1.7, yOf(p));
          g.lineTo(x + wide, yOf(p));
          g.stroke();
        }
        for (let p = 10; p <= top; p += 2) {
          g.beginPath();
          g.moveTo(x - rx * 1.7, yOf(p));
          g.lineTo(x + wide, yOf(p));
          g.stroke();
        }
        // How long it was held: a soft line after the column (only while there is room).
        const x1 = head - (now - (k.c.end ?? now)) * pxPerMs;
        const nextX = xs[ci + 1] ?? Infinity;
        if (k.items.length === 1 && Math.min(x1, nextX - rx * 2) - x > rx * 2) {
          g.strokeStyle = col;
          g.globalAlpha = 0.35;
          g.lineWidth = ry * 0.9;
          g.lineCap = 'round';
          g.beginPath();
          g.moveTo(x + rx, yOf(bottom));
          g.lineTo(Math.min(x1, nextX - rx * 2), yOf(bottom));
          g.stroke();
          g.globalAlpha = 1;
        }
        g.fillStyle = col;
        g.strokeStyle = col;
        k.items.forEach((it, i) => {
          const hx = x + k.sides[i] * rx * 1.84;
          const y = yOf(it.pos);
          if (it.cross) {
            g.lineWidth = 2;
            g.beginPath();
            g.moveTo(hx - rx * 0.8, y - ry);
            g.lineTo(hx + rx * 0.8, y + ry);
            g.moveTo(hx + rx * 0.8, y - ry);
            g.lineTo(hx - rx * 0.8, y + ry);
            g.stroke();
          } else {
            g.beginPath();
            g.ellipse(hx, y, rx, ry, -0.35, 0, Math.PI * 2);
            g.fill();
          }
        });
        // One stem for the whole chord.
        g.lineWidth = 1.4;
        g.beginPath();
        const up = (top + bottom) / 2 < 4 || k.sides.includes(1);
        if (up) {
          g.moveTo(x + rx * 0.92, yOf(bottom) - 1);
          g.lineTo(x + rx * 0.92, yOf(top) - gap * 3.2);
        } else {
          g.moveTo(x - rx * 0.92, yOf(top) + 1);
          g.lineTo(x - rx * 0.92, yOf(bottom) + gap * 3.2);
        }
        g.stroke();
        // Sharps, highest first, each column further left so none touch.
        k.sharpItems.forEach((it, i) => {
          const ax = x - rx * 1.25 - k.accCols[i] * gap * 1.4;
          const y = yOf(it.pos);
          g.textAlign = 'right';
          if (musicFont === 'ready') {
            g.textBaseline = 'alphabetic';
            g.font = `${Math.round(gap * 4)}px Bravura`;
            g.fillText('\uE262', ax, y);
          } else {
            g.textBaseline = 'middle';
            g.font = `700 ${Math.round(gap * 2)}px 'Carmen Music', system-ui, sans-serif`;
            g.fillText('♯', ax, y);
          }
          g.textBaseline = 'alphabetic';
        });
        if (k.label) {
          g.fillStyle = soft;
          g.font = letterFont;
          g.textAlign = 'center';
          g.fillText(k.label, x + (k.sides.includes(1) ? rx * 0.9 : 0), h - 8);
        }
      });
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

