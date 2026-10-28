import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import HoursTable from '../common/hours-table/HoursTable';
import Ltr from '../common/ltr/Ltr';
import PhoneLink from '../common/phone-link/PhoneLink';
import TerminalButton from '../common/terminal-button/TerminalButton';
import { useLocalized } from '../../hooks/use-localized';
import { useAppSelector } from '../../redux/hooks';
import { selectHours, selectSettings } from '../../redux/settings-slice';
import { isOpenNow, nextChange, weekdayInJerusalem } from '../../utils/hours';
import { siteDefaults } from '../../utils/site-defaults';
import './BookingPanel.css';

function formatHm(date: Date): string {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Jerusalem',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).format(date);
}

export default function BookingPanel() {
  const { t, i18n } = useTranslation();
  const { text } = useLocalized();
  const settings = useAppSelector(selectSettings);
  const hours = useAppSelector(selectHours);
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const clock = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(clock);
  }, []);

  const today = weekdayInJerusalem(now);
  const open = isOpenNow(hours, now);
  const change = nextChange(hours, now);
  const time = change ? formatHm(change.at) : '';
  const locale = i18n.language === 'en' ? 'en' : 'he';

  return (
    <div className="booking-panel">
      <section className="booking-primary" aria-label={t('visit.bookTitle')}>
        <TerminalButton className="cta-lg" href={settings.reservationUrl} newTabLabel={t('common.opensNewTab')}>
          {t('common.book')}
        </TerminalButton>
        <p className="booking-status">
          {open ? t('common.openUntil') : t('common.closedOpens')}
          {time ? <> <Ltr>{time}</Ltr></> : null}
        </p>
        <HoursTable
          hours={hours}
          locale={locale}
          caption={t('footer.hours')}
          closedLabel={t('footer.closed')}
          todayLabel={t('footer.today')}
          today={today}
        />
        <p>
          {t('footer.happyHour')}{' '}
          <Ltr>{settings.happyHour.startsAt}–{settings.happyHour.endsAt}</Ltr>
        </p>
      </section>
      <section className="booking-aside" aria-label={t('nav.visit')}>
        <p>{text(settings.addressHe, settings.addressEn)}</p>
        <p>
          <a href={settings.mapsUrl} target="_blank" rel="noopener noreferrer">
            {t('visit.openMaps')}
            <span className="visually-hidden"> {t('common.opensNewTab')}</span>
          </a>
        </p>
        <p><PhoneLink phone={settings.phone} /></p>
        <h2>{t('visit.rules')}</h2>
        <ul>
          <li>{t('visit.ruleHold')}</li>
          <li>{t('visit.ruleAge')}</li>
          <li>
            {t('visit.ruleHappy')}{' '}
            <Ltr>{settings.happyHour.startsAt}–{settings.happyHour.endsAt}</Ltr>
          </li>
        </ul>
        <nav className="booking-links" aria-label={t('footer.more')}>
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
      </section>
    </div>
  );
}
