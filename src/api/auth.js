import api from './index';

export const registerUser = async (username, email, password) => {
  const response = await api.post('/auth/register', { username, email, password });
  return response.data;
};

export const loginUser = async (identifier, password) => {
  const response = await api.post('/auth/login', { identifier, password });
  return response.data;
};

export const getMe = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

export const updateMyProfile = async (profile) => {
  const response = await api.patch('/auth/me', profile);
  return response.data;
};

export const changeMyPassword = async (passwords) => {
  const response = await api.put('/auth/me/password', passwords);
  return response.data;
};

export const deleteMyAccount = async (currentPassword) => {
  const response = await api.delete('/auth/me', {
    data: { current_password: currentPassword },
  });
  return response.data;
};
