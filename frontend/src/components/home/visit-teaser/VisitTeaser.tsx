import { useTranslation } from 'react-i18next';
import SectionHeader from '../../common/section-header/SectionHeader';
import BookingPanel from '../../visit/BookingPanel';
import './VisitTeaser.css';

export default function VisitTeaser() {
  const { t } = useTranslation();

  return (
    <section className="visit-teaser">
      <SectionHeader kicker={t('home.visitKicker')} title={t('home.visitTitle')} />
      <BookingPanel />
    </section>
  );
}
