import { Router } from 'express';
import * as c from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { registerRules, loginRules } from '../validations/auth.validation.js';
import rateLimit from 'express-rate-limit';

const r = Router();
const authLimit = rateLimit({ windowMs: 15*60*1000, max: 30 });

r.post('/register', authLimit, registerRules, validate, c.register);
r.post('/login', authLimit, loginRules, validate, c.login);
r.post('/logout', protect, c.logout);
r.post('/refresh', c.refresh);
r.get('/me', protect, c.me);
r.post('/forgot-password', c.forgotPassword);
r.post('/reset-password', c.resetPassword);
r.get('/verify-email', c.verifyEmail);

r.post(
  '/resend-verification',
  authLimit,
  c.resendVerification
);

r.post('/google', c.googleAuth);

// TODO: OAuth (Google/Apple) routes go here.
export default r;
