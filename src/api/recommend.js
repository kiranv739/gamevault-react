import api from './index';

export const getRecommendations = async (gameIds) => {
  const response = await api.post('/recommend', { game_ids: gameIds });
  return response.data;
};
