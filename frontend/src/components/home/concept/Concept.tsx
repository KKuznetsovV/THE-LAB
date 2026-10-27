import { useTranslation } from 'react-i18next';
import SectionHeader from '../../common/section-header/SectionHeader';
import './Concept.css';

export default function Concept() {
  const { t } = useTranslation();
  const cards = [
    ['home.distilled', 'home.distilledBody'],
    ['home.bench', 'home.benchBody'],
    ['home.records', 'home.recordsBody'],
  ] as const;

  return (
    <section className="concept">
      <SectionHeader kicker={t('home.conceptKicker')} title={t('home.conceptTitle')} />
      <ul className="concept-grid">
        {cards.map(([title, body]) => (
          <li key={title} className="concept-card">
            <h3 className="t-mono">{t(title)}</h3>
            <p>{t(body)}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
