# THE LAB by TYO — Brand Spec for the Website

Source: Eliezer House brand archive (https://eliezer.house/the-lab, "archive terminal", 2026).
This file is the single source of truth for visual decisions. If code and this file disagree, this file wins.

---

## 1. Identity

| Item | Value |
|---|---|
| Name | **THE LAB** (formal: THE LAB by TYO, THE LAB · BY TYO) |
| Previous name | 7to1 LAB / 7to1lab.com (retired — never show it in the UI, only in redirects) |
| Domain | thelabtlv.com |
| Instagram | @thelab.tlv |
| Address | Ahad Ha'am 1, Neve Tzedek, Tel Aviv (אחד העם 1, נווה צדק) |
| Tagline | NETWORKING THE EXPERIMENTAL UNDERGROUND (short form: NETWORKING THE EXPERIMENTAL) |
| Japanese accents | ザ・ラボ (The Lab) · ザ・ラボ・バイ・トーキョー (The Lab by Tokyo) · 高級地下 ("high-class underground") · 試作品・品名 (prototype · product name) · 蒸溜日 (distillation date) · 好評発売中 (on sale now) · 接続済み (connected) · リキッド・レコーズ (Liquid Records) · ラボ・クラシックス (Lab Classics) · オールモスト・クラシックス (Almost Classics) |
| Easter-egg coordinates | `132.06325 : 134.76801` (printed on labels/menus — use as a decorative "node address") |
| System labels | `TYO // LAB.NODE-01`, `HH:MM:SS // TLV` (live clock), `THE LAB / PRIVATE WINDOW`, `接続済み / CONNECTED` |

Japanese is **decorative only**: render it with `lang="ja"` and `aria-hidden="true"` when it duplicates visible English/Hebrew. It is never a locale.

## 2. Concept → Web translation

The print system mixes two worlds. The site should do the same, with restraint:

1. **The terminal (screen)** — near-black green ground, phosphor-green mono text, glow, scanlines, maze texture, status bars, bracketed values. Used for chrome: header, footer, navigation, hero, buttons, system messages, admin.
2. **The paper (print)** — cream/grey paper cards with black Aktiv-style type, like the printed menu and bottle labels. Used for content that must be read: menu items, bottles, events, legal text.
3. **The retro browser window** — a 90s OS window with title bar `THE LAB / PRIVATE WINDOW`, `– □ ×` controls, a URL bar showing `https://thelabtlv.com/...` and a status bar `接続済み / CONNECTED`. Used as a frame for featured modules (Take Me Home bottles, featured event, gallery lightbox).
4. **Element tiles** — every cocktail has a 2–3 letter code with a superscript index, like a periodic table cell (`BTT⁰¹`, `TXC⁰²`, `NF¹⁷⁻²¹`). Use as the cocktail's visual identity on cards and in the photo index.
5. **Bracketed prices** — prices always render as `[₪64]` / `[64₪]` (RTL), mono font.
6. **Flavour icons** — 17 pictograms, shown in brackets as labels: `[FRUITY]`.

"Modern and clean" = effects stay subtle and are concentrated in the hero and accents. Body content is calm, high-contrast, generous spacing.

## 3. Colour

### Brand palette (from the brand sheet — swatch fills)
| Token | Hex | Name |
|---|---|---|
| `--acid-green` | `#00FF0D` | Acid green — **primary** (logo, primary CTA, active states) |
| `--acid-pink` | `#FF0F8E` | Acid pink — secondary accent (hover, "live/new" badges, alerts) |
| `--powder-grey` | `#DAD7D2` | Powder grey (paper cards) |
| `--smoke-grey` | `#B6B5B0` | Smoke grey |
| `--silver` | `#9CA1A5` | Silver |
| `--warm-ash` | `#D4CBC2` | Warm ash (paper alt) |
| `--power-blue` | `#2CB6D5` | Ecstasy · bold |
| `--power-pink` | `#EF5788` | Ecstasy · bold |
| `--soft-blue` | `#A3BFCA` | Ecstasy · pale |
| `--muted-pink` | `#E5A1AB` | Ecstasy · pale |
| `--soft-orange` | `#F6A25D` | Ecstasy · pale |
| `--banana` | `#FFE39A` | Ecstasy · pale |

### Terminal UI palette (from the archive site)
| Token | Value | Use |
|---|---|---|
| `--bg` | `#020B05` | page background (also `<meta name="theme-color">`) |
| `--ink` | `#9DFFBF` | default text on dark |
| `--muted` | `#94EFBB` | secondary text on dark |
| `--dim` | `#6FC99A` | tertiary text / captions on dark |
| `--line` | `rgba(94,255,160,.24)` | 1px borders, dividers |
| `--glow` | `0 0 6px rgba(94,255,160,.5), 0 0 16px rgba(40,255,120,.18)` | text-shadow on display type only |
| `--paper-ink` | `#0A0A0A` | text on paper cards |

Rules:
- Acid green on `--bg` is for large type, icons and buttons. For body text on dark use `--ink`.
- Never put acid green text on paper/grey; on paper use `--paper-ink`, with acid green only as a filled block (e.g. a tag) carrying black text.
- Ecstasy colours are seasonal/flavour accents (e.g. flavour filter chips, event categories). Max one Ecstasy colour per component.
- All text must meet WCAG 2.1 AA contrast. Verify every token pair you use.

## 4. Typography

| Role | Brand font | Licence status | Web stand-in (self-hosted via @fontsource) |
|---|---|---|---|
| Headers | **Aktiv Grotesk** Bold (Medium for small labels), headline 86–96px | Commercial (Dalton Maag) | `Inter Tight` 700/500 |
| Sub-headers | **Narkiss Yair** Bold, 50px | **TRIAL licence in the sheet — must be bought before launch** | `Heebo` 700 |
| Body | **Narkiss Yair** Regular, 20px | same | `Heebo` 400 |
| Terminal / UI | system mono stack | free | `ui-monospace, "SF Mono", Menlo, Consolas, "IBM Plex Mono", "Noto Sans Mono", "Noto Sans Hebrew", monospace` |
| Pixel accents | VT323 / DotGothic16 (Japanese) | free (OFL) | `VT323`, `DotGothic16` |

Implementation: define `--font-head`, `--font-body`, `--font-mono`, `--font-pixel` with the brand font first and the stand-in second, and keep empty `@font-face` slots (`/fonts/aktiv-grotesk-*.woff2`, `/fonts/narkiss-yair-*.woff2`) so licensed files can be dropped in later with no code change.

Type scale (desktop → mobile): display 96→56, h1 64→40, h2 50→32, h3 32→24, body 20→17, small 16→14, mono label 12–13 with `letter-spacing: .12em; text-transform: uppercase`.
Hebrew: same scale; never letter-space Hebrew; never uppercase-transform Hebrew strings.

## 5. Logo

Custom wordmark "THE LAB" in two arrangements, three colours each:
- `the-lab-logo-stacked-{black|white|green}.{svg|png}`
- `the-lab-logo-horizontal-{black|white|green}.{svg|png}`
- BY TYO lockups exist only in the designer's `logo.ai` (not exported) — request them if needed.

Usage: green on `--bg` (default), white on photography, black on paper/grey. Clear space ≥ the height of the "A" crossbar gap. Minimum width: horizontal 96px, stacked 64px. Never stretch, recolour, outline or add effects except the CRT glow in the hero.

## 6. Pattern & texture

- **Maze** pattern: green ground (flyer/coaster back), black ground (archive site background), grey ground (alternative). Web use: black-ground tile as a subtle page background (opacity ≤ .35, fixed attachment on desktop only); green-ground for full-bleed breaker sections.
- **CRT scanlines**: 1px horizontal lines every 3px at ~6% opacity, overlay with `pointer-events: none`. Optional faint flicker — disabled under `prefers-reduced-motion`.
- **Paper grain**: subtle noise on paper cards (CSS or tiny webp), optional.

## 7. Flavour icons (17)

`fruity` (cherries) · `floral` (flower) · `spicy` (flame) · `chocolate` · `herbal` (cactus) · `sweet` (candy) · `anise` (star anise) · `deep` (spiral) · `strong` (bomb) · `sour` (lightning) · `oumami` (eye — keep the brand spelling in file names, display "UMAMI") · `na` (crossed drop — non-alcoholic) · `tangy` (yin-yang) · `smokey` (cloud) · `bitter` (broken heart) · `fresh` (snowflake) · `sparkling` (bubbles)

Display label format: `[FRUITY]` in mono caps (EN) / Hebrew label without brackets transformation issues (HE).
Hebrew labels (proposed — owner to confirm): פירותי, פרחוני, חריף, שוקולדי, עשבוני, מתוק, אניס, עמוק, חזק, חמוץ, אומאמי, ללא אלכוהול, חמצמץ, מעושן, מר, רענן, מבעבע.

## 8. Asset URLs (download into `frontend/public/brand/`)

Base: `https://eliezer.house/the-lab`
- Logos: `/brand/the-lab-logo-{stacked|horizontal}-{black|white|green}.{svg|png}` (12 files)
- Icons: `/brand/icons/{fruity,floral,spicy,chocolate,herbal,sweet,anise,deep,strong,sour,oumami,na,tangy,smokey,bitter,fresh,sparkling}.svg`
- Patterns: `/brand/pattern-maze-{green|black|grey}.png` (+ `-thumb.webp`), tile `/assets/maze-tile.webp`
- Menu renders (reference only, not for production): `/tyo-menu/en.webp`, `/tyo-menu/he.webp`, `/flyer/front.webp`, `/flyer/back.webp`
- Production print files and cocktail photography (by LIZA) live in the designer's Dropbox / Google Drive folders linked from the archive page — the owner downloads them manually.

## 9. Print touch-points worth echoing on the web

- **Menu**: sections LIQUID RECORDS (cocktails named after songs), THE LAB CLASSICS, 99% (almost classics), SPIRITS; photo index of element tiles; selective spot-UV on black → use glossy hover sheen on dark tiles.
- **TAKE ME HOME** (bottled cocktails): 200 ml / 500 ml clear glass bottles, cream front label with `試作品・品名` field and `蒸溜日 [ / ]` date field, +18 mark; delivery in a BLACK BOX with garnish bag; green flyer with a 7-step comic serving guide (1 ice → 2 pour → 3 stir stir stir → 4 garnish out of the bag → 5 "you know where to put it" → 6 enjoy → 7 then enjoy some more) and a QR code.
- **Entrance sign**: neon box with the stacked logo inside an organic blob outline → good motif for the 404 page / loading state.
- **Instagram highlight pills**: embossed pills (THE LAB, WOLT, CHERRY, COBRA, EYE, APPLE, ONI, DICE, BROKEN HEART, SMILEY…). Use only the pills with original artwork; **do not use the KITTY or CHEBURASHKA pills on the website** (third-party characters).

## 10. Voice

Short, dry, confident, a bit cheeky ("You know where to put it"). System-message tone for UI chrome (`CONNECTING…`, `NODE ONLINE`, `ERR 404 // NODE NOT FOUND`). Hebrew copy is natural Hebrew, not translated English. No exclamation marks in UI chrome.
