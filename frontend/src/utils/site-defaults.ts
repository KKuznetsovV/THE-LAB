import type { OpeningHoursDto, SiteSettingsDto } from '@thelab/lib';
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

export const fallbackSettings: SiteSettingsDto = {
  id: 'main',
  reservationUrl: siteDefaults.reservationUrl,
  reservationUrlAlt: '',
  deliveryUrl: siteDefaults.deliveryUrl,
  woltUrl: siteDefaults.woltUrl,
  privateEventsUrl: siteDefaults.privateEventsUrl,
  giftCardUrl: siteDefaults.giftCardUrl,
  instagramUrl: siteDefaults.instagramUrl,
  mapsUrl: siteDefaults.mapsUrl,
  phone: siteDefaults.phoneDisplay,
  email: '',
  addressHe: siteDefaults.addressHe,
  addressEn: siteDefaults.addressEn,
  alcoholWarningHe: siteDefaults.alcoholWarningHe,
  alcoholWarningEn: siteDefaults.alcoholWarningEn,
  accessibilityCoordinatorName: '',
  accessibilityCoordinatorPhone: '',
  accessibilityCoordinatorEmail: '',
  lastAccessibilityAudit: null,
  happyHour: { startsAt: '18:00', endsAt: '20:00', discountPercent: 50 },
};

export const fallbackHours: OpeningHoursDto[] = defaultHours;

export function telHref(phone: string): string {
  const trimmed = phone.trim();
  if (trimmed.startsWith('+')) return `tel:${trimmed.replace(/[^\d+]/g, '')}`;
  const digits = trimmed.replace(/\D/g, '');
  if (digits.startsWith('0')) return `tel:+972${digits.slice(1)}`;
  return `tel:${digits}`;
}

export function displayPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  const local = digits.startsWith('972') ? `0${digits.slice(3)}` : digits;
  if (local.length === 9) return `${local.slice(0, 2)}-${local.slice(2, 5)}-${local.slice(5)}`;
  if (local.length === 10) return `${local.slice(0, 3)}-${local.slice(3, 6)}-${local.slice(6)}`;
  return phone;
}
