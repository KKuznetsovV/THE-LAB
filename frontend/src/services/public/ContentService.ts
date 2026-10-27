import type {
  BottleDto,
  CocktailDto,
  EventDto,
  GalleryImageDto,
  OpeningHoursDto,
  SiteSettingsDto,
  SpiritGroupDto,
} from '@thelab/lib';
import axios from 'axios';
import { getContentUrl } from '../../utils/config';

const http = axios.create({ baseURL: getContentUrl() });

export type CocktailQuery = {
  section?: string;
  flavour?: string;
};

export class ContentService {
  async getSettings(): Promise<SiteSettingsDto> {
    const { data } = await http.get<SiteSettingsDto>('/api/settings');
    return data;
  }

  async getHours(): Promise<OpeningHoursDto[]> {
    const { data } = await http.get<OpeningHoursDto[]>('/api/hours');
    return data;
  }

  async getCocktails(params?: CocktailQuery): Promise<CocktailDto[]> {
    const { data } = await http.get<CocktailDto[]>('/api/cocktails', { params });
    return data;
  }

  async getCocktail(code: string): Promise<CocktailDto> {
    const { data } = await http.get<CocktailDto>(`/api/cocktails/${encodeURIComponent(code)}`);
    return data;
  }

  async getBottles(): Promise<BottleDto[]> {
    const { data } = await http.get<BottleDto[]>('/api/bottles');
    return data;
  }

  async getSpirits(): Promise<SpiritGroupDto[]> {
    const { data } = await http.get<SpiritGroupDto[]>('/api/spirits');
    return data;
  }

  async getEvents(when?: 'upcoming' | 'past'): Promise<EventDto[]> {
    const { data } = await http.get<EventDto[]>('/api/events', { params: when ? { when } : undefined });
    return data;
  }

  async getEvent(slug: string): Promise<EventDto> {
    const { data } = await http.get<EventDto>(`/api/events/${encodeURIComponent(slug)}`);
    return data;
  }

  async getGallery(): Promise<GalleryImageDto[]> {
    const { data } = await http.get<GalleryImageDto[]>('/api/gallery');
    return data;
  }
}

export const contentService = new ContentService();
