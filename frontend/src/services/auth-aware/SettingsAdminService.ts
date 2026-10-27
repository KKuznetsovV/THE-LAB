import type { SiteSettingsDto } from '@thelab/lib';
import type { AxiosInstance } from 'axios';

export class SettingsAdminService {
  private readonly http: AxiosInstance;

  constructor(http: AxiosInstance) {
    this.http = http;
  }

  async get(): Promise<SiteSettingsDto> {
    const { data } = await this.http.get<SiteSettingsDto>('/api/settings');
    return data;
  }

  async update(body: Partial<Omit<SiteSettingsDto, 'id'>>): Promise<SiteSettingsDto> {
    const { data } = await this.http.patch<SiteSettingsDto>('/api/settings', body);
    return data;
  }
}
