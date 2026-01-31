import api from './axios';

export const getSupport = (search = '') =>
  api.get(`/support?search=${search}`);
