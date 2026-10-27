import type { NextFunction, Request, Response } from 'express';
import { Op } from 'sequelize';
import Event from '../../models/Event';
import { toEvent } from '../../mappers';
import { paramId, wantsAll, wantsDeleted } from '../../http/request';
import sequelize from '../../db/sequelize';

export async function list(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const when = typeof req.query.when === 'string' ? req.query.when : undefined;
    const now = new Date();
    const rows = await Event.findAll({
      where: {
        ...(wantsAll(req) ? {} : { isPublished: true }),
        ...(when === 'upcoming'
          ? { [Op.or]: [{ endsAt: { [Op.gte]: now } }, { endsAt: null, startsAt: { [Op.gte]: now } }] }
          : {}),
        ...(when === 'past'
          ? { [Op.or]: [{ endsAt: { [Op.lt]: now } }, { endsAt: null, startsAt: { [Op.lt]: now } }] }
          : {}),
      },
      order: [['startsAt', 'ASC']],
      paranoid: !wantsDeleted(req),
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

function slugify(title: string): string {
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80);
  return slug || 'event';
}

async function uniqueSlug(base: string): Promise<string> {
  let slug = base;
  let n = 2;
  while (await Event.findOne({ where: { slug }, paranoid: false })) {
    slug = `${base.slice(0, 76)}-${n}`;
    n += 1;
  }
  return slug;
}

export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const body = req.body as Record<string, unknown>;
    const slug = typeof body.slug === 'string' && body.slug ? body.slug : await uniqueSlug(slugify(String(body.titleEn)));
    const row = await Event.create({ ...body, slug, isPublished: body.isPublished ?? false, sortOrder: body.sortOrder ?? 0 });
    res.status(201).json(toEvent(row));
  } catch (error) {
    if (error instanceof Error && error.name === 'SequelizeUniqueConstraintError') {
      next({ status: 409, message: 'Slug already exists' });
      return;
    }
    next(error);
  }
}

export async function update(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const row = await Event.findByPk(paramId(req.params.id), { paranoid: false });
    if (!row) {
      next({ status: 404, message: 'Not Found' });
      return;
    }
    for (const key of ['slug', 'titleEn', 'titleHe', 'bodyEn', 'bodyHe', 'startsAt', 'endsAt', 'imageUrl', 'imageAltEn', 'imageAltHe', 'linkUrl', 'isPublished', 'sortOrder'] as const) {
      if (key in (req.body as object)) Reflect.set(row, key, req.body[key]);
    }
    await row.save();
    res.json(toEvent(row));
  } catch (error) {
    next(error);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const row = await Event.findByPk(paramId(req.params.id));
    if (!row) {
      next({ status: 404, message: 'Not Found' });
      return;
    }
    const dto = toEvent(row);
    await row.destroy();
    res.json(dto);
  } catch (error) {
    next(error);
  }
}

export async function restore(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const row = await Event.findByPk(paramId(req.params.id), { paranoid: false });
    if (!row) {
      next({ status: 404, message: 'Not Found' });
      return;
    }
    await row.restore();
    res.json(toEvent(row));
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
        await Event.update({ sortOrder: index }, { where: { id }, transaction });
      }
    });
    const rows = await Event.findAll({ order: [['sortOrder', 'ASC']] });
    res.json(rows.map(toEvent));
  } catch (error) {
    next(error);
  }
}

