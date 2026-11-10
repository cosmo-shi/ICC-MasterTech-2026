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

/** Schedules music and reports the current beat (negative during count-in) and position in ticks. */
export function usePlayer() {
  const [beat, setBeat] = useState<number | null>(null);
  const [playing, setPlaying] = useState(false);
  const [tick, setTick] = useState<number | null>(null);
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
    setTick(null);
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
        const f = (performance.now() - pb.beat0PerfMs) / beatMs;
        const b = Math.floor(f);
        setBeat(b < totalBeats ? b : null);
        setTick(f >= 0 && f < totalBeats ? f * TPQ : null);
        if (b < totalBeats + (opts.tailBeats ?? 0)) raf.current = requestAnimationFrame(tick);
      };
      raf.current = requestAnimationFrame(tick);
      // End on the take's own length. The audio-clock estimate is capped by the scheduled length,
      // so a wrong clock can never leave "Stop" showing long after the music has finished.
      const tail = (opts.tailBeats ?? 0.6) * beatMs;
      const byClock = pb.beat0PerfMs - performance.now() + totalBeats * beatMs + tail;
      const byLength = pb.durationSec * 1000 + 150 + tail;
      const endMs = Math.min(byClock, byLength);
      timer.current = window.setTimeout(() => {
        cancelAnimationFrame(raf.current);
        setPlaying(false);
        setBeat(null);
        setTick(null);
        current.current = null;
        opts.onEnd?.();
      }, Math.max(0, endMs));
      return pb;
    },
    [stop],
  );

  return { play, stop, beat, tick, playing };
}
