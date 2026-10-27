/** Empty string means the API is served from the same origin (nginx). */
function readUrl(value: string | undefined): string {
  return value ?? '';
}

export function getContentUrl(): string {
  return readUrl(import.meta.env.VITE_CONTENT_URL);
}

export function getIdentityUrl(): string {
  return readUrl(import.meta.env.VITE_IDENTITY_URL);
}

export function getMediaUrl(): string {
  return readUrl(import.meta.env.VITE_MEDIA_URL);
}

export function getSiteUrl(): string {
  return readUrl(import.meta.env.VITE_SITE_URL);
}
