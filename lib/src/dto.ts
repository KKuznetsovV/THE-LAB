import type { AdminRole, Flavour, MenuSection, SpiritCategory } from './constants.js';

export type CocktailDto = {
  id: string;
  code: string;
  indexLabel: string;
  section: MenuSection;
  nameEn: string;
  nameHe: string;
  ingredientsEn: string;
  ingredientsHe: string;
  descriptionEn: string | null;
  descriptionHe: string | null;
  price: number | null;
  flavours: Flavour[];
  isSignature: boolean;
  isAvailable: boolean;
  isPublished: boolean;
  sortOrder: number;
  imageUrl: string | null;
  imageAltEn: string | null;
  imageAltHe: string | null;
};

export type CocktailSummaryDto = {
  id: string;
  code: string;
  nameEn: string;
  nameHe: string;
  section: MenuSection;
};

export type BottleDto = {
  id: string;
  cocktailId: string;
  price200: number;
  price500: number;
  isAvailable: boolean;
  isPublished: boolean;
  sortOrder: number;
  imageUrl: string | null;
  imageAltEn: string | null;
  imageAltHe: string | null;
  cocktail: CocktailSummaryDto;
};

export type SpiritDto = {
  id: string;
  category: SpiritCategory;
  name: string;
  priceGlass: number | null;
  priceBottle: number | null;
  isPublished: boolean;
  sortOrder: number;
};

export type SpiritGroupDto = {
  category: SpiritCategory;
  items: SpiritDto[];
};

export type EventDto = {
  id: string;
  slug: string;
  titleEn: string;
  titleHe: string;
  bodyEn: string;
  bodyHe: string;
  startsAt: string;
  endsAt: string | null;
  imageUrl: string | null;
  imageAltEn: string | null;
  imageAltHe: string | null;
  linkUrl: string | null;
  isPublished: boolean;
};

export type GalleryImageDto = {
  id: string;
  url: string;
  altEn: string;
  altHe: string;
  credit: string | null;
  sortOrder: number;
  isPublished: boolean;
};

export type OpeningHoursDto = {
  dayOfWeek: number;
  opensAt: string;
  closesAt: string;
  isClosed: boolean;
};

export type HappyHourDto = {
  startsAt: string;
  endsAt: string;
  discountPercent: number;
};

export type SiteSettingsDto = {
  id: string;
  reservationUrl: string;
  reservationUrlAlt: string;
  deliveryUrl: string;
  woltUrl: string;
  privateEventsUrl: string;
  giftCardUrl: string;
  instagramUrl: string;
  mapsUrl: string;
  phone: string;
  email: string;
  addressHe: string;
  addressEn: string;
  alcoholWarningHe: string;
  alcoholWarningEn: string;
  accessibilityCoordinatorName: string;
  accessibilityCoordinatorPhone: string;
  accessibilityCoordinatorEmail: string;
  lastAccessibilityAudit: string | null;
  happyHour: HappyHourDto;
};

export type AdminDto = {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  isActive: boolean;
};

export type AdminJwtPayload = {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
};

export type AuthResponse = {
  jwt: string;
};

export type ApiError = {
  status: number;
  message: string;
};

export type Paginated<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
};
