import type { AuthResponse } from '@thelab/lib';
import axios, { type AxiosInstance } from 'axios';
import { getIdentityUrl } from '../../utils/config';

export class IdentityAuthService {
  private readonly http: AxiosInstance;
  private readonly plain = axios.create({ baseURL: getIdentityUrl() });

  constructor(http: AxiosInstance) {
    this.http = http;
  }

  async login(email: string, password: string): Promise<string> {
    const { data } = await this.plain.post<AuthResponse>('/api/auth/login', { email, password });
    if (typeof data.jwt !== 'string' || data.jwt.length === 0) {
      throw new Error('invalid email or password');
    }
    return data.jwt;
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    await this.http.patch('/api/auth/password', { currentPassword, newPassword });
  }
}
