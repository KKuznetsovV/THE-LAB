import type { NextFunction, Request, Response } from 'express';
import { readAdminToken } from '../auth/tokens';

export default function authEnforce(request: Request, _response: Response, next: NextFunction): void {
  const header = request.header('authorization');
  if (!header || !header.startsWith('Bearer ')) {
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
