import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { loadSite } from '../../redux/settings-slice';
import store from '../../redux/store';
import { useAppDispatch } from '../../redux/hooks';
import Layout from './layout/layout/Layout';

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
          <Layout />
        </BrowserRouter>
      </SiteData>
    </Provider>
  );
}
