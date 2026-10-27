# THE LAB — Content Seed & Business Facts

Status legend: ✅ confirmed from brand print files · ⚠️ from older public listings, **owner must verify** · 📝 draft copy, owner to approve.
This file feeds `db/seed.sql`. Everything here becomes editable later in the admin panel.

---

## 1. Business info

| Field | Value | Status |
|---|---|---|
| Name | THE LAB (by TYO) | ✅ |
| Address EN | Ahad Ha'am 1, Neve Tzedek, Tel Aviv-Yafo | ✅ |
| Address HE | אחד העם 1, נווה צדק, תל אביב-יפו | ✅ |
| Phone | 03-670-0112 (`+97236700112`) | ⚠️ |
| Email | studio contact TBD (old: 7to1lab@gmail.com) | ⚠️ |
| Instagram | https://www.instagram.com/thelab.tlv/ | ✅ handle from print |
| Facebook | https://www.facebook.com/7to1lab (rename pending?) | ⚠️ |
| Google Maps | https://g.co/kgs/kCkXwj | ⚠️ |
| Sister venue | TYO — https://tyo.co.il/en/ | ⚠️ |
| Age policy | 18+ (`+18` printed on every label) | ✅ |

### Opening hours ⚠️ (from older listings — verify)
| Day | Hours |
|---|---|
| Sun | 18:00–00:00 |
| Mon | 18:00–00:00 |
| Tue | 18:00–00:00 |
| Wed | 18:00–00:00 |
| Thu | 18:00–01:00 |
| Fri | 18:00–01:00 |
| Sat | 18:00–00:00 |

Note: the World's 50 Best Discovery listing says "Tuesday to Saturday" — conflicts with the table above.

Happy hour ⚠️: daily 18:00–20:00, 50% off cocktails.

## 2. External links (all must be editable in admin → Settings)

| Key | URL | Status |
|---|---|---|
| `reservationUrl` | https://ontopo.com/he/il/page/79274624 | ⚠️ current "BOOK NOW" on the old site |
| `reservationUrlAlt` | https://ontopo.co.il/7to1LAB | ⚠️ older Ontopo slug |
| `deliveryUrl` | https://tyo.web.delivery/ (BeeComm, delivers across Gush Dan; phone for outside area: 03-930-0333) | ⚠️ |
| `woltUrl` | TBD — the brand has a WOLT highlight pill; TYO's Wolt page is https://wolt.com/he/isr/tel-aviv/restaurant/tyo | ⚠️ |
| `privateEventsUrl` | https://bit.ly/7to1events | ⚠️ |
| `giftCardUrl` | https://valuecard.co.il/GiftCards/COCKTAILLAB#Welcome | ⚠️ |
| `instagramUrl` | https://www.instagram.com/thelab.tlv/ | ✅ |
| `mapsUrl` | https://g.co/kgs/kCkXwj | ⚠️ |

## 3. About / story 📝

Facts (✅/⚠️): cocktail bar in a restored ~100-year-old building in Neve Tzedek ⚠️; a central lab-style work station is the bar, guests sit around it ⚠️; avant-garde techniques, spirits and distillates made in-house (hydrosols, chilli tequila distillate, peanut-butter-and-chocolate distillate, cigar distillate) ✅ from menu; food by the TYO kitchen ⚠️; signature Fake Champagne takes three days to make ⚠️.

Draft EN:
> THE LAB is an experimental cocktail node under TYO. We distil, infuse and clarify in-house, then pour it across one long lab bench in a hundred-year-old Neve Tzedek building. Records on the speakers, records on the menu. Networking the experimental underground.

Draft HE:
> THE LAB היא מעבדת קוקטיילים ניסיונית של TYO. אנחנו מזקקים, משרים ומבהירים הכול בעצמנו, ומגישים סביב שולחן מעבדה אחד ארוך בבניין בן מאה שנה בנווה צדק. תקליטים ברמקולים, תקליטים בתפריט.

### House rules 📝 (shown next to the BOOK button)
- Reservations are held for 15 minutes. / השולחן נשמר 15 דקות.
- 18+ only, ID may be requested. / הכניסה מגיל 18, ייתכן שנבקש תעודה מזהה.
- Happy hour 18:00–20:00. ⚠️

## 4. Menu — main LAB menu ✅ (transcribed from the print render, proofread before launch)

Cocktail names are English in both locales. Ingredient lines exist in Hebrew on the main menu; English ingredient lines below come from the TYO menu where the drink appears there, otherwise are a draft translation (📝).
`flavours` are not seeded — the owner tags them in admin from the print file.

