import { Router } from 'express';
import * as c from '../controllers/story.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { upload } from '../middleware/upload.middleware.js';

const r = Router();

r.get('/', protect, c.getStories);
r.delete('/:id', protect, c.deleteStory);

r.post(
  '/',
  protect,
  upload.single('story'),
  c.createStory
);

r.post(
  '/:id/view',
  protect,
  c.viewStory
);

export default r;