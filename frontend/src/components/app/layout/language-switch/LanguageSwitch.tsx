import { useTranslation } from 'react-i18next';
import { useLanguageSwitch } from '../../../../i18n/locale';
import './LanguageSwitch.css';

export default function LanguageSwitch() {
  const { t } = useTranslation();
  const { locale, select } = useLanguageSwitch();

  return (
    <div className="language-switch" role="group" aria-label={t('common.language')}>
      <button type="button" aria-pressed={locale === 'he'} onClick={() => select('he')}>עב</button>
      <button type="button" aria-pressed={locale === 'en'} onClick={() => select('en')}>EN</button>
    </div>
  );
}
