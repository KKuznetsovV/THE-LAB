import type { ReactNode } from 'react';
import './RetroWindow.css';

type Tone = 'light' | 'dark';

type Props = {
  url: string;
  children: ReactNode;
  tone?: Tone;
};

export default function RetroWindow({ url, children, tone = 'light' }: Props) {
  return (
    <section className={`retro-window retro-window--${tone}`}>
      <header className="retro-window-title t-mono" dir="ltr">
        <span>THE LAB / PRIVATE WINDOW</span>
        <span className="retro-window-controls" aria-hidden="true">– □ ×</span>
      </header>
      <div className="retro-window-url t-mono" dir="ltr">{url}</div>
      <div className="retro-window-body">{children}</div>
      <footer className="retro-window-status t-mono" dir="ltr">
        <span lang="ja" aria-hidden="true">接続済み</span>
        <span aria-hidden="true"> / </span>
        <span>CONNECTED</span>
      </footer>
    </section>
  );
}
