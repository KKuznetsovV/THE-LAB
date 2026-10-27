import type { CSSProperties } from 'react';
import { FLAVOUR_LABELS, type FlavourKey } from './flavours';
import './FlavourIcon.css';

type Locale = 'he' | 'en';

type Props = {
  flavour: FlavourKey;
  locale?: Locale;
  labelled?: boolean;
};

export default function FlavourIcon({ flavour, locale = 'he', labelled = false }: Props) {
  const name = FLAVOUR_LABELS[flavour][locale];
  const style: CSSProperties & { '--flavour-icon': string } = {
    '--flavour-icon': `url("/brand/icons/${flavour}.svg")`,
  };
  return (
    <span className="flavour-icon">
      <span className="flavour-icon-mark" style={style} aria-hidden={labelled ? true : undefined} role={labelled ? undefined : 'img'} aria-label={labelled ? undefined : name} />
      {labelled ? <span className="flavour-icon-label t-mono">[{name}]</span> : null}
    </span>
  );
}