### LIQUID RECORDS · リキッド・レコーズ (`liquid-records`)
| Code | # | Name | Price ₪ | HE ingredients | EN ingredients |
|---|---|---|---|---|---|
| BTT | 01 | BEAT IT | 64 | רום לבן, קיווי, וניל, מיץ לימון | white rum, kiwi, vanilla, lemon juice |
| TXC | 02 | TOXIC | 65 | טקילה מזוקקת עם כוסברה, אלוורה, אננס | cilantro-distilled tequila, aloe vera, pineapple 📝 |
| SLS | 03 | SMELLS LIKE TEEN SPIRIT | 62 | רום לבן, מנטה, תות, יין רוזה וליקר קקאו | white rum, mint, strawberry, rosé wine, cacao liqueur |
| LSR | 04 | LOSEYOURSELF | 66 | בורבון, פופקורן, קרמל, אמארו ופסיפלורה | bourbon, popcorn, caramel, amaro, passion fruit 📝 |
| FR | 05 | FIRESTARTER | 62 | וודקה, טרגון, תפוח ירוק וליקר ליצ'י | vodka, tarragon, green apple, lychee liqueur (TYO version adds absinthe) |
| MP | 06 | MASTER OF PUPPETS | 61 | בורבון, פירות יער, פדרו חימנס ושוקולד מריר | bourbon, berries, Pedro Ximénez, dark chocolate 📝 |
| FMS | 07 | 4MINUTES | 67 | טקילה, היפופאה, צ'יפוטלה, ליקר תפוז | tequila, sea buckthorn, chipotle, orange liqueur |
| BF | 08 | I WANT TO BREAK FREE | 65 | וודקה, אבטיח, תות וקציפת פטה | vodka, watermelon, strawberry, feta foam 📝 |

### THE LAB CLASSICS · ラボ・クラシックス (`lab-classics`)
| Code | # | Name | Price ₪ | HE ingredients | EN ingredients |
|---|---|---|---|---|---|
| BSL | 01 | BASILICUM | 64 | הידרוסול בזיליקום, הידרוסול ליים, ג'ין | basil hydrosol, lime hydrosol, gin |
| LM | 02 | LYCHEE MARTINI | 68 | ג'ין פטל, ורמוט סאקורה, ליקר ליצ'י וקורדיאל הדרים | raspberry gin, sakura vermouth, lychee liqueur, citrus cordial |
| FC | 03 | FAKE CHAMPAGNE | 59 | ג'ין, קוקי אמריקנו, קוקוס, תה יסמין, חלב | gin, Cocchi Americano, coconut, jasmine tea, milk |
| JG | 04 | JAPANESE GARDEN | 66 | ג'ין יוזו, סמבוק, ורג'וס ענבים, יין לבן, מלפפון | yuzu gin, elderflower, grape verjus, white wine, cucumber |
| SMT | 05 | SNEAKERS MANHATTAN | 68 | ויסקי שיפון, תזקיק חמאת בוטנים ושוקולד, ורמוט אדום, סירופ קרמל | rye whiskey, peanut butter & chocolate distillate, vermouth rosso, caramel |
| SNS | 06 | SPICY NO SPICY MARGARITA | 68 | טקילה מזוקקת עם צ'ילי, מזקל, אפרול, שרבט אשכוליות, מרווה | chilli tequila distillate, mezcal, Aperol, grapefruit sherbet, sage |
| SCK | 07 | STRAWBERRY CHEESECAKE | 64 | בורבון, תות, חלב, ליקר ליצ'י | bourbon, strawberry, milk, lychee liqueur |
| SF | 08 | SUNFIRE | 66 | מנגו, צ'ילי, טקילה מזקל | mango, chili, tequila, mezcal |
| CRC | 09 | CHURCHIL | 69 | תזקיק סיגר ורמוט אדום, ליקר אננס, ליקר ארטישוק, טקילה, מזקל | cigar-distilled vermouth rosso, pineapple liqueur, artichoke liqueur, tequila, mezcal 📝 |
| VH | 10 | VETIVER HIGHBALL | 64 | ג'ין פטל, אננס, שורש וטיבר, ורג'וס ענבים | raspberry gin, pineapple, vetiver root, grape verjus |
| BLD | 11 | BLOODY MISHA | 62 | עגבניות, ווסטרשייר, טבסקו, ג'ין סלרי, טקילה | tomato, Worcestershire, Tabasco, celery gin, tequila 📝 |

### 99% (almost classics) · オールモスト・クラシックス (`almost-classics`)
| Code | # | Name | Price ₪ | HE | EN |
|---|---|---|---|---|---|
| NF | 17–21 | NEGRONI FAMILY | 64 | ג'ין פטל / ג'ין יוזו / מזקל, ורמוט אדום וקמפרי | raspberry gin / yuzu gin / mezcal, vermouth rosso, Campari 📝 |
| FF | 16–18 | FIZZ FAMILY | 64 | ג'ין פטל / סלרי / יוזו + קורדיאל הדרים + יין מבעבע | raspberry / celery / yuzu gin + citrus cordial + sparkling wine 📝 |
| VF | 22–24 | VINTAGE FAMILY | 79 | שימוש בליקרים וינטאג': Baby Darling / Little Italy / Hanky Panky | vintage liqueurs: Baby Darling / Little Italy / Hanky Panky 📝 |

