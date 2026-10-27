import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import RetroWindow from '../../common/retro-window/RetroWindow';
import SectionHeader from '../../common/section-header/SectionHeader';
import TerminalButton from '../../common/terminal-button/TerminalButton';
import { useDelivery } from '../../../hooks/use-delivery';
import { useLocalized } from '../../../hooks/use-localized';
import { useLocalizedPath } from '../../../i18n/locale';
import { useAppSelector } from '../../../redux/hooks';
import { selectBottles } from '../../../redux/collections';
import './BottlesTeaser.css';

export default function BottlesTeaser() {
  const { t } = useTranslation();
  const { text } = useLocalized();
  const localize = useLocalizedPath();
  const { order } = useDelivery();
  const bottles = useAppSelector(selectBottles);
  const bottle = bottles.items[0];
  const alt = bottle
    ? text(bottle.imageAltHe ?? bottle.cocktail.nameHe, bottle.imageAltEn ?? bottle.cocktail.nameEn)
    : '';

  return (
    <section className="bottles-teaser">
      <SectionHeader kicker={t('home.bottlesKicker')} title={t('home.bottlesTitle')} />
      <RetroWindow url="https://thelabtlv.com/take-me-home">
        <div className="bottles-teaser-layout">
          <div className="bottles-teaser-photo">
            {bottle?.imageUrl ? (
              <img src={bottle.imageUrl} alt={alt} loading="lazy" decoding="async" />
            ) : (
              <p className="t-mono" lang="en">THE LAB</p>
            )}
          </div>
          <div className="bottles-teaser-copy">
            <p>
              <span lang="ja">好評発売中</span>
              <span lang="en"> · {t('home.bottlesLine')}</span>
            </p>
            <div className="bottles-teaser-actions">
              <TerminalButton onClick={order}>{t('common.order')}</TerminalButton>
              <Link className="terminal-button terminal-button--outline terminal-button--md" to={localize('/take-me-home')}>
                {t('home.seeBottles')}
              </Link>
            </div>
          </div>
        </div>
      </RetroWindow>
    </section>
  );
}
