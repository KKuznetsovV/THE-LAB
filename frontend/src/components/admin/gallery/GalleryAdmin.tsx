import type { GalleryImageDto } from '@thelab/lib';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import InlineToast from '../../common/inline-toast/InlineToast';
import { useGalleryAdmin, useUploads } from '../../../hooks/use-service';
import { useAppDispatch } from '../../../redux/hooks';
import { getErrorMessage } from '../../../utils/errors';
import { refreshPublic } from '../refresh';
import { deletedOnly, moveBy } from '../rows';

type Notice = { tone: 'success' | 'error'; text: string };
type Pending = { id: string; file: File; altHe: string; altEn: string; credit: string; progress: number | null };

const TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];

export default function GalleryAdmin() {
  const { t } = useTranslation('admin');
  const service = useGalleryAdmin();
  const uploads = useUploads();
  const dispatch = useAppDispatch();
  const [rows, setRows] = useState<GalleryImageDto[]>([]);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [trash, setTrash] = useState(false);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [queue, setQueue] = useState<Pending[]>([]);

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

  function addFiles(list: FileList | null) {
    if (!list) return;
    const next: Pending[] = [];
    for (const file of list) {
      if (!TYPES.includes(file.type)) continue;
      next.push({ id: crypto.randomUUID(), file, altHe: '', altEn: '', credit: '', progress: null });
    }
    setQueue((current) => [...current, ...next]);
  }

  async function uploadOne(item: Pending) {
    if (!item.altHe.trim() || !item.altEn.trim()) {
      setNotice({ tone: 'error', text: t('gallery.needAlt') });
      return;
    }
    setQueue((current) => current.map((row) => (row.id === item.id ? { ...row, progress: 0 } : row)));
    try {
      const url = await uploads.upload(item.file, 'gallery', (ratio) => {
        setQueue((current) => current.map((row) => (row.id === item.id ? { ...row, progress: ratio } : row)));
      });
      await service.create({
        url,
        altHe: item.altHe.trim(),
        altEn: item.altEn.trim(),
        credit: item.credit.trim() ? item.credit.trim() : null,
        isPublished: false,
      });
      setQueue((current) => current.filter((row) => row.id !== item.id));
      refreshPublic(dispatch, 'gallery');
      await reload(true);
    } catch (error) {
      setNotice({ tone: 'error', text: getErrorMessage(error) });
      setQueue((current) => current.map((row) => (row.id === item.id ? { ...row, progress: null } : row)));
    }
  }

  async function publish(row: GalleryImageDto) {
    if (!row.isPublished && (!row.altHe.trim() || !row.altEn.trim())) {
      setNotice({ tone: 'error', text: t('gallery.needAlt') });
      return;
    }
    try {
      const next = await service.update(row.id, { isPublished: !row.isPublished });
      setRows((current) => current.map((item) => (item.id === row.id ? next : item)));
      refreshPublic(dispatch, 'gallery');
    } catch (error) {
      setNotice({ tone: 'error', text: getErrorMessage(error) });
    }
  }

  async function saveAlt(row: GalleryImageDto, altHe: string, altEn: string, credit: string) {
    try {
      const next = await service.update(row.id, {
        altHe,
        altEn,
        credit: credit.trim() ? credit : null,
      });
      setRows((current) => current.map((item) => (item.id === row.id ? next : item)));
      refreshPublic(dispatch, 'gallery');
      setNotice({ tone: 'success', text: t('common.saved') });
    } catch (error) {
      setNotice({ tone: 'error', text: getErrorMessage(error) });
    }
  }

  async function onMove(row: GalleryImageDto, direction: -1 | 1) {
    if (trash) return;
    const next = moveBy(rows, row.id, direction);
    if (!next) return;
    try {
      await service.reorder(next.map((item) => item.id));
      refreshPublic(dispatch, 'gallery');
      await reload(true);
    } catch (error) {
      setNotice({ tone: 'error', text: getErrorMessage(error) });
    }
  }

  return (
    <section>
      <h1>{t('gallery.title')}</h1>
      {notice ? <InlineToast tone={notice.tone} onDismiss={() => setNotice(null)} dismissLabel={t('common.close')}>{notice.text}</InlineToast> : null}
      <div className="admin-row">
        <label className="admin-btn">
          {t('gallery.add')}
          <input className="visually-hidden" type="file" accept={TYPES.join(',')} multiple onChange={(event) => addFiles(event.target.files)} />
        </label>
        <button type="button" className="admin-btn admin-btn--ghost" aria-pressed={trash} onClick={() => setTrash((value) => !value)}>{t('common.trash')}</button>
      </div>
      {queue.map((item) => (
        <form
          key={item.id}
          className="admin-form"
          onSubmit={(event) => {
            event.preventDefault();
            void uploadOne(item);
          }}
        >
          <p dir="ltr">{item.file.name}</p>
          <div className="admin-grid admin-grid--2">
            <label className="admin-field">{t('gallery.altHe')}<input dir="rtl" value={item.altHe} onChange={(event) => setQueue((current) => current.map((row) => (row.id === item.id ? { ...row, altHe: event.target.value } : row)))} /></label>
            <label className="admin-field">{t('gallery.altEn')}<input dir="ltr" value={item.altEn} onChange={(event) => setQueue((current) => current.map((row) => (row.id === item.id ? { ...row, altEn: event.target.value } : row)))} /></label>
            <label className="admin-field">{t('gallery.credit')}<input value={item.credit} onChange={(event) => setQueue((current) => current.map((row) => (row.id === item.id ? { ...row, credit: event.target.value } : row)))} /></label>
          </div>
          {item.progress !== null ? <p className="t-mono">{t('gallery.progress')} {Math.round(item.progress * 100)}%</p> : null}
          <button type="submit" className="admin-btn">{t('gallery.upload')}</button>
        </form>
      ))}
      {status === 'loading' ? <p>{t('common.loading')}</p> : null}
      {status === 'error' ? <button type="button" className="admin-btn" onClick={() => { void reload(); }}>{t('common.retry')}</button> : null}
      <ul className="admin-gallery">
        {rows.map((row) => (
          <GalleryRow
            key={row.id}
            row={row}
            trash={trash}
            onPublish={() => { void publish(row); }}
            onSave={(altHe, altEn, credit) => { void saveAlt(row, altHe, altEn, credit); }}
            onUp={() => { void onMove(row, -1); }}
            onDown={() => { void onMove(row, 1); }}
            onDelete={() => { void service.remove(row.id).then(() => { refreshPublic(dispatch, 'gallery'); return reload(true); }).catch((error: unknown) => setNotice({ tone: 'error', text: getErrorMessage(error) })); }}
            onRestore={() => { void service.restore(row.id).then(() => reload(true)).catch((error: unknown) => setNotice({ tone: 'error', text: getErrorMessage(error) })); }}
          />
        ))}
      </ul>
    </section>
  );
}

