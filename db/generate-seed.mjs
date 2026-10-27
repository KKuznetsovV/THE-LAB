import { createHash } from 'node:crypto';
import { writeFileSync } from 'node:fs';

function id(key) {
  const h = createHash('sha256').update(`thelab:${key}`).digest('hex');
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-4${h.slice(13, 16)}-a${h.slice(17, 20)}-${h.slice(20, 32)}`;
}

function q(value) {
  if (value === null || value === undefined) return 'NULL';
  if (typeof value === 'number') return String(value);
  if (typeof value === 'boolean') return value ? '1' : '0';
  return `'${String(value).replaceAll("'", "''")}'`;
}

const STAMP = '2026-01-01 00:00:00';

const cocktails = [
  ['BTT', '01', 'liquid-records', 'BEAT IT', 'רום לבן, קיווי, וניל, מיץ לימון', 'white rum, kiwi, vanilla, lemon juice', 64, [], false],
  ['TXC', '02', 'liquid-records', 'TOXIC', 'טקילה מזוקקת עם כוסברה, אלוורה, אננס', 'cilantro-distilled tequila, aloe vera, pineapple', 65, [], false],
  ['SLS', '03', 'liquid-records', 'SMELLS LIKE TEEN SPIRIT', 'רום לבן, מנטה, תות, יין רוזה וליקר קקאו', 'white rum, mint, strawberry, rosé wine, cacao liqueur', 62, [], false],
  ['LSR', '04', 'liquid-records', 'LOSEYOURSELF', 'בורבון, פופקורן, קרמל, אמארו ופסיפלורה', 'bourbon, popcorn, caramel, amaro, passion fruit', 66, [], false],
  ['FR', '05', 'liquid-records', 'FIRESTARTER', 'וודקה, טרגון, תפוח ירוק וליקר ליצ\'י', 'vodka, tarragon, green apple, lychee liqueur', 62, [], false],
  ['MP', '06', 'liquid-records', 'MASTER OF PUPPETS', 'בורבון, פירות יער, פדרו חימנס ושוקולד מריר', 'bourbon, berries, Pedro Ximénez, dark chocolate', 61, [], false],
  ['FMS', '07', 'liquid-records', '4MINUTES', 'טקילה, היפופאה, צ\'יפוטלה, ליקר תפוז', 'tequila, sea buckthorn, chipotle, orange liqueur', 67, [], false],
  ['BF', '08', 'liquid-records', 'I WANT TO BREAK FREE', 'וודקה, אבטיח, תות וקציפת פטה', 'vodka, watermelon, strawberry, feta foam', 65, [], false],
  ['BSL', '01', 'lab-classics', 'BASILICUM', 'הידרוסול בזיליקום, הידרוסול ליים, ג\'ין', 'basil hydrosol, lime hydrosol, gin', 64, [], false],
  ['LM', '02', 'lab-classics', 'LYCHEE MARTINI', 'ג\'ין פטל, ורמוט סאקורה, ליקר ליצ\'י וקורדיאל הדרים', 'raspberry gin, sakura vermouth, lychee liqueur, citrus cordial', 68, [], false],
  ['FC', '03', 'lab-classics', 'FAKE CHAMPAGNE', 'ג\'ין, קוקי אמריקנו, קוקוס, תה יסמין, חלב', 'gin, Cocchi Americano, coconut, jasmine tea, milk', 59, [], true],
  ['JG', '04', 'lab-classics', 'JAPANESE GARDEN', 'ג\'ין יוזו, סמבוק, ורג\'וס ענבים, יין לבן, מלפפון', 'yuzu gin, elderflower, grape verjus, white wine, cucumber', 66, [], false],
  ['SMT', '05', 'lab-classics', 'SNEAKERS MANHATTAN', 'ויסקי שיפון, תזקיק חמאת בוטנים ושוקולד, ורמוט אדום, סירופ קרמל', 'rye whiskey, peanut butter & chocolate distillate, vermouth rosso, caramel', 68, [], false],
  ['SNS', '06', 'lab-classics', 'SPICY NO SPICY MARGARITA', 'טקילה מזוקקת עם צ\'ילי, מזקל, אפרול, שרבט אשכוליות, מרווה', 'chilli tequila distillate, mezcal, Aperol, grapefruit sherbet, sage', 68, [], false],
  ['SCK', '07', 'lab-classics', 'STRAWBERRY CHEESECAKE', 'בורבון, תות, חלב, ליקר ליצ\'י', 'bourbon, strawberry, milk, lychee liqueur', 64, [], false],
  ['SF', '08', 'lab-classics', 'SUNFIRE', 'מנגו, צ\'ילי, טקילה, מזקל', 'mango, chili, tequila, mezcal', 66, [], false],
  ['CRC', '09', 'lab-classics', 'CHURCHIL', 'תזקיק סיגר ורמוט אדום, ליקר אננס, ליקר ארטישוק, טקילה, מזקל', 'cigar-distilled vermouth rosso, pineapple liqueur, artichoke liqueur, tequila, mezcal', 69, [], false],
  ['VH', '10', 'lab-classics', 'VETIVER HIGHBALL', 'ג\'ין פטל, אננס, שורש וטיבר, ורג\'וס ענבים', 'raspberry gin, pineapple, vetiver root, grape verjus', 64, [], false],
  ['BLD', '11', 'lab-classics', 'BLOODY MISHA', 'עגבניות, ווסטרשייר, טבסקו, ג\'ין סלרי, טקילה', 'tomato, Worcestershire, Tabasco, celery gin, tequila', 62, [], false],
  ['NF', '17–21', 'almost-classics', 'NEGRONI FAMILY', 'ג\'ין פטל / ג\'ין יוזו / מזקל, ורמוט אדום וקמפרי', 'raspberry gin / yuzu gin / mezcal, vermouth rosso, Campari', 64, [], false],
  ['FF', '16–18', 'almost-classics', 'FIZZ FAMILY', 'ג\'ין פטל / סלרי / יוזו + קורדיאל הדרים + יין מבעבע', 'raspberry / celery / yuzu gin + citrus cordial + sparkling wine', 64, [], false],
  ['VF', '22–24', 'almost-classics', 'VINTAGE FAMILY', 'שימוש בליקרים וינטאג\': Baby Darling / Little Italy / Hanky Panky', 'vintage liqueurs: Baby Darling / Little Italy / Hanky Panky', 79, [], false],
  ['V-BTT', '', 'virgin', 'BEAT IT', 'קיווי, וניל, מיץ לימון', 'kiwi, vanilla, lemon juice', 42, ['na'], false],
  ['V-BSL', '', 'virgin', 'BASILICUM', 'הידרוסול בזיליקום, הידרוסול ליים', 'basil hydrosol, lime hydrosol', 42, ['na'], false],
  ['V-TXC', '', 'virgin', 'TOXIC', 'כוסברה, אלוורה, אננס', 'cilantro, aloe vera, pineapple', 42, ['na'], false],
  ['V-FMS', '', 'virgin', '4MINUTES', 'אוכמניות כתומות, צ\'ילי, תפוז', 'sea buckthorn, chili, orange', 44, ['na'], false],
  ['V-RB', '', 'virgin', 'RUBY BLOOM', 'רימונים, פטל, אגבה, מיץ לימון', 'pomegranate, raspberry, agave, lemon juice', 45, ['na'], false],
];

