import './ElementTile.css';

const TILE_PX = { sm: 72, md: 104, lg: 144 } as const;

type Size = 'sm' | 'md' | 'lg';
type Tone = 'dark' | 'paper' | 'green';

type Props = {
  code: string;
  indexLabel: string;
  size?: Size;
  tone?: Tone;
  image?: string;
  imageAlt?: string;
};

export default function ElementTile({
  code,
  indexLabel,
  size = 'md',
  tone = 'dark',
  image,
  imageAlt = '',
}: Props) {
  return (
    <article className={`element-tile element-tile--${size} element-tile--${tone}`}>
      {image ? (
        <img
          className="element-tile-image"
          src={image}
          alt={imageAlt}
          width={TILE_PX[size]}
          height={TILE_PX[size]}
          loading="lazy"
          decoding="async"
        />
      ) : null}
      <p className="element-tile-code">
        {code}
        <sup className="element-tile-index">{indexLabel}</sup>
      </p>
    </article>
  );
}
