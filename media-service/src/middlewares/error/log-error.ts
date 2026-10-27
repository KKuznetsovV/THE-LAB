import type { NextFunction, Request, Response } from 'express';

export function logError(error: unknown, _req: Request, _res: Response, next: NextFunction): void {
  const message = error instanceof Error ? error.message : 'request failed';
  console.error(message);
  next(error);
}
