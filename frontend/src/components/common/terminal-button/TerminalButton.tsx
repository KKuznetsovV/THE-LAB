import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';
import './TerminalButton.css';

type Variant = 'primary' | 'outline' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

type Shared = {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
  className?: string;
};

type AsButton = Shared &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'children'> & {
    href?: undefined;
  };

type AsAnchor = Shared &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'className' | 'children' | 'href'> & {
    href: string;
    newTabLabel?: string;
  };

function classes(variant: Variant, size: Size, extra?: string): string {
  return ['terminal-button', `terminal-button--${variant}`, `terminal-button--${size}`, extra]
    .filter(Boolean)
    .join(' ');
}

function isExternal(href: string): boolean {
  return /^https?:\/\//i.test(href);
}

function AnchorButton({
  variant = 'primary',
  size = 'md',
  className,
  children,
  href,
  newTabLabel = 'opens in a new tab',
  ...rest
}: AsAnchor) {
  const external = isExternal(href);
  return (
    <a
      {...rest}
      className={classes(variant, size, className)}
      href={href}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      {children}
      {external ? <span className="visually-hidden"> {newTabLabel}</span> : null}
    </a>
  );
}

function NativeButton({
  variant = 'primary',
  size = 'md',
  className,
  children,
  type,
  ...rest
}: AsButton) {
  return (
    <button {...rest} className={classes(variant, size, className)} type={type ?? 'button'}>
      {children}
    </button>
  );
}

export default function TerminalButton(props: AsButton | AsAnchor) {
  if (props.href !== undefined) return <AnchorButton {...props} />;
  return <NativeButton {...props} />;
}
