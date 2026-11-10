import { useId } from 'react';
import type { FeedbackTone } from '../teach/attempt.ts';
import { Dialog } from './Dialog.tsx';
import { Icon } from './icons.tsx';

const TONE_ICON = { good: 'good', near: 'near', miss: 'miss', unclear: 'info' } as const;

export interface SheetAction {
  label: string;
  onClick: () => void;
}

/**
 * The one end-of-attempt feedback: a result shape and title, one observation, why it matters, one
 * recommended next step, an audible comparison when it helps, and everything else behind "More help".
 * Used by lessons, Use my instrument and recordings, so feedback looks and behaves the same everywhere.
 */
export function FeedbackSheet({
  open,
  onClose,
  returnFocus,
  tone,
  title,
  observed,
  why,
  tag,
  warning,
  compare,
  primary,
  secondary,
  moreHelp,
  children,
}: {
  open: boolean;
  onClose: () => void;
  returnFocus?: () => HTMLElement | null | undefined;
  tone: FeedbackTone | 'free';
  title: string;
  observed: string;
  why?: string;
  /** Quiet context, e.g. "Slower was on" or "On your own". */
  tag?: string;
  /** Something the learner must know, e.g. the try couldn't be saved. */
  warning?: string;
  compare?: { label: string; playing: boolean; onToggle: () => void };
  primary: SheetAction;
  secondary?: SheetAction;
  moreHelp?: React.ReactNode;
  children?: React.ReactNode;
}) {
  const id = useId();
  return (
    <Dialog open={open} onClose={onClose} labelledBy={`${id}-t`} describedBy={`${id}-d`} returnFocus={returnFocus} className={`feedback tone-${tone}`}>
      <div className="dlg-body">
        <div className="dlg-head">
          <span className="fb-mark">
            <Icon name={tone === 'free' ? 'ear' : TONE_ICON[tone]} size={32} />
          </span>
          <h2 id={`${id}-t`} className="fb-title" tabIndex={-1}>
            {title}
          </h2>
          <button type="button" className="icon-btn quiet dlg-close" aria-label="Close" onClick={onClose}>
            <Icon name="close" size={24} />
          </button>
        </div>
        {tag && <p className="fb-tag">{tag}</p>}
        {warning && (
          <p className="fb-warning">
            <Icon name="alert" size={20} /> {warning}
          </p>
        )}
        <div id={`${id}-d`} className="fb-words">
          <p className="fb-observed">{observed}</p>
          {why && <p className="fb-why">{why}</p>}
        </div>
        {children}
        {compare && (
          <button type="button" className="btn-quiet fb-compare" onClick={compare.onToggle} aria-pressed={compare.playing}>
            <Icon name={compare.playing ? 'stop' : 'ear'} size={24} /> {compare.playing ? 'Stop' : compare.label}
          </button>
        )}
        {moreHelp && (
          <details className="more-help">
            <summary>
              <Icon name="help" size={20} /> More help
            </summary>
            <div className="more-help-body">{moreHelp}</div>
          </details>
        )}
      </div>
      <div className="dlg-foot">
        {secondary && (
          <button type="button" className="btn-quiet" onClick={secondary.onClick}>
            {secondary.label}
          </button>
        )}
        <button type="button" className="btn btn-big" onClick={primary.onClick} data-primary>
          {primary.label}
        </button>
      </div>
    </Dialog>
  );
}
