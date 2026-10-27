import type { CocktailDto } from '@thelab/lib';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ElementTile from '../../common/element-tile/ElementTile';
import SectionHeader from '../../common/section-header/SectionHeader';
import TerminalLoader from '../../common/terminal-loader/TerminalLoader';
import { useLocalized } from '../../../hooks/use-localized';
import { useLocalizedPath } from '../../../i18n/locale';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { loadMenu, selectMenu } from '../../../redux/collections';
import './MenuTeaser.css';

function featured(items: CocktailDto[]): CocktailDto[] {
  const signatures = items.filter((item) => item.isSignature);
  const rest = items.filter((item) => !item.isSignature);
  return [...signatures, ...rest].slice(0, 8);
}

export default function MenuTeaser() {
  const { t } = useTranslation();
  const { text } = useLocalized();
  const localize = useLocalizedPath();
  const dispatch = useAppDispatch();
  const menu = useAppSelector(selectMenu);
  const tiles = featured(menu.items);

  return (
    <section className="menu-teaser">
      <SectionHeader kicker={t('home.menuKicker')} title={t('home.menuTitle')} />
      <div className="menu-teaser-frame">
        {menu.status === 'loading' || menu.status === 'idle' ? <TerminalLoader /> : null}
        {menu.status === 'error' ? (
          <p className="menu-teaser-error">
            <span>{t('home.loadError')}</span>
            <button type="button" className="t-mono" onClick={() => { void dispatch(loadMenu({ force: true })); }}>
              {t('home.retry')}
            </button>
          </p>
        ) : null}
        {menu.status === 'ready' ? (
          <ul className="menu-teaser-grid">
            {tiles.map((item) => (
              <li key={item.id}>
                <Link className="menu-teaser-link" to={localize('/menu')}>
                  <ElementTile
                    code={item.code}
                    indexLabel={item.indexLabel}
                    image={item.imageUrl ?? undefined}
                    imageAlt={text(item.imageAltHe ?? item.nameHe, item.imageAltEn ?? item.nameEn)}
                  />
                  <span className="visually-hidden">{item.nameEn}</span>
                </Link>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
      <Link className="terminal-button terminal-button--outline terminal-button--md" to={localize('/menu')}>
        {t('home.seeMenu')}
      </Link>
    </section>
  );
}
