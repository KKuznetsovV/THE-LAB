import type { NextFunction, Request, Response } from 'express';
import { SPIRIT_CATEGORIES, type SpiritGroupDto } from '@thelab/lib';
import Spirit from '../../models/Spirit';
import { toSpirit } from '../../mappers';

export async function list(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const rows = await Spirit.findAll({
      where: { isPublished: true },
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
