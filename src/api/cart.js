import api from './index';
import { mapApiGameToClient } from './games';

export const getCart = async () => {
  const response = await api.get('/cart');
  // API returns list of cart items. Each item is: { id, user_id, game_id, added_at, game }
  return response.data.map((item) => mapApiGameToClient(item.game));
};

export const addToCart = async (gameId) => {
  const response = await api.post(`/cart/${gameId}`);
  return mapApiGameToClient(response.data.game);
};

export const removeFromCart = async (gameId) => {
  const response = await api.delete(`/cart/${gameId}`);
  return response.data;
};
