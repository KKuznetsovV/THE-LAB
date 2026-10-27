import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import InlineToast from '../../common/inline-toast/InlineToast';
import { useIdentityAuth } from '../../../hooks/use-service';
import { getErrorMessage } from '../../../utils/errors';
import { useFormDirty } from '../shell/dirty-context';

type Values = { currentPassword: string; newPassword: string };
type Notice = { tone: 'success' | 'error'; text: string };

export default function Account() {
  const { t } = useTranslation('admin');
  const identity = useIdentityAuth();
  const { setDirty } = useFormDirty();
  const [notice, setNotice] = useState<Notice | null>(null);
  const form = useForm<Values>({ defaultValues: { currentPassword: '', newPassword: '' } });
  setDirty(form.formState.isDirty);
  useEffect(() => () => setDirty(false), [setDirty]);

  async function onSubmit(values: Values) {
    if (values.newPassword.length < 12) {
      setNotice({ tone: 'error', text: t('account.short') });
      return;
    }
    try {
      await identity.changePassword(values.currentPassword, values.newPassword);
      form.reset();
      setDirty(false);
      setNotice({ tone: 'success', text: t('common.saved') });
    } catch (error) {
      setNotice({ tone: 'error', text: getErrorMessage(error) });
    }
  }

  return (
    <section>
      <h1>{t('account.title')}</h1>
      {notice ? <InlineToast tone={notice.tone} onDismiss={() => setNotice(null)} dismissLabel={t('common.close')}>{notice.text}</InlineToast> : null}
      <form className="admin-form" noValidate onSubmit={(event) => { void form.handleSubmit(onSubmit)(event); }}>
        <label className="admin-field">{t('account.current')}<input dir="ltr" type="password" autoComplete="current-password" {...form.register('currentPassword')} /></label>
        <label className="admin-field">{t('account.next')}<input dir="ltr" type="password" autoComplete="new-password" {...form.register('newPassword')} /></label>
        <button type="submit" className="admin-btn">{t('account.submit')}</button>
      </form>
    </section>
  );
}
