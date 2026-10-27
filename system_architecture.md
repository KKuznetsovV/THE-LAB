# Project Architecture & Context — THE LAB website (thelabtlv.com)

Always read this file, `docs/BRAND.md` and `docs/CONTENT.md` before writing code.
Adhere strictly to the tech stack and the Established Decisions below. If a task requires
breaking one, stop and say so instead of silently deviating. Keep this file current: every
step updates "Current Progress & Next Steps" and appends any new decision.

Folder layout and code conventions mirror the BetterX project
(https://github.com/KKuznetsovV/BetterX): one folder per deployable, `config/` per service,
`src/{app.ts,controllers,routers,middlewares,models,db}` per service, and a React SPA in
`frontend/` with `components/`, `hooks/`, `redux/`, `services/`, `utils/`.

## Core Tech Stack
- Services: Node.js 24, Express 5, TypeScript (strict), Joi validation, Sequelize (sequelize-typescript) on MySQL 8, node-config.
- Frontend: React 19, Vite, TypeScript (strict), Redux Toolkit, React Router 7 (library mode, `BrowserRouter`), React Hook Form, Axios, i18next + react-i18next. Plain CSS with custom properties, one `.css` file next to each component (no Tailwind, no CSS-in-JS).
- Shared: `lib/` (`@thelab/lib`) — enums, constants and DTO types shared by services and frontend, dual ESM/CJS build, `dist/` committed (same approach as BetterX's `lib/`).
- Storage: MySQL (database per service), MinIO (S3-compatible) for images.
- Gateway: nginx inside the `frontend` image, path-based routing to services; static prerendered HTML for public routes.
- Tooling: ESLint (flat config, typescript-eslint), `scripts/check.mjs` build gate, GitHub Actions CI, Docker Compose.

## Services

| Folder | Port | Responsibility | Routes (all under `/api`) |
|---|---|---|---|
| `frontend` | 5173 dev / 80 in container (host 8080) | Public site (HE default at `/`, EN at `/en`), admin panel (`/admin`), nginx gateway | — |
| `identity-service` | 3110 | Admin users, login, JWT issuing | `/api/auth/*`, `/api/admins/*` |
| `content-service` | 3109 | Menu, bottles, spirits, events, gallery, hours, site settings | `/api/cocktails`, `/api/bottles`, `/api/spirits`, `/api/events`, `/api/gallery`, `/api/hours`, `/api/settings`, `/api/health` |
| `media-service` | 3106 | Presigned image uploads to MinIO | `/api/uploads/*` |
| `database` | 3306 (host 3307) | MySQL 8, schemas `thelab_identity`, `thelab_content` | — |
| `minio` | 9000/9001 (host 9200/9201) | Object storage, bucket `thelab-media` (public-read `images/*`) | served via gateway at `/media/*` |

## Planned repository layout

```
thelab-web/
├── .cursor/rules/            project.mdc (always-on context) · workflow.mdc (git + build gate)
├── .github/workflows/        check.yml (CI: node scripts/check.mjs)
├── docs/                     BRAND.md · CONTENT.md · (later) CONTRAST.md, LAUNCH_CHECKLIST.md, screenshots/
├── db/                       Dockerfile · seed.sql (content seed replayed idempotently by content-service)
├── lib/                      src/ (enums, constants, DTOs) · dist/ (committed) · package.json · tsconfig*.json
├── identity-service/         config/ · src/{app.ts, controllers/{auth,admins}, routers, middlewares, models, db} · Dockerfile
├── content-service/          config/ · src/{app.ts, controllers/<resource>/{controller,validator}.ts, routers, middlewares, models, db} · Dockerfile
├── media-service/            config/ · src/{app.ts, aws/s3.ts, controllers/uploads, routers, middlewares} · Dockerfile
├── frontend/
│   ├── public/brand/{logo,icons,patterns}/ · public/fonts/ · public/og/
│   ├── src/components/app/{App.tsx, layout/{layout,header,footer,main,action-bar,not-found}}
│   ├── src/components/common/<primitive>/   (TerminalButton, RetroWindow, ElementTile, PriceTag, FlavourIcon, …)
│   ├── src/components/{home,menu,take-me-home,visit,events,archive,about,legal,admin}/
│   ├── src/components/models/   src/hooks/   src/i18n/   src/redux/   src/services/{public,auth-aware}/   src/utils/
│   ├── nginx.conf · Dockerfile · .env.development · .env.docker · .env.production
├── scripts/                  check.mjs · fetch-brand-assets.mjs · prerender.mjs · sitemap.mjs
├── docker-compose.yaml · docker-compose.prod.yaml · .env.example · README.md · system_architecture.md
```

## Established Decisions
1. Monorepo without npm workspaces; every deployable has its own `package.json` and lockfile (mirrors BetterX). Shared code only through `lib/` (`"@thelab/lib": "file:../lib"`).
2. Every service uses node-config with `config/{default,docker,compose,production}.json` and maps secrets/env via its own `config/custom-environment-variables.json`. No central config folder.
3. All service HTTP routes live under `/api/...` so nginx can never collide with SPA routes such as `/menu` (deliberate deviation from BetterX's root-level routes). nginx uses `resolver 127.0.0.11` + `set $upstream ...; proxy_pass $upstream;` with no path suffix, so URIs pass through unchanged.
4. Database-per-service on one MySQL server. Each service runs `ensureDatabaseExists()` then `sequelize.sync()` at startup; content is seeded idempotently from `db/seed.sql` only when tables are empty. The first admin is seeded from env (`THELAB_ADMIN_EMAIL` / `THELAB_ADMIN_PASSWORD`), never from SQL.
5. Auth: admins only (no public accounts). Passwords hashed with bcryptjs (cost 12) — a deliberate upgrade over BetterX's HMAC. JWT HS256 signed with `app.jwtSecret`, payload `{ id, name, email, role }` only, 8h expiry. Every service verifies JWTs locally with the shared secret. Roles: `owner` (everything incl. managing admins) and `editor` (content only). Services refuse to start in `production` with the default secret.
6. Public GET endpoints need no auth and return only published, non-deleted records. All writes require a valid admin JWT. Content records use soft delete (`paranoid: true`) with restore.
7. Reservations and delivery are deep links stored in Site Settings (`reservationUrl`, `deliveryUrl`, `woltUrl`, …). No on-site checkout, no payments, no personal data collection.
8. i18n: Hebrew is the default locale at `/` (RTL), English lives under `/en` (LTR). All UI strings go through i18next dictionaries (`frontend/src/i18n/locales/{he,en}.ts`, EN typed against HE). Content has paired columns (`nameHe`/`nameEn`, …). CSS uses logical properties only (`margin-inline-start`, `inset-inline-end`, …). Japanese text is decorative (`lang="ja"`, `aria-hidden` when duplicated) and never a locale.
9. Visual system comes only from `docs/BRAND.md` tokens in `frontend/src/index.css`. No hard-coded colours or font families inside component CSS.
10. TypeScript: no `any`, no non-null assertions on data from the network, typed Axios error extraction (`getErrorMessage(e: unknown)`), DTOs imported from `@thelab/lib`.
11. Accessibility target: WCAG 2.1 AA / Israeli standard IS 5568. No accessibility overlay widgets. All motion respects `prefers-reduced-motion`. An 18+ age gate is shown on first visit.
12. Privacy & performance: no third-party trackers, no embedded Google Maps or Instagram widgets (link out instead), fonts self-hosted via @fontsource, images lazy-loaded with fixed aspect ratios.
13. Images are uploaded straight from the browser to MinIO with presigned POST policies from media-service (type whitelist, 8 MB cap); records store the public URL plus alt text in both languages.
14. Prices are integers in ILS. UI renders them in brackets with the mono font: `[₪64]` (EN) / `[64₪]` (HE).
15. Git: one branch per step (`<type>/<NN>-<slug>`), build gate (`node scripts/check.mjs`) must be green before commit and before merge, `--no-ff` merges into `main`, remote step branches are kept for history. See `.cursor/rules/workflow.mdc`.

## Current Progress & Next Steps
- [x] 00 Bootstrap — repo, rules, build gate, CI (`chore/00-bootstrap`)
- [x] 01 Frontend scaffold (`feat/01-frontend-scaffold`)
- [x] 02 Design system & brand primitives (`feat/02-design-system`)
- [x] 03 Layout, i18n/RTL, age gate (`feat/03-layout-i18n`)
- [ ] 04 Shared lib, DB, content-service read API (`feat/04-content-read-api`)
- [ ] 05 identity-service & admin auth (`feat/05-identity-service`)
- [ ] 06 content-service write API (`feat/06-content-write-api`)
- [ ] 07 media-service & MinIO uploads (`feat/07-media-service`)
- [ ] 08 Frontend data layer & Home page (`feat/08-home`)
- [ ] 09 Menu page (`feat/09-menu`)
- [ ] 10 Take Me Home, Visit/Book, Events, Archive, About, legal pages (`feat/10-pages`)
- [ ] 11 Admin panel (`feat/11-admin`)
- [ ] 12 SEO, performance, accessibility (`feat/12-seo-perf-a11y`)
- [ ] 13 Docker, gateway, production compose (`chore/13-docker-deploy`)
- [ ] 14 QA, docs, v1.0.0 (`chore/14-launch`)

## Residual Risk / Open Items (owner)
- Brand fonts: Aktiv Grotesk (commercial) and Narkiss Yair (TRIAL licence in the brand sheet) must be licensed for web before launch; stand-ins are used until then.
- Content marked ⚠️ in `docs/CONTENT.md` (hours, prices, Wolt URL, legal wording, accessibility coordinator) must be confirmed by the owner.
- Ontopo / BeeComm / Wolt URLs can change; they are admin-editable on purpose.
