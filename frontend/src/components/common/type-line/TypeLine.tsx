import { useEffect, useState } from 'react';
import { prefersReducedMotion } from '../../../utils/motion';
import BlinkCursor from '../blink-cursor/BlinkCursor';
import './TypeLine.css';

type Props = {
  text: string;
};

export default function TypeLine({ text }: Props) {
  const reduced = prefersReducedMotion();
  const [typed, setTyped] = useState({ text: '', count: 0 });
  const count = typed.text === text ? typed.count : 0;
  const shown = reduced ? text : text.slice(0, count);

  useEffect(() => {
    if (prefersReducedMotion()) return undefined;
    const id = window.setInterval(() => {
      setTyped((current) => {
        const base = current.text === text ? current.count : 0;
        if (base >= text.length) return current;
        return { text, count: base + 1 };
      });
    }, 32);
    const stop = window.setTimeout(() => window.clearInterval(id), text.length * 32 + 48);
    return () => {
      window.clearInterval(id);
      window.clearTimeout(stop);
    };
  }, [text]);

  return (
    <p className="type-line t-display">
      <span className="visually-hidden">{text}</span>
      <span className="type-line-sizer" aria-hidden="true">{text}</span>
      <span className="type-line-live" aria-hidden="true">
        {shown}
        <BlinkCursor />
      </span>
    </p>
  );
}
