import type { NextFunction, Request, Response } from 'express';
import type { ObjectSchema } from 'joi';

type Validators = {
  body?: ObjectSchema;
  params?: ObjectSchema;
  query?: ObjectSchema;
};

function messageOf(error: unknown): string {
  if (error instanceof Error && error.message) return error.message;
  return 'unprocessable entity';
}

export default function validate(validators: Validators) {
  return async (request: Request, _response: Response, next: NextFunction): Promise<void> => {
    try {
      if (validators.body) request.body = await validators.body.validateAsync(request.body);
      if (validators.params) request.params = await validators.params.validateAsync(request.params);
      if (validators.query) Object.assign(request.query, await validators.query.validateAsync(request.query));
      next();
    } catch (error) {
      next({ status: 422, message: messageOf(error) });
    }
  };
}
