import api from './axios';

export const getAccessRequests = () =>
  api.get('/access-requests');

export const updateAccessRequest = (id, status) =>
  api.put(`/access-requests/${id}`, { status });

export const deleteAccessRequest = (id) =>
  api.delete(`/access-requests/${id}`);
