import type { AdminJwtPayload, AdminRole } from '@thelab/lib';
import { jwtDecode } from 'jwt-decode';
import { ADMIN_TOKEN_KEY } from '../../../services/auth-aware/token';

export { ADMIN_TOKEN_KEY };

export type AdminSession = AdminJwtPayload & { exp: number };

function isRole(value: unknown): value is AdminRole {
  return value === 'owner' || value === 'editor';
}

export function readSession(token: string): AdminSession | null {
  try {
    const decoded: unknown = jwtDecode(token);
    if (typeof decoded !== 'object' || decoded === null) return null;
    const row = decoded as Record<string, unknown>;
    if (typeof row.id !== 'string' || typeof row.name !== 'string' || typeof row.email !== 'string') return null;
    if (!isRole(row.role) || typeof row.exp !== 'number') return null;
    if (row.exp * 1000 <= Date.now()) return null;
    return { id: row.id, name: row.name, email: row.email, role: row.role, exp: row.exp };
  } catch {
    return null;
  }
}

export function loadToken(): string | null {
  const token = sessionStorage.getItem(ADMIN_TOKEN_KEY);
  if (!token || !readSession(token)) {
    sessionStorage.removeItem(ADMIN_TOKEN_KEY);
    return null;
  }
  return token;
}

export function storeToken(token: string): void {
  sessionStorage.setItem(ADMIN_TOKEN_KEY, token);
}

export function clearToken(): void {
  sessionStorage.removeItem(ADMIN_TOKEN_KEY);
}
