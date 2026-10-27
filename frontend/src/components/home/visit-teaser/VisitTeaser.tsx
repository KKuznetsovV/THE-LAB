import { useTranslation } from 'react-i18next';
import SectionHeader from '../../common/section-header/SectionHeader';
import TerminalButton from '../../common/terminal-button/TerminalButton';
import { useLocalized } from '../../../hooks/use-localized';
import { useAppSelector } from '../../../redux/hooks';
import { selectHours, selectSettings } from '../../../redux/settings-slice';
import { weekdayInJerusalem } from '../../../utils/hours';
import { telHref } from '../../../utils/site-defaults';
import './VisitTeaser.css';

const DAY_ANCHOR = new Date(Date.UTC(2026, 0, 4));

function dayName(day: number, locale: string): string {
  const date = new Date(DAY_ANCHOR);
  date.setUTCDate(DAY_ANCHOR.getUTCDate() + day);
  return new Intl.DateTimeFormat(locale, { weekday: 'short', timeZone: 'UTC' }).format(date);
}

export default function VisitTeaser() {
  const { t, i18n } = useTranslation();
  const { text } = useLocalized();
  const settings = useAppSelector(selectSettings);
  const hours = useAppSelector(selectHours);
  const today = weekdayInJerusalem(new Date());
  const happyHour = `${settings.happyHour.startsAt}–${settings.happyHour.endsAt}`;

  return (
    <section className="visit-teaser">
      <SectionHeader kicker={t('home.visitKicker')} title={t('home.visitTitle')} />
      <p>{text(settings.addressHe, settings.addressEn)}</p>
      <p><a href={telHref(settings.phone)}>{settings.phone}</a></p>
      <table className="visit-hours">
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
      <div className="visit-teaser-actions">
        <a href={settings.mapsUrl} target="_blank" rel="noopener noreferrer">
          {t('home.openMaps')}
          <span className="visually-hidden"> {t('common.opensNewTab')}</span>
        </a>
        <TerminalButton href={settings.reservationUrl} newTabLabel={t('common.opensNewTab')}>
          {t('common.book')}
        </TerminalButton>
      </div>
    </section>
  );
}
