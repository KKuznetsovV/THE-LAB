import { useCallback, useEffect, useState } from 'react';
import tight700 from '@fontsource/inter-tight/files/inter-tight-latin-700-normal.woff2?url';
import pixel400 from '@fontsource/vt323/files/vt323-latin-400-normal.woff2?url';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import CrtOverlay from '../../common/crt-overlay/CrtOverlay';
import GlowLogo from '../../common/glow-logo/GlowLogo';
import Ltr from '../../common/ltr/Ltr';
import MazeBackground from '../../common/maze-background/MazeBackground';
import PillBadge from '../../common/pill-badge/PillBadge';
import TerminalButton from '../../common/terminal-button/TerminalButton';
import TypeLine from '../../common/type-line/TypeLine';
import { useLocalizedPath } from '../../../i18n/locale';
import { useAppSelector } from '../../../redux/hooks';
import { selectHours, selectSettings } from '../../../redux/settings-slice';
import { isOpenNow, nextChange } from '../../../utils/hours';
import { prefersReducedMotion } from '../../../utils/motion';
import './Hero.css';

const BOOT_KEY = 'thelab-boot';

function formatHm(date: Date): string {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Jerusalem',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).format(date);
}

function bootAlreadySeen(): boolean {
  if (prefersReducedMotion()) return true;
  try {
    return window.sessionStorage.getItem(BOOT_KEY) === 'done';
  } catch {
    return true;
  }
}

export default function Hero() {
  const { t } = useTranslation();
  const localize = useLocalizedPath();
  const settings = useAppSelector(selectSettings);
  const hours = useAppSelector(selectHours);
  const [now, setNow] = useState(() => new Date());
  const [booting, setBooting] = useState(() => !bootAlreadySeen());

  useEffect(() => {
    const clock = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(clock);
  }, []);

  const dismissBoot = useCallback(() => {
    try {
      window.sessionStorage.setItem(BOOT_KEY, 'done');
    } catch {
      // The session flag is optional. The overlay still closes.
    }
    setBooting(false);
  }, []);

  useEffect(() => {
    if (!booting) return undefined;
    let timer = 0;
    function finish(): void {
      if (document.querySelector('dialog[open]')) return;
      dismissBoot();
    }
    function arm(): void {
      if (timer || document.querySelector('dialog[open]')) return;
      timer = window.setTimeout(finish, 1200);
    }
    arm();
    const watch = window.setInterval(arm, 200);
    window.addEventListener('keydown', finish);
    window.addEventListener('pointerdown', finish);
    return () => {
      window.clearTimeout(timer);
      window.clearInterval(watch);
      window.removeEventListener('keydown', finish);
      window.removeEventListener('pointerdown', finish);
    };
  }, [booting, dismissBoot]);

  const open = isOpenNow(hours, now);
  const change = nextChange(hours, now);
  const time = change ? formatHm(change.at) : '';

  return (
    <section className="hero">
      <link rel="preload" href={tight700} as="font" type="font/woff2" crossOrigin="anonymous" />
      <link rel="preload" href={pixel400} as="font" type="font/woff2" crossOrigin="anonymous" />
      <link rel="preload" as="image" href="/brand/patterns/pattern-maze-black-thumb.webp" />
      <MazeBackground variant="black" opacity={0.15} />
      <div className="hero-vignette" aria-hidden="true" />
      <CrtOverlay flicker={!prefersReducedMotion()} />
      <div className="hero-copy">
        <GlowLogo variant="stacked" colour="green" glow label="THE LAB" />
        <div className="hero-tagline" lang="en">
          <TypeLine text={t('home.tagline')} />
        </div>
        <p className="hero-accent t-pixel" lang="ja" aria-hidden="true">{t('home.accent')}</p>
        <PillBadge>
          {open ? t('home.nodeOnline') : t('home.nodeOffline')}
          {time ? <> <Ltr>{time}</Ltr></> : null}
        </PillBadge>
        <div className="hero-actions">
          <TerminalButton className="cta-lg" href={settings.reservationUrl} newTabLabel={t('common.opensNewTab')}>
            {t('common.book')}
          </TerminalButton>
          <Link className="terminal-button terminal-button--outline terminal-button--md cta-lg" to={localize('/take-me-home')}>
            {t('home.takeMeHome')}
          </Link>
        </div>
      </div>
      {booting ? (
        <div className="hero-boot" role="status">
          <p className="t-mono" lang="en">BOOT // NODE TLV</p>
          <button type="button" className="hero-skip t-mono" onClick={dismissBoot}>
            {t('home.skipBoot')}
          </button>
        </div>
      ) : null}
    </section>
  );
}
