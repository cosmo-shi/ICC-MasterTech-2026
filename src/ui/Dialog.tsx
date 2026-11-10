import { useEffect, useRef } from 'react';

/**
 * A true modal dialog on the native <dialog> element (showModal): the page behind is inert, Tab
 * stays inside, Escape closes, and focus returns to a sensible place afterwards.
 *
 * Layout comes from CSS, by screen shape, not by width alone:
 *   - portrait phones: a bottom sheet that scrolls inside itself;
 *   - short landscape (≤ 500 px high): a focused full-screen review;
 *   - tablets and desktops: a centred dialog with a comfortable reading width.
 *
 * Focus starts on the heading (the content is short reading, then a choice), so a screen reader
 * reads the title then the description once; nothing inside is a live region.
 */
export function Dialog({
  open,
  onClose,
  labelledBy,
  describedBy,
  returnFocus,
  className,
  children,
}: {
  open: boolean;
  onClose: () => void;
  labelledBy: string;
  describedBy?: string;
  /** Where focus goes when the dialog closes; otherwise back to whatever opened it. */
  returnFocus?: () => HTMLElement | null | undefined;
  className?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const back = useRef(returnFocus);
  useEffect(() => {
    back.current = returnFocus;
  });

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) {
      opener.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      d.showModal();
      d.querySelector<HTMLElement>('[data-autofocus], h2')?.focus({ preventScroll: true });
      d.querySelector('.dlg-body')?.scrollTo?.(0, 0);
    } else if (!open && d.open) {
      d.close();
      const to = back.current?.() ?? opener.current;
      // After React has re-rendered the page behind (it may have changed while the dialog was open).
      window.setTimeout(() => (to && to.isConnected ? to.focus({ preventScroll: false }) : null), 0);
    }
  }, [open]);

  // Unmounting while open (leaving the screen) closes it properly.
  useEffect(() => () => ref.current?.close(), []);

  return (
    <dialog
      ref={ref}
      className={`dlg${className ? ` ${className}` : ''}`}
      aria-labelledby={labelledBy}
      aria-describedby={describedBy}
      onCancel={(e) => {
        // Escape: let React's state close it, so the attempt and focus are handled in one place.
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        // A tap on the backdrop (outside the panel) closes it, like Escape.
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {open && children}
    </dialog>
  );
}
