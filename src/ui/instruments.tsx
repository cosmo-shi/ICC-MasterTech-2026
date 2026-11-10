import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { DrumSound } from '../music/events.ts';
import { isBlackKey, midiToLetter, midiToName } from '../music/theory.ts';
import { ContactTracker } from '../input/contacts.ts';
import { inputDebug } from '../input/debug.ts';

export type InputSource = 'pointer' | 'key' | 'midi' | 'mic';

/* ---------------- Keyboard ---------------- */

const WHITE_KEYS_ROW = ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';'];
const BLACK_KEYS_ROW: Record<string, number> = { w: 1, e: 3, t: 6, y: 8, u: 10, o: 13, p: 15 };
const WHITE_OFFSETS = [0, 2, 4, 5, 7, 9, 11, 12, 14, 16];

/** Computer key → semitone offset from the visible C. */
export function keyToOffset(key: string): number | null {
  const k = key.toLowerCase();
  const wi = WHITE_KEYS_ROW.indexOf(k);
  if (wi >= 0) return WHITE_OFFSETS[wi];
  if (k in BLACK_KEYS_ROW) return BLACK_KEYS_ROW[k];
  return null;
}

export function offsetToKey(offset: number): string | null {
  const wi = WHITE_OFFSETS.indexOf(offset);
  if (wi >= 0) return WHITE_KEYS_ROW[wi].toUpperCase();
  const b = Object.entries(BLACK_KEYS_ROW).find(([, v]) => v === offset);
  return b ? b[0].toUpperCase() : null;
}

interface KeyboardProps {
  low: number;
  whiteCount: number;
  down: ReadonlySet<number>;
  highlight?: ReadonlySet<number>;
  showNames: boolean;
  showKeyHints: boolean;
  /** Where the computer-keyboard letters start (the first C on screen). */
  hintsFrom?: number;
  onDown: (midi: number, t: number, src: InputSource) => void;
  onUp: (midi: number, t: number) => void;
  label: string;
  style?: React.CSSProperties;
}

/** Piano keys. Each finger is tracked on its own (see input/contacts.ts): several fingers play
 *  a chord, a finger slides from key to key like a glissando, and lifting one finger never
 *  stops another finger's note.
 *
 *  Touch screens use touch events: on iPhone a touch belongs to the element it started on, and
 *  touchmove keeps arriving there with the finger's position, so the key under the finger is
 *  found by position. Mouse and pen use pointer events with window listeners, so a note ends
 *  only on pointerup or pointercancel, never because the pointer "left" an element. Touch-sourced
 *  pointer events are ignored where touch events exist, so nothing sounds twice. */
