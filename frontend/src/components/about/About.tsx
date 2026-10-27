import { useTranslation } from 'react-i18next';
import './About.css';

export default function About() {
  const { t } = useTranslation();
  return (
    <article className="about">
      <title>{`${t('about.title')} · THE LAB`}</title>
      <h1>{t('about.heading')}</h1>
      <p>{t('about.story')}</p>
      <section>
        <h2>{t('about.benchTitle')}</h2>
        <p>{t('about.bench')}</p>
      </section>
      <section>
        <h2>{t('about.stillTitle')}</h2>
        <p>{t('about.still')}</p>
      </section>
      <section>
        <h2>{t('about.tyoTitle')}</h2>
        <p>{t('about.tyo')}</p>
      </section>
      <p>{t('about.credits')}</p>
    </article>
  );
}
