import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import TerminalButton from '../common/terminal-button/TerminalButton';
import { useAppSelector } from '../../redux/hooks';
import { selectHours, selectSettings } from '../../redux/settings-slice';
import { isOpenNow, nextChange, weekdayInJerusalem } from '../../utils/hours';
import { siteDefaults, telHref } from '../../utils/site-defaults';
import PageMeta from '../seo/PageMeta';
import { VenueJsonLd } from '../seo/JsonLd';
import './Visit.css';

const DAY_ANCHOR = new Date(Date.UTC(2026, 0, 4));

function dayName(day: number, locale: string): string {
  const date = new Date(DAY_ANCHOR);
  date.setUTCDate(DAY_ANCHOR.getUTCDate() + day);
  return new Intl.DateTimeFormat(locale, { weekday: 'short', timeZone: 'UTC' }).format(date);
}

function formatHm(date: Date): string {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Jerusalem',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).format(date);
}

export default function Visit() {
  const { t, i18n } = useTranslation();
  const settings = useAppSelector(selectSettings);
  const hours = useAppSelector(selectHours);
  const [now, setNow] = useState(() => new Date());
  const today = weekdayInJerusalem(now);
  const open = isOpenNow(hours, now);
  const change = nextChange(hours, now);
  const time = change ? formatHm(change.at) : '';
  const status = open ? t('common.openUntil', { time }) : t('common.closedOpens', { time });
  const happy = `${settings.happyHour.startsAt}–${settings.happyHour.endsAt}`;
  const address = i18n.language === 'en' ? settings.addressEn : settings.addressHe;

  useEffect(() => {
    const clock = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(clock);
  }, []);

  return (
    <div className="visit">
      <PageMeta title={`${t('visit.title')} · THE LAB`} description={t('seo.visit')} path="/visit" />
      <VenueJsonLd />
      <h1>{t('visit.heading')}</h1>
      <div className="visit-book">
        <section className="visit-book-action">
          <h2>{t('visit.bookTitle')}</h2>
          <p className="t-mono">{status}</p>
          <TerminalButton href={settings.reservationUrl} newTabLabel={t('common.opensNewTab')}>
            {t('common.book')}
          </TerminalButton>
          <h3>{t('visit.rules')}</h3>
          <ul>
            <li>{t('visit.ruleHold')}</li>
            <li>{t('visit.ruleAge')}</li>
            <li>{t('visit.ruleHappy', { time: happy })}</li>
          </ul>
        </section>
        <section>
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
          <p>{t('footer.happyHour', { time: happy })}</p>
        </section>
      </div>
      <p>{address}</p>
      <p>{t('visit.gettingHere')}</p>
      <p><a href={telHref(settings.phone)}>{settings.phone}</a></p>
      <p>
        <a href={settings.mapsUrl} target="_blank" rel="noopener noreferrer">
          {t('visit.openMaps')}
          <span className="visually-hidden"> {t('common.opensNewTab')}</span>
        </a>
      </p>
      <nav className="visit-links" aria-label={t('visit.heading')}>
        {settings.privateEventsUrl ? (
          <a href={settings.privateEventsUrl} target="_blank" rel="noopener noreferrer">
            {t('visit.privateEvents')}
            <span className="visually-hidden"> {t('common.opensNewTab')}</span>
          </a>
        ) : null}
        {settings.giftCardUrl ? (
          <a href={settings.giftCardUrl} target="_blank" rel="noopener noreferrer">
            {t('visit.giftCards')}
            <span className="visually-hidden"> {t('common.opensNewTab')}</span>
          </a>
        ) : null}
        {siteDefaults.tyoUrl ? (
          <a href={siteDefaults.tyoUrl} target="_blank" rel="noopener noreferrer">
            {t('visit.tyo')}
            <span className="visually-hidden"> {t('common.opensNewTab')}</span>
          </a>
        ) : null}
      </nav>
    </div>
  );
}
