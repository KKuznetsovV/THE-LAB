import { useEffect, useState } from 'react';
import BlinkCursor from '../common/blink-cursor/BlinkCursor';
import CrtOverlay from '../common/crt-overlay/CrtOverlay';
import ElementTile from '../common/element-tile/ElementTile';
import FlavourIcon from '../common/flavour-icon/FlavourIcon';
import { FLAVOUR_KEYS } from '../common/flavour-icon/flavours';
import GlowLogo from '../common/glow-logo/GlowLogo';
import InlineToast from '../common/inline-toast/InlineToast';
import MazeBackground from '../common/maze-background/MazeBackground';
import PaperCard from '../common/paper-card/PaperCard';
import PillBadge from '../common/pill-badge/PillBadge';
import PriceTag from '../common/price-tag/PriceTag';
import RetroWindow from '../common/retro-window/RetroWindow';
import SectionHeader from '../common/section-header/SectionHeader';
import StatusBar from '../common/status-bar/StatusBar';
import TerminalButton from '../common/terminal-button/TerminalButton';
import TerminalLoader from '../common/terminal-loader/TerminalLoader';
import TypeLine from '../common/type-line/TypeLine';
import './Styleguide.css';

const SWATCHES = [
  'acid-green', 'acid-pink', 'powder-grey', 'smoke-grey', 'silver', 'warm-ash',
  'power-blue', 'power-pink', 'soft-blue', 'muted-pink', 'soft-orange', 'banana',
  'bg', 'ink', 'muted', 'dim', 'paper-ink',
] as const;

type Locale = 'he' | 'en';

export default function Styleguide() {
  const [locale, setLocale] = useState<Locale>('he');

  useEffect(() => {
    const root = document.documentElement;
    const previousLang = root.lang;
    const previousDir = root.dir;
    root.lang = locale;
    root.dir = locale === 'he' ? 'rtl' : 'ltr';
    return () => {
      root.lang = previousLang;
      root.dir = previousDir;
    };
  }, [locale]);

  return (
    <div className="styleguide">
      <CrtOverlay />
      <header className="styleguide-bar">
        <h1>Styleguide</h1>
        <div className="styleguide-switch">
          <button type="button" onClick={() => setLocale('he')} aria-pressed={locale === 'he'}>עב</button>
          <button type="button" onClick={() => setLocale('en')} aria-pressed={locale === 'en'}>EN</button>
        </div>
      </header>

      <section>
        <h2>Tokens</h2>
        <ul className="swatches">
          {SWATCHES.map((name) => (
            <li key={name}>
              <span className="swatch" style={{ background: `var(--${name})` }} />
              <span className="t-mono">{name}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="type-grid">
        <div lang="en" dir="ltr">
          <p className="t-display">Display</p>
          <h1>Heading one</h1>
          <h2>Heading two</h2>
          <h3>Heading three</h3>
          <p>Body text for the menu and the story.</p>
          <p className="t-mono">Mono label</p>
        </div>
        <div lang="he" dir="rtl">
          <p className="t-display">תצוגה</p>
          <h1>כותרת ראשית</h1>
          <h2>כותרת משנה</h2>
          <h3>כותרת שלישית</h3>
          <p>טקסט גוף לתפריט ולסיפור.</p>
          <p className="t-mono">תווית</p>
        </div>
      </section>

      <section>
        <h2>Logos</h2>
        <div className="row">
          <GlowLogo variant="stacked" colour="green" glow />
          <GlowLogo variant="stacked" colour="white" />
          <GlowLogo variant="horizontal" colour="green" />
          <GlowLogo variant="horizontal" colour="white" />
          <span className="on-paper"><GlowLogo variant="horizontal" colour="black" /></span>
          <span className="on-paper"><GlowLogo variant="stacked" colour="black" /></span>
        </div>
      </section>

      <section>
        <h2>Maze</h2>
        <div className="frames">
          {(['black', 'green', 'grey'] as const).map((variant) => (
            <div key={variant} className="frame">
              <MazeBackground variant={variant} opacity={variant === 'black' ? 0.35 : 0.9} />
              <span className="t-mono frame-label">{variant}</span>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2>Status</h2>
        <StatusBar>
          <span>{locale === 'he' ? 'פתוח עכשיו' : 'OPEN NOW'}</span>
        </StatusBar>
      </section>

      <section>
        <h2>Buttons</h2>
        {(['primary', 'outline', 'ghost'] as const).map((variant) => (
          <div key={variant} className="row">
            {(['sm', 'md', 'lg'] as const).map((size) => (
              <TerminalButton key={size} variant={variant} size={size}>{variant} {size}</TerminalButton>
            ))}
            <TerminalButton variant={variant} href="https://thelabtlv.com">External</TerminalButton>
          </div>
        ))}
      </section>

      <section>
        <h2>Windows</h2>
        <div className="stack">
          <RetroWindow url="https://thelabtlv.com/take-me-home" tone="light">
            <SectionHeader kicker="TAKE ME HOME" title={locale === 'he' ? 'לקחת הביתה' : 'Take it home'} japanese="好評発売中" />
            <PriceTag price={64} locale={locale} />
          </RetroWindow>
          <RetroWindow url="https://thelabtlv.com/" tone="dark">
            <p>{locale === 'he' ? 'חלון כהה' : 'Dark window'}</p>
          </RetroWindow>
        </div>
      </section>

      <section>
        <h2>Tiles and prices</h2>
        <div className="row">
          {(['sm', 'md', 'lg'] as const).map((size) => (
            <ElementTile key={`d-${size}`} code="BTT" indexLabel="01" size={size} tone="dark" />
          ))}
          <ElementTile code="TXC" indexLabel="02" tone="paper" />
          <ElementTile code="NF" indexLabel="17–21" tone="green" />
          <PriceTag price={64} locale="en" />
          <PriceTag price={64} locale="he" />
        </div>
      </section>

      <section>
        <h2>Flavours</h2>
        <div className="row">
          {FLAVOUR_KEYS.map((key) => (
            <FlavourIcon key={key} flavour={key} locale={locale} labelled />
          ))}
        </div>
      </section>

      <section>
        <h2>Paper, badges, toast</h2>
        <div className="stack">
          <PaperCard>
            <SectionHeader kicker="LAB CLASSICS" title="Basilicium" japanese="ラボ・クラシックス" />
            <p>basil hydrosol, lime hydrosol, gin</p>
            <div className="row">
              <PillBadge>SIGNATURE</PillBadge>
              <PillBadge tone="pink">NEW</PillBadge>
              <PillBadge>18+</PillBadge>
              <PillBadge tone="pink">SOLD OUT</PillBadge>
            </div>
          </PaperCard>
          <PaperCard tone="ash">
            <p>{locale === 'he' ? 'כרטיס אפור חם' : 'Warm ash card'}</p>
          </PaperCard>
          <InlineToast>NODE ONLINE</InlineToast>
          <InlineToast tone="success">SAVED</InlineToast>
          <InlineToast tone="error" onDismiss={() => undefined}>ERR // RETRY</InlineToast>
        </div>
      </section>

      <section>
        <h2>Motion</h2>
        <TypeLine text={locale === 'he' ? 'רשת של ניסוי תת-קרקעי' : 'NETWORKING THE EXPERIMENTAL UNDERGROUND'} />
        <p><BlinkCursor /></p>
        <TerminalLoader />
      </section>
    </div>
  );
}
