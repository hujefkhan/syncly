import { Server } from 'socket.io';
import { verifyAccess } from '../utils/jwt.js';
import User from '../models/User.js';

let io;
const userSockets = new Map(); // userId -> Set<socketId>

export const initSocket = (server) => {
  io = new Server(server, {
    cors: { origin: process.env.CLIENT_URL?.split(',') || '*', credentials: true },
  });

  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) return next(new Error('No token'));
      socket.user = verifyAccess(token);
      next();
    } catch { next(new Error('Auth error')); }
  });

  io.on('connection', async (socket) => {
    const uid = socket.user.id;
    if (!userSockets.has(uid)) userSockets.set(uid, new Set());
    userSockets.get(uid).add(socket.id);
    socket.join(`user:${uid}`);
    await User.findByIdAndUpdate(uid, { isOnline: true, lastActive: new Date() });
    io.emit('presence:update', { userId: uid, isOnline: true });

    socket.on('typing', ({ conversationId, to }) => {
      io.to(`user:${to}`).emit('typing', { conversationId, from: uid });
    });
    socket.on('message:seen', ({ conversationId, to }) => {
      io.to(`user:${to}`).emit('message:seen', { conversationId, by: uid });
    });
    socket.on('join:conversation', (cid) => socket.join(`conv:${cid}`));

    socket.on('disconnect', async () => {
      const set = userSockets.get(uid);
      if (set) { set.delete(socket.id); if (set.size === 0) userSockets.delete(uid); }
      if (!userSockets.has(uid)) {
        await User.findByIdAndUpdate(uid, { isOnline: false, lastActive: new Date() });
        io.emit('presence:update', { userId: uid, isOnline: false });
      }
    });
  });
};

export const emitToUser = (userId, event, payload) => {
  if (io) io.to(`user:${userId}`).emit(event, payload);
};
