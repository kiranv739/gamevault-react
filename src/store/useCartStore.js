import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create(
  persist(
    (set) => ({
      bag: [],
      addToCart: (game, showToast) => set((state) => {
        const isInBag = state.bag.some((item) => item._id === game._id);
        if (!isInBag) {
          if (showToast) showToast('Added to cart ✓', 'success');
          return { bag: [...state.bag, game] };
        }
        return state;
      }),
      removeFromCart: (gameId, showToast) => set((state) => {
        if (showToast) showToast('Removed from cart', 'info');
        return { bag: state.bag.filter((item) => item._id !== gameId) };
      }),
      clearCart: () => set({ bag: [] }),
    }),
    {
      name: 'gamevault-cart',
    }
  )
);
