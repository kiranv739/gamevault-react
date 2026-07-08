import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getCart, addToCart as addToCartApi, removeFromCart as removeFromCartApi } from '../api/cart';
import { useAuthStore } from './useAuthStore';

export const useCartStore = create(
  persist(
    (set, get) => ({
      bag: [],
      
      fetchCart: async () => {
        const isGuest = useAuthStore.getState().isGuest;
        if (isGuest) return;
        try {
          const bag = await getCart();
          set({ bag });
        } catch (error) {
          console.error('Failed to fetch cart:', error);
        }
      },
      
      addToCart: async (game, showToast) => {
        const isGuest = useAuthStore.getState().isGuest;
        if (isGuest) {
          // Guest mode: local state only
          set((state) => {
            const isInBag = state.bag.some((item) => item._id === game._id);
            if (!isInBag) {
              if (showToast) showToast('Added to cart ✓', 'success');
              return { bag: [...state.bag, game] };
            }
            return state;
          });
          return;
        }

        try {
          const savedGame = await addToCartApi(game._id);
          set((state) => {
            const isInBag = state.bag.some((item) => item._id === savedGame._id);
            if (!isInBag) {
              if (showToast) showToast('Added to cart ✓', 'success');
              return { bag: [...state.bag, savedGame] };
            }
            return state;
          });
        } catch (error) {
          console.error('Failed to add to cart API:', error);
          if (showToast) {
            showToast('Failed to add to cart', 'error');
          }
        }
      },
      
      removeFromCart: async (gameId, showToast) => {
        const isGuest = useAuthStore.getState().isGuest;
        if (isGuest) {
          // Guest mode: local state only
          set((state) => {
            if (showToast) showToast('Removed from cart', 'info');
            return { bag: state.bag.filter((item) => item._id !== gameId) };
          });
          return;
        }

        try {
          await removeFromCartApi(gameId);
          set((state) => {
            if (showToast) showToast('Removed from cart', 'info');
            return { bag: state.bag.filter((item) => item._id !== gameId) };
          });
        } catch (error) {
          console.error('Failed to remove from cart API:', error);
          if (showToast) {
            showToast('Failed to remove from cart', 'error');
          }
        }
      },
      
      clearCart: async () => {
        const isGuest = useAuthStore.getState().isGuest;
        if (!isGuest) {
          const { bag } = get();
          // Delete each item from backend cart database
          for (const item of bag) {
            try {
              await removeFromCartApi(item._id);
            } catch (error) {
              console.error('Failed to remove item during cart clear:', error);
            }
          }
        }
        set({ bag: [] });
      },
      
      clearCartLocal: () => {
        set({ bag: [] });
      }
    }),
    {
      name: 'gamevault-cart',
    }
  )
);
