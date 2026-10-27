import type { NextFunction, Request, Response } from 'express';
import { deleteObject, objectKey, presignUpload, publicUrlFor, assertDeletableKey } from '../../aws/s3';

export async function presign(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const body = req.body as { contentType: string; purpose: string };
    const key = objectKey(body.purpose, body.contentType);
    const signed = await presignUpload(key, body.contentType);
    res.status(200).json({
      url: signed.url,
      fields: signed.fields,
      key,
      publicUrl: publicUrlFor(key),
    });
  } catch (error) {
    next(error);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const body = req.body as { key: string };
    assertDeletableKey(body.key);
    await deleteObject(body.key);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
