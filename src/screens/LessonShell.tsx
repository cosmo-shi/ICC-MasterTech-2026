import { useEffect, useRef } from 'react';
import { Icon } from '../ui/icons.tsx';

/** The full-screen lesson frame: close, progress, one step at a time, one big button at the bottom. */
export function LessonShell({
  step,
  steps,
  onClose,
  side,
  foot,
  sheet,
  children,
  stepKey,
}: {
  step: number;
  steps: number;
  onClose: () => void;
  side?: React.ReactNode;
  foot?: React.ReactNode;
  sheet?: React.ReactNode;
  children: React.ReactNode;
  stepKey: string;
}) {
  const body = useRef<HTMLDivElement>(null);
  useEffect(() => {
    body.current?.scrollTo?.(0, 0);
    body.current?.querySelector<HTMLElement>('h1')?.focus({ preventScroll: true });
  }, [stepKey]);
  return (
    <div className={`lp${sheet ? " has-sheet" : ""}`}>
      <header className="lp-bar">
        <button type="button" className="icon-btn quiet" aria-label="Close lesson" onClick={onClose}>
          <Icon name="close" size={24} />
        </button>
        <div className="progress" role="progressbar" aria-label="Lesson progress" aria-valuemin={0} aria-valuemax={steps} aria-valuenow={step}>
          <span style={{ width: `${Math.max(4, (step / steps) * 100)}%` }} />
        </div>
        <div className="lp-side">{side}</div>
      </header>
      <div className="lp-body" ref={body} key={stepKey}>
        {children}
      </div>
      {foot && <footer className="lp-foot">{foot}</footer>}
      {sheet}
    </div>
  );
}
