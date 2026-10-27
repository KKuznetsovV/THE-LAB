import { Router } from 'express';
import { create, getBySlug, list, remove, reorder, restore, update } from '../controllers/events/controller';
import { createBody, idParams, listQuery, patchBody, reorderBody, slugParams } from '../controllers/events/validator';
import { requireWriter } from '../middlewares/auth';
import validate from '../middlewares/validation';

const router = Router();
router.get('/', validate({ query: listQuery }), list);
router.post('/', requireWriter, validate({ body: createBody }), create);
router.patch('/reorder', requireWriter, validate({ body: reorderBody }), reorder);
router.get('/:slug', validate({ params: slugParams }), getBySlug);
router.patch('/:id', requireWriter, validate({ params: idParams, body: patchBody }), update);
router.delete('/:id', requireWriter, validate({ params: idParams }), remove);
router.post('/:id/restore', requireWriter, validate({ params: idParams }), restore);
export default router;
