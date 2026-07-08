import api from './index';

export const mapApiGameToClient = (game) => {
  if (!game) return null;
  return {
    _id: game.id,
    title: game.title,
    description: game.description || '',
    category: game.genre || 'Action',
    rating: game.rating || 0,
    discount: game.discount ? game.discount / 100 : 0,
    price: game.price || 0,
    img: game.image_url || '',
    active: true,
  };
};

export const getGames = async (search, genre, page) => {
  const params = {};
  if (search) params.search = search;
  if (genre && genre !== 'All') params.genre = genre;
  if (page) params.page = page;
  
  const response = await api.get('/games', { params });
  return response.data.map(mapApiGameToClient);
};

export const getFeaturedGames = async () => {
  const response = await api.get('/games/featured');
  return response.data.map(mapApiGameToClient);
};

export const getGameById = async (id) => {
  const response = await api.get(`/games/${id}`);
  return mapApiGameToClient(response.data);
};
