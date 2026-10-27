import { getSiteUrl } from './config';

/** Public origin used for canonical, hreflang and Open Graph URLs. */
export function siteOrigin(): string {
  const value = getSiteUrl().trim().replace(/\/$/, '');
  return value || 'https://thelabtlv.com';
}

export function absoluteUrl(path: string): string {
  if (path === '/') return `${siteOrigin()}/`;
  return `${siteOrigin()}${path}`;
}
