import type { MouseEvent, ReactNode } from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { DirtyContext, useFormDirty, type DirtyValue } from './dirty-context';
import { formIsDirty, setFormDirty } from './dirty-state';

type Pending = { run: () => void };

export function GuardedLink({
  to,
  children,
  className,
  current = false,
}: {
  to: string;
  children: ReactNode;
  className?: string;
  current?: boolean;
}) {
  const navigate = useNavigate();
  const guard = useFormDirty();
  function onClick(event: MouseEvent<HTMLAnchorElement>) {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    event.preventDefault();
    guard.requestLeave(() => navigate(to));
  }
  return (
    <a className={className} href={to} aria-current={current ? 'page' : undefined} onClick={onClick}>
      {children}
    </a>
  );
}

export function DirtyProvider({ children }: { children: ReactNode }) {
  const { t } = useTranslation('admin');
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [pending, setPending] = useState<Pending | null>(null);
  const api = useMemo<DirtyValue>(() => ({
    setDirty: setFormDirty,
    requestLeave: (go) => {
      if (!formIsDirty()) {
        go();
        return;
      }
      setPending({ run: go });
    },
  }), []);

  useEffect(() => {
    function onLeave(event: BeforeUnloadEvent) {
      if (!formIsDirty()) return;
      event.preventDefault();
    }
    window.addEventListener('beforeunload', onLeave);
    return () => window.removeEventListener('beforeunload', onLeave);
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (pending && !dialog.open) dialog.showModal();
    if (!pending && dialog.open) dialog.close();
  }, [pending]);

  function stay() {
    setPending(null);
  }

  function discard() {
    const run = pending?.run;
    setFormDirty(false);
    setPending(null);
    run?.();
  }

  return (
    <DirtyContext.Provider value={api}>
      {children}
      <dialog
        ref={dialogRef}
        className="admin-dialog"
        onCancel={(event) => {
          event.preventDefault();
          stay();
        }}
      >
        <p>{t('common.unsaved')}</p>
        <div className="admin-row">
          <button type="button" className="admin-btn" onClick={stay}>{t('common.stay')}</button>
          <button type="button" className="admin-btn admin-btn--ghost" onClick={discard}>{t('common.discard')}</button>
        </div>
      </dialog>
    </DirtyContext.Provider>
  );
}
