import Joi from 'joi';
import { ADMIN_ROLES } from '@thelab/lib';

export const idParams = Joi.object({
  id: Joi.string().uuid().required(),
});

export const createBody = Joi.object({
  email: Joi.string().email().required(),
  name: Joi.string().trim().min(1).max(80).required(),
  password: Joi.string().min(12).required(),
  role: Joi.string().valid(...ADMIN_ROLES).required(),
});

export const patchBody = Joi.object({
  email: Joi.string().email(),
  name: Joi.string().trim().min(1).max(80),
  role: Joi.string().valid(...ADMIN_ROLES),
  isActive: Joi.boolean(),
}).min(1);
