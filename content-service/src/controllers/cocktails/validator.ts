import Joi from 'joi';
import { FLAVOURS, MENU_SECTIONS } from '@thelab/lib';
import { httpsOrMediaUrl } from '../../http/urls';

const flavourList = Joi.string().custom((value: unknown, helpers) => {
  if (typeof value !== 'string') return helpers.error('any.invalid');
  const parts = value.split(',').map((part) => part.trim()).filter(Boolean);
  const unknown = parts.find((part) => !(FLAVOURS as readonly string[]).includes(part));
  if (unknown) return helpers.error('any.invalid');
  return value;
}, 'flavour list');

export const listQuery = Joi.object({
  section: Joi.string().valid(...MENU_SECTIONS),
  flavour: flavourList,
  all: Joi.string().valid('true', 'false'),
  deleted: Joi.string().valid('true', 'false'),
}).unknown(false);

export const codeParams = Joi.object({
  code: Joi.string().pattern(/^[A-Z0-9-]{1,6}$/).required(),
});

export const idParams = Joi.object({
  id: Joi.string().uuid().required(),
});

const fields = {
  code: Joi.string().pattern(/^[A-Z0-9-]{1,6}$/),
  indexLabel: Joi.string().allow('').max(16),
  section: Joi.string().valid(...MENU_SECTIONS),
  nameEn: Joi.string().max(80),
  nameHe: Joi.string().max(80),
  ingredientsEn: Joi.string().allow(''),
  ingredientsHe: Joi.string().allow(''),
  descriptionEn: Joi.string().allow(null, ''),
  descriptionHe: Joi.string().allow(null, ''),
  price: Joi.number().integer().min(0).max(2000).allow(null),
  flavours: Joi.array().items(Joi.string().valid(...FLAVOURS)),
  isSignature: Joi.boolean(),
  isAvailable: Joi.boolean(),
  isPublished: Joi.boolean(),
  sortOrder: Joi.number().integer().min(0),
  imageUrl: httpsOrMediaUrl(),
  imageAltEn: Joi.string().allow(null, '').max(255),
  imageAltHe: Joi.string().allow(null, '').max(255),
};

export const createBody = Joi.object({
  ...fields,
  code: fields.code.required(),
  section: fields.section.required(),
  nameEn: fields.nameEn.required(),
  nameHe: fields.nameHe.required(),
  ingredientsEn: fields.ingredientsEn.required(),
  ingredientsHe: fields.ingredientsHe.required(),
});

export const patchBody = Joi.object(fields).min(1);

export const availabilityBody = Joi.object({
  isAvailable: Joi.boolean().required(),
});

export const reorderBody = Joi.object({
  section: Joi.string().valid(...MENU_SECTIONS).required(),
  ids: Joi.array().items(Joi.string().uuid()).min(1).required(),
});
