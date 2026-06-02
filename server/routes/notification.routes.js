import { Router } from 'express';
import * as c from '../controllers/notification.controller.js';
import { protect } from '../middleware/auth.middleware.js';
const r = Router();
r.get('/', protect, c.list);
r.get('/unread-count', protect, c.unreadCount);
r.post('/read-all', protect, c.markRead);
r.delete('/:id', protect, c.deleteNotification);                
export default r;
