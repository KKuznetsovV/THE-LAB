import type { ReactNode } from 'react';

type Props = {
  children: ReactNode;
  className?: string;
};

export default function Ltr({ children, className }: Props) {
  return (
    <bdi dir="ltr" className={className}>
      {children}
    </bdi>
  );
}
