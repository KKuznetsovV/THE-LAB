import type { NextFunction, Request, Response } from 'express';
import GalleryImage from '../../models/GalleryImage';
import OpeningHours from '../../models/OpeningHours';
import SiteSettings from '../../models/SiteSettings';
import { toGallery, toHours, toSettings } from '../../mappers';
import { paramId, wantsAll, wantsDeleted } from '../../http/request';
import sequelize from '../../db/sequelize';

export async function gallery(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const rows = await GalleryImage.findAll({
      where: wantsAll(req) ? {} : { isPublished: true },
      paranoid: !wantsDeleted(req),
      order: [['sortOrder', 'ASC']],
    });
    res.json(rows.map(toGallery));
  } catch (error) {
    next(error);
  }
}

export async function hours(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const rows = await OpeningHours.findAll({ order: [['dayOfWeek', 'ASC']] });
    res.json(rows.map(toHours));
  } catch (error) {
    next(error);
  }
}

export async function settings(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const row = await SiteSettings.findByPk('main');
    if (!row) {
      next({ status: 404, message: 'Not Found' });
      return;
    }
    res.json(toSettings(row));
  } catch (error) {
    next(error);
  }
}

export function health(_req: Request, res: Response): void {
  res.json({ ok: true });
}

export async function createGallery(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const row = await GalleryImage.create({ ...req.body, isPublished: req.body.isPublished ?? false, sortOrder: req.body.sortOrder ?? 0 });
    res.status(201).json(toGallery(row));
  } catch (error) {
    next(error);
  }
}

export async function updateGallery(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const row = await GalleryImage.findByPk(paramId(req.params.id), { paranoid: false });
    if (!row) {
      next({ status: 404, message: 'Not Found' });
      return;
    }
    for (const key of ['url', 'altEn', 'altHe', 'credit', 'sortOrder', 'isPublished'] as const) {
      if (key in (req.body as object)) Reflect.set(row, key, req.body[key]);
    }
    await row.save();
    res.json(toGallery(row));
  } catch (error) {
    next(error);
  }
}

export async function removeGallery(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const row = await GalleryImage.findByPk(paramId(req.params.id));
    if (!row) {
      next({ status: 404, message: 'Not Found' });
      return;
    }
    const dto = toGallery(row);
    await row.destroy();
    res.json(dto);
  } catch (error) {
    next(error);
  }
}

export async function restoreGallery(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const row = await GalleryImage.findByPk(paramId(req.params.id), { paranoid: false });
    if (!row) {
      next({ status: 404, message: 'Not Found' });
      return;
    }
    await row.restore();
    res.json(toGallery(row));
  } catch (error) {
    next(error);
  }
}

export async function reorderGallery(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const ids = req.body.ids as string[];
    await sequelize.transaction(async (transaction) => {
      for (let index = 0; index < ids.length; index += 1) {
        const id = ids[index];
        if (!id) continue;
        await GalleryImage.update({ sortOrder: index }, { where: { id }, transaction });
      }
    });
    const rows = await GalleryImage.findAll({ order: [['sortOrder', 'ASC']] });
    res.json(rows.map(toGallery));
  } catch (error) {
    next(error);
  }
}

export async function replaceHours(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const rows = req.body as { dayOfWeek: number; opensAt: string; closesAt: string; isClosed: boolean }[];
    await sequelize.transaction(async (transaction) => {
      for (const row of rows) {
        const existing = await OpeningHours.findOne({ where: { dayOfWeek: row.dayOfWeek }, transaction });
        if (existing) {
          existing.opensAt = row.opensAt;
          existing.closesAt = row.closesAt;
          existing.isClosed = row.isClosed;
          await existing.save({ transaction });
        } else {
          await OpeningHours.create(row, { transaction });
        }
      }
    });
    const saved = await OpeningHours.findAll({ order: [['dayOfWeek', 'ASC']] });
    res.json(saved.map(toHours));
  } catch (error) {
    next(error);
  }
}

export async function updateSettings(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const row = await SiteSettings.findByPk('main');
    if (!row) {
      next({ status: 404, message: 'Not Found' });
      return;
    }
    const body = req.body as Record<string, unknown>;
    const happy = body.happyHour;
    if (happy && typeof happy === 'object') {
      const hour = happy as Record<string, unknown>;
      if (typeof hour.startsAt === 'string') row.happyHourStartsAt = hour.startsAt;
      if (typeof hour.endsAt === 'string') row.happyHourEndsAt = hour.endsAt;
      if (typeof hour.discountPercent === 'number') row.happyHourDiscountPercent = hour.discountPercent;
    }
    for (const key of ['reservationUrl', 'reservationUrlAlt', 'deliveryUrl', 'woltUrl', 'privateEventsUrl', 'giftCardUrl', 'instagramUrl', 'mapsUrl', 'phone', 'email', 'addressHe', 'addressEn', 'alcoholWarningHe', 'alcoholWarningEn', 'accessibilityCoordinatorName', 'accessibilityCoordinatorPhone', 'accessibilityCoordinatorEmail', 'lastAccessibilityAudit'] as const) {
      if (key in body) Reflect.set(row, key, body[key]);
    }
    await row.save();
    res.json(toSettings(row));
  } catch (error) {
    next(error);
  }
}

