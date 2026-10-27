import type { SiteSettingsDto } from '@thelab/lib';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import InlineToast from '../../common/inline-toast/InlineToast';
import { useSettingsAdmin } from '../../../hooks/use-service';
import { useAppDispatch } from '../../../redux/hooks';
import { getErrorMessage } from '../../../utils/errors';
import { refreshPublic } from '../refresh';
import { optionalHttps } from '../rows';
import { useFormDirty } from '../shell/dirty-context';

type Notice = { tone: 'success' | 'error'; text: string };

type Values = {
  reservationUrl: string;
  reservationUrlAlt: string;
  deliveryUrl: string;
  woltUrl: string;
  privateEventsUrl: string;
  giftCardUrl: string;
  instagramUrl: string;
  mapsUrl: string;
  phone: string;
  email: string;
  addressHe: string;
  addressEn: string;
  alcoholWarningHe: string;
  alcoholWarningEn: string;
  accessibilityCoordinatorName: string;
  accessibilityCoordinatorPhone: string;
  accessibilityCoordinatorEmail: string;
  lastAccessibilityAudit: string;
};

const URL_KEYS = ['reservationUrl', 'reservationUrlAlt', 'deliveryUrl', 'woltUrl', 'privateEventsUrl', 'giftCardUrl', 'instagramUrl', 'mapsUrl'] as const;

function fromSettings(row: SiteSettingsDto): Values {
  return {
    reservationUrl: row.reservationUrl,
    reservationUrlAlt: row.reservationUrlAlt,
    deliveryUrl: row.deliveryUrl,
    woltUrl: row.woltUrl,
    privateEventsUrl: row.privateEventsUrl,
    giftCardUrl: row.giftCardUrl,
    instagramUrl: row.instagramUrl,
    mapsUrl: row.mapsUrl,
    phone: row.phone,
    email: row.email,
    addressHe: row.addressHe,
    addressEn: row.addressEn,
    alcoholWarningHe: row.alcoholWarningHe,
    alcoholWarningEn: row.alcoholWarningEn,
    accessibilityCoordinatorName: row.accessibilityCoordinatorName,
    accessibilityCoordinatorPhone: row.accessibilityCoordinatorPhone,
    accessibilityCoordinatorEmail: row.accessibilityCoordinatorEmail,
    lastAccessibilityAudit: row.lastAccessibilityAudit ? row.lastAccessibilityAudit.slice(0, 10) : '',
  };
}

const LABELS: Record<keyof Values, string> = {
  reservationUrl: 'settings.reservation',
  reservationUrlAlt: 'settings.reservationAlt',
  deliveryUrl: 'settings.delivery',
  woltUrl: 'settings.wolt',
  privateEventsUrl: 'settings.privateEvents',
  giftCardUrl: 'settings.giftCard',
  instagramUrl: 'settings.instagram',
  mapsUrl: 'settings.maps',
  phone: 'settings.phone',
  email: 'settings.email',
  addressHe: 'settings.addressHe',
  addressEn: 'settings.addressEn',
  alcoholWarningHe: 'settings.warningHe',
  alcoholWarningEn: 'settings.warningEn',
  accessibilityCoordinatorName: 'settings.coordinator',
  accessibilityCoordinatorPhone: 'settings.coordinatorPhone',
  accessibilityCoordinatorEmail: 'settings.coordinatorEmail',
  lastAccessibilityAudit: 'settings.audit',
};

function SettingsForm({ settings, onSaved, onError }: {
  settings: SiteSettingsDto;
  onSaved: () => void;
  onError: (message: string) => void;
}) {
  const { t } = useTranslation('admin');
  const service = useSettingsAdmin();
  const { setDirty } = useFormDirty();
  const form = useForm<Values>({ defaultValues: fromSettings(settings) });
  setDirty(form.formState.isDirty);
  useEffect(() => () => setDirty(false), [setDirty]);

  async function onSubmit(values: Values) {
    if (URL_KEYS.some((key) => !optionalHttps(values[key]))) {
      onError(t('common.https'));
      return;
    }
    try {
      await service.update({
        ...values,
        lastAccessibilityAudit: values.lastAccessibilityAudit.trim() ? values.lastAccessibilityAudit : null,
      });
      setDirty(false);
      onSaved();
    } catch (error) {
      onError(getErrorMessage(error));
    }
  }

  return (
    <form className="admin-form" noValidate onSubmit={(event) => { void form.handleSubmit(onSubmit)(event); }}>
      <div className="admin-grid admin-grid--2">
        {(Object.keys(LABELS) as (keyof Values)[]).map((key) => (
          <label className="admin-field" key={key}>
            {t(LABELS[key])}
            <input
              dir={key === 'addressHe' || key === 'alcoholWarningHe' ? 'rtl' : 'ltr'}
              type={key === 'lastAccessibilityAudit' ? 'date' : 'text'}
              {...form.register(key)}
            />
          </label>
        ))}
      </div>
      <button type="submit" className="admin-btn">{t('common.save')}</button>
    </form>
  );
}

export default function SettingsAdmin() {
  const { t } = useTranslation('admin');
  const service = useSettingsAdmin();
  const dispatch = useAppDispatch();
  const [settings, setSettings] = useState<SiteSettingsDto | null>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [notice, setNotice] = useState<Notice | null>(null);

  const readRows = useCallback(() => service.get(), [service]);

  const reload = useCallback(async () => {
    setStatus('loading');
    try {
      setSettings(await readRows());
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
      setSettings(next);
      setStatus('ready');
    }).catch((error: unknown) => {
      if (!active) return;
      setNotice({ tone: 'error', text: getErrorMessage(error) });
      setStatus('error');
    });
    return () => { active = false; };
  }, [readRows]);

  return (
    <section>
      <h1>{t('settings.title')}</h1>
      {notice ? <InlineToast tone={notice.tone} onDismiss={() => setNotice(null)} dismissLabel={t('common.close')}>{notice.text}</InlineToast> : null}
      {status === 'loading' ? <p>{t('common.loading')}</p> : null}
      {status === 'error' ? <button type="button" className="admin-btn" onClick={() => { void reload(); }}>{t('common.retry')}</button> : null}
      {status === 'ready' && settings ? (
        <SettingsForm
          key={settings.reservationUrl}
          settings={settings}
          onSaved={() => { setNotice({ tone: 'success', text: t('common.saved') }); refreshPublic(dispatch, 'site'); void reload(); }}
          onError={(text) => setNotice({ tone: 'error', text })}
        />
      ) : null}
    </section>
  );
}
