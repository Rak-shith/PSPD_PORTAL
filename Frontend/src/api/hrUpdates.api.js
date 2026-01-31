import api from './axios';

export const getHRUpdates = () =>
  api.get('/hr-updates');

export const getLatestHRUpdate = () =>
  api.get('/hr-updates/latest');

export const createHRUpdate = (formData) =>
  api.post('/admin/hr-updates', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
