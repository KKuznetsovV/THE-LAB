import { getContentUrl, getIdentityUrl, getMediaUrl } from '../../utils/config';
import { createAuthed } from './http';

let onUnauthorized = (): void => undefined;

export function bindUnauthorized(handler: () => void): void {
  onUnauthorized = handler;
}

export const contentHttp = createAuthed(getContentUrl(), () => {
  onUnauthorized();
});

export const identityHttp = createAuthed(getIdentityUrl(), () => {
  onUnauthorized();
});

export const mediaHttp = createAuthed(getMediaUrl(), () => {
  onUnauthorized();
});
