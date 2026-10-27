import { useEffect } from 'react';
import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import Account from './account/Account';
import AdminsScreen from './admins/AdminsScreen';
import { useAdminAuth } from './auth/admin-context';
import AdminAuthProvider from './auth/AdminAuth';
import BottlesAdmin from './bottles/BottlesAdmin';
import CocktailsAdmin from './cocktails/CocktailsAdmin';
import Dashboard from './dashboard/Dashboard';
import EventsAdmin from './events/EventsAdmin';
import GalleryAdmin from './gallery/GalleryAdmin';
import HoursAdmin from './hours/HoursAdmin';
import { adminLocale, applyAdminLocale } from './i18n/load';
import './i18n/load';
import Login from './login/Login';
import SettingsAdmin from './settings/SettingsAdmin';
import AdminShell from './shell/AdminShell';
import { DirtyProvider } from './shell/dirty';
import SpiritsAdmin from './spirits/SpiritsAdmin';
import './Admin.css';

function Protected() {
  const { user } = useAdminAuth();
  if (!user) return <Navigate to="/admin/login" replace />;
  return <Outlet />;
}

function OwnerOnly() {
  const { user } = useAdminAuth();
  if (user?.role !== 'owner') return <Navigate to="/admin" replace />;
  return <Outlet />;
}

function Shell() {
  return (
    <DirtyProvider>
      <AdminShell />
    </DirtyProvider>
  );
}

export default function AdminApp() {
  useEffect(() => {
    applyAdminLocale(adminLocale());
  }, []);

  return (
    <AdminAuthProvider>
      <title>Admin · THE LAB</title>
      <meta name="robots" content="noindex,nofollow" />
      <Routes>
        <Route path="login" element={<Login />} />
        <Route element={<Protected />}>
          <Route element={<Shell />}>
            <Route index element={<Dashboard />} />
            <Route path="cocktails" element={<CocktailsAdmin />} />
            <Route path="bottles" element={<BottlesAdmin />} />
            <Route path="spirits" element={<SpiritsAdmin />} />
            <Route path="events" element={<EventsAdmin />} />
            <Route path="gallery" element={<GalleryAdmin />} />
            <Route path="hours" element={<HoursAdmin />} />
            <Route path="settings" element={<SettingsAdmin />} />
            <Route path="account" element={<Account />} />
            <Route element={<OwnerOnly />}>
              <Route path="admins" element={<AdminsScreen />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </AdminAuthProvider>
  );
}
