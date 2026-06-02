import Notification from '../models/Notification.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const list = asyncHandler(async (req, res) => {
  const items = await Notification.find({ recipient: req.user.id })
    .sort('-createdAt').limit(50).populate('sender', 'username avatar fullName').populate('post', 'content');
  res.json({ success: true, notifications: items });
});

export const markRead = asyncHandler(async (req, res) => {
  await Notification.updateMany({ recipient: req.user.id, read: false }, { read: true });
  res.json({ success: true });
});

export const unreadCount = asyncHandler(async (req, res) => {
  const count = await Notification.countDocuments({ recipient: req.user.id, read: false });
  res.json({ success: true, count });
});
export const deleteNotification = asyncHandler(async (req, res) => {

  await Notification.findOneAndDelete({
    _id: req.params.id,
    recipient: req.user.id
  });

  res.json({
    success: true
  });

});