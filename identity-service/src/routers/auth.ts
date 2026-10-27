import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { changePassword, login, me } from '../controllers/auth/controller';
import { loginBody, passwordBody } from '../controllers/auth/validator';
import authEnforce from '../middlewares/auth-enforce';
import validate from '../middlewares/validation';

const loginLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) => {
    res.status(429).json({ status: 429, message: 'Too many login attempts' });
  },
});

const router = Router();

router.post('/login', loginLimiter, validate({ body: loginBody }), login);
router.get('/me', authEnforce, me);
router.patch('/password', authEnforce, validate({ body: passwordBody }), changePassword);

export default router;
