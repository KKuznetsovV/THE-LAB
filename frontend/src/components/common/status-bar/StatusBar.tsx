import { useEffect, useState, type ReactNode } from 'react';
import './StatusBar.css';

function formatClock(date: Date): string {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Jerusalem',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  }).format(date);
}

type Props = {
  children?: ReactNode;
};

export default function StatusBar({ children }: Props) {
  const [clock, setClock] = useState(() => formatClock(new Date()));

  useEffect(() => {
    const id = window.setInterval(() => {
      setClock(formatClock(new Date()));
    }, 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="status-bar t-mono">
      <span>TYO // LAB.NODE-01</span>
      <span className="status-bar-clock" dir="ltr" aria-hidden="true">{clock} // TLV</span>
      {children ? <span className="status-bar-slot">{children}</span> : null}
    </div>
  );
}
