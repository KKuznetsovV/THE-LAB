import { Router } from 'express';
import { create, getOne, list, remove, update } from '../controllers/admins/controller';
import { createBody, idParams, patchBody } from '../controllers/admins/validator';
import authEnforce from '../middlewares/auth-enforce';
import requireRole from '../middlewares/require-role';
import validate from '../middlewares/validation';

const router = Router();

router.use(authEnforce, requireRole(['owner']));
router.get('/', list);
router.post('/', validate({ body: createBody }), create);
router.get('/:id', validate({ params: idParams }), getOne);
router.patch('/:id', validate({ params: idParams, body: patchBody }), update);
router.delete('/:id', validate({ params: idParams }), remove);

export default router;
