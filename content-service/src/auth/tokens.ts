import { ADMIN_ROLES, type AdminJwtPayload, type AdminRole } from '@thelab/lib';
import config from 'config';
import jwt from 'jsonwebtoken';

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
