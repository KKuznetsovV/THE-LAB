import { Router } from 'express';
import { list } from '../controllers/spirits/controller';

const router = Router();
router.get('/', list);
export default router;
