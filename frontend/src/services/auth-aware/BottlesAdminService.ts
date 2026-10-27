import type { BottleDto } from '@thelab/lib';
import type { AxiosInstance } from 'axios';

export type BottleWrite = {
  cocktailId: string;
  price200: number;
  price500: number;
  isAvailable: boolean;
  isPublished: boolean;
  imageUrl: string | null;
  imageAltEn: string | null;
  imageAltHe: string | null;
};

export class BottlesAdminService {
  private readonly http: AxiosInstance;

  constructor(http: AxiosInstance) {
    this.http = http;
  }

  async list(deleted = false): Promise<BottleDto[]> {
    const { data } = await this.http.get<BottleDto[]>('/api/bottles', {
      params: { all: 'true', ...(deleted ? { deleted: 'true' } : {}) },
    });
    return data;
  }

  async create(body: BottleWrite): Promise<BottleDto> {
    const { data } = await this.http.post<BottleDto>('/api/bottles', body);
    return data;
  }

  async update(id: string, body: Partial<BottleWrite>): Promise<BottleDto> {
    const { data } = await this.http.patch<BottleDto>(`/api/bottles/${id}`, body);
    return data;
  }

  async remove(id: string): Promise<void> {
    await this.http.delete(`/api/bottles/${id}`);
  }

  async restore(id: string): Promise<BottleDto> {
    const { data } = await this.http.post<BottleDto>(`/api/bottles/${id}/restore`);
    return data;
  }

  async reorder(ids: string[]): Promise<void> {
    await this.http.patch('/api/bottles/reorder', { ids });
  }
}
