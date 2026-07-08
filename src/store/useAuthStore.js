import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      token: null,
      isGuest: false,
      authError: '',
      setAuthError: (error) => set({ authError: error }),
      login: (formData, showToast) => {
        if (!formData.email || !formData.password) {
          set({ authError: 'Please fill in all fields' });
          return false;
        }
        const usernameFromEmail = formData.email.split('@')[0];
        set({
          user: {
            username: usernameFromEmail,
            email: formData.email
          },
          isAuthenticated: true,
          token: 'mock-jwt-token',
          isGuest: false,
          authError: ''
        });
        if (showToast) {
          showToast(`Welcome back, ${usernameFromEmail}! 🎮`, 'success');
        }
        return true;
      },
      register: (formData, showToast) => {
        if (!formData.username || !formData.email || !formData.password) {
          set({ authError: 'Please fill in all fields' });
          return false;
        }
        set({
          user: {
            username: formData.username,
            email: formData.email
          },
          isAuthenticated: true,
          token: 'mock-jwt-token',
          isGuest: false,
          authError: ''
        });
        if (showToast) {
          showToast(`Account created! Welcome, ${formData.username}! 🚀`, 'success');
        }
        return true;
      },
      loginAsGuest: (showToast) => {
        set({
          user: {
            username: 'Guest',
            email: null
          },
          isAuthenticated: true,
          token: null,
          isGuest: true,
          authError: ''
        });
        if (showToast) {
          showToast('Entered as Guest Gamer 🎮', 'success');
        }
      },
      logout: (showToast) => {
        set({
          user: null,
          isAuthenticated: false,
          token: null,
          isGuest: false,
          authError: ''
        });
        if (showToast) {
          showToast('Logged out successfully', 'info');
        }
      }
    }),
    {
      name: 'gamevault-auth', // key for localStorage
    }
  )
);
