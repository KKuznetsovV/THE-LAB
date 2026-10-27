import type { OpeningDay } from './hours';

export const defaultHours: OpeningDay[] = [
  { dayOfWeek: 0, opensAt: '18:00', closesAt: '00:00', isClosed: false },
  { dayOfWeek: 1, opensAt: '18:00', closesAt: '00:00', isClosed: false },
  { dayOfWeek: 2, opensAt: '18:00', closesAt: '00:00', isClosed: false },
  { dayOfWeek: 3, opensAt: '18:00', closesAt: '00:00', isClosed: false },
  { dayOfWeek: 4, opensAt: '18:00', closesAt: '01:00', isClosed: false },
  { dayOfWeek: 5, opensAt: '18:00', closesAt: '01:00', isClosed: false },
  { dayOfWeek: 6, opensAt: '18:00', closesAt: '00:00', isClosed: false },
];

export const siteDefaults = {
  phoneDisplay: '03-670-0112',
  phoneTel: '+97236700112',
  addressHe: 'אחד העם 1, נווה צדק, תל אביב-יפו',
  addressEn: "Ahad Ha'am 1, Neve Tzedek, Tel Aviv-Yafo",
  reservationUrl: 'https://ontopo.com/he/il/page/79274624',
  deliveryUrl: 'https://tyo.web.delivery/',
  woltUrl: '',
  privateEventsUrl: 'https://bit.ly/7to1events',
  giftCardUrl: 'https://valuecard.co.il/GiftCards/COCKTAILLAB#Welcome',
  instagramUrl: 'https://www.instagram.com/thelab.tlv/',
  mapsUrl: 'https://g.co/kgs/kCkXwj',
  tyoUrl: 'https://tyo.co.il/en/',
  happyHour: '18:00–20:00',
  nodeAddress: '132.06325 : 134.76801',
  alcoholWarningHe: 'אזהרה: צריכה מופרזת של אלכוהול מסכנת חיים',
  alcoholWarningEn: 'Warning: excessive alcohol consumption is dangerous to your health',
};
