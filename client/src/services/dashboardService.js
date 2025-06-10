import api from './api';

const DASHBOARD_ENDPOINTS = {
  FULL_DATA : '/fetch/dashboard'
};

export const getFullData = async () => {
  
  const response = await api.get(DASHBOARD_ENDPOINTS.FULL_DATA);
  return response.data;

}

export default {
  getFullData
}
