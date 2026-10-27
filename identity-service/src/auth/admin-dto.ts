import type { AdminDto, AdminJwtPayload, AdminRole } from '@thelab/lib';
import { ADMIN_ROLES } from '@thelab/lib';

declare global {
  namespace Express {
    interface Request {
      admin?: AdminJwtPayload;
    }
  }
}

export function isRole(value: string): value is AdminRole {
  return (ADMIN_ROLES as readonly string[]).includes(value);
}

export function toAdmin(row: { id: string; name: string; email: string; role: string; isActive: boolean }): AdminDto {
  if (!isRole(row.role)) throw new Error(`Unknown admin role ${row.role}`);
  return { id: row.id, name: row.name, email: row.email, role: row.role, isActive: row.isActive };
}
