import type { NextFunction, Request, Response } from 'express';
import Bottle from '../../models/Bottle';
import { toBottle } from '../../mappers';
import { paramId, wantsAll, wantsDeleted } from '../../http/request';
import sequelize from '../../db/sequelize';

const include = [{ association: 'cocktail', required: false }];

export async function list(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const rows = await Bottle.findAll({
      where: wantsAll(req) ? {} : { isPublished: true },
      include: [{ association: 'cocktail', where: wantsAll(req) ? undefined : { isPublished: true }, required: true }],
      paranoid: !wantsDeleted(req),
      order: [['sortOrder', 'ASC']],
    });
    res.json(rows.map(toBottle));
  } catch (error) {
    next(error);
  }
}

function assign(row: Bottle, body: Record<string, unknown>): void {
  for (const key of ['cocktailId', 'price200', 'price500', 'isAvailable', 'isPublished', 'sortOrder', 'imageUrl', 'imageAltEn', 'imageAltHe'] as const) {
    if (key in body) Reflect.set(row, key, body[key]);
  }
}

export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const row = await Bottle.create({ ...req.body, isPublished: req.body.isPublished ?? false, isAvailable: req.body.isAvailable ?? true });
    await row.reload({ include });
    res.status(201).json(toBottle(row));
  } catch (error) {
    next(error);
  }
}

export async function update(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const row = await Bottle.findByPk(paramId(req.params.id), { paranoid: false });
    if (!row) {
      next({ status: 404, message: 'Not Found' });
      return;
    }
    assign(row, req.body as Record<string, unknown>);
    await row.save();
    await row.reload({ include });
    res.json(toBottle(row));
  } catch (error) {
    next(error);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const row = await Bottle.findByPk(paramId(req.params.id), { include });
    if (!row) {
      next({ status: 404, message: 'Not Found' });
      return;
    }
    const dto = toBottle(row);
    await row.destroy();
    res.json(dto);
  } catch (error) {
    next(error);
  }
}

export async function restore(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const row = await Bottle.findByPk(paramId(req.params.id), { paranoid: false });
    if (!row) {
      next({ status: 404, message: 'Not Found' });
      return;
    }
    await row.restore();
    await row.reload({ include });
    res.json(toBottle(row));
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
        await Bottle.update({ sortOrder: index }, { where: { id }, transaction });
      }
    });
    const rows = await Bottle.findAll({ include, order: [['sortOrder', 'ASC']] });
    res.json(rows.map(toBottle));
  } catch (error) {
    next(error);
  }
}
