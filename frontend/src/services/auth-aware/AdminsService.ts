import type { AdminDto, AdminRole } from '@thelab/lib';
import type { AxiosInstance } from 'axios';

export type AdminCreate = {
  email: string;
  name: string;
  password: string;
  role: AdminRole;
};

export class AdminsService {
  private readonly http: AxiosInstance;

  constructor(http: AxiosInstance) {
    this.http = http;
  }

  async list(): Promise<AdminDto[]> {
    const { data } = await this.http.get<AdminDto[]>('/api/admins');
    return data;
  }

  async create(body: AdminCreate): Promise<AdminDto> {
    const { data } = await this.http.post<AdminDto>('/api/admins', body);
    return data;
  }

  async update(id: string, body: Partial<Pick<AdminDto, 'name' | 'email' | 'role' | 'isActive'>>): Promise<AdminDto> {
    const { data } = await this.http.patch<AdminDto>(`/api/admins/${id}`, body);
    return data;
  }

  async deactivate(id: string): Promise<void> {
    await this.http.delete(`/api/admins/${id}`);
  }
}
