import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { loginUser, registerUser, getMe } from '../api/auth';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      token: null,
      isGuest: false,
      authError: '',
      setAuthError: (error) => set({ authError: error }),
      
      login: async (formData, showToast) => {
        if (!formData.email || !formData.password) {
          set({ authError: 'Please fill in all fields' });
          return false;
        }
        try {
          const data = await loginUser(formData.email, formData.password);
          // Store token first so that getMe API call automatically uses it in headers
          set({ token: data.access_token });
          
          const user = await getMe();
          set({
            user,
            isAuthenticated: true,
            isGuest: false,
            authError: ''
          });
          
          // Sync library and cart from backend
          const { useLibraryStore } = await import('./useLibraryStore');
          const { useCartStore } = await import('./useCartStore');
          useLibraryStore.getState().fetchLibrary();
          useCartStore.getState().fetchCart();

          if (showToast) {
            showToast(`Welcome back, ${user.username}! 🎮`, 'success');
          }
          return true;
        } catch (error) {
          const errMsg = error.response?.data?.detail || error.message || 'Login failed';
          set({ authError: errMsg });
          if (showToast) {
            showToast(errMsg, 'error');
          }
          return false;
        }
      },
      
      register: async (formData, showToast) => {
        if (!formData.username || !formData.email || !formData.password) {
          set({ authError: 'Please fill in all fields' });
          return false;
        }
        try {
          const data = await registerUser(formData.username, formData.email, formData.password);
          set({ token: data.access_token });
          
          const user = await getMe();
          set({
            user,
            isAuthenticated: true,
            isGuest: false,
            authError: ''
          });
          
          // Sync library and cart from backend
          const { useLibraryStore } = await import('./useLibraryStore');
          const { useCartStore } = await import('./useCartStore');
          useLibraryStore.getState().fetchLibrary();
          useCartStore.getState().fetchCart();

          if (showToast) {
            showToast(`Account created! Welcome, ${user.username}! 🚀`, 'success');
          }
          return true;
        } catch (error) {
          const errMsg = error.response?.data?.detail || error.message || 'Registration failed';
          set({ authError: errMsg });
          if (showToast) {
            showToast(errMsg, 'error');
          }
          return false;
        }
      },
      
      loginAsGuest: async (showToast) => {
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
        
        // Ensure library and cart local stores are cleared
        const { useLibraryStore } = await import('./useLibraryStore');
        const { useCartStore } = await import('./useCartStore');
        useLibraryStore.getState().clearLibrary();
        useCartStore.getState().clearCartLocal();

        if (showToast) {
          showToast('Entered as Guest Gamer 🎮', 'success');
        }
      },
      
      logout: async (showToast) => {
        set({
          user: null,
          isAuthenticated: false,
          token: null,
          isGuest: false,
          authError: ''
        });
        
        // Clear library and cart stores
        const { useLibraryStore } = await import('./useLibraryStore');
        const { useCartStore } = await import('./useCartStore');
        useLibraryStore.getState().clearLibrary();
        useCartStore.getState().clearCartLocal();

        if (showToast) {
          showToast('Logged out successfully', 'info');
        }
      },
      
      checkAuth: async () => {
        const { token, logout } = get();
        if (!token) return;
        try {
          const user = await getMe();
          set({
            user,
            isAuthenticated: true,
            isGuest: false,
            authError: ''
          });
          // Sync library and cart from backend
          const { useLibraryStore } = await import('./useLibraryStore');
          const { useCartStore } = await import('./useCartStore');
          useLibraryStore.getState().fetchLibrary();
          useCartStore.getState().fetchCart();
        } catch (error) {
          logout();
        }
      }
    }),
    {
      name: 'gamevault-auth', // key for localStorage
    }
  )
);
