import type { NextFunction, Request, Response } from 'express';
import Bottle from '../../models/Bottle';
import { toBottle } from '../../mappers';

export async function list(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const rows = await Bottle.findAll({
      where: { isPublished: true },
      include: [{ association: 'cocktail', where: { isPublished: true }, required: true }],
      order: [['sortOrder', 'ASC']],
    });
    res.json(rows.map(toBottle));
  } catch (error) {
    next(error);
  }
}
