import type { NextFunction, Request, Response } from 'express';
import Cocktail from '../../models/Cocktail';
import { toCocktail } from '../../mappers';

function text(value: unknown): string | undefined {
  return typeof value === 'string' && value.length > 0 ? value : undefined;
}

export async function list(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const section = text(req.query.section);
    const flavour = text(req.query.flavour);
    const wanted = flavour ? flavour.split(',').map((part) => part.trim()).filter(Boolean) : [];
    const rows = await Cocktail.findAll({
      where: { isPublished: true, ...(section ? { section } : {}) },
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
