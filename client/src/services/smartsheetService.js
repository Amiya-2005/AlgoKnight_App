import api from './api';

const SHEET_ENDPOINTS = {
  ALL_TASKS : '/fetch/smartsheet?limit=200'
};

export const getFullSheet = async () => {
  
  const response = await api.get(SHEET_ENDPOINTS.ALL_TASKS);
  return response.data;

}

export default {
  getFullSheet
}
