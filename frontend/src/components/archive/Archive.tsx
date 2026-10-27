import { useTranslation } from 'react-i18next';
import './Archive.css';

export default function Archive() {
  const { t } = useTranslation();
  return (
    <section className="archive">
      <title>{`${t('archive.title')} · THE LAB`}</title>
      <h1>{t('archive.heading')}</h1>
    </section>
  );
}
