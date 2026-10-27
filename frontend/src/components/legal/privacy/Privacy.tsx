import { useTranslation } from 'react-i18next';
import './Privacy.css';

export default function Privacy() {
  const { t } = useTranslation();
  return (
    <section className="privacy">
      <title>{`${t('legal.privacyTitle')} · THE LAB`}</title>
      <h1>{t('legal.privacyHeading')}</h1>
    </section>
  );
}
