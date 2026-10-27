export const LOCALES = ['he', 'en'] as const;
export type Locale = (typeof LOCALES)[number];

export const FLAVOURS = [
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
export type Flavour = (typeof FLAVOURS)[number];

export const MENU_SECTIONS = ['liquid-records', 'lab-classics', 'almost-classics', 'virgin'] as const;
export type MenuSection = (typeof MENU_SECTIONS)[number];

export const SPIRIT_CATEGORIES = [
  'softs-mixers',
  'vodka',
  'beer',
  'cognac',
  'wine-sparkling',
  'gin',
  'rum',
  'tequila-mezcal',
  'whisky',
  'amari-liqueurs',
  'vintage-amari',
  'arak-ouzo',
] as const;
export type SpiritCategory = (typeof SPIRIT_CATEGORIES)[number];

export const ADMIN_ROLES = ['owner', 'editor'] as const;
export type AdminRole = (typeof ADMIN_ROLES)[number];
