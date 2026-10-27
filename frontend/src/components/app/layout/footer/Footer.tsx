import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import GlowLogo from '../../../common/glow-logo/GlowLogo';
import { useLocalizedPath } from '../../../../i18n/locale';
import { useAppSelector } from '../../../../redux/hooks';
import { selectHours, selectSettings } from '../../../../redux/settings-slice';
import { weekdayInJerusalem } from '../../../../utils/hours';
import { siteDefaults, telHref } from '../../../../utils/site-defaults';
import { useLocalized } from '../../../../hooks/use-localized';
import './Footer.css';

const DAY_ANCHOR = new Date(Date.UTC(2026, 0, 4));

function dayName(day: number, locale: string): string {
  const date = new Date(DAY_ANCHOR);
  date.setUTCDate(DAY_ANCHOR.getUTCDate() + day);
  return new Intl.DateTimeFormat(locale, { weekday: 'short', timeZone: 'UTC' }).format(date);
}

export default function Footer() {
  const { t, i18n } = useTranslation();
  const localize = useLocalizedPath();
  const { text } = useLocalized();
  const settings = useAppSelector(selectSettings);
  const hours = useAppSelector(selectHours);
  const today = weekdayInJerusalem(new Date());
  const warning = text(settings.alcoholWarningHe, settings.alcoholWarningEn);
  const happyHour = `${settings.happyHour.startsAt}–${settings.happyHour.endsAt}`;

  return (
    <footer className="site-footer">
      <GlowLogo variant="stacked" colour="green" />
      <a href={settings.mapsUrl} target="_blank" rel="noopener noreferrer">
        {text(settings.addressHe, settings.addressEn)}
        <span className="visually-hidden"> {t('common.opensNewTab')}</span>
      </a>
      <a href={telHref(settings.phone)}>{settings.phone}</a>
      <table className="hours-table">
        <caption className="t-mono">{t('footer.hours')}</caption>
        <tbody>
          {hours.map((row) => (
            <tr key={row.dayOfWeek} className={row.dayOfWeek === today ? 'is-today' : undefined}>
              <th scope="row">
                {dayName(row.dayOfWeek, i18n.language)}
                {row.dayOfWeek === today ? <span className="visually-hidden"> {t('footer.today')}</span> : null}
              </th>
              <td>{row.isClosed ? t('footer.closed') : `${row.opensAt}–${row.closesAt}`}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p>{t('footer.happyHour', { time: happyHour })}</p>
      <a href={settings.instagramUrl} target="_blank" rel="noopener noreferrer">
        {t('footer.instagram')}
        <span className="visually-hidden"> {t('common.opensNewTab')}</span>
      </a>
      <nav className="footer-links" aria-label={t('common.siteNav')}>
        <a href={settings.giftCardUrl} target="_blank" rel="noopener noreferrer">{t('footer.giftCards')}<span className="visually-hidden"> {t('common.opensNewTab')}</span></a>
        <a href={settings.privateEventsUrl} target="_blank" rel="noopener noreferrer">{t('footer.privateEvents')}<span className="visually-hidden"> {t('common.opensNewTab')}</span></a>
        <a href={siteDefaults.tyoUrl} target="_blank" rel="noopener noreferrer">{t('footer.tyo')}<span className="visually-hidden"> {t('common.opensNewTab')}</span></a>
        <Link to={localize('/accessibility')}>{t('footer.accessibility')}</Link>
        <Link to={localize('/privacy')}>{t('footer.privacy')}</Link>
      </nav>
      <p>{warning}</p>
      <p className="t-mono" lang="en">{siteDefaults.nodeAddress}</p>
      <p>{t('footer.rights')}</p>
      <p>{t('footer.brand')}</p>
    </footer>
  );
}
