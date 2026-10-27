import Joi from 'joi';

export const presignSchema = Joi.object({
  contentType: Joi.string().valid('image/jpeg', 'image/png', 'image/webp', 'image/avif').required(),
  purpose: Joi.string().valid('cocktail', 'bottle', 'event', 'gallery').required(),
});

export const deleteSchema = Joi.object({
  key: Joi.string().max(512).required(),
});
