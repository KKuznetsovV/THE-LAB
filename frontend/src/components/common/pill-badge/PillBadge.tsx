import type { ReactNode } from 'react';
import './PillBadge.css';

type Tone = 'green' | 'pink';

type Props = {
  children: ReactNode;
  tone?: Tone;
};

export default function PillBadge({ children, tone = 'green' }: Props) {
  return <span className={`pill-badge pill-badge--${tone} t-mono`}>{children}</span>;
}
