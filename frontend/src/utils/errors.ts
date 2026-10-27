import axios from 'axios';
import type { ApiError } from '@thelab/lib';

function apiMessage(data: unknown): string | undefined {
  if (typeof data !== 'object' || data === null || !('message' in data)) return undefined;
  const message = (data as ApiError).message;
  return typeof message === 'string' && message.length > 0 ? message : undefined;
}

export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    return apiMessage(error.response?.data) ?? error.message;
  }
  if (error instanceof Error && error.message.length > 0) return error.message;
  return 'request failed';
}
