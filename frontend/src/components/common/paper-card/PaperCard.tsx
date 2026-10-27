import type { ReactNode } from 'react';
import './PaperCard.css';

type Tone = 'powder' | 'ash';

type Props = {
  children: ReactNode;
  tone?: Tone;
};

export default function PaperCard({ children, tone = 'powder' }: Props) {
  return <article className={`paper-card paper-card--${tone}`}>{children}</article>;
}
