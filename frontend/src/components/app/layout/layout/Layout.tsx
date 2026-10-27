import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import DeliveryProvider from '../../../../hooks/DeliveryProvider';
import ActionBar from '../action-bar/ActionBar';
import AgeGate from '../age-gate/AgeGate';
import { ageGateInitiallyBlocked } from '../age-gate/age-storage';
import Footer from '../footer/Footer';
import Header from '../header/Header';
import Main from '../main/Main';
import ScrollToTop from '../scroll-to-top/ScrollToTop';
import './Layout.css';

export default function Layout() {
  const { t } = useTranslation();
  const [blocked, setBlocked] = useState(ageGateInitiallyBlocked);

  return (
    <DeliveryProvider>
      <a className="skip-link" href="#content">{t('common.skip')}</a>
      <AgeGate blocked={blocked} onAllow={() => setBlocked(false)} />
      <div className="layout" inert={blocked ? true : undefined}>
        <Header />
        <main id="content" className="layout-main">
          <Main />
        </main>
        <Footer />
        <ActionBar />
      </div>
      <ScrollToTop />
    </DeliveryProvider>
  );
}
