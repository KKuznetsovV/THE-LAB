import type { CocktailDto } from '@thelab/lib';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ElementTile from '../common/element-tile/ElementTile';
import FlavourIcon from '../common/flavour-icon/FlavourIcon';
import PaperCard from '../common/paper-card/PaperCard';
import PillBadge from '../common/pill-badge/PillBadge';
import PriceTag from '../common/price-tag/PriceTag';
import type { FlavourKey } from '../common/flavour-icon/flavours';
import { useLocalized } from '../../hooks/use-localized';
import './CocktailRow.css';

type Props = {
  item: CocktailDto;
  to: string;
};

function asFlavour(value: string): FlavourKey | null {
  const keys: readonly string[] = [
    'fruity', 'floral', 'spicy', 'chocolate', 'herbal', 'sweet', 'anise', 'deep',
    'strong', 'sour', 'oumami', 'na', 'tangy', 'smokey', 'bitter', 'fresh', 'sparkling',
  ];
  return keys.includes(value) ? value as FlavourKey : null;
}

export default function CocktailRow({ item, to }: Props) {
  const { t } = useTranslation();
  const { locale, text } = useLocalized();

  return (
    <PaperCard>
      <Link className="cocktail-row" to={to} data-cocktail={item.code}>
        <ElementTile code={item.code} indexLabel={item.indexLabel} tone="dark" size="sm" />
        <span className="cocktail-row-copy">
          <span className="cocktail-row-name" lang="en">{item.nameEn}</span>
          <span>{text(item.ingredientsHe, item.ingredientsEn)}</span>
        </span>
        <span className="cocktail-row-meta">
          <span className="cocktail-row-flavours">
            {item.flavours.map((flavour) => {
              const key = asFlavour(flavour);
              return key ? <FlavourIcon key={flavour} flavour={key} locale={locale} /> : null;
            })}
          </span>
          {item.price !== null ? <PriceTag price={item.price} locale={locale} /> : null}
          <span className="cocktail-row-pills">
            {item.isSignature ? <PillBadge>{t('menu.signature')}</PillBadge> : null}
            {!item.isAvailable ? <PillBadge tone="pink">{t('menu.soldOut')}</PillBadge> : null}
          </span>
        </span>
      </Link>
    </PaperCard>
  );
}
