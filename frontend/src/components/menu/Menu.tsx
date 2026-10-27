import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './Menu.css';

export default function Menu() {
  const { code } = useParams();
  const { t } = useTranslation();
  const heading = code ? `${t('menu.heading')} · ${code}` : t('menu.heading');
  return (
    <section className="menu">
      <title>{`${heading} · THE LAB`}</title>
      <h1>{heading}</h1>
    </section>
  );
}
