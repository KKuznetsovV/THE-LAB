import type { NextFunction, Request, Response } from 'express';

type AppError = { status?: number; message?: string; referenceId?: string };

export default function respondError(error: AppError, _request: Request, response: Response, _next: NextFunction): void {
  if (!error.status) {
    response.status(500).json({
      status: 500,
      message: 'An unexpected error occurred. Please contact support.',
      referenceId: error.referenceId,
    });
    return;
  }
  response.status(error.status).json({ status: error.status, message: error.message ?? 'Internal Server Error' });
}
