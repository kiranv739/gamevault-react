import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getLibrary, addToLibrary as addToLibraryApi, removeFromLibrary as removeFromLibraryApi } from '../api/library';
import { useAuthStore } from './useAuthStore';

export const useLibraryStore = create(
  persist(
    (set, get) => ({
      library: [],
      
      fetchLibrary: async () => {
        const isGuest = useAuthStore.getState().isGuest;
        if (isGuest) return;
        try {
          const library = await getLibrary();
          set({ library });
        } catch (error) {
          console.error('Failed to fetch library:', error);
        }
      },
      
      addToLibrary: async (game, showToast) => {
        const isGuest = useAuthStore.getState().isGuest;
        if (isGuest) {
          // Guest mode: local state only
          set((state) => {
            const isInLibrary = state.library.some((item) => item._id === game._id);
            if (!isInLibrary) {
              if (showToast) showToast('Added to wishlist ♥', 'success');
              return { library: [...state.library, game] };
            }
            return state;
          });
          return;
        }

        try {
          const savedGame = await addToLibraryApi(game._id);
          set((state) => {
            const isInLibrary = state.library.some((item) => item._id === savedGame._id);
            if (!isInLibrary) {
              if (showToast) showToast('Added to wishlist ♥', 'success');
              return { library: [...state.library, savedGame] };
            }
            return state;
          });
        } catch (error) {
          console.error('Failed to add to library API:', error);
          if (showToast) {
            showToast('Failed to add to wishlist', 'error');
          }
        }
      },
      
      removeFromLibrary: async (gameId, showToast) => {
        const isGuest = useAuthStore.getState().isGuest;
        if (isGuest) {
          // Guest mode: local state only
          set((state) => {
            if (showToast) showToast('Removed from wishlist', 'info');
            return { library: state.library.filter((item) => item._id !== gameId) };
          });
          return;
        }

        try {
          await removeFromLibraryApi(gameId);
          set((state) => {
            if (showToast) showToast('Removed from wishlist', 'info');
            return { library: state.library.filter((item) => item._id !== gameId) };
          });
        } catch (error) {
          console.error('Failed to remove from library API:', error);
          if (showToast) {
            showToast('Failed to remove from wishlist', 'error');
          }
        }
      },
      
      clearLibrary: () => {
        set({ library: [] });
      }
    }),
    {
      name: 'gamevault-library',
    }
  )
);