export function Keyboard({ low, whiteCount, down, highlight, showNames, showKeyHints, hintsFrom, onDown, onUp, label, style }: KeyboardProps) {
  const whites: number[] = [];
  let m = low;
  while (whites.length < whiteCount) {
    if (!isBlackKey(m)) whites.push(m);
    m++;
  }
  const high = whites[whites.length - 1];
  const blacks: { midi: number; leftIndex: number }[] = [];
  for (let midi = low; midi <= high; midi++) {
    if (isBlackKey(midi)) blacks.push({ midi, leftIndex: whites.indexOf(midi - 1) });
  }
  const root = useRef<HTMLDivElement>(null);
  const handlers = useRef({ onDown, onUp });
  useEffect(() => {
    handlers.current = { onDown, onUp };
  });

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const tracker = new ContactTracker<number>({
      start: (midi, t) => handlers.current.onDown(midi, t, 'pointer'),
      end: (midi, t) => handlers.current.onUp(midi, t),
    });
    // Only keys of this keyboard count, never another instrument or control under the finger.
    const keyAt = (x: number, y: number): number | null => {
      const hit = document.elementFromPoint(x, y)?.closest('[data-midi]') as HTMLElement | null;
      return hit && el.contains(hit) ? Number(hit.dataset.midi) : null;
    };
    const hasTouch = typeof window !== 'undefined' && 'ontouchstart' in window;
    inputDebug.log('keyboard ready', hasTouch ? 'touch events' : 'pointer events');

    const touch = (kind: 'down' | 'move' | 'up') => (e: TouchEvent) => {
      if (e.cancelable) e.preventDefault();
      for (const t of Array.from(e.changedTouches)) {
        const id = `t${t.identifier}`;
        if (kind === 'up') tracker.up(id, e.timeStamp);
        else {
          const k = keyAt(t.clientX, t.clientY);
          if (kind === 'down') tracker.down(id, k, e.timeStamp);
          else tracker.move(id, k, e.timeStamp);
        }
      }
      if (kind !== 'move') inputDebug.log(e.type, `${e.changedTouches.length} changed, ${e.touches.length} down, held ${tracker.held().join(' ')}`);
    };
    const tStart = touch('down');
    const tMove = touch('move');
    const tEnd = touch('up');

    const pMove = (e: PointerEvent) => tracker.move(`p${e.pointerId}`, keyAt(e.clientX, e.clientY), e.timeStamp);
    const pUp = (e: PointerEvent) => {
      tracker.up(`p${e.pointerId}`, e.timeStamp);
      if (!tracker.active) {
        window.removeEventListener('pointermove', pMove);
        window.removeEventListener('pointerup', pUp);
        window.removeEventListener('pointercancel', pUp);
      }
    };
    const pDown = (e: PointerEvent) => {
      if (e.pointerType === 'touch' && hasTouch) return; // the touch listeners own fingers
      if (e.button > 0) return;
      e.preventDefault();
      (e.target as Element).releasePointerCapture?.(e.pointerId);
      tracker.down(`p${e.pointerId}`, keyAt(e.clientX, e.clientY), e.timeStamp);
      window.addEventListener('pointermove', pMove);
      window.addEventListener('pointerup', pUp);
      window.addEventListener('pointercancel', pUp);
    };
    const releaseAll = () => {
      if (tracker.active) inputDebug.log('release all', document.visibilityState);
      tracker.cancelAll(performance.now());
    };
    const onVisible = () => document.visibilityState === 'hidden' && releaseAll();

    el.addEventListener('touchstart', tStart, { passive: false });
    el.addEventListener('touchmove', tMove, { passive: false });
    el.addEventListener('touchend', tEnd, { passive: false });
    el.addEventListener('touchcancel', tEnd, { passive: false });
    el.addEventListener('pointerdown', pDown);
    window.addEventListener('blur', releaseAll);
    window.addEventListener('pagehide', releaseAll);
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      el.removeEventListener('touchstart', tStart);
      el.removeEventListener('touchmove', tMove);
      el.removeEventListener('touchend', tEnd);
      el.removeEventListener('touchcancel', tEnd);
      el.removeEventListener('pointerdown', pDown);
      window.removeEventListener('pointermove', pMove);
      window.removeEventListener('pointerup', pUp);
      window.removeEventListener('pointercancel', pUp);
      window.removeEventListener('blur', releaseAll);
      window.removeEventListener('pagehide', releaseAll);
      document.removeEventListener('visibilitychange', onVisible);
      releaseAll(); // leaving the screen never leaves a note sounding
    };
  }, []);
  const keyAct = (midi: number) => (e: React.KeyboardEvent) => {
    if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) {
      e.preventDefault();
      e.stopPropagation();
      if (e.type === 'keydown') onDown(midi, e.timeStamp, 'key');
      else onUp(midi, e.timeStamp);
    }
  };

  const from = hintsFrom ?? low;
  const keyHint = (midi: number) => (showKeyHints ? offsetToKey(midi - from) : null);

  return (
    <div
      className="kb"
      role="group"
      aria-label={label}
      style={{ ['--white-count' as string]: whiteCount, ...style }}
      ref={root}
    >
      {whites.map((midi, i) => {
        const hint = keyHint(midi);
        const isC = midiToLetter(midi) === 'C';
        return (
          <button
            key={midi}
            type="button"
            data-midi={midi}
            className={`kb-key white n-${midiToLetter(midi).toLowerCase()}${down.has(midi) ? ' is-down' : ''}${highlight?.has(midi) ? ' is-target' : ''}`}
            style={{ ['--i' as string]: i }}
            aria-label={`${midiToName(midi)}${highlight?.has(midi) ? ', shown as a hint' : ''}`}
            aria-pressed={down.has(midi)}
            onKeyDown={keyAct(midi)}
            onKeyUp={keyAct(midi)}
          >
            {showNames && (
              <span className={`kb-name${isC ? ' is-c' : ''}`} aria-hidden="true">
                {midiToLetter(midi)}
                {isC && <sub>{Math.floor(midi / 12) - 1}</sub>}
              </span>
            )}
            {hint && (
              <kbd className="kb-hint" aria-hidden="true">
                {hint}
              </kbd>
            )}
          </button>
        );
      })}
      {blacks.map(({ midi, leftIndex }) => {
        const hint = keyHint(midi);
        return (
          <button
            key={midi}
            type="button"
            data-midi={midi}
            className={`kb-key black${down.has(midi) ? ' is-down' : ''}${highlight?.has(midi) ? ' is-target' : ''}`}
            style={{ ['--i' as string]: leftIndex }}
            aria-label={midiToName(midi).replace('♯', ' sharp ')}
            aria-pressed={down.has(midi)}
            onKeyDown={keyAct(midi)}
            onKeyUp={keyAct(midi)}
          >
            {hint && (
              <kbd className="kb-hint" aria-hidden="true">
                {hint}
              </kbd>
            )}
          </button>
        );
      })}
    </div>
  );
}

