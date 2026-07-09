import { create } from 'zustand';
import { getRecommendations } from '../api/recommend';

export const useRecommendStore = create((set) => ({
  recommendations: [],
  hasFetched: false,
  isLoading: false,
  error: null,
  
  fetchRecommendations: async (gameIds, genres) => {
    set({ isLoading: true, error: null });
    try {
      const data = await getRecommendations(gameIds, genres);
      set({ 
        recommendations: data, 
        hasFetched: true, 
        isLoading: false 
      });
    } catch (err) {
      set({ error: true, isLoading: false, hasFetched: true });
    }
  },
  
  clearRecommendations: () => set({ 
    recommendations: [], 
    hasFetched: false,
    error: null 
  })
}));
