import type { AdminJwtPayload } from '@thelab/lib';

declare global {
  namespace Express {
    interface Request {
      admin?: AdminJwtPayload;
    }
  }
}

export {};
