import type { NextFunction, Request, Response } from 'express';

function statusOf(error: unknown): number {
  if (typeof error === 'object' && error !== null && 'status' in error) {
    const status = (error as { status: unknown }).status;
    if (typeof status === 'number') return status;
  }
  return 500;
}

function messageOf(error: unknown): string {
  if (typeof error === 'object' && error !== null && 'message' in error) {
    const message = (error as { message: unknown }).message;
    if (typeof message === 'string' && message.length > 0) return message;
  }
  return 'internal error';
}

export function errorResponder(error: unknown, _req: Request, res: Response, _next: NextFunction): void {
  const status = statusOf(error);
  res.status(status).json({ status, message: status >= 500 ? 'internal error' : messageOf(error) });
}
