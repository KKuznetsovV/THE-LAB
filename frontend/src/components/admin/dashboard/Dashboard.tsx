import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import InlineToast from '../../common/inline-toast/InlineToast';
import { useCocktailsAdmin, useBottlesAdmin, useEventsAdmin, useGalleryAdmin, useHoursAdmin, useSpiritsAdmin } from '../../../hooks/use-service';
import { isOpenNow } from '../../../utils/hours';
import { getErrorMessage } from '../../../utils/errors';
import { GuardedLink } from '../shell/dirty';

type Counts = { cocktails: number; bottles: number; spirits: number; events: number; gallery: number; open: boolean };

export default function Dashboard() {
  const { t } = useTranslation('admin');
  const cocktails = useCocktailsAdmin();
  const bottles = useBottlesAdmin();
  const spirits = useSpiritsAdmin();
  const events = useEventsAdmin();
  const gallery = useGalleryAdmin();
  const hours = useHoursAdmin();
  const [counts, setCounts] = useState<Counts | null>(null);
  const [error, setError] = useState<string | null>(null);

  const readRows = useCallback(async () => {
    const [drinkRows, bottleRows, spiritRows, eventRows, photos, dayRows] = await Promise.all([
      cocktails.list(false),
      bottles.list(false),
      spirits.list(false),
      events.list(false),
      gallery.list(false),
      hours.list(),
    ]);
    return {
      cocktails: drinkRows.length,
      bottles: bottleRows.length,
      spirits: spiritRows.length,
      events: eventRows.length,
      gallery: photos.length,
      open: isOpenNow(dayRows, new Date()),
    };
  }, [bottles, cocktails, events, gallery, hours, spirits]);

  useEffect(() => {
    let active = true;
    void readRows().then((next) => {
      if (!active) return;
      setCounts(next);
      setError(null);
    }).catch((reason: unknown) => {
      if (!active) return;
      setError(getErrorMessage(reason));
    });
    return () => { active = false; };
  }, [readRows]);

  return (
    <section>
      <h1>{t('dash.title')}</h1>
      {error ? <InlineToast tone="error" onDismiss={() => setError(null)} dismissLabel={t('common.close')}>{error}</InlineToast> : null}
      {counts ? <p className="t-mono">{counts.open ? t('dash.open') : t('dash.closed')}</p> : <p>{t('common.loading')}</p>}
      {counts ? (
        <ul className="admin-counts">
          <li><GuardedLink to="/admin/cocktails">{t('dash.cocktails')}: {counts.cocktails}</GuardedLink></li>
          <li><GuardedLink to="/admin/bottles">{t('dash.bottles')}: {counts.bottles}</GuardedLink></li>
          <li><GuardedLink to="/admin/spirits">{t('dash.spirits')}: {counts.spirits}</GuardedLink></li>
          <li><GuardedLink to="/admin/events">{t('dash.events')}: {counts.events}</GuardedLink></li>
          <li><GuardedLink to="/admin/gallery">{t('dash.gallery')}: {counts.gallery}</GuardedLink></li>
        </ul>
      ) : null}
      <div className="admin-row">
        <GuardedLink to="/">{t('dash.siteHe')}</GuardedLink>
        <GuardedLink to="/en">{t('dash.siteEn')}</GuardedLink>
      </div>
    </section>
  );
}
