import { Router } from 'express';
import { getByCode, list } from '../controllers/cocktails/controller';
import { codeParams, listQuery } from '../controllers/cocktails/validator';
import validate from '../middlewares/validation';

const router = Router();

router.get('/', validate({ query: listQuery }), list);
router.get('/:code', validate({ params: codeParams }), getByCode);

export default router;
