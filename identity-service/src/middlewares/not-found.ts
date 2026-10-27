import type { NextFunction, Request, Response } from 'express';

export default function notFound(_request: Request, _response: Response, next: NextFunction): void {
  next({ status: 404, message: 'Not Found' });
}
