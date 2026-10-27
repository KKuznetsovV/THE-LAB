import { Router } from 'express';
import {
  createGallery,
  gallery,
  health,
  hours,
  removeGallery,
  reorderGallery,
  replaceHours,
  restoreGallery,
  settings,
  updateGallery,
  updateSettings,
} from '../controllers/site/controller';
import { galleryCreate, galleryPatch, hoursBody, idParams, reorderBody, settingsBody } from '../controllers/site/validator';
import { requireWriter } from '../middlewares/auth';
import validate from '../middlewares/validation';

export const healthRouter = Router();
healthRouter.get('/', health);

export const galleryRouter = Router();
galleryRouter.get('/', gallery);
galleryRouter.post('/', requireWriter, validate({ body: galleryCreate }), createGallery);
galleryRouter.patch('/reorder', requireWriter, validate({ body: reorderBody }), reorderGallery);
galleryRouter.patch('/:id', requireWriter, validate({ params: idParams, body: galleryPatch }), updateGallery);
galleryRouter.delete('/:id', requireWriter, validate({ params: idParams }), removeGallery);
galleryRouter.post('/:id/restore', requireWriter, validate({ params: idParams }), restoreGallery);

export const hoursRouter = Router();
hoursRouter.get('/', hours);
hoursRouter.put('/', requireWriter, validate({ body: hoursBody }), replaceHours);

export const settingsRouter = Router();
settingsRouter.get('/', settings);
settingsRouter.patch('/', requireWriter, validate({ body: settingsBody }), updateSettings);
