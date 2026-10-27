import type { AdminRole } from '@thelab/lib';
import type { NextFunction, Request, Response } from 'express';

export default function requireRole(roles: AdminRole[]) {
  return (request: Request, _response: Response, next: NextFunction): void => {
    const role = request.admin?.role;
    if (!role || !roles.includes(role)) {
      next({ status: 403, message: 'Forbidden' });
      return;
    }
    next();
  };
}
