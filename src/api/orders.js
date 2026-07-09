import api from './index';
import { mapApiGameToClient } from './games';

export const checkout = async () => {
  const response = await api.post('/orders/checkout');
  // API returns list of purchased GameResponse objects. Map them to client structure.
  return response.data.map(mapApiGameToClient);
};
