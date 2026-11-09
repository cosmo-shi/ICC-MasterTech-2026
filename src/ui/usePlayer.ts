import { useCallback, useEffect, useRef, useState } from 'react';
import { audio, type ScheduledPlayback } from '../audio/engine.ts';
import { type MusicEvent, TPQ } from '../music/events.ts';

export interface PlayOptions {
  countInBeats?: number;
  click?: boolean;
  totalTicks: number;
  onBeat0?: (pb: ScheduledPlayback) => void;
  onEnd?: () => void;
  tailBeats?: number;
}

/** Schedules music and reports the current beat (negative during count-in). */
export function usePlayer() {
  const [beat, setBeat] = useState<number | null>(null);
  const [playing, setPlaying] = useState(false);
  const raf = useRef(0);
  const current = useRef<ScheduledPlayback | null>(null);
  const timer = useRef(0);

  const stop = useCallback(() => {
    cancelAnimationFrame(raf.current);
    window.clearTimeout(timer.current);
    current.current?.cancel();
    current.current = null;
    setPlaying(false);
    setBeat(null);
  }, []);

  useEffect(() => stop, [stop]);

  const play = useCallback(
    async (tracks: { events: MusicEvent[] }[], tempoBpm: number, opts: PlayOptions): Promise<ScheduledPlayback | null> => {
      stop();
      if (!audio.running) await audio.start();
      const pb = audio.schedule(tracks, tempoBpm, { countInBeats: opts.countInBeats, totalTicks: opts.totalTicks, click: opts.click });
      if (!pb) return null;
      current.current = pb;
      setPlaying(true);
      opts.onBeat0?.(pb);
      const beatMs = 60000 / tempoBpm;
      const totalBeats = opts.totalTicks / TPQ;
      const tick = () => {
        const b = Math.floor((performance.now() - pb.beat0PerfMs) / beatMs);
        setBeat(b < totalBeats ? b : null);
        if (b < totalBeats + (opts.tailBeats ?? 0)) raf.current = requestAnimationFrame(tick);
      };
      raf.current = requestAnimationFrame(tick);
      const endMs = pb.beat0PerfMs - performance.now() + (totalBeats + (opts.tailBeats ?? 0.6)) * beatMs;
      timer.current = window.setTimeout(() => {
        cancelAnimationFrame(raf.current);
        setPlaying(false);
        setBeat(null);
        current.current = null;
        opts.onEnd?.();
      }, Math.max(0, endMs));
      return pb;
    },
    [stop],
  );

  return { play, stop, beat, playing };
}
