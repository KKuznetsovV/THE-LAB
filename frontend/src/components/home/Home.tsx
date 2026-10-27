import { useTranslation } from 'react-i18next';
import './Home.css';

export default function Home() {
  const { t } = useTranslation();
  return (
    <section className="home">
      <title>THE LAB · TLV</title>
      <h1>{t('home.heading')}</h1>
    </section>
  );
}
