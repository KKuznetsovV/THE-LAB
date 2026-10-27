import { FLAVOURS, type Flavour, type MenuSection } from '@thelab/lib';

export const MENU_BLOCKS = [
  { id: 'liquid-records', titleKey: 'menu.liquid', ja: 'リキッド・レコーズ' },
  { id: 'lab-classics', titleKey: 'menu.classics', ja: 'ラボ・クラシックス' },
  { id: 'almost-classics', titleKey: 'menu.almost', ja: 'オールモスト・クラシックス' },
  { id: 'virgin', titleKey: 'menu.virgin' },
  { id: 'spirits', titleKey: 'menu.spirits' },
] as const;

export type MenuBlockId = (typeof MENU_BLOCKS)[number]['id'];

const FLAVOUR_SET = new Set<string>(FLAVOURS);

export function isFlavour(value: string): value is Flavour {
  return FLAVOUR_SET.has(value);
}

export function flavoursFromSearch(search: string): Flavour[] {
  const raw = new URLSearchParams(search).get('f') ?? '';
  const seen = new Set<Flavour>();
  for (const part of raw.split(',')) {
    const key = part.trim();
    if (isFlavour(key)) seen.add(key);
  }
  return [...seen];
}

export function withFlavours(search: string, flavours: Flavour[]): string {
  const params = new URLSearchParams(search);
  if (flavours.length === 0) params.delete('f');
  else params.set('f', flavours.join(','));
  const next = params.toString();
  return next ? `?${next}` : '';
}

export function isIndexView(search: string): boolean {
  return new URLSearchParams(search).get('v') === 'index';
}

export function withView(search: string, index: boolean): string {
  const params = new URLSearchParams(search);
  if (index) params.set('v', 'index');
  else params.delete('v');
  const next = params.toString();
  return next ? `?${next}` : '';
}

export function isMenuSection(value: string): value is MenuSection {
  return value === 'liquid-records'
    || value === 'lab-classics'
    || value === 'almost-classics'
    || value === 'virgin';
}
