import type { BottleDto, CocktailDto } from '@thelab/lib';
import { useCallback, useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import InlineToast from '../../common/inline-toast/InlineToast';
import { useBottlesAdmin, useCocktailsAdmin } from '../../../hooks/use-service';
import { useAppDispatch } from '../../../redux/hooks';
import type { BottleWrite } from '../../../services/auth-aware/BottlesAdminService';
import { getErrorMessage } from '../../../utils/errors';
import ImageField from '../fields/ImageField';
import { refreshPublic } from '../refresh';
import { deletedOnly, moveBy, parsePrice } from '../rows';
import { useFormDirty } from '../shell/dirty-context';

type Notice = { tone: 'success' | 'error'; text: string };
type Draft = BottleDto | 'new';
type Values = {
  cocktailId: string;
  displayNameEn: string;
  displayNameHe: string;
  price200: string;
  price500: string;
  isAvailable: boolean;
  isPublished: boolean;
  imageUrl: string;
  imageAltHe: string;
  imageAltEn: string;
};

function valuesOf(row: BottleDto | null, cocktails: CocktailDto[]): Values {
  if (!row) {
    return {
      cocktailId: cocktails[0]?.id ?? '',
      displayNameEn: '',
      displayNameHe: '',
      price200: '',
      price500: '',
      isAvailable: true,
      isPublished: false,
      imageUrl: '',
      imageAltHe: '',
      imageAltEn: '',
    };
  }
  return {
    cocktailId: row.cocktailId,
    displayNameEn: row.displayNameEn ?? '',
    displayNameHe: row.displayNameHe ?? '',
    price200: String(row.price200),
    price500: String(row.price500),
    isAvailable: row.isAvailable,
    isPublished: row.isPublished,
    imageUrl: row.imageUrl ?? '',
    imageAltHe: row.imageAltHe ?? '',
    imageAltEn: row.imageAltEn ?? '',
  };
}

function BottleForm({
  draft,
  cocktails,
  onClose,
  onSaved,
  onError,
}: {
  draft: Draft;
  cocktails: CocktailDto[];
  onClose: () => void;
  onSaved: () => void;
  onError: (message: string) => void;
}) {
  const { t } = useTranslation('admin');
  const service = useBottlesAdmin();
  const { setDirty } = useFormDirty();
  const form = useForm<Values>({ defaultValues: valuesOf(draft === 'new' ? null : draft, cocktails) });
  const { register, handleSubmit, control, setValue, formState } = form;
  const imageUrl = useWatch({ control, name: 'imageUrl' });
  setDirty(formState.isDirty);
  useEffect(() => () => setDirty(false), [setDirty]);

  async function onSubmit(values: Values) {
    const price200 = parsePrice(values.price200);
    const price500 = parsePrice(values.price500);
    if (!values.cocktailId || price200 === null || price500 === null || Number.isNaN(price200) || Number.isNaN(price500)) {
      onError(t('common.price'));
      return;
    }
    const body: BottleWrite = {
      cocktailId: values.cocktailId,
      displayNameEn: values.displayNameEn.trim() ? values.displayNameEn.trim() : null,
      displayNameHe: values.displayNameHe.trim() ? values.displayNameHe.trim() : null,
      price200,
      price500,
      isAvailable: values.isAvailable,
      isPublished: values.isPublished,
      imageUrl: values.imageUrl.trim() ? values.imageUrl : null,
      imageAltHe: values.imageAltHe.trim() ? values.imageAltHe : null,
      imageAltEn: values.imageAltEn.trim() ? values.imageAltEn : null,
    };
    try {
      if (draft === 'new') await service.create(body);
      else await service.update(draft.id, body);
      setDirty(false);
      onSaved();
    } catch (error) {
      onError(getErrorMessage(error));
    }
  }

  return (
    <form className="admin-form" noValidate onSubmit={(event) => { void handleSubmit(onSubmit)(event); }}>
      <h2>{draft === 'new' ? t('bottles.fresh') : (draft.displayNameEn || draft.cocktail.nameEn)}</h2>
      <div className="admin-grid admin-grid--2">
        <label className="admin-field">
          {t('bottles.cocktail')}
          <select {...register('cocktailId')}>
            {cocktails.map((cocktail) => <option key={cocktail.id} value={cocktail.id}>{cocktail.code} {cocktail.nameEn}</option>)}
          </select>
        </label>
        <label className="admin-field">{t('bottles.displayNameEn')}<input dir="ltr" {...register('displayNameEn')} /></label>
        <label className="admin-field">{t('bottles.displayNameHe')}<input dir="rtl" {...register('displayNameHe')} /></label>
        <label className="admin-field">{t('bottles.price200')}<input dir="ltr" inputMode="numeric" {...register('price200')} /></label>
        <label className="admin-field">{t('bottles.price500')}<input dir="ltr" inputMode="numeric" {...register('price500')} /></label>
        <label className="admin-field">{t('bottles.altHe')}<input dir="rtl" {...register('imageAltHe')} /></label>
        <label className="admin-field">{t('bottles.altEn')}<input dir="ltr" {...register('imageAltEn')} /></label>
      </div>
      <label className="admin-check"><input type="checkbox" {...register('isAvailable')} />{t('common.available')}</label>
      <label className="admin-check"><input type="checkbox" {...register('isPublished')} />{t('common.published')}</label>
      <ImageField purpose="bottle" url={imageUrl} onUrl={(url) => setValue('imageUrl', url, { shouldDirty: true })} onError={onError} />
      <div className="admin-row">
        <button type="submit" className="admin-btn">{t('common.save')}</button>
        <button type="button" className="admin-btn admin-btn--ghost" onClick={onClose}>{t('common.cancel')}</button>
      </div>
    </form>
  );
}

export default function BottlesAdmin() {
  const { t } = useTranslation('admin');
  const service = useBottlesAdmin();
  const cocktailsService = useCocktailsAdmin();
  const dispatch = useAppDispatch();
  const { requestLeave } = useFormDirty();
  const [rows, setRows] = useState<BottleDto[]>([]);
  const [cocktails, setCocktails] = useState<CocktailDto[]>([]);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [trash, setTrash] = useState(false);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [draft, setDraft] = useState<Draft | null>(null);

  const readRows = useCallback(async () => {
    const [next, drinks] = await Promise.all([
      trash ? service.list(true).then(async (everything) => deletedOnly(await service.list(false), everything)) : service.list(false),
      cocktailsService.list(false),
    ]);
    return { next, drinks };
  }, [cocktailsService, service, trash]);

  const reload = useCallback(async (quiet = false) => {
    if (!quiet) setStatus('loading');
    try {
      const loaded = await readRows();
      setRows(loaded.next);
      setCocktails(loaded.drinks);
      setStatus('ready');
    } catch (error) {
      setNotice({ tone: 'error', text: getErrorMessage(error) });
      setStatus('error');
    }
  }, [readRows]);

  useEffect(() => {
    let active = true;
    void readRows().then((loaded) => {
      if (!active) return;
      setRows(loaded.next);
      setCocktails(loaded.drinks);
      setStatus('ready');
    }).catch((error: unknown) => {
      if (!active) return;
      setNotice({ tone: 'error', text: getErrorMessage(error) });
      setStatus('error');
    });
    return () => { active = false; };
  }, [readRows]);

  async function toggle(row: BottleDto, patch: Partial<BottleWrite>) {
    try {
      const next = await service.update(row.id, patch);
      setRows((current) => current.map((item) => (item.id === row.id ? next : item)));
      refreshPublic(dispatch, 'bottles');
    } catch (error) {
      setNotice({ tone: 'error', text: getErrorMessage(error) });
    }
  }

  async function onMove(row: BottleDto, direction: -1 | 1) {
    if (trash) return;
    const next = moveBy(rows, row.id, direction);
    if (!next) return;
    try {
      await service.reorder(next.map((item) => item.id));
      refreshPublic(dispatch, 'bottles');
      await reload(true);
    } catch (error) {
      setNotice({ tone: 'error', text: getErrorMessage(error) });
    }
  }

  return (
    <section>
      <h1>{t('bottles.title')}</h1>
      {notice ? <InlineToast tone={notice.tone} onDismiss={() => setNotice(null)} dismissLabel={t('common.close')}>{notice.text}</InlineToast> : null}
      <div className="admin-row">
        <button type="button" className="admin-btn" onClick={() => requestLeave(() => setDraft('new'))}>{t('common.create')}</button>
        <button type="button" className="admin-btn admin-btn--ghost" aria-pressed={trash} onClick={() => { setTrash((value) => !value); setDraft(null); }}>{t('common.trash')}</button>
      </div>
      {status === 'loading' ? <p>{t('common.loading')}</p> : null}
      {status === 'error' ? <button type="button" className="admin-btn" onClick={() => { void reload(); }}>{t('common.retry')}</button> : null}
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>{t('bottles.cocktail')}</th>
              <th>{t('bottles.price200')}</th>
              <th>{t('bottles.price500')}</th>
              <th>{t('common.available')}</th>
              <th>{t('common.published')}</th>
              <th>{t('common.edit')}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td dir="ltr">{row.displayNameEn || row.cocktail.nameEn}</td>
                <td dir="ltr">{row.price200}</td>
                <td dir="ltr">{row.price500}</td>
                <td><input type="checkbox" checked={row.isAvailable} disabled={trash} aria-label={t('common.available')} onChange={() => { void toggle(row, { isAvailable: !row.isAvailable }); }} /></td>
                <td><input type="checkbox" checked={row.isPublished} disabled={trash} aria-label={t('common.published')} onChange={() => { void toggle(row, { isPublished: !row.isPublished }); }} /></td>
                <td className="admin-row">
                  {trash ? <button type="button" className="admin-btn admin-btn--ghost" onClick={() => { void service.restore(row.id).then(() => reload(true)); }}>{t('common.restore')}</button> : (
                    <>
                      <button type="button" className="admin-btn admin-btn--ghost" onClick={() => requestLeave(() => setDraft(row))}>{t('common.edit')}</button>
                      <button type="button" className="admin-btn admin-btn--ghost" aria-label={t('common.up')} onClick={() => { void onMove(row, -1); }}>{t('common.up')}</button>
                      <button type="button" className="admin-btn admin-btn--ghost" aria-label={t('common.down')} onClick={() => { void onMove(row, 1); }}>{t('common.down')}</button>
                      <button type="button" className="admin-btn admin-btn--ghost" onClick={() => { void service.remove(row.id).then(() => { refreshPublic(dispatch, 'bottles'); return reload(true); }); }}>{t('common.delete')}</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {draft ? (
        <BottleForm
          key={draft === 'new' ? 'new' : draft.id}
          draft={draft}
          cocktails={cocktails}
          onClose={() => requestLeave(() => setDraft(null))}
          onSaved={() => { setDraft(null); setNotice({ tone: 'success', text: t('common.saved') }); refreshPublic(dispatch, 'bottles'); void reload(true); }}
          onError={(text) => setNotice({ tone: 'error', text })}
        />
      ) : null}
    </section>
  );
}
