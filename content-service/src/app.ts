import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import config from 'config';
import sequelize, { ensureDatabaseExists } from './db/sequelize';
import { seedContentIfEmpty } from './db/seed-loader';
import logError from './middlewares/error/log-error';
import respondError from './middlewares/error/error-responder';
import notFound from './middlewares/not-found';
import { optionalAuth } from './middlewares/auth';
import bottlesRouter from './routers/bottles';
import cocktailsRouter from './routers/cocktails';
import eventsRouter from './routers/events';
import spiritsRouter from './routers/spirits';
import { galleryRouter, healthRouter, hoursRouter, settingsRouter } from './routers/site';

function corsOrigins(): string[] {
  const value = config.get<string | string[]>('app.corsOrigins');
  if (Array.isArray(value)) return value;
  return value.split(',').map((origin) => origin.trim()).filter(Boolean);
}

const port = config.get<number>('app.port');
const name = config.get<string>('app.name');

void (async () => {
  const app = express();
  app.use(helmet());
  app.use(cors({ origin: corsOrigins() }));
  app.use(express.json());
  app.use(optionalAuth);
  app.use('/api/health', healthRouter);
  app.use('/api/cocktails', cocktailsRouter);
  app.use('/api/bottles', bottlesRouter);
  app.use('/api/spirits', spiritsRouter);
  app.use('/api/events', eventsRouter);
  app.use('/api/gallery', galleryRouter);
  app.use('/api/hours', hoursRouter);
  app.use('/api/settings', settingsRouter);
  app.use(notFound);
  app.use(logError);
  app.use(respondError);

  await ensureDatabaseExists();
  await sequelize.sync();
  await seedContentIfEmpty();

  app.listen(port, () => {
    console.log(`${name} listening on ${port}`);
  });
})();
