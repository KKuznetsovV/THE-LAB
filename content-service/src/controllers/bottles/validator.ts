import Joi from 'joi';
import { httpsOrMediaUrl } from '../../http/urls';

export const idParams = Joi.object({ id: Joi.string().uuid().required() });

const fields = {
  cocktailId: Joi.string().uuid(),
  price200: Joi.number().integer().min(0).max(2000),
  price500: Joi.number().integer().min(0).max(2000),
  isAvailable: Joi.boolean(),
  isPublished: Joi.boolean(),
  sortOrder: Joi.number().integer().min(0),
  imageUrl: httpsOrMediaUrl(),
  imageAltEn: Joi.string().allow(null, '').max(255),
  imageAltHe: Joi.string().allow(null, '').max(255),
};

export const createBody = Joi.object({
  ...fields,
  cocktailId: fields.cocktailId.required(),
  price200: fields.price200.required(),
  price500: fields.price500.required(),
});

export const patchBody = Joi.object(fields).min(1);
export const reorderBody = Joi.object({ ids: Joi.array().items(Joi.string().uuid()).min(1).required() });
