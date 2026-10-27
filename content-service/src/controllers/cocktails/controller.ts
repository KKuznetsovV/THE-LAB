import type { NextFunction, Request, Response } from 'express';
import Cocktail from '../../models/Cocktail';
import { toCocktail } from '../../mappers';
import { paramId, text, wantsAll, wantsDeleted } from '../../http/request';
import sequelize from '../../db/sequelize';

export async function list(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const section = text(req.query.section);
    const flavour = text(req.query.flavour);
    const wanted = flavour ? flavour.split(',').map((part) => part.trim()).filter(Boolean) : [];
    const rows = await Cocktail.findAll({
      where: {
        ...(wantsAll(req) ? {} : { isPublished: true }),
        ...(section ? { section } : {}),
      },
      paranoid: !wantsDeleted(req),
      order: [['sortOrder', 'ASC'], ['code', 'ASC']],
    });
    const matched = wanted.length === 0
      ? rows
      : rows.filter((row) => wanted.some((key) => Array.isArray(row.flavours) && row.flavours.includes(key)));
    res.json(matched.map(toCocktail));
  } catch (error) {
    next(error);
  }
}

export async function getByCode(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const row = await Cocktail.findOne({ where: { code: req.params.code, isPublished: true } });
    if (!row) {
      next({ status: 404, message: 'Not Found' });
      return;
    }
    res.json(toCocktail(row));
  } catch (error) {
    next(error);
  }
}

function assign(row: Cocktail, body: Record<string, unknown>): void {
  const keys = ['code', 'indexLabel', 'section', 'nameEn', 'nameHe', 'ingredientsEn', 'ingredientsHe', 'descriptionEn', 'descriptionHe', 'price', 'flavours', 'isSignature', 'isAvailable', 'isPublished', 'sortOrder', 'imageUrl', 'imageAltEn', 'imageAltHe'] as const;
  for (const key of keys) {
    if (key in body) Reflect.set(row, key, body[key]);
  }
}

export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const row = Cocktail.build({ isPublished: false, isAvailable: true, flavours: [], indexLabel: '' });
    assign(row, req.body as Record<string, unknown>);
    await row.save();
    res.status(201).json(toCocktail(row));
  } catch (error) {
    if (error instanceof Error && error.name === 'SequelizeUniqueConstraintError') {
      next({ status: 409, message: 'Code already exists' });
      return;
    }
    next(error);
  }
}

export async function update(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const row = await Cocktail.findByPk(paramId(req.params.id), { paranoid: false });
    if (!row) {
      next({ status: 404, message: 'Not Found' });
      return;
    }
    assign(row, req.body as Record<string, unknown>);
    await row.save();
    res.json(toCocktail(row));
  } catch (error) {
    if (error instanceof Error && error.name === 'SequelizeUniqueConstraintError') {
      next({ status: 409, message: 'Code already exists' });
      return;
    }
    next(error);
  }
}

export async function availability(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const row = await Cocktail.findByPk(paramId(req.params.id));
    if (!row) {
      next({ status: 404, message: 'Not Found' });
      return;
    }
    row.isAvailable = Boolean(req.body.isAvailable);
    await row.save();
    res.json(toCocktail(row));
  } catch (error) {
    next(error);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const row = await Cocktail.findByPk(paramId(req.params.id));
    if (!row) {
      next({ status: 404, message: 'Not Found' });
      return;
    }
    await row.destroy();
    res.json(toCocktail(row));
  } catch (error) {
    next(error);
  }
}

export async function restore(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const row = await Cocktail.findByPk(paramId(req.params.id), { paranoid: false });
    if (!row) {
      next({ status: 404, message: 'Not Found' });
      return;
    }
    await row.restore();
    res.json(toCocktail(row));
  } catch (error) {
    next(error);
  }
}

export async function reorder(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const section = String(req.body.section);
    const ids = req.body.ids as string[];
    await sequelize.transaction(async (transaction) => {
      for (let index = 0; index < ids.length; index += 1) {
        const id = ids[index];
        if (!id) continue;
        await Cocktail.update({ sortOrder: index }, { where: { id, section }, transaction });
      }
    });
    const rows = await Cocktail.findAll({ where: { section }, order: [['sortOrder', 'ASC']] });
    res.json(rows.map(toCocktail));
  } catch (error) {
    next(error);
  }
}
