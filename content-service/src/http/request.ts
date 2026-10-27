import type { Request } from 'express';

export function wantsAll(request: Request): boolean {
  return Boolean(request.admin) && request.query.all === 'true';
}

export function wantsDeleted(request: Request): boolean {
  return wantsAll(request) && request.query.deleted === 'true';
}

export function text(value: unknown): string | undefined {
  return typeof value === 'string' && value.length > 0 ? value : undefined;
}

export function paramId(value: string | string[] | undefined): string {
  return typeof value === 'string' ? value : '';
}