function GalleryRow({
  row,
  trash,
  onPublish,
  onSave,
  onUp,
  onDown,
  onDelete,
  onRestore,
}: {
  row: GalleryImageDto;
  trash: boolean;
  onPublish: () => void;
  onSave: (altHe: string, altEn: string, credit: string) => void;
  onUp: () => void;
  onDown: () => void;
  onDelete: () => void;
  onRestore: () => void;
}) {
  const { t } = useTranslation('admin');
  const [altHe, setAltHe] = useState(row.altHe);
  const [altEn, setAltEn] = useState(row.altEn);
  const [credit, setCredit] = useState(row.credit ?? '');
  return (
    <li className="admin-gallery-item">
      <img src={row.url} alt={altEn || altHe} />
      <label className="admin-field">{t('gallery.altHe')}<input dir="rtl" value={altHe} onChange={(event) => setAltHe(event.target.value)} /></label>
      <label className="admin-field">{t('gallery.altEn')}<input dir="ltr" value={altEn} onChange={(event) => setAltEn(event.target.value)} /></label>
      <label className="admin-field">{t('gallery.credit')}<input value={credit} onChange={(event) => setCredit(event.target.value)} /></label>
      <div className="admin-row">
        <button type="button" className="admin-btn" onClick={() => onSave(altHe, altEn, credit)}>{t('common.save')}</button>
        {trash ? <button type="button" className="admin-btn admin-btn--ghost" onClick={onRestore}>{t('common.restore')}</button> : (
          <>
            <label className="admin-check">
              <input type="checkbox" checked={row.isPublished} aria-label={t('common.published')} onChange={onPublish} />
              {t('common.published')}
            </label>
            <button type="button" className="admin-btn admin-btn--ghost" aria-label={t('common.up')} onClick={onUp}>{t('common.up')}</button>
            <button type="button" className="admin-btn admin-btn--ghost" aria-label={t('common.down')} onClick={onDown}>{t('common.down')}</button>
            <button type="button" className="admin-btn admin-btn--ghost" onClick={onDelete}>{t('common.delete')}</button>
          </>
        )}
      </div>
    </li>
  );
}
