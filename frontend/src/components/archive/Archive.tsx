import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { useTranslation } from 'react-i18next';
import RetroWindow from '../common/retro-window/RetroWindow';
import TerminalLoader from '../common/terminal-loader/TerminalLoader';
import PageMeta from '../seo/PageMeta';
import { useLocalized } from '../../hooks/use-localized';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { loadGallery, selectGallery } from '../../redux/collections';
import './Archive.css';

export default function Archive() {
  const { t } = useTranslation();
  const { text, locale } = useLocalized();
  const dispatch = useAppDispatch();
  const gallery = useAppSelector(selectGallery);
  const [index, setIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const open = index !== null ? gallery.items[index] : undefined;

  useEffect(() => {
    void dispatch(loadGallery());
  }, [dispatch]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  function close(): void {
    setIndex(null);
  }

  function step(direction: -1 | 1): void {
    setIndex((current) => {
      if (current === null || gallery.items.length === 0) return current;
      const next = (current + direction + gallery.items.length) % gallery.items.length;
      return next;
    });
  }

  function onKey(event: KeyboardEvent<HTMLDialogElement>): void {
    if (event.key === 'Escape') {
      event.preventDefault();
      close();
      return;
    }
    const forward = locale === 'he' ? 'ArrowLeft' : 'ArrowRight';
    const back = locale === 'he' ? 'ArrowRight' : 'ArrowLeft';
    if (event.key === forward) step(1);
    if (event.key === back) step(-1);
  }

  return (
    <div className="archive">
      <PageMeta title={`${t('archive.title')} · THE LAB`} description={t('seo.archive')} path="/archive" />
      <h1>{t('archive.heading')}</h1>
      {gallery.status === 'idle' || gallery.status === 'loading' ? (
        <div className="archive-loading"><TerminalLoader /></div>
      ) : null}
      {gallery.status === 'error' ? (
        <p>
          {t('archive.loadError')}
          <button type="button" onClick={() => { void dispatch(loadGallery({ force: true })); }}>{t('archive.retry')}</button>
        </p>
      ) : null}
      {gallery.status === 'ready' && gallery.items.length === 0 ? <p>{t('archive.empty')}</p> : null}
      <ul className="archive-grid">
        {gallery.items.map((image, imageIndex) => (
          <li key={image.id}>
            <button type="button" aria-label={text(image.altHe, image.altEn)} onClick={() => setIndex(imageIndex)}>
              <img src={image.url} alt="" width={600} height={800} loading="lazy" decoding="async" />
            </button>
            {image.credit ? <p>{t('archive.credit')}: {image.credit}</p> : null}
          </li>
        ))}
      </ul>
      <dialog
        ref={dialogRef}
        className="archive-lightbox"
        onCancel={(event) => {
          event.preventDefault();
          close();
        }}
        onKeyDown={onKey}
      >
        {open ? (
          <RetroWindow url="https://thelabtlv.com/archive">
            <div className="archive-lightbox-bar">
              <button type="button" className="t-mono" onClick={() => step(-1)}>{t('archive.previous')}</button>
              <button type="button" className="t-mono" onClick={close}>{t('archive.close')}</button>
              <button type="button" className="t-mono" onClick={() => step(1)}>{t('archive.next')}</button>
            </div>
            <img src={open.url} alt={text(open.altHe, open.altEn)} width={1200} height={1600} />
            {open.credit ? <p>{t('archive.credit')}: {open.credit}</p> : null}
          </RetroWindow>
        ) : null}
      </dialog>
    </div>
  );
}
