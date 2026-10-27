import { useTranslation } from 'react-i18next';
import PageMeta from '../../seo/PageMeta';
import './Privacy.css';

export default function Privacy() {
  const { t } = useTranslation();
  return (
    <article className="privacy">
      <PageMeta title={`${t('legal.privacyTitle')} · THE LAB`} description={t('seo.privacy')} path="/privacy" />
      <h1>{t('legal.privacyHeading')}</h1>
      <p>{t('legal.privacyBody')}</p>
      <p>{t('legal.privacyExternal')}</p>
    </article>
  );
}
