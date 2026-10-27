import { useCallback, useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import GlowLogo from '../../../common/glow-logo/GlowLogo';
import StatusBar from '../../../common/status-bar/StatusBar';
import TerminalButton from '../../../common/terminal-button/TerminalButton';
import { useDelivery } from '../../../../hooks/use-delivery';
import { useLocalizedPath } from '../../../../i18n/locale';
import { isOpenNow, nextChange } from '../../../../utils/hours';
import { defaultHours, siteDefaults } from '../../../../utils/site-defaults';
import LanguageSwitch from '../language-switch/LanguageSwitch';
import './Header.css';

const LINKS = [
  ['/menu', 'nav.menu'],
  ['/take-me-home', 'nav.takeMeHome'],
  ['/events', 'nav.events'],
  ['/archive', 'nav.archive'],
  ['/about', 'nav.about'],
  ['/visit', 'nav.visit'],
] as const;

function formatHm(date: Date): string {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Jerusalem',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).format(date);
}

export default function Header() {
  const { t } = useTranslation();
  const localize = useLocalizedPath();
  const { order } = useDelivery();
  const [compact, setCompact] = useState(() => window.scrollY > 8);
  const [menuOpen, setMenuOpen] = useState(false);
  const [now, setNow] = useState(() => new Date());
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  useEffect(() => {
    const onScroll = () => setCompact(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    const clock = window.setInterval(() => setNow(new Date()), 1000);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.clearInterval(clock);
    };
  }, []);

  const open = isOpenNow(defaultHours, now);
  const change = nextChange(defaultHours, now);
  const time = change ? formatHm(change.at) : '';
  const status = open ? t('common.openUntil', { time }) : t('common.closedOpens', { time });

  return (
    <header className={compact ? 'site-header is-compact' : 'site-header'}>
      <StatusBar><span>{status}</span></StatusBar>
      <div className="site-header-row">
        <Link className="site-logo" to={localize('/')} aria-label="THE LAB">
          <GlowLogo variant="horizontal" colour="green" />
        </Link>
        <nav className="site-nav" aria-label={t('common.siteNav')}>
          {LINKS.map(([path, key]) => (
            <NavLink key={path} to={localize(path)}>{t(key)}</NavLink>
          ))}
        </nav>
        <LanguageSwitch />
        <div className="site-header-actions">
          <TerminalButton href={siteDefaults.reservationUrl} newTabLabel={t('common.opensNewTab')}>
            {t('common.book')}
          </TerminalButton>
          <TerminalButton variant="outline" onClick={order}>{t('common.order')}</TerminalButton>
        </div>
        <button
          type="button"
          className="menu-toggle t-mono"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(true)}
        >
          {t('common.openMenu')}
        </button>
      </div>
      {menuOpen ? <NavOverlay onClose={closeMenu} /> : null}
    </header>
  );
}

function NavOverlay({ onClose }: { onClose: () => void }) {
  const { t } = useTranslation();
  const localize = useLocalizedPath();

  useEffect(() => {
    const root = document.getElementById('nav-overlay');
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    document.body.classList.add('scroll-lock');
    const focusable = () => (
      root ? [...root.querySelectorAll<HTMLElement>('a, button')] : []
    );
    focusable()[0]?.focus();

    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose();
        return;
      }
      if (event.key !== 'Tab' || !root) return;
      const items = focusable();
      const first = items[0];
      const last = items[items.length - 1];
      if (!first || !last) return;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener('keydown', onKey);
    return () => {
      document.body.classList.remove('scroll-lock');
      document.removeEventListener('keydown', onKey);
      previous?.focus();
    };
  }, [onClose]);

  return (
    <div id="nav-overlay" className="nav-overlay" role="dialog" aria-modal="true" aria-label={t('common.openMenu')}>
      <button type="button" className="menu-toggle t-mono" onClick={onClose}>{t('common.closeMenu')}</button>
      <nav className="nav-overlay-links">
        {LINKS.map(([path, key]) => (
          <NavLink key={path} to={localize(path)} onClick={onClose}>{t(key)}</NavLink>
        ))}
      </nav>
      <LanguageSwitch />
    </div>
  );
}
