import api from './index';
import { mapApiGameToClient } from './games';

export const getRecommendations = async (gameIds = [], genres = [], limit = 6) => {
  const response = await api.post('/recommend', { 
    game_ids: gameIds,
    genres: genres,
    limit: limit
  });
  
  return response.data.map(item => {
    const mapped = mapApiGameToClient(item);
    if (mapped) {
      mapped.reason = item.reason;
    }
    return mapped;
  }).filter(Boolean);
};
