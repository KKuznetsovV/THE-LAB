import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { Locale } from '../../../../i18n/locale';

type Props = { locale: Locale };

export default function LocaleLayout({ locale }: Props) {
  const { i18n } = useTranslation();

  useEffect(() => {
    void i18n.changeLanguage(locale);
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === 'he' ? 'rtl' : 'ltr';
  }, [i18n, locale]);

  return <Outlet />;
}
