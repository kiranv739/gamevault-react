import api from './index';
import { mapApiGameToClient } from './games';

export const getLibrary = async () => {
  const response = await api.get('/library');
  // API returns list of library items. Each item is: { id, user_id, game_id, added_at, game }
  return response.data.map((item) => mapApiGameToClient(item.game));
};

export const addToLibrary = async (gameId) => {
  const response = await api.post(`/library/${gameId}`);
  return mapApiGameToClient(response.data.game);
};

export const removeFromLibrary = async (gameId) => {
  const response = await api.delete(`/library/${gameId}`);
  return response.data;
};
