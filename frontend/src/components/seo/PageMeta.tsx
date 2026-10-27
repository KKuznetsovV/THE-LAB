import { useTranslation } from 'react-i18next';
import { withLocale, type Locale } from '../../i18n/locale';
import { absoluteUrl, siteOrigin } from '../../utils/site-origin';

type Props = {
  title: string;
  description: string;
  path: string;
  type?: 'website' | 'article';
  robots?: string;
};

function localizedUrl(path: string, locale: Locale): string {
  return absoluteUrl(withLocale(path, locale));
}

export default function PageMeta({ title, description, path, type = 'website', robots }: Props) {
  const { i18n } = useTranslation();
  const locale: Locale = i18n.language === 'en' ? 'en' : 'he';
  const image = `${siteOrigin()}/og/the-lab.png`;
  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      {robots ? <meta name="robots" content={robots} /> : null}
      <link rel="canonical" href={localizedUrl(path, locale)} />
      <link rel="alternate" hrefLang="he" href={localizedUrl(path, 'he')} />
      <link rel="alternate" hrefLang="en" href={localizedUrl(path, 'en')} />
      <link rel="alternate" hrefLang="x-default" href={localizedUrl(path, 'he')} />
      <meta property="og:site_name" content="THE LAB" />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={localizedUrl(path, locale)} />
      <meta property="og:locale" content={locale === 'he' ? 'he_IL' : 'en_US'} />
      <meta property="og:locale:alternate" content={locale === 'he' ? 'en_US' : 'he_IL'} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content="THE LAB" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </>
  );
}
