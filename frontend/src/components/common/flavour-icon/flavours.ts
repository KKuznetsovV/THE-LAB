export const FLAVOUR_KEYS = [
  'fruity',
  'floral',
  'spicy',
  'chocolate',
  'herbal',
  'sweet',
  'anise',
  'deep',
  'strong',
  'sour',
  'oumami',
  'na',
  'tangy',
  'smokey',
  'bitter',
  'fresh',
  'sparkling',
] as const;

export type FlavourKey = (typeof FLAVOUR_KEYS)[number];

export const FLAVOUR_LABELS: Record<FlavourKey, { en: string; he: string }> = {
  fruity: { en: 'FRUITY', he: 'פירותי' },
  floral: { en: 'FLORAL', he: 'פרחוני' },
  spicy: { en: 'SPICY', he: 'חריף' },
  chocolate: { en: 'CHOCOLATE', he: 'שוקולדי' },
  herbal: { en: 'HERBAL', he: 'עשבוני' },
  sweet: { en: 'SWEET', he: 'מתוק' },
  anise: { en: 'ANISE', he: 'אניס' },
  deep: { en: 'DEEP', he: 'עמוק' },
  strong: { en: 'STRONG', he: 'חזק' },
  sour: { en: 'SOUR', he: 'חמוץ' },
  oumami: { en: 'UMAMI', he: 'אומאמי' },
  na: { en: 'NON-ALC', he: 'ללא אלכוהול' },
  tangy: { en: 'TANGY', he: 'חמצמץ' },
  smokey: { en: 'SMOKEY', he: 'מעושן' },
  bitter: { en: 'BITTER', he: 'מר' },
  fresh: { en: 'FRESH', he: 'רענן' },
  sparkling: { en: 'SPARKLING', he: 'מבעבע' },
};

export function isFlavourKey(value: string): value is FlavourKey {
  return (FLAVOUR_KEYS as readonly string[]).includes(value);
}