const bottles = [
  ['SMT', 75, 156],
  ['VH', 61, 121],
  ['NF', 72, 152],
  ['FR', 62, 123],
  ['LM', 79, 167],
  ['BSL', 62, 123],
  ['JG', 61, 121],
  ['SLS', 62, 123],
];

const spirits = [
  ['softs-mixers', 'Soda water', 12, null],
  ['softs-mixers', 'Tonic', 14, null],
  ['vodka', 'House vodka', 18, 180],
  ['vodka', 'Wheat vodka', 22, 210],
  ['beer', 'Lager', 28, null],
  ['beer', 'Pale ale', 32, null],
  ['cognac', 'VS cognac', 42, 320],
  ['cognac', 'VSOP cognac', 58, 420],
  ['wine-sparkling', 'House white', 36, 140],
  ['wine-sparkling', 'Prosecco', 40, 160],
  ['gin', 'London dry', 24, 220],
  ['gin', 'Yuzu gin', 32, 260],
  ['rum', 'White rum', 22, 190],
  ['rum', 'Aged rum', 34, 280],
  ['tequila-mezcal', 'Blanco tequila', 28, 240],
  ['tequila-mezcal', 'Mezcal', 36, 290],
  ['whisky', 'Bourbon', 32, 260],
  ['whisky', 'Rye', 34, 280],
  ['amari-liqueurs', 'Amaro', 26, 210],
  ['amari-liqueurs', 'Orange liqueur', 24, 190],
  ['vintage-amari', 'Vintage amaro', 48, 380],
  ['vintage-amari', '1950s amaro', 64, 480],
  ['arak-ouzo', 'Arak', 22, 160],
  ['arak-ouzo', 'Ouzo', 22, 160],
];

const lines = [];
lines.push('-- thelab_content seed. Replayed only when cocktails is empty.');

