import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet, useLocation } from 'react-router-dom';
import { useAdminAuth } from '../auth/admin-context';
import { adminLocale, applyAdminLocale } from '../i18n/load';
import { useFormDirty } from './dirty-context';
import { GuardedLink } from './dirty';

const LINKS = [
  ['/admin', 'nav.dashboard'],
  ['/admin/cocktails', 'nav.cocktails'],
  ['/admin/bottles', 'nav.bottles'],
  ['/admin/spirits', 'nav.spirits'],
  ['/admin/events', 'nav.events'],
  ['/admin/gallery', 'nav.gallery'],
  ['/admin/hours', 'nav.hours'],
  ['/admin/settings', 'nav.settings'],
  ['/admin/account', 'nav.account'],
] as const;

export default function AdminShell() {
  const { t, i18n } = useTranslation('admin');
  const { user, logout } = useAdminAuth();
  const { requestLeave } = useFormDirty();
  const { pathname } = useLocation();

  useEffect(() => {
    applyAdminLocale(adminLocale());
  }, []);

  function current(to: string): 'page' | undefined {
    if (to === '/admin') return pathname === '/admin' ? 'page' : undefined;
    return pathname.startsWith(to) ? 'page' : undefined;
  }

  return (
    <div className="admin">
      <a className="skip-link" href="#admin-content">{t('nav.label')}</a>
      <div className="admin-shell">
        <nav className="admin-nav" aria-label={t('nav.label')}>
          {LINKS.map(([to, key]) => (
            <GuardedLink key={to} to={to} className="admin-nav-link" current={current(to) === 'page'}>{t(key)}</GuardedLink>
          ))}
          {user?.role === 'owner' ? <GuardedLink to="/admin/admins" className="admin-nav-link" current={current('/admin/admins') === 'page'}>{t('nav.admins')}</GuardedLink> : null}
          <GuardedLink to="/" className="admin-nav-link">{t('nav.site')}</GuardedLink>
          <div className="admin-row">
            <button type="button" className="admin-btn admin-btn--ghost" aria-pressed={i18n.language !== 'en'} onClick={() => applyAdminLocale('he')}>{t('nav.he')}</button>
            <button type="button" className="admin-btn admin-btn--ghost" aria-pressed={i18n.language === 'en'} onClick={() => applyAdminLocale('en')}>{t('nav.en')}</button>
          </div>
          <button type="button" className="admin-btn admin-btn--ghost" onClick={() => requestLeave(() => logout())}>{t('nav.logout')}</button>
        </nav>
        <div id="admin-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
