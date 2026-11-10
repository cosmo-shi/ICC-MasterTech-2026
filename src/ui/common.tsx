import { useEffect, useState } from 'react';
import type { CheckResult, EventFact } from '../engine/checker.ts';
import { midiToLetter } from '../music/theory.ts';
import { Logo } from './brand.tsx';
import { Icon, type IconName } from './icons.tsx';

export function Pill({ tone = 'paper', children }: { tone?: 'paper' | 'mint' | 'lilac' | 'sunflower' | 'coral' | 'cobalt'; children: React.ReactNode }) {
  return <span className={`pill pill-${tone}`}>{children}</span>;
}

/** Beat indicator: one dot per beat; current beat filled. Static (no animation) in reduced motion. */
export function BeatDots({ beats, current, countIn }: { beats: number; current: number; countIn: boolean }) {
  return (
    <div className={`beats${countIn ? ' is-countin' : ''}`} aria-hidden="true">
      {Array.from({ length: beats }, (_, i) => (
        <span key={i} className={`beat${i === current ? ' is-now' : ''}${i % 4 === 0 ? ' is-bar' : ''}`}>
          {i + 1}
        </span>
      ))}
    </div>
  );
}

function soundName(label?: string): string {
  if (!label) return '';
  if (label.startsWith('midi:')) return midiToLetter(Number(label.slice(5)));
  const s = label.slice(5);
  return s === 'kick' ? 'bass drum' : s === 'hihat' ? 'hi-hat' : s === 'tomHigh' ? 'high tom' : s === 'tomLow' ? 'low tom' : s;
}

function factText(f: EventFact): { icon: IconName; text: string; tone: string } {
  if (f.status === 'missed') return { icon: 'missed', text: 'not played', tone: 'missed' };
  if (f.status === 'wrong') return { icon: 'miss', text: `played ${soundName(f.playedLabel)}`, tone: 'wrong' };
  if (f.timing === 'early') return { icon: 'prev', text: 'a bit early', tone: 'timing' };
  if (f.timing === 'late') return { icon: 'next', text: 'a bit late', tone: 'timing' };
  if (f.duration === 'short') return { icon: 'minus', text: 'let go early', tone: 'timing' };
  if (f.duration === 'long') return { icon: 'minus', text: 'held too long', tone: 'timing' };
  return { icon: 'good', text: f.timing ? 'on the beat' : 'matched', tone: 'ok' };
}

export function factMark(f: EventFact): string {
  if (f.status !== 'match') return f.status;
  if (f.timing === 'early' || f.timing === 'late') return f.timing;
  return 'ok';
}

export function FactList({ result }: { result: CheckResult }) {
  return (
    <div className="facts">
      <ol className="fact-row" aria-label="What happened, sound by sound">
        {result.facts.map((f) => {
          const t = factText(f);
          return (
            <li key={f.factId} className={`fact fact-${t.tone}`}>
              <span className="fact-n">{f.index + 1}</span>
              <span className="fact-icon">
                <Icon name={t.icon} size={16} />
              </span>
              <span className="fact-sound">{soundName(f.expectedLabel)}</span>
              <span className="fact-text">{t.text}</span>
            </li>
          );
        })}
      </ol>
      {result.extras.length > 0 && (
        <p className="fact-extra">
          {result.extras.filter((x) => x.inRest).length > 0 && <>Tap in a rest: beat {[...new Set(result.extras.filter((x) => x.inRest).map((x) => x.restBeat ?? Math.floor(x.onsetBeats) + 1))].join(', ')}. </>}
          {result.extras.filter((x) => !x.inRest).length > 0 && <>Extra sounds: {result.extras.filter((x) => !x.inRest).length}.</>}
        </p>
      )}
    </div>
  );
}

/** Announces short status text to screen readers. */
export function LiveStatus({ text }: { text: string }) {
  const [shown, setShown] = useState('');
  useEffect(() => {
    const id = window.setTimeout(() => setShown(text), 50);
    return () => window.clearTimeout(id);
  }, [text]);
  return (
    <p className="sr-only" role="status" aria-live="polite">
      {shown}
    </p>
  );
}

/** Carmen's mark (kept as Motif for older call sites). */
export function Motif({ size = 40 }: { size?: number }) {
  return <Logo size={size} />;
}
