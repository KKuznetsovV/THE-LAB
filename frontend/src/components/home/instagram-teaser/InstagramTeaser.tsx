import { useTranslation } from 'react-i18next';
import SectionHeader from '../../common/section-header/SectionHeader';
import { useAppSelector } from '../../../redux/hooks';
import { selectSettings } from '../../../redux/settings-slice';
import './InstagramTeaser.css';

export default function InstagramTeaser() {
  const { t } = useTranslation();
  const settings = useAppSelector(selectSettings);

  return (
    <section className="instagram-teaser">
      <SectionHeader kicker={t('home.instagramKicker')} title={t('home.instagramTitle')} titleDir="ltr" />
      <p>{t('home.instagramBody')}</p>
      <a href={settings.instagramUrl} target="_blank" rel="noopener noreferrer">
        {t('home.follow')}
        <span className="visually-hidden"> {t('common.opensNewTab')}</span>
      </a>
    </section>
  );
}
