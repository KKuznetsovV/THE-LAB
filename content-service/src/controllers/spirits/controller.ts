import type { NextFunction, Request, Response } from 'express';
import { SPIRIT_CATEGORIES, type SpiritGroupDto } from '@thelab/lib';
import Spirit from '../../models/Spirit';
import { toSpirit } from '../../mappers';
import { paramId, wantsAll, wantsDeleted } from '../../http/request';
import sequelize from '../../db/sequelize';

export async function list(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const rows = await Spirit.findAll({
      where: wantsAll(req) ? {} : { isPublished: true },
      paranoid: !wantsDeleted(req),
      order: [['sortOrder', 'ASC'], ['name', 'ASC']],
    });
    const groups: SpiritGroupDto[] = SPIRIT_CATEGORIES.map((category) => ({
      category,
      items: rows.filter((row) => row.category === category).map(toSpirit),
    })).filter((group) => group.items.length > 0);
    res.json(groups);
  } catch (error) {
    next(error);
  }
}

export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const row = await Spirit.create({ ...req.body, isPublished: req.body.isPublished ?? false });
    res.status(201).json(toSpirit(row));
  } catch (error) {
    next(error);
  }
}

export async function update(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const row = await Spirit.findByPk(paramId(req.params.id), { paranoid: false });
    if (!row) {
      next({ status: 404, message: 'Not Found' });
      return;
    }
    for (const key of ['category', 'name', 'priceGlass', 'priceBottle', 'isPublished', 'sortOrder'] as const) {
      if (key in (req.body as object)) Reflect.set(row, key, req.body[key]);
    }
    await row.save();
    res.json(toSpirit(row));
  } catch (error) {
    next(error);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const row = await Spirit.findByPk(paramId(req.params.id));
    if (!row) {
      next({ status: 404, message: 'Not Found' });
      return;
    }
    const dto = toSpirit(row);
    await row.destroy();
    res.json(dto);
  } catch (error) {
    next(error);
  }
}

export async function restore(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const row = await Spirit.findByPk(paramId(req.params.id), { paranoid: false });
    if (!row) {
      next({ status: 404, message: 'Not Found' });
      return;
    }
    await row.restore();
    res.json(toSpirit(row));
  } catch (error) {
    next(error);
  }
}

export async function reorder(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const ids = req.body.ids as string[];
    await sequelize.transaction(async (transaction) => {
      for (let index = 0; index < ids.length; index += 1) {
        const id = ids[index];
        if (!id) continue;
        await Spirit.update({ sortOrder: index }, { where: { id }, transaction });
      }
    });
    const rows = await Spirit.findAll({ order: [['sortOrder', 'ASC']] });
    res.json(rows.map(toSpirit));
  } catch (error) {
    next(error);
  }
}
