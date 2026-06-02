import { io } from 'socket.io-client';
let socket = null;
export const connectSocket = () => {
  const token = localStorage.getItem('accessToken');
  if (!token) return null;
  if (socket?.connected) return socket;
  socket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000', {
    auth: { token }, withCredentials: true, transports: ['websocket'],
  });
  return socket;
};
export const getSocket = () => socket;
export const disconnectSocket = () => { socket?.disconnect(); socket = null; };
