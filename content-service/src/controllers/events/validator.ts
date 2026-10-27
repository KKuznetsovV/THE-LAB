import Joi from 'joi';

export const listQuery = Joi.object({
  when: Joi.string().valid('upcoming', 'past'),
}).unknown(false);

export const slugParams = Joi.object({
  slug: Joi.string().pattern(/^[a-z0-9-]{1,80}$/).required(),
});
