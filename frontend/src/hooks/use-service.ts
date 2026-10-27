import type { AxiosInstance } from 'axios';
import { useMemo } from 'react';
import { AdminsService } from '../services/auth-aware/AdminsService';
import { BottlesAdminService } from '../services/auth-aware/BottlesAdminService';
import { contentHttp, identityHttp, mediaHttp } from '../services/auth-aware/clients';
import { CocktailsAdminService } from '../services/auth-aware/CocktailsAdminService';
import { EventsAdminService } from '../services/auth-aware/EventsAdminService';
import { GalleryAdminService } from '../services/auth-aware/GalleryAdminService';
import { HoursAdminService } from '../services/auth-aware/HoursAdminService';
import { IdentityAuthService } from '../services/auth-aware/IdentityAuthService';
import { SettingsAdminService } from '../services/auth-aware/SettingsAdminService';
import { SpiritsAdminService } from '../services/auth-aware/SpiritsAdminService';
import { UploadsService, type UploadPurpose } from '../services/auth-aware/UploadsService';

type HttpKind = 'content' | 'identity' | 'media';

const clients = {
  content: contentHttp,
  identity: identityHttp,
  media: mediaHttp,
} as const;

export function useService<T>(factory: (http: AxiosInstance) => T, kind: HttpKind): T {
  const http = clients[kind];
  return useMemo(() => factory(http), [factory, http]);
}

const cocktails = (http: AxiosInstance) => new CocktailsAdminService(http);
const bottles = (http: AxiosInstance) => new BottlesAdminService(http);
const spirits = (http: AxiosInstance) => new SpiritsAdminService(http);
const events = (http: AxiosInstance) => new EventsAdminService(http);
const gallery = (http: AxiosInstance) => new GalleryAdminService(http);
const hours = (http: AxiosInstance) => new HoursAdminService(http);
const settings = (http: AxiosInstance) => new SettingsAdminService(http);
const admins = (http: AxiosInstance) => new AdminsService(http);
const identity = (http: AxiosInstance) => new IdentityAuthService(http);
const uploads = (http: AxiosInstance) => new UploadsService(http);

export const useCocktailsAdmin = () => useService(cocktails, 'content');
export const useBottlesAdmin = () => useService(bottles, 'content');
export const useSpiritsAdmin = () => useService(spirits, 'content');
export const useEventsAdmin = () => useService(events, 'content');
export const useGalleryAdmin = () => useService(gallery, 'content');
export const useHoursAdmin = () => useService(hours, 'content');
export const useSettingsAdmin = () => useService(settings, 'content');
export const useAdminsService = () => useService(admins, 'identity');
export const useIdentityAuth = () => useService(identity, 'identity');
export const useUploads = () => useService(uploads, 'media');

export type { UploadPurpose };
