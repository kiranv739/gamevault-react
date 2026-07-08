import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useLibraryStore = create(
  persist(
    (set) => ({
      library: [],
      addToLibrary: (game, showToast) => set((state) => {
        const isInLibrary = state.library.some((item) => item._id === game._id);
        if (!isInLibrary) {
          if (showToast) showToast('Added to wishlist ♥', 'success');
          return { library: [...state.library, game] };
        }
        return state;
      }),
      removeFromLibrary: (gameId, showToast) => set((state) => {
        if (showToast) showToast('Removed from wishlist', 'info');
        return { library: state.library.filter((item) => item._id !== gameId) };
      }),
    }),
    {
      name: 'gamevault-library',
    }
  )
);