(Index ranges are as printed; they overlap — keep the string as-is in a `indexLabel` field.)

### VIRGIN · ללא אלכוהול (`virgin`) — from the TYO menu ✅
| Code | Name | Price ₪ | HE | EN |
|---|---|---|---|---|
| — | BEAT IT | 42 | קיווי, וניל, מיץ לימון | kiwi, vanilla, lemon juice |
| — | BASILICUM | 42 | הידרוסול בזיליקום, הידרוסול ליים | basil hydrosol, lime hydrosol |
| — | TOXIC | 42 | כוסברה, אלוורה, אננס | cilantro, aloe vera, pineapple |
| — | 4MINUTES | 44 | אוכמניות כתומות, צ'ילי, תפוז | sea buckthorn, chili, orange |
| — | RUBY BLOOM | 45 | רימונים, פטל, אגבה, מיץ לימון | pomegranate, raspberry, agave, lemon juice |

Seed virgin items with codes `V-BTT`, `V-BSL`, `V-TXC`, `V-FMS`, `V-RB` and the `na` flavour.

### Also on the TYO restaurant menu (not part of the LAB menu — do not seed as LAB items)
LYCHEE BREAK (gin, lychee, berries, lemon juice, ₪67) · VINTAGE BABY DARLING (rum Zacapa, vermouth rosso, Amaro Isolabella 1950's, ₪95).

### SPIRITS (`spirits` — separate model)
Categories printed on the menu (HE side): softs & mixers, vodka, beer, cognac, wine & sparkling, gin, rum, tequila & mezcal, whisky, amari & liqueurs, vintage amari, arak & ouzo. Item-level list and prices: **owner enters in admin** from the print PDF (seed 1–2 examples per category only, marked `isPublished=false`).

## 5. TAKE ME HOME — bottled cocktails ✅ (from the menu ad; prices = 200 ml / 500 ml)

| # | Cocktail (code) | 200 ml ₪ | 500 ml ₪ |
|---|---|---|---|
| 1 | SNEAKERS MANHATTAN (SMT) | 75 | 156 |
| 2 | VETIVER HIGHBALL (VH) | 61 | 121 |
| 3 | RASPBERRY NEGRONI (NF) | 72 | 152 |
| 4 | FIRESTARTER (FR) | 62 | 123 |
| 5 | LYCHEE MARTINI (LM) | 79 | 167 |
| 6 | BASILICUM (BSL) | 62 | 123 |
| 7 | JAPANESE GARDEN (JG) | 61 | 121 |
| 8 | SMELLS LIKE TEEN SPIRIT (SLS) | 62 | 123 |

⚠️ The printed list numbers Basilicum and Lychee Martini both as "5" — confirm the final line-up and prices.
Copy: "TAKE ME HOME · 好評発売中 · COMES IN SIZES OF 500 / 200 ML · AVAILABLE NOW".
Bottle facts: 200 ml = 135 mm tall; 500 ml = 175 mm tall; clear glass, aluminium cap; delivered in the BLACK BOX with a garnish bag.

### Serving guide (from the green delivery flyer) ✅
1. ADD ICE TO AN EMPTY GLASS · 2. NOW, FILL IT UP · 3. STIR STIR STIR · 4. TAKE THE GARNISH OUT OF THE BAG · 5. YOU KNOW WHERE TO PUT IT · 6. ENJOY ENJOY ENJOY · 7. THEN ENJOY SOME MORE
(Hebrew versions 📝 to be written by the owner.)

## 6. Legal copy (placeholders — owner/legal to confirm)

- Alcohol warning (shown in footer, Take Me Home page and age gate): HE `אזהרה: צריכה מופרזת של אלכוהול מסכנת חיים` / EN `Warning: excessive alcohol consumption is dangerous to your health`. ⚠️ confirm exact statutory wording.
- No sale or delivery of alcohol to anyone under 18.
- Accessibility statement (Israeli Equal Rights for Persons with Disabilities regulations / IS 5568): needs accessibility coordinator name, phone, email, date of last audit. ⚠️
- Privacy policy: the site sets no tracking cookies by default; only stores language and age-gate choice locally.

## 7. Old-site URL map (301 redirects)

Old site: WordPress + Elementor (thelabtlv.com, previously 7to1lab.com). Paths are URL-encoded Hebrew slugs.

| Old path | New path |
|---|---|
| `/תפריט/` | `/menu` |
| `/אודות/` | `/about` |
| `/הסיפור-שלנו/` | `/about` |
| `/גלריה/` | `/archive` |
| `/צור-קשר/` | `/visit` |
| `/הצהרת-נגישות/` | `/accessibility` |
| any `7to1lab.com/*` | `https://thelabtlv.com/*` (then the rules above) |
