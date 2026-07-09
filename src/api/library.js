import api from './index';
import { mapApiGameToClient } from './games';

export const getLibrary = async (type = 'all') => {
  const response = await api.get(`/library?type=${type}`);
  return response.data.map((item) => mapApiGameToClient(item.game));
};

export const getWishlist = async () => {
  return getLibrary('wishlist');
};

export const getPurchasedGames = async () => {
  return getLibrary('purchased');
};

export const addToLibrary = async (gameId) => {
  const response = await api.post(`/library/${gameId}`);
  return mapApiGameToClient(response.data.game);
};

export const removeFromLibrary = async (gameId) => {
  const response = await api.delete(`/library/${gameId}`);
  return response.data;
};
