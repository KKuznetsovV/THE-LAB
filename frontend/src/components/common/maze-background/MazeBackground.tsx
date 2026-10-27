import type { CSSProperties } from 'react';
import './MazeBackground.css';

type Variant = 'black' | 'green' | 'grey';

const SOURCES: Record<Variant, string> = {
  black: '/brand/patterns/pattern-maze-black-thumb.webp',
  green: '/brand/patterns/pattern-maze-green-thumb.webp',
  grey: '/brand/patterns/pattern-maze-grey-thumb.webp',
};

type Props = {
  variant?: Variant;
  opacity?: number;
};

export default function MazeBackground({ variant = 'black', opacity = 0.35 }: Props) {
  const cap = variant === 'black' ? 0.35 : 1;
  const used = Math.min(cap, Math.max(0, opacity));
  const style = {
    backgroundImage: `url("${SOURCES[variant]}")`,
    opacity: used,
  } satisfies CSSProperties;

  return <div className="maze" style={style} aria-hidden="true" />;
}
