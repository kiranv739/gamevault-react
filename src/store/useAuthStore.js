import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  loginUser,
  registerUser,
  getMe,
  updateMyProfile,
  changeMyPassword,
  deleteMyAccount,
} from '../api/auth';
import { getApiErrorMessage } from '../api/errors';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      token: null,
      isGuest: false,
      authError: '',
      setAuthError: (error) => set({ authError: error }),

      updateProfile: async (profile) => {
        const user = await updateMyProfile(profile);
        set({ user });
        return user;
      },

      changePassword: async (passwords) => changeMyPassword(passwords),

      deleteAccount: async (currentPassword, showToast) => {
        await deleteMyAccount(currentPassword);
        await get().logout();
        if (showToast) showToast('Your account has been deleted', 'success');
      },
      
      login: async (formData, showToast) => {
        const identifier = formData.usernameOrEmail || formData.email;
        if (!identifier || !formData.password) {
          set({ authError: 'Please fill in all fields' });
          return false;
        }
        try {
          const data = await loginUser(identifier, formData.password);
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
          useLibraryStore.getState().fetchWishlist();
          useLibraryStore.getState().fetchPurchasedGames();
          useCartStore.getState().fetchCart();

          if (showToast) {
            showToast(`Welcome back, ${user.username}! 🎮`, 'success');
          }
          return true;
        } catch (error) {
          const errMsg = getApiErrorMessage(error, 'Login failed');
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
          useLibraryStore.getState().fetchWishlist();
          useLibraryStore.getState().fetchPurchasedGames();
          useCartStore.getState().fetchCart();

          if (showToast) {
            showToast(`Account created! Welcome, ${user.username}! 🚀`, 'success');
          }
          return true;
        } catch (error) {
          const errMsg = getApiErrorMessage(error, 'Registration failed');
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
        
        // Clear library, cart and recommendations stores
        const { useLibraryStore } = await import('./useLibraryStore');
        const { useCartStore } = await import('./useCartStore');
        const { useRecommendStore } = await import('./useRecommendStore');
        useLibraryStore.getState().clearLibrary();
        useCartStore.getState().clearCartLocal();
        useRecommendStore.getState().clearRecommendations();

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
          useLibraryStore.getState().fetchWishlist();
          useLibraryStore.getState().fetchPurchasedGames();
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
