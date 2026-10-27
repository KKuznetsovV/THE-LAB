import Footer from '../footer/Footer';
import Header from '../header/Header';
import Main from '../main/Main';
import './Layout.css';

export default function Layout() {
  return (
    <div className="layout">
      <Header />
      <main id="content" className="layout-main">
        <Main />
      </main>
      <Footer />
    </div>
  );
}
