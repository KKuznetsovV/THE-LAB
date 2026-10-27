import { Router } from 'express';
import { availability, create, getByCode, list, remove, reorder, restore, update } from '../controllers/cocktails/controller';
import { availabilityBody, codeParams, createBody, idParams, listQuery, patchBody, reorderBody } from '../controllers/cocktails/validator';
import { requireWriter } from '../middlewares/auth';
import validate from '../middlewares/validation';

const router = Router();

router.get('/', validate({ query: listQuery }), list);
router.post('/', requireWriter, validate({ body: createBody }), create);
router.patch('/reorder', requireWriter, validate({ body: reorderBody }), reorder);
router.get('/:code', validate({ params: codeParams }), getByCode);
router.patch('/:id/availability', requireWriter, validate({ params: idParams, body: availabilityBody }), availability);
router.post('/:id/restore', requireWriter, validate({ params: idParams }), restore);
router.patch('/:id', requireWriter, validate({ params: idParams, body: patchBody }), update);
router.delete('/:id', requireWriter, validate({ params: idParams }), remove);

export default router;
