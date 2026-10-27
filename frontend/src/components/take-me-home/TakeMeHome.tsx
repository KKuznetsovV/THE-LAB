import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import PillBadge from '../common/pill-badge/PillBadge';
import PriceTag from '../common/price-tag/PriceTag';
import RetroWindow from '../common/retro-window/RetroWindow';
import TerminalButton from '../common/terminal-button/TerminalButton';
import TerminalLoader from '../common/terminal-loader/TerminalLoader';
import PageMeta from '../seo/PageMeta';
import { useDelivery } from '../../hooks/use-delivery';
import { useLocalized } from '../../hooks/use-localized';
import { useLocalizedPath } from '../../i18n/locale';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { loadBottles, selectBottles } from '../../redux/collections';
import { selectSettings } from '../../redux/settings-slice';
import { telHref } from '../../utils/site-defaults';
import './TakeMeHome.css';

const STEPS = ['step1', 'step2', 'step3', 'step4', 'step5', 'step6', 'step7'] as const;

type Size = '200' | '500';

export default function TakeMeHome() {
  const { t } = useTranslation();
  const { locale, text } = useLocalized();
  const localize = useLocalizedPath();
  const dispatch = useAppDispatch();
  const bottles = useAppSelector(selectBottles);
  const settings = useAppSelector(selectSettings);
  const { providers } = useDelivery();
  const [sizes, setSizes] = useState<Record<string, Size>>({});

  useEffect(() => {
    void dispatch(loadBottles());
  }, [dispatch]);

  useEffect(() => {
    if (bottles.status !== 'ready') return;
    const id = window.location.hash.replace(/^#/, '');
    if (!id) return;
    document.getElementById(id)?.scrollIntoView();
  }, [bottles.status]);

  const warning = text(settings.alcoholWarningHe, settings.alcoholWarningEn);

  return (
    <div className="take-me-home">
      <PageMeta title={`${t('takeMeHome.title')} · THE LAB`} description={t('seo.takeMeHome')} path="/take-me-home" />
      <RetroWindow url="https://thelabtlv.com/take-me-home">
        <div className="take-me-home-hero">
          <h1>{t('takeMeHome.heading')}</h1>
          <p>
            <span lang="ja">好評発売中</span>
            <span lang="en"> · {t('takeMeHome.comesIn')} · {t('takeMeHome.available')}</span>
          </p>
        </div>
      </RetroWindow>

      {bottles.status === 'idle' || bottles.status === 'loading' ? (
        <div className="take-me-home-loading"><TerminalLoader /></div>
      ) : null}
      {bottles.status === 'error' ? (
        <p>
          {t('takeMeHome.loadError')}
          <button type="button" onClick={() => { void dispatch(loadBottles({ force: true })); }}>{t('takeMeHome.retry')}</button>
        </p>
      ) : null}
      {bottles.status === 'ready' && bottles.items.length === 0 ? <p>{t('takeMeHome.empty')}</p> : null}

      <ul className="bottle-list">
        {bottles.items.map((bottle) => {
          const size = sizes[bottle.id] ?? '200';
          const price = size === '200' ? bottle.price200 : bottle.price500;
          const name = bottle.cocktail.nameEn;
          return (
            <li key={bottle.id}>
              <article className="bottle-label" id={bottle.cocktail.code}>
                <p className="bottle-brand">THE LAB</p>
                <p lang="ja" aria-hidden="true">ザ・ラボ・バイ・トーキョー</p>
                <p>
                  <span lang="ja">試作品・品名</span>
                  {' '}
                  <span lang="en">{name}</span>
                </p>
                <p>
                  <span lang="ja" aria-hidden="true">蒸溜日</span>
                  {' '}
                  <span aria-hidden="true">[ / ]</span>
                  <span className="visually-hidden">{t('takeMeHome.distilled')}</span>
                </p>
                <p className="bottle-age">+18</p>
                {bottle.imageUrl ? (
                  <img
                    src={bottle.imageUrl}
                    alt={text(bottle.imageAltHe ?? name, bottle.imageAltEn ?? name)}
                    width={480}
                    height={640}
                    loading="lazy"
                    decoding="async"
                  />
                ) : null}
                {!bottle.isAvailable ? <PillBadge tone="pink">{t('menu.soldOut')}</PillBadge> : null}
                <div
                  className="size-toggle"
                  role="radiogroup"
                  aria-label={t('takeMeHome.size')}
                  onKeyDown={(event) => {
                    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
                    event.preventDefault();
                    const next: Size = size === '200' ? '500' : '200';
                    setSizes((current) => ({ ...current, [bottle.id]: next }));
                  }}
                >
                  {(['200', '500'] as const).map((option) => (
                    <button
                      key={option}
                      type="button"
                      role="radio"
                      aria-checked={size === option}
                      className="t-mono"
                      onClick={() => setSizes((current) => ({ ...current, [bottle.id]: option }))}
                    >
                      {t(option === '200' ? 'takeMeHome.ml200' : 'takeMeHome.ml500')}
                    </button>
                  ))}
                </div>
                <PriceTag price={price} locale={locale} />
                <Link to={localize(`/menu/${bottle.cocktail.code}`)}>{t('takeMeHome.backToMenu')}</Link>
              </article>
            </li>
          );
        })}
      </ul>

      <section className="take-me-home-order" aria-label={t('takeMeHome.order')}>
        <h2>{t('takeMeHome.order')}</h2>
        <div className="take-me-home-providers">
          {providers.map((provider) => (
            <TerminalButton key={provider.id} href={provider.url} newTabLabel={t('common.opensNewTab')}>
              {t(provider.id === 'wolt' ? 'common.wolt' : 'common.beecomm')}
            </TerminalButton>
          ))}
        </div>
        <p>{t('takeMeHome.area')}</p>
        <p><a href={telHref(settings.phone)}>{settings.phone}</a></p>
      </section>

      <section className="serving-guide" aria-label={t('takeMeHome.guide')}>
        <h2>{t('takeMeHome.guide')}</h2>
        <ol>
          {STEPS.map((key, index) => (
            <li key={key}>
              <span className="t-mono">{index + 1}</span>
              <span>{t(`takeMeHome.${key}`)}</span>
            </li>
          ))}
        </ol>
      </section>

      <p>{t('takeMeHome.adult')}</p>
      <p>{warning}</p>
    </div>
  );
}
