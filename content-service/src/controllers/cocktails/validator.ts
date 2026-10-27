import Joi from 'joi';
import { FLAVOURS, MENU_SECTIONS } from '@thelab/lib';

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
}).unknown(false);

export const codeParams = Joi.object({
  code: Joi.string().pattern(/^[A-Z0-9-]{1,6}$/).required(),
});
