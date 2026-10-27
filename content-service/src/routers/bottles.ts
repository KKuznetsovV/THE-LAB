import { Router } from 'express';
import { list } from '../controllers/bottles/controller';

const router = Router();
router.get('/', list);
export default router;
