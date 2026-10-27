import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import TerminalButton from '../../../common/terminal-button/TerminalButton';
import { storeAgeConsent } from './age-storage';
import './AgeGate.css';

type Props = {
  blocked: boolean;
  onAllow: () => void;
};

export default function AgeGate({ blocked, onAllow }: Props) {
  const { t } = useTranslation();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [refused, setRefused] = useState(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (blocked && !dialog.open) dialog.showModal();
    if (!blocked && dialog.open) dialog.close();
  }, [blocked]);

  return (
    <dialog
      ref={dialogRef}
      className="age-gate"
      aria-labelledby="age-title"
      onCancel={(event) => event.preventDefault()}
    >
      <h2 id="age-title">{t('ageGate.title')}</h2>
      {refused ? <p>{t('ageGate.refusal')}</p> : <p>{t('ageGate.body')}</p>}
      {refused ? null : (
        <div className="age-gate-actions">
          <TerminalButton
            onClick={() => {
              storeAgeConsent();
              onAllow();
            }}
          >
            {t('ageGate.yes')}
          </TerminalButton>
          <TerminalButton variant="outline" onClick={() => setRefused(true)}>{t('ageGate.no')}</TerminalButton>
        </div>
      )}
    </dialog>
  );
}
