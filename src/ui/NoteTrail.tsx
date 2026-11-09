import { useEffect, useRef } from 'react';

export interface TrailNote {
  /** Row from 0 (bottom) to 1 (top). */
  y: number;
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

const WINDOW_MS = 6000;

/** "What you played": the last few seconds of notes drawn on a stave, moving left. Visual only
 *  (the sound and the recording do not depend on it), so it is hidden from screen readers. */
export function NoteTrail({ trail, recording }: { trail: Trail; recording: boolean }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const rec = useRef(recording);

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
      const now = performance.now();
      const head = w - 24;
      const pxPerMs = head / WINDOW_MS;
      const pad = 8;
      const usable = h - pad * 2;

      // The stave: five quiet lines.
      g.strokeStyle = colour('--hairline');
      g.lineWidth = 1;
      for (let i = 0; i < 5; i++) {
        const y = Math.round(pad + (usable * i) / 4) + 0.5;
        g.beginPath();
        g.moveTo(0, y);
        g.lineTo(w, y);
        g.stroke();
      }
      // Now line.
      g.strokeStyle = colour(rec.current ? '--record' : '--ink-faint');
      g.lineWidth = 2;
      g.beginPath();
      g.moveTo(head + 0.5, 4);
      g.lineTo(head + 0.5, h - 4);
      g.stroke();

      const notes = trail.visible(now, WINDOW_MS);
      const thick = Math.max(6, Math.min(12, usable / 8));
      for (const n of notes) {
        const x0 = head - (now - n.start) * pxPerMs;
        const x1 = Math.max(x0 + thick, head - (now - (n.end ?? now)) * pxPerMs);
        const y = pad + (1 - n.y) * usable - thick / 2;
        g.fillStyle = n.end === undefined ? colour('--key-press') : colour(rec.current ? '--record' : '--dusk');
        g.beginPath();
        g.roundRect(x0, y, x1 - x0, thick, thick / 2);
        g.fill();
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
    trail.wake();
  }, [recording, trail]);

  return <canvas ref={canvas} className={`trail${recording ? ' is-recording' : ''}`} aria-hidden="true" />;
}
