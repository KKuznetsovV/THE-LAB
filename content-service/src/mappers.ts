import {
  FLAVOURS,
  MENU_SECTIONS,
  SPIRIT_CATEGORIES,
  type CocktailDto,
  type CocktailSummaryDto,
  type EventDto,
  type Flavour,
  type GalleryImageDto,
  type MenuSection,
  type OpeningHoursDto,
  type SiteSettingsDto,
  type SpiritCategory,
  type SpiritDto,
} from '@thelab/lib';
import type Bottle from './models/Bottle';
import type Cocktail from './models/Cocktail';
import type Event from './models/Event';
import type GalleryImage from './models/GalleryImage';
import type OpeningHours from './models/OpeningHours';
import type SiteSettings from './models/SiteSettings';
import type Spirit from './models/Spirit';

function isSection(value: string): value is MenuSection {
  return (MENU_SECTIONS as readonly string[]).includes(value);
}

function isFlavour(value: string): value is Flavour {
  return (FLAVOURS as readonly string[]).includes(value);
}

function isCategory(value: string): value is SpiritCategory {
  return (SPIRIT_CATEGORIES as readonly string[]).includes(value);
}

function flavoursOf(value: unknown): Flavour[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is Flavour => typeof item === 'string' && isFlavour(item));
}

export function toCocktail(row: Cocktail): CocktailDto {
  if (!isSection(row.section)) throw new Error(`Unknown menu section ${row.section}`);
  return {
    id: row.id,
    code: row.code,
    indexLabel: row.indexLabel,
    section: row.section,
    nameEn: row.nameEn,
    nameHe: row.nameHe,
    ingredientsEn: row.ingredientsEn,
    ingredientsHe: row.ingredientsHe,
    descriptionEn: row.descriptionEn,
    descriptionHe: row.descriptionHe,
    price: row.price,
    flavours: flavoursOf(row.flavours),
    isSignature: row.isSignature,
    isAvailable: row.isAvailable,
    isPublished: row.isPublished,
    sortOrder: row.sortOrder,
    imageUrl: row.imageUrl,
    imageAltEn: row.imageAltEn,
    imageAltHe: row.imageAltHe,
  };
}

export function toSummary(row: Cocktail): CocktailSummaryDto {
  if (!isSection(row.section)) throw new Error(`Unknown menu section ${row.section}`);
  return { id: row.id, code: row.code, nameEn: row.nameEn, nameHe: row.nameHe, section: row.section };
}

export function toBottle(row: Bottle) {
  if (!row.cocktail) throw new Error('Bottle is missing its cocktail');
  return {
    id: row.id,
    cocktailId: row.cocktailId,
    price200: row.price200,
    price500: row.price500,
    isAvailable: row.isAvailable,
    isPublished: row.isPublished,
    sortOrder: row.sortOrder,
    imageUrl: row.imageUrl,
    imageAltEn: row.imageAltEn,
    imageAltHe: row.imageAltHe,
    cocktail: toSummary(row.cocktail),
  };
}

export function toSpirit(row: Spirit): SpiritDto {
  if (!isCategory(row.category)) throw new Error(`Unknown spirit category ${row.category}`);
  return {
    id: row.id,
    category: row.category,
    name: row.name,
    priceGlass: row.priceGlass,
    priceBottle: row.priceBottle,
    isPublished: row.isPublished,
    sortOrder: row.sortOrder,
  };
}

export function toEvent(row: Event): EventDto {
  return {
    id: row.id,
    slug: row.slug,
    titleEn: row.titleEn,
    titleHe: row.titleHe,
    bodyEn: row.bodyEn,
    bodyHe: row.bodyHe,
    startsAt: row.startsAt.toISOString(),
    endsAt: row.endsAt ? row.endsAt.toISOString() : null,
    imageUrl: row.imageUrl,
    imageAltEn: row.imageAltEn,
    imageAltHe: row.imageAltHe,
    linkUrl: row.linkUrl,
    isPublished: row.isPublished,
  };
}

export function toGallery(row: GalleryImage): GalleryImageDto {
  return {
    id: row.id,
    url: row.url,
    altEn: row.altEn,
    altHe: row.altHe,
    credit: row.credit,
    sortOrder: row.sortOrder,
    isPublished: row.isPublished,
  };
}

export function toHours(row: OpeningHours): OpeningHoursDto {
  return {
    dayOfWeek: row.dayOfWeek,
    opensAt: row.opensAt,
    closesAt: row.closesAt,
    isClosed: row.isClosed,
  };
}

export function toSettings(row: SiteSettings): SiteSettingsDto {
  return {
    id: row.id,
    reservationUrl: row.reservationUrl,
    reservationUrlAlt: row.reservationUrlAlt,
    deliveryUrl: row.deliveryUrl,
    woltUrl: row.woltUrl,
    privateEventsUrl: row.privateEventsUrl,
    giftCardUrl: row.giftCardUrl,
    instagramUrl: row.instagramUrl,
    mapsUrl: row.mapsUrl,
    phone: row.phone,
    email: row.email,
    addressHe: row.addressHe,
    addressEn: row.addressEn,
    alcoholWarningHe: row.alcoholWarningHe,
    alcoholWarningEn: row.alcoholWarningEn,
    accessibilityCoordinatorName: row.accessibilityCoordinatorName,
    accessibilityCoordinatorPhone: row.accessibilityCoordinatorPhone,
    accessibilityCoordinatorEmail: row.accessibilityCoordinatorEmail,
    lastAccessibilityAudit: row.lastAccessibilityAudit,
    happyHour: {
      startsAt: row.happyHourStartsAt,
      endsAt: row.happyHourEndsAt,
      discountPercent: row.happyHourDiscountPercent,
    },
  };
}
