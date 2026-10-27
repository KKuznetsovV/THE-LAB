import { Router } from 'express';
import { presign, remove } from '../controllers/uploads/controller';
import { deleteSchema, presignSchema } from '../controllers/uploads/validator';
import { requireWriter } from '../middlewares/auth';
import { validateBody } from '../middlewares/validation';

const router = Router();

router.post('/presign', requireWriter, validateBody(presignSchema), presign);
router.delete('/', requireWriter, validateBody(deleteSchema), remove);

export default router;
