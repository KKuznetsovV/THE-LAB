import i18n from '../../../i18n';
import { adminEn } from './en';
import { adminHe } from './he';

i18n.addResourceBundle('he', 'admin', adminHe, true, true);
i18n.addResourceBundle('en', 'admin', adminEn, true, true);

const LOCALE_KEY = 'thelab-admin-locale';

export function adminLocale(): 'he' | 'en' {
  return sessionStorage.getItem(LOCALE_KEY) === 'en' ? 'en' : 'he';
}

export function applyAdminLocale(locale: 'he' | 'en'): void {
  sessionStorage.setItem(LOCALE_KEY, locale);
  void i18n.changeLanguage(locale);
  document.documentElement.lang = locale;
  document.documentElement.dir = locale === 'he' ? 'rtl' : 'ltr';
}
