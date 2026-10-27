import config from 'config';
import Joi from 'joi';

export function httpsOrMediaUrl() {
  return Joi.string().allow(null, '').custom((value: unknown, helpers) => {
    if (value === null || value === '') return value;
    if (typeof value !== 'string') return helpers.error('any.invalid');
    const base = config.get<string>('app.mediaBaseUrl');
    if (value.startsWith('https://') || (base.length > 0 && value.startsWith(base))) return value;
    return helpers.error('string.uri');
  }, 'https or media url');
}

export function httpsUrl() {
  return Joi.string().allow('').uri({ scheme: ['https'] });
}
