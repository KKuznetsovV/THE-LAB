import { useTranslation } from 'react-i18next';
import './Accessibility.css';

export default function Accessibility() {
  const { t } = useTranslation();
  return (
    <section className="accessibility">
      <title>{`${t('legal.accessibilityTitle')} · THE LAB`}</title>
      <h1>{t('legal.accessibilityHeading')}</h1>
    </section>
  );
}
