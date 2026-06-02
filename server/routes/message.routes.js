import { Router } from 'express';
import * as c from '../controllers/message.controller.js';
import { protect } from '../middleware/auth.middleware.js';
const r = Router();
r.get('/conversations', protect, c.myConversations);
r.post('/conversations/:userId', protect, c.openConversation);
r.post('/group', protect, c.createGroup);
r.post(
  '/group/:id/add/:userId',
  protect,
  c.addGroupMember
);

r.delete(
  '/group/:id/remove/:userId',
  protect,
  c.removeGroupMember
);

r.patch(
  '/group/:id/admin/:userId',
  protect,
  c.promoteAdmin
);

r.patch(
  '/group/:id/demote/:userId',
  protect,
  c.demoteAdmin
);

r.post(
  '/group/:id/leave',
  protect,
  c.leaveGroup
);

r.delete(
  '/group/:id',
  protect,
  c.deleteGroup
);
r.patch(
  '/group/:id/name',
  protect,
  c.renameGroup
);

r.patch(
  '/group/:id/avatar',
  protect,
  c.changeGroupAvatar
);
r.get('/unread/count', protect, c.getUnreadCount);
r.get('/:id', protect, c.listMessages);
r.post('/:id', protect, c.sendMessage);
r.delete('/:id/delete', protect, c.deleteMessage);
export default r;
