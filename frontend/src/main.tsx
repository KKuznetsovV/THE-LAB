import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './components/app/App';
import './i18n';
import './index.css';
import { loadBottles, loadEvents, loadGallery, loadMenu, loadPastEvents, loadSpirits } from './redux/collections';
import store from './redux/store';
import { loadSite } from './redux/settings-slice';
import { preloadRoute } from './components/app/layout/main/route-preload';

const root = document.getElementById('root');
if (!root) {
  throw new Error('Root element #root is missing');
}

function preload(): Promise<unknown> {
  const bare = window.location.pathname.replace(/^\/en(?=\/|$)/, '') || '/';
  const jobs: Array<Promise<unknown>> = [store.dispatch(loadSite()), preloadRoute(window.location.pathname)];
  if (bare === '/' || bare.startsWith('/menu')) jobs.push(store.dispatch(loadMenu()));
  if (bare === '/' || bare.startsWith('/menu') || bare.startsWith('/take-me-home')) jobs.push(store.dispatch(loadBottles()));
  if (bare === '/' || bare.startsWith('/events')) jobs.push(store.dispatch(loadEvents()));
  if (bare.startsWith('/events')) jobs.push(store.dispatch(loadPastEvents()));
  if (bare.startsWith('/menu')) jobs.push(store.dispatch(loadSpirits()));
  if (bare.startsWith('/archive')) jobs.push(store.dispatch(loadGallery()));
  return Promise.all(jobs);
}

void Promise.race([
  preload(),
  new Promise<void>((resolve) => {
    window.setTimeout(resolve, 1200);
  }),
]).finally(() => {
  createRoot(root).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
});
