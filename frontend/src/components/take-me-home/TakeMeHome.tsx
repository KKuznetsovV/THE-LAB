import { useTranslation } from 'react-i18next';
import './TakeMeHome.css';

export default function TakeMeHome() {
  const { t } = useTranslation();
  return (
    <section className="take-me-home">
      <title>{`${t('takeMeHome.title')} · THE LAB`}</title>
      <h1>{t('takeMeHome.heading')}</h1>
    </section>
  );
}
