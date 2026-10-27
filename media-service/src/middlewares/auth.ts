import type { NextFunction, Request, Response } from 'express';
import { readAdminToken } from '../auth/tokens';

function bearer(header: string | undefined): string | undefined {
  if (!header) return undefined;
  const [scheme, token] = header.split(' ');
  if (scheme !== 'Bearer' || !token) return undefined;
  return token;
}

export function requireWriter(req: Request, _res: Response, next: NextFunction): void {
  try {
    const token = bearer(req.header('authorization'));
    if (!token) throw { status: 401, message: 'missing token' };
    const admin = readAdminToken(token);
    if (admin.role !== 'owner' && admin.role !== 'editor') {
      throw { status: 403, message: 'forbidden' };
    }
    req.admin = admin;
    next();
  } catch (error) {
    const status = typeof error === 'object' && error !== null && 'status' in error
      ? (error as { status: unknown }).status
      : undefined;
    if (status === 401 || status === 403) {
      next(error);
      return;
    }
    next({ status: 401, message: 'invalid token' });
  }
}
