import Joi from 'joi';

export const loginBody = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const passwordBody = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: Joi.string().min(12).required(),
});
