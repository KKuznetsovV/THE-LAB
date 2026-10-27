import { FLAVOURS, MENU_SECTIONS, type CocktailDto, type Flavour, type MenuSection } from '@thelab/lib';
import { useCallback, useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import FlavourIcon from '../../common/flavour-icon/FlavourIcon';
import InlineToast from '../../common/inline-toast/InlineToast';
import { useCocktailsAdmin } from '../../../hooks/use-service';
import { useAppDispatch } from '../../../redux/hooks';
import { getErrorMessage } from '../../../utils/errors';
import { useFormDirty } from '../shell/dirty-context';
import ImageField from '../fields/ImageField';
import { refreshPublic } from '../refresh';
import { deletedOnly, moveBy, parsePrice } from '../rows';
import type { CocktailWrite } from '../../../services/auth-aware/CocktailsAdminService';

type Notice = { tone: 'success' | 'error'; text: string };
type Draft = CocktailDto | 'new';
type Values = {
  code: string;
  indexLabel: string;
  section: MenuSection;
  nameHe: string;
  nameEn: string;
  ingredientsHe: string;
  ingredientsEn: string;
  descriptionHe: string;
  descriptionEn: string;
  price: string;
  flavours: Flavour[];
  isSignature: boolean;
  isAvailable: boolean;
  isPublished: boolean;
  imageUrl: string;
  imageAltHe: string;
  imageAltEn: string;
};

function blank(): Values {
  return {
    code: '',
    indexLabel: '',
    section: 'liquid-records',
    nameHe: '',
    nameEn: '',
    ingredientsHe: '',
    ingredientsEn: '',
    descriptionHe: '',
    descriptionEn: '',
    price: '',
    flavours: [],
    isSignature: false,
    isAvailable: true,
    isPublished: false,
    imageUrl: '',
    imageAltHe: '',
    imageAltEn: '',
  };
}

function fromRow(row: CocktailDto): Values {
  return {
    code: row.code,
    indexLabel: row.indexLabel,
    section: row.section,
    nameHe: row.nameHe,
    nameEn: row.nameEn,
    ingredientsHe: row.ingredientsHe,
    ingredientsEn: row.ingredientsEn,
    descriptionHe: row.descriptionHe ?? '',
    descriptionEn: row.descriptionEn ?? '',
    price: row.price === null ? '' : String(row.price),
    flavours: row.flavours,
    isSignature: row.isSignature,
    isAvailable: row.isAvailable,
    isPublished: row.isPublished,
    imageUrl: row.imageUrl ?? '',
    imageAltHe: row.imageAltHe ?? '',
    imageAltEn: row.imageAltEn ?? '',
  };
}

function toWrite(values: Values): CocktailWrite | null {
  if (!/^[A-Z0-9-]{1,6}$/.test(values.code)) return null;
  if (!values.nameHe.trim() || !values.nameEn.trim()) return null;
  const price = parsePrice(values.price);
  if (price !== null && Number.isNaN(price)) return null;
  return {
    code: values.code,
    indexLabel: values.indexLabel,
    section: values.section,
    nameHe: values.nameHe,
    nameEn: values.nameEn,
    ingredientsHe: values.ingredientsHe,
    ingredientsEn: values.ingredientsEn,
    descriptionHe: values.descriptionHe.trim() ? values.descriptionHe : null,
    descriptionEn: values.descriptionEn.trim() ? values.descriptionEn : null,
    price,
    flavours: values.flavours,
    isSignature: values.isSignature,
    isAvailable: values.isAvailable,
    isPublished: values.isPublished,
    imageUrl: values.imageUrl.trim() ? values.imageUrl : null,
    imageAltHe: values.imageAltHe.trim() ? values.imageAltHe : null,
    imageAltEn: values.imageAltEn.trim() ? values.imageAltEn : null,
  };
}

function CocktailForm({
  draft,
  onClose,
  onSaved,
  onError,
}: {
  draft: Draft;
  onClose: () => void;
  onSaved: () => void;
  onError: (message: string) => void;
}) {
  const { t, i18n } = useTranslation('admin');
  const service = useCocktailsAdmin();
  const { setDirty } = useFormDirty();
  const locale = i18n.language === 'en' ? 'en' : 'he';
  const form = useForm<Values>({ defaultValues: draft === 'new' ? blank() : fromRow(draft) });
  const { register, handleSubmit, control, setValue, formState } = form;
  setDirty(formState.isDirty);
  useEffect(() => () => setDirty(false), [setDirty]);
  const flavours = useWatch({ control, name: 'flavours' });
  const imageUrl = useWatch({ control, name: 'imageUrl' });

  async function onSubmit(values: Values) {
    const body = toWrite(values);
    if (!body) {
      onError(t('common.required'));
      return;
    }
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
    <form className="admin-form" onSubmit={(event) => { void handleSubmit(onSubmit)(event); }} noValidate>
      <h2>{draft === 'new' ? t('cocktails.fresh') : draft.code}</h2>
      <div className="admin-grid admin-grid--2">
        <label className="admin-field">{t('cocktails.code')}<input dir="ltr" {...register('code')} /></label>
        <label className="admin-field">{t('cocktails.index')}<input dir="ltr" {...register('indexLabel')} /></label>
        <label className="admin-field">
          {t('cocktails.section')}
          <select {...register('section')}>
            {MENU_SECTIONS.map((section) => <option key={section} value={section}>{t(`sections.${section}`)}</option>)}
          </select>
        </label>
        <label className="admin-field">{t('cocktails.price')}<input dir="ltr" inputMode="numeric" {...register('price')} /></label>
        <label className="admin-field">{t('cocktails.nameHe')}<input dir="rtl" {...register('nameHe')} /></label>
        <label className="admin-field">{t('cocktails.nameEn')}<input dir="ltr" {...register('nameEn')} /></label>
        <label className="admin-field">{t('cocktails.ingredientsHe')}<textarea dir="rtl" {...register('ingredientsHe')} /></label>
        <label className="admin-field">{t('cocktails.ingredientsEn')}<textarea dir="ltr" {...register('ingredientsEn')} /></label>
        <label className="admin-field">{t('cocktails.descriptionHe')}<textarea dir="rtl" {...register('descriptionHe')} /></label>
        <label className="admin-field">{t('cocktails.descriptionEn')}<textarea dir="ltr" {...register('descriptionEn')} /></label>
        <label className="admin-field">{t('cocktails.altHe')}<input dir="rtl" {...register('imageAltHe')} /></label>
        <label className="admin-field">{t('cocktails.altEn')}<input dir="ltr" {...register('imageAltEn')} /></label>
      </div>
      <fieldset className="admin-flavours">
        <legend>{t('cocktails.flavours')}</legend>
        {FLAVOURS.map((flavour) => (
          <label key={flavour}>
            <input
              type="checkbox"
              checked={flavours.includes(flavour)}
              onChange={() => {
                const next = flavours.includes(flavour)
                  ? flavours.filter((item) => item !== flavour)
                  : [...flavours, flavour];
                setValue('flavours', next, { shouldDirty: true });
              }}
            />
            <FlavourIcon flavour={flavour} locale={locale} labelled />
          </label>
        ))}
      </fieldset>
      <label className="admin-check"><input type="checkbox" {...register('isSignature')} />{t('cocktails.signature')}</label>
      <label className="admin-check"><input type="checkbox" {...register('isAvailable')} />{t('common.available')}</label>
      <label className="admin-check"><input type="checkbox" {...register('isPublished')} />{t('common.published')}</label>
      <ImageField purpose="cocktail" url={imageUrl} onUrl={(url) => setValue('imageUrl', url, { shouldDirty: true })} onError={onError} />
      <div className="admin-row">
        <button type="submit" className="admin-btn">{t('common.save')}</button>
        <button type="button" className="admin-btn admin-btn--ghost" onClick={onClose}>{t('common.cancel')}</button>
      </div>
    </form>
  );
}

export default function CocktailsAdmin() {
  const { t } = useTranslation('admin');
  const service = useCocktailsAdmin();
  const dispatch = useAppDispatch();
  const { requestLeave } = useFormDirty();
  const [rows, setRows] = useState<CocktailDto[]>([]);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [trash, setTrash] = useState(false);
  const [section, setSection] = useState<MenuSection | 'all'>('all');
  const [query, setQuery] = useState('');
  const [notice, setNotice] = useState<Notice | null>(null);
  const [draft, setDraft] = useState<Draft | null>(null);

  const readRows = useCallback(async () => (
    trash ? deletedOnly(await service.list(false), await service.list(true)) : service.list(false)
  ), [service, trash]);

  const reload = useCallback(async (quiet = false) => {
    if (!quiet) setStatus('loading');
    try {
      setRows(await readRows());
      setStatus('ready');
    } catch (error) {
      setNotice({ tone: 'error', text: getErrorMessage(error) });
      setStatus('error');
    }
  }, [readRows]);

  useEffect(() => {
    let active = true;
    void readRows().then((next) => {
      if (!active) return;
      setRows(next);
      setStatus('ready');
    }).catch((error: unknown) => {
      if (!active) return;
      setNotice({ tone: 'error', text: getErrorMessage(error) });
      setStatus('error');
    });
    return () => { active = false; };
  }, [readRows]);

  const shown = rows.filter((row) => {
    if (section !== 'all' && row.section !== section) return false;
    const needle = query.trim().toLowerCase();
    if (!needle) return true;
    return row.code.toLowerCase().includes(needle) || row.nameEn.toLowerCase().includes(needle) || row.nameHe.toLowerCase().includes(needle);
  });

  async function patchRow(row: CocktailDto, next: CocktailDto) {
    setRows((current) => current.map((item) => (item.id === row.id ? next : item)));
    refreshPublic(dispatch, 'menu');
  }

  async function onPublish(row: CocktailDto) {
    try {
      await patchRow(row, await service.update(row.id, { isPublished: !row.isPublished }));
    } catch (error) {
      setNotice({ tone: 'error', text: getErrorMessage(error) });
    }
  }

  async function onAvailable(row: CocktailDto) {
    try {
      await patchRow(row, await service.availability(row.id, !row.isAvailable));
    } catch (error) {
      setNotice({ tone: 'error', text: getErrorMessage(error) });
    }
  }

  async function onMove(row: CocktailDto, direction: -1 | 1) {
    if (section === 'all' || query.trim() || trash) return;
    const group = rows.filter((item) => item.section === section);
    const next = moveBy(group, row.id, direction);
    if (!next) return;
    try {
      await service.reorder(section, next.map((item) => item.id));
      refreshPublic(dispatch, 'menu');
      await reload(true);
    } catch (error) {
      setNotice({ tone: 'error', text: getErrorMessage(error) });
    }
  }

  async function onDelete(row: CocktailDto) {
    try {
      await service.remove(row.id);
      refreshPublic(dispatch, 'menu');
      await reload(true);
    } catch (error) {
      setNotice({ tone: 'error', text: getErrorMessage(error) });
    }
  }

  async function onRestore(row: CocktailDto) {
    try {
      await service.restore(row.id);
      refreshPublic(dispatch, 'menu');
      await reload(true);
    } catch (error) {
      setNotice({ tone: 'error', text: getErrorMessage(error) });
    }
  }

  return (
    <section>
      <h1>{t('cocktails.title')}</h1>
      {notice ? <InlineToast tone={notice.tone} onDismiss={() => setNotice(null)} dismissLabel={t('common.close')}>{notice.text}</InlineToast> : null}
      <div className="admin-row">
        <button type="button" className="admin-btn" onClick={() => requestLeave(() => setDraft('new'))}>{t('common.create')}</button>
        <button type="button" className="admin-btn admin-btn--ghost" aria-pressed={trash} onClick={() => { setTrash((value) => !value); setDraft(null); }}>{t('common.trash')}</button>
        <label className="admin-field admin-search">{t('common.search')}<input value={query} onChange={(event) => setQuery(event.target.value)} /></label>
      </div>
      <div className="admin-row" role="group" aria-label={t('cocktails.section')}>
        <button type="button" className="admin-btn admin-btn--ghost" aria-pressed={section === 'all'} onClick={() => setSection('all')}>{t('cocktails.all')}</button>
        {MENU_SECTIONS.map((item) => (
          <button key={item} type="button" className="admin-btn admin-btn--ghost" aria-pressed={section === item} onClick={() => setSection(item)}>{t(`sections.${item}`)}</button>
        ))}
      </div>
      {status === 'loading' ? <p>{t('common.loading')}</p> : null}
      {status === 'error' ? <button type="button" className="admin-btn" onClick={() => { void reload(); }}>{t('common.retry')}</button> : null}
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>{t('cocktails.code')}</th>
              <th>{t('cocktails.nameEn')}</th>
              <th>{t('cocktails.price')}</th>
              <th>{t('common.available')}</th>
              <th>{t('common.published')}</th>
              <th>{t('common.edit')}</th>
            </tr>
          </thead>
          <tbody>
            {shown.map((row) => (
              <tr key={row.id}>
                <td dir="ltr">{row.code}</td>
                <td dir="ltr">{row.nameEn}</td>
                <td dir="ltr">{row.price ?? ''}</td>
                <td>
                  <input type="checkbox" checked={row.isAvailable} disabled={trash} aria-label={t('common.available')} onChange={() => { void onAvailable(row); }} />
                </td>
                <td>
                  <input type="checkbox" checked={row.isPublished} disabled={trash} aria-label={t('common.published')} onChange={() => { void onPublish(row); }} />
                </td>
                <td className="admin-row">
                  {trash ? <button type="button" className="admin-btn admin-btn--ghost" onClick={() => { void onRestore(row); }}>{t('common.restore')}</button> : (
                    <>
                      <button type="button" className="admin-btn admin-btn--ghost" onClick={() => requestLeave(() => setDraft(row))}>{t('common.edit')}</button>
                      <button type="button" className="admin-btn admin-btn--ghost" disabled={section === 'all' || query.trim().length > 0} aria-label={t('common.up')} onClick={() => { void onMove(row, -1); }}>{t('common.up')}</button>
                      <button type="button" className="admin-btn admin-btn--ghost" disabled={section === 'all' || query.trim().length > 0} aria-label={t('common.down')} onClick={() => { void onMove(row, 1); }}>{t('common.down')}</button>
                      <button type="button" className="admin-btn admin-btn--ghost" onClick={() => { void onDelete(row); }}>{t('common.delete')}</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {draft ? (
        <CocktailForm
          key={draft === 'new' ? 'new' : draft.id}
          draft={draft}
          onClose={() => requestLeave(() => setDraft(null))}
          onSaved={() => { setDraft(null); setNotice({ tone: 'success', text: t('common.saved') }); refreshPublic(dispatch, 'menu'); void reload(true); }}
          onError={(text) => setNotice({ tone: 'error', text })}
        />
      ) : null}
    </section>
  );
}
