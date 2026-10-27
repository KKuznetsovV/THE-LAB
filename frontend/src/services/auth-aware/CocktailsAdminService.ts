import type { CocktailDto, Flavour, MenuSection } from '@thelab/lib';
import type { AxiosInstance } from 'axios';

export type CocktailWrite = {
  code: string;
  indexLabel: string;
  section: MenuSection;
  nameEn: string;
  nameHe: string;
  ingredientsEn: string;
  ingredientsHe: string;
  descriptionEn: string | null;
  descriptionHe: string | null;
  price: number | null;
  flavours: Flavour[];
  isSignature: boolean;
  isAvailable: boolean;
  isPublished: boolean;
  imageUrl: string | null;
  imageAltEn: string | null;
  imageAltHe: string | null;
};

export class CocktailsAdminService {
  private readonly http: AxiosInstance;

  constructor(http: AxiosInstance) {
    this.http = http;
  }

  async list(deleted = false): Promise<CocktailDto[]> {
    const { data } = await this.http.get<CocktailDto[]>('/api/cocktails', {
      params: { all: 'true', ...(deleted ? { deleted: 'true' } : {}) },
    });
    return data;
  }

  async create(body: CocktailWrite): Promise<CocktailDto> {
    const { data } = await this.http.post<CocktailDto>('/api/cocktails', body);
    return data;
  }

  async update(id: string, body: Partial<CocktailWrite>): Promise<CocktailDto> {
    const { data } = await this.http.patch<CocktailDto>(`/api/cocktails/${id}`, body);
    return data;
  }

  async availability(id: string, isAvailable: boolean): Promise<CocktailDto> {
    const { data } = await this.http.patch<CocktailDto>(`/api/cocktails/${id}/availability`, { isAvailable });
    return data;
  }

  async remove(id: string): Promise<void> {
    await this.http.delete(`/api/cocktails/${id}`);
  }

  async restore(id: string): Promise<CocktailDto> {
    const { data } = await this.http.post<CocktailDto>(`/api/cocktails/${id}/restore`);
    return data;
  }

  async reorder(section: MenuSection, ids: string[]): Promise<void> {
    await this.http.patch('/api/cocktails/reorder', { section, ids });
  }
}
