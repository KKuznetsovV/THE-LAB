import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './Events.css';

export default function Events() {
  const { slug } = useParams();
  const { t } = useTranslation();
  const heading = slug ? `${t('events.heading')} · ${slug}` : t('events.heading');
  return (
    <section className="events">
      <title>{`${heading} · THE LAB`}</title>
      <h1>{heading}</h1>
    </section>
  );
}
