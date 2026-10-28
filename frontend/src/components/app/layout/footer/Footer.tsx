import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Ltr from '../../../common/ltr/Ltr';
import PhoneLink from '../../../common/phone-link/PhoneLink';
import { useLocalizedPath } from '../../../../i18n/locale';
import { useAppSelector } from '../../../../redux/hooks';
import { selectHours, selectSettings } from '../../../../redux/settings-slice';
import { weekdayInJerusalem } from '../../../../utils/hours';
import { siteDefaults } from '../../../../utils/site-defaults';
import { useLocalized } from '../../../../hooks/use-localized';
import './Footer.css';

const LINKS = [
  ['/menu', 'nav.menu'],
  ['/take-me-home', 'nav.takeMeHome'],
  ['/events', 'nav.events'],
  ['/archive', 'nav.archive'],
  ['/about', 'nav.about'],
  ['/visit', 'nav.visit'],
] as const;

export default function Footer() {
  const { t } = useTranslation();
  const localize = useLocalizedPath();
  const { text } = useLocalized();
  const settings = useAppSelector(selectSettings);
  const hours = useAppSelector(selectHours);
  const today = weekdayInJerusalem(new Date());
  const row = hours.find((item) => item.dayOfWeek === today);
  const warning = text(settings.alcoholWarningHe, settings.alcoholWarningEn);
  const brand = t('footer.brand');
  const brandSplit = brand.split(':');
  const brandLead = brandSplit[0] ?? brand;
  const brandName = brandSplit.slice(1).join(':').trim();

  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <section aria-label={t('nav.visit')}>
          <h2 className="t-mono">{t('nav.visit')}</h2>
          <p>{text(settings.addressHe, settings.addressEn)}</p>
          <p><PhoneLink phone={settings.phone} /></p>
          <p>
            {t('footer.today')}{' '}
            {row && !row.isClosed ? <Ltr>{row.opensAt}–{row.closesAt}</Ltr> : t('footer.closed')}
          </p>
        </section>
        <nav aria-label={t('footer.explore')}>
          <h2 className="t-mono">{t('footer.explore')}</h2>
          {LINKS.map(([path, key]) => (
            <Link key={path} to={localize(path)}>{t(key)}</Link>
          ))}
        </nav>
        <nav aria-label={t('footer.more')}>
          <h2 className="t-mono">{t('footer.more')}</h2>
          <a href={settings.giftCardUrl} target="_blank" rel="noopener noreferrer">
            {t('footer.giftCards')}
            <span className="visually-hidden"> {t('common.opensNewTab')}</span>
          </a>
          <a href={settings.privateEventsUrl} target="_blank" rel="noopener noreferrer">
            {t('footer.privateEvents')}
            <span className="visually-hidden"> {t('common.opensNewTab')}</span>
          </a>
          <a href={siteDefaults.tyoUrl} target="_blank" rel="noopener noreferrer">
            {t('footer.tyo')}
            <span className="visually-hidden"> {t('common.opensNewTab')}</span>
          </a>
          <a href={settings.instagramUrl} target="_blank" rel="noopener noreferrer">
            <Ltr>{t('footer.instagram')}</Ltr>
            <span className="visually-hidden"> {t('common.opensNewTab')}</span>
          </a>
        </nav>
        <nav aria-label={t('footer.legal')}>
          <h2 className="t-mono">{t('footer.legal')}</h2>
          <Link to={localize('/accessibility')}>{t('footer.accessibility')}</Link>
          <Link to={localize('/privacy')}>{t('footer.privacy')}</Link>
        </nav>
      </div>
      <p className="footer-bottom">
        <span>{warning}</span>
        <Ltr>{siteDefaults.nodeAddress}</Ltr>
        <Ltr>{t('footer.rights')}</Ltr>
        <span>{brandName ? <>{brandLead}: <Ltr>{brandName}</Ltr></> : <Ltr>{brand}</Ltr>}</span>
      </p>
    </footer>
  );
}
