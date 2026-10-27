import type { NextFunction, Request, Response } from 'express';
import { Op } from 'sequelize';
import Event from '../../models/Event';
import { toEvent } from '../../mappers';

export async function list(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const when = typeof req.query.when === 'string' ? req.query.when : undefined;
    const now = new Date();
    const rows = await Event.findAll({
      where: {
        isPublished: true,
        ...(when === 'upcoming'
          ? { [Op.or]: [{ endsAt: { [Op.gte]: now } }, { endsAt: null, startsAt: { [Op.gte]: now } }] }
          : {}),
        ...(when === 'past'
          ? { [Op.or]: [{ endsAt: { [Op.lt]: now } }, { endsAt: null, startsAt: { [Op.lt]: now } }] }
          : {}),
      },
      order: [['startsAt', 'ASC']],
    });
    res.json(rows.map(toEvent));
  } catch (error) {
    next(error);
  }
}

export async function getBySlug(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const row = await Event.findOne({ where: { slug: req.params.slug, isPublished: true } });
    if (!row) {
      next({ status: 404, message: 'Not Found' });
      return;
    }
    res.json(toEvent(row));
  } catch (error) {
    next(error);
  }
}
