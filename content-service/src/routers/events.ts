import { Router } from 'express';
import { getBySlug, list } from '../controllers/events/controller';
import { listQuery, slugParams } from '../controllers/events/validator';
import validate from '../middlewares/validation';

const router = Router();
router.get('/', validate({ query: listQuery }), list);
router.get('/:slug', validate({ params: slugParams }), getBySlug);
export default router;
