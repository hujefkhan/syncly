import { Router } from 'express';
import * as c from '../controllers/user.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { adminOnly } from '../middleware/admin.middleware.js';
const r = Router();
r.get('/suggested', protect, c.suggestedUsers);
r.get('/:id/saved', protect, c.getSavedPosts);
r.get('/:id/tagged', c.getTaggedPosts);
r.patch('/me/username', protect, c.changeUsername);
r.delete('/me', protect, c.deleteAccount);
r.patch('/me/profile', protect, c.updateProfile);
r.post('/:id/follow', protect, c.followUser);
r.post('/:id/block', protect, c.toggleBlockUser);
r.post('/save/:postId', protect, c.savePost);
r.get('/explore/people', protect, c.explorePeople);
r.patch(
  '/admin/ban/:id',
  protect,
  adminOnly,
  c.banUser
);

r.patch(
  '/admin/unban/:id',
  protect,
  adminOnly,
  c.unbanUser
);
r.get(
  '/following',
  protect,
  c.getMutualFollowers
);
r.get('/:username', protect, c.getProfile);
export default r;