lines.push(`INSERT INTO site_settings (id, reservation_url, reservation_url_alt, delivery_url, wolt_url, private_events_url, gift_card_url, instagram_url, maps_url, phone, email, address_he, address_en, alcohol_warning_he, alcohol_warning_en, accessibility_coordinator_name, accessibility_coordinator_phone, accessibility_coordinator_email, last_accessibility_audit, happy_hour_starts_at, happy_hour_ends_at, happy_hour_discount_percent, created_at, updated_at) VALUES (${[
  'main',
  'https://ontopo.com/he/il/page/79274624',
  'https://ontopo.co.il/7to1LAB',
  'https://tyo.web.delivery/',
  '',
  'https://bit.ly/7to1events',
  'https://valuecard.co.il/GiftCards/COCKTAILLAB#Welcome',
  'https://www.instagram.com/thelab.tlv/',
  'https://g.co/kgs/kCkXwj',
  '+97236700112',
  '',
  'אחד העם 1, נווה צדק, תל אביב-יפו',
  "Ahad Ha'am 1, Neve Tzedek, Tel Aviv-Yafo",
  'אזהרה: צריכה מופרזת של אלכוהול מסכנת חיים',
  'Warning: excessive alcohol consumption is dangerous to your health',
  '',
  '',
  '',
  null,
  '18:00',
  '20:00',
  50,
  STAMP,
  STAMP,
].map(q).join(', ')});`);

const hours = [
  [0, '18:00', '00:00'],
  [1, '18:00', '00:00'],
  [2, '18:00', '00:00'],
  [3, '18:00', '00:00'],
  [4, '18:00', '01:00'],
  [5, '18:00', '01:00'],
  [6, '18:00', '00:00'],
];
for (const [day, opens, closes] of hours) {
  lines.push(`INSERT INTO opening_hours (id, day_of_week, opens_at, closes_at, is_closed, created_at, updated_at) VALUES (${[id(`hours:${day}`), day, opens, closes, false, STAMP, STAMP].map(q).join(', ')});`);
}

const sectionOrder = {};
for (const [code, indexLabel, section, name, he, en, price, flavours, signature] of cocktails) {
  const sort = sectionOrder[section] ?? 0;
  sectionOrder[section] = sort + 1;
  lines.push(`INSERT INTO cocktails (id, code, index_label, section, name_en, name_he, ingredients_en, ingredients_he, description_en, description_he, price, flavours, is_signature, is_available, is_published, sort_order, image_url, image_alt_en, image_alt_he, created_at, updated_at) VALUES (${[
    id(`cocktail:${code}`),
    code,
    indexLabel,
    section,
    name,
    name,
    en,
    he,
    null,
    null,
    price,
    JSON.stringify(flavours),
    signature,
    true,
    true,
    sort,
    null,
    null,
    null,
    STAMP,
    STAMP,
  ].map(q).join(', ')});`);
}

bottles.forEach(([code, price200, price500], index) => {
  lines.push(`INSERT INTO bottles (id, cocktail_id, price200, price500, is_available, is_published, sort_order, image_url, image_alt_en, image_alt_he, created_at, updated_at) VALUES (${[
    id(`bottle:${code}`),
    id(`cocktail:${code}`),
    price200,
    price500,
    true,
    true,
    index,
    null,
    null,
    null,
    STAMP,
    STAMP,
  ].map(q).join(', ')});`);
});

spirits.forEach(([category, name, glass, bottle], index) => {
  lines.push(`INSERT INTO spirits (id, category, name, price_glass, price_bottle, is_published, sort_order, created_at, updated_at) VALUES (${[
    id(`spirit:${category}:${name}`),
    category,
    name,
    glass,
    bottle,
    false,
    index,
    STAMP,
    STAMP,
  ].map(q).join(', ')});`);
});

lines.push(`INSERT INTO events (id, slug, title_en, title_he, body_en, body_he, starts_at, ends_at, image_url, image_alt_en, image_alt_he, link_url, is_published, sort_order, created_at, updated_at) VALUES (${[
  id('event:lab-night'),
  'lab-night',
  'Lab night',
  'לילה במעבדה',
  'An example unpublished event.',
  'אירוע לדוגמה שאינו מפורסם.',
  '2026-12-01 18:00:00',
  '2026-12-01 23:00:00',
  null,
  null,
  null,
  null,
  false,
  0,
  STAMP,
  STAMP,
].map(q).join(', ')});`);

lines.push(`INSERT INTO gallery_images (id, url, alt_en, alt_he, credit, sort_order, is_published, created_at, updated_at) VALUES (${[
  id('gallery:bar'),
  'https://thelabtlv.com/media/seed-bar.jpg',
  'The lab bench',
  'שולחן המעבדה',
  'THE LAB',
  0,
  false,
  STAMP,
  STAMP,
].map(q).join(', ')});`);

writeFileSync(new URL('./seed.sql', import.meta.url), `${lines.join('\n')}\n`, 'utf8');
console.log(`wrote ${lines.length - 1} inserts`);
