import { create } from 'zustand';
import api from '../lib/api';
import { connectSocket, disconnectSocket } from '../lib/socket';

export const useAuth = create((set) => ({
  user: null,
  loading: true,
  setUser: (user) => set({ user }),
  fetchMe: async () => {
    try {
      const { data } = await api.get('/auth/me');
      set({ user: data.user }); connectSocket();
    } catch (err) {
  console.error(err);

  if (!localStorage.getItem('accessToken')) {
    set({ user: null });
  }
}
    finally { set({ loading: false }); }
  },
  login: async (identifier, password) => {
    const { data } = await api.post('/auth/login', { identifier, password });
    localStorage.setItem('accessToken', data.accessToken);
    set({ user: data.user }); connectSocket();
  },

  googleLogin: async (credential) => {

  const { data } = await api.post(
    '/auth/google',
    { credential }
  );

  localStorage.setItem(
    'accessToken',
    data.accessToken
  );

  set({ user: data.user });

  connectSocket();

},
  register: async (payload) => {
    const { data } = await api.post('/auth/register', payload);
    localStorage.setItem('accessToken', data.accessToken);
    set({ user: data.user }); connectSocket();
  },
  logout: async () => {
    try { await api.post('/auth/logout'); } catch {}
    localStorage.removeItem('accessToken'); disconnectSocket();
    set({ user: null });
  },
}));
