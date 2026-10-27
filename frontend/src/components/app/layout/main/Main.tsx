import { lazy, Suspense, useEffect, useState, type ComponentType, type ReactNode } from 'react';
import { Route, Routes } from 'react-router-dom';
import TerminalLoader from '../../../common/terminal-loader/TerminalLoader';
import Home from '../../../home/Home';
import NotFound from '../not-found/NotFound';
import LocaleLayout from '../locale-layout/LocaleLayout';
import { readyPages, type PageKey } from './route-preload';

const lazyPages: Record<PageKey, ReturnType<typeof lazy>> = {
  menu: lazy(() => import('../../../menu/Menu')),
  'take-me-home': lazy(() => import('../../../take-me-home/TakeMeHome')),
  visit: lazy(() => import('../../../visit/Visit')),
  events: lazy(() => import('../../../events/Events')),
  archive: lazy(() => import('../../../archive/Archive')),
  about: lazy(() => import('../../../about/About')),
  accessibility: lazy(() => import('../../../legal/accessibility/Accessibility')),
  privacy: lazy(() => import('../../../legal/privacy/Privacy')),
};

function Page({ name }: { name: PageKey }) {
  const Loaded = readyPages[name];
  if (Loaded) return <Loaded />;
  const LazyPage = lazyPages[name];
  return <LazyPage />;
}

function DevStyleguide() {
  const [Page, setPage] = useState<ComponentType | null>(null);

  useEffect(() => {
    let active = true;
    void import('../../../styleguide/Styleguide').then((mod) => {
      if (active) setPage(() => mod.default);
    });
    return () => {
      active = false;
    };
  }, []);

  if (!Page) return null;
  return <Page />;
}

function pages(): ReactNode {
  return (
    <>
      <Route index element={<Home />} />
      <Route path="menu" element={<Page name="menu" />} />
      <Route path="menu/:code" element={<Page name="menu" />} />
      <Route path="take-me-home" element={<Page name="take-me-home" />} />
      <Route path="visit" element={<Page name="visit" />} />
      <Route path="events" element={<Page name="events" />} />
      <Route path="events/:slug" element={<Page name="events" />} />
      <Route path="archive" element={<Page name="archive" />} />
      <Route path="about" element={<Page name="about" />} />
      <Route path="accessibility" element={<Page name="accessibility" />} />
      <Route path="privacy" element={<Page name="privacy" />} />
      <Route path="*" element={<NotFound />} />
    </>
  );
}

export default function Main() {
  return (
    <Suspense fallback={<TerminalLoader />}>
      <Routes>
        {import.meta.env.DEV ? <Route path="styleguide" element={<DevStyleguide />} /> : null}
        <Route path="en" element={<LocaleLayout locale="en" />}>
          {pages()}
        </Route>
        <Route element={<LocaleLayout locale="he" />}>
          {pages()}
        </Route>
      </Routes>
    </Suspense>
  );
}
