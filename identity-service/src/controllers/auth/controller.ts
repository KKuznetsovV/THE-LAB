import type { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import Admin from '../../models/Admin';
import { toAdmin } from '../../auth/admin-dto';
import { signAdmin } from '../../auth/tokens';

const INVALID = 'invalid email or password';

export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const email = String(req.body.email).trim().toLowerCase();
    const password = String(req.body.password);
    const row = await Admin.findOne({ where: { email } });
    const hash = row?.passwordHash ?? '$2b$12$invalidinvalidinvalidinvalidinvalidinvalidinvalidinvali';
    const matches = await bcrypt.compare(password, hash);
    if (!row || !row.isActive || !matches) {
      next({ status: 401, message: INVALID });
      return;
    }
    row.lastLoginAt = new Date();
    await row.save();
    const jwt = signAdmin({ id: row.id, name: row.name, email: row.email, role: toAdmin(row).role });
    res.json({ jwt });
  } catch (error) {
    next(error);
  }
}

export async function me(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = req.admin?.id;
    if (!id) {
      next({ status: 401, message: 'Unauthorized' });
      return;
    }
    const row = await Admin.findByPk(id);
    if (!row || !row.isActive) {
      next({ status: 401, message: 'Unauthorized' });
      return;
    }
    res.json(toAdmin(row));
  } catch (error) {
    next(error);
  }
}

export async function changePassword(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = req.admin?.id;
    if (!id) {
      next({ status: 401, message: 'Unauthorized' });
      return;
    }
    const row = await Admin.findByPk(id);
    if (!row || !row.isActive) {
      next({ status: 401, message: 'Unauthorized' });
      return;
    }
    const current = String(req.body.currentPassword);
    const nextPassword = String(req.body.newPassword);
    const matches = await bcrypt.compare(current, row.passwordHash);
    if (!matches) {
      next({ status: 401, message: 'invalid email or password' });
      return;
    }
    row.passwordHash = await bcrypt.hash(nextPassword, 12);
    await row.save();
    res.json({ status: 200, message: 'Password updated' });
  } catch (error) {
    next(error);
  }
}
