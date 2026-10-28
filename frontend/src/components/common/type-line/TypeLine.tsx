import { useEffect, useState } from 'react';
import { prefersReducedMotion } from '../../../utils/motion';
import BlinkCursor from '../blink-cursor/BlinkCursor';
import './TypeLine.css';

type Props = {
  text: string;
  className?: string;
};

const SPEED_MS = 32;
const HARD_STOP_MS = 2500;

function showImmediately(): boolean {
  return prefersReducedMotion() || (typeof document !== 'undefined' && document.hidden);
}

export default function TypeLine({ text, className }: Props) {
  const [typed, setTyped] = useState({ text: '', count: 0 });
  const immediate = showImmediately();
  const count = typed.text === text ? typed.count : 0;
  const shown = immediate ? text : text.slice(0, count);

  useEffect(() => {
    if (showImmediately()) return undefined;
    const started = performance.now();
    const id = window.setInterval(() => {
      const elapsed = performance.now() - started;
      const next = elapsed >= HARD_STOP_MS ? text.length : Math.min(text.length, Math.floor(elapsed / SPEED_MS));
      setTyped({ text, count: next });
      if (next >= text.length) window.clearInterval(id);
    }, SPEED_MS);
    const stop = window.setTimeout(() => {
      setTyped({ text, count: text.length });
      window.clearInterval(id);
    }, HARD_STOP_MS);
    function onHide(): void {
      if (!document.hidden) return;
      setTyped({ text, count: text.length });
      window.clearInterval(id);
      window.clearTimeout(stop);
    }
    document.addEventListener('visibilitychange', onHide);
    return () => {
      window.clearInterval(id);
      window.clearTimeout(stop);
      document.removeEventListener('visibilitychange', onHide);
    };
  }, [text]);

  return (
    <p className={['type-line', 't-display', className].filter(Boolean).join(' ')} dir="ltr">
      <span className="visually-hidden">{text}</span>
      <span className="type-line-sizer" aria-hidden="true">{text}</span>
      <span className="type-line-live" aria-hidden="true">
        {shown}
        <BlinkCursor />
      </span>
    </p>
  );
}
