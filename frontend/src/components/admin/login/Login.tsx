import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Navigate } from 'react-router-dom';
import InlineToast from '../../common/inline-toast/InlineToast';
import { useIdentityAuth } from '../../../hooks/use-service';
import { getErrorMessage } from '../../../utils/errors';
import { useAdminAuth } from '../auth/admin-context';

type Values = { email: string; password: string };

export default function Login() {
  const { t } = useTranslation('admin');
  const auth = useAdminAuth();
  const identity = useIdentityAuth();
  const [error, setError] = useState<string | null>(null);
  const form = useForm<Values>({ defaultValues: { email: '', password: '' } });

  if (auth.user) return <Navigate to="/admin" replace />;

  async function onSubmit(values: Values) {
    setError(null);
    try {
      auth.accept(await identity.login(values.email, values.password));
    } catch (reason) {
      setError(getErrorMessage(reason));
    }
  }

  return (
    <main className="admin admin-login">
      <h1>{t('login.title')}</h1>
      {error ? <InlineToast tone="error" onDismiss={() => setError(null)} dismissLabel={t('common.close')}>{error || t('login.failed')}</InlineToast> : null}
      <form className="admin-form" noValidate onSubmit={(event) => { void form.handleSubmit(onSubmit)(event); }}>
        <label className="admin-field">{t('login.email')}<input dir="ltr" type="email" autoComplete="username" {...form.register('email')} /></label>
        <label className="admin-field">{t('login.password')}<input dir="ltr" type="password" autoComplete="current-password" {...form.register('password')} /></label>
        <button type="submit" className="admin-btn" disabled={form.formState.isSubmitting}>{t('login.submit')}</button>
      </form>
    </main>
  );
}
