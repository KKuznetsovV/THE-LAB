import { useTranslation } from 'react-i18next';
import TerminalButton from '../../../common/terminal-button/TerminalButton';
import { useDelivery } from '../../../../hooks/use-delivery';
import { useAppSelector } from '../../../../redux/hooks';
import { selectSettings } from '../../../../redux/settings-slice';
import './ActionBar.css';

export default function ActionBar() {
  const { t } = useTranslation();
  const { providers, sheetOpen, closeSheet, order } = useDelivery();
  const settings = useAppSelector(selectSettings);

  return (
    <>
      <div className="action-bar">
        <TerminalButton href={settings.reservationUrl} newTabLabel={t('common.opensNewTab')}>
          {t('common.book')}
        </TerminalButton>
        <TerminalButton variant="outline" onClick={order}>
          {t('common.orderHome')}
        </TerminalButton>
      </div>
      {sheetOpen ? (
        <div className="order-sheet" role="dialog" aria-modal="true" aria-label={t('common.chooseDelivery')}>
          <button type="button" className="order-sheet-close t-mono" onClick={closeSheet}>
            {t('common.closeMenu')}
          </button>
          {providers.map((provider) => (
            <a key={provider.id} href={provider.url} target="_blank" rel="noopener noreferrer">
              {t(provider.id === 'wolt' ? 'common.wolt' : 'common.beecomm')}
              <span className="visually-hidden"> {t('common.opensNewTab')}</span>
            </a>
          ))}
        </div>
      ) : null}
    </>
  );
}
