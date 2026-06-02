import Notification from '../models/Notification.js';
import { emitToUser } from '../sockets/index.js';

export const createNotification = async ({
  recipient,
  sender,
  type,
  post,
  commentText
}) => {

  if (String(recipient) === String(sender)) {
    return null;
  }

  const n = await Notification.create({
    recipient,
    sender,
    type,
    post,
    commentText
  });

  const populated = await n.populate(
    'sender',
    'username avatar fullName'
  );

  emitToUser(
    String(recipient),
    'notification:new',
    populated
  );

  return populated;
};