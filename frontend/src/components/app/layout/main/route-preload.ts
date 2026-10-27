import type { ComponentType } from 'react';

const loaders = {
  menu: () => import('../../../menu/Menu'),
  'take-me-home': () => import('../../../take-me-home/TakeMeHome'),
  visit: () => import('../../../visit/Visit'),
  events: () => import('../../../events/Events'),
  archive: () => import('../../../archive/Archive'),
  about: () => import('../../../about/About'),
  accessibility: () => import('../../../legal/accessibility/Accessibility'),
  privacy: () => import('../../../legal/privacy/Privacy'),
} as const;

export type PageKey = keyof typeof loaders;

export const readyPages: Partial<Record<PageKey, ComponentType>> = {};

export function preloadRoute(pathname: string): Promise<unknown> {
  const bare = pathname.replace(/^\/en(?=\/|$)/, '').replace(/^\//, '');
  const key = bare.split('/')[0] as PageKey;
  const load = loaders[key];
  if (!load) return Promise.resolve();
  return load().then((mod) => {
    readyPages[key] = mod.default;
  });
}
