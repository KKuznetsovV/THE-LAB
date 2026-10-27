import { useTranslation } from 'react-i18next';
import './About.css';

export default function About() {
  const { t } = useTranslation();
  return (
    <section className="about">
      <title>{`${t('about.title')} · THE LAB`}</title>
      <h1>{t('about.heading')}</h1>
    </section>
  );
}
