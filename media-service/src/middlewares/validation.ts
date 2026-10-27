import type { NextFunction, Request, Response } from 'express';
import type { Schema } from 'joi';

export function validateBody(schema: Schema) {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      req.body = await schema.validateAsync(req.body, { abortEarly: false, stripUnknown: true });
      next();
    } catch (error) {
      next({ status: 422, message: error instanceof Error ? error.message : 'invalid body' });
    }
  };
}
