import type { SpiritCategory, SpiritDto, SpiritGroupDto } from '@thelab/lib';
import type { AxiosInstance } from 'axios';

export type SpiritWrite = {
  category: SpiritCategory;
  name: string;
  priceGlass: number | null;
  priceBottle: number | null;
  isPublished: boolean;
};

export class SpiritsAdminService {
  private readonly http: AxiosInstance;

  constructor(http: AxiosInstance) {
    this.http = http;
  }

  async list(deleted = false): Promise<SpiritDto[]> {
    const { data } = await this.http.get<SpiritGroupDto[]>('/api/spirits', {
      params: { all: 'true', ...(deleted ? { deleted: 'true' } : {}) },
    });
    return data.flatMap((group) => group.items);
  }

  async create(body: SpiritWrite): Promise<SpiritDto> {
    const { data } = await this.http.post<SpiritDto>('/api/spirits', body);
    return data;
  }

  async update(id: string, body: Partial<SpiritWrite>): Promise<SpiritDto> {
    const { data } = await this.http.patch<SpiritDto>(`/api/spirits/${id}`, body);
    return data;
  }

  async remove(id: string): Promise<void> {
    await this.http.delete(`/api/spirits/${id}`);
  }

  async restore(id: string): Promise<SpiritDto> {
    const { data } = await this.http.post<SpiritDto>(`/api/spirits/${id}/restore`);
    return data;
  }

  async reorder(ids: string[]): Promise<void> {
    await this.http.patch('/api/spirits/reorder', { ids });
  }
}
