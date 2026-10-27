import Joi from 'joi';
import { httpsOrMediaUrl } from '../../http/urls';

export const listQuery = Joi.object({
  when: Joi.string().valid('upcoming', 'past'),
  all: Joi.string().valid('true', 'false'),
  deleted: Joi.string().valid('true', 'false'),
}).unknown(false);

export const slugParams = Joi.object({
  slug: Joi.string().pattern(/^[a-z0-9-]{1,80}$/).required(),
});

export const idParams = Joi.object({ id: Joi.string().uuid().required() });

const fields = {
  slug: Joi.string().pattern(/^[a-z0-9-]{1,80}$/),
  titleEn: Joi.string().max(160),
  titleHe: Joi.string().max(160),
  bodyEn: Joi.string().allow(''),
  bodyHe: Joi.string().allow(''),
  startsAt: Joi.date().iso(),
  endsAt: Joi.date().iso().allow(null),
  imageUrl: httpsOrMediaUrl(),
  imageAltEn: Joi.string().allow(null, '').max(255),
  imageAltHe: Joi.string().allow(null, '').max(255),
  linkUrl: httpsOrMediaUrl(),
  isPublished: Joi.boolean(),
  sortOrder: Joi.number().integer().min(0),
};

export const createBody = Joi.object({
  ...fields,
  titleEn: fields.titleEn.required(),
  titleHe: fields.titleHe.required(),
  bodyEn: fields.bodyEn.required(),
  bodyHe: fields.bodyHe.required(),
  startsAt: fields.startsAt.required(),
});

export const patchBody = Joi.object(fields).min(1);
export const reorderBody = Joi.object({ ids: Joi.array().items(Joi.string().uuid()).min(1).required() });
