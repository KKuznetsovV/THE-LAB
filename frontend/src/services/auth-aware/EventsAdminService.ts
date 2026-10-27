import type { EventDto } from '@thelab/lib';
import type { AxiosInstance } from 'axios';

export type EventWrite = {
  slug?: string;
  titleEn: string;
  titleHe: string;
  bodyEn: string;
  bodyHe: string;
  startsAt: string;
  endsAt: string | null;
  imageUrl: string | null;
  imageAltEn: string | null;
  imageAltHe: string | null;
  linkUrl: string | null;
  isPublished: boolean;
};

export class EventsAdminService {
  private readonly http: AxiosInstance;

  constructor(http: AxiosInstance) {
    this.http = http;
  }

  async list(deleted = false): Promise<EventDto[]> {
    const { data } = await this.http.get<EventDto[]>('/api/events', {
      params: { all: 'true', ...(deleted ? { deleted: 'true' } : {}) },
    });
    return data;
  }

  async create(body: EventWrite): Promise<EventDto> {
    const { data } = await this.http.post<EventDto>('/api/events', body);
    return data;
  }

  async update(id: string, body: Partial<EventWrite>): Promise<EventDto> {
    const { data } = await this.http.patch<EventDto>(`/api/events/${id}`, body);
    return data;
  }

  async remove(id: string): Promise<void> {
    await this.http.delete(`/api/events/${id}`);
  }

  async restore(id: string): Promise<EventDto> {
    const { data } = await this.http.post<EventDto>(`/api/events/${id}/restore`);
    return data;
  }

  async reorder(ids: string[]): Promise<void> {
    await this.http.patch('/api/events/reorder', { ids });
  }
}
