import { useTranslation } from 'react-i18next';
import PageMeta from '../seo/PageMeta';
import { VenueJsonLd } from '../seo/JsonLd';
import BookingPanel from './BookingPanel';
import './Visit.css';

export default function Visit() {
  const { t } = useTranslation();

  return (
    <div className="visit">
      <PageMeta title={`${t('visit.title')} · THE LAB`} description={t('seo.visit')} path="/visit" />
      <VenueJsonLd />
      <h1>{t('visit.heading')}</h1>
      <BookingPanel />
    </div>
  );
}
