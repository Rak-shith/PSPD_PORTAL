import api from './axios';

export const getContacts = (search = '') =>
  api.get(`/contacts?search=${search}`);
