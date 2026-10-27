import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useUploads, type UploadPurpose } from '../../../hooks/use-service';
import { getErrorMessage } from '../../../utils/errors';

const TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];

type Props = {
  purpose: UploadPurpose;
  url: string;
  onUrl: (url: string) => void;
  onError: (message: string) => void;
};

export default function ImageField({ purpose, url, onUrl, onError }: Props) {
  const { t } = useTranslation('admin');
  const uploads = useUploads();
  const [progress, setProgress] = useState<number | null>(null);

  async function onFile(file: File | undefined) {
    if (!file) return;
    if (!TYPES.includes(file.type)) {
      onError(t('image.choose'));
      return;
    }
    setProgress(0);
    try {
      const next = await uploads.upload(file, purpose, setProgress);
      onUrl(next);
    } catch (error) {
      onError(getErrorMessage(error));
    } finally {
      setProgress(null);
    }
  }

  return (
    <div className="admin-field">
      <span>{t('image.choose')}</span>
      <input
        type="file"
        accept={TYPES.join(',')}
        onChange={(event) => { void onFile(event.target.files?.[0]); }}
      />
      {progress !== null ? <p className="t-mono">{t('image.uploading')} {Math.round(progress * 100)}%</p> : null}
      {url ? (
        <>
          <img className="admin-preview" src={url} alt="" />
          <button type="button" className="admin-btn admin-btn--ghost" onClick={() => onUrl('')}>{t('image.clear')}</button>
        </>
      ) : null}
    </div>
  );
}
