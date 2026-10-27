import { useTranslation } from 'react-i18next';
import './Visit.css';

export default function Visit() {
  const { t } = useTranslation();
  return (
    <section className="visit">
      <title>{`${t('visit.title')} · THE LAB`}</title>
      <h1>{t('visit.heading')}</h1>
    </section>
  );
}
