import type { OpeningHoursDto } from '@thelab/lib';
import type { AxiosInstance } from 'axios';

export class HoursAdminService {
  private readonly http: AxiosInstance;

  constructor(http: AxiosInstance) {
    this.http = http;
  }

  async list(): Promise<OpeningHoursDto[]> {
    const { data } = await this.http.get<OpeningHoursDto[]>('/api/hours');
    return data;
  }

  async replace(days: OpeningHoursDto[]): Promise<OpeningHoursDto[]> {
    const { data } = await this.http.put<OpeningHoursDto[]>('/api/hours', days);
    return data;
  }
}
