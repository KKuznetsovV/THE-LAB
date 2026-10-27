import type { AdminJwtPayload, AdminRole } from '@thelab/lib';
import { ADMIN_ROLES } from '@thelab/lib';
import config from 'config';
import jwt from 'jsonwebtoken';

const DEFAULT_SECRET = 'dev-only-secret-change-me';

export function assertProductionSecret(): void {
  if (process.env.NODE_ENV !== 'production') return;
  const secret = config.get<string>('app.jwtSecret');
  if (secret === DEFAULT_SECRET || secret.length < 32) {
    throw new Error('Refusing to start: THELAB_JWT_SECRET is missing, default, or shorter than 32 characters');
  }
}

export function signAdmin(payload: AdminJwtPayload): string {
  const secret = config.get<string>('app.jwtSecret');
  const expiresIn = config.get<string>('app.jwtExpiresIn');
  return jwt.sign(payload, secret, { expiresIn: expiresIn as jwt.SignOptions['expiresIn'] });
}

function isRole(value: unknown): value is AdminRole {
  return typeof value === 'string' && (ADMIN_ROLES as readonly string[]).includes(value);
}

export function readAdminToken(token: string): AdminJwtPayload {
  const secret = config.get<string>('app.jwtSecret');
  const decoded: unknown = jwt.verify(token, secret);
  if (typeof decoded !== 'object' || decoded === null) throw new Error('invalid token');
  const record = decoded as Record<string, unknown>;
  if (typeof record.id !== 'string' || typeof record.name !== 'string' || typeof record.email !== 'string' || !isRole(record.role)) {
    throw new Error('invalid token');
  }
  return { id: record.id, name: record.name, email: record.email, role: record.role };
}
