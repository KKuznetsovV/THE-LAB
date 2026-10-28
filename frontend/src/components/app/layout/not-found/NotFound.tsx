import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import GlowLogo from '../../../common/glow-logo/GlowLogo';
import { useLocalizedPath } from '../../../../i18n/locale';
import PageMeta from '../../../seo/PageMeta';
import './NotFound.css';

export default function NotFound() {
  const { t } = useTranslation();
  const localize = useLocalizedPath();
  const location = useLocation();

  return (
    <section className="not-found">
      <PageMeta
        title={`${t('errors.notFoundTitle')} · THE LAB`}
        description={t('seo.notFound')}
        path={location.pathname}
        robots="noindex"
        indexed={false}
      />
      <div className="not-found-sign">
        <svg className="not-found-blob" viewBox="0 0 200 160" aria-hidden="true">
          <path
            d="M34 78c2-38 48-62 86-52 34 8 62 18 64 52 2 40-28 70-70 72-46 2-82-28-80-72z"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          />
        </svg>
        <GlowLogo variant="stacked" colour="green" glow label="THE LAB" />
      </div>
      <h1>{t('errors.notFound')}</h1>
      <Link to={localize('/')}>{t('errors.home')}</Link>
    </section>
  );
}
