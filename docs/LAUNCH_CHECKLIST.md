# Launch checklist

Owner items stay open until someone confirms them. The site ships with the kit fallbacks.

## Owner must confirm

- [ ] Font licences: Aktiv Grotesk (commercial) and Narkiss Yair (trial in the brand sheet). The site uses Inter Tight, Heebo, and VT323 until those are licensed.
- [ ] Final menu prices and the Take Me Home line-up. The printed bottle list numbers two items "5".
- [ ] Hours and happy hour. The kit hours come from older listings (happy hour 18:00–20:00).
- [ ] Phone `03-670-0112` and the public email (old address was the previous bar's Gmail).
- [ ] Wolt URL. The brand has a Wolt pill; no dedicated THE LAB Wolt page is confirmed. TYO's page is the fallback.
- [ ] Delivery: BeeComm stays at `https://tyo.web.delivery/`.
- [ ] Ontopo: `https://ontopo.com/he/il/page/79274624` is the current book link. The older slug `https://ontopo.co.il/7to1LAB` is unused in the UI.
- [ ] Statutory alcohol-warning wording (Hebrew and English).
- [ ] Accessibility coordinator: name, phone, email, and the date of the last audit.
- [ ] Cocktail photography. Seed records have no photos.
- [ ] BY TYO logo lockup (only in the designer's `logo.ai`).
- [ ] Instagram and Facebook: the old site still links `@7to1lab` / `facebook.com/7to1lab`. Confirm the new handles before changing the bio link.
- [ ] Google Maps short link `https://g.co/kgs/kCkXwj`.
- [ ] Private events `https://bit.ly/7to1events` and gift cards `https://valuecard.co.il/GiftCards/COCKTAILLAB#Welcome`.

## DNS cutover

- [ ] Lower TTL on `thelabtlv.com`, `www`, and `7to1lab.com` a day ahead.
- [ ] Build and push the four images (`linux/amd64`). The frontend publish build uses `BUILD_SCRIPT=build:production` and `SKIP_PRERENDER=0`.
- [ ] On the server, copy `.env` with a JWT secret of at least 32 characters, a new admin password, and matching MySQL and MinIO passwords. Do not reuse `dev-only-secret-change-me`.
- [ ] `docker compose -f docker-compose.prod.yaml up -d`. Caddy takes 80 and 443.
- [ ] Point A/AAAA for `thelabtlv.com` and `www.thelabtlv.com` at the server. Point `7to1lab.com` and `www.7to1lab.com` there too if the old domain still resolves to us.
- [ ] Confirm HTTPS on the apex, `www` 301s to the apex, and `7to1lab.com` 301s to `https://thelabtlv.com` (path rules included).
- [ ] Submit `https://thelabtlv.com/sitemap.xml` in Google Search Console.
- [ ] Update the Google Business Profile website and the Instagram bio link.
- [ ] Change every admin password and the JWT secret after the first production login.

## What was exercised before this tag

- Dev compose on http://localhost:8080: Hebrew home shows the seeded menu, English switch lands on `/en`, admin login reaches the dashboard.
- Gateway: `/api/health` and `/api/cocktails` return data, an old encoded menu URL 301s to `/menu`, hashed assets are immutable, a presigned upload is readable at `/media/...` and a POST to that path is 403.
- `node scripts/check.mjs` is green. Axe on the dev server (step 12) was 19/19. Mobile Lighthouse is in `docs/lighthouse/`. Home performance is 86; Menu, Take Me Home, and Visit are 91 or higher.

## Not covered on a device

- The full matrix of every public route at 360, 390, 768, 1024, and 1440 in both locales.
- A physical iPhone (Safari `100svh`, safe-area insets, `viewport-fit=cover`). The CSS uses those features; they were not checked on iOS.
- A full keyboard-only pass and a `prefers-reduced-motion` pass on every page.
- The public site with the content API stopped.
- Creating, editing, and deleting every admin resource. Login and the dashboard counts were checked.
