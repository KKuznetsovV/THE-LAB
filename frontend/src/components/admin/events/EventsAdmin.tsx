import type { EventDto } from '@thelab/lib';
import { useCallback, useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import InlineToast from '../../common/inline-toast/InlineToast';
import { useEventsAdmin } from '../../../hooks/use-service';
import { useAppDispatch } from '../../../redux/hooks';
import type { EventWrite } from '../../../services/auth-aware/EventsAdminService';
import { getErrorMessage } from '../../../utils/errors';
import ImageField from '../fields/ImageField';
import { refreshPublic } from '../refresh';
import { deletedOnly, moveBy, optionalHttps } from '../rows';
import { useFormDirty } from '../shell/dirty-context';
import { fromJerusalemInput, toJerusalemInput } from '../time';

type Notice = { tone: 'success' | 'error'; text: string };
type Draft = EventDto | 'new';
type Values = {
  slug: string;
  titleHe: string;
  titleEn: string;
  bodyHe: string;
  bodyEn: string;
  startsAt: string;
  endsAt: string;
  linkUrl: string;
  isPublished: boolean;
  imageUrl: string;
  imageAltHe: string;
  imageAltEn: string;
};

function fromRow(row: EventDto | null): Values {
  if (!row) {
    return { slug: '', titleHe: '', titleEn: '', bodyHe: '', bodyEn: '', startsAt: '', endsAt: '', linkUrl: '', isPublished: false, imageUrl: '', imageAltHe: '', imageAltEn: '' };
  }
  return {
    slug: row.slug,
    titleHe: row.titleHe,
    titleEn: row.titleEn,
    bodyHe: row.bodyHe,
    bodyEn: row.bodyEn,
    startsAt: toJerusalemInput(row.startsAt),
    endsAt: row.endsAt ? toJerusalemInput(row.endsAt) : '',
    linkUrl: row.linkUrl ?? '',
    isPublished: row.isPublished,
    imageUrl: row.imageUrl ?? '',
    imageAltHe: row.imageAltHe ?? '',
    imageAltEn: row.imageAltEn ?? '',
  };
}

function EventForm({ draft, onClose, onSaved, onError }: {
  draft: Draft;
  onClose: () => void;
  onSaved: () => void;
  onError: (message: string) => void;
}) {
  const { t } = useTranslation('admin');
  const service = useEventsAdmin();
  const { setDirty } = useFormDirty();
  const form = useForm<Values>({ defaultValues: fromRow(draft === 'new' ? null : draft) });
  const { register, handleSubmit, control, setValue, formState } = form;
  const imageUrl = useWatch({ control, name: 'imageUrl' });
  setDirty(formState.isDirty);
  useEffect(() => () => setDirty(false), [setDirty]);

  async function onSubmit(values: Values) {
    if (!values.titleHe.trim() || !values.titleEn.trim() || !values.startsAt) {
      onError(t('common.required'));
      return;
    }
    if (!optionalHttps(values.linkUrl)) {
      onError(t('common.https'));
      return;
    }
    const body: EventWrite = {
      titleHe: values.titleHe,
      titleEn: values.titleEn,
      bodyHe: values.bodyHe,
      bodyEn: values.bodyEn,
      startsAt: fromJerusalemInput(values.startsAt),
      endsAt: values.endsAt ? fromJerusalemInput(values.endsAt) : null,
      linkUrl: values.linkUrl.trim() ? values.linkUrl.trim() : null,
      isPublished: values.isPublished,
      imageUrl: values.imageUrl.trim() ? values.imageUrl : null,
      imageAltHe: values.imageAltHe.trim() ? values.imageAltHe : null,
      imageAltEn: values.imageAltEn.trim() ? values.imageAltEn : null,
    };
    if (values.slug.trim()) body.slug = values.slug.trim();
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
      <h2>{draft === 'new' ? t('events.fresh') : draft.titleEn}</h2>
      <p>{t('events.zone')}</p>
      <div className="admin-grid admin-grid--2">
        <label className="admin-field">{t('events.slug')}<input dir="ltr" {...register('slug')} /></label>
        <label className="admin-field">{t('events.starts')}<input dir="ltr" type="datetime-local" {...register('startsAt')} /></label>
        <label className="admin-field">{t('events.ends')}<input dir="ltr" type="datetime-local" {...register('endsAt')} /></label>
        <label className="admin-field">{t('events.link')}<input dir="ltr" {...register('linkUrl')} /></label>
        <label className="admin-field">{t('events.titleHe')}<input dir="rtl" {...register('titleHe')} /></label>
        <label className="admin-field">{t('events.titleEn')}<input dir="ltr" {...register('titleEn')} /></label>
        <label className="admin-field">{t('events.bodyHe')}<textarea dir="rtl" {...register('bodyHe')} /></label>
        <label className="admin-field">{t('events.bodyEn')}<textarea dir="ltr" {...register('bodyEn')} /></label>
        <label className="admin-field">{t('events.altHe')}<input dir="rtl" {...register('imageAltHe')} /></label>
        <label className="admin-field">{t('events.altEn')}<input dir="ltr" {...register('imageAltEn')} /></label>
      </div>
      <label className="admin-check"><input type="checkbox" {...register('isPublished')} />{t('common.published')}</label>
      <ImageField purpose="event" url={imageUrl} onUrl={(url) => setValue('imageUrl', url, { shouldDirty: true })} onError={onError} />
      <div className="admin-row">
        <button type="submit" className="admin-btn">{t('common.save')}</button>
        <button type="button" className="admin-btn admin-btn--ghost" onClick={onClose}>{t('common.cancel')}</button>
      </div>
    </form>
  );
}

export default function EventsAdmin() {
  const { t } = useTranslation('admin');
  const service = useEventsAdmin();
  const dispatch = useAppDispatch();
  const { requestLeave } = useFormDirty();
  const [rows, setRows] = useState<EventDto[]>([]);
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

  async function onMove(row: EventDto, direction: -1 | 1) {
    if (trash) return;
    const next = moveBy(rows, row.id, direction);
    if (!next) return;
    try {
      await service.reorder(next.map((item) => item.id));
      refreshPublic(dispatch, 'events');
      await reload(true);
    } catch (error) {
      setNotice({ tone: 'error', text: getErrorMessage(error) });
    }
  }

  return (
    <section>
      <h1>{t('events.title')}</h1>
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
              <th>{t('events.titleEn')}</th>
              <th>{t('events.starts')}</th>
              <th>{t('common.published')}</th>
              <th>{t('common.edit')}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td dir="ltr">{row.titleEn}</td>
                <td dir="ltr">{toJerusalemInput(row.startsAt).replace('T', ' ')}</td>
                <td>
                  <input
                    type="checkbox"
                    checked={row.isPublished}
                    disabled={trash}
                    aria-label={t('common.published')}
                    onChange={() => {
                      void service.update(row.id, { isPublished: !row.isPublished }).then((next) => {
                        setRows((current) => current.map((item) => (item.id === row.id ? next : item)));
                        refreshPublic(dispatch, 'events');
                      }).catch((error: unknown) => setNotice({ tone: 'error', text: getErrorMessage(error) }));
                    }}
                  />
                </td>
                <td className="admin-row">
                  {trash ? <button type="button" className="admin-btn admin-btn--ghost" onClick={() => { void service.restore(row.id).then(() => reload(true)).catch((error: unknown) => setNotice({ tone: 'error', text: getErrorMessage(error) })); }}>{t('common.restore')}</button> : (
                    <>
                      <button type="button" className="admin-btn admin-btn--ghost" onClick={() => requestLeave(() => setDraft(row))}>{t('common.edit')}</button>
                      <button type="button" className="admin-btn admin-btn--ghost" aria-label={t('common.up')} onClick={() => { void onMove(row, -1); }}>{t('common.up')}</button>
                      <button type="button" className="admin-btn admin-btn--ghost" aria-label={t('common.down')} onClick={() => { void onMove(row, 1); }}>{t('common.down')}</button>
                      <button type="button" className="admin-btn admin-btn--ghost" onClick={() => { void service.remove(row.id).then(() => { refreshPublic(dispatch, 'events'); return reload(true); }).catch((error: unknown) => setNotice({ tone: 'error', text: getErrorMessage(error) })); }}>{t('common.delete')}</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {draft ? (
        <EventForm
          key={draft === 'new' ? 'new' : draft.id}
          draft={draft}
          onClose={() => requestLeave(() => setDraft(null))}
          onSaved={() => { setDraft(null); setNotice({ tone: 'success', text: t('common.saved') }); refreshPublic(dispatch, 'events'); void reload(true); }}
          onError={(text) => setNotice({ tone: 'error', text })}
        />
      ) : null}
    </section>
  );
}
