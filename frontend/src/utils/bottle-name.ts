import type { BottleDto } from '@thelab/lib';

export function bottleTitle(bottle: BottleDto, locale: 'he' | 'en'): string {
  const hebrew = bottle.displayNameHe?.trim() ?? '';
  const english = bottle.displayNameEn?.trim() ?? '';
  if (locale === 'he' && hebrew) return hebrew;
  if (english) return english;
  if (hebrew) return hebrew;
  return bottle.cocktail.nameEn;
}
