import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import GlowLogo from '../../../common/glow-logo/GlowLogo';
import Ltr from '../../../common/ltr/Ltr';
import MazeBackground from '../../../common/maze-background/MazeBackground';
import TerminalButton from '../../../common/terminal-button/TerminalButton';
import { useLocalized } from '../../../../hooks/use-localized';
import { useAppSelector } from '../../../../redux/hooks';
import { selectSettings } from '../../../../redux/settings-slice';
import { storeAgeConsent } from './age-storage';
import './AgeGate.css';

type Props = {
  blocked: boolean;
  onAllow: () => void;
};

export default function AgeGate({ blocked, onAllow }: Props) {
  const { t } = useTranslation();
  const { text } = useLocalized();
  const settings = useAppSelector(selectSettings);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [refused, setRefused] = useState(false);
  const warning = text(settings.alcoholWarningHe, settings.alcoholWarningEn);

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
      <MazeBackground variant="black" opacity={0.16} />
      <div className="age-gate-panel">
        <GlowLogo variant="stacked" colour="green" glow label="THE LAB" />
        <h2 id="age-title" className="age-gate-kicker t-mono" dir="ltr">
          {'> AGE CHECK // '}
          <Ltr>18+</Ltr>
        </h2>
        {refused ? <p>{t('ageGate.refusal')}</p> : <p>{t('ageGate.body')}</p>}
        {refused ? null : (
          <div className="age-gate-actions">
            <TerminalButton
              className="cta-lg"
              onClick={() => {
                storeAgeConsent();
                onAllow();
              }}
            >
              {t('ageGate.yes')}
            </TerminalButton>
            <TerminalButton className="cta-lg" variant="outline" onClick={() => setRefused(true)}>
              {t('ageGate.no')}
            </TerminalButton>
          </div>
        )}
        <p className="age-gate-warning">{warning}</p>
      </div>
    </dialog>
  );
}
