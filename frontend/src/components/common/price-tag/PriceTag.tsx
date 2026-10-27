import './PriceTag.css';

type Locale = 'he' | 'en';

type Props = {
  price: number;
  locale?: Locale;
};

export default function PriceTag({ price, locale = 'he' }: Props) {
  const label = locale === 'he' ? `[${price}₪]` : `[₪${price}]`;
  return <span className="price-tag">{label}</span>;
}
