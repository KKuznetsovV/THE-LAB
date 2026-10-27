import Joi from 'joi';
import { httpsOrMediaUrl, httpsUrl } from '../../http/urls';

export const idParams = Joi.object({ id: Joi.string().uuid().required() });
export const reorderBody = Joi.object({ ids: Joi.array().items(Joi.string().uuid()).min(1).required() });

const galleryFields = {
  url: httpsOrMediaUrl(),
  altEn: Joi.string().max(255),
  altHe: Joi.string().max(255),
  credit: Joi.string().allow(null, '').max(160),
  sortOrder: Joi.number().integer().min(0),
  isPublished: Joi.boolean(),
};

export const galleryCreate = Joi.object({
  ...galleryFields,
  url: galleryFields.url.required(),
  altEn: galleryFields.altEn.required(),
  altHe: galleryFields.altHe.required(),
});
export const galleryPatch = Joi.object(galleryFields).min(1);

const day = Joi.object({
  dayOfWeek: Joi.number().integer().min(0).max(6).required(),
  opensAt: Joi.string().pattern(/^\d{2}:\d{2}$/).required(),
  closesAt: Joi.string().pattern(/^\d{2}:\d{2}$/).required(),
  isClosed: Joi.boolean().required(),
});

export const hoursBody = Joi.array().items(day).length(7).unique('dayOfWeek');

export const settingsBody = Joi.object({
  reservationUrl: httpsUrl(),
  reservationUrlAlt: httpsUrl(),
  deliveryUrl: httpsUrl(),
  woltUrl: httpsUrl(),
  privateEventsUrl: httpsUrl(),
  giftCardUrl: httpsUrl(),
  instagramUrl: httpsUrl(),
  mapsUrl: httpsUrl(),
  phone: Joi.string().allow('').max(32),
  email: Joi.string().allow('').max(160),
  addressHe: Joi.string().allow('').max(255),
  addressEn: Joi.string().allow('').max(255),
  alcoholWarningHe: Joi.string().allow('').max(255),
  alcoholWarningEn: Joi.string().allow('').max(255),
  accessibilityCoordinatorName: Joi.string().allow('').max(160),
  accessibilityCoordinatorPhone: Joi.string().allow('').max(32),
  accessibilityCoordinatorEmail: Joi.string().allow('').max(160),
  lastAccessibilityAudit: Joi.string().allow(null),
  happyHour: Joi.object({
    startsAt: Joi.string().pattern(/^\d{2}:\d{2}$/),
    endsAt: Joi.string().pattern(/^\d{2}:\d{2}$/),
    discountPercent: Joi.number().integer().min(0).max(100),
  }),
}).min(1);