/** Pick how many white keys fit so each is at least `minWhite` px wide. */
export function useWhiteCount(minWhite: number, min = 8, max = 15) {
  const ref = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState(min);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => setCount(Math.max(min, Math.min(max, Math.floor(el.clientWidth / minWhite))));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [minWhite, min, max]);
  return { ref, count };
}

/* ---------------- Drums ---------------- */

export interface PadDef {
  sound: DrumSound;
  name: string;
  key: string;
  tone: 'coral' | 'sunflower' | 'mint' | 'lilac';
  shape: 'circle' | 'arch' | 'bar' | 'loop';
}

export const PADS: PadDef[] = [
  { sound: 'kick', name: 'Bass drum', key: 'A', tone: 'coral', shape: 'circle' },
  { sound: 'snare', name: 'Snare', key: 'S', tone: 'sunflower', shape: 'bar' },
  { sound: 'hihat', name: 'Hi-hat', key: 'D', tone: 'mint', shape: 'loop' },
  { sound: 'tomHigh', name: 'High tom', key: 'F', tone: 'lilac', shape: 'arch' },
  { sound: 'tomLow', name: 'Low tom', key: 'G', tone: 'lilac', shape: 'circle' },
  { sound: 'crash', name: 'Cymbal', key: 'H', tone: 'mint', shape: 'arch' },
];
export const SIMPLE_PADS: DrumSound[] = ['kick', 'snare', 'hihat', 'crash'];

function PadGlyph({ shape }: { shape: PadDef['shape'] }) {
  return (
    <svg viewBox="0 0 40 40" className="pad-glyph" aria-hidden="true" focusable="false">
      {shape === 'circle' && <circle cx="20" cy="20" r="11" />}
      {shape === 'bar' && <rect x="8" y="16" width="24" height="8" rx="4" />}
      {shape === 'loop' && <ellipse cx="20" cy="20" rx="13" ry="6" />}
      {shape === 'arch' && <path d="M8 27 A12 12 0 0 1 32 27" />}
    </svg>
  );
}

interface DrumsProps {
  pads: PadDef[];
  down: ReadonlySet<DrumSound>;
  highlight?: ReadonlySet<DrumSound>;
  showKeyHints: boolean;
  onHit: (s: DrumSound, t: number, src: InputSource) => void;
}

export function Drums({ pads, down, highlight, showKeyHints, onHit }: DrumsProps) {
  return (
    <div className="pads" role="group" aria-label={`Drum pads${showKeyHints ? '. Keys ' + pads.map((p) => p.key).join(', ') : ''}`}>
      {pads.map((p) => (
        <button
          key={p.sound}
          type="button"
          className={`pad tone-${p.tone}${down.has(p.sound) ? ' is-down' : ''}${highlight?.has(p.sound) ? ' is-target' : ''}`}
          aria-label={p.name}
          onPointerDown={(e) => {
            e.preventDefault();
            onHit(p.sound, e.timeStamp, 'pointer');
          }}
          onKeyDown={(e) => {
            if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) {
              e.preventDefault();
              e.stopPropagation();
              onHit(p.sound, e.timeStamp, 'key');
            }
          }}
        >
          <PadGlyph shape={p.shape} />
          <span className="pad-name">{p.name}</span>
          {showKeyHints && (
            <kbd className="pad-key" aria-hidden="true">
              {p.key}
            </kbd>
          )}
        </button>
      ))}
    </div>
  );
}

