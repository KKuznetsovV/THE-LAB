import Joi from 'joi';
import { SPIRIT_CATEGORIES } from '@thelab/lib';

export const idParams = Joi.object({ id: Joi.string().uuid().required() });
const fields = {
  category: Joi.string().valid(...SPIRIT_CATEGORIES),
  name: Joi.string().max(80),
  priceGlass: Joi.number().integer().min(0).max(2000).allow(null),
  priceBottle: Joi.number().integer().min(0).max(2000).allow(null),
  isPublished: Joi.boolean(),
  sortOrder: Joi.number().integer().min(0),
};
export const createBody = Joi.object({ ...fields, category: fields.category.required(), name: fields.name.required() });
export const patchBody = Joi.object(fields).min(1);
export const reorderBody = Joi.object({ ids: Joi.array().items(Joi.string().uuid()).min(1).required() });
