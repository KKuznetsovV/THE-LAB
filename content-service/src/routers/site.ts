import { Router } from 'express';
import { gallery, health, hours, settings } from '../controllers/site/controller';

export const healthRouter = Router();
healthRouter.get('/', health);

export const galleryRouter = Router();
galleryRouter.get('/', gallery);

export const hoursRouter = Router();
hoursRouter.get('/', hours);

export const settingsRouter = Router();
settingsRouter.get('/', settings);
