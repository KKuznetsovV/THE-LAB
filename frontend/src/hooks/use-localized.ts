import { useTranslation } from 'react-i18next';
import type { Locale } from '../i18n/locale';

export function useLocalized(): { locale: Locale; text: (he: string, en: string) => string } {
  const { i18n } = useTranslation();
  const locale: Locale = i18n.language === 'en' ? 'en' : 'he';
  return {
    locale,
    text: (he: string, en: string) => (locale === 'en' ? en : he),
  };
}
