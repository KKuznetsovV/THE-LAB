import { useEffect, useState } from 'react';
import './GlowLogo.css';

type Variant = 'stacked' | 'horizontal';
type Colour = 'green' | 'white' | 'black';

type Props = {
  variant?: Variant;
  colour?: Colour;
  glow?: boolean;
  label?: string;
};

function prepare(svg: string): string {
  return svg
    .replace(/\sid="[^"]*"/g, '')
    .replace('<svg ', '<svg aria-hidden="true" focusable="false" ');
}

export default function GlowLogo({
  variant = 'horizontal',
  colour = 'green',
  glow = false,
  label = 'THE LAB',
}: Props) {
  const [markup, setMarkup] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    void fetch(`/brand/logo/the-lab-logo-${variant}-${colour}.svg`, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error('Logo failed to load');
        return response.text();
      })
      .then((svg) => {
        if (!controller.signal.aborted) setMarkup(prepare(svg));
      })
      .catch(() => {
        if (!controller.signal.aborted) setMarkup('');
      });
    return () => controller.abort();
  }, [variant, colour]);

  const className = [
    'glow-logo',
    `glow-logo--${variant}`,
    glow ? 'glow-logo--glow' : '',
  ].filter(Boolean).join(' ');

  return (
    <span
      className={className}
      role="img"
      aria-label={label}
      dangerouslySetInnerHTML={{ __html: markup }}
    />
  );
}
