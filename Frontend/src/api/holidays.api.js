import api from './axios';

export const getUnits = () =>
  api.get('/units');

export const getHolidaysByUnit = (unitId) =>
  api.get(`/holidays?unitId=${unitId}`);
