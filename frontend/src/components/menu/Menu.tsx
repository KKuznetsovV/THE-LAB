import type { CocktailDto, Flavour } from '@thelab/lib';
import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ElementTile from '../common/element-tile/ElementTile';
import SectionHeader from '../common/section-header/SectionHeader';
import TerminalLoader from '../common/terminal-loader/TerminalLoader';
import { useLocalized } from '../../hooks/use-localized';
import { useLocalizedPath } from '../../i18n/locale';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { loadBottles, loadMenu, loadSpirits, selectBottles, selectMenu, selectSpirits } from '../../redux/collections';
import { selectSettings } from '../../redux/settings-slice';
import { prefersReducedMotion } from '../../utils/motion';
import PageMeta from '../seo/PageMeta';
import CocktailDialog from './CocktailDialog';
import CocktailRow from './CocktailRow';
import FlavourFilter from './FlavourFilter';
import SpiritsTable from './SpiritsTable';
import {
  MENU_BLOCKS,
  flavoursFromSearch,
  isIndexView,
  withFlavours,
  withView,
  type MenuBlockId,
} from './menu-query';
import './Menu.css';

function matches(item: CocktailDto, selected: Flavour[]): boolean {
  if (selected.length === 0) return true;
  return item.flavours.some((flavour) => selected.includes(flavour));
}

