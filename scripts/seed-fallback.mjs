import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const RASPBERRY = '2a3de022-045f-4c4a-a7a9-631cd28128ac';

function readSeed() {
  const candidates = [
    fileURLToPath(new URL('../db/seed.sql', import.meta.url)),
    '/app/db/seed.sql',
  ];
  for (const file of candidates) {
    try {
      return readFileSync(file, 'utf8');
    } catch {
      // Try the next location. Docker copies the file to /app/db.
    }
  }
  return '';
}

function valuesOf(line) {
  const start = line.indexOf('VALUES');
  if (start < 0) return [];
  const body = line.slice(start + 6).trim().replace(/;$/, '');
  const open = body.indexOf('(');
  const close = body.lastIndexOf(')');
  const inner = body.slice(open + 1, close);
  const out = [];
  let i = 0;
  while (i < inner.length) {
    while (inner[i] === ' ' || inner[i] === ',') i += 1;
    if (i >= inner.length) break;
    if (inner[i] === "'") {
      let value = '';
      i += 1;
      while (i < inner.length) {
        if (inner[i] === "'" && inner[i + 1] === "'") {
          value += "'";
          i += 2;
          continue;
        }
        if (inner[i] === "'") {
          i += 1;
          break;
        }
        value += inner[i];
        i += 1;
      }
      out.push(value);
      continue;
    }
    let token = '';
    while (i < inner.length && inner[i] !== ',') {
      token += inner[i];
      i += 1;
    }
    const trimmed = token.trim();
    out.push(trimmed === 'NULL' ? null : trimmed);
  }
  return out;
}

function rows(sql, table) {
  return sql
    .split('\n')
    .filter((line) => line.startsWith(`INSERT INTO ${table} `))
    .map(valuesOf);
}

function cocktailsFrom(sql) {
  return rows(sql, 'cocktails').map((values) => {
    let flavours = [];
    try {
      const parsed = JSON.parse(values[11] ?? '[]');
      flavours = Array.isArray(parsed) ? parsed : [];
    } catch {
      flavours = [];
    }
    return {
      id: values[0],
      code: values[1],
      indexLabel: values[2],
      section: values[3],
      nameEn: values[4],
      nameHe: values[5],
      ingredientsEn: values[6],
      ingredientsHe: values[7],
      descriptionEn: values[8],
      descriptionHe: values[9],
      price: values[10] === null ? null : Number(values[10]),
      flavours,
      isSignature: values[12] === '1',
      isAvailable: values[13] === '1',
      isPublished: values[14] === '1',
      sortOrder: Number(values[15] ?? 0),
      imageUrl: values[16],
      imageAltEn: values[17],
      imageAltHe: values[18],
    };
  }).filter((row) => row.isPublished);
}

let cache = null;

function load() {
  if (cache) return cache;
  const sql = readSeed();
  const cocktails = cocktailsFrom(sql);
  const byId = new Map(cocktails.map((row) => [row.id, row]));
  const bottles = rows(sql, 'bottles').map((values) => {
    const cocktail = byId.get(values[1]);
    if (!cocktail) return null;
    const display = values[0] === RASPBERRY ? 'RASPBERRY NEGRONI' : null;
    return {
      id: values[0],
      cocktailId: values[1],
      displayNameEn: display,
      displayNameHe: display,
      price200: Number(values[2]),
      price500: Number(values[3]),
      isAvailable: values[4] === '1',
      isPublished: values[5] === '1',
      sortOrder: Number(values[6] ?? 0),
      imageUrl: values[7],
      imageAltEn: values[8],
      imageAltHe: values[9],
      cocktail: {
        id: cocktail.id,
        code: cocktail.code,
        nameEn: cocktail.nameEn,
        nameHe: cocktail.nameHe,
        section: cocktail.section,
      },
    };
  }).filter((row) => row && row.isPublished);
  cache = { cocktails, bottles };
  return cache;
}

const hours = [0, 1, 2, 3, 4, 5, 6].map((dayOfWeek) => ({
  dayOfWeek,
  opensAt: '18:00',
  closesAt: dayOfWeek === 4 || dayOfWeek === 5 ? '01:00' : '00:00',
  isClosed: false,
}));

const settings = {
  id: 'main',
  reservationUrl: 'https://ontopo.com/he/il/page/79274624',
  reservationUrlAlt: '',
  deliveryUrl: 'https://tyo.web.delivery/',
  woltUrl: '',
  privateEventsUrl: 'https://bit.ly/7to1events',
  giftCardUrl: 'https://valuecard.co.il/GiftCards/COCKTAILLAB#Welcome',
  instagramUrl: 'https://www.instagram.com/thelab.tlv/',
  mapsUrl: 'https://g.co/kgs/kCkXwj',
  phone: '03-670-0112',
  email: '',
  addressHe: 'אחד העם 1, נווה צדק, תל אביב-יפו',
  addressEn: "Ahad Ha'am 1, Neve Tzedek, Tel Aviv-Yafo",
  alcoholWarningHe: 'אזהרה: צריכה מופרזת של אלכוהול מסכנת חיים',
  alcoholWarningEn: 'Warning: excessive alcohol consumption is dangerous to your health',
  accessibilityCoordinatorName: '',
  accessibilityCoordinatorPhone: '',
  accessibilityCoordinatorEmail: '',
  lastAccessibilityAudit: null,
  happyHour: { startsAt: '18:00', endsAt: '20:00', discountPercent: 50 },
};

export function fallbackBody(pathname) {
  const data = load();
  if (pathname === '/api/cocktails') return data.cocktails;
  if (pathname === '/api/bottles') return data.bottles;
  if (pathname === '/api/hours') return hours;
  if (pathname === '/api/settings') return settings;
  if (pathname.startsWith('/api/')) return [];
  return null;
}
