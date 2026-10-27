import { SPIRIT_CATEGORIES, type SpiritCategory, type SpiritDto } from '@thelab/lib';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import InlineToast from '../../common/inline-toast/InlineToast';
import { useSpiritsAdmin } from '../../../hooks/use-service';
import { useAppDispatch } from '../../../redux/hooks';
import type { SpiritWrite } from '../../../services/auth-aware/SpiritsAdminService';
import { getErrorMessage } from '../../../utils/errors';
import { refreshPublic } from '../refresh';
import { deletedOnly, moveBy, parsePrice } from '../rows';
import { useFormDirty } from '../shell/dirty-context';

type Notice = { tone: 'success' | 'error'; text: string };
type Draft = SpiritDto | 'new';
type Values = { category: SpiritCategory; name: string; priceGlass: string; priceBottle: string; isPublished: boolean };

function fromRow(row: SpiritDto | null): Values {
  if (!row) return { category: 'vodka', name: '', priceGlass: '', priceBottle: '', isPublished: false };
  return {
    category: row.category,
    name: row.name,
    priceGlass: row.priceGlass === null ? '' : String(row.priceGlass),
    priceBottle: row.priceBottle === null ? '' : String(row.priceBottle),
    isPublished: row.isPublished,
  };
}

function SpiritForm({ draft, onClose, onSaved, onError }: {
  draft: Draft;
  onClose: () => void;
  onSaved: () => void;
  onError: (message: string) => void;
}) {
  const { t } = useTranslation('admin');
  const service = useSpiritsAdmin();
  const { setDirty } = useFormDirty();
  const form = useForm<Values>({ defaultValues: fromRow(draft === 'new' ? null : draft) });
  setDirty(form.formState.isDirty);
  useEffect(() => () => setDirty(false), [setDirty]);

  async function onSubmit(values: Values) {
    const priceGlass = parsePrice(values.priceGlass);
    const priceBottle = parsePrice(values.priceBottle);
    if (!values.name.trim() || Number.isNaN(priceGlass) || Number.isNaN(priceBottle)) {
      onError(t('common.price'));
      return;
    }
    const body: SpiritWrite = {
      category: values.category,
      name: values.name.trim(),
      priceGlass,
      priceBottle,
      isPublished: values.isPublished,
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
    <form className="admin-form" noValidate onSubmit={(event) => { void form.handleSubmit(onSubmit)(event); }}>
      <h2>{draft === 'new' ? t('spirits.fresh') : draft.name}</h2>
      <div className="admin-grid admin-grid--2">
        <label className="admin-field">
          {t('spirits.category')}
          <select {...form.register('category')}>
            {SPIRIT_CATEGORIES.map((category) => <option key={category} value={category}>{t(`cat.${category}`)}</option>)}
          </select>
        </label>
        <label className="admin-field">{t('spirits.name')}<input dir="ltr" {...form.register('name')} /></label>
        <label className="admin-field">{t('spirits.glass')}<input dir="ltr" inputMode="numeric" {...form.register('priceGlass')} /></label>
        <label className="admin-field">{t('spirits.bottle')}<input dir="ltr" inputMode="numeric" {...form.register('priceBottle')} /></label>
      </div>
      <label className="admin-check"><input type="checkbox" {...form.register('isPublished')} />{t('common.published')}</label>
      <div className="admin-row">
        <button type="submit" className="admin-btn">{t('common.save')}</button>
        <button type="button" className="admin-btn admin-btn--ghost" onClick={onClose}>{t('common.cancel')}</button>
      </div>
    </form>
  );
}

export default function SpiritsAdmin() {
  const { t } = useTranslation('admin');
  const service = useSpiritsAdmin();
  const dispatch = useAppDispatch();
  const { requestLeave } = useFormDirty();
  const [rows, setRows] = useState<SpiritDto[]>([]);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [trash, setTrash] = useState(false);
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

  async function onMove(row: SpiritDto, direction: -1 | 1) {
    if (trash) return;
    const group = rows.filter((item) => item.category === row.category);
    const moved = moveBy(group, row.id, direction);
    if (!moved) return;
    const ids = SPIRIT_CATEGORIES.flatMap((category) => (
      category === row.category ? moved : rows.filter((item) => item.category === category)
    ).map((item) => item.id));
    try {
      await service.reorder(ids);
      refreshPublic(dispatch, 'spirits');
      await reload(true);
    } catch (error) {
      setNotice({ tone: 'error', text: getErrorMessage(error) });
    }
  }

  return (
    <section>
      <h1>{t('spirits.title')}</h1>
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
              <th>{t('spirits.category')}</th>
              <th>{t('spirits.name')}</th>
              <th>{t('spirits.glass')}</th>
              <th>{t('spirits.bottle')}</th>
              <th>{t('common.published')}</th>
              <th>{t('common.edit')}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td>{t(`cat.${row.category}`)}</td>
                <td dir="ltr">{row.name}</td>
                <td dir="ltr">{row.priceGlass ?? ''}</td>
                <td dir="ltr">{row.priceBottle ?? ''}</td>
                <td>
                  <input
                    type="checkbox"
                    checked={row.isPublished}
                    disabled={trash}
                    aria-label={t('common.published')}
                    onChange={() => {
                      void service.update(row.id, { isPublished: !row.isPublished }).then((next) => {
                        setRows((current) => current.map((item) => (item.id === row.id ? next : item)));
                        refreshPublic(dispatch, 'spirits');
                      }).catch((error: unknown) => setNotice({ tone: 'error', text: getErrorMessage(error) }));
                    }}
                  />
                </td>
                <td className="admin-row">
                  {trash ? (
                    <button type="button" className="admin-btn admin-btn--ghost" onClick={() => { void service.restore(row.id).then(() => reload(true)); }}>{t('common.restore')}</button>
                  ) : (
                    <>
                      <button type="button" className="admin-btn admin-btn--ghost" onClick={() => requestLeave(() => setDraft(row))}>{t('common.edit')}</button>
                      <button type="button" className="admin-btn admin-btn--ghost" aria-label={t('common.up')} onClick={() => { void onMove(row, -1); }}>{t('common.up')}</button>
                      <button type="button" className="admin-btn admin-btn--ghost" aria-label={t('common.down')} onClick={() => { void onMove(row, 1); }}>{t('common.down')}</button>
                      <button type="button" className="admin-btn admin-btn--ghost" onClick={() => { void service.remove(row.id).then(() => { refreshPublic(dispatch, 'spirits'); return reload(true); }); }}>{t('common.delete')}</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {draft ? (
        <SpiritForm
          key={draft === 'new' ? 'new' : draft.id}
          draft={draft}
          onClose={() => requestLeave(() => setDraft(null))}
          onSaved={() => { setDraft(null); setNotice({ tone: 'success', text: t('common.saved') }); refreshPublic(dispatch, 'spirits'); void reload(true); }}
          onError={(text) => setNotice({ tone: 'error', text })}
        />
      ) : null}
    </section>
  );
}
