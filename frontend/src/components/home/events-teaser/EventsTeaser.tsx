import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SectionHeader from '../../common/section-header/SectionHeader';
import { useLocalized } from '../../../hooks/use-localized';
import { useLocalizedPath } from '../../../i18n/locale';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { loadEvents, selectEvents } from '../../../redux/collections';
import './EventsTeaser.css';

function whenLabel(value: string, locale: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat(locale === 'en' ? 'en-GB' : 'he-IL', {
    timeZone: 'Asia/Jerusalem',
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

export default function EventsTeaser() {
  const { t } = useTranslation();
  const { locale, text } = useLocalized();
  const localize = useLocalizedPath();
  const dispatch = useAppDispatch();
  const events = useAppSelector(selectEvents);
  const next = events.items.slice(0, 2);

  if (events.status === 'ready' && next.length === 0) return null;
  if (events.status === 'idle' || events.status === 'loading') return null;
  if (events.status === 'error') {
    return (
      <section className="events-teaser">
        <SectionHeader kicker={t('home.eventsKicker')} title={t('home.eventsTitle')} />
        <p className="events-teaser-error">
          <span>{t('home.loadError')}</span>
          <button type="button" className="t-mono" onClick={() => { void dispatch(loadEvents({ force: true })); }}>
            {t('home.retry')}
          </button>
        </p>
      </section>
    );
  }

  return (
    <section className="events-teaser">
      <SectionHeader kicker={t('home.eventsKicker')} title={t('home.eventsTitle')} />
      <ul className="events-teaser-list">
        {next.map((event) => (
          <li key={event.id}>
            <Link className="events-teaser-card" to={localize(`/events/${event.slug}`)}>
              {event.imageUrl ? (
                <img
                  src={event.imageUrl}
                  alt={text(event.imageAltHe ?? '', event.imageAltEn ?? '')}
                  width={1200}
                  height={675}
                  loading="lazy"
                  decoding="async"
                />
              ) : null}
              <span className="t-mono">{whenLabel(event.startsAt, locale)}</span>
              <span>{text(event.titleHe, event.titleEn)}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
