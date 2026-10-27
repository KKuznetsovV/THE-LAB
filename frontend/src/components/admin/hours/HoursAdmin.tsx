import type { OpeningHoursDto, SiteSettingsDto } from '@thelab/lib';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import InlineToast from '../../common/inline-toast/InlineToast';
import { useHoursAdmin, useSettingsAdmin } from '../../../hooks/use-service';
import { useAppDispatch } from '../../../redux/hooks';
import { getErrorMessage } from '../../../utils/errors';
import { refreshPublic } from '../refresh';
import { useFormDirty } from '../shell/dirty-context';

type Notice = { tone: 'success' | 'error'; text: string };
type Values = {
  days: OpeningHoursDto[];
  startsAt: string;
  endsAt: string;
  discountPercent: string;
};

const DAYS = [0, 1, 2, 3, 4, 5, 6] as const;

function clock(value: string): string {
  return value.slice(0, 5);
}

function normalize(days: OpeningHoursDto[]): OpeningHoursDto[] {
  return DAYS.map((dayOfWeek) => {
    const found = days.find((day) => day.dayOfWeek === dayOfWeek);
    return found
      ? { dayOfWeek, opensAt: clock(found.opensAt), closesAt: clock(found.closesAt), isClosed: found.isClosed }
      : { dayOfWeek, opensAt: '18:00', closesAt: '00:00', isClosed: false };
  });
}

function HoursForm({ days, settings, onSaved, onError }: {
  days: OpeningHoursDto[];
  settings: SiteSettingsDto;
  onSaved: () => void;
  onError: (message: string) => void;
}) {
  const { t } = useTranslation('admin');
  const hours = useHoursAdmin();
  const settingsService = useSettingsAdmin();
  const { setDirty } = useFormDirty();
  const form = useForm<Values>({
    defaultValues: {
      days: normalize(days),
      startsAt: clock(settings.happyHour.startsAt),
      endsAt: clock(settings.happyHour.endsAt),
      discountPercent: String(settings.happyHour.discountPercent),
    },
  });
  setDirty(form.formState.isDirty);
  useEffect(() => () => setDirty(false), [setDirty]);

  async function onSubmit(values: Values) {
    const discount = Number(values.discountPercent);
    if (!Number.isInteger(discount) || discount < 0 || discount > 100) {
      onError(t('common.price'));
      return;
    }
    try {
      await hours.replace(DAYS.map((dayOfWeek) => {
        const day = values.days[dayOfWeek];
        return {
          dayOfWeek,
          opensAt: (day?.opensAt ?? '18:00').slice(0, 5),
          closesAt: (day?.closesAt ?? '00:00').slice(0, 5),
          isClosed: Boolean(day?.isClosed),
        };
      }));
      await settingsService.update({
        happyHour: {
          startsAt: values.startsAt.slice(0, 5),
          endsAt: values.endsAt.slice(0, 5),
          discountPercent: discount,
        },
      });
      setDirty(false);
      onSaved();
    } catch (error) {
      onError(getErrorMessage(error));
    }
  }

  return (
    <form className="admin-form" noValidate onSubmit={(event) => { void form.handleSubmit(onSubmit)(event); }}>
      <p>{t('hours.note')}</p>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>{t('hours.title')}</th>
              <th>{t('hours.opens')}</th>
              <th>{t('hours.closes')}</th>
              <th>{t('hours.closed')}</th>
            </tr>
          </thead>
          <tbody>
            {DAYS.map((day) => (
              <tr key={day}>
                <th scope="row">{t(`days.d${day}`)}</th>
                <td><input dir="ltr" type="time" {...form.register(`days.${day}.opensAt`)} /></td>
                <td><input dir="ltr" type="time" {...form.register(`days.${day}.closesAt`)} /></td>
                <td><input type="checkbox" aria-label={t('hours.closed')} {...form.register(`days.${day}.isClosed`)} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="admin-grid admin-grid--2">
        <label className="admin-field">{t('hours.happyStart')}<input dir="ltr" type="time" {...form.register('startsAt')} /></label>
        <label className="admin-field">{t('hours.happyEnd')}<input dir="ltr" type="time" {...form.register('endsAt')} /></label>
        <label className="admin-field">{t('hours.discount')}<input dir="ltr" inputMode="numeric" {...form.register('discountPercent')} /></label>
      </div>
      <button type="submit" className="admin-btn">{t('common.save')}</button>
    </form>
  );
}

export default function HoursAdmin() {
  const { t } = useTranslation('admin');
  const hours = useHoursAdmin();
  const settingsService = useSettingsAdmin();
  const dispatch = useAppDispatch();
  const [days, setDays] = useState<OpeningHoursDto[] | null>(null);
  const [settings, setSettings] = useState<SiteSettingsDto | null>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [notice, setNotice] = useState<Notice | null>(null);

  const readRows = useCallback(async () => {
    const [nextDays, nextSettings] = await Promise.all([hours.list(), settingsService.get()]);
    return { nextDays, nextSettings };
  }, [hours, settingsService]);

  const reload = useCallback(async () => {
    setStatus('loading');
    try {
      const loaded = await readRows();
      setDays(loaded.nextDays);
      setSettings(loaded.nextSettings);
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
      setDays(loaded.nextDays);
      setSettings(loaded.nextSettings);
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
      <h1>{t('hours.title')}</h1>
      {notice ? <InlineToast tone={notice.tone} onDismiss={() => setNotice(null)} dismissLabel={t('common.close')}>{notice.text}</InlineToast> : null}
      {status === 'loading' ? <p>{t('common.loading')}</p> : null}
      {status === 'error' ? <button type="button" className="admin-btn" onClick={() => { void reload(); }}>{t('common.retry')}</button> : null}
      {status === 'ready' && days && settings ? (
        <HoursForm
          days={days}
          settings={settings}
          onSaved={() => { setNotice({ tone: 'success', text: t('common.saved') }); refreshPublic(dispatch, 'site'); void reload(); }}
          onError={(text) => setNotice({ tone: 'error', text })}
        />
      ) : null}
    </section>
  );
}
