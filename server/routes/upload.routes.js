import { Router } from 'express';
import { protect } from '../middleware/auth.middleware.js';
import { upload } from '../middleware/upload.middleware.js';
import { uploadImage } from '../controllers/upload.controller.js';
const r = Router();
r.post('/image', protect, upload.single('media'), uploadImage);
export default r;
