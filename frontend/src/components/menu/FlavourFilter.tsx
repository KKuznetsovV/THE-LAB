import type { Flavour } from '@thelab/lib';
import { useTranslation } from 'react-i18next';
import FlavourIcon from '../common/flavour-icon/FlavourIcon';
import type { FlavourKey } from '../common/flavour-icon/flavours';
import { useLocalized } from '../../hooks/use-localized';
import './FlavourFilter.css';

type Props = {
  available: Flavour[];
  selected: Flavour[];
  count: number;
  onToggle: (flavour: Flavour) => void;
  onClear: () => void;
};

export default function FlavourFilter({ available, selected, count, onToggle, onClear }: Props) {
  const { t } = useTranslation();
  const { locale } = useLocalized();
  if (available.length === 0) return null;

  return (
    <div className="flavour-filter">
      <div className="flavour-filter-chips" role="group" aria-label={t('menu.nav')}>
        {available.map((flavour) => {
          const pressed = selected.includes(flavour);
          return (
            <button
              key={flavour}
              type="button"
              className="flavour-filter-chip"
              aria-pressed={pressed}
              onClick={() => onToggle(flavour)}
            >
              <FlavourIcon flavour={flavour as FlavourKey} locale={locale} labelled />
            </button>
          );
        })}
      </div>
      <p className="flavour-filter-count t-mono" aria-live="polite">{t('menu.count', { count })}</p>
      {selected.length > 0 ? (
        <button type="button" className="flavour-filter-clear t-mono" onClick={onClear}>{t('menu.clear')}</button>
      ) : null}
    </div>
  );
}
