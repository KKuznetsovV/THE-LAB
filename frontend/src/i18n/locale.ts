import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const STORAGE_KEY = 'thelab-locale';

export type Locale = 'he' | 'en';

export function readStoredLocale(): Locale | null {
  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    return value === 'en' || value === 'he' ? value : null;
  } catch {
    return null;
  }
}

export function storeLocale(locale: Locale): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, locale);
  } catch {
    // Storage can be blocked. The URL stays the source of truth.
  }
}

export function stripLocale(pathname: string): string {
  const stripped = pathname.replace(/^\/en(?=\/|$)/, '');
  return stripped === '' ? '/' : stripped;
}

export function withLocale(path: string, locale: Locale): string {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  const bare = stripLocale(normalized);
  if (locale === 'en') return bare === '/' ? '/en' : `/en${bare}`;
  return bare;
}

export function useLocalizedPath(): (path: string) => string {
  const { i18n } = useTranslation();
  const locale: Locale = i18n.language === 'en' ? 'en' : 'he';
  return (path: string) => withLocale(path, locale);
}

export function useLanguageSwitch(): { locale: Locale; stored: Locale | null; select: (locale: Locale) => void } {
  const { i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const locale: Locale = i18n.language === 'en' ? 'en' : 'he';

  function select(next: Locale): void {
    storeLocale(next);
    const target = withLocale(location.pathname, next);
    void navigate(`${target}${location.search}${location.hash}`);
  }

  return { locale, stored: readStoredLocale(), select };
}
