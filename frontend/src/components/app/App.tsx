import type { ReactNode } from 'react';
import { lazy, Suspense, useEffect } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { loadSite } from '../../redux/settings-slice';
import store from '../../redux/store';
import { useAppDispatch } from '../../redux/hooks';
import TerminalLoader from '../common/terminal-loader/TerminalLoader';
import Layout from './layout/layout/Layout';

const AdminApp = lazy(() => import('../admin/AdminApp'));

function SiteData({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch();
  useEffect(() => {
    void dispatch(loadSite());
  }, [dispatch]);
  return children;
}

export default function App() {
  return (
    <Provider store={store}>
      <SiteData>
        <BrowserRouter>
          <Routes>
            <Route
              path="/admin/*"
              element={(
                <Suspense fallback={<main><TerminalLoader /></main>}>
                  <AdminApp />
                </Suspense>
              )}
            />
            <Route path="*" element={<Layout />} />
          </Routes>
        </BrowserRouter>
      </SiteData>
    </Provider>
  );
}
