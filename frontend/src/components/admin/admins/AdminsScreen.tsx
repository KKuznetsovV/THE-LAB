import type { AdminDto, AdminRole } from '@thelab/lib';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import InlineToast from '../../common/inline-toast/InlineToast';
import { useAdminsService } from '../../../hooks/use-service';
import { getErrorMessage } from '../../../utils/errors';
import { useFormDirty } from '../shell/dirty-context';

type Notice = { tone: 'success' | 'error'; text: string };
type CreateValues = { name: string; email: string; password: string; role: AdminRole };

export default function AdminsScreen() {
  const { t } = useTranslation('admin');
  const service = useAdminsService();
  const { setDirty } = useFormDirty();
  const [rows, setRows] = useState<AdminDto[]>([]);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [notice, setNotice] = useState<Notice | null>(null);
  const form = useForm<CreateValues>({ defaultValues: { name: '', email: '', password: '', role: 'editor' } });
  setDirty(form.formState.isDirty);
  useEffect(() => () => setDirty(false), [setDirty]);

  const readRows = useCallback(() => service.list(), [service]);

  const reload = useCallback(async () => {
    setStatus('loading');
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

  async function onCreate(values: CreateValues) {
    if (values.password.length < 12) {
      setNotice({ tone: 'error', text: t('account.short') });
      return;
    }
    try {
      await service.create(values);
      form.reset();
      setDirty(false);
      setNotice({ tone: 'success', text: t('common.saved') });
      await reload();
    } catch (error) {
      setNotice({ tone: 'error', text: getErrorMessage(error) });
    }
  }

  async function onRole(row: AdminDto, role: AdminRole) {
    try {
      await service.update(row.id, { role });
      setNotice({ tone: 'success', text: t('common.saved') });
      await reload();
    } catch (error) {
      setNotice({ tone: 'error', text: getErrorMessage(error) });
    }
  }

  async function onDeactivate(row: AdminDto) {
    try {
      await service.deactivate(row.id);
      setNotice({ tone: 'success', text: t('common.saved') });
      await reload();
    } catch (error) {
      setNotice({ tone: 'error', text: getErrorMessage(error) });
    }
  }

  return (
    <section>
      <h1>{t('admins.title')}</h1>
      {notice ? <InlineToast tone={notice.tone} onDismiss={() => setNotice(null)} dismissLabel={t('common.close')}>{notice.text}</InlineToast> : null}
      {status === 'loading' ? <p>{t('common.loading')}</p> : null}
      {status === 'error' ? <button type="button" className="admin-btn" onClick={() => { void reload(); }}>{t('common.retry')}</button> : null}
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>{t('admins.name')}</th>
              <th>{t('admins.email')}</th>
              <th>{t('admins.role')}</th>
              <th>{t('admins.active')}</th>
              <th>{t('admins.deactivate')}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td>{row.name}</td>
                <td dir="ltr">{row.email}</td>
                <td>
                  <label className="admin-field">
                    <span className="visually-hidden">{t('admins.role')}</span>
                    <select value={row.role} onChange={(event) => { void onRole(row, event.target.value === 'owner' ? 'owner' : 'editor'); }}>
                      <option value="owner">{t('admins.owner')}</option>
                      <option value="editor">{t('admins.editor')}</option>
                    </select>
                  </label>
                </td>
                <td>{row.isActive ? t('common.yes') : t('common.no')}</td>
                <td>
                  <button type="button" className="admin-btn admin-btn--ghost" disabled={!row.isActive} onClick={() => { void onDeactivate(row); }}>{t('admins.deactivate')}</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <form className="admin-form" noValidate onSubmit={(event) => { void form.handleSubmit(onCreate)(event); }}>
        <h2>{t('admins.create')}</h2>
        <div className="admin-grid admin-grid--2">
          <label className="admin-field">{t('admins.name')}<input {...form.register('name')} /></label>
          <label className="admin-field">{t('admins.email')}<input dir="ltr" type="email" autoComplete="off" {...form.register('email')} /></label>
          <label className="admin-field">{t('admins.password')}<input dir="ltr" type="password" autoComplete="new-password" {...form.register('password')} /></label>
          <label className="admin-field">
            {t('admins.role')}
            <select {...form.register('role')}>
              <option value="editor">{t('admins.editor')}</option>
              <option value="owner">{t('admins.owner')}</option>
            </select>
          </label>
        </div>
        <button type="submit" className="admin-btn">{t('common.save')}</button>
      </form>
    </section>
  );
}
