import type { NextFunction, Request, Response } from 'express';
import GalleryImage from '../../models/GalleryImage';
import OpeningHours from '../../models/OpeningHours';
import SiteSettings from '../../models/SiteSettings';
import { toGallery, toHours, toSettings } from '../../mappers';

export async function gallery(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const rows = await GalleryImage.findAll({
      where: { isPublished: true },
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
