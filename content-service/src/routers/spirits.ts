import { Router } from 'express';
import { create, list, remove, reorder, restore, update } from '../controllers/spirits/controller';
import { createBody, idParams, patchBody, reorderBody } from '../controllers/spirits/validator';
import { requireWriter } from '../middlewares/auth';
import validate from '../middlewares/validation';

const router = Router();
router.get('/', list);
router.post('/', requireWriter, validate({ body: createBody }), create);
router.patch('/reorder', requireWriter, validate({ body: reorderBody }), reorder);
router.patch('/:id', requireWriter, validate({ params: idParams, body: patchBody }), update);
router.delete('/:id', requireWriter, validate({ params: idParams }), remove);
router.post('/:id/restore', requireWriter, validate({ params: idParams }), restore);
export default router;
