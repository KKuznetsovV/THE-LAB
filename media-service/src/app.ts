import './auth/admin-dto';
import cors from 'cors';
import config from 'config';
import express from 'express';
import helmet from 'helmet';
import { assertProductionSecret } from './auth/tokens';
import { ensureMediaBucket } from './aws/s3';
import { errorResponder } from './middlewares/error/error-responder';
import { logError } from './middlewares/error/log-error';
import { notFound } from './middlewares/not-found';
import uploadsRouter from './routers/uploads';

function origins(): string[] {
  const value: unknown = config.get('app.corsOrigins');
  if (Array.isArray(value)) return value.filter((item): item is string => typeof item === 'string');
  if (typeof value === 'string') return value.split(',').map((item) => item.trim()).filter(Boolean);
  return [];
}

export function createApp(): express.Express {
  const app = express();
  app.use(helmet());
  app.use(cors({ origin: origins() }));
  app.use(express.json());
  app.get('/api/health', (_req, res) => {
    res.json({ ok: true });
  });
  app.use('/api/uploads', uploadsRouter);
  app.use(notFound);
  app.use(logError);
  app.use(errorResponder);
  return app;
}

async function main(): Promise<void> {
  assertProductionSecret();
  await ensureMediaBucket();
  const port = config.get<number>('app.port');
  createApp().listen(port, () => {
    console.log(`${config.get<string>('app.name')} listening on ${port}`);
  });
}

if (require.main === module) {
  main().catch((error: unknown) => {
    const message = error instanceof Error ? error.message : 'startup failed';
    console.error(message);
    process.exit(1);
  });
}
