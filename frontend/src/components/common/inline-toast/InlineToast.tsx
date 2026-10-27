import type { ReactNode } from 'react';
import './InlineToast.css';

type Tone = 'info' | 'success' | 'error';

type Props = {
  children: ReactNode;
  tone?: Tone;
  onDismiss?: () => void;
  dismissLabel?: string;
};

export default function InlineToast({
  children,
  tone = 'info',
  onDismiss,
  dismissLabel = 'Dismiss',
}: Props) {
  return (
    <div className={`inline-toast inline-toast--${tone} t-mono`} role={tone === 'error' ? 'alert' : 'status'}>
      <span>{children}</span>
      {onDismiss ? (
        <button type="button" className="inline-toast-dismiss" onClick={onDismiss}>
          {dismissLabel}
        </button>
      ) : null}
    </div>
  );
}
