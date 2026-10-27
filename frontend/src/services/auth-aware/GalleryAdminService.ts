import type { GalleryImageDto } from '@thelab/lib';
import type { AxiosInstance } from 'axios';

export type GalleryWrite = {
  url: string;
  altEn: string;
  altHe: string;
  credit: string | null;
  isPublished: boolean;
};

export class GalleryAdminService {
  private readonly http: AxiosInstance;

  constructor(http: AxiosInstance) {
    this.http = http;
  }

  async list(deleted = false): Promise<GalleryImageDto[]> {
    const { data } = await this.http.get<GalleryImageDto[]>('/api/gallery', {
      params: { all: 'true', ...(deleted ? { deleted: 'true' } : {}) },
    });
    return data;
  }

  async create(body: GalleryWrite): Promise<GalleryImageDto> {
    const { data } = await this.http.post<GalleryImageDto>('/api/gallery', body);
    return data;
  }

  async update(id: string, body: Partial<GalleryWrite>): Promise<GalleryImageDto> {
    const { data } = await this.http.patch<GalleryImageDto>(`/api/gallery/${id}`, body);
    return data;
  }

  async remove(id: string): Promise<void> {
    await this.http.delete(`/api/gallery/${id}`);
  }

  async restore(id: string): Promise<GalleryImageDto> {
    const { data } = await this.http.post<GalleryImageDto>(`/api/gallery/${id}/restore`);
    return data;
  }

  async reorder(ids: string[]): Promise<void> {
    await this.http.patch('/api/gallery/reorder', { ids });
  }
}
