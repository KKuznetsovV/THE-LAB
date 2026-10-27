import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import config from 'config';
import { seedOwnerIfEmpty } from './auth/seed-admin';
import { assertProductionSecret } from './auth/tokens';
import sequelize, { ensureDatabaseExists } from './db/sequelize';
import logError from './middlewares/error/log-error';
import respondError from './middlewares/error/error-responder';
import notFound from './middlewares/not-found';
import adminsRouter from './routers/admins';
import authRouter from './routers/auth';

function corsOrigins(): string[] {
  const value = config.get<string | string[]>('app.corsOrigins');
  if (Array.isArray(value)) return value;
  return value.split(',').map((origin) => origin.trim()).filter(Boolean);
}

const port = config.get<number>('app.port');
const name = config.get<string>('app.name');

void (async () => {
  assertProductionSecret();
  const app = express();
  app.use(helmet());
  app.use(cors({ origin: corsOrigins() }));
  app.use(express.json());
  app.use('/api/auth', authRouter);
  app.use('/api/admins', adminsRouter);
  app.use(notFound);
  app.use(logError);
  app.use(respondError);

  await ensureDatabaseExists();
  await sequelize.sync();
  await seedOwnerIfEmpty();

  app.listen(port, () => {
    console.log(`${name} listening on ${port}`);
  });
})();
