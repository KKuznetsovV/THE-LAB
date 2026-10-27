import type { BottleDto, CocktailDto } from '@thelab/lib';
import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ElementTile from '../common/element-tile/ElementTile';
import FlavourIcon from '../common/flavour-icon/FlavourIcon';
import PriceTag from '../common/price-tag/PriceTag';
import type { FlavourKey } from '../common/flavour-icon/flavours';
import { useLocalized } from '../../hooks/use-localized';
import { useLocalizedPath } from '../../i18n/locale';
import './CocktailDialog.css';

type Props = {
  code: string;
  item: CocktailDto | null;
  bottle: BottleDto | null;
  onClose: () => void;
};

function asFlavour(value: string): FlavourKey | null {
  const keys: readonly string[] = [
    'fruity', 'floral', 'spicy', 'chocolate', 'herbal', 'sweet', 'anise', 'deep',
    'strong', 'sour', 'oumami', 'na', 'tangy', 'smokey', 'bitter', 'fresh', 'sparkling',
  ];
  return keys.includes(value) ? value as FlavourKey : null;
}

export default function CocktailDialog({ code, item, bottle, onClose }: Props) {
  const { t } = useTranslation();
  const { locale, text } = useLocalized();
  const localize = useLocalizedPath();
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || dialog.open) return undefined;
    dialog.showModal();
    return () => {
      if (dialog.open) dialog.close();
      document.querySelector<HTMLElement>(`[data-cocktail="${CSS.escape(code)}"]`)?.focus();
    };
  }, [code]);

  return (
    <dialog
      ref={dialogRef}
      className="cocktail-dialog"
      aria-labelledby="cocktail-dialog-title"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onKeyDown={(event) => {
        if (event.key !== 'Escape') return;
        event.preventDefault();
        onClose();
      }}
    >
      <button type="button" className="cocktail-dialog-close t-mono" onClick={onClose}>
        {t('menu.close')}
      </button>
      {item ? (
        <div className="cocktail-dialog-body">
          {item.imageUrl ? (
            <img
              src={item.imageUrl}
              alt={text(item.imageAltHe ?? item.nameHe, item.imageAltEn ?? item.nameEn)}
              width={960}
              height={720}
            />
          ) : null}
          <ElementTile code={item.code} indexLabel={item.indexLabel} size="lg" />
          <h2 id="cocktail-dialog-title" lang="en">{item.nameEn}</h2>
          <p>{text(item.ingredientsHe, item.ingredientsEn)}</p>
          <p>{text(item.descriptionHe ?? '', item.descriptionEn ?? '')}</p>
          <p className="cocktail-dialog-flavours">
            {item.flavours.map((flavour) => {
              const key = asFlavour(flavour);
              return key ? <FlavourIcon key={flavour} flavour={key} locale={locale} labelled /> : null;
            })}
          </p>
          {item.price !== null ? <PriceTag price={item.price} locale={locale} /> : null}
          {bottle ? (
            <Link to={`${localize('/take-me-home')}#${item.code}`}>{t('menu.takeHome')}</Link>
          ) : null}
        </div>
      ) : (
        <p id="cocktail-dialog-title">{t('menu.missing')}</p>
      )}
    </dialog>
  );
}
