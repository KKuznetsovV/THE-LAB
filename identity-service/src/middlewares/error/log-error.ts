import { randomUUID } from 'node:crypto';
import type { NextFunction, Request, Response } from 'express';

type AppError = { status?: number; message?: string; referenceId?: string };

export default function logError(error: AppError, request: Request, _response: Response, next: NextFunction): void {
  if (!error.status) {
    error.referenceId = randomUUID();
    console.error(`[${error.referenceId}] ${request.method} ${request.url}`, error);
  } else {
    console.error(`${request.method} ${request.url}`, error.message ?? error);
  }
  next(error);
}