export default function Menu() {
  const { code } = useParams();
  const { t } = useTranslation();
  const { text } = useLocalized();
  const localize = useLocalizedPath();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const search = searchParams.toString() ? `?${searchParams.toString()}` : '';
  const dispatch = useAppDispatch();
  const menu = useAppSelector(selectMenu);
  const bottles = useAppSelector(selectBottles);
  const spirits = useAppSelector(selectSpirits);
  const settings = useAppSelector(selectSettings);
  const [active, setActive] = useState<MenuBlockId>('liquid-records');
  const selected = useMemo(() => flavoursFromSearch(search), [search]);
  const indexView = isIndexView(search);

  useEffect(() => {
    void dispatch(loadMenu());
    void dispatch(loadBottles());
    void dispatch(loadSpirits());
  }, [dispatch]);

  useEffect(() => {
    const nodes = MENU_BLOCKS.map((block) => document.getElementById(block.id)).filter((node) => node !== null);
    const observer = new IntersectionObserver((entries) => {
      const hit = entries.find((entry) => entry.isIntersecting);
      const id = hit?.target.id;
      if (id === 'liquid-records' || id === 'lab-classics' || id === 'almost-classics' || id === 'virgin' || id === 'spirits') {
        setActive(id);
      }
    }, { rootMargin: '-20% 0px -60% 0px' });
    for (const node of nodes) observer.observe(node);
    return () => observer.disconnect();
  }, [menu.status, spirits.status]);

  const available = useMemo(() => {
    const used = new Set<Flavour>();
    for (const item of menu.items) {
      for (const flavour of item.flavours) used.add(flavour);
    }
    return [...used];
  }, [menu.items]);

  const filtered = useMemo(
    () => menu.items.filter((item) => matches(item, selected)),
    [menu.items, selected],
  );

  function toggleFlavour(flavour: Flavour): void {
    const next = selected.includes(flavour)
      ? selected.filter((item) => item !== flavour)
      : [...selected, flavour];
    void navigate(`${localize('/menu')}${withFlavours(withView(search, indexView), next)}`, { replace: true });
  }

  function setIndex(index: boolean): void {
    const path = code ? localize(`/menu/${code}`) : localize('/menu');
    void navigate(`${path}${withView(withFlavours(search, selected), index)}`, { replace: true });
  }

  function itemPath(itemCode: string): string {
    return `${localize(`/menu/${itemCode}`)}${search}`;
  }

  function closeDialog(): void {
    void navigate(`${localize('/menu')}${search}`);
  }

  function clearFlavours(): void {
    void navigate(`${localize('/menu')}${withView(withFlavours(search, []), indexView)}`, { replace: true });
  }

  const openItem = code ? menu.items.find((item) => item.code === code) ?? null : null;
  const openBottle = code ? bottles.items.find((item) => item.cocktail.code === code) ?? null : null;
  const warning = text(settings.alcoholWarningHe, settings.alcoholWarningEn);
  const detail = openItem ? text(openItem.descriptionHe ?? '', openItem.descriptionEn ?? '').trim() : '';
  const pageTitle = openItem ? `${openItem.nameEn} · THE LAB` : `${t('menu.title')} · THE LAB`;
  const pagePath = code ? `/menu/${code}` : '/menu';

  return (
    <div className="menu-page">
      <PageMeta title={pageTitle} description={detail || t('seo.menu')} path={pagePath} />
      <h1 className="visually-hidden">{t('menu.heading')}</h1>
      <nav className="menu-nav" aria-label={t('menu.nav')}>
        {MENU_BLOCKS.map((block) => (
          <a
            key={block.id}
            href={`#${block.id}`}
            aria-current={active === block.id ? 'true' : undefined}
            onClick={(event) => {
              event.preventDefault();
              document.getElementById(block.id)?.scrollIntoView({
                behavior: prefersReducedMotion() ? 'auto' : 'smooth',
              });
              setActive(block.id);
            }}
          >
            {t(block.titleKey)}
          </a>
        ))}
      </nav>

      <FlavourFilter
        available={available}
        selected={selected}
        count={filtered.length}
        onToggle={toggleFlavour}
        onClear={clearFlavours}
      />

      <div className="menu-view" role="group" aria-label={t('menu.view')}>
        <button type="button" className="t-mono" aria-pressed={!indexView} onClick={() => setIndex(false)}>{t('menu.list')}</button>
        <button type="button" className="t-mono" aria-pressed={indexView} onClick={() => setIndex(true)}>{t('menu.index')}</button>
      </div>

      {menu.status === 'loading' || menu.status === 'idle' ? (
        <div className="menu-loading"><TerminalLoader /></div>
      ) : null}
      {menu.status === 'error' ? (
        <p>
          {t('menu.loadError')}
          <button type="button" onClick={() => { void dispatch(loadMenu({ force: true })); }}>{t('menu.retry')}</button>
        </p>
      ) : null}

      {menu.status === 'ready' && selected.length > 0 && filtered.length === 0 ? <p>{t('menu.empty')}</p> : null}

      {MENU_BLOCKS.filter((block) => block.id !== 'spirits').map((block) => {
        const rows = filtered.filter((item) => item.section === block.id);
        return (
          <section key={block.id} id={block.id} className="menu-section">
            <SectionHeader kicker={t('menu.heading')} title={t(block.titleKey)} japanese={'ja' in block ? block.ja : undefined} />
            {indexView ? (
              <ul className="menu-index">
                {rows.map((item) => (
                  <li key={item.id}>
                    <Link to={itemPath(item.code)} data-cocktail={item.code}>
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
            ) : (
              <div className="menu-list">
                {rows.map((item) => <CocktailRow key={item.id} item={item} to={itemPath(item.code)} />)}
              </div>
            )}
          </section>
        );
      })}

      <section id="spirits" className="menu-section">
        <SectionHeader kicker={t('menu.heading')} title={t('menu.spirits')} />
        {spirits.status === 'error' ? (
          <p>
            {t('menu.loadError')}
            <button type="button" onClick={() => { void dispatch(loadSpirits({ force: true })); }}>{t('menu.retry')}</button>
          </p>
        ) : (
          <SpiritsTable groups={spirits.items} />
        )}
      </section>

      <footer className="menu-notes">
        <p>{t('menu.vat')}</p>
        <p>{t('menu.virginNote')}</p>
        <p>{warning}</p>
      </footer>

      {code ? (
        <CocktailDialog code={code} item={openItem} bottle={openBottle} onClose={closeDialog} />
      ) : null}
    </div>
  );
}
