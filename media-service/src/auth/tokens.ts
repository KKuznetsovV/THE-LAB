import type { AdminJwtPayload, AdminRole } from '@thelab/lib';
import config from 'config';
import jwt from 'jsonwebtoken';

const DEFAULT_SECRET = 'dev-only-secret-change-me';
const ROLES: readonly AdminRole[] = ['owner', 'editor'];

export function assertProductionSecret(): void {
  if (process.env.NODE_ENV !== 'production') return;
  const secret = config.get<string>('app.jwtSecret');
  if (secret === DEFAULT_SECRET || secret.length < 32) {
    throw new Error('Refusing to start: THELAB_JWT_SECRET is missing, default, or shorter than 32 characters');
  }
}

function isRole(value: unknown): value is AdminRole {
  return typeof value === 'string' && ROLES.some((role) => role === value);
}

function isPayload(value: unknown): value is AdminJwtPayload {
  if (typeof value !== 'object' || value === null) return false;
  const row = value as Record<string, unknown>;
  return typeof row.id === 'string'
    && typeof row.name === 'string'
    && typeof row.email === 'string'
    && isRole(row.role);
}

export function readAdminToken(token: string): AdminJwtPayload {
  const decoded: unknown = jwt.verify(token, config.get<string>('app.jwtSecret'));
  if (!isPayload(decoded)) throw { status: 401, message: 'invalid token' };
  return { id: decoded.id, name: decoded.name, email: decoded.email, role: decoded.role };
}
