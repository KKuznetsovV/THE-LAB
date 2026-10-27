# THE LAB — thelabtlv.com

Website for **THE LAB by TYO**, an experimental cocktail bar at Ahad Ha'am 1, Neve Tzedek, Tel Aviv.
"Networking the experimental underground."

Public site (Hebrew / English), bottled-cocktail delivery showcase ("Take Me Home"), one-tap
reservations and delivery, and an admin panel so the team can edit the menu, prices, hours and events.

- Brand system: [docs/BRAND.md](docs/BRAND.md) (brand by Eliezer House, 2026)
- Content seed & business facts: [docs/CONTENT.md](docs/CONTENT.md)
- Architecture & decisions: [system_architecture.md](system_architecture.md)

## Tech stack

Node.js 24 · Express 5 · TypeScript · Joi · Sequelize + MySQL · MinIO ·
React 19 · Vite · Redux Toolkit · React Router 7 · React Hook Form · i18next · nginx · Docker Compose.

## Build gate

```bash
node scripts/check.mjs        # installs (if needed), builds, lints every package
```

## Frontend (dev)

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173. Hebrew is at `/` (`lang="he"` `dir="rtl"`). English is under `/en`.
In dev, http://localhost:5173/styleguide shows the brand tokens and primitives. It is omitted from production builds.

## Content API (dev)

```bash
docker compose up -d database
cd content-service
npm install
npm run dev
```

MySQL is published on `localhost:3307` (root password `thelab` in the dev compose file). The content service listens on http://localhost:3109 and creates `thelab_content` on startup, seeding from `db/seed.sql` only while the cocktails table is empty. The identity service listens on http://localhost:3110, creates `thelab_identity`, and seeds the first owner only when `THELAB_ADMIN_EMAIL` and `THELAB_ADMIN_PASSWORD` are set and no admins exist.

Public reads: `/api/health`, `/api/cocktails`, `/api/cocktails/:code`, `/api/bottles`, `/api/spirits`, `/api/events`, `/api/gallery`, `/api/hours`, `/api/settings`.

```bash
cd identity-service
npm install
THELAB_ADMIN_EMAIL=owner@thelabtlv.com THELAB_ADMIN_PASSWORD=change-me-strong-password npm run dev
```
