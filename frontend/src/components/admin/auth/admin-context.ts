import type { AxiosInstance } from 'axios';
import { createContext, useContext } from 'react';
import type { AdminSession } from './session';

export type AdminAuthValue = {
  user: AdminSession | null;
  accept: (jwt: string) => void;
  logout: () => void;
};

export const AdminAuthContext = createContext<AdminAuthValue | null>(null);

export function useAdminAuth(): AdminAuthValue {
  const value = useContext(AdminAuthContext);
  if (!value) throw new Error('AdminAuth missing');
  return value;
}

export type AdminHttp = AxiosInstance;
