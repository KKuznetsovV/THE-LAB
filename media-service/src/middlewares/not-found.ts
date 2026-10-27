import type { NextFunction, Request, Response } from 'express';

export function notFound(_req: Request, _res: Response, next: NextFunction): void {
  next({ status: 404, message: 'not found' });
}
