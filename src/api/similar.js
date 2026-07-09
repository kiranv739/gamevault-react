import api from './index';
import { mapApiGameToClient } from './games';

export const getSimilarGames = async (gameId) => {
  const response = await api.get(`/similar/${gameId}`);
  return response.data.map(mapApiGameToClient);
};

export const generateEmbeddings = async () => {
  const response = await api.post('/similar/generate-embeddings');
  return response.data;
};
