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

Run instructions are added as the services land (see "Current Progress" in `system_architecture.md`).