/* A drum kit laid out as the player sees it from the stool: cymbals on the left,
   toms above, snare by the left knee, bass drum in front, floor tom on the right.
   Centres and radii are in % of the kit's width. Wide screens use a 16:10 kit;
   phones in portrait use a taller arrangement of the same kit (100:86). */
type KitSpot = { x: number; y: number; r: number };
const KIT: Partial<Record<DrumSound, { wide: KitSpot; tall: KitSpot; cymbal?: boolean }>> = {
  crash: { wide: { x: 16, y: 14, r: 13 }, tall: { x: 17, y: 17, r: 15 }, cymbal: true },
  hihat: { wide: { x: 12, y: 42, r: 10.5 }, tall: { x: 14, y: 50, r: 13 }, cymbal: true },
  tomHigh: { wide: { x: 50, y: 13, r: 10 }, tall: { x: 50, y: 15, r: 13 } },
  snare: { wide: { x: 37, y: 44, r: 12 }, tall: { x: 42, y: 46, r: 14 } },
  kick: { wide: { x: 64, y: 40, r: 14 }, tall: { x: 70, y: 68, r: 17 } },
  tomLow: { wide: { x: 88, y: 45, r: 10 }, tall: { x: 84, y: 30, r: 14 } },
};
const WIDE_H = 62.5;
const TALL_H = 86;

export function DrumKit({ pads, down, highlight, showKeyHints, onHit }: DrumsProps) {
  return (
    <div className="kit" role="group" aria-label={`Drum kit${showKeyHints ? '. Keys ' + pads.map((p) => p.key).join(', ') : ''}`}>
      {pads.map((p) => {
        const pos = KIT[p.sound];
        if (!pos) return null;
        const { wide: w, tall: t } = pos;
        return (
          <button
            key={p.sound}
            type="button"
            className={`kit-part${pos.cymbal ? ' cymbal' : ' drum'} kit-${p.sound}${down.has(p.sound) ? ' is-down' : ''}${highlight?.has(p.sound) ? ' is-target' : ''}`}
            style={{
              ['--x' as string]: `${w.x}%`,
              ['--y' as string]: `${(w.y / WIDE_H) * 100}%`,
              ['--w' as string]: `${w.r * 2}%`,
              ['--tx' as string]: `${t.x}%`,
              ['--ty' as string]: `${(t.y / TALL_H) * 100}%`,
              ['--tw' as string]: `${t.r * 2}%`,
            }}
            aria-label={p.name}
            onPointerDown={(e) => {
              e.preventDefault();
              onHit(p.sound, e.timeStamp, 'pointer');
            }}
            onKeyDown={(e) => {
              if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) {
                e.preventDefault();
                e.stopPropagation();
                onHit(p.sound, e.timeStamp, 'key');
              }
            }}
          >
            <span className="kit-name">{p.name}</span>
            {showKeyHints && (
              <kbd className="pad-key" aria-hidden="true">
                {p.key}
              </kbd>
            )}
          </button>
        );
      })}
    </div>
  );
}

/** Global computer-keyboard play. Ignores typing in text fields and auto-repeat. */
export function useComputerKeys(enabled: boolean, onDown: (key: string, t: number) => void, onUp: (key: string, t: number) => void) {
  const downRef = useRef(onDown);
  const upRef = useRef(onUp);
  useEffect(() => {
    downRef.current = onDown;
    upRef.current = onUp;
  });
  useEffect(() => {
    if (!enabled) return;
    const isTyping = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      return !!t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable);
    };
    const kd = (e: KeyboardEvent) => {
      if (e.repeat || e.metaKey || e.ctrlKey || e.altKey || isTyping(e)) return;
      if (e.key.length === 1) downRef.current(e.key.toLowerCase(), e.timeStamp);
    };
    const ku = (e: KeyboardEvent) => {
      if (isTyping(e)) return;
      if (e.key.length === 1) upRef.current(e.key.toLowerCase(), e.timeStamp);
    };
    window.addEventListener('keydown', kd);
    window.addEventListener('keyup', ku);
    return () => {
      window.removeEventListener('keydown', kd);
      window.removeEventListener('keyup', ku);
    };
  }, [enabled]);
}
