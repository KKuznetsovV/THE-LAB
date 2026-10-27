import type { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { Op } from 'sequelize';
import Admin from '../../models/Admin';
import { isRole, toAdmin } from '../../auth/admin-dto';

function paramId(value: string | string[] | undefined): string {
  return typeof value === 'string' ? value : '';
}

async function otherActiveOwners(id: string): Promise<number> {
  return Admin.count({ where: { role: 'owner', isActive: true, id: { [Op.ne]: id } } });
}

export async function list(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const rows = await Admin.findAll({ order: [['email', 'ASC']] });
    res.json(rows.map(toAdmin));
  } catch (error) {
    next(error);
  }
}

export async function getOne(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const row = await Admin.findByPk(paramId(req.params.id));
    if (!row) {
      next({ status: 404, message: 'Not Found' });
      return;
    }
    res.json(toAdmin(row));
  } catch (error) {
    next(error);
  }
}

export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const email = String(req.body.email).trim().toLowerCase();
    const role = String(req.body.role);
    if (!isRole(role)) {
      next({ status: 422, message: 'invalid role' });
      return;
    }
    const passwordHash = await bcrypt.hash(String(req.body.password), 12);
    const row = await Admin.create({
      email,
      name: String(req.body.name).trim(),
      passwordHash,
      role,
      isActive: true,
    });
    res.status(201).json(toAdmin(row));
  } catch (error) {
    const name = error instanceof Error ? error.name : '';
    if (name === 'SequelizeUniqueConstraintError') {
      next({ status: 409, message: 'Email already exists' });
      return;
    }
    next(error);
  }
}

export async function update(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const row = await Admin.findByPk(paramId(req.params.id));
    if (!row) {
      next({ status: 404, message: 'Not Found' });
      return;
    }
    const nextRole = typeof req.body.role === 'string' ? req.body.role : row.role;
    const nextActive = typeof req.body.isActive === 'boolean' ? req.body.isActive : row.isActive;
    const losesOwner = row.role === 'owner' && row.isActive && (nextRole !== 'owner' || !nextActive);
    if (losesOwner && (await otherActiveOwners(row.id)) === 0) {
      next({ status: 409, message: 'Cannot demote or deactivate the last owner' });
      return;
    }
    if (typeof req.body.email === 'string') row.email = req.body.email.trim().toLowerCase();
    if (typeof req.body.name === 'string') row.name = req.body.name.trim();
    if (typeof req.body.role === 'string') {
      if (!isRole(req.body.role)) {
        next({ status: 422, message: 'invalid role' });
        return;
      }
      row.role = req.body.role;
    }
    if (typeof req.body.isActive === 'boolean') row.isActive = req.body.isActive;
    await row.save();
    res.json(toAdmin(row));
  } catch (error) {
    const name = error instanceof Error ? error.name : '';
    if (name === 'SequelizeUniqueConstraintError') {
      next({ status: 409, message: 'Email already exists' });
      return;
    }
    next(error);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const row = await Admin.findByPk(paramId(req.params.id));
    if (!row) {
      next({ status: 404, message: 'Not Found' });
      return;
    }
    if (row.role === 'owner' && row.isActive && (await otherActiveOwners(row.id)) === 0) {
      next({ status: 409, message: 'Cannot deactivate the last owner' });
      return;
    }
    row.isActive = false;
    await row.save();
    res.json(toAdmin(row));
  } catch (error) {
    next(error);
  }
}
