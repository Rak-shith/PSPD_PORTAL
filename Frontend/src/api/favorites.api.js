import api from './axios';

export const getFavorites = () => api.get('/favorites');

export const addFavorite = (appId) =>
  api.post(`/favorites/${appId}`);

export const removeFavorite = (appId) =>
  api.delete(`/favorites/${appId}`);
