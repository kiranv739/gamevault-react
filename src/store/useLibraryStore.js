import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getWishlist, getPurchasedGames, addToLibrary as addToLibraryApi, removeFromLibrary as removeFromLibraryApi } from '../api/library';
import { useAuthStore } from './useAuthStore';

export const useLibraryStore = create(
  persist(
    (set, get) => ({
      wishlist: [],
      purchasedGames: [],
      
      fetchWishlist: async () => {
        const isGuest = useAuthStore.getState().isGuest;
        if (isGuest) return;
        try {
          const wishlist = await getWishlist();
          set({ wishlist });
        } catch (error) {
          console.error('Failed to fetch wishlist:', error);
        }
      },
      
      fetchPurchasedGames: async () => {
        const isGuest = useAuthStore.getState().isGuest;
        if (isGuest) return;
        try {
          const purchasedGames = await getPurchasedGames();
          set({ purchasedGames });
        } catch (error) {
          console.error('Failed to fetch purchased games:', error);
        }
      },
      
      addToWishlist: async (game, showToast) => {
        const isGuest = useAuthStore.getState().isGuest;
        if (isGuest) {
          // Guest mode: local state only
          set((state) => {
            const isInWishlist = state.wishlist.some((item) => item._id === game._id);
            if (!isInWishlist) {
              if (showToast) showToast('Added to wishlist ♥', 'success');
              return { wishlist: [...state.wishlist, game] };
            }
            return state;
          });
          return;
        }

        try {
          const savedGame = await addToLibraryApi(game._id);
          set((state) => {
            const isInWishlist = state.wishlist.some((item) => item._id === savedGame._id);
            if (!isInWishlist) {
              if (showToast) showToast('Added to wishlist ♥', 'success');
              return { wishlist: [...state.wishlist, savedGame] };
            }
            return state;
          });
        } catch (error) {
          console.error('Failed to add to wishlist API:', error);
          if (showToast) {
            showToast('Failed to add to wishlist', 'error');
          }
        }
      },
      
      removeFromWishlist: async (gameId, showToast) => {
        const isGuest = useAuthStore.getState().isGuest;
        if (isGuest) {
          // Guest mode: local state only
          set((state) => {
            if (showToast) showToast('Removed from wishlist', 'info');
            return { wishlist: state.wishlist.filter((item) => item._id !== gameId) };
          });
          return;
        }

        try {
          await removeFromLibraryApi(gameId);
          set((state) => {
            if (showToast) showToast('Removed from wishlist', 'info');
            return { wishlist: state.wishlist.filter((item) => item._id !== gameId) };
          });
        } catch (error) {
          console.error('Failed to remove from wishlist API:', error);
          if (showToast) {
            showToast('Failed to remove from wishlist', 'error');
          }
        }
      },
      
      clearLibrary: () => {
        set({ wishlist: [], purchasedGames: [] });
      }
    }),
    {
      name: 'gamevault-library',
    }
  )
);
