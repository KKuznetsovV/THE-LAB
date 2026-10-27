import type { EventDto } from '@thelab/lib';
import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import RetroWindow from '../common/retro-window/RetroWindow';
import PageMeta from '../seo/PageMeta';
import { EventJsonLd } from '../seo/JsonLd';
import { absoluteUrl } from '../../utils/site-origin';
import TerminalLoader from '../common/terminal-loader/TerminalLoader';
import { useLocalized } from '../../hooks/use-localized';
import { useLocalizedPath } from '../../i18n/locale';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { loadEvents, loadPastEvents, selectEvents, selectPastEvents } from '../../redux/collections';
import './Events.css';

function whenLabel(value: string, locale: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat(locale === 'en' ? 'en-GB' : 'he-IL', {
    timeZone: 'Asia/Jerusalem',
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

function EventCard({ event, locale, title }: { event: EventDto; locale: string; title: string }) {
  const localize = useLocalizedPath();
  return (
    <li>
      <RetroWindow url={`https://thelabtlv.com/events/${event.slug}`}>
        <Link className="event-card" to={localize(`/events/${event.slug}`)}>
          {event.imageUrl ? (
            <img src={event.imageUrl} alt={title} width={1200} height={675} loading="lazy" decoding="async" />
          ) : null}
          <span className="t-mono">{whenLabel(event.startsAt, locale)}</span>
          <span>{title}</span>
        </Link>
      </RetroWindow>
    </li>
  );
}

export default function Events() {
  const { slug } = useParams();
  const { t } = useTranslation();
  const { locale, text } = useLocalized();
  const localize = useLocalizedPath();
  const dispatch = useAppDispatch();
  const upcoming = useAppSelector(selectEvents);
  const past = useAppSelector(selectPastEvents);

  useEffect(() => {
    void dispatch(loadEvents());
    void dispatch(loadPastEvents());
  }, [dispatch]);

  const loading = upcoming.status === 'idle' || upcoming.status === 'loading' || past.status === 'idle' || past.status === 'loading';
  const failed = upcoming.status === 'error' || past.status === 'error';
  const all = [...upcoming.items, ...past.items];
  const current = slug ? all.find((event) => event.slug === slug) ?? null : null;

  const detailTitle = current ? text(current.titleHe, current.titleEn) : t('events.missing');
  const pageTitle = `${slug ? detailTitle : t('events.title')} · THE LAB`;
  const pagePath = slug ? `/events/${slug}` : '/events';
  const detailBody = current ? text(current.bodyHe, current.bodyEn) : '';

  return (
    <div className="events">
      <PageMeta
        title={pageTitle}
        description={detailBody.trim() || t('seo.events')}
        path={pagePath}
        type={current ? 'article' : 'website'}
      />
      {current ? (
        <EventJsonLd
          name={text(current.titleHe, current.titleEn)}
          description={detailBody.trim() || t('seo.events')}
          startDate={current.startsAt}
          endDate={current.endsAt}
          url={absoluteUrl(localize(pagePath))}
          image={current.imageUrl}
        />
      ) : null}
      <h1>{t('events.heading')}</h1>
      {loading ? <div className="events-loading"><TerminalLoader /></div> : null}
      {failed ? (
        <p>
          {t('events.loadError')}
          <button type="button" onClick={() => { void dispatch(loadEvents({ force: true })); void dispatch(loadPastEvents({ force: true })); }}>
            {t('events.retry')}
          </button>
        </p>
      ) : null}

      {slug && !loading && !current ? <p>{t('events.missing')}</p> : null}
      {current ? (
        <article className="event-detail">
          <Link to={localize('/events')}>{t('events.back')}</Link>
          {current.imageUrl ? (
            <img
              src={current.imageUrl}
              alt={text(current.imageAltHe ?? '', current.imageAltEn ?? '')}
              width={1200}
              height={675}
            />
          ) : null}
          <p className="t-mono">{whenLabel(current.startsAt, locale)}</p>
          <h2>{text(current.titleHe, current.titleEn)}</h2>
          <p>{text(current.bodyHe, current.bodyEn)}</p>
          {current.linkUrl ? (
            <p>
              <a href={current.linkUrl} target="_blank" rel="noopener noreferrer">
                {t('events.more')}
                <span className="visually-hidden"> {t('common.opensNewTab')}</span>
              </a>
            </p>
          ) : null}
        </article>
      ) : null}

      {!slug && !loading && upcoming.items.length === 0 && past.items.length === 0 && !failed ? (
        <p>{t('events.empty')}</p>
      ) : null}

      {!slug && upcoming.items.length > 0 ? (
        <section>
          <h2>{t('events.upcoming')}</h2>
          <ul className="event-list">
            {upcoming.items.map((event) => (
              <EventCard key={event.id} event={event} locale={locale} title={text(event.titleHe, event.titleEn)} />
            ))}
          </ul>
        </section>
      ) : null}

      {!slug && past.items.length > 0 ? (
        <details className="events-past">
          <summary>{t('events.past')}</summary>
          <ul className="event-list">
            {past.items.map((event) => (
              <EventCard key={event.id} event={event} locale={locale} title={text(event.titleHe, event.titleEn)} />
            ))}
          </ul>
        </details>
      ) : null}
    </div>
  );
}
