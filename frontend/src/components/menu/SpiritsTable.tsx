import type { SpiritGroupDto } from '@thelab/lib';
import { useTranslation } from 'react-i18next';
import PriceTag from '../common/price-tag/PriceTag';
import { useLocalized } from '../../hooks/use-localized';
import './SpiritsTable.css';

const CATEGORY_KEYS: Record<string, string> = {
  'softs-mixers': 'menu.cat.softs',
  vodka: 'menu.cat.vodka',
  beer: 'menu.cat.beer',
  cognac: 'menu.cat.cognac',
  'wine-sparkling': 'menu.cat.wine',
  gin: 'menu.cat.gin',
  rum: 'menu.cat.rum',
  'tequila-mezcal': 'menu.cat.tequila',
  whisky: 'menu.cat.whisky',
  'amari-liqueurs': 'menu.cat.amari',
  'vintage-amari': 'menu.cat.vintage',
  'arak-ouzo': 'menu.cat.arak',
};

type Props = { groups: SpiritGroupDto[] };

export default function SpiritsTable({ groups }: Props) {
  const { t } = useTranslation();
  const { locale } = useLocalized();
  if (groups.length === 0) return <p>{t('menu.spiritsEmpty')}</p>;

  return (
    <div className="spirits-tables">
      {groups.map((group) => (
        <section key={group.category}>
          <h3 className="t-mono">{t(CATEGORY_KEYS[group.category] ?? group.category)}</h3>
          <table>
            <thead>
              <tr>
                <th scope="col">{group.category}</th>
                <th scope="col">{t('menu.glass')}</th>
                <th scope="col">{t('menu.bottle')}</th>
              </tr>
            </thead>
            <tbody>
              {group.items.map((item) => (
                <tr key={item.id}>
                  <th scope="row">{item.name}</th>
                  <td>{item.priceGlass !== null ? <PriceTag price={item.priceGlass} locale={locale} /> : '—'}</td>
                  <td>{item.priceBottle !== null ? <PriceTag price={item.priceBottle} locale={locale} /> : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      ))}
    </div>
  );
}
