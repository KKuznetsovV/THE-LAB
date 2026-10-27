import type { AdminJwtPayload } from '@thelab/lib';
import type { NextFunction, Request, Response } from 'express';
import { readAdminToken } from '../auth/tokens';

declare global {
  namespace Express {
    interface Request {
      admin?: AdminJwtPayload;
    }
  }
}

export function optionalAuth(request: Request, _response: Response, next: NextFunction): void {
  const header = request.header('authorization');
  if (!header) {
    next();
    return;
  }
  if (!header.startsWith('Bearer ')) {
    next({ status: 401, message: 'Unauthorized' });
    return;
  }
  try {
    request.admin = readAdminToken(header.slice('Bearer '.length));
    next();
  } catch {
    next({ status: 401, message: 'Unauthorized' });
  }
}

export function requireWriter(request: Request, _response: Response, next: NextFunction): void {
  const role = request.admin?.role;
  if (!request.admin) {
    next({ status: 401, message: 'Unauthorized' });
    return;
  }
  if (role !== 'owner' && role !== 'editor') {
    next({ status: 403, message: 'Forbidden' });
    return;
  }
  next();
}
